// 成功响应格式化
exports.successResponse = (res, data, message = '操作成功', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

// 错误响应格式化
exports.errorResponse = (res, message = '操作失败', statusCode = 400) => {
  return res.status(statusCode).json({
    success: false,
    message
  });
};

// 验证错误响应格式化
exports.validationErrorResponse = (res, errors) => {
  return res.status(400).json({
    success: false,
    message: '验证失败',
    errors
  });
};

// 分页响应格式化
exports.paginatedResponse = (res, data, total, page, limit, message = '操作成功') => {
  return res.json({
    success: true,
    message,
    data,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / limit)
    }
  });
};