const Service = require('../models/Service');
const Category = require('../models/Category');
const User = require('../models/User');
const { validationResult } = require('express-validator');

// 创建服务
exports.createService = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { title, description, category, price, duration, images } = req.body;

  try {
    // 检查分类是否存在
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(404).json({ message: '分类不存在' });
    }

    // 创建服务
    const service = new Service({
      title,
      description,
      category,
      provider: req.user.id,
      price,
      duration,
      images
    });

    await service.save();

    // 更新服务提供商的服务列表
    await User.findByIdAndUpdate(req.user.id, {
      $push: { services: service._id }
    });

    // 更新分类的服务列表
    await Category.findByIdAndUpdate(category, {
      $push: { services: service._id }
    });

    res.status(201).json(service);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误，请稍后重试' });
  }
};

// 获取所有服务
exports.getServices = async (req, res) => {
  try {
    const { category, search, sortBy, page = 1, limit = 10 } = req.query;

    // 构建查询条件
    const query = {};
    if (category) {
      query.category = category;
    }
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    // 构建排序条件
    const sortOptions = {};
    switch (sortBy) {
      case 'price_asc':
        sortOptions.price = 1;
        break;
      case 'price_desc':
        sortOptions.price = -1;
        break;
      case 'rating':
        sortOptions.rating = -1;
        break;
      case 'newest':
        sortOptions.createdAt = -1;
        break;
      default:
        sortOptions.createdAt = -1;
    }

    // 分页查询
    const skip = (page - 1) * limit;
    const services = await Service.find(query)
      .populate('provider', 'name avatar')
      .populate('category', 'name')
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Service.countDocuments(query);

    res.json({
      services,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误，请稍后重试' });
  }
};

// 获取单个服务
exports.getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id)
      .populate('provider', 'name avatar phone')
      .populate('category', 'name');

    if (!service) {
      return res.status(404).json({ message: '服务不存在' });
    }

    res.json(service);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误，请稍后重试' });
  }
};

// 更新服务
exports.updateService = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { title, description, category, price, duration, images, status } = req.body;

  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: '服务不存在' });
    }

    // 检查是否是服务提供商
    if (service.provider.toString() !== req.user.id) {
      return res.status(401).json({ message: '您没有权限修改此服务' });
    }

    // 如果分类改变，更新分类的服务列表
    if (category && category !== service.category.toString()) {
      // 从旧分类中移除服务
      await Category.findByIdAndUpdate(service.category, {
        $pull: { services: service._id }
      });

      // 添加到新分类
      await Category.findByIdAndUpdate(category, {
        $push: { services: service._id }
      });
    }

    // 更新服务信息
    service.title = title || service.title;
    service.description = description || service.description;
    service.category = category || service.category;
    service.price = price || service.price;
    service.duration = duration || service.duration;
    service.images = images || service.images;
    service.status = status || service.status;

    const updatedService = await service.save();

    res.json(updatedService);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误，请稍后重试' });
  }
};

// 删除服务
exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: '服务不存在' });
    }

    // 检查是否是服务提供商
    if (service.provider.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ message: '您没有权限删除此服务' });
    }

    // 从服务提供商的服务列表中移除
    await User.findByIdAndUpdate(service.provider, {
      $pull: { services: service._id }
    });

    // 从分类的服务列表中移除
    await Category.findByIdAndUpdate(service.category, {
      $pull: { services: service._id }
    });

    // 删除服务
    await service.remove();

    res.json({ message: '服务已删除' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误，请稍后重试' });
  }
};

// 添加服务评论
exports.addReview = async (req, res) => {
  const { rating, comment } = req.body;

  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: '服务不存在' });
    }

    // 检查用户是否已经评论过此服务
    const alreadyReviewed = service.reviews.find(
      review => review.user.toString() === req.user.id
    );

    if (alreadyReviewed) {
      return res.status(400).json({ message: '您已经评论过此服务' });
    }

    // 创建新评论
    const review = {
      user: req.user.id,
      rating: parseInt(rating),
      comment
    };

    service.reviews.push(review);

    // 更新服务评分
    service.rating = service.reviews.reduce((acc, review) => review.rating + acc, 0) / service.reviews.length;

    await service.save();

    res.status(201).json({ message: '评论添加成功' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误，请稍后重试' });
  }
};