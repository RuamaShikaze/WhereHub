const express = require('express');
const cors = require('cors');
const apiRouter = require('./routes/api');
require('dotenv').config();

const app = express();

// 中间件
app.use(cors());
app.use(express.json());

// 路由
app.use('/api', apiRouter);

// 错误处理
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});