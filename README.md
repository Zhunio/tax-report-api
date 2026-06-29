# 🧾 Tax Report API

Simple REST API for managing tax reports, uploaded files, authentication, and email delivery.

## ✨ Features

* 🔑 JWT-based authentication.
* 🧾 Tax report management.
* 📁 File upload and media storage.
* 📧 Email delivery support.
* 🗄️ MySQL database with Prisma ORM.
* 🔄 Prisma migration support.
* 🐳 Deploy with Docker Compose or Coolify.
* ⚡ Built with Node.js 22 and NestJS.

## 🚀 Coolify

Deploy this repository as a Docker Compose service.

* 🔐 Repository Type: `Private Repository (with GitHub App)`
* 🐙 GitHub App: `zhunio-coolify`
* 🌿 Branch: `main`
* 🐳 Build Pack: `Docker Compose`
* 🔌 Application Port: `3000`
* 🗄️ Database: `MySQL`
* 📁 Media Path: `/media`
* 🔑 Environment variables:

  * `JWT_SECRET`
  * `MYSQL_PASSWORD`
  * `EMAIL_USERNAME`
  * `EMAIL_PASSWORD`
  * `EMAIL_RECIPIENTS`

## 📚 API Documentation

Swagger documentation is available at:

```text
https://<your-domain>/docs
```

## 💾 Database

Application data is stored in MySQL using Prisma ORM.

* 🗄️ Database: MySQL 8
* 🔄 ORM: Prisma
* 📦 Migration Tool: Prisma Migrate
* 🧑 Database User: `tax_report`
* 🗃️ Database Name: `tax_report`

Apply existing migrations:

```bash
npx prisma migrate deploy
```

Create a new migration after modifying the Prisma schema:

```bash
npx prisma migrate dev --name <migration_name>
```

## 📁 Media Storage

Uploaded media is stored outside the container on the host.

Host path:

```text
/opt/tax-report-api/media
```

Container path:

```text
/media
```

The app reads this location from:

```text
MEDIA_PATH=/media
```

## 🌱 Environment Variables

For Coolify, configure:

```bash
JWT_SECRET=<generate-a-long-random-secret>

MYSQL_PASSWORD=<strong-password>

EMAIL_USERNAME=john@live.com
EMAIL_PASSWORD=<email-password>
EMAIL_RECIPIENTS=[{ "name": "Richard Zhunio", "address": "967968+Zhunio@users.noreply.github.com" }]
```

The following values are hardcoded in `docker-compose.yml`:

```bash
NODE_ENV=production
PORT=3000
DATABASE_URL=mysql://tax_report:${MYSQL_PASSWORD}@tax-report-mysql:3306/tax_report
MEDIA_PATH=/media
```

## 💻 Local Development

Start a local development environment.

```bash
# Install dependencies
npm install

# Start MySQL
docker compose up -d tax-report-mysql

# Apply migrations
npx prisma migrate deploy

# Start development server
npm run start
```

### Useful Commands

```bash
# Development
npm run start
npm run start:debug

# Production
npm run build
npm run start:prod

# Testing
npm run test
npm run test:watch
npm run test:debug
npm run test:cov

# Formatting and linting
npm run format
npm run lint
```

To remove the local database and volumes:

```bash
docker compose down -v
```

## 🐳 Docker Compose

Start the full stack:

```bash
docker compose up -d
```

View logs:

```bash
docker compose logs -f tax-report-api
```

Stop the stack:

```bash
docker compose down
```

Stop the stack and remove volumes:

```bash
docker compose down -v
```

