import Axios from "axios";

import {
  ADMIN_BASE_URL,
  CATEGORIES_BASE_URL,
  CITY_BASE_URL,
  CURRENCY_BASE_URL,
  DOMAIN_BASE_URL,
  PRODUCT_BASE_URL,
  STORE_BASE_URL,
  getAuthHeaders,
} from "./config";

export const defaultAdminOverview = {
  summary: {
    users: {
      total: 0,
      new: 0,
      active: 0,
      activeLast30Days: 0,
      banned: 0,
      suspended: 0,
    },
    sellers: {
      total: 0,
      new: 0,
      active: 0,
      activeLast30Days: 0,
      banned: 0,
      suspended: 0,
    },
    buyers: { total: 0, new: 0, active: 0, activeLast30Days: 0, banned: 0 },
    products: { total: 0, active: 0, inactive: 0 },
    stores: { total: 0, verified: 0, inactive: 0, domains: 0, categories: 0 },
    orders: { total: 0, pending: 0, processing: 0, completed: 0 },
    finance: {
      withdrawalRequests: 0,
      postedWithdrawals: 0,
      pendingWithdrawals: 0,
      postedVolume: 0,
      pendingVolume: 0,
      walletBalance: 0,
      paymentMethods: 0,
      subscriptionRevenue: 0,
      activeSubscriptions: 0,
      overdueSubscriptions: 0,
    },
    operations: {
      openSupportTickets: 0,
      reviewModeration: 0,
      inactiveListings: 0,
      refundingOrders: 0,
    },
    alerts: {
      flaggedTransactions: 0,
      slaBreaches: 0,
      pendingKyc: 0,
      moderationQueueCount: 0,
    },
  },
  charts: {
    monthly: { labels: [], users: [], sellers: [], products: [], orders: [] },
    finance: { labels: [], withdrawals: [], volume: [], subscriptions: [] },
    operations: { labels: [], supportTickets: [], moderationReviews: [] },
  },
  queues: {
    summary: {
      withdrawals: 0,
      openSupportTickets: 0,
      reviewModeration: 0,
      inactiveListings: 0,
      refundingOrders: 0,
    },
    withdrawals: [],
    support: [],
    reviews: [],
    listings: [],
    refunds: [],
  },
  recent: {
    orders: [],
  },
  productsBySubdomain: [],
  serviceHealth: [],
};

export const defaultAdminOperations = defaultAdminOverview.queues;

export const defaultAdminWithdrawals = {
  items: [],
  summary: {
    total: 0,
    posted: 0,
    pending: 0,
    failed: 0,
    reversed: 0,
    postedVolume: 0,
    pendingVolume: 0,
    walletBalance: 0,
    paymentMethods: 0,
    filtered: 0,
  },
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    total_pages: 1,
  },
};

export const defaultAdminActivities = {
  items: [],
  summary: {
    total: 0,
    accessGranted: 0,
    accessUpdated: 0,
    inactive: 0,
  },
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    total_pages: 1,
  },
};

export const defaultAdminAuditLogs = {
  items: [],
  summary: {
    total: 0,
    uniqueAdmins: 0,
  },
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    total_pages: 1,
  },
};

export const defaultAdminServiceAnalytics = {
  months: 6,
  service: null,
};

export const defaultAdminSalesReport = {
  months: 6,
  summary: {
    productSales: 0,
    serviceSales: 0,
    totalRevenue: 0,
    totalOrders: 0,
    totalUnits: 0,
  },
  monthly: [],
  productBreakdown: [],
  serviceBreakdown: [],
};

export const defaultAdminFoodOrders = {
  items: [],
  summary: {
    total: 0,
    pending: 0,
    processing: 0,
    completed: 0,
    filtered: 0,
  },
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    total_pages: 1,
  },
};

export const defaultAdminProfitability = {
  summary: {
    grossSales: 0,
    subscriptionRevenue: 0,
    postedSettlements: 0,
    pendingSettlements: 0,
    postedWithdrawals: 0,
    pendingWithdrawals: 0,
    walletBalanceExposure: 0,
    estimatedPlatformSpread: 0,
    recognizedPlatformRevenue: 0,
    activeSubscriptions: 0,
    overdueSubscriptions: 0,
  },
  monthly: [],
  serviceMix: [],
  note: "",
};

export const defaultAdminVendorSettlements = {
  items: [],
  summary: {
    total: 0,
    filtered: 0,
    totalSettlementAmount: 0,
    filteredSettlementAmount: 0,
    totalGrossAmount: 0,
    filteredGrossAmount: 0,
    totalServiceChargeAmount: 0,
    filteredServiceChargeAmount: 0,
    eligibleOrders: 0,
    filteredEligibleOrders: 0,
    walletBalanceExposure: 0,
    filteredWalletBalanceExposure: 0,
    minBalanceApplied: null,
    maxBalanceApplied: null,
  },
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    total_pages: 1,
  },
};

export const defaultAdminSupportConversations = {
  items: [],
  summary: {
    user: 0,
    support: 0,
    dispute: 0,
    internal: 0,
    unread: 0,
  },
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    total_pages: 1,
  },
};

export const defaultAdminSupportMessages = {
  conversation: null,
  items: [],
};

export const defaultAdminStores = {
  items: [],
  summary: {
    all: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    suspended: 0,
    filtered: 0,
  },
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    total_pages: 1,
  },
};

export const defaultAdminStoreDetails = null;

export const defaultAdminAdmins = {
  items: [],
};

export const defaultAdminRoles = {
  roles: [],
  permissions: [],
};

export const defaultAdminSubscriptionPlans = {
  items: [],
};

export const defaultAdminVendorSubscriptions = {
  items: [],
  summary: {
    subscriptionRevenue: 0,
    paymentCount: 0,
    activeSubscriptions: 0,
    overdueSubscriptions: 0,
  },
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    total_pages: 1,
  },
};

export const defaultAdminMarketing = {
  items: [],
  groups: {
    events: [],
    coupons: [],
    ads: [],
    referrals: [],
  },
  summary: {
    total: 0,
    events: 0,
    coupons: 0,
    ads: 0,
    referrals: 0,
    activeCoupons: 0,
    pendingAds: 0,
    pendingReferralPayouts: 0,
  },
};

export const defaultAdminUsers = {
  items: [],
  summary: {
    groups: {
      all: 0,
      buyers: 0,
      sellers: 0,
      manufacturers: 0,
      service_providers: 0,
    },
  },
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    total_pages: 1,
  },
};

export const defaultAdminDomains = {
  items: [],
};

export const defaultAdminProducts = {
  items: [],
  summary: {
    total: 0,
    active: 0,
    inactive: 0,
    filtered: 0,
  },
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    total_pages: 1,
  },
};

export const defaultAdminMediaModeration = {
  items: [],
  summary: {
    total: 0,
    bySource: {},
  },
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    total_pages: 1,
  },
};

export const defaultAdminReviewModeration = {
  items: [],
  summary: {
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    flagged: 0,
    withMedia: 0,
  },
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    total_pages: 1,
  },
};

export const defaultAdminCouponMonitoring = {
  items: [],
  summary: {
    total: 0,
    active: 0,
    exhausted: 0,
    suspicious: 0,
  },
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    total_pages: 1,
  },
};

export const defaultAdminSupportTickets = {
  items: [],
  summary: {
    total: 0,
    open: 0,
    inProgress: 0,
    resolved: 0,
    closed: 0,
    breached: 0,
    unassigned: 0,
  },
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    total_pages: 1,
  },
};

export const defaultAdminNotificationFeed = {
  items: [],
  summary: {
    total: 0,
    support: 0,
    refunds: 0,
    approvals: 0,
    withdrawals: 0,
    slaBreaches: 0,
    orders: 0,
  },
};

export const defaultAdminFeatureFlags = {
  flags: [],
  items: [],
  summary: {
    total: 0,
    enabled: 0,
    disabled: 0,
    targetedCountries: 0,
    targetedSegments: 0,
  },
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    total_pages: 1,
  },
};

