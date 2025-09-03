import React, { useEffect, useState } from "react";
import { Card, Statistic, DatePicker, Table, Spin, message } from "antd";
import { motion } from "framer-motion";
import axios from "axios";
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

const AdminReelsDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [analytics, setAnalytics] = useState({});
  const [sellerFeeData, setSellerFeeData] = useState([]);
  const [upsellData, setUpsellData] = useState([]);
  const [topReels, setTopReels] = useState([]);
  const [dailySalesData, setDailySalesData] = useState([]);
  const [dateRange, setDateRange] = useState([
    dayjs().subtract(7, "day"),
    dayjs(),
  ]);

  const baseURL = "https://bloomzon-seller-admin.onrender.com/api/v1/reels/admin";

  // Fetch all dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Analytics Overview
      const analyticsRes = await axios.get(`${baseURL}/analytics-overview-data`);
      setAnalytics(analyticsRes.data.data);

      // Seller Fee Breakdown
      const feeRes = await axios.get(`${baseURL}/seller-fee-breakdown`);
      setSellerFeeData([
        { name: "Flat Fees", value: feeRes.data.data.totalFlatFeeAmount },
        { name: "Commission", value: feeRes.data.data.totalCommissionAmount },
      ]);

      // Upsell Revenue
      const upsellRes = await axios.get(`${baseURL}/upsell-revenue`);
      setUpsellData([
        { name: "Boosted Listings", value: upsellRes.data.data.boostedListings },
        { name: "Premium Reels", value: upsellRes.data.data.premiumReels },
      ]);

      // Top Performing Reels
      const topReelsRes = await axios.get(`${baseURL}/top-performing`);
      setTopReels(topReelsRes.data.data);

      // Daily Sales (default range = last 7 days)
      await fetchDailySales(dateRange);

    } catch (err) {
      console.error(err);
      message.error("Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  };

  // Fetch daily sales with date range
  const fetchDailySales = async (range) => {
    if (!range || !range[0] || !range[1]) return;
    try {
      const [start, end] = range;
      const salesRes = await axios.get(
        `${baseURL}/daily-reels-sales?startDate=${start.format("YYYY-MM-DD")}&endDate=${end.format("YYYY-MM-DD")}`
      );

      const salesData = salesRes.data.data.data || [];
      setDailySalesData(
        salesData.map((s) => ({ date: s.date, sales: s.sales || 0 }))
      );
    } catch (err) {
      console.error(err);
      message.error("Failed to fetch daily sales");
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleDateChange = (dates) => {
    setDateRange(dates);
    fetchDailySales(dates);
  };

  return (
    <motion.div className="p-6 space-y-6">
      <div className="flex justify-between">
        <h1 className="font-bold text-[30px]">Reels Analytics</h1>
        <RangePicker
          className="mb-4"
          onChange={handleDateChange}
          value={dateRange}
        />
      </div>

      {loading ? (
        <Spin size="large" />
      ) : (
        <>
          {/* KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <Statistic
                title="Total Revenue"
                prefix="₦"
                value={analytics?.revenue?.totalRevenue || 0}
              />
            </Card>
            <Card>
              <Statistic
                title="Total Reels Sales"
                value={analytics?.totalReelsSales || 0}
              />
            </Card>
            <Card>
              <Statistic
                title="Active Sellers"
                value={analytics?.totalActiveSellers || 0}
              />
            </Card>
            <Card>
              <Statistic
                title="Engagement Rate"
                value={analytics?.engagementRate?.replace("%", "") || 0}
                suffix="%"
              />
            </Card>
          </div>

          {/* Seller Fees */}
          <Card title="Seller Fee Breakdown">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={sellerFeeData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {sellerFeeData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
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

          {/* Top Performing Reels */}
          <Card title="Top Performing Reels">
            <Table
              dataSource={topReels.map((r, index) => ({ ...r, key: index }))}
              columns={[
                { title: "Reel ID", dataIndex: "id", key: "id" },
                { title: "Title", dataIndex: "title", key: "title" },
                { title: "Seller", dataIndex: "sellerName", key: "sellerName" },
                { title: "Views", dataIndex: "viewsCount", key: "viewsCount" },
                { title: "Sales", dataIndex: "salesCount", key: "salesCount" },
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
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#1890ff"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </>
      )}
    </motion.div>
  );
};

export default AdminReelsDashboard;
