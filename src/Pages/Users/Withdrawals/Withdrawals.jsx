import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Button,
  Empty,
  Form,
  Input,
  Modal,
  Select,
  Space,
  Spin,
  Table,
  Tag,
  message,
} from "antd";
import { ReloadOutlined } from "@ant-design/icons";

import { MainContext } from "../../../Context/MainContext";
import {
  createAdminApprovalRequest,
  defaultAdminApprovalRequests,
  defaultAdminWithdrawals,
  fetchAdminApprovalRequests,
  fetchAdminWithdrawals,
} from "../../../api/admin";
import "../../Admin/adminWorkspace.css";

const { Search } = Input;

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

const statusColor = {
  posted: "green",
  pending: "gold",
  failed: "red",
  reversed: "purple",
};

const withdrawalActionConfig = {
  post: {
    label: "Request post",
    successMessage: "Withdrawal posting request submitted for approval.",
    type: "primary",
    danger: false,
  },
  fail: {
    label: "Request fail",
    successMessage: "Withdrawal failure request submitted for approval.",
    type: "default",
    danger: true,
  },
  reverse: {
    label: "Request reverse",
    successMessage: "Withdrawal reversal request submitted for approval.",
    type: "default",
    danger: true,
  },
};

const SummaryCard = ({ label, value, helper }) => (
  <div className="admin-kpi">
    <div className="admin-kpi__label">{label}</div>
    <div className="admin-kpi__value">{value}</div>
    <div className="admin-kpi__helper">{helper}</div>
  </div>
);

