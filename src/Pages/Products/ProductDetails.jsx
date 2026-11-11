/* eslint-disable react/prop-types */
import { useContext, useEffect, useMemo, useState } from "react";
import Axios from "axios";
import {
  Button,
  Card,
  Descriptions,
  Empty,
  Image,
  Popconfirm,
  Space,
  Spin,
  Table,
  Tag,
  message,
} from "antd";
import { useNavigate, useParams } from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts";
import { MainContext } from "../../Context/MainContext";
import { ADMIN_BASE_URL, getAuthHeaders } from "../../api/config";
import {
  fetchAdminCurrencies,
  fetchAdminSubcategories,
  fetchStoreCollections,
  updateRetailerProduct,
} from "../../api/admin";
import { ProductEditorModal } from "../Admin/AdminCatalogModals";

const parseMetadataValue = (value) => {
  if (typeof value !== "string") {
    return value;
  }

  const trimmedValue = value.trim();
  if (!trimmedValue) {
    return value;
  }

  if (
    (trimmedValue.startsWith("[") && trimmedValue.endsWith("]")) ||
    (trimmedValue.startsWith("{") && trimmedValue.endsWith("}"))
  ) {
    try {
      return JSON.parse(trimmedValue);
    } catch {
      return value;
    }
  }

  return value;
};

const formatMetadataLabel = (value = "") =>
  String(value)
    .replace(/_/g, " ")
    .replace(/\b\w/g, (match) => match.toUpperCase());

const isPlainObject = (value) =>
  Boolean(value) && typeof value === "object" && !Array.isArray(value);

const formatCurrency = (value, currency = "USD") =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(Number(value || 0));

const formatMonthLabel = (offsetFromCurrentMonth) => {
  const referenceDate = new Date();
  referenceDate.setDate(1);
  referenceDate.setMonth(referenceDate.getMonth() + offsetFromCurrentMonth);

  return new Intl.DateTimeFormat("en-US", { month: "short" }).format(referenceDate);
};

const getFirstArray = (...values) => {
  for (const value of values) {
    const parsedValue = parseMetadataValue(value);
    if (Array.isArray(parsedValue)) {
      return parsedValue;
    }
  }

  return [];
};

const normalizeNumber = (value) => {
  const normalizedValue = Number(value);
  return Number.isFinite(normalizedValue) ? normalizedValue : 0;
};

const resolveTimestamp = (...values) => {
  for (const value of values) {
    if (value) {
      return value;
    }
  }

  return null;
};

const parseSpecificationsText = (value) =>
  String(value || "")
    .split("\n")
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => {
      const [name, ...rest] = entry.split(":");
      return {
        name: name?.trim(),
        value: rest.join(":").trim(),
      };
    })
    .filter((entry) => entry.name && entry.value);

const statusTagColor = {
  paid: "green",
  pending: "gold",
  processing: "blue",
  completed: "green",
  shipped: "cyan",
  cancelled: "red",
  refunding: "orange",
  refunded: "volcano",
};

