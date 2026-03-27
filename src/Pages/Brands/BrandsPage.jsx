import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Form, Input, Modal, Select, Table, message } from "antd";
import { motion } from "framer-motion";
import { REGISTRY_BASE_URL } from "../../api/config";

const BrandFiltersPage = () => {
  const [filters, setFilters] = useState([]);
  const [brands, setBrands] = useState([]);
  const [editingFilter, setEditingFilter] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const fetchFilters = async () => {
    const response = await axios.get(`${REGISTRY_BASE_URL}/BrandFilters/all`);
    setFilters(response.data || []);
  };

  const fetchBrands = async () => {
    const response = await axios.get(`${REGISTRY_BASE_URL}/Brands/all`);
    setBrands(response.data?.results || []);
  };

  useEffect(() => {
    fetchFilters();
    fetchBrands();
  }, []);

  const handleCreateOrUpdate = async (values) => {
    try {
      if (editingFilter) {
        await axios.put(`${REGISTRY_BASE_URL}/BrandFilters/update/${editingFilter.id}`, values);
        message.success("Filter updated successfully.");
      } else {
        await axios.post(`${REGISTRY_BASE_URL}/BrandFilters/create`, values);
        message.success("Filter created successfully.");
      }

      setIsModalVisible(false);
      setEditingFilter(null);
      form.resetFields();
      fetchFilters();
    } catch (error) {
      message.error("Failed to save filter.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${REGISTRY_BASE_URL}/BrandFilters/delete/${id}`);
      message.success("Filter deleted successfully.");
      fetchFilters();
    } catch (error) {
      message.error("Failed to delete filter.");
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-[20px]">
      <Button
        onClick={() => {
          setEditingFilter(null);
          form.resetFields();
          setIsModalVisible(true);
        }}
        type="primary"
        style={{ marginBottom: 16, background: "var(--primary-color)" }}
      >
        Create Filter
      </Button>

      <Table
        dataSource={filters}
        columns={[
          { title: "ID", dataIndex: "id", key: "id" },
          { title: "Sort", dataIndex: "sort", key: "sort" },
          { title: "Category", dataIndex: "category", key: "category" },
          { title: "Brand", dataIndex: "brand", key: "brand" },
          { title: "Availability", dataIndex: "availability", key: "availability" },
          {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
              <>
                <Button
                  onClick={() => {
                    setEditingFilter(record);
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
        ]}
        rowKey="id"
        className="admin-table"
      />

      <Table
        dataSource={brands}
        rowKey="brandId"
        className="admin-table overflow-x-auto"
        columns={[
          { title: "Name", dataIndex: "name", key: "name" },
          { title: "Brand Identification Name", dataIndex: "brandIdentificationName", key: "brandIdentificationName" },
          { title: "Followers", dataIndex: "followers", key: "followers" },
          { title: "Following", dataIndex: "following", key: "following" },
          { title: "Category", dataIndex: "Category", key: "Category" },
        ]}
      />

      <Modal
        title={editingFilter ? "Edit Filter" : "Create Filter"}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleCreateOrUpdate} layout="vertical">
          <Form.Item name="sort" label="Sort">
            <Select
              options={[
                { value: "price_low_to_high", label: "Price Low to High" },
                { value: "price_high_to_low", label: "Price High to Low" },
              ]}
            />
          </Form.Item>
          <Form.Item name="category" label="Category">
            <Input />
          </Form.Item>
          <Form.Item name="brand" label="Brand">
            <Select
              options={brands.map((brand) => ({
                value: brand.name,
                label: brand.name,
              }))}
            />
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
              {editingFilter ? "Update" : "Create"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </motion.div>
  );
};

export default BrandFiltersPage;
