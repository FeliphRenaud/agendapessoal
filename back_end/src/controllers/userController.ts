import { Request, RequestHandler, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { z } from "zod";

const prisma = new PrismaClient();

const userSchema = z.object({
  name: z.string().min(3, { message: "Onome é obrigatorio" }),
  email: z.string().email({ message: "E-mail invalido" }),
  password: z
    .string()
    .min(6, { message: "Asenha deve conter pelo menos 6 caracteres" }),
});

export const registerUser: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password } = userSchema.parse(req.body);

    //verificaçcao de existencia de usuario
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      res.status(400).json({ message: "Usuario ja cadastrado" });
      return;
    }
    //hash da senha (criptografa a senha antes de amarzenar a senha no banco evitando textos puros no db)
    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashPassword, //aqui é onde associo a senha a criptografia
      },
    });

    const { password: _, ...userWithoutPassword } = newUser;

    res.status(201).json({
      message: "Usuario Criado com sucesso",
      user: userWithoutPassword,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return void res.status(400).json({ errors: error.errors });
    }
    next(error);
  }
};
