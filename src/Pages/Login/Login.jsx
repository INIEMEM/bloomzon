import { Form, Input, Button, message } from 'antd';
import Axios from 'axios';
import { motion } from 'framer-motion';
import './login.css'
import { useState, useContext } from 'react';
import { MainContext } from '../../Context/MainContext';
import { Link, useNavigate } from 'react-router-dom';
import cartImage from './assets/pp.png'
import { getDefaultAdminPath, getUser, hasAdminAccess, normalizeUser } from '../../api/getUser';
import { AUTH_BASE_URL, cookieSessionToken } from '../../api/config';
import {
  clearPendingTwoFactorChallenge,
  savePendingTwoFactorChallenge,
} from '../../api/authChallenge';

const Login = () => {
  const [isLoading, setIsLoadind] = useState(false)
  const { baseUrl, setToken, setUser, clearToken } = useContext(MainContext);
  const navigate = useNavigate()

  const handleLogin = async (values) => {
    setIsLoadind(true)
    try {
      const response = await Axios({
        method: 'post',
        url: `${AUTH_BASE_URL}/login`,
        withCredentials: true,
        data: {
          email: values.email,
          password: values.password,
          client: 'buyer',
        }
      });
      const data = response.data;

      if (response.status === 202 || data?.data?.require_2fa || data?.require_2fa) {
        setUser({});
        clearToken();
        savePendingTwoFactorChallenge({
          email: data?.data?.email || data?.email || values.email,
          client: data?.data?.client || data?.client || 'buyer',
          redirectTo: '/dashboard',
        });
        message.info(data?.message || 'Two-factor verification required.');
        navigate('/two-factor', {
          replace: true,
          state: {
            email: data?.data?.email || data?.email || values.email,
            client: data?.data?.client || data?.client || 'buyer',
          },
        });
        return;
      }

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

      if (profile && Object.keys(profile).length && hasAdminAccess(profile)) {
        clearPendingTwoFactorChallenge();
        setToken(accessToken || cookieSessionToken);
        setUser(profile);

        message.success(data?.message || "Login successful!");
        navigate(getDefaultAdminPath(profile), { replace: true });
      } else {
        clearPendingTwoFactorChallenge();
        setUser({});
        clearToken();
        message.error(
          "This account is authenticated, but it does not have access to the admin dashboard.",
        );
      }
    } catch (error) {
      console.error('Login failed:', error);
      clearPendingTwoFactorChallenge();
      setUser({});
      clearToken();
      message.error(
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Login failed",
      );
    } finally {
      setIsLoadind(false)
    }
  };

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "-100%" }}
      transition={{ duration: 0.5 }}
      className='login-container flex '>
      <div style={{ flex: 1 }} className='login-container-img flex flex-center'>
        {/* <img src={cartImage} alt="" style={{width:'100%', height:'100%', objectFit: 'cover' }}/> */}
        <div className="blur-glass">
          <h3>
            Discover unique, high-quality products at unbeatable prices. Shop now for the best deals and elevate your everyday lifestyle!
          </h3>
          <div className='blur-glass-image-holder sdfg'>
            <img src={cartImage} alt="" />
          </div>
          <div className='blur-glass-btn'>
            {/*
                  
              <button>Return to home page</button>
              */}
          </div>
          <div className="block1">
            <lord-icon
              src="https://cdn.lordicon.com/mewmkith.json"
              trigger="loop"
              style={{ width: '30px', height: '30px' }}>
            </lord-icon>
          </div>
          <div className="block2">
            <lord-icon
              src="https://cdn.lordicon.com/qwjfapmb.json"
              trigger="loop"
              delay="2500"
              state="morph-open"
              style={{ width: '30px', height: '30px' }}>
            </lord-icon>
          </div>
        </div>
      </div>
      <div style={{ position: 'relative', flex: 1 }}>

        {/* <Background/> */}
        <motion.div
          // initial={{ scale: 0 }}
          // animate={{ scale: 1 }}
          // exit={{ scale: 0 }}
          // transition={{ duration: 0.5 }}

          style={{ padding: 20, background: '#fff', zIndex: 3, }}
          className='login-form-container flex flex-center '
        >
          <div>
            <h1 className='bloom-text font-bold' style={{ textAlign: 'center', }}> Bloomzon Admin</h1>
            <p style={{ display: 'block', textAlign: 'center', marginBottom: 20 }} className='sub-caption'>
              Manage your WooCommerce application with ease! Please log in to continue.
            </p>
            <Form
              name="login"
              layout="vertical"
              onFinish={handleLogin}
            >
              <Form.Item
                label="Email"
                name="email"
                rules={[{ required: true, message: 'Please enter your email!' }]}
              >
                <Input placeholder="Enter your email" type="email" />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                rules={[{ required: true, message: 'Please enter your password!' }]}
              >
                <Input.Password placeholder="Enter your password" />
              </Form.Item>
              <p>Can&apos;t remember your password? <strong style={{ color: '#41CCC7' }}><Link to='../forgot'>Forgot Password</Link></strong></p>
              <Form.Item>
                <Button type="primary" htmlType="submit" loading={isLoading} block style={{ background: 'var(--primary-color)', marginTop: 20 }}>
                  Login
                </Button>
              </Form.Item>
            </Form>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default Login
