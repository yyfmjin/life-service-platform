# 生活服务平台 - 安装指南

本指南将帮助您在本地环境中安装和运行生活服务平台项目。

## 系统要求

在开始安装之前，请确保您的系统满足以下要求：

- **操作系统**: Windows 10+, macOS, Linux
- **Node.js**: v16.x 或更高版本
- **npm**: v8.x 或更高版本
- **MongoDB**: v4.x 或更高版本
- **Git**: 用于克隆项目代码

## 安装步骤

### 1. 克隆项目代码

首先，使用Git克隆项目代码到本地：

```bash
git clone <repository-url>
cd life-service-platform
```

### 2. 安装后端依赖

进入后端目录并安装依赖：

```bash
cd backend
npm install
```

### 3. 配置后端环境变量

复制示例环境变量文件并根据需要进行配置：

```bash
cp .env.example .env
```

使用文本编辑器打开 `.env` 文件，配置以下环境变量：

```bash
# 服务器配置
PORT=5000
HOST=localhost
NODE_ENV=development

# 数据库配置
MONGO_URI=mongodb://localhost:27017/life-service-platform

# JWT配置
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d

# 日志配置
LOG_LEVEL=info

# 其他配置
API_VERSION=v1
```

### 4. 启动后端服务

启动后端开发服务器：

```bash
npm run dev
```

后端服务将在 `http://localhost:5000` 启动。

### 5. 安装前端依赖

打开一个新的终端窗口，进入前端目录并安装依赖：

```bash
cd frontend
npm install
```

### 6. 配置前端环境变量

复制示例环境变量文件：

```bash
cp .env.example .env
```

默认配置通常可以满足开发需求，如果需要修改，可以编辑 `.env` 文件：

```bash
VITE_API_BASE_URL=http://localhost:5000/api/v1
VITE_APP_NAME=生活服务平台
VITE_APP_VERSION=1.0.0
VITE_APP_ENV=development
```

### 7. 启动前端开发服务器

启动前端开发服务器：

```bash
npm run dev
```

前端应用将在 `http://localhost:3000` 启动。

### 8. 安装管理端依赖

打开一个新的终端窗口，进入管理端目录并安装依赖：

```bash
cd admin
npm install
```

### 9. 配置管理端环境变量

复制示例环境变量文件：

```bash
cp .env.example .env
```

默认配置通常可以满足开发需求，如果需要修改，可以编辑 `.env` 文件：

```bash
VITE_API_BASE_URL=http://localhost:5000/api/v1
VITE_APP_NAME=管理后台
VITE_APP_VERSION=1.0.0
VITE_APP_ENV=development
```

### 10. 启动管理端开发服务器

启动管理端开发服务器：

```bash
npm run dev
```

管理端应用将在 `http://localhost:3001` 启动。

## 验证安装

安装完成后，您可以通过以下方式验证项目是否正常运行：

1. 访问前端应用：`http://localhost:3000`
2. 访问管理端应用：`http://localhost:3001`
3. 检查后端API是否正常响应：`http://localhost:5000/api/v1/health`

## 常见问题

### 1. MongoDB连接失败

确保MongoDB服务已启动：

- **Windows**: 启动MongoDB服务
- **macOS**: `brew services start mongodb-community`
- **Linux**: `sudo systemctl start mongod`

### 2. 端口被占用

如果端口被占用，可以修改环境变量中的端口号：

- 后端：修改 `.env` 文件中的 `PORT` 变量
- 前端：修改 `vite.config.js` 文件中的 `server.port` 配置
- 管理端：修改 `vite.config.js` 文件中的 `server.port` 配置

### 3. 依赖安装失败

尝试使用npm的最新版本：

```bash
npm install -g npm@latest
```

或者使用yarn代替npm：

```bash
npm install -g yarn
yarn install
```

## 下一步

- 查看 [开发指南](DEVELOPMENT.md) 了解如何开发新功能
- 查看 [API文档](API.md) 了解API接口详情
- 查看 [部署指南](DEPLOYMENT.md) 了解如何部署到生产环境

如果您在安装过程中遇到任何问题，请参考 [故障排除](TROUBLESHOOTING.md) 或提交Issue。