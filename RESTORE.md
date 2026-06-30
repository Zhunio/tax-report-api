# ♻️ Restore

1. 🛑 Stop the application.

   ```bash
   docker compose stop tax-report-api
   ```

2. ☁️ Restore the latest backup.

   ```bash
   restic \
     -r s3:https://s3.zhunio.org/backups/tax-report-api \
     restore latest \
     --target /opt/tax-report-api
   ```

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

