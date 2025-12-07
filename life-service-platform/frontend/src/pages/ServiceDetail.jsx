import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Typography, Row, Col, Card, Button, Space, Rate, Avatar, Divider } from 'antd'
import { CalendarOutlined, ClockCircleOutlined, UserOutlined, StarOutlined } from '@ant-design/icons'
import { servicesAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'

const { Title, Text, Paragraph } = Typography

function ServiceDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [service, setService] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchServiceDetail()
  }, [id])

  const fetchServiceDetail = async () => {
    setLoading(true)
    try {
      const response = await servicesAPI.getServiceById(id)
      setService(response.data)
    } catch (error) {
      console.error('获取服务详情失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleOrder = () => {
    if (!user) {
      navigate('/login')
      return
    }
    navigate(`/order/create/${id}`)
  }

  // 如果没有从API获取到数据，使用默认数据
  const defaultService = {
    id: id,
    title: '服务名称',
    description: '服务描述',
    price: 0,
    duration: 1,
    rating: 0,
    reviews: 0,
    images: [
      'https://via.placeholder.com/600x400?text=服务图片'
    ],
    provider: {
      name: '服务提供商',
      rating: 0,
      services: 0
    },
    reviewsList: []
  };

  // 使用API获取的数据，如果没有数据则使用默认数据
  const displayService = service || defaultService

  if (loading || !displayService) {
    return <div className="container" style={{ color: 'var(--text-primary)' }}>加载中...</div>
  }

  return (
    <div className="container responsive-container">
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          {/* 服务图片 */}
          <Card className="mb-2" style={{ 
            backgroundColor: 'var(--card-bg)',
            borderColor: 'var(--border-color)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
              <img 
                src={displayService.images[0]} 
                alt={displayService.title} 
                style={{ maxWidth: '100%', maxHeight: '500px' }}
              />
            </div>
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px' }}>
              {displayService.images.map((image, index) => (
                <img 
                  key={index} 
                  src={image} 
                  alt={`${displayService.title} ${index + 1}`} 
                  style={{ 
                    width: '80px', 
                    height: '80px', 
                    objectFit: 'cover', 
                    cursor: 'pointer',
                    border: '2px solid var(--border-color)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--neon-purple)';
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-color)';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                />
              ))}
            </div>
          </Card>

          {/* 服务详情 */}
          <Card className="mb-2" style={{ 
            backgroundColor: 'var(--card-bg)',
            borderColor: 'var(--border-color)'
          }}>
            <Title level={3} style={{ color: 'var(--neon-pink)', fontSize: 'clamp(1.2rem, 2.5vw, 1.8rem)' }}>{displayService.title}</Title>
            <Space size="large" style={{ marginBottom: '24px' }}>
              <div className="flex-center">
                <StarOutlined style={{ color: 'var(--neon-orange)', marginRight: '4px' }} />
                <Text strong style={{ color: 'var(--text-primary)' }}>{displayService.rating}</Text>
                <Text style={{ color: 'var(--text-secondary)' }}> ({displayService.reviews} 条评价)</Text>
              </div>
              <div className="flex-center">
                <ClockCircleOutlined style={{ color: 'var(--neon-blue)', marginRight: '4px' }} />
                <Text style={{ color: 'var(--text-primary)' }}>{displayService.duration} 小时</Text>
              </div>
            </Space>
            <Paragraph style={{ color: 'var(--text-primary)' }}>{displayService.description}</Paragraph>
          </Card>

          {/* 用户评价 */}
          <Card className="mb-2" style={{ 
            backgroundColor: 'var(--card-bg)',
            borderColor: 'var(--border-color)'
          }}>
            <Title level={3} style={{ marginBottom: '24px', color: 'var(--neon-green)' }}>用户评价</Title>
            <Space direction="vertical" style={{ display: 'flex', width: '100%' }}>
              {displayService.reviewsList.map((review) => (
                <div key={review.id}>
                  <div className="flex-between mb-1">
                    <Space align="center">
                      <Avatar style={{ backgroundColor: 'var(--neon-purple)' }}>{review.user.avatar}</Avatar>
                      <Text strong style={{ color: 'var(--text-primary)' }}>{review.user.name}</Text>
                      <Rate disabled value={review.rating} style={{ margin: 0, color: 'var(--neon-orange)' }} />
                    </Space>
                    <Text style={{ color: 'var(--text-secondary)' }}>{review.date}</Text>
                  </div>
                  <Text style={{ color: 'var(--text-primary)' }}>{review.comment}</Text>
                  <Divider style={{ margin: '16px 0', borderColor: 'var(--border-color)' }} />
                </div>
              ))}
            </Space>
          </Card>
        </Col>

        {/* 服务信息卡片 */}
        <Col xs={24} lg={8}>
          <Card className="mb-2 neon-card" style={{ 
            backgroundColor: 'var(--card-bg)',
            borderColor: 'var(--border-color)'
          }}>
            <Space direction="vertical" style={{ display: 'flex', width: '100%' }}>
              <div className="flex-between">
                <Text style={{ color: 'var(--text-primary)' }}>服务价格</Text>
                <Text strong style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', color: 'var(--neon-pink)' }}>
                  ￥{displayService.price}
                </Text>
              </div>
              <Divider style={{ margin: '16px 0', borderColor: 'var(--border-color)' }} />
              <div className="flex-between">
                <Text style={{ color: 'var(--text-primary)' }}>服务时长</Text>
                <Text style={{ color: 'var(--text-primary)' }}>
                  <ClockCircleOutlined style={{ color: 'var(--neon-blue)', marginRight: '4px' }} />
                  {displayService.duration} 小时
                </Text>
              </div>
              <div className="flex-between">
                <Text style={{ color: 'var(--text-primary)' }}>服务提供商</Text>
                <Text style={{ color: 'var(--text-primary)' }}>{displayService.provider.name}</Text>
              </div>
              <div className="flex-between">
                <Text style={{ color: 'var(--text-primary)' }}>商家评分</Text>
                <div className="flex-center">
                  <StarOutlined style={{ color: 'var(--neon-orange)', marginRight: '4px' }} />
                  <Text style={{ color: 'var(--text-primary)' }}>{displayService.provider.rating}</Text>
                </div>
              </div>
              <Divider style={{ margin: '16px 0', borderColor: 'var(--border-color)' }} />
              <Button 
                className="neon-button" 
                size="large" 
                block
                onClick={handleOrder}
              >
                立即预约
              </Button>
            </Space>
          </Card>

          {/* 服务提供商信息 */}
          <Card style={{ 
            backgroundColor: 'var(--card-bg)',
            borderColor: 'var(--border-color)'
          }}>
            <Space direction="vertical" style={{ display: 'flex', width: '100%' }}>
              <Title level={4} style={{ color: 'var(--neon-blue)' }}>服务提供商</Title>
              <Space align="center">
                <Avatar size="large" style={{ backgroundColor: 'var(--neon-purple)' }}>
                  <UserOutlined />
                </Avatar>
                <div>
                  <Text strong style={{ color: 'var(--text-primary)' }}>{displayService.provider.name}</Text>
                  <div className="flex-center mt-1">
                    <StarOutlined style={{ color: 'var(--neon-orange)', marginRight: '4px' }} />
                    <Text style={{ color: 'var(--text-primary)' }}>{displayService.provider.rating}</Text>
                  </div>
                </div>
              </Space>
              <Text style={{ color: 'var(--text-primary)' }}>提供服务：{displayService.provider.services} 项</Text>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default ServiceDetail