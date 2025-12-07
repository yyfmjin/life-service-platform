const express = require('express');
const { check } = require('express-validator');
const { createService, getServices, getServiceById, updateService, deleteService, addReview } = require('../controllers/ServiceController');
const { protect, verifyProvider } = require('../middleware/authMiddleware');

const router = express.Router();

// 获取所有服务（公开）
router.get('/', getServices);

// 获取单个服务（公开）
router.get('/:id', getServiceById);

// 创建服务（需要认证和服务提供商权限）
router.post('/', protect, verifyProvider, [
  check('title', '服务标题不能为空').notEmpty(),
  check('description', '服务描述不能为空').notEmpty(),
  check('category', '请选择服务分类').notEmpty(),
  check('price', '请输入有效的服务价格').isNumeric().isFloat({ min: 0 }),
  check('duration', '请输入有效的服务时长').isNumeric().isInt({ min: 1 }),
  check('images', '请至少上传一张服务图片').isArray({ min: 1 })
], createService);

// 更新服务（需要认证和服务提供商权限）
router.put('/:id', protect, verifyProvider, [
  check('title', '服务标题不能为空').optional().notEmpty(),
  check('description', '服务描述不能为空').optional().notEmpty(),
  check('price', '请输入有效的服务价格').optional().isNumeric().isFloat({ min: 0 }),
  check('duration', '请输入有效的服务时长').optional().isNumeric().isInt({ min: 1 })
], updateService);

// 删除服务（需要认证和服务提供商权限）
router.delete('/:id', protect, verifyProvider, deleteService);

// 添加服务评论（需要认证）
router.post('/:id/review', protect, [
  check('rating', '评分不能为空且必须在1-5之间').notEmpty().isInt({ min: 1, max: 5 }),
  check('comment', '评论内容不能为空').notEmpty()
], addReview);

module.exports = router;