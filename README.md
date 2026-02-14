## Description

Simple tax report api

## Installation

```bash
$ npm install
```

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

## Start database

```bash
$ npm run db:start
```

## Stop database

```bash
$ npm run db:stop
```

## Deploy migrations

```bash
$ npx prisma migrate deploy
```

## Create migration

```bash
$ npx prisma migrate dev --name {migration_name}
```

## Prototype migration

```bash
$ npx prisma db push
```

## Access phpMyAdmin

```bash
username=root
password=password
```

## Start the app

```bash
# development
$ npm run start
# watch mode
$ npm run start:dev
# production mode
$ npm run start:prod
```

## Stop the app

```bash
$ npm run delete:prod
```

## Build the app

```bash
$ npm run build
```

## Test

```bash
# unit tests
$ npm run test

# test coverage
$ npm run test:cov
```

## Formatting/Linting

```bash
$ npm run format
$ npm run lint
```
