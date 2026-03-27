const trimTrailingSlash = (value) => value.replace(/\/+$/, "");

const browserProtocol =
  typeof window !== "undefined" && window.location?.protocol
    ? window.location.protocol
    : "http:";

const browserHostname =
  typeof window !== "undefined" && window.location?.hostname
    ? window.location.hostname
    : "localhost";

// Match the backend's local APP_PORT_NUMBER and reuse the current machine host.
const defaultApiBaseUrl = `${browserProtocol}//${browserHostname}:8080/api`;

export const API_BASE_URL = trimTrailingSlash(
  import.meta.env.VITE_API_BASE_URL || defaultApiBaseUrl,
);

export const AUTH_BASE_URL = `${API_BASE_URL}/auth`;
export const USER_BASE_URL = `${API_BASE_URL}/user`;
export const ADMIN_BASE_URL = `${API_BASE_URL}/admin`;
export const REGION_BASE_URL = `${API_BASE_URL}/region`;
export const COUNTRY_BASE_URL = `${API_BASE_URL}/country`;
export const CURRENCY_BASE_URL = `${API_BASE_URL}/currency`;
export const DOMAIN_BASE_URL = `${API_BASE_URL}/domain`;
export const SHIPPING_BASE_URL = `${API_BASE_URL}/shipping`;
export const TALENT_BASE_URL = `${API_BASE_URL}/bloomzon-talent`;
export const REGISTRY_BASE_URL = `${API_BASE_URL}/registry-app`;
export const BANNER_BASE_URL = `${API_BASE_URL}/banner`;
export const BLOOMZONLIVE_BASE_URL = `${API_BASE_URL}/bloomzonlive`;

export const getAuthHeaders = (token) =>
  token ? { Authorization: `Bearer ${token}` } : {};

export const sessionTokenKey = "token";

export const readStoredToken = () => {
  const tokenString = sessionStorage.getItem(sessionTokenKey);

  if (!tokenString) {
    return null;
  }

  try {
    return JSON.parse(tokenString);
  } catch (error) {
    console.error("Failed to parse token:", error);
    sessionStorage.removeItem(sessionTokenKey);
    return null;
  }
};
