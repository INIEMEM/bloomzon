import React, { useState } from "react";
import { Tabs, Table, Tag, Input, Button, Drawer, Select, Row, Col, Statistic, Card } from "antd";
import { motion } from "framer-motion";

const { TabPane } = Tabs;
const { Search } = Input;
const { Option } = Select;

// Dummy Orders with Location
const ordersData = [
  {
    key: "1",
    orderId: "ORD123",
    user: "John Doe",
    product: "Reel Ad #1",
    amount: "$50",
    date: "2025-08-01",
    delivery: "FBB",
    status: "Pending",
    location: "Lagos, Nigeria",
  },
  {
    key: "2",
    orderId: "ORD124",
    user: "Jane Smith",
    product: "Reel Ad #2",
    amount: "$70",
    date: "2025-08-02",
    delivery: "Non-FBB",
    status: "Transit",
    location: "Abuja, Nigeria",
  },
];

const ReelsOrdersPage = () => {
  const [orders, setOrders] = useState(ordersData);
  const [searchText, setSearchText] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleSearch = (value) => {
    setSearchText(value.toLowerCase());
  };

  const filteredOrders = orders.filter(
    (o) =>
      o.user.toLowerCase().includes(searchText.toLowerCase()) ||
      o.orderId.toLowerCase().includes(searchText.toLowerCase()) ||
      o.location.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    { title: "Order ID", dataIndex: "orderId" },
    { title: "User", dataIndex: "user", render: (text) => <a>{text}</a> },
    { title: "Product", dataIndex: "product" },
    { title: "Amount", dataIndex: "amount" },
    { title: "Date", dataIndex: "date" },
    { title: "Location", dataIndex: "location" }, // ✅ Location column
    {
      title: "Delivery Type",
      dataIndex: "delivery",
      render: (delivery) =>
        delivery === "FBB" ? (
          <Tag color="green">FBB</Tag>
        ) : (
          <Tag color="blue">Non-FBB</Tag>
        ),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status) => {
        let color =
          status === "Pending"
            ? "orange"
            : status === "Transit"
            ? "blue"
            : "green";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Action",
      render: (_, record) => (
        <Button type="link" onClick={() => setSelectedOrder(record)}>
          View
        </Button>
      ),
    },
  ];

  const totalOrders = orders.length;
  const pending = orders.filter((o) => o.status === "Pending").length;
  const transit = orders.filter((o) => o.status === "Transit").length;
  const received = orders.filter((o) => o.status === "Received").length;
  const fbb = orders.filter((o) => o.delivery === "FBB").length;
  const nonFbb = orders.filter((o) => o.delivery === "Non-FBB").length;

  return (
    <motion.div
      className="p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-2xl font-bold mb-4">Orders Management</h1>

      {/* KPI Section */}
      <Row gutter={16} className="mb-6">
        <Col span={4}><Card><Statistic title="Total Orders" value={totalOrders} /></Card></Col>
        <Col span={4}><Card><Statistic title="Pending" value={pending} /></Card></Col>
        <Col span={4}><Card><Statistic title="In Transit" value={transit} /></Card></Col>
        <Col span={4}><Card><Statistic title="Received" value={received} /></Card></Col>
        <Col span={4}><Card><Statistic title="FBB Orders" value={fbb} /></Card></Col>
        <Col span={4}><Card><Statistic title="Non-FBB Orders" value={nonFbb} /></Card></Col>
      </Row>

      {/* Search + Filter */}
      <div className="mb-4 flex gap-4">
        <Search
          placeholder="Search by user, order ID, or location"
          onSearch={handleSearch}
          allowClear
          enterButton
          className="max-w-md"
        />
        <Select
          placeholder="Filter by Delivery Type"
          onChange={(value) => {
            setOrders(
              value
                ? ordersData.filter((o) => o.delivery === value)
                : ordersData
            );
          }}
          allowClear
          className="w-48"
        >
          <Option value="FBB">FBB</Option>
          <Option value="Non-FBB">Non-FBB</Option>
        </Select>
      </div>

      {/* Tabs */}
      <Tabs defaultActiveKey="1">
        <TabPane tab="Pending Orders" key="1">
          <Table columns={columns} dataSource={filteredOrders.filter((o) => o.status === "Pending")} />
        </TabPane>
        <TabPane tab="Transit Orders" key="2">
          <Table columns={columns} dataSource={filteredOrders.filter((o) => o.status === "Transit")} />
        </TabPane>
        <TabPane tab="Received Orders" key="3">
          <Table columns={columns} dataSource={filteredOrders.filter((o) => o.status === "Received")} />
        </TabPane>
      </Tabs>

      {/* Order Details Drawer */}
      <Drawer
        title={`Order Details - ${selectedOrder?.orderId}`}
        placement="right"
        width={400}
        onClose={() => setSelectedOrder(null)}
        open={!!selectedOrder}
      >
        {selectedOrder && (
          <div className="space-y-4">
            <p><strong>User:</strong> {selectedOrder.user}</p>
            <p><strong>Product:</strong> {selectedOrder.product}</p>
            <p><strong>Amount:</strong> {selectedOrder.amount}</p>
            <p><strong>Date:</strong> {selectedOrder.date}</p>
            <p><strong>Location:</strong> {selectedOrder.location}</p> {/* ✅ Added */}
            <p><strong>Delivery:</strong> {selectedOrder.delivery}</p>
            <p><strong>Status:</strong> {selectedOrder.status}</p>

            <Select
              defaultValue={selectedOrder.status}
              onChange={(newStatus) => {
                setOrders((prev) =>
                  prev.map((order) =>
                    order.orderId === selectedOrder.orderId
                      ? { ...order, status: newStatus }
                      : order
                  )
                );
                setSelectedOrder({ ...selectedOrder, status: newStatus });
              }}
              className="w-full"
            >
              <Option value="Pending">Pending</Option>
              <Option value="Transit">Transit</Option>
              <Option value="Received">Received</Option>
            </Select>
          </div>
        )}
      </Drawer>
    </motion.div>
  );
};

export default ReelsOrdersPage;
