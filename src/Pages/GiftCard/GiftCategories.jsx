import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Modal, Form, Input, Upload, message } from 'antd';
import { motion } from 'framer-motion';
import { UploadOutlined } from '@ant-design/icons';

const test_tv_base_url = 'https://blosom-tv-server.onrender.com'; // Replace with your actual base URL

const GiftCategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filteredCategories, setFilteredCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    filterCategories();
  }, [categories, searchText]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${test_tv_base_url}/registry-gift-categories`);
      setCategories(response.data.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      message.error('Failed to fetch categories.');
    }
  };

  const filterCategories = () => {
    const filtered = categories.filter((category) => {
      const search = searchText.toLowerCase();
      return category.name.toLowerCase().includes(search);
    });
    setFilteredCategories(filtered);
  };

  const showModal = (category = null) => {
    if (category) {
      setEditingCategoryId(category.id);
      form.setFieldsValue(category);
      setFileList([{ uid: '1', name: 'categoryImage.png', status: 'done', url: category.image }]);
    } else {
      setEditingCategoryId(null);
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
      // formData.append('name', values.name);

      if (fileList.length > 0 && fileList[0]) {
        formData.append('file', fileList[0]);
      }

      let imageUrl ='';

      
        const uploadResponse = await axios.post(`${test_tv_base_url}/UploadImage`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        imageUrl = uploadResponse.data.url;
      

      const categoryData = {
        name: values.name,
        image: imageUrl
      };

      if (editingCategoryId) {
        await axios.put(`${test_tv_base_url}/registry-gift-categories/${editingCategoryId}`, categoryData);
        message.success('Category updated successfully.');
      } else {
        await axios.post(`${test_tv_base_url}/create-registry`, categoryData); // Assuming this is the correct endpoint for creation
        message.success('Category created successfully.');
      }
      fetchCategories();
      setIsModalVisible(false);
    } catch (error) {
      console.error('Error creating/updating category:', error);
      message.error('Failed to create/update category.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${test_tv_base_url}/registry-gift-categories/${id}`);
      message.success('Category deleted successfully.');
      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      message.error('Failed to delete category.');
    }
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      render: (image) => image && <img src={image} alt="Category" style={{ maxWidth: '100px' }} />,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <>
          <Button onClick={() => showModal(record)} style={{ marginRight: 8 }}>Edit</Button>
          <Button type='primary' onClick={() => handleDelete(record.id)} danger>Delete</Button>
        </>
      ),
    },
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
      <h1 className='text-[23px] font-semibold'>Gift Category</h1>
      <Input
        placeholder="Search categories..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        style={{ marginBottom: 16 }}
      />
      <Button onClick={() => showModal()} type="primary" style={{ marginBottom: 16, background: 'var(--primary-color)' }}>Create Category</Button>
      <Table className='admin-table' dataSource={filteredCategories} columns={columns} rowKey="id" />

      <Modal
        title={editingCategoryId ? 'Edit Category' : 'Create Category'}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} onFinish={handleCreateOrUpdate}>
          <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Please input category name!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="image" label="Image">
            <Upload {...uploadProps}>
              <Button icon={<UploadOutlined />}>Select File</Button>
            </Upload>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingCategoryId ? 'Update' : 'Create'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </motion.div>
  );
};

export default GiftCategoriesPage;