// AdminDashboard.jsx
import React,{ useState } from "react";
import { Card, Table, Tabs, Button, Tag, Popconfirm, Statistic, Modal,
  Form,
  Input,
  Select,
  Upload, } from "antd";
import { motion } from "framer-motion";
import {
  CarOutlined,
  SettingOutlined,
  UserOutlined,
  ShoppingOutlined,
  TruckOutlined,
  DollarOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
const { TabPane } = Tabs;
const { Option } = Select;
const AutomobileAdminDashboard = () => {
  const [vehicleModalVisible, setVehicleModalVisible] = useState(false);
  const [partsModalVisible, setPartsModalVisible] = useState(false);
  const [userModalVisible, setUserModalVisible] = useState(false);
  const [userForm] = Form.useForm();
  const [selectedServices, setSelectedServices] = useState([]);
  const [vehicleForm] = Form.useForm();
  const [partsForm] = Form.useForm();

  const handleVehicleSubmit = (values) => {
    console.log("Vehicle Listing Submitted:", values);
    setVehicleModalVisible(false);
    vehicleForm.resetFields();
  };

  const handlePartsSubmit = (values) => {
    console.log("Spare Parts Submitted:", values);
    setPartsModalVisible(false);
    partsForm.resetFields();
  };

  return (
    <motion.div
      className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Stats Overview */}
      <Card className="col-span-1 lg:col-span-3" title="Overview">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Statistic title="Total Vehicles" value={123} prefix={<CarOutlined />} />
          <Statistic title="Spare Parts" value={456} prefix={<ShoppingOutlined />} />
          <Statistic title="Pending Listings" value={12} prefix={<SettingOutlined />} />
          <Statistic title="Sellers" value={90} prefix={<UserOutlined />} />
          <Statistic title="Deliveries" value={34} prefix={<TruckOutlined />} />
          <Statistic title="Revenue" value={"₦500,000"} prefix={<DollarOutlined />} />
        </div>
      </Card>
      <div className="flex">
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setUserModalVisible(true)}
          className="mb-4"
        >
          Create User
        </Button>

        <Modal
          title="Create New User"
          visible={userModalVisible}
          onCancel={() => {
            setUserModalVisible(false);
            userForm.resetFields();
            setSelectedServices([]);
          }}
          footer={null}
        >
          <Form layout="vertical" form={userForm} onFinish={(values) => {
            console.log("User Created:", values);
            setUserModalVisible(false);
            userForm.resetFields();
            setSelectedServices([]);
          }}>
            <Form.Item name="fullName" label="Full Name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="email" label="Email" rules={[{ required: true, type: "email" }]}>
              <Input />
            </Form.Item>
            <Form.Item name="phone" label="Phone Number" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="services" label="Services" rules={[{ required: true }]}>
              <Select
                mode="multiple"
                onChange={(values) => setSelectedServices(values)}
                placeholder="Select services user will offer"
              >
                <Option value="vehicle">Vehicle Listing</Option>
                <Option value="spareParts">Spare Parts</Option>
              </Select>
            </Form.Item>

            {/* Vehicle Listing Section */}
            {selectedServices.includes("vehicle") && (
              <div className="border p-3 rounded-md mb-4">
                <h3 className="font-semibold mb-2">Vehicle Listing Details</h3>
                <Form.Item name="vehicleMake" label="Make" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
                <Form.Item name="vehicleModel" label="Model" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
                <Form.Item name="vehicleYear" label="Year" rules={[{ required: true }]}>
                  <Input type="number" />
                </Form.Item>
              </div>
            )}

            {/* Spare Parts Section */}
            {selectedServices.includes("spareParts") && (
              <div className="border p-3 rounded-md mb-4">
                <h3 className="font-semibold mb-2">Spare Parts Details</h3>
                <Form.Item name="partType" label="Part Type" rules={[{ required: true }]}>
                  <Select>
                    <Option value="engine">Engine</Option>
                    <Option value="battery">Battery</Option>
                    <Option value="tire">Tires</Option>
                    <Option value="filter">Filters</Option>
                    <Option value="mirror">Mirror</Option>
                  </Select>
                </Form.Item>
                <Form.Item name="partBrand" label="Brand" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
              </div>
            )}

            <Button type="primary" htmlType="submit" className="w-full">
              Create User
            </Button>
          </Form>
        </Modal>

      </div>

      {/* Tabs for Management */}
      <Card className="col-span-1 lg:col-span-3 mt-4" title="Management Control">
        <Tabs defaultActiveKey="1">
          <TabPane tab="Vehicle Listings" key="1">
          <div className="flex justify-end mb-4">
              <Button type="primary" icon={<PlusOutlined />} onClick={() => setVehicleModalVisible(true)}>
                Create Listing
              </Button>
            </div>
            <Table
              rowKey="id"
              dataSource={[
                {
                  id: 1,
                  title: "Toyota Camry 2010",
                  status: "Pending",
                  seller: "John Doe",
                },
              ]}
              columns={[
                {
                  title: "Title",
                  dataIndex: "title",
                  render: (_, record) => (
                    <Link to={`/dashboard/sellers/services/automobile/${record.id}`}>
                      {record.title}
                    </Link>
                  ),
                },
                { title: "Seller", dataIndex: "seller" },
                {
                  title: "Status",
                  dataIndex: "status",
                  render: (text) => (
                    <Tag color={text === "Pending" ? "orange" : "green"}>{text}</Tag>
                  ),
                },
                {
                  title: "Action",
                  render: (_, record) => (
                    <>
                      <Popconfirm title="Approve listing?">
                        <Button type="link">Approve</Button>
                      </Popconfirm>
                      <Button type="link" danger>
                        Reject
                      </Button>
                    </>
                  ),
                },
              ]}
            />
            <Modal
              title="Create Vehicle Listing"
              visible={vehicleModalVisible}
              onCancel={() => setVehicleModalVisible(false)}
              footer={null}
            >
              <Form layout="vertical" form={vehicleForm} onFinish={handleVehicleSubmit}>
                <Form.Item name="make" label="Make" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
                <Form.Item name="model" label="Model" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
                <Form.Item name="year" label="Year" rules={[{ required: true }]}>
                  <Input type="number" />
                </Form.Item>
                <Form.Item name="mileage" label="Mileage" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
                <Form.Item name="condition" label="Condition" rules={[{ required: true }]}>
                  <Select>
                    <Option value="new">New</Option>
                    <Option value="used">Used</Option>
                  </Select>
                </Form.Item>
                <Form.Item name="location" label="Location" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
                <Form.Item name="price" label="Price" rules={[{ required: true }]}>
                  <Input prefix="₦" type="number" />
                </Form.Item>
                <Form.Item name="photos" label="Photos">
                  <Upload beforeUpload={() => false} listType="picture">
                    <Button icon={<UploadOutlined />}>Upload</Button>
                  </Upload>
                </Form.Item>
                <Form.Item name="serviceHistory" label="Service History">
                  <Input.TextArea rows={3} />
                </Form.Item>
                <Form.Item name="verified" label="Verification Badge">
                  <Select>
                    <Option value="yes">Yes</Option>
                    <Option value="no">No</Option>
                  </Select>
                </Form.Item>
                <Button type="primary" htmlType="submit" className="w-full">
                  Submit
                </Button>
              </Form>
            </Modal>
          </TabPane>

          <TabPane tab="Spare Parts" key="2">
          <div className="flex justify-end mb-4">
              <Button type="primary" icon={<PlusOutlined />} onClick={() => setPartsModalVisible(true)}>
                Add Spare Part
              </Button>
            </div>
            <Table
              rowKey="id"
              dataSource={[{ id: 2, title: "Car Battery", seller: "AutoMax", status: "Approved" }]}
              columns={[
                {
                  title: "Title",
                  dataIndex: "title",
                  render: (_, record) => (
                    <Link to={`/dashboard/sellers/services/automobile/${record.id}`}>
                      {record.title}
                    </Link>
                  ),
                },
                { title: "Seller", dataIndex: "seller" },
                {
                  title: "Status",
                  dataIndex: "status",
                  render: (text) => (
                    <Tag color={text === "Pending" ? "orange" : "green"}>{text}</Tag>
                  ),
                },
                {
                  title: "Action",
                  render: () => (
                    <>
                      <Button type="link">Edit</Button>
                      <Button type="link" danger>
                        Delete
                      </Button>
                    </>
                  ),
                },
              ]}
            />
            <Modal
              title="Add Spare Part"
              visible={partsModalVisible}
              onCancel={() => setPartsModalVisible(false)}
              footer={null}
            >
              <Form layout="vertical" form={partsForm} onFinish={handlePartsSubmit}>
                <Form.Item name="partType" label="Part Type" rules={[{ required: true }]}>
                  <Select>
                    <Option value="engine">Engine</Option>
                    <Option value="battery">Battery</Option>
                    <Option value="tire">Tires</Option>
                    <Option value="filter">Filters</Option>
                    <Option value="bumper">Bumper</Option>
                    <Option value="mirror">Mirror</Option>
                    <Option value="light">Light</Option>
                    <Option value="accessory">Accessory</Option>
                  </Select>
                </Form.Item>
                <Form.Item name="brand" label="Vehicle Brand" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
                <Form.Item name="model" label="Vehicle Model" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
                <Form.Item name="availability" label="Availability" rules={[{ required: true }]}>
                  <Select>
                    <Option value="in_stock">In Stock</Option>
                    <Option value="out_of_stock">Out of Stock</Option>
                  </Select>
                </Form.Item>
                <Form.Item name="price" label="Price" rules={[{ required: true }]}>
                  <Input prefix="₦" type="number" />
                </Form.Item>
                <Form.Item name="photos" label="Photos">
                  <Upload beforeUpload={() => false} listType="picture">
                    <Button icon={<UploadOutlined />}>Upload</Button>
                  </Upload>
                </Form.Item>
                <Button type="primary" htmlType="submit" className="w-full">
                  Submit
                </Button>
              </Form>
            </Modal>
          </TabPane>

          <TabPane tab="Sellers" key="3">
            <Table
              rowKey="id"
              dataSource={[{ id: 3, name: "AutoMax", status: "Verified" }]}
              columns={[
                {
                  title: "Name",
                  dataIndex: "name",
                  render: (_, record) => (
                    <Link to={`/dashboard/sellers/services/automobile/${record.id}`}>
                      {record.name}
                    </Link>
                  ),
                },
                {
                  title: "Status",
                  dataIndex: "status",
                  render: (text) => <Tag color="green">{text}</Tag>,
                },
                {
                  title: "Action",
                  render: () => (
                    <>
                      <Button type="link">Suspend</Button>
                      <Button type="link">Verify</Button>
                    </>
                  ),
                },
              ]}
            />
          </TabPane>

          <TabPane tab="Orders & Payments" key="4">
            <Table
              rowKey="id"
              dataSource={[{ id: 4, order: "Battery - John", status: "Paid" }]}
              columns={[
                { title: "Order", dataIndex: "order" },
                {
                  title: "Status",
                  dataIndex: "status",
                  render: (text) => <Tag color="blue">{text}</Tag>,
                },
                {
                  title: "Action",
                  render: () => <Button type="link">Refund</Button>,
                },
              ]}
            />
          </TabPane>

          <TabPane tab="Logistics & Inspections" key="5">
            <Table
              rowKey="id"
              dataSource={[{ id: 5, request: "Camry Inspection", status: "Scheduled" }]}
              columns={[
                { title: "Request", dataIndex: "request" },
                {
                  title: "Status",
                  dataIndex: "status",
                  render: (text) => <Tag color="purple">{text}</Tag>,
                },
                {
                  title: "Action",
                  render: () => <Button type="link">Assign Inspector</Button>,
                },
              ]}
            />
          </TabPane>
        </Tabs>
      </Card>
    </motion.div>
  );
};

export default AutomobileAdminDashboard;
