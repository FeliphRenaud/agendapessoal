import express from "express";
import cors from "cors";
// Importa as rotas individuais
import eventRoutes from "./routes/eventRoutes";
import userRoutes from "./routes/userRoutes";
import authRoutes from "./routes/authRoutes";

const app = express();

// Middlewares gerais
app.use(cors());
app.use(express.json());

// Rotas agrupadas com prefixo '/api'
app.use("/api/events", eventRoutes);
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

// Rota simples pra teste
app.get("/api", (req, res) => {
  res.send("API funcionando");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
