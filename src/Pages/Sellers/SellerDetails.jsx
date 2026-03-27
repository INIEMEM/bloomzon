import React, { useContext, useEffect, useMemo, useState } from "react";
import { Alert, Card, Col, Descriptions, Empty, Row, Spin, Table, Tag } from "antd";
import { motion } from "framer-motion";
import Axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import UserMatrxs from "../../Components/UserMatrixs/UserMatrxs";
import { MainContext } from "../../Context/Context";
import { ADMIN_BASE_URL, getAuthHeaders } from "../../api/config";

const SellerDetails = () => {
  const { seller } = useParams();
  const { token } = useContext(MainContext);
  const navigate = useNavigate();
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setLoading(true);
        const response = await Axios.get(`${ADMIN_BASE_URL}/users/${seller}`, {
          headers: getAuthHeaders(token),
        });

        setDetails(response.data?.data || null);
      } catch (err) {
        setError("Failed to fetch user details.");
        if (err?.response?.status === 401 || err?.response?.status === 403) {
          navigate("/");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [navigate, seller, token]);

  const user = details?.user;
  const stores = details?.stores || [];
  const recentOrders = details?.recentOrders || [];
  const overview = details?.overview || {};

  const statusLabel = useMemo(() => {
    if (!user) {
      return "Unknown";
    }

    if (user.adminBanned) {
      return "Banned";
    }

    if (user.adminLocked) {
      return "Suspended";
    }

    return "Active";
  }, [user]);

  const storeColumns = [
    { title: "Store", dataIndex: "name", key: "name" },
    { title: "Code", dataIndex: "code", key: "code" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (value) => <Tag color={Number(value) === 1 ? "green" : "orange"}>{Number(value) === 1 ? "Active" : "Inactive"}</Tag>,
    },
    {
      title: "Verified",
      dataIndex: "is_verified",
      key: "is_verified",
      render: (value) => (value ? "Yes" : "No"),
    },
    {
      title: "Created",
      dataIndex: "created_at",
      key: "created_at",
      render: (value) => (value ? new Date(value).toLocaleString() : "N/A"),
    },
  ];

  const orderColumns = [
    { title: "Order", dataIndex: "order_number", key: "order_number" },
    { title: "Tracking", dataIndex: "tracking_id", key: "tracking_id" },
    { title: "Order Status", dataIndex: "order_status", key: "order_status" },
    { title: "Payment Status", dataIndex: "payment_status", key: "payment_status" },
    {
      title: "Amount",
      key: "amount",
      render: (_, record) =>
        `${record.currency_code || ""} ${record.total_amount || 0}`.trim(),
    },
    {
      title: "Created",
      dataIndex: "created_at",
      key: "created_at",
      render: (value) => (value ? new Date(value).toLocaleString() : "N/A"),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
      style={{ padding: 20 }}
    >
      <h1>{user?.name || "User"} Details</h1>

      {loading ? <Spin tip="Loading user details..." /> : null}
      {!loading && error ? <Alert message={error} type="error" showIcon /> : null}

      {!loading && !error && user ? (
        <>
          <div className="flex" style={{ gap: 20, marginBottom: 20 }}>
            <UserMatrxs matrix={stores.length} title="Stores" border={true} />
            <UserMatrxs
              matrix={overview.totalOrders || recentOrders.length || 0}
              title="Orders"
              border={true}
            />
            <UserMatrxs matrix={statusLabel} title="Account Status" border={true} />
          </div>

          <Row gutter={[16, 16]}>
            <Col xs={24} lg={12}>
              <Card title="User Details">
                <Descriptions column={1} bordered size="small">
                  <Descriptions.Item label="Full Name">
                    {user.name || "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Email">
                    {user.email || "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Phone">
                    {user.phone || "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Role">
                    {String(user.role || "buyer").toUpperCase()}
                  </Descriptions.Item>
                  <Descriptions.Item label="Verified">
                    {user.isVerified ? "Yes" : "No"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Created At">
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleString()
                      : "N/A"}
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            </Col>

            <Col xs={24} lg={12}>
              <Card title="Overview">
                <Descriptions column={1} bordered size="small">
                  {Object.keys(overview).length ? (
                    Object.entries(overview).map(([key, value]) => (
                      <Descriptions.Item key={key} label={key}>
                        {typeof value === "object" ? JSON.stringify(value) : String(value)}
                      </Descriptions.Item>
                    ))
                  ) : (
                    <Descriptions.Item label="Overview">No overview data</Descriptions.Item>
                  )}
                </Descriptions>
              </Card>
            </Col>
          </Row>

          <Card title="Stores" style={{ marginTop: 20 }}>
            {stores.length ? (
              <Table
                columns={storeColumns}
                dataSource={stores}
                rowKey="id"
                pagination={false}
                className="admin-table"
              />
            ) : (
              <Empty description="No stores found" />
            )}
          </Card>

          <Card title="Recent Orders" style={{ marginTop: 20 }}>
            {recentOrders.length ? (
              <Table
                columns={orderColumns}
                dataSource={recentOrders}
                rowKey={(record) => record.id || record.order_number}
                pagination={{ pageSize: 10 }}
                className="admin-table"
              />
            ) : (
              <Empty description="No recent orders found" />
            )}
          </Card>
        </>
      ) : null}
    </motion.div>
  );
};

export default SellerDetails;
