import React, { useEffect, useState, useContext } from "react";
import { Form, Input, Button, List, Card, Typography, Spin, Modal, message } from "antd";
import { motion } from "framer-motion";
import { MainContext } from "../../Context/Context";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
const { Title } = Typography;

const MyPaymentOptions = () => {
  const { baseUrl, token } = useContext(MainContext); // Access context values
  const [paymentOptions, setPaymentOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate()
  // Fetch payment options
  useEffect(() => {
    const fetchPaymentOptions = async () => {
      try {
        const response = await Axios({
          method: "get",
          url: `${baseUrl}api/v1/paymentoption/me`,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPaymentOptions(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching payment options:", error);
        if(error?.response?.statusText == "Unauthorized"){
          console.log('just testing')
          navigate('../../')
        }
        setLoading(false);
      }
    };

    fetchPaymentOptions();
  }, [baseUrl, token]);

  // Submit new payment option
  const handleCreatePaymentOption = async (values) => {
    try {
      const response = await Axios({
        method: "post",
        url: `${baseUrl}api/v1/paymentoption/register`,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        data: values,
      });
      setPaymentOptions((prev) => [...prev, response.data.data]); // Add the new payment option
      form.resetFields();
      setModalVisible(false);
    } catch (error) {
      console.error("Error creating payment option:", error);
      message.error(error?.response?.data?.error);
    }
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{ textAlign: "center", padding: "50px" }}
      >
        <Spin size="large" />
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ x: -200, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 200, opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{ padding: "20px" }}
    >
      <Title level={3} style={{ marginBottom: "20px" }}>
        Payment Options
      </Title>

      {/* Payment Options List */}
      <List
        grid={{ gutter: 16, column: 1 }}
        dataSource={paymentOptions}
        renderItem={(item) => (
          <List.Item>
            <Card>
              <p>
                <strong>Type:</strong> {item.type}
              </p>
              <p>
                <strong>Name:</strong> {item.name}
              </p>
              <p>
                <strong>Number:</strong> {item.number}
              </p>
              <p>
                <strong>Expiration:</strong>{" "}
                {new Date(item.expiration).toLocaleDateString()}
              </p>
              <p>
                <strong>Status:</strong> {item.status}
              </p>
            </Card>
          </List.Item>
        )}
      />

      {/* Add New Payment Option */}
      <Button
        type="primary"
        style={{ marginTop: "20px" }}
        onClick={() => setModalVisible(true)}
      >
        Add Payment Option
      </Button>

      {/* Modal for Creating Payment Option */}
      <Modal
        title="Add Payment Option"
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreatePaymentOption}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please enter your name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Number"
            name="number"
            rules={[{ required: true, message: "Please enter card number" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Type"
            name="type"
            rules={[{ required: true, message: "Please select a type" }]}
          >
            <Input placeholder="e.g., wallet, credit" />
          </Form.Item>
          <Form.Item
            label="CVV"
            name="cvv"
            rules={[{ required: true, message: "Please enter CVV" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Expiration Date"
            name="expiration"
            rules={[
              { required: true, message: "Please enter expiration date" },
            ]}
          >
            <Input type="datetime-local" />
          </Form.Item>
          <Form.Item
            label="Duty"
            name="duty"
            rules={[{ required: true, message: "Please specify the duty" }]}
          >
            <Input placeholder="e.g., deposit, withdraw" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </motion.div>
  );
};

export default MyPaymentOptions;
