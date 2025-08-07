// RevenueAnalytics.jsx
import React, { useState } from "react";
import { Card, Select, DatePicker, Statistic, Row, Col } from "antd";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  LineChart,
  Line,
} from "recharts";

const { Option } = Select;
const { RangePicker } = DatePicker;

const fullRevenueData = [
  { month: "Jan", category: "Listing Fees", value: 20000 },
  { month: "Jan", category: "Commission on Sales", value: 30000 },
  { month: "Jan", category: "Delivery Charges", value: 10000 },
  { month: "Jan", category: "Verification Services", value: 5000 },
  { month: "Jan", category: "Ads & Promotions", value: 7000 },
  { month: "Feb", category: "Listing Fees", value: 25000 },
  { month: "Feb", category: "Commission on Sales", value: 35000 },
  { month: "Feb", category: "Delivery Charges", value: 15000 },
  { month: "Feb", category: "Verification Services", value: 4000 },
  { month: "Feb", category: "Ads & Promotions", value: 6000 },
  { month: "Mar", category: "Listing Fees", value: 30000 },
  { month: "Mar", category: "Commission on Sales", value: 40000 },
  { month: "Mar", category: "Delivery Charges", value: 20000 },
  { month: "Mar", category: "Verification Services", value: 5000 },
  { month: "Mar", category: "Ads & Promotions", value: 7000 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AA00FF"];

const AutomobileRevenueAnalytics = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredData = selectedCategory === "all"
    ? fullRevenueData
    : fullRevenueData.filter((item) => item.category === selectedCategory);

  const pieData = [
    ...fullRevenueData.reduce((acc, item) => {
      const existing = acc.get(item.category) || 0;
      acc.set(item.category, existing + item.value);
      return acc;
    }, new Map())
  ].map(([name, value]) => ({ name, value }));

  const latestMonth = "Mar";
  const previousMonth = "Feb";

  const getTotalForMonth = (month) =>
    fullRevenueData
      .filter((item) => item.month === month && (selectedCategory === "all" || item.category === selectedCategory))
      .reduce((acc, item) => acc + item.value, 0);

  const currentTotal = getTotalForMonth(latestMonth);
  const previousTotal = getTotalForMonth(previousMonth);
  const difference = currentTotal - previousTotal;
  const percentageChange = ((difference / previousTotal) * 100).toFixed(1);

  return (
    <div className="p-6 space-y-8">
    {/* Main Analytics Card */}
    <Card title="Revenue Breakdown & Trends" className="shadow-md">
      {/* Filters */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <RangePicker />
        <Select
          value={selectedCategory}
          onChange={setSelectedCategory}
          style={{ width: 250 }}
        >
          <Option value="all">All Revenue Streams</Option>
          <Option value="Listing Fees">Listing Fees</Option>
          <Option value="Commission on Sales">Commission on Sales</Option>
          <Option value="Delivery Charges">Delivery Charges</Option>
          <Option value="Verification Services">Verification Services</Option>
          <Option value="Ads & Promotions">Ads & Promotions</Option>
        </Select>
      </div>

      {/* KPIs */}
      <Row gutter={16} className="mb-6">
        <Col span={8}>
          <Statistic title={`Total Revenue in ${latestMonth}`} value={`₦${currentTotal.toLocaleString()}`} />
        </Col>
        <Col span={8}>
          <Statistic title={`Total Revenue in ${previousMonth}`} value={`₦${previousTotal.toLocaleString()}`} />
        </Col>
        <Col span={8}>
          <Statistic
            title="% Change"
            value={percentageChange + "%"}
            valueStyle={{ color: difference >= 0 ? "green" : "red" }}
          />
        </Col>
      </Row>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={120}
                fill="#8884d8"
                label
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `₦${value.toLocaleString()}`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Line Chart */}
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={filteredData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => `₦${value / 1000}k`} />
              <Tooltip formatter={(value) => `₦${value.toLocaleString()}`} />
              <Legend />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#1890ff"
                name={selectedCategory === "all" ? "All Revenue" : selectedCategory}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>

    {/* Separate Card for Stacked Bar Chart */}
    <Card title="Monthly Revenue Comparison by Stream" className="shadow-md">
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={["Jan", "Feb", "Mar"].map((month) => {
              const monthData = fullRevenueData.filter((item) => item.month === month);
              const result = { month };
              monthData.forEach((item) => {
                result[item.category] = item.value;
              });
              return result;
            })}
          >
            <XAxis dataKey="month" />
            <YAxis tickFormatter={(value) => `₦${value / 1000}k`} />
            <Tooltip formatter={(value) => `₦${value.toLocaleString()}`} />
            <Legend />
            {[
              "Listing Fees",
              "Commission on Sales",
              "Delivery Charges",
              "Verification Services",
              "Ads & Promotions",
            ].map((key, idx) => (
              <Bar key={key} dataKey={key} stackId="a" fill={COLORS[idx % COLORS.length]} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  </div>
  );
};

export default AutomobileRevenueAnalytics;
