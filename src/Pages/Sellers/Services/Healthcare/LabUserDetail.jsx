import React from 'react';
import { Card, Row, Col, Typography, Divider, Image, Table, Tag, Descriptions,Button, Space  } from 'antd';

const { Title, Text } = Typography;

const LabUserDetail = ({ isApproved, kpiData, appointments, reports, catalog, registrationData }) => {
  // if (!userData) return null;
  const KPISection = ({ data }) => {
    const { totalRequests, pendingTests, completedTests, earnings } = data;
  
    const stats = [
      { label: 'Total Requests', value: totalRequests },
      { label: 'Pending Tests', value: pendingTests },
      { label: 'Completed Tests', value: completedTests },
      { label: 'Earnings', value: `₦${earnings}` },
    ];
  
    return (
      <Row gutter={16}>
        {stats.map((item, index) => (
          <Col span={6} key={index}>
            <Card>
              <h3 className="text-gray-500">{item.label}</h3>
              <p className="text-xl font-semibold">{item.value}</p>
            </Card>
          </Col>
        ))}
      </Row>
    );
  };
  const AppointmentsTable = ({ data }) => {
    const columns = [
      { title: 'Patient Name', dataIndex: 'name', key: 'name' },
      { title: 'Mode', dataIndex: 'mode', key: 'mode' },
      { title: 'Appointment Date & Time', dataIndex: 'dateTime', key: 'dateTime' },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: (status) => <Tag color={getStatusColor(status)}>{status}</Tag>,
      },
    ];
  
    return <Table title={() => 'Appointments'} dataSource={data} columns={columns} rowKey="id" />;
  };
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'orange';
      case 'inprogress': return 'blue';
      case 'completed': return 'green';
      case 'canceled': return 'red';
      default: return 'gray';
    }
  };
  const PatientReportsTable = ({ data }) => {
    const columns = [
      { title: 'Patient Name', dataIndex: 'name', key: 'name' },
      { title: 'Patient ID', dataIndex: 'patientId', key: 'patientId' },
      { title: 'Test Name', dataIndex: 'testName', key: 'testName' },
      { title: 'Date & Time', dataIndex: 'dateTime', key: 'dateTime' },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: (status) => <Tag color={status === 'completed' ? 'green' : 'orange'}>{status}</Tag>,
      },
    ];
  
    return <Table title={() => 'Patient Reports'} dataSource={data} columns={columns} rowKey="id" />;
  };
  const TestCatalogTable = ({ data }) => {
    const columns = [
      { title: 'Test Name', dataIndex: 'name', key: 'name' },
      {
        title: 'Price',
        dataIndex: 'price',
        key: 'price',
        render: (val) => `₦${val}`,
      },
    ];
  
    return <Table title={() => 'Test Catalog'} dataSource={data} columns={columns} rowKey="id" />;
  };
  const RegistrationDetails = ({ data }) => {
    const { personalInfo, availability, servicePreference } = data;
  
    return (
      <div className="space-y-4">
        <Descriptions title="Personal Info" bordered column={1}>
          {Object.entries(personalInfo).map(([key, val]) => (
            <Descriptions.Item label={formatLabel(key)} key={key}>
              {val}
            </Descriptions.Item>
          ))}
        </Descriptions>
  
        <Descriptions title="Availability Info" bordered column={1}>
          {availability.map((slot, index) => (
            <Descriptions.Item label={`Slot ${index + 1}`} key={index}>
              {slot.date} - {slot.time}
            </Descriptions.Item>
          ))}
        </Descriptions>
  
        <Descriptions title="Service Preference" bordered column={1}>
          <Descriptions.Item label="Break Start Time">{servicePreference.breakStart}</Descriptions.Item>
          <Descriptions.Item label="Break End Time">{servicePreference.breakEnd}</Descriptions.Item>
          <Descriptions.Item label="Mode of Service">{servicePreference.mode}</Descriptions.Item>
        </Descriptions>
      </div>
    );
  };
  
  const formatLabel = (label) =>
    label
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase());
  const UserActionSection = ({ isApproved }) => {
    return (
      <div className="flex justify-end pt-6">
        {isApproved ? (
          <Button type="primary" danger>Suspend User</Button>
        ) : (
          <Space>
            <Button type="primary">Approve</Button>
            <Button danger>Reject</Button>
          </Space>
        )}
      </div>
    );
  };
  // const {
  //   labName,
  //   address,
  //   licenceNumber,
  //   certificationDocument,
  //   breakStart,
  //   breakEnd,
  //   modeOfService,
  //   availabilityDateTime,
  //   profilePicture,
  //   email,
  //   phone,
  // } = userData;

  return (
   <div className="space-y-6">
      {isApproved && <KPISection data={kpiData} />}
      
      <RegistrationDetails data={registrationData} />

      {isApproved && (
        <>
          <Divider />
          <AppointmentsTable data={appointments} />
          <Divider />
          <PatientReportsTable data={reports} />
          <Divider />
          <TestCatalogTable data={catalog} />
        </>
      )}

      <UserActionSection isApproved={isApproved} />
    </div>
  );
};

export default LabUserDetail;
