import React, { useEffect, useState, useContext } from "react";
import { Form, Input, Typography, Spin, Row, Col, Card, Divider } from "antd";
import { useParams } from "react-router-dom";
import { MainContext } from "../../Context/Context";
import Axios from "axios";
import { motion } from "framer-motion";

const { Title } = Typography;

const PaymentOptionDetails = () => {
  const { baseUrl, token } = useContext(MainContext);
  const { paymentOptions } = useParams(); // Get payment option ID from URL params
  const [loading, setLoading] = useState(true);
  const [paymentOption, setPaymentOption] = useState(null);

  useEffect(() => {
    const fetchPaymentOptionDetails = async () => {
      try {
        const response = await Axios({
          method: "get",
          url: `${baseUrl}api/v1/paymentoption/one?paymentOptionId=${paymentOptions}`,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPaymentOption(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching payment option details:", error);
        setLoading(false);
      }
    };

    fetchPaymentOptionDetails();
  }, [paymentOptions, baseUrl, token]);

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

  if (!paymentOption) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{ textAlign: "center", padding: "50px" }}
      >
        <Title level={3}>Payment Option Not Found</Title>
      </motion.div>
    );
  }

  const { type, number, name, expiration, cvv, status, createdAt, User } =
    paymentOption;

  return (
    <motion.div
      initial={{ x: -200, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 200, opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{ padding: "20px" }}
    >
      <h1>Payment Option details</h1>
      <Card
        bordered={false}
        style={{
          margin: '20px auto',
          textAlign: 'center',
          padding: '30px',
          borderRadius: '10px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        }}
      >
        <h3 level={4} style={{ marginBottom: "20px" }}>
        Payment Option Details
      </h3>
      <Divider />
      <Form layout="vertical" style={{ maxWidth: "600px", margin: "0 auto" }}>
        <Form.Item label="Type">
          <Input value={type} readOnly />
        </Form.Item>
        <Form.Item label="Name">
          <Input value={name} readOnly />
        </Form.Item>
        <Form.Item label="Number">
          <Input value={number} readOnly />
        </Form.Item>
        <Form.Item label="Expiration">
          <Input value={new Date(expiration).toLocaleDateString()} readOnly />
        </Form.Item>
        <Form.Item label="CVV">
          <Input value={cvv} readOnly />
        </Form.Item>
        <Form.Item label="Status">
          <Input value={status} readOnly />
        </Form.Item>
        <Form.Item label="Created At">
          <Input value={new Date(createdAt).toLocaleString()} readOnly />
        </Form.Item>
      </Form>
      <Divider />
      <Title level={4} style={{ marginTop: "40px", marginBottom: "20px" }}>
        User Details
      </Title>
     
      <Form layout="vertical" style={{ maxWidth: "600px", margin: "0 auto" }}>
        <Form.Item label="First Name">
          <Input value={User.firstname} readOnly />
        </Form.Item>
        <Form.Item label="Last Name">
          <Input value={User.lastname} readOnly />
        </Form.Item>
        <Form.Item label="Email">
          <Input value={User.email} readOnly />
        </Form.Item>
        <Form.Item label="Phone">
          <Input value={User.phone} readOnly />
        </Form.Item>
        <Form.Item label="Role">
          <Input value={User.role} readOnly />
        </Form.Item>
        <Form.Item label="Verified">
          <Input value={User.isVerified ? "Yes" : "No"} readOnly />
        </Form.Item>
      </Form>
      </Card>
      
    </motion.div>
  );
};

export default PaymentOptionDetails;
