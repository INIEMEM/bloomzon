import React, { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Button, Empty, Spin, Table, Tag } from "antd";
import { ReloadOutlined } from "@ant-design/icons";

import { MainContext } from "../../Context/MainContext";
import {
  defaultAdminApprovalRequests,
  defaultAdminOperations,
  defaultAdminRefunds,
  defaultAdminRiskMonitoring,
  defaultAdminWithdrawals,
  fetchAdminApprovalRequests,
  fetchAdminOperations,
  fetchAdminRefunds,
  fetchAdminRiskMonitoring,
  fetchAdminWithdrawals,
} from "../../api/admin";
import "../Admin/adminWorkspace.css";

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

const tagColor = {
  posted: "green",
  pending: "gold",
  failed: "red",
  reversed: "purple",
  open: "gold",
  in_progress: "blue",
  flagged: "volcano",
  inactive: "red",
  refunding: "orange",
  refunded: "volcano",
};

const SummaryCard = ({ label, value, helper }) => (
  <div className="admin-kpi">
    <div className="admin-kpi__label">{label}</div>
    <div className="admin-kpi__value">{value}</div>
    <div className="admin-kpi__helper">{helper}</div>
  </div>
);

const OperationsCenter = () => {
  const { token } = useContext(MainContext);
  const navigate = useNavigate();
  const [queues, setQueues] = useState(defaultAdminOperations);
  const [withdrawals, setWithdrawals] = useState(defaultAdminWithdrawals);
  const [refunds, setRefunds] = useState(defaultAdminRefunds);
  const [riskMonitoring, setRiskMonitoring] = useState(defaultAdminRiskMonitoring);
  const [approvals, setApprovals] = useState(defaultAdminApprovalRequests);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadQueues = async () => {
    try {
      setLoading(true);
      setError("");
      const [operationsData, withdrawalData, refundData, riskData, approvalData] =
        await Promise.all([
          fetchAdminOperations(token, { limit: 12 }),
          fetchAdminWithdrawals(token, { page: 1, limit: 12 }),
          fetchAdminRefunds(token, { page: 1, limit: 12 }),
          fetchAdminRiskMonitoring(token, { page: 1, limit: 12 }),
          fetchAdminApprovalRequests(token, { page: 1, limit: 12 }),
        ]);
      setQueues(operationsData || defaultAdminOperations);
      setWithdrawals(withdrawalData || defaultAdminWithdrawals);
      setRefunds(refundData || defaultAdminRefunds);
      setRiskMonitoring(riskData || defaultAdminRiskMonitoring);
      setApprovals(approvalData || defaultAdminApprovalRequests);
    } catch (fetchError) {
      setError(
        fetchError?.response?.data?.message ||
          "Failed to load admin operation queues.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadQueues();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const withdrawalColumns = useMemo(
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
        title: "Status",
        key: "status",
        render: (_, record) => (
          <Tag color={tagColor[record.status] || "default"}>
            {String(record.status || "unknown").toUpperCase()}
          </Tag>
        ),
      },
      {
        title: "Created",
        key: "createdAt",
        render: (_, record) => formatDateTime(record.createdAt),
      },
    ],
    [],
  );

  const supportColumns = useMemo(
    () => [
      {
        title: "Issue",
        key: "issueType",
        render: (_, record) => (
          <div>
            <div style={{ fontWeight: 600 }}>{record.issueType}</div>
            <div style={{ fontSize: 12, color: "#6b7280" }}>
              {record.vendor?.name || "Unknown seller"}
            </div>
          </div>
        ),
      },
      {
        title: "Description",
        dataIndex: "description",
        key: "description",
        render: (value) => value || "No description",
      },
      {
        title: "Status",
        key: "status",
        render: (_, record) => (
          <Tag color={tagColor[record.status] || "default"}>
            {String(record.status || "unknown").replace("_", " ").toUpperCase()}
          </Tag>
        ),
      },
      {
        title: "Updated",
        key: "updatedAt",
        render: (_, record) => formatDateTime(record.updatedAt),
      },
    ],
    [],
  );

  const reviewColumns = useMemo(
    () => [
      {
        title: "Review",
        key: "review",
        render: (_, record) => (
          <div>
            <div style={{ fontWeight: 600 }}>{record.title}</div>
            <div style={{ fontSize: 12, color: "#6b7280" }}>
              {record.product?.name || "Unknown product"}
            </div>
          </div>
        ),
      },
      {
        title: "Seller",
        key: "seller",
        render: (_, record) => record.seller?.name || record.seller?.email || "Unknown seller",
      },
      {
        title: "Rating",
        key: "rating",
        render: (_, record) => `${record.rating}/5`,
      },
      {
        title: "Status",
        key: "status",
        render: (_, record) => (
          <Tag color={tagColor[record.status] || "default"}>
            {String(record.status || "unknown").toUpperCase()}
          </Tag>
        ),
      },
      {
        title: "Created",
        key: "createdAt",
        render: (_, record) => formatDateTime(record.createdAt),
      },
    ],
    [],
  );

  const listingColumns = useMemo(
    () => [
      {
        title: "Listing",
        key: "listing",
        render: (_, record) => (
          <div>
            <div style={{ fontWeight: 600 }}>{record.name}</div>
            <div style={{ fontSize: 12, color: "#6b7280" }}>
              {record.subdomain?.label || "Unknown service"}
            </div>
          </div>
        ),
      },
      {
        title: "Seller",
        key: "seller",
        render: (_, record) => record.seller?.name || record.seller?.email || "Unknown seller",
      },
      {
        title: "Store",
        key: "store",
        render: (_, record) => record.store?.name || "Unknown store",
      },
      {
        title: "Status",
        key: "status",
        render: (_, record) => (
          <Tag color={Number(record.status) === 0 ? "red" : "green"}>
            {Number(record.status) === 0 ? "INACTIVE" : "ACTIVE"}
          </Tag>
        ),
      },
      {
        title: "Created",
        key: "createdAt",
        render: (_, record) => formatDateTime(record.createdAt),
      },
    ],
    [],
  );

  return (
    <div className="admin-workspace">
      <div className="admin-workspace__header">
        <div className="admin-workspace__copy">
          <div className="admin-workspace__eyebrow">Operations Center</div>
          <h1 className="admin-workspace__title">Actionable system queues</h1>
          <p className="admin-workspace__subtitle">
            This view is for the areas that typically demand admin attention:
            payout activity, seller support, review moderation, listing watch
            items, risk monitoring, and approval-backed finance actions.
          </p>
        </div>

        <div className="admin-workspace__actions">
          <Button icon={<ReloadOutlined />} onClick={loadQueues}>
            Refresh
          </Button>
          <Button onClick={() => navigate("/dashboard/operations/vendor-settlements")}>
            Vendor settlements
          </Button>
          <Button onClick={() => navigate("/dashboard/sellers/withdrawals")}>
            Withdrawal ledger
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
          message="Operation queues could not be loaded"
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
                <SummaryCard
                  label="Withdrawal activity"
                  value={formatNumber(withdrawals.summary.total)}
                  helper="Recorded seller withdrawal entries from the current ledger."
                />
                <SummaryCard
                  label="Open support"
                  value={formatNumber(queues.summary.openSupportTickets)}
                  helper="Tickets still open or in progress"
                />
                <SummaryCard
                  label="Review moderation"
                  value={formatNumber(queues.summary.reviewModeration)}
                  helper="Pending or flagged reviews awaiting review"
                />
                <SummaryCard
                  label="Inactive listings"
                  value={formatNumber(queues.summary.inactiveListings)}
                  helper="Listings that are inactive and visible to admin"
                />
                <SummaryCard
                  label="Risk events"
                  value={formatNumber(riskMonitoring.summary.total)}
                  helper="Failed payments, disputes, suspicious cases, and refund exceptions."
                />
                <SummaryCard
                  label="Pending approvals"
                  value={formatNumber(approvals.summary.pending)}
                  helper="Operational decisions waiting for an authorizer."
                />
              </div>
            </div>
          </section>

          <div className="admin-subgrid">
            <section className="admin-panel">
              <div className="admin-panel__body">
                <div className="admin-panel__header">
                  <div>
                    <h2 className="admin-panel__title">Withdrawal activity</h2>
                    <p className="admin-panel__subtitle">
                      Latest payout records written to the vendor wallet ledger.
                    </p>
                  </div>
                </div>
                <Table
                  rowKey="id"
                  columns={withdrawalColumns}
                  dataSource={withdrawals.items || []}
                  pagination={false}
                  locale={{ emptyText: <Empty description="No withdrawals yet" /> }}
                />
              </div>
            </section>

            <section className="admin-panel">
              <div className="admin-panel__body">
                <div className="admin-panel__header">
                  <div>
                    <h2 className="admin-panel__title">Seller support queue</h2>
                    <p className="admin-panel__subtitle">
                      Open seller-facing issues from the vendor support module.
                    </p>
                  </div>
                </div>
                <Table
                  rowKey="id"
                  columns={supportColumns}
                  dataSource={queues.support || []}
                  pagination={false}
                  locale={{ emptyText: <Empty description="No support queue" /> }}
                />
              </div>
            </section>

            <section className="admin-panel">
              <div className="admin-panel__body">
                <div className="admin-panel__header">
                  <div>
                    <h2 className="admin-panel__title">Review moderation</h2>
                    <p className="admin-panel__subtitle">
                      Pending and flagged reviews from the review service.
                    </p>
                  </div>
                </div>
                <Table
                  rowKey="id"
                  columns={reviewColumns}
                  dataSource={queues.reviews || []}
                  pagination={false}
                  locale={{ emptyText: <Empty description="No moderation queue" /> }}
                />
              </div>
            </section>

            <section className="admin-panel">
              <div className="admin-panel__body">
                <div className="admin-panel__header">
                  <div>
                    <h2 className="admin-panel__title">Listing watchlist</h2>
                    <p className="admin-panel__subtitle">
                      Inactive product records that may need follow-up.
                    </p>
                  </div>
                </div>
                <Table
                  rowKey="id"
                  columns={listingColumns}
                  dataSource={queues.listings || []}
                  pagination={false}
                  locale={{ emptyText: <Empty description="No watchlist items" /> }}
                />
              </div>
            </section>
          </div>

          <div className="admin-subgrid" style={{ marginTop: 18 }}>
            <section className="admin-panel">
              <div className="admin-panel__body">
                <div className="admin-panel__header">
                  <div>
                    <h2 className="admin-panel__title">Risk Monitoring</h2>
                    <p className="admin-panel__subtitle">
                      Current backend risk signals instead of the old refunding-orders queue.
                    </p>
                  </div>
                </div>
                <Table
                  rowKey="id"
                  columns={[
                    {
                      title: "Source",
                      key: "source",
                      render: (_, record) => (
                        <Tag color={tagColor[record.source] || "default"}>
                          {String(record.source || "unknown").replace("_", " ").toUpperCase()}
                        </Tag>
                      ),
                    },
                    {
                      title: "Type",
                      key: "type",
                      render: (_, record) =>
                        String(record.type || "unknown").replace("_", " ").toUpperCase(),
                    },
                    {
                      title: "Subject",
                      key: "subject",
                      render: (_, record) =>
                        record.subject || record.order?.orderNumber || "N/A",
                    },
                    {
                      title: "Status",
                      key: "status",
                      render: (_, record) => (
                        <Tag color={tagColor[record.status] || "default"}>
                          {String(record.status || "unknown").replace("_", " ").toUpperCase()}
                        </Tag>
                      ),
                    },
                    {
                      title: "Created",
                      key: "createdAt",
                      render: (_, record) => formatDateTime(record.createdAt),
                    },
                  ]}
                  dataSource={riskMonitoring.items || []}
                  pagination={false}
                  locale={{ emptyText: <Empty description="No risk events found" /> }}
                />
              </div>
            </section>

            <section className="admin-panel">
              <div className="admin-panel__body">
                <div className="admin-panel__header">
                  <div>
                    <h2 className="admin-panel__title">Refund Ledger</h2>
                    <p className="admin-panel__subtitle">
                      Refund records and current approval-backed finance workflow status.
                    </p>
                  </div>
                </div>
                <Table
                  rowKey="id"
                  columns={[
                    {
                      title: "Refund",
                      key: "refund",
                      render: (_, record) => (
                        <div>
                          <div style={{ fontWeight: 600 }}>Refund #{record.id}</div>
                          <div style={{ fontSize: 12, color: "#6b7280" }}>
                            {record.order?.orderNumber || record.orderId || "No order"}
                          </div>
                        </div>
                      ),
                    },
                    {
                      title: "Buyer",
                      key: "buyer",
                      render: (_, record) =>
                        record.user?.name || record.user?.email || "Unknown buyer",
                    },
                    {
                      title: "Amount",
                      key: "amount",
                      render: (_, record) =>
                        formatCurrency(record.amount),
                    },
                    {
                      title: "Status",
                      key: "status",
                      render: (_, record) => (
                        <Tag color={tagColor[record.status] || "default"}>
                          {String(record.status || "unknown").toUpperCase()}
                        </Tag>
                      ),
                    },
                    {
                      title: "Created",
                      key: "createdAt",
                      render: (_, record) => formatDateTime(record.createdAt),
                    },
                  ]}
                  dataSource={refunds.items || []}
                  pagination={false}
                  locale={{ emptyText: <Empty description="No refund records found" /> }}
                />
              </div>
            </section>
          </div>

          <section className="admin-panel" style={{ marginTop: 18 }}>
            <div className="admin-panel__body">
              <div className="admin-panel__header">
                <div>
                  <h2 className="admin-panel__title">Approval Queue</h2>
                  <p className="admin-panel__subtitle">
                    Withdrawal, refund, and delivery actions now route through authorizer review.
                  </p>
                </div>
                <Button size="small" onClick={() => navigate("/dashboard/admin-system/orders")}>
                  Open orders workflow
                </Button>
              </div>
              <Table
                rowKey="id"
                columns={[
                  {
                    title: "Resource",
                    key: "resourceType",
                    render: (_, record) => (
                      <Tag color="blue">
                        {String(record.resourceType || "unknown").replace("_", " ").toUpperCase()}
                      </Tag>
                    ),
                  },
                  {
                    title: "Action",
                    key: "action",
                    render: (_, record) =>
                      String(record.action || "unknown").replace("_", " ").toUpperCase(),
                  },
                  {
                    title: "Initiator",
                    key: "initiator",
                    render: (_, record) => record.initiator?.name || "Unknown admin",
                  },
                  {
                    title: "Status",
                    key: "status",
                    render: (_, record) => (
                      <Tag color={record.status === "approved" ? "green" : tagColor[record.status] || "gold"}>
                        {String(record.status || "unknown").replace("_", " ").toUpperCase()}
                      </Tag>
                    ),
                  },
                  {
                    title: "Created",
                    key: "createdAt",
                    render: (_, record) => formatDateTime(record.createdAt),
                  },
                ]}
                dataSource={approvals.items || []}
                pagination={false}
                locale={{ emptyText: <Empty description="No approval requests found" /> }}
              />
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default OperationsCenter;
