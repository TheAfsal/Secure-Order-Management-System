CREATE DATABASE trading_db;
USE trading_db;

CREATE TABLE pending_orders (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  type ENUM('buy', 'sell') NOT NULL,
  quantity DECIMAL(10,2) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  status ENUM('pending', 'completed') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE completed_orders (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  quantity DECIMAL(10,2) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE USER 'trading_user'@'localhost' IDENTIFIED BY 'secure_password';
GRANT ALL PRIVILEGES ON trading_db.* TO 'trading_user'@'localhost';