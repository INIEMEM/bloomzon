import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, Col, Row, Statistic, Table, Image, Button, Modal, Form, Input, InputNumber, Select, Upload, Tag, message } from 'antd'
import { PlusOutlined, EyeOutlined, StopOutlined } from '@ant-design/icons'
const { Option } = Select;
const userProducts = [
  {
    id: 'p001',
    name: 'Classic Pepperoni Pizza',
    category: 'Pizza',  
    cuisine: 'Italian',
    variations: {
      size: {
        small: 1500,
        medium: 2500,
        large: 3500,
      },
      crustType: 'Thin Crust',
      toppings: ['Pepperoni', 'Mozzarella', 'Basil']
    },
    sellerSKU: 'SKU-P001',
    yourPrice: 2300,
    listPrice: 2500,
    quantity: 20,
    condition: 'New',
    country: 'Nigeria',
    maxRetailPrice: 2700,
    fulfillment: 'Door Delivery',
    images: [
      'https://example.com/images/pizza1.jpg',
      'https://example.com/images/pizza2.jpg',
    ],
    description: 'A delicious pepperoni pizza made with premium mozzarella and a crispy thin crust.',
    keywords: ['pizza', 'pepperoni', 'cheese', 'thin crust'],
    dateAdded: '2025-07-28',
    lastUpdated: '2025-07-30',
  },
  {
    id: 'p002',
    name: 'Jollof Rice Combo',
    category: 'Main Dish',
    cuisine: 'Nigerian',
    variations: {
      size: {
        small: 1000,
        medium: 1500,
        large: 2000,
      },
      crustType: null,
      toppings: ['Chicken', 'Plantain']
    },
    sellerSKU: 'SKU-P002',
    yourPrice: 1800,
    listPrice: 2000,
    quantity: 50,
    condition: 'New',
    country: 'Nigeria',
    maxRetailPrice: 2200,
    fulfillment: 'Pickup',
    images: [
      'https://example.com/images/jollof1.jpg',
      'https://example.com/images/jollof2.jpg',
    ],
    description: 'Spicy Nigerian Jollof rice served with grilled chicken and fried plantain.',
    keywords: ['jollof', 'rice', 'nigerian', 'chicken'],
    dateAdded: '2025-07-25',
    lastUpdated: '2025-07-29',
  },
  {
    id: 'p003',
    name: 'Chicken Shawarma',
    category: 'Snacks',
    cuisine: 'Middle Eastern',
    variations: {
      size: {
        small: 800,
        medium: 1200,
        large: 1600,
      },
      crustType: null,
      toppings: ['Garlic Sauce', 'Lettuce']
    },
    sellerSKU: 'SKU-P003',
    yourPrice: 1100,
    listPrice: 1300,
    quantity: 35,
    condition: 'New',
    country: 'Nigeria',
    maxRetailPrice: 1500,
    fulfillment: 'Door Delivery',
    images: [
      'https://example.com/images/shawarma1.jpg',
    ],
    description: 'Juicy chicken shawarma rolled in soft pita bread with garlic sauce and fresh vegetables.',
    keywords: ['shawarma', 'chicken', 'garlic sauce'],
    dateAdded: '2025-07-26',
    lastUpdated: '2025-07-31',
  }
];

