import React, { useState, useContext } from 'react';
import { Input, Button, Typography, message, Radio } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import {QRCodeSVG} from 'qrcode.react';
import { motion } from 'framer-motion';
import Axios from 'axios';
import { MainContext } from '../Context/Context';
import UnsupportedFeature from '../Components/UnsupportedFeature/UnsupportedFeature';

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
    message.warning("Two-factor verification is not available on the current backend.");
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
        <UnsupportedFeature
          title="2FA is not wired on this backend"
          description="The admin dashboard no longer calls the obsolete token-validation endpoint."
          note="Login now relies on the server session token returned by /api/auth/login. This screen is kept only so old routes do not hard-fail."
        />

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
