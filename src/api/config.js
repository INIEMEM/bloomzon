import axios from "axios";

const trimTrailingSlash = (value) => value.replace(/\/+$/, "");

const ensureApiSuffix = (value) => {
  const trimmed = trimTrailingSlash(value);

  return trimmed.endsWith("/api") ? trimmed : `${trimmed}/api`;
};

const browserProtocol =
  typeof window !== "undefined" && window.location?.protocol
    ? window.location.protocol
    : "http:";

const browserHostname =
  typeof window !== "undefined" && window.location?.hostname
    ? window.location.hostname
    : "localhost";

// Keep local development aligned with the backend port while allowing production
// to override the backend origin through VITE_API_BASE_URL.
const defaultApiBaseUrl = ensureApiSuffix(
  `${browserProtocol}//${browserHostname}:3031`,
);

// The backend now supports session cookies, so allow credentials globally while
// still sending Bearer headers when an access token is available.
axios.defaults.withCredentials = true;

export const API_BASE_URL = ensureApiSuffix(
  import.meta.env.VITE_API_BASE_URL || defaultApiBaseUrl,
);

export const AUTH_BASE_URL = `${API_BASE_URL}/auth`;
export const USER_BASE_URL = `${API_BASE_URL}/user`;
export const ADMIN_BASE_URL = `${API_BASE_URL}/admin`;
export const REGION_BASE_URL = `${API_BASE_URL}/region`;
export const COUNTRY_BASE_URL = `${API_BASE_URL}/country`;
export const STATE_BASE_URL = `${API_BASE_URL}/state`;
export const CITY_BASE_URL = `${API_BASE_URL}/city`;
export const CURRENCY_BASE_URL = `${API_BASE_URL}/currency`;
export const DOMAIN_BASE_URL = `${API_BASE_URL}/domain`;
export const CATEGORIES_BASE_URL = `${API_BASE_URL}/categories`;
export const SHIPPING_BASE_URL = `${API_BASE_URL}/shipping`;
export const PRODUCT_BASE_URL = `${API_BASE_URL}/product`;
export const STORE_BASE_URL = `${API_BASE_URL}/store`;
export const TALENT_BASE_URL = `${API_BASE_URL}/bloomzon-talent`;
export const REGISTRY_BASE_URL = `${API_BASE_URL}/registry-app`;
export const BANNER_BASE_URL = `${API_BASE_URL}/banner`;
export const BLOOMZONLIVE_BASE_URL = `${API_BASE_URL}/bloomzonlive`;

export const cookieSessionToken = "__COOKIE_SESSION__";

export const getAuthHeaders = (token) =>
  token && token !== cookieSessionToken
    ? { Authorization: `Bearer ${token}` }
    : {};

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
