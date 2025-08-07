import React, { useState } from "react";
import { Button, Table, Tag } from "antd";
import CreateSellerModal from "./CreateSellerModal";
import { useNavigate } from "react-router-dom";
const listings = [
  {
    id: "P001",
    title: "3 Bedroom Apartment in Lekki",
    type: "Flat",
    status: "Published",
    price: "₦35,000,000",
    location: "Lekki Phase 1",
  },
];



const ListingsManagement = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const navigate = useNavigate();
  const columns = [
    { title: "Listing ID", dataIndex: "id", key: "id" },
    { title: "Title", dataIndex: "title", key: "title" },
    { title: "Type", dataIndex: "type", key: "type" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "Published" ? "blue" : "gray"}>{status}</Tag>
      ),
    },
    { title: "Price", dataIndex: "price", key: "price" },
    { title: "Location", dataIndex: "location", key: "location" },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button type="link" onClick={() => navigate(`/dashboard/sellers/services/real-estate/listing/${record.id}`)}>
          View Details
        </Button>
      ),
    },
  ];
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Property Listings</h2>
      <div className="flex justify-end mb-4">
        <Button type="primary" onClick={() => setModalVisible(true)}>
          Create Listing
        </Button>
      </div>
      <CreateSellerModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
      <Table dataSource={listings} columns={columns} rowKey="id" />
    </div>
  );
};

export default ListingsManagement;
