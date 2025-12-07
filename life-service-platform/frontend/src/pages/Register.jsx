import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, Typography, Space, message } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined, PhoneOutlined } from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';

const { Title } = Typography;

const Register = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const onFinish = async (values) => {
    try {
      setLoading(true);
      await register(values);
      message.success('注册成功，请登录');
      navigate('/login');
    } catch (error) {
      message.error(error.response?.data?.message || '注册失败，请检查输入信息');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 160px)', padding: '20px', backgroundColor: 'var(--dark-bg)' }}>
      <Card className="neon-card" style={{ maxWidth: 400, width: '100%', margin: '0 15px', backgroundColor: 'var(--card-bg)', border: '1px solid var(--neon-purple)' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Title level={2} style={{ color: 'var(--neon-purple)', fontSize: 'clamp(1.5rem, 3vw, 2rem)' }}>注册</Title>
          <p style={{ color: 'var(--text-primary)' }}>创建新账户</p>
        </div>
        <Form
          name="register"
          onFinish={onFinish}
        >
          <Form.Item
            name="name"
            rules={[{ required: true, message: '请输入用户名!' }]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="用户名"
              style={{ backgroundColor: 'var(--input-bg)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
            />
          </Form.Item>
          <Form.Item
            name="email"
            rules={[
              { required: true, message: '请输入邮箱地址!' },
              { type: 'email', message: '请输入有效的邮箱地址!' }
            ]}
          >
            <Input 
              prefix={<MailOutlined />} 
              placeholder="邮箱"
              style={{ backgroundColor: 'var(--input-bg)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
            />
          </Form.Item>
          <Form.Item
            name="phone"
            rules={[{ required: true, message: '请输入手机号码!' }]}
          >
            <Input 
              prefix={<PhoneOutlined />} 
              placeholder="手机号码"
              style={{ backgroundColor: 'var(--input-bg)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              { required: true, message: '请输入密码!' },
              { min: 6, message: '密码长度不能少于6位!' }
            ]}
          >
            <Input.Password 
              prefix={<LockOutlined />} 
              placeholder="密码"
              style={{ backgroundColor: 'var(--input-bg)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
            />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: '请确认密码!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次输入的密码不一致!'));
                },
              }),
            ]}
          >
            <Input.Password 
              prefix={<LockOutlined />} 
              placeholder="确认密码"
              style={{ backgroundColor: 'var(--input-bg)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
            />
          </Form.Item>
          <Form.Item noStyle>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Button type="primary" htmlType="submit" loading={loading} block className="neon-button">
                注册
              </Button>
              <div style={{ textAlign: 'center', color: 'var(--text-primary)' }}>
                已有账户？ <Link to="/login" style={{ color: 'var(--neon-purple)' }}>立即登录</Link>
              </div>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Register;