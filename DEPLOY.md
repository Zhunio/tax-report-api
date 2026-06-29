# Deploy to Coolify

1. Create a new **Project** named `tax-report`.
2. Create a new **Resource**.
3. Select **Private Repository (with GitHub App)**.
4. Select the GitHub App: `zhunio-coolify`.
5. Select the repository: `tax-report-api`.
6. Configure the resource:
   * **Branch:** `main`
   * **Build Pack:** `Docker Compose`
   * **Docker Compose Location:** `/docker-compose.yml`
7. Under **General**, configure:
   * **Name:** `tax-report-api`
   * **Domain:** `https://tax-report-api.example.com`
8. Add the environment variables below.
9. Deploy.

## Environment Variables

```text
JWT_SECRET=<generate-a-long-random-secret>

MYSQL_PASSWORD=<strong-password>

EMAIL_USERNAME=
EMAIL_PASSWORD=
EMAIL_RECIPIENTS=
```

