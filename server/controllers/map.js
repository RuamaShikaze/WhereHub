// 确保方法已导出且为函数类型
const mapService = require('../services/mapService');

exports.getFloorMap = async (req, res) => { // 必须是函数
    try {
        const { floor_id } = req.params;
        const data = await mapService.getFloorData(floor_id);
        res.json({
            success: true,
            data: {
                floorId: floor_id,
                ...data
            }
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};

exports.getFloorConnections = async (req, res) => {
    // ...实现逻辑...
};