## Description

Simple tax report api

## Environment Variables

```bash
# mysql://USER:PASSWORD@HOST:PORT/DATABASE
DATABASE_URL=mysql://root:password@localhost:3306/tax-report
PORT=3000
JWT_SECRET=jwtsecret
MEDIA_PATH=${HOME}/tax-report-media
EMAIL_USERNAME=john@live.com
EMAIL_PASSWORD=password
EMAIL_RECIPIENTS=[{ "name": "Richard Zhunio", "address": "967968+Zhunio@users.noreply.github.com" }]
```

## Installation

```bash
npm install
```

## Setup Database

```bash
# Start database
docker compose up -d

# Apply Migrations
npx prisma migrate deploy

# Create Migration
npx prisma migrate dev --name {migration_name}

# Stop database
docker compose down -v
```

## Start the app

```bash
# Start app in dev mode
npm run start

# Start app in debug mode
npm run start:debug

# Start app in prod mode
npm run start:prod

# Build the app
npm run build
```

## Test the app

```bash
# Run e2e tests
npm run test

# Run e2e tests in watch mode
npm run test:watch

# e2e e2e tests in debug mode
npm run test:debug

# Run e2e coverage
npm run test:cov
```

## Formatting/Linting

```bash
npm run format
npm run lint
```

## Deployment

```bash
# Install dependencies
npm install

# Build the app
npm run build

# Apply migrations
npx prisma migrate deploy

# Start the app
npm run start:prod
```
