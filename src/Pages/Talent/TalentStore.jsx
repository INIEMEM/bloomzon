import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Form, Input, Modal, Select, Table, message } from "antd";
import { motion } from "framer-motion";
import { ADMIN_BASE_URL, TALENT_BASE_URL } from "../../api/config";

const StoresPage = () => {
  const [stores, setStores] = useState([]);
  const [users, setUsers] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingStore, setEditingStore] = useState(null);
  const [form] = Form.useForm();

  const fetchStores = async () => {
    try {
      const response = await axios.get(`${TALENT_BASE_URL}/Stores`);
      setStores(response.data?.result || []);
    } catch (error) {
      message.error("Failed to fetch stores.");
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${ADMIN_BASE_URL}/users`, {
        params: { compact: true, role: "all", limit: 200 },
      });
      setUsers(response.data?.data?.items || []);
    } catch (error) {
      message.error("Failed to fetch users.");
    }
  };

  useEffect(() => {
    fetchStores();
    fetchUsers();
  }, []);

  const handleCreateOrUpdate = async (values) => {
    try {
      if (editingStore) {
        await axios.post(`${TALENT_BASE_URL}/EditStore/${editingStore.id}`, values);
        message.success("Store updated successfully.");
      } else {
        await axios.post(`${TALENT_BASE_URL}/CreateStore`, values);
        message.success("Store created successfully.");
      }

      setIsModalVisible(false);
      setEditingStore(null);
      form.resetFields();
      fetchStores();
    } catch (error) {
      message.error("Failed to save store.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${TALENT_BASE_URL}/DeleteStore/${id}`);
      message.success("Store deleted successfully.");
      fetchStores();
    } catch (error) {
      message.error("Failed to delete store.");
    }
  };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Owner ID", dataIndex: "store_owner_id", key: "store_owner_id" },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Type", dataIndex: "type", key: "type" },
    { title: "Location", dataIndex: "location", key: "location" },
    { title: "Service", dataIndex: "service", key: "service" },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <>
          <Button
            onClick={() => {
              setEditingStore(record);
              form.setFieldsValue(record);
              setIsModalVisible(true);
            }}
            style={{ marginRight: 8 }}
          >
            Edit
          </Button>
          <Button onClick={() => handleDelete(record.id)} danger>
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-[20px]">
      <Button
        onClick={() => {
          setEditingStore(null);
          form.resetFields();
          setIsModalVisible(true);
        }}
        type="primary"
        style={{ marginBottom: 16, background: "var(--primary-color)" }}
      >
        Create Store
      </Button>
      <Table dataSource={stores} columns={columns} rowKey="id" className="admin-table" />

      <Modal
        title={editingStore ? "Edit Store" : "Create Store"}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleCreateOrUpdate} layout="vertical">
          <Form.Item
            name="store_owner_id"
            label="Store Owner"
            rules={[{ required: true, message: "Please select a store owner!" }]}
          >
            <Select
              options={users.map((user) => ({
                value: user.id,
                label: `${user.name || user.email} (${user.id})`,
              }))}
            />
          </Form.Item>
          <Form.Item name="name" label="Store Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="type" label="Type">
            <Input />
          </Form.Item>
          <Form.Item name="location" label="Location">
            <Input />
          </Form.Item>
          <Form.Item name="service" label="Service">
            <Input />
          </Form.Item>
          <Form.Item name="rating_score" label="Rating Score">
            <Input />
          </Form.Item>
          <Form.Item name="timely_delivery" label="Timely Delivery">
            <Input />
          </Form.Item>
          <Form.Item name="response_time" label="Response Time">
            <Input />
          </Form.Item>
          <Form.Item name="revenue" label="Revenue">
            <Input />
          </Form.Item>
          <Form.Item name="highlight" label="Highlight">
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingStore ? "Update" : "Create"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </motion.div>
  );
};

export default StoresPage;
