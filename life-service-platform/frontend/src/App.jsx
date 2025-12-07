import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout, ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import './App.css';

// 导入组件
import Header from './components/Header';
import Footer from './components/Footer';

// 导入页面
import Home from './pages/Home';
import Services from './pages/Services';
import ServiceDetail from './pages/ServiceDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Order from './pages/Order';
import OrderDetail from './pages/OrderDetail';
import OrderCreate from './pages/OrderCreate';
import OrderPay from './pages/OrderPay';
import ProviderDashboard from './pages/ProviderDashboard';
import Profile from './pages/Profile';
import PostDemand from './pages/PostDemand';

// 导入上下文
import { ThemeProvider } from './context/ThemeContext';

const { Header: AntHeader, Content, Footer: AntFooter } = Layout;

function App() {
  return (
    <ConfigProvider locale={zhCN}>
      <ThemeProvider>
        <Router>
          <Layout className="layout">
            <AntHeader className="header">
              <Header />
            </AntHeader>
            <Content className="content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/services" element={<Services />} />
                <Route path="/services/:id" element={<ServiceDetail />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/orders" element={<Order />} />
                <Route path="/order/create/:id" element={<OrderCreate />} />
                <Route path="/order/:id" element={<OrderDetail />} />
                <Route path="/order/pay/:id" element={<OrderPay />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/provider-dashboard" element={<ProviderDashboard />} />
                <Route path="/post-demand" element={<PostDemand />} />
              </Routes>
            </Content>
            <AntFooter className="footer">
              <Footer />
            </AntFooter>
          </Layout>
        </Router>
      </ThemeProvider>
    </ConfigProvider>
  );
}

export default App;