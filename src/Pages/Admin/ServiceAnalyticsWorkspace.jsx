import React, { useContext, useEffect, useMemo, useState } from "react";
import { Alert, Button, Empty, Select, Spin, Table } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { MainContext } from "../../Context/MainContext";
import {
  defaultAdminServiceAnalytics,
  fetchAdminServiceAnalytics,
} from "../../api/admin";
import "./adminWorkspace.css";

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(Number(value || 0));

const formatNumber = (value) =>
  new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(
    Number(value || 0),
  );

const monthOptions = [
  { label: "Last 3 months", value: 3 },
  { label: "Last 6 months", value: 6 },
  { label: "Last 9 months", value: 9 },
  { label: "Last 12 months", value: 12 },
];

const SummaryCard = ({ label, value, helper }) => (
  <div className="admin-kpi">
    <div className="admin-kpi__label">{label}</div>
    <div className="admin-kpi__value">{value}</div>
    <div className="admin-kpi__helper">{helper}</div>
  </div>
);

const ServiceAnalyticsWorkspace = ({
  serviceKey,
  serviceTitle,
  serviceDescription,
}) => {
  const { token } = useContext(MainContext);
  const [months, setMonths] = useState(6);
  const [dataset, setDataset] = useState(defaultAdminServiceAnalytics);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError("");
      const nextData = await fetchAdminServiceAnalytics(token, {
        service: serviceKey,
        months,
      });
      setDataset(nextData || defaultAdminServiceAnalytics);
    } catch (fetchError) {
      setError(
        fetchError?.response?.data?.message ||
          `Failed to load analytics for ${serviceTitle}.`,
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadAnalytics();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, months, serviceKey]);

  const service = dataset.service || null;
  const monthlyRows = useMemo(() => {
    if (service?.monthly?.entries?.length) {
      return service.monthly.entries;
    }

    const labels = service?.monthly?.labels || [];
    return labels.map((label, index) => ({
      key: `${label}-${index}`,
      label,
      revenue: Number(service?.monthly?.revenue?.[index] || 0),
      orders: Number(service?.monthly?.orders?.[index] || 0),
      units: Number(service?.monthly?.units?.[index] || 0),
    }));
  }, [service]);

  const sellerColumns = useMemo(
    () => [
      {
        title: "Seller",
        key: "name",
        render: (_, record) => (
          <div>
            <div style={{ fontWeight: 600 }}>{record.name || "Unknown seller"}</div>
            <div style={{ color: "#6b7280", fontSize: 12 }}>
              {record.email || "No email"}
            </div>
          </div>
        ),
      },
      {
        title: "Revenue",
        key: "revenue",
        render: (_, record) => formatCurrency(record.revenue),
      },
      {
        title: "Orders",
        key: "orders",
        render: (_, record) => formatNumber(record.orders),
      },
      {
        title: "Units",
        key: "units",
        render: (_, record) => formatNumber(record.units),
      },
      {
        title: "Stores",
        key: "storesCount",
        render: (_, record) => formatNumber(record.storesCount),
      },
    ],
    [],
  );

  const monthlyColumns = useMemo(
    () => [
      { title: "Month", dataIndex: "label", key: "label" },
      {
        title: "Revenue",
        key: "revenue",
        render: (_, record) => formatCurrency(record.revenue),
      },
      {
        title: "Orders",
        key: "orders",
        render: (_, record) => formatNumber(record.orders),
      },
      {
        title: "Units",
        key: "units",
        render: (_, record) => formatNumber(record.units),
      },
    ],
    [],
  );

  return (
    <div className="admin-workspace">
      <div className="admin-workspace__header">
        <div className="admin-workspace__copy">
          <div className="admin-workspace__eyebrow">Service Analytics</div>
          <h1 className="admin-workspace__title">{serviceTitle}</h1>
          <div className="admin-workspace__subtitle">
            {serviceDescription ||
              "Unified seller-service analytics with real earnings growth, top-seller rankings, and monthly tables."}
          </div>
        </div>
        <div className="admin-workspace__actions">
          <Select
            options={monthOptions}
            value={months}
            onChange={setMonths}
            style={{ minWidth: 180 }}
          />
          <Button icon={<ReloadOutlined />} onClick={loadAnalytics}>
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

      {!loading && service?.note ? (
        <Alert
          style={{ marginBottom: 18 }}
          type={service.dataAvailable === false ? "warning" : "info"}
          message={service.note}
          showIcon
        />
      ) : null}

      <div className="admin-kpi-grid" style={{ marginBottom: 18 }}>
        <SummaryCard
          label="Revenue"
          value={formatCurrency(service?.summary?.totalRevenue)}
          helper="Total service revenue in the selected window."
        />
        <SummaryCard
          label="Orders"
          value={formatNumber(service?.summary?.totalOrders)}
          helper="Orders associated with this service."
        />
        <SummaryCard
          label="Units"
          value={formatNumber(service?.summary?.totalUnits)}
          helper="Units fulfilled across the service window."
        />
        <SummaryCard
          label="Earning growth"
          value={`${Number(service?.growth?.revenueGrowthPercent || 0).toFixed(2)}%`}
          helper="Current month revenue change compared with the prior month."
        />
      </div>

      <div className="admin-section-grid admin-section-grid--2">
        <div className="admin-panel admin-panel--soft">
          <div className="admin-panel__body">
            <div className="admin-panel__header">
              <div>
                <h2 className="admin-panel__title">Revenue Growth</h2>
                <div className="admin-panel__subtitle">
                  Revenue, order volume, and unit movement over the selected months.
                </div>
              </div>
            </div>

            <div className="admin-chart-frame">
              {loading ? (
                <Spin />
              ) : monthlyRows.length ? (
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={monthlyRows}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="label" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Bar
                      yAxisId="left"
                      dataKey="revenue"
                      fill="#41CCC7"
                      radius={[8, 8, 0, 0]}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="orders"
                      stroke="#0f172a"
                      strokeWidth={2}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="units"
                      stroke="#f67f00"
                      strokeWidth={2}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              ) : (
                <Empty description="No service analytics available." />
              )}
            </div>
          </div>
        </div>

        <div className="admin-panel admin-panel--soft">
          <div className="admin-panel__body">
            <div className="admin-panel__header">
              <div>
                <h2 className="admin-panel__title">Coverage</h2>
                <div className="admin-panel__subtitle">
                  Seller and store coverage for the mapped service domain.
                </div>
              </div>
            </div>

            <div className="admin-inline-stats">
              <span className="admin-stat-pill">
                Sellers: <strong>{formatNumber(service?.summary?.sellers)}</strong>
              </span>
              <span className="admin-stat-pill">
                Stores: <strong>{formatNumber(service?.summary?.stores)}</strong>
              </span>
              <span className="admin-stat-pill">
                Active stores:{" "}
                <strong>{formatNumber(service?.summary?.activeStores)}</strong>
              </span>
              <span className="admin-stat-pill">
                Products: <strong>{formatNumber(service?.summary?.products)}</strong>
              </span>
              <span className="admin-stat-pill">
                Active products:{" "}
                <strong>{formatNumber(service?.summary?.activeProducts)}</strong>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="admin-section-grid admin-section-grid--2" style={{ marginTop: 18 }}>
        <div className="admin-panel admin-panel--soft admin-split-table">
          <div className="admin-panel__body">
            <div className="admin-panel__header">
              <div>
                <h2 className="admin-panel__title">Top Sellers</h2>
                <div className="admin-panel__subtitle">
                  Ranked sellers for this service, rendered as a real table.
                </div>
              </div>
            </div>

            <Table
              columns={sellerColumns}
              dataSource={service?.topSellers || []}
              rowKey={(record) => `${record.vendorId || record.email || record.name}`}
              pagination={false}
              loading={loading}
              locale={{ emptyText: <Empty description="No sellers ranked yet." /> }}
            />
          </div>
        </div>

        <div className="admin-panel admin-panel--soft admin-split-table">
          <div className="admin-panel__body">
            <div className="admin-panel__header">
              <div>
                <h2 className="admin-panel__title">Monthly Table</h2>
                <div className="admin-panel__subtitle">
                  Tabular monthly statistics instead of serialized arrays.
                </div>
              </div>
            </div>

            <Table
              columns={monthlyColumns}
              dataSource={monthlyRows}
              rowKey="key"
              pagination={false}
              loading={loading}
              locale={{ emptyText: <Empty description="No monthly rows available." /> }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceAnalyticsWorkspace;
