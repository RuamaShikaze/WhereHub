const pathService = require('../services/pathService');

// 室内路径规划
exports.calculateIndoorPath = async (req, res) => {
  const { start, end, floor_id } = req.body;
  
  const path = await pathService.calculatePath(
    start, 
    end, 
    floor_id,
    req.query.avoidStairs === 'true' // 参数示例：是否避开楼梯
  );

  res.json({
    path: path.nodes,
    coordinates: path.coordinates, // 像素坐标
    distance: path.distance // 厘米
  });
};

// 跨楼层路径
exports.calculateMultiFloorPath = async (req, res) => {
  const { start, startFloor, end, endFloor } = req.body;
  const path = await pathService.getMultiFloorPath(
    { node: start, floor: startFloor },
    { node: end, floor: endFloor }
  );
  res.json(path);
};