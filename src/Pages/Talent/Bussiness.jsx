import React, { useState, useEffect, useContext } from "react";
import { Table, Modal, Button, Form, Input, message } from "antd";
import { MainContext } from "../../Context/Context";
import axios from "axios";
import { motion } from "framer-motion";

const BusinessPage = () => {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [form] = Form.useForm();
  const {baseUrl, token} = useContext(MainContext)
  // const baseurl = "https://api.example.com";

  // Fetch all businesses
  const fetchBusinesses = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${baseUrl}api/v1/business`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBusinesses(data.data);
      console.log('the data gotten >>>', data.data)
    } catch (error) {
      message.error("Failed to fetch businesses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusinesses();
  }, []);

  // Open Modal for Add or Edit
  const handleOpenModal = (business = null) => {
    setIsEdit(!!business);
    setSelectedBusiness(business);
    form.resetFields();
    if (business) {
      form.setFieldsValue(business);
    }
    setIsModalVisible(true);
  };

  // Handle Submit (Add or Edit)
  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      if (isEdit) {
        // Update business
        await axios.put(`${baseUrl}api/v1/business/update`, {
          businessId: selectedBusiness.id,
          ...values,
        }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        message.success("Business updated successfully");
      } else {
        // Add business
        await axios.post(`${baseUrl}api/v1/business/register`, values, {
          headers: { Authorization: `Bearer ${token}` },
        });
        message.success("Business created successfully");
      }
      fetchBusinesses();
      setIsModalVisible(false);
    } catch (error) {
      message.error("Failed to save business");
    } finally {
      setLoading(false);
    }
  };

  // Delete Business
  const handleDelete = async (businessId) => {
    setLoading(true);
    try {
      await axios.delete(`${baseUrl}api/v1/business/remove`, {
        data: { businessId },
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      message.success("Business deleted successfully");
      fetchBusinesses();
    } catch (error) {
      message.error("Failed to delete business");
      console.error('delete', error)
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      style={{padding:20}}
    >
      <div className="flex flex-justify-between flex-align"><h1>Business Management</h1>
      <Button style={{background: 'var(--primary-color)'}}  type="primary" onClick={() => handleOpenModal()}>
        Add Business
      </Button></div>
      <Table
        dataSource={businesses}
        loading={loading}
        rowKey="id"
        columns={[
          { title: "Name", dataIndex: "name", key: "name" },
          { title: "Monthly Subscription", dataIndex: "monthlySubscription", key: "monthlySubscription" },
          { title: "Monthly Subscription Discount", dataIndex: "monthlySubscription", key: "monthlySubscriptionDiscount" },
          { title: "Yearly Subscription", dataIndex: "yearlySubscription", key: "yearlySubscription" },
          { title: "Yearly Subscription Discount", dataIndex: "yearlySubscription", key: "yearlySubscriptionDiscount" },
          {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
              <>
                <Button type="link" onClick={() => handleOpenModal(record)}>
                  Edit
                </Button>
                <Button
                  type="link"
                  danger
                  onClick={() => handleDelete(record.id)}
                >
                  Delete
                </Button>
              </>
            ),
          },
        ]}
        className="admin-table"
      />

      {/* Modal for Add/Edit */}
      <Modal
        title={isEdit ? "Edit Business" : "Add Business"}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => form.submit()}
        confirmLoading={loading}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please enter the name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="monthlySubscription"
            label="Monthly Subscription"
            rules={[{ required: true, message: "Please enter the monthly subscription" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="monthlySubscriptionDiscount"
            label="Monthly Discount"
            rules={[{ required: true, message: "Please enter the discount" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="yearlySubscription"
            label="Yearly Subscription"
            rules={[{ required: true, message: "Please enter the yearly subscription" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="yearlySubscriptionDiscount"
            label="Yearly Discount"
            rules={[{ required: true, message: "Please enter the discount" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </motion.div>
  );
};

export default BusinessPage;
