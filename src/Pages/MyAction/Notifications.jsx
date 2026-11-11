import { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Button, Empty, Select, Space, Spin, Table, Tag, message } from "antd";
import { DownloadOutlined, ReloadOutlined } from "@ant-design/icons";

import { MainContext } from "../../Context/MainContext";
import {
  defaultAdminNotificationFeed,
  fetchAdminNotificationFeed,
  markAdminNotificationRead,
} from "../../api/admin";
import { downloadCsv, formatDateTime, formatNumber } from "../BloomzonAdmin/shared";
import "../Admin/adminWorkspace.css";

const NOTIFICATION_PAGE_SIZE = 100;

const severityColor = {
  critical: "red",
  high: "orange",
  medium: "blue",
  low: "default",
};

const categoryLabels = {
  support: "support",
  sla: "support",
  approval: "approval",
  refund: "finance",
  withdrawal: "finance",
  order: "operations",
};

const normalizeNotificationCategory = (type) =>
  categoryLabels[String(type || "").toLowerCase()] || "operations";

const buildNotificationHref = (item) => {
  const type = String(item?.type || "").toLowerCase();
  const conversationId = item?.resource?.conversationId;

  if ((type === "support" || type === "sla") && conversationId) {
    return `/dashboard/others/admins/messages/${conversationId}`;
  }

  if (type === "support" || type === "sla") {
    return "/dashboard/admin-system/support";
  }

  if (type === "approval" || type === "order") {
    return "/dashboard/admin-system/orders";
  }

  if (type === "refund") {
    return "/dashboard/finance/refunds";
  }

  if (type === "withdrawal") {
    return "/dashboard/finance/payouts";
  }

  return "";
};

const normalizeNotificationItem = (item) => {
  const severity = String(item?.severity || "low").toLowerCase();

  return {
    id: item?.id || `${item?.type || "notification"}-${item?.createdAt || Date.now()}`,
    category: normalizeNotificationCategory(item?.type),
    type: String(item?.type || "notification").toLowerCase(),
    severity: ["critical", "high", "medium", "low"].includes(severity) ? severity : "low",
    title: item?.title || "Admin notification",
    description: item?.message || "This notification requires admin review.",
    occurredAt: item?.updatedAt || item?.createdAt || null,
    status: item?.status || "",
    source: item?.source || "",
    href: buildNotificationHref(item),
    acknowledged: Boolean(item?.acknowledged),
    acknowledgedAt: item?.acknowledgedAt || item?.notificationState?.acknowledgedAt || null,
  };
};

