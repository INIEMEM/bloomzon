import React from 'react'
import { useState, useContext } from 'react';
import Background from '../../Components/Background/Background';
import { MainContext } from '../../Context/Context';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Input, Button, Typography, message } from 'antd';
import Axios from 'axios';
import { motion } from 'framer-motion';
import cartImage from './assets/ppp.png'

const PasswordReset = () => {
  const [isLoading, setIsLoadind] = useState(false)
  const navigate = useNavigate()
  const {baseUrl} = useContext(MainContext);
  const handlePasswordReset = async (values) => {
    setIsLoadind(true)
    try {
      const response = await Axios({
        method: 'post',
        url: `${baseUrl}api/v1/auth/password-reset`,
        data: {
          token: values.token,
          password: values.password,
          passwordConfirmation: values.passwordConfirmation
        }
      });
      console.log('Login successful:', response.data);
      navigate('../');
      setIsLoadind(false)
    } catch (error) {
      console.error('Login failed:', error );
      message.error('Login Failed')
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
    <div style={{flex: 1}} className='login-container-img flex flex-center'>
          {/* <img src={cartImage} alt="" style={{width:'100%', height:'100%', objectFit: 'cover' }}/> */}
          <div className="blur-glass">
              <h3>
                  "Discover unique, high-quality products at unbeatable prices. Shop now for the best deals and elevate your everyday lifestyle!"
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
    <div style={{position:'relative', flex:1}}>

    {/* <Background/> */}
      <motion.div 
        // initial={{ scale: 0 }}
        // animate={{ scale: 1 }}
        // exit={{ scale: 0 }}
        // transition={{ duration: 0.5 }}
        
        style={{   padding: 20, background: '#fff',zIndex: 3,  }}
        className='login-form-container flex flex-center'
        >
        <div>
        <h1 level={2} style={{ textAlign: 'center' }}> Bloomzon Admin</h1>
        <p style={{ display: 'block', textAlign: 'center', marginBottom: 20 }} className='sub-caption'>
          "Manage your WooCommerce application with ease! Please log in to continue."
        </p>
        <Form
          name="login"
          layout="vertical"
          onFinish={handlePasswordReset}
        >
          <Form.Item
            label="Token"
            name="token"
            rules={[{ required: true, message: 'Please enter your token!' }]}
          >
            <Input placeholder="12345" type="text" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please enter your password!' }]}
          >
            <Input.Password placeholder="Enter your password" />
          </Form.Item>
          <Form.Item
            label="Password Confirmation"
            name="passwordConfirmation"
            rules={[{ required: true, message: 'Please enter your password!' }]}
          >
            <Input.Password placeholder="Enter your password" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={isLoading} block style={{background: '#F67F00', marginTop:20}}>
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

export default PasswordReset