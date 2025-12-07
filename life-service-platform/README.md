# 生活服务平台

一个基于现代Web技术栈开发的生活服务平台，提供家庭服务预约、订单管理、用户管理等功能。

## 项目特性

### 前端特性
- ✅ 用户注册与登录
- ✅ 服务列表与详情查看
- ✅ 订单创建与管理
- ✅ 用户个人资料管理
- ✅ 响应式设计，适配各种设备
- ✅ 状态管理（Redux Toolkit）
- ✅ 路由管理（React Router）

### 管理端特性
- ✅ 管理员登录
- ✅ 仪表盘数据统计
- ✅ 用户管理（查看、编辑、删除）
- ✅ 服务管理（创建、编辑、删除）
- ✅ 订单管理（查看、编辑、删除）

### 后端特性
- ✅ RESTful API设计
- ✅ 用户认证与授权（JWT）
- ✅ 服务管理API
- ✅ 订单管理API
- ✅ 用户管理API
- ✅ 数据库操作（MongoDB）
- ✅ 中间件支持（日志、错误处理等）

## 技术栈

### 前端
- **框架**: React 18
- **UI组件库**: Ant Design
- **状态管理**: Redux Toolkit
- **路由**: React Router
- **HTTP请求**: Axios
- **构建工具**: Vite

### 管理端
- **框架**: React 18
- **UI组件库**: Ant Design
- **路由**: React Router
- **HTTP请求**: Axios
- **构建工具**: Vite

### 后端
- **运行环境**: Node.js
- **框架**: Express
- **数据库**: MongoDB
- **认证**: JWT
- **日志**: winston
- **验证**: Joi

## 项目结构

```
life-service-platform/
├── backend/           # 后端服务
│   ├── src/          # 源代码
│   ├── config/       # 配置文件
│   ├── middlewares/  # 中间件
│   ├── models/       # 数据模型
│   ├── routes/       # API路由
│   ├── services/     # 业务逻辑
│   └── utils/        # 工具函数
├── frontend/         # 前端应用
│   ├── src/          # 源代码
│   │   ├── assets/   # 静态资源
│   │   ├── components/ # 组件
│   │   ├── pages/    # 页面
│   │   ├── services/ # API服务
│   │   └── store/    # Redux状态管理
│   ├── public/       # 公共资源
│   └── index.html    # HTML入口
├── admin/            # 管理端应用
│   ├── src/          # 源代码
│   │   ├── components/ # 组件
│   │   ├── pages/    # 页面
│   │   └── services/ # API服务
│   └── public/       # 公共资源
├── docs/             # 项目文档
└── README.md         # 项目说明
```

## 环境要求

- Node.js >= 16.x
- npm >= 8.x
- MongoDB >= 4.x

## 安装与运行

### 1. 克隆项目

```bash
git clone <repository-url>
cd life-service-platform
```

### 2. 后端安装与运行

```bash
# 进入后端目录
cd backend

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env
# 编辑.env文件，配置数据库连接等信息

# 启动开发服务器
npm run dev
# 或启动生产服务器
npm start
```

后端服务默认运行在 `http://localhost:5000`

### 3. 前端安装与运行

```bash
# 进入前端目录
cd frontend

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

前端应用默认运行在 `http://localhost:3000`

### 4. 管理端安装与运行

```bash
# 进入管理端目录
cd admin

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

管理端应用默认运行在 `http://localhost:3001`

## API文档

API文档可在后端启动后访问：
- Swagger: `http://localhost:5000/api/v1/docs`

## 开发指南

### 代码规范

- 使用ESLint进行代码检查
- 使用Prettier进行代码格式化
- 遵循React和Node.js最佳实践

### 提交规范

提交信息应遵循以下格式：

```
<type>: <subject>

<body>

<footer>
```

类型包括：
- feat: 新功能
- fix: 修复bug
- docs: 文档更新
- style: 代码样式调整
- refactor: 代码重构
- test: 测试更新
- chore: 构建过程或辅助工具的变动

## 项目截图

（可在此处添加项目的主要页面截图）

## 许可证

MIT License

## 贡献

欢迎提交Issue和Pull Request！

## 联系方式

如有问题，请联系项目维护者。