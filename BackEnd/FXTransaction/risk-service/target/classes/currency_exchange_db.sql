-- MySQL dump 10.13  Distrib 8.0.32, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: currency_exchange_db
-- ------------------------------------------------------
-- Server version	8.0.32

/*!40101 SET @OLD_CHARACTER_SET_CLIENT = @@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS = @@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION = @@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE = @@TIME_ZONE */;
/*!40103 SET TIME_ZONE = '+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS = @@UNIQUE_CHECKS, UNIQUE_CHECKS = 0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS = @@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS = 0 */;
/*!40101 SET @OLD_SQL_MODE = @@SQL_MODE, SQL_MODE = 'NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES = @@SQL_NOTES, SQL_NOTES = 0 */;

--
-- Table structure for table `currency_exchange_history`
--
# DROP DATABASE currency_exchange_db;
CREATE DATABASE currency_exchange_db;

USE currency_exchange_db;
CREATE TABLE currency_exchange_realtime
(
    id              VARCHAR(64) PRIMARY KEY,
    base_currency   VARCHAR(10)    NOT NULL,
    target_currency VARCHAR(10)    NOT NULL,
    latest          DECIMAL(19, 6) NOT NULL,
    date            DATETIME       NOT NULL
);


DROP TABLE IF EXISTS `currency_exchange_history`;
/*!40101 SET @saved_cs_client = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `currency_exchange_history`
(
    `exchange_id`     varchar(255)   NOT NULL,
    `base_currency`   varchar(3)     NOT NULL,
    `target_currency` varchar(3)     NOT NULL,
    `exchange_rate`   decimal(20, 8) NOT NULL,
    `high`            decimal(20, 8) NOT NULL,
    `low`             decimal(20, 8) NOT NULL,
    `open`            decimal(20, 8) NOT NULL,
    `close`           decimal(20, 8) NOT NULL,
    `date`            date           NOT NULL,
    `market_buy`      decimal(20,8) NOT NULL ,
    `market_sell`     decimal(20,8) NOT NULL,
    PRIMARY KEY (`exchange_id`),
    KEY `idx_base_target_currency` (`base_currency`, `target_currency`),
    KEY `idx_date` (`date`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
