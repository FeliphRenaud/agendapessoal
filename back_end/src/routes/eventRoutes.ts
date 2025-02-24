import { Router, Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../config/prismaClient";
import { authMiddleware } from "../middleware/authMiddleware";

//NAO ESQUECER DE HABILITAR A AUTENTICAÇÃO DE ROTAS POSTERIORMENTE

const router = Router();

const eventSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  description: z.string().min(1),
  startTime: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "startTime deve ser uma data válida",
  }),
  endTime: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "endTime deve ser uma data válida",
  }),
});

router.post("/", authMiddleware, async (req: Request, res: Response) => {
  try {
    // validação dos dados de entrada
    const { title, description, startTime, endTime } = eventSchema.parse(
      req.body
    );
    const start = new Date(startTime);
    const end = new Date(endTime);

    if (start >= end) {
      res.status(400).json({
        error:
          "O horario de inicio deve ser anterior ao horaio de termino da atividade",
      });
      return;
    }
    //inserindo o user no req.body
    const userId = req.body.userId;

    //verificador de sobreposição de eventos
    const overlappingEvent = await prisma.event.findFirst({
      where: {
        userId,
        OR: [
          { startTime: { lte: start }, endTime: { gt: start } },
          { startTime: { lt: end }, endTime: { gte: end } },
          { startTime: { gte: start }, endTime: { lte: end } },
        ],
      },
    });

    if (overlappingEvent) {
      res.status(400).json({
        error: "Ja existe um evento marcado para esse periodo de tempo ",
      });
      return;
    }

    //criação de evento utilizando modelo no prisma
    const event = await prisma.event.create({
      data: {
        title,
        description,
        startTime: start,
        endTime: end,
        user: { connect: { id: userId } }, //associa o id a criação do evento
      },
    });

    res.status(201).json(event);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
  /*-------------------------------------------------------------------------------------*/
  /*                            LISTANDO TODOS OS EVENTOS DO USUARIO                     */
  /*------------------------------------------------------------------------------------ */

  router.get("/", authMiddleware, async (req: Request, res: Response) => {
    try {
      const userId = req.body.userId;
      const events = await prisma.event.findMany({
        where: { userId },
        orderBy: { startTime: "asc" },
      });
      res.json(events);
      return;
    } catch (error: any) {
      res.status(400).json({ error: error.message });
      return;
    }
  });

  /*-----------------------------------------------------------------------*/
  /*                      BUSCA DE EVENTOS POR DATA                        */
  /*-----------------------------------------------------------------------*/

  router.get("/serach", authMiddleware, async (req: Request, res: Response) => {
    try {
      const userId = req.body.userId;

      //parametros da query
      const { start, end } = req.query;

      //caso a pesquisa seja feita sem uma data inserida
      const startDate = start
        ? new Date(start as string)
        : new Date("1970-01-01");
      const endDate = end ? new Date(end as string) : new Date("3000-01-01");

      // pesquisa por horario relacionando os horarios de inicio e fim dos compromissos

      const events = await prisma.event.findMany({
        where: {
          userId,
          startTime: { lt: endDate },
          endTime: { gt: startDate },
        },
        orderBy: { startTime: "asc" },
      });

      res.json(events);
      return;
    } catch (error: any) {
      res.status(400).json({ error: error.message });
      return;
    }
  });

  /*-------------------------------------------------------------------------------*/
  /*                 BUSCANDO DETALHES ESPECIFICOS DO EVENTO                       */
  /*-------------------------------------------------------------------------------*/

  router.get("/:id", authMiddleware, async (req: Request, res: Response) => {
    try {
      const userId = req.body.userId;
      const { id } = req.params;

      //buscando evento pelo id e userid

      const event = await prisma.event.findFirst({
        where: {
          id,
          userId,
        },
      });

      if (!event) {
        res.status(404).json({ error: "Evento nao localizado" });
        return;
      }

      res.json(event);
      return;
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  /* -------------------------------------------------------------------------- */
  /*                            EDIÇÃO DE UM EVENTO                             */
  /* -------------------------------------------------------------------------- */

  router.put("/:id", authMiddleware, async (req: Request, res: Response) => {
    try {
      const userId = req.body.userId;
      const { id } = req.params;

      // Valida os dados que podem ser atualizados
      const { title, description, startTime, endTime } = eventSchema.parse(
        req.body
      );

      const start = new Date(startTime);
      const end = new Date(endTime);

      if (start >= end) {
        res.status(400).json({
          error: "O horário de início deve ser anterior ao horário de término.",
        });
        return;
      }

      // Verifica se o evento existe e pertence ao usuario
      const existingEvent = await prisma.event.findFirst({
        where: { id, userId },
      });

      if (!existingEvent) {
        res.status(404).json({
          error: "Evento não encontrado ou não pertence a este usuário.",
        });
        return;
      }

      // Verifica sobreposição (excluindo ele mesmo, se for o caso)
      const overlappingEvent = await prisma.event.findFirst({
        where: {
          userId,
          id: { not: id }, // ignora o próprio evento durante a verificação
          OR: [
            { startTime: { lte: start }, endTime: { gt: start } },
            { startTime: { lt: end }, endTime: { gte: end } },
            { startTime: { gte: start }, endTime: { lte: end } },
          ],
        },
      });

      if (overlappingEvent) {
        res.status(400).json({
          error: "Já existe um evento marcado para esse período de tempo.",
        });
        return;
      }

      // grava a atualização
      const updatedEvent = await prisma.event.update({
        where: { id },
        data: {
          title,
          description,
          startTime: start,
          endTime: end,
        },
      });

      res.json(updatedEvent);
      return;
    } catch (error: any) {
      res.status(400).json({ error: error.message });
      return;
    }
  });

  /* -------------------------------------------------------------------------- */
  /*                          EXCLUSÃO DE EVENTO                                */
  /* -------------------------------------------------------------------------- */

  router.delete("/:id", authMiddleware, async (req: Request, res: Response) => {
    try {
      const userId = req.body.userId;
      const { id } = req.params;

      // Verifica se o evento existe e pertence ao usuario
      const existingEvent = await prisma.event.findFirst({
        where: { id, userId },
      });

      if (!existingEvent) {
        res.status(404).json({
          error: "Evento não encontrado ou não pertence a este usuário.",
        });
        return;
      }

      await prisma.event.delete({
        where: { id },
      });

      res.status(200).json({ message: "Evento excluído com sucesso" });
      return;
    } catch (error: any) {
      res.status(400).json({ error: error.message });
      return;
    }
  });
});

export default router;
