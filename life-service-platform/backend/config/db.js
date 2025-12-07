const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    // 尝试连接到MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 2000,
      socketTimeoutMS: 5000,
      family: 4
    });
    console.log('数据库连接成功');
  } catch (error) {
    console.error('数据库连接失败:', error.message);
    // 如果无法连接到MongoDB，使用内存存储代替
    console.log('正在使用内存存储模式启动服务...');
    
    // 创建模拟数据存储
    global.memoryStore = {
      users: [],
      services: [],
      categories: [],
      orders: []
    };
    
    console.log('服务已在内存模式下启动，数据将在重启后丢失');
    
    // 不退出进程，继续运行服务
  }
};

module.exports = connectDB;