export const defaultAdminBulkTools = {
  tools: [
    {
      id: "products",
      tool: "products",
      label: "Products CSV",
      description: "Bulk product creation and update rows.",
      status: "ready",
      csv: "",
      requiredHeaders: [],
      optionalHeaders: [],
      sampleFileName: "products-template.csv",
    },
    {
      id: "inventory",
      tool: "inventory",
      label: "Inventory CSV",
      description: "Bulk inventory and stock level updates.",
      status: "ready",
      csv: "",
      requiredHeaders: [],
      optionalHeaders: [],
      sampleFileName: "inventory-template.csv",
    },
    {
      id: "pricing",
      tool: "pricing",
      label: "Pricing CSV",
      description: "Bulk pricing and sale price changes.",
      status: "ready",
      csv: "",
      requiredHeaders: [],
      optionalHeaders: [],
      sampleFileName: "pricing-template.csv",
    },
  ],
};

export const defaultAdminBulkOperations = {
  items: [],
  summary: {
    total: 0,
    pending: 0,
    completed: 0,
    completedWithErrors: 0,
    failed: 0,
  },
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    total_pages: 1,
  },
};

export const defaultAdminPrivacyQueue = {
  items: [],
  summary: {
    total: 0,
    open: 0,
    inProgress: 0,
    resolved: 0,
    closed: 0,
    breached: 0,
  },
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    total_pages: 1,
  },
};

export const defaultAdminPayouts = {
  items: [],
  summary: {
    total: 0,
    pending: 0,
    posted: 0,
    failed: 0,
    holds: 0,
    totalAmount: 0,
  },
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    total_pages: 1,
  },
};

export const defaultAdminLookupList = [];

export const defaultStoreProducts = [];

export const defaultAdminOrders = {
  items: [],
  summary: {
    total: 0,
    pending: 0,
    processing: 0,
    completed: 0,
    filtered: 0,
  },
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    total_pages: 1,
  },
};

export const defaultAdminDeliveryOrders = {
  items: [],
  summary: {
    total: 0,
    shipped: 0,
    pending: 0,
    processing: 0,
    slaBreaches: 0,
    filtered: 0,
  },
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    total_pages: 1,
  },
};

export const defaultAdminRefunds = {
  items: [],
  summary: {
    total: 0,
    pending: 0,
    processing: 0,
    completed: 0,
    failed: 0,
  },
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    total_pages: 1,
  },
};

export const defaultAdminRiskMonitoring = {
  items: [],
  summary: {
    total: 0,
    failedPayments: 0,
    disputes: 0,
    chargebacks: 0,
    suspicious: 0,
  },
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    total_pages: 1,
  },
};

export const defaultAdminApprovalRequests = {
  items: [],
  summary: {
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  },
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    total_pages: 1,
  },
};

const getDataPayload = (response, fallback) => response?.data?.data || fallback;

const parseSettingsDocumentContent = (content, fallback) => {
  if (!content) {
    return fallback;
  }

  if (typeof content === "object" && !Array.isArray(content)) {
    return { ...fallback, ...content };
  }

  if (typeof content === "string") {
    try {
      const parsed = JSON.parse(content);
      return parsed && typeof parsed === "object" && !Array.isArray(parsed)
        ? { ...fallback, ...parsed }
        : fallback;
    } catch {
      return fallback;
    }
  }

  return fallback;
};

const normalizeFeatureFlagScope = (countries = [], userSegments = [], rolloutPercentage = null) => {
  if (Array.isArray(countries) && countries.length) {
    return countries.join(", ");
  }

  if (Array.isArray(userSegments) && userSegments.length) {
    return userSegments.join(", ");
  }

  if (rolloutPercentage !== null && rolloutPercentage !== undefined) {
    return `${rolloutPercentage}% rollout`;
  }

  return "Global";
};

const normalizeFeatureFlagRollout = (countries = [], userSegments = [], rolloutPercentage = null) => {
  if (rolloutPercentage !== null && rolloutPercentage !== undefined) {
    return "percentage";
  }

  if (Array.isArray(countries) && countries.length) {
    return "country";
  }

  if (Array.isArray(userSegments) && userSegments.length) {
    return "segment";
  }

  return "global";
};

const normalizeFeatureFlagWorkspaceItem = (item = {}) => {
  const countries = Array.isArray(item.countries) ? item.countries : [];
  const userSegments = Array.isArray(item.userSegments)
    ? item.userSegments
    : Array.isArray(item.user_segments)
      ? item.user_segments
      : [];
  const rolloutPercentage =
    item.rolloutPercentage ?? item.rollout_percentage ?? null;

  return {
    id: item.id ?? null,
    key: item.key || "",
    label: item.name || item.label || "",
    scope: normalizeFeatureFlagScope(countries, userSegments, rolloutPercentage),
    enabled: Boolean(item.isEnabled ?? item.is_enabled),
    description: item.description || "",
    rollout: normalizeFeatureFlagRollout(countries, userSegments, rolloutPercentage),
    countries,
    userSegments,
    rolloutPercentage,
    notes: item.notes || "",
    updatedAt: item.updatedAt || item.updated_at || null,
  };
};

const normalizeFeatureFlagsResponse = (payload = defaultAdminFeatureFlags) => {
  const items = Array.isArray(payload.items) ? payload.items : [];
  const flags = items.map((item) => normalizeFeatureFlagWorkspaceItem(item));

  return {
    items,
    flags,
    summary: {
      ...defaultAdminFeatureFlags.summary,
      ...(payload.summary || {}),
    },
    pagination: payload.pagination || defaultAdminFeatureFlags.pagination,
  };
};

const normalizePrivacyRequestTypeLabel = (type) => {
  if (type === "delete") {
    return "Delete request";
  }

  if (type === "export") {
    return "Data export";
  }

  return type || "Privacy request";
};

const normalizePrivacyRequestRecord = (item = {}) => ({
  ...item,
  type: normalizePrivacyRequestTypeLabel(item.type),
  rawType: item.type || "export",
  requester:
    item.requester ||
    item.requesterName ||
    item.requester_name ||
    item.requesterEmail ||
    item.requester_email ||
    "Unknown requester",
  requesterName: item.requesterName || item.requester_name || "",
  requesterEmail: item.requesterEmail || item.requester_email || "",
  jurisdiction: item.jurisdiction || "Privacy",
  status: item.status || "open",
  description: item.description || "",
  issueType: item.issueType || item.issue_type || "Privacy request",
  priority: item.priority || (item.sla?.breached ? "high" : "normal"),
  createdAt: item.createdAt || item.created_at || null,
  updatedAt: item.updatedAt || item.updated_at || null,
  sla: item.sla || null,
  notes: item.notes || "",
});

const normalizePrivacyRequestResponse = (payload = defaultAdminPrivacyQueue) => {
  const items = Array.isArray(payload.items)
    ? payload.items.map((item) => normalizePrivacyRequestRecord(item))
    : [];
  const summary = payload.summary || {};

  return {
    items,
    summary: {
      total: summary.total || 0,
      open: summary.open || 0,
      inProgress: summary.inProgress || summary.in_progress || 0,
      completed: summary.completed || 0,
      rejected: summary.rejected || 0,
      cancelled: summary.cancelled || 0,
    },
    pagination: payload.pagination || defaultAdminPrivacyQueue.pagination,
  };
};

