import React, { useContext, useEffect, useMemo, useState } from "react";
import { Alert, Button, Empty, Select, Spin, Table, message } from "antd";
import { DownloadOutlined, ReloadOutlined } from "@ant-design/icons";
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
  defaultAdminProfitability,
  fetchAdminProfitability,
} from "../../api/admin";
import { downloadCsv } from "../BloomzonAdmin/shared";
import "./adminWorkspace.css";

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(Number(value || 0));

const SummaryCard = ({ label, value, helper }) => (
  <div className="admin-kpi">
    <div className="admin-kpi__label">{label}</div>
    <div className="admin-kpi__value">{value}</div>
    <div className="admin-kpi__helper">{helper}</div>
  </div>
);

const monthOptions = [
  { label: "Last 3 months", value: 3 },
  { label: "Last 6 months", value: 6 },
  { label: "Last 9 months", value: 9 },
  { label: "Last 12 months", value: 12 },
];

const AdminProfitabilityWorkspace = () => {
  const { token } = useContext(MainContext);
  const [months, setMonths] = useState(6);
  const [dataset, setDataset] = useState(defaultAdminProfitability);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadProfitability = async () => {
    try {
      setLoading(true);
      setError("");
      const nextData = await fetchAdminProfitability(token, { months });
      setDataset(nextData || defaultAdminProfitability);
    } catch (fetchError) {
      setError(
        fetchError?.response?.data?.message ||
          "Failed to load admin profitability.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadProfitability();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, months]);

  const monthlyRows = useMemo(() => dataset.monthly || [], [dataset.monthly]);

  const serviceMixColumns = useMemo(
    () => [
      {
        title: "Service",
        dataIndex: "label",
        key: "label",
      },
      {
        title: "Revenue",
        key: "revenue",
        render: (_, record) => formatCurrency(record.revenue),
      },
      {
        title: "Share",
        key: "sharePercent",
        render: (_, record) => `${Number(record.sharePercent || 0).toFixed(2)}%`,
      },
    ],
    [],
  );

  const monthlyColumns = useMemo(
    () => [
      { title: "Month", dataIndex: "label", key: "label" },
      {
        title: "Gross Sales",
        key: "grossSales",
        render: (_, record) => formatCurrency(record.grossSales),
      },
      {
        title: "Posted Settlements",
        key: "postedSettlements",
        render: (_, record) => formatCurrency(record.postedSettlements),
      },
      {
        title: "Pending Settlements",
        key: "pendingSettlements",
        render: (_, record) => formatCurrency(record.pendingSettlements),
      },
      {
        title: "Withdrawals",
        key: "withdrawals",
        render: (_, record) => formatCurrency(record.withdrawals),
      },
      {
        title: "Estimated Spread",
        key: "estimatedPlatformSpread",
        render: (_, record) => formatCurrency(record.estimatedPlatformSpread),
      },
    ],
    [],
  );

  const exportProfitability = (mode) => {
    const rows =
      mode === "monthly"
        ? monthlyRows.map((row) => ({
            month: row.label,
            gross_sales: row.grossSales,
            posted_settlements: row.postedSettlements,
            pending_settlements: row.pendingSettlements,
            withdrawals: row.withdrawals,
            estimated_platform_spread: row.estimatedPlatformSpread,
            recognized_platform_revenue: row.recognizedPlatformRevenue,
          }))
        : (dataset.serviceMix || []).map((row) => ({
            service: row.label,
            revenue: row.revenue,
            share_percent: row.sharePercent,
          }));

    if (
      downloadCsv(
        mode === "monthly"
          ? "bloomzon-profitability-monthly.csv"
          : "bloomzon-profitability-service-mix.csv",
        rows,
      )
    ) {
      message.success("Profitability export ready.");
    }
  };

  return (
    <div className="admin-workspace">
      <div className="admin-workspace__header">
        <div className="admin-workspace__copy">
          <div className="admin-workspace__eyebrow">Profitability</div>
          <h1 className="admin-workspace__title">Admin Profitability</h1>
          <div className="admin-workspace__subtitle">
            Track retained value across gross sales, settlements, withdrawals, wallet
            exposure, and service contribution without exposing raw JSON payloads.
          </div>
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
            onClick={() => exportProfitability("monthly")}
            disabled={!monthlyRows.length}
          >
            Export monthly
          </Button>
          <Button
            icon={<DownloadOutlined />}
            onClick={() => exportProfitability("service-mix")}
            disabled={!dataset.serviceMix?.length}
          >
            Export service mix
          </Button>
          <Button icon={<ReloadOutlined />} onClick={loadProfitability}>
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
          label="Gross sales"
          value={formatCurrency(dataset.summary.grossSales)}
          helper="Total service revenue mapped into the profitability window."
        />
        <SummaryCard
          label="Posted settlements"
          value={formatCurrency(dataset.summary.postedSettlements)}
          helper="Seller settlements already posted out of platform sales."
        />
        <SummaryCard
          label="Pending settlements"
          value={formatCurrency(dataset.summary.pendingSettlements)}
          helper="Settlements still waiting to be posted."
        />
        <SummaryCard
          label="Estimated platform spread"
          value={formatCurrency(dataset.summary.estimatedPlatformSpread)}
          helper="A retained-value estimate, not a final profit ledger."
        />
      </div>

      <div className="admin-section-grid admin-section-grid--2">
        <div className="admin-panel admin-panel--soft">
          <div className="admin-panel__body">
            <div className="admin-panel__header">
              <div>
                <h2 className="admin-panel__title">Trend</h2>
                <div className="admin-panel__subtitle">
                  Compare gross sales against posted settlements and estimated spread
                  over time.
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
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="grossSales" fill="#41CCC7" radius={[8, 8, 0, 0]} />
                    <Line
                      type="monotone"
                      dataKey="postedSettlements"
                      stroke="#0f172a"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="estimatedPlatformSpread"
                      stroke="#f67f00"
                      strokeWidth={2}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              ) : (
                <Empty description="No profitability history available." />
              )}
            </div>
          </div>
        </div>

        <div className="admin-panel admin-panel--soft">
          <div className="admin-panel__body">
            <div className="admin-panel__header">
              <div>
                <h2 className="admin-panel__title">Financial Position</h2>
                <div className="admin-panel__subtitle">
                  Current payout and wallet exposure across the admin estate.
                </div>
              </div>
            </div>

            <div className="admin-inline-stats">
              <span className="admin-stat-pill">
                Posted withdrawals:{" "}
                <strong>{formatCurrency(dataset.summary.postedWithdrawals)}</strong>
              </span>
              <span className="admin-stat-pill">
                Pending withdrawals:{" "}
                <strong>{formatCurrency(dataset.summary.pendingWithdrawals)}</strong>
              </span>
              <span className="admin-stat-pill">
                Wallet exposure:{" "}
                <strong>{formatCurrency(dataset.summary.walletBalanceExposure)}</strong>
              </span>
            </div>

            {dataset.note ? (
              <Alert
                style={{ marginTop: 18 }}
                type="info"
                message={dataset.note}
                showIcon
              />
            ) : null}
          </div>
        </div>
      </div>

      <div className="admin-section-grid admin-section-grid--2" style={{ marginTop: 18 }}>
        <div className="admin-panel admin-panel--soft admin-split-table">
          <div className="admin-panel__body">
            <div className="admin-panel__header">
              <div>
                <h2 className="admin-panel__title">Service Contribution</h2>
                <div className="admin-panel__subtitle">
                  Revenue contribution by service rendered as a table.
                </div>
              </div>
            </div>

            <Table
              columns={serviceMixColumns}
              dataSource={dataset.serviceMix || []}
              rowKey="key"
              pagination={false}
              loading={loading}
              locale={{ emptyText: <Empty description="No service mix available." /> }}
            />
          </div>
        </div>

        <div className="admin-panel admin-panel--soft admin-split-table">
          <div className="admin-panel__body">
            <div className="admin-panel__header">
              <div>
                <h2 className="admin-panel__title">Monthly Breakdown</h2>
                <div className="admin-panel__subtitle">
                  A tabular profitability ledger for the selected time window.
                </div>
              </div>
            </div>

            <Table
              columns={monthlyColumns}
              dataSource={monthlyRows}
              rowKey="key"
              pagination={false}
              loading={loading}
              locale={{ emptyText: <Empty description="No monthly profitability rows." /> }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfitabilityWorkspace;