const MetadataValue = ({ value, depth = 0 }) => {
  const parsedValue = parseMetadataValue(value);

  if (
    parsedValue === null ||
    parsedValue === undefined ||
    parsedValue === ""
  ) {
    return "N/A";
  }

  if (
    typeof parsedValue === "string" ||
    typeof parsedValue === "number" ||
    typeof parsedValue === "boolean"
  ) {
    return String(parsedValue);
  }

  if (Array.isArray(parsedValue)) {
    if (!parsedValue.length) {
      return "N/A";
    }

    const normalizedItems = parsedValue.map((item) => parseMetadataValue(item));
    const primitiveItems = normalizedItems.filter(
      (item) => !Array.isArray(item) && !isPlainObject(item),
    );

    if (primitiveItems.length === normalizedItems.length) {
      return (
        <Space wrap>
          {primitiveItems.map((item, index) => (
            <Tag key={`${String(item)}-${index}`}>{String(item)}</Tag>
          ))}
        </Space>
      );
    }

    return (
      <div style={{ display: "grid", gap: 8 }}>
        {normalizedItems.map((item, index) => (
          <div
            key={item?.sku || item?.label || item?.name || index}
            style={{
              padding: "10px 12px",
              border: "1px solid #f0f0f0",
              borderRadius: 8,
              background: "#fafafa",
            }}
          >
            <MetadataValue value={item} depth={depth + 1} />
          </div>
        ))}
      </div>
    );
  }

  if (isPlainObject(parsedValue)) {
    return (
      <div style={{ display: "grid", gap: 8 }}>
        {Object.entries(parsedValue).map(([entryKey, entryValue]) => (
          <div
            key={entryKey}
            style={{
              display: "grid",
              gap: 4,
              padding: depth ? 0 : "8px 10px",
              border: depth ? "none" : "1px solid #f0f0f0",
              borderRadius: depth ? 0 : 8,
              background: depth ? "transparent" : "#fafafa",
            }}
          >
            <div style={{ fontWeight: 600 }}>{formatMetadataLabel(entryKey)}</div>
            <div style={{ paddingLeft: depth ? 12 : 0 }}>
              <MetadataValue value={entryValue} depth={depth + 1} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return String(parsedValue);
};

const ProductDetailsPage = () => {
  const { token } = useContext(MainContext);
  const { productId } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editBusy, setEditBusy] = useState(false);
  const [editLookupsLoading, setEditLookupsLoading] = useState(false);
  const [editLookups, setEditLookups] = useState({
    currencies: [],
    subcategories: [],
    collections: [],
  });

  const createdAt = resolveTimestamp(
    product?.createdAt,
    product?.created_at,
    product?.raw?.createdAt,
    product?.raw?.created_at,
  );
  const updatedAt = resolveTimestamp(
    product?.updatedAt,
    product?.updated_at,
    product?.raw?.updatedAt,
    product?.raw?.updated_at,
  );

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await Axios.get(`${ADMIN_BASE_URL}/products/${productId}`, {
        headers: getAuthHeaders(token),
      });
      setProduct(response?.data?.data || null);
    } catch (error) {
      message.error(
        error?.response?.data?.message || "Failed to load product details.",
      );
      navigate("/dashboard/products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productId && token) {
      fetchProduct();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId, token]);

  const mediaColumns = useMemo(
    () => [
      {
        title: "Preview",
        key: "preview",
        render: (_, record) => (
          <Image
            src={record.url}
            alt={record.type || "media"}
            width={70}
            height={70}
            style={{ objectFit: "cover", borderRadius: 8 }}
          />
        ),
      },
      {
        title: "Type",
        dataIndex: "type",
        key: "type",
      },
      {
        title: "URL",
        dataIndex: "url",
        key: "url",
        render: (value) => (
          <a href={value} target="_blank" rel="noreferrer">
            Open media
          </a>
        ),
      },
    ],
    [],
  );

  const optionColumns = useMemo(
    () => [
      {
        title: "Option",
        dataIndex: "name",
        key: "name",
      },
      {
        title: "Values",
        key: "values",
        render: (_, record) =>
          Array.isArray(record.values)
            ? record.values.map((value) => value.value).filter(Boolean).join(", ")
            : "N/A",
      },
    ],
    [],
  );

  const variantColumns = useMemo(
    () => [
      {
        title: "SKU",
        dataIndex: "sku",
        key: "sku",
      },
      {
        title: "Price",
        key: "price",
        render: (_, record) => `$${Number(record.price || 0).toLocaleString()}`,
      },
      {
        title: "Stock",
        dataIndex: "stock",
        key: "stock",
      },
      {
        title: "Status",
        key: "status",
        render: (_, record) =>
          Number(record.status ?? 0) === 1 ? (
            <Tag color="green">ACTIVE</Tag>
          ) : (
            <Tag color="red">INACTIVE</Tag>
          ),
      },
    ],
    [],
  );

  const metadata = useMemo(() => {
    const source = product?.metadata ?? product?.raw?.metadata ?? {};
    const parsedMetadata = parseMetadataValue(source);

    return isPlainObject(parsedMetadata) ? parsedMetadata : {};
  }, [product]);

  const metadataRows = useMemo(() => {
    const specifications = Array.isArray(metadata.specifications)
      ? metadata.specifications
      : [];

    return specifications.map((item, index) => ({
      key: item?.name || `spec-${index}`,
      label: formatMetadataLabel(item?.name || `Specification ${index + 1}`),
      value: item?.value,
    }));
  }, [metadata]);

  const productStoreId = Number(product?.store?.id || product?.raw?.store_id || 0) || null;

  const metadataExtraEntries = useMemo(
    () =>
      Object.entries(metadata).filter(
        ([entryKey]) => !["specifications", "logistic", "logistics"].includes(entryKey),
      ),
    [metadata],
  );

  const metadataColumns = useMemo(
    () => [
      {
        title: "Field",
        dataIndex: "label",
        key: "label",
        width: 220,
      },
      {
        title: "Value",
        dataIndex: "value",
        key: "value",
        render: (value) => <MetadataValue value={value} />,
      },
    ],
    [],
  );

  const statisticsSeries = useMemo(() => {
    const statisticsValues = getFirstArray(
      product?.statistics,
      product?.raw?.statistics,
      product?.analytics?.statistics,
      product?.raw?.analytics?.statistics,
      metadata.statistics,
    );

    if (!statisticsValues.length) {
      return [];
    }

    const monthOffsetStart = statisticsValues.length - 1;

    return statisticsValues.map((value, index) => ({
      key: `stat-${index}`,
      month: formatMonthLabel(index - monthOffsetStart),
      amount: normalizeNumber(value),
    }));
  }, [metadata.statistics, product]);

  const recentOrders = useMemo(() => {
    const orders = getFirstArray(
      product?.recent_orders,
      product?.recentOrders,
      product?.raw?.recent_orders,
      product?.raw?.recentOrders,
      product?.analytics?.recent_orders,
      product?.analytics?.recentOrders,
      product?.raw?.analytics?.recent_orders,
      product?.raw?.analytics?.recentOrders,
      metadata.recent_orders,
      metadata.recentOrders,
    );

    return orders
      .map((order, index) => {
        const parsedOrder = parseMetadataValue(order);
        if (!isPlainObject(parsedOrder)) {
          return null;
        }

        return {
          key: parsedOrder.id || parsedOrder.order_number || `order-${index}`,
          ...parsedOrder,
        };
      })
      .filter(Boolean);
  }, [metadata.recentOrders, metadata.recent_orders, product]);

  const statisticsColumns = useMemo(
    () => [
      {
        title: "Month",
        dataIndex: "month",
        key: "month",
        width: 140,
      },
      {
        title: "Revenue",
        dataIndex: "amount",
        key: "amount",
        render: (value) => formatCurrency(value),
      },
    ],
    [],
  );

  const recentOrdersColumns = useMemo(
    () => [
      {
        title: "Order",
        key: "order_number",
        render: (_, record) => (
          <div>
            <div style={{ fontWeight: 600 }}>{record.order_number || "N/A"}</div>
            <div style={{ fontSize: 12, color: "#6b7280" }}>
              {record.customer?.name || record.customer?.email || "Unknown customer"}
            </div>
          </div>
        ),
      },
      {
        title: "Order Status",
        dataIndex: "order_status",
        key: "order_status",
        render: (value) => (
          <Tag color={statusTagColor[value] || "default"}>
            {String(value || "unknown").toUpperCase()}
          </Tag>
        ),
      },
      {
        title: "Payment",
        dataIndex: "payment_status",
        key: "payment_status",
        render: (value) => (
          <Tag color={statusTagColor[value] || "default"}>
            {String(value || "unknown").toUpperCase()}
          </Tag>
        ),
      },
      {
        title: "Total",
        key: "total_amount",
        render: (_, record) =>
          formatCurrency(record.total_amount, record.currency_code || "USD"),
      },
      {
        title: "Created",
        dataIndex: "created_at",
        key: "created_at",
        render: (value) => (value ? new Date(value).toLocaleString() : "N/A"),
      },
    ],
    [],
  );

  const updateProductStatus = async (action) => {
    try {
      await Axios.patch(
        `${ADMIN_BASE_URL}/products/${product.id}/status`,
        { action },
        { headers: getAuthHeaders(token) },
      );
      message.success(
        action === "activate"
          ? "Product activated successfully."
          : "Product deactivated successfully.",
      );
      fetchProduct();
    } catch (error) {
      message.error(
        error?.response?.data?.message || "Failed to update product status.",
      );
    }
  };

  const deleteProduct = async () => {
    try {
      await Axios.delete(`${ADMIN_BASE_URL}/products/${product.id}`, {
        headers: getAuthHeaders(token),
      });
      message.success("Product deleted successfully.");
      navigate("/dashboard/products");
    } catch (error) {
      message.error(
        error?.response?.data?.message || "Failed to delete product.",
      );
    }
  };

  const openEditModal = async () => {
    try {
      setEditLookupsLoading(true);
      const [currencies, subcategories, collections] = await Promise.all([
        fetchAdminCurrencies(token),
        fetchAdminSubcategories(token),
        productStoreId
          ? fetchStoreCollections(token, productStoreId)
          : Promise.resolve([]),
      ]);

      setEditLookups({
        currencies: Array.isArray(currencies) ? currencies : [],
        subcategories: Array.isArray(subcategories) ? subcategories : [],
        collections: Array.isArray(collections) ? collections : [],
      });
      setEditOpen(true);
    } catch (error) {
      message.error(
        error?.response?.data?.message || "Failed to load edit form lookups.",
      );
    } finally {
      setEditLookupsLoading(false);
    }
  };

  const handleProductEdit = async (values) => {
    try {
      setEditBusy(true);
      await updateRetailerProduct(token, product.id, {
        name: values.name.trim(),
        description: values.description.trim(),
        base_price: Number(values.base_price),
        currency_id: Number(values.currency_id),
        subcategory_id: Number(values.subcategory_id),
        collection_id: values.collection_id ? Number(values.collection_id) : null,
        metadata: {
          weight: Number(values.weight ?? 0),
          specifications: parseSpecificationsText(values.specifications_text),
        },
      });

      message.success("Product updated successfully.");
      setEditOpen(false);
      await fetchProduct();
    } catch (error) {
      message.error(
        error?.response?.data?.message || "Failed to update product.",
      );
    } finally {
      setEditBusy(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-center" style={{ minHeight: 300 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!product) {
    return <Empty description="Product not found" />;
  }

  return (
    <div style={{ padding: 20 }}>
      <div className="flex flex-justify-between flex-align" style={{ marginBottom: 20 }}>
        <div>
          <h1 style={{ marginBottom: 4 }}>{product.name || "Product Details"}</h1>
          <div style={{ color: "#666" }}>{product.productCode}</div>
        </div>
        <Space wrap>
          <Button onClick={() => navigate("/dashboard/products")}>Back</Button>
          <Button loading={editLookupsLoading} onClick={openEditModal}>
            Edit Product
          </Button>
          {product.isActive ? (
            <Button onClick={() => updateProductStatus("deactivate")}>
              Deactivate
            </Button>
          ) : (
            <Button
              style={{ color: "#41CCC7", borderColor: "#41CCC7" }}
              onClick={() => updateProductStatus("activate")}
            >
              Activate
            </Button>
          )}
          <Popconfirm
            title="Delete this product?"
            description="This action removes the product and related data."
            okButtonProps={{ danger: true }}
            onConfirm={deleteProduct}
          >
            <Button danger>Delete</Button>
          </Popconfirm>
        </Space>
      </div>

      <div className="flex" style={{ gap: 20, flexWrap: "wrap" }}>
        <Card style={{ flex: 2, minWidth: 320 }}>
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="Status">
              {product.isActive ? (
                <Tag color="green">ACTIVE</Tag>
              ) : (
                <Tag color="red">INACTIVE</Tag>
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Service">
              {product.subdomain?.label || product.subdomain?.name || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Store">
              {product.store?.name || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Seller">
              {product.seller?.name || product.seller?.email || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Base Price">
              ${Number(product.basePrice || 0).toLocaleString()}
            </Descriptions.Item>
            <Descriptions.Item label="Created">
              {createdAt ? new Date(createdAt).toLocaleString() : "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Updated">
              {updatedAt ? new Date(updatedAt).toLocaleString() : "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Description">
              {product.description || "No description provided."}
            </Descriptions.Item>
          </Descriptions>
        </Card>

        <Card title="Seller & Store" style={{ flex: 1, minWidth: 280 }}>
          <p>
            <strong>Seller:</strong>{" "}
            {product.seller?.name || product.seller?.email || "N/A"}
          </p>
          <p>
            <strong>Email:</strong> {product.seller?.email || "N/A"}
          </p>
          <p>
            <strong>Phone:</strong> {product.seller?.phone || "N/A"}
          </p>
          <p>
            <strong>Store:</strong> {product.store?.name || "N/A"}
          </p>
          <p>
            <strong>Store Code:</strong> {product.store?.code || "N/A"}
          </p>
          <p>
            <strong>Store Address:</strong> {product.store?.address || "N/A"}
          </p>
        </Card>
      </div>

      <Card title="Product Media" style={{ marginTop: 20 }}>
        {product.raw?.productMedia?.length ? (
          <Table
            rowKey="id"
            pagination={false}
            columns={mediaColumns}
            dataSource={product.raw.productMedia}
          />
        ) : (
          <Empty description="No media attached to this product" />
        )}
      </Card>

      <div className="flex" style={{ gap: 20, marginTop: 20, flexWrap: "wrap" }}>
        <Card title="Options" style={{ flex: 1, minWidth: 320 }}>
          {product.raw?.options?.length ? (
            <Table
              rowKey="id"
              pagination={false}
              columns={optionColumns}
              dataSource={product.raw.options}
            />
          ) : (
            <Empty description="No options configured" />
          )}
        </Card>

        <Card title="Variants" style={{ flex: 1, minWidth: 320 }}>
          {product.raw?.variants?.length ? (
            <Table
              rowKey="id"
              pagination={false}
              columns={variantColumns}
              dataSource={product.raw.variants}
            />
          ) : (
            <Empty description="No variants configured" />
          )}
        </Card>
      </div>

      <div className="flex" style={{ gap: 20, marginTop: 20, flexWrap: "wrap" }}>
        <Card title="Statistics Graph" style={{ flex: 2, minWidth: 360 }}>
          {statisticsSeries.length ? (
            <div style={{ height: 320 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statisticsSeries}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <RechartsTooltip
                    formatter={(value) => formatCurrency(value)}
                    labelFormatter={(label) => `${label} revenue`}
                  />
                  <Bar dataKey="amount" fill="#41CCC7" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <Empty description="No statistics available" />
          )}
        </Card>

        <Card title="Statistics Table" style={{ flex: 1, minWidth: 320 }}>
          {statisticsSeries.length ? (
            <Table
              rowKey="key"
              pagination={false}
              columns={statisticsColumns}
              dataSource={statisticsSeries}
              size="small"
            />
          ) : (
            <Empty description="No statistics available" />
          )}
        </Card>
      </div>

      <Card title="Recent Orders" style={{ marginTop: 20 }}>
        {recentOrders.length ? (
          <Table
            rowKey="key"
            columns={recentOrdersColumns}
            dataSource={recentOrders}
            pagination={{ pageSize: 5 }}
          />
        ) : (
          <Empty description="No recent orders available" />
        )}
      </Card>

      <Card title="Metadata" style={{ marginTop: 20 }}>
        {metadataRows.length ? (
          <Table
            rowKey="key"
            pagination={false}
            columns={metadataColumns}
            dataSource={metadataRows}
          />
        ) : (
          <Empty description="No metadata specifications available" />
        )}

        {metadata.logistic || metadata.logistics ? (
          <Card type="inner" title="Logistics" style={{ marginTop: 16 }}>
            <MetadataValue value={metadata.logistic || metadata.logistics} />
          </Card>
        ) : null}

        {metadataExtraEntries.length ? (
          <Card type="inner" title="Additional Metadata" style={{ marginTop: 16 }}>
            <Descriptions column={1} bordered size="small">
              {metadataExtraEntries.map(([entryKey, entryValue]) => (
                <Descriptions.Item key={entryKey} label={formatMetadataLabel(entryKey)}>
                  <MetadataValue value={entryValue} />
                </Descriptions.Item>
              ))}
            </Descriptions>
          </Card>
        ) : null}
      </Card>

      <ProductEditorModal
        open={editOpen}
        mode="edit"
        submitting={editBusy}
        currencies={editLookups.currencies}
        subcategories={editLookups.subcategories}
        collections={editLookups.collections}
        initialValues={{
          store_id: productStoreId,
          name: product.name,
          description: product.description,
          base_price: product.basePrice ?? product.raw?.base_price ?? 0,
          currency_id: product.raw?.currency_id ?? product.currency?.id ?? 238,
          subcategory_id: product.raw?.subcategory_id,
          collection_id: product.raw?.collection_id,
          weight: metadata.weight ?? 0,
          specifications: metadata.specifications || [],
        }}
        onCancel={() => setEditOpen(false)}
        onSubmit={handleProductEdit}
        onUploadImage={async () => null}
      />
    </div>
  );
};

export default ProductDetailsPage;