const FoodUserDetails = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProductViewOpen, setIsProductViewOpen] = useState(false);
  const [form] = Form.useForm();
  const [userStatus, setUserStatus] = useState('Active');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const toggleUserStatus = () => {
    const newStatus = userStatus === 'Active' ? 'Suspended' : 'Active';
    setUserStatus(newStatus);
    message.success(`User is now ${newStatus}`);
  }

  const viewProduct = (product) => {
    setSelectedProduct(product);
    setIsProductViewOpen(true);
  }

  const takeDownProduct = (productId) => {
    message.warning(`Product ID ${productId} has been taken down.`);
    // You can update local state or call an API here
    setIsProductViewOpen(false);
  }

  const handleSubmit = (values) => {
    console.log('Submitted Product:', values);
    setIsModalOpen(false);
    form.resetFields();
  };
  return (
    <motion.div className='p-4' initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <Row gutter={16}>
        <Col span={6}><Card><Statistic title="Total Orders" value={512} /></Card></Col>
        <Col span={6}><Card><Statistic title="Today's Sales" value="₦42,000" /></Card></Col>
        <Col span={6}><Card><Statistic title="Today Units" value={124} /></Card></Col>
        <Col span={6}><Card><Statistic title="Balance" value="₦85,000" /></Card></Col>
      </Row>

      <Row gutter={16} className="mt-4">
        <Col span={6}><Card><Statistic title="Next Payment" value="₦15,000" /></Card></Col>
        <Col span={6}><Card><Statistic title="Customer Rating" value={4.5} suffix="/5" /></Card></Col>
        <Col span={6}><Card><Statistic title="Seller Reviews" value="213 Reviews" /></Card></Col>
        <Col span={6}>
          <Card>
            <div className="flex justify-between items-center">
              <Statistic title="User Status" value={userStatus} />
              <Button
                danger={userStatus === 'Active'}
                type="primary"
                onClick={toggleUserStatus}
              >
                {userStatus === 'Active' ? 'Suspend' : 'Activate'}
              </Button>
            </div>
          </Card>
        </Col>
      </Row>
      <div className="flex justify-end mt-6">
      <Button type="primary" onClick={() => setIsModalOpen(true)}>
          Create Product
        </Button>
      </div>

      <Table
        className='admin-table mt-4'
        rowKey="id"
        columns={[
          { title: 'Product Name', dataIndex: 'name', key: 'name' },
          { title: 'Category', dataIndex: 'category', key: 'category' },
          { title: 'Cuisine Type', dataIndex: 'cuisine', key: 'cuisine' },
          { title: 'Quantity', dataIndex: 'quantity', key: 'quantity' },
          { title: 'Fulfillment Channel', dataIndex: 'fulfillment', key: 'fulfillment' },
          {
            title: 'Image',
            key: 'image',
            render: (_, record) => (
              <Image.PreviewGroup>
                {record.images.map((img, i) => (
                  <Image key={i} width={50} src={img} />
                ))}
              </Image.PreviewGroup>
            ),
          },
          {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
              <Button icon={<EyeOutlined />} onClick={() => viewProduct(record)}>
                View
              </Button>
            ),
          },
        ]}
        dataSource={userProducts}
      />
     <Modal
        title={selectedProduct?.name}
        open={isProductViewOpen}
        onCancel={() => setIsProductViewOpen(false)}
        footer={[
          <Button key="close" onClick={() => setIsProductViewOpen(false)}>Close</Button>,
          <Button key="takeDown" type="primary" danger icon={<StopOutlined />} onClick={() => takeDownProduct(selectedProduct?.id)}>
            Take Down
          </Button>,
        ]}
        width={700}
      >
        {selectedProduct && (
          <>
            <p><strong>Category:</strong> {selectedProduct.category}</p>
            <p><strong>Cuisine:</strong> {selectedProduct.cuisine}</p>
            <p><strong>Description:</strong> {selectedProduct.description}</p>
            <p><strong>Price (Medium):</strong> ₦{selectedProduct.variations?.size?.medium}</p>
            <p><strong>SKU:</strong> {selectedProduct.sellerSKU}</p>
            <p><strong>Country:</strong> {selectedProduct.country}</p>
            <p><strong>Keywords:</strong> {selectedProduct.keywords.map((k, i) => (
              <Tag key={i}>{k}</Tag>
            ))}</p>
            <p><strong>Images:</strong></p>
            <div className="flex gap-2">
              {selectedProduct.images.map((img, i) => (
                <Image key={i} width={80} src={img} />
              ))}
            </div>
          </>
        )}
      </Modal>
    <Modal
        title="Create Product"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={800}
      >
        <Form layout="vertical" form={form} onFinish={handleSubmit}>
          <Form.Item name="name" label="Product Name"><Input /></Form.Item>

          <Form.Item name="category" label="Product Category">
            <Select>
              <Option value="drinks">Drinks</Option>
              <Option value="pizza">Pizza</Option>
              <Option value="snacks">Snacks</Option>
            </Select>
          </Form.Item>

          <Form.Item name="cuisine" label="Cuisine Type"><Input /></Form.Item>

          <Form.Item label="Variations">
            <div className="grid grid-cols-3 gap-2">
              <Form.Item name="sizeSmall" label="Small Size"><Input placeholder="₦1000" /></Form.Item>
              <Form.Item name="sizeMedium" label="Medium Size"><Input placeholder="₦1500" /></Form.Item>
              <Form.Item name="sizeLarge" label="Large Size"><Input placeholder="₦2000" /></Form.Item>
            </div>
            <Form.Item name="crustType" label="Crust Type"><Input /></Form.Item>
            <Form.Item name="toppings" label="Toppings">
              <Select mode="tags" placeholder="e.g. cheese, bacon" />
            </Form.Item>
          </Form.Item>

          <Form.Item name="sellerSKU" label="Seller SKU"><Input /></Form.Item>
          <Form.Item name="yourPrice" label="Your Price">
            <InputNumber style={{ width: '100%' }} formatter={val => `₦${val}`} />
          </Form.Item>
          <Form.Item name="listPrice" label="List Price">
            <InputNumber style={{ width: '100%' }} formatter={val => `₦${val}`} />
          </Form.Item>
          <Form.Item name="quantity" label="Quantity"><InputNumber style={{ width: '100%' }} /></Form.Item>

          <Form.Item name="condition" label="Condition">
            <Select>
              <Option value="new">New</Option>
              <Option value="used">Used</Option>
            </Select>
          </Form.Item>

          <Form.Item name="country" label="Country"><Input /></Form.Item>
          <Form.Item name="mrp" label="Maximum Retail Price"><InputNumber style={{ width: '100%' }} /></Form.Item>

          <Form.Item name="fulfillment" label="Fulfillment Channel">
            <Select>
              <Option value="door">Door Delivery</Option>
              <Option value="pickup">Pickup</Option>
            </Select>
          </Form.Item>

          <Form.Item name="images" label="Product Images">
            <Upload listType="picture-card" multiple>
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            </Upload>
          </Form.Item>

          <Form.Item name="description" label="Product Description">
            <Input.TextArea rows={4} />
          </Form.Item>

          <Form.Item name="keywords" label="Product Keywords">
            <Select mode="tags" placeholder="Add product keywords" />
          </Form.Item>

          <div className="flex justify-end">
            <Button onClick={() => setIsModalOpen(false)} className="mr-2">Cancel</Button>
            <Button type="primary" htmlType="submit">Create Product</Button>
          </div>
        </Form>
      </Modal>
    </motion.div>
  )
}

export default FoodUserDetails