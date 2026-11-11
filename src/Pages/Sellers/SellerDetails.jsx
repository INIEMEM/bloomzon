import React, { useContext, useEffect, useState } from "react";
import {
  Alert,
  Button,
  Card,
  Col,
  Empty,
  Form,
  Input,
  Modal,
  Row,
  Space,
  Spin,
  Table,
  Tag,
  message,
} from "antd";
import { useNavigate, useParams } from "react-router-dom";

import { MainContext } from "../../Context/MainContext";
import {
  fetchAdminUserDetails,
  updateAdminUserAccess,
  updateAdminUserProfile,
} from "../../api/admin";

const formatCurrency = (value, currency = "USD") =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(Number(value || 0));

const formatDateTime = (value) => (value ? new Date(value).toLocaleString() : "N/A");

const SellerDetails = () => {
  const { seller } = useParams();
  const { token } = useContext(MainContext);
  const navigate = useNavigate();
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [actionBusy, setActionBusy] = useState("");
  const [accessModal, setAccessModal] = useState({
    open: false,
    action: null,
  });
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [accessForm] = Form.useForm();
  const [profileForm] = Form.useForm();

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await fetchAdminUserDetails(token, seller);
        if (active) {
          setDetails(data);
        }
      } catch (loadError) {
        if (active) {
          setError(
            loadError?.response?.data?.message || "Failed to load seller details.",
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    if (token && seller) {
      load();
    }

    return () => {
      active = false;
    };
  }, [seller, token]);

  const user = details?.user;

  const openAccessModal = (action) => {
    setAccessModal({ open: true, action });
    accessForm.setFieldsValue({
      reason: `${String(action).replace(/_/g, " ")} requested from seller details`,
    });
  };

  const submitAccessAction = async () => {
    try {
      const values = await accessForm.validateFields();
      setActionBusy(accessModal.action || "access");
      await updateAdminUserAccess(token, seller, accessModal.action, values.reason);
      message.success("User account updated successfully.");
      setAccessModal({ open: false, action: null });
      accessForm.resetFields();
      const payload = await fetchAdminUserDetails(token, seller);
      setDetails(payload);
    } catch (actionError) {
      if (actionError?.errorFields) {
        return;
      }
      message.error(
        actionError?.response?.data?.message ||
          "Failed to update account access.",
      );
    } finally {
      setActionBusy("");
    }
  };

  const openProfileModal = () => {
    profileForm.setFieldsValue({
      first_name:
        user?.first_name || user?.firstName || user?.firstname || "",
      last_name: user?.last_name || user?.lastName || user?.lastname || "",
      phone: user?.phone || "",
    });
    setProfileModalOpen(true);
  };

  const submitProfileUpdate = async () => {
    try {
      const values = await profileForm.validateFields();
      setActionBusy("profile");
      await updateAdminUserProfile(token, seller, values);
      message.success("User profile updated successfully.");
      setProfileModalOpen(false);
      profileForm.resetFields();
      const payload = await fetchAdminUserDetails(token, seller);
      setDetails(payload);
    } catch (actionError) {
      if (actionError?.errorFields) {
        return;
      }
      message.error(
        actionError?.response?.data?.message ||
          "Failed to update user profile.",
      );
    } finally {
      setActionBusy("");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-center" style={{ minHeight: 320 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 12,
          alignItems: "flex-start",
          flexWrap: "wrap",
          marginBottom: 16,
        }}
      >
        <div>
          <h1 style={{ marginBottom: 6 }}>{user?.name || "Seller"} Details</h1>
          <div style={{ color: "#6b7280" }}>
            Seller health and current admin-account workflow state.
          </div>
        </div>
        {user ? (
          <Space wrap>
            <Button onClick={() => navigate("/dashboard/admin-system/users")}>
              Open admin users workspace
            </Button>
            <Button loading={actionBusy === "profile"} onClick={openProfileModal}>
              Edit profile
            </Button>
            {user.adminBanned ? (
              <Button loading={actionBusy === "unban"} onClick={() => openAccessModal("unban")}>
                Unban
              </Button>
            ) : (
              <Button danger loading={actionBusy === "ban"} onClick={() => openAccessModal("ban")}>
                Ban
              </Button>
            )}
            {user.adminLocked ? (
              <Button loading={actionBusy === "activate"} onClick={() => openAccessModal("activate")}>
                Activate
              </Button>
            ) : (
              <Button loading={actionBusy === "suspend"} onClick={() => openAccessModal("suspend")}>
                Suspend
              </Button>
            )}
          </Space>
        ) : null}
      </div>

      <Alert
        style={{ marginBottom: 16 }}
        type="info"
        showIcon
        message="Workflow alignment"
        description="Account actions on this page now require audit reasons. KYC queue review and vendor subscription controls remain centralized in the Admin System users workspace."
      />

      {error ? (
        <Alert type="error" showIcon message={error} style={{ marginBottom: 16 }} />
      ) : null}

      {!details ? (
        <Empty description="No seller details found" />
      ) : (
        <>
          <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
            <Col xs={24} md={12} xl={6}>
              <Card title="Seller">
                <div><strong>Name:</strong> {details.user?.name || "Unknown"}</div>
                <div><strong>Email:</strong> {details.user?.email || "N/A"}</div>
                <div><strong>Phone:</strong> {details.user?.phone || "N/A"}</div>
                <div><strong>Stores:</strong> {details.stores?.length || 0}</div>
              </Card>
            </Col>
            <Col xs={24} md={12} xl={6}>
              <Card title="Health">
                <div><strong>Score:</strong> {details.accountHealth?.score ?? "N/A"}</div>
                <div>
                  <strong>Status:</strong>{" "}
                  {details.accountHealth?.status?.label || "Not available"}
                </div>
                <div><strong>Alerts:</strong> {details.accountHealth?.summary?.activeAlerts ?? 0}</div>
                <div><strong>Policy issues:</strong> {details.accountHealth?.summary?.policyIssues ?? 0}</div>
              </Card>
            </Col>
            <Col xs={24} md={12} xl={6}>
              <Card title="Overview">
                <div><strong>Total orders:</strong> {details.overview?.totalOrders ?? "N/A"}</div>
                <div><strong>Performance:</strong> {details.accountHealth?.status?.headline || "Tracked in health inputs"}</div>
                <div><strong>Subscriptions:</strong> {details.subscriptions?.length || 0}</div>
                <div><strong>Registered:</strong> {formatDateTime(details.user?.createdAt || details.user?.created_at)}</div>
              </Card>
            </Col>
            <Col xs={24} md={12} xl={6}>
              <Card title="Stores">
                {(details.stores || []).slice(0, 4).map((store) => (
                  <div key={store.id} style={{ marginBottom: 8 }}>
                    <div style={{ fontWeight: 600 }}>{store.name || `Store #${store.id}`}</div>
                    <div style={{ fontSize: 12, color: "#6b7280" }}>
                      {store.code || "No code"} • {store.address || "No address"}
                    </div>
                  </div>
                ))}
                {!details.stores?.length ? <span>No stores</span> : null}
              </Card>
            </Col>
          </Row>

          <Card title="Vendor Subscriptions" style={{ marginBottom: 16 }}>
            <Table
              rowKey="id"
              pagination={false}
              dataSource={details.subscriptions || []}
              locale={{ emptyText: <Empty description="No subscriptions" /> }}
              columns={[
                {
                  title: "Service",
                  dataIndex: "service_key",
                  key: "service_key",
                },
                {
                  title: "Plan",
                  key: "plan_name",
                  render: (_, record) => record.plan_name || record.plan_code || "N/A",
                },
                {
                  title: "Fee",
                  key: "fee_amount",
                  render: (_, record) =>
                    formatCurrency(record.fee_amount, record.currency_code || "USD"),
                },
                {
                  title: "Status",
                  key: "status",
                  render: (_, record) => <Tag>{String(record.status || "unknown").toUpperCase()}</Tag>,
                },
              ]}
            />
          </Card>

          <Card title="Recent Orders">
            <Table
              rowKey="id"
              pagination={false}
              dataSource={details.recentOrders || []}
              locale={{ emptyText: <Empty description="No recent orders" /> }}
              columns={[
                {
                  title: "Order",
                  key: "order_number",
                  render: (_, record) => record.orderNumber || record.order_number || `#${record.id}`,
                },
                {
                  title: "Status",
                  key: "order_status",
                  render: (_, record) => (
                    <Tag>{String(record.orderStatus || record.order_status || "unknown").toUpperCase()}</Tag>
                  ),
                },
                {
                  title: "Payment",
                  key: "payment_status",
                  render: (_, record) => record.paymentStatus || record.payment_status || "N/A",
                },
                {
                  title: "Total",
                  key: "total_amount",
                  render: (_, record) =>
                    formatCurrency(record.totalAmount || record.total_amount, record.currencyCode || record.currency_code || "USD"),
                },
                {
                  title: "Created",
                  key: "created_at",
                  render: (_, record) => formatDateTime(record.createdAt || record.created_at),
                },
              ]}
            />
          </Card>
        </>
      )}

      <Modal
        title={`${String(accessModal.action || "account action")
          .replace(/_/g, " ")
          .replace(/\b\w/g, (match) => match.toUpperCase())} ${user?.name || user?.email || "user"}`}
        open={accessModal.open}
        onCancel={() => {
          setAccessModal({ open: false, action: null });
          accessForm.resetFields();
        }}
        onOk={submitAccessAction}
        okText="Confirm action"
        confirmLoading={Boolean(accessModal.action) && actionBusy === accessModal.action}
      >
        <Form form={accessForm} layout="vertical">
          <Form.Item
            name="reason"
            label="Reason"
            rules={[{ required: true, message: "Reason is required" }]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={`Edit profile: ${user?.name || user?.email || "user"}`}
        open={profileModalOpen}
        onCancel={() => {
          setProfileModalOpen(false);
          profileForm.resetFields();
        }}
        onOk={submitProfileUpdate}
        okText="Save changes"
        confirmLoading={actionBusy === "profile"}
      >
        <Form form={profileForm} layout="vertical">
          <Form.Item name="first_name" label="First name">
            <Input />
          </Form.Item>
          <Form.Item name="last_name" label="Last name">
            <Input />
          </Form.Item>
          <Form.Item name="phone" label="Phone number">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SellerDetails;
