const pool = require('../config/db');


module.exports = {
    /*
     ��ȡ����¥��֮����������ӵ�
     @param {number} fromFloor - ��ʼ¥��ID
     @param {number} toFloor - Ŀ��¥��ID
     @returns {Promise<Array>} ���ӵ�����
    */

    // ��ȷ���庯��
    async function getFloorData(floorId) {
    const [floor] = await pool.query(
        'SELECT * FROM floors WHERE floor_id = ?',
        [floorId]
    );

    const [pois] = await pool.query(
        'SELECT * FROM pois WHERE floor_id = ?',
        [floorId]
    );

    return {
        imageUrl: floor[0].map_image,
        pois,
        scale: 0.5
    };
}
    async getFloorConnections(fromFloor, toFloor) {
        try {
            // 1. ��ѯ˫�����ӣ���Ϊ������ͼ��
            const [connections] = await pool.query(`
        SELECT 
          fc.node_name,
          fc.connection_type,
          fc.x,
          fc.y,
          f1.floor_name AS from_floor_name,
          f2.floor_name AS to_floor_name
        FROM floor_connections fc
        JOIN floors f1 ON fc.from_floor = f1.floor_id
        JOIN floors f2 ON fc.to_floor = f2.floor_id
        WHERE (fc.from_floor = ? AND fc.to_floor = ?)
           OR (fc.from_floor = ? AND fc.to_floor = ?)
        ORDER BY fc.connection_type
      `, [fromFloor, toFloor, toFloor, fromFloor]);

            // 2. ��ʽ����������С����
            return connections.map(conn => ({
                id: `conn_${conn.node_name}`,
                name: conn.node_name,
                type: conn.connection_type,
                position: { x: conn.x, y: conn.y },
                floors: [
                    { id: fromFloor, name: conn.from_floor_name },
                    { id: toFloor, name: conn.to_floor_name }
                ],
                // С����ͼ������ӳ��
                iconPath: this._getIconByType(conn.connection_type)
            }));
        } catch (err) {
            console.error('��ȡ¥������ʧ��:', err);
            throw err;
        }
    },

    // ˽�з������������ͷ���С����ͼ��
    _getIconByType(type) {
        const icons = {
            elevator: '/assets/icons/elevator.png',
            stair: '/assets/icons/stair.png',
            escalator: '/assets/icons/escalator.png'
        };
        return icons[type] || '/assets/icons/default.png';
    }
};