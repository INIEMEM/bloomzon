import React, { useContext, useEffect, useMemo, useState } from "react";
import { Button, Form, Input, Modal, Select, Switch, Table, message, Drawer, Popconfirm, Space } from "antd";
import { motion } from "framer-motion";
import axios from "axios";
import { MainContext } from "../../Context/MainContext";
import {
  COUNTRY_BASE_URL,
  CURRENCY_BASE_URL,
  REGION_BASE_URL,
  STATE_BASE_URL,
  CITY_BASE_URL,
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

  // State Management hooks/states
  const [countryStates, setCountryStates] = useState({});
  const [loadingStates, setLoadingStates] = useState({});
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCountryForState, setSelectedCountryForState] = useState(null);
  const [stateModalOpen, setStateModalOpen] = useState(false);
  const [stateModalLoading, setStateModalLoading] = useState(false);
  const [stateForm] = Form.useForm();

  // City Management hooks/states
  const [cityDrawerOpen, setCityDrawerOpen] = useState(false);
  const [cities, setCities] = useState([]);
  const [loadingCities, setLoadingCities] = useState(false);
  const [cityModalOpen, setCityModalOpen] = useState(false);
  const [cityModalLoading, setCityModalLoading] = useState(false);
  const [selectedCity, setSelectedCity] = useState(null);
  const [cityForm] = Form.useForm();

  const headers = useMemo(() => getAuthHeaders(token), [token]);

  // State API operations
  const fetchStates = async (countryId) => {
    try {
      setLoadingStates((prev) => ({ ...prev, [countryId]: true }));
      const response = await axios.get(`${STATE_BASE_URL}/country/${countryId}`, { headers });
      setCountryStates((prev) => ({ ...prev, [countryId]: response.data?.data?.states || [] }));
    } catch (error) {
      message.error("Error fetching states for this country");
    } finally {
      setLoadingStates((prev) => ({ ...prev, [countryId]: false }));
    }
  };

  const handleStateFormSubmit = async () => {
    const formData = stateForm.getFieldsValue();
    const payload = {
      ...formData,
      country_id: Number(selectedCountryForState.id),
      status: formData.status ? 1 : 0,
    };

    try {
      setStateModalLoading(true);
      if (selectedState) {
        await axios.put(`${STATE_BASE_URL}/${selectedState.id}`, payload, { headers });
        message.success("State updated successfully");
      } else {
        await axios.post(STATE_BASE_URL, payload, { headers });
        message.success("State added successfully");
      }

      setStateModalOpen(false);
      setSelectedState(null);
      stateForm.resetFields();
      fetchStates(selectedCountryForState.id);
    } catch (error) {
      message.error(error?.response?.data?.message || "Error saving state data");
    } finally {
      setStateModalLoading(false);
    }
  };

  const handleDeleteState = async (stateId, countryId) => {
    try {
      await axios.delete(`${STATE_BASE_URL}/${stateId}`, { headers });
      message.success("State deleted successfully");
      fetchStates(countryId);
    } catch (error) {
      message.error(error?.response?.data?.message || "Error deleting state");
    }
  };

  // City API operations
  const fetchCities = async (stateId) => {
    try {
      setLoadingCities(true);
      const response = await axios.get(`${CITY_BASE_URL}/state/${stateId}`, { headers });
      setCities(response.data?.data?.cities || []);
    } catch (error) {
      message.error("Error fetching cities for this state");
    } finally {
      setLoadingCities(false);
    }
  };

  const handleCityFormSubmit = async () => {
    const formData = cityForm.getFieldsValue();
    const payload = {
      ...formData,
      state_id: Number(selectedState.id),
      status: formData.status ? 1 : 0,
    };

    try {
      setCityModalLoading(true);
      if (selectedCity) {
        await axios.put(`${CITY_BASE_URL}/${selectedCity.id}`, payload, { headers });
        message.success("City updated successfully");
      } else {
        await axios.post(CITY_BASE_URL, payload, { headers });
        message.success("City added successfully");
      }

      setCityModalOpen(false);
      setSelectedCity(null);
      cityForm.resetFields();
      fetchCities(selectedState.id);
    } catch (error) {
      message.error(error?.response?.data?.message || "Error saving city data");
    } finally {
      setCityModalLoading(false);
    }
  };

  const handleDeleteCity = async (cityId) => {
    try {
      await axios.delete(`${CITY_BASE_URL}/${cityId}`, { headers });
      message.success("City deleted successfully");
      fetchCities(selectedState.id);
    } catch (error) {
      message.error(error?.response?.data?.message || "Error deleting city");
    }
  };

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
        expandable={{
          expandedRowRender: (countryRecord) => {
            const statesList = countryStates[countryRecord.id] || [];
            const isLoading = loadingStates[countryRecord.id] || false;

            const stateColumns = [
              {
                title: "S/N",
                key: "sNo",
                render: (_, __, index) => index + 1,
                width: 60,
              },
              {
                title: "State Name",
                dataIndex: "name",
                key: "name",
              },
              {
                title: "Code",
                dataIndex: "code",
                key: "code",
              },
              {
                title: "Status",
                key: "status",
                render: (_, record) => (record.status === 1 ? "Active" : "Inactive"),
              },
              {
                title: "Actions",
                key: "actions",
                width: 250,
                render: (_, record) => (
                  <Space size="middle">
                    <Button
                      type="link"
                      onClick={() => {
                        setSelectedCountryForState(countryRecord);
                        setSelectedState(record);
                        stateForm.setFieldsValue({
                          name: record.name,
                          code: record.code,
                          status: record.status === 1,
                        });
                        setStateModalOpen(true);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      type="link"
                      onClick={() => {
                        setSelectedState(record);
                        setCityDrawerOpen(true);
                        fetchCities(record.id);
                      }}
                    >
                      Manage Cities
                    </Button>
                    <Popconfirm
                      title="Are you sure you want to delete this state?"
                      onConfirm={() => handleDeleteState(record.id, countryRecord.id)}
                      okText="Yes"
                      cancelText="No"
                    >
                      <Button type="link" danger>
                        Delete
                      </Button>
                    </Popconfirm>
                  </Space>
                ),
              },
            ];

            return (
              <div style={{ margin: 10, padding: "10px 20px", background: "#fafafa", borderRadius: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <h4 style={{ margin: 0 }}>States of {countryRecord.name}</h4>
                  <Button
                    type="dashed"
                    size="small"
                    onClick={() => {
                      setSelectedCountryForState(countryRecord);
                      setSelectedState(null);
                      stateForm.resetFields();
                      stateForm.setFieldsValue({ status: true });
                      setStateModalOpen(true);
                    }}
                  >
                    Add State
                  </Button>
                </div>
                <Table
                  columns={stateColumns}
                  dataSource={statesList}
                  rowKey="id"
                  pagination={false}
                  loading={isLoading}
                  size="small"
                />
              </div>
            );
          },
          onExpand: (expanded, record) => {
            if (expanded) {
              fetchStates(record.id);
            }
          },
        }}
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

      {/* State Management Modal */}
      <Modal
        title={selectedState ? "Edit State" : "Add State"}
        open={stateModalOpen}
        onOk={handleStateFormSubmit}
        onCancel={() => setStateModalOpen(false)}
        okText={selectedState ? "Update" : "Create"}
        confirmLoading={stateModalLoading}
      >
        <Form
          form={stateForm}
          layout="vertical"
          initialValues={{
            status: true,
          }}
        >
          <Form.Item
            name="name"
            label="State Name"
            rules={[{ required: true, message: "Please enter the state name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="code"
            label="State Code"
            rules={[{ required: true, message: "Please enter the state code" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="status" label="Active" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>

      {/* City Management Drawer */}
      <Drawer
        title={selectedState ? `Cities in ${selectedState.name}` : "Manage Cities"}
        placement="right"
        width={600}
        onClose={() => setCityDrawerOpen(false)}
        open={cityDrawerOpen}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h3 style={{ margin: 0 }}>City Registry</h3>
          <Button
            type="primary"
            onClick={() => {
              setSelectedCity(null);
              cityForm.resetFields();
              cityForm.setFieldsValue({ status: true });
              setCityModalOpen(true);
            }}
          >
            Add City
          </Button>
        </div>
        <Table
          columns={[
            {
              title: "S/N",
              key: "sNo",
              render: (_, __, index) => index + 1,
              width: 60,
            },
            {
              title: "City Name",
              dataIndex: "name",
              key: "name",
            },
            {
              title: "Status",
              key: "status",
              render: (_, record) => (record.status === 1 ? "Active" : "Inactive"),
            },
            {
              title: "Actions",
              key: "actions",
              width: 150,
              render: (_, record) => (
                <Space size="middle">
                  <Button
                    type="link"
                    onClick={() => {
                      setSelectedCity(record);
                      cityForm.setFieldsValue({
                        name: record.name,
                        status: record.status === 1,
                      });
                      setCityModalOpen(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Popconfirm
                    title="Are you sure you want to delete this city?"
                    onConfirm={() => handleDeleteCity(record.id)}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button type="link" danger>
                      Delete
                    </Button>
                  </Popconfirm>
                </Space>
              ),
            },
          ]}
          dataSource={cities}
          rowKey="id"
          loading={loadingCities}
          pagination={{ pageSize: 10 }}
        />
      </Drawer>

      {/* City Add/Edit Modal */}
      <Modal
        title={selectedCity ? "Edit City" : "Add City"}
        open={cityModalOpen}
        onOk={handleCityFormSubmit}
        onCancel={() => setCityModalOpen(false)}
        okText={selectedCity ? "Update" : "Create"}
        confirmLoading={cityModalLoading}
      >
        <Form
          form={cityForm}
          layout="vertical"
          initialValues={{
            status: true,
          }}
        >
          <Form.Item
            name="name"
            label="City Name"
            rules={[{ required: true, message: "Please enter the city name" }]}
          >
            <Input />
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
