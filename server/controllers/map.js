// ȷ�������ѵ�����Ϊ��������
const mapService = require('../services/mapService');

exports.getFloorMap = async (req, res) => { // �����Ǻ���
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
    // ...ʵ���߼�...
};