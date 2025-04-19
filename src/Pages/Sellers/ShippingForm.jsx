import React, { useState, useEffect, useContext } from "react";
import { Form, Input, InputNumber, Button, Select, message, Spin } from "antd";
import { motion } from "framer-motion";
import axios from "axios";
import { MainContext } from "../../Context/Context";
import { useParams } from "react-router-dom";
const { Option } = Select;
// const baseURL = "https://yourapiurl.com/api/v1/shipping";

const ShippingForm = ({ match, history }) => {
  const [loading, setLoading] = useState(false);
  const [shippingDetails, setShippingDetails] = useState({})
  const [form] = Form.useForm();
  const {shipping} = useParams()
  const {baseUrl, token} = useContext(MainContext)
  const isEditing = Boolean(shipping !== '2'); // Check if this is edit mode
  const shippingId = shipping;
  const isCreating = shipping == '2'
  // const fetchShippingDetails = async (id) => {
  //   setLoading(true);
  //   try {
  //     const response = await axios.get(`${baseUrl}/one`, {
  //       params: { shippingId: id },
  //     });
  //     form.setFieldsValue(response.data.data);
  //   } catch (error) {
  //     message.error("Failed to fetch shipping details.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   if (isEditing) {
  //     fetchShippingDetails(shippingId);
  //   }
  // }, [isEditing, shippingId]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      
      if(isCreating){
        await axios.post(`${baseUrl}api/v1/shipping/register`, values,  {
          headers: { Authorization: `Bearer ${token}` },
        });
        message.success("Shipping method created successfully.");
      }
      if (isEditing) {
        await axios.put(`${baseUrl}api/v1/shipping/update`, { ...values, shippingId },  {
          headers: { Authorization: `Bearer ${token}` },
        });
        message.success("Shipping method updated successfully.");
      }
    } catch (error) {
      message.error("Failed to save shipping method.");
      console.error('shipping error', error)
    } finally {
      setLoading(false);
    }
  };
  const getshippingDetails = async () => 
  {
      try {
        const response = await axios.get(`${baseUrl}api/v1/shipping/one?shippingId=${shippingId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
    
        console.log('the shipping ' ,response.data.data)
        const data = response.data?.data;
          if (data) {
            form.setFieldsValue(data); // Dynamically update form values
          }
      } catch (error) {
        if(error?.response?.statusText == "Unauthorized"){
          navigate('../../')
        }
        console.log(error);
      }
      
  }

  useEffect(()=>
    {
      !isCreating && getshippingDetails()
    }, [shippingId])


  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{padding:20}}>
      <h1>Edit Shipping</h1>
      <Spin spinning={loading}>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            rate: 0,
            itemRate: 0,
            type: "regional",
            timing: "Withing 24 hours to 72 hours",
          }}
          className="create-category-form"
        >
          <Form.Item name="name" label="Name" rules={[{ required: true, message: "Please enter the name!" }]}>
            <Input placeholder="Enter shipping name" />
          </Form.Item>

          <Form.Item name="rate" label="Rate" rules={[{ required: true, message: "Please enter the rate!" }]}>
            <Input placeholder="Enter rate" style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item name="address" label="Address" rules={[{ required: true, message: "Please enter the address!" }]}>
            <Input.TextArea placeholder="Enter address" />
          </Form.Item>

          <Form.Item name="itemRate" label="Item Rate">
            <Input placeholder="Enter item rate" style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item name="type" label="Type">
            <Select>
              <Option value="regional">Regional</Option>
              <Option value="national">National</Option>
            </Select>
          </Form.Item>

          <Form.Item name="timing" label="Timing">
            <Input placeholder="e.g., Within 24 hours to 72 hours" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              {isEditing ? "Update Shipping Method" : "Create Shipping Method"}
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </motion.div>
  );
};

export default ShippingForm;
