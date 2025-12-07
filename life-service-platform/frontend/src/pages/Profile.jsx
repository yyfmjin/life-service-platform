import React from 'react';
import { Card, Typography, Button } from 'antd';
import { useAuth } from '../context/AuthContext';

const { Title } = Typography;

const Profile = () => {
  const { user, loading: authLoading, login, logout } = useAuth();
  
  console.log('Profile组件渲染:', { user, authLoading });
  
  const handleLogin = async () => {
    const result = await login({ email: 'test@example.com', password: 'password' });
    console.log('登录结果:', result);
  };
  
  return (
    <div className="page-container" style={{ backgroundColor: 'var(--dark-bg)' }}>
      <div style={{ marginBottom: 24, padding: '0 15px' }}>
        <Title level={2} style={{ 
          color: 'var(--neon-purple)', 
          textShadow: '0 0 10px rgba(138, 43, 226, 0.7)',
          fontSize: 'clamp(1.5rem, 3vw, 2rem)',
          marginBottom: 16
        }}>个人中心</Title>
        <div style={{ 
          color: 'var(--text-primary)',
          fontSize: 'clamp(0.9rem, 2vw, 1rem)',
          marginBottom: 8
        }}>
          用户信息: {JSON.stringify(user)}
        </div>
        <div style={{ 
          color: 'var(--text-primary)',
          fontSize: 'clamp(0.9rem, 2vw, 1rem)',
          marginBottom: 16
        }}>
          加载状态: {authLoading ? '加载中' : '已加载'}
        </div>
        <div style={{ marginTop: 20 }}>
          {!user ? (
            <Button 
              type="primary" 
              onClick={handleLogin} 
              style={{ 
                backgroundColor: 'var(--neon-purple)', 
                borderColor: 'var(--neon-purple)',
                padding: '8px 16px',
                fontSize: 'clamp(0.9rem, 2vw, 1rem)'
              }}
            >
              模拟登录
            </Button>
          ) : (
            <Button 
              danger 
              onClick={logout}
              style={{ 
                padding: '8px 16px',
                fontSize: 'clamp(0.9rem, 2vw, 1rem)'
              }}
            >
              退出登录
            </Button>
          )}
        </div>
      </div>
      <Card style={{ 
        backgroundColor: 'var(--card-bg)', 
        border: '1px solid var(--border-color)',
        margin: '0 15px',
        padding: 'clamp(15px, 4vw, 20px)'
      }}>
        <div style={{ color: 'var(--text-primary)' }}>
          这是一个简单的个人中心页面
        </div>
      </Card>
    </div>
  );
};

export default Profile;