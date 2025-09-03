import React, { useEffect, useState } from "react";
import { Card, Form, InputNumber, Button, message, Spin } from "antd";
import axios from "axios";
import { motion } from "framer-motion";

const BloomzonTVSettings = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const res = await axios.get(
        "https://bloomzonserver.onrender.com/bloomzonlive/admin/bloomzon-tv-settings"
      );
      const data = res.data;
      form.setFieldsValue({
        pricerPerMinute: parseFloat(data.pricerPerMinute),
        maxConcurrentSessionsInMinutes: data.maxConcurrentSessionsInMinutes,
        minSessionDurationInMinutes: data.minSessionDurationInMinutes,
      });
    } catch (error) {
      message.error("Failed to load settings");
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await axios.put(
        "https://bloomzonserver.onrender.com/bloomzonlive/admin/bloomzon-tv-settings",
        {
          id: 1, // always ID = 1 as per API
          ...values,
        }
      );
      message.success("Settings updated successfully!");
    } catch (error) {
      message.error("Failed to update settings");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="p-6 flex justify-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card
        title="Bloomzon TV Settings"
        className="w-full max-w-2xl shadow-lg rounded-2xl"
      >
        {initialLoading ? (
          <div className="flex justify-center py-10">
            <Spin size="large" />
          </div>
        ) : (
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{
              pricerPerMinute: 0,
              maxConcurrentSessionsInMinutes: 0,
              minSessionDurationInMinutes: 0,
            }}
          >
            <Form.Item
              label="Price Per Minute"
              name="pricerPerMinute"
              rules={[{ required: true, message: "Enter price per minute" }]}
            >
              <InputNumber
                min={1}
                step={1}
                className="w-full"
                formatter={(val) => `$ ${val}`}
              />
            </Form.Item>

            <Form.Item
              label="Max Concurrent Sessions (minutes)"
              name="maxConcurrentSessionsInMinutes"
              rules={[{ required: true, message: "Enter max concurrent session duration" }]}
            >
              <InputNumber min={1} step={1} className="w-full" />
            </Form.Item>

            <Form.Item
              label="Minimum Session Duration (minutes)"
              name="minSessionDurationInMinutes"
              rules={[{ required: true, message: "Enter min session duration" }]}
            >
              <InputNumber min={1} step={1} className="w-full" />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className="bg-blue-600"
              >
                Save Settings
              </Button>
            </Form.Item>
          </Form>
        )}
      </Card>
    </motion.div>
  );
};

export default BloomzonTVSettings;
