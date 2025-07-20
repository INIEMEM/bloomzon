import React, { useState, useContext } from 'react';
import { Input, Button, Typography, message, Radio } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import {QRCodeSVG} from 'qrcode.react';
import { motion } from 'framer-motion';
import Axios from 'axios';
import { MainContext } from '../Context/Context';

const { Title, Text } = Typography;

const TwoFactor = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {baseUrl } = useContext(MainContext);
  const { email, base32, otpauth_url } = location.state || {};

  const [code, setCode] = useState('');
  const [method, setMethod] = useState('qr'); // 'qr' or 'manual'
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (!code || code.length !== 6) {
      return message.error('Please enter a valid 6-digit code');
    }

    setLoading(true);
    try {
      const response = await Axios.post(`${baseUrl}auth/validate-token`, {
       
        token: code
      });

      if (response.data?.token) {
        message.success('2FA Verified!');
        // Store token and redirect
        localStorage.setItem('token', response.data.token);
        navigate('/dashboard');
      } else {
        message.error('Invalid code');
      }
    } catch (error) {
      message.error(error?.response?.data?.error || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "-100%" }}
      transition={{ duration: 0.5 }}
      className="flex flex-center min-h-screen bg-gray-100 p-4"
    >
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
        <Title level={3} className="text-center">Two-Factor Authentication</Title>
        <Text>Please complete 2FA using Google Authenticator</Text>

        <Radio.Group
          className="my-4 flex flex-col gap-2"
          onChange={e => setMethod(e.target.value)}
          value={method}
        >
          <Radio value="qr">Scan QR Code</Radio>
          <Radio value="manual">Enter Secret Manually</Radio>
        </Radio.Group>

        {method === 'qr' ? (
          <div className="flex justify-center my-4">
            <QRCodeSVG value={otpauth_url} size={200} />
          </div>
        ) : (
          <div className="my-4">
            <Text className="block mb-2">Manual Secret:</Text>
            <Input value={base32} readOnly />
          </div>
        )}

        <div className="my-4">
          <Text className="block mb-2">Enter 6-digit code:</Text>
          <Input
            placeholder="123456"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
        </div>

        <Button
          type="primary"
          block
          loading={loading}
          onClick={handleVerify}
          className="mt-4"
        >
          Verify
        </Button>
      </div>
    </motion.div>
  );
};

export default TwoFactor;