const normalizeBulkToolTemplate = (item = {}) => ({
  id: item.tool || item.id || "",
  tool: item.tool || item.id || "",
  label: item.label || item.tool || item.id || "Bulk tool",
  description: item.description || "",
  status: "ready",
  csv: item.csv || item.csv_content || "",
  requiredHeaders: Array.isArray(item.requiredHeaders)
    ? item.requiredHeaders
    : Array.isArray(item.required_headers)
      ? item.required_headers
      : Array.isArray(item.columns)
        ? item.columns
      : [],
  optionalHeaders: Array.isArray(item.optionalHeaders)
    ? item.optionalHeaders
    : Array.isArray(item.optional_headers)
      ? item.optional_headers
      : [],
  columns: Array.isArray(item.columns) ? item.columns : [],
  notes: Array.isArray(item.notes) ? item.notes : [],
  sampleFileName:
    item.sampleFileName || item.sample_file_name || `${item.tool || "bulk"}-template.csv`,
});

const normalizeBulkOperationRecord = (item = {}) => ({
  ...item,
  id: item.id || "",
  tool: item.tool || "",
  status: item.status || "pending",
  fileName: item.fileName || item.file_name || "",
  inputRowCount: item.inputRowCount || item.input_row_count || 0,
  successRowCount: item.successRowCount || item.success_row_count || 0,
  errorRowCount: item.errorRowCount || item.error_row_count || 0,
  summary: item.summary && typeof item.summary === "object" ? item.summary : {},
  errors: Array.isArray(item.errors) ? item.errors : [],
  creator: item.creator || null,
  createdAt: item.createdAt || item.created_at || null,
  updatedAt: item.updatedAt || item.updated_at || null,
});

const normalizeBulkOperationsResponse = (payload = defaultAdminBulkOperations) => ({
  items: Array.isArray(payload.items)
    ? payload.items.map((item) => normalizeBulkOperationRecord(item))
    : [],
  summary: {
    total: payload.summary?.total || 0,
    pending: payload.summary?.pending || 0,
    completed: payload.summary?.completed || 0,
    completedWithErrors:
      payload.summary?.completedWithErrors || payload.summary?.completed_with_errors || 0,
    failed: payload.summary?.failed || 0,
  },
  pagination: payload.pagination || defaultAdminBulkOperations.pagination,
});

const privacyRequestKeywords = [
  "privacy",
  "gdpr",
  "ccpa",
  "delete request",
  "deletion request",
  "data export",
  "data access",
  "erase account",
  "right to be forgotten",
];

