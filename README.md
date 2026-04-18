# Finance Flow API

A production-ready RESTful backend infrastructure designed for high-performance personal finance tracking, featuring automated reporting and an AI-driven voice assistant.

Deployment Link: https://sondosmm.github.io/Finances-Flow/#

---

## Core Infrastructure

* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** MongoDB via Mongoose ODM
* **Intelligence:** Groq SDK (Llama 3.1 & Whisper)
* **Security:** JWT, BcryptJS, Helmet, Express-Rate-Limit
* **Automation:** Node-cron & Nodemailer
* **Data Processing:** ExcelJS & MongoDB Aggregation Pipelines

---
## Getting Started

```bash
cd backend
npm install
npm run dev
```

Create a `config.env` file with:

PORT=5000
DB_URI=
JWT_ACCESS_SECRET=
EMAIL_USER=
EMAIL_PASSWORD=
GROQ_API_KEY=

Or run with Docker:

```bash
cd backend
docker-compose up
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Create a `.env` file inside the `frontend/` folder with:

VITE_API_URL=http://localhost:5000/api/v1

## Technical Features

### AI Assistant & Voice Integration
* **Natural Language Processing:** Intent parsing via Groq Llama 3.1 to convert text into structured financial data.
* **Speech-to-Text:** Whisper-large-v3 integration for processing voice-recorded expenses.
* **Context-Aware Replies:** Friendly, data-driven financial advice based on user spending history.

### Automated Reporting System
* **Aggregated Insights:** Complex MongoDB pipelines for monthly and yearly financial summaries.
* **Excel Engine:** Dynamic generation of formatted spreadsheets containing category breakdowns.
* **Cron Scheduler:** Automated monthly report generation delivered directly to user emails.

### Security & Validation
* **Authentication:** Secure JWT-based auth flow using HTTP-only cookies to prevent XSS.
* **Integrity:** Strict request validation using Joi schemas and middleware.
* **Sanitization:** Protection against NoSQL injection and brute-force attacks via rate limiting and mongo-sanitize.

---

## Architecture Overview

Built on the MVC Pattern with strict separation of concerns:

* **Controllers:** Request handling and business logic using express-async-handler.
* **Routes:** Modular route definitions with validation middleware applied per endpoint.
* **Middlewares:** Centralized JWT authentication, Multer file upload handling, Joi validation, and global error handling.
* **Models:** Strongly typed Mongoose schemas with compound indexing for optimized query performance.
* **Utils:** Reusable modules for email delivery, token generation, Excel generation, report aggregation, and AI intent parsing.
* **Jobs:** Node-cron scheduler running on the first of every month to generate and email reports automatically.
* **CI/CD:** Automated frontend deployment via GitHub Actions to GitHub Pages on every push to main.
* **Docker:** Containerized backend with Dockerfile and docker-compose for consistent local and production environments.

---

## API Endpoints

### Auth & User
* **POST** `/api/v1/auth/register` - New user onboarding.
* **POST** `/api/v1/auth/login` - Secure session initialization.
* **GET** `/api/v1/user/me` - Profile and budget retrieval.

### Finance Management
* **POST** `/api/v1/expense/create` - Log new transactions.
* **GET** `/api/v1/expense/getExpenses` - Filtered history with pagination support.
* **GET** `/api/v1/report/export/excel` - Generate and download financial statements.

### AI Interface
* **POST** `/api/v1/assistant/chat` - Text-based financial queries.
* **POST** `/api/v1/assistant/voice` - Process audio-based expense logging.

---

## Working On

* Implementation of Swagger/OpenAPI documentation.
* Redis integration for caching frequent report queries.

---

Designed and maintained for clean code standards and high maintainability.