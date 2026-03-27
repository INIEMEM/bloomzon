import React, { useContext, useEffect, useState } from "react";
import { Button, Form, Input, Modal, Space, Table, notification } from "antd";
import { motion } from "framer-motion";
import Axios from "axios";
import { MainContext } from "../../Context/Context";
import { COUNTRY_BASE_URL, REGION_BASE_URL, getAuthHeaders } from "../../api/config";
import "./seller.css";

const RegionManagement = () => {
  const { token } = useContext(MainContext);
  const [regions, setRegions] = useState([]);
  const [filteredRegions, setFilteredRegions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [form] = Form.useForm();

  const fetchRegions = async () => {
    setLoading(true);
    try {
      const response = await Axios.get(REGION_BASE_URL, {
        headers: getAuthHeaders(token),
      });

      const items = response.data?.data || [];
      setRegions(items);
      setFilteredRegions(items);
    } catch (error) {
      notification.error({ message: "Error fetching regions" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegions();
  }, [token]);

  const viewRegionDetails = async (regionId) => {
    try {
      const [regionResponse, countryResponse] = await Promise.all([
        Axios.get(`${REGION_BASE_URL}/${regionId}`, {
          headers: getAuthHeaders(token),
        }),
        Axios.get(`${COUNTRY_BASE_URL}/region/${regionId}`, {
          headers: getAuthHeaders(token),
        }),
      ]);

      const region = regionResponse.data?.data;
      const countries = countryResponse.data?.data?.countries || [];

      Modal.info({
        title: "Region Details",
        width: 920,
        content: (
          <div style={{ marginTop: 16 }}>
            <p>
              <b>ID:</b> {region?.id}
            </p>
            <p>
              <b>Name:</b> {region?.name}
            </p>
            <Table
              dataSource={countries}
              rowKey="id"
              pagination={false}
              className="admin-table"
              columns={[
                { title: "Country", dataIndex: "name", key: "name" },
                { title: "ISO2", dataIndex: "iso2", key: "iso2" },
                { title: "ISO3", dataIndex: "iso3", key: "iso3" },
                { title: "Status", dataIndex: "status", key: "status" },
              ]}
            />
          </div>
        ),
      });
    } catch (error) {
      notification.error({ message: "Error fetching region details" });
    }
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      if (selectedRegion) {
        await Axios.put(`${REGION_BASE_URL}/${selectedRegion.id}`, values, {
          headers: getAuthHeaders(token),
        });
      } else {
        await Axios.post(REGION_BASE_URL, values, {
          headers: getAuthHeaders(token),
        });
      }

      notification.success({
        message: `Region ${selectedRegion ? "updated" : "created"} successfully`,
      });
      form.resetFields();
      setIsModalOpen(false);
      setSelectedRegion(null);
      fetchRegions();
    } catch (error) {
      notification.error({
        message: error?.response?.data?.message || "Failed to save region",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteRegion = async (regionId) => {
    setLoading(true);
    try {
      await Axios.delete(`${REGION_BASE_URL}/${regionId}`, {
        headers: getAuthHeaders(token),
      });
      notification.success({ message: "Region deleted successfully" });
      fetchRegions();
    } catch (error) {
      notification.error({
        message: error?.response?.data?.message || "Failed to delete region",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchText(value);
    setFilteredRegions(
      regions.filter((region) =>
        String(region.name || "").toLowerCase().includes(value),
      ),
    );
  };

  const columns = [
    {
      title: "S/N",
      key: "serialNumber",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
      render: (value, record) => {
        const date = value || record.createdAt;
        return date ? new Date(date).toLocaleString() : "N/A";
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => viewRegionDetails(record.id)}>
            View
          </Button>
          <Button
            type="link"
            onClick={() => {
              setSelectedRegion(record);
              form.setFieldsValue({ name: record.name });
              setIsModalOpen(true);
            }}
          >
            Edit
          </Button>
          <Button type="link" danger onClick={() => deleteRegion(record.id)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: "5vw" }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: "-5vw" }}
      transition={{ duration: 0.5 }}
      style={{ padding: 20 }}
    >
      <div className="flex flex-justify-between">
        <div>
          <h1>Region Management</h1>
          <Space style={{ marginBottom: 20 }}>
            <Input
              placeholder="Search region"
              value={searchText}
              onChange={handleSearch}
              style={{ width: 300 }}
            />
          </Space>
        </div>
        <Button
          type="primary"
          style={{ background: "var(--primary-color)" }}
          onClick={() => {
            setSelectedRegion(null);
            form.resetFields();
            setIsModalOpen(true);
          }}
        >
          Add Region
        </Button>
      </div>

      <Table
        dataSource={filteredRegions}
        columns={columns}
        loading={loading}
        rowKey="id"
        className="admin-table"
      />

      <Modal
        title={selectedRegion ? "Edit Region" : "Add Region"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        confirmLoading={loading}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please enter the region name" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </motion.div>
  );
};

export default RegionManagement;
