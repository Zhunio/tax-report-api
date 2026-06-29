# 🚀 Deploy to Coolify

1. 📁 Create a new project.
2. ➕ Create a new resource.
3. 🔐 Select `Private Repository (with GitHub App)`.
4. 🐙 Select GitHub App `zhunio-coolify`.
5. 📦 Select the `tax-report-api` repository.
6. ⚙️ Configure:
   * 🌿 Branch: `main`
   * 🐳 Build Pack: `Docker Compose`
   * 📄 Docker Compose Location: `/docker-compose.yml`
7. 🏷️ Set:
   * **Name:** `tax-report-api`
   * **Domain:** `https://tax-report-api.example.com`
8. 💾 Verify the host media directory:
   * `/opt/tax-report-api/media`
9. 🔑 Configure the required environment variables.
10. 🚀 Click **Deploy**.

## 🔑 Environment Variables

```text
JWT_SECRET="Generate a long random secret"

MYSQL_PASSWORD="MySQL application password"

EMAIL_USERNAME="SMTP username"
EMAIL_PASSWORD="SMTP password"
EMAIL_RECIPIENTS='[{ "name": "Recipient Name", "address": "recipient@example.com" }]'
```

