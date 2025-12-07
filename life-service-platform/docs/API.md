# 生活服务平台 - API文档

本文档详细介绍了生活服务平台后端提供的API接口。

## 基本信息

- **API版本**: v1
- **基础URL**: `http://localhost:5000/api/v1`
- **认证方式**: JWT Token
- **请求格式**: JSON
- **响应格式**: JSON

## 认证

### 1. 用户注册

**请求URL**: `/auth/register`
**请求方法**: POST
**认证**: 不需要

**请求参数**:

| 参数名 | 类型 | 必须 | 描述 |
|--------|------|------|------|
| name | string | 是 | 用户名 |
| email | string | 是 | 电子邮箱 |
| password | string | 是 | 密码 (至少6位) |
| phone | string | 是 | 手机号码 |

**请求示例**:

```json
{
  "name": "张三",
  "email": "zhangsan@example.com",
  "password": "123456",
  "phone": "13800138001"
}
```

**响应示例**:

```json
{
  "success": true,
  "message": "用户注册成功",
  "data": {
    "id": "60c87079a1c8b40015b4b5a5",
    "name": "张三",
    "email": "zhangsan@example.com",
    "phone": "13800138001",
    "role": "user",
    "createdAt": "2024-01-15T10:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 2. 用户登录

**请求URL**: `/auth/login`
**请求方法**: POST
**认证**: 不需要

**请求参数**:

| 参数名 | 类型 | 必须 | 描述 |
|--------|------|------|------|
| email | string | 是 | 电子邮箱 |
| password | string | 是 | 密码 |

**请求示例**:

```json
{
  "email": "zhangsan@example.com",
  "password": "123456"
}
```

**响应示例**:

```json
{
  "success": true,
  "message": "登录成功",
  "data": {
    "id": "60c87079a1c8b40015b4b5a5",
    "name": "张三",
    "email": "zhangsan@example.com",
    "phone": "13800138001",
    "role": "user",
    "createdAt": "2024-01-15T10:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## 用户管理

### 1. 获取当前用户信息

**请求URL**: `/users/profile`
**请求方法**: GET
**认证**: 需要 (JWT Token)

**响应示例**:

```json
{
  "success": true,
  "message": "获取用户信息成功",
  "data": {
    "id": "60c87079a1c8b40015b4b5a5",
    "name": "张三",
    "email": "zhangsan@example.com",
    "phone": "13800138001",
    "role": "user",
    "createdAt": "2024-01-15T10:00:00.000Z"
  }
}
```

### 2. 更新用户信息

**请求URL**: `/users/profile`
**请求方法**: PUT
**认证**: 需要 (JWT Token)

**请求参数**:

| 参数名 | 类型 | 必须 | 描述 |
|--------|------|------|------|
| name | string | 否 | 用户名 |
| phone | string | 否 | 手机号码 |
| avatar | string | 否 | 头像URL |

**请求示例**:

```json
{
  "name": "张三",
  "phone": "13800138002"
}
```

**响应示例**:

```json
{
  "success": true,
  "message": "用户信息更新成功",
  "data": {
    "id": "60c87079a1c8b40015b4b5a5",
    "name": "张三",
    "email": "zhangsan@example.com",
    "phone": "13800138002",
    "role": "user",
    "createdAt": "2024-01-15T10:00:00.000Z"
  }
}
```

## 服务管理

### 1. 获取服务列表

**请求URL**: `/services`
**请求方法**: GET
**认证**: 不需要

**查询参数**:

| 参数名 | 类型 | 描述 |
|--------|------|------|
| page | number | 页码 (默认: 1) |
| limit | number | 每页数量 (默认: 10) |
| category | string | 服务分类 |
| search | string | 搜索关键词 |

**响应示例**:

```json
{
  "success": true,
  "message": "获取服务列表成功",
  "data": {
    "services": [
      {
        "id": "60c87079a1c8b40015b4b5a6",
        "name": "家庭保洁",
        "category": "清洁服务",
        "price": 200,
        "duration": "2小时",
        "description": "专业家庭保洁服务",
        "image": "https://example.com/image.jpg",
        "status": "active",
        "createdAt": "2024-01-15T10:00:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 50,
      "itemsPerPage": 10
    }
  }
}
```

### 2. 获取服务详情

**请求URL**: `/services/:id`
**请求方法**: GET
**认证**: 不需要

**路径参数**:

| 参数名 | 类型 | 描述 |
|--------|------|------|
| id | string | 服务ID |

**响应示例**:

```json
{
  "success": true,
  "message": "获取服务详情成功",
  "data": {
    "id": "60c87079a1c8b40015b4b5a6",
    "name": "家庭保洁",
    "category": "清洁服务",
    "price": 200,
    "duration": "2小时",
    "description": "专业家庭保洁服务",
    "image": "https://example.com/image.jpg",
    "status": "active",
    "createdAt": "2024-01-15T10:00:00.000Z"
  }
}
```

## 订单管理

### 1. 创建订单

**请求URL**: `/orders`
**请求方法**: POST
**认证**: 需要 (JWT Token)

**请求参数**:

| 参数名 | 类型 | 必须 | 描述 |
|--------|------|------|------|
| serviceId | string | 是 | 服务ID |
| appointmentTime | string | 是 | 预约时间 (ISO格式) |
| notes | string | 否 | 备注信息 |

**请求示例**:

```json
{
  "serviceId": "60c87079a1c8b40015b4b5a6",
  "appointmentTime": "2024-01-20T14:00:00.000Z",
  "notes": "请携带清洁工具"
}
```

**响应示例**:

```json
{
  "success": true,
  "message": "订单创建成功",
  "data": {
    "id": "60c87079a1c8b40015b4b5a7",
    "orderNumber": "ORD20240115001",
    "userId": "60c87079a1c8b40015b4b5a5",
    "serviceId": "60c87079a1c8b40015b4b5a6",
    "serviceName": "家庭保洁",
    "price": 200,
    "status": "pending",
    "appointmentTime": "2024-01-20T14:00:00.000Z",
    "notes": "请携带清洁工具",
    "createdAt": "2024-01-15T10:00:00.000Z"
  }
}
```

### 2. 获取用户订单列表

**请求URL**: `/orders`
**请求方法**: GET
**认证**: 需要 (JWT Token)

**查询参数**:

| 参数名 | 类型 | 描述 |
|--------|------|------|
| page | number | 页码 (默认: 1) |
| limit | number | 每页数量 (默认: 10) |
| status | string | 订单状态 |

**响应示例**:

```json
{
  "success": true,
  "message": "获取订单列表成功",
  "data": {
    "orders": [
      {
        "id": "60c87079a1c8b40015b4b5a7",
        "orderNumber": "ORD20240115001",
        "serviceName": "家庭保洁",
        "price": 200,
        "status": "pending",
        "appointmentTime": "2024-01-20T14:00:00.000Z",
        "createdAt": "2024-01-15T10:00:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 2,
      "totalItems": 15,
      "itemsPerPage": 10
    }
  }
}
```

## 管理员API

以下API需要管理员权限（`role: admin`）:

### 1. 获取所有用户

**请求URL**: `/admin/users`
**请求方法**: GET
**认证**: 需要 (JWT Token)

**查询参数**:

| 参数名 | 类型 | 描述 |
|--------|------|------|
| page | number | 页码 (默认: 1) |
| limit | number | 每页数量 (默认: 10) |
| role | string | 用户角色 |
| status | string | 用户状态 |

### 2. 创建服务

**请求URL**: `/admin/services`
**请求方法**: POST
**认证**: 需要 (JWT Token)

**请求参数**:

| 参数名 | 类型 | 必须 | 描述 |
|--------|------|------|------|
| name | string | 是 | 服务名称 |
| category | string | 是 | 服务分类 |
| price | number | 是 | 服务价格 |
| duration | string | 是 | 服务时长 |
| description | string | 是 | 服务描述 |
| image | string | 是 | 服务图片URL |
| status | string | 否 | 服务状态 (默认: active) |

## 错误码

| 错误码 | 描述 |
|--------|------|
| 400 | 请求参数错误 |
| 401 | 未授权访问 |
| 403 | 禁止访问 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

**错误响应示例**:

```json
{
  "success": false,
  "message": "请求参数错误",
  "error": {
    "code": "400",
    "details": "邮箱格式不正确"
  }
}
```

## 注意事项

1. 所有需要认证的API都需要在请求头中添加 `Authorization: Bearer <token>`
2. API返回的时间戳均为ISO 8601格式
3. 所有金额单位为人民币元
4. 图片URL为示例，实际开发中应使用真实的图片存储服务