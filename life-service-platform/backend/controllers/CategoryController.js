const Category = require('../models/Category');
const { validationResult } = require('express-validator');

// 创建分类
exports.createCategory = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, description, icon } = req.body;

  try {
    // 检查分类名称是否已存在
    let category = await Category.findOne({ name });
    if (category) {
      return res.status(400).json({ message: '该分类名称已存在' });
    }

    // 创建新分类
    category = new Category({
      name,
      description,
      icon
    });

    await category.save();

    res.status(201).json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误，请稍后重试' });
  }
};

// 获取所有分类
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find().populate('services', 'title');
    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误，请稍后重试' });
  }
};

// 获取单个分类
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id).populate('services', 'title price');

    if (!category) {
      return res.status(404).json({ message: '分类不存在' });
    }

    res.json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误，请稍后重试' });
  }
};

// 更新分类
exports.updateCategory = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, description, icon } = req.body;

  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: '分类不存在' });
    }

    // 检查分类名称是否已被其他分类使用
    if (name && name !== category.name) {
      const existingCategory = await Category.findOne({ name });
      if (existingCategory) {
        return res.status(400).json({ message: '该分类名称已存在' });
      }
    }

    // 更新分类信息
    category.name = name || category.name;
    category.description = description || category.description;
    category.icon = icon || category.icon;

    const updatedCategory = await category.save();

    res.json(updatedCategory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误，请稍后重试' });
  }
};

// 删除分类
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: '分类不存在' });
    }

    // 检查该分类下是否有服务
    if (category.services.length > 0) {
      return res.status(400).json({ message: '该分类下有服务，无法删除' });
    }

    await category.remove();

    res.json({ message: '分类已删除' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误，请稍后重试' });
  }
};