const pool = require('../config/db');

module.exports = {
  // 获取楼层地图数据
  async getFloorData(floorId) {
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
      pois: pois.map(p => ({
        node_name: p.node_name,
        x: p.x,
        y: p.y,
        type: p.type
      })),
      scale: 0.5 // 假设1像素=0.5厘米
    };
  },

  // 获取楼层连接点
  async getConnections(fromFloor, toFloor) {
    const [nodes] = await pool.query(`
      SELECT a.from_node, a.to_node 
      FROM adjacency_matrix a
      WHERE a.floor_id = ? 
        AND a.path_type IN ('elevator', 'stair')
        AND EXISTS (
          SELECT 1 FROM adjacency_matrix b
          WHERE b.floor_id = ?
            AND b.path_type = a.path_type
            AND b.from_node = a.to_node
        )
    `, [fromFloor, toFloor]);

    return nodes;
  }
};