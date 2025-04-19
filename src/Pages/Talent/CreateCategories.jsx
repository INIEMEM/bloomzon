import React, { useState } from "react";
import { Form, Input, InputNumber, Button, Upload, message, Spin, Select, Switch } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import { motion } from "framer-motion";

const { TextArea } = Input;

const CreateCategory = () => {
  const [loading, setLoading] = useState(false);

  const handleFormSubmit = async (values) => {
    setLoading(true);

    // Prepare form data
    const formData = new FormData();
    Object.keys(values).forEach((key) => {
      if (key === "image") {
        formData.append(key, values.image.file);
      } else {
        formData.append(key, values[key]);
      }
    });

    try {
      const response = await axios.post(
        "https://api-bloomzon-com.onrender.com/createCategory",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        message.success("Category created successfully!");
        
      }
    } catch (error) {
      console.error(error);
      message.error("An error occurred while creating the category.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.5 }}
      style={{ padding: "20px", margin: "0 auto" }}
    >
      <h2>Create a New Category</h2>
      <Form
        layout="vertical"
        onFinish={handleFormSubmit}
        style={{ marginTop: "20px" }}
        initialValues={{
          commision_rate: 0,
          digital: 0,
          enabled: 1,
          featured: 1,
          food: 0,
          level: 1,
          parent_id: 0,
          top: 0,
        }}
        className="create-category-form"
      >
        <Form.Item
          label="Category Title"
          name="title"
          rules={[
            { required: true, message: "Please input the category name!" },
          ]}
        >
          <Input placeholder="Enter category name" />
        </Form.Item>

        <Form.Item
          label="Slug"
          name="slug"
          rules={[
            { required: true, message: "Please input the slug!" },
            { pattern: /^[a-z0-9-]+$/, message: "Slug must be alphanumeric." },
          ]}
        >
          <Input placeholder="Enter category slug" />
        </Form.Item>

        <Form.Item
          label="Meta Title"
          name="meta_title"
          rules={[
            { required: true, message: "Please input the meta title!" },
          ]}
        >
          <Input placeholder="Enter meta title" />
        </Form.Item>

        <Form.Item
          label="Meta Description"
          name="meta_description"
          rules={[
            { required: true, message: "Please input the meta description!" },
          ]}
        >
          <TextArea placeholder="Enter meta description" rows={3} />
        </Form.Item>

        <Form.Item
          label="Commission Rate"
          name="commision_rate"
          rules={[
            { required: true, message: "Please input the commission rate!" },
          ]}
        >
          <InputNumber min={0} placeholder="Enter commission rate" />
        </Form.Item>

        <Form.Item
          label="Parent ID"
          name="parent_id"
          rules={[
            { required: true, message: "Please input the parent ID!" },
          ]}
        >
          <InputNumber min={0} placeholder="Enter parent ID" />
        </Form.Item>

        <Form.Item
          label="Banner"
          name="banner"
          rules={[
            { required: true, message: "Please input the banner ID!" },
          ]}
        >
          <Input placeholder="Enter banner ID" />
        </Form.Item>

        <Form.Item
          label="Icon"
          name="icon"
          rules={[
            { required: true, message: "Please input the icon ID!" },
          ]}
        >
          <Input placeholder="Enter icon ID" />
        </Form.Item>

        <Form.Item
          label="Level"
          name="level"
          rules={[
            { required: true, message: "Please input the level!" },
          ]}
        >
          <InputNumber min={1} placeholder="Enter level" />
        </Form.Item>

        <Form.Item
          label="Image"
          name="image"
          valuePropName="file"
          rules={[
            { required: true, message: "Please upload a category image!" },
          ]}
        >
          <Upload
            name="image"
            listType="picture"
            maxCount={1}
            beforeUpload={() => false} // Prevent automatic upload
          >
            <Button icon={<UploadOutlined />}>Click to Upload</Button>
          </Upload>
        </Form.Item>

        <Form.Item
          label="Enabled"
          name="enabled"
          valuePropName="checked"
        >
          <Switch defaultChecked />
        </Form.Item>

        <Form.Item
          label="Featured"
          name="featured"
          valuePropName="checked"
        >
          <Switch defaultChecked />
        </Form.Item>

        <Form.Item
          label="Top"
          name="top"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            {loading ? "Creating..." : "Create Category"}
          </Button>
        </Form.Item>
      </Form>
    </motion.div>
  );
};

export default CreateCategory;
