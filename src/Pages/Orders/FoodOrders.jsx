import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  Descriptions,
  Divider,
  Empty,
  Input,
  Modal,
  Select,
  Space,
  Table,
  Tag,
  Typography,
  message,
} from "antd";

import UserMatrxs from "../../Components/UserMatrixs/UserMatrxs";
import { MainContext } from "../../Context/MainContext";
import { fetchAdminFoodOrders } from "../../api/admin";

const { Search } = Input;
const { Text } = Typography;

const orderStatusColor = {
  pending: "gold",
  processing: "blue",
  completed: "green",
  shipped: "cyan",
  cancelled: "red",
  refunding: "orange",
  refunded: "volcano",
};

const formatCurrency = (value, currencyCode = "") =>
  `${currencyCode || ""} ${Number(value || 0).toLocaleString()}`.trim();

const formatDateTime = (value) => (value ? new Date(value).toLocaleString() : "N/A");

const FoodOrdersPage = () => {
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
  const [detailsModal, setDetailsModal] = useState({
    visible: false,
    order: null,
  });

  const fetchOrders = async ({
    page = pagination.current,
    pageSize = pagination.pageSize,
    nextFilters = filters,
  } = {}) => {
    try {
      setLoading(true);
      const data = await fetchAdminFoodOrders(token, {
        page,
        limit: pageSize,
        search: nextFilters.search || undefined,
        status: nextFilters.status || "all",
      });

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
        error?.response?.data?.message || "Failed to fetch food orders.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleMatrixClick = (status) => {
    const nextFilters = { ...filters, status };
    setFilters(nextFilters);
    fetchOrders({ page: 1, nextFilters });
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
        title: "Restaurant",
        key: "restaurant",
        render: (_, record) => record.restaurantName || "Unknown restaurant",
      },
      {
        title: "Menu",
        key: "menu",
        render: (_, record) => (
          <Space size={[4, 4]} wrap>
            {(record.menu || []).slice(0, 3).map((item) => (
              <Tag key={item.id}>
                {item.name} x{item.quantity}
              </Tag>
            ))}
            {(record.menu || []).length > 3 ? <Tag>+{record.menu.length - 3}</Tag> : null}
          </Space>
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
        title: "Total",
        key: "total",
        render: (_, record) => formatCurrency(record.totalAmount, record.currencyCode),
      },
      {
        title: "Order Status",
        key: "order_status",
        render: (_, record) => (
          <Tag color={orderStatusColor[record.orderStatus] || "default"}>
            {String(record.orderStatus || "unknown").toUpperCase()}
          </Tag>
        ),
      },
      {
        title: "Delivery Time",
        key: "deliveryTime",
        render: (_, record) => formatDateTime(record.deliveryTime),
      },
    ],
    [],
  );

  const activeOrder = detailsModal.order;

  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ marginBottom: 20 }}>Food Orders</h1>

      <div className="flex" style={{ gap: 20, marginBottom: 20, flexWrap: "wrap" }}>
        <UserMatrxs matrix={summary.total} title="All Food Orders" border onClick={() => handleMatrixClick("all")} />
        <UserMatrxs matrix={summary.pending} title="Pending" border onClick={() => handleMatrixClick("pending")} />
        <UserMatrxs matrix={summary.processing} title="Processing" border onClick={() => handleMatrixClick("processing")} />
        <UserMatrxs matrix={summary.completed} title="Completed" border onClick={() => handleMatrixClick("completed")} />
      </div>

      <div className="flex flex-align" style={{ gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
        <Search
          allowClear
          value={filters.search}
          placeholder="Search order, restaurant, customer, or menu"
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
          style={{ width: 340 }}
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
        onRow={(record) => ({
          onClick: () => setDetailsModal({ visible: true, order: record }),
          style: { cursor: "pointer" },
        })}
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

      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <span>Food Order Details</span>
            {activeOrder?.orderNumber ? <Text code>{activeOrder.orderNumber}</Text> : null}
            {activeOrder?.orderStatus ? (
              <Tag color={orderStatusColor[activeOrder.orderStatus] || "default"}>
                {String(activeOrder.orderStatus).toUpperCase()}
              </Tag>
            ) : null}
          </div>
        }
        open={detailsModal.visible}
        onCancel={() => setDetailsModal({ visible: false, order: null })}
        footer={null}
        width={960}
      >
        {activeOrder ? (
          <div style={{ display: "grid", gap: 18 }}>
            <Descriptions bordered size="small" column={2}>
              <Descriptions.Item label="Restaurant">
                {activeOrder.restaurantName || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Delivery Time">
                {formatDateTime(activeOrder.deliveryTime)}
              </Descriptions.Item>
              <Descriptions.Item label="Customer">
                {activeOrder.customer?.name || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Customer Email">
                {activeOrder.customer?.email || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Total">
                {formatCurrency(activeOrder.totalAmount, activeOrder.currencyCode)}
              </Descriptions.Item>
              <Descriptions.Item label="Payment">
                <Tag color={activeOrder.paymentStatus === "paid" ? "green" : "default"}>
                  {String(activeOrder.paymentStatus || "unknown").toUpperCase()}
                </Tag>
              </Descriptions.Item>
            </Descriptions>

            <Divider orientation="left">Menu</Divider>
            <Table
              rowKey="id"
              size="small"
              pagination={false}
              dataSource={activeOrder.menu || []}
              columns={[
                { title: "Menu Item", dataIndex: "name", key: "name" },
                { title: "Qty", dataIndex: "quantity", key: "quantity", align: "right" },
                {
                  title: "Unit Price",
                  key: "unitPrice",
                  align: "right",
                  render: (_, record) =>
                    formatCurrency(record.unitPrice, activeOrder.currencyCode),
                },
                {
                  title: "Gross",
                  key: "grossAmount",
                  align: "right",
                  render: (_, record) =>
                    formatCurrency(record.grossAmount, activeOrder.currencyCode),
                },
                {
                  title: "Status",
                  key: "status",
                  render: (_, record) => (
                    <Tag>{String(record.status || "unknown").toUpperCase()}</Tag>
                  ),
                },
              ]}
              locale={{ emptyText: <Empty description="No menu items returned." /> }}
            />
          </div>
        ) : null}
      </Modal>
    </div>
  );
};

export default FoodOrdersPage;
