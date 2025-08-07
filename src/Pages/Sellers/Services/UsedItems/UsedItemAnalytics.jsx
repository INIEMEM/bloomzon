import React from 'react';
import { Card, Col, Row, Table, Typography } from 'antd';
import { motion } from 'framer-motion';
import dayjs from 'dayjs';
import { DatePicker } from 'antd';
const { RangePicker } = DatePicker;

import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';

const { Title, Paragraph } = Typography;

const revenueData = [
  { name: 'Listing Fees', value: 800 },
  { name: 'Commission on Sale', value: 3500 },
  { name: 'Delivery Charges', value: 1800 },
  { name: 'Verification Services', value: 700 },
  { name: 'Ads & Promotions', value: 1200 },
];
// New dummy data for monthly performance by revenue stream
const revenueStreamPerformance = [
  { month: 'Mar', listingFees: 200, commission: 900, delivery: 500, verification: 150, ads: 300 },
  { month: 'Apr', listingFees: 180, commission: 1100, delivery: 450, verification: 120, ads: 260 },
  { month: 'May', listingFees: 250, commission: 1300, delivery: 600, verification: 200, ads: 400 },
  { month: 'Jun', listingFees: 210, commission: 1250, delivery: 550, verification: 170, ads: 320 },
  { month: 'Jul', listingFees: 260, commission: 1350, delivery: 700, verification: 190, ads: 380 },
  { month: 'Aug', listingFees: 230, commission: 1400, delivery: 680, verification: 160, ads: 350 },
];

// Colors mapped to streams
const streamColors = {
  listingFees: '#1890ff',
  commission: '#52c41a',
  delivery: '#faad14',
  verification: '#eb2f96',
  ads: '#722ed1',
};


const COLORS = ['#1890ff', '#52c41a', '#faad14', '#eb2f96', '#722ed1'];

const monthlyEarnings = [
  { month: 'Jan', total: 2400 },
  { month: 'Feb', total: 3200 },
  { month: 'Mar', total: 4100 },
  { month: 'Apr', total: 3000 },
  { month: 'May', total: 4700 },
  { month: 'Jun', total: 3900 },
  { month: 'Jul', total: 5200 },
];
const topProductsByRevenue = [
  {
    key: '1',
    title: 'MacBook Pro M1',
    stream: 'Commission on Sale',
    amount: 800,
  },
  {
    key: '2',
    title: 'iPhone 11 Boosted',
    stream: 'Listing Fees',
    amount: 200,
  },
  {
    key: '3',
    title: 'Gaming Laptop Verified',
    stream: 'Verification Services',
    amount: 150,
  },
  {
    key: '4',
    title: 'Washer Delivery',
    stream: 'Delivery Charges',
    amount: 300,
  },
  {
    key: '5',
    title: 'Banner Ad - Tech Store',
    stream: 'Ads & Promotions',
    amount: 250,
  },
];


const revenueBreakdownTable = [
  {
    key: '1',
    stream: 'Listing Fees',
    description: 'Sellers pay to promote or "boost" items for more visibility.',
  },
  {
    key: '2',
    stream: 'Commission on Sale',
    description: 'A percentage (e.g., 5-10%) is deducted when a sale is completed through the platform.',
  },
  {
    key: '3',
    stream: 'Delivery Charges',
    description: 'Logistics fees for Bloomzon-facilitated deliveries.',
  },
  {
    key: '4',
    stream: 'Verification Services',
    description: 'Fee for verifying authenticity and quality of high-value used items.',
  },
  {
    key: '5',
    stream: 'Ads & Promotions',
    description: 'Featured sellers or shops can pay for banner ads or category highlights.',
  },
];

const calculateGrowth = (data) => {
  const growth = [];
  for (let i = 1; i < data.length; i++) {
    const prev = data[i - 1];
    const curr = data[i];
    growth.push({
      month: curr.month,
      listingFees: ((curr.listingFees - prev.listingFees) / prev.listingFees * 100).toFixed(1),
      commission: ((curr.commission - prev.commission) / prev.commission * 100).toFixed(1),
      delivery: ((curr.delivery - prev.delivery) / prev.delivery * 100).toFixed(1),
      verification: ((curr.verification - prev.verification) / prev.verification * 100).toFixed(1),
      ads: ((curr.ads - prev.ads) / prev.ads * 100).toFixed(1),
    });
  }
  return growth;
};

const growthData = calculateGrowth(revenueStreamPerformance);

