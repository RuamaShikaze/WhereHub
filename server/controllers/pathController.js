const pathService = require('../services/pathService');
const logger = require('../utils/logger');

/**
 * 路径计算控制器
 */
module.exports = {
    /**
     * 计算两点间最短路径
     * @param {Object} req - 请求对象
     * @param {Object} res - 响应对象
    */

    getPath: async (req, res) => { // 必须是函数
        try {
            const path = await calculatePath(req.query);
            res.json(path);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    async calculatePath(req, res) {
        const { start, end, ...options } = req.body;
        const requestId = req.headers['x-request-id'] || Date.now().toString();

        try {
            // 1. 输入验证
            if (!start || !end) {
                logger.warn('缺少必要参数', { requestId, start, end });
                return res.status(400).json({
                    success: false,
                    error: '参数错误：必须提供 start 和 end 参数',
                    requestId
                });
            }

            // 2. 调用服务层计算路径
            logger.info('开始路径计算', { requestId, start, end, options });
            const result = await pathService.calculatePath(start, end, options);

            if (!result.path) {
                logger.warn('未找到可行路径', { requestId, start, end });
                return res.status(404).json({
                    success: false,
                    error: '未找到可行路径',
                    requestId
                });
            }

            // 3. 返回成功响应
            logger.info('路径计算成功', {
                requestId,
                pathLength: result.path.length,
                distance: result.distance
            });

            res.json({
                success: true,
                data: result,
                requestId
            });

        } catch (err) {
            // 4. 错误处理
            logger.error('路径计算失败', {
                requestId,
                error: err.message,
                stack: err.stack
            });

            res.status(500).json({
                success: false,
                error: '服务器内部错误',
                detail: process.env.NODE_ENV === 'development' ? err.message : undefined,
                requestId
            });
        }
    },

    /**
     * 获取路径计算历史（示例方法）
     */
    async getPathHistory(req, res) {
        try {
            // 实际项目中可从数据库获取历史记录
            res.json({
                success: true,
                data: []
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                error: err.message
            });
        }
    }
};