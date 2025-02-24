import { Router } from "express";
import { registerUser } from "../controllers/userController";
import eventRoutes from "./eventRoutes";

const router = Router();

router.post("/register", registerUser);
router.post("/api", eventRoutes);

export default router;
