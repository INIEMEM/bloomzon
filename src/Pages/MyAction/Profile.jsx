import React, { useState, useEffect, useContext } from 'react';
import { Card, Form, Input, Button, notification, Typography, Divider, Spin, Modal } from 'antd';
import { motion } from 'framer-motion';
import Axios from 'axios';
import { MainContext } from '../../Context/Context';
import UserMatrxs from '../../Components/UserMatrixs/UserMatrxs';
import RevenueDisplay from '../../Components/RevenueDisplay/RevenueDisplay';
import { DollarCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const ProfilePage = () => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);
  const { baseUrl, token } = useContext(MainContext);
  const [modalVisible, setModalVisible] = useState(false); // Modal visibility state

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await Axios({
        method: 'get',
        url: `${baseUrl}api/v1/auth/me`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(response.data.data.user);
    } catch (error) {
      notification.error({
        message: 'Error',
        description: 'Failed to fetch profile details.',

      });
      if(error?.response?.statusText == "Unauthorized"){
        navigate('../../')
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const { pin, password } = values;

      await Axios({
        method: 'post',
        url: `${baseUrl}api/v1/auth/settings/add-pin`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: { pin, password },
      });

      notification.success({
        message: 'Success',
        description: 'Transaction PIN set successfully.',
      });
      fetchProfile(); // Refresh user data
      setModalVisible(false); // Close modal after successful request
    } catch (error) {
      notification.error({
        message: 'Error',
        description: `${error?.response?.data?.error}`,

      });
      console.error('error ', error)
    } finally {
      setLoading(false);
    }
  };

  const handleChangePin = async (values) => {
    setLoading(true);
    try {
      const { pin, password, newPin } = values;

      await Axios({
        method: 'post',
        url: `${baseUrl}api/v1/auth/settings/change-pin`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: { pin, password, newPin },
      });

      notification.success({
        message: 'Success',
        description: 'Transaction PIN Changed successfully.',
      });
      
    } catch (error) {
      notification.error({
        message: 'Error',
        description: `${error?.response?.data?.error}`,
      });
      console.error('error ', error)
    } finally {
      setLoading(false);
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{ padding: 20 }}
    >
      <h1>{user?.firstname}'s Profile</h1>
      <div className="flex" style={{ gap: 20 }}>
        <UserMatrxs
          matrix={9049032390}
          title="Wallet Balance"
          icon={<DollarCircleOutlined style={{ fontSize: 40, color: '#41CCC7' }} />}
          border={true}
        />
        <RevenueDisplay revenue={346800} profit={130000} loss={4030.9} />
      </div>
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
        <Title level={3} style={{ marginBottom: 20 }}>
          Profile Information
        </Title>
        <Divider />
        <Spin spinning={loading}>
          <Form
            layout="vertical"
            style={{ textAlign: 'left', paddingLeft: 20 }}
            onFinish={handleChangePin}
          >
            <Form.Item label="Full Name">
              <Input value={`${user.firstname || ''} ${user.lastname || ''}`} disabled />
            </Form.Item>
            <Form.Item label="Email">
              <Input value={user.email || ''} disabled />
            </Form.Item>
            <Form.Item label="Phone">
              <Input value={user.phone || ''} disabled />
            </Form.Item>
            <Form.Item label="Role">
              <Input value={user.role || ''} disabled />
            </Form.Item>
            <Form.Item label="Wallet Balance">
              <Input value={`$${user.wallet || 0}`} disabled />
            </Form.Item>
            <Form.Item label="Referral Code">
              <Input value={user.referralCode || ''} disabled />
            </Form.Item>
            <Form.Item label="Last Active">
              <Input value={user.lastActive ? new Date(user.lastActive).toLocaleString() : ''} disabled />
            </Form.Item>
            <Form.Item label="">
              <Button onClick={() => setModalVisible(true)}>Add Pin</Button>
            </Form.Item>
            <Divider />
            <Title level={4} style={{ marginBottom: 20 }}>
              Manage Transaction PIN
            </Title>
            <Form.Item
              label="Current PIN"
              name="pin"
              rules={[{ required: true, message: 'Please enter your current PIN!' }]}
            >
              <Input.Password maxLength={9} />
            </Form.Item>
            <Form.Item
              label="New PIN (Optional)"
              name="newPin"
              rules={[
                {
                  required: false,
                  message: 'Please enter your new PIN if you want to change it.',
                },
              ]}
            >
              <Input.Password maxLength={4} />
            </Form.Item>
            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: 'Please enter your password!' }]}
            >
              <Input.Password />
            </Form.Item>
            <Button style={{ background: 'var(--primary-color)' }} type="primary" htmlType="submit" block loading={loading}>
              Submit
            </Button>
          </Form>
        </Spin>
      </Card>

      {/* Modal for Adding PIN */}
      <Modal
        title="Add Transaction PIN"
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        destroyOnClose
      >
        <Form onFinish={handleSubmit} layout="vertical">
          <Form.Item
            label="PIN"
            name="pin"
            rules={[{ required: true, message: 'Please enter a PIN!' }]}
          >
            <Input.Password maxLength={9} />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please enter your password!' }]}
          >
            <Input.Password />
          </Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            loading={loading}
          >
            Set PIN
          </Button>
        </Form>
      </Modal>
    </motion.div>
  );
};

export default ProfilePage;
