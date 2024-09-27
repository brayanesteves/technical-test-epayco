CREATE DATABASE `wallet_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

CREATE TABLE wallets (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Identificador único de la billetera',
    document VARCHAR(255) NOT NULL COMMENT 'Documento de identificación del cliente, debe ser único',
    name VARCHAR(255) NOT NULL COMMENT 'Nombre del cliente',
    email VARCHAR(255) NOT NULL COMMENT 'Correo electrónico del cliente',
    phone VARCHAR(20) NOT NULL COMMENT 'Número de teléfono del cliente',
    balance DECIMAL(10, 2) DEFAULT 0.00 COMMENT 'Saldo actual de la billetera, con valor predeterminado de 0.00'
) ENGINE=InnoDB COMMENT='Tabla que almacena la información de las billeteras de los clientes';