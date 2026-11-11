import { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Button, Empty, Spin, Table, Tag } from "antd";
import { ReloadOutlined } from "@ant-design/icons";

import { MainContext } from "../../Context/MainContext";
import {
  defaultAdminOverview,
  defaultAdminProfitability,
  defaultAdminSalesReport,
  fetchAdminOverview,
  fetchAdminProfitability,
  fetchAdminSalesReport,
} from "../../api/admin";
import "../Admin/adminWorkspace.css";
import "./dashboard.css";
import {
  AdminWorkspaceShell,
  DataGapNotice,
  SummaryCard,
  formatCurrency,
  formatDateTime,
  formatNumber,
  statusTagColor,
} from "../BloomzonAdmin/shared";
import { hasAdminPermission } from "../../api/getUser";

const renderStatusTag = (value) => (
  <Tag color={statusTagColor[String(value || "").toLowerCase()] || "default"}>
    {String(value || "unknown").replace(/_/g, " ").toUpperCase()}
  </Tag>
);

const quickLinks = [
  {
    title: "Access & User Management",
    description: "Admins, permissions, audit trails, and role coverage.",
    path: "/dashboard/admin-system/access",
  },
  {
    title: "Orders, Payments & Refunds",
    description: "Order flow, withdrawal reviews, and refund watchlists.",
    path: "/dashboard/admin-system/orders",
  },
  {
    title: "Seller & Buyer Management",
    description: "Account actions, KYC queues, and seller verification.",
    path: "/dashboard/admin-system/users",
  },
  {
    title: "Content & Catalog",
    description: "Product moderation, reviews, and domain/category visibility.",
    path: "/dashboard/admin-system/content",
  },
  {
    title: "Messaging, Support & Notifications",
    description: "Unified inbox coverage and operational alert surfaces.",
    path: "/dashboard/admin-system/support",
  },
  {
    title: "Finance & Revenue",
    description: "GMV, platform revenue estimate, settlements, and payout visibility.",
    path: "/dashboard/admin-system/finance",
  },
];

