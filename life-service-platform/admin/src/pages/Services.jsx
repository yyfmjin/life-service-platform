import React, { useState, useEffect } from 'react';
import { Table, Button, Typography, Space, Tag, Input, Modal, message, Upload } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;
const { Search } = Input;

// 模拟服务数据
const mockServices = [
  {
    id: 1,
    name: '家庭保洁',
    category: '清洁服务',
    price: 200,
    duration: '2小时',
    description: '专业家庭保洁服务，包括除尘、拖地、擦窗等',
    image: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    status: 'active',
    createdAt: '2024-01-01T10:00:00',
  },
  {
    id: 2,
    name: '家电维修',
    category: '维修服务',
    price: 150,
    duration: '1-2小时',
    description: '专业家电维修，包括空调、冰箱、洗衣机等',
    image: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    status: 'active',
    createdAt: '2024-01-02T11:30:00',
  },
  {
    id: 3,
    name: '管道疏通',
    category: '维修服务',
    price: 180,
    duration: '1小时',
    description: '专业管道疏通服务，包括下水道、马桶等',
    image: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    status: 'inactive',
    createdAt: '2024-01-03T14:15:00',
  },
];

const Services = () => {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    filterServices();
  }, [searchText, services]);

  const fetchServices = () => {
    setLoading(true);
    // 模拟API请求
    setTimeout(() => {
      setServices(mockServices);
      setLoading(false);
    }, 500);
  };

  const filterServices = () => {
    if (!searchText) {
      setFilteredServices(services);
      return;
    }
    
    const filtered = services.filter(service => 
      service.name.includes(searchText) || 
      service.category.includes(searchText) ||
      service.description.includes(searchText)
    );
    
    setFilteredServices(filtered);
  };

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const handleEdit = (service) => {
    navigate(`/services/${service.id}/edit`);
  };

  const handleDelete = (service) => {
    setServiceToDelete(service);
    setDeleteModalVisible(true);
  };

  const confirmDelete = () => {
    setLoading(true);
    // 模拟删除请求
    setTimeout(() => {
      setServices(services.filter(service => service.id !== serviceToDelete.id));
      setDeleteModalVisible(false);
      message.success('服务删除成功');
      setLoading(false);
    }, 500);
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '服务名称',
      dataIndex: 'name',
      key: 'name',
      render: (name, record) => (
        <Space>
          <div style={{ width: 50, height: 50, overflow: 'hidden', borderRadius: 4 }}>
            <img src={record.image} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <span>{name}</span>
        </Space>
      ),
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      render: (category) => <Tag>{category}</Tag>,
    },
    {
      title: '价格',
      dataIndex: 'price',
      key: 'price',
      render: (price) => `¥${price}`,
    },
    {
      title: '时长',
      dataIndex: 'duration',
      key: 'duration',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status === 'active' ? '启用' : '禁用'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" icon={<EyeOutlined />} onClick={() => handleEdit(record)}>
            查看
          </Button>
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Button type="link" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record)}>
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={2} className="page-title">服务管理</Title>
        <Space>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/services/create')}>
            新增服务
          </Button>
          <Search
            placeholder="搜索服务"
            allowClear
            enterButton="搜索"
            size="middle"
            onSearch={handleSearch}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 250 }}
          />
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={filteredServices}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title="确认删除"
        open={deleteModalVisible}
        onOk={confirmDelete}
        onCancel={() => setDeleteModalVisible(false)}
        confirmLoading={loading}
        okText="删除"
        cancelText="取消"
        okType="danger"
      >
        <p>确定要删除服务 <strong>{serviceToDelete?.name}</strong> 吗？</p>
        <p style={{ color: '#ff4d4f' }}>此操作不可恢复！</p>
      </Modal>
    </div>
  );
};

export default Services;