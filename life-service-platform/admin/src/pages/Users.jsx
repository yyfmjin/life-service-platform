import React, { useState, useEffect } from 'react';
import { Table, Button, Typography, Space, Tag, Input, Modal, message } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined, UserAddOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;
const { Search } = Input;

// 模拟用户数据
const mockUsers = [
  {
    id: 1,
    name: '张三',
    email: 'zhangsan@example.com',
    phone: '13800138001',
    role: 'user',
    status: 'active',
    createdAt: '2024-01-01T10:00:00',
  },
  {
    id: 2,
    name: '李四',
    email: 'lisi@example.com',
    phone: '13800138002',
    role: 'user',
    status: 'active',
    createdAt: '2024-01-02T11:30:00',
  },
  {
    id: 3,
    name: '王五',
    email: 'wangwu@example.com',
    phone: '13800138003',
    role: 'admin',
    status: 'active',
    createdAt: '2024-01-03T14:15:00',
  },
];

const Users = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [searchText, users]);

  const fetchUsers = () => {
    setLoading(true);
    // 模拟API请求
    setTimeout(() => {
      setUsers(mockUsers);
      setLoading(false);
    }, 500);
  };

  const filterUsers = () => {
    if (!searchText) {
      setFilteredUsers(users);
      return;
    }
    
    const filtered = users.filter(user => 
      user.name.includes(searchText) || 
      user.email.includes(searchText) ||
      user.phone.includes(searchText)
    );
    
    setFilteredUsers(filtered);
  };

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const handleEdit = (user) => {
    navigate(`/users/${user.id}/edit`);
  };

  const handleDelete = (user) => {
    setUserToDelete(user);
    setDeleteModalVisible(true);
  };

  const confirmDelete = () => {
    setLoading(true);
    // 模拟删除请求
    setTimeout(() => {
      setUsers(users.filter(user => user.id !== userToDelete.id));
      setDeleteModalVisible(false);
      message.success('用户删除成功');
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
      title: '用户名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      render: (role) => (
        <Tag color={role === 'admin' ? 'red' : 'blue'}>
          {role === 'admin' ? '管理员' : '用户'}
        </Tag>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status === 'active' ? '活跃' : '禁用'}
        </Tag>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleString(),
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
        <Title level={2} className="page-title">用户管理</Title>
        <Space>
          <Button type="primary" icon={<UserAddOutlined />}>
            新增用户
          </Button>
          <Search
            placeholder="搜索用户"
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
        dataSource={filteredUsers}
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
        <p>确定要删除用户 <strong>{userToDelete?.name}</strong> 吗？</p>
        <p style={{ color: '#ff4d4f' }}>此操作不可恢复！</p>
      </Modal>
    </div>
  );
};

export default Users;