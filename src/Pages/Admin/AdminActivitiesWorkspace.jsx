import React, {
  useContext,
  useDeferredValue,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Alert, Button, Empty, Input, Select, Spin, Table, Tag } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useParams } from "react-router-dom";

import { MainContext } from "../../Context/MainContext";
import {
  defaultAdminActivities,
  fetchAdminActivities,
} from "../../api/admin";
import "./adminWorkspace.css";

const formatDateTime = (value) =>
  value ? new Date(value).toLocaleString() : "N/A";

const prettifyKey = (value = "") =>
  String(value)
    .replace(/_/g, " ")
    .replace(/\b\w/g, (match) => match.toUpperCase());

const renderMetadataValue = (value) => {
  if (value === null || value === undefined || value === "") {
    return <span style={{ color: "#9ca3af" }}>N/A</span>;
  }

  if (Array.isArray(value)) {
    return value.length ? (
      <div className="admin-inline-stats">
        {value.map((entry) => (
          <Tag key={`${entry}`} color="blue">
            {String(entry)}
          </Tag>
        ))}
      </div>
    ) : (
      <span style={{ color: "#9ca3af" }}>N/A</span>
    );
  }

  if (typeof value === "object") {
    return (
      <div className="admin-inline-stats">
        {Object.entries(value).map(([key, entry]) => (
          <span className="admin-stat-pill" key={key}>
            <strong>{prettifyKey(key)}:</strong> {String(entry)}
          </span>
        ))}
      </div>
    );
  }

  return String(value);
};

const SummaryCard = ({ label, value, helper }) => (
  <div className="admin-kpi">
    <div className="admin-kpi__label">{label}</div>
    <div className="admin-kpi__value">{value}</div>
    <div className="admin-kpi__helper">{helper}</div>
  </div>
);

