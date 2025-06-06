const mapService = require('../services/mapService');

module.exports = {
    /**
     * 获取楼层地图数据
     */
    async getFloorMap(req, res) {
        try {
            const data = await mapService.getFloorData(req.params.floor_id);

            // 添加调试日志
            console.log(`[SUCCESS] 返回楼层 ${req.params.floor_id} 数据`, {
                poiCount: data.pois.length,
                adjacencyCount: data.adjacency.length
            });

            res.json({
                success: true,
                data
            });
        } catch (err) {
            console.error(`[ERROR] 获取楼层数据失败`, {
                floorId: req.params.floor_id,
                error: err.stack
            });
            res.status(500).json({
                success: false,
                error: err.message
            });
        }
    },

    /**
     * 获取跨楼层连接点
     */
    async getConnections(req, res) {
        try {
            const { fromFloor, toFloor } = req.query;
            if (!fromFloor || !toFloor) throw new Error('缺少楼层参数');

            const connections = await mapService.getCrossFloorConnections(
                parseInt(fromFloor),
                parseInt(toFloor)
            );

            res.json({
                success: true,
                data: connections
            });
        } catch (err) {
            res.status(400).json({
                success: false,
                error: err.message
            });
        }
    }
};