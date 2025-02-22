import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";

const prisma = new PrismaClient();

const loginSchema = z.object({
  email: z.string().email({ message: "E-mail invalido " }),
  password: z
    .string()
    .min(6, { message: "Asenha deve conter pelo menos 6 caracteres" }),
});

export async function loginUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  //validação do corpo da requisição la no body usando o ZOD
  try {
    const { email, password } = loginSchema.parse(req.body);

    //verificação se existe cadastro no sistema
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(400).json({ message: "Credenciais invalidas" });
      return;
    }

    //vereficador de a senha: verifica se a senha fornecida é igual a que consta no banco
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(400).json({ message: "Credenciais Invalidas" });
      return;
    }

    //gerar token JWTusando chave secreta definida la no .env
    // e definir um tempo de expiração desse token
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || "defaultsecret",
      { expiresIn: "1d" }
    );

    //removedor do campo senha antes do retorno
    const { password: _, ...userWithoutPassword } = user;

    res.status(200).json({
      message: "login realizado com sucesso",
      token,
      user: userWithoutPassword,
    });
    return;
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
      return;
    }
    next(error);
  }
}
