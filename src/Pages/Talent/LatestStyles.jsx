import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Form, Input, Modal, Table, Upload, message } from "antd";
import { motion } from "framer-motion";
import { UploadOutlined } from "@ant-design/icons";
import { REGISTRY_BASE_URL } from "../../api/config";
import { uploadTalentImage } from "../../api/uploads";

const LatestStylesPage = () => {
  const [latestStyles, setLatestStyles] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingStyle, setEditingStyle] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [form] = Form.useForm();

  const fetchLatestStyles = async () => {
    try {
      const response = await axios.get(`${REGISTRY_BASE_URL}/LatestStyle`);
      setLatestStyles(response.data?.result || []);
    } catch (error) {
      message.error("Failed to fetch latest styles.");
    }
  };

  useEffect(() => {
    fetchLatestStyles();
  }, []);

  const handleCreateOrUpdate = async (values) => {
    try {
      let image = editingStyle?.image || "";

      if (fileList[0]?.originFileObj) {
        image = await uploadTalentImage(fileList[0].originFileObj);
      }

      const payload = {
        name: values.name,
        searchKeyword: values.searchKeyword,
        image,
      };

      if (editingStyle) {
        await axios.put(`${REGISTRY_BASE_URL}/LatestStyle/${editingStyle.id}`, payload);
        message.success("Latest style updated successfully.");
      } else {
        await axios.post(`${REGISTRY_BASE_URL}/LatestStyle`, payload);
        message.success("Latest style created successfully.");
      }

      setIsModalVisible(false);
      setEditingStyle(null);
      setFileList([]);
      form.resetFields();
      fetchLatestStyles();
    } catch (error) {
      message.error("Failed to save latest style.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${REGISTRY_BASE_URL}/LatestStyle/${id}`);
      message.success("Latest style deleted successfully.");
      fetchLatestStyles();
    } catch (error) {
      message.error("Failed to delete latest style.");
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-[20px]">
      <Button
        onClick={() => {
          setEditingStyle(null);
          setFileList([]);
          form.resetFields();
          setIsModalVisible(true);
        }}
        type="primary"
        style={{ marginBottom: 16, background: "var(--primary-color)" }}
      >
        Create Latest Style
      </Button>

      <Table
        dataSource={latestStyles}
        rowKey="id"
        className="admin-table"
        columns={[
          { title: "ID", dataIndex: "id", key: "id" },
          {
            title: "Image",
            dataIndex: "image",
            key: "image",
            render: (image) =>
              image ? <img src={image} alt="Style" style={{ maxWidth: 100 }} /> : "N/A",
          },
          { title: "Name", dataIndex: "name", key: "name" },
          { title: "Search Keyword", dataIndex: "searchKeyword", key: "searchKeyword" },
          {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
              <>
                <Button
                  onClick={() => {
                    setEditingStyle(record);
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
                <Button onClick={() => handleDelete(record.id)} danger>
                  Delete
                </Button>
              </>
            ),
          },
        ]}
      />

      <Modal
        title={editingStyle ? "Edit Latest Style" : "Create Latest Style"}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleCreateOrUpdate} layout="vertical">
          <Form.Item name="name" label="Name" rules={[{ required: true, message: "Please input style name!" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="searchKeyword" label="Search Keyword">
            <Input />
          </Form.Item>
          <Form.Item label="Image">
            <Upload
              beforeUpload={() => false}
              fileList={fileList}
              maxCount={1}
              onChange={({ fileList: nextFiles }) => setFileList(nextFiles)}
            >
              <Button icon={<UploadOutlined />}>Select File</Button>
            </Upload>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingStyle ? "Update" : "Create"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </motion.div>
  );
};

export default LatestStylesPage;
