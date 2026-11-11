import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Button,
  Form,
  Input,
  Modal,
  Space,
  Table,
  Tag,
  message,
} from "antd";
import { useLocation, useNavigate } from "react-router-dom";

import UserMatrxs from "../../Components/UserMatrixs/UserMatrxs";
import { MainContext } from "../../Context/MainContext";
import {
  fetchAdminUsers,
  updateAdminUserAccess,
  updateAdminUserProfile,
} from "../../api/admin";

const { Search } = Input;

const formatNumber = (value) =>
  new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(
    Number(value || 0),
  );

const prettifyKey = (value = "") =>
  String(value)
    .replace(/_/g, " ")
    .replace(/\b\w/g, (match) => match.toUpperCase());

const AllSellers = () => {
  const { token } = useContext(MainContext);
  const navigate = useNavigate();
  const location = useLocation();
  const isUserScreen = location.pathname.includes("/dashboard/user/all");
  const role = isUserScreen ? "all" : "seller";

  const [users, setUsers] = useState([]);
  const [visibleUsers, setVisibleUsers] = useState([]);
  const [groupSummary, setGroupSummary] = useState({
    all: 0,
    buyers: 0,
    sellers: 0,
    manufacturers: 0,
    service_providers: 0,
  });
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [groupFilter, setGroupFilter] = useState("all");
  const [error, setError] = useState("");
  const [actionBusy, setActionBusy] = useState("");
  const [accessModal, setAccessModal] = useState({
    open: false,
    action: null,
    record: null,
  });
  const [profileModal, setProfileModal] = useState({
    open: false,
    record: null,
  });
  const [accessForm] = Form.useForm();
  const [profileForm] = Form.useForm();

  const title = isUserScreen ? "All Users" : "All Sellers";

  const applyLocalFilters = (items, query, type = "all") => {
    const normalizedQuery = query.trim().toLowerCase();

    let filtered = items.filter((item) => {
      const isSellerRecord = item.role === "seller" || Boolean(item.vendor);
      const matchesCurrentSection = isUserScreen
        ? true
        : role === "seller"
          ? isSellerRecord
          : !isSellerRecord;

      if (!matchesCurrentSection) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      return (
        `${item.firstname || ""} ${item.lastname || ""} ${item.name || ""}`
          .toLowerCase()
          .includes(normalizedQuery) ||
        String(item.email || "").toLowerCase().includes(normalizedQuery) ||
        String(item.phone || "").toLowerCase().includes(normalizedQuery)
      );
    });

    if (type === "suspended") {
      filtered = filtered.filter((item) => item.adminLocked);
    }

    if (type === "active") {
      filtered = filtered.filter(
        (item) => !item.adminLocked && !item.adminBanned,
      );
    }

    if (type === "banned") {
      filtered = filtered.filter((item) => item.adminBanned);
    }

    return filtered;
  };

  const fetchUsers = async (query = "", nextGroup = groupFilter) => {
    try {
      setLoading(true);
      setError("");
      const payload = await fetchAdminUsers(token, {
        role,
        group: isUserScreen ? nextGroup : undefined,
        page: 1,
        limit: 100,
        search: query || undefined,
        includeHealth: true,
      });

      const items = payload.items || [];
      setUsers(items);
      setGroupSummary(
        payload.summary?.groups || {
          all: items.length,
          buyers: 0,
          sellers: 0,
          manufacturers: 0,
          service_providers: 0,
        },
      );
      setVisibleUsers(applyLocalFilters(items, query));
    } catch (loadError) {
      setError(
        loadError?.response?.data?.message || "Failed to fetch admin users.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchUsers(searchQuery, groupFilter);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role, groupFilter, token]);

  const filterUsers = (type) => {
    setVisibleUsers(applyLocalFilters(users, searchQuery, type));
  };

  const handleSearch = (value) => {
    setSearchQuery(value);
    setVisibleUsers(applyLocalFilters(users, value));
  };

  const openAccessModal = (action, record) => {
    setAccessModal({ open: true, action, record });
    accessForm.setFieldsValue({
      reason: `${prettifyKey(action)} requested from ${title}`,
    });
  };

  const submitAccessAction = async () => {
    const { action, record } = accessModal;

    try {
      const values = await accessForm.validateFields();
      setActionBusy(`${action}-${record.id}`);
      await updateAdminUserAccess(token, record.id, action, values.reason);
      message.success(`${record.name || record.email} was updated successfully.`);
      setAccessModal({ open: false, action: null, record: null });
      accessForm.resetFields();
      await fetchUsers(searchQuery, groupFilter);
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

  const openProfileModal = (record) => {
    setProfileModal({ open: true, record });
    profileForm.setFieldsValue({
      first_name: record.first_name || record.firstName || record.firstname || "",
      last_name: record.last_name || record.lastName || record.lastname || "",
      phone: record.phone || "",
    });
  };

  const submitProfileUpdate = async () => {
    const record = profileModal.record;

    try {
      const values = await profileForm.validateFields();
      setActionBusy(`profile-${record.id}`);
      await updateAdminUserProfile(token, record.id, values);
      message.success(`${record.name || record.email} was updated successfully.`);
      setProfileModal({ open: false, record: null });
      profileForm.resetFields();
      await fetchUsers(searchQuery, groupFilter);
    } catch (actionError) {
      if (actionError?.errorFields) {
        return;
      }
      message.error(
        actionError?.response?.data?.message ||
          "Failed to update this profile.",
      );
    } finally {
      setActionBusy("");
    }
  };

  const totals = useMemo(
    () => ({
      total: users.length,
      suspended: users.filter((item) => item.adminLocked).length,
      banned: users.filter((item) => item.adminBanned).length,
      active: users.filter((item) => !item.adminLocked && !item.adminBanned)
        .length,
    }),
    [users],
  );

  const columns = [
    {
      title: "S/N",
      key: "sn",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Name",
      key: "name",
      render: (_, record) =>
        record.name || `${record.firstname || ""} ${record.lastname || ""}`.trim(),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (value) => String(value || "buyer").toUpperCase(),
    },
    {
      title: "Groups",
      key: "groups",
      render: (_, record) => (
        <Space size={[4, 4]} wrap>
          {(record.groups || [record.role || "buyer"]).map((group) => (
            <Tag key={`${record.id}-${group}`}>
              {String(group).replace("_", " ").toUpperCase()}
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: "Health",
      key: "health",
      render: (_, record) =>
        record.accountHealth?.score ? (
          <Space wrap>
            <Tag color="blue">{formatNumber(record.accountHealth.score)}</Tag>
            <span>{record.accountHealth?.status?.label || "Tracked"}</span>
          </Space>
        ) : (
          <span style={{ color: "#9ca3af" }}>N/A</span>
        ),
    },
    {
      title: "Date Registered",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => (date ? new Date(date).toLocaleDateString() : "N/A"),
    },
    {
      title: "Status",
      key: "status",
      render: (_, record) => (
        <Space>
          {record.adminBanned ? <Tag color="red">BANNED</Tag> : null}
          {record.adminLocked ? <Tag color="orange">SUSPENDED</Tag> : null}
          {!record.adminBanned && !record.adminLocked ? (
            <Tag color="green">ACTIVE</Tag>
          ) : null}
        </Space>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space wrap>
          <Button
            size="small"
            loading={actionBusy === `profile-${record.id}`}
            onClick={() => openProfileModal(record)}
          >
            Edit profile
          </Button>
          {record.adminBanned ? (
            <Button
              size="small"
              loading={actionBusy === `unban-${record.id}`}
              onClick={() => openAccessModal("unban", record)}
            >
              Unban
            </Button>
          ) : (
            <Button
              size="small"
              danger
              loading={actionBusy === `ban-${record.id}`}
              onClick={() => openAccessModal("ban", record)}
            >
              Ban
            </Button>
          )}

          {record.adminLocked ? (
            <Button
              size="small"
              loading={actionBusy === `activate-${record.id}`}
              onClick={() => openAccessModal("activate", record)}
            >
              Activate
            </Button>
          ) : (
            <Button
              size="small"
              loading={actionBusy === `suspend-${record.id}`}
              onClick={() => openAccessModal("suspend", record)}
            >
              Suspend
            </Button>
          )}
          {isUserScreen ? (
            <Button
              size="small"
              type="primary"
              onClick={() =>
                navigate(`/dashboard/others/admins/messages/user-${record.id}`)
              }
            >
              Chat with user
            </Button>
          ) : (
            <Button
              size="small"
              type="link"
              onClick={() => navigate(`/dashboard/sellers/${record.id}`)}
            >
              View details
            </Button>
          )}
        </Space>
      ),
    },
  ];

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
        <h1 style={{ marginBottom: 0 }}>{title}</h1>
        <Button onClick={() => navigate("/dashboard/admin-system/users")}>
          Open admin users workspace
        </Button>
      </div>

      <Alert
        style={{ marginBottom: 16 }}
        type="info"
        showIcon
        message="Legacy route aligned to current admin workflow"
        description="Account actions here now require audit reasons, seller health is exposed when available, and deeper KYC/subscription operations live in the Admin System users workspace."
      />

      {error ? (
        <Alert
          style={{ marginBottom: 16 }}
          type="error"
          showIcon
          message={error}
        />
      ) : null}

      <div className="flex" style={{ gap: 20, flexWrap: "wrap" }}>
        {isUserScreen ? (
          <>
            <UserMatrxs
              matrix={groupSummary.buyers}
              title="Buyers"
              border={true}
              onClick={() => setGroupFilter("buyers")}
            />
            <UserMatrxs
              matrix={groupSummary.sellers}
              title="Sellers"
              border={true}
              onClick={() => setGroupFilter("sellers")}
            />
            <UserMatrxs
              matrix={groupSummary.manufacturers}
              title="Manufacturers"
              border={true}
              onClick={() => setGroupFilter("manufacturers")}
            />
            <UserMatrxs
              matrix={groupSummary.service_providers}
              title="Service Providers"
              border={true}
              onClick={() => setGroupFilter("service_providers")}
            />
          </>
        ) : null}
        <UserMatrxs
          matrix={totals.total}
          title={isUserScreen ? "All users" : "All sellers"}
          border={true}
          onClick={() => (isUserScreen ? setGroupFilter("all") : filterUsers("all"))}
        />
        <UserMatrxs
          matrix={totals.suspended}
          title="Suspended users"
          border={true}
          onClick={() => filterUsers("suspended")}
        />
        <UserMatrxs
          matrix={totals.banned}
          title="Banned users"
          border={true}
          onClick={() => filterUsers("banned")}
        />
        <UserMatrxs
          matrix={totals.active}
          title="Active users"
          border={true}
          onClick={() => filterUsers("active")}
        />
      </div>

      <Search
        placeholder="Search by name, email, or phone"
        onSearch={handleSearch}
        onChange={(event) => handleSearch(event.target.value)}
        allowClear
        value={searchQuery}
        style={{ margin: "1rem 0", width: 320 }}
      />

      <Table
        columns={columns}
        dataSource={visibleUsers}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
        className="admin-table overflow-x-auto"
      />

      <Modal
        title={
          accessModal.record
            ? `${prettifyKey(accessModal.action)} ${accessModal.record.name || accessModal.record.email}`
            : "Account action"
        }
        open={accessModal.open}
        onCancel={() => {
          setAccessModal({ open: false, action: null, record: null });
          accessForm.resetFields();
        }}
        onOk={submitAccessAction}
        okText="Confirm action"
        confirmLoading={
          Boolean(accessModal.action) &&
          actionBusy === `${accessModal.action}-${accessModal.record?.id}`
        }
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
        title={
          profileModal.record
            ? `Edit profile: ${profileModal.record.name || profileModal.record.email}`
            : "Edit profile"
        }
        open={profileModal.open}
        onCancel={() => {
          setProfileModal({ open: false, record: null });
          profileForm.resetFields();
        }}
        onOk={submitProfileUpdate}
        okText="Save changes"
        confirmLoading={actionBusy === `profile-${profileModal.record?.id}`}
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

export default AllSellers;
