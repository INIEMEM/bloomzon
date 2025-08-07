import React from 'react';
import { Row, Col, Card, Statistic } from 'antd';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend,
  LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer
} from 'recharts';

const kpiData = [
  { title: 'Total Revenue', value: '₦12.5M' },
  { title: 'Active Pharmacies', value: 183 },
  { title: 'Consultations This Month', value: 845 },
  { title: 'Care Members', value: 1242 },
];

const revenueByMonth = [
  { month: 'Jan', pharmacy: 1.2, clinic: 0.9, care: 0.5, ads: 0.3 },
  { month: 'Feb', pharmacy: 1.4, clinic: 1.1, care: 0.6, ads: 0.4 },
  { month: 'Mar', pharmacy: 1.8, clinic: 1.5, care: 0.9, ads: 0.7 },
  { month: 'Apr', pharmacy: 2.0, clinic: 1.6, care: 1.0, ads: 0.6 },
  { month: 'May', pharmacy: 2.3, clinic: 1.8, care: 1.1, ads: 0.8 },
];

const revenueBreakdown = [
  { name: 'Pharmacy (Markup & Commission)', value: 25 },
  { name: 'Clinic (Consultation & Subscription)', value: 20 },
  { name: 'Care Memberships', value: 15 },
  { name: 'Health Product Marketplace', value: 15 },
  { name: 'Sponsored Listings & Ads', value: 10 },
  { name: 'Fulfillment Services', value: 15 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A020F0', '#F67280'];

const HealthcareRevenueDashboard = () => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4">Bloomzon Healthcare Revenue Dashboard</h2>

      <Row gutter={16} className="mb-6">
        {kpiData.map((item) => (
          <Col xs={24} sm={12} md={6} key={item.title}>
            <Card>
              <Statistic title={item.title} value={item.value} />
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={24}>
        <Col xs={24} md={16}>
          <Card title="Monthly Revenue Streams">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueByMonth}>
                <XAxis dataKey="month" />
                <YAxis label={{ value: '₦ (Millions)', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="pharmacy" name="Pharmacy" fill="#0088FE" />
                <Bar dataKey="clinic" name="Clinic" fill="#00C49F" />
                <Bar dataKey="care" name="Care Membership" fill="#FFBB28" />
                <Bar dataKey="ads" name="Ads & Listings" fill="#FF8042" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card title="Revenue Breakdown by Stream">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={revenueBreakdown}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  label
                >
                  {revenueBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      <Row className="mt-8">
        <Col span={24}>
          <Card title="Trends Over Time">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueByMonth}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="pharmacy" stroke="#0088FE" />
                <Line type="monotone" dataKey="clinic" stroke="#00C49F" />
                <Line type="monotone" dataKey="care" stroke="#FFBB28" />
                <Line type="monotone" dataKey="ads" stroke="#FF8042" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default HealthcareRevenueDashboard;
