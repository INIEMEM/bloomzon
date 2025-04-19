import React, {useEffect, useState} from 'react';
import { Table, Button, Space, Tag, Modal, Form, Input, Select } from 'antd';
import { motion } from 'framer-motion';
import { PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
const Admins = () => {
  // Sample data based on your API response
  const navigate = useNavigate()
  const admins = [
    {
      id: '1',
      firstname: 'Admin',
      lastname: 'Bloomzon',
      email: 'ugboguj@gmail.com',
      roles: ['super'],
    },
    {
      id: '2',
      firstname: 'Agape',
      lastname: 'Peace',
      email: 'ugboguj@yahoo.com',
      roles: ['seller'],
    },
    {
      id: '3',
      firstname: 'Fix',
      lastname: 'Fixer',
      email: 'ugboguj1@yahoo.com',
      roles: ['guest'],
    },
    {
      id: '4',
      firstname: 'Admin',
      lastname: 'Bloomzon 2',
      email: 'davidiniemem2000@gmail.com',
      roles: ['admin'],
    },
  ];

  // Define columns for the table
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (_, record) => `${record.firstname} ${record.lastname}`,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Roles',
      dataIndex: 'roles',
      key: 'roles',
      render: (roles) => (
        <>
          {roles.map((role) => (
            <Tag color="blue" key={role}>
              {role.toUpperCase()}
            </Tag>
          ))}
        </>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary" danger>
            Ban
          </Button>
          <Button type="default">Suspend</Button>
          <Button type="default">Unban</Button>
          <Button type="default">Activate</Button>
          <Button type="link" onClick={()=> navigate(`/dashboard/others/admins/${record.id}`)}>View Details</Button>
        </Space>
      ),
    },
  ];

  const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingAdmin, setEditingAdmin] = useState(null);
    const [form] = Form.useForm();
    const [roles, setRoles] = useState([]); 

  const handleAddAdmin = () => {
    setEditingAdmin(null);
    form.resetFields(); // Clear the form
    setIsModalVisible(true);
};
const handleDeleteAdmin = async (id) => {
  try {
      await Axios.delete(`YOUR_API_ENDPOINT_FOR_ADMINS/${id}`); // Replace with your API endpoint
      fetchAdmins();
      message.success('Admin deleted successfully.');
  } catch (error) {
      console.error('Error deleting admin:', error);
      message.error('Error deleting admin. Please try again.');
  }
};
const handleModalOk = async () => {
  try {
      const values = await form.validateFields(); // Validate the form
      const url = editingAdmin ? `YOUR_API_ENDPOINT_FOR_ADMINS/${editingAdmin.id}` : 'YOUR_API_ENDPOINT_FOR_ADMINS'; // Replace with your API endpoint
      const method = editingAdmin ? 'put' : 'post';

      await Axios({
          method,
          url,
          data: values, // Send form values to the API
      });

      fetchAdmins();
      message.success('Admin saved successfully.');
      setIsModalVisible(false);
      form.resetFields();
  } catch (errorInfo) {
      console.error('Validate Failed:', errorInfo);
  }
};
const handleModalCancel = () => {
  setIsModalVisible(false);
  setEditingAdmin(null);
  form.resetFields(); // Reset form on cancel
};
const handleEditAdmin = (admin) => {
  setEditingAdmin(admin);
  form.setFieldsValue(admin); // Set form values for editing
  setIsModalVisible(true);
};


  return (
    <motion.div
      style={{ padding: 20 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-justify-between">
        <h2 style={{ marginBottom: 20 }}>Admins List</h2>
        <Button type="primary"  icon={<PlusOutlined />} onClick={handleAddAdmin} style={{ marginBottom: 16, background: 'var(--primary-color)' }}>
                  Add Admin
              </Button>
      </div>
      <Table
        columns={columns}
        dataSource={admins.map((admin) => ({
          ...admin,
          key: admin.id,
        }))}
        pagination={{ pageSize: 5 }}
        className='admin-table'
      />

<Modal
                title={editingAdmin ? 'Edit Admin' : 'Add Admin'}
                visible={isModalVisible}
                onOk={handleModalOk}
                onCancel={handleModalCancel}
            >
                <Form form={form} layout="vertical">
                    <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Please enter email!' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Roles" name="roles" rules={[{ required: true, message: 'Please select roles!' }]}>
                        <Select mode="multiple" placeholder="Select Roles">
                            {roles.map((role) => (
                                <Option key={role} value={role}>{role}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
    </motion.div>
  );
};

export default Admins;
