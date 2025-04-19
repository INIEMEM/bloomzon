import { useState } from "react";
import { Table, Form, Input, Button, Modal } from "antd";
import { motion } from "framer-motion";

const LogisticsServices = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [logistics, setLogistics] = useState([
    {
      key: "1",
      name: "DHL Express",
      contact: "dhl@example.com",
      withinNigeria: "₦5000",
      outsideNigeria: "$50",
    },
    {
      key: "2",
      name: "FedEx",
      contact: "fedex@example.com",
      withinNigeria: "₦4000",
      outsideNigeria: "$45",
    },
  ]);

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Contact Info", dataIndex: "contact", key: "contact" },
    { title: "Rate (Within Nigeria)", dataIndex: "withinNigeria", key: "withinNigeria" },
    { title: "Rate (Outside Nigeria)", dataIndex: "outsideNigeria", key: "outsideNigeria" },
  ];

  const handleAddLogistics = (values) => {
    const newEntry = {
      key: (logistics.length + 1).toString(),
      ...values,
    };
    setLogistics([...logistics, newEntry]);
    setIsModalOpen(false);
    form.resetFields();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} style={{padding: 20}}>
      <div className="flex flex-justify-between">
        <h1>Logistics Service</h1>
        <Button type="primary" onClick={() => setIsModalOpen(true)} style={{ marginBottom: 16, background: 'var(--primary-color)' }}>
          Add Logistics Service
        </Button>
      </div>
      <Table columns={columns} dataSource={logistics} pagination={{ pageSize: 5 }} className="admin-table" />
      
      <Modal
        title="Add Logistics Service"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleAddLogistics} layout="vertical">
          <Form.Item name="name" label="Name" rules={[{ required: true, message: "Please enter name" }]}> 
            <Input />
          </Form.Item>
          <Form.Item name="contact" label="Contact Info" rules={[{ required: true, message: "Please enter contact info" }]}> 
            <Input />
          </Form.Item>
          <Form.Item name="withinNigeria" label="Rate (Within Nigeria)" rules={[{ required: true, message: "Please enter rate" }]}> 
            <Input />
          </Form.Item>
          <Form.Item name="outsideNigeria" label="Rate (Outside Nigeria)" rules={[{ required: true, message: "Please enter rate" }]}> 
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">Add</Button>
          </Form.Item>
        </Form>
      </Modal>
    </motion.div>
  );
};

export default LogisticsServices;