const UsedItemAnalytics = () => {
  const [filteredRange, setFilteredRange] = React.useState([null, null]);

  return (
    <motion.div
      className="p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Title level={2}>Used Items Analytics</Title>

      <Row gutter={24} className="mt-4">
        <Col span={12}>
          <Card title="Revenue Sources Breakdown">
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
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col span={12}>
          <Card title="Monthly Earnings Overview">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyEarnings}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total" fill="#1890ff" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
      <Card className="mt-6" title="Revenue Streams Performance (Monthly Breakdown)">
  <ResponsiveContainer width="100%" height={400}>
    <BarChart data={revenueStreamPerformance} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="month" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="listingFees" stackId="a" fill={streamColors.listingFees} name="Listing Fees" />
      <Bar dataKey="commission" stackId="a" fill={streamColors.commission} name="Commission" />
      <Bar dataKey="delivery" stackId="a" fill={streamColors.delivery} name="Delivery Charges" />
      <Bar dataKey="verification" stackId="a" fill={streamColors.verification} name="Verification" />
      <Bar dataKey="ads" stackId="a" fill={streamColors.ads} name="Ads & Promotions" />
    </BarChart>
  </ResponsiveContainer>
</Card>
<Card className="mt-6" title="Revenue Streams Performance (Monthly Breakdown)">
  <div className="flex justify-between mb-4 items-center">
    <span className="font-semibold">Filter by Date Range:</span>
    <RangePicker
      picker="month"
      onChange={(dates) => setFilteredRange(dates)}
      allowClear
    />
  </div>

  <ResponsiveContainer width="100%" height={400}>
    <BarChart
      data={
        filteredRange[0] && filteredRange[1]
          ? revenueStreamPerformance.filter(item => {
              const itemMonth = dayjs(item.month, 'MMM');
              return itemMonth.isAfter(filteredRange[0]) && itemMonth.isBefore(filteredRange[1]);
            })
          : revenueStreamPerformance
      }
      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="month" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="listingFees" stackId="a" fill={streamColors.listingFees} name="Listing Fees" />
      <Bar dataKey="commission" stackId="a" fill={streamColors.commission} name="Commission" />
      <Bar dataKey="delivery" stackId="a" fill={streamColors.delivery} name="Delivery Charges" />
      <Bar dataKey="verification" stackId="a" fill={streamColors.verification} name="Verification" />
      <Bar dataKey="ads" stackId="a" fill={streamColors.ads} name="Ads & Promotions" />
    </BarChart>
  </ResponsiveContainer>
</Card>

<Card className="mt-6" title="Top Products by Revenue Stream">
  <Table
    dataSource={topProductsByRevenue}
    columns={[
      { title: 'Product / Service', dataIndex: 'title' },
      { title: 'Revenue Stream', dataIndex: 'stream' },
      { title: 'Amount ($)', dataIndex: 'amount' },
    ]}
    pagination={false}
  />
</Card>
<Card className="mt-6" title="Revenue Stream Growth (%) Over Time">
  <ResponsiveContainer width="100%" height={400}>
    <BarChart data={growthData}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="month" />
      <YAxis domain={[-100, 200]} tickFormatter={(v) => `${v}%`} />
      <Tooltip formatter={(value) => `${value}%`} />
      <Legend />
      <Bar dataKey="listingFees" fill={streamColors.listingFees} name="Listing Fees" />
      <Bar dataKey="commission" fill={streamColors.commission} name="Commission" />
      <Bar dataKey="delivery" fill={streamColors.delivery} name="Delivery Charges" />
      <Bar dataKey="verification" fill={streamColors.verification} name="Verification" />
      <Bar dataKey="ads" fill={streamColors.ads} name="Ads & Promotions" />
    </BarChart>
  </ResponsiveContainer>
</Card>
      {/* <Card className="mt-6" title="Revenue Stream Descriptions">
        <Table
          columns={[
            { title: 'Revenue Stream', dataIndex: 'stream', key: 'stream' },
            { title: 'Description', dataIndex: 'description', key: 'description' },
          ]}
          dataSource={revenueBreakdownTable}
          pagination={false}
        />
      </Card> */}

      {/* <Card className="mt-6" title="How the Used Items Service Works">
        <Paragraph>
          Bloomzon’s Used Items marketplace allows individuals and businesses to list and sell
          second-hand products directly to buyers. Think of it as your own version of Jiji or Facebook
          Marketplace — but integrated within Bloomzon’s trusted platform and logistics.
        </Paragraph>

        <ol className="list-decimal ml-6 text-gray-700 space-y-2">
          <li>
            <strong>Seller Registration & Product Listing:</strong> Users sign up, list items, and can
            optionally request verification or warehousing.
          </li>
          <li>
            <strong>Buyer Browses & Buys:</strong> Buyers browse by category, filter listings, and either
            contact sellers or buy through Bloomzon's system.
          </li>
          <li>
            <strong>Delivery (if enabled):</strong> Bloomzon logistics handles delivery, including optional
            Pay on Delivery.
          </li>
          <li>
            <strong>Transaction Completed:</strong> After confirmation, funds are released to the seller.
          </li>
        </ol>
      </Card> */}
    </motion.div>
  );
};

export default UsedItemAnalytics;
