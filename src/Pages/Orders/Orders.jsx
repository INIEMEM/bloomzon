import React, { useContext, useEffect, useMemo, useState } from "react";
import Axios from "axios";
import {
  Alert,
  Button,
  Descriptions,
  Divider,
  Empty,
  Image,
  Input,
  Modal,
  Select,
  Space,
  Table,
  Tag,
  Typography,
  message,
} from "antd";
import { useNavigate } from "react-router-dom";
import UserMatrxs from "../../Components/UserMatrixs/UserMatrxs";
import { MainContext } from "../../Context/MainContext";
import { ADMIN_BASE_URL, getAuthHeaders } from "../../api/config";

const { Search } = Input;
const { Text } = Typography;

const imageFallback =
  "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='0 0 96 96'%3E%3Crect width='96' height='96' rx='10' fill='%23f3f4f6'/%3E%3Cpath d='M25 65h46L58 49 48 60 39 51 25 65Z' fill='%23cbd5e1'/%3E%3Ccircle cx='37' cy='36' r='7' fill='%23cbd5e1'/%3E%3C/svg%3E";

const orderStatusColor = {
  pending: "gold",
  processing: "blue",
  completed: "green",
  shipped: "cyan",
  cancelled: "red",
  refunding: "orange",
  refunded: "volcano",
};

const itemStatusColor = {
  pending: "gold",
  shipped: "blue",
  delivered: "green",
  cancelled: "red",
};

const formatDateTime = (value) =>
  value ? new Date(value).toLocaleString() : "N/A";

const formatCurrency = (value, currencyCode = "") =>
  `${currencyCode || ""} ${Number(value || 0).toLocaleString()}`.trim();

const formatAddress = (delivery = {}) =>
  [
    delivery.address,
    delivery.street,
    delivery.city,
    delivery.postal_code,
    delivery.postalCode,
  ]
    .filter(Boolean)
    .join(", ") || "N/A";

const getOrderItemProductName = (item) =>
  item.productName ||
  item.product_name ||
  item.productInfo?.name ||
  item.product_info?.name ||
  (item.productId || item.product_id || item.productInfo?.id || item.product_info?.id
    ? `Product #${item.productId || item.product_id || item.productInfo?.id || item.product_info?.id}`
    : "Unnamed product");

const getOrderItemUnitPrice = (item) =>
  Number(
    item.unitPrice ??
      item.unit_price ??
      item.pricing?.unit_price ??
      item.productInfo?.base_price ??
      item.product_info?.base_price ??
      0,
  );

const getOrderItemImage = (item) =>
  item.productImage ||
  item.product_image ||
  item.productInfo?.image ||
  item.product_info?.image ||
  item.variantInfo?.image ||
  item.variant_info?.image ||
  null;

const getOrderItemProductCode = (item) =>
  item.productCode ||
  item.product_code ||
  item.productInfo?.product_code ||
  item.product_info?.product_code ||
  "N/A";

const getOrderItemSku = (item) =>
  item.sku ||
  item.variantInfo?.sku ||
  item.variant_info?.sku ||
  "N/A";

const getOrderItemStoreName = (item) =>
  item.storeName ||
  item.store_name ||
  item.storeInfo?.name ||
  item.store_info?.name ||
  "N/A";

const getOrderItemVariantOptions = (item) => {
  const options = item.variantOptions || item.variant_options || item.variantInfo?.options || item.variant_info?.options;

  if (!options || typeof options !== "object" || Array.isArray(options)) {
    return [];
  }

  return Object.entries(options)
    .filter(([, value]) => value !== undefined && value !== null && value !== "")
    .map(([key, value]) => ({
      key,
      value: typeof value === "object" ? JSON.stringify(value) : String(value),
    }));
};

