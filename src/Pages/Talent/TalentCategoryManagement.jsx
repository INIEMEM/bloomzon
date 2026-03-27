import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Form, Input, Modal, Table, message } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import { TALENT_BASE_URL } from "../../api/config";

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
  const [isSubCategoryModalVisible, setIsSubCategoryModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [categoryForm] = Form.useForm();
  const [subCategoryForm] = Form.useForm();

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${TALENT_BASE_URL}/StoreCategories`);
      setCategories(response.data?.data || []);
    } catch (error) {
      message.error("Failed to fetch categories.");
    }
  };

  const fetchSubCategories = async () => {
    try {
      const response = await axios.get(`${TALENT_BASE_URL}/StoreSubCategories`);
      setSubCategories(response.data?.data || []);
    } catch (error) {
      message.error("Failed to fetch subcategories.");
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchSubCategories();
  }, []);

  const handleCreateOrUpdateCategory = async (values) => {
    try {
      if (selectedCategory) {
        await axios.put(`${TALENT_BASE_URL}/StoreCategory`, {
          ...values,
          id: selectedCategory.id,
        });
        message.success("Category updated successfully.");
      } else {
        await axios.post(`${TALENT_BASE_URL}/CreateStoreCategoryName`, values);
        message.success("Category created successfully.");
      }

      setIsCategoryModalVisible(false);
      setSelectedCategory(null);
      categoryForm.resetFields();
      fetchCategories();
    } catch (error) {
      message.error("Failed to save category.");
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      await axios.delete(`${TALENT_BASE_URL}/StoreCategories/${id}`);
      message.success("Category deleted successfully.");
      fetchCategories();
    } catch (error) {
      message.error("Failed to delete category.");
    }
  };

  const handleCreateOrUpdateSubCategory = async (values) => {
    try {
      if (selectedSubCategory) {
        await axios.put(`${TALENT_BASE_URL}/StoreSubCategory`, {
          ...values,
          id: selectedSubCategory.id,
        });
        message.success("Subcategory updated successfully.");
      } else {
        await axios.post(`${TALENT_BASE_URL}/CreateStoreSubCategory`, values);
        message.success("Subcategory created successfully.");
      }

      setIsSubCategoryModalVisible(false);
      setSelectedSubCategory(null);
      subCategoryForm.resetFields();
      fetchSubCategories();
    } catch (error) {
      message.error("Failed to save subcategory.");
    }
  };

  const handleDeleteSubCategory = async (id) => {
    try {
      await axios.delete(`${TALENT_BASE_URL}/StoreSubCategory/${id}`);
      message.success("Subcategory deleted successfully.");
      fetchSubCategories();
    } catch (error) {
      message.error("Failed to delete subcategory.");
    }
  };

  const categoryColumns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Page", dataIndex: "page", key: "page" },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <>
          <Button
            size="small"
            onClick={() => {
              setSelectedCategory(record);
              categoryForm.setFieldsValue(record);
              setIsCategoryModalVisible(true);
            }}
          >
            Edit
          </Button>
          <Button
            size="small"
            onClick={() => handleDeleteCategory(record.id)}
            style={{ marginLeft: 8 }}
            icon={<DeleteOutlined />}
          />
        </>
      ),
    },
  ];

  const subCategoryColumns = [
    { title: "Parent Name ID", dataIndex: "parentNameId", key: "parentNameId" },
    { title: "Parent Name", dataIndex: "parentName", key: "parentName" },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Search Keyword", dataIndex: "searchKeyword", key: "searchKeyword" },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <>
          <Button
            size="small"
            onClick={() => {
              setSelectedSubCategory(record);
              subCategoryForm.setFieldsValue(record);
              setIsSubCategoryModalVisible(true);
            }}
          >
            Edit
          </Button>
          <Button
            size="small"
            onClick={() => handleDeleteSubCategory(record.id)}
            style={{ marginLeft: 8 }}
            icon={<DeleteOutlined />}
          />
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
      <Button
        type="primary"
        onClick={() => {
          setSelectedCategory(null);
          categoryForm.resetFields();
          setIsCategoryModalVisible(true);
        }}
        style={{ background: "var(--primary-color)" }}
      >
        Create Category
      </Button>
      <Table dataSource={categories} columns={categoryColumns} rowKey="id" className="admin-table" />

      <Button
        type="primary"
        onClick={() => {
          setSelectedSubCategory(null);
          subCategoryForm.resetFields();
          setIsSubCategoryModalVisible(true);
        }}
        style={{ marginTop: 16, background: "var(--primary-color)" }}
      >
        Create Subcategory
      </Button>
      <Table
        dataSource={subCategories}
        columns={subCategoryColumns}
        rowKey="id"
        style={{ marginTop: 16 }}
        className="admin-table"
      />

      <Modal
        title={selectedCategory ? "Update Category" : "Create Category"}
        open={isCategoryModalVisible}
        onCancel={() => setIsCategoryModalVisible(false)}
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
            <Button type="primary" htmlType="submit" style={{ background: "var(--primary-color)" }}>
              {selectedCategory ? "Update" : "Create"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={selectedSubCategory ? "Update Subcategory" : "Create Subcategory"}
        open={isSubCategoryModalVisible}
        onCancel={() => setIsSubCategoryModalVisible(false)}
        footer={null}
      >
        <Form form={subCategoryForm} onFinish={handleCreateOrUpdateSubCategory}>
          <Form.Item name="parentNameId" label="Parent Name ID" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item name="parentName" label="Parent Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="searchKeyword" label="Search Keyword">
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ background: "var(--primary-color)" }}>
              {selectedSubCategory ? "Update" : "Create"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </motion.div>
  );
};

export default CategoryManagement;
