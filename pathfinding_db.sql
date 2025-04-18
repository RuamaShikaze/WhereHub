/*
 Navicat Premium Dump SQL

 Source Server         : GraphDB
 Source Server Type    : MySQL
 Source Server Version : 90200 (9.2.0)
 Source Host           : localhost:3306
 Source Schema         : pathfinding_db

 Target Server Type    : MySQL
 Target Server Version : 90200 (9.2.0)
 File Encoding         : 65001

 Date: 18/04/2025 11:18:21
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for adjacency_matrix
-- ----------------------------
DROP TABLE IF EXISTS `adjacency_matrix`;
CREATE TABLE `adjacency_matrix`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `floor_id` int NOT NULL,
  `from_node` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `to_node` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `weight` int NOT NULL,
  `path_type` enum('walk','stair','elevator','corner') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `floor_id`(`floor_id` ASC) USING BTREE,
  CONSTRAINT `adjacency_matrix_ibfk_1` FOREIGN KEY (`floor_id`) REFERENCES `floors` (`floor_id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of adjacency_matrix
-- ----------------------------

-- ----------------------------
-- Table structure for floors
-- ----------------------------
DROP TABLE IF EXISTS `floors`;
CREATE TABLE `floors`  (
  `floor_id` int NOT NULL AUTO_INCREMENT,
  `floor_name` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `map_image` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`floor_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of floors
-- ----------------------------
INSERT INTO `floors` VALUES (1, 'F1-大厅', 'f1.png');
INSERT INTO `floors` VALUES (2, 'F2-办公区', 'f2.png');
INSERT INTO `floors` VALUES (3, 'F3-功能区', 'f3.png');

-- ----------------------------
-- Table structure for graphs
-- ----------------------------
DROP TABLE IF EXISTS `graphs`;
CREATE TABLE `graphs`  (
  `graph_id` int NOT NULL AUTO_INCREMENT,
  `graph_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`graph_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of graphs
-- ----------------------------
INSERT INTO `graphs` VALUES (1, 'test1', '2025-03-28 10:44:30');

-- ----------------------------
-- Table structure for node_coordinates
-- ----------------------------
DROP TABLE IF EXISTS `node_coordinates`;
CREATE TABLE `node_coordinates`  (
  `height` decimal(10, 2) NOT NULL,
  `graph_id` int NOT NULL,
  `node_name` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `latitude` decimal(10, 6) NOT NULL,
  `longitude` decimal(10, 6) NOT NULL,
  PRIMARY KEY (`graph_id`, `node_name`) USING BTREE,
  CONSTRAINT `node_coordinates_ibfk_1` FOREIGN KEY (`graph_id`) REFERENCES `graphs` (`graph_id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of node_coordinates
-- ----------------------------
INSERT INTO `node_coordinates` VALUES (1.00, 1, 'A', 0.000000, 0.000000);
INSERT INTO `node_coordinates` VALUES (1.00, 1, 'B', 10.000000, 0.000000);
INSERT INTO `node_coordinates` VALUES (1.00, 1, 'C', 60.000000, 0.000000);
INSERT INTO `node_coordinates` VALUES (1.00, 1, 'D', 60.000000, 40.000000);
INSERT INTO `node_coordinates` VALUES (1.00, 1, 'E', 10.000000, 40.000000);
INSERT INTO `node_coordinates` VALUES (1.00, 1, 'F', 0.000000, 40.000000);
INSERT INTO `node_coordinates` VALUES (2.00, 1, 'G', 0.000000, 0.000000);
INSERT INTO `node_coordinates` VALUES (2.00, 1, 'H', 40.000000, 0.000000);
INSERT INTO `node_coordinates` VALUES (2.00, 1, 'I', 60.000000, 0.000000);
INSERT INTO `node_coordinates` VALUES (2.00, 1, 'J', 60.000000, 40.000000);
INSERT INTO `node_coordinates` VALUES (2.00, 1, 'K', 40.000000, 40.000000);
INSERT INTO `node_coordinates` VALUES (2.00, 1, 'L', 0.000000, 40.000000);
INSERT INTO `node_coordinates` VALUES (3.00, 1, 'M', 0.000000, 0.000000);
INSERT INTO `node_coordinates` VALUES (3.00, 1, 'N', 30.000000, 0.000000);
INSERT INTO `node_coordinates` VALUES (3.00, 1, 'O', 30.000000, 30.000000);
INSERT INTO `node_coordinates` VALUES (3.00, 1, 'P', 0.000000, 30.000000);

-- ----------------------------
-- Table structure for pois
-- ----------------------------
DROP TABLE IF EXISTS `pois`;
CREATE TABLE `pois`  (
  `poi_id` int NOT NULL AUTO_INCREMENT,
  `floor_id` int NOT NULL,
  `node_name` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `x` int NOT NULL,
  `y` int NOT NULL,
  `type` enum('room','elevator','exit') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`poi_id`) USING BTREE,
  INDEX `floor_id`(`floor_id` ASC) USING BTREE,
  CONSTRAINT `pois_ibfk_1` FOREIGN KEY (`floor_id`) REFERENCES `floors` (`floor_id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of pois
-- ----------------------------

SET FOREIGN_KEY_CHECKS = 1;
