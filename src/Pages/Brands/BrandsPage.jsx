import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Modal, Form, Input, Select, message } from 'antd';
import { motion } from 'framer-motion';

const test_tv_base_url = 'https://blosom-tv-server.onrender.com'; // Replace with your actual base URL

const BrandFiltersPage = () => {
  const [filters, setFilters] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingFilterId, setEditingFilterId] = useState(null);
  const [brandOptions, setBrandOptions] = useState([]);
    const [brands, setBrands] = useState([]);


  useEffect(() => {
    fetchFilters();
    fetchBrandOptions();
  }, []);

  const fetchFilters = async () => {
    try {
      const response = await axios.get(`${test_tv_base_url}/BrandFilters/all`);
      setFilters(response.data.results);
    } catch (error) {
      console.error('Error fetching filters:', error);
      message.error('Failed to fetch filters.');
    }
  };

  const fetchBrandOptions = async () => {
    try {
      const response = await axios.get(`${test_tv_base_url}/Brands/all`);
      setBrandOptions(response.data.results.map((brand) => ({
        value: brand.name,
        label: brand.name,
      })));
      setBrands(response.data.results);

    } catch (error) {
      console.error('Error fetching brand options:', error);
      message.error('Failed to fetch brand options.');
    }
  };

  const showModal = (filter = null) => {
    if (filter) {
      setEditingFilterId(filter.id);
      form.setFieldsValue(filter);
    } else {
      setEditingFilterId(null);
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleCreateOrUpdate = async (values) => {
    try {
      if (editingFilterId) {
        await axios.put(`${test_tv_base_url}/BrandFilters/update/${editingFilterId}`, values);
        message.success('Filter updated successfully.');
      } else {
        await axios.post(`${test_tv_base_url}/BrandFilters/create`, values);
        message.success('Filter created successfully.');
      }
      fetchFilters();
      setIsModalVisible(false);
    } catch (error) {
      console.error('Error creating/updating filter:', error);
      message.error('Failed to create/update filter.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${test_tv_base_url}/BrandFilters/delete/${id}`);
      message.success('Filter deleted successfully.');
      fetchFilters();
    } catch (error) {
      console.error('Error deleting filter:', error);
      message.error('Failed to delete filter.');
    }
  };
  const brandcolumns = [
    // { title: 'Brand ID', dataIndex: 'brandId', key: 'brandId' },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    // { title: 'Profile Pic', dataIndex: 'profilePic', key: 'profilePic' },
    { title: 'Brand Identification Name', dataIndex: 'brandIdentificationName', key: 'brandIdentificationName' },
    { title: 'Shares', dataIndex: 'shares', key: 'shares' },
    { title: 'Followers', dataIndex: 'followers', key: 'followers' },
    { title: 'Following', dataIndex: 'following', key: 'following' },
    // { title: 'Background Image', dataIndex: 'backgroundImage', key: 'backgroundImage' },
    { title: 'Posher Since Date', dataIndex: 'posherSinceDate', key: 'posherSinceDate' },
    { title: 'Average Shipping Time', dataIndex: 'averageShippingTime', key: 'averageShippingTime' },
    { title: 'Last Active', dataIndex: 'lastActive', key: 'lastActive' },
    { title: 'Location String', dataIndex: 'locationString', key: 'locationString' },
    { title: 'Tags', dataIndex: 'tags', key: 'tags' },
    { title: 'Seller Discount', dataIndex: 'sellerDiscount', key: 'sellerDiscount' },
    { title: 'Category', dataIndex: 'category', key: 'category' },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <>
          <Button onClick={() => showModal(record)} style={{ marginRight: 8 }}>Edit</Button>
          <Button onClick={() => handleDelete(record.brandId)} danger>Delete</Button>
        </>
      ),
    },
  ];
  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Sort', dataIndex: 'sort', key: 'sort' },
    { title: 'Category', dataIndex: 'category', key: 'category' },
    { title: 'Brand', dataIndex: 'brand', key: 'brand' },
    { title: 'Size', dataIndex: 'size', key: 'size' },
    { title: 'Color', dataIndex: 'color', key: 'color' },
    { title: 'Price', dataIndex: 'price', key: 'price' },
    { title: 'Shipping', dataIndex: 'shipping', key: 'shipping' },
    { title: 'Condition', dataIndex: 'condition', key: 'condition' },
    { title: 'Availability', dataIndex: 'availability', key: 'availability' },
    { title: 'Type', dataIndex: 'type', key: 'type' },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <>
          <Button onClick={() => showModal(record)} style={{ marginRight: 8 }}>Edit</Button>
          <Button onClick={() => handleDelete(record.id)} danger>Delete</Button>
        </>
      ),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="p-[20px]"
    >
      <Button onClick={() => showModal()} type="primary" style={{ marginBottom: 16, background: 'var(--primary-color)' }}>Create Filter</Button>
      <Table dataSource={filters} columns={columns} rowKey="id" className='admin-table' />
      <Table dataSource={brands} columns={brandcolumns} rowKey="brandId" className='admin-table overflow-x-auto'/>

      <Modal
        title={editingFilterId ? 'Edit Filter' : 'Create Filter'}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} onFinish={handleCreateOrUpdate}>
          <Form.Item name="sort" label="Sort">
            <Select>
              <Select.Option value="price_low_to_high">Price Low to High</Select.Option>
              <Select.Option value="price_high_to_low">Price High to Low</Select.Option>
              {/* Add more sort options if needed */}
            </Select>
          </Form.Item>
          <Form.Item name="category" label="Category">
            <Input />
          </Form.Item>
          <Form.Item name="brand" label="Brand">
            <Select options={brandOptions} />
          </Form.Item>
          <Form.Item name="size" label="Size">
            <Input />
          </Form.Item>
          <Form.Item name="color" label="Color">
            <Input />
          </Form.Item>
          <Form.Item name="price" label="Price">
            <Input />
          </Form.Item>
          <Form.Item name="shipping" label="Shipping">
            <Input />
          </Form.Item>
          <Form.Item name="condition" label="Condition">
            <Input />
          </Form.Item>
          <Form.Item name="availability" label="Availability">
            <Input />
          </Form.Item>
          <Form.Item name="type" label="Type">
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingFilterId ? 'Update' : 'Create'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </motion.div>
  );
};

export default BrandFiltersPage;