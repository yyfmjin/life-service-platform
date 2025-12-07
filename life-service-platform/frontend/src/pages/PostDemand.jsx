import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message, Select, DatePicker, InputNumber } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const { Title } = Typography;
const { TextArea } = Input;

const PostDemand = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  // 需求类型选项
  const demandTypes = [
    { value: 'guide', label: '导游服务' },
    { value: 'food', label: '美食体验' },
    { value: 'performance', label: '文化表演' },
    { value: 'transport', label: '交通服务' },
    { value: 'accommodation', label: '住宿预订' },
    { value: 'other', label: '其他服务' }
  ];

  const onFinish = async (values) => {
    try {
      setLoading(true);
      // 在实际应用中，这里需要调用API提交需求
      console.log('发布需求:', values);
      message.success('需求发布成功，待管理员审核');
      navigate('/');
    } catch (error) {
      message.error('发布失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="page-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 160px)', backgroundColor: 'var(--dark-bg)' }}>
        <Card className="neon-card" style={{ maxWidth: 400, textAlign: 'center', backgroundColor: 'var(--card-bg)', border: '1px solid var(--neon-purple)', margin: '0 15px' }}>
          <Title level={3} style={{ color: 'var(--neon-purple)', fontSize: 'clamp(1.2rem, 2.5vw, 1.8rem)' }}>请先登录</Title>
          <Button 
            type="primary" 
            className="neon-button"
            onClick={() => navigate('/login')}
          >
            去登录
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="page-container" style={{ backgroundColor: 'var(--dark-bg)' }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ color: 'var(--neon-green)', textShadow: '0 0 10px rgba(50, 205, 50, 0.7)', fontSize: 'clamp(1.5rem, 3vw, 2rem)' }}>
          <PlusOutlined /> 发布需求
        </Title>
      </div>
      <Card className="neon-card" style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', margin: '0 15px' }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            contact: user.phone || '',
            type: 'other'
          }}
        >
          <Form.Item
            name="title"
            label="需求标题"
            rules={[{ required: true, message: '请输入需求标题!' }]}
          >
            <Input 
              placeholder="请输入需求标题"
              style={{ backgroundColor: 'var(--input-bg)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
            />
          </Form.Item>

          <Form.Item
            name="type"
            label="需求类型"
            rules={[{ required: true, message: '请选择需求类型!' }]}
          >
            <Select 
              placeholder="请选择需求类型"
              style={{ backgroundColor: 'var(--input-bg)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
              options={demandTypes}
            />
          </Form.Item>

          <Form.Item
            name="description"
            label="需求描述"
            rules={[{ required: true, message: '请详细描述您的需求!' }]}
          >
            <TextArea 
              rows={6} 
              placeholder="请详细描述您的需求，包括时间、地点、人数等信息"
              style={{ backgroundColor: 'var(--input-bg)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
            />
          </Form.Item>

          <Form.Item
            name="budget"
            label="期望预算"
            rules={[{ required: true, message: '请输入期望预算!' }]}
          >
            <InputNumber
              style={{ width: '100%', backgroundColor: 'var(--input-bg)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
              formatter={value => `￥${value}`}
              parser={value => value.replace(/￥/, '')}
              placeholder="请输入期望预算"
              min={0}
            />
          </Form.Item>

          <Form.Item
            name="expectedDate"
            label="期望完成时间"
            rules={[{ required: true, message: '请选择期望完成时间!' }]}
          >
            <DatePicker 
              style={{ width: '100%', backgroundColor: 'var(--input-bg)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
              placeholder="请选择期望完成时间"
            />
          </Form.Item>

          <Form.Item
            name="contact"
            label="联系方式"
            rules={[{ required: true, message: '请输入联系方式!' }]}
          >
            <Input 
              placeholder="请输入手机号码"
              style={{ backgroundColor: 'var(--input-bg)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
            />
          </Form.Item>

          <Form.Item
            name="remark"
            label="备注信息"
          >
            <TextArea 
              rows={3} 
              placeholder="其他需要说明的信息"
              style={{ backgroundColor: 'var(--input-bg)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
            />
          </Form.Item>

          <Form.Item>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button 
                type="default" 
                onClick={() => navigate('/')}
                style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
              >
                取消
              </Button>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading}
                className="neon-button"
                size="large"
              >
                发布需求
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default PostDemand;