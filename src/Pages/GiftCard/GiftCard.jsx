import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Form, Input, InputNumber, Modal, Select, Table, Upload, message } from "antd";
import { motion } from "framer-motion";
import { UploadOutlined } from "@ant-design/icons";
import { ADMIN_BASE_URL, REGISTRY_BASE_URL } from "../../api/config";
import { uploadTalentImage } from "../../api/uploads";

const GiftCardFundsPage = () => {
  const [giftCardFunds, setGiftCardFunds] = useState([]);
  const [registries, setRegistries] = useState([]);
  const [users, setUsers] = useState([]);
  const [editingGiftCard, setEditingGiftCard] = useState(null);
  const [fundingTarget, setFundingTarget] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isFundingModalVisible, setIsFundingModalVisible] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [form] = Form.useForm();
  const [fundingForm] = Form.useForm();

  const fetchGiftCardFunds = async () => {
    const response = await axios.get(`${REGISTRY_BASE_URL}/GiftCardFundsRandom`);
    setGiftCardFunds(response.data?.results || []);
  };

  const fetchRegistries = async () => {
    const response = await axios.get(`${REGISTRY_BASE_URL}/registry/`);
    setRegistries(response.data?.data || []);
  };

  const fetchUsers = async () => {
    const response = await axios.get(`${ADMIN_BASE_URL}/users`, {
      params: { compact: true, role: "all", limit: 200 },
    });
    setUsers(response.data?.data?.items || []);
  };

  useEffect(() => {
    fetchGiftCardFunds();
    fetchRegistries();
    fetchUsers();
  }, []);

  const handleCreateOrUpdate = async (values) => {
    try {
      let image_url = editingGiftCard?.image_url || "";

      if (fileList[0]?.originFileObj) {
        image_url = await uploadTalentImage(fileList[0].originFileObj);
      }

      const payload = {
        title: values.title,
        goal: values.goal,
        comments: values.comments,
        most_wanted: values.most_wanted || false,
        hide_goal: values.hide_goal || false,
        userId: values.userId,
        registryId: values.registryId,
        amountContributed: values.amountContributed || 0,
        image_url,
      };

      if (editingGiftCard) {
        await axios.put(`${REGISTRY_BASE_URL}/GifCardFunds/update/${editingGiftCard.id}`, payload);
        message.success("Gift card fund updated successfully.");
      } else {
        await axios.post(`${REGISTRY_BASE_URL}/GiftCardFunds/create`, payload);
        message.success("Gift card fund created successfully.");
      }

      setIsModalVisible(false);
      setEditingGiftCard(null);
      setFileList([]);
      form.resetFields();
      fetchGiftCardFunds();
    } catch (error) {
      message.error("Failed to save gift card fund.");
    }
  };

  const handleAddFunds = async (values) => {
    try {
      await axios.post(`${REGISTRY_BASE_URL}/GiftCardFunds/add-funds`, {
        ...values,
        giftCardId: fundingTarget.id,
        registryId: fundingTarget.registryId,
      });
      message.success("Funds added successfully.");
      setIsFundingModalVisible(false);
      setFundingTarget(null);
      fundingForm.resetFields();
    } catch (error) {
      message.error(error?.response?.data?.message || "Failed to add funds.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${REGISTRY_BASE_URL}/GiftCardFunds/delete/${id}`);
      message.success("Gift card fund deleted successfully.");
      fetchGiftCardFunds();
    } catch (error) {
      message.error("Failed to delete gift card fund.");
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-[20px]">
      <Button
        onClick={() => {
          setEditingGiftCard(null);
          form.resetFields();
          setFileList([]);
          setIsModalVisible(true);
        }}
        type="primary"
        style={{ marginBottom: 16, background: "var(--primary-color)" }}
      >
        Create Gift Card Fund
      </Button>

      <Table
        className="admin-table"
        dataSource={giftCardFunds}
        rowKey="id"
        columns={[
          { title: "ID", dataIndex: "id", key: "id" },
          { title: "Title", dataIndex: "title", key: "title" },
          { title: "Goal", dataIndex: "goal", key: "goal" },
          { title: "Comments", dataIndex: "comments", key: "comments" },
          {
            title: "Image",
            dataIndex: "image_url",
            key: "image_url",
            render: (image) => (image ? <img src={image} alt="Gift Card" style={{ maxWidth: 100 }} /> : "N/A"),
          },
          { title: "Amount Contributed", dataIndex: "amountContributed", key: "amountContributed" },
          {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
              <>
                <Button
                  onClick={() => {
                    setEditingGiftCard(record);
                    form.setFieldsValue(record);
                    setFileList(
                      record.image_url
                        ? [{ uid: String(record.id), name: "image", status: "done", url: record.image_url }]
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
                <Button
                  onClick={() => {
                    setFundingTarget(record);
                    fundingForm.resetFields();
                    setIsFundingModalVisible(true);
                  }}
                  style={{ marginLeft: 8, background: "var(--primary-color)" }}
                  type="primary"
                >
                  Add Funds
                </Button>
              </>
            ),
          },
        ]}
      />

      <Modal
        title={editingGiftCard ? "Edit Gift Card Fund" : "Create Gift Card Fund"}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleCreateOrUpdate} layout="vertical">
          <Form.Item name="title" label="Title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="goal" label="Goal" rules={[{ required: true }]}>
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="comments" label="Comments">
            <Input.TextArea />
          </Form.Item>
          <Form.Item name="userId" label="User" rules={[{ required: true }]}>
            <Select
              options={users.map((user) => ({
                value: user.id,
                label: `${user.name || user.email} (${user.id})`,
              }))}
            />
          </Form.Item>
          <Form.Item name="registryId" label="Registry" rules={[{ required: true }]}>
            <Select
              options={registries.map((item) => ({
                value: item.id,
                label: `${item.name} (${item.id})`,
              }))}
            />
          </Form.Item>
          <Form.Item name="amountContributed" label="Amount Contributed">
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item label="Upload Image">
            <Upload
              listType="picture"
              beforeUpload={() => false}
              fileList={fileList}
              maxCount={1}
              onChange={({ fileList: nextFileList }) => setFileList(nextFileList)}
            >
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
          </Form.Item>
          <Form.Item>
            <Button style={{ background: "var(--primary-color)" }} type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Add Funds"
        open={isFundingModalVisible}
        onCancel={() => setIsFundingModalVisible(false)}
        footer={null}
      >
        <Form form={fundingForm} onFinish={handleAddFunds} layout="vertical">
          <Form.Item name="username" label="Username" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="userId" label="User ID" rules={[{ required: true }]}>
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="amountFunded" label="Amount Funded" rules={[{ required: true }]}>
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="profilePic" label="Profile Picture URL">
            <Input />
          </Form.Item>
          <Form.Item name="message" label="Message">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Add Funds
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </motion.div>
  );
};

export default GiftCardFundsPage;
