import { Table, Button, Tag, Modal } from "antd";
import { motion } from "framer-motion";
import React, { useState } from "react";
import TVAdminDetailView from "./TVAdminDetailView";
const mockVendors = [
  {
    key: "1",
    name: "Glow Beauty",
    contact: "glow@example.com",
    status: "Pending",
    products: 8,
  },
  {
    key: "2",
    name: "Tech Essentials",
    contact: "tech@bloomzon.com",
    status: "Approved",
    products: 5,
  },
];

const VendorApplications = () => {
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const showModal = (record) => {
    setSelectedVendor(record);
    setIsModalVisible(true);
  };

  const handleClose = () => {
    setIsModalVisible(false);
    setSelectedVendor(null);
  };

  const columns = [
    {
      title: "Vendor Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Contact",
      dataIndex: "contact",
      key: "contact",
    },
    {
      title: "Products",
      dataIndex: "products",
      key: "products",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "Approved" ? "green" : "orange"}>{status}</Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button type="primary" onClick={() => showModal(record)}>
          Review
        </Button>
      ),
    },
  ];

  return (
    <div className="bg-white p-4 rounded shadow">
      {!selectedRow ? (<Table columns={columns} dataSource={mockVendors} onRow={(record) => ({
        onClick: () => setSelectedRow(record),
      })} />) : (
        <TVAdminDetailView
          data={selectedRow}
          type="vendor"
          onClose={() => setSelectedRow(null)}
        />
      )}
      

      <Modal
        title="Vendor Application Review"
        open={isModalVisible}
        onCancel={handleClose}
        onOk={handleClose}
        footer={null}
      >
        {selectedVendor && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <p><strong>Vendor:</strong> {selectedVendor.name}</p>
            <p><strong>Contact:</strong> {selectedVendor.contact}</p>
            <p><strong>Status:</strong> {selectedVendor.status}</p>
            <div className="flex gap-4 mt-4">
              <Button type="primary">Approve</Button>
              <Button danger>Reject</Button>
            </div>
          </motion.div>
        )}
      </Modal>
    </div>
  );
};

export default VendorApplications;
