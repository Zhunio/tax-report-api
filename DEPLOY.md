# Deploy To Coolify

1. Create new `Project`: `tax-report`
2. Create new `Resource`
3. Select `Private Repository (with GitHub App)`
4. Select GitHub App: `zhunio-coolify`
5. Select repo: `tax-report-api`
6. Set the `Configuration`:
  - Branch: `main`
  - Build Pack: `Docker Compose`
  - Docker Compose Location: `/docker-compose.yml`
7. In `General`, Set:
  - `Name`: `tax-report-api`
  - `Domain`: `https://tax-report-api.example.com`
8. Set `Environment Variables`
9. Deploy

## Environment Variables

```text
DATABASE_URL=mysql://root:password@localhost:3306/tax-report
PORT=3000
JWT_SECRET=jwtsecret
MEDIA_PATH=${HOME}/tax-report-media
EMAIL_USERNAME=john@live.com
EMAIL_PASSWORD=password
EMAIL_RECIPIENTS=[{ "name": "Richard Zhunio", "address": "967968+Zhunio@users.noreply.github.com" }]
```

