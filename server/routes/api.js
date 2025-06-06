const express = require('express');
const router = express.Router();
const mapController = require('../controllers/map');
const pathController = require('../controllers/pathController');
const path = require('../controllers/path');

// 确保所有控制器方法已正确定义
router.get('/test', (req, res) => {
    console.log('测试路由被触发'); // ⚠️ 检查此日志是否出现
    res.json({ success: true });
});
router.get('/floors/:floor_id', mapController.getFloorMap); // 第7行
router.get('/connections', mapController.getConnections);
router.get('/path', pathController.getPath); // 注意：没有括号
router.post('/path/indoor', path.calculateIndoorPath);
router.post('/path/multi-floor', path.calculateMultiFloorPath);

module.exports = router;