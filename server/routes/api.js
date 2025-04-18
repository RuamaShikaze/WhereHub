const express = require('express');
const router = express.Router();
const mapController = require('../controllers/map');
const pathController = require('../controllers/path');

// 地图数据接口
router.get('/floors/:floor_id', mapController.getFloorMap);
router.get('/connections', mapController.getFloorConnections);

// 路径规划接口
router.post('/path/indoor', pathController.calculateIndoorPath);
router.post('/path/multi-floor', pathController.calculateMultiFloorPath);

module.exports = router;