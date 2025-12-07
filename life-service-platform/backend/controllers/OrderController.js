const Order = require('../models/Order');
const Service = require('../models/Service');
const User = require('../models/User');
const { validationResult } = require('express-validator');

// 创建订单
exports.createOrder = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { serviceId, quantity, scheduledDate, address, phone, notes, paymentMethod } = req.body;

  try {
    // 检查服务是否存在
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: '服务不存在' });
    }

    // 检查服务是否可用
    if (service.status !== 'available') {
      return res.status(400).json({ message: '该服务目前不可用' });
    }

    // 计算总价格
    const totalPrice = service.price * quantity;

    // 创建订单
    const order = new Order({
      service: serviceId,
      user: req.user.id,
      provider: service.provider,
      totalPrice,
      quantity,
      scheduledDate,
      address,
      phone,
      notes,
      paymentMethod
    });

    await order.save();

    // 更新用户的订单列表
    await User.findByIdAndUpdate(req.user.id, {
      $push: { orders: order._id }
    });

    // 更新服务提供商的订单列表
    await User.findByIdAndUpdate(service.provider, {
      $push: { orders: order._id }
    });

    // 更新服务的订单列表
    await Service.findByIdAndUpdate(serviceId, {
      $push: { orders: order._id }
    });

    res.status(201).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误，请稍后重试' });
  }
};

// 获取用户的所有订单
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('service', 'title price images')
      .populate('provider', 'name phone')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误，请稍后重试' });
  }
};

// 获取服务提供商的所有订单
exports.getProviderOrders = async (req, res) => {
  try {
    const orders = await Order.find({ provider: req.user.id })
      .populate('service', 'title price')
      .populate('user', 'name phone')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误，请稍后重试' });
  }
};

// 获取单个订单详情
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('service', 'title price description images')
      .populate('user', 'name phone address')
      .populate('provider', 'name phone');

    if (!order) {
      return res.status(404).json({ message: '订单不存在' });
    }

    // 检查是否是订单所有者或服务提供商
    if (order.user.toString() !== req.user.id && order.provider.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ message: '您没有权限查看此订单' });
    }

    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误，请稍后重试' });
  }
};

// 更新订单状态
exports.updateOrderStatus = async (req, res) => {
  const { status, paymentStatus } = req.body;

  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: '订单不存在' });
    }

    // 检查是否是服务提供商或管理员
    if (order.provider.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ message: '您没有权限更新此订单' });
    }

    // 更新订单状态
    if (status) {
      order.status = status;

      // 如果订单完成，记录完成时间
      if (status === 'completed') {
        order.completionDate = Date.now();
      }
    }

    // 更新支付状态
    if (paymentStatus) {
      order.paymentStatus = paymentStatus;
    }

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误，请稍后重试' });
  }
};

// 取消订单
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: '订单不存在' });
    }

    // 检查是否是订单所有者或服务提供商
    if (order.user.toString() !== req.user.id && order.provider.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ message: '您没有权限取消此订单' });
    }

    // 检查订单是否可以取消
    if (order.status === 'in_progress' || order.status === 'completed') {
      return res.status(400).json({ message: '该订单已开始或已完成，无法取消' });
    }

    // 更新订单状态
    order.status = 'cancelled';
    await order.save();

    res.json({ message: '订单已取消' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误，请稍后重试' });
  }
};

// 处理支付
exports.processPayment = async (req, res) => {
  const { paymentMethod, transactionId } = req.body;

  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: '订单不存在' });
    }

    // 检查是否是订单所有者
    if (order.user.toString() !== req.user.id) {
      return res.status(401).json({ message: '您没有权限支付此订单' });
    }

    // 检查订单是否已经支付
    if (order.paymentStatus === 'paid') {
      return res.status(400).json({ message: '该订单已支付' });
    }

    // 更新订单支付信息
    order.paymentMethod = paymentMethod || order.paymentMethod;
    order.paymentStatus = 'paid';
    order.paymentDate = Date.now();
    order.transactionId = transactionId;
    
    // 如果支付成功，更新订单状态为待服务
    order.status = 'confirmed';

    const updatedOrder = await order.save();

    res.json({ message: '支付成功', order: updatedOrder });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误，请稍后重试' });
  }
};