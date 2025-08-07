import React, { useState } from "react";
import { Button, Table, Tag } from "antd";
import CreateUserModal from "./CreateUserModal";
import { useNavigate } from "react-router-dom";

const data = [
  {
    id: "AG123",
    name: "John Doe",
    email: "john@example.com",
    status: "Verified",
    registered: "2025-07-01",
  },
];



const SellerManagement = () => {
  const [isUserModalVisible, setUserModalVisible] = useState(false);
  const navigate = useNavigate();
  const columns = [
    { title: "Agent ID", dataIndex: "id", key: "id" },
    { title: "Full Name", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "Verified" ? "green" : "orange"}>{status}</Tag>
      ),
    },
    { title: "Date Registered", dataIndex: "registered", key: "registered" },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button type="link" onClick={() => navigate(`/dashboard/sellers/services/real-estate/seller/${record.id}`)}>
          View Details
        </Button>
      ),
    }
  ];
  return (
    <div>
    <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Sellers & Agents</h2>
        <Button type="primary" onClick={() => setUserModalVisible(true)}>
          Create User
        </Button>
      </div>

      <Table dataSource={data} columns={columns} rowKey="id" />

      <CreateUserModal
        visible={isUserModalVisible}
        onClose={() => setUserModalVisible(false)}
      />
    </div>
  );
};

export default SellerManagement;
