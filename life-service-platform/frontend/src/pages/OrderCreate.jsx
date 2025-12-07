import React, { useState, useEffect } from 'react';
import { Card, Typography, Form, Input, Button, DatePicker, message, Select } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ordersAPI, servicesAPI } from '../services/api';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;

const OrderCreate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [service, setService] = useState(null);

  // 获取服务详情
  useEffect(() => {
    const fetchService = async () => {
      try {
        setLoading(true);
        const serviceData = await servicesAPI.getServiceById(id);
        setService(serviceData);
      } catch (error) {
        message.error('获取服务信息失败');
        console.error('获取服务详情失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [id]);

  const handleSubmit = async (values) => {
    if (!service) {
      message.error('服务信息不存在');
      return;
    }

    try {
      setLoading(true);
      // 构造订单数据
      const orderData = {
        serviceId: service._id || service.id,
        scheduledDate: values.appointmentDate.toISOString(),
        address: user?.address || '默认地址',
        phone: user?.phone || '13800138000',
        quantity: 1,
        notes: values.description,
        paymentMethod: 'wechat' // 默认支付方式
      };
      
      // 调用API创建订单
      const newOrder = await ordersAPI.createOrder(orderData);
      message.success('订单创建成功！');
      
      // 导航到订单详情页
      navigate(`/order/${newOrder._id}`);
    } catch (error) {
      message.error('订单创建失败，请稍后重试');
      console.error('创建订单失败:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container" style={{ backgroundColor: 'var(--dark-bg)' }}>
      <Title level={2} className="page-title" style={{ 
        color: 'var(--neon-purple)', 
        marginBottom: 32, 
        textAlign: 'center',
        fontSize: 'clamp(1.5rem, 3vw, 2rem)'
      }}>
        预约服务
      </Title>
      
      <Card style={{ 
        backgroundColor: 'var(--card-bg)', 
        border: '1px solid var(--border-color)',
        margin: '0 15px'
      }} loading={loading}>
        {service && (
          <div style={{ marginBottom: 24 }}>
            <Title level={4} style={{ color: 'var(--neon-pink)', marginBottom: 16 }}>服务信息</Title>
            <div style={{ padding: 16, backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: 8 }}>
              <div className="flex-between mb-2">
                <Text style={{ color: 'var(--text-primary)' }}>服务名称</Text>
                <Text strong style={{ color: 'var(--text-primary)' }}>{service.title}</Text>
              </div>
              <div className="flex-between mb-2">
                <Text style={{ color: 'var(--text-primary)' }}>服务价格</Text>
                <Text strong style={{ color: 'var(--neon-pink)' }}>¥{(service.price || 0).toFixed(2)}</Text>
              </div>
              <div className="flex-between">
                <Text style={{ color: 'var(--text-primary)' }}>服务时长</Text>
                <Text style={{ color: 'var(--text-primary)' }}>{service.duration || 1} 小时</Text>
              </div>
            </div>
          </div>
        )}
        
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            appointmentDate: dayjs().add(1, 'day').hour(9).minute(0)
          }}
        >
          <Form.Item
            name="appointmentDate"
            label={<span style={{ color: 'var(--text-primary)' }}>预约时间</span>}
            rules={[{ required: true, message: '请选择预约时间' }]}
          >
            <DatePicker
              style={{ width: '100%', color: 'var(--text-primary)' }}
              showTime
              format="YYYY-MM-DD HH:mm"
              disabledDate={(current) => current && current < dayjs().startOf('day')}
            />
          </Form.Item>
          
          <Form.Item
            name="description"
            label={<span style={{ color: 'var(--text-primary)' }}>备注说明</span>}
          >
            <Input.TextArea
              rows={4}
              placeholder="请输入特殊要求或备注信息"
              style={{ color: 'var(--text-primary)', backgroundColor: 'var(--input-bg)' }}
            />
          </Form.Item>
          
          <Form.Item style={{ textAlign: 'center', marginTop: 32 }}>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={loading}
              className="neon-button"
              style={{ minWidth: 150 }}
            >
              确认预约
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default OrderCreate;