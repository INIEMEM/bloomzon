import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Form, Input, Modal, Table, Upload, message } from "antd";
import { motion } from "framer-motion";
import { UploadOutlined } from "@ant-design/icons";
import { REGISTRY_BASE_URL } from "../../api/config";
import { uploadTalentImage } from "../../api/uploads";

const GiftCategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [form] = Form.useForm();

  const fetchCategories = async () => {
    const response = await axios.get(`${REGISTRY_BASE_URL}/registry-gift-categories`);
    setCategories(response.data?.data || []);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const filteredCategories = categories.filter((category) =>
    String(category.name || "").toLowerCase().includes(searchText.toLowerCase()),
  );

  const handleCreateOrUpdate = async (values) => {
    try {
      let image = editingCategory?.image || "";
      if (fileList[0]?.originFileObj) {
        image = await uploadTalentImage(fileList[0].originFileObj);
      }

      const payload = {
        name: values.name,
        image,
      };

      if (editingCategory) {
        await axios.put(`${REGISTRY_BASE_URL}/registry-gift-categories/${editingCategory.id}`, payload);
        message.success("Category updated successfully.");
      } else {
        await axios.post(`${REGISTRY_BASE_URL}/Create-registry-category/`, payload);
        message.success("Category created successfully.");
      }

      setIsModalVisible(false);
      setEditingCategory(null);
      setFileList([]);
      form.resetFields();
      fetchCategories();
    } catch (error) {
      message.error("Failed to save category.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${REGISTRY_BASE_URL}/registry-gift-categories/${id}`);
      message.success("Category deleted successfully.");
      fetchCategories();
    } catch (error) {
      message.error("Failed to delete category.");
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-[20px]">
      <h1 className="text-[23px] font-semibold">Gift Category</h1>
      <Input
        placeholder="Search categories..."
        value={searchText}
        onChange={(event) => setSearchText(event.target.value)}
        style={{ marginBottom: 16 }}
      />
      <Button
        onClick={() => {
          setEditingCategory(null);
          form.resetFields();
          setFileList([]);
          setIsModalVisible(true);
        }}
        type="primary"
        style={{ marginBottom: 16, background: "var(--primary-color)" }}
      >
        Create Category
      </Button>

      <Table
        className="admin-table"
        dataSource={filteredCategories}
        rowKey="id"
        columns={[
          { title: "ID", dataIndex: "id", key: "id" },
          { title: "Name", dataIndex: "name", key: "name" },
          {
            title: "Image",
            dataIndex: "image",
            key: "image",
            render: (image) => (image ? <img src={image} alt="Category" style={{ maxWidth: 100 }} /> : "N/A"),
          },
          {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
              <>
                <Button
                  onClick={() => {
                    setEditingCategory(record);
                    form.setFieldsValue(record);
                    setFileList(
                      record.image
                        ? [{ uid: String(record.id), name: "image", status: "done", url: record.image }]
                        : [],
                    );
                    setIsModalVisible(true);
                  }}
                  style={{ marginRight: 8 }}
                >
                  Edit
                </Button>
                <Button type="primary" onClick={() => handleDelete(record.id)} danger>
                  Delete
                </Button>
              </>
            ),
          },
        ]}
      />

      <Modal
        title={editingCategory ? "Edit Category" : "Create Category"}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleCreateOrUpdate} layout="vertical">
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="image" label="Image">
            <Upload
              beforeUpload={() => false}
              fileList={fileList}
              maxCount={1}
              onChange={({ fileList: nextFileList }) => setFileList(nextFileList)}
            >
              <Button icon={<UploadOutlined />}>Select File</Button>
            </Upload>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingCategory ? "Update" : "Create"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </motion.div>
  );
};

export default GiftCategoriesPage;
