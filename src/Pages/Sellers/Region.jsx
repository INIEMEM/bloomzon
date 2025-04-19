import React, { useState, useEffect, useContext } from "react";
import { Table, Button, Modal, Form, Input, notification, Space } from "antd";
import Axios from "axios";
import { motion } from "framer-motion";
import { MainContext } from "../../Context/Context";
import { useNavigate } from "react-router-dom";
import './seller.css'
const RegionManagement = () => {
  const [regions, setRegions] = useState([]);
  const [filteredRegions, setFilteredRegions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [form] = Form.useForm();
  const { baseUrl, token } = useContext(MainContext);
  const navigate = useNavigate()
  // Fetch all regions
  const fetchRegions = async () => {
    setLoading(true);
    try {
      const response = await Axios.get(`${baseUrl}api/v1/region`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        setRegions(response.data.data);
        setFilteredRegions(response.data.data);
      } else {
        notification.error({ message: "Failed to fetch regions" });
      }
    } catch (error) {
      console.error(error);
      notification.error({ message: "Error fetching regions" });
      if(error?.response?.statusText == "Unauthorized"){
        navigate('../../')
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegions();
  }, []);

  // View region details
  const viewRegionDetails = async (regionId) => {
    try {
      const regionResponse = await Axios.get(
        `${baseUrl}api/v1/region/one?regionId=${regionId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      if (regionResponse.data.success) {
        const countryResponse = await Axios.get(`${baseUrl}api/v1/country`, {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        if (countryResponse.data.success) {
          const countries = countryResponse.data.data.filter(
            (country) => country.RegionId === regionId
          );
          
          // <Modal
          //   title= "Region Details"
          //   open={isModalOpen}
          //   onCancel={() => setIsModalOpen(false)}
          //   footer={null}
          //   >
              
          // </Modal>

          Modal.info({
            title: "Region Details",
            className: "custom-modal",
            content: (
              <div style={{ width: "700px" }}>
                <p>
                  <b>ID:</b> {regionResponse.data.data.id}
                </p>
                <p>
                  <b>Name:</b> {regionResponse.data.data.name}
                </p>
                <p>
                  <b>Created At:</b>{" "}
                  {new Date(regionResponse.data.data.createdAt).toLocaleString()}
                </p>
                <p>
                  <b>Updated At:</b>{" "}
                  {new Date(regionResponse.data.data.updatedAt).toLocaleString()}
                </p>
                <h3>Countries:</h3>
                <Table
                  dataSource={countries.map((country) => ({
                    key: country.id,
                    name: country.name,
                    capital: country.capital,
                    population: country.population,
                    currency: country.currency,
                    statesCount: country.States.length,
                  }))}
                  className="admin-table"
                  style={{boxShadow:'none'}}
                  columns={[
                    {
                      title: "Name",
                      dataIndex: "name",
                      key: "name",
                    },
                    {
                      title: "Capital",
                      dataIndex: "capital",
                      key: "capital",
                    },
                    {
                      title: "Population",
                      dataIndex: "population",
                      key: "population",
                    },
                    {
                      title: "Currency",
                      dataIndex: "currency",
                      key: "currency",
                    },
                    {
                      title: "Number of States",
                      dataIndex: "statesCount",
                      key: "statesCount",
                    },
                  ]}
                  pagination={true}
                />
              </div>
            ),
            onOk() {},
            
          });
        } else {
          notification.error({ message: "Failed to fetch countries" });
        }
      } else {
        notification.error({ message: "Failed to fetch region details" });
      }
    } catch (error) {
      console.error(error);
      notification.error({ message: "Error fetching region details" });
    }
  };
  

  // Create or edit region
  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const endpoint = `${baseUrl}api/v1/region/register`;
      const data =
         { name: values.name };
      const response = await Axios.post(endpoint, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        notification.success({ message: `Region ${isEditing ? "updated" : "created"} successfully` });
        fetchRegions();
        form.resetFields();
        setIsModalOpen(false);
        setIsEditing(false);
        setSelectedRegion(null);
      } else {
        notification.error({ message: `Failed to ${isEditing ? "update" : "create"} region` });
      }
    } catch (error) {
      console.error(error);
      notification.error({ message: `Error ${isEditing ? "updating" : "creating"} region` });
    } finally {
      setLoading(false);
    }
  };

  // Delete region
  const deleteRegion = async (regionId) => {
    setLoading(true);
    try {
      const response = await Axios.post(
        `${baseUrl}api/v1/region/remove`,
        { regionId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.data.success) {
        notification.success({ message: "Region deleted successfully" });
        fetchRegions();
      } else {
        notification.error({ message: "Failed to delete region" });
      }
    } catch (error) {
      console.error(error);
      notification.error({ message: "Error deleting region" });
    } finally {
      setLoading(false);
    }
  };

  const editRegion = async (values) => {
    setLoading(true);
    try {
      const endpoint = `${baseUrl}api/v1/region/update`;
      const data = 
       { regionId: selectedRegion.id, name: values.name }
       
      const response = await Axios.put(endpoint, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        notification.success({ message: `Region ${isEditing ? "updated" : "created"} successfully` });
        fetchRegions();
        form.resetFields();
        setIsModalOpen(false);
        setIsEditing(false);
        setSelectedRegion(null);
      } else {
        notification.error({ message: `Failed to ${isEditing ? "update" : "create"} region` });
      }
    } catch (error) {
      console.error(error);
      notification.error({ message: `Error ${isEditing ? "updating" : "creating"} region` });
    } finally {
      setLoading(false);
    }
  }

  // Handle search
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);
    const filtered = regions.filter((region) =>
      region.name.toLowerCase().includes(value)
    );
    setFilteredRegions(filtered);
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
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleString(),
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
              setIsEditing(true);
              setSelectedRegion(record);
              setIsModalOpen(true);
              form.setFieldsValue({ name: record.name });
            }}
          >
            Edit
          </Button>
          <Button
            type="link"
            danger
            onClick={() => deleteRegion(record.id)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  const pageVariants = {
    initial: { opacity: 0, x: "5vw" },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: "-5vw" },
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={{ duration: 0.5 }}
      style={{padding:20}}
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
        <div className="flex" style={{marginBottom:20}}>
      <Button
          type="primary"
          onClick={() => {
            setIsModalOpen(true);
            form.resetFields();
            setIsEditing(false);
            setSelectedRegion(null);
          }}
          style={{background: 'var(--primary-color)'}}
        >
          Add Region
        </Button>
      </div>
      </div>
      
      <Table
        columns={columns}
        dataSource={filteredRegions}
        rowKey="id"
        loading={loading}
        bordered
        className="admin-table"
      />

      <Modal
        title={isEditing ? "Edit Region" : "Add Region"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form form={form} onFinish={isEditing ? editRegion: handleSubmit} layout="vertical">
          <Form.Item
            name="name"
            label="Region Name"
            rules={[{ required: true, message: "Please enter the region name" }]}
          >
            <Input placeholder="Enter region name" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              {isEditing ? "Update" : "Create"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </motion.div>
  );
};

export default RegionManagement;
