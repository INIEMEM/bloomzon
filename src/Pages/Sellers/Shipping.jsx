import React, { useContext, useEffect, useState } from "react";
import { Button, Modal, Spin, Table, message } from "antd";
import { motion } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MainContext } from "../../Context/Context";
import { SHIPPING_BASE_URL, getAuthHeaders } from "../../api/config";

const ShippingList = () => {
  const { token } = useContext(MainContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [shippingData, setShippingData] = useState([]);

  const fetchShippingCategories = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${SHIPPING_BASE_URL}/categories`, {
        headers: getAuthHeaders(token),
      });
      setShippingData(response.data?.data || []);
    } catch (error) {
      message.error("Failed to fetch logistics categories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShippingCategories();
  }, [token]);

  const deleteShippingCategory = async (id) => {
    Modal.confirm({
      title: "Are you sure you want to delete this logistics category?",
      onOk: async () => {
        setLoading(true);
        try {
          await axios.delete(`${SHIPPING_BASE_URL}/categories/${id}`, {
            headers: getAuthHeaders(token),
          });
          message.success("Logistics category deleted.");
          fetchShippingCategories();
        } catch (error) {
          message.error(
            error?.response?.data?.message || "Failed to delete logistics category.",
          );
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
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (value) => (Number(value) === 1 ? "Active" : "Inactive"),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <span>
          <Button
            type="link"
            onClick={() =>
              navigate(`/dashboard/sellers/shipping/edit/${record.id}`)
            }
          >
            Edit
          </Button>
          <Button type="link" danger onClick={() => deleteShippingCategory(record.id)}>
            Delete
          </Button>
        </span>
      ),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ padding: 20 }}
    >
      <h1>Shipping</h1>
      <Spin spinning={loading}>
        <Button
          type="primary"
          onClick={() => navigate("/dashboard/sellers/shipping/edit/new")}
          style={{ marginBottom: 20, background: "var(--primary-color)" }}
        >
          Add Logistics Category
        </Button>
        <Table
          columns={columns}
          dataSource={shippingData}
          className="admin-table"
          rowKey="id"
        />
      </Spin>
    </motion.div>
  );
};

export default ShippingList;