const Notifications = () => {
  const { token } = useContext(MainContext);
  const navigate = useNavigate();
  const [notificationFeed, setNotificationFeed] = useState(defaultAdminNotificationFeed);
  const [severityFilter, setSeverityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("open");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadFeed = async () => {
    try {
      setLoading(true);
      setError("");

      const feedData = await fetchAdminNotificationFeed(token, {
        page: 1,
        limit: NOTIFICATION_PAGE_SIZE,
      });

      setNotificationFeed(feedData || defaultAdminNotificationFeed);
    } catch (loadError) {
      setError(
        loadError?.response?.data?.message ||
          "Failed to load the admin notification feed.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadFeed();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const feedItems = useMemo(() => {
    return (notificationFeed.items || [])
      .map((item) => normalizeNotificationItem(item))
      .sort(
        (left, right) =>
          new Date(right.occurredAt || 0).getTime() -
          new Date(left.occurredAt || 0).getTime(),
      );
  }, [notificationFeed.items]);

  const filteredItems = useMemo(
    () =>
      feedItems.filter((item) => {
        if (severityFilter !== "all" && item.severity !== severityFilter) {
          return false;
        }

        if (statusFilter === "open" && item.acknowledged) {
          return false;
        }

        if (statusFilter === "acknowledged" && !item.acknowledged) {
          return false;
        }

        return true;
      }),
    [feedItems, severityFilter, statusFilter],
  );

  const summary = useMemo(
    () => ({
      total: Number(notificationFeed.summary?.total || feedItems.length),
      open: feedItems.filter((item) => !item.acknowledged).length,
      critical:
        Number(notificationFeed.summary?.critical || 0) ||
        feedItems.filter((item) => item.severity === "critical").length,
      finance:
        Number(notificationFeed.summary?.refunds || 0) +
        Number(notificationFeed.summary?.withdrawals || 0) +
        Number(notificationFeed.summary?.approvals || 0),
    }),
    [feedItems, notificationFeed.summary],
  );

  const acknowledgeNotification = async (notificationId) => {
    try {
      await markAdminNotificationRead(token, notificationId);
      setNotificationFeed((current) => ({
        ...current,
        items: (current.items || []).map((item) =>
          item.id === notificationId
            ? {
                ...item,
                acknowledged: true,
                acknowledgedAt: new Date().toISOString(),
                read: true,
                readAt: item.readAt || new Date().toISOString(),
              }
            : item,
        ),
      }));
      message.success("Notification acknowledged.");
    } catch (actionError) {
      message.error(
        actionError?.response?.data?.message ||
          "Failed to update notification state.",
      );
    }
  };

  const exportFeed = () => {
    const rows = filteredItems.map((item) => ({
      category: item.category,
      severity: item.severity,
      title: item.title,
      description: item.description,
      occurred_at: formatDateTime(item.occurredAt),
      acknowledged: item.acknowledged ? "yes" : "no",
      href: item.href || "",
    }));

    if (downloadCsv("bloomzon-notification-feed.csv", rows)) {
      message.success("Notification feed exported.");
    }
  };

  return (
    <div className="admin-workspace">
      <div className="admin-workspace__header">
        <div className="admin-workspace__copy">
          <div className="admin-workspace__eyebrow">Notifications</div>
          <h1 className="admin-workspace__title">Admin Notification Feed</h1>
          <div className="admin-workspace__subtitle">
            Support, risk, approval, refund, payout, and queue alerts in one operational feed.
          </div>
        </div>
        <div className="admin-workspace__actions">
          <Button
            icon={<DownloadOutlined />}
            onClick={exportFeed}
            disabled={!filteredItems.length}
          >
            Export feed
          </Button>
          <Button icon={<ReloadOutlined />} onClick={loadFeed}>
            Refresh
          </Button>
        </div>
      </div>

      {error ? (
        <Alert style={{ marginBottom: 18 }} type="error" showIcon message={error} />
      ) : null}

      <Alert
        style={{ marginBottom: 18 }}
        type="info"
        showIcon
        message="Feed coverage"
        description="This inbox is sourced from the backend admin notification feed, including persisted read and acknowledgment state."
      />

      {loading ? (
        <div className="flex flex-center" style={{ minHeight: 320 }}>
          <Spin size="large" />
        </div>
      ) : (
        <>
          <div className="admin-kpi-grid" style={{ marginBottom: 18 }}>
            <div className="admin-kpi">
              <div className="admin-kpi__label">Feed items</div>
              <div className="admin-kpi__value">{formatNumber(summary.total)}</div>
              <div className="admin-kpi__helper">Notifications returned by the backend admin feed.</div>
            </div>
            <div className="admin-kpi">
              <div className="admin-kpi__label">Open items</div>
              <div className="admin-kpi__value">{formatNumber(summary.open)}</div>
              <div className="admin-kpi__helper">Notifications not yet acknowledged by this admin account.</div>
            </div>
            <div className="admin-kpi">
              <div className="admin-kpi__label">Critical</div>
              <div className="admin-kpi__value">{formatNumber(summary.critical)}</div>
              <div className="admin-kpi__helper">Critical alerts currently returned by the notification feed.</div>
            </div>
            <div className="admin-kpi">
              <div className="admin-kpi__label">Finance alerts</div>
              <div className="admin-kpi__value">{formatNumber(summary.finance)}</div>
              <div className="admin-kpi__helper">Refund, withdrawal, and approval notifications in the feed.</div>
            </div>
          </div>

          <div className="admin-panel admin-panel--soft" style={{ marginBottom: 18 }}>
            <div className="admin-panel__body">
              <div className="admin-toolbar">
                <Select
                  style={{ minWidth: 180 }}
                  value={severityFilter}
                  onChange={setSeverityFilter}
                  options={[
                    { value: "all", label: "All severities" },
                    { value: "critical", label: "Critical" },
                    { value: "high", label: "High" },
                    { value: "medium", label: "Medium" },
                    { value: "low", label: "Low" },
                  ]}
                />
                <Select
                  style={{ minWidth: 180 }}
                  value={statusFilter}
                  onChange={setStatusFilter}
                  options={[
                    { value: "open", label: "Open only" },
                    { value: "acknowledged", label: "Acknowledged only" },
                    { value: "all", label: "All items" },
                  ]}
                />
              </div>
            </div>
          </div>

          <section className="admin-panel">
            <div className="admin-panel__body">
              <Table
                rowKey="id"
                dataSource={filteredItems}
                pagination={false}
                locale={{ emptyText: <Empty description="No notifications in this view" /> }}
                columns={[
                  {
                    title: "Notification",
                    key: "notification",
                    render: (_, record) => (
                      <div>
                        <div style={{ fontWeight: 600 }}>{record.title}</div>
                        <div style={{ color: "#6b7280", fontSize: 12 }}>{record.description}</div>
                      </div>
                    ),
                  },
                  {
                    title: "Category",
                    key: "category",
                    render: (_, record) => <Tag>{record.category.toUpperCase()}</Tag>,
                  },
                  {
                    title: "Type",
                    key: "type",
                    render: (_, record) => <Tag color="geekblue">{record.type.toUpperCase()}</Tag>,
                  },
                  {
                    title: "Severity",
                    key: "severity",
                    render: (_, record) => (
                      <Tag color={severityColor[record.severity] || "default"}>
                        {record.severity.toUpperCase()}
                      </Tag>
                    ),
                  },
                  {
                    title: "Occurred",
                    key: "occurredAt",
                    render: (_, record) =>
                      record.occurredAt ? formatDateTime(record.occurredAt) : "Not available",
                  },
                  {
                    title: "Status",
                    key: "status",
                    render: (_, record) => (
                      <Space size={[8, 8]} wrap>
                        <Tag color={record.acknowledged ? "green" : "gold"}>
                          {record.acknowledged ? "ACKNOWLEDGED" : "OPEN"}
                        </Tag>
                        {record.status ? <Tag>{String(record.status).toUpperCase()}</Tag> : null}
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
                          onClick={() => acknowledgeNotification(record.id)}
                          disabled={record.acknowledged}
                        >
                          {record.acknowledged ? "Acknowledged" : "Acknowledge"}
                        </Button>
                        <Button
                          size="small"
                          type="link"
                          onClick={() => record.href && navigate(record.href)}
                          disabled={!record.href}
                        >
                          Open
                        </Button>
                      </Space>
                    ),
                  },
                ]}
              />
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default Notifications;
