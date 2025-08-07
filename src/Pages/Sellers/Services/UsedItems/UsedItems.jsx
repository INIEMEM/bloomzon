import React, { useState } from 'react';
import { Tabs, Table, Card, Statistic, Button, Modal, Form, Input, Select, Upload, Switch, Radio, Row, Col } from 'antd';
import { PlusOutlined, UploadOutlined, SearchOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const { TabPane } = Tabs;
const { Option } = Select;

const dummyUsers = [
  { key: '1', id: '1', name: 'Jane Doe', email: 'jane@example.com', phone: '08012345678', status: 'active' },
  { key: '2', id: '2', name: 'John Smith', email: 'john@example.com', phone: '08087654321', status: 'suspended' },
];



export default function UsedItemsAdmin() {
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);

  const [searchText, setSearchText] = useState('');
  const navigate = useNavigate();

  const filteredUsers = dummyUsers.filter(user =>
    user.name.toLowerCase().includes(searchText.toLowerCase()) ||
    user.email.toLowerCase().includes(searchText.toLowerCase()) ||
    user.phone.includes(searchText)
  );

  return (
    <motion.div className="p-6 space-y-6">
      <Row gutter={16}>
        <Col span={8}><Card><Statistic title="Total Users" value={200} /></Card></Col>
        <Col span={8}><Card><Statistic title="Active Users" value={170} /></Card></Col>
        <Col span={8}><Card><Statistic title="Suspended Users" value={30} /></Card></Col>
      </Row>

      <div className="flex justify-between items-center mt-6">
        <h2 className="text-xl font-semibold">Used Items Users</h2>
        <div className="flex gap-2">
          <Input
            placeholder="Search by name, email or phone"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-64"
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setShowCreateUserModal(true)}>
            Create User
          </Button>
        </div>
      </div>

      <Table
        dataSource={filteredUsers}
        columns={[
          { title: 'Name', dataIndex: 'name', sorter: (a, b) => a.name.localeCompare(b.name) },
          { title: 'Email', dataIndex: 'email', sorter: (a, b) => a.email.localeCompare(b.email) },
          { title: 'Phone Number', dataIndex: 'phone' },
          { title: 'Status', dataIndex: 'status', filters: [
            { text: 'Active', value: 'active' },
            { text: 'Suspended', value: 'suspended' },
          ],
            onFilter: (value, record) => record.status === value },
          {
            title: 'Action',
            render: (_, record) => (
              <>
                <Button type="link" onClick={() => navigate(`/dashboard/sellers/services/used-items/${record.id}`)}>View Details</Button>
                <Button type="link" danger>Delete</Button>
              </>
            ),
          },
        ]}
      />

     
    </motion.div>
  );
}

