import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import "./style.css";

function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      // Salva o token no localStorage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      login(response.data.user, response.data.token);

      alert("Login realizado com sucesso!");
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao fazer login");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="card-content">
          <h1>Login</h1>
          {error && <p className="error-text">{error}</p>}

          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button type="submit">Entrar</button>
          </form>


          <p className="register-prompt">
            Ainda não tem uma conta?{" "}
            <span className="register-link" onClick={() => navigate("/register")}>
              Registre-se
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
