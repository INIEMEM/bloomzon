import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Input, Button, Upload, Select, Modal, Table, message } from 'antd';
import { UploadOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';

const { Option } = Select;

const AppBannerManagement = () => {
  const [banners, setBanners] = useState([]);
  const [users, setUsers] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [bannerProducts, setBannerProducts] = useState([]);
  const [isAddProductModalVisible, setIsAddProductModalVisible] = useState(false);
  const [addProductForm] = Form.useForm();

  const base_url = 'https://api-bloomzon-com.onrender.com'; // Replace with your actual base URL

  useEffect(() => {
    fetchBanners();
    fetchUsers();
  }, []);

  const fetchBanners = async () => {
    try {
      const response = await axios.post(`${base_url}/getAppBanner`);
      setBanners(response.data);
    } catch (error) {
      console.error('Error fetching banners:', error);
      message.error('Failed to fetch banners.');
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        'https://bloomzon-server.vercel.app/api/v1/user/get-all-users'
      );
      setUsers(response.data.data);
      console.log('the user data ', response.data)
      
    } catch (error) {
      console.error('Error fetching users:', error);
      message.error('Failed to fetch users.');
    }
  };

  const showModal = (banner = null) => {
    setSelectedBanner(banner);
    if (banner) {
      form.setFieldsValue({
        title: banner.title,
        keywords: banner.keywords,
        creatorID: banner.creatorID,
      });
    } else {
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

    const handleAddProductCancel = () => {
    setIsAddProductModalVisible(false);
  };

  const handleCreateOrUpdateBanner = async (values) => {
    try {
      const formData = new FormData();
      formData.append('title', values.title);
      formData.append('keywords', values.keywords);
      formData.append('creatorID', values.creatorID);
      formData.append('image', values.image.file);
      if (selectedBanner) {
        formData.append('previousImage', selectedBanner.image);
        await axios.post(`${base_url}/updateBanner`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        message.success('Banner updated successfully.');
      } else {
        await axios.post(`${base_url}/createBanner`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        message.success('Banner created successfully.');
      }
      fetchBanners();
      setIsModalVisible(false);
    } catch (error) {
      console.error('Error creating/updating banner:', error);
      message.error(
        selectedBanner
          ? 'Failed to update banner.'
          : 'Failed to create banner.'
      );
    }
  };

  const handleDeactivateBanner = async (id, enabled) => {
    try {
      await axios.post(`${base_url}/deactivateBanner`, { id, enabled });
      message.success(`Banner ${enabled === 'Active' ? 'deactivated' : 'activated'} successfully.`);
      fetchBanners();
    } catch (error) {
      console.error('Error deactivating banner:', error);
      message.error('Failed to deactivate banner.');
    }
  };

  const handleAddBannerProducts = async (values) => {
    try {
      await axios.post(`${base_url}/addBannerProducts`, {
        bannerID: selectedBanner.id,
        productID: values.productID,
      });
      message.success('Product added to banner successfully.');
      fetchBannerProducts(selectedBanner.id);
      setIsAddProductModalVisible(false);
    } catch (error) {
      console.error('Error adding product to banner:', error);
      message.error('Failed to add product to banner.');
    }
  };

    const fetchBannerProducts = async (bannerId) => {
    try {
      const response = await axios.post(
        `${base_url}/getBannerProductsByID`,
        { bannerID: bannerId }
      );
      setBannerProducts(response.data);
    } catch (error) {
      console.error('Error fetching banner products:', error);
      message.error('Failed to fetch banner products.');
      setBannerProducts([]);
    }
  };

  const columns = [
    { title: 'Title', dataIndex: 'title', key: 'title' },
    { title: 'Keywords', dataIndex: 'keywords', key: 'keywords' },
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      render: (image) => <img src={image} alt="Banner" style={{ maxWidth: '50px' }} />,
    },
    { title: 'Enabled', dataIndex: 'enabled', key: 'enabled' },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <>
          <Button size="small" onClick={() => showModal(record)}>
            Edit
          </Button>
          <Button
            size="small"
            onClick={() =>
              handleDeactivateBanner(record.id, record.enabled === 'Active' ? 'DISABLED' : 'Active')
            }
            style={{ marginLeft: '8px' }}
          >
            {record.enabled === 'Active' ? 'Deactivate' : 'Activate'}
          </Button>
            <Button size="small" onClick={() => {
              setSelectedBanner(record);
              fetchBannerProducts(record.id);
              setIsAddProductModalVisible(true);
            }} style={{ marginLeft: '8px' }}>
              Add Product
            </Button>
        </>
      ),
    },
  ];

  const productColumns = [
    { title: 'Product ID', dataIndex: 'id', key: 'id' },
    { title: 'Title', dataIndex: 'title', key: 'title' },
    { title: 'Price', dataIndex: 'price', key: 'price' },
  ];

  const pageVariants = {
    initial: { opacity: 0 },
    in: { opacity: 1 },
    out: { opacity: 0 },
  };

  const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.5,
  };

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className='p-[20px]'
    >
        <div className="flex items-center justify-between">
            <h1 className='font-semibold text-[23px]'>App Banner Management</h1>
            <Button type="primary" onClick={() => showModal()} style={{backgroundColor: 'var(--primary-color)'}}>
                Create Banner
            </Button>
        </div>
      <Table dataSource={banners} columns={columns} rowKey="id" className='admin-table'/>

      <Modal
        title={selectedBanner ? 'Update Banner' : 'Create Banner'}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} onFinish={handleCreateOrUpdateBanner}>
          <Form.Item name="title" label="Title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="keywords" label="Keywords" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="image"
            label="Image"
            valuePropName="fileList"
            getValueFromEvent={(e) => {
              if (Array.isArray(e)) {
                return e;
              }
              return e && e.fileList;
            }}
            rules={[{ required: !selectedBanner }]}
          >
            <Upload listType="picture" maxCount={1}>
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
          </Form.Item>
          <Form.Item
            name="creatorID"
            label="Creator ID"
            rules={[{ required: true }]}
          >
            <Select>
              {users?.map((user) => (
                <Option key={user.id} value={user.id}>
                  {user.name} ({user.id})
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {selectedBanner ? 'Update' : 'Create'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Add Product to Banner"
        visible={isAddProductModalVisible}
        onCancel={handleAddProductCancel}
        footer={null}
      >
        <Table dataSource={bannerProducts} columns={productColumns} rowKey="id" />
        <Form form={addProductForm} onFinish={handleAddBannerProducts}>
          <Form.Item name="productID" label="Product ID" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Add Product
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </motion.div>
  );
};

export default AppBannerManagement;