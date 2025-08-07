// File: CreateUserModal.jsx
import React, { useState } from 'react';
import { Modal, Form, Input, Select, Upload, Button, message, Divider, TimePicker } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const { Option } = Select;
const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const CreateUserModal = ({ open, onClose, onSubmit }) => {
  const [form] = Form.useForm();
  const [userType, setUserType] = useState(null);

  const handleFinish = (values) => {
    message.success('User created successfully');
    onSubmit(values);
    form.resetFields();
    onClose();
  };

  const uploadProps = {
    beforeUpload: () => false, // Prevent auto upload
    multiple: false,
  };

  const renderPharmacyFields = () => (
    <>
    <Divider orientation="left">Personal Info</Divider>
      <Form.Item name="pharmName" label="Pharmacy Name" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="regNo" label="Registration Number" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="phone" label="Phone Number" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      
      <Form.Item name="country" label="Country" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="state" label="State" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="city" label="City" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="country" label="Country" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="street" label="Street Address" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="postalcode" label="Postal Code" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="license" label="License Image" rules={[{ required: true }]}>
        <Upload {...uploadProps}>
          <Button icon={<UploadOutlined />}>Upload License</Button>
        </Upload>
      </Form.Item>
      <Form.Item name="certification" label="Certification" rules={[{ required: true }]}>
        <Upload {...uploadProps}>
          <Button icon={<UploadOutlined />}>Upload Certification</Button>
        </Upload>
      </Form.Item>
      <Form.Item name="taxIdSlip" label="Tax ID Slip" rules={[{ required: true }]}>
        <Upload {...uploadProps}>
          <Button icon={<UploadOutlined />}>Upload Tax ID</Button>
        </Upload>
      </Form.Item>
    </>
  );

  const renderClinicFields = () => (
    <>
      <Form.Item name="license" label="License Document" rules={[{ required: true }]}>
        <Upload {...uploadProps}>
          <Button icon={<UploadOutlined />}>Upload License</Button>
        </Upload>
      </Form.Item>
      <Form.Item name="certification" label="Certification" rules={[{ required: true }]}>
        <Upload {...uploadProps}>
          <Button icon={<UploadOutlined />}>Upload Certification</Button>
        </Upload>
      </Form.Item>
      <Form.Item name="experience" label="Years of Experience" rules={[{ required: true }]}>
        <Input type="number" placeholder="e.g. 5" />
      </Form.Item>
    </>
  );

  const renderLabFields = () => (
    <>
      {/* Optional: Add similar fields here if labs also need uploads */}
      <Divider orientation="left">Personal Info</Divider>
      <Form.Item name="fullName" label="Full Name" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="email" label="Email" rules={[{ required: true }]}>
        <Input type="email" />
      </Form.Item>
      <Form.Item name="phone" label="Phone Number" rules={[{ required: true }]}>
        <Input />
      </Form.Item>

      <Form.Item name="labDetailNote" label="Special Instruction">
        <Input.TextArea placeholder="Optional notes or details..." />
      </Form.Item>
      <Divider orientation="left">Availability</Divider>
      {days.map((day, index) => (
        <Form.Item key={day} label={`${day} (e.g., 09:00 - 17:00)`} name={['availability', index, 'time']}>
          <Input placeholder="09:00 - 17:00" />
        </Form.Item>
      ))}

      <Divider orientation="left">Service Preferences</Divider>
      <Form.Item name="mode" label="Mode" rules={[{ required: true }]}>
        <Select>
          <Option value="lab">Lab</Option>
          <Option value="home">Home Visit</Option>
          <Option value="both">Both</Option>
        </Select>
      </Form.Item>
      <Form.Item name="break" label="Break Time" rules={[{ required: true }]}>
        <TimePicker.RangePicker format="HH:mm" />
      </Form.Item>

    </>
  );

  return (
    <Modal
      title="Create Healthcare User"
      open={open}
      onCancel={onClose}
      footer={null}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{ userType: 'Pharmacy' }}
      >
        <Form.Item
          name="userType"
          label="User Type"
          rules={[{ required: true }]}
        >
          <Select onChange={setUserType}>
            <Option value="Pharmacy">Pharmacy</Option>
            <Option value="Clinic">Clinic</Option>
            <Option value="Laboratory">Laboratory</Option>
          </Select>
        </Form.Item>

        <Form.Item name="name" label="Full Name" rules={[{ required: true }]}>
          <Input placeholder="e.g. MedPlus Pharmacy" />
        </Form.Item>
        <Form.Item name="email" label="Email Address" rules={[{ required: true, type: 'email' }]}>
          <Input placeholder="e.g. contact@medplus.com" />
        </Form.Item>
        <Form.Item name="phone" label="Phone Number" rules={[{ required: true }]}>
          <Input placeholder="e.g. +234..." />
        </Form.Item>

        {/* Conditional form fields */}
        {userType === 'Pharmacy' && renderPharmacyFields()}
        {userType === 'Clinic' && renderClinicFields()}
        {userType === 'Laboratory' && renderLabFields()}

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Create User
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateUserModal;
