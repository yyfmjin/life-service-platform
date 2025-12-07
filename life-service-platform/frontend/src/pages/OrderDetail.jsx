import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Typography, Button, Space, Divider, Tag, message } from 'antd';
import { CalendarOutlined, ClockCircleOutlined, CreditCardOutlined, StarOutlined, UserOutlined, PhoneOutlined, HomeOutlined } from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import { ordersAPI } from '../services/api';

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);

  // 获取订单详情
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchOrder = async () => {
      try {
        setLoading(true);
        const orderData = await ordersAPI.getOrderById(id);
        setOrder(orderData);
      } catch (error) {
        message.error('获取订单详情失败');
        console.error('获取订单详情失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, user, navigate]);

  // 导航到支付页面
  const handlePayment = () => {
    if (order) {
      navigate(`/order/pay/${order._id}`);
    }
  };

  // 取消订单
  const handleCancelOrder = async () => {
    try {
      setUpdating(true);
      await ordersAPI.updateOrderStatus(id, 'cancelled');
      message.success('订单已取消');
      // 重新获取订单信息
      const updatedOrder = await ordersAPI.getOrderById(id);
      setOrder(updatedOrder);
    } catch (error) {
      message.error('取消订单失败');
      console.error('取消订单失败:', error);
    } finally {
      setUpdating(false);
    }
  };

  // 获取订单状态标签
  const getStatusTag = (status) => {
    const statusConfig = {
      pending: { color: 'orange', text: '待支付' },
      confirmed: { color: 'blue', text: '已确认' },
      in_progress: { color: 'purple', text: '服务中' },
      completed: { color: 'green', text: '已完成' },
      cancelled: { color: 'red', text: '已取消' },
      paid: { color: 'cyan', text: '已支付' }
    };

    const config = statusConfig[status] || { color: 'default', text: '未知状态' };
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  if (loading || !order) {
    return <div className="container" style={{ color: 'var(--text-primary)', textAlign: 'center', padding: '50px 0' }}>加载中...</div>;
  }

  return (
    <div className="page-container" style={{ backgroundColor: 'var(--dark-bg)', padding: '20px' }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={2} className="page-title" style={{ 
          color: 'var(--neon-purple)', 
          textShadow: '0 0 10px rgba(138, 43, 226, 0.7)',
          fontSize: 'clamp(1.5rem, 3vw, 2rem)'
        }}>订单详情</Title>
        <div style={{ marginTop: 8 }}>
          <Text strong style={{ color: 'var(--text-primary)', marginRight: 16 }}>订单号：{order.orderNumber}</Text>
          {getStatusTag(order.status)}
        </div>
      </div>

      <Space direction="vertical" size="large" style={{ display: 'flex', width: '100%' }}>
        {/* 服务信息卡片 */}
        <Card className="neon-card" style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)' }}>
          <Title level={4} style={{ color: 'var(--neon-pink)', marginBottom: 16 }}>服务信息</Title>
          <Space direction="horizontal" size="large" style={{ display: 'flex', width: '100%', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 300px' }}>
              <img 
                src={order.service?.image || 'https://via.placeholder.com/600x400?text=服务图片'} 
                alt={order.service?.title} 
                style={{ width: '100%', maxWidth: '300px', height: '200px', objectFit: 'cover', borderRadius: '8px' }}
              />
            </div>
            <div style={{ flex: '1 1 400px' }}>
              <Title level={5} style={{ color: 'var(--text-primary)', marginTop: 0 }}>{order.service?.title}</Title>
              <Space size="large" style={{ marginBottom: '16px' }}>
                <div className="flex-center">
                  <ClockCircleOutlined style={{ color: 'var(--neon-blue)', marginRight: '4px' }} />
                  <Text style={{ color: 'var(--text-primary)' }}>{order.service?.duration || 1} 小时</Text>
                </div>
              </Space>
              <Text style={{ color: 'var(--text-secondary)' }}>{order.service?.description}</Text>
              <div style={{ marginTop: '16px' }}>
                <Text strong style={{ color: 'var(--text-primary)' }}>服务提供商：</Text>
                <Text style={{ color: 'var(--text-primary)' }}>{order.service?.provider?.name || '未知商家'}</Text>
              </div>
            </div>
            <div style={{ flex: '0 1 200px' }}>
              <Card className="neon-card" style={{ backgroundColor: 'rgba(30, 30, 30, 0.8)', border: '1px solid var(--neon-purple)' }}>
                <Text strong style={{ color: 'var(--text-primary)' }}>服务价格</Text>
                <div style={{ marginTop: '8px', marginBottom: '16px' }}>
                  <Text strong style={{ fontSize: '24px', color: 'var(--neon-pink)' }}>￥{order.totalAmount?.toFixed(2) || '0.00'}</Text>
                </div>
              </Card>
            </div>
          </Space>
        </Card>

        {/* 订单信息 */}
        <Card className="neon-card" style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)' }}>
          <Title level={4} style={{ color: 'var(--neon-blue)', marginBottom: 16 }}>订单信息</Title>
          <Space direction="vertical" size="middle" style={{ display: 'flex', width: '100%' }}>
            <div className="flex-between">
              <Text style={{ color: 'var(--text-primary)' }}>下单时间</Text>
              <Text style={{ color: 'var(--text-primary)' }}>{new Date(order.createdAt).toLocaleString()}</Text>
            </div>
            <div className="flex-between">
              <Text style={{ color: 'var(--text-primary)' }}>预约时间</Text>
              <Text style={{ color: 'var(--text-primary)' }}>{new Date(order.scheduledDate).toLocaleString()}</Text>
            </div>
            <div className="flex-between">
              <Text style={{ color: 'var(--text-primary)' }}>服务地址</Text>
              <Text style={{ color: 'var(--text-primary)' }}>{order.address}</Text>
            </div>
            <div className="flex-between">
              <Text style={{ color: 'var(--text-primary)' }}>联系电话</Text>
              <Text style={{ color: 'var(--text-primary)' }}>{order.phone}</Text>
            </div>
            <div className="flex-between">
              <Text style={{ color: 'var(--text-primary)' }}>支付方式</Text>
              <Text style={{ color: 'var(--text-primary)' }}>{order.paymentMethod === 'wechat' ? '微信支付' : order.paymentMethod === 'alipay' ? '支付宝' : order.paymentMethod || '未选择'}</Text>
            </div>
            {order.notes && (
              <div className="flex-between">
                <Text style={{ color: 'var(--text-primary)' }}>备注信息</Text>
                <Text style={{ color: 'var(--text-primary)' }}>{order.notes}</Text>
              </div>
            )}
          </Space>
        </Card>

        {/* 用户信息 */}
        <Card className="neon-card" style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)' }}>
          <Title level={4} style={{ color: 'var(--neon-green)', marginBottom: 16 }}>用户信息</Title>
          <Space direction="vertical" size="middle" style={{ display: 'flex', width: '100%' }}>
            <div className="flex-between">
              <Text style={{ color: 'var(--text-primary)' }}>用户姓名</Text>
              <Text style={{ color: 'var(--text-primary)' }}>{order.user?.name || user?.name}</Text>
            </div>
            <div className="flex-between">
              <Text style={{ color: 'var(--text-primary)' }}>用户邮箱</Text>
              <Text style={{ color: 'var(--text-primary)' }}>{order.user?.email || user?.email}</Text>
            </div>
          </Space>
        </Card>

        {/* 操作按钮 */}
        <Card className="neon-card" style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)' }}>
          <Title level={4} style={{ color: 'var(--neon-orange)', marginBottom: 16 }}>订单操作</Title>
          <Space wrap style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            {order.status === 'pending' && (
              <Button 
                className="neon-button" 
                type="primary" 
                size="large" 
                onClick={handlePayment} 
                loading={updating}
                style={{ fontSize: '16px', padding: '12px 24px' }}
              >
                立即支付
              </Button>
            )}
            {(['pending', 'confirmed']).includes(order.status) && (
              <Button 
                type="default" 
                size="large" 
                onClick={handleCancelOrder} 
                loading={updating}
                style={{ fontSize: '16px', padding: '12px 24px' }}
              >
                取消订单
              </Button>
            )}
            {(order.status === 'completed') && (
              <Button 
                type="default" 
                size="large" 
                onClick={() => message.info('评价功能开发中...')}
                style={{ fontSize: '16px', padding: '12px 24px' }}
              >
                评价服务
              </Button>
            )}
          </Space>
        </Card>
      </Space>
    </div>
  );
};

export default OrderDetail;