import React from "react";
import { Table, Button } from "antd";

const requests = [
  {
    id: "VR001",
    property: "Plot of Land in Ajah",
    owner: "Jane Okoro",
    docStatus: "Pending",
  },
];

const columns = [
  { title: "Request ID", dataIndex: "id", key: "id" },
  { title: "Property", dataIndex: "property", key: "property" },
  { title: "Owner", dataIndex: "owner", key: "owner" },
  {
    title: "Document Status",
    dataIndex: "docStatus",
    key: "docStatus",
  },
  {
    title: "Action",
    key: "action",
    render: (_, record) => (
      <Button type="primary">Verify</Button>
    ),
  },
];

const VerificationRequests = () => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Verification Requests</h2>
      <Table dataSource={requests} columns={columns} rowKey="id" />
    </div>
  );
};

export default VerificationRequests;
