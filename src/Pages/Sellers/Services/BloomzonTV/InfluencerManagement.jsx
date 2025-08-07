import React from "react";
import { Table, Button, Tag } from "antd";

const influencerData = [
  {
    key: "1",
    name: "Chidera A.",
    specialty: "Beauty & Skincare",
    followers: 54000,
    status: "Active",
  },
  {
    key: "2",
    name: "Ray Tech",
    specialty: "Gadgets",
    followers: 76200,
    status: "Inactive",
  },
];

const InfluencerManagement = () => {
  const columns = [
    {
      title: "Influencer",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Specialty",
      dataIndex: "specialty",
      key: "specialty",
    },
    {
      title: "Followers",
      dataIndex: "followers",
      key: "followers",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => <Tag color={status === "Active" ? "green" : "volcano"}>{status}</Tag>,
    },
    {
      title: "Actions",
      key: "actions",
      render: () => <Button type="link">Manage</Button>,
    },
  ];

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-semibold mb-4">Influencer Management</h2>
      <Table columns={columns} dataSource={influencerData} />
    </div>
  );
};

export default InfluencerManagement;
