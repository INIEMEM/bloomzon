import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Modal, Form, Input, DatePicker, message, Upload } from 'antd';
import { motion } from 'framer-motion';
import { UploadOutlined } from '@ant-design/icons';

const getAllUsersUrl = 'https://bloomzon-server.vercel.app/api/v1/user/get-all-users';
const test_tv_base_url = 'https://blosom-tv-server.onrender.com'; // Replace with your actual base URL

const GiftAllUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [giftListsModalVisible, setGiftListsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [giftLists, setGiftLists] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchText]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(getAllUsersUrl);
      setUsers(response.data.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      message.error('Failed to fetch users.');
    }
  };

  const filterUsers = () => {
    const filtered = users.filter((user) => {
      const search = searchText?.toLowerCase();
      return (
        user?.username?.toLowerCase().includes(search) ||
        user?.email?.toLowerCase().includes(search) ||
        user?.phoneNumber?.toLowerCase().includes(search) ||
        user?.firstName?.toLowerCase().includes(search) ||
        user?.lastName?.toLowerCase().includes(search)
      );
    });
    setFilteredUsers(filtered);
  };

  const showModal = (userId) => {
    setSelectedUserId(userId);
    setIsModalVisible(true);
  };

  const showGiftListsModal = async (userId) => {
    try {
      const response = await axios.get(`<span class="math-inline">\{test\_tv\_base\_url\}/registry/</span>{userId}`);
      setGiftLists(response.data.data);
      console.log('the response data', response.data);
      setGiftListsModalVisible(true);
    } catch (error) {
      console.error('Error fetching gift lists:', error);
      message.error('Failed to fetch gift lists.');
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setGiftListsModalVisible(false);
    setFileList([]);
  };

  const handleAddGiftList = async (values) => {
    try {
      let imageUrl = values.backgroundImageUrl;

      if(fileList.length > 0 && fileList[0]){
        const formData = new FormData();
        formData.append('file', fileList[0]);

        const uploadResponse = await axios.post(`${test_tv_base_url}/UploadImage`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        imageUrl = uploadResponse.data.url;
      }

      const giftListData = {
        ...values,
        ownerId: selectedUserId,
        backgroundImageUrl: imageUrl,
      };

      await axios.post(`${test_tv_base_url}/create-registry`, giftListData,  {
        headers: { 'Content-Type': 'application/json' },
      });
      message.success('Gift list added successfully.');
      setIsModalVisible(false);
      setFileList([]);
    } catch (error) {
      console.error('Error adding gift list:', error);
      message.error('Failed to add gift list.');
    }
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Username', dataIndex: 'username', key: 'username' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Phone Number', dataIndex: 'phoneNumber', key: 'phoneNumber' },
    { title: 'First Name', dataIndex: 'firstName', key: 'firstName' },
    { title: 'Last Name', dataIndex: 'lastName', key: 'lastName' },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <>
          <Button onClick={() => showGiftListsModal(record.id)} style={{ marginRight: 8,  }}>View Details</Button>
          <Button style={{background: 'var(--primary-color)'}} onClick={() => showModal(record.id)} type="primary">Add Gift List</Button>
        </>
      ),
    },
  ];

  const giftListsColumns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Date', dataIndex: 'date', key: 'date' },
    { title: 'City', dataIndex: 'city', key: 'city' },
    { title: 'State', dataIndex: 'state', key: 'state' },
    // Add more columns as needed
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
      className="p-[20px]"
    >
      <Input
        placeholder="Search users..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        style={{ marginBottom: 16, background: 'var(--primary-color)' }}
      />
      <Table className='admin-table' dataSource={filteredUsers} columns={columns} rowKey="id" />

      <Modal
        title="Add Gift List"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} onFinish={handleAddGiftList}>
          <Form.Item name="firstAndLastName" label="First and Last Name">
            <Input />
          </Form.Item>
          <Form.Item name="name" label="Name">
            <Input />
          </Form.Item>
          <Form.Item name="date" label="Date">
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="city" label="City">
            <Input />
          </Form.Item>
          <Form.Item name="state" label="State">
            <Input />
          </Form.Item>
          <Form.Item name="deliveryAddress" label="Delivery Address">
            <Input />
          </Form.Item>
          <Form.Item name="shareMyAddressWithSellers" label="Share My Address With Sellers">
            <Input type="number" />
          </Form.Item>
          <Form.Item name="letAdditionalGiftNotInMyList" label="Let Additional Gift Not In My List">
            <Input type="number" />
          </Form.Item>
          <Form.Item name="showWhatPeopleHavePurchasedForMe" label="Show What People Have Purchased For Me">
            <Input type="number" />
          </Form.Item>
          <Form.Item name="listVisibility" label="List Visibility">
            <Input />
          </Form.Item>
          <Form.Item name="backgroundImageUrl" label="Background Image">
            <Upload {...uploadProps}>
              <Button icon={<UploadOutlined />}>Select File</Button>
            </Upload>
          </Form.Item>
          <Form.Item name="tags" label="Tags">
            <Input />
          </Form.Item>
          <Form.Item>
            <Button style={{background: 'var(--primary-color)'}} type="primary" htmlType="submit">
              Add Gift List
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Gift Lists"
        visible={giftListsModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={1000}
      >
        {/* <Table dataSource={giftLists} c */}
        <Table className='admin-table' dataSource={giftLists} columns={giftListsColumns} rowKey="id" />
      </Modal>
    </motion.div>
  );
};

export default GiftAllUsersPage;