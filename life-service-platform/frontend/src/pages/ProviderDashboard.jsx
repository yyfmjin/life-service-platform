import React, { useState, useEffect } from 'react';
import { Table, Button, Card, Typography, message, Tag, Space, Select } from 'antd';
import { EyeOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ordersAPI } from '../services/api';

const { Title } = Typography;
const { Option } = Select;

const ProviderDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await ordersAPI.getProviderOrders();
      setOrders(response);
    } catch (error) {
      message.error('获取订单失败');
      console.error('获取订单失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role === 'provider') {
      fetchOrders();
    } else if (user) {
      message.error('您不是服务提供商，无法访问此页面');
      navigate('/');
    } else {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await ordersAPI.updateOrderStatus(orderId, { status: newStatus });
      message.success('订单状态更新成功');
      fetchOrders();
    } catch (error) {
      message.error('订单状态更新失败');
      console.error('更新订单状态失败:', error);
    }
  };

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
      title: '用户',
      dataIndex: 'user',
      key: 'user',
      render: (user) => <span style={{ color: 'var(--text-primary)' }}>{user?.name || '未知用户'}</span>,
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
      render: (date) => <span style={{ color: 'var(--text-secondary)' }}>{new Date(date).toLocaleString()}</span>,
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
          {record.status === 'pending' && (
            <Button 
              type="primary" 
              icon={<CheckCircleOutlined />} 
              size="small"
              onClick={() => handleStatusChange(record._id, 'confirmed')}
            >
              接单
            </Button>
          )}
          {record.status === 'confirmed' && (
            <Button 
              type="primary" 
              icon={<CheckCircleOutlined />} 
              size="small"
              onClick={() => handleStatusChange(record._id, 'in_progress')}
            >
              开始服务
            </Button>
          )}
          {record.status === 'in_progress' && (
            <Button 
              type="success" 
              icon={<CheckCircleOutlined />} 
              size="small"
              onClick={() => handleStatusChange(record._id, 'completed')}
            >
              完成服务
            </Button>
          )}
        </Space>
      ),
    },
  ];

  if (!user) {
    return null;
  }

  return (
    <div className="page-container" style={{ backgroundColor: 'var(--dark-bg)' }}>
      <div style={{ marginBottom: 24, padding: '0 15px' }}>
        <Title level={2} className="page-title" style={{ 
          color: 'var(--neon-purple)', 
          textShadow: '0 0 10px rgba(138, 43, 226, 0.7)',
          fontSize: 'clamp(1.5rem, 3vw, 2rem)'
        }}>商家后台</Title>
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
          style={{ color: 'var(--text-primary)' }}
        />
      </Card>
    </div>
  );
};

export default ProviderDashboard;