const AdminActivitiesWorkspace = () => {
  const { token } = useContext(MainContext);
  const { adminId } = useParams();
  const [dataset, setDataset] = useState(defaultAdminActivities);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("all");
  const [page, setPage] = useState(1);

  const deferredSearch = useDeferredValue(search);

  const loadActivities = async () => {
    try {
      setLoading(true);
      setError("");
      const nextData = await fetchAdminActivities(token, {
        search: deferredSearch || undefined,
        page: 1,
        limit: 200,
      });
      setDataset(nextData || defaultAdminActivities);
    } catch (fetchError) {
      setError(
        fetchError?.response?.data?.message || "Failed to load admin audit activity.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadActivities();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, deferredSearch]);

  useEffect(() => {
    setPage(1);
  }, [actionFilter, adminId]);

  const filteredItems = useMemo(() => {
    const normalizedAdminId = Number(adminId);

    return (dataset.items || []).filter((activity) => {
      if (actionFilter !== "all" && activity.action !== actionFilter) {
        return false;
      }

      if (!Number.isInteger(normalizedAdminId) || normalizedAdminId <= 0) {
        return true;
      }

      const actorId = Number(activity.actor?.id || 0);
      const targetId = Number(activity.target?.id || 0);

      return actorId === normalizedAdminId || targetId === normalizedAdminId;
    });
  }, [actionFilter, adminId, dataset.items]);

  const summary = useMemo(
    () => ({
      total: filteredItems.length,
      accessGranted: filteredItems.filter(
        (activity) => activity.action === "access_granted",
      ).length,
      accessUpdated: filteredItems.filter(
        (activity) => activity.action === "access_updated",
      ).length,
      inactive: filteredItems.filter(
        (activity) => activity.action === "access_inactive",
      ).length,
    }),
    [filteredItems],
  );

  const actionOptions = useMemo(() => {
    const uniqueActions = Array.from(
      new Set((dataset.items || []).map((activity) => activity.action).filter(Boolean)),
    );

    return [
      { label: "All actions", value: "all" },
      ...uniqueActions.map((action) => ({
        label: prettifyKey(action),
        value: action,
      })),
    ];
  }, [dataset.items]);

  const activityVolume = useMemo(() => {
    const counts = filteredItems.reduce((acc, activity) => {
      const key = activity.action || "unknown";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(counts).map(([action, total]) => ({
      action: prettifyKey(action),
      total,
    }));
  }, [filteredItems]);

  const pageSize = 12;
  const paginatedItems = useMemo(
    () => filteredItems.slice((page - 1) * pageSize, page * pageSize),
    [filteredItems, page],
  );

  const columns = useMemo(
    () => [
      {
        title: "Occurred",
        key: "occurredAt",
        render: (_, record) => formatDateTime(record.occurredAt),
      },
      {
        title: "Action",
        key: "action",
        render: (_, record) => (
          <div>
            <div style={{ fontWeight: 600 }}>
              {record.actionLabel || prettifyKey(record.action)}
            </div>
            <div style={{ color: "#6b7280", fontSize: 12 }}>
              {record.action || "Unknown action"}
            </div>
          </div>
        ),
      },
      {
        title: "Actor",
        key: "actor",
        render: (_, record) => (
          <div>
            <div style={{ fontWeight: 600 }}>
              {record.actor?.name || "Unknown admin"}
            </div>
            <div style={{ color: "#6b7280", fontSize: 12 }}>
              {record.actor?.email || "No email"}
            </div>
          </div>
        ),
      },
      {
        title: "Target",
        key: "target",
        render: (_, record) => (
          <div>
            <div style={{ fontWeight: 600 }}>
              {record.target?.name || "N/A"}
            </div>
            <div style={{ color: "#6b7280", fontSize: 12 }}>
              {record.target?.email || "No email"}
            </div>
          </div>
        ),
      },
      {
        title: "Context",
        key: "context",
        render: (_, record) =>
          record.metadata ? renderMetadataValue(record.metadata) : "N/A",
      },
    ],
    [],
  );

  return (
    <div className="admin-workspace">
      <div className="admin-workspace__header">
        <div className="admin-workspace__copy">
          <div className="admin-workspace__eyebrow">Admin Audit</div>
          <h1 className="admin-workspace__title">Admin Activities</h1>
          <div className="admin-workspace__subtitle">
            Review real admin-access events with searchable history, activity-volume
            totals, and readable context for every change.
          </div>
        </div>
        <div className="admin-workspace__actions">
          <Button icon={<ReloadOutlined />} onClick={loadActivities}>
            Refresh
          </Button>
        </div>
      </div>

      {error ? (
        <Alert
          style={{ marginBottom: 18 }}
          type="error"
          message={error}
          showIcon
        />
      ) : null}

      <div className="admin-kpi-grid" style={{ marginBottom: 18 }}>
        <SummaryCard
          label="Total events"
          value={summary.total}
          helper="All audit events currently in the filtered result."
        />
        <SummaryCard
          label="Access granted"
          value={summary.accessGranted}
          helper="Fresh admin access grants and allowlist sync events."
        />
        <SummaryCard
          label="Access updated"
          value={summary.accessUpdated}
          helper="Role and permission updates already applied."
        />
        <SummaryCard
          label="Inactive"
          value={summary.inactive}
          helper="Admin entries that were marked inactive."
        />
      </div>

      <div className="admin-panel admin-panel--soft" style={{ marginBottom: 18 }}>
        <div className="admin-panel__body">
          <div className="admin-panel__header">
            <div>
              <h2 className="admin-panel__title">Filters</h2>
              <div className="admin-panel__subtitle">
                Search by actor, target, email, source, permission, or action label.
              </div>
            </div>
          </div>

          <div className="admin-toolbar">
            <Input.Search
              allowClear
              className="admin-toolbar__grow"
              placeholder="Search audit events"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <Select
              options={actionOptions}
              value={actionFilter}
              onChange={setActionFilter}
              style={{ minWidth: 220 }}
            />
          </div>
        </div>
      </div>

      <div className="admin-section-grid admin-section-grid--2">
        <div className="admin-panel admin-panel--soft">
          <div className="admin-panel__body">
            <div className="admin-panel__header">
              <div>
                <h2 className="admin-panel__title">Activity Volume</h2>
                <div className="admin-panel__subtitle">
                  A compact view of how the filtered audit trail is distributed by
                  action type.
                </div>
              </div>
            </div>

            <div className="admin-chart-frame">
              {loading ? (
                <Spin />
              ) : activityVolume.length ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={activityVolume}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="action" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="total" fill="#41CCC7" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <Empty
                  className="admin-empty-state"
                  description="No audit events available for the current filters."
                />
              )}
            </div>
          </div>
        </div>

        <div className="admin-panel admin-panel--soft">
          <div className="admin-panel__body">
            <div className="admin-panel__header">
              <div>
                <h2 className="admin-panel__title">Current Selection</h2>
                <div className="admin-panel__subtitle">
                  Audit totals are recalculated after the action and admin filters are
                  applied.
                </div>
              </div>
            </div>

            <div className="admin-inline-stats">
              <span className="admin-stat-pill">
                Filtered events: <strong>{summary.total}</strong>
              </span>
              <span className="admin-stat-pill">
                Search matches: <strong>{search ? filteredItems.length : dataset.summary.total}</strong>
              </span>
              <span className="admin-stat-pill">
                API total: <strong>{dataset.summary.total}</strong>
              </span>
              {adminId ? (
                <span className="admin-stat-pill">
                  Admin ID filter: <strong>{adminId}</strong>
                </span>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <div className="admin-panel admin-panel--soft admin-split-table" style={{ marginTop: 18 }}>
        <div className="admin-panel__body">
          <div className="admin-panel__header">
            <div>
              <h2 className="admin-panel__title">Audit Trail</h2>
              <div className="admin-panel__subtitle">
                Structured activity history rendered as a table instead of raw event
                objects.
              </div>
            </div>
          </div>

          <Table
            columns={columns}
            dataSource={paginatedItems}
            loading={loading}
            rowKey="id"
            pagination={{
              current: page,
              pageSize,
              total: filteredItems.length,
              onChange: setPage,
              showSizeChanger: false,
            }}
            locale={{
              emptyText: (
                <Empty description="No audit events found for this selection." />
              ),
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminActivitiesWorkspace;
