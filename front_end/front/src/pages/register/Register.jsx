import { useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";


function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/users/register", { name, email, password });
      alert(response.data.message);
      navigate("/login");
      
    } catch (error) {
      alert(error.response.data.message || "erro ao cadastrar usuario")
    }
  }

  return (
    
    <div>
      <h1>Cadastro</h1>
      <form onSubmit={handleRegister}>
        <input type="text" placeholder="Nome" value={name} onChange={(e) => setName(e.target.value)} required />
        <input type="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Cadastrar</button>
      </form>
    </div>

  )




}

export default Register