const extractPrivacyRequestJurisdiction = (ticket = {}) => {
  const haystack = [
    ticket.issueType,
    ticket.issue_type,
    ticket.description,
    ticket.notes,
    JSON.stringify(ticket.metadata || {}),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  if (haystack.includes("ccpa") || haystack.includes("california")) {
    return "CCPA";
  }

  if (haystack.includes("gdpr") || haystack.includes("eu") || haystack.includes("europe")) {
    return "GDPR";
  }

  return "Privacy";
};

const extractPrivacyRequestType = (ticket = {}) => {
  const haystack = [
    ticket.issueType,
    ticket.issue_type,
    ticket.description,
    ticket.notes,
    JSON.stringify(ticket.metadata || {}),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  if (haystack.includes("delete") || haystack.includes("erase")) {
    return "Delete request";
  }

  if (haystack.includes("export") || haystack.includes("access")) {
    return "Data export";
  }

  return "Privacy request";
};

const normalizePrivacyRequestItem = (ticket = {}) => {
  const status = ticket.status || "open";
  const requester =
    ticket.user?.email ||
    ticket.vendor?.email ||
    ticket.user?.name ||
    ticket.vendor?.name ||
    "Unknown requester";

  return {
    ...ticket,
    id: ticket.id,
    type: extractPrivacyRequestType(ticket),
    requester,
    requesterName: ticket.user?.name || ticket.vendor?.name || "",
    jurisdiction: extractPrivacyRequestJurisdiction(ticket),
    status,
    priority: ticket.priority || "normal",
    issueType: ticket.issueType || ticket.issue_type || "Privacy request",
    description: ticket.description || "",
    createdAt: ticket.createdAt || ticket.created_at || null,
    updatedAt: ticket.updatedAt || ticket.updated_at || null,
    sla: ticket.sla || null,
  };
};

const normalizePrivacyQueueResponse = (payload = defaultAdminSupportTickets, params = {}) => {
  const sourceItems = Array.isArray(payload.items) ? payload.items : [];
  const filteredItems = sourceItems.filter((ticket) => {
    const haystack = [
      ticket.issueType,
      ticket.issue_type,
      ticket.description,
      ticket.notes,
      JSON.stringify(ticket.metadata || {}),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return privacyRequestKeywords.some((keyword) => haystack.includes(keyword));
  });
  const page = Math.max(1, Number(params.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(params.limit) || 20));
  const offset = (page - 1) * limit;
  const items = filteredItems.map((ticket) => normalizePrivacyRequestItem(ticket));

  return {
    items: items.slice(offset, offset + limit),
    summary: {
      total: items.length,
      open: items.filter((item) => item.status === "open").length,
      inProgress: items.filter((item) => item.status === "in_progress").length,
      resolved: items.filter((item) => item.status === "resolved").length,
      closed: items.filter((item) => item.status === "closed").length,
      breached: items.filter((item) => item.sla?.breached).length,
    },
    pagination: {
      page,
      limit,
      total: items.length,
      total_pages: Math.ceil(items.length / limit) || 1,
    },
  };
};

const normalizeAuditLogItem = (entry = {}) => {
  const adminAccount = entry.adminAccount || entry.admin || {};
  const actor = entry.details?.actor || {};
  const adminUser = adminAccount.user || {};

  return {
    ...entry,
    createdAt: entry.createdAt || entry.occurred_at || entry.occurredAt || null,
    occurred_at: entry.occurred_at || entry.createdAt || entry.occurredAt || null,
    ip_address: entry.ip_address || entry.ipAddress || "",
    adminAccount: {
      ...adminAccount,
      id: adminAccount.id || actor.admin_account_id || entry.admin_id || null,
      email: adminAccount.email || actor.email || "",
      admin_code: adminAccount.admin_code || actor.admin_code || "",
      roles: Array.isArray(adminAccount.roles) ? adminAccount.roles : actor.roles || [],
      permissions: Array.isArray(adminAccount.permissions)
        ? adminAccount.permissions
        : actor.permissions || [],
      user: {
        ...adminUser,
        id: adminUser.id || actor.user_id || null,
        name: adminUser.name || adminAccount.email || actor.email || "Unknown admin",
        email: adminUser.email || adminAccount.email || actor.email || "",
      },
    },
  };
};

const normalizeAuditLogsResponse = (payload = {}, params = {}) => {
  const page = Math.max(1, Number(params.page) || 1);
  const limit = Math.min(200, Math.max(1, Number(params.limit) || 20));
  const data = payload?.data;

  if (data?.items) {
    const items = data.items.map((entry) => normalizeAuditLogItem(entry));
    const total = Number(data?.pagination?.total ?? items.length);
    return {
      success: payload?.success !== false,
      message: payload?.message || "",
      data: {
        items,
        summary: {
          total: Number(data?.summary?.total ?? total),
          uniqueAdmins: Number(data?.summary?.uniqueAdmins ?? 0),
        },
        pagination: {
          page: Number(data?.pagination?.page ?? page),
          limit: Number(data?.pagination?.limit ?? limit),
          total,
          total_pages:
            Number(data?.pagination?.total_pages ?? (Math.ceil(total / limit) || 1)),
        },
      },
    };
  }

  const items = Array.isArray(data)
    ? data.map((entry) => normalizeAuditLogItem(entry))
    : [];
  const total = Number(payload?.total ?? items.length);

  return {
    success: payload?.success !== false,
    message: payload?.message || "",
    data: {
      items,
      summary: {
        total,
        uniqueAdmins: new Set(
          items.map((entry) => entry.adminAccount?.admin_code).filter(Boolean),
        ).size,
      },
      pagination: {
        page,
        limit,
        total,
        total_pages: Math.ceil(total / limit) || 1,
      },
    },
  };
};

const normalizeMarketingItem = (entry = {}) => {
  const type = ["event", "coupon", "ad", "referral"].includes(entry.type)
    ? entry.type
    : "event";
  const title = String(entry.title || entry.name || entry.code || entry.seller || entry.program || "");
  const rawSpendLimit =
    entry.spendLimit !== undefined && entry.spendLimit !== null
      ? entry.spendLimit
      : entry.spend_limit;
  const parsedSpendLimit =
    rawSpendLimit === undefined || rawSpendLimit === null
      ? null
      : Number(rawSpendLimit);
  const spendLimit = Number.isFinite(parsedSpendLimit) ? parsedSpendLimit : null;
  const payoutStatus = entry.payoutStatus || entry.payout_status || null;

  return {
    ...entry,
    id: Number(entry.id) || entry.id,
    type,
    title,
    name: type === "event" ? title : entry.name || "",
    code: type === "coupon" ? title : entry.code || "",
    seller: type === "ad" ? title : entry.seller || "",
    program: type === "referral" ? title : entry.program || "",
    country: entry.country || "",
    market: entry.market || "",
    window: entry.window || "",
    status: entry.status || "draft",
    usage: Number(entry.usage) || 0,
    spend_limit: spendLimit,
    spendLimit,
    conversions: Number(entry.conversions) || 0,
    payout_status: payoutStatus,
    payoutStatus,
    scope: entry.scope || "",
    notes: entry.notes || "",
    metadata:
      entry.metadata && typeof entry.metadata === "object" ? entry.metadata : null,
    createdAt: entry.createdAt || entry.created_at || null,
    updatedAt: entry.updatedAt || entry.updated_at || null,
  };
};

const buildMarketingGroups = (items = []) =>
  items.reduce(
    (groups, item) => {
      const normalized = normalizeMarketingItem(item);
      if (normalized.type === "coupon") {
        groups.coupons.push(normalized);
      } else if (normalized.type === "ad") {
        groups.ads.push(normalized);
      } else if (normalized.type === "referral") {
        groups.referrals.push(normalized);
      } else {
        groups.events.push(normalized);
      }

      return groups;
    },
    {
      events: [],
      coupons: [],
      ads: [],
      referrals: [],
    },
  );

const normalizeMarketingResponse = (payload = {}) => {
  const data = payload?.data || {};
  const items = Array.isArray(data.items)
    ? data.items.map((entry) => normalizeMarketingItem(entry))
    : [];
  const groups = data.groups
    ? {
        events: Array.isArray(data.groups.events)
          ? data.groups.events.map((entry) => normalizeMarketingItem(entry))
          : [],
        coupons: Array.isArray(data.groups.coupons)
          ? data.groups.coupons.map((entry) => normalizeMarketingItem(entry))
          : [],
        ads: Array.isArray(data.groups.ads)
          ? data.groups.ads.map((entry) => normalizeMarketingItem(entry))
          : [],
        referrals: Array.isArray(data.groups.referrals)
          ? data.groups.referrals.map((entry) => normalizeMarketingItem(entry))
          : [],
      }
    : buildMarketingGroups(items);

  return {
    items,
    groups,
    summary: {
      total: Number(data?.summary?.total ?? items.length),
      events: Number(data?.summary?.events ?? groups.events.length),
      coupons: Number(data?.summary?.coupons ?? groups.coupons.length),
      ads: Number(data?.summary?.ads ?? groups.ads.length),
      referrals: Number(data?.summary?.referrals ?? groups.referrals.length),
      activeCoupons: Number(
        data?.summary?.activeCoupons ??
          groups.coupons.filter((item) => item.status === "active").length,
      ),
      pendingAds: Number(
        data?.summary?.pendingAds ??
          groups.ads.filter((item) => item.status === "pending").length,
      ),
      pendingReferralPayouts: Number(
        data?.summary?.pendingReferralPayouts ??
          groups.referrals.filter((item) => item.payoutStatus === "pending").length,
      ),
    },
  };
};

export const fetchAdminAdmins = async (token) => {
  const response = await Axios.get(`${ADMIN_BASE_URL}/admins`, {
    headers: getAuthHeaders(token),
    withCredentials: true,
  });

  return getDataPayload(response, defaultAdminAdmins);
};

export const fetchAdminRoles = async (token) => {
  const response = await Axios.get(`${ADMIN_BASE_URL}/roles`, {
    headers: getAuthHeaders(token),
    withCredentials: true,
  });

  return getDataPayload(response, defaultAdminRoles);
};

export const fetchAdminSubscriptionPlans = async (token) => {
  const response = await Axios.get(`${ADMIN_BASE_URL}/subscriptions/plans`, {
    headers: getAuthHeaders(token),
    withCredentials: true,
  });

  return getDataPayload(response, defaultAdminSubscriptionPlans);
};

export const upsertAdminSubscriptionPlan = async (token, payload) => {
  const hasId = Boolean(payload?.id);
  const response = await Axios[hasId ? "put" : "post"](
    hasId
      ? `${ADMIN_BASE_URL}/subscriptions/plans/${payload.id}`
      : `${ADMIN_BASE_URL}/subscriptions/plans`,
    payload,
    {
      headers: getAuthHeaders(token),
      withCredentials: true,
    },
  );

  return response?.data?.data || null;
};

export const fetchAdminVendorSubscriptions = async (token, params = {}) => {
  const response = await Axios.get(`${ADMIN_BASE_URL}/subscriptions/vendors`, {
    headers: getAuthHeaders(token),
    params,
    withCredentials: true,
  });

  return getDataPayload(response, defaultAdminVendorSubscriptions);
};

export const updateAdminVendorSubscription = async (
  token,
  vendorId,
  serviceKey,
  payload,
) => {
  const response = await Axios.put(
    `${ADMIN_BASE_URL}/subscriptions/vendors/${vendorId}/${serviceKey}`,
    payload,
    {
      headers: getAuthHeaders(token),
      withCredentials: true,
    },
  );

  return response?.data?.data || null;
};

export const fetchAdminOverview = async (token) => {
  const response = await Axios.get(`${ADMIN_BASE_URL}/dashboard/overview`, {
    headers: getAuthHeaders(token),
    withCredentials: true,
  });

  return getDataPayload(response, defaultAdminOverview);
};

export const fetchAdminOperations = async (token, params = {}) => {
  const response = await Axios.get(`${ADMIN_BASE_URL}/operations/queues`, {
    headers: getAuthHeaders(token),
    params,
    withCredentials: true,
  });

  return getDataPayload(response, defaultAdminOperations);
};

export const fetchAdminUsers = async (token, params = {}) => {
  const response = await Axios.get(`${ADMIN_BASE_URL}/users`, {
    headers: getAuthHeaders(token),
    params,
    withCredentials: true,
  });

  return getDataPayload(response, defaultAdminUsers);
};

export const fetchAdminUserDetails = async (token, userId) => {
  const response = await Axios.get(`${ADMIN_BASE_URL}/users/${userId}`, {
    headers: getAuthHeaders(token),
    withCredentials: true,
  });

  return response?.data?.data || null;
};

export const createAdminUser = async (token, payload) => {
  const response = await Axios.post(`${ADMIN_BASE_URL}/users`, payload, {
    headers: getAuthHeaders(token),
    withCredentials: true,
  });

  return response?.data;
};

export const fetchAdminCities = async (token) => {
  const response = await Axios.get(`${CITY_BASE_URL}`, {
    headers: getAuthHeaders(token),
    withCredentials: true,
  });

  return getDataPayload(response, defaultAdminLookupList);
};

export const fetchAdminCurrencies = async (token) => {
  const response = await Axios.get(`${CURRENCY_BASE_URL}`, {
    headers: getAuthHeaders(token),
    withCredentials: true,
  });

  return getDataPayload(response, defaultAdminLookupList);
};

export const fetchAdminSubcategories = async (token) => {
  const response = await Axios.get(`${CATEGORIES_BASE_URL}/subcategory`, {
    headers: getAuthHeaders(token),
    withCredentials: true,
  });

  return getDataPayload(response, defaultAdminLookupList);
};

export const fetchAdminSubdomains = async (token, params = {}) => {
  const response = await Axios.get(`${DOMAIN_BASE_URL}/subdomain`, {
    headers: getAuthHeaders(token),
    params,
    withCredentials: true,
  });

  return response?.data?.data || defaultAdminLookupList;
};

export const updateAdminUserAccess = async (token, userId, action, reason) => {
  const response = await Axios.patch(
    `${ADMIN_BASE_URL}/users/${userId}/access`,
    {
      action,
      ...(reason ? { reason } : {}),
    },
    {
      headers: getAuthHeaders(token),
      withCredentials: true,
    },
  );

  return response?.data?.data || null;
};

export const updateAdminUserProfile = async (token, userId, payload) => {
  const response = await Axios.patch(
    `${ADMIN_BASE_URL}/users/${userId}/profile`,
    payload,
    {
      headers: getAuthHeaders(token),
      withCredentials: true,
    },
  );

  return response?.data?.data || null;
};

export const createAdminStore = async (token, payload) => {
  const response = await Axios.post(`${STORE_BASE_URL}`, payload, {
    headers: getAuthHeaders(token),
    withCredentials: true,
  });

  return response?.data?.data || null;
};

export const updateStoreRecord = async (token, storeId, payload) => {
  const response = await Axios.put(`${STORE_BASE_URL}/${storeId}`, payload, {
    headers: getAuthHeaders(token),
    withCredentials: true,
  });

  return response?.data?.data || null;
};

export const uploadStoreAsset = async (token, file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await Axios.post(`${STORE_BASE_URL}/upload`, formData, {
    headers: {
      ...getAuthHeaders(token),
      "Content-Type": "multipart/form-data",
    },
    withCredentials: true,
  });

  return response?.data?.data?.url || null;
};

export const fetchAdminWithdrawals = async (token, params = {}) => {
  const response = await Axios.get(`${ADMIN_BASE_URL}/withdrawals`, {
    headers: getAuthHeaders(token),
    params,
    withCredentials: true,
  });

  return getDataPayload(response, defaultAdminWithdrawals);
};

export const reviewAdminWithdrawal = async (token, withdrawalId, payload) => {
  const response = await Axios.patch(
    `${ADMIN_BASE_URL}/withdrawals/${withdrawalId}/review`,
    payload,
    {
      headers: getAuthHeaders(token),
      withCredentials: true,
    },
  );

  return response?.data?.data || null;
};

export const fetchAdminActivities = async (token, params = {}) => {
  const response = await Axios.get(`${ADMIN_BASE_URL}/activities`, {
    headers: getAuthHeaders(token),
    params,
    withCredentials: true,
  });

  return getDataPayload(response, defaultAdminActivities);
};

export const fetchAdminServiceAnalytics = async (
  token,
  { service, months = 6 } = {},
) => {
  const response = await Axios.get(`${ADMIN_BASE_URL}/service-analytics`, {
    headers: getAuthHeaders(token),
    params: {
      ...(service ? { service } : {}),
      months,
    },
    withCredentials: true,
  });

  return getDataPayload(response, defaultAdminServiceAnalytics);
};

export const fetchAdminSalesReport = async (token, { months = 6 } = {}) => {
  const response = await Axios.get(`${ADMIN_BASE_URL}/sales-report`, {
    headers: getAuthHeaders(token),
    params: { months },
    withCredentials: true,
  });

  return getDataPayload(response, defaultAdminSalesReport);
};

export const fetchAdminFoodOrders = async (token, params = {}) => {
  const response = await Axios.get(`${ADMIN_BASE_URL}/food-orders`, {
    headers: getAuthHeaders(token),
    params,
    withCredentials: true,
  });

  return getDataPayload(response, defaultAdminFoodOrders);
};

export const fetchAdminOrders = async (token, params = {}) => {
  const response = await Axios.get(`${ADMIN_BASE_URL}/orders`, {
    headers: getAuthHeaders(token),
    params,
    withCredentials: true,
  });

  return getDataPayload(response, defaultAdminOrders);
};

export const fetchAdminDeliveryOrders = async (token, params = {}) => {
  const response = await Axios.get(`${ADMIN_BASE_URL}/orders/delivery`, {
    headers: getAuthHeaders(token),
    params,
    withCredentials: true,
  });

  return getDataPayload(response, defaultAdminDeliveryOrders);
};

export const updateAdminDeliveryOrder = async (token, orderId, payload) => {
  const response = await Axios.patch(
    `${ADMIN_BASE_URL}/orders/${orderId}/delivery`,
    payload,
    {
      headers: getAuthHeaders(token),
      withCredentials: true,
    },
  );

  return response?.data?.data || null;
};

export const fetchAdminRefunds = async (token, params = {}) => {
  const response = await Axios.get(`${ADMIN_BASE_URL}/refunds`, {
    headers: getAuthHeaders(token),
    params,
    withCredentials: true,
  });

  return getDataPayload(response, defaultAdminRefunds);
};

export const createAdminRefund = async (token, payload) => {
  const response = await Axios.post(`${ADMIN_BASE_URL}/refunds`, payload, {
    headers: getAuthHeaders(token),
    withCredentials: true,
  });

  return response?.data?.data || null;
};

export const updateAdminRefund = async (token, refundId, payload) => {
  const response = await Axios.patch(
    `${ADMIN_BASE_URL}/refunds/${refundId}`,
    payload,
    {
      headers: getAuthHeaders(token),
      withCredentials: true,
    },
  );

  return response?.data?.data || null;
};

export const fetchAdminRiskMonitoring = async (token, params = {}) => {
  const response = await Axios.get(`${ADMIN_BASE_URL}/risk-monitoring`, {
    headers: getAuthHeaders(token),
    params,
    withCredentials: true,
  });

  return getDataPayload(response, defaultAdminRiskMonitoring);
};

export const fetchAdminApprovalRequests = async (token, params = {}) => {
  const response = await Axios.get(`${ADMIN_BASE_URL}/approval-requests`, {
    headers: getAuthHeaders(token),
    params,
    withCredentials: true,
  });

  return getDataPayload(response, defaultAdminApprovalRequests);
};

export const createAdminApprovalRequest = async (token, payload) => {
  const response = await Axios.post(`${ADMIN_BASE_URL}/approval-requests`, payload, {
    headers: getAuthHeaders(token),
    withCredentials: true,
  });

  return response?.data?.data || null;
};

export const decideAdminApprovalRequest = async (token, approvalRequestId, payload) => {
  const response = await Axios.post(
    `${ADMIN_BASE_URL}/approval-requests/${approvalRequestId}/decision`,
    payload,
    {
      headers: getAuthHeaders(token),
      withCredentials: true,
    },
  );

  return response?.data?.data || null;
};

export const fetchStoreProducts = async (token, storeId, params = {}) => {
  const response = await Axios.get(
    `${PRODUCT_BASE_URL}/retailer/store/${storeId}`,
    {
      headers: getAuthHeaders(token),
      params,
      withCredentials: true,
    },
  );

  return response?.data?.data || defaultStoreProducts;
};

export const fetchAdminProfitability = async (
  token,
  { months = 6 } = {},
) => {
  const response = await Axios.get(`${ADMIN_BASE_URL}/profitability`, {
    headers: getAuthHeaders(token),
    params: { months },
    withCredentials: true,
  });

  return getDataPayload(response, defaultAdminProfitability);
};

export const fetchAdminPayouts = async (token, params = {}) => {
  const response = await Axios.get(`${ADMIN_BASE_URL}/payouts`, {
    headers: getAuthHeaders(token),
    params,
    withCredentials: true,
  });

  return getDataPayload(response, defaultAdminPayouts);
};

export const fetchAdminFinanceExport = async (
  token,
  { type, format = "json", months = 6 } = {},
) => {
  const response = await Axios.get(`${ADMIN_BASE_URL}/finance/exports`, {
    headers: getAuthHeaders(token),
    params: { type, format, months },
    responseType: format === "csv" ? "text" : "json",
    withCredentials: true,
  });

  return format === "csv" ? response?.data || "" : response?.data?.data || null;
};

export const fetchAdminVendorSettlements = async (token, params = {}) => {
  const response = await Axios.get(`${ADMIN_BASE_URL}/vendor-settlements`, {
    headers: getAuthHeaders(token),
    params,
    withCredentials: true,
  });

  return getDataPayload(response, defaultAdminVendorSettlements);
};

export const settleAdminVendorSettlements = async (token, payload = {}) => {
  const response = await Axios.post(
    `${ADMIN_BASE_URL}/vendor-settlements/settle`,
    payload,
    {
      headers: getAuthHeaders(token),
      withCredentials: true,
    },
  );

  return response?.data?.data || null;
};

export const fetchAdminSupportConversations = async (token, params = {}) => {
  const response = await Axios.get(`${ADMIN_BASE_URL}/support/conversations`, {
    headers: getAuthHeaders(token),
    params,
    withCredentials: true,
  });

  return getDataPayload(response, defaultAdminSupportConversations);
};

export const fetchAdminSupportTickets = async (token, params = {}) => {
  const response = await Axios.get(`${ADMIN_BASE_URL}/support/tickets`, {
    headers: getAuthHeaders(token),
    params,
    withCredentials: true,
  });

  return getDataPayload(response, defaultAdminSupportTickets);
};

export const fetchAdminSupportTicketDetails = async (token, ticketId) => {
  const response = await Axios.get(`${ADMIN_BASE_URL}/support/tickets/${ticketId}`, {
    headers: getAuthHeaders(token),
    withCredentials: true,
  });

  return response?.data?.data || null;
};

export const updateAdminSupportTicket = async (token, ticketId, payload) => {
  const response = await Axios.patch(
    `${ADMIN_BASE_URL}/support/tickets/${ticketId}`,
    payload,
    {
      headers: getAuthHeaders(token),
      withCredentials: true,
    },
  );

  return response?.data?.data || null;
};

export const fetchAdminSupportMessages = async (
  token,
  conversationId,
  params = {},
) => {
  const response = await Axios.get(
    `${ADMIN_BASE_URL}/support/conversations/${conversationId}/messages`,
    {
      headers: getAuthHeaders(token),
      params,
      withCredentials: true,
    },
  );

  return getDataPayload(response, defaultAdminSupportMessages);
};

export const sendAdminSupportMessage = async (
  token,
  conversationId,
  payload,
) => {
  const response = await Axios.post(
    `${ADMIN_BASE_URL}/support/conversations/${conversationId}/messages`,
    payload,
    {
      headers: getAuthHeaders(token),
      withCredentials: true,
    },
  );

  return response?.data?.data || null;
};

export const markAdminSupportConversationRead = async (token, conversationId) => {
  const response = await Axios.patch(
    `${ADMIN_BASE_URL}/support/conversations/${conversationId}/read`,
    {},
    {
      headers: getAuthHeaders(token),
      withCredentials: true,
    },
  );

  return response?.data?.data || null;
};

export const fetchAdminNotificationFeed = async (token, params = {}) => {
  const response = await Axios.get(`${ADMIN_BASE_URL}/notifications/feed`, {
    headers: getAuthHeaders(token),
    params,
    withCredentials: true,
  });

  return getDataPayload(response, defaultAdminNotificationFeed);
};

export const markAdminNotificationRead = async (token, notificationId) => {
  const response = await Axios.patch(
    `${ADMIN_BASE_URL}/notifications/${notificationId}/read`,
    {},
    {
      headers: getAuthHeaders(token),
      withCredentials: true,
    },
  );

  return response?.data?.data || null;
};

export const markAdminNotificationsRead = async (token, ids = []) => {
  const response = await Axios.patch(
    `${ADMIN_BASE_URL}/notifications/read`,
    { ids },
    {
      headers: getAuthHeaders(token),
      withCredentials: true,
    },
  );

  return response?.data?.data || null;
};

export const fetchAdminStores = async (token, params = {}) => {
  const response = await Axios.get(`${ADMIN_BASE_URL}/stores`, {
    headers: getAuthHeaders(token),
    params,
    withCredentials: true,
  });

  return getDataPayload(response, defaultAdminStores);
};

export const fetchAdminDomains = async (token) => {
  const response = await Axios.get(`${ADMIN_BASE_URL}/domains`, {
    headers: getAuthHeaders(token),
    withCredentials: true,
  });

  return getDataPayload(response, defaultAdminDomains);
};

export const createAdminDomain = async (token, payload) => {
  const response = await Axios.post(`${ADMIN_BASE_URL}/domains`, payload, {
    headers: getAuthHeaders(token),
    withCredentials: true,
  });
  return response?.data?.data || null;
};

export const updateAdminDomain = async (token, id, payload) => {
  const response = await Axios.put(`${ADMIN_BASE_URL}/domains/${id}`, payload, {
    headers: getAuthHeaders(token),
    withCredentials: true,
  });
  return response?.data?.data || null;
};

export const deleteAdminDomain = async (token, id) => {
  const response = await Axios.delete(`${ADMIN_BASE_URL}/domains/${id}`, {
    headers: getAuthHeaders(token),
    withCredentials: true,
  });
  return response?.data?.data || null;
};

export const createAdminDomainCategory = async (token, domainId, payload) => {
  const response = await Axios.post(
    `${ADMIN_BASE_URL}/domains/${domainId}/categories`,
    payload,
    {
      headers: getAuthHeaders(token),
      withCredentials: true,
    },
  );
  return response?.data?.data || null;
};

export const updateAdminDomainCategory = async (token, categoryId, payload) => {
  const response = await Axios.put(
    `${ADMIN_BASE_URL}/domains/categories/${categoryId}`,
    payload,
    {
      headers: getAuthHeaders(token),
      withCredentials: true,
    },
  );
  return response?.data?.data || null;
};

export const deleteAdminDomainCategory = async (token, categoryId) => {
  const response = await Axios.delete(
    `${ADMIN_BASE_URL}/domains/categories/${categoryId}`,
    {
      headers: getAuthHeaders(token),
      withCredentials: true,
    },
  );
  return response?.data?.data || null;
};

export const fetchStoreCollections = async (token, storeId) => {
  const response = await Axios.get(`${PRODUCT_BASE_URL}/collection/store/${storeId}`, {
    headers: getAuthHeaders(token),
    withCredentials: true,
  });

  return response?.data?.data || defaultAdminLookupList;
};

export const createStoreCollection = async (token, payload) => {
  const response = await Axios.post(`${PRODUCT_BASE_URL}/collection`, payload, {
    headers: getAuthHeaders(token),
    withCredentials: true,
  });

  return response?.data?.data || null;
};

export const fetchAdminStoreDetails = async (token, storeId) => {
  const response = await Axios.get(`${ADMIN_BASE_URL}/stores/${storeId}`, {
    headers: getAuthHeaders(token),
    withCredentials: true,
  });

  return getDataPayload(response, defaultAdminStoreDetails);
};

export const reviewAdminStore = async (token, storeId, payload) => {
  const response = await Axios.patch(
    `${ADMIN_BASE_URL}/stores/${storeId}/review`,
    payload,
    {
      headers: getAuthHeaders(token),
      withCredentials: true,
    },
  );

  return response?.data?.data || null;
};

export const deleteAdminStore = async (token, storeId) => {
  const response = await Axios.delete(`${ADMIN_BASE_URL}/stores/${storeId}`, {
    headers: getAuthHeaders(token),
    withCredentials: true,
  });

  return response?.data?.data || null;
};

export const fetchAdminProducts = async (token, params = {}) => {
  const response = await Axios.get(`${ADMIN_BASE_URL}/products`, {
    headers: getAuthHeaders(token),
    params,
    withCredentials: true,
  });

  return getDataPayload(response, defaultAdminProducts);
};

export const fetchAdminProductDetails = async (token, productId) => {
  const response = await Axios.get(`${ADMIN_BASE_URL}/products/${productId}`, {
    headers: getAuthHeaders(token),
    withCredentials: true,
  });

  return response?.data?.data || null;
};

export const uploadRetailerProductImage = async (token, file) => {
  const formData = new FormData();
  formData.append("image", file);

  const response = await Axios.post(`${PRODUCT_BASE_URL}/retailer/upload`, formData, {
    headers: {
      ...getAuthHeaders(token),
      "Content-Type": "multipart/form-data",
    },
    withCredentials: true,
  });

  return response?.data?.data?.url || null;
};

export const createRetailerProduct = async (token, payload) => {
  const response = await Axios.post(`${PRODUCT_BASE_URL}/retailer`, payload, {
    headers: getAuthHeaders(token),
    withCredentials: true,
  });

  return response?.data?.data || null;
};

export const updateRetailerProduct = async (token, productId, payload) => {
  const response = await Axios.put(
    `${PRODUCT_BASE_URL}/retailer/${productId}`,
    payload,
    {
      headers: getAuthHeaders(token),
      withCredentials: true,
    },
  );

  return response?.data?.data || null;
};

export const updateAdminProductStatus = async (token, productId, action) => {
  const response = await Axios.patch(
    `${ADMIN_BASE_URL}/products/${productId}/status`,
    { action },
    {
      headers: getAuthHeaders(token),
      withCredentials: true,
    },
  );

  return response?.data?.data || null;
};

export const deleteAdminProduct = async (token, productId) => {
  const response = await Axios.delete(`${ADMIN_BASE_URL}/products/${productId}`, {
    headers: getAuthHeaders(token),
    withCredentials: true,
  });

  return response?.data?.data || null;
};

export const getAuditLogs = async (token, params = {}) => {
  try {
    const response = await Axios.get(`${ADMIN_BASE_URL}/audit-logs`, {
      params,
      headers: getAuthHeaders(token),
    });
    return normalizeAuditLogsResponse(response.data, params);
  } catch (error) {
    return {
      success: false,
      message: error?.response?.data?.message || "Failed to fetch audit logs",
      data: defaultAdminAuditLogs,
    };
  }
};

export const fetchAdminMarketing = async (token, params = {}) => {
  const response = await Axios.get(`${ADMIN_BASE_URL}/marketing`, {
    headers: getAuthHeaders(token),
    params,
    withCredentials: true,
  });

  return normalizeMarketingResponse(response?.data);
};

export const createAdminMarketing = async (token, payload) => {
  const response = await Axios.post(`${ADMIN_BASE_URL}/marketing`, payload, {
    headers: getAuthHeaders(token),
    withCredentials: true,
  });

  return normalizeMarketingItem(response?.data?.data || {});
};

export const updateAdminMarketing = async (token, marketingId, payload) => {
  const response = await Axios.put(
    `${ADMIN_BASE_URL}/marketing/${marketingId}`,
    payload,
    {
      headers: getAuthHeaders(token),
      withCredentials: true,
    },
  );

  return normalizeMarketingItem(response?.data?.data || {});
};

export const deleteAdminMarketing = async (token, marketingId) => {
  const response = await Axios.delete(`${ADMIN_BASE_URL}/marketing/${marketingId}`, {
    headers: getAuthHeaders(token),
    withCredentials: true,
  });

  return normalizeMarketingItem(response?.data?.data || {});
};

export const fetchAdminMediaModeration = async (token) => {
  const response = await Axios.get(`${ADMIN_BASE_URL}/media/moderation`, {
    headers: getAuthHeaders(token),
    withCredentials: true,
  });

  return getDataPayload(response, defaultAdminMediaModeration);
};

export const moderateAdminMediaItem = async (
  token,
  source,
  mediaId,
  payload,
) => {
  const response = await Axios.patch(
    `${ADMIN_BASE_URL}/media/moderation/${source}/${mediaId}`,
    payload,
    {
      headers: getAuthHeaders(token),
      withCredentials: true,
    },
  );

  return response?.data?.data || null;
};

export const fetchAdminReviewModeration = async (token, params = {}) => {
  const response = await Axios.get(`${ADMIN_BASE_URL}/reviews/moderation`, {
    headers: getAuthHeaders(token),
    params,
    withCredentials: true,
  });

  return getDataPayload(response, defaultAdminReviewModeration);
};

export const fetchAdminReviewModerationDetails = async (token, reviewId) => {
  const response = await Axios.get(`${ADMIN_BASE_URL}/reviews/moderation/${reviewId}`, {
    headers: getAuthHeaders(token),
    withCredentials: true,
  });

  return response?.data?.data || null;
};

export const moderateAdminReview = async (token, reviewId, payload) => {
  const response = await Axios.patch(
    `${ADMIN_BASE_URL}/reviews/moderation/${reviewId}`,
    payload,
    {
      headers: getAuthHeaders(token),
      withCredentials: true,
    },
  );

  return response?.data?.data || null;
};

export const updateAdminProductBoosting = async (token, productId, payload) => {
  const response = await Axios.patch(
    `${ADMIN_BASE_URL}/products/${productId}/boosting`,
    payload,
    {
      headers: getAuthHeaders(token),
      withCredentials: true,
    },
  );

  return response?.data?.data || null;
};

export const updateAdminMarketingPayoutStatus = async (
  token,
  marketingId,
  payload,
) => {
  const response = await Axios.patch(
    `${ADMIN_BASE_URL}/marketing/${marketingId}/payout-status`,
    payload,
    {
      headers: getAuthHeaders(token),
      withCredentials: true,
    },
  );

  return normalizeMarketingItem(response?.data?.data || {});
};

export const fetchAdminCouponMonitoring = async (token, params = {}) => {
  const response = await Axios.get(`${ADMIN_BASE_URL}/coupons/monitoring`, {
    headers: getAuthHeaders(token),
    params,
    withCredentials: true,
  });

  return getDataPayload(response, defaultAdminCouponMonitoring);
};

export const fetchAdminFeatureFlags = async (token, params = {}) => {
  const response = await Axios.get(`${ADMIN_BASE_URL}/settings/feature-flags`, {
    headers: getAuthHeaders(token),
    params,
    withCredentials: true,
  });

  return normalizeFeatureFlagsResponse(
    getDataPayload(response, defaultAdminFeatureFlags),
  );
};

export const saveAdminFeatureFlags = async (
  token,
  nextFlags = [],
  previousFlags = [],
) => {
  const previousById = new Map(
    (previousFlags || [])
      .filter((item) => item?.id !== null && item?.id !== undefined)
      .map((item) => [String(item.id), item]),
  );

  for (const flag of nextFlags || []) {
    const previous = previousById.get(String(flag.id));
    if (!previous) {
      continue;
    }

    if (Boolean(previous.enabled) === Boolean(flag.enabled)) {
      continue;
    }

    await Axios.patch(
      `${ADMIN_BASE_URL}/settings/feature-flags/${flag.id}/toggle`,
      {
        is_enabled: Boolean(flag.enabled),
        notes: flag.notes || null,
      },
      {
        headers: getAuthHeaders(token),
        withCredentials: true,
      },
    );
  }

  return fetchAdminFeatureFlags(token, { page: 1, limit: 100 });
};

export const fetchAdminPrivacyRequests = async (token, params = {}) => {
  const response = await Axios.get(`${ADMIN_BASE_URL}/settings/privacy-requests`, {
    headers: getAuthHeaders(token),
    params,
    withCredentials: true,
  });

  return normalizePrivacyRequestResponse(
    getDataPayload(response, defaultAdminPrivacyQueue),
  );
};

export const updateAdminPrivacyRequest = async (token, requestId, payload) => {
  const response = await Axios.patch(
    `${ADMIN_BASE_URL}/settings/privacy-requests/${requestId}`,
    payload,
    {
      headers: getAuthHeaders(token),
      withCredentials: true,
    },
  );

  return normalizePrivacyRequestRecord(response?.data?.data || {});
};

export const fetchAdminBulkOperationTemplate = async (token, tool) => {
  const response = await Axios.get(`${ADMIN_BASE_URL}/bulk-tools/templates/${tool}`, {
    headers: getAuthHeaders(token),
    withCredentials: true,
  });

  return normalizeBulkToolTemplate(response?.data?.data || { tool });
};

export const fetchAdminBulkToolTemplates = async (token) => {
  const tools = await Promise.all(
    ["products", "inventory", "pricing"].map((tool) =>
      fetchAdminBulkOperationTemplate(token, tool),
    ),
  );

  return {
    tools,
  };
};

export const fetchAdminBulkOperations = async (token, params = {}) => {
  const response = await Axios.get(`${ADMIN_BASE_URL}/bulk-tools/operations`, {
    headers: getAuthHeaders(token),
    params,
    withCredentials: true,
  });

  return normalizeBulkOperationsResponse(
    getDataPayload(response, defaultAdminBulkOperations),
  );
};

export const previewAdminBulkOperation = async (token, payload) => {
  const formData = new FormData();
  formData.append("tool", payload.tool);
  if (payload.file) {
    formData.append("file", payload.file);
  } else {
    formData.append("csv_content", payload.csv_content);
  }
  if (payload.file_name) {
    formData.append("file_name", payload.file_name);
  }

  const response = await Axios.post(`${ADMIN_BASE_URL}/bulk-tools/parse`, formData, {
    headers: getAuthHeaders(token),
    withCredentials: true,
  });

  return response?.data?.data || null;
};

export const applyAdminBulkOperation = async (token, payload) => {
  const formData = new FormData();
  formData.append("tool", payload.tool);
  if (payload.file) {
    formData.append("file", payload.file);
  } else {
    formData.append("csv_content", payload.csv_content);
  }
  if (payload.file_name) {
    formData.append("file_name", payload.file_name);
  }

  const response = await Axios.post(`${ADMIN_BASE_URL}/bulk-tools/apply`, formData, {
    headers: getAuthHeaders(token),
    withCredentials: true,
  });

  return normalizeBulkOperationRecord(response?.data?.data || {});
};

export const fetchAdminSettingsDocument = async (token, key, fallback) => {
  const result = await getLegalContent(token, key);
  if (!result?.success) {
    return fallback;
  }

  return parseSettingsDocumentContent(result?.data?.content, fallback);
};

export const updateAdminSettingsDocument = async (
  token,
  key,
  title,
  payload,
) => {
  const result = await updateLegalContent(token, key, {
    title,
    content: JSON.stringify(payload),
  });

  if (!result?.success) {
    return null;
  }

  return parseSettingsDocumentContent(result?.data?.content, payload);
};

export const fetchAdminPrivacyQueue = async (token, params = {}) => {
  const supportData = await fetchAdminSupportTickets(token, {
    page: 1,
    limit: 100,
    status: "all",
    priority: "all",
    assigned: "all",
    ...params,
  });

  return normalizePrivacyQueueResponse(supportData, params);
};

export const getLegalContent = async (token, key = "") => {
  try {
    const url = key ? `${ADMIN_BASE_URL}/legal/${key}` : `${ADMIN_BASE_URL}/legal`;
    const response = await Axios.get(url, {
      headers: getAuthHeaders(token),
    });
    return response.data;
  } catch {
    return { success: false, message: "Failed to fetch legal content" };
  }
};

export const updateLegalContent = async (token, key, payload) => {
  try {
    const response = await Axios.post(
      `${ADMIN_BASE_URL}/legal/${key}`,
      payload,
      {
        headers: getAuthHeaders(token),
      },
    );
    return response.data;
  } catch {
    return { success: false, message: "Failed to update legal content" };
  }
};

// --- Administrative Product & Category Management ---

export const createAdminProduct = async (token, payload) => {
  const response = await Axios.post(`${ADMIN_BASE_URL}/products`, payload, {
    headers: getAuthHeaders(token),
    withCredentials: true,
  });
  return response?.data;
};

export const fetchSubdomainCategoryHierarchy = async (token, subdomainId) => {
  const response = await Axios.get(
    `${ADMIN_BASE_URL}/domains/categories/${subdomainId}/hierarchy`,
    {
      headers: getAuthHeaders(token),
      withCredentials: true,
    },
  );
  return response?.data;
};

// Main Categories (Level 1)
export const fetchAdminMainCategories = async (token, params = {}) => {
  const response = await Axios.get(`${ADMIN_BASE_URL}/categories/main`, {
    params,
    headers: getAuthHeaders(token),
    withCredentials: true,
  });
  return response?.data;
};

export const createAdminMainCategory = async (token, data) => {
  const response = await Axios.post(`${ADMIN_BASE_URL}/categories/main`, data, {
    headers: getAuthHeaders(token),
    withCredentials: true,
  });
  return response?.data;
};

export const updateAdminMainCategory = async (token, id, data) => {
  const response = await Axios.put(
    `${ADMIN_BASE_URL}/categories/main/${id}`,
    data,
    {
      headers: getAuthHeaders(token),
      withCredentials: true,
    },
  );
  return response?.data;
};

export const deleteAdminMainCategory = async (token, id) => {
  const response = await Axios.delete(`${ADMIN_BASE_URL}/categories/main/${id}`, {
    headers: getAuthHeaders(token),
    withCredentials: true,
  });
  return response?.data;
};

// Categories (Level 2)
export const fetchAdminCategories = async (token, mainId, params = {}) => {
  const response = await Axios.get(`${ADMIN_BASE_URL}/categories/secondary`, {
    params: { mainId, ...params },
    headers: getAuthHeaders(token),
    withCredentials: true,
  });
  return response?.data;
};

export const createAdminCategory = async (token, data) => {
  const response = await Axios.post(
    `${ADMIN_BASE_URL}/categories/secondary`,
    data,
    {
      headers: getAuthHeaders(token),
      withCredentials: true,
    },
  );
  return response?.data;
};

export const updateAdminCategory = async (token, id, data) => {
  const response = await Axios.put(
    `${ADMIN_BASE_URL}/categories/secondary/${id}`,
    data,
    {
      headers: getAuthHeaders(token),
      withCredentials: true,
    },
  );
  return response?.data;
};

export const deleteAdminCategory = async (token, id) => {
  const response = await Axios.delete(
    `${ADMIN_BASE_URL}/categories/secondary/${id}`,
    {
      headers: getAuthHeaders(token),
      withCredentials: true,
    },
  );
  return response?.data;
};

// Subcategories (Level 3)
export const fetchAdminSubcategoriesTertiary = async (token, categoryId, params = {}) => {
  const response = await Axios.get(`${ADMIN_BASE_URL}/categories/tertiary`, {
    params: { categoryId, ...params },
    headers: getAuthHeaders(token),
    withCredentials: true,
  });
  return response?.data;
};

export const createAdminSubcategory = async (token, data) => {
  const response = await Axios.post(
    `${ADMIN_BASE_URL}/categories/tertiary`,
    data,
    {
      headers: getAuthHeaders(token),
      withCredentials: true,
    },
  );
  return response?.data;
};

export const updateAdminSubcategory = async (token, id, data) => {
  const response = await Axios.put(
    `${ADMIN_BASE_URL}/categories/tertiary/${id}`,
    data,
    {
      headers: getAuthHeaders(token),
      withCredentials: true,
    },
  );
  return response?.data;
};

export const deleteAdminSubcategory = async (token, id) => {
  const response = await Axios.delete(
    `${ADMIN_BASE_URL}/categories/tertiary/${id}`,
    {
      headers: getAuthHeaders(token),
      withCredentials: true,
    },
  );
  return response?.data;
};
