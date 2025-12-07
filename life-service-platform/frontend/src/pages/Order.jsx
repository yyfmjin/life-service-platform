import React, { useState, useEffect } from 'react';
import { Table, Button, Card, Typography, Empty, message, Tag, Space } from 'antd';
import { EyeOutlined, StarOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ordersAPI } from '../services/api';

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await ordersAPI.getUserOrders();
      setOrders(response);
    } catch (error) {
      message.error('获取订单失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const columns = [
    {
      title: '订单编号',
      dataIndex: 'orderNumber',
      key: 'orderNumber',
      render: (text) => <a style={{ color: 'var(--neon-blue)' }}>{text || '无编号'}</a>,
    },
    {
      title: '服务',
      dataIndex: 'service',
      key: 'service',
      render: (service) => <span style={{ color: 'var(--text-primary)' }}>{service?.title || '未知服务'}</span>,
    },
    {
      title: '价格',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      render: (price) => <span style={{ color: 'var(--neon-pink)', fontWeight: 'bold' }}>¥{price?.toFixed(2) || '0.00'}</span>,
    },
    {
      title: '预约时间',
      dataIndex: 'scheduledDate',
      key: 'scheduledDate',
      render: (date) => <span style={{ color: 'var(--text-secondary)' }}>{date ? new Date(date).toLocaleString() : '未设置'}</span>,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const statusMap = {
          'pending': <Tag style={{ background: 'var(--neon-blue)', color: 'white' }}>待处理</Tag>,
          'confirmed': <Tag style={{ background: 'var(--neon-green)', color: 'white' }}>已确认</Tag>,
          'in_progress': <Tag style={{ background: 'var(--neon-orange)', color: 'white' }}>进行中</Tag>,
          'completed': <Tag style={{ background: 'var(--neon-purple)', color: 'white' }}>已完成</Tag>,
          'cancelled': <Tag style={{ background: '#ff4d4f', color: 'white' }}>已取消</Tag>,
        };
        return statusMap[status] || status;
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            className="neon-button"
            icon={<EyeOutlined />} 
            size="small"
            onClick={() => navigate(`/order/${record._id}`)}
          >
            查看详情
          </Button>
        </Space>
      ),
    },
  ];

  if (!user) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 160px)', padding: '20px', backgroundColor: 'var(--dark-bg)' }}>
        <Card className="neon-card" style={{ maxWidth: 400, textAlign: 'center', backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)' }}>
          <Typography.Title level={3} style={{ color: 'var(--neon-purple)' }}>请先登录</Typography.Title>
          <Button className="neon-button" onClick={() => navigate('/login')}>
            去登录
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="page-container" style={{ backgroundColor: 'var(--dark-bg)' }}>
      <div style={{ marginBottom: 24, padding: '0 15px' }}>
        <Typography.Title level={2} className="page-title" style={{ 
          color: 'var(--neon-purple)', 
          textShadow: '0 0 10px rgba(138, 43, 226, 0.7)',
          fontSize: 'clamp(1.5rem, 3vw, 2rem)'
        }}>我的订单</Typography.Title>
      </div>
      <Card style={{ 
        backgroundColor: 'var(--card-bg)', 
        border: '1px solid var(--border-color)',
        margin: '0 15px'
      }}>
        <Table
          columns={columns}
          dataSource={orders}
          rowKey="_id"
          loading={loading}
          pagination={{ 
            pageSize: 10, 
            style: { color: 'var(--text-primary)' },
            showSizeChanger: true,
            showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条订单`
          }}
          locale={{ 
            emptyText: <Empty description={<span style={{ color: 'var(--text-secondary)' }}>暂无订单</span>} /> 
          }}
          style={{ color: 'var(--text-primary)' }}
          components={{
            Header: { style: { color: 'var(--text-primary)' } },
            Body: { style: { color: 'var(--text-primary)' } },
          }}
        />
      </Card>
    </div>
  );
};

export default Order;