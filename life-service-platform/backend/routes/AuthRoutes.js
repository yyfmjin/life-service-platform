const express = require('express');
const { check } = require('express-validator');
const { register, login, getMe, updateProfile, changePassword } = require('../controllers/AuthController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// 用户注册
router.post('/register', [
  check('name', '姓名不能为空').notEmpty(),
  check('email', '请输入有效的邮箱地址').isEmail(),
  check('password', '密码长度不能少于6个字符').isLength({ min: 6 }),
  check('phone', '请输入有效的手机号码').notEmpty()
], register);

// 用户登录
router.post('/login', [
  check('email', '请输入有效的邮箱地址').isEmail(),
  check('password', '密码不能为空').exists()
], login);

// 获取当前用户信息
router.get('/me', protect, getMe);

// 更新用户信息
router.put('/update-profile', protect, [
  check('name', '姓名不能为空').optional().notEmpty()
], updateProfile);

// 更改密码
router.put('/change-password', protect, [
  check('currentPassword', '当前密码不能为空').notEmpty(),
  check('newPassword', '新密码长度不能少于6个字符').isLength({ min: 6 })
], changePassword);

module.exports = router;