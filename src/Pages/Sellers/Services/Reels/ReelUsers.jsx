import React, { useEffect, useState } from 'react';
import { Table, Card, Statistic, Input, Row, Col, Button } from 'antd';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// Dummy API
const getAllUsers = async () => {
  return [
    { id: '1', name: 'Jane Doe', email: 'jane@example.com', status: 'Active', reelCount: 8 },
    { id: '2', name: 'John Smith', email: 'john@example.com', status: 'Pending', reelCount: 2 },
  ];
};

const getUserKPIs = async () => ({
  totalUsers: 1024,
  totalReels: 2894,
  pendingUsers: 12,
  totalLikes: 9201,
  totalViews: 30500,
});

const ReelUserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [kpis, setKpis] = useState({});
  const [searchText, setSearchText] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    getAllUsers().then(setUsers);
    getUserKPIs().then(setKpis);
  }, []);

  const filteredUsers = users.filter(
    user =>
      user.name.toLowerCase().includes(searchText.toLowerCase()) ||
      user.email.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (_, record) => <span className="font-medium text-blue-600">{record.name}</span>,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Reels',
      dataIndex: 'reelCount',
      key: 'reelCount',
    },
  ];
  
  return (
    <motion.div
      className="p-6 space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* KPI Section */}
      <Row gutter={[16, 16]}>
        <Col span={24} md={4}>
          <Card>
            <Statistic title="Total Users" value={kpis.totalUsers} />
          </Card>
        </Col>
        <Col span={24} md={4}>
          <Card>
            <Statistic title="Total Reels" value={kpis.totalReels} />
          </Card>
        </Col>
        <Col span={24} md={4}>
          <Card>
            <Statistic title="Pending Users" value={kpis.pendingUsers} />
          </Card>
        </Col>
        <Col span={24} md={6}>
          <Card>
            <Statistic title="Total Likes" value={kpis.totalLikes} />
          </Card>
        </Col>
        <Col span={24} md={6}>
          <Card>
            <Statistic title="Total Views" value={kpis.totalViews} />
          </Card>
        </Col>
      </Row>

      {/* Search */}
      <div className="flex justify-between">
      <Input.Search
        placeholder="Search by name or email"
        onChange={(e) => setSearchText(e.target.value)}
        className="max-w-md"
        enterButton
      />

      <div className='flex'>
      <Input
        placeholder="Type commision price"
        onChange={(e) => setSearchText(e.target.value)}
        className="max-w-md"
        enterButton
      />
      <Button>Set Commision</Button>
      </div>
      </div>

      {/* User Table */}
      <Table
        rowKey="id"
        columns={columns}
        dataSource={filteredUsers}
        onRow={(record) => ({
          onClick: () => navigate(`/dashboard/sellers/services/reels/${record.id}`),
        })}
        className="cursor-pointer rounded-lg admin-table"
        pagination={{ pageSize: 8 }}
      />
    </motion.div>
  );
};

export default ReelUserManagementPage;
