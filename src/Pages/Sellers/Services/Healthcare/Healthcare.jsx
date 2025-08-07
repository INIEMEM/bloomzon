// File: AdminUserDashboard.jsx
import React, { useState } from 'react';
import { Tabs, Card, Statistic, Table, Input, Button, Tag, Space, Modal } from 'antd';
import { motion } from 'framer-motion';
import { SearchOutlined } from '@ant-design/icons';
import PharmacyUserDetail from './PharmacyUserDetail';
import ClinicUserDetail from './ClinicalUserDetails';
import LabUserDetail from './LabUserDetail';
// import CreateUserForm from './CreateUserForm';
import CreateUserModal from './CreateUserForm';

const { TabPane } = Tabs;

const userKPIs = [
  { title: 'Total Users', value: 2312 },
  { title: 'Active Pharmacies', value: 183 },
  { title: 'Clinics Approved', value: 92 },
  { title: 'Labs Approved', value: 56 },
];

const userTypes = [
  { type: 'Pharmacy', key: 'pharmacies' },
  { type: 'Clinic', key: 'clinics' },
  { type: 'Laboratory', key: 'labs' },
  { type: 'Health & Wellness Vendors', key: 'wellness' },
];

const sampleUsers = [
  { key: 1, name: 'Bloom Pharmacy', email: 'bloom@pharm.com', status: 'Pending', userType: 'Pharmacy' },
  { key: 2, name: 'Lifeline Clinic', email: 'doc@lifeline.com', status: 'Approved', userType: 'Clinic' },
  { key: 3, name: 'AccuLab Diagnostics', email: 'lab@acculab.com', status: 'Approved', userType: 'Laboratory' },
];

const HealthCareUserManagement = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newUserType, setNewUserType] = useState(null);
  const [createUserOpen, setCreateUserOpen] = useState(false);
  const handleView = (user) => {
    setSelectedUser(user);
    setOpenModal(true);
  };

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => <Tag color={status === 'Approved' ? 'green' : 'orange'}>{status}</Tag>,
    },
    {
      title: 'User Type',
      dataIndex: 'userType',
      key: 'userType',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => handleView(record)}>View</Button>
          <Button danger type="link">Delete</Button>
        </Space>
      ),
    },
  ];

  return (
    <motion.div
      className="p-6 bg-white rounded-xl shadow-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-2xl font-bold mb-4">User Management</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {userKPIs.map((item) => (
          <Card key={item.title} className="text-center">
            <Statistic title={item.title} value={item.value} />
          </Card>
        ))}
      </div>

      <Tabs defaultActiveKey="pharmacies">
        {userTypes.map(({ key, type }) => (
          <TabPane tab={type} key={key}>
            <div className="flex justify-between mb-4">
              <Input
                placeholder={`Search ${type}`}
                prefix={<SearchOutlined />}
                className="max-w-sm"
              />
              <Button type="primary"
                onClick={() => setCreateUserOpen(true)}
              >Create User</Button>
            </div>
            <Table
              dataSource={sampleUsers.filter(user => user.userType.toLowerCase().includes(type.toLowerCase()))}
              columns={columns}
              pagination={{ pageSize: 5 }}
            />
          </TabPane>
        ))}
      </Tabs>

      <Modal
        open={openModal}
        onCancel={() => setOpenModal(false)}
        footer={null}
        width={1000}
      >
        {selectedUser?.userType === 'Pharmacy' && (
          <PharmacyUserDetail user={selectedUser} />
        )}
        {selectedUser?.userType === 'Clinic' && (
          <ClinicUserDetail user={selectedUser} />
        )}
         {selectedUser?.userType === 'Laboratory' && (
          <LabUserDetail 
          
          isApproved={selectedUser.status === 'Approved'}
          kpiData={{
            totalRequests: 120,
            pendingTests: 20,
            completedTests: 90,
            earnings: 150000,
          }}
          appointments={[
            {
              id: 1,
              name: 'John Doe',
              mode: 'lab',
              dateTime: '2025-08-01 09:00 AM',
              status: 'pending',
            },
            {
              id: 2,
              name: 'Jane Smith',
              mode: 'home visit',
              dateTime: '2025-08-02 11:00 AM',
              status: 'completed',
            },
          ]}
          reports={[
            {
              id: 1,
              name: 'John Doe',
              patientId: 'P001',
              testName: 'COVID-19 PCR',
              dateTime: '2025-08-01 10:00 AM',
              status: 'pending',
            },
            {
              id: 2,
              name: 'Jane Smith',
              patientId: 'P002',
              testName: 'Blood Panel',
              dateTime: '2025-08-02 01:00 PM',
              status: 'completed',
            },
          ]}
          catalog={[
            { id: 1, name: 'Malaria Test', price: 5000 },
            { id: 2, name: 'HIV Test', price: 7000 },
          ]}
          registrationData={{
            personalInfo: {
              fullName: selectedUser.name,
              email: selectedUser.email,
              phone: '+2348012345678',
            },
            availability: [
              { date: 'Monday', time: '09:00 - 17:00' },
              { date: 'Wednesday', time: '10:00 - 16:00' },
            ],
            servicePreference: {
              breakStart: '1:00 PM',
              breakEnd: '2:00 PM',
              mode: 'lab',
            },
          }}
          />
        )}
      </Modal>


<CreateUserModal
  open={createUserOpen}
  onClose={() => setCreateUserOpen(false)}
  onSubmit={(newUserData) => {
    console.log('User Created:', newUserData);
    // You can also update your user list or send to backend here.
  }}
/>
      
    </motion.div>
  );
};

export default HealthCareUserManagement;
