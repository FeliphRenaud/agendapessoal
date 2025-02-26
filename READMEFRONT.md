# **Agenda Pessoal - Frontend**

Este projeto é o **frontend** da Agenda Pessoal, desenvolvido em **React** (criado com **Vite**).  
Ele permite que usuários se registrem, façam login, gerenciem eventos e os visualizem em uma lista simples, consumindo a **API REST** do backend correspondente.

---

## **Índice**

1. [Tecnologias](#tecnologias)
2. [Instalação](#instalacao)
3. [Configuração](#configuracao)
4. [Execução](#execucao)
5. [Estrutura de Pastas](#estrutura)
6. [Contribuindo](#contribuindo)

---

## **1. Tecnologias**

- **React** (versão >= 18)
- **JavaScript** (em vez de TypeScript)
- **Vite**
- **React Router Dom** (para navegação SPA)
- **Axios** (consumo da API)
- **Bootstrap** ou outro framework CSS (opcional)

---

# **2. Instalação**

## 1. **Clonar o repositório**:

       git clone https://github.com/seu-usuario/sua-agenda.git

       cd sua-agenda/front_end

## 2. Instalar dependencias (usando o yarn)

    yarn

# 3. Configurações:

## 1 Configurar a URL da API

No arquivo src/services/api.js (ou similar), a baseURL do Axios deve apontar para o endereço do seu backend:

    import axios from "axios";

    const api = axios.create({
      baseURL: "http://localhost:5000/api", // Ajuste conforme necessário
    });

    export default api;

## 2 variaveis do ambiente (opcional)

Se desejar, você pode usar as variáveis .env do Vite
(ex: import.meta.env.VITE_API_URL)
para configurar a baseURL. Mas se não estiver usando, basta definir a URL diretamente no código.

# 4.Execução

## 1 Iniciar o servidor de desenvolvimento:

    yarn dev

## 2 build de produção:

    yarn build

## 3 preview build:

    yarn preview

Roda o servidor local para pré-visualizar o que foi construído na pasta dist.

# 5. Estrutura de Pastas:

    front_end/
    ├── public/             # Arquivos estáticos
    ├── src/
    │   ├── components/     # Componentes reutilizáveis
    │   ├── pages/          # Páginas da aplicação (Login, Register, Dashboard...)
    │   ├── context/        # Context API para autenticação (AuthContext.js)
    │   ├── services/       # Arquivos para consumo de API (api.js)
    │   ├── App.jsx         # Componente principal de rotas
    │   └── main.jsx        # Ponto de entrada da aplicação
    ├── index.html
    ├── package.json
    ├── yarn.lock
    └── vite.config.js

# 6. Contribuição:

Faça um fork do projeto.
Crie um branch para sua feature:

    git checkout -b feature/minhaFeature

Commit suas mudanças:

    git commit -m "Adicionar nova feature"

Push para o branch:

    git push origin feature/minhaFeature

Abra uma Pull Request para revisão.
