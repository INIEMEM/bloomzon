import React, { useState } from 'react';
import { Button, Card, Tabs, Form, Input, Select, Modal, Rate } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const productSalesData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Product Sales (NGN)',
      data: [500, 800, 650, 900, 750, 1100], // Dummy sales data
      backgroundColor: '#41CCC7',
    },
  ],
};

const productSalesOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: true,
      text: 'Product Sales Performance (Last 6 Months)',
    },
  },
};
const { TabPane } = Tabs;
const { Option } = Select;

const AddGProduct = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState('1');
  const [form] = Form.useForm();
  const [product, setProduct] = useState({
    // Dummy product data
    image: 'https://via.placeholder.com/150',
    name: 'Awesome Backpack',
    description: 'A stylish and durable backpack for all your adventures.',
    category: 'Art & Sewing',
    subCategory: 'Casual Backpacks',
    identifier: 'AB123',
    productId: 'PID456',
    brandName: 'Adventure Gear',
    modelNumber: 'AG-BP-001',
    closureType: 'Zipper',
    outerMaterialType: 'Canvas',
    style: 'Modern',
    gender: 'Unisex',
    numberOfItems: 1,
    strapType: 'Adjustable',
    itemBookingDate: '2025-04-15',
    shippingCountry: 'Nigeria',
    sellerSKU: 'SKU789',
    price: 49.99,
    listPrice: 59.99,
    quantity: 100,
    condition: 'New',
    countryOfOrigin: 'China',
    maximumRentalPrice: null,
    fulfillmentChannel: 'bloomzonship',
  });

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
    setCurrentTab('1');
  };

  const handleTabChange = (key) => {
    setCurrentTab(key);
  };

  const handleNext = () => {
    if (currentTab === '1') {
      form.validateFields(['name', 'description', 'category', 'subCategory']).then(() => {
        setCurrentTab('2');
      }).catch(() => {});
    }
  };

  const handlePrevious = () => {
    setCurrentTab('1');
  };

  const handleAddProduct = () => {
    form.validateFields().then((values) => {
      console.log('Product data to submit:', values);
      setIsModalOpen(false);
      form.resetFields();
      setCurrentTab('1');
      // In a real application, you would send this data to your backend
    }).catch(() => {});
  };

  return (
    <motion.div
      className="p-[20px]"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex justify-end mb-4">
        <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
          Add Product
        </Button>
      </div>

      {/* Display existing product (using a card for representation) */}
      {product && (
        <Card title="Existing Product Info" className="mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div><strong>Image:</strong> <img src={product.image} alt={product.name} className="max-w-[100px]" /></div>
            <div><strong>Name:</strong> {product.name}</div>
            <div><strong>Description:</strong> {product.description}</div>
            <div><strong>Category:</strong> {product.category}</div>
            <div><strong>Sub-Category:</strong> {product.subCategory}</div>
            <div><strong>Identifier:</strong> {product.identifier}</div>
            <div><strong>Product ID:</strong> {product.productId}</div>
            <div><strong>Brand Name:</strong> {product.brandName}</div>
            <div><strong>Model Number:</strong> {product.modelNumber}</div>
            <div><strong>Closure Type:</strong> {product.closureType}</div>
            <div><strong>Outer Material Type:</strong> {product.outerMaterialType}</div>
            <div><strong>Style:</strong> {product.style}</div>
            <div><strong>Gender:</strong> {product.gender}</div>
            <div><strong>Number of Items:</strong> {product.numberOfItems}</div>
            <div><strong>Strap Type:</strong> {product.strapType}</div>
            <div><strong>Item Booking Date:</strong> {product.itemBookingDate}</div>
            <div><strong>Shipping Country:</strong> {product.shippingCountry}</div>
            <div><strong>Seller SKU:</strong> {product.sellerSKU}</div>
            <div><strong>Price:</strong> ${product.price}</div>
            <div><strong>List Price:</strong> ${product.listPrice}</div>
            <div><strong>Quantity:</strong> {product.quantity}</div>
            <div><strong>Condition:</strong> {product.condition}</div>
            <div><strong>Country of Origin:</strong> {product.countryOfOrigin}</div>
            {product.maximumRentalPrice !== null && <div><strong>Maximum Rental Price:</strong> ${product.maximumRentalPrice}</div>}
            <div><strong>Fulfillment Channel:</strong> {product.fulfillmentChannel}</div>
          </div>
          <Bar data={productSalesData} options={productSalesOptions} />
          <Button type="link" className="mt-2">
            See More Details
          </Button>
        </Card>
      )}

      {/* Add Product Modal */}
      <Modal
        title="Add New Product"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        width={800}
      >
        <Form form={form} layout="vertical">
          <Tabs activeKey={currentTab} onChange={handleTabChange}>
            <TabPane tab="Info" key="1">
              <Form.Item
                name="name"
                label="Name"
                rules={[{ required: true, message: 'Please enter product name' }]}
              >
                <Input placeholder="Product Name" />
              </Form.Item>
              <Form.Item
                name="description"
                label="Description"
                rules={[{ required: true, message: 'Please enter product description' }]}
              >
                <Input.TextArea rows={4} placeholder="Product Description" />
              </Form.Item>
              <Form.Item
                name="category"
                label="Category"
                rules={[{ required: true, message: 'Please select category' }]}
              >
                <Select placeholder="Select Category">
                  <Option value="automotive">Automotive</Option>
                  <Option value="artSewing">Art & Sewing</Option>
                  {/* Add more categories */}
                </Select>
              </Form.Item>
              <Form.Item
                name="subCategory"
                label="Sub-Category"
                rules={[{ required: true, message: 'Please select sub-category' }]}
              >
                <Select placeholder="Select Sub-Category">
                  <Option value="cameraBackpacks">Camera Backpacks</Option>
                  <Option value="casualBackpacks">Casual Backpacks</Option>
                  {/* Add more sub-categories */}
                </Select>
              </Form.Item>
              <Form.Item name="identifier" label="Identifier">
                <Input placeholder="Identifier" />
              </Form.Item>
              <Form.Item name="productId" label="Product ID">
                <Input placeholder="Product ID" />
              </Form.Item>
              <Form.Item name="brandName" label="Brand Name">
                <Input placeholder="Brand Name" />
              </Form.Item>
              <Form.Item name="modelNumber" label="Model Number">
                <Input placeholder="Model Number" />
              </Form.Item>
              <Form.Item name="closureType" label="Closure Type">
                <Select placeholder="Select Closure Type">
                  <Option value="buckle">Buckle</Option>
                  <Option value="pushLock">Push Lock</Option>
                  {/* Add more closure types */}
                </Select>
              </Form.Item>
              <Form.Item name="outerMaterialType" label="Outer Material Type">
                <Select placeholder="Select Outer Material Type">
                  <Option value="fauxFur">Faux Fur</Option>
                  <Option value="fauxLeather">Faux Leather</Option>
                  {/* Add more material types */}
                </Select>
              </Form.Item>
              <Form.Item name="style" label="Style">
                <Select placeholder="Select Style">
                  <Option value="antique">Antique</Option>
                  <Option value="eclectic">Eclectic</Option>
                  {/* Add more styles */}
                </Select>
              </Form.Item>
              <Form.Item name="gender" label="Gender">
                <Select placeholder="Select Gender">
                  <Option value="male">Male</Option>
                  <Option value="female">Female</Option>
                  <Option value="unisex">Unisex</Option>
                </Select>
              </Form.Item>
              <Form.Item name="numberOfItems" label="Number of Items">
                <Input type="number" placeholder="Number of Items" />
              </Form.Item>
              <Form.Item name="strapType" label="Strap Type">
                <Input placeholder="Strap Type" />
              </Form.Item>
              <Form.Item name="itemBookingDate" label="Item Booking Date">
                <Input placeholder="YYYY-MM-DD" /> {/* Consider using DatePicker */}
              </Form.Item>
              <Form.Item name="shippingCountry" label="Shipping Country">
                <Input placeholder="Shipping Country" />
              </Form.Item>
              <div className="flex justify-end">
                <Button type="primary" onClick={handleNext}>
                  Next
                </Button>
              </div>
            </TabPane>
            <TabPane tab="Offer" key="2">
              <Form.Item name="sellerSKU" label="Seller SKU">
                <Input placeholder="Seller SKU" />
              </Form.Item>
              <Form.Item
                name="price"
                label="Price"
                rules={[{ required: true, message: 'Please enter the price' }]}
              >
                <Input type="number" placeholder="Price" />
              </Form.Item>
              <Form.Item name="listPrice" label="List Price">
                <Input type="number" placeholder="List Price" />
              </Form.Item>
              <Form.Item
                name="quantity"
                label="Quantity"
                rules={[{ required: true, message: 'Please enter the quantity' }]}
              >
                <Input type="number" placeholder="Quantity" />
              </Form.Item>
              <Form.Item name="condition" label="Condition">
                <Select placeholder="Select Condition">
                  <Option value="new">New</Option>
                  <Option value="used">Used</Option>
                  {/* Add more conditions */}
                </Select>
              </Form.Item>
              <Form.Item name="countryOfOrigin" label="Country of Origin">
                <Input placeholder="Country of Origin" />
              </Form.Item>
              <Form.Item name="maximumRentalPrice" label="Maximum Rental Price">
                <Input type="number" placeholder="Maximum Rental Price (if applicable)" />
              </Form.Item>
              <Form.Item name="fulfillmentChannel" label="Fulfillment Channel">
                <Select placeholder="Select Fulfillment Channel">
                  <Option value="bloomzonship">BloomzonShip</Option>
                  <Option value="bloomzonPickup">Bloomzon Pickup</Option>
                  <Option value="selfShip">Self Ship</Option>
                </Select>
              </Form.Item>
              <div className="flex justify-between">
                <Button onClick={handlePrevious}>Previous</Button>
                <Button type="primary" onClick={handleAddProduct}>
                  Add Product
                </Button>
              </div>
            </TabPane>
          </Tabs>
        </Form>
      </Modal>
    </motion.div>
  );
};

export default AddGProduct;