import React, { useState } from 'react'
import { Tabs, Table, Card, Statistic, Button, Modal, Form, Input, Select, Upload, Switch, Radio, Row, Col } from 'antd';
import { motion } from 'framer-motion';
const { TabPane } = Tabs;
const { Option } = Select;
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';

const dummyListings = [
  {
    key: '1',
    title: 'Dell XPS 13',
    brand: 'Dell',
    model: 'XPS 13 9310',
    ram: '16GB',
    storage: '512GB SSD',
    processor: 'Intel i7 11th Gen',
    graphics: 'Intel Iris Xe',
    screenSize: '13.4 inches',
    batteryCondition: 'Good',
    purchaseYear: '2022',
    warrantyRemaining: '6 months',
    price: '900',
    shipNationwide: true,
    packageSize: 'small',
    condition: 'Used - Like New',
    sold: false,
    photos: [
      {
        uid: '1',
        name: 'xps-front.jpg',
        url: 'https://via.placeholder.com/200x150?text=XPS+Front',
      },
      {
        uid: '2',
        name: 'xps-side.jpg',
        url: 'https://via.placeholder.com/200x150?text=XPS+Side',
      },
    ],
  },
  {
    key: '2',
    title: 'MacBook Pro M1',
    brand: 'Apple',
    model: 'MacBook Pro 13-inch M1',
    ram: '8GB',
    storage: '256GB SSD',
    processor: 'Apple M1',
    graphics: 'Integrated Apple GPU',
    screenSize: '13.3 inches',
    batteryCondition: 'Excellent',
    purchaseYear: '2021',
    warrantyRemaining: 'Expired',
    price: '1100',
    shipNationwide: false,
    packageSize: 'medium',
    condition: 'Used - Excellent',
    sold: true,
    buyer: 'John Doe',
    boughtPrice: '1050',
    photos: [
      {
        uid: '3',
        name: 'mac-front.jpg',
        url: 'https://via.placeholder.com/200x150?text=Mac+Front',
      },
      {
        uid: '4',
        name: 'mac-keyboard.jpg',
        url: 'https://via.placeholder.com/200x150?text=Mac+Keyboard',
      },
    ],
  },
];


const dummyOffers = [
  { key: '1', user: 'Mike Adams', offer: '$350', item: 'iPhone 11' },
];

const dummyPayments = [
  { key: '1', amount: '$200', date: '2025-08-01', type: 'Weekly' },
];

