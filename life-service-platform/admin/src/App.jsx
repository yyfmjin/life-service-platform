import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout, Menu, Button, Typography, message } from 'antd';
import { 
  UserOutlined, 
  ServiceOutlined, 
  FileTextOutlined, 
  DashboardOutlined,
  LogoutOutlined,
  SettingOutlined,
  PlusOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

// 导入页面
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Services from './pages/Services';
import Orders from './pages/Orders';
import Settings from './pages/Settings';
import ServiceCreate from './pages/ServiceCreate';
import ServiceEdit from './pages/ServiceEdit';
import UserEdit from './pages/UserEdit';
import OrderDetail from './pages/OrderDetail';

const { Header, Content, Sider } = Layout;
const { Title } = Typography;

// 模拟认证状态
const useAuth = () => {
  const [user, setUser] = useState(null);
  
  const login = (credentials) => {
    // 模拟登录逻辑
    if (credentials.username === 'admin' && credentials.password === 'admin123') {
      const adminUser = { id: 1, username: 'admin', role: 'admin' };
      setUser(adminUser);
      localStorage.setItem('adminUser', JSON.stringify(adminUser));
      return true;
    }
    return false;
  };
  
  const logout = () => {
    setUser(null);
    localStorage.removeItem('adminUser');
  };
  
  return { user, login, logout };
};

const AppContent = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  // 从localStorage恢复用户状态
  React.useEffect(() => {
    const savedUser = localStorage.getItem('adminUser');
    if (savedUser) {
      // 这里应该设置用户状态
    }
  }, []);
  
  const handleLogout = () => {
    logout();
    message.success('退出登录成功');
    navigate('/login');
  };
  
  const menuItems = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: '仪表盘',
    },
    {
      key: '/users',
      icon: <UserOutlined />,
      label: '用户管理',
    },
    {
      key: '/services',
      icon: <ServiceOutlined />,
      label: '服务管理',
    },
    {
      key: '/orders',
      icon: <FileTextOutlined />,
      label: '订单管理',
    },
    {
      key: '/settings',
      icon: <SettingOutlined />,
      label: '系统设置',
    },
  ];
  
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 64, color: '#fff', fontSize: 18 }}>
          {collapsed ? '管理端' : '生活服务平台管理端'}
        </div>
        <Menu theme="dark" defaultSelectedKeys={['/']} mode="inline" items={menuItems} />
      </Sider>
      <Layout>
        <Header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 0 24, background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <div style={{ fontSize: 18, fontWeight: 600 }}>{menuItems.find(item => item.key === window.location.pathname)?.label || '仪表盘'}</div>
          <Button type="text" icon={<LogoutOutlined />} onClick={handleLogout}>
            退出登录
          </Button>
        </Header>
        <Content style={{ margin: 16, padding: 24, background: '#fff', minHeight: 280, borderRadius: 8 }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/users" element={<Users />} />
            <Route path="/users/:id/edit" element={<UserEdit />} />
            <Route path="/services" element={<Services />} />
            <Route path="/services/create" element={<ServiceCreate />} />
            <Route path="/services/:id/edit" element={<ServiceEdit />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/orders/:id" element={<OrderDetail />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};

const App = () => {
  const { login } = useAuth();
  
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login onLogin={login} />} />
        <Route path="/*" element={localStorage.getItem('adminUser') ? <AppContent /> : <Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default App;