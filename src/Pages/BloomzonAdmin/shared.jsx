/* eslint-disable react/prop-types */
import { Alert } from "antd";

export const formatNumber = (value) =>
  new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(
    Number(value || 0),
  );

export const formatCurrency = (value, currency = "USD") =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(Number(value || 0));

export const formatDateTime = (value) =>
  value ? new Date(value).toLocaleString() : "N/A";

export const prettifyKey = (value = "") =>
  String(value)
    .replace(/_/g, " ")
    .replace(/:/g, " / ")
    .replace(/\b\w/g, (match) => match.toUpperCase());

export const statusTagColor = {
  active: "green",
  approved: "green",
  completed: "green",
  completed_with_errors: "orange",
  draft: "default",
  failed: "red",
  flagged: "volcano",
  in_progress: "blue",
  inactive: "red",
  open: "gold",
  paused: "orange",
  pending: "gold",
  processing: "blue",
  refunded: "volcano",
  refunding: "orange",
  rejected: "red",
  resolved: "green",
  scheduled: "blue",
  sent: "default",
  shipped: "cyan",
  suspended: "orange",
  unread: "gold",
};

export const SummaryCard = ({ label, value, helper }) => (
  <div className="admin-kpi">
    <div className="admin-kpi__label">{label}</div>
    <div className="admin-kpi__value">{value}</div>
    <div className="admin-kpi__helper">{helper}</div>
  </div>
);

export const AdminWorkspaceShell = ({
  eyebrow,
  title,
  subtitle,
  actions,
  children,
}) => (
  <div className="admin-workspace">
    <div className="admin-workspace__header">
      <div className="admin-workspace__copy">
        <div className="admin-workspace__eyebrow">{eyebrow}</div>
        <h1 className="admin-workspace__title">{title}</h1>
        <p className="admin-workspace__subtitle">{subtitle}</p>
      </div>
      {actions ? <div className="admin-workspace__actions">{actions}</div> : null}
    </div>
    {children}
  </div>
);

export const DataGapNotice = ({ title = "Known gaps", items = [] }) => {
  if (!items.length) {
    return null;
  }

  return (
    <Alert
      type="info"
      showIcon
      message={title}
      style={{ marginBottom: 18 }}
      description={
        <div style={{ display: "grid", gap: 6 }}>
          {items.map((item) => (
            <div key={item}>{item}</div>
          ))}
        </div>
      }
    />
  );
};

const csvEscape = (value) => {
  const text = String(value ?? "");
  if (/[",\n]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
};

export const downloadCsv = (filename, rows) => {
  if (!Array.isArray(rows) || !rows.length || typeof window === "undefined") {
    return false;
  }

  const headers = Object.keys(rows[0]);
  const lines = [
    headers.join(","),
    ...rows.map((row) => headers.map((header) => csvEscape(row[header])).join(",")),
  ];

  const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
  return true;
};

export const readVersionedState = (key, fallback) => {
  if (typeof window === "undefined") {
    return fallback;
  }

  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) {
      return fallback;
    }

    const parsed = JSON.parse(raw);
    return parsed?.value ?? fallback;
  } catch {
    return fallback;
  }
};

export const writeVersionedState = (key, value) => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    key,
    JSON.stringify({
      version: 1,
      value,
    }),
  );
};
