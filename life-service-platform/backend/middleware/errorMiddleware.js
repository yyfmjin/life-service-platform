// 错误处理中间件
exports.errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // 默认错误状态码为500
  let statusCode = 500;
  // 默认错误消息
  let errorMessage = '服务器错误，请稍后重试';

  // 处理MongoDB验证错误
  if (err.name === 'ValidationError') {
    statusCode = 400;
    errorMessage = Object.values(err.errors).map(value => value.message).join(', ');
  }

  // 处理MongoDB重复键错误
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue)[0];
    errorMessage = `${field} 已存在`;
  }

  // 处理MongoDB无效ID错误
  if (err.name === 'CastError') {
    statusCode = 404;
    errorMessage = '找不到该资源';
  }

  // 处理JWT错误
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    errorMessage = '无效的令牌';
  }

  // 处理JWT过期错误
  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    errorMessage = '令牌已过期，请重新登录';
  }

  // 处理404错误
  if (res.statusCode === 404) {
    statusCode = 404;
    errorMessage = `找不到请求的路径: ${req.originalUrl}`;
  }

  res.status(statusCode).json({
    message: errorMessage,
    // 在开发环境下显示详细错误信息
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

// 404错误处理
exports.notFound = (req, res, next) => {
  const error = new Error(`找不到请求的路径: ${req.originalUrl}`);
  res.status(404);
  next(error);
};