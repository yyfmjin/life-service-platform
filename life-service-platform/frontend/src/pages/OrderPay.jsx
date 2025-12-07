import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Typography, Button, Radio, message } from 'antd';
import { ordersAPI } from '../services/api';

const { Title, Text } = Typography;

const OrderPay = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('wechat');
  const [order, setOrder] = useState(null);
  const [loadingOrder, setLoadingOrder] = useState(true);

  useEffect(() => {
    // Fetch order from API
    const fetchOrder = async () => {
      try {
        setLoadingOrder(true);
        const orderData = await ordersAPI.getOrderById(id);
        setOrder(orderData);
      } catch (error) {
        message.error('获取订单信息失败');
        console.error('获取订单失败:', error);
      } finally {
        setLoadingOrder(false);
      }
    };

    if (id) {
      fetchOrder();
    }
  }, [id]);

  const handlePayment = async () => {
    if (!order) return;
    
    try {
      setLoading(true);
      // Process payment via API
      const paymentData = {
        paymentMethod: paymentMethod,
        transactionId: `TXN_${Date.now()}_${Math.floor(Math.random() * 1000)}` // 生成模拟交易ID
      };
      
      await ordersAPI.processPayment(order._id, paymentData);
      
      message.success('支付成功！');
      
      // Redirect to order detail page after successful payment
      setTimeout(() => {
        navigate(`/order/${order._id}`);
      }, 1500);
    } catch (error) {
      message.error(error.response?.data?.message || '支付失败，请稍后重试');
      console.error('支付失败:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container" style={{ backgroundColor: 'var(--dark-bg)' }}>
      <div style={{ marginBottom: 32, padding: '0 15px' }}>
        <Title level={2} className="page-title" style={{ 
          background: 'linear-gradient(90deg, var(--neon-pink), var(--neon-purple))',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent',
          fontWeight: 800,
          fontSize: 'clamp(1.5rem, 3vw, 2rem)'
        }}>
          确认订单
        </Title>
      </div>

      <Card className="neon-card" style={{ 
        backgroundColor: 'var(--card-bg)', 
        border: '1px solid var(--border-color)',
        margin: '0 15px 24px'
      }}>
        <div style={{ fontSize: 'clamp(1rem, 2vw, 1.5rem)', marginBottom: 12, color: 'var(--text-primary)' }}>
          {mockOrder.serviceTitle}
        </div>
        <div style={{ opacity: 0.8, marginBottom: 16, color: 'var(--text-secondary)' }}>
          服务时间：{mockOrder.appointmentDate}
        </div>
        <div style={{ 
          color: '#3FA3F9', 
          fontSize: 'clamp(1.2rem, 2.5vw, 1.8rem)',
          fontWeight: 'bold'
        }}>
          总计：￥{mockOrder.totalPrice}
        </div>
      </Card>

      <div style={{ marginBottom: 32, padding: '0 15px' }}>
        <Title level={2} className="page-title" style={{ 
          background: 'linear-gradient(90deg, var(--neon-pink), var(--neon-purple))',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent',
          fontWeight: 800,
          fontSize: 'clamp(1.5rem, 3vw, 2rem)'
        }}>
          选择支付方式
        </Title>
      </div>

      <Card className="neon-card" style={{ 
        backgroundColor: 'var(--card-bg)', 
        border: '1px solid var(--border-color)',
        margin: '0 15px 32px'
      }}>
        <Radio.Group value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
          <Space direction="vertical" size="middle" style={{ display: 'flex', width: '100%' }}>
            <Radio value="wechat" style={{ fontSize: '16px', color: 'var(--text-primary)' }}>
              微信支付
            </Radio>
            <Radio value="alipay" style={{ fontSize: '16px', color: 'var(--text-primary)' }}>
              支付宝支付
            </Radio>
            <Radio value="bank" style={{ fontSize: '16px', color: 'var(--text-primary)' }}>
              银行卡支付
            </Radio>
          </Space>
        </Radio.Group>
      </Card>

      <div style={{ padding: '0 15px' }}>
        <Button 
          className="neon-button" 
          type="primary" 
          size="large" 
          block 
          onClick={handlePayment} 
          loading={loading}
          style={{ 
            padding: '18px',
            borderRadius: '40px',
            border: 'none',
            fontSize: 'clamp(1rem, 2vw, 1.25rem)',
            fontWeight: 'bold'
          }}
        >
          立即支付
        </Button>
      </div>
    </div>
  );
};

export default OrderPay;