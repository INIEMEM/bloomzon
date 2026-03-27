import React, { useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Card,
  Col,
  Row,
  Space,
  Table,
  Tag,
  Typography,
  message,
} from "antd";
import { motion } from "framer-motion";
import { MainContext } from "../../../Context/Context";
import { ADMIN_BASE_URL, getAuthHeaders } from "../../../api/config";

const prettifyKey = (value = "") =>
  value
    .replace(/_/g, " ")
    .replace(/:/g, " / ")
    .replace(/\b\w/g, (match) => match.toUpperCase());

const RoleManagement = () => {
  const { token } = useContext(MainContext);
  const [admins, setAdmins] = useState([]);
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(false);

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
        error?.response?.data?.message || "Failed to fetch admin rights data.",
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

  const roleUsageMap = useMemo(() => {
    return admins.reduce((acc, admin) => {
      (admin.roles || []).forEach((role) => {
        acc[role] = (acc[role] || 0) + 1;
      });
      return acc;
    }, {});
  }, [admins]);

  const permissionColumns = [
    {
      title: "Right",
      key: "right",
      render: (_, record) => (
        <div>
          <Typography.Text strong>{record.label}</Typography.Text>
          <div style={{ color: "#6b7280" }}>{record.key}</div>
        </div>
      ),
    },
    {
      title: "Group",
      dataIndex: "group",
      key: "group",
      render: (value) => <Tag color="blue">{value}</Tag>,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
  ];

  const assignmentColumns = [
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
      render: (items) => (
        <Space size={[4, 4]} wrap>
          {items.map((item) => (
            <Tag color="geekblue" key={item}>
              {prettifyKey(item)}
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: "Rights Count",
      dataIndex: "permissionsCount",
      key: "permissionsCount",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (value) =>
        Number(value) === 1 ? <Tag color="green">Active</Tag> : <Tag color="red">Inactive</Tag>,
    },
    {
      title: "Source",
      dataIndex: "source",
      key: "source",
      render: (value) =>
        value === "env" ? <Tag color="gold">ENV</Tag> : <Tag>Manual</Tag>,
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
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Card>
          <Typography.Title level={3} style={{ marginBottom: 4 }}>
            Admin Rights Catalog
          </Typography.Title>
          <Typography.Text type="secondary">
            Role presets define recommended rights sets, while direct permissions can
            be added on top for custom admins.
          </Typography.Text>
        </Card>

        <Row gutter={[16, 16]}>
          {roles.map((role) => (
            <Col xs={24} md={12} xl={8} key={role.key}>
              <Card loading={loading} title={role.label}>
                <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                  <Typography.Text type="secondary">
                    {role.description}
                  </Typography.Text>
                  <Typography.Text strong>
                    Assigned Admins: {roleUsageMap[role.key] || 0}
                  </Typography.Text>
                  <Space size={[4, 4]} wrap>
                    {role.permissions.map((permission) => (
                      <Tag color="purple" key={permission}>
                        {prettifyKey(permission)}
                      </Tag>
                    ))}
                  </Space>
                </Space>
              </Card>
            </Col>
          ))}
        </Row>

        <Card
          title="Permission Definitions"
          extra={<Typography.Text>{permissions.length} rights</Typography.Text>}
        >
          <Table
            columns={permissionColumns}
            dataSource={permissions}
            rowKey="key"
            loading={loading}
            pagination={{ pageSize: 8 }}
            className="admin-table"
          />
        </Card>

        <Card
          title="Current Admin Assignments"
          extra={<Typography.Text>{admins.length} admins</Typography.Text>}
        >
          <Table
            columns={assignmentColumns}
            dataSource={admins}
            rowKey="id"
            loading={loading}
            pagination={{ pageSize: 8 }}
            className="admin-table"
          />
        </Card>
      </Space>
    </motion.div>
  );
};

export default RoleManagement;
