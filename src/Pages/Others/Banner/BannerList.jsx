import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Form, Input, Modal, Select, Table, Upload, message } from "antd";
import { motion } from "framer-motion";
import { UploadOutlined } from "@ant-design/icons";
import { ADMIN_BASE_URL, BANNER_BASE_URL } from "../../../api/config";
import { uploadTalentImage } from "../../../api/uploads";
import UnsupportedFeature from "../../../Components/UnsupportedFeature/UnsupportedFeature";

const { Option } = Select;

const AppBannerManagement = () => {
  const [banners, setBanners] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [form] = Form.useForm();

  const fetchBanners = async () => {
    const response = await axios.get(BANNER_BASE_URL);
    setBanners(response.data || []);
  };

  const fetchUsers = async () => {
    const response = await axios.get(`${ADMIN_BASE_URL}/users`, {
      params: { compact: true, role: "all", limit: 200 },
    });
    setUsers(response.data?.data?.items || []);
  };

  useEffect(() => {
    fetchBanners();
    fetchUsers();
  }, []);

  const handleCreateOrUpdateBanner = async (values) => {
    try {
      let image = selectedBanner?.image || "";

      if (fileList[0]?.originFileObj) {
        image = await uploadTalentImage(fileList[0].originFileObj);
      }

      const payload = {
        title: values.title,
        keywords: values.keywords,
        image,
        enabled: values.enabled || "FALSE",
        numberOfProducts: Number(values.numberOfProducts || 0),
        createdAt: selectedBanner?.createdAt || new Date().toISOString(),
        creatorID: Number(values.creatorID),
      };

      if (selectedBanner) {
        await axios.put(`${BANNER_BASE_URL}/${selectedBanner.id}`, payload);
        message.success("Banner updated successfully.");
      } else {
        await axios.post(BANNER_BASE_URL, payload);
        message.success("Banner created successfully.");
      }

      setIsModalVisible(false);
      setSelectedBanner(null);
      setFileList([]);
      form.resetFields();
      fetchBanners();
    } catch (error) {
      message.error("Failed to save banner.");
    }
  };

  const handleDeleteBanner = async (id) => {
    try {
      await axios.delete(`${BANNER_BASE_URL}/${id}`);
      message.success("Banner deleted successfully.");
      fetchBanners();
    } catch (error) {
      message.error("Failed to delete banner.");
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-[20px]">
      <div className="flex items-center justify-between">
        <h1 className="font-semibold text-[23px]">App Banner Management</h1>
        <Button
          type="primary"
          onClick={() => {
            setSelectedBanner(null);
            form.resetFields();
            setFileList([]);
            setIsModalVisible(true);
          }}
          style={{ backgroundColor: "var(--primary-color)" }}
        >
          Create Banner
        </Button>
      </div>

      <Table
        dataSource={banners}
        rowKey="id"
        className="admin-table"
        columns={[
          { title: "Title", dataIndex: "title", key: "title" },
          { title: "Keywords", dataIndex: "keywords", key: "keywords" },
          {
            title: "Image",
            dataIndex: "image",
            key: "image",
            render: (image) => (image ? <img src={image} alt="Banner" style={{ maxWidth: 50 }} /> : "N/A"),
          },
          { title: "Enabled", dataIndex: "enabled", key: "enabled" },
          {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
              <>
                <Button
                  size="small"
                  onClick={() => {
                    setSelectedBanner(record);
                    form.setFieldsValue(record);
                    setFileList(
                      record.image
                        ? [{ uid: String(record.id), name: "image", status: "done", url: record.image }]
                        : [],
                    );
                    setIsModalVisible(true);
                  }}
                >
                  Edit
                </Button>
                <Button
                  size="small"
                  danger
                  onClick={() => handleDeleteBanner(record.id)}
                  style={{ marginLeft: 8 }}
                >
                  Delete
                </Button>
              </>
            ),
          },
        ]}
      />

      <UnsupportedFeature
        title="Banner product attachment is not integrated"
        description="The current backend banner module supports banner CRUD, but not the old add-banner-products workflow from the deprecated service."
      />

      <Modal
        title={selectedBanner ? "Update Banner" : "Create Banner"}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleCreateOrUpdateBanner} layout="vertical">
          <Form.Item name="title" label="Title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="keywords" label="Keywords" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Image">
            <Upload
              listType="picture"
              maxCount={1}
              beforeUpload={() => false}
              fileList={fileList}
              onChange={({ fileList: nextFileList }) => setFileList(nextFileList)}
            >
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
          </Form.Item>
          <Form.Item name="creatorID" label="Creator ID" rules={[{ required: true }]}>
            <Select>
              {users.map((user) => (
                <Option key={user.id} value={user.id}>
                  {user.name || user.email} ({user.id})
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="enabled" label="Enabled">
            <Select
              options={[
                { value: "TRUE", label: "TRUE" },
                { value: "FALSE", label: "FALSE" },
              ]}
            />
          </Form.Item>
          <Form.Item name="numberOfProducts" label="Number Of Products">
            <Input type="number" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {selectedBanner ? "Update" : "Create"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </motion.div>
  );
};

export default AppBannerManagement;
