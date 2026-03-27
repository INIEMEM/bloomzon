import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, DatePicker, Form, Input, Modal, Table, Upload, message } from "antd";
import { motion } from "framer-motion";
import dayjs from "dayjs";
import { UploadOutlined } from "@ant-design/icons";
import { ADMIN_BASE_URL, REGISTRY_BASE_URL } from "../../api/config";
import { uploadTalentImage } from "../../api/uploads";

const GiftAllUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [giftLists, setGiftLists] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [giftListsModalVisible, setGiftListsModalVisible] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [form] = Form.useForm();

  const fetchUsers = async () => {
    const response = await axios.get(`${ADMIN_BASE_URL}/users`, {
      params: { compact: true, role: "all", limit: 200 },
    });
    setUsers(response.data?.data?.items || []);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) =>
    [user.name, user.email, user.phone]
      .join(" ")
      .toLowerCase()
      .includes(searchText.toLowerCase()),
  );

  const showGiftListsModal = async (userId) => {
    try {
      const response = await axios.get(`${REGISTRY_BASE_URL}/registry/`, {
        params: { userId },
      });
      setGiftLists(response.data?.data || []);
      setGiftListsModalVisible(true);
    } catch (error) {
      message.error("Failed to fetch gift lists.");
    }
  };

  const handleAddGiftList = async (values) => {
    try {
      let backgroundImageUrl = values.backgroundImageUrl;

      if (fileList[0]?.originFileObj) {
        backgroundImageUrl = await uploadTalentImage(fileList[0].originFileObj);
      }

      await axios.post(`${REGISTRY_BASE_URL}/create-registry`, {
        ...values,
        ownerId: selectedUserId,
        date: values.date ? dayjs(values.date).format("YYYY-MM-DD") : null,
        backgroundImageUrl,
        selectedGiftsProducts: [],
        giftPurchasedForMe: [],
        giftCardFunds: [],
        thankYouMessage: [],
        category: [],
        tags: values.tags ? values.tags.split(",").map((tag) => tag.trim()) : [],
      });

      message.success("Gift list added successfully.");
      setIsModalVisible(false);
      form.resetFields();
      setFileList([]);
    } catch (error) {
      message.error("Failed to add gift list.");
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-[20px]">
      <Input
        placeholder="Search users..."
        value={searchText}
        onChange={(event) => setSearchText(event.target.value)}
        style={{ marginBottom: 16 }}
      />

      <Table
        className="admin-table"
        dataSource={filteredUsers}
        rowKey="id"
        columns={[
          { title: "ID", dataIndex: "id", key: "id" },
          { title: "Name", dataIndex: "name", key: "name" },
          { title: "Email", dataIndex: "email", key: "email" },
          { title: "Phone", dataIndex: "phone", key: "phone" },
          {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
              <>
                <Button onClick={() => showGiftListsModal(record.id)} style={{ marginRight: 8 }}>
                  View Details
                </Button>
                <Button
                  style={{ background: "var(--primary-color)" }}
                  onClick={() => {
                    setSelectedUserId(record.id);
                    form.setFieldsValue({
                      firstAndLastName: record.name,
                    });
                    setIsModalVisible(true);
                  }}
                  type="primary"
                >
                  Add Gift List
                </Button>
              </>
            ),
          },
        ]}
      />

      <Modal
        title="Add Gift List"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleAddGiftList} layout="vertical">
          <Form.Item name="firstAndLastName" label="First and Last Name">
            <Input />
          </Form.Item>
          <Form.Item name="name" label="Name">
            <Input />
          </Form.Item>
          <Form.Item name="date" label="Date">
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="city" label="City">
            <Input />
          </Form.Item>
          <Form.Item name="state" label="State">
            <Input />
          </Form.Item>
          <Form.Item name="deliveryAddress" label="Delivery Address">
            <Input />
          </Form.Item>
          <Form.Item name="shareMyAddressWithSellers" label="Share My Address With Sellers">
            <Input type="number" />
          </Form.Item>
          <Form.Item name="letAdditionalGiftNotInMyList" label="Let Additional Gifts Not In My List">
            <Input type="number" />
          </Form.Item>
          <Form.Item name="showWhatPeopleHavePurchasedForMe" label="Show Purchases For Me">
            <Input type="number" />
          </Form.Item>
          <Form.Item name="listVisibility" label="List Visibility">
            <Input />
          </Form.Item>
          <Form.Item name="backgroundImageUrl" label="Background Image">
            <Upload
              beforeUpload={() => false}
              fileList={fileList}
              maxCount={1}
              onChange={({ fileList: nextFileList }) => setFileList(nextFileList)}
            >
              <Button icon={<UploadOutlined />}>Select File</Button>
            </Upload>
          </Form.Item>
          <Form.Item name="tags" label="Tags">
            <Input />
          </Form.Item>
          <Form.Item>
            <Button style={{ background: "var(--primary-color)" }} type="primary" htmlType="submit">
              Add Gift List
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Gift Lists"
        open={giftListsModalVisible}
        onCancel={() => setGiftListsModalVisible(false)}
        footer={null}
        width={1000}
      >
        <Table
          className="admin-table"
          dataSource={giftLists}
          rowKey="id"
          columns={[
            { title: "ID", dataIndex: "id", key: "id" },
            { title: "Name", dataIndex: "name", key: "name" },
            { title: "Date", dataIndex: "date", key: "date" },
            { title: "City", dataIndex: "city", key: "city" },
            { title: "State", dataIndex: "state", key: "state" },
          ]}
        />
      </Modal>
    </motion.div>
  );
};

export default GiftAllUsersPage;
