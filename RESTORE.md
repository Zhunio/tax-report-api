# ♻️ Restore

1. 🛑 Stop the application.

   ```bash
   docker compose stop tax-report-api
   ```

2. ☁️ Restore `/opt/tax-report-api` using the `backups` service.

3. 🗄️ Start MySQL.

   ```bash
   docker compose up -d tax-report-mysql
   ```

4. 📦 Restore the database.

   ```bash
   zstd -d /opt/tax-report-api/backups/latest-mariadb_tax_report_tax-report-mysql
   ```

   ```bash
   docker compose exec -T tax-report-mysql \
     sh -c 'mysql -u tax_report -p"$MYSQL_PASSWORD" tax_report' \
     < /opt/tax-report-api/backups/latest-mariadb_tax_report_tax-report-mysql.sql
   ```

5. 🚀 Start the application.

   ```bash
   docker compose up -d tax-report-api
   ```

