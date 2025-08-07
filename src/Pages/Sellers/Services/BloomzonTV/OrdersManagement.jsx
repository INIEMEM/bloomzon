import React from "react";
import { Table, Tag, Dropdown, Menu, Button } from "antd";
import { EllipsisOutlined } from "@ant-design/icons";

const orderData = [
  {
    key: "1",
    buyer: "John Doe",
    product: "LED Ring Light",
    show: "Beauty Friday Deals",
    status: "Delivered",
    date: "2025-08-05",
  },
  {
    key: "2",
    buyer: "Chioma B.",
    product: "Wireless Earbuds",
    show: "Gadget Bonanza",
    status: "Pending",
    date: "2025-08-06",
  },
];

const statusColors = {
  Delivered: "green",
  Pending: "orange",
  Cancelled: "red",
};

const OrdersManagement = () => {
  const columns = [
    {
      title: "Buyer",
      dataIndex: "buyer",
      key: "buyer",
    },
    {
      title: "Product",
      dataIndex: "product",
      key: "product",
    },
    {
      title: "Show",
      dataIndex: "show",
      key: "show",
    },
    {
      title: "Order Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => <Tag color={statusColors[status]}>{status}</Tag>,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item key="1">View Details</Menu.Item>
              <Menu.Item key="2">Mark as Delivered</Menu.Item>
              <Menu.Item key="3">Cancel Order</Menu.Item>
            </Menu>
          }
          trigger={["click"]}
        >
          <Button icon={<EllipsisOutlined />} />
        </Dropdown>
      ),
    },
  ];

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-semibold mb-4">Orders Management</h2>
      <Table columns={columns} dataSource={orderData} />
    </div>
  );
};

export default OrdersManagement;
