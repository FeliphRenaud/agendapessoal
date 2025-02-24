import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface DecodedToken {
  userId: string;
}

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  //fiscaliza se o header "euthorization" foi enviado
  if (!authHeader) {
    res.status(401).json({ message: "Token não Fornecido" });
    return;
  }

  //verifica se o formato: "Bearer <Token> é true"
  const [, token] = authHeader.split(" ");

  try {
    //verifica e decodifica o token JWT
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "defaultsecret"
    ) as DecodedToken;

    //para futuramente associar o userId a requisição
    req.body.userId = decoded.userId;
    //se o token for valido ele segue para a proxima função
    next();
  } catch (error) {
    //caso o token seja invalido
    res.status(401).json({ message: "Token invalido ou expirado" });
    return;
  }
}