const UsedItemDetails = () => {
  const [showCreateItemModal, setShowCreateItemModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [itemModalVisible, setItemModalVisible] = useState(false);
  const [contactBuyerVisible, setContactBuyerVisible] = useState(false);
  const [contactingUser, setContactingUser] = useState(null);
  const [category, setCategory] = useState(null);
  const [subCategory, setSubCategory] = useState(null);
  const [filterSold, setFilterSold] = useState('all');

  const openItemModal = (item) => {
    setSelectedItem(item);
    setItemModalVisible(true);
  };

  const filteredListings = dummyListings.filter(item => {
    if (filterSold === 'sold') return item.sold;
    if (filterSold === 'unsold') return !item.sold;
    return true;
  });

  return (
    <motion.div className="p-6">
      <Row gutter={16} className="mb-4">
        <Col span={6}><Card><Statistic title="Active Listings" value={12} /></Card></Col>
        <Col span={6}><Card><Statistic title="Offers Received" value={8} /></Card></Col>
        <Col span={6}><Card><Statistic title="Items Sold" value={5} /></Card></Col>
        <Col span={6}><Card><Statistic title="Current Balance" value={400} prefix="$" /></Card></Col>
      </Row>

      <Tabs defaultActiveKey="1">
        <TabPane tab="Item Listings" key="1">
          <div className="flex justify-between mb-4">
            <Select value={filterSold} onChange={val => setFilterSold(val)} style={{ width: 200 }}>
              <Option value="all">All Items</Option>
              <Option value="sold">Sold Items</Option>
              <Option value="unsold">Unsold Items</Option>
            </Select>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setShowCreateItemModal(true)}>Create Item</Button>
          </div>

          <Table
            dataSource={filteredListings}
            columns={[
              { title: 'Title', dataIndex: 'title', sorter: (a, b) => a.title.localeCompare(b.title) },
              { title: 'Brand', dataIndex: 'brand' },
              { title: 'Price', dataIndex: 'price' },
              {
                title: 'Status',
                render: (_, record) => record.sold ? 'Sold' : 'Available',
              },
              {
                title: 'Action',
                render: (_, record) => <Button type="link" onClick={() => openItemModal(record)}>View Details</Button>,
              },
            ]}
          />
        </TabPane>

        <TabPane tab="Offers Received" key="2">
          <Table
            dataSource={dummyOffers}
            columns={[
              { title: 'User', dataIndex: 'user' },
              { title: 'Offer', dataIndex: 'offer' },
              {
                title: 'Item',
                dataIndex: 'item',
                render: (_, record) => <Button onClick={() => openItemModal(record)} type="link">{record.item}</Button>,
              },
            ]}
          />
        </TabPane>

        <TabPane tab="Payments" key="3">
          <Table
            dataSource={dummyPayments}
            columns={[
              { title: 'Amount', dataIndex: 'amount' },
              { title: 'Date', dataIndex: 'date' },
              { title: 'Type', dataIndex: 'type' },
            ]}
          />
        </TabPane>
      </Tabs>

      {/* Create Item Modal */}
      <Modal
        title="Create Item"
        open={showCreateItemModal}
        onCancel={() => setShowCreateItemModal(false)}
        footer={null}
      >
        <Form layout="vertical">
          <Form.Item label="Category">
            <Select placeholder="Select Category" onChange={value => setCategory(value)}>
              <Option value="mobiles">Mobiles</Option>
              <Option value="vehicles">Vehicles</Option>
              <Option value="electronics">Electronics</Option>
              <Option value="bikes">Bikes</Option>
              <Option value="furniture">Furniture</Option>
            </Select>
          </Form.Item>

          {category === 'electronics' && (
            <Form.Item label="Sub Category">
              <Select placeholder="Select Sub Category" onChange={value => setSubCategory(value)}>
                <Option value="televisions">Televisions</Option>
                <Option value="monitors">Monitors</Option>
                <Option value="laptops">Laptops</Option>
              </Select>
            </Form.Item>
          )}

          {subCategory === 'laptops' && (
            <>
              <Form.Item label="Upload Photos">
                <Upload listType="picture" multiple>
                  <Button icon={<UploadOutlined />}>Upload</Button>
                </Upload>
              </Form.Item>
              <Form.Item label="Listing Title"><Input /></Form.Item>
              <Form.Item label="Description"><Input.TextArea rows={3} /></Form.Item>
              <Form.Item label="Brand"><Input /></Form.Item>
              <Form.Item label="Model"><Input /></Form.Item>
              <Form.Item label="RAM"><Input /></Form.Item>
              <Form.Item label="Storage"><Input /></Form.Item>
              <Form.Item label="Processor"><Input /></Form.Item>
              <Form.Item label="Graphics"><Input /></Form.Item>
              <Form.Item label="Screen Size"><Input /></Form.Item>
              <Form.Item label="Battery Condition"><Input /></Form.Item>
              <Form.Item label="Purchase Year"><Input /></Form.Item>
              <Form.Item label="Warranty Remaining"><Input /></Form.Item>
              <Form.Item label="Price"><Input /></Form.Item>
              <Form.Item label="Ship Nationwide" valuePropName="checked">
                <Switch />
              </Form.Item>
              <Form.Item label="Package Size">
                <Radio.Group>
                  <Radio value="x-small">X-Small</Radio>
                  <Radio value="small">Small</Radio>
                  <Radio value="medium">Medium</Radio>
                  <Radio value="large">Large</Radio>
                  <Radio value="x-large">X-Large</Radio>
                </Radio.Group>
              </Form.Item>
              <Button type="primary" block>Submit Item</Button>
            </>
          )}
        </Form>
      </Modal>

      {/* Item Detail Modal */}
      <Modal
  title="Item Details"
  open={itemModalVisible}
  onCancel={() => setItemModalVisible(false)}
  footer={null}
  width={700}
>
  {selectedItem && (
    <Form layout="vertical">
      {/* Photos */}
      <Form.Item label="Photos">
        <Upload listType="picture-card" fileList={selectedItem.photos || []} showUploadList={{ showRemoveIcon: false }} />
      </Form.Item>

      {/* Basic Info */}
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label="Title">
            <Input value={selectedItem.title || selectedItem.item} readOnly />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Brand">
            <Input value={selectedItem.brand || 'N/A'} readOnly />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item label="Description">
        <Input.TextArea value={selectedItem.description || 'No description provided'} readOnly rows={3} />
      </Form.Item>

      {/* Laptop Specifics */}
      <Row gutter={16}>
        <Col span={12}><Form.Item label="Model"><Input value={selectedItem.model} readOnly /></Form.Item></Col>
        <Col span={12}><Form.Item label="RAM"><Input value={selectedItem.ram} readOnly /></Form.Item></Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}><Form.Item label="Storage"><Input value={selectedItem.storage} readOnly /></Form.Item></Col>
        <Col span={12}><Form.Item label="Processor"><Input value={selectedItem.processor} readOnly /></Form.Item></Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}><Form.Item label="Graphics"><Input value={selectedItem.graphics} readOnly /></Form.Item></Col>
        <Col span={12}><Form.Item label="Screen Size"><Input value={selectedItem.screenSize} readOnly /></Form.Item></Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}><Form.Item label="Battery Condition"><Input value={selectedItem.batteryCondition} readOnly /></Form.Item></Col>
        <Col span={12}><Form.Item label="Purchase Year"><Input value={selectedItem.purchaseYear} readOnly /></Form.Item></Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}><Form.Item label="Warranty Remaining"><Input value={selectedItem.warrantyRemaining} readOnly /></Form.Item></Col>
        <Col span={12}><Form.Item label="Price"><Input value={`$${selectedItem.price || selectedItem.offer}`} readOnly /></Form.Item></Col>
      </Row>

      <Form.Item label="Ships Nationwide">
        <Switch checked={selectedItem.shipNationwide} disabled />
      </Form.Item>

      <Form.Item label="Package Size">
        <Radio.Group value={selectedItem.packageSize} disabled>
          <Radio value="x-small">X-Small</Radio>
          <Radio value="small">Small</Radio>
          <Radio value="medium">Medium</Radio>
          <Radio value="large">Large</Radio>
          <Radio value="x-large">X-Large</Radio>
        </Radio.Group>
      </Form.Item>

      {/* Sold Info */}
      {selectedItem.sold && (
        <>
          <Row gutter={16}>
            <Col span={12}><Form.Item label="Sold To"><Input value={selectedItem.buyer} readOnly /></Form.Item></Col>
            <Col span={12}><Form.Item label="Final Price"><Input value={selectedItem.boughtPrice} readOnly /></Form.Item></Col>
          </Row>
        </>
      )}

      {selectedItem.user && (
        <Button
          type="primary"
          className="mt-4"
          onClick={() => {
            setContactingUser(selectedItem.user);
            setContactBuyerVisible(true);
          }}
        >
          Contact Buyer
        </Button>
      )}
    </Form>
  )}
</Modal>


      <Modal
        title={`Message to ${contactingUser}`}
        open={contactBuyerVisible}
        onCancel={() => setContactBuyerVisible(false)}
        footer={null}
      >
        <Form layout="vertical" onFinish={(values) => {
          console.log('Message sent:', values);
          setContactBuyerVisible(false);
          setItemModalVisible(false);
        }}>
          <Form.Item label="Subject" name="subject" rules={[{ required: true, message: 'Subject is required' }]}> <Input /> </Form.Item>
          <Form.Item label="Message" name="message" rules={[{ required: true, message: 'Message cannot be empty' }]}> <Input.TextArea rows={4} /> </Form.Item>
          <Button type="primary" htmlType="submit">Send Message</Button>
        </Form>
      </Modal>
    </motion.div>
  );
};

export default UsedItemDetails;
