import React from 'react'
import { Layout, Typography, Row, Col, Space, Divider } from 'antd'
import { PhoneOutlined, MailOutlined, EnvironmentOutlined, GithubOutlined } from '@ant-design/icons'

const { Footer } = Layout
const { Title, Text } = Typography

function AppFooter() {
  return (
    <Footer className="app-footer">
      <div className="container">
        <Row gutter={[24, 24]}>
          <Col xs={24} sm={12} md={8}>
            <Title level={4} style={{ color: '#1890ff', marginBottom: '16px' }}>生活服务平台</Title>
            <Text type="secondary">
              提供专业、便捷、高质量的生活服务，让您的生活更加轻松愉快。
            </Text>
            <div style={{ marginTop: '16px' }}>
              <Space direction="vertical" style={{ display: 'flex' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <PhoneOutlined /> <Text>400-123-4567</Text>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MailOutlined /> <Text>contact@lifeservice.com</Text>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <EnvironmentOutlined /> <Text>北京市朝阳区生活服务大厦</Text>
                </div>
              </Space>
            </div>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Title level={4} style={{ marginBottom: '16px' }}>快速链接</Title>
            <Space direction="vertical" style={{ display: 'flex' }}>
              <Text>首页</Text>
              <Text>服务列表</Text>
              <Text>关于我们</Text>
              <Text>联系我们</Text>
              <Text>帮助中心</Text>
            </Space>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Title level={4} style={{ marginBottom: '16px' }}>关注我们</Title>
            <Space direction="vertical" style={{ display: 'flex' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <GithubOutlined /> <Text>GitHub</Text>
              </div>
              <Text>微信公众号</Text>
              <Text>微信小程序</Text>
            </Space>
          </Col>
        </Row>
        <Divider />
        <Text type="secondary" className="text-center" style={{ display: 'block' }}>
          © 2024 生活服务平台. 保留所有权利.
        </Text>
      </div>
    </Footer>
  )
}

export default AppFooter