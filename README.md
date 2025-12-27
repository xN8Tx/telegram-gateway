<h1 align="center">Telegram Gateway</h1>
<p align="center">🚀 A dynamic messaging service based on Strapi, Zod schemas, and Telegram Bot API.</p>

## 📖 Content

- [About](#-about)
- [Validation System](#-validation-system)
- [Authentication](#-authentication)
- [Telegram Integration](#-telegram-integration)
- [API Flow](#-api-flow)
- [Server](#-server)
- [TODO](#-todo)

---

## 🤔 About

This project is a backend service designed to send dynamic messages to Telegram users based on predefined templates.

The core idea is simple:

- Templates are stored in **Strapi**
- Each template defines its own **data schema**
- Incoming requests are **authenticated**, **validated**, and **rendered**
- Rendered messages are sent to **Telegram users** via a bot

The project focuses on **flexibility**, **type safety**, and **runtime validation**.

---

## 🧩 Validation System

Validation is fully **dynamic** and based on template configuration.

### ✨ How it works

- Each template has a list of fields
- Each field defines:
  - `name`
  - `type` (`string`, `number`, `stringArray`, `numberArray`)
  - `isRequired`

- At runtime:
  - Fields are converted into a **Zod schema**
  - Schema is stored in memory
  - Incoming payloads are validated using `safeParse`

### 🔒 Strict mode

All payloads are validated using `schema.strict()` to prevent unexpected fields.

If validation fails, the API responds with a detailed, human-readable error.

---

## 🔐 Authentication

Authentication is handled via **application tokens**.

### 🔑 Token flow

- Client sends `app-token` in request headers
- Token is matched against Strapi collection
- Each token is linked to allowed templates
- Template access is resolved automatically

Unauthorized requests are rejected early.

---

## 🤖 Telegram Integration

The project uses the **grammY** library to integrate with Telegram.

### ✨ Bot features

- `/start` – shows welcome message and user ID
- `/id` – displays Telegram user ID

Telegram users are linked to tokens in Strapi, allowing message delivery to multiple recipients at once.

Messages are sent using:

- HTML parse mode
- Parallel delivery (`Promise.allSettled`)

---

## 🔁 API Flow

### 1️⃣ Request

```json
{
  "type": "order_created",
  "data": {
    "orderId": 123,
    "price": 49.99
  }
}
```

### 2️⃣ Middleware chain

- Token middleware:
  - Validates `app-token`
  - Resolves template

- Schema middleware:
  - Validates `data`
  - Stores sanitized payload in `ctx.state`

### 3️⃣ Controller

- Loads template HTML
- Compiles with Handlebars
- Sends message to Telegram users

---

## 🚀 Server

Server is built on **Strapi v5** and extended with custom logic.

### 🦾 Key technologies

- **Strapi**
- **TypeScript**
- **Zod** – runtime validation
- **Handlebars** – template rendering
- **grammY** – Telegram Bot API

### ⚙️ Lifecycle hooks

- Template creation automatically registers schema
- Token creation auto-generates secure tokens

---

## 🗒️ TODO

- [ ] Add unit and integration tests
- [ ] Add request rate limiting
- [ ] Improve error logging

---

<p align="center">✨ Built for flexibility, safety, and scalable message delivery.</p>
