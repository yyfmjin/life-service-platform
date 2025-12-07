const express = require('express');
const { check } = require('express-validator');
const { createOrder, getUserOrders, getProviderOrders, getOrderById, updateOrderStatus, cancelOrder, processPayment } = require('../controllers/OrderController');
const { protect, verifyProvider } = require('../middleware/authMiddleware');

const router = express.Router();

// 创建订单（需要认证）
router.post('/', protect, [
  check('serviceId', '请选择服务').notEmpty(),
  check('quantity', '请输入有效的服务数量').isNumeric().isInt({ min: 1 }),
  check('scheduledDate', '请选择服务时间').notEmpty(),
  check('address', '请输入服务地址').notEmpty(),
  check('phone', '请输入联系电话').notEmpty(),
  check('paymentMethod', '请选择支付方式').notEmpty()
], createOrder);

// 获取用户的所有订单（需要认证）
router.get('/user', protect, getUserOrders);

// 获取服务提供商的所有订单（需要认证和服务提供商权限）
router.get('/provider', protect, verifyProvider, getProviderOrders);

// 获取单个订单详情（需要认证）
router.get('/:id', protect, getOrderById);

// 更新订单状态（需要认证和服务提供商权限）
router.put('/:id/status', protect, verifyProvider, [
  check('status', '请选择订单状态').optional().notEmpty(),
  check('paymentStatus', '请选择支付状态').optional().notEmpty()
], updateOrderStatus);

// 取消订单（需要认证）
router.put('/:id/cancel', protect, cancelOrder);

// 处理订单支付（需要认证）
router.post('/:id/pay', protect, [
  check('paymentMethod', '请选择支付方式').notEmpty(),
  check('transactionId', '请提供交易ID').optional()
], processPayment);

module.exports = router;