CREATE DATABASE IF NOT EXISTS trading_db;

CREATE USER IF NOT EXISTS 'trading_user'@'%' IDENTIFIED BY 'secure_password';

GRANT ALL PRIVILEGES ON trading_db.* TO 'trading_user'@'%';

FLUSH PRIVILEGES;
