import React from "react";
import { Card, Row, Col } from "antd";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const revenueData = [
  { name: "Airtime Slot Fees", value: 50000 },
  { name: "Sales Commission", value: 32000 },
  { name: "Content Production Fees", value: 15000 },
  { name: "Vendor Subscription Plans", value: 20000 },
  { name: "Sponsorship & Branding", value: 28000 },
  { name: "Ads Between Shows", value: 10000 },
];

const COLORS = ["#6366F1", "#22C55E", "#F97316", "#EAB308", "#3B82F6", "#EC4899"];

export default function BloomzonTVAnalytics() {
  return (
    <div style={{ padding: "24px" }}>
      {/* KPIs */}
      <Row gutter={16}>
        <Col xs={24} md={8}>
          <Card title="Total Revenue" bordered={false}>
            <h2 style={{ fontSize: "24px", fontWeight: "bold" }}>$155,000</h2>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card title="Top Stream" bordered={false}>
            <h2 style={{ fontSize: "24px", fontWeight: "bold" }}>Airtime Slot Fees</h2>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card title="Active Vendors" bordered={false}>
            <h2 style={{ fontSize: "24px", fontWeight: "bold" }}>420</h2>
          </Card>
        </Col>
      </Row>

      {/* Revenue Breakdown */}
      <Row gutter={16} style={{ marginTop: "24px" }}>
        <Col xs={24} lg={12}>
          <Card title="Revenue by Stream (Bar)" bordered={false}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#6366F1" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="Revenue Distribution (Pie)" bordered={false}>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={revenueData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {revenueData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
