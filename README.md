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
# Postgres docker image
TRA_POSTGRES_DB="tax-report"
TRA_POSTGRES_USER="postgres"
TRA_POSTGRES_PASSWORD="123"

# Prisma client
TRA_DATABASE_URL="postgresql://postgres:123@localhost:5432/tax-report?schema=public"

# File server
TRA_MEDIA_PATH="/home/tax-report-documents"
```

## Postgres

Start Postgres docker container.

```bash
$ docker-compose up -d
```

## Prisma

Prisma is used for the data model, automated migrations, type safety, and auto completion.

```bash
# Apply migrations to Postgres database
$ npx prisma migrate deploy
```

## Running the app

Once the database is running and migrations have been applied, we can start the app.

```bash
$ npm run start
```

## Test

Once the database is running and migrations have been applied, we can test the app.

```bash
$ npm run test
```

## Reference

```bash
# Start docker container
$ docker-compose up -d
# Stop docker container.
$ docker-compose down

# Install dependencies
$ npm install
# Format code
$ npm run format
# Run lint
$ npm run lint
# Run tests
$ npm run test
$ npm run test -- --watch
# Run unit tests
$ npm run test:unit
$ npm run test:unit -- --watch
# Run integration tests
$ npm run test:int
$ npm run test:int -- --watch
# Run e2e tests
$ npm run test:e2e
$ npm run test:e2e -- --watch

# Create migration only
$ npx prisma migrate dev --create-only --name {{migrationName}}
# Create migration and apply it to Postgres database
$ npx prisma migrate dev --name {{migrationName}}
# Apply migrations to Postgres database
$ npx prisma migrate deploy
# Generate Prisma client
$ npx prisma generate

# Prisma Studio
$ npx prisma studio

# start nest app
$ npx nest start
$ npx nest start --watch
$ npx nest start --debug --watch
# build production app
$ nest build
# run production app
$ node dist/main
```
