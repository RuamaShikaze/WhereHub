const db = require('../config/db');
const { PriorityQueue } = require('../utils/PriorityQueue');

module.exports = {
    /**
     * Dijkstra 路径计算
     * @param {string} start - 起点ID 
     * @param {string} end - 终点ID
     * @param {object} options - { avoidStairs: boolean }
     */
    async calculatePath(start, end, options) {
        // 1. 加载图数据
        const { nodes, edges } = await this._loadGraphData();

        // 2. 初始化数据结构
        const distances = {};
        const previous = {};
        const pq = new PriorityQueue();

        nodes.forEach(node => {
            distances[node.id] = node.id === start ? 0 : Infinity;
            pq.enqueue(node.id, distances[node.id]);
        });

        // 3. 执行Dijkstra算法
        while (!pq.isEmpty()) {
            const current = pq.dequeue().element;
            if (current === end) break;

            const neighbors = edges.filter(e => e.source === current);
            for (const edge of neighbors) {
                // 应用路径偏好（如避开楼梯）
                const weight = this._applyPathWeights(edge, options);
                const alt = distances[current] + weight;

                if (alt < distances[edge.target]) {
                    distances[edge.target] = alt;
                    previous[edge.target] = current;
                    pq.enqueue(edge.target, alt);
                }
            }
        }

        // 4. 构建返回路径
        return {
            path: this._buildPath(previous, end),
            distance: distances[end],
            meta: {
                algorithm: 'dijkstra',
                weightsApplied: options
            }
        };
    },

    // 私有方法
    async _loadGraphData() {
        const [nodes] = await db.query('SELECT DISTINCT from_node AS id FROM adjacency_matrix');
        const [edges] = await db.query(`
      SELECT 
        from_node AS source,
        to_node AS target,
        weight,
        path_type AS type
      FROM adjacency_matrix
    `);
        return { nodes, edges };
    },

    _applyPathWeights(edge, options) {
        let weight = edge.weight;
        if (options.avoidStairs && edge.type === 'stair') weight *= 5; // 楼梯权重惩罚
        return weight;
    },

    _buildPath(previous, end) {
        const path = [];
        let current = end;
        while (current) {
            path.unshift(current);
            current = previous[current];
        }
        return path.length > 1 ? path : null;
    }
};