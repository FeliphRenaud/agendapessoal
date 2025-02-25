import { Router } from "express";
import { registerUser } from "../controllers/userController";

const router = Router();

router.post("/register", registerUser);

export default router;
//correção no codigo por erro na importação
//no backend ele nao fazia diferença no front a redundanci quebra o codigo gerando o erro
//:5000/api/users/login:1 failed to load resource: the server responded with a status of 404 (Not Found)
