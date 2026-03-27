import React, { useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Alert,
  Button,
  Card,
  Form,
  Input,
  Modal,
  Popconfirm,
  Select,
  Space,
  Table,
  Tag,
  Typography,
  message,
} from "antd";
import { PlusOutlined, SafetyOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { MainContext } from "../../../Context/Context";
import { ADMIN_BASE_URL, getAuthHeaders } from "../../../api/config";

const statusOptions = [
  { value: 1, label: "Active" },
  { value: 0, label: "Inactive" },
];

const prettifyKey = (value = "") =>
  value
    .replace(/_/g, " ")
    .replace(/:/g, " / ")
    .replace(/\b\w/g, (match) => match.toUpperCase());

const renderTagList = (items = [], color = "blue") =>
  items.length ? (
    <Space size={[4, 4]} wrap>
      {items.map((item) => (
        <Tag color={color} key={item}>
          {prettifyKey(item)}
        </Tag>
      ))}
    </Space>
  ) : (
    <Typography.Text type="secondary">None</Typography.Text>
  );

const Admins = () => {
  const { token } = useContext(MainContext);
  const [admins, setAdmins] = useState([]);
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [form] = Form.useForm();

  const fetchData = async () => {
    try {
      setLoading(true);
      const [adminsResponse, rolesResponse] = await Promise.all([
        axios.get(`${ADMIN_BASE_URL}/admins`, {
          headers: getAuthHeaders(token),
        }),
        axios.get(`${ADMIN_BASE_URL}/roles`, {
          headers: getAuthHeaders(token),
        }),
      ]);

      setAdmins(adminsResponse.data?.data?.items || []);
      setRoles(rolesResponse.data?.data?.roles || []);
      setPermissions(rolesResponse.data?.data?.permissions || []);
    } catch (error) {
      message.error(
        error?.response?.data?.message || "Failed to fetch admin access data.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      return;
    }

    fetchData();
  }, [token]);

  const filteredAdmins = useMemo(() => {
    const query = searchText.trim().toLowerCase();

    if (!query) {
      return admins;
    }

    return admins.filter((admin) => {
      const haystack = [
        admin.email,
        admin.user?.name,
        ...(admin.roles || []),
        ...(admin.permissions || []),
        admin.source,
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(query);
    });
  }, [admins, searchText]);

  const openAddAdmin = () => {
    setEditingAdmin(null);
    form.resetFields();
    form.setFieldsValue({
      roles: [],
      permissions: [],
      status: 1,
    });
    setIsModalOpen(true);
  };

  const openEditAdmin = (admin) => {
    setEditingAdmin(admin);
    form.setFieldsValue({
      email: admin.email,
      roles: admin.roles || [],
      permissions: admin.permissions || [],
      status: Number(admin.status ?? 1),
    });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setSaving(true);

      if (editingAdmin) {
        await axios.put(
          `${ADMIN_BASE_URL}/admins/${editingAdmin.id}`,
          {
            roles: values.roles,
            permissions: values.permissions,
            status: values.status,
          },
          {
            headers: getAuthHeaders(token),
          },
        );
        message.success("Admin access updated successfully.");
      } else {
        await axios.post(
          `${ADMIN_BASE_URL}/admins`,
          {
            email: values.email,
            roles: values.roles,
            permissions: values.permissions,
            status: values.status,
          },
          {
            headers: getAuthHeaders(token),
          },
        );
        message.success("Admin added successfully.");
      }

      setIsModalOpen(false);
      setEditingAdmin(null);
      form.resetFields();
      fetchData();
    } catch (error) {
      if (error?.errorFields) {
        return;
      }

      message.error(error?.response?.data?.message || "Failed to save admin.");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (admin) => {
    try {
      await axios.put(
        `${ADMIN_BASE_URL}/admins/${admin.id}`,
        {
          roles: admin.roles || [],
          permissions: admin.permissions || [],
          status: Number(admin.status) === 1 ? 0 : 1,
        },
        {
          headers: getAuthHeaders(token),
        },
      );

      message.success(
        Number(admin.status) === 1
          ? "Admin access deactivated."
          : "Admin access activated.",
      );
      fetchData();
    } catch (error) {
      message.error(
        error?.response?.data?.message || "Failed to update admin status.",
      );
    }
  };

  const handleDelete = async (adminId) => {
    try {
      await axios.delete(`${ADMIN_BASE_URL}/admins/${adminId}`, {
        headers: getAuthHeaders(token),
      });
      message.success("Admin access removed successfully.");
      fetchData();
    } catch (error) {
      message.error(
        error?.response?.data?.message || "Failed to remove admin access.",
      );
    }
  };

  const columns = [
    {
      title: "Admin",
      key: "admin",
      render: (_, record) => (
        <div>
          <Typography.Text strong>
            {record.user?.name || record.email}
          </Typography.Text>
          <div style={{ color: "#6b7280" }}>{record.email}</div>
        </div>
      ),
    },
    {
      title: "Roles",
      dataIndex: "roles",
      key: "roles",
      render: (items) => renderTagList(items, "blue"),
    },
    {
      title: "Rights",
      dataIndex: "permissions",
      key: "permissions",
      render: (items) => (
        <div>
          <Typography.Text strong>{items?.length || 0}</Typography.Text>
          <div style={{ marginTop: 6 }}>{renderTagList(items, "purple")}</div>
        </div>
      ),
    },
    {
      title: "Source",
      dataIndex: "source",
      key: "source",
      render: (value) =>
        value === "env" ? <Tag color="gold">ENV Allowlist</Tag> : <Tag>Manual</Tag>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (value) =>
        Number(value) === 1 ? <Tag color="green">Active</Tag> : <Tag color="red">Inactive</Tag>,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space wrap>
          <Button type="link" onClick={() => openEditAdmin(record)} disabled={record.source === "env"}>
            Edit Rights
          </Button>
          <Button type="link" onClick={() => handleToggleStatus(record)} disabled={record.source === "env"}>
            {Number(record.status) === 1 ? "Deactivate" : "Activate"}
          </Button>
          {record.source !== "env" ? (
            <Popconfirm
              title="Remove this admin?"
              description="This will revoke dashboard admin access for the selected user."
              okText="Remove"
              cancelText="Cancel"
              onConfirm={() => handleDelete(record.id)}
            >
              <Button type="link" danger>
                Remove
              </Button>
            </Popconfirm>
          ) : (
            <Typography.Text type="secondary">Managed in env</Typography.Text>
          )}
        </Space>
      ),
    },
  ];

  return (
    <motion.div
      style={{ padding: 20 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 16,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <div>
              <Typography.Title level={3} style={{ marginBottom: 4 }}>
                Admin Access Management
              </Typography.Title>
              <Typography.Text type="secondary">
                Add admins, assign rights, and manage who can operate the dashboard.
              </Typography.Text>
            </div>
            <Space wrap>
              <Link to="/dashboard/others/admins/roles">
                <Button icon={<SafetyOutlined />}>View Rights Catalog</Button>
              </Link>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={openAddAdmin}
                style={{ background: "var(--primary-color)" }}
              >
                Add Admin
              </Button>
            </Space>
          </div>

          <Alert
            type="info"
            showIcon
            message="Environment-managed admins"
            description="Admins coming from ADMIN_EMAILS or ADMIN_USER_IDS are visible here but must still be changed in the backend environment variables."
          />

          <Input
            placeholder="Search by email, name, role, permission, or source"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
          />

          <Table
            columns={columns}
            dataSource={filteredAdmins}
            rowKey="id"
            loading={loading}
            className="admin-table"
            pagination={{ pageSize: 10 }}
            locale={{ emptyText: "No admin accounts configured yet." }}
          />
        </Space>
      </Card>

      <Modal
        title={editingAdmin ? "Edit Admin Rights" : "Add Admin"}
        open={isModalOpen}
        onOk={handleSave}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingAdmin(null);
        }}
        confirmLoading={saving}
        okText={editingAdmin ? "Update" : "Add"}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Admin Email"
            name="email"
            rules={[{ required: true, message: "Please enter the user's email." }]}
          >
            <Input disabled={Boolean(editingAdmin)} />
          </Form.Item>
          <Form.Item
            label="Roles"
            name="roles"
            tooltip="Role presets automatically contribute their recommended rights."
          >
            <Select
              mode="multiple"
              placeholder="Select one or more admin roles"
              options={roles.map((role) => ({
                value: role.key,
                label: role.label,
              }))}
            />
          </Form.Item>
          <Form.Item
            label="Additional Rights"
            name="permissions"
            tooltip="Choose extra rights or define a custom rights set."
          >
            <Select
              mode="multiple"
              placeholder="Select explicit permissions"
              options={permissions.map((permission) => ({
                value: permission.key,
                label: `${permission.group}: ${permission.label}`,
              }))}
            />
          </Form.Item>
          <Form.Item label="Status" name="status">
            <Select options={statusOptions} />
          </Form.Item>
        </Form>
      </Modal>
    </motion.div>
  );
};

export default Admins;
