import React, { useState } from 'react';
import { Table, Input, Select, Modal, Button, Space } from 'antd';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend,
} from 'chart.js';
import BigGraphs from '../../../../Components/BigGraphs/BigGraphs';
import UserMatrxs from '../../../../Components/UserMatrixs/UserMatrxs';
import { BloomzonHealthCare } from '../../../../Icons/icon';
import { FaCircle } from 'react-icons/fa';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
const { Search } = Input;

const Groceries = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const [searchText, setSearchText] = useState('');
  const [filteredUsers, setFilteredUsers] = useState(null);
  const [users, setUsers] = useState([
    {
      id: '1',
      name: 'Alice Smith',
      email: 'alice.smith@example.com',
      phone: '08012345678',
      registrationDate: '2025-04-01',
      status: 'active',
      products: [{ name: 'Apples', description: 'Fresh red apples', status: 'approved' }],
    },
    {
      id: '2',
      name: 'Bob Johnson',
      email: 'bob.johnson@example.com',
      phone: '09087654321',
      registrationDate: '2025-04-05',
      status: 'suspended',
      products: [{ name: 'Milk', description: 'Full cream milk', status: 'pending' }],
    },
  ]);

  const handleSearch = (value) => {
    setSearchText(value);
    if (!value) {
      setFilteredUsers(null);
      return;
    }

    const filteredData = users.filter((user) =>
      Object.values(user).some(
        (item) => typeof item === 'string' && item.toLowerCase().includes(value.toLowerCase())
      )
    );
    setFilteredUsers(filteredData);
  };

  const handleStatusChange = (id, newStatus) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === id ? { ...user, status: newStatus } : user
      )
    );
  };

  const handleViewDetails = (userId) => {
    // You would typically navigate to a user details page here
    // For example: navigate(`/admin/users/${userId}`);
    console.log(`View details for user with ID: ${userId}`);
    // In a real application, you'd use the navigate function:
    navigate(`/dashboard/sellers/services/groceries-beverages/${userId}`);
  };

  const columns = [
    {
      title: 'S/N',
      dataIndex: 'id',
      key: 'id',
      render: (text, record, index) => index + 1,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div className="flex items-center">
          {record.products.some(product => product.status === 'pending') && (
            <motion.div
              className="w-2 h-2 rounded-full bg-red-500 mr-2"
              animate={{ opacity: [0.2, 0.8, 0.2] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          )}
          {text}
        </div>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Phone Number',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Date',
      dataIndex: 'registrationDate',
      key: 'registrationDate',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <span className={status === 'active' ? 'text-green-500' : status === 'suspended' ? 'text-yellow-500' : 'text-red-500'}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button size="small" onClick={() => handleViewDetails(record.id)}>
            View Details
          </Button>
          {record.status !== 'active' && (
            <Button size="small" onClick={() => handleStatusChange(record.id, 'active')}>
              Activate
            </Button>
          )}
          {record.status !== 'banned' && (
            <Button size="small" danger onClick={() => handleStatusChange(record.id, 'banned')}>
              Ban
            </Button>
          )}
        </Space>
      ),
    },
  ];

  // Dummy data for the bar chart (last 6 months sales)
  const Elitedata = {
    labels: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
    datasets: [
      {
        label: 'Sales (NGN)',
        data: [15000, 22000, 18000, 25000, 20000, 28000],
        backgroundColor: '#41CCC7',
      },
    ],
  };

  const Eliteoptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Sales Performance (Last 6 Months)',
      },
    },
  };

  // Dummy data for user status matrix
  const allUsersCount = users.length;
  const suspendedUsersCount = users.filter(user => user.status === 'suspended').length;
  const bannedUsersCount = users.filter(user => user.status === 'banned').length;

  return (
    <motion.div
      className='p-[20px]'
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
    >
      <h1 className='text-[2rem] font-bold mb-4'>All groceries and beverages Sellers</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Sales Bar Chart */}
        <BigGraphs
          title=""
          content={<Bar data={Elitedata} options={Eliteoptions} />}
          subTitle=""
          links={`../dashboard/sellers/business/seller`}
        />

        {/* User Status Matrix */}
        <div className="grid grid-cols-2 gap-4">
          <UserMatrxs matrix={allUsersCount} title="All Users" icon={<BloomzonHealthCare />} />
          <UserMatrxs matrix={suspendedUsersCount} title="Suspended" icon={<BloomzonHealthCare />} />
          <UserMatrxs matrix={bannedUsersCount} title="Banned" icon={<BloomzonHealthCare />} />
          {/* You can add another UserMatrxs here if needed */}
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <Search
          placeholder="Search users..."
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      {/* User Table */}
      <Table
        columns={columns}
        dataSource={filteredUsers || users}
        rowKey="id"
        className='admin-table'

      />
    </motion.div>
  );
};

export default Groceries;