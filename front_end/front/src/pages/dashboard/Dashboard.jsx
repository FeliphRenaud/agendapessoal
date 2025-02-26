import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import "./style.css"; 

function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startTime: "",
    endTime: "",
  });

  // Se for diferente de null, estamos editando este evento
  const [editingEventId, setEditingEventId] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    // Busca os eventos do usuário
    async function fetchEvents() {
      try {
        const token = localStorage.getItem("token");
        const response = await api.get("/events", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEvents(response.data);
      } catch (error) {
        console.error("Erro ao buscar eventos", error);
      }
    }

    fetchEvents();
  }, [user, navigate]);

  /* Criação ou Edição de um evento */
  async function handleSubmit(e) {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      if (editingEventId) {
        // EDIÇÃO
        const response = await api.put(`/events/${editingEventId}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEvents((prev) =>
          prev.map((evt) => (evt.id === editingEventId ? response.data : evt))
        );
        setEditingEventId(null);
      } else {
        // CRIAÇÃO
        const response = await api.post("/events", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEvents((prev) => [...prev, response.data]);
      }

      // Reseta o formulário
      setFormData({
        title: "",
        description: "",
        startTime: "",
        endTime: "",
      });
    } catch (error) {
      const errMsg =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Erro ao salvar evento.";
      alert(errMsg);
    }
  }

  /* Deleta um evento */
  async function handleDelete(id) {
    try {
      const token = localStorage.getItem("token");
      await api.delete(`/events/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Remove do estado local
      setEvents((prev) => prev.filter((evt) => evt.id !== id));
    } catch (error) {
      alert(error, "Erro ao excluir evento.");
    }
  }

  /* Preenche o formulário para editar */
  function startEditing(event) {
    setEditingEventId(event.id);
    setFormData({
      title: event.title || "",
      description: event.description || "",
      startTime: event.startTime?.slice(0, 16) || "",
      endTime: event.endTime?.slice(0, 16) || "",
    });
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <div className="card-content">
          <div className="card-header">
            <h1>Ola, {user?.name}!</h1>
            <button className="logout-btn" onClick={logout}>
              Sair
            </button>
          </div>


          <div className="content-center">
            <hr />
            <h2>{editingEventId ? "Editar Evento" : "Adicionar Novo Evento"}</h2>
            <form onSubmit={handleSubmit}>
              <label>Título</label>
              <input
                type="text"
                placeholder="Título do evento"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />

              <label>Descrição</label>
              <input
                type="text"
                placeholder="Descrição do evento"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                required
              />

              <label>Hora de Início</label>
              <input
                type="datetime-local"
                value={formData.startTime}
                onChange={(e) =>
                  setFormData({ ...formData, startTime: e.target.value })
                }
                required
              />

              <label>Hora de Término</label>
              <input
                type="datetime-local"
                value={formData.endTime}
                onChange={(e) =>
                  setFormData({ ...formData, endTime: e.target.value })
                }
                required
              />

              <button type="submit">
                {editingEventId ? "Salvar Alterações" : "Criar Evento"}
              </button>
            </form>

            <hr />

            <h2>Seus Eventos</h2>
            {events.length === 0 ? (
              <p>Você não possui nenhum evento agendado.</p>
            ) : (
              <ul className="events-list">
                {events.map((evt) => (
                  <li key={evt.id} className="event-item">
                    <strong>{evt.title}</strong> - {evt.description}
                    <br />
                    {new Date(evt.startTime).toLocaleString()} até{" "}
                    {new Date(evt.endTime).toLocaleString()}
                    <br />
                    <button onClick={() => startEditing(evt)}>Editar</button>
                    <button onClick={() => handleDelete(evt.id)}>Excluir</button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
