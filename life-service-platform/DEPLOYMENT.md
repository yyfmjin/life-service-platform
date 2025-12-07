# 生活服务平台部署教程

本教程将指导您在服务器上部署生活服务平台，包括前端、后端和数据库的完整配置。

## 服务器准备

### 1. 服务器要求
- 操作系统：Ubuntu 20.04 LTS 或更高版本
- CPU：至少 2 核
- 内存：至少 4 GB RAM
- 存储空间：至少 50 GB
- 网络：具备公网 IP 地址

### 2. 系统更新
```bash
# 更新系统包
sudo apt update
sudo apt upgrade -y
```

### 3. 安装必要依赖
```bash
# 安装构建工具和依赖
sudo apt install -y build-essential git curl wget
```

## 数据库安装与配置

### 1. 安装 MongoDB
```bash
# 导入 MongoDB 公钥
curl -fsSL https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

# 添加 MongoDB 源
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# 更新并安装 MongoDB
sudo apt update
sudo apt install -y mongodb-org

# 启动 MongoDB 服务
sudo systemctl start mongod
sudo systemctl enable mongod

# 验证 MongoDB 运行状态
sudo systemctl status mongod
```

### 2. 配置 MongoDB
```bash
# 进入 MongoDB Shell
mongosh

# 创建数据库和用户
use life-service-platform

# 创建管理员用户
db.createUser({
  user: "admin",
  pwd: "your_secure_password",
  roles: [{ role: "userAdminAnyDatabase", db: "admin" }, "readWriteAnyDatabase"]
})

# 创建应用用户
db.createUser({
  user: "app_user",
  pwd: "your_app_password",
  roles: [{ role: "readWrite", db: "life-service-platform" }]
})

# 退出 MongoDB Shell
exit
```

### 3. 启用 MongoDB 认证
```bash
# 修改 MongoDB 配置文件
sudo nano /etc/mongod.conf

# 在 security 部分添加以下内容
security:
  authorization: enabled

# 重启 MongoDB 服务
sudo systemctl restart mongod
```

## 安装 Node.js

```bash
# 安装 Node.js 16 LTS
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt install -y nodejs

# 安装 npm
npm install -g npm@latest

# 验证 Node.js 和 npm 版本
node -v
npm -v
```

## 安装 PM2（进程管理工具）

```bash
npm install -g pm2

# 设置 PM2 开机自启
pm install -g pm2-pyenv-installer
pm install -g pm2-logrotate
pm install -g pm2-windows-startup

# 在 Ubuntu 上设置 PM2 开机自启
pm install -g pm2-logrotate
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u $USER --hp $HOME
```

## 部署后端服务

### 1. 克隆代码
```bash
cd /opt
sudo git clone https://github.com/your-repository/life-service-platform.git
sudo chown -R $USER:$USER life-service-platform
cd life-service-platform/backend
```

### 2. 安装依赖
```bash
npm install
```

### 3. 配置环境变量
```bash
cp .env.example .env
nano .env

# 修改以下配置
PORT=5000
NODE_ENV=production
MONGO_URI=mongodb://app_user:your_app_password@localhost:27017/life-service-platform?authSource=life-service-platform
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5000000
```

### 4. 创建上传目录
```bash
mkdir -p uploads
chmod 755 uploads
```

### 5. 启动后端服务
```bash
# 使用 PM2 启动后端服务
pm run build  # 如果有构建脚本
pm run start

# 或者使用 PM2 直接启动
pm run start

# 保存 PM2 进程列表
sudo pm2 save
```

## 部署前端服务

### 1. 进入前端目录
```bash
cd /opt/life-service-platform/frontend
```

### 2. 安装依赖
```bash
npm install
```

### 3. 配置环境变量
```bash
cp .env.example .env
nano .env

# 修改以下配置
VITE_API_URL=http://your_server_ip:5000/api  # 后端 API 地址
VITE_BASE_URL=http://your_server_ip:3000  # 前端访问地址
```

### 4. 构建前端项目
```bash
npm run build
```

### 5. 部署前端文件
```bash
# 将构建好的文件复制到 Nginx 根目录
sudo cp -r dist/* /var/www/html/

# 或者使用 PM2 启动前端服务（如果不使用 Nginx）
npm install -g serve
pm run serve
```

## 安装和配置 Nginx

### 1. 安装 Nginx
```bash
sudo apt install -y nginx
```

