import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Button,
  Empty,
  Input,
  InputNumber,
  Popconfirm,
  Space,
  Spin,
  Table,
  Tag,
  message,
} from "antd";
import { DownloadOutlined, ReloadOutlined } from "@ant-design/icons";

import { MainContext } from "../../Context/MainContext";
import {
  defaultAdminVendorSettlements,
  fetchAdminVendorSettlements,
  settleAdminVendorSettlements,
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

const formatDateTime = (value) => (value ? new Date(value).toLocaleString() : "N/A");

const SummaryCard = ({ label, value, helper }) => (
  <div className="admin-kpi">
    <div className="admin-kpi__label">{label}</div>
    <div className="admin-kpi__value">{value}</div>
    <div className="admin-kpi__helper">{helper}</div>
  </div>
);

const AdminVendorSettlementWorkspace = () => {
  const { token } = useContext(MainContext);
  const navigate = useNavigate();
  const [dataset, setDataset] = useState(defaultAdminVendorSettlements);
  const [loading, setLoading] = useState(false);
  const [settling, setSettling] = useState(false);
  const [error, setError] = useState("");
  const [lastRun, setLastRun] = useState(null);
  const [filters, setFilters] = useState({
    search: "",
    minBalance: null,
    maxBalance: null,
  });
  const [draftFilters, setDraftFilters] = useState({
    search: "",
    minBalance: null,
    maxBalance: null,
  });

  const loadSettlements = useCallback(async ({
    page = dataset.pagination.page,
    limit = dataset.pagination.limit,
    nextFilters = filters,
    silent = false,
  } = {}) => {
    try {
      if (!silent) {
        setLoading(true);
      }
      setError("");
      const data = await fetchAdminVendorSettlements(token, {
        page,
        limit,
        search: nextFilters.search?.trim() || undefined,
        min_balance:
          nextFilters.minBalance === null || nextFilters.minBalance === undefined
            ? undefined
            : nextFilters.minBalance,
        max_balance:
          nextFilters.maxBalance === null || nextFilters.maxBalance === undefined
            ? undefined
            : nextFilters.maxBalance,
      });
      setDataset(data || defaultAdminVendorSettlements);
    } catch (fetchError) {
      setError(
        fetchError?.response?.data?.message ||
          "Failed to load vendor settlement candidates.",
      );
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  }, [
    dataset.pagination.limit,
    dataset.pagination.page,
    filters,
    token,
  ]);

  useEffect(() => {
    if (token) {
      loadSettlements({ page: 1, limit: 20 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const applyFilters = useCallback(() => {
    if (
      draftFilters.minBalance !== null &&
      draftFilters.maxBalance !== null &&
      Number(draftFilters.minBalance) > Number(draftFilters.maxBalance)
    ) {
      message.error("Minimum balance cannot be greater than maximum balance.");
      return;
    }

    const nextFilters = {
      search: draftFilters.search || "",
      minBalance: draftFilters.minBalance,
      maxBalance: draftFilters.maxBalance,
    };

    setFilters(nextFilters);
    loadSettlements({
      page: 1,
      limit: dataset.pagination.limit,
      nextFilters,
    });
  }, [dataset.pagination.limit, draftFilters, loadSettlements]);

  const clearFilters = useCallback(() => {
    const nextFilters = {
      search: "",
      minBalance: null,
      maxBalance: null,
    };

    setDraftFilters(nextFilters);
    setFilters(nextFilters);
    loadSettlements({
      page: 1,
      limit: dataset.pagination.limit,
      nextFilters,
    });
  }, [dataset.pagination.limit, loadSettlements]);

  const handleSettleAll = useCallback(async () => {
    if (!dataset.summary.filtered) {
      return;
    }

    try {
      setSettling(true);
      const result = await settleAdminVendorSettlements(token, {
        search: filters.search?.trim() || undefined,
        min_balance:
          filters.minBalance === null || filters.minBalance === undefined
            ? undefined
            : filters.minBalance,
        max_balance:
          filters.maxBalance === null || filters.maxBalance === undefined
            ? undefined
            : filters.maxBalance,
      });

      setLastRun(result);

      const settledOrders = Number(result?.summary?.settledOrders || 0);
      const failedOrders = Number(result?.summary?.failedOrders || 0);
      const settledAmount = formatCurrency(result?.summary?.settledAmount || 0);

      if (failedOrders > 0) {
        message.warning(
          `Settled ${settledOrders} orders for ${settledAmount} with ${failedOrders} failures.`,
        );
      } else {
        message.success(
          `Settled ${settledOrders} orders for ${settledAmount}.`,
        );
      }

      await loadSettlements({
        page: 1,
        limit: dataset.pagination.limit,
        nextFilters: filters,
        silent: true,
      });
    } catch (settleError) {
      message.error(
        settleError?.response?.data?.message ||
          settleError?.message ||
          "Unable to process vendor settlements.",
      );
    } finally {
      setSettling(false);
    }
  }, [dataset.pagination.limit, dataset.summary.filtered, filters, loadSettlements, token]);

  const columns = useMemo(
    () => [
      {
        title: "Seller",
        key: "seller",
        render: (_, record) => (
          <div>
            <div style={{ fontWeight: 600 }}>{record.vendor?.name || "Unknown seller"}</div>
            <div style={{ fontSize: 12, color: "#6b7280" }}>
              {record.vendor?.email || "No email"}
            </div>
            <div style={{ fontSize: 12, color: "#9ca3af" }}>
              {formatNumber(record.vendor?.storesCount || 0)} stores
            </div>
          </div>
        ),
      },
      {
        title: "Wallet balance",
        key: "wallet",
        render: (_, record) => (
          <div>
            <div>{formatCurrency(record.wallet?.balance)}</div>
            <div style={{ fontSize: 12, color: "#6b7280" }}>
              {record.wallet?.currency || "USD"}
            </div>
          </div>
        ),
      },
      {
        title: "Gross amount",
        key: "grossAmount",
        render: (_, record) => formatCurrency(record.grossAmount),
      },
      {
        title: "Service charge",
        key: "serviceChargeAmount",
        render: (_, record) => (
          <span style={{ color: "#d97706", fontWeight: 500 }}>
            {formatCurrency(record.serviceChargeAmount)}
          </span>
        ),
      },
      {
        title: "Settlement balance",
        key: "settlementAmount",
        render: (_, record) => (
          <div style={{ fontWeight: 600, color: "var(--success-color, #10b981)" }}>
            {formatCurrency(record.settlementAmount)}
          </div>
        ),
      },
      {
        title: "Eligible orders",
        key: "eligibleOrders",
        render: (_, record) => formatNumber(record.eligibleOrders),
      },
      {
        title: "Wallet status",
        key: "status",
        render: (_, record) => (
          <Tag color={record.wallet?.status === "active" ? "green" : "default"}>
            {String(record.wallet?.status || "unknown").toUpperCase()}
          </Tag>
        ),
      },
      {
        title: "Latest eligible order",
        key: "latestEligibleOrderAt",
        render: (_, record) => formatDateTime(record.latestEligibleOrderAt),
      },
    ],
    [],
  );

  const exportSettlements = useCallback((mode) => {
    const rows =
      mode === "batch"
        ? (lastRun?.results || []).map((row) => ({
            vendor_id: row.vendorId,
            vendor_name: row.vendorName,
            vendor_email: row.vendorEmail,
            gross_amount: row.grossAmount,
            service_charge_amount: row.serviceChargeAmount,
            settlement_amount: row.settlementAmount,
            settled_gross_amount: row.settledGrossAmount,
            settled_service_charge_amount: row.settledServiceChargeAmount,
            settled_amount: row.settledAmount,
            eligible_orders: row.eligibleOrders,
            settled_orders: row.settledOrders,
            skipped_orders: row.skippedOrders,
            failed_orders: row.failedOrders,
            errors: (row.errors || []).join(" | "),
          }))
        : (dataset.items || []).map((row) => ({
            vendor_id: row.vendor?.id,
            seller: row.vendor?.name,
            email: row.vendor?.email,
            wallet_balance: row.wallet?.balance,
            gross_amount: row.grossAmount,
            service_charge_amount: row.serviceChargeAmount,
            settlement_amount: row.settlementAmount,
            eligible_orders: row.eligibleOrders,
            wallet_status: row.wallet?.status,
            latest_eligible_order_at: formatDateTime(row.latestEligibleOrderAt),
          }));

    if (
      downloadCsv(
        mode === "batch"
          ? "bloomzon-vendor-settlement-batch.csv"
          : "bloomzon-vendor-settlement-candidates.csv",
        rows,
      )
    ) {
      message.success("Vendor settlement export ready.");
    }
  }, [dataset.items, lastRun?.results]);

  const summaryCards = [
    {
      label: "Settlement candidates",
      value: formatNumber(dataset.summary.filtered),
      helper: `${formatNumber(dataset.summary.total)} vendors currently have eligible settlement rows`,
    },
    {
      label: "Gross order amount",
      value: formatCurrency(dataset.summary.filteredGrossAmount),
      helper: `${formatCurrency(dataset.summary.totalGrossAmount)} gross amount across all current candidates`,
    },
    {
      label: "Service charge deducted",
      value: formatCurrency(dataset.summary.filteredServiceChargeAmount),
      helper: `${formatCurrency(dataset.summary.totalServiceChargeAmount)} in service charges to be retained by the platform`,
    },
    {
      label: "Filtered settlement amount",
      value: formatCurrency(dataset.summary.filteredSettlementAmount),
      helper: `${formatCurrency(dataset.summary.totalSettlementAmount)} net settlement across all current candidates`,
    },
    {
      label: "Eligible orders",
      value: formatNumber(dataset.summary.filteredEligibleOrders),
      helper: `${formatNumber(dataset.summary.eligibleOrders)} unsettled completed-paid orders found`,
    },
    {
      label: "Wallet balance exposure",
      value: formatCurrency(dataset.summary.filteredWalletBalanceExposure),
      helper: `${formatCurrency(dataset.summary.walletBalanceExposure)} in current vendor wallets for the matching sellers`,
    },
  ];

  return (
    <div className="admin-workspace">
      <div className="admin-workspace__header">
        <div className="admin-workspace__copy">
          <div className="admin-workspace__eyebrow">Finance</div>
          <h1 className="admin-workspace__title">Vendor Settlements</h1>
          <div className="admin-workspace__subtitle">
            Review vendors with eligible completed-paid orders that have not yet
            been settled into the wallet ledger, filter them by settlement balance,
            and settle the filtered set in one admin action.
          </div>
        </div>

        <div className="admin-workspace__actions">
          <Button
            icon={<DownloadOutlined />}
            onClick={() => exportSettlements("current")}
            disabled={!dataset.items?.length}
          >
            Export candidates
          </Button>
          <Button
            icon={<DownloadOutlined />}
            onClick={() => exportSettlements("batch")}
            disabled={!lastRun?.results?.length}
          >
            Export batch
          </Button>
          <Button icon={<ReloadOutlined />} onClick={() => loadSettlements({ page: 1 })}>
            Refresh
          </Button>
          <Button onClick={() => navigate("/dashboard/operations/profitability")}>
            Profitability
          </Button>
          <Button onClick={() => navigate("/dashboard/operations")}>
            Operations center
          </Button>
          <Popconfirm
            title="Settle all filtered vendors?"
            okText="Settle all"
            cancelText="Cancel"
            onConfirm={handleSettleAll}
            disabled={!dataset.summary.filtered || settling}
          >
            <Button
              type="primary"
              loading={settling}
              disabled={!dataset.summary.filtered}
              style={{
                background: "var(--primary-color)",
                borderColor: "var(--primary-color)",
              }}
            >
              Settle All
            </Button>
          </Popconfirm>
        </div>
      </div>

      {error ? (
        <Alert
          style={{ marginBottom: 18 }}
          type="warning"
          showIcon
          message="Settlement candidates could not be loaded"
          description={error}
        />
      ) : null}

      {lastRun?.summary ? (
        <Alert
          style={{ marginBottom: 18 }}
          type={Number(lastRun.summary.failedOrders || 0) > 0 ? "warning" : "success"}
          showIcon
          message="Latest settlement batch"
          description={`Batch ${lastRun.batchId || "N/A"} settled ${formatNumber(
            lastRun.summary.settledOrders,
          )} orders for ${formatCurrency(lastRun.summary.settledAmount)}.`}
        />
      ) : null}

      <div className="admin-kpi-grid" style={{ marginBottom: 18 }}>
        {summaryCards.map((card) => (
          <SummaryCard
            key={card.label}
            label={card.label}
            value={card.value}
            helper={card.helper}
          />
        ))}
      </div>

      <div className="admin-panel admin-panel--soft" style={{ marginBottom: 18 }}>
        <div className="admin-panel__body">
          <div className="admin-panel__header">
            <div>
              <h2 className="admin-panel__title">Filters</h2>
              <div className="admin-panel__subtitle">
                Scope the settlement batch by seller search and settlement-balance range.
              </div>
            </div>
          </div>

          <div className="admin-toolbar">
            <Input
              className="admin-toolbar__grow"
              allowClear
              placeholder="Search by seller name, email, phone, or vendor ID"
              value={draftFilters.search}
              onChange={(event) =>
                setDraftFilters((current) => ({
                  ...current,
                  search: event.target.value,
                }))
              }
              onPressEnter={applyFilters}
            />
            <InputNumber
              min={0}
              style={{ minWidth: 160 }}
              placeholder="Min balance"
              value={draftFilters.minBalance}
              onChange={(value) =>
                setDraftFilters((current) => ({
                  ...current,
                  minBalance: value,
                }))
              }
            />
            <InputNumber
              min={0}
              style={{ minWidth: 160 }}
              placeholder="Max balance"
              value={draftFilters.maxBalance}
              onChange={(value) =>
                setDraftFilters((current) => ({
                  ...current,
                  maxBalance: value,
                }))
              }
            />
            <Space>
              <Button type="primary" onClick={applyFilters}>
                Apply filters
              </Button>
              <Button onClick={clearFilters}>Clear</Button>
            </Space>
          </div>
        </div>
      </div>

      <div className="admin-panel admin-panel--soft admin-split-table">
        <div className="admin-panel__body">
          <div className="admin-panel__header">
            <div>
              <h2 className="admin-panel__title">Settlement Candidates</h2>
              <div className="admin-panel__subtitle">
                Vendors in this table have completed-paid orders that have not yet
                produced an `order_settlement` wallet transaction.
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-center" style={{ minHeight: 260 }}>
              <Spin size="large" />
            </div>
          ) : (
            <Table
              rowKey={(record) => record.id}
              columns={columns}
              dataSource={dataset.items || []}
              pagination={{
                current: dataset.pagination.page,
                pageSize: dataset.pagination.limit,
                total: dataset.pagination.total,
                onChange: (page, pageSize) =>
                  loadSettlements({
                    page,
                    limit: pageSize,
                    nextFilters: filters,
                  }),
              }}
              locale={{
                emptyText: (
                  <Empty description="No vendors match the current settlement filter." />
                ),
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminVendorSettlementWorkspace;
