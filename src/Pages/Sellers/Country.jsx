import React, { useContext, useEffect, useMemo, useState } from "react";
import { Button, Form, Input, Modal, Select, Switch, Table, message } from "antd";
import { motion } from "framer-motion";
import axios from "axios";
import { MainContext } from "../../Context/Context";
import {
  COUNTRY_BASE_URL,
  CURRENCY_BASE_URL,
  REGION_BASE_URL,
  getAuthHeaders,
} from "../../api/config";

const CountryManagement = () => {
  const { token } = useContext(MainContext);
  const [countries, setCountries] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [regions, setRegions] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const headers = useMemo(() => getAuthHeaders(token), [token]);

  const fetchLookupData = async () => {
    const [regionResponse, currencyResponse] = await Promise.all([
      axios.get(REGION_BASE_URL, { headers }),
      axios.get(CURRENCY_BASE_URL, { headers }),
    ]);

    setRegions(regionResponse.data?.data || []);
    setCurrencies(currencyResponse.data?.data || []);
  };

  const fetchCountries = async () => {
    try {
      setLoading(true);
      const response = await axios.get(COUNTRY_BASE_URL, { headers });
      setCountries(response.data?.data || []);
    } catch (error) {
      message.error("Error fetching countries");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLookupData();
    fetchCountries();
  }, [headers]);

  const filteredCountries = countries.filter((country) => {
    const query = searchQuery.toLowerCase();
    return (
      String(country.name || "").toLowerCase().includes(query) ||
      String(country.iso2 || "").toLowerCase().includes(query) ||
      String(country.iso3 || "").toLowerCase().includes(query)
    );
  });

  const regionMap = new Map(regions.map((item) => [item.id, item.name]));
  const currencyMap = new Map(
    currencies.map((item) => [item.id, `${item.name} (${item.code})`]),
  );

  const handleViewDetails = async (countryId) => {
    try {
      const response = await axios.get(`${COUNTRY_BASE_URL}/${countryId}`, {
        headers,
      });

      const details = response.data?.data;
      setSelectedCountry(details);
      form.setFieldsValue({
        ...details,
        status: Number(details?.status ?? 1) === 1,
      });
      setIsModalOpen(true);
    } catch (error) {
      message.error("Error fetching country details");
    }
  };

  const handleFormSubmit = async () => {
    const formData = form.getFieldsValue();
    const payload = {
      ...formData,
      status: formData.status ? 1 : 0,
    };

    try {
      setLoading(true);
      if (selectedCountry) {
        await axios.put(`${COUNTRY_BASE_URL}/${selectedCountry.id}`, payload, {
          headers,
        });
        message.success("Country updated successfully");
      } else {
        await axios.post(COUNTRY_BASE_URL, payload, { headers });
        message.success("Country added successfully");
      }

      setIsModalOpen(false);
      setSelectedCountry(null);
      form.resetFields();
      fetchCountries();
    } catch (error) {
      message.error(error?.response?.data?.message || "Error saving country data");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCountry = async (countryId) => {
    try {
      await axios.delete(`${COUNTRY_BASE_URL}/${countryId}`, { headers });
      message.success("Country deleted successfully");
      fetchCountries();
    } catch (error) {
      message.error(error?.response?.data?.message || "Error deleting country");
    }
  };

  const columns = [
    {
      title: "S/N",
      key: "sNo",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "ISO2",
      dataIndex: "iso2",
      key: "iso2",
    },
    {
      title: "ISO3",
      dataIndex: "iso3",
      key: "iso3",
    },
    {
      title: "Region",
      key: "region",
      render: (_, record) => regionMap.get(record.region_id) || record.region_id,
    },
    {
      title: "Currency",
      key: "currency",
      render: (_, record) =>
        currencyMap.get(record.currency_id) || record.currency_id,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <>
          <Button type="link" onClick={() => handleViewDetails(record.id)}>
            Edit
          </Button>
          <Button type="link" danger onClick={() => handleDeleteCountry(record.id)}>
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      transition={{ duration: 0.5 }}
      style={{ padding: 20 }}
    >
      <h1>Country Management</h1>
      <Input
        placeholder="Search by name or ISO code"
        value={searchQuery}
        onChange={(event) => setSearchQuery(event.target.value)}
        style={{ marginBottom: 20, width: "100%" }}
      />
      <Button
        type="primary"
        style={{ marginBottom: 20, background: "var(--primary-color)" }}
        onClick={() => {
          setSelectedCountry(null);
          form.resetFields();
          form.setFieldsValue({ status: true });
          setIsModalOpen(true);
        }}
      >
        Add Country
      </Button>

      <Table
        columns={columns}
        dataSource={filteredCountries}
        rowKey="id"
        className="admin-table"
        loading={loading}
      />

      <Modal
        title={selectedCountry ? "Edit Country" : "Add Country"}
        open={isModalOpen}
        onOk={handleFormSubmit}
        onCancel={() => setIsModalOpen(false)}
        okText={selectedCountry ? "Update" : "Create"}
        confirmLoading={loading}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            status: true,
          }}
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please enter the country name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="iso2"
            label="ISO2"
            rules={[{ required: true, message: "Please enter the ISO2 code" }]}
          >
            <Input maxLength={2} />
          </Form.Item>
          <Form.Item
            name="iso3"
            label="ISO3"
            rules={[{ required: true, message: "Please enter the ISO3 code" }]}
          >
            <Input maxLength={3} />
          </Form.Item>
          <Form.Item
            name="region_id"
            label="Region"
            rules={[{ required: true, message: "Please select a region" }]}
          >
            <Select
              options={regions.map((region) => ({
                value: region.id,
                label: region.name,
              }))}
            />
          </Form.Item>
          <Form.Item
            name="currency_id"
            label="Currency"
            rules={[{ required: true, message: "Please select a currency" }]}
          >
            <Select
              options={currencies.map((currency) => ({
                value: currency.id,
                label: `${currency.name} (${currency.code})`,
              }))}
            />
          </Form.Item>
          <Form.Item name="flag" label="Flag URL">
            <Input placeholder="https://..." />
          </Form.Item>
          <Form.Item name="status" label="Active" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </motion.div>
  );
};

export default CountryManagement;
