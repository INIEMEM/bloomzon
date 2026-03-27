import React, { useContext, useEffect, useMemo, useState } from "react";
import Axios from "axios";
import { Input, Select, Space, Table, Tag, message } from "antd";
import UserMatrxs from "../../Components/UserMatrixs/UserMatrxs";
import { MainContext } from "../../Context/Context";
import { ADMIN_BASE_URL, getAuthHeaders } from "../../api/config";

const { Search } = Input;

const OrdersPage = () => {
  const { token } = useContext(MainContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState({
    total: 0,
    pending: 0,
    processing: 0,
    completed: 0,
    filtered: 0,
  });
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0,
  });

  const fetchOrders = async ({
    page = pagination.current,
    pageSize = pagination.pageSize,
    nextFilters = filters,
  } = {}) => {
    try {
      setLoading(true);
      const response = await Axios.get(`${ADMIN_BASE_URL}/orders`, {
        headers: getAuthHeaders(token),
        params: {
          page,
          limit: pageSize,
          search: nextFilters.search || undefined,
          status: nextFilters.status || "all",
        },
      });

      const data = response?.data?.data || {};
      setOrders(data.items || []);
      setSummary(
        data.summary || {
          total: 0,
          pending: 0,
          processing: 0,
          completed: 0,
          filtered: 0,
        },
      );
      setPagination({
        current: data.pagination?.page || page,
        pageSize: data.pagination?.limit || pageSize,
        total: data.pagination?.total || 0,
      });
    } catch (error) {
      message.error(
        error?.response?.data?.message || "Failed to fetch admin orders.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrders({ page: 1, pageSize: 20 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const columns = useMemo(
    () => [
      {
        title: "Order",
        key: "order",
        render: (_, record) => (
          <div>
            <div style={{ fontWeight: 600 }}>{record.orderNumber}</div>
            <div style={{ fontSize: 12, color: "#666" }}>
              {record.trackingId || "No tracking ID"}
            </div>
          </div>
        ),
      },
      {
        title: "Customer",
        key: "customer",
        render: (_, record) => (
          <div>
            <div>{record.customer?.name || "N/A"}</div>
            <div style={{ fontSize: 12, color: "#666" }}>
              {record.customer?.email || "No email"}
            </div>
          </div>
        ),
      },
      {
        title: "Delivery",
        key: "delivery",
        render: (_, record) =>
          record.delivery?.city
            ? `${record.delivery.city}${record.delivery.status ? ` • ${record.delivery.status}` : ""}`
            : record.delivery?.status || "N/A",
      },
      {
        title: "Total",
        key: "total",
        render: (_, record) =>
          `${record.currencyCode || ""} ${Number(record.totalAmount || 0).toLocaleString()}`,
      },
      {
        title: "Order Status",
        key: "order_status",
        render: (_, record) => {
          const colorMap = {
            pending: "gold",
            processing: "blue",
            completed: "green",
            shipped: "cyan",
            cancelled: "red",
            refunding: "orange",
            refunded: "volcano",
          };

          return (
            <Tag color={colorMap[record.orderStatus] || "default"}>
              {String(record.orderStatus || "unknown").toUpperCase()}
            </Tag>
          );
        },
      },
      {
        title: "Payment",
        key: "payment_status",
        render: (_, record) => (
          <Tag color={record.paymentStatus === "paid" ? "green" : "default"}>
            {String(record.paymentStatus || "unknown").toUpperCase()}
          </Tag>
        ),
      },
      {
        title: "Created",
        key: "createdAt",
        render: (_, record) =>
          record.createdAt ? new Date(record.createdAt).toLocaleString() : "N/A",
      },
    ],
    [],
  );

  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ marginBottom: 20 }}>Orders</h1>

      <div className="flex" style={{ gap: 20, marginBottom: 20, flexWrap: "wrap" }}>
        <UserMatrxs matrix={summary.total} title="All Orders" border={true} />
        <UserMatrxs matrix={summary.pending} title="Pending Orders" border={true} />
        <UserMatrxs
          matrix={summary.processing}
          title="Processing Orders"
          border={true}
        />
        <UserMatrxs
          matrix={summary.completed}
          title="Completed Orders"
          border={true}
        />
      </div>

      <div className="flex flex-align" style={{ gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
        <Search
          allowClear
          value={filters.search}
          placeholder="Search order number, tracking ID, or status"
          onChange={(event) =>
            setFilters((currentFilters) => ({
              ...currentFilters,
              search: event.target.value,
            }))
          }
          onSearch={(value) => {
            const nextFilters = { ...filters, search: value.trim() };
            setFilters(nextFilters);
            fetchOrders({ page: 1, nextFilters });
          }}
          style={{ width: 320 }}
        />

        <Select
          value={filters.status}
          style={{ width: 220 }}
          onChange={(value) => {
            const nextFilters = { ...filters, status: value };
            setFilters(nextFilters);
            fetchOrders({ page: 1, nextFilters });
          }}
          options={[
            { value: "all", label: "All Statuses" },
            { value: "pending", label: "Pending" },
            { value: "processing", label: "Processing" },
            { value: "completed", label: "Completed" },
            { value: "shipped", label: "Shipped" },
            { value: "cancelled", label: "Cancelled" },
            { value: "refunding", label: "Refunding" },
            { value: "refunded", label: "Refunded" },
          ]}
        />
      </div>

      <Table
        rowKey="id"
        loading={loading}
        dataSource={orders}
        columns={columns}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          showSizeChanger: true,
        }}
        onChange={(nextPagination) => {
          fetchOrders({
            page: nextPagination.current,
            pageSize: nextPagination.pageSize,
          });
        }}
      />
    </div>
  );
};

export default OrdersPage;