const Dashboard = () => {
  const { token, user } = useContext(MainContext);
  const navigate = useNavigate();
  const [overview, setOverview] = useState(defaultAdminOverview);
  const [salesReport, setSalesReport] = useState(defaultAdminSalesReport);
  const [profitability, setProfitability] = useState(defaultAdminProfitability);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadOverview = async () => {
    try {
      setLoading(true);
      setError("");
      const [overviewData, salesData, profitabilityData] = await Promise.all([
        fetchAdminOverview(token),
        fetchAdminSalesReport(token, { months: 6 }),
        fetchAdminProfitability(token, { months: 6 }),
      ]);
      setOverview(overviewData || defaultAdminOverview);
      setSalesReport(salesData || defaultAdminSalesReport);
      setProfitability(profitabilityData || defaultAdminProfitability);
    } catch (loadError) {
      setError(
        loadError?.response?.data?.message ||
          "Failed to load the Bloomzon admin overview.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadOverview();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const latestMonthlySales =
    salesReport.monthly?.[salesReport.monthly.length - 1] || null;
  const latestProfitability =
    profitability.monthly?.[profitability.monthly.length - 1] || null;

  const alertCards = useMemo(
    () => [
      {
        title: "Flagged transactions",
        value: formatNumber(overview.summary.alerts?.flaggedTransactions),
        helper: "Suspicious finance, payment, and support risk signals from the backend risk feed.",
      },
      {
        title: "SLA breaches",
        value: formatNumber(overview.summary.alerts?.slaBreaches),
        helper: "Orders that are beyond delivery SLA based on tracked fulfillment dates.",
      },
      {
        title: "Pending KYC",
        value: formatNumber(overview.summary.alerts?.pendingKyc),
        helper: "Seller/store verification queue awaiting admin review.",
      },
      {
        title: "Moderation queue",
        value: formatNumber(overview.summary.alerts?.moderationQueueCount),
        helper: "Pending review and moderation workload.",
      },
    ],
    [overview],
  );

  const visibleQuickLinks = useMemo(
    () =>
      quickLinks.filter((link) => {
        if (link.path.endsWith("/access")) {
          return hasAdminPermission(user, ["admins:view", "admins:manage"]);
        }
        if (link.path.endsWith("/orders")) {
          return hasAdminPermission(user, ["orders:view", "finance:view"]);
        }
        if (link.path.endsWith("/users")) {
          return hasAdminPermission(user, ["users:view", "subscriptions:view"]);
        }
        if (link.path.endsWith("/content")) {
          return hasAdminPermission(user, ["products:view", "domains:view"]);
        }
        if (link.path.endsWith("/support")) {
          return hasAdminPermission(user, ["orders:view", "users:view"]);
        }
        if (link.path.endsWith("/finance")) {
          return hasAdminPermission(user, ["finance:view", "reports:view"]);
        }
        return true;
      }),
    [user],
  );

  return (
    <AdminWorkspaceShell
      eyebrow="Overview"
      title="Bloomzon Admin System"
      subtitle="The operating layer for Bloomzon marketplace administration across users, sellers, orders, support, content, and finance."
      actions={
        <>
          <Button onClick={() => navigate("/dashboard/admin-system/access")}>
            Open admin system
          </Button>
          <Button icon={<ReloadOutlined />} onClick={loadOverview}>
            Refresh
          </Button>
        </>
      }
    >
      {error ? (
        <Alert style={{ marginBottom: 18 }} type="error" showIcon message={error} />
      ) : null}
      <DataGapNotice
        title="Metric notes"
        items={[
          "Monthly GMV is mapped from the latest sales-report month returned by the paired backend.",
          "Revenue now includes tracked subscription fees plus the current backend marketplace retained-value estimate.",
          "Active users reflect accounts updated in the last 30 days, which is the closest activity signal exposed by the current user model.",
        ]}
      />
      {loading ? (
        <div className="flex flex-center" style={{ minHeight: 360 }}>
          <Spin size="large" />
        </div>
      ) : (
        <div className="dashboard-stack">
          <div className="admin-kpi-grid">
            <SummaryCard
              label="Monthly GMV"
              value={formatCurrency(latestMonthlySales?.totalRevenue || salesReport.summary.totalRevenue)}
              helper="Latest monthly sales volume across products and services."
            />
            <SummaryCard
              label="Revenue"
              value={formatCurrency(latestProfitability?.recognizedPlatformRevenue || profitability.summary.recognizedPlatformRevenue || profitability.summary.estimatedPlatformSpread)}
              helper={`Subscriptions ${formatCurrency(overview.summary.finance.subscriptionRevenue || profitability.summary.subscriptionRevenue)} plus marketplace retained-value estimate.`}
            />
            <SummaryCard
              label="Orders"
              value={formatNumber(overview.summary.orders.total)}
              helper={`${formatNumber(overview.summary.orders.completed)} completed, ${formatNumber(overview.summary.orders.pending)} pending`}
            />
            <SummaryCard
              label="Active Users"
              value={formatNumber(overview.summary.users.activeLast30Days || overview.summary.users.active)}
              helper="Accounts active within the last 30 days."
            />
          </div>

          <section className="admin-panel admin-panel--soft">
            <div className="admin-panel__body">
              <div className="admin-panel__header">
                <div>
                  <h2 className="admin-panel__title">Alerts</h2>
                  <div className="admin-panel__subtitle">
                    Flagged queues and operational pressure points surfaced from currently available backend signals.
                  </div>
                </div>
              </div>
              <div className="admin-kpi-grid">
                {alertCards.map((card) => (
                  <SummaryCard
                    key={card.title}
                    label={card.title}
                    value={card.value}
                    helper={card.helper}
                  />
                ))}
              </div>
            </div>
          </section>

          <div className="dashboard-link-grid">
            {visibleQuickLinks.map((link) => (
              <button
                className="dashboard-link-card"
                key={link.path}
                type="button"
                onClick={() => navigate(link.path)}
              >
                <span className="dashboard-link-card__title">{link.title}</span>
                <span className="dashboard-link-card__copy">{link.description}</span>
              </button>
            ))}
          </div>

          <div className="admin-section-grid admin-section-grid--2">
            <section className="admin-panel">
              <div className="admin-panel__body">
                <div className="admin-panel__header">
                  <div>
                    <h2 className="admin-panel__title">Recent Orders</h2>
                    <div className="admin-panel__subtitle">
                      Latest marketplace orders available from the overview feed.
                    </div>
                  </div>
                </div>
                <Table
                  rowKey="id"
                  pagination={false}
                  dataSource={overview.recent.orders}
                  locale={{ emptyText: <Empty description="No recent orders" /> }}
                  columns={[
                    {
                      title: "Order",
                      key: "order",
                      render: (_, record) => (
                        <div>
                          <div style={{ fontWeight: 600 }}>{record.orderNumber}</div>
                          <div style={{ color: "#6b7280", fontSize: 12 }}>
                            {record.customer?.name || "Unknown buyer"}
                          </div>
                        </div>
                      ),
                    },
                    {
                      title: "Total",
                      key: "total",
                      render: (_, record) =>
                        formatCurrency(record.totalAmount, record.currencyCode || "USD"),
                    },
                    {
                      title: "Status",
                      key: "status",
                      render: (_, record) => renderStatusTag(record.orderStatus),
                    },
                    {
                      title: "Created",
                      key: "createdAt",
                      render: (_, record) => formatDateTime(record.createdAt),
                    },
                  ]}
                />
              </div>
            </section>

            <section className="admin-panel admin-panel--soft">
              <div className="admin-panel__body">
                <div className="admin-panel__header">
                  <div>
                    <h2 className="admin-panel__title">Service Health</h2>
                    <div className="admin-panel__subtitle">
                      Top service categories by product and store footprint.
                    </div>
                  </div>
                </div>
                <Table
                  rowKey="id"
                  pagination={false}
                  dataSource={[...(overview.serviceHealth || [])]
                    .sort(
                      (left, right) =>
                        right.totalStores + right.totalProducts - (left.totalStores + left.totalProducts),
                    )
                    .slice(0, 8)}
                  locale={{ emptyText: <Empty description="No service health data" /> }}
                  columns={[
                    {
                      title: "Service",
                      key: "label",
                      render: (_, record) => (
                        <div>
                          <div style={{ fontWeight: 600 }}>{record.label}</div>
                          <div style={{ color: "#6b7280", fontSize: 12 }}>
                            {record.domainLabel || "Unassigned domain"}
                          </div>
                        </div>
                      ),
                    },
                    {
                      title: "Stores",
                      key: "totalStores",
                      render: (_, record) => formatNumber(record.totalStores),
                    },
                    {
                      title: "Products",
                      key: "totalProducts",
                      render: (_, record) => formatNumber(record.totalProducts),
                    },
                    {
                      title: "Status",
                      key: "status",
                      render: (_, record) =>
                        renderStatusTag(Number(record.status) === 1 ? "active" : "inactive"),
                    },
                  ]}
                />
              </div>
            </section>
          </div>
        </div>
      )}
    </AdminWorkspaceShell>
  );
};

export default Dashboard;
