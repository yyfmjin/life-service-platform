import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, Typography, Space, message } from 'antd';
import { LockOutlined, UserOutlined, MailOutlined } from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';

const { Title } = Typography;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const result = await login(values);
      if (result.success) {
        message.success('登录成功');
        navigate('/');
      } else {
        message.error(result.error || '登录失败，请检查邮箱和密码');
      }
    } catch (error) {
      message.error(error.response?.data?.message || '登录失败，请检查邮箱和密码');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 160px)', backgroundColor: 'var(--dark-bg)' }}>
      <Card className="neon-card" style={{ maxWidth: 400, width: '100%', margin: '0 15px', backgroundColor: 'var(--card-bg)', border: '1px solid var(--neon-purple)' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Title level={2} style={{ color: 'var(--neon-purple)', fontSize: 'clamp(1.5rem, 3vw, 2rem)' }}>登录</Title>
        </div>
        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
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
            name="password"
            rules={[{ required: true, message: '请输入密码!' }]}
          >
            <Input.Password 
              prefix={<LockOutlined />} 
              placeholder="密码"
              style={{ backgroundColor: 'var(--input-bg)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
            />
          </Form.Item>
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Button type="primary" htmlType="submit" loading={loading} block className="neon-button">
                登录
              </Button>
              <div style={{ textAlign: 'center', color: 'var(--text-primary)' }}>
                还没有账户？ <Link to="/register" style={{ color: 'var(--neon-purple)' }}>立即注册</Link>
              </div>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;