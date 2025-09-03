import React, { useEffect, useState } from 'react';
import { Table, Card, Statistic, Input, Row, Col, Button, message } from 'antd';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const { Search } = Input;

const ReelUserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [kpis, setKpis] = useState({});
  const [searchText, setSearchText] = useState('');
  const navigate = useNavigate();

  // ✅ Fetch KPIs from backend
  const fetchKPIs = async () => {
    try {
      const res = await axios.get(
        `https://bloomzon-seller-admin.onrender.com/api/v1/reels/admin/reels-sellers-summary-data`
      );
      if (res.data.success) {
        setKpis(res.data.data);
      }
    } catch (error) {
      console.error('Error fetching KPIs:', error);
      message.error("Failed to load KPIs");
    }
  };

  // ✅ Fetch all users from backend
  const fetchUsers = async () => {
    try {
      const res = await axios.get(
        `https://bloomzon-seller-admin.onrender.com/api/v1/reels/admin/all-reel-users?limit=50&page=1`
      );
      if (res.data.success) {
        // Map data to match your table structure
        const mappedUsers = res.data.data.map((u, i) => ({
          id: i + 1, // or use u._id if backend provides
          name: u.fullName,
          email: u.email,
          status: u.status,
          reelCount: u.reels,
        }));
        setUsers(mappedUsers);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      message.error("Failed to load users");
    }
  };

  // ✅ Run once on mount
  useEffect(() => {
    fetchKPIs();
    fetchUsers();
  }, []);

  // ✅ Filter users by search
  const filteredUsers = users.filter(
    (user) =>
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
          <Card><Statistic title="Total Users" value={kpis.totalUsers} /></Card>
        </Col>
        <Col span={24} md={4}>
          <Card><Statistic title="Total Reels" value={kpis.totalReels} /></Card>
        </Col>
        <Col span={24} md={4}>
          <Card><Statistic title="Pending Users" value={kpis.pendingUsers} /></Card>
        </Col>
        <Col span={24} md={6}>
          <Card><Statistic title="Total Likes" value={kpis.totalLikes} /></Card>
        </Col>
        <Col span={24} md={6}>
          <Card><Statistic title="Total Views" value={kpis.totalViews} /></Card>
        </Col>
      </Row>

      {/* Search */}
      <div className="flex justify-between">
        <Search
          placeholder="Search by name or email"
          onChange={(e) => setSearchText(e.target.value)}
          className="max-w-md"
          enterButton
        />

        {/* Commission Setting (Dummy Example, needs backend endpoint) */}
        <div className="flex">
          <Input placeholder="Type Promotion rate price" className="max-w-md" />
          <Button className="ml-2">Set Promotion Rate</Button>
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
