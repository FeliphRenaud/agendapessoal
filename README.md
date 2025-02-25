# **Agenda Pessoal - Repositório Principal**

Bem-vindo ao repositório do projeto **Agenda Pessoal**! Este sistema é composto por **duas partes** principais, cada uma em sua própria branch:

- **Branch `backend`**: Contém a API REST (Node.js, Express, Prisma, etc.).
- **Branch `frontend`**: Contém a aplicação web em React (Vite).

Cada branch possui seu próprio **README** com instruções de configuração e execução detalhadas.  
A seguir, um resumo de como rodar o projeto **localmente** com as duas partes funcionando:

---

## **Como Rodar o Backend e Frontend Juntos**

# 1. **Clonar o Repositório**

       git clone https://github.com/seu-usuario/seu-repositorio.git

       cd seu-repositorio

# 2 Executar o Backend (branch backend)

Faça checkout da branch backend:

    git checkout backend

Entre na pasta do backend (se houver uma pasta específica, ex.: back_end):

    cd back_end

Instale as dependências e inicie em modo desenvolvimento:

    npm install
    npm run dev

Por padrão, o backend iniciará em http://localhost:5000.

# 3.Executar o Frontend (branch frontend)

Abra um novo terminal (ou volte para a raiz do repositório) e faça checkout da branch frontend

    git checkout frontend

Entre na pasta do frontend (ex.: front_end)

    cd front_end

Instale as dependências e inicie em modo desenvolvimento

    yarn
    yarn dev

O frontend iniciará em http://localhost:5173 (porta padrão do Vite).

# 4 Acessar a Aplicação:

O backend estará rodando em http://localhost:5000.

O frontend estará rodando em http://localhost:5173.
O frontend consumirá a API fornecida pelo backend.

Observação: Caso seu projeto use nomes de pastas diferentes ou outro fluxo de trabalho, consulte o README em cada branch para instruções detalhadas.
