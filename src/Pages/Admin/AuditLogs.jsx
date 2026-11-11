import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Button,
  Card,
  DatePicker,
  Empty,
  Input,
  Select,
  Space,
  Table,
  Tag,
  message,
} from "antd";
import { ReloadOutlined, DownloadOutlined, SearchOutlined } from "@ant-design/icons";
import { MainContext } from "../../Context/MainContext";
import { getAuditLogs } from "../../api/admin";
import { downloadCsv } from "../BloomzonAdmin/shared";
import "./adminWorkspace.css";

const { RangePicker } = DatePicker;

const formatDateTime = (value) =>
  value ? new Date(value).toLocaleString() : "N/A";

const prettifyKey = (value = "") =>
  String(value)
    .replace(/_/g, " ")
    .replace(/:/g, " / ")
    .replace(/\b\w/g, (match) => match.toUpperCase());

const renderMetadataValue = (value) => {
  if (value === null || value === undefined || value === "") {
    return <span style={{ color: "#9ca3af" }}>N/A</span>;
  }

  if (typeof value === "object") {
    return (
      <div className="admin-inline-stats">
        {Object.entries(value).map(([key, entry]) => (
          <span className="admin-stat-pill" key={key}>
            <strong>{prettifyKey(key)}:</strong> {JSON.stringify(entry)}
          </span>
        ))}
      </div>
    );
  }

  return String(value);
};

const AuditLogs = () => {
  const { token } = useContext(MainContext);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("");
  const [dateRange, setDateRange] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0,
  });

  const loadLogs = async (page = 1, pageSize = 20) => {
    try {
      setLoading(true);
      setError("");
      
      const params = {
        page,
        limit: pageSize,
        search: search || undefined,
        action: actionFilter || undefined,
      };

      if (dateRange && dateRange[0] && dateRange[1]) {
        params.startDate = dateRange[0].toISOString();
        params.endDate = dateRange[1].toISOString();
      }

      const result = await getAuditLogs(token, params);

      if (result.success) {
        setLogs(result.data.items || []);
        setPagination((current) => ({
          ...current,
          current: page,
          pageSize,
          total: result.data?.pagination?.total || 0,
        }));
      } else {
        setError(result.message || "Failed to load audit logs");
      }
    } catch (err) {
      setError("An error occurred while fetching audit logs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadLogs();
    }
  }, [token, actionFilter]);

  const handleSearch = () => {
    loadLogs(1);
  };

  const handleExport = () => {
    if (!logs.length) {
      message.warning("No logs to export");
      return;
    }

    const rows = logs.map((log) => ({
      timestamp: formatDateTime(log.createdAt),
      admin: log.adminAccount?.user?.name || log.adminAccount?.email || "N/A",
      admin_code: log.adminAccount?.admin_code || "N/A",
      roles: (log.adminAccount?.roles || []).join(", "),
      action: log.action || "",
      target_id: log.target_id || "",
      ip_address: log.ip_address || "",
      details: JSON.stringify(log.details || {}),
    }));

    if (downloadCsv(`audit_logs_${new Date().toISOString()}.csv`, rows)) {
      message.success("Audit log exported.");
    }
  };

  const actionOptions = useMemo(() => {
    const suggestedActions = [
      "admins:create",
      "admins:update",
      "admins:delete",
      "admins:view",
      "audit_logs:view",
      "users:access",
      "users:view",
      "products:status",
      "products:delete",
      "stores:review",
      "stores:delete",
      "vendors:settle",
      "legal:update",
    ];

    const uniqueActions = Array.from(
      new Set([...suggestedActions, ...logs.map((log) => log.action).filter(Boolean)]),
    );

    return uniqueActions.map((action) => ({
      label: prettifyKey(action),
      value: action,
    }));
  }, [logs]);

  const columns = [
    {
      title: "Timestamp",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => formatDateTime(text),
      width: 180,
    },
    {
      title: "Admin",
      key: "admin",
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 600 }}>
            {record.adminAccount?.user?.name || record.adminAccount?.email || "Unknown"}
          </div>
          <div style={{ color: "#6b7280", fontSize: 12 }}>
            Code: <Tag color="blue">{record.adminAccount?.admin_code || "N/A"}</Tag>
          </div>
          <div style={{ color: "#6b7280", fontSize: 12 }}>
            Roles: {(record.adminAccount?.roles || []).join(", ") || "N/A"}
          </div>
        </div>
      ),
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (action) => (
        <Tag color={action.includes("delete") ? "red" : action.includes("create") ? "green" : "orange"}>
          {prettifyKey(action)}
        </Tag>
      ),
    },
    {
      title: "Target",
      dataIndex: "target_id",
      key: "target_id",
      render: (id) => id || <span style={{ color: "#9ca3af" }}>N/A</span>,
    },
    {
      title: "Details",
      dataIndex: "details",
      key: "details",
      render: (details) => renderMetadataValue(details),
    },
    {
      title: "IP Address",
      dataIndex: "ip_address",
      key: "ip_address",
      width: 130,
    },
  ];

  return (
    <div className="admin-workspace">
      <div className="admin-workspace__header">
        <div className="admin-workspace__copy">
          <div className="admin-workspace__eyebrow">Compliance & Security</div>
          <h1 className="admin-workspace__title">System Audit Logs</h1>
          <div className="admin-workspace__subtitle">
            A comprehensive record of all administrative actions performed across the platform.
          </div>
        </div>
        <div className="admin-workspace__actions">
          <Space>
            <Button icon={<DownloadOutlined />} onClick={handleExport}>
              Export CSV
            </Button>
            <Button type="primary" icon={<ReloadOutlined />} onClick={() => loadLogs(pagination.current)}>
              Refresh
            </Button>
          </Space>
        </div>
      </div>

      <Card style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          <Input
            placeholder="Search by ID, Admin, or Details"
            prefix={<SearchOutlined />}
            style={{ width: 300 }}
            value={search}
            onChange={e => setSearch(e.target.value)}
            onPressEnter={handleSearch}
          />
          <Select
            placeholder="Filter by Action"
            style={{ width: 200 }}
            allowClear
            value={actionFilter || undefined}
            onChange={setActionFilter}
            options={actionOptions}
          />
          <RangePicker 
            onChange={setDateRange}
          />
          <Button type="primary" onClick={handleSearch}>Filter</Button>
        </div>
      </Card>

      {error && <Alert type="error" message={error} showIcon style={{ marginBottom: 20 }} />}

      <Table
        columns={columns}
        dataSource={logs}
        rowKey="id"
        loading={loading}
        pagination={{
          ...pagination,
          onChange: (page, pageSize) => loadLogs(page, pageSize),
          showSizeChanger: true,
        }}
        locale={{
          emptyText: <Empty description="No audit logs found matching your criteria." />,
        }}
      />
    </div>
  );
};

export default AuditLogs;
