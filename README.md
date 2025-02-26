# **Agenda Pessoal - Backend**

Este projeto é responsável pela **API REST** que gerencia usuários e eventos de uma Agenda Pessoal.  
Ele foi desenvolvido utilizando **TypeScript**, **Express**, **Prisma** e **JWT** para autenticação.

---

## **Índice**

1. [Tecnologias](#tecnologias)
2. [Instalação](#instalacao)
3. [Configuração](#configuracao)
4. [Execução](#execucao)
5. [Rotas Principais](#rotas-principais)
6. [Contribuindo](#contribuindo)

---

## **1. Tecnologias**

- **Node.js** (versão >= 14)
- **TypeScript**
- **Express**
- **Prisma** (conexão com PostgreSQL)
- **bcryptjs** (criptografia de senhas)
- **jsonwebtoken** (autenticação via JWT)
- **Zod** (validação de dados)

---

## **2. Instalação**

# 1. **Clonar o repositório**:

        git clone https://github.com/seu-usuario/seu-repositorio.git

        cd seu-repositorio/back_end

# 2. **Instalar Deendencias**:

        npm install

# 3. **Configuração**:

## 3.1 Variáveis de Ambiente (.env)

Crie um arquivo .env na raiz do projeto com os seguintes valores (exemplo):

    DATABASE_URL="postgresql://usuario:senha@localhost:5432/agenda"
    JWT_SECRET="sua_chave_secreta"
    PORT=5000
    DATABASE_URL: string de conexão para o PostgreSQL
    JWT_SECRET: chave secreta para assinar tokens JWT
    PORT: porta para rodar a API (padrão: 5000)

## 3.2 Configurar Prisma

No arquivo prisma/schema.prisma, ajuste conforme seu banco de dados. Exemplo:

    datasource db {
      provider = "postgresql"
      url      = env("DATABASE_URL")
    }

    generator client {
      provider = "prisma-client-js"
    }

    model User {
      id       String @id @default(uuid())
      name     String
      email    String @unique
      password String
      events   Event[]
    }

    model Event {
      id          String   @id @default(uuid())
      title       String
      description String
      startTime   DateTime
      endTime     DateTime
      userId      String
      user        User     @relation(fields: [userId], references: [id])
    }

## 3.3 Migrar o Banco de Dados

    npx prisma migrate dev --name init
    npx prisma generate

Isso cria/atualiza as tabelas definidas no schema.prisma.

# 4. **Execução**:

Iniciar o servidor em modo desenvolvimento:

    npm run dev

O servidor iniciará em http://localhost:5000 (ou na porta configurada).

## Iniciar em modo de produção (após compilar TypeScript):

    npm run start

# 5. **Rotas Principais**:

### Usuários:

![alt text](image-2.png)

### autenticação:

![alt text](image-1.png)

### Eventos

![alt text](image-3.png)

# 6. **Contribuindo**:

Faça um fork do projeto.

Crie um branch para sua feature (git checkout -b feature/nomeDaFeature).

Commit suas mudanças (git commit -m 'Adicionar nova feature').

Push para o branch (git push origin feature/nomeDaFeature).

Abra uma Pull Request para revisão.
