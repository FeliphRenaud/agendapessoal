import { Router } from "express";
import userRoutes from "./userRoutes";
import authRoutes from "./authRoutes";

const router = Router();

// /api/users/*
router.use("/users", userRoutes);

// /api/auth/*
router.use("/auth", authRoutes);

router.get("/", (req, res) => {
  res.send("API funcionando");
});

export default router;
