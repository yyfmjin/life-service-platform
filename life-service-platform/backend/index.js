const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const connectDB = require('./config/db');
const serverConfig = require('./config/server');
const routes = require('./routes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// 连接数据库
connectDB();

const app = express();

// 中间件配置
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 日志中间件（仅在开发环境启用）
if (serverConfig.env === 'development') {
  app.use(morgan('dev'));
}

// 静态文件服务
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API 路由
app.use(routes);

// 404 错误处理
app.use(notFound);

// 错误处理中间件
app.use(errorHandler);

// 启动服务器
const PORT = serverConfig.port || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${serverConfig.env} mode on port ${PORT}`);
});