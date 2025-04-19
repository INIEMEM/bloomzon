import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Modal, Form, Input, InputNumber, message } from 'antd';
import { motion, AnimatePresence } from 'framer-motion';

const test_tv_base_url = 'https://blosom-tv-server.onrender.com'; // Replace with your actual base URL
const getAllUsersUrl = 'https://bloomzon-server.vercel.app/api/v1/user/get-all-users';

const StoresPage = () => {
  const [stores, setStores] = useState([]);
  const [users, setUsers] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingStoreId, setEditingStoreId] = useState(null);

  useEffect(() => {
    fetchStores();
    fetchUsers();
  }, []);

  const fetchStores = async () => {
    try {
      const response = await axios.get(`${test_tv_base_url}/Stores`);

      console.log('the stores', response)
      setStores(response.data.result);
    } catch (error) {
      console.error('Error fetching stores:', error);
      message.error('Failed to fetch stores.');
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(getAllUsersUrl);
      setUsers(response.data.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      message.error('Failed to fetch users.');
    }
  };

  const showModal = (store = null) => {
    if (store) {
      setEditingStoreId(store.id);
      form.setFieldsValue(store);
    } else {
      setEditingStoreId(null);
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleCreateOrUpdate = async (values) => {
    try {
      if (editingStoreId) {
        await axios.post(`${test_tv_base_url}/EditStore/${editingStoreId}`, values);
        message.success('Store updated successfully.');
      } else {
        await axios.post(`${test_tv_base_url}/CreateStore`, values);
        message.success('Store created successfully.');
      }
      fetchStores();
      setIsModalVisible(false);
    } catch (error) {
      console.error('Error creating/updating store:', error);
      message.error('Failed to create/update store.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${test_tv_base_url}/DeleteStore/${id}`);
      message.success('Store deleted successfully.');
      fetchStores();
    } catch (error) {
      console.error('Error deleting store:', error);
      message.error('Failed to delete store.');
    }
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Owner ID', dataIndex: 'store_owner_id', key: 'store_owner_id' },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Type', dataIndex: 'type', key: 'type' },
    { title: 'Location', dataIndex: 'location', key: 'location' },
    { title: 'Service', dataIndex: 'service', key: 'service' },
    { title: 'Rating', dataIndex: 'rating_score', key: 'rating_score' },
    { title: 'Actions', key: 'actions', render: (text, record) => (
      <>
        <Button onClick={() => showModal(record)} style={{ marginRight: 8 }}>Edit</Button>
        <Button onClick={() => handleDelete(record.id)} danger>Delete</Button>
      </>
    )},
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className='p-[20px]'
    >
      <Button onClick={() => showModal()} type="primary" style={{ marginBottom: 16, background: 'var(--primary-color)' }}>Create Store</Button>
      <Table dataSource={stores} columns={columns} rowKey="id" className='admin-table' />

      <Modal
        title={editingStoreId ? 'Edit Store' : 'Create Store'}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} onFinish={handleCreateOrUpdate}>
          <Form.Item name="store_owner_id" label="Store Owner ID" rules={[{ required: true, message: 'Please input store owner ID!' }]}>
            <select style={{ width: '100%' }}>
              {users.map((user) => (
                <option key={user.id} value={user.id}>{user.id}</option>
              ))}
            </select>
          </Form.Item>
          <Form.Item name="name" label="Store Name">
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
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="floor_space" label="Floor Space">
            <Input />
          </Form.Item>
          <Form.Item name="staffs" label="Staffs">
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="highlight" label="Highlight">
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingStoreId ? 'Update' : 'Create'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </motion.div>
  );
};

export default StoresPage;