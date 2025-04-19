import React, { useEffect, useState, useContext } from "react";
import { Table, Button, Modal, Spin, message } from "antd";
import { motion } from "framer-motion";
import { MainContext } from "../../Context/Context";
import axios from "axios";


// const baseURL = "https://yourapiurl.com/api/v1/shipping"; // Replace with your base URL.

const ShippingList = () => {
  const [loading, setLoading] = useState(false);
  const [shippingData, setShippingData] = useState([]);
  const {baseUrl, token} = useContext(MainContext)
  
  // Fetch all shipping methods
  const fetchShippingMethods = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${baseUrl}api/v1/shipping`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShippingData(response.data.data);
    } catch (error) {
      message.error("Failed to fetch shipping methods.");
      if(error?.response?.statusText == "Unauthorized"){
        navigate('../../')
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShippingMethods();
  }, []);

  const deleteShippingMethod = async (id) => {
    Modal.confirm({
      title: "Are you sure you want to delete this shipping method?",
      onOk: async () => {
        setLoading(true);
        try {
          axios.delete(`${baseUrl}api/v1/shipping/remove`, { shippingId: id }, {
            headers: { Authorization: `Bearer ${token}` },
          });
          message.success("Shipping method deleted.");
          fetchShippingMethods(); // Refresh data
        } catch (error) {
          message.error("Failed to delete shipping method.");
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Rate",
      dataIndex: "rate",
      key: "rate",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <span>
          <Button type="link" href={`/dashboard/sellers/shipping/edit/${record.id}`}>
            Edits
          </Button>
          <Button type="link" danger onClick={() => deleteShippingMethod(record.id)}>
            Delete
          </Button>
        </span>
      ),
    },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{padding:20}}>
      <h1>Shipping</h1>
      <Spin spinning={loading}>
        <Button type="primary" href="/dashboard/sellers/shipping/edit/2" style={{ marginBottom: 20, background: 'var(--primary-color)' }}>
          Add Shipping Method
        </Button>
        <Table columns={columns} dataSource={shippingData} className="admin-table" rowKey="id" />
      </Spin>
    </motion.div>
  );
};

export default ShippingList;
