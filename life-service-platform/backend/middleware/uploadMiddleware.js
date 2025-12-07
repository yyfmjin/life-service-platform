const multer = require('multer');
const path = require('path');

// 确保上传目录存在
const fs = require('fs');
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 配置multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // 生成唯一文件名，防止覆盖
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

// 文件类型过滤
const fileFilter = (req, file, cb) => {
  // 允许的文件类型
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('不支持的文件类型，请上传图片文件'), false);
  }
};

// 文件大小限制（默认5MB）
const limits = {
  fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024
};

// 创建上传中间件
exports.upload = multer({
  storage,
  fileFilter,
  limits
});

// 多文件上传中间件
exports.uploadMultiple = upload.array('images', 10); // 最多上传10张图片
exports.uploadSingle = upload.single('avatar'); // 单个头像上传