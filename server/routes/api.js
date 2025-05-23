const express = require('express');
const router = express.Router();
const mapController = require('../controllers/map');
const pathController = require('../controllers/path');

// 确保所有控制器方法已正确定义
router.get('/floors/:floor_id', mapController.getFloorMap); // 第7行
router.get('/connections', mapController.getFloorConnections);

router.post('/path/indoor', pathController.calculateIndoorPath);
router.post('/path/multi-floor', pathController.calculateMultiFloorPath);

module.exports = router;