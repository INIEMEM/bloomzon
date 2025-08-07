// RealEstateAnalytics.jsx
import React, { useState } from "react";
import { Card, Statistic, Row, Col, DatePicker, Select } from "antd";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
} from "recharts";
import { DollarOutlined } from "@ant-design/icons";
import moment from "moment";

moment.locale("en");

const { RangePicker } = DatePicker;
const { Option } = Select;

const revenueData = [
  { name: "Listing Fees", amount: 12000 },
  { name: "Featured Listings", amount: 8000 },
  { name: "Commission", amount: 15000 },
  { name: "Legal Services", amount: 5000 },
  { name: "Inspection Fees", amount: 3000 },
  { name: "Subscriptions", amount: 10000 },
];

const monthlyRevenue = [
  { month: "Jan", Listing: 2000, Featured: 1200, Commission: 3000, Legal: 800, Inspection: 400, Subscriptions: 1500 },
  { month: "Feb", Listing: 2200, Featured: 1000, Commission: 2800, Legal: 700, Inspection: 450, Subscriptions: 1600 },
  { month: "Mar", Listing: 2100, Featured: 1300, Commission: 3100, Legal: 600, Inspection: 420, Subscriptions: 1550 },
  { month: "Apr", Listing: 2500, Featured: 1400, Commission: 3500, Legal: 1000, Inspection: 500, Subscriptions: 1800 },
];
const monthlyServiceData = [
  { month: "Jan", Listing: 2000, Featured: 1000, Commission: 3000 },
  { month: "Feb", Listing: 2500, Featured: 1200, Commission: 3200 },
  { month: "Mar", Listing: 2200, Featured: 1100, Commission: 2900 },
  { month: "Apr", Listing: 2800, Featured: 1300, Commission: 3500 },
  { month: "May", Listing: 3000, Featured: 1500, Commission: 4000 },
  { month: "Jun", Listing: 3200, Featured: 1700, Commission: 4200 },
];
const trendData = [
  { month: "Mar", revenue: 22000 },
  { month: "Apr", revenue: 25000 },
  { month: "May", revenue: 29000 },
  { month: "Jun", revenue: 31000 },
];
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28EF5", "#FF6699"];

const RealEstateAnalytics = () => {
  const [dateRange, setDateRange] = useState([]);

  const totalRevenue = revenueData.reduce((acc, item) => acc + item.amount, 0);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Real Estate Revenue Analytics</h1>

      {/* Filters */}
      <div className="flex justify-between items-center mb-6">
        <RangePicker onChange={(dates) => setDateRange(dates)} />
        <Select defaultValue="Monthly" style={{ width: 160 }}>
          <Option value="Monthly">Monthly Comparison</Option>
          <Option value="Quarterly">Quarterly</Option>
        </Select>
      </div>

      {/* KPI */}
      <Row gutter={[16, 16]} className="mb-8">
        <Col span={8}>
          <Card>
            <Statistic
              title="Total Revenue"
              value={`₦${totalRevenue.toLocaleString()}`}
              prefix={<DollarOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Top Source"
              value={revenueData.reduce((max, item) => (item.amount > max.amount ? item : max)).name}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="Date Range Selected" value={dateRange.length ? `${dateRange[0].format("MMM D")} - ${dateRange[1].format("MMM D")}` : "All Time"} />
          </Card>
        </Col>
      </Row>

      {/* Revenue Breakdown */}
      <Row gutter={[24, 24]}>
        <Col xs={24} md={12}>
          <Card title="Revenue by Source">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData} layout="vertical">
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" />
                <Tooltip />
                <Bar dataKey="amount" fill="#1890ff" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card title="Revenue Distribution">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={revenueData}
                  dataKey="amount"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {revenueData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Monthly Breakdown Chart */}
      <div className="mt-12">
        <h3 className="text-lg font-semibold mb-2">Monthly Performance by Service</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyServiceData}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Listing" stackId="a" fill="#8884d8" />
            <Bar dataKey="Featured" stackId="a" fill="#82ca9d" />
            <Bar dataKey="Commission" stackId="a" fill="#ffc658" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-12">
        <h3 className="text-lg font-semibold mb-2">Revenue Trend Over Time</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={trendData}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="revenue" stroke="#1890ff" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RealEstateAnalytics;
