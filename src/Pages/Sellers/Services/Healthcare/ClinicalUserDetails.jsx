import React, { useState } from 'react';
import {
  Card,
  Descriptions,
  Tabs,
  Statistic,
  Row,
  Col,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Upload,
  message,
  Switch,
  InputNumber
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import AddProductModal from './AddProductModal';
const { TabPane } = Tabs;
const { Option } = Select;

const ClinicUserDetail = ({ user }) => {
  const [isAddProductModalVisible, setIsAddProductModalVisible] = useState(false);

  const [form] = Form.useForm();

  const handleAddProduct = () => {
    form.validateFields().then(values => {
      console.log('Submitted Product:', values);
      message.success('Product added successfully');
      setIsAddProductModalVisible(false);
      form.resetFields();
    });
  };

  const renderTabs = () => (
    <Tabs defaultActiveKey="1">
      <TabPane tab="Info" key="1">
        <Form.Item name="medicineName" label="Medicine Name">
          <Input />
        </Form.Item>
        <Form.Item name="brand" label="Brand">
          <Input />
        </Form.Item>
      </TabPane>
      <TabPane tab="Variation" key="2">
        <Form.Item name="dosage" label="Dosage">
          <Input />
        </Form.Item>
        <Form.Item name="form" label="Form">
          <Select>
            <Option value="tablet">Tablet</Option>
            <Option value="capsule">Capsule</Option>
            <Option value="syrup">Syrup</Option>
          </Select>
        </Form.Item>
      </TabPane>
      <TabPane tab="Seller SKU" key="3">
        <Form.Item name="price" label="Price">
          <Input type="number" />
        </Form.Item>
        <Form.Item name="quantity" label="Quantity">
          <Input type="number" />
        </Form.Item>
        <Form.Item name="condition" label="Condition">
          <Select>
            <Option value="new">New</Option>
            <Option value="used">Used</Option>
          </Select>
        </Form.Item>
      </TabPane>
      <TabPane tab="Gallery" key="4">
        <Form.Item name="images" label="Upload Images">
          <Upload listType="picture" beforeUpload={() => false} multiple>
            <Button icon={<UploadOutlined />}>Upload</Button>
          </Upload>
        </Form.Item>
      </TabPane>
      <TabPane tab="Description" key="5">
        <Form.Item name="description" label="Description">
          <Input.TextArea rows={4} />
        </Form.Item>
      </TabPane>
      <TabPane tab="Keywords" key="6">
        <Form.Item name="keywords" label="Keywords">
          <Input placeholder="Comma separated keywords" />
        </Form.Item>
      </TabPane>
    </Tabs>
  );

  const isApproved = user?.status  ;

  return (
    <div>
      <Card title="Clinic User Details" className="mb-6">
        <Descriptions bordered column={1}>
          <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
          <Descriptions.Item label="Clinic Licence">
            <img src="/sample_clinic_licence.jpg" alt="Clinic Licence" className="h-24" />
          </Descriptions.Item>
          <Descriptions.Item label="Certification">
            <img src="/sample_cert.jpg" alt="Certification" className="h-24" />
          </Descriptions.Item>
          <Descriptions.Item label="Task ID">CL123456</Descriptions.Item>
        </Descriptions>
      </Card>

      { (isApproved === 'Pending') && (
        <>
        <Tabs defaultActiveKey="1">
          <TabPane tab="Info" key="1">
            <Form layout="vertical" form={form} onFinish={handleAddProduct}>
              <Form.Item name="productName" label="Product Name" rules={[{ required: true }]}> <Input /> </Form.Item>
              <Form.Item name="brand" label="Brand" rules={[{ required: true }]}> <Input /> </Form.Item>
              <Form.Item name="category" label="Category" rules={[{ required: true }]}> <Input /> </Form.Item>
              <Form.Item name="prescription" label="Prescription Needed" valuePropName="checked"> <Switch /> </Form.Item>
            </Form>
          </TabPane>
          <TabPane tab="Variation" key="2">
            <Form layout="vertical" form={form} onFinish={handleAddProduct}>
              <Form.Item name="dosage" label="Dosage" rules={[{ required: true }]}> <Input /> </Form.Item>
              <Form.Item name="form" label="Form" rules={[{ required: true }]}> <Input /> </Form.Item>
            </Form>
          </TabPane>
          <TabPane tab="Seller SKU" key="3">
            <Form layout="vertical" form={form} onFinish={handleAddProduct}>
              <Form.Item name="price" label="Price" rules={[{ required: true }]}> <InputNumber min={0} className="w-full" /> </Form.Item>
              <Form.Item name="quantity" label="Quantity" rules={[{ required: true }]}> <InputNumber min={1} className="w-full" /> </Form.Item>
              <Form.Item name="condition" label="Condition" rules={[{ required: true }]}> <Select> <Option value="new">New</Option> <Option value="used">Used</Option> </Select> </Form.Item>
            </Form>
          </TabPane>
          <TabPane tab="Gallery" key="4">
            <Upload
              listType="picture"
              // fileList={fileList}
              // onChange={handleUploadChange}
              beforeUpload={() => false}
            >
              <Button icon={<UploadOutlined />}>Upload Image</Button>
            </Upload>
          </TabPane>
          <TabPane tab="Description" key="5">
            <Form layout="vertical" form={form} onFinish={handleAddProduct}>
              <Form.Item name="description" label="Description" rules={[{ required: true }]}> <Input.TextArea rows={4} /> </Form.Item>
              <Form.Item name="bulletPoints" label="Bullet Points (comma-separated)" rules={[{ required: true }]}> <Input /> </Form.Item>
            </Form>
          </TabPane>
          <TabPane tab="Keywords" key="6">
            <Form layout="vertical" form={form} onFinish={handleAddProduct}>
              <Form.Item name="keywords" label="Keywords" rules={[{ required: true }]}> <Input placeholder="e.g. clinic, health, consultation" /> </Form.Item>
              <Button type="primary" htmlType="submit" className="mt-2">Submit Product</Button>
            </Form>
          </TabPane>
        </Tabs>
        <Button type="primary" className="mt-4"
        //  onClick={handleApprove}
         
         >Approve Clinic</Button>
      </>
      )}

      {(isApproved === "Approved") && (
        <>
          <Row gutter={16} className="mb-6">
            <Col span={6}>
              <Statistic title="Total Appointments" value={128} />
            </Col>
            <Col span={6}>
              <Statistic title="Pending Requests" value={8} />
            </Col>
            <Col span={6}>
              <Statistic title="Total Revenue" value={75000} prefix="₦" />
            </Col>
            <Col span={6}>
              <Statistic title="Rating" value={4.8} suffix="★" />
            </Col>
          </Row>
          <Button danger> Suspend Clinic </Button>
          <Button type="primary" onClick={() => setIsAddProductModalVisible(true)}>
            Add Product
          </Button>
        </>
      )}

      <AddProductModal
        visible={isAddProductModalVisible}
        onClose={() => setIsAddProductModalVisible(false)}
        type="clinic" 
      />    
      {/* <Modal
        title="Add New Product"
        visible={isAddProductModalVisible}
        onCancel={() => setIsAddProductModalVisible(false)}
        onOk={handleAddProduct}
      >
        <Form layout="vertical" form={form}>
          {renderTabs()}
        </Form>
      </Modal> */}
    </div>
  );
};

export default ClinicUserDetail;
