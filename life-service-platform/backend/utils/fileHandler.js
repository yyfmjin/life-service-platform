const fs = require('fs');
const path = require('path');

// 上传目录路径
const uploadDir = path.join(__dirname, '..', 'uploads');

// 删除文件
exports.deleteFile = (filePath) => {
  try {
    // 确保文件存在
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
    return false;
  } catch (error) {
    console.error('删除文件失败:', error.message);
    return false;
  }
};

// 删除多个文件
exports.deleteFiles = (filePaths) => {
  try {
    filePaths.forEach(filePath => {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });
    return true;
  } catch (error) {
    console.error('删除文件失败:', error.message);
    return false;
  }
};

// 获取文件URL
exports.getFileUrl = (fileName) => {
  // 在实际生产环境中，这应该是CDN或静态文件服务器的URL
  return `/uploads/${fileName}`;
};

// 获取文件路径
exports.getFilePath = (fileName) => {
  return path.join(uploadDir, fileName);
};

// 检查文件是否存在
exports.fileExists = (fileName) => {
  return fs.existsSync(path.join(uploadDir, fileName));
};

// 清理过期文件（可选功能）
exports.cleanupExpiredFiles = (days = 30) => {
  try {
    const now = Date.now();
    const maxAge = days * 24 * 60 * 60 * 1000;

    fs.readdirSync(uploadDir).forEach(file => {
      const filePath = path.join(uploadDir, file);
      const stats = fs.statSync(filePath);

      if (now - stats.mtime.getTime() > maxAge) {
        fs.unlinkSync(filePath);
        console.log(`已删除过期文件: ${file}`);
      }
    });

    return true;
  } catch (error) {
    console.error('清理过期文件失败:', error.message);
    return false;
  }
};