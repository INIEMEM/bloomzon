import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Input, Button, Modal, Table, message, Select } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';

const { Option } = Select;

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
  const [isSubCategoryModalVisible, setIsSubCategoryModalVisible] = useState(false);
  const [categoryForm] = Form.useForm();
  const [subCategoryForm] = Form.useForm();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);

  const test_tv_base_url = 'https://blosom-tv-server.onrender.com'; // Replace with your actual base URL

  useEffect(() => {
    fetchCategories();
    fetchSubCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${test_tv_base_url}/StoreCategories`);
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      message.error('Failed to fetch categories.');
    }
  };

  const fetchSubCategories = async () => {
    try {
      const response = await axios.get(`${test_tv_base_url}/StoreSubCategories`);
      setSubCategories(response.data.data);
    } catch (error) {
      console.error('Error fetching subcategories:', error);
      message.error('Failed to fetch subcategories.');
    }
  };

  const showCategoryModal = (category = null) => {
    setSelectedCategory(category);
    if (category) {
      categoryForm.setFieldsValue({
        name: category.name,
        page: category.page,
      });
    } else {
      categoryForm.resetFields();
    }
    setIsCategoryModalVisible(true);
  };

  const showSubCategoryModal = (subCategory = null) => {
    setSelectedSubCategory(subCategory);
    if (subCategory) {
      subCategoryForm.setFieldsValue({
        parentNameId: subCategory.parentNameId,
        parentName: subCategory.parentName,
        name: subCategory.name,
        searchKeyword: subCategory.searchKeyword,
      });
    } else {
      subCategoryForm.resetFields();
    }
    setIsSubCategoryModalVisible(true);
  };

  const handleCategoryCancel = () => {
    setIsCategoryModalVisible(false);
  };

  const handleSubCategoryCancel = () => {
    setIsSubCategoryModalVisible(false);
  };

  const handleCreateOrUpdateCategory = async (values) => {
    try {
      if (selectedCategory) {
        // Assuming you have an endpoint to update a category
        // You might need to add an 'id' field in the form or pass it separately
        await axios.post(`${test_tv_base_url}/StoreCategory`, {
          ...values,
          id: selectedCategory.id,
        });
        message.success('Category updated successfully.');
      } else {
        await axios.post(`${test_tv_base_url}/CreateStoreCategoryName`, values);
        message.success('Category created successfully.');
      }
      fetchCategories();
      setIsCategoryModalVisible(false);
    } catch (error) {
      console.error('Error creating/updating category:', error);
      message.error(
        selectedCategory ? 'Failed to update category.' : 'Failed to create category.'
      );
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      await axios.delete(`${test_tv_base_url}/StoreCategories/${id}`);
      message.success('Category deleted successfully.');
      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      message.error('Failed to delete category.');
    }
  };

  const handleCreateOrUpdateSubCategory = async (values) => {
    try {
      if (selectedSubCategory) {
        await axios.put(`${test_tv_base_url}/StoreSubCategory`, {
          ...values,
          id: selectedSubCategory.id,
        });
        message.success('Subcategory updated successfully.');
      } else {
        await axios.post(`${test_tv_base_url}/CreateStoreSubCategory`, values);
        message.success('Subcategory created successfully.');
      }
      fetchSubCategories();
      setIsSubCategoryModalVisible(false);
    } catch (error) {
      console.error('Error creating/updating subcategory:', error);
      message.error(
        selectedSubCategory ? 'Failed to update subcategory.' : 'Failed to create subcategory.'
      );
    }
  };

  const handleDeleteSubCategory = async (id) => {
    try {
      await axios.delete(`${test_tv_base_url}/StoreSubCategory/${id}`);
      message.success('Subcategory deleted successfully.');
      fetchSubCategories();
    } catch (error) {
      console.error('Error deleting subcategory:', error);
      message.error('Failed to delete subcategory.');
    }
  };

  const categoryColumns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Page', dataIndex: 'page', key: 'page' },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <>
          <Button size="small" onClick={() => showCategoryModal(record)}>
            Edit
          </Button>
          <Button
            size="small"
            onClick={() => handleDeleteCategory(record.id)}
            style={{ marginLeft: '8px' }}
            icon={<DeleteOutlined />}
          />
        </>
      ),
    },
  ];

  const subCategoryColumns = [
    { title: 'Parent Name ID', dataIndex: 'parentNameId', key: 'parentNameId' },
    { title: 'Parent Name', dataIndex: 'parentName', key: 'parentName' },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Search Keyword', dataIndex: 'searchKeyword', key: 'searchKeyword' },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <>
          <Button size="small" onClick={() => showSubCategoryModal(record)}>
            Edit
          </Button>
          <Button
            size="small"
            onClick={() => handleDeleteSubCategory(record.id)}
            style={{ marginLeft: '8px' }}
            icon={<DeleteOutlined />}
          />
        </>
      ),
    },
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
      <Button type="primary" onClick={() => showCategoryModal()} style={{background: 'var(--primary-color)'}}>
        Create Category
      </Button>
      <Table dataSource={categories} columns={categoryColumns} rowKey="id" className='admin-table' />

      <Button type="primary" onClick={() => showSubCategoryModal()} style={{ marginTop: '16px', background: 'var(--primary-color)' }}>
        Create Subcategory
      </Button>
      <Table dataSource={subCategories} columns={subCategoryColumns} rowKey="id" style={{ marginTop: '16px' , }} className='admin-table'/>

      <Modal
        title={selectedCategory ? 'Update Category' : 'Create Category'}
        visible={isCategoryModalVisible}
        onCancel={handleCategoryCancel}
        footer={null}
      >
        <Form form={categoryForm} onFinish={handleCreateOrUpdateCategory}>
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="page" label="Page" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{background: 'var(--primary-color)'}}>
              {selectedCategory ? 'Update' : 'Create'}
            </Button>
            </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={selectedSubCategory ? 'Update Subcategory' : 'Create Subcategory'}
        visible={isSubCategoryModalVisible}
        onCancel={handleSubCategoryCancel}
        footer={null}
      >
        <Form form={subCategoryForm} onFinish={handleCreateOrUpdateSubCategory}>
          <Form.Item
            name="parentNameId"
            label="Parent Name ID"
            rules={[{ required: true }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="parentName"
            label="Parent Name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="searchKeyword" label="Search Keyword">
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{background: 'var(--primary-color)'}}>
              {selectedSubCategory ? 'Update' : 'Create'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </motion.div>
  );
};

export default CategoryManagement;