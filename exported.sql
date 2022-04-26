-- MySQL dump 10.19  Distrib 10.3.34-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: WEBRTC
-- ------------------------------------------------------
-- Server version	10.3.34-MariaDB-0ubuntu0.20.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Channel`
--

DROP TABLE IF EXISTS `Channel`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Channel` (
  `Id` varchar(255) DEFAULT NULL,
  `RoomId` varchar(255) NOT NULL,
  `AirTime` time DEFAULT NULL,
  `IsActivate` tinyint(1) DEFAULT 1,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`RoomId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Channel`
--

LOCK TABLES `Channel` WRITE;
/*!40000 ALTER TABLE `Channel` DISABLE KEYS */;
INSERT INTO `Channel` VALUES ('2d74bfe3-1edd-4e63-8c6c-5427b2ffd4ca','1b0eb9d4-d14a-47ca-bf59-0293ce037e97',NULL,1,'2022-04-22 05:06:30','2022-04-22 05:06:30',NULL),('8d029a6e-44f9-4e8e-9ab3-18030b8ca6de','22be8cc5-ab5e-4b46-86e7-4e5259272d09',NULL,1,'2022-04-22 05:52:05','2022-04-22 05:52:05',NULL),('cf15396e-a665-4f98-967f-fa0874465173','2bb2a708-52d3-4d70-b22f-cd6fe9edf914',NULL,1,'2022-04-22 04:39:09','2022-04-22 04:39:09',NULL),('63a51c81-cc51-4b6a-b909-b6de0430de16','4a604525-ff08-4c5c-9ccc-aafa6443c51b',NULL,1,'2022-04-22 04:23:59','2022-04-22 04:23:59',NULL),('a6f49795-0c6d-4166-945b-4964d49e0277','4dd2414b-a84c-4a36-b07a-feac89165620',NULL,1,'2022-04-22 06:23:46','2022-04-22 06:23:46',NULL),('9022c54d-0776-42a3-8e03-2e09fb2d421e','56e9e903-6141-4c93-8abb-4bec5434bed5',NULL,1,'2022-04-22 01:19:31','2022-04-22 01:19:31',NULL),('e09e1371-7d55-4882-b90d-2b2cbe860f45','7831583c-7fd7-4d63-87f1-4e984dc378bf',NULL,1,'2022-04-25 05:52:31','2022-04-25 05:52:31',NULL),('8ba3cabb-f00a-4ef9-9580-8c8dbaa82a6d','8f52061a-b4e3-4d71-b2e3-e784d33441e3',NULL,1,'2022-04-24 23:37:49','2022-04-24 23:37:49',NULL),('609358d0-d546-4e48-8cea-9614abc56f2a','aca88d5b-4c91-47de-8af6-12e5238b5a75',NULL,1,'2022-04-22 05:59:31','2022-04-22 05:59:31',NULL),('259dd1b2-42c6-4740-bacf-a647009baa10','cf88d6b4-d80b-4709-979f-75757d36c52f',NULL,1,'2022-04-26 06:39:37','2022-04-26 06:39:37',NULL),('1f4fca06-a099-4634-b8cf-84ea0f092fea','d3d50b59-0494-45ff-92b8-6749e5dffff7',NULL,1,'2022-04-22 04:59:07','2022-04-22 04:59:07',NULL),('0e18b781-6f3e-47b8-b564-cd162dc1d7d9','da3ce51b-7d0d-4735-843a-98db751d5b6f',NULL,1,'2022-04-25 05:32:42','2022-04-25 05:32:42',NULL),('f3350fde-3d29-45d6-8c09-78e786c1079a','daf16b1a-9088-4211-b04b-e6dd18cbc4bf',NULL,1,'2022-04-22 05:56:32','2022-04-22 05:56:32',NULL),('4df1d045-811a-4f9a-8563-c54db8223dbf','e740befa-0a58-49bd-9695-3f30b1d2740b',NULL,1,'2022-04-22 04:03:25','2022-04-22 04:03:25',NULL),('c298fe11-e771-4e01-97eb-e8372afa9b14','f078fd3c-6a88-4b94-85bc-842811b1b0d9',NULL,1,'2022-04-22 05:45:54','2022-04-22 05:45:54',NULL);
/*!40000 ALTER TABLE `Channel` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ChannelChatLog`
--

DROP TABLE IF EXISTS `ChannelChatLog`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ChannelChatLog` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `RoomId` varchar(255) NOT NULL,
  `User` varchar(255) NOT NULL,
  `Text` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `RoomId` (`RoomId`),
  CONSTRAINT `ChannelChatLog_ibfk_1` FOREIGN KEY (`RoomId`) REFERENCES `Channel` (`RoomId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ChannelChatLog`
--

LOCK TABLES `ChannelChatLog` WRITE;
/*!40000 ALTER TABLE `ChannelChatLog` DISABLE KEYS */;
INSERT INTO `ChannelChatLog` VALUES (1,'4dd2414b-a84c-4a36-b07a-feac89165620','9vZInge69_uDBW5MAAAL','가이드 채팅1','2022-04-22 06:24:00','2022-04-22 06:24:00',NULL),(2,'4dd2414b-a84c-4a36-b07a-feac89165620','G1EGseuEnU2VuBzxAAAR','사용자 채팅1','2022-04-22 06:24:25','2022-04-22 06:24:25',NULL),(3,'4dd2414b-a84c-4a36-b07a-feac89165620','9vZInge69_uDBW5MAAAL','가이드 채팅2','2022-04-22 06:24:35','2022-04-22 06:24:35',NULL),(4,'4dd2414b-a84c-4a36-b07a-feac89165620','9vZInge69_uDBW5MAAAL','가이드 채팅3','2022-04-22 06:27:27','2022-04-22 06:27:27',NULL),(5,'4dd2414b-a84c-4a36-b07a-feac89165620','9398rXc1Lmo1DLgrAAAV','새로운 사용자','2022-04-22 06:27:57','2022-04-22 06:27:57',NULL),(6,'4dd2414b-a84c-4a36-b07a-feac89165620','9vZInge69_uDBW5MAAAL','새로운 사용자 어서오세요','2022-04-22 06:28:18','2022-04-22 06:28:18',NULL);
/*!40000 ALTER TABLE `ChannelChatLog` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ChannelConcurrentUserLog`
--

DROP TABLE IF EXISTS `ChannelConcurrentUserLog`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ChannelConcurrentUserLog` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `RoomId` varchar(255) NOT NULL,
  `User` varchar(255) NOT NULL,
  `Status` enum('connected','disconnected') NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `RoomId` (`RoomId`),
  CONSTRAINT `ChannelConcurrentUserLog_ibfk_1` FOREIGN KEY (`RoomId`) REFERENCES `Channel` (`RoomId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ChannelConcurrentUserLog`
--

LOCK TABLES `ChannelConcurrentUserLog` WRITE;
/*!40000 ALTER TABLE `ChannelConcurrentUserLog` DISABLE KEYS */;
/*!40000 ALTER TABLE `ChannelConcurrentUserLog` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ChannelLikeLog`
--

DROP TABLE IF EXISTS `ChannelLikeLog`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ChannelLikeLog` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `RoomId` varchar(255) NOT NULL,
  `User` varchar(255) NOT NULL,
  `Like` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `RoomId` (`RoomId`),
  CONSTRAINT `ChannelLikeLog_ibfk_1` FOREIGN KEY (`RoomId`) REFERENCES `Channel` (`RoomId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ChannelLikeLog`
--

LOCK TABLES `ChannelLikeLog` WRITE;
/*!40000 ALTER TABLE `ChannelLikeLog` DISABLE KEYS */;
/*!40000 ALTER TABLE `ChannelLikeLog` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ChannelProductSetConfig`
--

DROP TABLE IF EXISTS `ChannelProductSetConfig`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ChannelProductSetConfig` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `RoomId` varchar(255) NOT NULL,
  `StorePath` varchar(255) NOT NULL,
  `StoreCategory` varchar(255) NOT NULL,
  `StoreId` int(11) NOT NULL,
  `ProductId` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `RoomId` (`RoomId`),
  CONSTRAINT `ChannelProductSetConfig_ibfk_1` FOREIGN KEY (`RoomId`) REFERENCES `Channel` (`RoomId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ChannelProductSetConfig`
--

LOCK TABLES `ChannelProductSetConfig` WRITE;
/*!40000 ALTER TABLE `ChannelProductSetConfig` DISABLE KEYS */;
INSERT INTO `ChannelProductSetConfig` VALUES (1,'56e9e903-6141-4c93-8abb-4bec5434bed5','아러','ㄹ아ㅣㅓ',2,3,'2022-04-22 01:19:31','2022-04-22 01:19:31',NULL),(2,'e740befa-0a58-49bd-9695-3f30b1d2740b','ㄹ아ㅓ','ㄹ이ㅏㅓ',2,2,'2022-04-22 04:03:25','2022-04-22 04:03:25',NULL),(3,'4a604525-ff08-4c5c-9ccc-aafa6443c51b','ㄹㅇ나ㅣㅓ','ㄹ아ㅣㅓ',2,2,'2022-04-22 04:23:59','2022-04-22 04:23:59',NULL),(4,'2bb2a708-52d3-4d70-b22f-cd6fe9edf914','bfsd','bf',3,4,'2022-04-22 04:39:09','2022-04-22 04:39:09',NULL),(5,'d3d50b59-0494-45ff-92b8-6749e5dffff7','ㄹ아ㅣㅓ','ㄹ아ㅣㅓ',23,3,'2022-04-22 04:59:07','2022-04-22 04:59:07',NULL),(6,'1b0eb9d4-d14a-47ca-bf59-0293ce037e97','dfjk','fldkj',23,42,'2022-04-22 05:06:30','2022-04-22 05:06:30',NULL),(7,'f078fd3c-6a88-4b94-85bc-842811b1b0d9','fe','fes',2,3,'2022-04-22 05:45:54','2022-04-22 05:45:54',NULL),(8,'22be8cc5-ab5e-4b46-86e7-4e5259272d09','아ㅣ너','ㄹ아ㅣㅓㅂ',2,3,'2022-04-22 05:52:05','2022-04-22 05:52:05',NULL),(9,'daf16b1a-9088-4211-b04b-e6dd18cbc4bf','ㄹ이ㅏㅓ','이ㅏㅓ',12,4,'2022-04-22 05:56:32','2022-04-22 05:56:32',NULL),(10,'aca88d5b-4c91-47de-8af6-12e5238b5a75','리ㅏ어','ㅇ라ㅣㅓ',2,3,'2022-04-22 05:59:31','2022-04-22 05:59:31',NULL),(11,'4dd2414b-a84c-4a36-b07a-feac89165620','test','tes',2,3,'2022-04-22 06:23:46','2022-04-22 06:23:46',NULL),(12,'8f52061a-b4e3-4d71-b2e3-e784d33441e3','그러나 ㄹ','ㅇㄹㅅ',2,5,'2022-04-24 23:37:49','2022-04-24 23:37:49',NULL),(13,'da3ce51b-7d0d-4735-843a-98db751d5b6f','ㅎㄷㅂㅈ','ㄹㅇㄴㅁ',2,3,'2022-04-25 05:32:42','2022-04-25 05:32:42',NULL),(14,'7831583c-7fd7-4d63-87f1-4e984dc378bf','grw','grad1',1,2,'2022-04-25 05:52:31','2022-04-25 05:52:31',NULL);
/*!40000 ALTER TABLE `ChannelProductSetConfig` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ChannelRecordManagementConfig`
--

DROP TABLE IF EXISTS `ChannelRecordManagementConfig`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ChannelRecordManagementConfig` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `RoomId` varchar(255) NOT NULL,
  `Media` varchar(255) NOT NULL,
  `FileSize` varchar(255) NOT NULL,
  `Thumbnail` varchar(255) NOT NULL,
  `Title` varchar(255) NOT NULL,
  `Host` varchar(255) NOT NULL,
  `RoomCategory` varchar(255) NOT NULL,
  `IsActivate` tinyint(1) NOT NULL DEFAULT 0,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `RoomId` (`RoomId`),
  CONSTRAINT `ChannelRecordManagementConfig_ibfk_1` FOREIGN KEY (`RoomId`) REFERENCES `Channel` (`RoomId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ChannelRecordManagementConfig`
--

LOCK TABLES `ChannelRecordManagementConfig` WRITE;
/*!40000 ALTER TABLE `ChannelRecordManagementConfig` DISABLE KEYS */;
/*!40000 ALTER TABLE `ChannelRecordManagementConfig` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ChannelSetConfig`
--

DROP TABLE IF EXISTS `ChannelSetConfig`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ChannelSetConfig` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `RoomId` varchar(255) NOT NULL,
  `Title` varchar(255) NOT NULL,
  `Host` varchar(255) NOT NULL,
  `Thumbnail` varchar(255) NOT NULL,
  `RoomCategory` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `RoomId` (`RoomId`),
  CONSTRAINT `ChannelSetConfig_ibfk_1` FOREIGN KEY (`RoomId`) REFERENCES `Channel` (`RoomId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ChannelSetConfig`
--

LOCK TABLES `ChannelSetConfig` WRITE;
/*!40000 ALTER TABLE `ChannelSetConfig` DISABLE KEYS */;
INSERT INTO `ChannelSetConfig` VALUES (1,'56e9e903-6141-4c93-8abb-4bec5434bed5','라이브 방송','가이드','thumbnail_1650590371417.png','카테고리','2022-04-22 01:19:31','2022-04-22 01:19:31',NULL),(2,'e740befa-0a58-49bd-9695-3f30b1d2740b','라이브 방송2','가이드2','thumbnail_1650600205655.png','리빙','2022-04-22 04:03:25','2022-04-22 04:03:25',NULL),(3,'4a604525-ff08-4c5c-9ccc-aafa6443c51b','라이브 방송3','ㄹㅇ마ㅓ','thumbnail_1650601439530.png','ㄹ다ㅣㅓ','2022-04-22 04:23:59','2022-04-22 04:23:59',NULL),(4,'2bb2a708-52d3-4d70-b22f-cd6fe9edf914','gd','gd','thumbnail_1650602349892.png','bds','2022-04-22 04:39:09','2022-04-22 04:39:09',NULL),(5,'d3d50b59-0494-45ff-92b8-6749e5dffff7','라이브 방송4','가이드 4','thumbnail_1650603547092.png','ㄹ아ㅣㅓ','2022-04-22 04:59:07','2022-04-22 04:59:07',NULL),(6,'1b0eb9d4-d14a-47ca-bf59-0293ce037e97','dkj','fkldj','thumbnail_1650603990049.png','fdklj','2022-04-22 05:06:30','2022-04-22 05:06:30',NULL),(7,'f078fd3c-6a88-4b94-85bc-842811b1b0d9','gew','gw','thumbnail_1650606354927.png','fe','2022-04-22 05:45:54','2022-04-22 05:45:54',NULL),(8,'22be8cc5-ab5e-4b46-86e7-4e5259272d09','라이브 방송5','가이드 5','thumbnail_1650606725771.png','아ㅣㅓㄹ','2022-04-22 05:52:05','2022-04-22 05:52:05',NULL),(9,'daf16b1a-9088-4211-b04b-e6dd18cbc4bf','라이브 방송6','가이드 6','thumbnail_1650606992767.png','아ㅣㅓ','2022-04-22 05:56:32','2022-04-22 05:56:32',NULL),(10,'aca88d5b-4c91-47de-8af6-12e5238b5a75','라이브 방송 7','가이드 7','thumbnail_1650607171250.png','ㄹ아ㅣㅓ','2022-04-22 05:59:31','2022-04-22 05:59:31',NULL),(11,'4dd2414b-a84c-4a36-b07a-feac89165620','라이브 방송8','가이드 8','thumbnail_1650608626513.png','리빙','2022-04-22 06:23:46','2022-04-22 06:23:46',NULL),(12,'8f52061a-b4e3-4d71-b2e3-e784d33441e3','ㅅㄹㄹ','그러나 걍ㄱ','thumbnail_1650843469643.jpeg','ㅇㅇ','2022-04-24 23:37:49','2022-04-24 23:37:49',NULL),(13,'da3ce51b-7d0d-4735-843a-98db751d5b6f','ㅎㅂㄷㅈㄹ','ㄹㄷㅈㅇ','thumbnail_1650864762768.png','ㄹㄷㅈㅂ','2022-04-25 05:32:42','2022-04-25 05:32:42',NULL),(14,'7831583c-7fd7-4d63-87f1-4e984dc378bf','grad','grqw','thumbnail_1650865951170.png','grw','2022-04-25 05:52:31','2022-04-25 05:52:31',NULL),(15,'cf88d6b4-d80b-4709-979f-75757d36c52f','dfas','gdas','thumbnail_1650955177025.png','ads','2022-04-26 06:39:37','2022-04-26 06:39:37',NULL);
/*!40000 ALTER TABLE `ChannelSetConfig` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `StoreBrand`
--

DROP TABLE IF EXISTS `StoreBrand`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `StoreBrand` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Name` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `StoreBrand`
--

LOCK TABLES `StoreBrand` WRITE;
/*!40000 ALTER TABLE `StoreBrand` DISABLE KEYS */;
INSERT INTO `StoreBrand` VALUES (1,'라피안타','2022-04-26 15:38:32','2022-04-26 15:38:33',NULL),(2,'오스템파마','2022-04-26 15:40:32','2022-04-26 15:40:33',NULL);
/*!40000 ALTER TABLE `StoreBrand` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `StoreProductCategory`
--

DROP TABLE IF EXISTS `StoreProductCategory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `StoreProductCategory` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Type` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `StoreProductCategory`
--

LOCK TABLES `StoreProductCategory` WRITE;
/*!40000 ALTER TABLE `StoreProductCategory` DISABLE KEYS */;
INSERT INTO `StoreProductCategory` VALUES (1,'화장품','2022-04-26 15:40:32','2022-04-26 15:40:33',NULL),(2,'식품','2022-04-26 15:41:32','2022-04-26 15:41:33',NULL),(3,'의류','2022-04-26 15:42:32','2022-04-26 15:42:33',NULL),(4,'가전','2022-04-26 15:43:32','2022-04-26 15:43:33',NULL);
/*!40000 ALTER TABLE `StoreProductCategory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `StoreProductDetail`
--

DROP TABLE IF EXISTS `StoreProductDetail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `StoreProductDetail` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Name` varchar(255) NOT NULL,
  `Price` varchar(255) NOT NULL,
  `StoreBrandId` int(11) NOT NULL,
  `Stock` int(11) NOT NULL,
  `Image` varchar(255) NOT NULL,
  `Description` varchar(255) NOT NULL,
  `CategoryId` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `StoreBrandId` (`StoreBrandId`),
  KEY `CategoryId` (`CategoryId`),
  CONSTRAINT `StoreProductDetail_ibfk_1` FOREIGN KEY (`StoreBrandId`) REFERENCES `StoreBrand` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `StoreProductDetail_ibfk_2` FOREIGN KEY (`CategoryId`) REFERENCES `StoreProductCategory` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `StoreProductDetail`
--

LOCK TABLES `StoreProductDetail` WRITE;
/*!40000 ALTER TABLE `StoreProductDetail` DISABLE KEYS */;
INSERT INTO `StoreProductDetail` VALUES (1,'화장품1','1000',1,150,'화장품1.png','더미 화장품 데이터',1,'2022-04-26 15:40:32','2022-04-26 15:40:33',NULL),(2,'화장품2','2000',1,200,'화장품2.png','더미 화장품 데이터',1,'2022-04-26 15:45:32','2022-04-26 15:45:33',NULL),(3,'치약1','3000',2,250,'치약1.png','더미 치약  데이터',1,'2022-04-26 15:50:32','2022-04-26 15:50:33',NULL),(4,'치약2','4000',2,250,'치약2.png','더미 치약  데이터',1,'2022-04-26 15:51:32','2022-04-26 15:52:33',NULL),(5,'전동칫솔1','5000',2,250,'전동칫솔1.png','더미 칫솔  데이터',4,'2022-04-26 15:52:32','2022-04-26 15:52:33',NULL);
/*!40000 ALTER TABLE `StoreProductDetail` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-04-26  7:56:46
