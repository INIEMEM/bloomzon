import React, { useContext, useEffect, useState } from 'react';
import { Alert, Button, Input, Typography, message } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Axios from 'axios';
import { MainContext } from '../Context/MainContext';
import { AUTH_BASE_URL, cookieSessionToken } from '../api/config';
import {
  getDefaultAdminPath,
  getUser,
  hasAdminAccess,
  normalizeUser,
} from '../api/getUser';
import {
  clearPendingTwoFactorChallenge,
  readPendingTwoFactorChallenge,
  savePendingTwoFactorChallenge,
} from '../api/authChallenge';

const { Title, Text } = Typography;

const TwoFactor = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { baseUrl, setToken, setUser, clearToken } = useContext(MainContext);
  const [challenge, setChallenge] = useState(() => {
    const pendingChallenge = readPendingTwoFactorChallenge();

    if (location.state?.email) {
      return {
        email: location.state.email,
        client: location.state.client || 'buyer',
        redirectTo: pendingChallenge?.redirectTo || '/dashboard',
      };
    }

    return pendingChallenge;
  });

  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!location.state?.email) {
      return;
    }

    const nextChallenge = {
      email: location.state.email,
      client: location.state.client || 'buyer',
      redirectTo: '/dashboard',
    };

    setChallenge(nextChallenge);
    savePendingTwoFactorChallenge(nextChallenge);
  }, [location.state]);

  const handleVerify = async () => {
    if (!challenge?.email) {
      setError('Your login session has expired. Start again from the login screen.');
      return;
    }

    if (!/^\d{6}$/.test(code.trim())) {
      setError('Enter the 6-digit verification code sent to your email.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const response = await Axios.post(
        `${AUTH_BASE_URL}/login-2fa`,
        {
          email: challenge.email,
          otp: code.trim(),
          client: challenge.client || 'buyer',
        },
        { withCredentials: true },
      );

      const data = response.data;
      const accessToken =
        data?.accessToken ||
        data?.token ||
        data?.access_token ||
        data?.jwt ||
        data?.data?.accessToken ||
        data?.data?.token ||
        data?.data?.access_token ||
        data?.data?.jwt;
      const responseUser =
        data?.userInfo ||
        data?.user ||
        data?.data?.userInfo ||
        data?.data?.user ||
        data?.data;

      const profile = responseUser
        ? normalizeUser({
            ...responseUser,
            role:
              data?.role ||
              data?.data?.role ||
              responseUser.role ||
              responseUser.userRole ||
              responseUser.user_role,
            roles: data?.roles || data?.data?.roles || responseUser.roles,
            permissions:
              data?.permissions ||
              data?.data?.permissions ||
              responseUser.permissions,
            isAdmin:
              data?.isAdmin || data?.data?.isAdmin || responseUser.isAdmin,
            is_admin:
              data?.is_admin || data?.data?.is_admin || responseUser.is_admin,
          })
        : await getUser(baseUrl, accessToken);

      if (!hasAdminAccess(profile)) {
        clearPendingTwoFactorChallenge();
        clearToken();
        setUser({});
        setError('This account is authenticated, but it does not have admin access.');
        return;
      }

      clearPendingTwoFactorChallenge();
      setToken(accessToken || cookieSessionToken);
      setUser(profile);
      message.success(data?.message || '2FA login successful.');
      navigate(getDefaultAdminPath(profile), { replace: true });
    } catch (verificationError) {
      setError(
        verificationError?.response?.data?.message ||
          verificationError?.message ||
          'Two-factor verification failed.',
      );
    } finally {
      setLoading(false);
    }
  };

  const handleStartAgain = () => {
    clearPendingTwoFactorChallenge();
    clearToken();
    setUser({});
    navigate('/', { replace: true });
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
        <Text>
          An email verification code was sent to {challenge?.email || 'your inbox'}.
        </Text>
        {error ? (
          <Alert
            showIcon
            type="error"
            message={error}
            style={{ marginTop: 16, marginBottom: 16 }}
          />
        ) : null}

        <div className="my-4">
          <Text className="block mb-2">Enter 6-digit code:</Text>
          <Input
            placeholder="123456"
            maxLength={6}
            value={code}
            onChange={(e) => {
              setCode(e.target.value.replace(/\D/g, '').slice(0, 6));
              if (error) {
                setError('');
              }
            }}
            onPressEnter={handleVerify}
          />
        </div>

        <div className="flex flex-column gap-2 mt-4">
          <Button
            type="primary"
            block
            loading={loading}
            onClick={handleVerify}
          >
            Verify
          </Button>
          <Button block onClick={handleStartAgain}>
            Return to login
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default TwoFactor;
