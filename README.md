# Finance Flow API

A production-ready RESTful backend infrastructure designed for high-performance personal finance tracking, featuring automated reporting and an AI-driven voice assistant.

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

Built on the MVC Pattern, the project maintains a strict separation of concerns to ensure scalability and ease of testing:

* **Controllers:** Lean logic handling utilizing express-async-handler.
* **Middlewares:** Centralized authentication, file upload (Multer), and global error handling.
* **Utilities:** Reusable modules for email delivery, token generation, and Excel formatting.
* **Models:** Strongly typed Mongoose schemas with indexing for optimized query performance.

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
* Full CI/CD pipeline integration for automated deployment.

---

Designed and maintained for clean code standards and high maintainability.