// BloomzonTVAdminDashboard.jsx
import React, { useState } from "react";
import {
  Tabs, Card, DatePicker, Table, Tag, Button, Modal, Form, Input, Select, DatePicker as AntDatePicker, Upload, Avatar
} from "antd";
import { motion } from "framer-motion";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Tooltip, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer,
} from "recharts";
import { UploadOutlined } from "@ant-design/icons";

const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
const { Option } = Select;
const { TextArea } = Input;

const KPICard = ({ title, value, icon }) => (
  <motion.div whileHover={{ scale: 1.03 }} className="w-full md:w-1/4 p-2">
    <Card className="rounded-2xl shadow-md">
      <div className="flex items-center gap-4">
        <div className="text-2xl">{icon}</div>
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <p className="text-xl font-semibold">{value}</p>
        </div>
      </div>
    </Card>
  </motion.div>
);

const BloomzonTVAdminDashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const kpis = [
    { title: "Total Shows Aired", value: 128, icon: "🎥" },
    { title: "Products Promoted", value: 342, icon: "🛍️" },
    { title: "Revenue Generated", value: "$84,320", icon: "💵" },
    { title: "Active Vendors", value: 76, icon: "🧍‍♂️" },
  ];

  const revenueData = [
    { month: "Jan", revenue: 8000 },
    { month: "Feb", revenue: 9500 },
    { month: "Mar", revenue: 10500 },
    { month: "Apr", revenue: 11000 },
    { month: "May", revenue: 12300 },
    { month: "Jun", revenue: 9900 },
    { month: "Jul", revenue: 13500 },
  ];

  const showColumns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Host",
      dataIndex: "host",
      key: "host",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (type) => <Tag color={type === "Live" ? "green" : "blue"}>{type}</Tag>
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => <Tag color={status === "Cancelled" ? "red" : "cyan"}>{status}</Tag>
    },
    {
      title: "Air Time",
      dataIndex: "datetime",
      key: "datetime",
    },
    {
      title: "Actions",
      key: "actions",
      render: () => (
        <div className="flex gap-2">
          <Button size="small" onClick={() => setIsModalOpen(true)}>Edit</Button>
          <Button size="small" danger>Cancel</Button>
        </div>
      )
    }
  ];

  const showData = [
    {
      key: 1,
      title: "Summer Deals Show",
      host: "Vendor123",
      type: "Live",
      status: "Upcoming",
      datetime: "2025-08-10 5:00PM",
    },
    {
      key: 2,
      title: "Back to School",
      host: "Bloomzon Host",
      type: "Pre-recorded",
      status: "Completed",
      datetime: "2025-07-30 3:00PM",
    },
  ];

  const vendorApplications = [
    {
      key: 1,
      name: "SmartGear Ltd.",
      category: "Electronics",
      date: "2025-08-02",
      status: "Pending"
    },
    {
      key: 2,
      name: "Trendy Fashion",
      category: "Apparel",
      date: "2025-08-01",
      status: "Pending"
    }
  ];

  const productPerformance = [
    {
      key: 1,
      product: "Wireless Earbuds",
      vendor: "SmartGear Ltd.",
      shows: 3,
      sales: 240,
      ctr: "15.3%",
      engagement: 130,
    },
    {
      key: 2,
      product: "Leather Handbag",
      vendor: "Trendy Fashion",
      shows: 2,
      sales: 110,
      ctr: "11.8%",
      engagement: 84,
    }
  ];

  const viewerEngagement = [
    {
      key: 1,
      show: "Back to School",
      viewers: 420,
      reactions: 120,
      comments: 60,
      questions: 20,
      avgTime: "6m 24s"
    },
    {
      key: 2,
      show: "Summer Deals Show",
      viewers: 510,
      reactions: 180,
      comments: 90,
      questions: 40,
      avgTime: "7m 10s"
    }
  ];

  const orderData = [
    {
      key: 1,
      orderId: "ORD123456",
      product: "Wireless Earbuds",
      buyer: "Jane Doe",
      show: "Back to School",
      seller: "SmartGear Ltd.",
      amount: "$49.99",
      status: "Delivered"
    },
    {
      key: 2,
      orderId: "ORD123457",
      product: "Leather Handbag",
      buyer: "Emily Clark",
      show: "Summer Deals Show",
      seller: "Trendy Fashion",
      amount: "$69.99",
      status: "Pending"
    }
  ];

  return (
    <div className="p-6">
      {/* KPIs */}
      <div className="flex flex-wrap gap-4 mb-6">
        {kpis.map((kpi, idx) => (
          <KPICard key={idx} {...kpi} />
        ))}
      </div>

      <div className="mb-4">
        <RangePicker />
      </div>

      <Tabs defaultActiveKey="1">
        <TabPane tab="Shows Management" key="1">
          <div className="flex justify-end mb-4">
            <Button type="primary" onClick={() => setIsModalOpen(true)}>Create Show</Button>
          </div>
          <Table columns={showColumns} dataSource={showData} />

          <Modal
            open={isModalOpen}
            title="Create/Edit Show"
            onCancel={() => setIsModalOpen(false)}
            onOk={() => {
              form.validateFields().then((values) => {
                console.log("Submitted:", values);
                setIsModalOpen(false);
              });
            }}
          >
            <Form form={form} layout="vertical">
              <Form.Item name="title" label="Show Title" rules={[{ required: true }]}> <Input /> </Form.Item>
              <Form.Item name="host" label="Host (Vendor or Bloomzon)"><Input /></Form.Item>
              <Form.Item name="type" label="Video Type" rules={[{ required: true }]}> <Select>
                <Option value="Live">Live Stream</Option>
                <Option value="Pre-recorded">Pre-recorded</Option>
              </Select></Form.Item>
              <Form.Item name="datetime" label="Schedule Date & Time"> <AntDatePicker showTime /> </Form.Item>
              <Form.Item name="products" label="Products to Feature"> <Select mode="multiple" placeholder="Select products" /> </Form.Item>
              <Form.Item name="banner" label="Banner Upload">
                <Upload> <Button icon={<UploadOutlined />}>Upload</Button> </Upload>
              </Form.Item>
              <Form.Item name="notes" label="Show Script / Notes"> <TextArea rows={3} /> </Form.Item>
            </Form>
          </Modal>
        </TabPane>

        <TabPane tab="Vendor Applications" key="2">
          <Table
            columns={[
              { title: "Vendor Name", dataIndex: "name", key: "name" },
              { title: "Category", dataIndex: "category", key: "category" },
              { title: "Application Date", dataIndex: "date", key: "date" },
              { title: "Status", dataIndex: "status", key: "status", render: () => <Tag color="orange">Pending</Tag> },
              {
                title: "Actions",
                key: "actions",
                render: () => (
                  <div className="flex gap-2">
                    <Button type="primary" size="small">Approve</Button>
                    <Button danger size="small">Reject</Button>
                  </div>
                )
              },
            ]}
            dataSource={vendorApplications}
          />
        </TabPane>

        <TabPane tab="Products on TV" key="3">
          <Table
            columns={[
              { title: "Product", dataIndex: "product", key: "product" },
              { title: "Vendor", dataIndex: "vendor", key: "vendor" },
              { title: "# of Shows", dataIndex: "shows", key: "shows" },
              { title: "Sales", dataIndex: "sales", key: "sales" },
              { title: "CTR", dataIndex: "ctr", key: "ctr" },
              { title: "Engagements", dataIndex: "engagement", key: "engagement" },
            ]}
            dataSource={productPerformance}
          />
        </TabPane>

        <TabPane tab="Viewer Engagement" key="4">
          <Table
            columns={[
              { title: "Show", dataIndex: "show", key: "show" },
              { title: "Viewers", dataIndex: "viewers", key: "viewers" },
              { title: "Reactions", dataIndex: "reactions", key: "reactions" },
              { title: "Comments", dataIndex: "comments", key: "comments" },
              { title: "Questions", dataIndex: "questions", key: "questions" },
              { title: "Avg. Watch Time", dataIndex: "avgTime", key: "avgTime" },
            ]}
            dataSource={viewerEngagement}
          />
        </TabPane>

        <TabPane tab="Orders" key="5">
          <Table
            columns={[
              { title: "Order ID", dataIndex: "orderId", key: "orderId" },
              { title: "Product", dataIndex: "product", key: "product" },
              { title: "Buyer", dataIndex: "buyer", key: "buyer" },
              { title: "Show", dataIndex: "show", key: "show" },
              { title: "Seller", dataIndex: "seller", key: "seller" },
              { title: "Amount", dataIndex: "amount", key: "amount" },
              { title: "Status", dataIndex: "status", key: "status" },
            ]}
            dataSource={orderData}
          />
        </TabPane>

        <TabPane tab="Revenue Analytics" key="6">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="revenue" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default BloomzonTVAdminDashboard;