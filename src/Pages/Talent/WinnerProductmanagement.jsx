import React, { useEffect, useState } from "react";
import { Button, Form, Input, InputNumber, Modal, Select, Table, message } from "antd";
import axios from "axios";
import { REGISTRY_BASE_URL } from "../../api/config";

const WinnerProductManagement = () => {
  const [winnerProducts, setWinnerProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const fetchWinnerProducts = async () => {
    try {
      const response = await axios.get(`${REGISTRY_BASE_URL}/WinnersProduct/`);
      setWinnerProducts(response.data?.result || []);
    } catch (error) {
      message.error("Failed to fetch winner products.");
    }
  };

  useEffect(() => {
    fetchWinnerProducts();
  }, []);

  const handleDeleteProduct = async (id) => {
    try {
      await axios.delete(`${REGISTRY_BASE_URL}/WinnersProduct/${id}`);
      message.success("Product deleted successfully.");
      fetchWinnerProducts();
    } catch (error) {
      message.error("Failed to delete product.");
    }
  };

  const handleSave = async () => {
    const values = form.getFieldsValue();

    try {
      if (editingProduct) {
        await axios.put(`${REGISTRY_BASE_URL}/WinnersProduct/${editingProduct.id}`, values);
        message.success("Product updated successfully.");
      } else {
        await axios.post(`${REGISTRY_BASE_URL}/WinnersProducts`, {
          winnerId: values.winnerId || 0,
          productId: values.productId || 0,
          data: {
            title: values.title,
            type: values.type,
            style: values.style,
            price: values.price,
            description: values.description,
            inStock: values.inStock,
          },
        });
        message.success("Product created successfully.");
      }

      setIsModalVisible(false);
      setEditingProduct(null);
      form.resetFields();
      fetchWinnerProducts();
    } catch (error) {
      message.error("Failed to save product.");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <Button
        type="primary"
        onClick={() => {
          setEditingProduct(null);
          form.resetFields();
          setIsModalVisible(true);
        }}
        style={{ marginBottom: 16, background: "var(--primary-color)" }}
      >
        Create Winner Product
      </Button>

      <Table
        dataSource={winnerProducts}
        rowKey="id"
        className="admin-table"
        columns={[
          { title: "ID", dataIndex: "id", key: "id" },
          { title: "Title", dataIndex: "title", key: "title" },
          { title: "Type", dataIndex: "type", key: "type" },
          { title: "Style", dataIndex: "style", key: "style" },
          { title: "Price", dataIndex: "price", key: "price" },
          {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
              <>
                <Button
                  onClick={() => {
                    setEditingProduct(record);
                    form.setFieldsValue(record);
                    setIsModalVisible(true);
                  }}
                  style={{ marginRight: 8 }}
                >
                  Edit
                </Button>
                <Button onClick={() => handleDeleteProduct(record.id)} danger>
                  Delete
                </Button>
              </>
            ),
          },
        ]}
      />

      <Modal
        title={editingProduct ? "Edit Winner Product" : "Create Winner Product"}
        open={isModalVisible}
        onOk={handleSave}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          {!editingProduct ? (
            <>
              <Form.Item name="winnerId" label="Winner ID">
                <InputNumber style={{ width: "100%" }} min={0} />
              </Form.Item>
              <Form.Item name="productId" label="Source Product ID">
                <InputNumber style={{ width: "100%" }} min={0} />
              </Form.Item>
            </>
          ) : null}
          <Form.Item name="title" label="Title">
            <Input />
          </Form.Item>
          <Form.Item name="type" label="Type">
            <Input />
          </Form.Item>
          <Form.Item name="style" label="Style">
            <Input />
          </Form.Item>
          <Form.Item name="price" label="Price">
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item name="inStock" label="In Stock">
            <Select
              options={[
                { value: "YES", label: "YES" },
                { value: "NO", label: "NO" },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default WinnerProductManagement;
