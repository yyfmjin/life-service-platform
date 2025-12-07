import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Typography, List, Tag, Button } from 'antd';
import { UserOutlined, ServiceOutlined, FileTextOutlined, DollarOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

// 模拟数据
const mockStatistics = {
  totalUsers: 128,
  totalServices: 45,
  totalOrders: 326,
  totalRevenue: 158900,
};

const mockRecentOrders = [
  {
    id: 1,
    orderNumber: 'ORD20240101001',
    service: '家庭保洁',
    user: '张三',
    price: 200,
    status: '已完成',
    date: '2024-01-15T14:30:00',
  },
  {
    id: 2,
    orderNumber: 'ORD20240101002',
    service: '家电维修',
    user: '李四',
    price: 350,
    status: '进行中',
    date: '2024-01-15T15:45:00',
  },
  {
    id: 3,
    orderNumber: 'ORD20240101003',
    service: '管道疏通',
    user: '王五',
    price: 180,
    status: '待处理',
    date: '2024-01-15T16:20:00',
  },
];

const Dashboard = () => {
  const [statistics, setStatistics] = useState(mockStatistics);
  const [recentOrders, setRecentOrders] = useState(mockRecentOrders);

  useEffect(() => {
    // 模拟API请求获取数据
    // 实际项目中应该调用真实的API
    // fetch('/api/statistics')
    //   .then(res => res.json())
    //   .then(data => setStatistics(data));
    
    // fetch('/api/orders?limit=5&sort=-createdAt')
    //   .then(res => res.json())
    //   .then(data => setRecentOrders(data));
  }, []);

  const getStatusTag = (status) => {
    switch (status) {
      case '待处理':
        return <Tag color="default">待处理</Tag>;
      case '进行中':
        return <Tag color="processing">进行中</Tag>;
      case '已完成':
        return <Tag color="success">已完成</Tag>;
      case '已取消':
        return <Tag color="error">已取消</Tag>;
      default:
        return <Tag>{status}</Tag>;
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={2} className="page-title">仪表盘</Title>
        <Link to="/services/create">
          <Button type="primary" icon={<ServiceOutlined />}>新增服务</Button>
        </Link>
      </div>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card hoverable>
            <Statistic
              title="总用户数"
              value={statistics.totalUsers}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card hoverable>
            <Statistic
              title="总服务数"
              value={statistics.totalServices}
              prefix={<ServiceOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card hoverable>
            <Statistic
              title="总订单数"
              value={statistics.totalOrders}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card hoverable>
            <Statistic
              title="总收入"
              value={statistics.totalRevenue}
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#faad14' }}
              formatter={(value) => `¥${value.toLocaleString()}`}
            />
          </Card>
        </Col>
      </Row>

      {/* 最近订单 */}
      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={12}>
          <Card title="最近订单" extra={<Link to="/orders">查看全部</Link>}>
            <List
              dataSource={recentOrders}
              renderItem={(item) => (
                <List.Item
                  key={item.id}
                  actions={[getStatusTag(item.status), <Text strong>¥{item.price}</Text>]}
                >
                  <List.Item.Meta
                    title={<Link to={`/orders/${item.id}`}>{item.orderNumber}</Link>}
                    description={
                      <div>
                        <div>{item.service}</div>
                        <div style={{ fontSize: 12, color: '#999' }}>
                          {item.user} • {dayjs(item.date).format('YYYY-MM-DD HH:mm')}
                        </div>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
        
        {/* 数据概览 */}
        <Col xs={24} lg={12}>
          <Card title="数据概览">
            <div style={{ display: 'flex', justifyContent: 'space-around', padding: '20px 0' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 24, fontWeight: 600, color: '#1890ff' }}>28%</div>
                <div style={{ fontSize: 14, color: '#999' }}>用户增长率</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 24, fontWeight: 600, color: '#52c41a' }}>15%</div>
                <div style={{ fontSize: 14, color: '#999' }}>服务增长率</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 24, fontWeight: 600, color: '#faad14' }}>32%</div>
                <div style={{ fontSize: 14, color: '#999' }}>订单增长率</div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;