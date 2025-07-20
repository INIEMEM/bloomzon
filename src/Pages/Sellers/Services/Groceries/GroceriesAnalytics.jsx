import React, { useState } from 'react';
import {
  Card, Col, Row, Statistic, Select, DatePicker, Button, message, Progress
} from 'antd';

import { DownloadOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Legend,
  LineChart, Line
} from 'recharts';

const { Option } = Select;

const revenueData = [
  { name: 'Direct Sales', value: 350000 },
  { name: 'Marketplace Commissions', value: 150000 },
  { name: 'Fulfillment & Logistics', value: 80000 },
  { name: 'Advertising Fees', value: 120000 },
  { name: 'Elite Membership', value: 50000 },
  { name: 'Private Labels', value: 90000 },
];
const topProducts = [
  { name: 'Bloomzon Rice 5kg', sales: 480 },
  { name: 'Happy Belly Juice', sales: 320 },
  { name: 'Bloomzon Fresh Oil', sales: 300 },
  { name: 'Oreo Cookies', sales: 150 },
];

const conversionRate = 42;
const monthlyRevenue = [
  { month: 'Jan', Direct: 50000, Ads: 15000, Marketplace: 10000 },
  { month: 'Feb', Direct: 60000, Ads: 20000, Marketplace: 15000 },
  { month: 'Mar', Direct: 80000, Ads: 25000, Marketplace: 20000 },
  { month: 'Apr', Direct: 70000, Ads: 18000, Marketplace: 17000 },
  { month: 'May', Direct: 85000, Ads: 26000, Marketplace: 22000 },
  { month: 'Jun', Direct: 90000, Ads: 30000, Marketplace: 25000 },
];

const marginData = [
  { name: 'Happy Belly', margin: 0.4 },
  { name: 'Bloomzon Fresh', margin: 0.35 },
  { name: 'Third-party Sales', margin: 0.12 },
  { name: 'Ads', margin: 0.75 },
  { name: 'FBB', margin: 0.3 },
  { name: 'Elite Subscriptions', margin: 0.5 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#7356BF', '#FF6666'];
import { Table, Tag } from 'antd';

const transactionColumns = [
  {
    title: 'Transaction ID',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: 'Stream',
    dataIndex: 'stream',
    key: 'stream',
    render: (text) => <Tag color="blue">{text}</Tag>,
  },
  {
    title: 'Amount',
    dataIndex: 'amount',
    key: 'amount',
    render: (value) => `₦${value.toLocaleString()}`,
  },
  {
    title: 'Date',
    dataIndex: 'date',
    key: 'date',
  },
];

const transactions = [
  { id: 'TXN001', stream: 'Direct Sales', amount: 5500, date: '2025-07-01' },
  { id: 'TXN002', stream: 'Ads', amount: 12000, date: '2025-07-01' },
  { id: 'TXN003', stream: 'FBB', amount: 8700, date: '2025-07-02' },
  { id: 'TXN004', stream: 'Private Labels', amount: 9600, date: '2025-07-02' },
];

const GroceriesBloomzonRevenueDashboard = () => {
  const [year, setYear] = useState('2025');
  const [month, setMonth] = useState(null);
  const [category, setCategory] = useState(null);

  const exportCSV = () => {
    const headers = ['Month', 'Direct', 'Ads', 'Marketplace'];
    const rows = monthlyRevenue.map(row =>
      [row.month, row.Direct, row.Ads, row.Marketplace].join(',')
    );
    const csvContent = [headers.join(','), ...rows].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'monthly_revenue.csv';
    a.click();
    message.success('CSV exported successfully!');
  };
  const fulfillmentData = [
    { name: 'FBB (Fulfilled by Bloomzon)', value: 700 },
    { name: 'Non-FBB', value: 300 },
  ];
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="p-6"
    >
      <h2 className="text-2xl font-bold mb-4">Bloomzon Revenue Analytics</h2>

      {/* Filter Controls */}
      <Row gutter={16} className="mb-4">
        <Col xs={24} sm={8}>
          <Select
            className="w-full"
            placeholder="Select Year"
            value={year}
            onChange={setYear}
          >
            <Option value="2023">2023</Option>
            <Option value="2024">2024</Option>
            <Option value="2025">2025</Option>
          </Select>
        </Col>
        <Col xs={24} sm={8}>
          <DatePicker.MonthPicker
            className="w-full"
            placeholder="Filter by Month"
            onChange={(_, dateString) => setMonth(dateString)}
          />
        </Col>
        <Col xs={24} sm={8}>
          <Select
            className="w-full"
            placeholder="Filter by Category"
            allowClear
            onChange={setCategory}
          >
            <Option value="Direct Sales">Direct Sales</Option>
            <Option value="Ads">Ads</Option>
            <Option value="Marketplace">Marketplace</Option>
          </Select>
        </Col>
      </Row>

      {/* Export CSV */}
      <div className="mb-6 text-right">
        <Button icon={<DownloadOutlined />} onClick={exportCSV}>
          Export CSV
        </Button>
      </div>

      {/* Monthly Revenue Line Chart */}
      <Card title="Monthly Revenue Trends">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyRevenue}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="Direct" stroke="#8884d8" />
            <Line type="monotone" dataKey="Ads" stroke="#82ca9d" />
            <Line type="monotone" dataKey="Marketplace" stroke="#ffc658" />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Charts and Summary */}
      <Row gutter={[24, 24]} className="mt-6">
        <Col xs={24} md={12}>
          <Card title="Revenue Distribution by Stream">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={revenueData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label
                >
                  {revenueData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card title="Profit Margin per Stream">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={marginData}>
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(v) => `${v * 100}%`} />
                <Tooltip formatter={(value) => `${(value * 100).toFixed(0)}%`} />
                <Legend />
                <Bar dataKey="margin" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
      <Row gutter={[24, 24]} className="mt-6">
          <Col xs={24} md={12}>
            <Card title="Top Performing Products">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topProducts}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="sales" fill="#1890ff" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </Col>

          <Col xs={24} md={12}>
            <Card title="Conversion Rate">
              <Statistic
                title="Visits → Purchases"
                value={conversionRate}
                suffix="%"
                valueStyle={{ color: '#3f8600' }}
              />
              <Progress percent={conversionRate} strokeColor="#3f8600" />
            </Card>
          </Col>
      </Row>
      <Row className="mt-6">
        <Col span={24}>
          <Card title="Fulfillment Preference (FBB vs Non-FBB)">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={fulfillmentData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                  dataKey="value"
                >
                  {fulfillmentData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
        
      {/* Summary Cards */}
      <Row gutter={[24, 24]} className="mt-6">
        {revenueData.map((item, index) => (
          <Col xs={24} sm={12} md={8} key={index}>
            <Card bordered={false}>
              <Statistic
                title={item.name}
                value={item.value}
                prefix="₦"
                valueStyle={{ color: COLORS[index % COLORS.length] }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      <Row className="mt-6">
      <Col span={24}>
        <Card title="Recent Revenue Transactions">
          <Table
            dataSource={transactions}
            columns={transactionColumns}
            rowKey="id"
            pagination={{ pageSize: 5 }}
          />
        </Card>
      </Col>
    </Row>

    </motion.div>
  );
};

export default GroceriesBloomzonRevenueDashboard;
