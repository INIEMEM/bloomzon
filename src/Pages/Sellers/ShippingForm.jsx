import React, { useContext, useEffect, useState } from "react";
import { Button, Form, Input, Select, Spin, message } from "antd";
import { motion } from "framer-motion";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { MainContext } from "../../Context/Context";
import { SHIPPING_BASE_URL, getAuthHeaders } from "../../api/config";

const ShippingForm = () => {
  const { token } = useContext(MainContext);
  const navigate = useNavigate();
  const { shipping } = useParams();
  const isEditing = shipping && shipping !== "new";
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const fetchCategoryDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${SHIPPING_BASE_URL}/categories`, {
        headers: getAuthHeaders(token),
      });

      const category = (response.data?.data || []).find(
        (item) => String(item.id) === String(shipping),
      );

      if (category) {
        form.setFieldsValue(category);
      }
    } catch (error) {
      message.error("Failed to fetch logistics category.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isEditing) {
      fetchCategoryDetails();
    }
  }, [isEditing, shipping, token]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const payload = {
        ...values,
        icon: values.icon || {},
      };

      if (isEditing) {
        await axios.put(`${SHIPPING_BASE_URL}/categories/${shipping}`, payload, {
          headers: getAuthHeaders(token),
        });
        message.success("Logistics category updated successfully.");
      } else {
        await axios.post(`${SHIPPING_BASE_URL}/categories`, payload, {
          headers: getAuthHeaders(token),
        });
        message.success("Logistics category created successfully.");
      }

      navigate("/dashboard/sellers/shipping");
    } catch (error) {
      message.error(
        error?.response?.data?.message || "Failed to save logistics category.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ padding: 20 }}
    >
      <h1>{isEditing ? "Edit Logistics Category" : "Create Logistics Category"}</h1>
      <Spin spinning={loading}>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            status: 1,
            icon: {},
          }}
          className="create-category-form"
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please enter the name!" }]}
          >
            <Input placeholder="Enter category name" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: "Please enter the description!" }]}
          >
            <Input.TextArea placeholder="Enter description" rows={4} />
          </Form.Item>

          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: "Please select the status!" }]}
          >
            <Select
              options={[
                { value: 1, label: "Active" },
                { value: 0, label: "Inactive" },
              ]}
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              {isEditing ? "Update Logistics Category" : "Create Logistics Category"}
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </motion.div>
  );
};

export default ShippingForm;
