import React, { useState, useEffect } from 'react';
import { Table, Button, Typography, Space, Tag, Input, Modal, message, Select } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined, ReloadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

const { Title } = Typography;
const { Search } = Input;
const { Option } = Select;

// 模拟订单数据
const mockOrders = [
  {
    id: 1,
    orderNumber: 'ORD20240101001',
    userId: 1,
    userName: '张三',
    serviceId: 1,
    serviceName: '家庭保洁',
    price: 200,
    status: 'completed',
    appointmentTime: '2024-01-15T14:30:00',
    createdAt: '2024-01-14T10:00:00',
  },
  {
    id: 2,
    orderNumber: 'ORD20240101002',
    userId: 2,
    userName: '李四',
    serviceId: 2,
    serviceName: '家电维修',
    price: 350,
    status: 'pending',
    appointmentTime: '2024-01-16T15:45:00',
    createdAt: '2024-01-14T11:30:00',
  },
  {
    id: 3,
    orderNumber: 'ORD20240101003',
    userId: 3,
    userName: '王五',
    serviceId: 3,
    serviceName: '管道疏通',
    price: 180,
    status: 'cancelled',
    appointmentTime: '2024-01-17T16:20:00',
    createdAt: '2024-01-14T14:15:00',
  },
];

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [searchText, statusFilter, orders]);

  const fetchOrders = () => {
    setLoading(true);
    // 模拟API请求
    setTimeout(() => {
      setOrders(mockOrders);
      setLoading(false);
    }, 500);
  };

  const filterOrders = () => {
    let result = [...orders];
    
    // 搜索过滤
    if (searchText) {
      result = result.filter(order => 
        order.orderNumber.includes(searchText) || 
        order.userName.includes(searchText) ||
        order.serviceName.includes(searchText)
      );
    }
    
    // 状态过滤
    if (statusFilter) {
      result = result.filter(order => order.status === statusFilter);
    }
    
    setFilteredOrders(result);
  };

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const handleStatusChange = (value) => {
    setStatusFilter(value);
  };

  const handleEdit = (order) => {
    navigate(`/orders/${order.id}/edit`);
  };

  const handleDelete = (order) => {
    setOrderToDelete(order);
    setDeleteModalVisible(true);
  };

  const confirmDelete = () => {
    setLoading(true);
    // 模拟删除请求
    setTimeout(() => {
      setOrders(orders.filter(order => order.id !== orderToDelete.id));
      setDeleteModalVisible(false);
      message.success('订单删除成功');
      setLoading(false);
    }, 500);
  };

  const getStatusTag = (status) => {
    switch (status) {
      case 'pending':
        return <Tag color="default">待处理</Tag>;
      case 'processing':
        return <Tag color="processing">进行中</Tag>;
      case 'completed':
        return <Tag color="success">已完成</Tag>;
      case 'cancelled':
        return <Tag color="error">已取消</Tag>;
      default:
        return <Tag>{status}</Tag>;
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '订单编号',
      dataIndex: 'orderNumber',
      key: 'orderNumber',
    },
    {
      title: '用户',
      dataIndex: 'userName',
      key: 'userName',
    },
    {
      title: '服务',
      dataIndex: 'serviceName',
      key: 'serviceName',
    },
    {
      title: '价格',
      dataIndex: 'price',
      key: 'price',
      render: (price) => `¥${price}`,
    },
    {
      title: '预约时间',
      dataIndex: 'appointmentTime',
      key: 'appointmentTime',
      render: (time) => dayjs(time).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => getStatusTag(status),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (time) => dayjs(time).format('YYYY-MM-DD HH:mm'),
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
        <Title level={2} className="page-title">订单管理</Title>
        <Space>
          <Select
            placeholder="按状态过滤"
            allowClear
            style={{ width: 150 }}
            onChange={handleStatusChange}
          >
            <Option value="pending">待处理</Option>
            <Option value="processing">进行中</Option>
            <Option value="completed">已完成</Option>
            <Option value="cancelled">已取消</Option>
          </Select>
          <Search
            placeholder="搜索订单"
            allowClear
            enterButton="搜索"
            size="middle"
            onSearch={handleSearch}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 250 }}
          />
          <Button icon={<ReloadOutlined />} onClick={fetchOrders} loading={loading}>
            刷新
          </Button>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={filteredOrders}
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
        <p>确定要删除订单 <strong>{orderToDelete?.orderNumber}</strong> 吗？</p>
        <p style={{ color: '#ff4d4f' }}>此操作不可恢复！</p>
      </Modal>
    </div>
  );
};

export default Orders;