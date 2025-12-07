import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Layout, Menu, Button, Avatar, Dropdown, Space, Switch, Drawer } from 'antd'
import { HomeOutlined, ShoppingOutlined, ProfileOutlined, LoginOutlined, LogoutOutlined, UserOutlined, MoonOutlined, SunOutlined, LockOutlined, SettingOutlined, WalletOutlined, CreditCardOutlined, BellOutlined, HistoryOutlined, MenuOutlined } from '@ant-design/icons'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

const { Header } = Layout

function AppHeader() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { isDarkMode, toggleTheme } = useTheme()
  const [current, setCurrent] = useState('home')
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false)

  const handleMenuClick = (e) => {
    setCurrent(e.key)
    setMobileMenuVisible(false)
  }

  const toggleMobileMenu = () => {
    setMobileMenuVisible(!mobileMenuVisible)
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const menuItems = [
    { key: 'home', label: <Link to="/">首页</Link>, icon: <HomeOutlined /> },
    { key: 'services', label: <Link to="/services">服务列表</Link>, icon: <ShoppingOutlined /> },
    { key: 'orders', label: <Link to="/orders">我的订单</Link>, icon: <ProfileOutlined /> },
    { key: 'profile', label: <Link to="/profile">个人中心</Link>, icon: <UserOutlined /> },
  ]

  const userMenu = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />}>
        <Link to="/profile">个人资料</Link>
      </Menu.Item>
      <Menu.Item key="orders" icon={<ProfileOutlined />}>
        <Link to="/orders">我的订单</Link>
      </Menu.Item>
      <Menu.Item key="changePassword" icon={<LockOutlined />}>
        <Link to="/profile/change-password">修改密码</Link>
      </Menu.Item>
      <Menu.Item key="wallet" icon={<WalletOutlined />}>
        <Link to="/profile/wallet">账户余额</Link>
      </Menu.Item>
      <Menu.Item key="payment" icon={<CreditCardOutlined />}>
        <Link to="/profile/payment">支付方式</Link>
      </Menu.Item>
      <Menu.Item key="notifications" icon={<BellOutlined />}>
        <Link to="/profile/notifications">消息通知</Link>
      </Menu.Item>
      <Menu.Item key="history" icon={<HistoryOutlined />}>
        <Link to="/profile/history">浏览记录</Link>
      </Menu.Item>
      <Menu.Item key="settings" icon={<SettingOutlined />}>
        <Link to="/profile/settings">设置</Link>
      </Menu.Item>
      <Menu.Item key="logout" icon={<LogoutOutlined />} danger>
        <a onClick={handleLogout}>退出登录</a>
      </Menu.Item>
    </Menu>
  )

  return (
    <>
      <Header className="app-header">
        <div className="container flex-between">
          <div className="logo">
            <h1 style={{ color: '#1890ff', margin: 0, fontSize: 'clamp(18px, 4vw, 24px)' }}>生活服务平台</h1>
          </div>
          
          {/* 移动端菜单按钮 */}
          <Button 
            icon={<MenuOutlined />} 
            onClick={toggleMobileMenu}
            className="mobile-block"
            style={{ backgroundColor: 'transparent', border: 'none', fontSize: '24px', color: 'var(--text-primary)' }}
          />
          
          {/* 桌面端内容 */}
          <div className="desktop-flex" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Menu
              mode="horizontal"
              selectedKeys={[current]}
              style={{ flex: 1, minWidth: 0, borderBottom: 0, backgroundColor: 'transparent' }}
              items={menuItems}
              onClick={handleMenuClick}
            />
            {/* 夜间模式切换按钮 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {isDarkMode ? <MoonOutlined /> : <SunOutlined />}
              <Switch
                checked={isDarkMode}
                onChange={toggleTheme}
                checkedChildren="深色"
                unCheckedChildren="浅色"
              />
            </div>
            {user ? (
              <Dropdown overlay={userMenu} trigger={['click']}>
                <a onClick={(e) => e.preventDefault()} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Avatar icon={<UserOutlined />} /> {user.name}
                </a>
              </Dropdown>
            ) : (
              <Space>
                <Button type="primary" icon={<LoginOutlined />} onClick={() => navigate('/login')}>
                  登录
                </Button>
                <Button onClick={() => navigate('/register')}>
                  注册
                </Button>
              </Space>
            )}
          </div>
        </div>
      </Header>

      {/* 移动端抽屉菜单 */}
      <Drawer
        title="生活服务平台"
        placement="right"
        onClose={() => setMobileMenuVisible(false)}
        open={mobileMenuVisible}
        mask={true}
        className="mobile-menu-drawer"
        style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-primary)' }}
      >
        <Menu
          mode="inline"
          selectedKeys={[current]}
          style={{ width: '100%', borderRight: 0 }}
          items={menuItems}
          onClick={handleMenuClick}
        />
        
        {/* 移动端夜间模式切换 */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px', 
          padding: '16px',
          borderTop: '1px solid var(--border-color)',
          marginTop: '16px'
        }}>
          {isDarkMode ? <MoonOutlined /> : <SunOutlined />}
          <span style={{ flex: 1 }}>深色模式</span>
          <Switch
            checked={isDarkMode}
            onChange={toggleTheme}
          />
        </div>
        
        {/* 移动端用户信息 */}
        <div style={{ 
          padding: '16px',
          borderTop: '1px solid var(--border-color)',
          marginTop: '16px'
        }}>
          {user ? (
            <div>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                marginBottom: '16px'
              }}>
                <Avatar icon={<UserOutlined />} /> {user.name}
              </div>
              <Menu
                mode="inline"
                style={{ width: '100%', borderRight: 0 }}
                items={[
                  { key: 'profile', label: <Link to="/profile">个人资料</Link>, icon: <UserOutlined /> },
                  { key: 'orders', label: <Link to="/orders">我的订单</Link>, icon: <ProfileOutlined /> },
                  { key: 'logout', label: '退出登录', icon: <LogoutOutlined />, danger: true, onClick: handleLogout }
                ]}
              />
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Button type="primary" icon={<LoginOutlined />} onClick={() => {
                navigate('/login');
                setMobileMenuVisible(false);
              }} block>
                登录
              </Button>
              <Button onClick={() => {
                navigate('/register');
                setMobileMenuVisible(false);
              }} block>
                注册
              </Button>
            </div>
          )}
        </div>
      </Drawer>
    </>
  )
}

export default AppHeader