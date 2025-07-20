import React, { useState } from "react";
import { Card, Statistic, DatePicker, Table } from "antd";
import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from "recharts";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

const COLORS = ["#1890ff", "#13c2c2", "#faad14", "#eb2f96"];

const sellerFeeData = [
  { name: "Flat Fees", value: 3200 },
  { name: "Commission", value: 6800 },
];

const upsellData = [
  { name: "Boosted Listings", value: 1200 },
  { name: "Premium Reel Slots", value: 800 },
];

const engagementStats = [
  { label: "Avg Watch Time", value: "4.2 mins" },
  { label: "Return Viewers", value: "35%" },
  { label: "Total Video Views", value: "48,300" },
];

const conversionData = [
  { stage: "Views", value: 48000 },
  { stage: "Engaged", value: 31000 },
  { stage: "Added to Cart", value: 9200 },
  { stage: "Purchased", value: 4800 },
];

const topReels = [
  { id: "R1023", title: "Wireless Earbuds", seller: "TechHaus", views: 9500, sales: 320 },
  { id: "R1045", title: "Smart Blender", seller: "HomePro", views: 8700, sales: 280 },
  { id: "R1078", title: "Yoga Mat", seller: "FitGear", views: 8100, sales: 240 },
];

const dailySalesData = [
  { date: "2025-07-10", sales: 450 },
  { date: "2025-07-11", sales: 620 },
  { date: "2025-07-12", sales: 500 },
  { date: "2025-07-13", sales: 700 },
  { date: "2025-07-14", sales: 850 },
  { date: "2025-07-15", sales: 920 },
  { date: "2025-07-16", sales: 790 },
];

const AdminReelsDashboard = () => {
  const [dateRange, setDateRange] = useState([null, null]);

  const handleDateChange = (dates) => {
    setDateRange(dates);
    // Trigger API call to fetch data within selected range
  };

  return (
    <motion.div className="p-6 space-y-6">
      {/* Date Filter */}
      <div className="flex justify-between">
        <h1 className="font-bold text-[30px]">Reels Analytics</h1>
        <RangePicker
          className="mb-4"
          onChange={handleDateChange}
          defaultValue={[dayjs().subtract(7, 'day'), dayjs()]}
        />
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card><Statistic title="Total Revenue" prefix="₦" value={142000} /></Card>
        <Card><Statistic title="Total Reels Sales" value={9800} /></Card>
        <Card><Statistic title="Active Sellers" value={530} /></Card>
        <Card><Statistic title="Engagement Rate" suffix="%" value={78.4} precision={1} /></Card>
      </div>

      {/* Seller Fees */}
      <Card title="Seller Fee Breakdown">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={sellerFeeData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
              {sellerFeeData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </Card>

      {/* Upsell Revenue */}
      <Card title="Upsell Revenue">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={upsellData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#13c2c2" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Engagement */}
      <Card title="User Engagement Insights">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {engagementStats.map((stat, i) => (
            <Card key={i}><Statistic title={stat.label} value={stat.value} /></Card>
          ))}
        </div>
      </Card>
          
      {/* Conversion Funnel */}
      <Card title="Funnel: From Views to Purchase">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={conversionData}>
            <XAxis dataKey="stage" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#fa541c" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Top Performing Reels */}
      <Card title="Top Performing Reels">
        <Table
          dataSource={topReels.map((r, index) => ({ ...r, key: index }))}
          columns={[
            { title: "Reel ID", dataIndex: "id", key: "id" },
            { title: "Title", dataIndex: "title", key: "title" },
            { title: "Seller", dataIndex: "seller", key: "seller" },
            { title: "Views", dataIndex: "views", key: "views" },
            { title: "Sales", dataIndex: "sales", key: "sales" },
          ]}
          pagination={{ pageSize: 5 }}
          className="admin-table"
        />
      </Card>

      {/* Daily Sales Line Chart */}
      <Card title="Daily Sales Growth">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={dailySalesData}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="sales" stroke="#1890ff" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </motion.div>
  );
};

export default AdminReelsDashboard;
