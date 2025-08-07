// src/components/CreateUserModal.jsx
import React from "react";
import { Modal, Form, Input, Select, Button, message } from "antd";

const { Option } = Select;

const CreateUserModal = ({ visible, onClose }) => {
  const [form] = Form.useForm();

  const handleFinish = (values) => {
    console.log("User Data:", values);
    message.success("User created successfully!");
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title="Create New User"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={500}
    >
      <Form layout="vertical" form={form} onFinish={handleFinish}>
        <Form.Item
          name="fullName"
          label="Full Name"
          rules={[{ required: true, message: "Please enter the user's full name" }]}
        >
          <Input placeholder="John Doe" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email Address"
          rules={[
            { required: true, message: "Please enter an email" },
            { type: "email", message: "Invalid email format" },
          ]}
        >
          <Input placeholder="john@example.com" />
        </Form.Item>

        <Form.Item
          name="phone"
          label="Phone Number"
          rules={[{ required: true, message: "Please enter a phone number" }]}
        >
          <Input placeholder="+234 801 234 5678" />
        </Form.Item>

        <Form.Item
          name="status"
          label="Account Status"
          rules={[{ required: true, message: "Please select a status" }]}
        >
          <Select placeholder="Select status">
            <Option value="Verified">Verified</Option>
            <Option value="Pending">Pending</Option>
          </Select>
        </Form.Item>

        <div className="text-right">
          <Button type="default" onClick={onClose} className="mr-2">
            Cancel
          </Button>
          <Button type="primary" htmlType="submit">
            Create User
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default CreateUserModal;
