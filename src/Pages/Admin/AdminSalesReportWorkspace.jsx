import React, { useContext, useEffect, useMemo, useState } from "react";
import { Alert, Button, Empty, Select, Spin, Table, message } from "antd";
import { DownloadOutlined, ReloadOutlined } from "@ant-design/icons";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { MainContext } from "../../Context/MainContext";
import {
  defaultAdminSalesReport,
  fetchAdminSalesReport,
} from "../../api/admin";
import { downloadCsv } from "../BloomzonAdmin/shared";
import "./adminWorkspace.css";

const formatNumber = (value) =>
  new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(
    Number(value || 0),
  );

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(Number(value || 0));

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

const breakdownColumns = [
  { title: "Category", dataIndex: "label", key: "label" },
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
];

const AdminSalesReportWorkspace = () => {
  const { token } = useContext(MainContext);
  const [months, setMonths] = useState(6);
  const [report, setReport] = useState(defaultAdminSalesReport);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadReport = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await fetchAdminSalesReport(token, { months });
      setReport(data || defaultAdminSalesReport);
    } catch (fetchError) {
      setError(
        fetchError?.response?.data?.message || "Failed to load sales report.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadReport();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, months]);

  const summaryCards = useMemo(
    () => [
      {
        label: "Total revenue",
        value: formatCurrency(report.summary.totalRevenue),
        helper: "Product and service sales combined.",
      },
      {
        label: "Product sales",
        value: formatCurrency(report.summary.productSales),
        helper: "Marketplace product order-line revenue.",
      },
      {
        label: "Service sales",
        value: formatCurrency(report.summary.serviceSales),
        helper: "Mapped service order-line revenue.",
      },
      {
        label: "Units sold",
        value: formatNumber(report.summary.totalUnits),
        helper: `${formatNumber(report.summary.totalOrders)} order references in this window`,
      },
    ],
    [report.summary],
  );

  const exportReport = (mode) => {
    const rows =
      mode === "monthly"
        ? (report.monthly || []).map((row) => ({
            month: row.label,
            product_sales: row.productSales,
            service_sales: row.serviceSales,
            total_revenue: row.totalRevenue,
            orders: row.totalOrders,
            units: row.totalUnits,
          }))
        : [
            ...(report.productBreakdown || []).map((row) => ({
              ledger: "product",
              category: row.label,
              revenue: row.revenue,
              orders: row.orders,
              units: row.units,
            })),
            ...(report.serviceBreakdown || []).map((row) => ({
              ledger: "service",
              category: row.label,
              revenue: row.revenue,
              orders: row.orders,
              units: row.units,
            })),
          ];

    if (
      downloadCsv(
        mode === "monthly"
          ? "bloomzon-sales-report-monthly.csv"
          : "bloomzon-sales-report-breakdown.csv",
        rows,
      )
    ) {
      message.success("Sales report exported.");
    }
  };

  return (
    <div className="admin-workspace">
      <div className="admin-workspace__header">
        <div className="admin-workspace__copy">
          <div className="admin-workspace__eyebrow">Reports</div>
          <h1 className="admin-workspace__title">Sales Report</h1>
          <p className="admin-workspace__subtitle">
            Product sales, service sales, and total revenue are separated from
            the backend order-line ledger.
          </p>
        </div>
        <div className="admin-workspace__actions">
          <Select
            options={monthOptions}
            value={months}
            onChange={setMonths}
            style={{ minWidth: 180 }}
          />
          <Button
            icon={<DownloadOutlined />}
            onClick={() => exportReport("monthly")}
            disabled={!report.monthly.length}
          >
            Export monthly
          </Button>
          <Button
            icon={<DownloadOutlined />}
            onClick={() => exportReport("breakdown")}
            disabled={!report.productBreakdown.length && !report.serviceBreakdown.length}
          >
            Export breakdown
          </Button>
          <Button icon={<ReloadOutlined />} onClick={loadReport}>
            Refresh
          </Button>
        </div>
      </div>

      {error ? (
        <Alert
          style={{ marginBottom: 18 }}
          type="warning"
          showIcon
          message="Sales report could not be loaded"
          description={error}
        />
      ) : null}

      {loading ? (
        <div className="flex flex-center" style={{ minHeight: 320 }}>
          <Spin size="large" />
        </div>
      ) : (
        <>
          <section className="admin-panel admin-panel--soft" style={{ marginBottom: 18 }}>
            <div className="admin-panel__body">
              <div className="admin-kpi-grid">
                {summaryCards.map((card) => (
                  <SummaryCard key={card.label} {...card} />
                ))}
              </div>
            </div>
          </section>

          <section className="admin-panel admin-panel--soft" style={{ marginBottom: 18 }}>
            <div className="admin-panel__body">
              <div className="admin-panel__header">
                <div>
                  <h2 className="admin-panel__title">Revenue Trend</h2>
                  <p className="admin-panel__subtitle">
                    Product and service revenue split by month.
                  </p>
                </div>
              </div>
              <div className="admin-chart-frame">
                {report.monthly.length ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={report.monthly}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="label" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="productSales" fill="#41CCC7" radius={[8, 8, 0, 0]} />
                      <Bar dataKey="serviceSales" fill="#F67F00" radius={[8, 8, 0, 0]} />
                    </ComposedChart>
                  </ResponsiveContainer>
                ) : (
                  <Empty description="No sales activity found." />
                )}
              </div>
            </div>
          </section>

          <div className="admin-section-grid admin-section-grid--2">
            <section className="admin-panel">
              <div className="admin-panel__body">
                <div className="admin-panel__header">
                  <div>
                    <h2 className="admin-panel__title">Product Sales</h2>
                    <p className="admin-panel__subtitle">
                      Non-service product revenue by category.
                    </p>
                  </div>
                </div>
                <Table
                  rowKey="key"
                  columns={breakdownColumns}
                  dataSource={report.productBreakdown}
                  pagination={false}
                  locale={{ emptyText: <Empty description="No product sales rows" /> }}
                />
              </div>
            </section>

            <section className="admin-panel">
              <div className="admin-panel__body">
                <div className="admin-panel__header">
                  <div>
                    <h2 className="admin-panel__title">Service Sales</h2>
                    <p className="admin-panel__subtitle">
                      Service revenue by mapped service.
                    </p>
                  </div>
                </div>
                <Table
                  rowKey="key"
                  columns={breakdownColumns}
                  dataSource={report.serviceBreakdown}
                  pagination={false}
                  locale={{ emptyText: <Empty description="No service sales rows" /> }}
                />
              </div>
            </section>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminSalesReportWorkspace;
