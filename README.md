# Tax Report API

The Tax Report API uses Nest with Prisma and Postgres database.

## Prerequisites

- Node.js v18
- Docker

## Getting Started

In this guide, you'll learn how to start the Tax Report API.

## Installation

Install dependencies.

```bash
$ npm install
```

## Environment Variables

The following environmental variables are required for the app.

```bash
# .env.dev
# Environment variables for dev environment
TAX_REPORT_USER=root
TAX_REPORT_PASSWORD=123-dev
TAX_REPORT_PORT=3307
TAX_REPORT_DATABASE_NAME=tax-report-dev
TAX_REPORT_DATABASE_URL=mysql://${TAX_REPORT_USER}:${TAX_REPORT_PASSWORD}@localhost:${TAX_REPORT_PORT}/${TAX_REPORT_DATABASE_NAME}

TAX_REPORT_MEDIA_PATH=${HOME}/tax-report-media/dev
```

```bash
# .env.test
# Environment variables for test environment
TAX_REPORT_USER=root
TAX_REPORT_PASSWORD=123-test
TAX_REPORT_PORT=3308
TAX_REPORT_DATABASE_NAME=tax-report-test
TAX_REPORT_DATABASE_URL=mysql://${TAX_REPORT_USER}:${TAX_REPORT_PASSWORD}@localhost:${TAX_REPORT_PORT}/${TAX_REPORT_DATABASE_NAME}

TAX_REPORT_MEDIA_PATH=${HOME}/tax-report-media/test
```

```bash
# Environment variables for dev environment
TAX_REPORT_USER=
TAX_REPORT_PASSWORD=
TAX_REPORT_PORT=3306
TAX_REPORT_DATABASE_NAME=
TAX_REPORT_HOSTNAME=
TAX_REPORT_DATABASE_URL=mysql://${TAX_REPORT_USER}:${TAX_REPORT_PASSWORD}@${TAX_REPORT_HOSTNAME}:${TAX_REPORT_PORT}/${TAX_REPORT_DATABASE_NAME}

TAX_REPORT_MEDIA_PATH=${HOME}/tax-report-media
```

## Database

Spin up dev/test databases

```bash
# Start dev database
$ npm run docker:up:dev
# Start test database
$ npm run docker:up:test
```

Spin down dev/test databases

```bash
# Stop dev database
$ npm run docker:down:dev
# Stop test database
$ npm run docker:down:test
```

Create database migration for dev/test databases

```bash
# Create migration for dev database
$ npm run migration:create:dev
# Create migration for test database
$ npm run migration:create:test
```

Deploy database migrations to dev/test databases

```bash
# Deploy migrations to dev database
$ npm run migration:deploy:dev
# Deploy migrations to test database
$ npm run migration:deploy:test
# Deploy migrations to production database
$ npm run migration:deploy:prod
```

Inspect dev/test database

```bash
# Inspect dev database
$ npm run studio:dev
# Inspect test database
$ npm run studio:test
# Inspect production database
$ npm run studio:prod
```

## Running the app

Once the database is running and migrations have been applied, we can start the app.

```bash
# Start app using dev database
$ npm run start:dev
# Start app using test database
$ npm run start:test
# Start app using production database
$ npm run start:prod
```

## Building the app

```bash
# Build app using dev database
$ npm run build:dev
# Build app using test database
$ npm run build:test
# Build app using production database
$ npm run build:prod
```

## Test

Once the database is running and migrations have been applied, we can test the app.

```bash
# Run unit/integration tests
$ npm run test
# Run unit/integration tests in watch mode
$ npm run test -- --watch

# Run unit tests
$ npm run test:unit
# Run unit tests in watch mode
$ npm run test:unit -- --watch

# Run integration tests
$ npm run test:int
# Run integration tests in watch mode
$ npm run test:int -- --watch

# Run e2e tests
$ npm run test:e2e
# Run e2e tests in watch
$ npm run test:e2e -- --watch

```

## Formatting/Linting

```bash
# Format code
$ npm run format
# Lint code
$ npm run lint
```

## Reference

```bash
# Create migration only
$ npx prisma migrate dev --create-only --name {{migrationName}}
# Create migration and apply it to database
$ npx prisma migrate dev --name {{migrationName}}
# Apply migrations to database
$ npx prisma migrate deploy
# Generate Prisma client
$ npx prisma generate
# Prisma Studio
$ npx prisma studio
```
