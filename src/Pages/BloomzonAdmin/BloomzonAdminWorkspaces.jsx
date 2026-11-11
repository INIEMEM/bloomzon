import { useContext, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Button,
  Empty,
  Form,
  Image,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Select,
  Space,
  Spin,
  Switch,
  Table,
  Tag,
  Upload,
  message,
} from "antd";
import {
  DownloadOutlined,
  ReloadOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

import { MainContext } from "../../Context/MainContext";
import {
  defaultAdminAuditLogs,
  defaultAdminApprovalRequests,
  defaultAdminBulkOperations,
  defaultAdminBulkTools,
  defaultAdminCouponMonitoring,
  defaultAdminDeliveryOrders,
  defaultAdminDomains,
  defaultAdminFeatureFlags,
  defaultAdminFoodOrders,
  defaultAdminMarketing,
  defaultAdminMediaModeration,
  defaultAdminNotificationFeed,
  defaultAdminOperations,
  defaultAdminOrders,
  defaultAdminOverview,
  defaultAdminPayouts,
  defaultAdminPrivacyQueue,
  defaultAdminProducts,
  defaultAdminRefunds,
  defaultAdminRiskMonitoring,
  defaultAdminSalesReport,
  defaultAdminSubscriptionPlans,
  defaultAdminStores,
  defaultAdminSupportConversations,
  defaultAdminSupportTickets,
  defaultAdminUsers,
  defaultAdminVendorSubscriptions,
  defaultAdminVendorSettlements,
  defaultAdminWithdrawals,
  applyAdminBulkOperation,
  createAdminApprovalRequest,
  createAdminDomain,
  createAdminDomainCategory,
  createAdminMarketing,
  decideAdminApprovalRequest,
  deleteAdminMarketing,
  deleteAdminDomain,
  deleteAdminDomainCategory,
  fetchAdminAdmins,
  fetchAdminApprovalRequests,
  fetchAdminDeliveryOrders,
  fetchAdminDomains,
  fetchAdminFeatureFlags,
  fetchAdminFoodOrders,
  fetchAdminFinanceExport,
  fetchAdminBulkOperations,
  fetchAdminBulkToolTemplates,
  fetchAdminMarketing,
  fetchAdminMediaModeration,
  fetchAdminNotificationFeed,
  fetchAdminOperations,
  fetchAdminOrders,
  fetchAdminOverview,
  fetchAdminPayouts,
  fetchAdminPrivacyRequests,
  fetchAdminProductDetails,
  fetchAdminProducts,
  fetchAdminProfitability,
  fetchAdminRefunds,
  fetchAdminRiskMonitoring,
  fetchAdminRoles,
  fetchAdminSalesReport,
  fetchAdminStores,
  fetchAdminSubscriptionPlans,
  fetchAdminSupportConversations,
  fetchAdminSupportTickets,
  fetchAdminUsers,
  fetchAdminVendorSubscriptions,
  fetchAdminVendorSettlements,
  fetchAdminWithdrawals,
  fetchAdminCouponMonitoring,
  fetchAdminCities,
  createAdminUser,
  getAuditLogs,
  moderateAdminMediaItem,
  previewAdminBulkOperation,
  reviewAdminStore,
  moderateAdminReview,
  saveAdminFeatureFlags,
  updateAdminProductBoosting,
  updateAdminDomain,
  updateAdminDomainCategory,
  updateAdminMarketingPayoutStatus,
  updateAdminPrivacyRequest,
  updateAdminSupportTicket,
  updateAdminVendorSubscription,
  updateAdminMarketing,
  updateAdminProductStatus,
  updateAdminUserAccess,
  updateAdminUserProfile,
  upsertAdminSubscriptionPlan,
  deleteAdminProduct,
} from "../../api/admin";
import { hasAdminPermission } from "../../api/getUser";
import {
  buildSupportTicketRows,
  readSupportWorkflowState,
} from "../Admin/supportWorkflow";
import "../Admin/adminWorkspace.css";
import {
  AdminWorkspaceShell,
  DataGapNotice,
  SummaryCard,
  downloadCsv,
  formatCurrency,
  formatDateTime,
  formatNumber,
  prettifyKey,
  statusTagColor,
} from "./shared";

const renderStatusTag = (value) => (
  <Tag color={statusTagColor[String(value || "").toLowerCase()] || "default"}>
    {prettifyKey(String(value || "unknown"))}
  </Tag>
);

const downloadTextFile = (filename, content, mimeType = "text/plain;charset=utf-8;") => {
  if (typeof window === "undefined" || !content) {
    return false;
  }

  const blob = new Blob([content], { type: mimeType });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
  return true;
};

const getBulkPreviewSummaryValue = (summary = {}, camelKey, snakeKey) =>
  Number(summary?.[camelKey] ?? summary?.[snakeKey] ?? 0) || 0;

const getBulkPreviewErrorText = (entry = {}) => {
  if (Array.isArray(entry.errors) && entry.errors.length) {
    return entry.errors.join(", ");
  }

  if (Array.isArray(entry.issues) && entry.issues.length) {
    return entry.issues.join(", ");
  }

  return entry.message || "Validation error";
};

const getRequestErrorMessage = (error, fallbackMessage) => {
  const responseData = error?.response?.data;

  if (typeof responseData === "string" && responseData.trim()) {
    return responseData.trim();
  }

  if (responseData?.message) {
    return responseData.message;
  }

  if (Array.isArray(responseData?.details) && responseData.details.length) {
    const firstDetail = responseData.details[0];

    if (typeof firstDetail === "string" && firstDetail.trim()) {
      return firstDetail.trim();
    }

    if (firstDetail?.message) {
      return firstDetail.message;
    }
  }

  if (error?.message) {
    return error.message;
  }

  return fallbackMessage;
};

const marketingTypeConfig = {
  event: {
    title: "Cyber Week Scheduling",
    subtitle: "Country-specific sales windows ready for activation.",
    primaryLabel: "Event",
    addLabel: "Add event",
  },
  coupon: {
    title: "Coupons & Deals",
    subtitle: "Monitor usage and pause campaigns that show abuse risk.",
    primaryLabel: "Coupon code",
    addLabel: "Add coupon",
  },
  ad: {
    title: "Seller Advertising",
    subtitle: "Approve campaigns and set spend ceilings before activation.",
    primaryLabel: "Seller / campaign",
    addLabel: "Add ad campaign",
  },
  referral: {
    title: "Referrals & Rewards",
    subtitle: "Track conversion performance and payout readiness.",
    primaryLabel: "Program",
    addLabel: "Add referral program",
  },
};

const parseJsonObject = (value) => {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  return value;
};

const parseJsonValue = (value) => {
  if (typeof value !== "string") {
    return value;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return value;
  }

  if (
    (trimmed.startsWith("{") && trimmed.endsWith("}")) ||
    (trimmed.startsWith("[") && trimmed.endsWith("]"))
  ) {
    try {
      return JSON.parse(trimmed);
    } catch {
      return value;
    }
  }

  return value;
};

const isAssetReference = (value) =>
  typeof value === "string" &&
  (/^[a-z]+:\/\//i.test(value.trim()) || value.trim().startsWith("/"));

const kycDocumentPathPattern =
  /(document|documents|doc|certificate|license|permit|registration|tax|proof|identity|passport|nin|bvn|cac|utility|verification|compliance|kyc|media|image|photo|file|upload)/i;

const metadataAssetPathExclusions = new Set([
  "admin_review",
  "capabilities",
  "cover",
]);

const sellerKycPathPattern =
  /(identity|passport|nin|bvn|utility|verification|compliance|kyc|tax)/i;

const storeAssetPathPattern =
  /(banner|picture|logo|image|photo|media|document|documents|doc|certificate|license|permit|registration|tax|cac|verification|compliance|kyc|file|upload|pharmacy|certification)/i;

const documentUrlFieldCandidates = [
  "url",
  "media_url",
  "image",
  "image_url",
  "file",
  "file_url",
  "document",
  "document_url",
  "path",
  "src",
  "href",
  "link",
];

const looksLikeImageAsset = (document = {}) => {
  const mimeType = String(document.mime_type || document.mimeType || "").toLowerCase();
  if (mimeType.startsWith("image/")) {
    return true;
  }

  return /\.(png|jpe?g|gif|webp|bmp|svg)(\?.*)?$/i.test(String(document.url || ""));
};

const normalizeDocumentLabel = (value = "") =>
  String(value)
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (match) => match.toUpperCase())
    .trim();

const buildNormalizedDocumentAsset = (document, source, fallbackLabel) => {
  if (!document) {
    return null;
  }

  if (typeof document === "string") {
    if (!isAssetReference(document)) {
      return null;
    }

    return {
      key: `${source}-${document}`,
      label: fallbackLabel,
      url: document,
      source,
      role: null,
      mime_type: null,
      createdAt: null,
      updatedAt: null,
      metadata: null,
    };
  }

  const parsedDocument = parseJsonValue(document);
  const documentObject = parseJsonObject(parsedDocument);
  if (!documentObject) {
    return null;
  }

  const urlCandidate = documentUrlFieldCandidates.find((field) =>
    isAssetReference(documentObject[field]),
  );
  const url = urlCandidate ? String(documentObject[urlCandidate]).trim() : "";

  if (!url) {
    return null;
  }

  const label =
    documentObject.label ||
    documentObject.name ||
    documentObject.title ||
    documentObject.document_label ||
    documentObject.document_type ||
    documentObject.type ||
    fallbackLabel;

  return {
    key: documentObject.key || `${source}-${documentObject.id || url}`,
    label: normalizeDocumentLabel(String(label || fallbackLabel)),
    url,
    source: documentObject.source || source,
    role: documentObject.role || documentObject.media_role || null,
    mime_type: documentObject.mime_type || documentObject.mimeType || null,
    createdAt: documentObject.createdAt || documentObject.created_at || null,
    updatedAt: documentObject.updatedAt || documentObject.updated_at || null,
    metadata: parseJsonObject(documentObject.metadata) || null,
  };
};

const mergeDocumentAssets = (...lists) => {
  const seen = new Set();

  return lists
    .flat()
    .filter(Boolean)
    .filter((document) => {
      const url = String(document.url || "").trim();
      if (!url || seen.has(url)) {
        return false;
      }

      seen.add(url);
      return true;
    });
};

const extractDocumentsFromMetadata = (
  metadataValue,
  source,
  {
    pathPattern = kycDocumentPathPattern,
    excludedSegments = metadataAssetPathExclusions,
  } = {},
) => {
  const parsedMetadata = parseJsonValue(metadataValue);
  const results = [];
  const seen = new Set();

  const walk = (value, path = []) => {
    const parsedValue = parseJsonValue(value);

    if (Array.isArray(parsedValue)) {
      parsedValue.forEach((entry, index) => walk(entry, [...path, String(index)]));
      return;
    }

    const objectValue = parseJsonObject(parsedValue);
    if (objectValue) {
      const pathLabel = path
        .filter((segment) => segment && !/^\d+$/.test(segment))
        .join(".");
      const normalizedPathLabel = pathLabel.toLowerCase();
      const directDocument = buildNormalizedDocumentAsset(
        objectValue,
        source,
        normalizeDocumentLabel(path[path.length - 1] || "Document"),
      );

      if (
        directDocument &&
        pathPattern.test(
          [
            normalizedPathLabel,
            objectValue.role,
            objectValue.type,
            objectValue.document_type,
            objectValue.document_label,
            objectValue.label,
            objectValue.name,
            objectValue.title,
          ]
            .filter(Boolean)
            .join(" "),
        ) &&
        !seen.has(directDocument.url)
      ) {
        seen.add(directDocument.url);
        results.push(directDocument);
      }

      Object.entries(objectValue).forEach(([key, entryValue]) => {
        walk(entryValue, [...path, key]);
      });
      return;
    }

    if (!isAssetReference(parsedValue)) {
      return;
    }

    const cleanedPath = path.filter(
      (segment) => segment && !/^\d+$/.test(String(segment)),
    );
    const normalizedSegments = cleanedPath.map((segment) => String(segment).toLowerCase());
    const lastSegment = normalizedSegments[normalizedSegments.length - 1] || "";
    const pathLabel = normalizedSegments.join(".");

    if (
      excludedSegments.has(lastSegment) ||
      !pathPattern.test(pathLabel)
    ) {
      return;
    }

    const url = String(parsedValue).trim();
    if (seen.has(url)) {
      return;
    }

    seen.add(url);
    results.push({
      key: `${source}-${url}`,
      label: normalizeDocumentLabel(cleanedPath[cleanedPath.length - 1] || "Document"),
      url,
      source,
      role: null,
      mime_type: null,
      createdAt: null,
      updatedAt: null,
      metadata: null,
    });
  };

  walk(parsedMetadata, []);
  return results;
};

const resolveSellerKycDocuments = (record = {}) =>
  mergeDocumentAssets(
    (record.sellerKycDocuments || record.seller_kyc_documents || []).map((document) =>
      buildNormalizedDocumentAsset(document, "seller_kyc", "Seller KYC File"),
    ),
    extractDocumentsFromMetadata(record.seller?.metadata, "seller_kyc", {
      pathPattern: sellerKycPathPattern,
    }),
    extractDocumentsFromMetadata(record.seller?.metaData, "seller_kyc", {
      pathPattern: sellerKycPathPattern,
    }),
    extractDocumentsFromMetadata(record.metadata, "seller_kyc", {
      pathPattern: sellerKycPathPattern,
    }),
    extractDocumentsFromMetadata(record.metaData, "seller_kyc", {
      pathPattern: sellerKycPathPattern,
    }),
  );

const resolveStoreDocuments = (record = {}) =>
  mergeDocumentAssets(
    (record.storeDocuments || record.store_documents || []).map((document) =>
      buildNormalizedDocumentAsset(document, "store_document", "Store Document"),
    ),
    extractDocumentsFromMetadata(record.metadata, "store_document", {
      pathPattern: storeAssetPathPattern,
    }),
    extractDocumentsFromMetadata(record.metaData, "store_document", {
      pathPattern: storeAssetPathPattern,
    }),
  );

const buildProductMediaRows = (product) => {
  const raw = product?.raw || {};
  const productMedia = Array.isArray(raw.productMedia) ? raw.productMedia : [];
  const unitMedia = Array.isArray(raw.unitMedia) ? raw.unitMedia : [];
  const mediaRows = [
    ...productMedia.map((item, index) => ({
      id: item.id || `product-media-${index}`,
      scope: "product",
      url: item.url || item.image || item.path || "",
      type: item.type || item.mime_type || "image",
      status: item.status ?? 1,
      metadata: parseJsonObject(item.metadata) || null,
      createdAt: item.created_at || item.createdAt || null,
    })),
    ...unitMedia.map((item, index) => ({
      id: item.id || `unit-media-${index}`,
      scope: "unit",
      url: item.url || item.image || item.path || "",
      type: item.type || item.mime_type || "image",
      status: item.status ?? 1,
      metadata: parseJsonObject(item.metadata) || null,
      createdAt: item.created_at || item.createdAt || null,
    })),
  ];

  return mediaRows.filter((item) => item.url);
};

const extractMarketingMetadata = (record = {}) =>
  parseJsonObject(record.metadata) || {};

export const BloomzonAccessWorkspace = () => {
  const { token } = useContext(MainContext);
  const navigate = useNavigate();
  const [admins, setAdmins] = useState([]);
  const [rolesData, setRolesData] = useState({ roles: [], permissions: [] });
  const [auditLogs, setAuditLogs] = useState(defaultAdminAuditLogs);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadAccess = async () => {
    try {
      setLoading(true);
      setError("");
      const [adminData, roleData, activityData] = await Promise.all([
        fetchAdminAdmins(token),
        fetchAdminRoles(token),
        getAuditLogs(token, { page: 1, limit: 12 }),
      ]);
      setAdmins(adminData.items || []);
      setRolesData(roleData);
      setAuditLogs(activityData?.data || defaultAdminAuditLogs);
    } catch (loadError) {
      setError(
        loadError?.response?.data?.message ||
          "Failed to load access and audit data.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadAccess();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const activeAdmins = useMemo(
    () => admins.filter((admin) => Number(admin.status) === 1).length,
    [admins],
  );

  const roleUsageMap = useMemo(
    () =>
      admins.reduce((acc, admin) => {
        (admin.roles || []).forEach((role) => {
          acc[role] = (acc[role] || 0) + 1;
        });
        return acc;
      }, {}),
    [admins],
  );

  const exportAuditLog = () => {
    const rows = (auditLogs.items || []).map((activity) => ({
      occurred_at: formatDateTime(activity.createdAt),
      admin: activity.adminAccount?.user?.name || activity.adminAccount?.email || "",
      admin_code: activity.adminAccount?.admin_code || "",
      roles: (activity.adminAccount?.roles || []).join(", "),
      action: activity.action || "",
      target_id: activity.target_id || "",
      ip_address: activity.ip_address || "",
      metadata: JSON.stringify(activity.details || {}),
    }));

    if (downloadCsv("bloomzon-admin-audit-log.csv", rows)) {
      message.success("Audit log exported.");
    }
  };

  return (
    <AdminWorkspaceShell
      eyebrow="Access"
      title="Access & User Management"
      subtitle="Admin identity, role coverage, permission catalog, and exportable audit activity in one place."
      actions={
        <>
          <Button onClick={() => navigate("/dashboard/others/admins")}>
            Manage admins
          </Button>
          <Button onClick={() => navigate("/dashboard/others/admins/audit-logs")}>
            Open full audit log
          </Button>
          <Button
            icon={<DownloadOutlined />}
            onClick={exportAuditLog}
            disabled={!auditLogs.items.length}
          >
            Export audit log
          </Button>
          <Button icon={<ReloadOutlined />} onClick={loadAccess}>
            Refresh
          </Button>
        </>
      }
    >
      {error ? (
        <Alert style={{ marginBottom: 18 }} type="error" showIcon message={error} />
      ) : null}
      <DataGapNotice
        title="Compliance notes"
        items={[
          "Audit events now include admin codes, role snapshots, timestamps, request context, and IP addresses.",
          "Backend route-level permission enforcement is active for admin, user, finance, catalog, and subscription endpoints.",
          "Super Admin activity is captured in the same audit stream as every other admin.",
          "Use the full audit log screen for filtering, pagination, and export across the complete admin history.",
        ]}
      />
      {loading ? (
        <div className="flex flex-center" style={{ minHeight: 320 }}>
          <Spin size="large" />
        </div>
      ) : (
        <>
          <div className="admin-kpi-grid" style={{ marginBottom: 18 }}>
            <SummaryCard
              label="Admins"
              value={formatNumber(admins.length)}
              helper="All internal admin accounts."
            />
            <SummaryCard
              label="Active admins"
              value={formatNumber(activeAdmins)}
              helper="Accounts currently enabled."
            />
            <SummaryCard
              label="Role templates"
              value={formatNumber(rolesData.roles?.length)}
              helper="Backend-defined role presets."
            />
            <SummaryCard
              label="Audit events"
              value={formatNumber(auditLogs.summary.total)}
              helper="Recent admin API events available for export."
            />
          </div>

          <div className="admin-section-grid admin-section-grid--3" style={{ marginBottom: 18 }}>
            {(rolesData.roles || []).map((role) => (
              <section className="admin-panel admin-panel--soft" key={role.key}>
                <div className="admin-panel__body">
                  <div className="admin-panel__header">
                    <div>
                      <h2 className="admin-panel__title">{role.label}</h2>
                      <div className="admin-panel__subtitle">{role.description}</div>
                    </div>
                    <Tag color="geekblue">
                      {formatNumber(roleUsageMap[role.key] || 0)} assigned
                    </Tag>
                  </div>
                  <div className="admin-inline-stats">
                    {(role.permissions || []).map((permission) => (
                      <span className="admin-stat-pill" key={permission}>
                        {prettifyKey(permission)}
                      </span>
                    ))}
                  </div>
                </div>
              </section>
            ))}
          </div>

          <div className="admin-section-grid admin-section-grid--2">
            <section className="admin-panel">
              <div className="admin-panel__body">
                <div className="admin-panel__header">
                  <div>
                    <h2 className="admin-panel__title">Admin Directory</h2>
                    <div className="admin-panel__subtitle">
                      Unique admin IDs, assigned roles, and effective permissions.
                    </div>
                  </div>
                </div>
                <Table
                  rowKey="id"
                  pagination={false}
                  dataSource={admins}
                  locale={{ emptyText: <Empty description="No admin accounts" /> }}
                  columns={[
                    {
                      title: "Admin",
                      key: "admin",
                      render: (_, record) => (
                        <div>
                          <div style={{ fontWeight: 600 }}>
                            {record.user?.name || record.email}
                          </div>
                          <div style={{ color: "#6b7280", fontSize: 12 }}>
                            {record.email}
                          </div>
                        </div>
                      ),
                    },
                    {
                      title: "Admin ID",
                      dataIndex: "admin_code",
                      key: "admin_code",
                    },
                    {
                      title: "Roles",
                      key: "roles",
                      render: (_, record) => (
                        <Space size={[4, 4]} wrap>
                          {(record.roles || []).map((role) => (
                            <Tag color="blue" key={`${record.id}-${role}`}>
                              {prettifyKey(role)}
                            </Tag>
                          ))}
                        </Space>
                      ),
                    },
                    {
                      title: "Permissions",
                      key: "permissionsCount",
                      render: (_, record) => formatNumber(record.permissionsCount),
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

            <section className="admin-panel admin-panel--soft">
              <div className="admin-panel__body">
                <div className="admin-panel__header">
                  <div>
                    <h2 className="admin-panel__title">Audit Activity</h2>
                    <div className="admin-panel__subtitle">
                      Latest audit events with admin identity, role snapshot, target, and IP trace.
                    </div>
                  </div>
                </div>
                <Table
                  rowKey={(record) => `${record.createdAt}-${record.action}-${record.id || ""}`}
                  pagination={false}
                  dataSource={auditLogs.items}
                  locale={{ emptyText: <Empty description="No activity records" /> }}
                  columns={[
                    {
                      title: "Occurred",
                      key: "occurredAt",
                      render: (_, record) => formatDateTime(record.createdAt),
                    },
                    {
                      title: "Action",
                      key: "action",
                      render: (_, record) => (
                        <div>
                          <div style={{ fontWeight: 600 }}>
                            {prettifyKey(record.action)}
                          </div>
                          <div style={{ color: "#6b7280", fontSize: 12 }}>
                            {(record.adminAccount?.roles || []).join(", ") || "No roles"}
                          </div>
                        </div>
                      ),
                    },
                    {
                      title: "Actor",
                      key: "actor",
                      render: (_, record) =>
                        record.adminAccount?.user?.name ||
                        record.adminAccount?.email ||
                        "Unknown admin",
                    },
                    {
                      title: "Target",
                      key: "target",
                      render: (_, record) => record.target_id || "N/A",
                    },
                    {
                      title: "IP",
                      key: "ip",
                      render: (_, record) => record.ip_address || "N/A",
                    },
                  ]}
                />
              </div>
            </section>
          </div>
        </>
      )}
    </AdminWorkspaceShell>
  );
};

export const BloomzonOrdersWorkspace = () => {
  const { token, user } = useContext(MainContext);
  const navigate = useNavigate();
  const [orders, setOrders] = useState(defaultAdminOrders);
  const [deliveryOrders, setDeliveryOrders] = useState(defaultAdminDeliveryOrders);
  const [withdrawals, setWithdrawals] = useState(defaultAdminWithdrawals);
  const [refunds, setRefunds] = useState(defaultAdminRefunds);
  const [riskMonitoring, setRiskMonitoring] = useState(defaultAdminRiskMonitoring);
  const [approvalRequests, setApprovalRequests] = useState(defaultAdminApprovalRequests);
  const [loading, setLoading] = useState(false);
  const [actionBusy, setActionBusy] = useState("");
  const [error, setError] = useState("");
  const [refundModalOpen, setRefundModalOpen] = useState(false);
  const [deliveryModalOpen, setDeliveryModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedDeliveryOrder, setSelectedDeliveryOrder] = useState(null);
  const [refundForm] = Form.useForm();
  const [deliveryForm] = Form.useForm();

  const canManageOrders = hasAdminPermission(user, ["orders:manage", "finance:manage"]);
  const canManageFinance = hasAdminPermission(user, "finance:manage");

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError("");
      const [
        ordersData,
        deliveryData,
        withdrawalData,
        refundData,
        riskData,
        approvalData,
      ] = await Promise.all([
        fetchAdminOrders(token, { page: 1, limit: 8, type: "product" }),
        fetchAdminDeliveryOrders(token, { page: 1, limit: 8 }),
        fetchAdminWithdrawals(token, { page: 1, limit: 8 }),
        fetchAdminRefunds(token, { page: 1, limit: 8 }),
        fetchAdminRiskMonitoring(token, { page: 1, limit: 8 }),
        fetchAdminApprovalRequests(token, {
          page: 1,
          limit: 8,
          status: "pending_authorization",
        }),
      ]);

      setOrders(ordersData || defaultAdminOrders);
      setDeliveryOrders(deliveryData || defaultAdminDeliveryOrders);
      setWithdrawals(withdrawalData || defaultAdminWithdrawals);
      setRefunds(refundData || defaultAdminRefunds);
      setRiskMonitoring(riskData || defaultAdminRiskMonitoring);
      setApprovalRequests(approvalData || defaultAdminApprovalRequests);
    } catch (loadError) {
      setError(
        loadError?.response?.data?.message ||
          "Failed to load orders, payments, and refund data.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadOrders();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleWithdrawalAction = async (record, action) => {
    try {
      setActionBusy(`${action}-${record.id}`);
      await createAdminApprovalRequest(token, {
        resource_type: "withdrawal",
        resource_id: String(record.id),
        action,
        reason: `Withdrawal ${prettifyKey(action)} requested`,
        notes: `Requested from Orders workspace for ${record.vendor?.name || "seller"}.`,
      });
      message.success("Withdrawal approval request submitted.");
      await loadOrders();
    } catch (actionError) {
      message.error(
        actionError?.response?.data?.message ||
          "Failed to submit withdrawal approval request.",
      );
    } finally {
      setActionBusy("");
    }
  };

  const handleApprovalDecision = async (record, decision) => {
    try {
      setActionBusy(`${decision}-approval-${record.id}`);
      await decideAdminApprovalRequest(token, record.id, {
        decision,
        notes:
          decision === "approve"
            ? "Approved from Orders workspace"
            : "Rejected from Orders workspace",
      });
      message.success(
        decision === "approve"
          ? "Approval request completed."
          : "Approval request rejected.",
      );
      await loadOrders();
    } catch (actionError) {
      message.error(
        actionError?.response?.data?.message ||
          "Failed to process approval request.",
      );
    } finally {
      setActionBusy("");
    }
  };

  const openRefundModal = (record) => {
    setSelectedOrder(record);
    refundForm.setFieldsValue({
      order_id: record.id,
      user_id: String(record.customer?.id || ""),
      amount: Number(record.totalAmount || 0),
      method: "original",
      reason: "",
      notes: "",
    });
    setRefundModalOpen(true);
  };

  const submitRefundRequest = async () => {
    try {
      const values = await refundForm.validateFields();
      setActionBusy(`refund-${values.order_id}`);
      await createAdminApprovalRequest(token, {
        resource_type: "refund",
        action: "create",
        reason: values.reason,
        notes: values.notes,
        payload: {
          order_id: Number(values.order_id),
          user_id: String(values.user_id),
          amount: Number(values.amount),
          reason: values.reason,
          method: values.method,
          notes: values.notes,
        },
      });
      message.success("Refund approval request submitted.");
      setRefundModalOpen(false);
      setSelectedOrder(null);
      refundForm.resetFields();
      await loadOrders();
    } catch (actionError) {
      if (actionError?.errorFields) {
        return;
      }
      message.error(
        actionError?.response?.data?.message ||
          "Failed to submit refund approval request.",
      );
    } finally {
      setActionBusy("");
    }
  };

  const openDeliveryModal = (record) => {
    setSelectedDeliveryOrder(record);
    deliveryForm.setFieldsValue({
      carrier: record.fulfillment?.carrier || "",
      provider_name: record.fulfillment?.provider?.name || "",
      tracking_number: record.fulfillment?.trackingNumber || "",
      delivery_status: record.delivery?.status || "",
      order_status: record.orderStatus || "",
      estimated_delivery: record.fulfillment?.estimatedDelivery || null,
      notes: "",
    });
    setDeliveryModalOpen(true);
  };

  const submitDeliveryApproval = async () => {
    try {
      const values = await deliveryForm.validateFields();
      setActionBusy(`delivery-${selectedDeliveryOrder?.id}`);
      await createAdminApprovalRequest(token, {
        resource_type: "delivery",
        resource_id: String(selectedDeliveryOrder?.id),
        action: "update",
        reason: values.notes || "Delivery update requested",
        notes: values.notes || null,
        payload: values,
      });
      message.success("Delivery approval request submitted.");
      setDeliveryModalOpen(false);
      setSelectedDeliveryOrder(null);
      deliveryForm.resetFields();
      await loadOrders();
    } catch (actionError) {
      if (actionError?.errorFields) {
        return;
      }
      message.error(
        actionError?.response?.data?.message ||
          "Failed to submit delivery approval request.",
      );
    } finally {
      setActionBusy("");
    }
  };

  const orderTotal =
    Number(orders.summary.total || 0) + Number(deliveryOrders.summary.total || 0);
  const completedTotal =
    Number(orders.summary.completed || 0);
  const pendingTotal =
    Number(orders.summary.pending || 0) + Number(deliveryOrders.summary.pending || 0);

  return (
    <AdminWorkspaceShell
      eyebrow="Orders"
      title="Orders, Payments & Refunds"
      subtitle="Purchase orders, delivery operations, refunds, risk monitoring, and dual-approval queues."
      actions={
        <>
          <Button onClick={() => navigate("/dashboard/orders/products")}>
            Product orders
          </Button>
          <Button icon={<ReloadOutlined />} onClick={loadOrders}>
            Refresh
          </Button>
        </>
      }
    >
      {error ? (
        <Alert style={{ marginBottom: 18 }} type="error" showIcon message={error} />
      ) : null}
      <DataGapNotice
        title="Workflow coverage"
        items={[
          "Refund, withdrawal, and delivery actions can now be routed through initiator/authorizer approval requests.",
          "Risk monitoring is sourced from failed payments, refund states, risky support tickets, and problematic withdrawals.",
          "Delivery SLA breach counts now come from tracked fulfillment dates where available, with a 72-hour fallback window.",
        ]}
      />
      {loading ? (
        <div className="flex flex-center" style={{ minHeight: 320 }}>
          <Spin size="large" />
        </div>
      ) : (
        <>
          <div className="admin-kpi-grid" style={{ marginBottom: 18 }}>
            <SummaryCard
              label="Orders"
              value={formatNumber(orderTotal)}
              helper="Combined product and food order volume."
            />
            <SummaryCard
              label="Completed"
              value={formatNumber(completedTotal)}
              helper="Orders already completed."
            />
            <SummaryCard
              label="Pending"
              value={formatNumber(pendingTotal)}
              helper="Orders waiting for next action."
            />
            <SummaryCard
              label="Pending approvals"
              value={formatNumber(approvalRequests.summary.pending)}
              helper="Admin actions waiting for authorizer approval."
            />
          </div>

          <div className="admin-section-grid admin-section-grid--2">
            <section className="admin-panel">
              <div className="admin-panel__body">
                <div className="admin-panel__header">
                  <div>
                    <h2 className="admin-panel__title">Purchase Orders</h2>
                    <div className="admin-panel__subtitle">
                      Buyer, seller context, amount, order status, and timestamps.
                    </div>
                  </div>
                </div>
                <Table
                  rowKey="id"
                  pagination={false}
                  dataSource={orders.items}
                  locale={{ emptyText: <Empty description="No orders found" /> }}
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
                      title: "Seller",
                      key: "seller",
                      render: (_, record) =>
                        record.items?.[0]?.storeInfo?.store_name ||
                        record.items?.[0]?.storeInfo?.name ||
                        "Unassigned",
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
                    {
                      title: "Actions",
                      key: "actions",
                      render: (_, record) =>
                        canManageFinance ? (
                          <Button size="small" onClick={() => openRefundModal(record)}>
                            Request refund
                          </Button>
                        ) : (
                          <span style={{ color: "#9ca3af" }}>View only</span>
                        ),
                    },
                  ]}
                />
              </div>
            </section>

            <section className="admin-panel admin-panel--soft">
              <div className="admin-panel__body">
                <div className="admin-panel__header">
                  <div>
                    <h2 className="admin-panel__title">Withdrawal Reviews</h2>
                    <div className="admin-panel__subtitle">
                      Payment actions that are currently supported by the paired backend.
                    </div>
                  </div>
                </div>
                <Table
                  rowKey="id"
                  pagination={false}
                  dataSource={withdrawals.items}
                  locale={{ emptyText: <Empty description="No withdrawal requests" /> }}
                  columns={[
                    {
                      title: "Seller",
                      key: "seller",
                      render: (_, record) => (
                        <div>
                          <div style={{ fontWeight: 600 }}>
                            {record.vendor?.name || "Unknown seller"}
                          </div>
                          <div style={{ color: "#6b7280", fontSize: 12 }}>
                            {record.vendor?.email || "No email"}
                          </div>
                        </div>
                      ),
                    },
                    {
                      title: "Amount",
                      key: "amount",
                      render: (_, record) => formatCurrency(record.amount),
                    },
                    {
                      title: "Status",
                      key: "status",
                      render: (_, record) => renderStatusTag(record.status),
                    },
                    {
                      title: "Actions",
                      key: "actions",
                      render: (_, record) => (
                        <Space wrap>
                          {record.status === "pending" ? (
                            <>
                              <Button
                                size="small"
                                type="primary"
                                disabled={!canManageFinance}
                                loading={actionBusy === `post-${record.id}`}
                                onClick={() => handleWithdrawalAction(record, "post")}
                              >
                                Request post
                              </Button>
                              <Button
                                size="small"
                                disabled={!canManageFinance}
                                loading={actionBusy === `fail-${record.id}`}
                                onClick={() => handleWithdrawalAction(record, "fail")}
                              >
                                Request fail
                              </Button>
                            </>
                          ) : null}
                          {record.status === "posted" ? (
                            <Button
                              size="small"
                              danger
                              disabled={!canManageFinance}
                              loading={actionBusy === `reverse-${record.id}`}
                              onClick={() => handleWithdrawalAction(record, "reverse")}
                            >
                              Request reverse
                            </Button>
                          ) : null}
                        </Space>
                      ),
                    },
                  ]}
                />
              </div>
            </section>
          </div>

          <div className="admin-section-grid admin-section-grid--2" style={{ marginTop: 18 }}>
            <section className="admin-panel admin-panel--soft">
              <div className="admin-panel__body">
                <div className="admin-panel__header">
                  <div>
                    <h2 className="admin-panel__title">Delivery Orders</h2>
                    <div className="admin-panel__subtitle">
                      Carrier, tracking, delivery status, and SLA visibility for active delivery work.
                    </div>
                  </div>
                </div>
                <Table
                  rowKey="id"
                  pagination={false}
                  dataSource={deliveryOrders.items}
                  locale={{ emptyText: <Empty description="No delivery orders" /> }}
                  columns={[
                    {
                      title: "Order",
                      key: "orderNumber",
                      render: (_, record) => (
                        <div>
                          <div style={{ fontWeight: 600 }}>{record.orderNumber}</div>
                          <div style={{ color: "#6b7280", fontSize: 12 }}>
                            {record.fulfillment?.trackingNumber || "No tracking number"}
                          </div>
                        </div>
                      ),
                    },
                    {
                      title: "Carrier",
                      key: "carrier",
                      render: (_, record) => record.fulfillment?.carrier || "Unassigned",
                    },
                    {
                      title: "Delivery",
                      key: "delivery",
                      render: (_, record) => (
                        <Space wrap>
                          {renderStatusTag(record.delivery?.status || "pending")}
                          {record.sla?.breached ? <Tag color="red">SLA breached</Tag> : null}
                        </Space>
                      ),
                    },
                    {
                      title: "Status",
                      key: "orderStatus",
                      render: (_, record) => renderStatusTag(record.orderStatus),
                    },
                    {
                      title: "Actions",
                      key: "actions",
                      render: (_, record) =>
                        canManageOrders ? (
                          <Button
                            size="small"
                            loading={actionBusy === `delivery-${record.id}`}
                            onClick={() => openDeliveryModal(record)}
                          >
                            Request update
                          </Button>
                        ) : (
                          <span style={{ color: "#9ca3af" }}>View only</span>
                        ),
                    },
                  ]}
                />
              </div>
            </section>

            <section className="admin-panel">
              <div className="admin-panel__body">
                <div className="admin-panel__header">
                  <div>
                    <h2 className="admin-panel__title">Risk Monitoring</h2>
                    <div className="admin-panel__subtitle">
                      Suspicious payments, dispute signals, failed withdrawals, and refund exceptions.
                    </div>
                  </div>
                </div>
                <Table
                  rowKey="id"
                  pagination={false}
                  dataSource={riskMonitoring.items}
                  locale={{ emptyText: <Empty description="No risk events found" /> }}
                  columns={[
                    {
                      title: "Source",
                      key: "source",
                      render: (_, record) => renderStatusTag(record.source),
                    },
                    {
                      title: "Type",
                      key: "type",
                      render: (_, record) => prettifyKey(record.type),
                    },
                    {
                      title: "Subject",
                      key: "subject",
                      render: (_, record) => record.subject || record.order?.orderNumber || "N/A",
                    },
                    {
                      title: "Status",
                      key: "status",
                      render: (_, record) => renderStatusTag(record.status),
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
          </div>

          <div className="admin-section-grid admin-section-grid--2" style={{ marginTop: 18 }}>
            <section className="admin-panel">
              <div className="admin-panel__body">
                <div className="admin-panel__header">
                  <div>
                    <h2 className="admin-panel__title">Refund Requests</h2>
                    <div className="admin-panel__subtitle">
                      Refund lifecycle and processing state across recent refund records.
                    </div>
                  </div>
                </div>
                <Table
                  rowKey="id"
                  pagination={false}
                  dataSource={refunds.items}
                  locale={{ emptyText: <Empty description="No refunds found" /> }}
                  columns={[
                    {
                      title: "Refund",
                      key: "refund",
                      render: (_, record) => (
                        <div>
                          <div style={{ fontWeight: 600 }}>Refund #{record.id}</div>
                          <div style={{ color: "#6b7280", fontSize: 12 }}>
                            Order {record.order?.orderNumber || record.orderId}
                          </div>
                        </div>
                      ),
                    },
                    {
                      title: "Buyer",
                      key: "buyer",
                      render: (_, record) => record.user?.name || record.user?.email || "Unknown",
                    },
                    {
                      title: "Amount",
                      key: "amount",
                      render: (_, record) =>
                        formatCurrency(record.amount, record.order?.currencyCode || "USD"),
                    },
                    {
                      title: "Status",
                      key: "status",
                      render: (_, record) => renderStatusTag(record.status),
                    },
                    {
                      title: "Requested",
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
                    <h2 className="admin-panel__title">Approval Queue</h2>
                    <div className="admin-panel__subtitle">
                      Initiator and authorizer separation for delivery, refund, and withdrawal decisions.
                    </div>
                  </div>
                </div>
                <Table
                  rowKey="id"
                  pagination={false}
                  dataSource={approvalRequests.items}
                  locale={{ emptyText: <Empty description="No pending approvals" /> }}
                  columns={[
                    {
                      title: "Request",
                      key: "request",
                      render: (_, record) => (
                        <div>
                          <div style={{ fontWeight: 600 }}>{prettifyKey(record.resourceType)}</div>
                          <div style={{ color: "#6b7280", fontSize: 12 }}>
                            {prettifyKey(record.action)} by {record.initiator?.name || "Unknown admin"}
                          </div>
                        </div>
                      ),
                    },
                    {
                      title: "Reason",
                      key: "reason",
                      render: (_, record) => record.reason || "No reason supplied",
                    },
                    {
                      title: "Created",
                      key: "createdAt",
                      render: (_, record) => formatDateTime(record.createdAt),
                    },
                    {
                      title: "Actions",
                      key: "actions",
                      render: (_, record) => (
                        <Space wrap>
                          <Button
                            size="small"
                            type="primary"
                            disabled={!canManageOrders && !canManageFinance}
                            loading={actionBusy === `approve-approval-${record.id}`}
                            onClick={() => handleApprovalDecision(record, "approve")}
                          >
                            Approve
                          </Button>
                          <Button
                            size="small"
                            danger
                            disabled={!canManageOrders && !canManageFinance}
                            loading={actionBusy === `reject-approval-${record.id}`}
                            onClick={() => handleApprovalDecision(record, "reject")}
                          >
                            Reject
                          </Button>
                        </Space>
                      ),
                    },
                  ]}
                />
              </div>
            </section>
          </div>
        </>
      )}
      <Modal
        title={
          selectedOrder
            ? `Request refund for ${selectedOrder.orderNumber}`
            : "Request refund"
        }
        open={refundModalOpen}
        onCancel={() => {
          setRefundModalOpen(false);
          setSelectedOrder(null);
          refundForm.resetFields();
        }}
        onOk={submitRefundRequest}
        okText="Submit approval request"
        confirmLoading={actionBusy.startsWith("refund-")}
      >
        <Form form={refundForm} layout="vertical">
          <Form.Item name="order_id" label="Order ID" hidden>
            <Input />
          </Form.Item>
          <Form.Item
            name="user_id"
            label="Buyer ID"
            rules={[{ required: true, message: "Buyer ID is required" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="amount"
            label="Refund amount"
            rules={[{ required: true, message: "Refund amount is required" }]}
          >
            <InputNumber min={0.01} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="method"
            label="Refund method"
            rules={[{ required: true, message: "Select a refund method" }]}
          >
            <Select
              options={[
                { label: "Original payment", value: "original" },
                { label: "Wallet", value: "wallet" },
                { label: "Store credit", value: "store_credit" },
              ]}
            />
          </Form.Item>
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
      <Modal
        title={
          selectedDeliveryOrder
            ? `Request delivery update for ${selectedDeliveryOrder.orderNumber}`
            : "Request delivery update"
        }
        open={deliveryModalOpen}
        onCancel={() => {
          setDeliveryModalOpen(false);
          setSelectedDeliveryOrder(null);
          deliveryForm.resetFields();
        }}
        onOk={submitDeliveryApproval}
        okText="Submit approval request"
        confirmLoading={actionBusy.startsWith("delivery-")}
      >
        <Form form={deliveryForm} layout="vertical">
          <Form.Item name="carrier" label="Carrier">
            <Input />
          </Form.Item>
          <Form.Item name="provider_name" label="Provider">
            <Input />
          </Form.Item>
          <Form.Item name="tracking_number" label="Tracking number">
            <Input />
          </Form.Item>
          <Form.Item name="delivery_status" label="Delivery status">
            <Input />
          </Form.Item>
          <Form.Item name="order_status" label="Order status">
            <Select
              options={[
                "pending",
                "processing",
                "completed",
                "shipped",
                "cancelled",
                "refunding",
                "refunded",
              ].map((value) => ({ label: prettifyKey(value), value }))}
            />
          </Form.Item>
          <Form.Item name="estimated_delivery" label="Estimated delivery (ISO date-time)">
            <Input placeholder="2026-05-20T12:00:00.000Z" />
          </Form.Item>
          <Form.Item name="notes" label="Reason / notes">
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </AdminWorkspaceShell>
  );
};

export const BloomzonUsersWorkspace = () => {
  const { token, user } = useContext(MainContext);
  const navigate = useNavigate();
  const [users, setUsers] = useState(defaultAdminUsers);
  const [stores, setStores] = useState(defaultAdminStores);
  const [overview, setOverview] = useState(defaultAdminOverview);
  const [vendorSubscriptions, setVendorSubscriptions] = useState(
    defaultAdminVendorSubscriptions,
  );
  const [loading, setLoading] = useState(false);
  const [actionBusy, setActionBusy] = useState("");
  const [error, setError] = useState("");
  const [accountActionModal, setAccountActionModal] = useState({
    open: false,
    record: null,
    action: null,
  });
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [selectedUserRecord, setSelectedUserRecord] = useState(null);
  const [storeActionModal, setStoreActionModal] = useState({
    open: false,
    record: null,
    action: null,
  });
  const [accountActionForm] = Form.useForm();
  const [profileForm] = Form.useForm();
  const [storeActionForm] = Form.useForm();

  const [newUserModalOpen, setNewUserModalOpen] = useState(false);
  const [newUserForm] = Form.useForm();
  const [cities, setCities] = useState([]);
  const [availableRoles, setAvailableRoles] = useState([]);
  const [availablePermissions, setAvailablePermissions] = useState([]);
  const [isAdminChecked, setIsAdminChecked] = useState(false);

  const adminRoleOptions = useMemo(
    () =>
      availableRoles.map((role) => ({
        value: role?.key || role,
        label: role?.label || prettifyKey(role?.key || role),
      })),
    [availableRoles],
  );

  const adminPermissionOptions = useMemo(
    () =>
      availablePermissions.map((permission) => ({
        value: permission?.key || permission,
        label:
          permission?.group && permission?.label
            ? `${permission.group}: ${permission.label}`
            : permission?.label || prettifyKey(permission?.key || permission),
      })),
    [availablePermissions],
  );

  const cityOptions = useMemo(
    () =>
      cities.map((city) => ({
        value: Number(city.id),
        label: city.name,
      })),
    [cities],
  );

  const loadNewUserFormData = async () => {
    try {
      if (cities.length === 0 || availableRoles.length === 0) {
        const [citiesData, rolesData] = await Promise.all([
          fetchAdminCities(token),
          fetchAdminRoles(token),
        ]);
        setCities(Array.isArray(citiesData) ? citiesData : citiesData?.items || []);
        if (rolesData) {
          setAvailableRoles(rolesData.roles || []);
          setAvailablePermissions(rolesData.permissions || []);
        }
      }
    } catch (err) {
      console.error("Failed to load cities/roles details:", err);
    }
  };

  const submitNewUser = async () => {
    try {
      const values = await newUserForm.validateFields();
      const roles = Array.isArray(values.roles) ? values.roles : [];
      const permissions = Array.isArray(values.permissions) ? values.permissions : [];

      if (values.isAdmin && !roles.length && !permissions.length) {
        message.error("Select at least one role or one permission when assigning admin access.");
        return;
      }

      setActionBusy("new-user");
      const result = await createAdminUser(token, {
        first_name: values.first_name,
        last_name: values.last_name,
        email: values.email,
        phone: values.phone,
        city_id: Number(values.city_id),
        password: values.password,
        isAdmin: values.isAdmin || false,
        roles,
        permissions,
      });

      if (result.success) {
        message.success(result.message || "User created successfully.");
        setNewUserModalOpen(false);
        newUserForm.resetFields();
        setIsAdminChecked(false);
        await loadUsers();
      } else {
        message.error(result.message || "Failed to create user.");
      }
    } catch (submitError) {
      if (submitError?.errorFields) {
        return;
      }
      message.error(getRequestErrorMessage(submitError, "Failed to register new user."));
    } finally {
      setActionBusy("");
    }
  };

  const canManageUsers = hasAdminPermission(user, "users:manage");
  const canManageSubscriptions = hasAdminPermission(user, "subscriptions:manage");

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError("");
      const [userData, storeData, overviewData, vendorSubscriptionData] =
        await Promise.all([
        fetchAdminUsers(token, {
          role: "all",
          group: "all",
          page: 1,
          limit: 16,
          includeHealth: true,
        }),
        fetchAdminStores(token, { status: "pending", page: 1, limit: 20 }),
        fetchAdminOverview(token),
        fetchAdminVendorSubscriptions(token, { page: 1, limit: 10 }),
      ]);
      setUsers(userData || defaultAdminUsers);
      setStores(storeData || defaultAdminStores);
      setOverview(overviewData || defaultAdminOverview);
      setVendorSubscriptions(
        vendorSubscriptionData || defaultAdminVendorSubscriptions,
      );
    } catch (loadError) {
      setError(
        loadError?.response?.data?.message ||
          "Failed to load seller and buyer management data.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadUsers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const restrictedCount = useMemo(
    () =>
      (users.items || []).filter((item) => item.adminLocked || item.adminBanned)
        .length,
    [users.items],
  );

  const pendingKycDocsCount = useMemo(
    () =>
      (stores.items || []).reduce((count, store) => {
        return count + resolveSellerKycDocuments(store).length;
      }, 0),
    [stores.items],
  );

  const pendingStoreDocsCount = useMemo(
    () =>
      (stores.items || []).reduce((count, store) => {
        return count + resolveStoreDocuments(store).length;
      }, 0),
    [stores.items],
  );

  const pendingStores = useMemo(
    () =>
      (stores.items || []).map((store) => ({
        ...store,
        resolvedSellerKycDocuments: resolveSellerKycDocuments(store),
        resolvedStoreDocuments: resolveStoreDocuments(store),
      })),
    [stores.items],
  );

  const activeVendorSubscriptions = useMemo(
    () => Number(vendorSubscriptions.summary.activeSubscriptions || 0),
    [vendorSubscriptions.summary.activeSubscriptions],
  );

  const overdueVendorSubscriptions = useMemo(
    () => Number(vendorSubscriptions.summary.overdueSubscriptions || 0),
    [vendorSubscriptions.summary.overdueSubscriptions],
  );

  const renderDocumentList = (documents = [], emptyDescription) => {
    if (!documents.length) {
      return <span style={{ color: "#9ca3af" }}>{emptyDescription}</span>;
    }

    return (
      <div style={{ display: "grid", gap: 8 }}>
        {documents.map((document) => (
          <div
            key={document.key || `${document.url}-${document.label}`}
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: 10,
              padding: "8px 10px",
              background: "#fff",
            }}
            >
              {looksLikeImageAsset(document) ? (
                <div style={{ marginBottom: 8 }}>
                  <Image
                    src={document.url}
                    alt={document.label || "Document preview"}
                    width={56}
                    height={56}
                    style={{ objectFit: "cover", borderRadius: 8 }}
                  />
                </div>
              ) : null}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                gap: 8,
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <div style={{ fontWeight: 600 }}>{document.label || "Document"}</div>
              <a href={document.url} target="_blank" rel="noreferrer">
                Open file
              </a>
            </div>
            <div style={{ marginTop: 4, color: "#6b7280", fontSize: 12 }}>
              {document.role ? prettifyKey(document.role) : "Submitted file"}
              {document.createdAt
                ? ` • ${formatDateTime(document.createdAt)}`
                : document.updatedAt
                  ? ` • ${formatDateTime(document.updatedAt)}`
                  : ""}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const handleUserAction = async (record, action) => {
    setAccountActionModal({ open: true, record, action });
    accountActionForm.setFieldsValue({
      reason: `${prettifyKey(action)} requested from Seller & Buyer Management workspace`,
    });
  };

  const handleStoreAction = async (record, action) => {
    setStoreActionModal({ open: true, record, action });
    storeActionForm.setFieldsValue({
      reason: `KYC ${prettifyKey(action)} requested from Seller & Buyer Management workspace`,
    });
  };

  const submitUserAction = async () => {
    try {
      const values = await accountActionForm.validateFields();
      const record = accountActionModal.record;
      const action = accountActionModal.action;
      setActionBusy(`${action}-${record.id}`);
      await updateAdminUserAccess(token, record.id, action, values.reason);
      message.success(`${record.name || record.email} updated successfully.`);
      setAccountActionModal({ open: false, record: null, action: null });
      accountActionForm.resetFields();
      await loadUsers();
    } catch (actionError) {
      if (actionError?.errorFields) {
        return;
      }
      message.error(
        actionError?.response?.data?.message ||
          "Failed to update account access.",
      );
    } finally {
      setActionBusy("");
    }
  };

  const submitStoreAction = async () => {
    try {
      const values = await storeActionForm.validateFields();
      const record = storeActionModal.record;
      const action = storeActionModal.action;
      setActionBusy(`${action}-store-${record.id}`);
      await reviewAdminStore(token, record.id, {
        action,
        reason: values.reason,
      });
      message.success(`Store ${prettifyKey(action)}d successfully.`);
      setStoreActionModal({ open: false, record: null, action: null });
      storeActionForm.resetFields();
      await loadUsers();
    } catch (actionError) {
      if (actionError?.errorFields) {
        return;
      }
      message.error(
        actionError?.response?.data?.message ||
          "Failed to update seller verification queue.",
      );
    } finally {
      setActionBusy("");
    }
  };

  const openProfileModal = (record) => {
    setSelectedUserRecord(record);
    profileForm.setFieldsValue({
      first_name: record.first_name || record.firstName || record.firstname || "",
      last_name: record.last_name || record.lastName || record.lastname || "",
      phone: record.phone || "",
    });
    setProfileModalOpen(true);
  };

  const submitProfileUpdate = async () => {
    try {
      const values = await profileForm.validateFields();
      setActionBusy(`profile-${selectedUserRecord?.id}`);
      await updateAdminUserProfile(token, selectedUserRecord.id, values);
      message.success("User profile updated successfully.");
      setProfileModalOpen(false);
      setSelectedUserRecord(null);
      profileForm.resetFields();
      await loadUsers();
    } catch (actionError) {
      if (actionError?.errorFields) {
        return;
      }
      message.error(
        actionError?.response?.data?.message ||
          "Failed to update user profile.",
      );
    } finally {
      setActionBusy("");
    }
  };

  const handleVendorSubscriptionAction = async (record, action) => {
    try {
      setActionBusy(`${action}-subscription-${record.id}`);
      await updateAdminVendorSubscription(
        token,
        record.vendor?.id || record.vendorId,
        record.serviceKey || record.service_key,
        {
          action,
          notes:
            action === "grant"
              ? "Granted from Seller & Buyer Management workspace"
              : "Revoked from Seller & Buyer Management workspace",
        },
      );
      message.success(
        action === "grant"
          ? "Vendor service access granted."
          : "Vendor service access revoked.",
      );
      await loadUsers();
    } catch (actionError) {
      message.error(
        actionError?.response?.data?.message ||
          "Failed to update vendor subscription.",
      );
    } finally {
      setActionBusy("");
    }
  };

  return (
    <AdminWorkspaceShell
      eyebrow="Users"
      title="Seller & Buyer Management"
      subtitle="Account oversight, KYC queue coverage, and seller verification workflows."
      actions={
        <>
          {canManageUsers && (
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                loadNewUserFormData();
                setNewUserModalOpen(true);
              }}
            >
              Add New User
            </Button>
          )}
          <Button onClick={() => navigate("/dashboard/user/all")}>All users</Button>
          <Button onClick={() => navigate("/dashboard/sellers/all")}>All sellers</Button>
          <Button icon={<ReloadOutlined />} onClick={loadUsers}>
            Refresh
          </Button>
        </>
      }
    >
      {error ? (
        <Alert style={{ marginBottom: 18 }} type="error" showIcon message={error} />
      ) : null}
      <DataGapNotice
        title="Coverage notes"
        items={[
          "Seller KYC files now come from submitted user media linked to the seller account when present.",
          "Store documentation is extracted from submitted store metadata URLs that look like compliance or verification documents.",
          "Vendor service subscriptions are now live and can be granted or revoked from this workspace.",
          "Seller health scoring now reflects open tickets, rating risk, cancellation/refund rate, and listing attention signals where data exists.",
          "Account actions are live and auditable through the backend admin access endpoints.",
        ]}
      />
      {loading ? (
        <div className="flex flex-center" style={{ minHeight: 320 }}>
          <Spin size="large" />
        </div>
      ) : (
        <>
          <div className="admin-kpi-grid" style={{ marginBottom: 18 }}>
            <SummaryCard
              label="Users"
              value={formatNumber(users.summary.groups.all || users.items.length)}
              helper="All buyer and seller accounts returned by admin user search."
            />
            <SummaryCard
              label="Sellers"
              value={formatNumber(overview.summary.sellers.total)}
              helper="Marketplace seller accounts."
            />
            <SummaryCard
              label="Buyers"
              value={formatNumber(overview.summary.buyers.total)}
              helper="Marketplace buyer accounts."
            />
            <SummaryCard
              label="Pending KYC"
              value={formatNumber(stores.summary.pending)}
              helper="Seller verification queue requiring review."
            />
            <SummaryCard
              label="KYC Files"
              value={formatNumber(pendingKycDocsCount)}
              helper="Submitted seller identity/compliance files in queue."
            />
            <SummaryCard
              label="Store Docs"
              value={formatNumber(pendingStoreDocsCount)}
              helper="Store-side compliance documents visible for review."
            />
            <SummaryCard
              label="Active subscriptions"
              value={formatNumber(activeVendorSubscriptions)}
              helper="Vendor services currently granted for access."
            />
            <SummaryCard
              label="Overdue subscriptions"
              value={formatNumber(overdueVendorSubscriptions)}
              helper="Vendor services that need subscription renewal."
            />
          </div>

          <div className="admin-section-grid admin-section-grid--2">
            <section className="admin-panel">
              <div className="admin-panel__body">
                <div className="admin-panel__header">
                  <div>
                    <h2 className="admin-panel__title">Account Actions</h2>
                    <div className="admin-panel__subtitle">
                      Suspend, activate, ban, or unban buyer and seller accounts.
                    </div>
                  </div>
                  <Tag color="orange">{formatNumber(restrictedCount)} restricted</Tag>
                </div>
                <Table
                  rowKey="id"
                  pagination={false}
                  dataSource={users.items}
                  locale={{ emptyText: <Empty description="No users found" /> }}
                  columns={[
                    {
                      title: "User",
                      key: "user",
                      render: (_, record) => (
                        <div>
                          <div style={{ fontWeight: 600 }}>
                            {record.name || `${record.firstname || ""} ${record.lastname || ""}`.trim()}
                          </div>
                          <div style={{ color: "#6b7280", fontSize: 12 }}>
                            {record.email}
                          </div>
                        </div>
                      ),
                    },
                    {
                      title: "Role",
                      key: "role",
                      render: (_, record) => (
                        <Space size={[4, 4]} wrap>
                          {(record.groups || [record.role || "buyer"]).map((group) => (
                            <Tag key={`${record.id}-${group}`}>
                              {prettifyKey(group)}
                            </Tag>
                          ))}
                        </Space>
                      ),
                    },
                    {
                      title: "Status",
                      key: "status",
                      render: (_, record) => (
                        <Space wrap>
                          {record.adminBanned ? renderStatusTag("rejected") : null}
                          {record.adminLocked ? renderStatusTag("suspended") : null}
                          {!record.adminBanned && !record.adminLocked
                            ? renderStatusTag("active")
                            : null}
                        </Space>
                      ),
                    },
                    {
                      title: "Health",
                      key: "health",
                      render: (_, record) =>
                        record.accountHealth?.score ? (
                          <Space wrap>
                            <Tag color="blue">{formatNumber(record.accountHealth.score)}</Tag>
                            <span>
                              {record.accountHealth?.status?.label || "Tracked"}
                            </span>
                          </Space>
                        ) : (
                          <span style={{ color: "#9ca3af" }}>N/A</span>
                        ),
                    },
                    {
                      title: "Actions",
                      key: "actions",
                      render: (_, record) => (
                        <Space wrap>
                          <Button
                            size="small"
                            disabled={!canManageUsers}
                            loading={actionBusy === `profile-${record.id}`}
                            onClick={() => openProfileModal(record)}
                          >
                            Edit profile
                          </Button>
                          {record.adminBanned ? (
                            <Button
                              size="small"
                              disabled={!canManageUsers}
                              loading={actionBusy === `unban-${record.id}`}
                              onClick={() => handleUserAction(record, "unban")}
                            >
                              Unban
                            </Button>
                          ) : (
                            <Button
                              size="small"
                              danger
                              disabled={!canManageUsers}
                              loading={actionBusy === `ban-${record.id}`}
                              onClick={() => handleUserAction(record, "ban")}
                            >
                              Ban
                            </Button>
                          )}
                          {record.adminLocked ? (
                            <Button
                              size="small"
                              disabled={!canManageUsers}
                              loading={actionBusy === `activate-${record.id}`}
                              onClick={() => handleUserAction(record, "activate")}
                            >
                              Activate
                            </Button>
                          ) : (
                            <Button
                              size="small"
                              disabled={!canManageUsers}
                              loading={actionBusy === `suspend-${record.id}`}
                              onClick={() => handleUserAction(record, "suspend")}
                            >
                              Suspend
                            </Button>
                          )}
                          <Button
                            size="small"
                            danger
                            disabled={!canManageUsers}
                            loading={actionBusy === `terminate-${record.id}`}
                            onClick={() => handleUserAction(record, "terminate")}
                          >
                            Terminate
                          </Button>
                        </Space>
                      ),
                    },
                  ]}
                />
              </div>
            </section>

            <section className="admin-panel admin-panel--soft">
              <div className="admin-panel__body">
                <div className="admin-panel__header">
                  <div>
                    <h2 className="admin-panel__title">Seller KYC Queue</h2>
                    <div className="admin-panel__subtitle">
                      Pending seller/store reviews with actual KYC files and store documentation when available.
                    </div>
                  </div>
                  <Tag color="gold">{formatNumber(stores.items?.length || 0)} pending</Tag>
                </div>
                <Table
                  rowKey="id"
                  pagination={false}
                  dataSource={pendingStores}
                  locale={{ emptyText: <Empty description="No pending verification requests" /> }}
                  columns={[
                    {
                      title: "Seller",
                      key: "seller",
                      render: (_, record) => (
                        <div>
                          <div style={{ fontWeight: 600 }}>
                            {record.seller?.name || "Unknown seller"}
                          </div>
                          <div style={{ color: "#6b7280", fontSize: 12 }}>
                            {record.seller?.email || "No email"}
                          </div>
                        </div>
                      ),
                    },
                    {
                      title: "Store",
                      key: "name",
                      render: (_, record) => record.name,
                    },
                    {
                      title: "Service",
                      key: "serviceLabel",
                      render: (_, record) => record.serviceLabel,
                    },
                    {
                      title: "Seller KYC Files",
                      key: "sellerKycDocuments",
                      render: (_, record) =>
                        renderDocumentList(
                          record.resolvedSellerKycDocuments || [],
                          "No seller KYC files attached",
                        ),
                    },
                    {
                      title: "Store Documents",
                      key: "storeDocuments",
                      render: (_, record) =>
                        renderDocumentList(
                          record.resolvedStoreDocuments || [],
                          "No store documents attached",
                        ),
                    },
                    {
                      title: "Submitted",
                      key: "submitted",
                      render: (_, record) =>
                        formatDateTime(record.updatedAt || record.createdAt),
                    },
                    {
                      title: "Actions",
                      key: "actions",
                      render: (_, record) => (
                        <Space wrap>
                          <Button
                            size="small"
                            type="primary"
                            disabled={!canManageUsers}
                            loading={actionBusy === `approve-store-${record.id}`}
                            onClick={() => handleStoreAction(record, "approve")}
                          >
                            Approve
                          </Button>
                          <Button
                            size="small"
                            danger
                            disabled={!canManageUsers}
                            loading={actionBusy === `reject-store-${record.id}`}
                            onClick={() => handleStoreAction(record, "reject")}
                          >
                            Reject
                          </Button>
                        </Space>
                      ),
                    },
                  ]}
                />
              </div>
            </section>
          </div>

          <section className="admin-panel" style={{ marginTop: 18 }}>
            <div className="admin-panel__body">
              <div className="admin-panel__header">
                <div>
                  <h2 className="admin-panel__title">Vendor Subscriptions</h2>
                  <div className="admin-panel__subtitle">
                    Review service access by vendor and grant or revoke access when needed.
                  </div>
                </div>
                <Tag color="blue">
                  {formatNumber(activeVendorSubscriptions)} active
                </Tag>
              </div>
              <Table
                rowKey="id"
                pagination={false}
                dataSource={vendorSubscriptions.items}
                locale={{ emptyText: <Empty description="No vendor subscriptions" /> }}
                columns={[
                  {
                    title: "Vendor",
                    key: "vendor",
                    render: (_, record) => (
                      <div>
                        <div style={{ fontWeight: 600 }}>
                          {record.vendor?.name || `Vendor #${record.vendorId}`}
                        </div>
                        <div style={{ color: "#6b7280", fontSize: 12 }}>
                          {record.vendor?.email || "No email"}
                        </div>
                      </div>
                    ),
                  },
                  {
                    title: "Service",
                    key: "service",
                    render: (_, record) => record.serviceLabel || prettifyKey(record.serviceKey),
                  },
                  {
                    title: "Plan",
                    key: "plan",
                    render: (_, record) => (
                      <div>
                        <div>{record.planName || "No plan assigned"}</div>
                        <div style={{ color: "#6b7280", fontSize: 12 }}>
                          {record.planCode || "standard"}
                        </div>
                      </div>
                    ),
                  },
                  {
                    title: "Status",
                    key: "status",
                    render: (_, record) => (
                      <Space wrap>
                        {renderStatusTag(record.status || "inactive")}
                        {renderStatusTag(record.accessStatus || "blocked")}
                      </Space>
                    ),
                  },
                  {
                    title: "Next billing",
                    key: "nextBillingAt",
                    render: (_, record) =>
                      record.nextBillingAt
                        ? formatDateTime(record.nextBillingAt)
                        : "Not scheduled",
                  },
                  {
                    title: "Actions",
                    key: "actions",
                    render: (_, record) => (
                      <Space wrap>
                        {record.accessStatus === "granted" ? (
                          <Button
                            size="small"
                            danger
                            disabled={!canManageSubscriptions}
                            loading={actionBusy === `revoke-subscription-${record.id}`}
                            onClick={() =>
                              handleVendorSubscriptionAction(record, "revoke")
                            }
                          >
                            Revoke
                          </Button>
                        ) : (
                          <Button
                            size="small"
                            type="primary"
                            disabled={!canManageSubscriptions}
                            loading={actionBusy === `grant-subscription-${record.id}`}
                            onClick={() =>
                              handleVendorSubscriptionAction(record, "grant")
                            }
                          >
                            Grant
                          </Button>
                        )}
                      </Space>
                    ),
                  },
                ]}
              />
            </div>
          </section>
        </>
      )}
      <Modal
        title={
          accountActionModal.record
            ? `${prettifyKey(accountActionModal.action)} ${accountActionModal.record.name || accountActionModal.record.email}`
            : "Account action"
        }
        open={accountActionModal.open}
        onCancel={() => {
          setAccountActionModal({ open: false, record: null, action: null });
          accountActionForm.resetFields();
        }}
        onOk={submitUserAction}
        okText="Confirm action"
        confirmLoading={
          Boolean(accountActionModal.action) &&
          actionBusy === `${accountActionModal.action}-${accountActionModal.record?.id}`
        }
      >
        <Form form={accountActionForm} layout="vertical">
          <Form.Item
            name="reason"
            label="Reason"
            rules={[{ required: true, message: "Reason is required" }]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title={
          selectedUserRecord
            ? `Edit profile: ${selectedUserRecord.name || selectedUserRecord.email}`
            : "Edit profile"
        }
        open={profileModalOpen}
        onCancel={() => {
          setProfileModalOpen(false);
          setSelectedUserRecord(null);
          profileForm.resetFields();
        }}
        onOk={submitProfileUpdate}
        okText="Save changes"
        confirmLoading={actionBusy === `profile-${selectedUserRecord?.id}`}
      >
        <Form form={profileForm} layout="vertical">
          <Form.Item name="first_name" label="First name">
            <Input />
          </Form.Item>
          <Form.Item name="last_name" label="Last name">
            <Input />
          </Form.Item>
          <Form.Item name="phone" label="Phone number">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title={
          storeActionModal.record
            ? `${prettifyKey(storeActionModal.action)} KYC for ${storeActionModal.record.name}`
            : "KYC review"
        }
        open={storeActionModal.open}
        onCancel={() => {
          setStoreActionModal({ open: false, record: null, action: null });
          storeActionForm.resetFields();
        }}
        onOk={submitStoreAction}
        okText="Submit review"
        confirmLoading={
          Boolean(storeActionModal.action) &&
          actionBusy === `${storeActionModal.action}-store-${storeActionModal.record?.id}`
        }
      >
        <Form form={storeActionForm} layout="vertical">
          <Form.Item
            name="reason"
            label="Review reason"
            rules={[{ required: true, message: "Reason is required" }]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Register New User"
        open={newUserModalOpen}
        onCancel={() => {
          setNewUserModalOpen(false);
          newUserForm.resetFields();
          setIsAdminChecked(false);
        }}
        onOk={submitNewUser}
        okText="Register User"
        confirmLoading={actionBusy === "new-user"}
        width={680}
        destroyOnClose
      >
        <Form form={newUserForm} layout="vertical" initialValues={{ isAdmin: false }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <Form.Item
              name="first_name"
              label="First Name"
              rules={[
                { required: true, message: "First name is required" },
                { min: 2, message: "Min 2 characters" },
                { max: 50, message: "Max 50 characters" }
              ]}
            >
              <Input placeholder="John" />
            </Form.Item>

            <Form.Item
              name="last_name"
              label="Last Name"
              rules={[
                { required: true, message: "Last name is required" },
                { min: 2, message: "Min 2 characters" },
                { max: 50, message: "Max 50 characters" }
              ]}
            >
              <Input placeholder="Doe" />
            </Form.Item>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <Form.Item
              name="email"
              label="Email Address"
              rules={[
                { required: true, message: "Email is required" },
                { type: "email", message: "Enter a valid email address" }
              ]}
            >
              <Input placeholder="john.doe@example.com" />
            </Form.Item>

            <Form.Item
              name="phone"
              label="Phone Number"
              rules={[
                { required: true, message: "Phone number is required" },
                { min: 6, message: "Phone number is too short" }
              ]}
            >
              <Input placeholder="+1234567890" />
            </Form.Item>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <Form.Item
              name="city_id"
              label="City"
              rules={[{ required: true, message: "Please select a city" }]}
            >
              <Select
                placeholder="Select a city"
                showSearch
                optionFilterProp="label"
                options={cityOptions}
              />
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[
                { required: true, message: "Password is required" },
                { min: 6, message: "Password must be at least 6 characters" }
              ]}
            >
              <Input.Password placeholder="••••••••" />
            </Form.Item>
          </div>

          <div style={{
            background: "#f9fafb",
            padding: "16px",
            borderRadius: "12px",
            border: "1px solid #e5e7eb",
            marginTop: "8px"
          }}>
            <Form.Item
              name="isAdmin"
              valuePropName="checked"
              label={
                <span style={{ fontWeight: 600 }}>
                  Assign Administrative Privileges
                </span>
              }
              style={{ marginBottom: isAdminChecked ? "16px" : 0 }}
            >
              <Switch
                checked={isAdminChecked}
                onChange={(checked) => {
                  setIsAdminChecked(checked);
                  newUserForm.setFieldsValue({
                    isAdmin: checked,
                    ...(checked ? {} : { roles: [], permissions: [] }),
                  });
                }}
              />
            </Form.Item>

            {isAdminChecked && (
              <div style={{ display: "grid", gap: "16px" }}>
                <Form.Item
                  name="roles"
                  label="Administrative Roles"
                  dependencies={["isAdmin", "permissions"]}
                  rules={[
                    () => ({
                      validator(_, value) {
                        const isAdmin = Boolean(newUserForm.getFieldValue("isAdmin"));
                        const selectedRoles = Array.isArray(value) ? value : [];
                        const selectedPermissions = Array.isArray(
                          newUserForm.getFieldValue("permissions"),
                        )
                          ? newUserForm.getFieldValue("permissions")
                          : [];

                        if (
                          !isAdmin ||
                          selectedRoles.length > 0 ||
                          selectedPermissions.length > 0
                        ) {
                          return Promise.resolve();
                        }

                        return Promise.reject(
                          new Error("Select at least one role or one permission"),
                        );
                      },
                    }),
                  ]}
                >
                  <Select
                    mode="multiple"
                    placeholder="Select admin roles"
                    allowClear
                    style={{ width: "100%" }}
                    optionFilterProp="label"
                    options={adminRoleOptions}
                  />
                </Form.Item>

                <Form.Item
                  name="permissions"
                  label="Explicit Rights / Permissions"
                  extra="Choose specific permissions only when you need access beyond the selected role templates."
                >
                  <Select
                    mode="multiple"
                    placeholder="Select explicit rights"
                    allowClear
                    style={{ width: "100%" }}
                    optionFilterProp="label"
                    options={adminPermissionOptions}
                  />
                </Form.Item>
              </div>
            )}
          </div>
        </Form>
      </Modal>
    </AdminWorkspaceShell>
  );
};

export const BloomzonContentWorkspace = () => {
  const { token } = useContext(MainContext);
  const navigate = useNavigate();
  const [products, setProducts] = useState(defaultAdminProducts);
  const [operations, setOperations] = useState(defaultAdminOperations);
  const [domains, setDomains] = useState(defaultAdminDomains);
  const [mediaModeration, setMediaModeration] = useState(defaultAdminMediaModeration);
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    subdomainId: "all",
  });
  const [loading, setLoading] = useState(false);
  const [actionBusy, setActionBusy] = useState("");
  const [error, setError] = useState("");
  const [mediaError, setMediaError] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productDetailsLoading, setProductDetailsLoading] = useState(false);
  const [mediaModalOpen, setMediaModalOpen] = useState(false);
  const [reviewModal, setReviewModal] = useState({
    open: false,
    record: null,
  });
  const [domainModal, setDomainModal] = useState({
    open: false,
    record: null,
  });
  const [categoryModal, setCategoryModal] = useState({
    open: false,
    domain: null,
    record: null,
  });
  const [domainForm] = Form.useForm();
  const [categoryForm] = Form.useForm();

  const loadContent = async (nextFilters = filters) => {
    try {
      setLoading(true);
      setError("");
      setMediaError("");
      const [productData, operationData, domainData] = await Promise.all([
        fetchAdminProducts(token, {
          page: 1,
          limit: 12,
          search: nextFilters.search || undefined,
          status: nextFilters.status || "all",
          subdomainId:
            nextFilters.subdomainId && nextFilters.subdomainId !== "all"
              ? nextFilters.subdomainId
              : undefined,
        }),
        fetchAdminOperations(token, { limit: 10 }),
        fetchAdminDomains(token),
      ]);

      setProducts(productData || defaultAdminProducts);
      setOperations(operationData || defaultAdminOperations);
      setDomains(domainData || defaultAdminDomains);

      try {
        const mediaData = await fetchAdminMediaModeration(token);
        setMediaModeration(mediaData || defaultAdminMediaModeration);
      } catch (mediaLoadError) {
        setMediaModeration(defaultAdminMediaModeration);
        setMediaError(
          mediaLoadError?.response?.data?.message ||
            "Bloomzon TV moderation endpoints are unavailable in this environment.",
        );
      }
    } catch (loadError) {
      setError(
        loadError?.response?.data?.message ||
          "Failed to load content and catalog data.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadContent();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleProductAction = async (record, action) => {
    try {
      setActionBusy(`${action}-${record.id}`);
      if (action === "delete") {
        await deleteAdminProduct(token, record.id);
        message.success("Product deleted successfully.");
      } else {
        await updateAdminProductStatus(token, record.id, action);
        message.success(`Product ${prettifyKey(action)}d successfully.`);
      }
      await loadContent();
    } catch (actionError) {
      message.error(
        actionError?.response?.data?.message || "Failed to update product moderation.",
      );
    } finally {
      setActionBusy("");
    }
  };

  const handleBoostingAction = async (record, patch) => {
    try {
      const patchKey = Object.keys(patch)[0] || "boosting";
      setActionBusy(`${patchKey}-${record.id}`);
      await updateAdminProductBoosting(token, record.id, patch);
      message.success("Product search boosting updated.");
      await loadContent();
    } catch (actionError) {
      message.error(
        actionError?.response?.data?.message || "Failed to update product boosting.",
      );
    } finally {
      setActionBusy("");
    }
  };

  const handleReviewDecision = async (record, status) => {
    try {
      setActionBusy(`review-${status}-${record.id}`);
      await moderateAdminReview(token, record.id, { status });
      message.success(`Review marked ${prettifyKey(status)}.`);
      setReviewModal({ open: false, record: null });
      await loadContent();
    } catch (actionError) {
      message.error(
        actionError?.response?.data?.message || "Failed to moderate review.",
      );
    } finally {
      setActionBusy("");
    }
  };

  const handleMediaModerationAction = async (record, status) => {
    try {
      setActionBusy(`media-${status}-${record.source}-${record.id}`);
      await moderateAdminMediaItem(token, record.source, record.id, { status });
      message.success(`Media item marked ${prettifyKey(status)}.`);
      await loadContent();
    } catch (actionError) {
      message.error(
        actionError?.response?.data?.message || "Failed to moderate media item.",
      );
    } finally {
      setActionBusy("");
    }
  };

  const openMediaModal = async (record) => {
    try {
      setMediaModalOpen(true);
      setSelectedProduct(null);
      setProductDetailsLoading(true);
      const data = await fetchAdminProductDetails(token, record.id);
      setSelectedProduct(data || record);
    } catch (loadError) {
      message.error(
        loadError?.response?.data?.message || "Failed to load product media details.",
      );
      setMediaModalOpen(false);
    } finally {
      setProductDetailsLoading(false);
    }
  };

  const openDomainModal = (record = null) => {
    setDomainModal({ open: true, record });
    domainForm.setFieldsValue({
      name: record?.name || "",
      label: record?.label || "",
      description: record?.description || "",
      status: Number(record?.status ?? 1),
      intake: Number(record?.intake ?? 1),
    });
  };

  const openCategoryModal = (domain, record = null) => {
    setCategoryModal({ open: true, domain, record });
    categoryForm.setFieldsValue({
      name: record?.name || "",
      label: record?.label || "",
      description: record?.description || "",
      status: Number(record?.status ?? 1),
    });
  };

  const saveDomain = async () => {
    try {
      const values = await domainForm.validateFields();
      setActionBusy(domainModal.record ? `domain-edit-${domainModal.record.id}` : "domain-create");
      if (domainModal.record?.id) {
        await updateAdminDomain(token, domainModal.record.id, values);
        message.success("Domain updated.");
      } else {
        await createAdminDomain(token, values);
        message.success("Domain created.");
      }
      setDomainModal({ open: false, record: null });
      domainForm.resetFields();
      await loadContent();
    } catch (actionError) {
      if (actionError?.errorFields) {
        return;
      }
      message.error(
        actionError?.response?.data?.message || "Failed to save domain.",
      );
    } finally {
      setActionBusy("");
    }
  };

  const saveCategory = async () => {
    try {
      const values = await categoryForm.validateFields();
      const { domain, record } = categoryModal;
      setActionBusy(record ? `category-edit-${record.id}` : `category-create-${domain?.id}`);
      if (record?.id) {
        await updateAdminDomainCategory(token, record.id, values);
        message.success("Service category updated.");
      } else {
        await createAdminDomainCategory(token, domain.id, values);
        message.success("Service category created.");
      }
      setCategoryModal({ open: false, domain: null, record: null });
      categoryForm.resetFields();
      await loadContent();
    } catch (actionError) {
      if (actionError?.errorFields) {
        return;
      }
      message.error(
        actionError?.response?.data?.message || "Failed to save service category.",
      );
    } finally {
      setActionBusy("");
    }
  };

  const deleteDomainRecord = async (record) => {
    try {
      setActionBusy(`domain-delete-${record.id}`);
      await deleteAdminDomain(token, record.id);
      message.success("Domain deleted.");
      await loadContent();
    } catch (actionError) {
      message.error(
        actionError?.response?.data?.message || "Failed to delete domain.",
      );
    } finally {
      setActionBusy("");
    }
  };

  const deleteCategoryRecord = async (record) => {
    try {
      setActionBusy(`category-delete-${record.id}`);
      await deleteAdminDomainCategory(token, record.id);
      message.success("Service category deleted.");
      await loadContent();
    } catch (actionError) {
      message.error(
        actionError?.response?.data?.message || "Failed to delete service category.",
      );
    } finally {
      setActionBusy("");
    }
  };

  const mediaProducts = products.items.filter(
    (item) => Number(item.imageCount || 0) > 0 || Boolean(item.thumbnail),
  );
  const mediaQueue = mediaModeration.items || [];
  const mediaSummary = {
    reviewMedia: Number(mediaModeration.summary?.bySource?.review_media || 0),
    userMedia: Number(mediaModeration.summary?.bySource?.user_media || 0),
    liveReels:
      Number(mediaModeration.summary?.bySource?.live || 0) +
      Number(mediaModeration.summary?.bySource?.reels || 0) +
      Number(mediaModeration.summary?.bySource?.trueview || 0),
    broadcast:
      Number(mediaModeration.summary?.bySource?.tv_airing_video || 0) +
      Number(mediaModeration.summary?.bySource?.bidshow || 0),
  };
  const selectedProductMedia = buildProductMediaRows(selectedProduct);
  const totalManagedCategories = (domains.items || []).reduce(
    (count, domain) =>
      count + Number(domain.categoriesCount || domain.subdomains?.length || 0),
    0,
  );

  return (
    <AdminWorkspaceShell
      eyebrow="Content"
      title="Content & Catalog"
      subtitle="Product moderation, review queues, and catalog structure management across marketplace domains."
      actions={
        <>
          <Button onClick={() => navigate("/dashboard/products")}>Products</Button>
          <Button onClick={() => navigate("/dashboard/product-categories/categories")}>
            Categories
          </Button>
          <Button onClick={() => openDomainModal()}>Add domain</Button>
          <Button onClick={() => navigate("/dashboard/sellers/services/tv")}>
            TV moderation
          </Button>
          <Button icon={<ReloadOutlined />} onClick={loadContent}>
            Refresh
          </Button>
        </>
      }
    >
      {error ? (
        <Alert style={{ marginBottom: 18 }} type="error" showIcon message={error} />
      ) : null}
      <DataGapNotice
        title="Moderation gaps"
        items={[
          "Product listing moderation, review moderation, search boosting, domain/service catalog CRUD, and unified media moderation are now wired to the admin APIs available in the paired backend.",
          "Media coverage spans review media, user media, TrueView, Live, Reels, BidShow, and Bloomzon TV airing videos.",
          "Product media inspection remains available from product details so listing assets can still be reviewed in context.",
        ]}
      />
      {loading ? (
        <div className="flex flex-center" style={{ minHeight: 320 }}>
          <Spin size="large" />
        </div>
      ) : (
        <>
          <div className="admin-kpi-grid" style={{ marginBottom: 18 }}>
            <SummaryCard
              label="Products"
              value={formatNumber(products.summary.total)}
              helper="Catalog items returned by admin product search."
            />
            <SummaryCard
              label="Active listings"
              value={formatNumber(products.summary.active)}
              helper="Listings currently active."
            />
            <SummaryCard
              label="Inactive listings"
              value={formatNumber(products.summary.inactive)}
              helper="Listings already deactivated."
            />
            <SummaryCard
              label="Review queue"
              value={formatNumber(operations.summary.reviewModeration)}
              helper="Pending or flagged review moderation items."
            />
            <SummaryCard
              label="Media assets"
              value={formatNumber(mediaProducts.reduce((sum, item) => sum + Number(item.imageCount || 0), 0))}
              helper="Product assets available for media inspection."
            />
          </div>

          <div className="admin-kpi-grid" style={{ marginBottom: 18 }}>
            <SummaryCard
              label="Review media"
              value={formatNumber(mediaSummary.reviewMedia)}
              helper="Review-linked assets in the moderation feed."
            />
            <SummaryCard
              label="User media"
              value={formatNumber(mediaSummary.userMedia)}
              helper="Profile and user-uploaded media surfaced for moderation."
            />
            <SummaryCard
              label="Live & Reels"
              value={formatNumber(mediaSummary.liveReels)}
              helper="TrueView, Live, and Reels items in the moderation feed."
            />
            <SummaryCard
              label="TV & BidShow"
              value={formatNumber(mediaSummary.broadcast)}
              helper="Broadcast and auction media surfaced for moderation."
            />
            <SummaryCard
              label="Catalog services"
              value={formatNumber(totalManagedCategories)}
              helper="Domain-linked service categories managed from admin."
            />
          </div>

          <div className="admin-toolbar" style={{ marginBottom: 18 }}>
            <div className="admin-toolbar__grow">
              <Input.Search
                allowClear
                placeholder="Search product name or code"
                value={filters.search}
                onChange={(event) =>
                  setFilters((current) => ({
                    ...current,
                    search: event.target.value,
                  }))
                }
                onSearch={(value) => {
                  const next = { ...filters, search: value.trim() };
                  setFilters(next);
                  loadContent(next);
                }}
              />
            </div>
            <Select
              value={filters.status}
              style={{ width: 180 }}
              onChange={(value) => {
                const next = { ...filters, status: value };
                setFilters(next);
                loadContent(next);
              }}
              options={[
                { label: "All statuses", value: "all" },
                { label: "Active", value: "active" },
                { label: "Inactive", value: "inactive" },
              ]}
            />
            <Select
              value={filters.subdomainId}
              style={{ width: 220 }}
              onChange={(value) => {
                const next = { ...filters, subdomainId: value };
                setFilters(next);
                loadContent(next);
              }}
              options={[
                { label: "All services", value: "all" },
                ...(products.filters?.subdomains || []).map((item) => ({
                  label: item.label,
                  value: String(item.id),
                })),
              ]}
            />
          </div>

          <div className="admin-section-grid admin-section-grid--2">
            <section className="admin-panel">
              <div className="admin-panel__body">
                <div className="admin-panel__header">
                  <div>
                    <h2 className="admin-panel__title">Product Moderation</h2>
                    <div className="admin-panel__subtitle">
                      Review product status, seller, service, and moderation actions.
                    </div>
                  </div>
                </div>
                <Table
                  rowKey="id"
                  pagination={false}
                  dataSource={products.items}
                  locale={{ emptyText: <Empty description="No products found" /> }}
                  columns={[
                    {
                      title: "Product",
                      key: "product",
                      render: (_, record) => (
                        <div>
                          <div style={{ fontWeight: 600 }}>{record.name}</div>
                          <div style={{ color: "#6b7280", fontSize: 12 }}>
                            {record.productCode || "No product code"}
                          </div>
                        </div>
                      ),
                    },
                    {
                      title: "Seller",
                      key: "seller",
                      render: (_, record) => record.seller?.name || record.seller?.email || "N/A",
                    },
                    {
                      title: "Service",
                      key: "subdomain",
                      render: (_, record) => record.subdomain?.label || "Unassigned",
                    },
                    {
                      title: "Status",
                      key: "status",
                      render: (_, record) =>
                        renderStatusTag(record.isActive ? "active" : "inactive"),
                    },
                    {
                      title: "Media",
                      key: "media",
                      render: (_, record) => formatNumber(record.imageCount),
                    },
                    {
                      title: "Actions",
                      key: "actions",
                      render: (_, record) => (
                        <Space wrap>
                          <Button size="small" onClick={() => openMediaModal(record)}>
                            Inspect media
                          </Button>
                          <Button
                            size="small"
                            onClick={() => navigate(`/dashboard/products/${record.id}`)}
                          >
                            Open
                          </Button>
                          <Button
                            size="small"
                            loading={actionBusy === `featured-${record.id}`}
                            onClick={() =>
                              handleBoostingAction(record, {
                                featured: !Boolean(record.boosting?.featured),
                              })
                            }
                          >
                            {record.boosting?.featured ? "Unfeature" : "Feature"}
                          </Button>
                          <Button
                            size="small"
                            loading={actionBusy === `pinned-${record.id}`}
                            onClick={() =>
                              handleBoostingAction(record, {
                                pinned: !Boolean(record.boosting?.pinned),
                              })
                            }
                          >
                            {record.boosting?.pinned ? "Unpin" : "Pin"}
                          </Button>
                          {record.isActive ? (
                            <Button
                              size="small"
                              loading={actionBusy === `deactivate-${record.id}`}
                              onClick={() => handleProductAction(record, "deactivate")}
                            >
                              Deactivate
                            </Button>
                          ) : (
                            <Button
                              size="small"
                              type="primary"
                              loading={actionBusy === `activate-${record.id}`}
                              onClick={() => handleProductAction(record, "activate")}
                            >
                              Activate
                            </Button>
                          )}
                          <Button
                            size="small"
                            danger
                            loading={actionBusy === `delete-${record.id}`}
                            onClick={() => handleProductAction(record, "delete")}
                          >
                            Delete
                          </Button>
                        </Space>
                      ),
                    },
                  ]}
                />
              </div>
            </section>

            <section className="admin-panel admin-panel--soft">
              <div className="admin-panel__body">
                <div className="admin-panel__header">
                  <div>
                    <h2 className="admin-panel__title">Review & Rating Queue</h2>
                    <div className="admin-panel__subtitle">
                      Pending or flagged reviews with direct admin moderation actions.
                    </div>
                  </div>
                </div>
                <Table
                  rowKey={(record) => `${record.id || record.createdAt}-${record.title}`}
                  pagination={false}
                  dataSource={operations.reviews}
                  locale={{ emptyText: <Empty description="No moderation reviews" /> }}
                  columns={[
                    {
                      title: "Review",
                      key: "title",
                      render: (_, record) => (
                        <div>
                          <div style={{ fontWeight: 600 }}>{record.title}</div>
                          <div style={{ color: "#6b7280", fontSize: 12 }}>
                            {record.product?.name || "Unknown product"}
                          </div>
                        </div>
                      ),
                    },
                    {
                      title: "Seller",
                      key: "seller",
                      render: (_, record) =>
                        record.seller?.name || record.seller?.email || "Unknown seller",
                    },
                    {
                      title: "Status",
                      key: "status",
                      render: (_, record) => renderStatusTag(record.status),
                    },
                    {
                      title: "Actions",
                      key: "actions",
                      render: (_, record) => (
                        <Space wrap>
                          <Button
                            size="small"
                            onClick={() => setReviewModal({ open: true, record })}
                          >
                            Inspect
                          </Button>
                          {record.product?.id ? (
                            <Button
                              size="small"
                              onClick={() => navigate(`/dashboard/products/${record.product.id}`)}
                            >
                              Open product
                            </Button>
                          ) : null}
                        </Space>
                      ),
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
          </div>

          <section className="admin-panel" style={{ marginTop: 18 }}>
            <div className="admin-panel__body">
              <div className="admin-panel__header">
                <div>
                  <h2 className="admin-panel__title">Media Moderation Coverage</h2>
                  <div className="admin-panel__subtitle">
                    Unified moderation feed across review media, user media, Live, Reels, BidShow, TrueView, and Bloomzon TV.
                  </div>
                </div>
                <Space wrap>
                  <Button onClick={() => navigate("/dashboard/products")}>
                    Product library
                  </Button>
                  <Button onClick={() => navigate("/dashboard/sellers/services/tv")}>
                    Open TV queue
                  </Button>
                  <Button
                    onClick={() => navigate("/dashboard/sellers/services/tv/settings")}
                  >
                    TV settings
                  </Button>
                  <Button
                    onClick={() => navigate("/dashboard/sellers/services/reels")}
                  >
                    Reels status
                  </Button>
                </Space>
              </div>
              {mediaError ? (
                <Alert
                  type="warning"
                  showIcon
                  style={{ marginBottom: 16 }}
                  message={mediaError}
                />
              ) : null}
              <Table
                rowKey={(record) => `${record.source}-${record.id}`}
                pagination={false}
                dataSource={mediaQueue.slice(0, 12)}
                locale={{ emptyText: <Empty description="No moderation media items" /> }}
                columns={[
                  {
                    title: "Content",
                    key: "content",
                    render: (_, record) => (
                      <div>
                        <div style={{ fontWeight: 600 }}>{record.title}</div>
                        <div style={{ color: "#6b7280", fontSize: 12 }}>
                          {prettifyKey(record.source || record.contentType || "media")}
                        </div>
                      </div>
                    ),
                  },
                  {
                    title: "Preview",
                    key: "preview",
                    render: (_, record) =>
                      record.thumbnailUrl || record.mediaUrl ? (
                        <Image
                          width={48}
                          height={48}
                          src={record.thumbnailUrl || record.mediaUrl}
                          style={{ objectFit: "cover", borderRadius: 8 }}
                        />
                      ) : (
                        <span style={{ color: "#9ca3af" }}>No preview</span>
                      ),
                  },
                  {
                    title: "Status",
                    key: "status",
                    render: (_, record) => renderStatusTag(record.status),
                  },
                  {
                    title: "Updated",
                    key: "updatedAt",
                    render: (_, record) => formatDateTime(record.updatedAt || record.createdAt),
                  },
                  {
                    title: "Actions",
                    key: "actions",
                    render: (_, record) => (
                      <Space wrap>
                        <Button
                          size="small"
                          onClick={() =>
                            record.mediaUrl && window.open(record.mediaUrl, "_blank", "noopener,noreferrer")
                          }
                          disabled={!record.mediaUrl}
                        >
                          Open media
                        </Button>
                        <Button
                          size="small"
                          loading={
                            actionBusy ===
                            `media-approved-${record.source}-${record.id}`
                          }
                          onClick={() =>
                            handleMediaModerationAction(record, "approved")
                          }
                        >
                          Approve
                        </Button>
                        <Button
                          size="small"
                          loading={
                            actionBusy ===
                            `media-flagged-${record.source}-${record.id}`
                          }
                          onClick={() =>
                            handleMediaModerationAction(record, "flagged")
                          }
                        >
                          Flag
                        </Button>
                        <Button
                          size="small"
                          danger
                          loading={
                            actionBusy ===
                            `media-rejected-${record.source}-${record.id}`
                          }
                          onClick={() =>
                            handleMediaModerationAction(record, "rejected")
                          }
                        >
                          Reject
                        </Button>
                        <Button
                          size="small"
                          onClick={() =>
                            record.source === "tv_airing_video"
                              ? navigate("/dashboard/sellers/services/tv")
                              : navigate("/dashboard/admin-system/content")
                          }
                        >
                          Review source
                        </Button>
                      </Space>
                    ),
                  },
                ]}
              />
              <div style={{ marginTop: 16 }}>
                <Table
                  rowKey="id"
                  pagination={false}
                  dataSource={mediaProducts.slice(0, 8)}
                  locale={{ emptyText: <Empty description="No product media assets found" /> }}
                  columns={[
                    {
                      title: "Listing",
                      key: "listing",
                      render: (_, record) => (
                        <div>
                          <div style={{ fontWeight: 600 }}>{record.name}</div>
                          <div style={{ color: "#6b7280", fontSize: 12 }}>
                            {record.subdomain?.label || "Unknown service"}
                          </div>
                        </div>
                      ),
                    },
                    {
                      title: "Preview",
                      key: "thumbnail",
                      render: (_, record) =>
                        record.thumbnail ? (
                          <Image
                            width={48}
                            height={48}
                            src={record.thumbnail}
                            style={{ objectFit: "cover", borderRadius: 8 }}
                          />
                        ) : (
                          <span style={{ color: "#9ca3af" }}>No preview</span>
                        ),
                    },
                    {
                      title: "Assets",
                      key: "assets",
                      render: (_, record) => formatNumber(record.imageCount),
                    },
                    {
                      title: "Actions",
                      key: "actions",
                      render: (_, record) => (
                        <Button size="small" onClick={() => openMediaModal(record)}>
                          Inspect media
                        </Button>
                      ),
                    },
                  ]}
                />
              </div>
            </div>
          </section>

          <section className="admin-panel" style={{ marginTop: 18 }}>
            <div className="admin-panel__body">
              <div className="admin-panel__header">
                <div>
                  <h2 className="admin-panel__title">Catalog Structure</h2>
                  <div className="admin-panel__subtitle">
                    Domain and service-category management backed by admin domain APIs.
                  </div>
                </div>
                <Button onClick={() => openDomainModal()}>Create domain</Button>
              </div>
              <Table
                rowKey="id"
                pagination={false}
                dataSource={domains.items}
                locale={{ emptyText: <Empty description="No domains found" /> }}
                columns={[
                  {
                    title: "Domain",
                    key: "label",
                    render: (_, record) => (
                      <div>
                        <div style={{ fontWeight: 600 }}>{record.label || record.name}</div>
                        <div style={{ color: "#6b7280", fontSize: 12 }}>{record.code}</div>
                      </div>
                    ),
                  },
                  {
                    title: "Services",
                    key: "subdomains",
                    render: (_, record) => (
                      <Space size={[4, 4]} wrap>
                        {(record.subdomains || []).map((subdomain) => (
                          <Tag key={subdomain.id}>{subdomain.label || subdomain.name}</Tag>
                        ))}
                      </Space>
                    ),
                  },
                  {
                    title: "Status",
                    key: "status",
                    render: (_, record) =>
                      renderStatusTag(Number(record.status) === 1 ? "active" : "inactive"),
                  },
                  {
                    title: "Actions",
                    key: "actions",
                    render: (_, record) => (
                      <Space wrap>
                        <Button size="small" onClick={() => openDomainModal(record)}>
                          Edit
                        </Button>
                        <Button size="small" onClick={() => openCategoryModal(record)}>
                          Add service
                        </Button>
                        <Popconfirm
                          title="Delete this domain?"
                          onConfirm={() => deleteDomainRecord(record)}
                        >
                          <Button
                            size="small"
                            danger
                            loading={actionBusy === `domain-delete-${record.id}`}
                          >
                            Delete
                          </Button>
                        </Popconfirm>
                      </Space>
                    ),
                  },
                ]}
                expandable={{
                  expandedRowRender: (record) => (
                    <Table
                      rowKey="id"
                      pagination={false}
                      dataSource={record.subdomains || []}
                      locale={{ emptyText: <Empty description="No service categories" /> }}
                      columns={[
                        {
                          title: "Service",
                          key: "service",
                          render: (_, item) => (
                            <div>
                              <div style={{ fontWeight: 600 }}>{item.label || item.name}</div>
                              <div style={{ color: "#6b7280", fontSize: 12 }}>
                                {item.description || item.code || "No description"}
                              </div>
                            </div>
                          ),
                        },
                        {
                          title: "Status",
                          key: "status",
                          render: (_, item) =>
                            renderStatusTag(Number(item.status) === 1 ? "active" : "inactive"),
                        },
                        {
                          title: "Actions",
                          key: "actions",
                          render: (_, item) => (
                            <Space wrap>
                              <Button
                                size="small"
                                onClick={() => openCategoryModal(record, item)}
                              >
                                Edit
                              </Button>
                              <Popconfirm
                                title="Delete this service category?"
                                onConfirm={() => deleteCategoryRecord(item)}
                              >
                                <Button
                                  size="small"
                                  danger
                                  loading={actionBusy === `category-delete-${item.id}`}
                                >
                                  Delete
                                </Button>
                              </Popconfirm>
                            </Space>
                          ),
                        },
                      ]}
                    />
                  ),
                }}
              />
            </div>
          </section>
        </>
      )}
      <Modal
        open={reviewModal.open}
        title="Review moderation context"
        footer={null}
        onCancel={() => setReviewModal({ open: false, record: null })}
      >
        {reviewModal.record ? (
          <div style={{ display: "grid", gap: 12 }}>
            <Alert
              type="info"
              showIcon
              message="Moderation actions"
              description="Approve, reject, or re-flag the review directly from admin. Product listing actions remain available if the underlying listing also needs intervention."
            />
            <div>
              <div style={{ fontWeight: 600 }}>{reviewModal.record.title}</div>
              <div style={{ color: "#6b7280", fontSize: 12 }}>
                {reviewModal.record.product?.name || "Unknown product"} •{" "}
                {reviewModal.record.seller?.name ||
                  reviewModal.record.seller?.email ||
                  "Unknown seller"}
              </div>
            </div>
            <div>{reviewModal.record.comment || "No review comment provided."}</div>
            <Space wrap>
              <Tag color="blue">{`${reviewModal.record.rating || 0}/5`}</Tag>
              {renderStatusTag(reviewModal.record.status)}
            </Space>
            <Space wrap>
              <Button
                type="primary"
                loading={actionBusy === `review-approved-${reviewModal.record.id}`}
                onClick={() => handleReviewDecision(reviewModal.record, "approved")}
              >
                Approve
              </Button>
              <Button
                loading={actionBusy === `review-flagged-${reviewModal.record.id}`}
                onClick={() => handleReviewDecision(reviewModal.record, "flagged")}
              >
                Flag
              </Button>
              <Button
                danger
                loading={actionBusy === `review-rejected-${reviewModal.record.id}`}
                onClick={() => handleReviewDecision(reviewModal.record, "rejected")}
              >
                Reject
              </Button>
              {reviewModal.record.product?.id ? (
                <Button onClick={() => navigate(`/dashboard/products/${reviewModal.record.product.id}`)}>
                  Open product
                </Button>
              ) : null}
              {reviewModal.record.product?.id ? (
                <Button
                  danger
                  loading={actionBusy === `deactivate-${reviewModal.record.product.id}`}
                  onClick={() =>
                    handleProductAction({ id: reviewModal.record.product.id }, "deactivate")
                  }
                >
                  Deactivate listing
                </Button>
              ) : null}
            </Space>
          </div>
        ) : null}
      </Modal>
      <Modal
        width={880}
        open={mediaModalOpen}
        title={
          selectedProduct
            ? `Media inspection: ${selectedProduct.name}`
            : "Media inspection"
        }
        footer={null}
        onCancel={() => {
          setMediaModalOpen(false);
          setSelectedProduct(null);
        }}
      >
        {productDetailsLoading ? (
          <div className="flex flex-center" style={{ minHeight: 220 }}>
            <Spin size="large" />
          </div>
        ) : (
          <div style={{ display: "grid", gap: 16 }}>
            <Alert
              type="info"
              showIcon
              message="Media moderation coverage"
              description="Product and unit media metadata can be inspected here, and the parent listing can be moderated. Standalone approve/reject media APIs are still missing for several media services."
            />
            <Table
              rowKey="id"
              pagination={false}
              dataSource={selectedProductMedia}
              locale={{ emptyText: <Empty description="No media assets found" /> }}
              columns={[
                {
                  title: "Preview",
                  key: "preview",
                  render: (_, record) => (
                    <Image
                      width={64}
                      height={64}
                      src={record.url}
                      style={{ objectFit: "cover", borderRadius: 10 }}
                    />
                  ),
                },
                {
                  title: "Scope",
                  key: "scope",
                  render: (_, record) => renderStatusTag(record.scope),
                },
                {
                  title: "Type",
                  key: "type",
                  render: (_, record) => prettifyKey(record.type),
                },
                {
                  title: "Status",
                  key: "status",
                  render: (_, record) =>
                    renderStatusTag(Number(record.status) === 1 ? "active" : "inactive"),
                },
                {
                  title: "Metadata",
                  key: "metadata",
                  render: (_, record) =>
                    record.metadata ? (
                      <span style={{ color: "#6b7280" }}>
                        {Object.keys(record.metadata).slice(0, 3).join(", ") || "Attached"}
                      </span>
                    ) : (
                      <span style={{ color: "#9ca3af" }}>None</span>
                    ),
                },
                {
                  title: "Created",
                  key: "createdAt",
                  render: (_, record) => formatDateTime(record.createdAt),
                },
              ]}
            />
            {selectedProduct ? (
              <Space wrap>
                <Button onClick={() => navigate(`/dashboard/products/${selectedProduct.id}`)}>
                  Open product details
                </Button>
                {selectedProduct.isActive ? (
                  <Button
                    danger
                    loading={actionBusy === `deactivate-${selectedProduct.id}`}
                    onClick={() => handleProductAction(selectedProduct, "deactivate")}
                  >
                    Deactivate listing
                  </Button>
                ) : (
                  <Button
                    type="primary"
                    loading={actionBusy === `activate-${selectedProduct.id}`}
                    onClick={() => handleProductAction(selectedProduct, "activate")}
                  >
                    Activate listing
                  </Button>
                )}
              </Space>
            ) : null}
          </div>
        )}
      </Modal>
      <Modal
        open={domainModal.open}
        title={domainModal.record ? "Edit domain" : "Add domain"}
        onCancel={() => {
          setDomainModal({ open: false, record: null });
          domainForm.resetFields();
        }}
        onOk={saveDomain}
        okText={domainModal.record ? "Save changes" : "Create domain"}
        confirmLoading={actionBusy.startsWith("domain-")}
      >
        <Form form={domainForm} layout="vertical">
          <Form.Item
            name="name"
            label="System name"
            rules={[{ required: true, message: "Domain name is required" }]}
          >
            <Input placeholder="electronics" />
          </Form.Item>
          <Form.Item
            name="label"
            label="Display label"
            rules={[{ required: true, message: "Label is required" }]}
          >
            <Input placeholder="Electronics" />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="status" label="Status">
            <Select
              options={[
                { label: "Active", value: 1 },
                { label: "Inactive", value: 0 },
              ]}
            />
          </Form.Item>
          <Form.Item name="intake" label="Intake">
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        open={categoryModal.open}
        title={categoryModal.record ? "Edit service category" : "Add service category"}
        onCancel={() => {
          setCategoryModal({ open: false, domain: null, record: null });
          categoryForm.resetFields();
        }}
        onOk={saveCategory}
        okText={categoryModal.record ? "Save changes" : "Create service"}
        confirmLoading={actionBusy.startsWith("category-")}
      >
        <Form form={categoryForm} layout="vertical">
          <Form.Item
            name="name"
            label="System name"
            rules={[{ required: true, message: "Service name is required" }]}
          >
            <Input placeholder="smartphones" />
          </Form.Item>
          <Form.Item
            name="label"
            label="Display label"
            rules={[{ required: true, message: "Service label is required" }]}
          >
            <Input placeholder="Smartphones" />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="status" label="Status">
            <Select
              options={[
                { label: "Active", value: 1 },
                { label: "Inactive", value: 0 },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </AdminWorkspaceShell>
  );
};

export const BloomzonSupportWorkspace = () => {
  const { token } = useContext(MainContext);
  const navigate = useNavigate();
  const [conversations, setConversations] = useState(defaultAdminSupportConversations);
  const [supportTickets, setSupportTickets] = useState(defaultAdminSupportTickets);
  const [notificationFeed, setNotificationFeed] = useState(
    defaultAdminNotificationFeed,
  );
  const [workflowState, setWorkflowState] = useState(() =>
    readSupportWorkflowState(),
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadSupport = async () => {
    try {
      setLoading(true);
      setError("");
      const [conversationData, ticketData, notificationData] =
        await Promise.all([
        fetchAdminSupportConversations(token, {
          type: "all",
          status: "all",
          page: 1,
          limit: 12,
        }),
        fetchAdminSupportTickets(token, {
          page: 1,
          limit: 12,
          status: "all",
          priority: "all",
          assigned: "all",
        }),
        fetchAdminNotificationFeed(token, {
          page: 1,
          limit: 12,
          types: "support,sla,approval,refund,withdrawal,order",
        }),
        ]);

      setConversations(conversationData || defaultAdminSupportConversations);
      setSupportTickets(ticketData || defaultAdminSupportTickets);
      setNotificationFeed(notificationData || defaultAdminNotificationFeed);
      setWorkflowState(readSupportWorkflowState());
    } catch (loadError) {
      setError(
        loadError?.response?.data?.message ||
          "Failed to load messaging and support data.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadSupport();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const conversationWorkflowRows = useMemo(
    () => buildSupportTicketRows(conversations.items, workflowState),
    [conversations.items, workflowState],
  );

  const ticketWorkflowRows = useMemo(() => {
    const unreadMap = new Map(
      conversationWorkflowRows.map((row) => [Number(row.ticketId || 0), row]),
    );

    return (supportTickets.items || [])
      .map((ticket) => {
        const matchedConversation = unreadMap.get(Number(ticket.id || 0)) || null;
        const dueAt =
          ticket?.resolutionDueAt ||
          ticket?.resolution_due_at ||
          ticket?.firstResponseDueAt ||
          ticket?.first_response_due_at ||
          null;
        const dueTime = dueAt ? new Date(dueAt).getTime() : 0;
        const now = Date.now();
        const status = String(ticket.status || "open").toLowerCase();
        const slaStatus =
          status === "resolved" || status === "closed"
            ? "resolved"
            : ticket?.sla?.breached
              ? "breached"
              : dueTime && dueTime - now <= 4 * 60 * 60 * 1000
                ? "warning"
                : dueTime
                  ? "on_track"
                  : "untracked";

        return {
          id: `ticket-${ticket.id}`,
          ticketId: ticket.id,
          conversationId: matchedConversation?.conversationId || null,
          caseId: `TICKET-${ticket.id}`,
          channelType:
            matchedConversation?.channelType ||
            (String(ticket.issueType || "").toLowerCase().includes("dispute")
              ? "dispute"
              : "support"),
          title: ticket.issueType || "Support ticket",
          subtitle: ticket.vendor?.name || ticket.vendor?.email || "",
          description: ticket.description || "",
          participant: ticket.vendor || null,
          status,
          originalStatus: status,
          priority:
            ticket.priority === "urgent"
              ? "critical"
              : String(ticket.priority || "normal").toLowerCase(),
          priorityWeight:
            matchedConversation?.priorityWeight ||
            (ticket.priority === "urgent" ? 4 : ticket.priority === "high" ? 3 : ticket.priority === "normal" ? 2 : 1),
          dueAt,
          slaStatus,
          assigneeId: ticket.assignedAdminId ? String(ticket.assignedAdminId) : "",
          assigneeLabel:
            ticket.assignedTo?.name ||
            ticket.assignedTo?.email ||
            matchedConversation?.assigneeLabel ||
            "Unassigned",
          unreadCount: Number(matchedConversation?.unreadCount || 0),
          createdAt: ticket.createdAt || ticket.created_at || null,
          updatedAt: ticket.updatedAt || ticket.updated_at || null,
          notes:
            ticket?.metadata?.admin_support?.latestNote ||
            ticket?.metadata?.admin_support?.latest_note ||
            matchedConversation?.notes ||
            "",
          lastMessagePreview: matchedConversation?.lastMessagePreview || "",
        };
      })
      .sort((left, right) => {
        const priorityDelta = Number(right.priorityWeight || 0) - Number(left.priorityWeight || 0);
        if (priorityDelta !== 0) {
          return priorityDelta;
        }

        return (
          new Date(right.updatedAt || right.createdAt || 0).getTime() -
          new Date(left.updatedAt || left.createdAt || 0).getTime()
        );
      });
  }, [conversationWorkflowRows, supportTickets.items]);

  const ticketSummary = useMemo(
    () => ({
      unassigned: Number(
        supportTickets.summary?.unassigned ||
          ticketWorkflowRows.filter((row) => !row.assigneeId).length,
      ),
      breached: Number(
        supportTickets.summary?.slaBreaches ||
          ticketWorkflowRows.filter((row) => row.slaStatus === "breached").length,
      ),
      warning: ticketWorkflowRows.filter((row) => row.slaStatus === "warning").length,
    }),
    [supportTickets.summary, ticketWorkflowRows],
  );

  const exportSupportSnapshot = () => {
    const rows = ticketWorkflowRows.map((row) => ({
      case_id: row.caseId,
      type: row.channelType,
      subject: row.title,
      seller: row.participant?.name || row.subtitle || "",
      status: row.status,
      priority: row.priority,
      assignee: row.assigneeLabel,
      sla_status: row.slaStatus,
      due_at: formatDateTime(row.dueAt),
      unread: row.unreadCount,
      updated_at: formatDateTime(row.updatedAt),
    }));

    if (downloadCsv("bloomzon-support-snapshot.csv", rows)) {
      message.success("Support snapshot exported.");
    }
  };

  return (
    <AdminWorkspaceShell
      eyebrow="Support"
      title="Messaging, Support & Notifications"
      subtitle="Unified inbox coverage, ticket watchlists, and operational notification signals for admins."
      actions={
        <>
          <Button onClick={() => navigate("/dashboard/others/admins/messages")}>
            Open inbox
          </Button>
          <Button onClick={() => navigate("/dashboard/actions/notifications")}>
            Notifications
          </Button>
          <Button
            icon={<DownloadOutlined />}
            onClick={exportSupportSnapshot}
            disabled={!ticketWorkflowRows.length}
          >
            Export snapshot
          </Button>
          <Button icon={<ReloadOutlined />} onClick={loadSupport}>
            Refresh
          </Button>
        </>
      }
    >
      {error ? (
        <Alert style={{ marginBottom: 18 }} type="error" showIcon message={error} />
      ) : null}
      <DataGapNotice
        title="Coverage notes"
        items={[
          "Unified inbox access is live for user, support, dispute, and internal admin conversations.",
          "Real-time support chat is supported through the existing socket integration, but call recording access is not exposed by the current backend contract.",
          "Ticket ownership, priority, and SLA targets are now sourced from the backend support-ticket APIs.",
          "Notification routing is now backed by the admin notification feed and the dedicated notifications screen.",
        ]}
      />
      {loading ? (
        <div className="flex flex-center" style={{ minHeight: 320 }}>
          <Spin size="large" />
        </div>
      ) : (
        <>
          <div className="admin-kpi-grid" style={{ marginBottom: 18 }}>
            <SummaryCard
              label="User chats"
              value={formatNumber(conversations.summary.user)}
              helper="Buyer-facing direct conversations."
            />
            <SummaryCard
              label="Support cases"
              value={formatNumber(supportTickets.summary.open)}
              helper="Open support tickets tracked by the backend case queue."
            />
            <SummaryCard
              label="Disputes"
              value={formatNumber(conversations.summary.dispute)}
              helper="Dispute conversation coverage."
            />
            <SummaryCard
              label="Unread"
              value={formatNumber(conversations.summary.unread)}
              helper="Messages requiring admin attention."
            />
            <SummaryCard
              label="Unassigned"
              value={formatNumber(ticketSummary.unassigned)}
              helper="Support/dispute tickets without an owner."
            />
            <SummaryCard
              label="SLA breached"
              value={formatNumber(ticketSummary.breached)}
              helper="Tickets past their backend SLA target."
            />
          </div>

          <div className="admin-section-grid admin-section-grid--2">
            <section className="admin-panel">
              <div className="admin-panel__body">
                <div className="admin-panel__header">
                  <div>
                    <h2 className="admin-panel__title">Unified Inbox</h2>
                    <div className="admin-panel__subtitle">
                      All buyer, seller, dispute, and internal chats visible to admins.
                    </div>
                  </div>
                </div>
                <Table
                  rowKey="id"
                  pagination={false}
                  dataSource={conversations.items}
                  locale={{ emptyText: <Empty description="No conversations found" /> }}
                  columns={[
                    {
                      title: "Conversation",
                      key: "title",
                      render: (_, record) => (
                        <div>
                          <div style={{ fontWeight: 600 }}>{record.title}</div>
                          <div style={{ color: "#6b7280", fontSize: 12 }}>
                            {record.subtitle}
                          </div>
                        </div>
                      ),
                    },
                    {
                      title: "Channel",
                      key: "channelType",
                      render: (_, record) => renderStatusTag(record.channelType),
                    },
                    {
                      title: "Unread",
                      key: "unreadCount",
                      render: (_, record) => formatNumber(record.unreadCount),
                    },
                    {
                      title: "Updated",
                      key: "updatedAt",
                      render: (_, record) => formatDateTime(record.updatedAt),
                    },
                  ]}
                />
              </div>
            </section>

            <section className="admin-panel admin-panel--soft">
              <div className="admin-panel__body">
                <div className="admin-panel__header">
                  <div>
                    <h2 className="admin-panel__title">Alert Feed</h2>
                    <div className="admin-panel__subtitle">
                      Live notification summaries surfaced by the admin notification feed.
                    </div>
                  </div>
                </div>
                <div className="admin-queue-list">
                  {[
                    {
                      title: "Open support tickets",
                      value: notificationFeed.summary.support,
                      color: "gold",
                    },
                    {
                      title: "SLA breaches",
                      value: notificationFeed.summary.sla,
                      color: "blue",
                    },
                    {
                      title: "Approvals",
                      value: notificationFeed.summary.approvals,
                      color: "volcano",
                    },
                    {
                      title: "Refunds & payouts",
                      value:
                        Number(notificationFeed.summary.refunds || 0) +
                        Number(notificationFeed.summary.withdrawals || 0),
                      color: "orange",
                    },
                  ].map((entry) => (
                    <div className="admin-queue-item" key={entry.title}>
                      <div className="admin-queue-item__top">
                        <div className="admin-queue-item__title">{entry.title}</div>
                        <Tag color={entry.color}>{formatNumber(entry.value)}</Tag>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>

          <section className="admin-panel admin-panel--soft" style={{ marginTop: 18 }}>
            <div className="admin-panel__body">
              <div className="admin-panel__header">
                <div>
                  <h2 className="admin-panel__title">Ticket Workflow Queue</h2>
                  <div className="admin-panel__subtitle">
                    Assignment, priority, and SLA posture for support and dispute tickets.
                  </div>
                </div>
                <Tag color="orange">
                  {formatNumber(ticketSummary.warning)} at risk
                </Tag>
              </div>
              <Table
                rowKey="id"
                pagination={false}
                dataSource={ticketWorkflowRows.slice(0, 8)}
                locale={{ emptyText: <Empty description="No workflow tickets" /> }}
                columns={[
                  {
                    title: "Case",
                    key: "case",
                    render: (_, record) => (
                      <div>
                        <div style={{ fontWeight: 600 }}>{record.caseId}</div>
                        <div style={{ color: "#6b7280", fontSize: 12 }}>{record.title}</div>
                      </div>
                    ),
                  },
                  {
                    title: "Owner",
                    key: "owner",
                    render: (_, record) => record.assigneeLabel,
                  },
                  {
                    title: "SLA",
                    key: "sla",
                    render: (_, record) => (
                      <Space direction="vertical" size={2}>
                        {renderStatusTag(record.slaStatus)}
                        <span style={{ color: "#6b7280", fontSize: 12 }}>
                          Due {formatDateTime(record.dueAt)}
                        </span>
                      </Space>
                    ),
                  },
                  {
                    title: "Unread",
                    key: "unread",
                    render: (_, record) => formatNumber(record.unreadCount),
                  },
                  {
                    title: "Action",
                    key: "action",
                    render: (_, record) => (
                      <Button
                        size="small"
                        onClick={() =>
                          record.conversationId
                            ? navigate(`/dashboard/others/admins/messages/${record.conversationId}`)
                            : navigate("/dashboard/admin-system/support")
                        }
                      >
                        {record.conversationId ? "Open thread" : "Open queue"}
                      </Button>
                    ),
                  },
                ]}
              />
            </div>
          </section>
        </>
      )}
    </AdminWorkspaceShell>
  );
};

export const BloomzonMarketingWorkspace = () => {
  const { token } = useContext(MainContext);
  const [marketingData, setMarketingData] = useState(defaultAdminMarketing);
  const [couponMonitoring, setCouponMonitoring] = useState(
    defaultAdminCouponMonitoring,
  );
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    type: "all",
    status: "all",
    search: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [recordType, setRecordType] = useState("event");
  const [form] = Form.useForm();

  const loadMarketing = async (nextFilters = filters) => {
    try {
      setLoading(true);
      setError("");
      const [data, couponData] = await Promise.all([
        fetchAdminMarketing(token, {
          type: nextFilters.type !== "all" ? nextFilters.type : undefined,
          search: nextFilters.search || undefined,
        }),
        fetchAdminCouponMonitoring(token, {
          page: 1,
          limit: 100,
          search:
            nextFilters.type === "coupon" ? nextFilters.search || undefined : undefined,
          status: nextFilters.status !== "all" ? nextFilters.status : undefined,
        }),
      ]);
      setMarketingData(data || defaultAdminMarketing);
      setCouponMonitoring(couponData || defaultAdminCouponMonitoring);
    } catch (loadError) {
      setError(
        loadError?.response?.data?.message || "Failed to load marketing records.",
      );
      setMarketingData(defaultAdminMarketing);
      setCouponMonitoring(defaultAdminCouponMonitoring);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadMarketing();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const openCreateModal = (type) => {
    setEditingRecord(null);
    setRecordType(type);
    form.resetFields();
    form.setFieldsValue({
      type,
      status: type === "coupon" ? "active" : type === "ad" ? "pending" : "draft",
      usage: 0,
      conversions: 0,
      spendLimit: null,
      payoutStatus: type === "referral" ? "pending" : null,
      abuseFlagged: false,
      spendUsed: 0,
      payoutAmount: 0,
      rewardAmount: 0,
      owner: "",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (record) => {
    const metadata = extractMarketingMetadata(record);
    setEditingRecord(record);
    setRecordType(record.type);
    form.setFieldsValue({
      type: record.type,
      title: record.title,
      country: record.country || "",
      market: record.market || "",
      window: record.window || "",
      status: record.status || "draft",
      usage: record.usage || 0,
      spendLimit: record.spendLimit ?? null,
      conversions: record.conversions || 0,
      payoutStatus: record.payoutStatus || null,
      scope: record.scope || "",
      notes: record.notes || "",
      abuseFlagged: Boolean(metadata.abuseFlagged || metadata.abuse_flagged),
      spendUsed: Number(metadata.spendUsed ?? metadata.spend_used ?? 0),
      payoutAmount: Number(metadata.payoutAmount ?? metadata.payout_amount ?? 0),
      rewardAmount: Number(metadata.rewardAmount ?? metadata.reward_amount ?? 0),
      owner: metadata.owner || metadata.campaignOwner || "",
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingRecord(null);
    form.resetFields();
  };

  const buildPayload = (values) => ({
    type: recordType,
    title: values.title,
    country: values.country || null,
    market: values.market || null,
    window: values.window || null,
    status: values.status,
    usage: Number(values.usage || 0),
    spend_limit:
      values.spendLimit === null || values.spendLimit === undefined
        ? null
        : Number(values.spendLimit),
    conversions: Number(values.conversions || 0),
    payout_status: values.payoutStatus || null,
    scope: values.scope || null,
    notes: values.notes || null,
    metadata: {
      abuseFlagged: Boolean(values.abuseFlagged),
      spendUsed: Number(values.spendUsed || 0),
      payoutAmount: Number(values.payoutAmount || 0),
      rewardAmount: Number(values.rewardAmount || 0),
      owner: values.owner || null,
    },
  });

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setSaving(true);

      if (editingRecord?.id) {
        await updateAdminMarketing(token, editingRecord.id, buildPayload(values));
        message.success("Marketing record updated.");
      } else {
        await createAdminMarketing(token, buildPayload(values));
        message.success("Marketing record created.");
      }

      closeModal();
      await loadMarketing();
    } catch (saveError) {
      if (saveError?.errorFields) {
        return;
      }

      message.error(
        saveError?.response?.data?.message || "Failed to save marketing record.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (record) => {
    try {
      setSaving(true);
      await deleteAdminMarketing(token, record.id);
      message.success("Marketing record deleted.");
      await loadMarketing();
    } catch (deleteError) {
      message.error(
        deleteError?.response?.data?.message || "Failed to delete marketing record.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleQuickUpdate = async (record, updates, successMessage) => {
    try {
      setSaving(true);
      await updateAdminMarketing(token, record.id, updates);
      message.success(successMessage);
      await loadMarketing();
    } catch (updateError) {
      message.error(
        updateError?.response?.data?.message || "Failed to update marketing record.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleReferralPayoutStatus = async (record) => {
    try {
      setSaving(true);
      const nextStatus =
        record.payoutStatus === "pending" ? "completed" : "pending";
      await updateAdminMarketingPayoutStatus(token, record.id, {
        payout_status: nextStatus,
      });
      message.success(
        nextStatus === "completed"
          ? "Referral payout marked as paid."
          : "Referral payout re-opened.",
      );
      await loadMarketing();
    } catch (updateError) {
      message.error(
        updateError?.response?.data?.message ||
          "Failed to update referral payout status.",
      );
    } finally {
      setSaving(false);
    }
  };

  const currentConfig = marketingTypeConfig[recordType] || marketingTypeConfig.event;
  const filteredItems = useMemo(
    () =>
      (marketingData.items || []).filter((item) =>
        filters.status === "all" ? true : item.status === filters.status,
      ),
    [filters.status, marketingData.items],
  );
  const couponMetricsMap = useMemo(
    () =>
      new Map(
        (couponMonitoring.items || []).map((item) => [
          String(item.code || "").trim().toLowerCase(),
          item,
        ]),
      ),
    [couponMonitoring.items],
  );
  const groups = useMemo(
    () =>
      filteredItems.reduce(
        (acc, item) => {
          if (item.type === "coupon") {
            const couponMetrics =
              couponMetricsMap.get(
                String(item.code || item.title || "").trim().toLowerCase(),
              ) || null;
            acc.coupons.push({
              ...item,
              couponMetrics,
            });
          } else if (item.type === "ad") {
            acc.ads.push(item);
          } else if (item.type === "referral") {
            acc.referrals.push(item);
          } else {
            acc.events.push(item);
          }
          return acc;
        },
        { events: [], coupons: [], ads: [], referrals: [] },
      ),
    [couponMetricsMap, filteredItems],
  );
  const summary = useMemo(
    () => ({
      total: filteredItems.length,
      events: groups.events.length,
      coupons: groups.coupons.length,
      ads: groups.ads.length,
      referrals: groups.referrals.length,
      activeCoupons:
        Number(couponMonitoring.summary?.active || 0) ||
        groups.coupons.filter((item) => item.status === "active").length,
      pendingAds: groups.ads.filter((item) => item.status === "pending").length,
      pendingReferralPayouts: groups.referrals.filter(
        (item) => item.payoutStatus === "pending",
      ).length,
    }),
    [couponMonitoring.summary, filteredItems.length, groups],
  );

  return (
    <AdminWorkspaceShell
      eyebrow="Marketing"
      title="Events, Promotions & Marketing"
      subtitle="Admin-managed marketing records for campaign scheduling, coupons, ad approvals, and referral programs."
      actions={
        <>
          <Button
            icon={<ReloadOutlined />}
            onClick={loadMarketing}
            loading={loading}
          >
            Reload marketing
          </Button>
          <Button onClick={() => openCreateModal(filters.type === "all" ? "event" : filters.type)}>
            Create filtered type
          </Button>
        </>
      }
    >
      {error ? (
        <Alert
          type="error"
          showIcon
          style={{ marginBottom: 18 }}
          message={error}
        />
      ) : null}
      <DataGapNotice
        title="Campaign workflow coverage"
        items={[
          "Events, coupons, ad approvals, and referral payout tracking are backed by the admin marketing record APIs.",
          "Coupon usage and abuse signals are now enriched from the dedicated coupon monitoring endpoint.",
          "Actual redemption enforcement, ad-spend blocking, and real payout disbursement still depend on deeper upstream engines.",
        ]}
      />

      <div className="admin-kpi-grid" style={{ marginBottom: 18 }}>
        <SummaryCard
          label="Scheduled events"
          value={formatNumber(summary.events)}
          helper="Campaign windows created by admins."
        />
        <SummaryCard
          label="Active deals"
          value={formatNumber(summary.activeCoupons)}
          helper="Coupons currently marked active."
        />
        <SummaryCard
          label="Ad approvals"
          value={formatNumber(summary.pendingAds)}
          helper="Seller campaigns waiting for review."
        />
        <SummaryCard
          label="Referral payouts"
          value={formatNumber(summary.pendingReferralPayouts)}
          helper="Programs waiting on payout completion."
        />
      </div>

      <div className="admin-toolbar" style={{ marginBottom: 18 }}>
        <Select
          value={filters.type}
          style={{ width: 180 }}
          onChange={(value) => {
            const next = { ...filters, type: value };
            setFilters(next);
            loadMarketing(next);
          }}
          options={[
            { label: "All campaign types", value: "all" },
            { label: "Events", value: "event" },
            { label: "Coupons", value: "coupon" },
            { label: "Ads", value: "ad" },
            { label: "Referrals", value: "referral" },
          ]}
        />
        <Select
          value={filters.status}
          style={{ width: 180 }}
          onChange={(value) => setFilters((current) => ({ ...current, status: value }))}
          options={[
            { label: "All statuses", value: "all" },
            { label: "Draft", value: "draft" },
            { label: "Scheduled", value: "scheduled" },
            { label: "Active", value: "active" },
            { label: "Paused", value: "paused" },
            { label: "Pending", value: "pending" },
            { label: "Approved", value: "approved" },
            { label: "Completed", value: "completed" },
          ]}
        />
        <div className="admin-toolbar__grow">
          <Input.Search
            allowClear
            placeholder="Search title, market, window, status, or notes"
            value={filters.search}
            onChange={(event) =>
              setFilters((current) => ({
                ...current,
                search: event.target.value,
              }))
            }
            onSearch={(value) => {
              const next = { ...filters, search: value.trim() };
              setFilters(next);
              loadMarketing(next);
            }}
          />
        </div>
      </div>

      <Spin spinning={loading || saving}>
        <div className="admin-section-grid admin-section-grid--2">
          <section className="admin-panel">
            <div className="admin-panel__body">
              <div className="admin-panel__header">
                <div>
                  <h2 className="admin-panel__title">{marketingTypeConfig.event.title}</h2>
                  <div className="admin-panel__subtitle">
                    {marketingTypeConfig.event.subtitle}
                  </div>
                </div>
                <Button onClick={() => openCreateModal("event")}>
                  {marketingTypeConfig.event.addLabel}
                </Button>
              </div>
              <Table
                rowKey="id"
                pagination={false}
                locale={{ emptyText: <Empty description="No events yet" /> }}
                dataSource={groups.events}
                columns={[
                  { title: "Event", dataIndex: "name", key: "name" },
                  { title: "Country", dataIndex: "country", key: "country" },
                  { title: "Scope", dataIndex: "scope", key: "scope" },
                  { title: "Window", dataIndex: "window", key: "window" },
                  {
                    title: "Status",
                    key: "status",
                    render: (_, record) => renderStatusTag(record.status),
                  },
                  {
                    title: "Actions",
                    key: "actions",
                    render: (_, record) => (
                      <Space wrap>
                        <Button size="small" onClick={() => openEditModal(record)}>
                          Edit
                        </Button>
                        <Popconfirm
                          title="Delete this event?"
                          onConfirm={() => handleDelete(record)}
                        >
                          <Button size="small" danger>
                            Delete
                          </Button>
                        </Popconfirm>
                      </Space>
                    ),
                  },
                ]}
              />
            </div>
          </section>

          <section className="admin-panel admin-panel--soft">
            <div className="admin-panel__body">
              <div className="admin-panel__header">
                <div>
                  <h2 className="admin-panel__title">{marketingTypeConfig.coupon.title}</h2>
                  <div className="admin-panel__subtitle">
                    {marketingTypeConfig.coupon.subtitle}
                  </div>
                </div>
                <Button onClick={() => openCreateModal("coupon")}>
                  {marketingTypeConfig.coupon.addLabel}
                </Button>
              </div>
              <Table
                rowKey="id"
                pagination={false}
                locale={{ emptyText: <Empty description="No coupons yet" /> }}
                dataSource={groups.coupons}
                columns={[
                  { title: "Code", dataIndex: "code", key: "code" },
                  { title: "Market", dataIndex: "market", key: "market" },
                  {
                    title: "Usage",
                    key: "usage",
                    render: (_, record) =>
                      formatNumber(record.couponMetrics?.usageCount ?? record.usage),
                  },
                  {
                    title: "Abuse risk",
                    key: "abuseFlagged",
                    render: (_, record) => {
                      const metadata = extractMarketingMetadata(record);
                      const abuseSignals = record.couponMetrics?.abuseSignals || [];
                      return abuseSignals.length ||
                        metadata.abuseFlagged ||
                        metadata.abuse_flagged ? (
                        <Tag color="volcano">Flagged</Tag>
                      ) : (
                        <Tag color="green">Normal</Tag>
                      );
                    },
                  },
                  {
                    title: "Status",
                    key: "status",
                    render: (_, record) => renderStatusTag(record.status),
                  },
                  {
                    title: "Actions",
                    key: "actions",
                    render: (_, record) => (
                      <Space wrap>
                        <Button size="small" onClick={() => openEditModal(record)}>
                          Edit
                        </Button>
                        <Button
                          size="small"
                          onClick={() =>
                            handleQuickUpdate(
                              record,
                              {
                                status: record.status === "active" ? "paused" : "active",
                              },
                              record.status === "active"
                                ? "Coupon paused."
                                : "Coupon activated.",
                            )
                          }
                        >
                          {record.status === "active" ? "Pause" : "Activate"}
                        </Button>
                        <Popconfirm
                          title="Delete this coupon?"
                          onConfirm={() => handleDelete(record)}
                        >
                          <Button size="small" danger>
                            Delete
                          </Button>
                        </Popconfirm>
                      </Space>
                    ),
                  },
                ]}
              />
            </div>
          </section>
        </div>

        <div className="admin-section-grid admin-section-grid--2" style={{ marginTop: 18 }}>
          <section className="admin-panel admin-panel--soft">
            <div className="admin-panel__body">
              <div className="admin-panel__header">
                <div>
                  <h2 className="admin-panel__title">{marketingTypeConfig.ad.title}</h2>
                  <div className="admin-panel__subtitle">
                    {marketingTypeConfig.ad.subtitle}
                  </div>
                </div>
                <Button onClick={() => openCreateModal("ad")}>
                  {marketingTypeConfig.ad.addLabel}
                </Button>
              </div>
              <Table
                rowKey="id"
                pagination={false}
                locale={{ emptyText: <Empty description="No ad campaigns yet" /> }}
                dataSource={groups.ads}
                columns={[
                  { title: "Seller", dataIndex: "seller", key: "seller" },
                  {
                    title: "Spend Limit",
                    key: "spendLimit",
                    render: (_, record) =>
                      record.spendLimit === null
                        ? "No limit"
                        : formatCurrency(record.spendLimit),
                  },
                  {
                    title: "Spend Used",
                    key: "spendUsed",
                    render: (_, record) =>
                      formatCurrency(
                        extractMarketingMetadata(record).spendUsed || 0,
                      ),
                  },
                  {
                    title: "Status",
                    key: "status",
                    render: (_, record) => renderStatusTag(record.status),
                  },
                  {
                    title: "Actions",
                    key: "actions",
                    render: (_, record) => (
                      <Space wrap>
                        <Button size="small" onClick={() => openEditModal(record)}>
                          Edit
                        </Button>
                        <Button
                          size="small"
                          onClick={() =>
                            handleQuickUpdate(
                              record,
                              {
                                status:
                                  record.status === "approved" ? "paused" : "approved",
                              },
                              record.status === "approved"
                                ? "Ad campaign paused."
                                : "Ad campaign approved.",
                            )
                          }
                        >
                          {record.status === "approved" ? "Pause" : "Approve"}
                        </Button>
                        <Popconfirm
                          title="Delete this ad campaign?"
                          onConfirm={() => handleDelete(record)}
                        >
                          <Button size="small" danger>
                            Delete
                          </Button>
                        </Popconfirm>
                      </Space>
                    ),
                  },
                ]}
              />
            </div>
          </section>

          <section className="admin-panel">
            <div className="admin-panel__body">
              <div className="admin-panel__header">
                <div>
                  <h2 className="admin-panel__title">{marketingTypeConfig.referral.title}</h2>
                  <div className="admin-panel__subtitle">
                    {marketingTypeConfig.referral.subtitle}
                  </div>
                </div>
                <Button onClick={() => openCreateModal("referral")}>
                  {marketingTypeConfig.referral.addLabel}
                </Button>
              </div>
              <Table
                rowKey="id"
                pagination={false}
                locale={{ emptyText: <Empty description="No referral programs yet" /> }}
                dataSource={groups.referrals}
                columns={[
                  { title: "Program", dataIndex: "program", key: "program" },
                  {
                    title: "Conversions",
                    key: "conversions",
                    render: (_, record) => formatNumber(record.conversions),
                  },
                  {
                    title: "Reward",
                    key: "rewardAmount",
                    render: (_, record) =>
                      formatCurrency(
                        extractMarketingMetadata(record).rewardAmount || 0,
                      ),
                  },
                  {
                    title: "Payout",
                    key: "payoutStatus",
                    render: (_, record) => renderStatusTag(record.payoutStatus || "pending"),
                  },
                  {
                    title: "Actions",
                    key: "actions",
                    render: (_, record) => (
                      <Space wrap>
                        <Button size="small" onClick={() => openEditModal(record)}>
                          Edit
                        </Button>
                        <Button
                          size="small"
                          onClick={() => handleReferralPayoutStatus(record)}
                        >
                          {record.payoutStatus === "pending" ? "Mark paid" : "Re-open"}
                        </Button>
                        <Popconfirm
                          title="Delete this referral program?"
                          onConfirm={() => handleDelete(record)}
                        >
                          <Button size="small" danger>
                            Delete
                          </Button>
                        </Popconfirm>
                      </Space>
                    ),
                  },
                ]}
              />
            </div>
          </section>
        </div>
      </Spin>

      <Modal
        destroyOnHidden
        open={isModalOpen}
        title={editingRecord ? `Edit ${currentConfig.primaryLabel}` : currentConfig.addLabel}
        onCancel={closeModal}
        onOk={handleSave}
        okText={editingRecord ? "Save changes" : "Create"}
        confirmLoading={saving}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label={currentConfig.primaryLabel}
            rules={[{ required: true, message: `${currentConfig.primaryLabel} is required` }]}
          >
            <Input placeholder={currentConfig.primaryLabel} />
          </Form.Item>

          {recordType === "event" ? (
            <>
              <Form.Item name="country" label="Country">
                <Input placeholder="Nigeria" />
              </Form.Item>
              <Form.Item name="market" label="Market">
                <Input placeholder="West Africa" />
              </Form.Item>
              <Form.Item name="window" label="Promotion window">
                <Input placeholder="Nov 23 - Nov 30" />
              </Form.Item>
              <Form.Item name="scope" label="Scope">
                <Input placeholder="Verified sellers in selected market" />
              </Form.Item>
            </>
          ) : null}

          {recordType === "coupon" ? (
            <>
              <Form.Item name="market" label="Market">
                <Input placeholder="All countries" />
              </Form.Item>
              <Form.Item name="usage" label="Usage">
                <InputNumber min={0} style={{ width: "100%" }} />
              </Form.Item>
              <Form.Item
                name="abuseFlagged"
                label="Flag abuse risk"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </>
          ) : null}

          {recordType === "ad" ? (
            <>
              <Form.Item name="market" label="Market">
                <Input placeholder="Nigeria" />
              </Form.Item>
              <Form.Item name="scope" label="Scope">
                <Input placeholder="Verified fashion sellers" />
              </Form.Item>
              <Form.Item name="spendLimit" label="Spend limit">
                <InputNumber min={0} style={{ width: "100%" }} />
              </Form.Item>
              <Form.Item name="spendUsed" label="Spend used">
                <InputNumber min={0} style={{ width: "100%" }} />
              </Form.Item>
              <Form.Item name="owner" label="Campaign owner">
                <Input placeholder="seller@example.com" />
              </Form.Item>
            </>
          ) : null}

          {recordType === "referral" ? (
            <>
              <Form.Item name="conversions" label="Conversions">
                <InputNumber min={0} style={{ width: "100%" }} />
              </Form.Item>
              <Form.Item name="rewardAmount" label="Reward amount">
                <InputNumber min={0} style={{ width: "100%" }} />
              </Form.Item>
              <Form.Item name="payoutAmount" label="Payout amount">
                <InputNumber min={0} style={{ width: "100%" }} />
              </Form.Item>
              <Form.Item name="payoutStatus" label="Payout status">
                <Select
                  options={[
                    { label: "Pending", value: "pending" },
                    { label: "Completed", value: "completed" },
                  ]}
                />
              </Form.Item>
            </>
          ) : null}

          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: "Status is required" }]}
          >
            <Select
              options={[
                { label: "Draft", value: "draft" },
                { label: "Scheduled", value: "scheduled" },
                { label: "Active", value: "active" },
                { label: "Paused", value: "paused" },
                { label: "Pending", value: "pending" },
                { label: "Approved", value: "approved" },
                { label: "Completed", value: "completed" },
              ]}
            />
          </Form.Item>

          <Form.Item name="notes" label="Notes">
            <Input.TextArea rows={4} placeholder="Internal campaign notes" />
          </Form.Item>
        </Form>
      </Modal>
    </AdminWorkspaceShell>
  );
};

export const BloomzonFinanceWorkspace = () => {
  const { token } = useContext(MainContext);
  const navigate = useNavigate();
  const [report, setReport] = useState(defaultAdminSalesReport);
  const [profitability, setProfitability] = useState({ summary: {}, monthly: [] });
  const [payouts, setPayouts] = useState(defaultAdminPayouts);
  const [settlements, setSettlements] = useState(defaultAdminVendorSettlements);
  const [subscriptionPlans, setSubscriptionPlans] = useState(
    defaultAdminSubscriptionPlans,
  );
  const [vendorSubscriptions, setVendorSubscriptions] = useState(
    defaultAdminVendorSubscriptions,
  );
  const [planModalOpen, setPlanModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [actionBusy, setActionBusy] = useState("");
  const [error, setError] = useState("");
  const [planForm] = Form.useForm();

  const loadFinance = async () => {
    try {
      setLoading(true);
      setError("");
      const [
        reportData,
        profitabilityData,
        payoutData,
        settlementData,
        subscriptionPlanData,
        vendorSubscriptionData,
      ] =
        await Promise.all([
          fetchAdminSalesReport(token, { months: 6 }),
          fetchAdminProfitability(token, { months: 6 }),
          fetchAdminPayouts(token, { page: 1, limit: 12, kind: "all", status: "all" }),
          fetchAdminVendorSettlements(token, { page: 1, limit: 8 }),
          fetchAdminSubscriptionPlans(token),
          fetchAdminVendorSubscriptions(token, { page: 1, limit: 8 }),
        ]);

      setReport(reportData || defaultAdminSalesReport);
      setProfitability(profitabilityData || { summary: {}, monthly: [] });
      setPayouts(payoutData || defaultAdminPayouts);
      setSettlements(settlementData || defaultAdminVendorSettlements);
      setSubscriptionPlans(
        subscriptionPlanData || defaultAdminSubscriptionPlans,
      );
      setVendorSubscriptions(
        vendorSubscriptionData || defaultAdminVendorSubscriptions,
      );
    } catch (loadError) {
      setError(
        loadError?.response?.data?.message ||
          "Failed to load finance and revenue data.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadFinance();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const latestMonth = report.monthly?.[report.monthly.length - 1] || null;
  const subscriptionRevenue = profitability.summary.subscriptionRevenue || 0;
  const payoutStateRows = useMemo(
    () => [
      {
        key: "pending",
        label: "Pending payouts",
        count: payouts.summary.pending,
        amount: payouts.summary.pendingAmount,
        helper: "Settlement and withdrawal payouts waiting to be posted.",
      },
      {
        key: "posted",
        label: "Posted payouts",
        count: payouts.summary.posted,
        amount: payouts.summary.postedAmount,
        helper: "Payouts already posted through finance.",
      },
      {
        key: "failed",
        label: "Failed payouts",
        count: payouts.summary.failed,
        amount: payouts.summary.failedAmount,
        helper: "Failed or reversed payouts requiring follow-up.",
      },
      {
        key: "hold",
        label: "Held payouts",
        count: payouts.summary.holds,
        amount: payouts.summary.holdAmount,
        helper: "Settlements on hold because the seller account is inactive.",
      },
    ],
    [payouts.summary],
  );

  const exportFinanceSnapshot = async (mode) => {
    try {
      setActionBusy(`export-${mode}`);

      if (mode === "settlements") {
        const rows = (settlements.items || []).map((record) => ({
          seller: record.vendor?.name || "",
          seller_email: record.vendor?.email || "",
          eligible_orders: record.eligibleOrders || record.ordersCount || 0,
          settlement_amount: record.settlementAmount || record.balance || 0,
          wallet_balance: record.wallet?.balance || 0,
        }));

        if (downloadCsv("bloomzon-finance-settlements.csv", rows)) {
          message.success("Settlement export ready.");
        }
        return;
      }

      const exportType = mode === "payouts" ? "payouts" : "profitability";
      const exportData = await fetchAdminFinanceExport(token, {
        type: exportType,
        format: "csv",
        months: 6,
      });

      if (
        downloadTextFile(
          exportData?.filename ||
            (mode === "payouts"
              ? "bloomzon-finance-payouts.csv"
              : "bloomzon-finance-snapshot.csv"),
          exportData?.content || "",
          "text/csv;charset=utf-8;",
        )
      ) {
        message.success("Finance export ready.");
      }
    } catch (actionError) {
      message.error(
        actionError?.response?.data?.message || "Failed to export finance snapshot.",
      );
    } finally {
      setActionBusy("");
    }
  };

  const openPlanModal = (plan = null) => {
    setEditingPlan(plan);
    planForm.setFieldsValue({
      id: plan?.id || undefined,
      service_key: plan?.serviceKey || plan?.service_key || undefined,
      plan_name: plan?.planName || plan?.plan_name || "",
      plan_code: plan?.planCode || plan?.plan_code || "standard",
      billing_cycle: plan?.billingCycle || plan?.billing_cycle || "monthly",
      fee_amount: plan?.feeAmount || plan?.fee_amount || 0,
      currency_code: plan?.currencyCode || plan?.currency_code || "USD",
      access_duration_days:
        plan?.accessDurationDays || plan?.access_duration_days || 30,
      requires_payment:
        plan?.requiresPayment ?? plan?.requires_payment ?? true,
      is_active: plan?.isActive ?? plan?.is_active ?? true,
      description: plan?.description || "",
    });
    setPlanModalOpen(true);
  };

  const handleSavePlan = async () => {
    try {
      const values = await planForm.validateFields();
      setActionBusy("save-plan");
      await upsertAdminSubscriptionPlan(token, values);
      message.success(
        editingPlan ? "Subscription plan updated." : "Subscription plan created.",
      );
      setPlanModalOpen(false);
      setEditingPlan(null);
      planForm.resetFields();
      await loadFinance();
    } catch (actionError) {
      if (actionError?.errorFields) {
        return;
      }
      message.error(
        actionError?.response?.data?.message ||
          "Failed to save subscription plan.",
      );
    } finally {
      setActionBusy("");
    }
  };

  return (
    <AdminWorkspaceShell
      eyebrow="Finance"
      title="Finance & Revenue"
      subtitle="GMV, profitability estimates, unified payouts, and settlement coverage from the current paired backend."
      actions={
        <>
          <Button onClick={() => navigate("/dashboard/finance/profitability")}>
            Profitability
          </Button>
          <Button onClick={() => navigate("/dashboard/finance/payouts")}>
            Payouts
          </Button>
          <Button
            icon={<DownloadOutlined />}
            onClick={() => exportFinanceSnapshot("summary")}
            disabled={!report.monthly.length && !payoutStateRows.length}
            loading={actionBusy === "export-summary"}
          >
            Export snapshot
          </Button>
          <Button onClick={() => openPlanModal()}>New subscription plan</Button>
          <Button icon={<ReloadOutlined />} onClick={loadFinance}>
            Refresh
          </Button>
        </>
      }
    >
      {error ? (
        <Alert style={{ marginBottom: 18 }} type="error" showIcon message={error} />
      ) : null}
      <DataGapNotice
        title="Ledger notes"
        items={[
          "GMV is mapped from current sales-report totals.",
          "Subscription fee revenue is now tracked as a dedicated ledger and included in profitability.",
          "Payout states and finance exports are now wired to the dedicated admin payout and export endpoints.",
          "Marketplace commission still uses the backend retained-value estimate because per-category commission ledgers are not modeled yet.",
          "VAT and formal P&L exports are still outside the current backend contract.",
        ]}
      />
      {loading ? (
        <div className="flex flex-center" style={{ minHeight: 320 }}>
          <Spin size="large" />
        </div>
      ) : (
        <>
          <div className="admin-kpi-grid" style={{ marginBottom: 18 }}>
            <SummaryCard
              label="GMV"
              value={formatCurrency(latestMonth?.totalRevenue || report.summary.totalRevenue)}
              helper="Latest monthly sales report revenue."
            />
            <SummaryCard
              label="Platform revenue"
              value={formatCurrency(
                profitability.summary.recognizedPlatformRevenue ||
                  profitability.summary.estimatedPlatformSpread,
              )}
              helper="Subscriptions plus marketplace retained-value estimate."
            />
            <SummaryCard
              label="Pending payouts"
              value={formatCurrency(payouts.summary.pendingAmount)}
              helper="Unified payout volume waiting to be posted."
            />
            <SummaryCard
              label="Failed payouts"
              value={formatNumber(payouts.summary.failed)}
              helper="Failed or reversed payouts that need finance follow-up."
            />
            <SummaryCard
              label="Wallet exposure"
              value={formatCurrency(settlements.summary.walletBalanceExposure)}
              helper="Seller balance exposure across settlement candidates."
            />
            <SummaryCard
              label="Subscription fees"
              value={formatCurrency(subscriptionRevenue)}
              helper={`${formatNumber(
                profitability.summary.activeSubscriptions || 0,
              )} active subscriptions`}
            />
          </div>

          <div className="admin-section-grid admin-section-grid--2">
            <section className="admin-panel">
              <div className="admin-panel__body">
                <div className="admin-panel__header">
                  <div>
                    <h2 className="admin-panel__title">Monthly Revenue</h2>
                    <div className="admin-panel__subtitle">
                      Backend sales report across products and services.
                    </div>
                  </div>
                </div>
                <Table
                  rowKey="label"
                  pagination={false}
                  dataSource={report.monthly}
                  locale={{ emptyText: <Empty description="No monthly revenue data" /> }}
                  columns={[
                    { title: "Month", dataIndex: "label", key: "label" },
                    {
                      title: "Product Sales",
                      key: "productSales",
                      render: (_, record) => formatCurrency(record.productSales),
                    },
                    {
                      title: "Service Sales",
                      key: "serviceSales",
                      render: (_, record) => formatCurrency(record.serviceSales),
                    },
                    {
                      title: "GMV",
                      key: "totalRevenue",
                      render: (_, record) => formatCurrency(record.totalRevenue),
                    },
                  ]}
                />
              </div>
            </section>

            <section className="admin-panel admin-panel--soft">
              <div className="admin-panel__body">
                <div className="admin-panel__header">
                  <div>
                    <h2 className="admin-panel__title">Settlement Pipeline</h2>
                    <div className="admin-panel__subtitle">
                      Seller payout candidates and current balance exposure.
                    </div>
                  </div>
                  <Button
                    size="small"
                    icon={<DownloadOutlined />}
                    onClick={() => exportFinanceSnapshot("settlements")}
                    disabled={!settlements.items?.length}
                    loading={actionBusy === "export-settlements"}
                  >
                    Export settlements
                  </Button>
                </div>
                <Table
                  rowKey={(record) => `${record.vendor?.id}-${record.order_id || record.id}`}
                  pagination={false}
                  dataSource={settlements.items}
                  locale={{ emptyText: <Empty description="No settlement candidates" /> }}
                  columns={[
                    {
                      title: "Seller",
                      key: "vendor",
                      render: (_, record) => (
                        <div>
                          <div style={{ fontWeight: 600 }}>
                            {record.vendor?.name || "Unknown seller"}
                          </div>
                          <div style={{ color: "#6b7280", fontSize: 12 }}>
                            {record.vendor?.email || "No email"}
                          </div>
                        </div>
                      ),
                    },
                    {
                      title: "Eligible Orders",
                      key: "eligibleOrders",
                      render: (_, record) => formatNumber(record.eligibleOrders || record.ordersCount),
                    },
                    {
                      title: "Settlement Amount",
                      key: "settlementAmount",
                      render: (_, record) =>
                        formatCurrency(record.settlementAmount || record.balance || 0),
                    },
                  ]}
                />
              </div>
            </section>
          </div>

          <div className="admin-section-grid admin-section-grid--2" style={{ marginTop: 18 }}>
            <section className="admin-panel">
              <div className="admin-panel__body">
                <div className="admin-panel__header">
                  <div>
                    <h2 className="admin-panel__title">Payout States</h2>
                    <div className="admin-panel__subtitle">
                      Unified settlement and withdrawal posture across pending, posted, failed, and held payout states.
                    </div>
                  </div>
                  <Button
                    size="small"
                    icon={<DownloadOutlined />}
                    onClick={() => exportFinanceSnapshot("payouts")}
                    disabled={!payouts.items?.length}
                    loading={actionBusy === "export-payouts"}
                  >
                    Export payouts
                  </Button>
                </div>
                <Table
                  rowKey="key"
                  pagination={false}
                  dataSource={payoutStateRows}
                  columns={[
                    { title: "State", dataIndex: "label", key: "label" },
                    {
                      title: "Count",
                      key: "count",
                      render: (_, record) => formatNumber(record.count),
                    },
                    {
                      title: "Amount",
                      key: "amount",
                      render: (_, record) => formatCurrency(record.amount),
                    },
                    { title: "Notes", dataIndex: "helper", key: "helper" },
                  ]}
                />
              </div>
            </section>

            <section className="admin-panel admin-panel--soft">
              <div className="admin-panel__body">
                <div className="admin-panel__header">
                  <div>
                    <h2 className="admin-panel__title">Recent Payout Requests</h2>
                    <div className="admin-panel__subtitle">
                      Latest payout records returned by the unified admin payout feed.
                    </div>
                  </div>
                </div>
                <Table
                  rowKey="id"
                  pagination={false}
                  dataSource={payouts.items}
                  locale={{ emptyText: <Empty description="No payout requests found" /> }}
                  columns={[
                    {
                      title: "Seller",
                      key: "seller",
                      render: (_, record) => (
                        <div>
                          <div style={{ fontWeight: 600 }}>
                            {record.vendor?.name || "Unknown seller"}
                          </div>
                          <div style={{ color: "#6b7280", fontSize: 12 }}>
                            {record.vendor?.email || "No email"}
                          </div>
                        </div>
                      ),
                    },
                    {
                      title: "Amount",
                      key: "amount",
                      render: (_, record) =>
                        formatCurrency(record.amount || 0),
                    },
                    {
                      title: "Kind",
                      key: "kind",
                      render: (_, record) => renderStatusTag(record.kind || "payout"),
                    },
                    {
                      title: "Status",
                      key: "status",
                      render: (_, record) => renderStatusTag(record.status || "pending"),
                    },
                    {
                      title: "Requested",
                      key: "createdAt",
                      render: (_, record) =>
                        formatDateTime(record.created_at || record.createdAt),
                    },
                  ]}
                />
              </div>
            </section>
          </div>

          <div className="admin-section-grid admin-section-grid--2" style={{ marginTop: 18 }}>
            <section className="admin-panel">
              <div className="admin-panel__body">
                <div className="admin-panel__header">
                  <div>
                    <h2 className="admin-panel__title">Service Subscription Plans</h2>
                    <div className="admin-panel__subtitle">
                      Set monthly or recurring fees per seller service.
                    </div>
                  </div>
                </div>
                <Table
                  rowKey="id"
                  pagination={false}
                  dataSource={subscriptionPlans.items}
                  locale={{ emptyText: <Empty description="No subscription plans configured" /> }}
                  columns={[
                    {
                      title: "Service",
                      key: "service",
                      render: (_, record) => record.serviceLabel || prettifyKey(record.serviceKey),
                    },
                    {
                      title: "Plan",
                      key: "plan",
                      render: (_, record) => (
                        <div>
                          <div style={{ fontWeight: 600 }}>
                            {record.planName || "Subscription"}
                          </div>
                          <div style={{ color: "#6b7280", fontSize: 12 }}>
                            {record.planCode || "standard"}
                          </div>
                        </div>
                      ),
                    },
                    {
                      title: "Fee",
                      key: "fee",
                      render: (_, record) =>
                        `${record.currencyCode || "USD"} ${formatNumber(record.feeAmount || 0)}`,
                    },
                    {
                      title: "Cycle",
                      key: "billingCycle",
                      render: (_, record) => prettifyKey(record.billingCycle || "monthly"),
                    },
                    {
                      title: "Status",
                      key: "status",
                      render: (_, record) =>
                        renderStatusTag(record.isActive ? "active" : "inactive"),
                    },
                    {
                      title: "Actions",
                      key: "actions",
                      render: (_, record) => (
                        <Button size="small" onClick={() => openPlanModal(record)}>
                          Edit
                        </Button>
                      ),
                    },
                  ]}
                />
              </div>
            </section>

            <section className="admin-panel admin-panel--soft">
              <div className="admin-panel__body">
                <div className="admin-panel__header">
                  <div>
                    <h2 className="admin-panel__title">Subscription Ledger</h2>
                    <div className="admin-panel__subtitle">
                      Recent vendor service assignments and renewal posture.
                    </div>
                  </div>
                </div>
                <Table
                  rowKey="id"
                  pagination={false}
                  dataSource={vendorSubscriptions.items}
                  locale={{ emptyText: <Empty description="No vendor subscriptions" /> }}
                  columns={[
                    {
                      title: "Vendor",
                      key: "vendor",
                      render: (_, record) => (
                        <div>
                          <div style={{ fontWeight: 600 }}>
                            {record.vendor?.name || `Vendor #${record.vendorId}`}
                          </div>
                          <div style={{ color: "#6b7280", fontSize: 12 }}>
                            {record.vendor?.email || "No email"}
                          </div>
                        </div>
                      ),
                    },
                    {
                      title: "Service",
                      key: "service",
                      render: (_, record) => record.serviceLabel || prettifyKey(record.serviceKey),
                    },
                    {
                      title: "Fee",
                      key: "fee",
                      render: (_, record) =>
                        `${record.currencyCode || "USD"} ${formatNumber(record.feeAmount || 0)}`,
                    },
                    {
                      title: "Status",
                      key: "status",
                      render: (_, record) => (
                        <Space wrap>
                          {renderStatusTag(record.status || "inactive")}
                          {renderStatusTag(record.paymentStatus || "unpaid")}
                        </Space>
                      ),
                    },
                  ]}
                />
              </div>
            </section>
          </div>
        </>
      )}
      <Modal
        title={editingPlan ? "Edit Subscription Plan" : "New Subscription Plan"}
        open={planModalOpen}
        onCancel={() => {
          setPlanModalOpen(false);
          setEditingPlan(null);
          planForm.resetFields();
        }}
        onOk={handleSavePlan}
        confirmLoading={actionBusy === "save-plan"}
      >
        <Form form={planForm} layout="vertical">
          <Form.Item name="id" hidden>
            <Input />
          </Form.Item>
          <Form.Item
            name="service_key"
            label="Service key"
            rules={[{ required: true, message: "Service key is required" }]}
          >
            <Select
              options={[
                { value: "bloomzon_products", label: "Bloomzon Products" },
                { value: "groceries_beverages", label: "Groceries & Beverages" },
                { value: "foods_restaurants", label: "Foods & Restaurants" },
                { value: "bloomzon_healthcare", label: "Bloomzon Health Care" },
                { value: "used_items", label: "Used Items" },
                { value: "automobile_parts", label: "Automobile & Parts" },
                { value: "real_estate", label: "Real Estate" },
              ]}
            />
          </Form.Item>
          <Form.Item
            name="plan_name"
            label="Plan name"
            rules={[{ required: true, message: "Plan name is required" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="plan_code" label="Plan code">
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="billing_cycle" label="Billing cycle">
            <Select
              options={[
                { value: "monthly", label: "Monthly" },
                { value: "quarterly", label: "Quarterly" },
                { value: "yearly", label: "Yearly" },
                { value: "manual", label: "Manual" },
              ]}
            />
          </Form.Item>
          <Form.Item name="fee_amount" label="Fee amount">
            <InputNumber style={{ width: "100%" }} min={0} />
          </Form.Item>
          <Form.Item name="currency_code" label="Currency code">
            <Input />
          </Form.Item>
          <Form.Item name="access_duration_days" label="Access duration days">
            <InputNumber style={{ width: "100%" }} min={1} />
          </Form.Item>
          <Form.Item name="requires_payment" label="Requires payment" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item name="is_active" label="Active" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </AdminWorkspaceShell>
  );
};

export const BloomzonSettingsWorkspace = () => {
  const { token, user } = useContext(MainContext);
  const navigate = useNavigate();
  const [privacyForm] = Form.useForm();
  const [bulkForm] = Form.useForm();
  const [domains, setDomains] = useState(defaultAdminDomains);
  const [featureFlags, setFeatureFlags] = useState(defaultAdminFeatureFlags);
  const [featureFlagSnapshot, setFeatureFlagSnapshot] = useState([]);
  const [privacyQueue, setPrivacyQueue] = useState(defaultAdminPrivacyQueue);
  const [bulkTools, setBulkTools] = useState(defaultAdminBulkTools);
  const [bulkOperations, setBulkOperations] = useState(defaultAdminBulkOperations);
  const [loading, setLoading] = useState(false);
  const [savingFlags, setSavingFlags] = useState(false);
  const [updatingPrivacy, setUpdatingPrivacy] = useState(false);
  const [previewingBulk, setPreviewingBulk] = useState(false);
  const [applyingBulk, setApplyingBulk] = useState(false);
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);
  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const [activePrivacyRequest, setActivePrivacyRequest] = useState(null);
  const [activeBulkTool, setActiveBulkTool] = useState(null);
  const [bulkPreview, setBulkPreview] = useState(null);
  const [bulkFileList, setBulkFileList] = useState([]);
  const [error, setError] = useState("");

  const canManageSettings = hasAdminPermission(user, "settings:manage");
  const canManageFlags = canManageSettings;
  const canManagePrivacyQueue = canManageSettings;
  const canRunBulkTools = canManageSettings;

  const loadSettings = async () => {
    try {
      setLoading(true);
      setError("");
      const [
        domainResult,
        featureFlagResult,
        privacyResult,
        bulkToolResult,
        bulkOperationsResult,
      ] =
        await Promise.allSettled([
          fetchAdminDomains(token),
          fetchAdminFeatureFlags(token, { page: 1, limit: 100 }),
          fetchAdminPrivacyRequests(token, { page: 1, limit: 100 }),
          fetchAdminBulkToolTemplates(token),
          fetchAdminBulkOperations(token, { page: 1, limit: 20 }),
        ]);

      if (domainResult.status === "fulfilled") {
        setDomains(domainResult.value || defaultAdminDomains);
      }

      if (featureFlagResult.status === "fulfilled") {
        setFeatureFlags(featureFlagResult.value || defaultAdminFeatureFlags);
        setFeatureFlagSnapshot(featureFlagResult.value?.flags || []);
      }

      if (privacyResult.status === "fulfilled") {
        setPrivacyQueue(privacyResult.value || defaultAdminPrivacyQueue);
      }

      if (bulkToolResult.status === "fulfilled") {
        setBulkTools(bulkToolResult.value || defaultAdminBulkTools);
      }

      if (bulkOperationsResult.status === "fulfilled") {
        setBulkOperations(bulkOperationsResult.value || defaultAdminBulkOperations);
      }

      const failedLoads = [
        domainResult,
        featureFlagResult,
        privacyResult,
        bulkToolResult,
        bulkOperationsResult,
      ].filter((result) => result.status === "rejected");

      if (failedLoads.length) {
        setError("Some settings data could not be loaded. Displaying the latest successful sections.");
      }
    } catch (loadError) {
      setError(
        loadError?.response?.data?.message ||
          "Failed to load system settings data.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadSettings();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const enabledFlags = useMemo(
    () =>
      featureFlags.summary?.enabled ??
      (featureFlags.flags || []).filter((flag) => flag.enabled).length,
    [featureFlags],
  );

  const exportPrivacyQueue = () => {
    const rows = (privacyQueue.items || []).map((request) => ({
      type: request.type,
      requester: request.requester,
      jurisdiction: request.jurisdiction,
      status: request.status,
      priority: request.priority,
      issueType: request.issueType,
      createdAt: request.createdAt,
    }));

    if (downloadCsv("bloomzon-privacy-requests.csv", rows)) {
      message.success("Privacy request queue exported.");
    }
  };

  const saveFeatureFlagSettings = async () => {
    try {
      setSavingFlags(true);
      const result = await saveAdminFeatureFlags(
        token,
        featureFlags.flags || [],
        featureFlagSnapshot,
      );
      setFeatureFlags(result || defaultAdminFeatureFlags);
      setFeatureFlagSnapshot(result?.flags || []);
      message.success("Feature flag settings saved.");
    } catch (saveError) {
      message.error(
        saveError?.response?.data?.message ||
          "Unable to save feature flag settings.",
      );
    } finally {
      setSavingFlags(false);
    }
  };

  const openPrivacyRequest = (record) => {
    setActivePrivacyRequest(record);
    privacyForm.setFieldsValue({
      status: record.status || "open",
      notes: record.notes || "",
    });
    setPrivacyModalOpen(true);
  };

  const openBulkTool = (tool) => {
    setActiveBulkTool(tool);
    setBulkPreview(null);
    setBulkFileList([]);
    bulkForm.setFieldsValue({
      file_name: tool.sampleFileName || `${tool.tool}-upload.csv`,
      csv_content: tool.csv || "",
    });
    setBulkModalOpen(true);
  };

  const buildBulkSubmissionPayload = async () => {
    if (!activeBulkTool) {
      return null;
    }

    const values = await bulkForm.validateFields();
    const file = bulkFileList[0]?.originFileObj || null;
    const csvContent = String(values.csv_content || "").trim();

    if (!file && !csvContent) {
      bulkForm.setFields([
        {
          name: "csv_content",
          errors: ["Upload a CSV file or paste CSV content to continue"],
        },
      ]);
      return null;
    }

    bulkForm.setFields([{ name: "csv_content", errors: [] }]);

    return {
      tool: activeBulkTool.tool,
      file_name:
        values.file_name ||
        file?.name ||
        activeBulkTool.sampleFileName ||
        `${activeBulkTool.tool}-upload.csv`,
      csv_content: csvContent,
      file,
    };
  };

  const handlePrivacyRequestUpdate = async () => {
    if (!activePrivacyRequest) {
      return;
    }

    try {
      const values = await privacyForm.validateFields();
      setUpdatingPrivacy(true);
      await updateAdminPrivacyRequest(token, activePrivacyRequest.id, values);
      message.success("Privacy request updated.");
      setPrivacyModalOpen(false);
      setActivePrivacyRequest(null);
      privacyForm.resetFields();
      await loadSettings();
    } catch (updateError) {
      if (updateError?.errorFields) {
        return;
      }

      message.error(
        updateError?.response?.data?.message ||
          "Unable to update privacy request.",
      );
    } finally {
      setUpdatingPrivacy(false);
    }
  };

  const handleBulkPreview = async () => {
    if (!activeBulkTool) {
      return;
    }

    try {
      const payload = await buildBulkSubmissionPayload();
      if (!payload) {
        return;
      }

      setPreviewingBulk(true);
      const preview = await previewAdminBulkOperation(token, payload);
      setBulkPreview(preview);
      message.success("CSV preview generated.");
    } catch (runError) {
      if (runError?.errorFields) {
        return;
      }

      message.error(
        runError?.response?.data?.message ||
          "Unable to preview bulk CSV.",
      );
    } finally {
      setPreviewingBulk(false);
    }
  };

  const handleBulkApply = async () => {
    if (!activeBulkTool) {
      return;
    }

    try {
      const payload = await buildBulkSubmissionPayload();
      if (!payload) {
        return;
      }

      setApplyingBulk(true);
      await applyAdminBulkOperation(token, payload);
      message.success(`${activeBulkTool.label} processed successfully.`);
      setBulkModalOpen(false);
      setActiveBulkTool(null);
      setBulkPreview(null);
      setBulkFileList([]);
      bulkForm.resetFields();
      await loadSettings();
    } catch (runError) {
      if (runError?.errorFields) {
        return;
      }

      message.error(
        runError?.response?.data?.message ||
          "Unable to apply bulk CSV operation.",
      );
    } finally {
      setApplyingBulk(false);
    }
  };

  const activeBulkTools = useMemo(
    () => (bulkTools.tools || []).length,
    [bulkTools.tools],
  );

  const latestBulkOperationByTool = useMemo(
    () =>
      (bulkOperations.items || []).reduce((acc, item) => {
        if (!acc[item.tool]) {
          acc[item.tool] = item;
        }
        return acc;
      }, {}),
    [bulkOperations.items],
  );

  const bulkPreviewSummary = bulkPreview?.summary || {};
  const bulkPreviewErrors = Array.isArray(bulkPreview?.errors) ? bulkPreview.errors : [];
  const bulkPreviewRows = Array.isArray(bulkPreview?.preview) ? bulkPreview.preview : [];
  const bulkPreviewValidRows = getBulkPreviewSummaryValue(
    bulkPreviewSummary,
    "validRows",
    "valid_rows",
  );

  return (
    <AdminWorkspaceShell
      eyebrow="Settings"
      title="System Settings & Tools"
      subtitle="Backend-wired feature flags, privacy/compliance request handling, and audited bulk CSV tooling."
      actions={
        <>
          <Button icon={<DownloadOutlined />} onClick={exportPrivacyQueue}>
            Export privacy queue
          </Button>
          <Button icon={<ReloadOutlined />} onClick={loadSettings}>
            Refresh
          </Button>
        </>
      }
    >
      {error ? (
        <Alert style={{ marginBottom: 18 }} type="error" showIcon message={error} />
      ) : null}
      <DataGapNotice
        title="Tooling notes"
        items={[
          "Feature flags now load from the dedicated admin settings API and require settings permissions to edit.",
          "Privacy queue entries are persisted through the admin privacy-request model and are backfilled from privacy-related support cases.",
          "Bulk CSV templates, preview, apply, and operation history now come from the backend admin bulk-tool endpoints.",
        ]}
      />
      {loading ? (
        <div className="flex flex-center" style={{ minHeight: 320 }}>
          <Spin size="large" />
        </div>
      ) : (
        <>
          <div className="admin-kpi-grid" style={{ marginBottom: 18 }}>
            <SummaryCard
              label="Feature flags"
              value={formatNumber(enabledFlags)}
              helper="Persisted backend flags currently enabled."
            />
            <SummaryCard
              label="Domains"
              value={formatNumber(domains.items.length)}
              helper="Top-level marketplace domains."
            />
            <SummaryCard
              label="Privacy queue"
              value={formatNumber(privacyQueue.summary.total)}
              helper="Persisted GDPR/CCPA/privacy requests."
            />
            <SummaryCard
              label="Bulk tools"
              value={formatNumber(activeBulkTools)}
              helper="CSV upload tool templates currently available."
            />
          </div>

          <div className="admin-section-grid admin-section-grid--2">
            <section className="admin-panel">
              <div className="admin-panel__body">
                <div className="admin-panel__header">
                  <div>
                    <h2 className="admin-panel__title">Feature Flags</h2>
                    <div className="admin-panel__subtitle">
                      Persisted rollout toggles by country or user segment.
                    </div>
                  </div>
                  <Space>
                    <Button
                      type="primary"
                      onClick={saveFeatureFlagSettings}
                      loading={savingFlags}
                      disabled={!canManageFlags}
                    >
                      Save flags
                    </Button>
                  </Space>
                </div>
                <Table
                  rowKey="id"
                  pagination={false}
                  dataSource={featureFlags.flags || []}
                  columns={[
                    { title: "Key", dataIndex: "key", key: "key" },
                    { title: "Flag", dataIndex: "label", key: "label" },
                    { title: "Scope", dataIndex: "scope", key: "scope" },
                    {
                      title: "Rollout",
                      dataIndex: "rollout",
                      key: "rollout",
                      render: (value) => prettifyKey(value || "segment"),
                    },
                    {
                      title: "Description",
                      dataIndex: "description",
                      key: "description",
                    },
                    {
                      title: "Enabled",
                      key: "enabled",
                      render: (_, record) => (
                        <Switch
                          checked={record.enabled}
                          disabled={!canManageFlags}
                          onChange={(checked) =>
                            setFeatureFlags((current) => ({
                              ...current,
                              flags: (current.flags || []).map((flag) =>
                                flag.id === record.id
                                  ? {
                                      ...flag,
                                      enabled: checked,
                                      updatedAt: new Date().toISOString(),
                                    }
                                  : flag,
                              ),
                            }))
                          }
                        />
                      ),
                    },
                  ]}
                />
              </div>
            </section>

            <section className="admin-panel admin-panel--soft">
              <div className="admin-panel__body">
                <div className="admin-panel__header">
                  <div>
                    <h2 className="admin-panel__title">Privacy & Compliance Queue</h2>
                    <div className="admin-panel__subtitle">
                      Live backend support cases identified as GDPR, CCPA, or privacy requests.
                    </div>
                  </div>
                </div>
                <Table
                  rowKey="id"
                  pagination={false}
                  dataSource={privacyQueue.items || []}
                  columns={[
                    { title: "Type", dataIndex: "type", key: "type" },
                    { title: "Requester", dataIndex: "requester", key: "requester" },
                    {
                      title: "Jurisdiction",
                      dataIndex: "jurisdiction",
                      key: "jurisdiction",
                    },
                    {
                      title: "Status",
                      key: "status",
                      render: (_, record) => renderStatusTag(record.status),
                    },
                    {
                      title: "Priority",
                      key: "priority",
                      render: (_, record) => renderStatusTag(record.priority),
                    },
                    {
                      title: "SLA",
                      key: "sla",
                      render: (_, record) =>
                        record.sla?.breached ? (
                          <Tag color="red">Breached</Tag>
                        ) : record.sla?.firstResponseDueAt || record.sla?.resolutionDueAt ? (
                          <Tag color="blue">Tracked</Tag>
                        ) : (
                          <Tag>Untracked</Tag>
                        ),
                    },
                    {
                      title: "Action",
                      key: "action",
                      render: (_, record) => (
                        <Space>
                          <Button size="small" onClick={() => openPrivacyRequest(record)}>
                            Review
                          </Button>
                          {record.sourceSupportTicketId ? (
                            <Button
                              size="small"
                              type="link"
                              onClick={() => navigate("/dashboard/admin-system/support")}
                            >
                              Open support
                            </Button>
                          ) : null}
                        </Space>
                      ),
                    },
                  ]}
                />
              </div>
            </section>
          </div>

          <section className="admin-panel admin-panel--soft" style={{ marginTop: 18 }}>
            <div className="admin-panel__body">
              <div className="admin-panel__header">
                <div>
                  <h2 className="admin-panel__title">Bulk Tools</h2>
                  <div className="admin-panel__subtitle">
                    Backend templates and upload flows for products, inventory, and pricing CSVs.
                  </div>
                </div>
              </div>
              <Table
                rowKey="id"
                pagination={false}
                dataSource={bulkTools.tools || []}
                columns={[
                  { title: "Tool", dataIndex: "label", key: "label" },
                  { title: "Description", dataIndex: "description", key: "description" },
                  {
                    title: "Headers",
                    key: "requiredHeaders",
                    render: (_, record) => {
                      const requiredHeaders = record.requiredHeaders || [];
                      const optionalHeaders = record.optionalHeaders || [];
                      const fallbackHeaders =
                        requiredHeaders.length ? requiredHeaders : record.columns || [];

                      if (!fallbackHeaders.length && !optionalHeaders.length) {
                        return "Not configured";
                      }

                      return (
                        <Space size={[4, 4]} wrap>
                          {fallbackHeaders.map((header) => (
                            <Tag key={`${record.tool}-${header}`} color="blue">
                              {header}
                            </Tag>
                          ))}
                          {optionalHeaders.map((header) => (
                            <Tag key={`${record.tool}-${header}-optional`}>
                              {header}
                            </Tag>
                          ))}
                        </Space>
                      );
                    },
                  },
                  {
                    title: "Last operation",
                    key: "lastOperation",
                    render: (_, record) => {
                      const operation = latestBulkOperationByTool[record.tool];

                      if (!operation?.updatedAt) {
                        return "Never";
                      }

                      return (
                        <div style={{ display: "grid", gap: 4 }}>
                          <div>{formatDateTime(operation.updatedAt)}</div>
                          <div>
                            {renderStatusTag(operation.status)}
                          </div>
                        </div>
                      );
                    },
                  },
                  {
                    title: "Action",
                    key: "action",
                    render: (_, record) => (
                      <Space>
                        <Button
                          size="small"
                          onClick={() =>
                            downloadTextFile(
                              record.sampleFileName || `${record.tool}-template.csv`,
                              record.csv || "",
                              "text/csv;charset=utf-8;",
                            )
                          }
                        >
                          Download template
                        </Button>
                        <Button
                          size="small"
                          type="primary"
                          onClick={() => openBulkTool(record)}
                          disabled={!canRunBulkTools}
                        >
                          Upload CSV
                        </Button>
                      </Space>
                    ),
                  },
                ]}
              />
              <div style={{ marginTop: 18 }}>
                <h3 className="admin-panel__title" style={{ marginBottom: 12 }}>
                  Recent Bulk Operations
                </h3>
                <Table
                  rowKey="id"
                  pagination={false}
                  dataSource={bulkOperations.items || []}
                  locale={{ emptyText: <Empty description="No bulk CSV operations yet." /> }}
                  columns={[
                    { title: "Operation", dataIndex: "tool", key: "tool" },
                    {
                      title: "File",
                      key: "fileName",
                      render: (_, record) => record.fileName || "Unknown file",
                    },
                    {
                      title: "Status",
                      key: "status",
                      render: (_, record) => renderStatusTag(record.status),
                    },
                    {
                      title: "Rows",
                      key: "rows",
                      render: (_, record) =>
                        `${formatNumber(record.successRowCount)}/${formatNumber(record.inputRowCount)}`,
                    },
                    {
                      title: "Errors",
                      key: "errors",
                      render: (_, record) => formatNumber(record.errorRowCount),
                    },
                    {
                      title: "Summary",
                      key: "summary",
                      render: (_, record) => {
                        const summary = record.summary || {};
                        const validRows =
                          summary.valid_rows ?? summary.validRows ?? record.successRowCount;
                        const invalidRows =
                          summary.invalid_rows ?? summary.invalidRows ?? record.errorRowCount;

                        return `${formatNumber(validRows)} valid / ${formatNumber(invalidRows)} invalid`;
                      },
                    },
                    {
                      title: "Updated",
                      key: "updatedAt",
                      render: (_, record) =>
                        record.updatedAt ? formatDateTime(record.updatedAt) : "Unknown",
                    },
                  ]}
                />
              </div>
            </div>
          </section>
        </>
      )}
      <Modal
        title={
          activePrivacyRequest
            ? `Review ${activePrivacyRequest.type || "privacy request"}`
            : "Review privacy request"
        }
        open={privacyModalOpen}
        onCancel={() => {
          setPrivacyModalOpen(false);
          setActivePrivacyRequest(null);
          privacyForm.resetFields();
        }}
        onOk={handlePrivacyRequestUpdate}
        okText="Save request"
        okButtonProps={{ loading: updatingPrivacy, disabled: !canManagePrivacyQueue }}
        cancelButtonProps={{ disabled: updatingPrivacy }}
      >
        {activePrivacyRequest ? (
          <>
            <Alert
              style={{ marginBottom: 16 }}
              type="info"
              showIcon
              message={activePrivacyRequest.requester}
              description={activePrivacyRequest.description || activePrivacyRequest.issueType}
            />
            <Form form={privacyForm} layout="vertical">
              <Form.Item
                label="Status"
                name="status"
                rules={[{ required: true, message: "Select a status" }]}
              >
                <Select
                  disabled={!canManagePrivacyQueue}
                  options={[
                    { label: "Open", value: "open" },
                    { label: "In progress", value: "in_progress" },
                    { label: "Completed", value: "completed" },
                    { label: "Rejected", value: "rejected" },
                    { label: "Cancelled", value: "cancelled" },
                  ]}
                />
              </Form.Item>
              <Form.Item label="Admin notes" name="notes">
                <Input.TextArea
                  rows={4}
                  disabled={!canManagePrivacyQueue}
                  placeholder="Capture export or deletion handling notes for compliance review."
                />
              </Form.Item>
            </Form>
          </>
        ) : null}
      </Modal>
      <Modal
        title={activeBulkTool ? `Upload ${activeBulkTool.label}` : "Upload CSV"}
        open={bulkModalOpen}
        onCancel={() => {
          setBulkModalOpen(false);
          setActiveBulkTool(null);
          setBulkPreview(null);
          setBulkFileList([]);
          bulkForm.resetFields();
        }}
        footer={[
          <Button
            key="cancel"
            onClick={() => {
              setBulkModalOpen(false);
              setActiveBulkTool(null);
              setBulkPreview(null);
              setBulkFileList([]);
              bulkForm.resetFields();
            }}
            disabled={previewingBulk || applyingBulk}
          >
            Cancel
          </Button>,
          <Button
            key="preview"
            onClick={handleBulkPreview}
            loading={previewingBulk}
            disabled={!canRunBulkTools}
          >
            Preview CSV
          </Button>,
          <Button
            key="apply"
            type="primary"
            onClick={handleBulkApply}
            loading={applyingBulk}
            disabled={!canRunBulkTools || Boolean(bulkPreview && bulkPreviewValidRows === 0)}
          >
            Apply CSV
          </Button>,
        ]}
      >
        {activeBulkTool ? (
          <>
            <Alert
              style={{ marginBottom: 16 }}
              type="info"
              showIcon
              message={activeBulkTool.description}
              description={
                <div style={{ display: "grid", gap: 8 }}>
                  <div>
                    Template headers:{" "}
                    {(activeBulkTool.requiredHeaders || []).length
                      ? activeBulkTool.requiredHeaders.join(", ")
                      : (activeBulkTool.columns || []).join(", ") || "Not configured"}
                  </div>
                  {Array.isArray(activeBulkTool.notes) && activeBulkTool.notes.length ? (
                    <div style={{ display: "grid", gap: 4 }}>
                      {activeBulkTool.notes.map((note) => (
                        <div key={note}>{note}</div>
                      ))}
                    </div>
                  ) : null}
                </div>
              }
            />
            <Form form={bulkForm} layout="vertical">
              <Form.Item label="File name" name="file_name">
                <Input disabled={!canRunBulkTools} />
              </Form.Item>
              <Form.Item label="CSV file">
                <Upload
                  accept=".csv,text/csv"
                  beforeUpload={() => false}
                  disabled={!canRunBulkTools}
                  fileList={bulkFileList}
                  maxCount={1}
                  onChange={({ fileList }) => {
                    setBulkPreview(null);
                    setBulkFileList(fileList.slice(-1));
                    bulkForm.setFields([{ name: "csv_content", errors: [] }]);
                    if (fileList[0]?.name) {
                      bulkForm.setFieldValue("file_name", fileList[0].name);
                    }
                  }}
                  onRemove={() => {
                    setBulkPreview(null);
                    setBulkFileList([]);
                    bulkForm.setFields([{ name: "csv_content", errors: [] }]);
                  }}
                >
                  <Button icon={<UploadOutlined />} disabled={!canRunBulkTools}>
                    Select CSV file
                  </Button>
                </Upload>
              </Form.Item>
              <Form.Item
                label="CSV content"
                name="csv_content"
                extra="Upload a CSV file or paste CSV content directly."
              >
                <Input.TextArea
                  rows={12}
                  disabled={!canRunBulkTools}
                  placeholder="Paste CSV content here."
                  onChange={() => {
                    setBulkPreview(null);
                    bulkForm.setFields([{ name: "csv_content", errors: [] }]);
                  }}
                />
              </Form.Item>
            </Form>
            {bulkPreview ? (
              <div style={{ display: "grid", gap: 12 }}>
                <Alert
                  type={bulkPreviewErrors.length ? "warning" : "success"}
                  showIcon
                  message={`Parsed ${formatNumber(getBulkPreviewSummaryValue(bulkPreviewSummary, "totalRows", "total_rows"))} rows`}
                  description={`Valid: ${formatNumber(getBulkPreviewSummaryValue(bulkPreviewSummary, "validRows", "valid_rows"))} • Invalid: ${formatNumber(getBulkPreviewSummaryValue(bulkPreviewSummary, "invalidRows", "invalid_rows"))} • Headers: ${(bulkPreview.headers || []).join(", ")}`}
                />
                {bulkPreviewRows.length ? (
                  <Table
                    size="small"
                    pagination={false}
                    rowKey={(record) => record.row_number}
                    dataSource={bulkPreviewRows.slice(0, 5)}
                    columns={[
                      {
                        title: "Row",
                        dataIndex: "row_number",
                        key: "row_number",
                      },
                      {
                        title: "Target",
                        key: "target",
                        render: (_, record) =>
                          record.identifier ||
                          record.product_code ||
                          record.product_id ||
                          record.target_id ||
                          "Pending resolution",
                      },
                      {
                        title: "Type",
                        key: "type",
                        render: (_, record) =>
                          prettifyKey(record.target_type || activeBulkTool.tool || "row"),
                      },
                      {
                        title: "State",
                        key: "state",
                        render: (_, record) =>
                          Array.isArray(record.errors) && record.errors.length
                            ? <Tag color="red">Error</Tag>
                            : <Tag color="green">Ready</Tag>,
                      },
                      {
                        title: "Details",
                        key: "details",
                        render: (_, record) =>
                          Array.isArray(record.errors) && record.errors.length
                            ? record.errors.join(", ")
                            : Array.isArray(record.updates) && record.updates.length
                              ? `Updates: ${record.updates.join(", ")}`
                              : "Row validated successfully",
                      },
                    ]}
                  />
                ) : null}
                {bulkPreviewErrors.length ? (
                  <Alert
                    type="warning"
                    showIcon
                    message={`${formatNumber(bulkPreviewErrors.length)} validation issue(s) found`}
                    description={
                      <div style={{ display: "grid", gap: 4 }}>
                        {bulkPreviewErrors.slice(0, 5).map((entry, index) => (
                          <div key={`${entry.row_number || entry.row || index}`}>
                            Row {entry.row_number || entry.row || index + 1}: {getBulkPreviewErrorText(entry)}
                          </div>
                        ))}
                      </div>
                    }
                  />
                ) : null}
              </div>
            ) : null}
          </>
        ) : null}
      </Modal>
    </AdminWorkspaceShell>
  );
};
