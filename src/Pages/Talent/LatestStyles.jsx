import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Modal, Form, Input, message, Upload } from 'antd';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadOutlined } from '@ant-design/icons';

const test_tv_base_url = 'https://blosom-tv-server.onrender.com'; // Replace with your actual base URL

const LatestStylesPage = () => {
  const [latestStyles, setLatestStyles] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingStyleId, setEditingStyleId] = useState(null);
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    fetchLatestStyles();
  }, []);

  const fetchLatestStyles = async () => {
    try {
      const response = await axios.get(`${test_tv_base_url}/LatestStyle`);
      setLatestStyles(response.data.result);
    } catch (error) {
      console.error('Error fetching latest styles:', error);
      message.error('Failed to fetch latest styles.');
    }
  };

  const showModal = (style = null) => {
    console.log('image ', style)
    if (style) {
      setEditingStyleId(style.id);
      form.setFieldsValue(style);
      setFileList([{ uid: '1', name: 'image.png', status: 'done', url: style.image }]);
    } else {
      setEditingStyleId(null);
      form.resetFields();
      setFileList([]);
    }
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
 const handleCreateOrUpdate = async (values) => {
    try {
      console.log('file list', fileList[0]);
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('searchKeyword', values.searchKeyword);

      if (fileList.length > 0 && fileList[0]) {
        // Access the actual file object using originFileObj
        formData.append('image', fileList[0]);
      }

      if (editingStyleId) {
        await axios.put(`${test_tv_base_url}/LatestStyle/${editingStyleId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        message.success('Latest style updated successfully.');
      } else {
        await axios.post(`${test_tv_base_url}/LatestStyle`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        message.success('Latest style created successfully.');
      }

      fetchLatestStyles();
      setIsModalVisible(false);
    } catch (error) {
      console.error('Error creating/updating latest style:', error);
      message.error('Failed to create/update latest style.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${test_tv_base_url}/LatestStyle/${id}`);
      message.success('Latest style deleted successfully.');
      fetchLatestStyles();
    } catch (error) {
      console.error('Error deleting latest style:', error);
      message.error('Failed to delete latest style.');
    }
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Image', dataIndex: 'image', key: 'image', render: (image) => <img src={image} alt="Style" style={{ maxWidth: '100px' }} /> },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Search Keyword', dataIndex: 'searchKeyword', key: 'searchKeyword' },
    { title: 'Actions', key: 'actions', render: (text, record) => (
      <>
        <Button onClick={() => showModal(record)} style={{ marginRight: 8 }}>Edit</Button>
        <Button onClick={() => handleDelete(record.id)} danger>Delete</Button>
      </>
    )},
  ];

  const uploadProps = {
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      setFileList([file]);
      return false;
    },
    fileList,
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className='p-[20px]'
    >
      <Button onClick={() => showModal()} type="primary" style={{ marginBottom: 16, background: 'var(--primary-color)' }}>Create Latest Style</Button>
      <Table dataSource={latestStyles} columns={columns} rowKey="id" className='admin-table'/>

      <Modal
        title={editingStyleId ? 'Edit Latest Style' : 'Create Latest Style'}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} onFinish={handleCreateOrUpdate}>
          <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Please input style name!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="searchKeyword" label="Search Keyword">
            <Input />
          </Form.Item>
          <Form.Item label="Image">
            <Upload {...uploadProps} maxCount={1}>
              <Button icon={<UploadOutlined />}>Select File</Button>
            </Upload>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingStyleId ? 'Update' : 'Create'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </motion.div>
  );
};

export default LatestStylesPage;