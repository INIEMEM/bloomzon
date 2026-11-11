// api/getUser.js
import axios from 'axios';
import { AUTH_BASE_URL, getAuthHeaders } from "./config";

const adminRoleKeywords = [
  "admin",
  "super",
  "superadmin",
  "super_admin",
  "moderator",
  "editor",
  "staff",
  "support",
];

const normalizeRoleValue = (value) => String(value || "").trim().toLowerCase();

const normalizePermissionValue = (value) => String(value || "").trim().toLowerCase();

const normalizePermissionList = (permissions) =>
  (Array.isArray(permissions) ? permissions : [permissions])
    .map(normalizePermissionValue)
    .filter(Boolean);

export const extractUserRoles = (user = {}) => {
  const rawRoles = [
    user.role,
    user.userRole,
    user.user_role,
    user.accountType,
    user.account_type,
    ...(Array.isArray(user.roles) ? user.roles : []),
    ...(Array.isArray(user.permissions) ? user.permissions : []),
  ];

  return [...new Set(rawRoles.map(normalizeRoleValue).filter(Boolean))];
};

export const hasAdminAccess = (user = {}) => {
  if (user?.isAdmin === true || user?.is_admin === true || user?.admin === true) {
    return true;
  }

  return extractUserRoles(user).some((role) =>
    adminRoleKeywords.some((keyword) => role.includes(keyword)),
  );
};

export const extractUserPermissions = (user = {}) => [
  ...new Set(
    (Array.isArray(user.permissions) ? user.permissions : [])
      .map(normalizePermissionValue)
      .filter(Boolean),
  ),
];

export const hasAdminPermission = (user = {}, requiredPermissions, options = {}) => {
  const normalizedRequired = normalizePermissionList(requiredPermissions);

  if (!normalizedRequired.length) {
    return hasAdminAccess(user);
  }

  const availablePermissions = extractUserPermissions(user);

  if (!availablePermissions.length) {
    return options.fallbackToAdmin === false ? false : hasAdminAccess(user);
  }

  const permissionSet = new Set(availablePermissions);
  return normalizedRequired.some((permission) => permissionSet.has(permission));
};

export const hasAnyAdminPermission = (user = {}, requiredPermissions, options = {}) =>
  hasAdminPermission(user, requiredPermissions, options);

export const hasAllAdminPermissions = (user = {}, requiredPermissions, options = {}) => {
  const normalizedRequired = normalizePermissionList(requiredPermissions);

  if (!normalizedRequired.length) {
    return hasAdminAccess(user);
  }

  const availablePermissions = extractUserPermissions(user);

  if (!availablePermissions.length) {
    return options.fallbackToAdmin === false ? false : hasAdminAccess(user);
  }

  const permissionSet = new Set(availablePermissions);
  return normalizedRequired.every((permission) => permissionSet.has(permission));
};

export const adminPermissionGroups = {
  dashboard: ["dashboard:view"],
  access: ["admins:view", "admins:manage"],
  orders: ["orders:view", "orders:manage"],
  users: ["users:view", "users:manage"],
  content: ["products:view", "domains:view"],
  finance: ["finance:view", "finance:manage"],
  reports: ["reports:view", "reports:export"],
  subscriptions: ["subscriptions:view", "subscriptions:manage"],
};

export const getDefaultAdminPath = (user = {}) => {
  if (!hasAdminAccess(user)) {
    return "/";
  }

  if (hasAnyAdminPermission(user, adminPermissionGroups.dashboard)) {
    return "/dashboard/admin-system/overview";
  }

  if (hasAnyAdminPermission(user, adminPermissionGroups.access)) {
    return "/dashboard/admin-system/access";
  }

  if (hasAnyAdminPermission(user, adminPermissionGroups.orders)) {
    return "/dashboard/admin-system/orders";
  }

  if (hasAnyAdminPermission(user, adminPermissionGroups.users)) {
    return "/dashboard/admin-system/users";
  }

  if (hasAnyAdminPermission(user, adminPermissionGroups.finance)) {
    return "/dashboard/finance/payouts";
  }

  if (hasAnyAdminPermission(user, adminPermissionGroups.reports)) {
    return "/dashboard/reports/sales";
  }

  if (hasAnyAdminPermission(user, adminPermissionGroups.content)) {
    return "/dashboard/products";
  }

  return "/dashboard";
};

export const normalizeUser = (user = {}) => {
  const firstname = user.firstname || user.first_name || "";
  const lastname = user.lastname || user.last_name || "";
  const roles = extractUserRoles(user);
  const permissions = extractUserPermissions(user);
  const name =
    user.name ||
    [firstname, lastname].filter(Boolean).join(" ").trim() ||
    user.email ||
    "Admin User";

  return {
    ...user,
    firstname,
    lastname,
    name,
    role: user.role || user.userRole || user.user_role || roles[0] || "",
    roles,
    permissions,
  };
};

export const getUser = async (baseUrl, token) => {
  try {
    const response = await axios.get(`${baseUrl}user/profile`, {
      headers: getAuthHeaders(token),
      withCredentials: true,
    });
    return normalizeUser(response?.data?.data || {});
  } catch {
    throw new Error('Unauthorized');
  }
};

export const updateOwnUserProfile = async (baseUrl, token, payload = {}) => {
  const response = await axios.patch(`${baseUrl}user/update-profile`, payload, {
    headers: getAuthHeaders(token),
    withCredentials: true,
  });

  return normalizeUser(response?.data?.data || {});
};

export const logoutCurrentUser = async (token) => {
  const response = await axios.post(
    `${AUTH_BASE_URL}/logout`,
    {},
    {
      headers: getAuthHeaders(token),
      withCredentials: true,
    },
  );

  return response?.data || { success: true, message: "Logout successful" };
};
