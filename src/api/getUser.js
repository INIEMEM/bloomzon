// api/getUser.js
import axios from 'axios';
import { getAuthHeaders } from "./config";

const normalizeUser = (user = {}) => {
  const firstname = user.firstname || user.first_name || "";
  const lastname = user.lastname || user.last_name || "";
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
    role: user.role || "admin",
  };
};

export const getUser = async (baseUrl, token) => {
  try {
    const response = await axios.get(`${baseUrl}user/profile`, {
      headers: getAuthHeaders(token),
    });
    return normalizeUser(response?.data?.data || {});
  } catch (error) {
    throw new Error('Unauthorized');
  }
};
