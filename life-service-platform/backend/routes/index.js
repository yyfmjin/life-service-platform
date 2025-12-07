const express = require('express');
const authRoutes = require('./AuthRoutes');
const serviceRoutes = require('./ServiceRoutes');
const categoryRoutes = require('./CategoryRoutes');
const orderRoutes = require('./OrderRoutes');

const router = express.Router();

// API版本号
const apiVersion = '/api/v1';

// 注册所有路由
router.use(`${apiVersion}/auth`, authRoutes);
router.use(`${apiVersion}/services`, serviceRoutes);
router.use(`${apiVersion}/categories`, categoryRoutes);
router.use(`${apiVersion}/orders`, orderRoutes);

module.exports = router;