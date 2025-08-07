import React, { useState } from "react";
import { Table, Button, Tag, Modal, DatePicker, Select, Input } from "antd";
import { motion } from "framer-motion";

const { Option } = Select;
const { TextArea } = Input;

const mockShows = [
  {
    key: "1",
    title: "Beauty Friday Deals",
    type: "Live",
    date: "2025-08-12",
    host: "Glow Beauty",
    status: "Scheduled",
  },
  {
    key: "2",
    title: "Gadget Bonanza",
    type: "Pre-recorded",
    date: "2025-08-15",
    host: "Tech Essentials",
    status: "Completed",
  },
];

const ShowManagement = () => {
  const [shows, setShows] = useState(mockShows);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [formData, setFormData] = useState({});

  const showModal = () => setIsModalVisible(true);
  const handleCancel = () => setIsModalVisible(false);

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleCreateShow = () => {
    const newShow = {
      ...formData,
      key: `${shows.length + 1}`,
      status: "Scheduled",
    };
    setShows([...shows, newShow]);
    setIsModalVisible(false);
    setFormData({});
  };

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (type) => <Tag color={type === "Live" ? "blue" : "purple"}>{type}</Tag>,
    },
    {
      title: "Host",
      dataIndex: "host",
      key: "host",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => <Tag color={status === "Scheduled" ? "green" : "gray"}>{status}</Tag>,
    },
  ];

  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="flex justify-end mb-4">
        <Button type="primary" onClick={showModal}>Create New Show</Button>
      </div>
      <Table columns={columns} dataSource={shows} />

      <Modal
        title="Create New Show"
        open={isModalVisible}
        onCancel={handleCancel}
        onOk={handleCreateShow}
        okText="Create"
      >
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <Input placeholder="Show Title" onChange={(e) => handleInputChange("title", e.target.value)} />
          <Select placeholder="Select Type" className="w-full" onChange={(val) => handleInputChange("type", val)}>
            <Option value="Live">Live</Option>
            <Option value="Pre-recorded">Pre-recorded</Option>
          </Select>
          <Input placeholder="Host Name" onChange={(e) => handleInputChange("host", e.target.value)} />
          <DatePicker className="w-full" onChange={(date, dateString) => handleInputChange("date", dateString)} />
          <TextArea rows={3} placeholder="Notes / Tags" onChange={(e) => handleInputChange("notes", e.target.value)} />
        </motion.div>
      </Modal>
    </div>
  );
};

export default ShowManagement;