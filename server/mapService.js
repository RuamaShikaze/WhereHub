const pool = require('../config/db');

module.exports = {
    /**
     * ��ȡ¥���������ݣ���POI���ڽӾ���
     * @param {number} floorId - Ŀ��¥��ID
     * @returns {Promise<Object>} ¥�����ݶ���
     */
    async getFloorData(floorId) {
        // 1. ���в�ѯ��������
        const [floor, pois, adjacency] = await Promise.all([
            this._getFloorInfo(floorId),
            this._getPois(floorId),
            this._getFloorAdjacency(floorId)
        ]);

        // 2. ��װ��Ӧ����
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
     * ��ȡ��¥�����ӵ㣨��¥��/���ݣ�
     * @param {number} fromFloor - ��ʼ¥��
     * @param {number} toFloor - Ŀ��¥��
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

    // --- ˽�з��� ---
    async _getFloorInfo(floorId) {
        const [rows] = await pool.query(
            'SELECT floor_id as id, floor_name as name, map_image, scale FROM floors WHERE floor_id = ?',
            [floorId]
        );
        if (!rows.length) throw new Error(`¥�� ${floorId} ������`);
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