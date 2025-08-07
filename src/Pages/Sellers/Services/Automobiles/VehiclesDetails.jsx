// VehicleDetails.jsx
import React from "react";
import { useParams } from "react-router-dom";
import { Card, Descriptions, Tag, Table } from "antd";

const AutomobileVehicleDetails = () => {
  const { id } = useParams();

  // Replace this with real API fetch
  const seller = {
    id,
    name: "John Doe",
    email: "john@example.com",
    verified: true,
  };

  const vehicles = [
    { id: 1, title: "Toyota Camry", year: 2010, status: "Pending" },
    { id: 2, title: "Honda Accord", year: 2015, status: "Approved" },
  ];

  const parts = [
    { id: 1, title: "Car Battery", type: "Battery", status: "Approved" },
    { id: 2, title: "Side Mirror", type: "Mirror", status: "Pending" },
  ];

  return (
    <div className="p-6">
    <Card title="Seller Information" className="mb-4">
      <Descriptions bordered column={1}>
        <Descriptions.Item label="Name">{seller.name}</Descriptions.Item>
        <Descriptions.Item label="Email">{seller.email}</Descriptions.Item>
        <Descriptions.Item label="Verified">
          <Tag color={seller.verified ? "green" : "red"}>
            {seller.verified ? "Yes" : "No"}
          </Tag>
        </Descriptions.Item>
      </Descriptions>
    </Card>

    <Card title="Vehicle Listings" className="mb-4">
      <Table
        rowKey="id"
        dataSource={vehicles}
        columns={[
          { title: "Title", dataIndex: "title" },
          { title: "Year", dataIndex: "year" },
          {
            title: "Status",
            dataIndex: "status",
            render: (text) => (
              <Tag color={text === "Approved" ? "green" : "orange"}>{text}</Tag>
            ),
          },
        ]}
      />
    </Card>

    <Card title="Spare Parts Listings">
      <Table
        rowKey="id"
        dataSource={parts}
        columns={[
          { title: "Title", dataIndex: "title" },
          { title: "Type", dataIndex: "type" },
          {
            title: "Status",
            dataIndex: "status",
            render: (text) => (
              <Tag color={text === "Approved" ? "green" : "orange"}>{text}</Tag>
            ),
          },
        ]}
      />
    </Card>
  </div>
  );
};

export default AutomobileVehicleDetails;
