import React from "react";
import { Card, Statistic, Row, Col } from "antd";
import { BarChartOutlined, RiseOutlined, LineChartOutlined } from "@ant-design/icons";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const revenueData = [
  { month: "Jan", revenue: 1200 },
  { month: "Feb", revenue: 1600 },
  { month: "Mar", revenue: 2000 },
  { month: "Apr", revenue: 1800 },
  { month: "May", revenue: 2500 },
];

const ReportsAnalytics = () => {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-semibold mb-4">Reports & Analytics</h2>
      <Row gutter={16} className="mb-6">
        <Col span={8}>
          <Card>
            <Statistic title="Total Sales" value={112340} prefix={<RiseOutlined />} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="Avg Viewer Engagement" value="67%" prefix={<BarChartOutlined />} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="Conversion Rate" value="5.4%" prefix={<LineChartOutlined />} />
          </Card>
        </Col>
      </Row>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={revenueData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="revenue" stroke="#1890ff" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ReportsAnalytics;