const WithdrawalsPage = () => {
  const { token } = useContext(MainContext);
  const navigate = useNavigate();
  const [withdrawalsData, setWithdrawalsData] = useState(defaultAdminWithdrawals);
  const [approvalData, setApprovalData] = useState(defaultAdminApprovalRequests);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [reviewingAction, setReviewingAction] = useState(null);
  const [approvalModal, setApprovalModal] = useState({
    open: false,
    record: null,
    action: null,
  });
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
  });
  const [approvalForm] = Form.useForm();

  const loadWithdrawals = useCallback(async ({
    page = withdrawalsData.pagination.page,
    limit = withdrawalsData.pagination.limit,
    nextFilters = filters,
    silent = false,
  } = {}) => {
    try {
      if (!silent) {
        setLoading(true);
      }
      setError("");
      const [withdrawalPayload, approvalPayload] = await Promise.all([
        fetchAdminWithdrawals(token, {
          page,
          limit,
          search: nextFilters.search || undefined,
          status: nextFilters.status || "all",
        }),
        fetchAdminApprovalRequests(token, {
          page: 1,
          limit: 12,
          resource_type: "withdrawal",
          status: "pending_authorization",
        }),
      ]);
      setWithdrawalsData(withdrawalPayload || defaultAdminWithdrawals);
      setApprovalData(approvalPayload || defaultAdminApprovalRequests);
    } catch (fetchError) {
      setError(
        fetchError?.response?.data?.message ||
          "Failed to load withdrawal activity.",
      );
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  }, [
    filters,
    token,
    withdrawalsData.pagination.limit,
    withdrawalsData.pagination.page,
  ]);

  useEffect(() => {
    if (token) {
      loadWithdrawals({ page: 1, limit: 20 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const openApprovalModal = useCallback((record, action) => {
    setApprovalModal({ open: true, record, action });
    approvalForm.setFieldsValue({
      reason: `Withdrawal ${action} requested from withdrawal ledger`,
      notes: record.description || "",
    });
  }, [approvalForm]);

  const submitApprovalRequest = useCallback(async () => {
    const { record, action } = approvalModal;
    const actionConfig = withdrawalActionConfig[action];

    try {
      const values = await approvalForm.validateFields();
      setReviewingAction({ withdrawalId: record.id, action });
      await createAdminApprovalRequest(token, {
        resource_type: "withdrawal",
        resource_id: String(record.id),
        action,
        reason: values.reason,
        notes: values.notes || undefined,
      });
      message.success(
        actionConfig?.successMessage || "Withdrawal approval request submitted.",
      );
      setApprovalModal({ open: false, record: null, action: null });
      approvalForm.resetFields();
      await loadWithdrawals({
        page: withdrawalsData.pagination.page,
        limit: withdrawalsData.pagination.limit,
        nextFilters: filters,
        silent: true,
      });
    } catch (reviewError) {
      if (reviewError?.errorFields) {
        return;
      }
      message.error(
        reviewError?.response?.data?.message ||
          reviewError?.message ||
          "Unable to submit this withdrawal request.",
      );
    } finally {
      setReviewingAction(null);
    }
  }, [
    approvalForm,
    approvalModal,
    filters,
    loadWithdrawals,
    token,
    withdrawalsData.pagination.limit,
    withdrawalsData.pagination.page,
  ]);

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
          </div>
        ),
      },
      {
        title: "Reference",
        key: "reference",
        render: (_, record) => (
          <div>
            <div style={{ fontWeight: 600 }}>{record.referenceId || "No reference"}</div>
            <div style={{ fontSize: 12, color: "#6b7280" }}>
              {record.description || "No description"}
            </div>
          </div>
        ),
      },
      {
        title: "Payment method",
        key: "paymentMethod",
        render: (_, record) => record.paymentMethod?.label || "No payment method",
      },
      {
        title: "Amount",
        key: "amount",
        render: (_, record) => formatCurrency(record.amount),
      },
      {
        title: "Wallet balance",
        key: "wallet",
        render: (_, record) => (
          <div>
            <div>{formatCurrency(record.wallet?.balance)}</div>
            <div style={{ fontSize: 12, color: "#6b7280" }}>
              {record.wallet?.status || "Unknown status"}
            </div>
          </div>
        ),
      },
      {
        title: "Status",
        key: "status",
        render: (_, record) => (
          <Tag color={statusColor[record.status] || "default"}>
            {String(record.status || "unknown").toUpperCase()}
          </Tag>
        ),
      },
      {
        title: "Actions",
        key: "actions",
        render: (_, record) => {
          const availableActions = Array.isArray(record.availableActions)
            ? record.availableActions
            : [];

          if (!availableActions.length) {
            return <span style={{ color: "#9ca3af" }}>No actions</span>;
          }

          return (
            <Space size="small" wrap>
              {availableActions.map((action) => {
                const actionConfig = withdrawalActionConfig[action];
                const isReviewing =
                  reviewingAction?.withdrawalId === record.id &&
                  reviewingAction?.action === action;
                const rowBusy =
                  reviewingAction?.withdrawalId === record.id && !isReviewing;

                return (
                  <Button
                    key={action}
                    size="small"
                    type={actionConfig?.type || "default"}
                    danger={Boolean(actionConfig?.danger)}
                    loading={isReviewing}
                    disabled={rowBusy}
                    onClick={() => openApprovalModal(record, action)}
                  >
                    {actionConfig?.label || action}
                  </Button>
                );
              })}
            </Space>
          );
        },
      },
      {
        title: "Created",
        key: "createdAt",
        render: (_, record) => formatDateTime(record.createdAt),
      },
    ],
    [openApprovalModal, reviewingAction],
  );

  const summaryCards = [
    {
      label: "Total withdrawal records",
      value: formatNumber(withdrawalsData.summary.total),
      helper: `${formatNumber(withdrawalsData.summary.filtered)} visible under current filters`,
    },
    {
      label: "Pending withdrawal volume",
      value: formatCurrency(withdrawalsData.summary.pendingVolume),
      helper: `${formatNumber(withdrawalsData.summary.pending)} pending withdrawal entries`,
    },
    {
      label: "Posted withdrawal volume",
      value: formatCurrency(withdrawalsData.summary.postedVolume),
      helper: `${formatNumber(withdrawalsData.summary.posted)} posted withdrawal entries`,
    },
    {
      label: "Wallet balance exposure",
      value: formatCurrency(withdrawalsData.summary.walletBalance),
      helper: `${formatNumber(withdrawalsData.summary.paymentMethods)} active payout methods on file`,
    },
    {
      label: "Pending approvals",
      value: formatNumber(approvalData.summary.pending),
      helper: "Withdrawal actions waiting for authorizer approval.",
    },
  ];

  return (
    <div className="admin-workspace">
      <div className="admin-workspace__header">
        <div className="admin-workspace__copy">
          <div className="admin-workspace__eyebrow">Finance</div>
          <h1 className="admin-workspace__title">Withdrawal ledger</h1>
          <p className="admin-workspace__subtitle">
            Vendor wallet withdrawals are now routed through approval requests.
            Use this screen to inspect payout activity, initiate withdrawal
            actions with reasons, and track pending authorizations.
          </p>
        </div>

        <div className="admin-workspace__actions">
          <Button icon={<ReloadOutlined />} onClick={() => loadWithdrawals({ page: 1 })}>
            Refresh
          </Button>
          <Button onClick={() => navigate("/dashboard/operations")}>
            Operations center
          </Button>
          <Button onClick={() => navigate("/dashboard/admin-system/orders")}>
            Admin orders workflow
          </Button>
          <Button
            type="primary"
            style={{ background: "var(--primary-color)", borderColor: "var(--primary-color)" }}
            onClick={() => navigate("/dashboard")}
          >
            Back to dashboard
          </Button>
        </div>
      </div>

      {error ? (
        <Alert
          style={{ marginBottom: 18 }}
          type="warning"
          showIcon
          message="Withdrawal activity could not be loaded"
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
                {summaryCards.map((item) => (
                  <SummaryCard
                    key={item.label}
                    label={item.label}
                    value={item.value}
                    helper={item.helper}
                  />
                ))}
              </div>
            </div>
          </section>

          <section className="admin-panel">
            <div className="admin-panel__body">
              <div className="admin-panel__header">
                <div>
                  <h2 className="admin-panel__title">Withdrawal records</h2>
                  <p className="admin-panel__subtitle">
                    Search by seller, reference, description, or payment method.
                    Direct posting is no longer done here; actions create approval requests.
                  </p>
                </div>
              </div>

              <div className="admin-toolbar">
                <div className="admin-toolbar__grow">
                  <Search
                    allowClear
                    placeholder="Search seller, reference, or payment method"
                    value={filters.search}
                    onChange={(event) =>
                      setFilters((current) => ({
                        ...current,
                        search: event.target.value,
                      }))
                    }
                    onSearch={(value) => {
                      const nextFilters = { ...filters, search: value.trim() };
                      setFilters(nextFilters);
                      loadWithdrawals({ page: 1, nextFilters });
                    }}
                  />
                </div>

                <Select
                  value={filters.status}
                  style={{ width: 220 }}
                  onChange={(value) => {
                    const nextFilters = { ...filters, status: value };
                    setFilters(nextFilters);
                    loadWithdrawals({ page: 1, nextFilters });
                  }}
                  options={[
                    { value: "all", label: "All statuses" },
                    { value: "posted", label: "Posted" },
                    { value: "pending", label: "Pending" },
                    { value: "failed", label: "Failed" },
                    { value: "reversed", label: "Reversed" },
                  ]}
                />
              </div>

              <Table
                rowKey="id"
                columns={columns}
                dataSource={withdrawalsData.items || []}
                loading={loading}
                pagination={{
                  current: withdrawalsData.pagination.page,
                  pageSize: withdrawalsData.pagination.limit,
                  total: withdrawalsData.pagination.total,
                  onChange: (page, pageSize) =>
                    loadWithdrawals({ page, limit: pageSize }),
                }}
                locale={{
                  emptyText: <Empty description="No withdrawal records found" />,
                }}
              />
            </div>
          </section>

          <section className="admin-panel" style={{ marginTop: 18 }}>
            <div className="admin-panel__body">
              <div className="admin-panel__header">
                <div>
                  <h2 className="admin-panel__title">Pending Withdrawal Approvals</h2>
                  <p className="admin-panel__subtitle">
                    Requests initiated from the withdrawal ledger or orders workflow.
                  </p>
                </div>
              </div>
              <Table
                rowKey="id"
                dataSource={approvalData.items || []}
                pagination={false}
                columns={[
                  {
                    title: "Request",
                    key: "request",
                    render: (_, record) => (
                      <div>
                        <div style={{ fontWeight: 600 }}>
                          {String(record.action || "request").toUpperCase()}
                        </div>
                        <div style={{ fontSize: 12, color: "#6b7280" }}>
                          {record.initiator?.name || "Unknown admin"}
                        </div>
                      </div>
                    ),
                  },
                  {
                    title: "Reason",
                    dataIndex: "reason",
                    key: "reason",
                    render: (value) => value || "No reason supplied",
                  },
                  {
                    title: "Status",
                    key: "status",
                    render: (_, record) => (
                      <Tag color={record.status === "approved" ? "green" : "gold"}>
                        {String(record.status || "unknown").replaceAll("_", " ").toUpperCase()}
                      </Tag>
                    ),
                  },
                  {
                    title: "Created",
                    key: "createdAt",
                    render: (_, record) => formatDateTime(record.createdAt),
                  },
                ]}
                locale={{
                  emptyText: <Empty description="No pending withdrawal approvals" />,
                }}
              />
            </div>
          </section>
        </>
      )}
      <Modal
        title={
          approvalModal.record
            ? `${withdrawalActionConfig[approvalModal.action]?.label || "Request action"} for ${approvalModal.record.vendor?.name || "seller"}`
            : "Withdrawal approval request"
        }
        open={approvalModal.open}
        onCancel={() => {
          setApprovalModal({ open: false, record: null, action: null });
          approvalForm.resetFields();
        }}
        onOk={submitApprovalRequest}
        okText="Submit request"
        confirmLoading={Boolean(reviewingAction)}
      >
        <Form form={approvalForm} layout="vertical">
          <Form.Item
            name="reason"
            label="Reason"
            rules={[{ required: true, message: "Reason is required" }]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="notes" label="Notes">
            <Input.TextArea rows={2} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default WithdrawalsPage;
