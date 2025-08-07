import React from "react";
import { Table, Button } from "antd";

const legalTasks = [
  {
    id: "LS101",
    buyer: "Mark Johnson",
    property: "Land in Epe",
    service: "Agreement Drafting",
    status: "Ongoing",
  },
];

const columns = [
  { title: "Task ID", dataIndex: "id", key: "id" },
  { title: "Buyer", dataIndex: "buyer", key: "buyer" },
  { title: "Property", dataIndex: "property", key: "property" },
  { title: "Service", dataIndex: "service", key: "service" },
  { title: "Status", dataIndex: "status", key: "status" },
  {
    title: "Action",
    render: () => <Button type="primary">Update</Button>,
  },
];

const LegalServices = () => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Legal Services</h2>
      <Table dataSource={legalTasks} columns={columns} rowKey="id" />
    </div>
  );
};

export default LegalServices;
