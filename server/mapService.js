const pool = require('../config/db');


module.exports = {
    /*
     获取两个楼层之间的所有连接点
     @param {number} fromFloor - 起始楼层ID
     @param {number} toFloor - 目标楼层ID
     @returns {Promise<Array>} 连接点数组
    */

    // 明确定义函数
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
            // 1. 查询双向连接（因为是无向图）
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

            // 2. 格式化数据适配小程序
            return connections.map(conn => ({
                id: `conn_${conn.node_name}`,
                name: conn.node_name,
                type: conn.connection_type,
                position: { x: conn.x, y: conn.y },
                floors: [
                    { id: fromFloor, name: conn.from_floor_name },
                    { id: toFloor, name: conn.to_floor_name }
                ],
                // 小程序图标类型映射
                iconPath: this._getIconByType(conn.connection_type)
            }));
        } catch (err) {
            console.error('获取楼层连接失败:', err);
            throw err;
        }
    },

    // 私有方法：根据类型返回小程序图标
    _getIconByType(type) {
        const icons = {
            elevator: '/assets/icons/elevator.png',
            stair: '/assets/icons/stair.png',
            escalator: '/assets/icons/escalator.png'
        };
        return icons[type] || '/assets/icons/default.png';
    }
};