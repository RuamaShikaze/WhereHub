const pool = require('../config/db');

module.exports = {
    /**
     * 获取楼层完整数据（含POI和邻接矩阵）
     * @param {number} floorId - 目标楼层ID
     * @returns {Promise<Object>} 楼层数据对象
     */
    async getFloorData(floorId) {
        // 1. 并行查询基础数据
        const [floor, pois, adjacency] = await Promise.all([
            this._getFloorInfo(floorId),
            this._getPois(floorId),
            this._getFloorAdjacency(floorId)
        ]);

        // 2. 组装响应数据
        return {
            floorInfo: floor,
            pois,
            adjacency,
            meta: {
                imageScale: floor.scale || 0.5,
                hasCrossFloor: adjacency.some(link => link.isCrossFloor)
            }
        };
    },

    /**
     * 获取跨楼层连接点（如楼梯/电梯）
     * @param {number} fromFloor - 起始楼层
     * @param {number} toFloor - 目标楼层
     */
    async getCrossFloorConnections(fromFloor, toFloor) {
        const [connections] = await pool.query(`
      SELECT 
        am.from_node,
        am.to_node,
        am.weight,
        am.path_type,
        fc.x, fc.y,
        fc.connection_name
      FROM adjacency_matrix am
      JOIN floor_connections fc ON 
        (am.from_node = fc.node_name OR am.to_node = fc.node_name)
      WHERE 
        ((am.from_floor = ? AND am.to_floor = ?) OR
         (am.from_floor = ? AND am.to_floor = ?))
        AND am.path_type IN ('stair', 'elevator')
    `, [fromFloor, toFloor, toFloor, fromFloor]);

        return connections.map(conn => this._formatConnection(conn));
    },

    // --- 私有方法 ---
    async _getFloorInfo(floorId) {
        const [rows] = await pool.query(
            'SELECT floor_id as id, floor_name as name, map_image, scale FROM floors WHERE floor_id = ?',
            [floorId]
        );
        if (!rows.length) throw new Error(`楼层 ${floorId} 不存在`);
        return rows[0];
    },

    async _getPois(floorId) {
        const [rows] = await pool.query(
            'SELECT poi_id, node_name, x, y, type FROM pois WHERE floor_id = ?',
            [floorId]
        );
        return rows;
    },

    async _getFloorAdjacency(floorId) {
        const [edges] = await pool.query(`
      SELECT 
        from_node as source,
        to_node as target,
        weight,
        path_type as type,
        from_floor,
        to_floor
      FROM adjacency_matrix
      WHERE ? IN (from_floor, to_floor)
      ORDER BY path_type
    `, [floorId]);

        return edges.map(edge => ({
            ...edge,
            isCrossFloor: edge.from_floor !== edge.to_floor,
            floors: [edge.from_floor, edge.to_floor].sort()
        }));
    },

    _formatConnection(conn) {
        return {
            id: `conn_${conn.from_node}-${conn.to_node}`,
            name: conn.connection_name || `${conn.path_type.toUpperCase()}_${conn.from_node}`,
            type: conn.path_type,
            position: { x: conn.x, y: conn.y },
            weight: conn.weight
        };
    }
};