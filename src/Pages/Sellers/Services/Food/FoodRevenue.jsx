import React, { useState } from 'react';
import {
  Tabs,
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Tooltip,
} from 'antd';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const { TabPane } = Tabs;

const directSalesRevenue = [
  { month: 'Jan', revenue: 30000 },
  { month: 'Feb', revenue: 42000 },
  { month: 'Mar', revenue: 38000 },
  { month: 'Apr', revenue: 45000 },
  { month: 'May', revenue: 52000 },
];

const directSalesProducts = [
  { key: '1', name: 'Bloomzon Rice', category: 'Grains', price: '$25', stock: 120 },
  { key: '2', name: 'Bloomzon Oil', category: 'Oils', price: '$10', stock: 300 },
];

const fbbRevenue = [
  { month: 'Jan', revenue: 15000 },
  { month: 'Feb', revenue: 18000 },
  { month: 'Mar', revenue: 22000 },
  { month: 'Apr', revenue: 25000 },
];

const fbbProducts = [
  { key: '1', name: 'Naija Bites Chips', vendor: 'Naija Bites', fulfilled: 'Yes' },
  { key: '2', name: 'Chef Lola Jollof Pack', vendor: 'Chef Lola', fulfilled: 'Yes' },
];

const adsRevenue = [
  { month: 'Jan', revenue: 10000 },
  { month: 'Feb', revenue: 15000 },
  { month: 'Mar', revenue: 18000 },
  { month: 'Apr', revenue: 21000 },
];

const advertisedProducts = [
  { key: '1', product: 'Chef Lola Meals', campaign: 'Sponsored Listings' },
  { key: '2', product: 'Naija Bites', campaign: 'Homepage Banner' },
];

const eliteRevenue = [
  { month: 'Jan', revenue: 8000 },
  { month: 'Feb', revenue: 11000 },
  { month: 'Mar', revenue: 13000 },
  { month: 'Apr', revenue: 16000 },
];

const eliteProducts = [
  { key: '1', name: 'Bloomzon Fresh Box', included: 'Yes' },
  { key: '2', name: 'Express Delivery', included: 'Yes' },
];

const privateLabelRevenue = [
  { month: 'Jan', revenue: 14000 },
  { month: 'Feb', revenue: 17500 },
  { month: 'Mar', revenue: 16000 },
  { month: 'Apr', revenue: 20000 },
];

const privateLabelProducts = [
  { key: '1', name: 'Happy Belly Snacks', category: 'Snacks', price: '$5' },
  { key: '2', name: 'Bloomzon Fresh Oil', category: 'Pantry', price: '$8' },
];

const FoodRevenueDashboard = () => {
  return (
    <div className="p-4">
      <Tabs defaultActiveKey="1">
        <TabPane tab="Direct Sales" key="1">
          <Row gutter={16}>
            <Col span={12}>
              <Card title="Monthly Revenue">
                <BarChart width={500} height={300} data={directSalesRevenue}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="revenue" fill="#8884d8" />
                </BarChart>
              </Card>
            </Col>
            <Col span={12}>
              <Card title="Products Sold (Direct Sales)">
                <Table dataSource={directSalesProducts} columns={[
                  { title: 'Name', dataIndex: 'name' },
                  { title: 'Category', dataIndex: 'category' },
                  { title: 'Price', dataIndex: 'price' },
                  { title: 'Stock Left', dataIndex: 'stock' },
                ]} pagination />
              </Card>
            </Col>
          </Row>
        </TabPane>

        <TabPane tab="FBB Revenue" key="2">
          <Row gutter={16}>
            <Col span={12}>
              <Card title="Monthly Revenue (FBB)">
                <BarChart width={500} height={300} data={fbbRevenue}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="revenue" fill="#00C49F" />
                </BarChart>
              </Card>
            </Col>
            <Col span={12}>
              <Card title="Fulfilled Products">
                <Table dataSource={fbbProducts} columns={[
                  { title: 'Product', dataIndex: 'name' },
                  { title: 'Vendor', dataIndex: 'vendor' },
                  { title: 'Fulfilled', dataIndex: 'fulfilled' },
                ]} pagination />
              </Card>
            </Col>
          </Row>
        </TabPane>

        <TabPane tab="Advertising" key="3">
          <Row gutter={16}>
            <Col span={12}>
              <Card title="Monthly Ad Revenue">
                <BarChart width={500} height={300} data={adsRevenue}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="revenue" fill="#FFBB28" />
                </BarChart>
              </Card>
            </Col>
            <Col span={12}>
              <Card title="Advertised Products">
                <Table dataSource={advertisedProducts} columns={[
                  { title: 'Product', dataIndex: 'product' },
                  { title: 'Campaign', dataIndex: 'campaign' },
                ]} pagination />
              </Card>
            </Col>
          </Row>
        </TabPane>

        <TabPane tab="Elite Memberships" key="4">
          <Row gutter={16}>
            <Col span={12}>
              <Card title="Monthly Elite Revenue">
                <BarChart width={500} height={300} data={eliteRevenue}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="revenue" fill="#82ca9d" />
                </BarChart>
              </Card>
            </Col>
            <Col span={12}>
              <Card title="Elite Products/Benefits">
                <Table dataSource={eliteProducts} columns={[
                  { title: 'Product/Benefit', dataIndex: 'name' },
                  { title: 'Included', dataIndex: 'included' },
                ]} pagination />
              </Card>
            </Col>
          </Row>
        </TabPane>

        <TabPane tab="Private Label" key="5">
          <Row gutter={16}>
            <Col span={12}>
              <Card title="Monthly Revenue (Private Label)">
                <BarChart width={500} height={300} data={privateLabelRevenue}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="revenue" fill="#AA66CC" />
                </BarChart>
              </Card>
            </Col>
            <Col span={12}>
              <Card title="Private Label Products">
                <Table dataSource={privateLabelProducts} columns={[
                  { title: 'Name', dataIndex: 'name' },
                  { title: 'Category', dataIndex: 'category' },
                  { title: 'Price', dataIndex: 'price' },
                ]} pagination />
              </Card>
            </Col>
          </Row>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default FoodRevenueDashboard;
