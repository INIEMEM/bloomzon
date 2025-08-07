import React, { useState } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  Steps,
  Button,
  Checkbox,
  Upload,
  Switch,
  message,
} from "antd";
import { PlusOutlined, InboxOutlined } from "@ant-design/icons";

const { Step } = Steps;
const { Option } = Select;
const { Dragger } = Upload;

const featuresList = ["Parking", "Swimming Pool", "Balcony", "Garden", "Elevator", "Gym"];

const CreateSellerModal = ({ visible, onClose }) => {
  const [current, setCurrent] = useState(0);
  const [form] = Form.useForm();
  const [instalmentsEnabled, setInstalmentsEnabled] = useState(false);
  const [customFeatures, setCustomFeatures] = useState([]);

  const next = () => setCurrent(current + 1);
  const prev = () => setCurrent(current - 1);

  const handleCustomFeature = (e) => {
    if (e.key === "Enter" && e.target.value.trim()) {
      setCustomFeatures([...customFeatures, e.target.value.trim()]);
      e.target.value = "";
    }
  };

  const handleSubmit = () => {
    form.validateFields().then(values => {
      console.log("Final Form Values:", values);
      message.success("Seller Created Successfully!");
      form.resetFields();
      setCurrent(0);
      onClose();
    });
  };

  const steps = [
    {
      title: "Listing Type",
      content: (
        <Form.Item name="listingType" label="Is the property for:" rules={[{ required: true }]}>
          <Select placeholder="Select listing type">
            <Option value="sell">Sell</Option>
            <Option value="rent">Rent</Option>
          </Select>
        </Form.Item>
      ),
    },
    {
      title: "Property Details",
      content: (
        <>
          <Form.Item name="propertyType" label="Property Type" rules={[{ required: true }]}>
            <Select placeholder="Select type">
              <Option value="home">Home</Option>
              <Option value="plot">Plot</Option>
              <Option value="commercial">Commercial</Option>
            </Select>
          </Form.Item>

          <Form.Item name="homeTags" label="Home Tags (if applicable)">
            <Select mode="multiple" placeholder="Flat, Penthouse, etc">
              <Option value="flat">Flat</Option>
              <Option value="upper portion">Upper Portion</Option>
              <Option value="penthouse">Penthouse</Option>
            </Select>
          </Form.Item>

          <Form.Item name="city" label="City" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="location" label="Location" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="areaSize" label="Area Size (sq ft)" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item name="bedrooms" label="Bedrooms" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item name="bathrooms" label="Bathrooms" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item name="garage" label="Garage" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item name="kitchen" label="Kitchen" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item name="propertyTitle" label="Property Title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="builtYear" label="Built Year">
            <Input type="number" />
          </Form.Item>

          <Form.Item name="features" label="Extra Features">
            <Checkbox.Group options={featuresList} />
          </Form.Item>

          <Input
            placeholder="Add custom feature and press Enter"
            onKeyDown={handleCustomFeature}
          />
          {customFeatures.length > 0 && (
            <div className="mt-2">
              {customFeatures.map((feature, i) => (
                <span key={i} className="inline-block mr-2 px-2 py-1 bg-gray-200 rounded">
                  {feature}
                </span>
              ))}
            </div>
          )}
        </>
      ),
    },
    {
      title: "Pricing",
      content: (
        <>
          <Form.Item name="totalPrice" label="Total Price" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>

          <Form.Item label="Installments Available">
            <Switch onChange={setInstalmentsEnabled} />
          </Form.Item>

          {instalmentsEnabled && (
            <>
              <Form.Item name="advanceAmount" label="Advance Amount">
                <Input type="number" />
              </Form.Item>
              <Form.Item name="monthlyInstalment" label="Monthly Installment">
                <Input type="number" />
              </Form.Item>
              <Form.Item name="installmentsRemaining" label="Installments Remaining">
                <Input type="number" />
              </Form.Item>
            </>
          )}
        </>
      ),
    },
    {
      title: "Gallery & Description",
      content: (
        <>
          <Form.Item name="images" label="Property Images">
            <Dragger multiple={true} listType="picture">
              <p className="ant-upload-drag-icon"><InboxOutlined /></p>
              <p className="ant-upload-text">Click or drag files to this area to upload</p>
            </Dragger>
          </Form.Item>

          <Form.Item name="description" label="Property Description" rules={[{ required: true }]}>
            <Input.TextArea rows={4} />
          </Form.Item>
        </>
      ),
    },
    {
      title: "Seller Contact",
      content: (
        <>
          <Form.Item name="sellerPhone" label="Phone Number" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="sellerEmail" label="Email" rules={[{ required: true, type: "email" }]}>
            <Input />
          </Form.Item>
        </>
      ),
    },
  ];

  return (
    <Modal
      title="Create New Seller Listing"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={800}
    >
      <Steps current={current} size="small" className="mb-6">
        {steps.map((item) => (
          <Step key={item.title} title={item.title} />
        ))}
      </Steps>

      <Form layout="vertical" form={form}>
        {steps[current].content}

        <div className="flex justify-between mt-6">
          {current > 0 && (
            <Button onClick={prev} className="mr-2">
              Previous
            </Button>
          )}
          {current < steps.length - 1 && (
            <Button type="primary" onClick={next}>
              Next
            </Button>
          )}
          {current === steps.length - 1 && (
            <Button type="primary" onClick={handleSubmit}>
              Submit
            </Button>
          )}
        </div>
      </Form>
    </Modal>
  );
};

export default CreateSellerModal;
  