### 2. 配置 Nginx 虚拟主机
```bash
# 创建前端配置文件
sudo nano /etc/nginx/sites-available/frontend.conf

# 添加以下内容
server {
    listen 80;
    server_name your_domain.com www.your_domain.com;
    root /var/www/html;
    index index.html index.htm;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
    
    # 静态文件缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}

# 激活配置文件
sudo ln -s /etc/nginx/sites-available/frontend.conf /etc/nginx/sites-enabled/

# 测试 Nginx 配置
sudo nginx -t

# 重启 Nginx
sudo systemctl restart nginx
```

### 3. 配置防火墙
```bash
# 允许 HTTP 和 HTTPS 流量
sudo ufw allow 'Nginx Full'

# 允许 SSH 流量
sudo ufw allow ssh

# 启用防火墙
sudo ufw enable
```

## 配置 SSL 证书（可选但推荐）

### 1. 安装 Certbot
```bash
sudo apt install -y certbot python3-certbot-nginx
```

### 2. 申请 SSL 证书
```bash
sudo certbot --nginx -d your_domain.com -d www.your_domain.com
```

### 3. 自动更新 SSL 证书
```bash
sudo certbot renew --dry-run
```

## 部署商家后台（可选）

```bash
cd /opt/life-service-platform/admin

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env
nano .env

# 构建项目
npm run build

# 部署到 Nginx
mkdir -p /var/www/admin
cp -r dist/* /var/www/admin/

# 配置 Nginx
sudo nano /etc/nginx/sites-available/admin.conf

# 添加以下内容
server {
    listen 80;
    server_name admin.your_domain.com;
    root /var/www/admin;
    index index.html index.htm;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# 激活配置
sudo ln -s /etc/nginx/sites-available/admin.conf /etc/nginx/sites-enabled/

# 重启 Nginx
sudo systemctl restart nginx

# 为商家后台配置 SSL
sudo certbot --nginx -d admin.your_domain.com
```

## 测试验证

### 1. 检查后端服务
```bash
# 检查后端服务状态
sudo pm2 status

# 查看后端日志
sudo pm2 logs backend
```

### 2. 访问前端页面
- 主页面：http://your_domain.com
- 商家后台：http://admin.your_domain.com

### 3. 测试 API 接口
```bash
curl -X GET http://your_domain.com/api/services
```

## 常见问题与解决方案

### 1. MongoDB 连接失败
- 检查 MongoDB 服务是否运行：`sudo systemctl status mongod`
- 检查连接字符串是否正确：`nano /opt/life-service-platform/backend/.env`
- 检查 MongoDB 认证配置：`nano /etc/mongod.conf`

### 2. 前端无法访问后端 API
- 检查 Nginx 配置：`sudo nginx -t`
- 检查防火墙设置：`sudo ufw status`
- 检查后端服务是否运行：`sudo pm2 status`

### 3. 上传文件失败
- 检查上传目录权限：`chmod 755 /opt/life-service-platform/backend/uploads`
- 检查文件大小限制：`nano /etc/nginx/nginx.conf`（修改 client_max_body_size）

### 4. PM2 服务重启失败
- 检查日志：`sudo pm2 logs`
- 重新启动：`sudo pm2 restart all`
- 检查环境变量：`cat /opt/life-service-platform/backend/.env`

## 日常维护

### 1. 更新代码
```bash
# 更新后端代码
cd /opt/life-service-platform/backend
git pull
npm install
npm run build  # 如果有构建脚本
sudo pm2 restart backend

# 更新前端代码
cd /opt/life-service-platform/frontend
git pull
npm install
npm run build
sudo cp -r dist/* /var/www/html/
```

### 2. 查看日志
```bash
# 查看后端日志
sudo pm2 logs backend

# 查看 Nginx 日志
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### 3. 备份数据库
```bash
# 备份数据库
mongodump --db life-service-platform --username app_user --password your_app_password --authenticationDatabase life-service-platform --out /backup/mongodb/

# 恢复数据库
mongorestore --db life-service-platform --username app_user --password your_app_password --authenticationDatabase life-service-platform /backup/mongodb/life-service-platform
```

### 4. 监控服务器状态
```bash
# 安装监控工具
sudo apt install -y htop iotop nmon

# 使用 htop 监控系统资源
htop

# 监控磁盘使用情况
df -h
```

## 安全建议

1. 定期更新系统和依赖
2. 使用强密码和密钥
3. 限制 SSH 访问（使用密钥登录，禁用密码登录）
4. 配置防火墙，只开放必要的端口
5. 使用 HTTPS 加密传输
6. 定期备份数据库和重要文件
7. 监控服务器日志，及时发现异常

---

以上是生活服务平台的完整部署教程。如果您在部署过程中遇到任何问题，请参考常见问题与解决方案部分，或查阅相关文档获取更多帮助。