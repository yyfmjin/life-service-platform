import React, { useState, useEffect } from 'react'
import { Typography, Row, Col, Card, Button, Input, Select, Pagination, Space } from 'antd'
import { SearchOutlined, StarOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import { servicesAPI, categoriesAPI } from '../services/api'

const { Title, Text } = Typography
const { Search } = Input
const { Option } = Select

function Services() {
  const [services, setServices] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState({
    keyword: '',
    category: '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'rating'
  })
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 12,
    total: 0
  })

  useEffect(() => {
    fetchCategories()
    fetchServices()
  }, [filters, pagination.current, pagination.pageSize])

  const fetchCategories = async () => {
    try {
      const response = await categoriesAPI.getCategories()
      setCategories(response.data || [])
    } catch (error) {
      console.error('获取分类失败:', error)
    }
  }

  const fetchServices = async () => {
    setLoading(true)
    try {
      const response = await servicesAPI.getServices({
        ...filters,
        page: pagination.current,
        limit: pagination.pageSize
      })
      // 适配API返回的数据结构
      const servicesData = response || [];
      const totalCount = response.total || servicesData.length;
      
      setServices(servicesData)
      setPagination(prev => ({
        ...prev,
        total: totalCount
      }))
    } catch (error) {
      console.error('获取服务列表失败:', error)
      setServices([])
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
    setPagination(prev => ({
      ...prev,
      current: 1
    }))
  }

  const handleSearch = (value) => {
    handleFilterChange('keyword', value)
  }

  const handlePaginationChange = (page, pageSize) => {
    setPagination(prev => ({
      ...prev,
      current: page,
      pageSize
    }))
  }

  // 默认服务图片（当API返回的服务没有图片时使用）
  const defaultServiceImage = 'https://via.placeholder.com/300x200?text=暂无图片'

  // 使用API获取的真实数据，如果没有数据则显示空数组
  const displayServices = services

  return (
    <div className="container responsive-container">
      <Title level={2} className="mb-2" style={{ color: 'var(--neon-green)', fontSize: 'clamp(1.5rem, 3vw, 2rem)' }}>服务列表</Title>

      {/* 筛选和搜索 */}
      <Card className="mb-2" style={{ 
        backgroundColor: 'var(--card-bg)',
        borderColor: 'var(--border-color)'
      }}>
        <Space wrap>
          <Search
            placeholder="搜索服务"
            allowClear
            enterButton={<SearchOutlined style={{ color: 'var(--neon-purple)' }} />}
            size="large"
            onSearch={handleSearch}
            style={{ width: '100%', maxWidth: 300 }}
            className="neon-input"
          />
          <Select
            placeholder="选择分类"
            allowClear
            style={{ width: 150, color: 'var(--text-primary)', backgroundColor: 'var(--card-bg)' }}
            onChange={(value) => handleFilterChange('category', value)}
            dropdownStyle={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
          >
            {categories.map(category => (
              <Option key={category._id} value={category._id} style={{ color: 'var(--text-primary)' }}>
                {category.name}
              </Option>
            ))}
          </Select>
          <Input
            placeholder="最低价格"
            style={{ width: 120, color: 'var(--text-primary)', backgroundColor: 'var(--card-bg)' }}
            onChange={(e) => handleFilterChange('minPrice', e.target.value)}
          />
          <Input
            placeholder="最高价格"
            style={{ width: 120, color: 'var(--text-primary)', backgroundColor: 'var(--card-bg)' }}
            onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
          />
          <Select
            placeholder="排序方式"
            style={{ width: 120, color: 'var(--text-primary)', backgroundColor: 'var(--card-bg)' }}
            value={filters.sortBy}
            onChange={(value) => handleFilterChange('sortBy', value)}
            dropdownStyle={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
          >
            <Option value="rating" style={{ color: 'var(--text-primary)' }}>评分最高</Option>
            <Option value="price-asc" style={{ color: 'var(--text-primary)' }}>价格从低到高</Option>
            <Option value="price-desc" style={{ color: 'var(--text-primary)' }}>价格从高到低</Option>
            <Option value="newest" style={{ color: 'var(--text-primary)' }}>最新发布</Option>
          </Select>
        </Space>
      </Card>

      {/* 服务列表 */}
      <Row gutter={[24, 24]} loading={loading}>
        {displayServices.map(service => (
          <Col xs={24} sm={12} md={12} lg={6} key={service._id || service.id}>
            <Card 
              hoverable 
              cover={<img alt={service.title} src={service.image || defaultServiceImage} style={{ height: 200, objectFit: 'cover' }} />}
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
                title={
                  <Link to={`/service/${service._id || service.id}`} style={{ color: 'var(--neon-blue)' }}>
                    {service.title}
                  </Link>
                } 
                description={
                  <Space direction="vertical" size="small" style={{ width: '100%' }}>
                    <Text strong style={{ fontSize: 'clamp(1.2rem, 2.5vw, 1.5rem)', color: 'var(--neon-pink)' }}>
                      ￥{(service.price || 0).toFixed(2)}
                    </Text>
                    <div className="flex-between">
                      <div className="flex-center">
                        <StarOutlined style={{ color: 'var(--neon-orange)', marginRight: '4px' }} />
                        <Text style={{ color: 'var(--text-primary)' }}>{service.rating ? service.rating.toFixed(1) : '暂无评分'}</Text>
                      </div>
                      <Text style={{ color: 'var(--text-secondary)' }}>{service.reviews || 0}条评价</Text>
                    </div>
                    <Button className="neon-button" block>
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
        {!loading && displayServices.length === 0 && (
          <Col span={24} style={{ textAlign: 'center', padding: '60px 20px' }}>
            <Text style={{ fontSize: '18px', color: 'var(--text-secondary)' }}>暂无服务数据</Text>
          </Col>
        )}
      </Row>

      {/* 分页 */}
      <div style={{ marginTop: '32px', textAlign: 'center' }}>
        <Pagination
          current={pagination.current}
          pageSize={pagination.pageSize}
          total={pagination.total}
          onChange={handlePaginationChange}
          showSizeChanger
          pageSizeOptions={['12', '24', '36']}
          showTotal={(total) => `共 ${total} 项服务`}
          style={{ color: 'var(--text-primary)' }}
          itemStyle={{ color: 'var(--text-primary)' }}
          prevIcon={<span style={{ color: 'var(--neon-blue)' }}>‹</span>}
          nextIcon={<span style={{ color: 'var(--neon-blue)' }}>›</span>}
        />
      </div>
    </div>
  )
}

export default Services