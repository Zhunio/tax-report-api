# 🧾 Tax Report API

Simple REST API for managing tax reports, uploaded files, authentication, and email delivery.

## ✨ Features

- 🔑 JWT-based authentication.
- 🧾 Tax report management.
- 📁 File upload and media storage.
- 📧 Email delivery support.
- 🗄️ MySQL with Prisma ORM.
- 🐳 Deploy with Docker Compose or Coolify.
- ⚡ Built with Node.js 22 and NestJS.

## 🚀 Coolify

Deploy this repository as a Docker Compose service.

- 🔐 Repository Type: `Private Repository (with GitHub App)`
- 🐙 GitHub App: `zhunio-coolify`
- 🌿 Branch: `main`
- 🐳 Build Pack: `Docker Compose`
- 🔌 Application Port: `3000`
- 🗄️ Database: `MySQL`
- 📁 Media Path: `/media`
- 🔑 Environment Variables:
  - `JWT_SECRET`
  - `MYSQL_PASSWORD`
  - `EMAIL_USERNAME`
  - `EMAIL_PASSWORD`
  - `EMAIL_RECIPIENTS`

See [DEPLOY.md](DEPLOY.md).

## ♻️ Restore

Restore consists of:

1. 🛑 Stop the application.
2. ☁️ Restore `/opt/tax-report-api`.
3. 🗄️ Start MySQL.
4. 📦 Restore the database.
5. 🚀 Start the application.

See [RESTORE.md](RESTORE.md).

## 💻 Development

```bash
# Install dependencies
npm install

# Start MySQL
docker compose up -d tax-report-mysql

# Apply database migrations
npx prisma migrate deploy

# Start the API
npm run start
```

Other commands:

```bash
docker compose down
docker compose down -v

npm run build
npm test
npm run lint
npm run format
```
