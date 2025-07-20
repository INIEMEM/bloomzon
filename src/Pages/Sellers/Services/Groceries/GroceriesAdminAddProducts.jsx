import React, { useState } from 'react';
import { Card, Form, Input, InputNumber, Select, Switch, Upload, Button, Table, Tabs, message } from 'antd';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';

const { TabPane } = Tabs;

const dummyGroceries = [
  { key: '1', name: 'Happy Belly Juice', category: 'Drinks', price: 1200, stock: 100, fbb: true },
];

const AdminGroceriesManagement = () => 
  {
  const [form] = Form.useForm();
  const [groceries, setGroceries] = useState(dummyGroceries);

  const onFinish = (values) => {
    const newItem = {
      key: Date.now().toString(),
      ...values,
    };
    setGroceries([...groceries, newItem]);
    message.success('Product added successfully!');
    form.resetFields();
  };

  const columns = [
    { title: 'Name', dataIndex: 'name' },
    { title: 'Category', dataIndex: 'category' },
    { title: 'Price', dataIndex: 'price', render: val => `₦${val}` },
    { title: 'Stock', dataIndex: 'stock' },
    { title: 'FBB', dataIndex: 'fbb', render: val => val ? 'Yes' : 'No' },
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Admin Product Management</h2>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Groceries" key="1">
          <Card title="Add New Grocery Item" className="mb-6">
            <Form form={form} layout="vertical" onFinish={onFinish}>
              <Form.Item name="name" label="Product Name" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item name="category" label="Category" rules={[{ required: true }]}>
                <Select>
                  <Select.Option value="Snacks">Snacks</Select.Option>
                  <Select.Option value="Drinks">Drinks</Select.Option>
                  <Select.Option value="Pantry">Pantry</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item name="price" label="Price" rules={[{ required: true }]}>
                <InputNumber className="w-full" />
              </Form.Item>
              <Form.Item name="stock" label="Stock Quantity" rules={[{ required: true }]}>
                <InputNumber className="w-full" />
              </Form.Item>
              <Form.Item name="brand" label="Brand">
                <Input />
              </Form.Item>
              <Form.Item name="fbb" label="Fulfilled by Bloomzon" valuePropName="checked">
                <Switch />
              </Form.Item>
              <Form.Item name="image" label="Image">
                <Upload beforeUpload={() => false}>
                  <Button icon={<UploadOutlined />}>Upload</Button>
                </Upload>
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" icon={<PlusOutlined /> } style={{background: 'var(--primary-color)'}}>
                  Add Product
                </Button>
              </Form.Item>
            </Form>
          </Card>

          <Card title="Existing Products">
            <Table dataSource={groceries} columns={columns} className='admin-table'/>
          </Card>
        </TabPane>
        <TabPane tab="Orders" key="2">
  <Card title="Customer Orders">
    <Table
      dataSource={[
        { key: '1', orderId: 'ORD1234', product: 'Happy Belly Juice', quantity: 2, status: 'Pending' },
      ]}
      columns={[
        { title: 'Order ID', dataIndex: 'orderId' },
        { title: 'Product', dataIndex: 'product' },
        { title: 'Qty', dataIndex: 'quantity' },
        { title: 'Status', dataIndex: 'status' },
      ]}

      className='admin-table'
    />
  </Card>
</TabPane>

        <TabPane tab="Inventory" key="3">
  <Card title="Inventory Overview">
    <Table
      dataSource={groceries}
      columns={[
        { title: 'Product', dataIndex: 'name' },
        { title: 'Stock', dataIndex: 'stock' },
        {
          title: 'Restock',
          render: (_, record) => (
            <Button onClick={() => message.info(`Restock ${record.name}`)}>Restock</Button>
          ),
        },
      ]}
      className='admin-table'
    />
  </Card>
</TabPane>
<TabPane tab="Returns" key="4">
  <Card title="Return Requests">
    <Table
      dataSource={[
        { key: '1', product: 'Happy Belly Juice', reason: 'Damaged item', status: 'Pending' },
      ]}
      columns={[
        { title: 'Product', dataIndex: 'product' },
        { title: 'Reason', dataIndex: 'reason' },
        { title: 'Status', dataIndex: 'status' },
        {
          title: 'Action',
          render: () => (
            <>
              <Button type="primary" className="mr-2">Approve</Button>
              <Button danger>Reject</Button>
            </>
          ),
        },
      ]}
      className='admin-table'
    />
  </Card>
</TabPane>
</Tabs>
</div>
)
}

export default AdminGroceriesManagement;

