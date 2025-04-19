import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Modal, Form, Input, InputNumber, message, Upload, Select } from 'antd';
import { motion } from 'framer-motion';
import { UploadOutlined } from '@ant-design/icons';

const test_tv_base_url = 'https://blosom-tv-server.onrender.com';
const getAllUsersUrl = 'https://bloomzon-server.vercel.app/api/v1';

const GiftCardFundsPage = () => {
  const [giftCardFunds, setGiftCardFunds] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingGiftCardId, setEditingGiftCardId] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [registryOptions, setRegistryOptions] = useState([]);
  const [userOptions, setUserOptions] = useState([]);

  useEffect(() => {
    fetchGiftCardFunds();
    fetchRegistryOptions();
    fetchUserOptions();
  }, []);

  const fetchGiftCardFunds = async () => {
    try {
      const response = await axios.get(`${test_tv_base_url}/GiftCardFundsRandom`);
      setGiftCardFunds(response.data.results);
    } catch (error) {
      console.error('Error fetching gift card funds:', error);
      message.error('Failed to fetch gift card funds.');
    }
  };

  const fetchRegistryOptions = async () => {
    try {
      const response = await axios.get(`${test_tv_base_url}/registry`);
      setRegistryOptions(response.data.data.map((item) => ({ value: item.id, label: item.name })));
    } catch (error) {
      console.error('Error fetching registry options:', error);
      message.error('Failed to fetch registry options.');
    }
  };

  const fetchUserOptions = async () => {
    try {
      const response = await axios.get(`${getAllUsersUrl}/user/get-all-users`);
      setUserOptions(response.data.data.map((item) => ({ value: item.id, label: item.name })));
      // console.log(response.data)
    } catch (error) {
      console.error('Error fetching user options:', error);
      message.error('Failed to fetch user options.');
    }
  };

  const showModal = (giftCard = null) => {
    if (giftCard) {
      setEditingGiftCardId(giftCard.id);
      form.setFieldsValue(giftCard);
      setFileList([{ uid: '1', name: 'image.png', status: 'done', url: giftCard.image_url }]);
    } else {
      setEditingGiftCardId(null);
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
      const formData = new FormData();

      formData.append('title', values.title);
      formData.append('goal', values.goal);
      formData.append('comments', values.comments);
      formData.append('most_wanted', values.most_wanted);
      formData.append('hide_goal', values.hide_goal);
      formData.append('userId', values.userId);
      formData.append('registryId', values.registryId);
      formData.append('amountContributed', values.amountContributed);
      if (fileList.length > 0 && fileList[0]) {
        formData.append('image_file', fileList[0]);
      }

      const newFormData = new FormData()
      newFormData.append('image_file', fileList[0])
      const data = {
        title: values.title,
        goal: values.goal,
        comments: values.comments,
        most_wanted: values.most_wanted,
        hide_goal: values.hide_goal,
        userId: values.userId,
        registryId: values.registryId,
        amountContributed: values.amountContributed,
        image_file: newFormData
      }
      

      if (editingGiftCardId) {
        await axios.put(`${test_tv_base_url}/GifCardFunds/update/${editingGiftCardId}`, formData, {
          headers: { 'Content-Type': 'application/json' },
        });
        message.success('Gift card fund updated successfully.');
      } else {
        await axios.post(`${test_tv_base_url}/GiftCardFunds/create`, data, {
          headers: { 'Content-Type': 'application/json' },
        });
        message.success('Gift card fund created successfully.');
      }
      fetchGiftCardFunds();
      setIsModalVisible(false);
    } catch (error) {
      console.error('Error creating/updating gift card fund:', error);
      message.error('Failed to create/update gift card fund.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${test_tv_base_url}/GiftCardFunds/delete/${id}`);
      message.success('Gift card fund deleted successfully.');
      fetchGiftCardFunds();
    } catch (error) {
      console.error('Error deleting gift card fund:', error);
      message.error('Failed to delete gift card fund.');
    }
  };

  const handleAddFunds = async (values) => {
    try {
      await axios.post(`${test_tv_base_url}/GiftCardFunds/add-funds`, values);
      message.success('Funds added successfully.');
      fetchGiftCardFunds();
    } catch (error) {
      console.error('Error adding funds:', error);
      message.error('Failed to add funds.');
    }
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Title', dataIndex: 'title', key: 'title' },
    { title: 'Goal', dataIndex: 'goal', key: 'goal' },
    { title: 'Comments', dataIndex: 'comments', key: 'comments' },
    { title: 'Image', dataIndex: 'image_url', key: 'image_url', render: (image) => image && <img src={image} alt="Gift Card" style={{ maxWidth: '100px' }} /> },
    { title: 'Amount Contributed', dataIndex: 'amountContributed', key: 'amountContributed' },
    { title: 'Actions', key: 'actions', render: (text, record) => (
      <>
        <Button onClick={() => showModal(record)} style={{ marginRight: 8 }}>Edit</Button>
        <Button onClick={() => handleDelete(record.id)} danger>Delete</Button>
        <Button  onClick={() => handleAddFunds({ giftCardId: record.id, username: '', userId: record.userId, profilePic: '', amountFunded: 0, registryId: record.registryId, message: '' })} style={{ marginLeft: 8, background: 'var(--primary-color)' }} type="primary">Add Funds</Button>
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
      <Button onClick={() => showModal()} type="primary" style={{ marginBottom: 16, background: 'var(--primary-color)' }}>Create Gift Card Fund</Button>
      <Table  className='admin-table' dataSource={giftCardFunds} columns={columns} rowKey="id" />

      <Modal
        title={editingGiftCardId ? 'Edit Gift Card Fund' : 'Create Gift Card Fund'}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} onFinish={handleCreateOrUpdate}>
          <Form.Item name="title" label="Title" rules={[{ required: true, message: 'Please input title!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="goal" label="Goal" rules={[{ required: true, message: 'Please input goal!' }]}>
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="comments" label="Comments">
            <Input.TextArea />
          </Form.Item>
          <Form.Item name="most_wanted" label="Most Wanted" valuePropName="checked">
            {/* <Checkbox /> */}
            <Input/>
          </Form.Item>
          <Form.Item name="hide_goal" label="Hide Goal" valuePropName="checked">
            {/* <Checkbox /> */}
            <Input/>
          </Form.Item>
          <Form.Item name="userId" label="User" rules={[{ required: true, message: 'Please select a user!' }]}>
            <Select options={userOptions} />
          </Form.Item>
          <Form.Item name="registryId" label="Registry" rules={[{ required: true, message: 'Please select a registry!' }]}>
            <Select options={registryOptions} />
          </Form.Item>
          <Form.Item name="amountContributed" label="Amount Contributed">
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="Upload Image">
            <Upload listType="picture" beforeUpload={() => false} fileList={fileList} onChange={({ fileList }) => setFileList(fileList)}>
              <Button style={{background: 'var(--primary-color)'}} icon={<UploadOutlined />}>Upload</Button>
            </Upload>
          </Form.Item>
          <Form.Item>
            <Button style={{background: 'var(--primary-color)'}} type="primary" htmlType="submit">Submit</Button>
          </Form.Item>
        </Form>
      </Modal>
    </motion.div>
  );
};

export default GiftCardFundsPage;
