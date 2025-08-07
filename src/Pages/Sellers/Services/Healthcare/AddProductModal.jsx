import React, { useState } from 'react';
import {
  Modal,
  Tabs,
  Form,
  Input,
  Checkbox,
  Select,
  Switch,
  InputNumber,
  Upload,
  Button,
  message,
} from 'antd';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';

const { TabPane } = Tabs;
const { TextArea } = Input;

const AddProductModal = ({ visible, onClose, type }) => {
  const [form] = Form.useForm();
  const [hasBrand, setHasBrand] = useState(true);
  const [dosages, setDosages] = useState([{ mg: '', dosage: '' }]);
  const [fileList, setFileList] = useState([]);
  const isClinic = type === 'clinic';
  const isPharmacy = type === 'pharmacy';
  const isLab = type === 'laboratory';
  const handleAddDosage = () => {
    setDosages([...dosages, { mg: '', dosage: '' }]);
  };

  const handleUploadChange = ({ fileList }) => setFileList(fileList);

  const handleSubmit = () => {
    form.validateFields().then(values => {
      message.success(`${type} product submitted!`);
      console.log('Submitted values:', { ...values, dosages, fileList, type });
      onClose();
      form.resetFields();
      setDosages([{ mg: '', dosage: '' }]);
      setFileList([]);
    });
  };
  const renderClinicTabs = () => (
    <>
      <TabPane tab="Professional Info" key="1">
        <Form.Item name="specialization" label="Specialization" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="licenceNumber" label="Licence Number" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="stateOfPractice" label="State of Practice" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="licenceDocument" label="Licence Document" rules={[{ required: true }]}>
          <Upload beforeUpload={() => false} maxCount={1} listType="picture">
            <Button icon={<UploadOutlined />}>Upload Licence</Button>
          </Upload>
        </Form.Item>
        <Form.Item name="certificationDocument" label="Certification" rules={[{ required: true }]}>
          <Upload beforeUpload={() => false} maxCount={1} listType="picture">
            <Button icon={<UploadOutlined />}>Upload Certification</Button>
          </Upload>
        </Form.Item>
        <Form.Item name="yearsOfPractice" label="Years of Practice" rules={[{ required: true }]}>
          <InputNumber min={0} />
        </Form.Item>
      </TabPane>
      <TabPane tab="Availability" key="2">
        <Form.Item name="availabilityDateTime" label="Availability Dates & Times">
          <DatePicker showTime multiple />
        </Form.Item>
      </TabPane>
    </>
  );
  const renderLabTabs = () => (
    <>
      <TabPane tab="Basic Info" key="1">
        <Form.Item name="labName" label="Lab Name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="licenceNumber" label="Licence Number" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="address" label="Lab Address" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="certificationDocument" label="Certification (Upload)" rules={[{ required: true }]}>
          <Upload beforeUpload={() => false} maxCount={1} listType="picture">
            <Button icon={<UploadOutlined />}>Upload Certification</Button>
          </Upload>
        </Form.Item>
      </TabPane>
      <TabPane tab="Availability" key="2">
        <Form.Item name="availabilityDateTime" label="Availability Dates & Times">
          <DatePicker showTime multiple />
        </Form.Item>
      </TabPane>
      <TabPane tab="Service Settings" key="3">
        <Form.Item name="breakStart" label="Break Start Time" rules={[{ required: true }]}>
          <TimePicker />
        </Form.Item>
        <Form.Item name="breakEnd" label="Break End Time" rules={[{ required: true }]}>
          <TimePicker />
        </Form.Item>
        <Form.Item name="modeOfService" label="Mode of Service" rules={[{ required: true }]}>
          <Select>
            <Select.Option value="lab">Lab Visit</Select.Option>
            <Select.Option value="home">Home Visit</Select.Option>
          </Select>
        </Form.Item>
      </TabPane>
    </>
  );
  const renderPharmacyTabs = () => (
    <>
      {/* You can import or copy the Info / Variation / Seller SKU tabs from earlier */}
      {/* Info */}
      <TabPane tab="Info" key="1">
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input placeholder={`Enter ${type} product name`} />
          </Form.Item>
        
                <Checkbox checked={hasBrand} onChange={e => setHasBrand(e.target.checked)}>
                  I have a brand name
                </Checkbox>
                {hasBrand && (
                  <Form.Item name="brandName" label="Brand Name" rules={[{ required: true }]}>
                    <Input />
                  </Form.Item>
                )}

                <Form.Item name="productCategory" label="Product Category" rules={[{ required: true }]}>
                  <Select>
                    <Select.Option value="PainKillers">PainKillers</Select.Option>
                    <Select.Option value="Antibiotics">Antibiotics</Select.Option>
                    <Select.Option value="Vitamins">Vitamins</Select.Option>
                    <Select.Option value="Antivirals">Antivirals</Select.Option>
                  </Select>
                </Form.Item>

                <Form.Item name="productId" label="Product ID" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>

                <Form.Item name="prescription" label="Is Prescription Required">
                  <Switch />
                </Form.Item>
              
       

            
                <Form.Item name="numberOfItems" label="Number of Items">
                  <InputNumber min={1} />
                </Form.Item>

                <Form.Item name="bookingDate" label="Booking Date">
                  <Input type="date" />
                </Form.Item>

                <Form.Item name="shippingCountry" label="Shipping Country">
                  <Input />
                </Form.Item>
        {/* additional pharmacy-specific fields */}
      </TabPane>
      {/* Variation */}
      <TabPane tab="Variation" key="2"> 

      {dosages.map((item, index) => (
          <div key={index} className="flex gap-4 mb-2">
            <Input
              placeholder="mg"
              value={item.mg}
              onChange={e => {
                const newDosages = [...dosages];
                newDosages[index].mg = e.target.value;
                setDosages(newDosages);
              }}
            />
            <Input
              placeholder="Dosage"
              value={item.dosage}
              onChange={e => {
                const newDosages = [...dosages];
                newDosages[index].dosage = e.target.value;
                setDosages(newDosages);
              }}
            />
          </div>
        ))}
        <Button onClick={handleAddDosage} icon={<PlusOutlined />}>
          Add Dosage
        </Button>

        <Form.Item name="form" label="Form" className="mt-4">
          <Select>
            <Select.Option value="Tablet">Tablet</Select.Option>
            <Select.Option value="Capsule">Capsule</Select.Option>
            <Select.Option value="Liquid">Liquid</Select.Option>
          </Select>
        </Form.Item>
      </TabPane>
      {/* Seller SKU */}
      <TabPane tab="Seller SKU" key="3">  
      <Form.Item name="sku" label="Seller SKU">
              <Input />
            </Form.Item>

            <Form.Item name="price" label="Price">
              <InputNumber min={0} prefix="₦" />
            </Form.Item>

            {isPharmacy && (
              <Form.Item name="listPrice" label="List Price">
                <InputNumber min={0} prefix="₦" />
              </Form.Item>
            )}

            <Form.Item name="quantity" label="Quantity">
              <InputNumber min={1} />
            </Form.Item>

            <Form.Item name="condition" label="Condition">
              <Input />
            </Form.Item>

            <Form.Item name="region" label="Country/Region">
              <Input />
            </Form.Item>

            {isPharmacy && (
              <Form.Item name="maxRetailPrice" label="Maximum Retail Price">
                <InputNumber min={0} prefix="₦" />
              </Form.Item>
            )}

            <Form.Item name="fulfilmentChannel" label="Fulfilment Channel">
              <Input />
            </Form.Item>
      </TabPane>
      <TabPane tab="Gallery" key="4">
        <Upload
          listType="picture-card"
          fileList={fileList}
          onChange={handleUploadChange}
          beforeUpload={() => false}
        >
          {fileList.length >= 5 ? null : <UploadOutlined />}
        </Upload>
      </TabPane>
      <TabPane tab="Description" key="5">
      <Form.Item name="description" label="Product Description">
        <TextArea rows={4} />
      </Form.Item>

      <Form.Item name="bulletPoints" label="Bullet Points">
        <TextArea rows={3} placeholder="Use • or - to separate points" />
      </Form.Item>
      </TabPane>
      <TabPane tab="Keywords" key="6"> {/* ... */} </TabPane>
    </>
  );



  return (
    <Modal
      title={`Add ${type.charAt(0).toUpperCase() + type.slice(1)} Product`}
      visible={visible}
      onCancel={onClose}
      onOk={handleSubmit}
      width={800}
      centered
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        <Tabs defaultActiveKey="1">
          {/* Info Tab */}
          <TabPane tab="Info" key="1">
            <Form.Item name="name" label="Name" rules={[{ required: true }]}>
              <Input placeholder={`Enter ${type} product name`} />
            </Form.Item>

            {isPharmacy && (
              <>
                <Checkbox checked={hasBrand} onChange={e => setHasBrand(e.target.checked)}>
                  I have a brand name
                </Checkbox>
                {hasBrand && (
                  <Form.Item name="brandName" label="Brand Name" rules={[{ required: true }]}>
                    <Input />
                  </Form.Item>
                )}

                <Form.Item name="productCategory" label="Product Category" rules={[{ required: true }]}>
                  <Select>
                    <Select.Option value="PainKillers">PainKillers</Select.Option>
                    <Select.Option value="Antibiotics">Antibiotics</Select.Option>
                    <Select.Option value="Vitamins">Vitamins</Select.Option>
                    <Select.Option value="Antivirals">Antivirals</Select.Option>
                  </Select>
                </Form.Item>

                <Form.Item name="productId" label="Product ID" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>

                <Form.Item name="prescription" label="Is Prescription Required">
                  <Switch />
                </Form.Item>
              </>
            )}

            {(isPharmacy || isClinic || isLab) && (
              <>
                <Form.Item name="numberOfItems" label="Number of Items">
                  <InputNumber min={1} />
                </Form.Item>

                <Form.Item name="bookingDate" label="Booking Date">
                  <Input type="date" />
                </Form.Item>

                <Form.Item name="shippingCountry" label="Shipping Country">
                  <Input />
                </Form.Item>
              </>
            )}
          </TabPane>

          {/* Variation Tab (Pharmacy Only) */}
          {isPharmacy && (
            <TabPane tab="Variation" key="2">
              {dosages.map((item, index) => (
                <div key={index} className="flex gap-4 mb-2">
                  <Input
                    placeholder="mg"
                    value={item.mg}
                    onChange={e => {
                      const newDosages = [...dosages];
                      newDosages[index].mg = e.target.value;
                      setDosages(newDosages);
                    }}
                  />
                  <Input
                    placeholder="Dosage"
                    value={item.dosage}
                    onChange={e => {
                      const newDosages = [...dosages];
                      newDosages[index].dosage = e.target.value;
                      setDosages(newDosages);
                    }}
                  />
                </div>
              ))}
              <Button onClick={handleAddDosage} icon={<PlusOutlined />}>
                Add Dosage
              </Button>

              <Form.Item name="form" label="Form" className="mt-4">
                <Select>
                  <Select.Option value="Tablet">Tablet</Select.Option>
                  <Select.Option value="Capsule">Capsule</Select.Option>
                  <Select.Option value="Liquid">Liquid</Select.Option>
                </Select>
              </Form.Item>
            </TabPane>
          )}

          {/* Seller SKU Tab (Pharmacy + Clinic + Lab) */}
          <TabPane tab="Seller SKU" key="3">
            <Form.Item name="sku" label="Seller SKU">
              <Input />
            </Form.Item>

            <Form.Item name="price" label="Price">
              <InputNumber min={0} prefix="₦" />
            </Form.Item>

            {isPharmacy && (
              <Form.Item name="listPrice" label="List Price">
                <InputNumber min={0} prefix="₦" />
              </Form.Item>
            )}

            <Form.Item name="quantity" label="Quantity">
              <InputNumber min={1} />
            </Form.Item>

            <Form.Item name="condition" label="Condition">
              <Input />
            </Form.Item>

            <Form.Item name="region" label="Country/Region">
              <Input />
            </Form.Item>

            {isPharmacy && (
              <Form.Item name="maxRetailPrice" label="Maximum Retail Price">
                <InputNumber min={0} prefix="₦" />
              </Form.Item>
            )}

            <Form.Item name="fulfilmentChannel" label="Fulfilment Channel">
              <Input />
            </Form.Item>
          </TabPane>

          {/* Gallery */}
          <TabPane tab="Gallery" key="4">
            <Upload
              listType="picture-card"
              fileList={fileList}
              onChange={handleUploadChange}
              beforeUpload={() => false}
            >
              {fileList.length >= 5 ? null : <UploadOutlined />}
            </Upload>
          </TabPane>

          {/* Description */}
          <TabPane tab="Description" key="5">
            <Form.Item name="description" label="Product Description">
              <TextArea rows={4} />
            </Form.Item>

            <Form.Item name="bulletPoints" label="Bullet Points">
              <TextArea rows={3} placeholder="Use • or - to separate points" />
            </Form.Item>
          </TabPane>

          {/* Keywords */}
          <TabPane tab="Keywords" key="6">
            <Form.Item name="keywords" label="Keywords">
              <Input placeholder="Comma-separated keywords" />
            </Form.Item>
          </TabPane>
        </Tabs>
      </Form>
    </Modal>
  );
};

export default AddProductModal;
