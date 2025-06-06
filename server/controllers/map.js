const mapService = require('../services/mapService');

module.exports = {
    /**
     * ��ȡ¥���ͼ����
     */
    async getFloorMap(req, res) {
        try {
            const data = await mapService.getFloorData(req.params.floor_id);

            // ��ӵ�����־
            console.log(`[SUCCESS] ����¥�� ${req.params.floor_id} ����`, {
                poiCount: data.pois.length,
                adjacencyCount: data.adjacency.length
            });

            res.json({
                success: true,
                data
            });
        } catch (err) {
            console.error(`[ERROR] ��ȡ¥������ʧ��`, {
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
     * ��ȡ��¥�����ӵ�
     */
    async getConnections(req, res) {
        try {
            const { fromFloor, toFloor } = req.query;
            if (!fromFloor || !toFloor) throw new Error('ȱ��¥�����');

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