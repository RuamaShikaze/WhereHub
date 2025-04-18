const pool = require('../config/db');
const { dijkstra } = require('../utils/algorithms');

module.exports = {
  // 单楼层路径计算
  async calculatePath(start, end, floorId, avoidStairs = false) {
    // 1. 获取邻接矩阵
    const [edges] = await pool.query(
      `SELECT from_node, to_node, weight 
       FROM adjacency_matrix 
       WHERE floor_id = ? 
       ${avoidStairs ? "AND path_type != 'stair'" : ''}`,
      [floorId]
    );

    // 2. 转换为图结构
    const graph = {};
    edges.forEach(edge => {
      if (!graph[edge.from_node]) graph[edge.from_node] = {};
      graph[edge.from_node][edge.to_node] = edge.weight;
    });

    // 3. 执行Dijkstra算法
    const { path, distance } = dijkstra(graph, start, end);

    // 4. 获取坐标
    const [pois] = await pool.query(
      'SELECT node_name, x, y FROM pois WHERE floor_id = ?',
      [floorId]
    );

    const coordinates = path.map(node => {
      const poi = pois.find(p => p.node_name === node);
      return [poi.x, poi.y];
    });

    return { nodes: path, coordinates, distance };
  },

  // 跨楼层路径计算
  async getMultiFloorPath(start, end) {
    // 实现逻辑类似，需处理楼层间转移
    // ...
  }
};