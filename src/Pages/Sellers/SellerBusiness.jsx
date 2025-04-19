import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Table, Button, Input } from 'antd';
import { motion } from 'framer-motion';
import UserMatrxs from '../../Components/UserMatrixs/UserMatrxs';
import { ArrowDownOutlined, ArrowUpOutlined, DollarOutlined } from '@ant-design/icons';

const { Search } = Input;

const SellerBusiness = () => {
  const { business } = useParams();

  // Sample data for the table
  const initialDataSource = [
    {
      key: '1',
      sn: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      walletBalance: '$500.00',
      date: '2024-12-27',
    },
    {
      key: '2',
      sn: 2,
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      walletBalance: '$300.00',
      date: '2024-12-26',
    },
  ];

  // State to manage filtered data
  const [dataSource, setDataSource] = useState(initialDataSource);

  // Columns for the table
  const columns = [
    {
      title: 'S/N',
      dataIndex: 'sn',
      key: 'sn',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Wallet Balance',
      dataIndex: 'walletBalance',
      key: 'walletBalance',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button type="default" style={{ color: 'var(--primary-color)', borderColor: 'var(--primary-color)' }}>View Details</Button>
          <Button danger>Ban User</Button>
          <Button type="default">Suspend User</Button>
          <Button type="default" style={{ color: '#41CCC7', borderColor: '#41CCC7' }}>
            Activate User
          </Button>
        </div>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
  ];

  // Function to handle search
  const handleSearch = (value) => {
    const filteredData = initialDataSource.filter(
      (item) =>
        item.name.toLowerCase().includes(value.toLowerCase()) ||
        item.email.toLowerCase().includes(value.toLowerCase())
    );
    setDataSource(filteredData);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      style={{ padding: 20 }}
    >
      <h1 style={{ color: '#323232' }}>{business} business details</h1>
      <div className="flex" style={{ gap: 20 }}>
        <UserMatrxs
          matrix="5,600"
          title="Total Revenue"
          border={true}
          icon={<DollarOutlined style={{ fontSize: 40, color: '#41CCC7' }} />}
        />
        <UserMatrxs
          matrix="560"
          title="Total Profit (10%)"
          border={true}
          icon={<ArrowUpOutlined style={{ fontSize: 40, color: '#41CCC7' }} />}
        />
        <UserMatrxs
          matrix="233.083"
          title="Total Losses (5.2%)"
          border={true}
          icon={<ArrowDownOutlined style={{ fontSize: 40, color: '#F42121' }} />}
        />
      </div>
      <div style={{ marginTop: 20 }}>
        <div className="flex flex-justify-between">
        <p style={{ fontSize: 16, color: '#323232', fontWeight: 500 }}>{business} business List (2)</p>
        <div style={{ marginBottom: 16 }}>
          <Search
            placeholder="Search by Name or Email"
            allowClear
            onSearch={handleSearch}
            style={{ width: 300 }}
          />
        </div>
        </div>
        <Table
          className="admin-table"
          dataSource={dataSource}
          columns={columns}
          pagination={{ pageSize: 5 }}
        />
      </div>
    </motion.div>
  );
};

export default SellerBusiness;
