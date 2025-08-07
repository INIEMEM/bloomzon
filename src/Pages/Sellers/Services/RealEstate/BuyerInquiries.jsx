import React from "react";
import { Table, Button } from "antd";
import { useNavigate } from "react-router-dom";
const inquiries = [
  {
    id: "BI009",
    buyer: "David A.",
    property: "2-Bedroom in Ikoyi",
    inquiryType: "Inspection",
    status: "Pending",
  },
];



const BuyerInquiries = () => {
  const navigate = useNavigate();
  const columns = [
    { title: "Inquiry ID", dataIndex: "id", key: "id" },
    { title: "Buyer", dataIndex: "buyer", key: "buyer" },
    { title: "Property", dataIndex: "property", key: "property" },
    { title: "Type", dataIndex: "inquiryType", key: "inquiryType" },
    { title: "Status", dataIndex: "status", key: "status" },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button type="default" onClick={() => navigate(`/dashboard/sellers/services/real-estate/buyer-inquiry/${record.id}`)}>View Details</Button>
      ),
    },
  ];
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Buyer Inquiries</h2>
      <Table dataSource={inquiries} columns={columns} rowKey="id" />
    </div>
  );
};

export default BuyerInquiries;
