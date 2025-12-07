import React, { useEffect, useState } from 'react'
import { Typography, Row, Col, Card, Button, Space } from 'antd'
import { ShoppingOutlined, HomeOutlined, ShoppingCartOutlined, CarOutlined, StarOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import servicesAPI from '../services/api'

const { Title, Text } = Typography

function Home() {
  // 热门服务列表状态
  const [hotServices, setHotServices] = useState([]);
  const [loading, setLoading] = useState(false);

  // 获取热门服务列表
  useEffect(() => {
    const fetchHotServices = async () => {
      setLoading(true);
      try {
        const services = await servicesAPI.getServices({ page: 1, limit: 4 });
        setHotServices(services || []);
      } catch (error) {
        console.error('获取热门服务失败:', error);
        setHotServices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHotServices();
  }, []);

  return (
    <div className="home-page">
      {/* 顶部横幅 - 成都特色 */}
      <div className="banner" style={{ 
        background: 'linear-gradient(135deg, #121212 0%, #1e1e1e 100%)', 
        padding: '80px 0', 
        marginBottom: '40px',
        textAlign: 'center',
        borderBottom: '2px solid var(--neon-purple)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* 熊猫背景装饰 */}
        <div style={{ 
          position: 'absolute', 
          left: '10%', 
          top: '50%', 
          transform: 'translateY(-50%)',
          opacity: 0.1,
          width: '200px',
          height: '200px'
        }}>
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            {/* 熊猫头部 */}
            <circle cx="50" cy="50" r="40" fill="white" />
            {/* 熊猫耳朵 */}
            <circle cx="30" cy="30" r="15" fill="black" />
            <circle cx="70" cy="30" r="15" fill="black" />
            {/* 熊猫眼睛 */}
            <circle cx="40" cy="50" r="8" fill="black" />
            <circle cx="60" cy="50" r="8" fill="black" />
            <circle cx="42" cy="48" r="3" fill="white" />
            <circle cx="62" cy="48" r="3" fill="white" />
            {/* 熊猫鼻子和嘴巴 */}
            <ellipse cx="50" cy="60" rx="8" ry="5" fill="black" />
            <path d="M50 65 Q53 70 50 75 Q47 70 50 65" fill="none" stroke="black" strokeWidth="2" />
          </svg>
        </div>
        {/* 竹子背景装饰 */}
        <div style={{ 
          position: 'absolute', 
          right: '10%', 
          top: '50%', 
          transform: 'translateY(-50%)',
          opacity: 0.1,
          width: '150px',
          height: '200px'
        }}>
          <svg viewBox="0 0 50 100" xmlns="http://www.w3.org/2000/svg">
            {/* 竹子茎 */}
            <rect x="20" y="0" width="10" height="100" fill="#2e8b57" rx="2" />
            {/* 竹节 */}
            <rect x="20" y="20" width="10" height="2" fill="#228b22" />
            <rect x="20" y="40" width="10" height="2" fill="#228b22" />
            <rect x="20" y="60" width="10" height="2" fill="#228b22" />
            <rect x="20" y="80" width="10" height="2" fill="#228b22" />
            {/* 竹叶 */}
            <path d="M30 10 Q40 5 35 0" fill="#228b22" />
            <path d="M30 15 Q45 10 35 5" fill="#228b22" />
            <path d="M10 30 Q0 25 5 20" fill="#228b22" />
            <path d="M10 35 Q-5 30 5 25" fill="#228b22" />
            <path d="M30 50 Q40 45 35 40" fill="#228b22" />
            <path d="M10 70 Q0 65 5 60" fill="#228b22" />
            <path d="M30 90 Q40 85 35 80" fill="#228b22" />
          </svg>
        </div>
        <div className="container">
          <Title level={1} style={{ 
            color: 'var(--neon-pink)', 
            fontSize: '4rem',
            marginBottom: '16px',
            textShadow: '0 0 20px rgba(255, 20, 147, 0.7)'
          }}>
            到哪儿·本地范儿
          </Title>
          <Text style={{ fontSize: '1.5rem', color: 'var(--text-secondary)', marginBottom: '32px', display: 'block' }}>
            来了就是成都人
          </Text>
          <div style={{ marginTop: '32px' }}>
            <Button className="neon-button" size="large" style={{ marginRight: '16px' }}>
              <Link to="/services" style={{ color: 'var(--neon-purple)' }}>浏览服务</Link>
            </Button>
            <Button className="neon-button" size="large" style={{ 
              borderColor: 'var(--neon-pink)',
              color: 'var(--neon-pink)',
              boxShadow: '0 0 10px rgba(255, 20, 147, 0.5)',
              marginRight: '16px'
            }}>
              立即预约
            </Button>
            <Button className="neon-button" size="large" style={{ 
              borderColor: 'var(--neon-green)',
              color: 'var(--neon-green)',
              boxShadow: '0 0 10px rgba(50, 205, 50, 0.5)'
            }}>
              <Link to="/post-demand" style={{ color: 'var(--neon-green)' }}>发布需求</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* 成都特色服务分类 */}
      <div className="container mb-3">
        <Title level={2} style={{ marginBottom: '48px', textAlign: 'center' }}>成都特色服务</Title>
        <Row gutter={[24, 24]}>
          {/* 吃在成都 - 火锅图标 */}
          <Col xs={24} sm={12} md={6} key="eat">
            <Card 
              className="category-card neon-card" 
              hoverable
              onClick={() => window.location.href='/services'}
              style={{ 
                textAlign: 'center',
                backgroundColor: 'var(--card-bg)',
                borderColor: 'var(--neon-pink)',
                boxShadow: '0 0 15px rgba(255, 20, 147, 0.4)',
                cursor: 'pointer'
              }}
            >
              <div style={{ 
                fontSize: '64px', 
                color: 'var(--neon-pink)', 
                marginBottom: '16px',
                textShadow: '0 0 10px rgba(255, 20, 147, 0.7)'
              }}>
                {/* 火锅SVG图标 */}
                <svg viewBox="0 0 100 100" width="64" height="64">
                  {/* 火锅锅身 */}
                  <ellipse cx="50" cy="70" rx="40" ry="20" fill="#8B4513" />
                  <ellipse cx="50" cy="70" rx="35" ry="15" fill="#A0522D" />
                  {/* 火锅支架 */}
                  <rect x="45" y="80" width="10" height="15" fill="#696969" />
                  <rect x="35" y="95" width="30" height="5" fill="#696969" />
                  {/* 火焰 */}
                  <path d="M50 95 Q45 85 50 80 Q55 85 50 95" fill="#FF4500" />
                  <path d="M50 95 Q40 88 45 83 Q50 80 55 83 Q60 88 50 95" fill="#FF8C00" />
                  {/* 火锅汤 */}
                  <ellipse cx="50" cy="65" rx="32" ry="12" fill="#FF69B4" opacity="0.6" />
                  {/* 火锅食材 */}
                  <circle cx="35" cy="60" r="5" fill="#228B22" />
                  <circle cx="45" cy="58" r="6" fill="#FFD700" />
                  <circle cx="55" cy="62" r="5" fill="#FF1493" />
                  <circle cx="65" cy="59" r="6" fill="#4169E1" />
                  <rect x="30" y="65" width="40" height="2" fill="#FF6347" />
                </svg>
              </div>
              <Title level={3} style={{ marginBottom: '8px', color: 'var(--neon-pink)' }}>吃在成都</Title>
              <Text style={{ color: 'var(--text-secondary)' }}>正宗火锅推荐</Text>
            </Card>
          </Col>
          
          {/* 住在成都 - 熊猫图标 */}
          <Col xs={24} sm={12} md={6} key="live">
            <Card 
              className="category-card neon-card" 
              hoverable
              onClick={() => window.location.href='/services'}
              style={{ 
                textAlign: 'center',
                backgroundColor: 'var(--card-bg)',
                borderColor: 'var(--neon-green)',
                boxShadow: '0 0 15px rgba(50, 205, 50, 0.4)',
                cursor: 'pointer'
              }}
            >
              <div style={{ 
                fontSize: '64px', 
                color: 'var(--neon-green)', 
                marginBottom: '16px',
                textShadow: '0 0 10px rgba(50, 205, 50, 0.7)'
              }}>
                {/* 熊猫SVG图标 */}
                <svg viewBox="0 0 100 100" width="64" height="64">
                  {/* 熊猫头部 */}
                  <circle cx="50" cy="50" r="40" fill="white" />
                  {/* 熊猫耳朵 */}
                  <circle cx="30" cy="30" r="12" fill="black" />
                  <circle cx="70" cy="30" r="12" fill="black" />
                  {/* 熊猫眼睛 */}
                  <ellipse cx="40" cy="50" rx="8" ry="12" fill="black" />
                  <ellipse cx="60" cy="50" rx="8" ry="12" fill="black" />
                  <circle cx="42" cy="47" r="3" fill="white" />
                  <circle cx="62" cy="47" r="3" fill="white" />
                  {/* 熊猫鼻子 */}
                  <ellipse cx="50" cy="60" rx="5" ry="3" fill="black" />
                  {/* 熊猫嘴巴 */}
                  <path d="M50 63 Q53 67 50 71 Q47 67 50 63" fill="none" stroke="black" strokeWidth="2" />
                </svg>
              </div>
              <Title level={3} style={{ marginBottom: '8px', color: 'var(--neon-green)' }}>住在成都</Title>
              <Text style={{ color: 'var(--text-secondary)' }}>熊猫主题民宿</Text>
            </Card>
          </Col>
          
          {/* 穿在成都 - 蜀绣图标 */}
          <Col xs={24} sm={12} md={6} key="wear">
            <Card 
              className="category-card neon-card" 
              hoverable
              onClick={() => window.location.href='/services'}
              style={{ 
                textAlign: 'center',
                backgroundColor: 'var(--card-bg)',
                borderColor: 'var(--neon-orange)',
                boxShadow: '0 0 15px rgba(255, 99, 71, 0.4)',
                cursor: 'pointer'
              }}
            >
              <div style={{ 
                fontSize: '64px', 
                color: 'var(--neon-orange)', 
                marginBottom: '16px',
                textShadow: '0 0 10px rgba(255, 99, 71, 0.7)'
              }}>
                {/* 蜀绣SVG图标 */}
                <svg viewBox="0 0 100 100" width="64" height="64">
                  {/* 绣布 */}
                  <rect x="20" y="20" width="60" height="60" fill="#FFFACD" stroke="#8B4513" strokeWidth="2" />
                  {/* 绣花 */}
                  <path d="M40 30 Q50 25 60 30 Q70 35 65 45 Q60 55 50 50 Q40 55 35 45 Q30 35 40 30" fill="#FF69B4" />
                  <path d="M45 35 Q50 32 55 35 Q60 38 58 43 Q56 48 50 46 Q44 48 42 43 Q40 38 45 35" fill="#FF1493" />
                  {/* 绣花针 */}
                  <line x1="70" y1="30" x2="80" y2="40" stroke="#C0C0C0" strokeWidth="2" />
                  <circle cx="80" cy="40" r="2" fill="#C0C0C0" />
                  {/* 绣线 */}
                  <path d="M75 25 Q85 20 80 15" stroke="#FF1493" strokeWidth="1" fill="none" />
                </svg>
              </div>
              <Title level={3} style={{ marginBottom: '8px', color: 'var(--neon-orange)' }}>穿在成都</Title>
              <Text style={{ color: 'var(--text-secondary)' }}>蜀绣特色服饰</Text>
            </Card>
          </Col>
          
          {/* 行在成都 - 竹子图标 */}
          <Col xs={24} sm={12} md={6} key="travel">
            <Card 
              className="category-card neon-card" 
              hoverable
              onClick={() => window.location.href='/services'}
              style={{ 
                textAlign: 'center',
                backgroundColor: 'var(--card-bg)',
                borderColor: 'var(--neon-blue)',
                boxShadow: '0 0 15px rgba(0, 191, 255, 0.4)',
                cursor: 'pointer'
              }}
            >
              <div style={{ 
                fontSize: '64px', 
                color: 'var(--neon-blue)', 
                marginBottom: '16px',
                textShadow: '0 0 10px rgba(0, 191, 255, 0.7)'
              }}>
                {/* 竹子SVG图标 */}
                <svg viewBox="0 0 100 100" width="64" height="64">
                  {/* 竹子茎 */}
                  <rect x="45" y="10" width="10" height="80" fill="#2E8B57" rx="2" />
                  {/* 竹节 */}
                  <rect x="45" y="25" width="10" height="2" fill="#228B22" />
                  <rect x="45" y="45" width="10" height="2" fill="#228B22" />
                  <rect x="45" y="65" width="10" height="2" fill="#228B22" />
                  {/* 竹叶 */}
                  <path d="M55 15 Q65 10 60 5" fill="#228B22" />
                  <path d="M55 20 Q70 15 60 10" fill="#228B22" />
                  <path d="M35 40 Q25 35 30 30" fill="#228B22" />
                  <path d="M35 45 Q20 40 30 35" fill="#228B22" />
                  <path d="M55 55 Q65 50 60 45" fill="#228B22" />
                  <path d="M35 70 Q25 65 30 60" fill="#228B22" />
                  <path d="M55 85 Q65 80 60 75" fill="#228B22" />
                  <path d="M35 90 Q25 85 30 80" fill="#228B22" />
                </svg>
              </div>
              <Title level={3} style={{ marginBottom: '8px', color: 'var(--neon-blue)' }}>行在成都</Title>
              <Text style={{ color: 'var(--text-secondary)' }}>熊猫基地之旅</Text>
            </Card>
          </Col>
        </Row>
      </div>

      {/* 热门服务 */}
      <div className="container" style={{ marginTop: '80px' }}>
        <div className="flex-between mb-2">
          <Title level={2} style={{ color: 'var(--neon-blue)' }}>热门服务</Title>
          <Button type="link" style={{ color: 'var(--neon-blue)' }}>
            <Link to="/services" style={{ color: 'var(--neon-blue)' }}>查看全部</Link>
          </Button>
        </div>
        <Row gutter={[24, 24]} loading={loading}>
          {hotServices.map((service) => (
            <Col xs={24} sm={12} md={12} lg={6} key={service._id || service.id}>
              <Card 
                hoverable 
                cover={<img alt={service.title} src={service.image || 'https://via.placeholder.com/300x200?text=暂无图片'} />}
                style={{ 
                  backgroundColor: 'var(--card-bg)',
                  borderColor: 'var(--border-color)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 0 20px var(--shadow-color)';
                  e.currentTarget.style.borderColor = 'var(--neon-purple)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '';
                  e.currentTarget.style.borderColor = 'var(--border-color)';
                }}
              >
                <Card.Meta 
                  title={<Text style={{ color: 'var(--text-primary)' }}>{service.title}</Text>} 
                  description={
                    <Space direction="vertical" size="small" style={{ width: '100%' }}>
                      <Text strong style={{ fontSize: '18px', color: 'var(--neon-pink)' }}>
                        ￥{(service.price || 0).toFixed(2)}
                      </Text>
                      <div className="flex-between">
                        <div className="flex-center">
                          <StarOutlined style={{ color: 'var(--neon-orange)', marginRight: '4px' }} />
                          <Text style={{ color: 'var(--text-primary)' }}>{service.rating ? service.rating.toFixed(1) : '暂无评分'}</Text>
                        </div>
                        <Text style={{ color: 'var(--text-secondary)' }}>{service.reviews || 0}条评价</Text>
                      </div>
                      <Button className="neon-button" block size="small">
                        <Link to={`/service/${service._id || service.id}`} style={{ color: 'var(--neon-purple)' }}>
                          立即预约
                        </Link>
                      </Button>
                    </Space>
                  } 
                />
              </Card>
            </Col>
          ))}
          
          {/* 无数据提示 */}
          {!loading && hotServices.length === 0 && (
            <Col span={24} style={{ textAlign: 'center', padding: '60px 20px' }}>
              <Text style={{ fontSize: '18px', color: 'var(--text-secondary)' }}>暂无服务数据</Text>
            </Col>
          )}
        </Row>
      </div>
    </div>
  )
}

export default Home