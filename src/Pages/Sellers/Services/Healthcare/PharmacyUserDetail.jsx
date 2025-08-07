// File: PharmacyUserDetail.jsx
import React, { useState } from 'react';
import { Card, Descriptions, Statistic, Row, Col, Button, Tabs } from 'antd';
import { Bar } from 'react-chartjs-2';
import AddProductModal from './AddProductModal';

const { TabPane } = Tabs;

const PharmacyUserDetail = ({ user }) => {
  const isApproved = user.status === 'Approved';
  const [isAddProductModalVisible, setIsAddProductModalVisible] = useState(false);
  const kpis = [
    { label: 'Total Orders', value: 220 },
    { label: 'Pending Orders', value: 12 },
    { label: 'Total Sales', value: '₦850,000' },
    { label: 'Current Balance', value: '₦125,000' },
    { label: 'Next Payment', value: '₦50,000' },
    { label: 'Customer Rating', value: '4.8 ★' },
    { label: 'Feedbacks', value: 34 },
  ];

  const barChartData = {
    labels: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Monthly Income (₦)',
        backgroundColor: '#1890ff',
        borderRadius: 8,
        data: [50000, 80000, 120000, 100000, 90000, 95000],
      },
    ],
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Pharmacy Details - {user.name}</h2>

      {!isApproved ? (
        <>
          <Card title="Submitted Info" className="mb-6">
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
              <Descriptions.Item label="Pharmacy Licence">
                <img src="/sample_licence.jpg" alt="Pharmacy Licence" className="h-24" />
              </Descriptions.Item>
              <Descriptions.Item label="Certification">
                <img src="/sample_cert.jpg" alt="Certification" className="h-24" />
              </Descriptions.Item>
              <Descriptions.Item label="Task ID">PH123456</Descriptions.Item>
            </Descriptions>
          </Card>

          <Tabs defaultActiveKey="1">
            <TabPane tab="Info" key="1">
              <p>Form for medicine name, brand name, etc.</p>
            </TabPane>
            <TabPane tab="Variation" key="2">
              <p>Form for dosage, form, etc.</p>
            </TabPane>
            <TabPane tab="Seller SKU" key="3">
              <p>Form for price, quantity, region, etc.</p>
            </TabPane>
            <TabPane tab="Gallery" key="4">
              <p>Image upload section.</p>
            </TabPane>
            <TabPane tab="Description" key="5">
              <p>Description and bullet points input.</p>
            </TabPane>
            <TabPane tab="Keywords" key="6">
              <p>Input for keywords.</p>
            </TabPane>
          </Tabs>

          <div className="mt-4 flex justify-end">
            <Button type="primary">Approve Account</Button>
          </div>
        </>
      ) : (
        <>
          <Row gutter={16} className="mb-6">
            {kpis.map((item) => (
              <Col span={8} key={item.label} className="mb-4">
                <Card>
                  <Statistic title={item.label} value={item.value} />
                </Card>
              </Col>
            ))}
          </Row>

          <Card className="mb-6">
            <Bar data={barChartData} />
          </Card>

          <Row gutter={16} className="mb-6">
            <Col span={12}>
              <Button type="primary" className="w-full" onClick={() => setIsAddProductModalVisible(true)}>Add Product</Button>
            </Col>
            <Col span={12}>
              <Button className="w-full">Manage Orders</Button>
            </Col>
          </Row>

          <Card title="Pharmacy Bio & Certification" className="mb-6">
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
              <Descriptions.Item label="Pharmacy Licence">
                <img src="/sample_licence.jpg" alt="Pharmacy Licence" className="h-24" />
              </Descriptions.Item>
              <Descriptions.Item label="Certification">
                <img src="/sample_cert.jpg" alt="Certification" className="h-24" />
              </Descriptions.Item>
              <Descriptions.Item label="Task ID">PH123456</Descriptions.Item>
            </Descriptions>
          </Card>

          <Tabs defaultActiveKey="1">
            <TabPane tab="Info" key="1">
              <p>Form for medicine name, brand name, etc.</p>
            </TabPane>
            <TabPane tab="Variation" key="2">
              <p>Form for dosage, form, etc.</p>
            </TabPane>
            <TabPane tab="Seller SKU" key="3">
              <p>Form for price, quantity, region, etc.</p>
            </TabPane>
            <TabPane tab="Gallery" key="4">
              <p>Image upload section.</p>
            </TabPane>
            <TabPane tab="Description" key="5">
              <p>Description and bullet points input.</p>
            </TabPane>
            <TabPane tab="Keywords" key="6">
              <p>Input for keywords.</p>
            </TabPane>
          </Tabs>

          <div className="mt-4 flex justify-end">
            <Button danger>Suspend Account</Button>
          </div>


        </>
      )}


      <AddProductModal
        visible={isAddProductModalVisible}
        onClose={() => setIsAddProductModalVisible(false)}
        type="pharmacy" 
      /> 
    </div>
  );
};

export default PharmacyUserDetail;
