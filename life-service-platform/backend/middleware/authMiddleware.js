const jwt = require('jsonwebtoken');
const User = require('../models/User');

// 认证中间件
exports.protect = async (req, res, next) => {
  let token;

  // 检查请求头中的Authorization字段
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // 提取令牌
      token = req.headers.authorization.split(' ')[1];

      // 验证令牌
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 获取用户信息并附加到请求对象
      req.user = await User.findById(decoded.id).select('-password');

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: '无效的令牌，请重新登录' });
    }
  }

  if (!token) {
    res.status(401).json({ message: '未授权，请登录' });
  }
};

// 角色验证中间件
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: '您没有权限执行此操作' });
    }
    next();
  };
};

// 服务提供商验证中间件
exports.verifyProvider = (req, res, next) => {
  if (req.user.role !== 'provider' && req.user.role !== 'admin') {
    return res.status(403).json({ message: '您不是服务提供商，无法执行此操作' });
  }
  next();
};

// 管理员验证中间件
exports.verifyAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: '您不是管理员，无法执行此操作' });
  }
  next();
};