# 💳 Pay System Pagamentos API
![nestjs](https://img.shields.io/badge/nestjs-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![postgresql](https://img.shields.io/badge/postgresql-4169e1?style=for-the-badge&logo=postgresql&logoColor=white)
![Version](https://img.shields.io/badge/V0.1-100000?style=for-the-badge&logo=github&logoColor=white)

API RESTful desenvolvida em **NestJS** para o ecossistema **Pay System Pagamentos**, responsável por cadastro de clientes, criação de cobranças (Pix, Boleto e Cartão) e registro de logs de auditoria em banco separado.

A aplicação foi projetada para rodar em ambiente **Docker Compose**, com **PostgreSQL** como base principal e **MariaDB** dedicado às auditorias do sistema.

---

## 🚀 Tecnologias

| Categoria | Tecnologia |
|------------|-------------|
| **Linguagem / Framework** | [NestJS](https://nestjs.com/) + TypeScript |
| **ORM** | [Prisma ORM](https://www.prisma.io/) |
| **Banco de Dados Principal** | PostgreSQL |
| **Banco de Logs / Auditoria** | MariaDB |
| **Autenticação** | JWT (JSON Web Token) |
| **Documentação** | Swagger (OpenAPI 3.0) |
| **Testes** | Jest |
| **Containerização** | Docker & Docker Compose |

---

## 🧱 Estrutura do Projeto
src/

├── common/                # Filtros, DTOs, guards e interceptors globais

├── modules/

│   ├── auth/              # Autenticação, registro e JWT

│   ├── customer/          # CRUD de clientes

│   ├── charge/            # Operações de cobranças

│   ├── audit/             # Logs de auditoria (MariaDB)

│   ├── prisma/            # Serviços Prisma (Postgres + MariaDB)

│   └── ...

├── main.ts                # Bootstrap principal

└── app.module.ts          # Módulo raiz do sistema


## 📦 Pré-requisitos

Antes de rodar o projeto, você precisa ter instalado:

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

## ⚙️ Configuração do ambiente

1. Crie um arquivo `.env` na raiz do projeto com as variáveis de ambiente:

```markdown
PORT=8080
JWT_SECRET=colmeia_secret
JWT_EXPIRES_IN=1d

# Banco de Dados (PostgreSQL)
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=paysystem
DB_PASSWORD=123@paysystem
DB_DATABASE=colmeia_payment

# MongoDB
MARIADB_HOST=localhost
MARIADB_PORT=3306
MARIADB_USER=paysystem
MARIADB_PASS=123@paysystem
MARIADB_DATABASE=colmeia_payment_logs
MARIADB_ROOT_PASSWORD=root

# Prisma DB
DATABASE_URL="postgresql://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_DATABASE}?schema=public"
AUDIT_DATABASE_URL="mysql://root:${MARIADB_ROOT_PASSWORD}@${MARIADB_HOST}:${MARIADB_PORT}/${MARIADB_DATABASE}"

```

## 🐳 Rodando com Docker

Para iniciar toda a stack (API + bancos de dados):

```markdown
docker compose up --build
```

A API será iniciada em:

> 📍 http://localhost:8080

E os bancos estarão disponíveis em:

- PostgreSQL → `localhost:5432`
- MariaDB → `localhost:3306`

Após rodar o projeto, a documentação Swagger estará disponível em:

> 🧭 [http://localhost:8080/api](http://localhost:8080/api/doc#/)


## 💻 Frontend (opcional)

Se desejar testar o front-end integrado à API, você pode acessar o repositório do front-end aqui:

> 🔗 [Repositório Frontend](https://github.com/AndersonAlvesCoelho/paysystem-payment)

Siga as instruções no README do front-end para rodar o projeto