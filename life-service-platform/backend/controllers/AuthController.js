const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

// 生成JWT令牌
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// 用户注册
exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password, phone } = req.body;

  try {
    // 检查邮箱是否已存在
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: '该邮箱已被注册' });
    }

    // 创建新用户
    user = new User({
      name,
      email,
      password,
      phone
    });

    await user.save();

    // 生成令牌
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误，请稍后重试' });
  }
};

// 用户登录
exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    // 检查用户是否存在
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: '邮箱或密码错误' });
    }

    // 验证密码
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: '邮箱或密码错误' });
    }

    // 生成令牌
    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误，请稍后重试' });
  }
};

// 获取当前用户信息
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误，请稍后重试' });
  }
};

// 更新用户信息
exports.updateProfile = async (req, res) => {
  const { name, phone, address } = req.body;

  try {
    const user = await User.findById(req.user.id);

    if (user) {
      user.name = name || user.name;
      user.phone = phone || user.phone;
      user.address = address || user.address;

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        address: updatedUser.address,
        role: updatedUser.role
      });
    } else {
      res.status(404).json({ message: '用户不存在' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误，请稍后重试' });
  }
};

// 更改密码
exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.user.id);

    if (user) {
      // 验证当前密码
      const isMatch = await user.matchPassword(currentPassword);
      if (!isMatch) {
        return res.status(401).json({ message: '当前密码错误' });
      }

      user.password = newPassword;
      await user.save();

      res.json({ message: '密码更新成功' });
    } else {
      res.status(404).json({ message: '用户不存在' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误，请稍后重试' });
  }
};