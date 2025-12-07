const express = require('express');
const { check } = require('express-validator');
const { createCategory, getCategories, getCategoryById, updateCategory, deleteCategory } = require('../controllers/CategoryController');
const { protect, verifyAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

// 获取所有分类（公开）
router.get('/', getCategories);

// 获取单个分类（公开）
router.get('/:id', getCategoryById);

// 创建分类（需要认证和管理员权限）
router.post('/', protect, verifyAdmin, [
  check('name', '分类名称不能为空').notEmpty(),
  check('description', '分类描述不能为空').optional().notEmpty()
], createCategory);

// 更新分类（需要认证和管理员权限）
router.put('/:id', protect, verifyAdmin, [
  check('name', '分类名称不能为空').optional().notEmpty()
], updateCategory);

// 删除分类（需要认证和管理员权限）
router.delete('/:id', protect, verifyAdmin, deleteCategory);

module.exports = router;