const OrdersPage = ({ title = "Orders", orderType = "all" }) => {
  const { token } = useContext(MainContext);
  const navigate = useNavigate();
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
      const response = await Axios.get(`${ADMIN_BASE_URL}/orders`, {
        headers: getAuthHeaders(token),
        params: {
          page,
          limit: pageSize,
          search: nextFilters.search || undefined,
          status: nextFilters.status || "all",
          type: orderType === "product" ? "product" : undefined,
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
  }, [token, orderType]);

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
        render: (_, record) => (
          <Tag color={orderStatusColor[record.orderStatus] || "default"}>
            {String(record.orderStatus || "unknown").toUpperCase()}
          </Tag>
        ),
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

  const activeOrder = detailsModal.order;
  const orderItems = Array.isArray(activeOrder?.items) ? activeOrder.items : [];
  const orderItemColumns = useMemo(
    () => [
      {
        title: "Product",
        key: "product",
        width: 340,
        render: (_, item) => {
          const itemImage = getOrderItemImage(item);
          const variantOptions = getOrderItemVariantOptions(item);

          return (
            <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <Image
                alt={getOrderItemProductName(item)}
                fallback={imageFallback}
                height={72}
                preview={Boolean(itemImage)}
                src={itemImage || imageFallback}
                style={{
                  border: "1px solid #e5e7eb",
                  borderRadius: 8,
                  objectFit: "cover",
                  background: "#f8fafc",
                }}
                width={72}
              />
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 700, marginBottom: 4 }}>
                  {getOrderItemProductName(item)}
                </div>
                <div style={{ color: "#6b7280", fontSize: 12 }}>
                  Code: {getOrderItemProductCode(item)}
                </div>
                <div style={{ color: "#6b7280", fontSize: 12 }}>
                  SKU: {getOrderItemSku(item)}
                </div>
                {variantOptions.length ? (
                  <Space size={[4, 4]} wrap style={{ marginTop: 6 }}>
                    {variantOptions.map((option) => (
                      <Tag key={`${option.key}-${option.value}`}>
                        {option.key}: {option.value}
                      </Tag>
                    ))}
                  </Space>
                ) : null}
              </div>
            </div>
          );
        },
      },
      {
        title: "Store",
        key: "store",
        render: (_, item) => (
          <div>
            <div>{getOrderItemStoreName(item)}</div>
            <div style={{ color: "#6b7280", fontSize: 12 }}>
              {item.storeInfo?.subdomain || item.store_info?.subdomain || "No service"}
            </div>
          </div>
        ),
      },
      {
        title: "Qty",
        key: "quantity",
        align: "right",
        render: (_, item) => Number(item.quantity || 0).toLocaleString(),
      },
      {
        title: "Unit Price",
        key: "unitPrice",
        align: "right",
        render: (_, item) =>
          formatCurrency(getOrderItemUnitPrice(item), activeOrder?.currencyCode),
      },
      {
        title: "Gross",
        key: "grossAmount",
        align: "right",
        render: (_, item) => {
          const quantity = Number(item.quantity || 0);
          const unitPrice = getOrderItemUnitPrice(item);
          const grossAmount = Number(
            item.grossAmount ??
              item.gross_amount ??
              item.pricing?.gross_amount ??
              quantity * unitPrice,
          );

          return formatCurrency(grossAmount, activeOrder?.currencyCode);
        },
      },
      {
        title: "Status",
        key: "status",
        render: (_, item) => (
          <Tag color={itemStatusColor[item.status] || "default"}>
            {String(item.status || "unknown").toUpperCase()}
          </Tag>
        ),
      },
    ],
    [activeOrder?.currencyCode],
  );

  return (
    <div style={{ padding: 20 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 12,
          alignItems: "flex-start",
          flexWrap: "wrap",
          marginBottom: 16,
        }}
      >
        <h1 style={{ marginBottom: 0 }}>{title}</h1>
        <Button onClick={() => navigate("/dashboard/admin-system/orders")}>
          Open admin orders workflow
        </Button>
      </div>

      <Alert
        style={{ marginBottom: 16 }}
        type="info"
        showIcon
        message="Legacy order view aligned to current workflow"
        description="This page remains a read-heavy order browser. Refund requests, delivery updates, approval actions, and risk monitoring now live in the Admin System orders workspace."
      />

      <div className="flex" style={{ gap: 20, marginBottom: 20, flexWrap: "wrap" }}>
        <UserMatrxs matrix={summary.total} title="All Orders" border={true} onClick={() => handleMatrixClick('all')} />
        <UserMatrxs matrix={summary.pending} title="Pending Orders" border={true} onClick={() => handleMatrixClick('pending')} />
        <UserMatrxs
          matrix={summary.processing}
          title="Processing Orders"
          border={true}
          onClick={() => handleMatrixClick('processing')}
        />
        <UserMatrxs
          matrix={summary.completed}
          title="Completed Orders"
          border={true}
          onClick={() => handleMatrixClick('completed')}
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
        onRow={(record) => ({
          onClick: () => setDetailsModal({ visible: true, order: record }),
          style: { cursor: 'pointer' }
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
            <span>Order Details</span>
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
        width={1100}
      >
        {activeOrder && (
          <div style={{ display: "grid", gap: 18 }}>
            <div
              style={{
                display: "grid",
                gap: 12,
                gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
              }}
            >
              <div style={{ border: "1px solid #e5e7eb", borderRadius: 8, padding: 12 }}>
                <div style={{ color: "#6b7280", fontSize: 12 }}>Total Amount</div>
                <div style={{ fontSize: 20, fontWeight: 700 }}>
                  {formatCurrency(activeOrder.totalAmount, activeOrder.currencyCode)}
                </div>
              </div>
              <div style={{ border: "1px solid #e5e7eb", borderRadius: 8, padding: 12 }}>
                <div style={{ color: "#6b7280", fontSize: 12 }}>Products</div>
                <div style={{ fontSize: 20, fontWeight: 700 }}>
                  {orderItems.length.toLocaleString()}
                </div>
              </div>
              <div style={{ border: "1px solid #e5e7eb", borderRadius: 8, padding: 12 }}>
                <div style={{ color: "#6b7280", fontSize: 12 }}>Payment</div>
                <Tag color={activeOrder.paymentStatus === "paid" ? "green" : "default"}>
                  {String(activeOrder.paymentStatus || "unknown").toUpperCase()}
                </Tag>
              </div>
              <div style={{ border: "1px solid #e5e7eb", borderRadius: 8, padding: 12 }}>
                <div style={{ color: "#6b7280", fontSize: 12 }}>Created</div>
                <div style={{ fontWeight: 600 }}>{formatDateTime(activeOrder.createdAt)}</div>
              </div>
            </div>

            <Descriptions title="Order Information" bordered size="small" column={2}>
              <Descriptions.Item label="Order Number">{activeOrder.orderNumber}</Descriptions.Item>
              <Descriptions.Item label="Tracking ID">{activeOrder.trackingId || "N/A"}</Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={orderStatusColor[activeOrder.orderStatus] || "default"}>
                  {String(activeOrder.orderStatus || "unknown").toUpperCase()}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Total Amount">
                {formatCurrency(activeOrder.totalAmount, activeOrder.currencyCode)}
              </Descriptions.Item>
              <Descriptions.Item label="Payment Status">
                <Tag color={activeOrder.paymentStatus === "paid" ? "green" : "default"}>
                  {String(activeOrder.paymentStatus || "unknown").toUpperCase()}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Created At">
                {formatDateTime(activeOrder.createdAt)}
              </Descriptions.Item>
              <Descriptions.Item label="Updated At">
                {formatDateTime(activeOrder.updatedAt)}
              </Descriptions.Item>
              <Descriptions.Item label="Currency">
                {activeOrder.currencyCode || "N/A"}
              </Descriptions.Item>
            </Descriptions>

            <Divider orientation="left">Customer & Delivery</Divider>
            <Descriptions bordered size="small" column={2}>
              <Descriptions.Item label="Customer">
                {activeOrder.customer?.name || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Customer Email">
                {activeOrder.customer?.email || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Customer Phone">
                {activeOrder.customer?.phone || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Delivery Recipient">
                {activeOrder.delivery?.name || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Delivery Phone">
                {activeOrder.delivery?.phone || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Delivery Address">
                {formatAddress(activeOrder.delivery)}
              </Descriptions.Item>
              <Descriptions.Item label="Delivery Status">
                {activeOrder.delivery?.status || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Delivery City">
                {activeOrder.delivery?.city || "N/A"}
              </Descriptions.Item>
            </Descriptions>

            <Divider orientation="left">
              {orderType === "product" ? "Products In This Order" : "Items In This Order"}
            </Divider>
            {orderItems.length ? (
              <Table
                columns={orderItemColumns}
                dataSource={orderItems}
                pagination={false}
                rowKey={(item, index) => item.id || `${item.productId || item.product_id || "item"}-${index}`}
                scroll={{ x: 980 }}
                size="small"
              />
            ) : (
              <Empty description="No products were returned for this order." />
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default OrdersPage;
