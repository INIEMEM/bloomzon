/* eslint-disable react/prop-types */
import { useContext, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Button,
  Card,
  Descriptions,
  Empty,
  Modal,
  Popconfirm,
  Spin,
  Table,
  Tag,
  Input,
  message,
} from "antd";
import { PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";

import { MainContext } from "../../Context/MainContext";
import {
  createRetailerProduct,
  defaultAdminStoreDetails,
  deleteAdminStore,
  fetchAdminCurrencies,
  fetchAdminSubcategories,
  fetchAdminStoreDetails,
  fetchStoreCollections,
  fetchStoreProducts,
  reviewAdminStore,
  uploadRetailerProductImage,
} from "../../api/admin";
import { ProductEditorModal } from "./AdminCatalogModals";
import "./adminWorkspace.css";

const { TextArea } = Input;

const formatDateTime = (value) =>
  value ? new Date(value).toLocaleString() : "N/A";

const reviewStatusColor = {
  pending: "gold",
  approved: "green",
  approve: "green",
  rejected: "red",
  reject: "red",
  suspended: "orange",
  suspend: "orange",
  activate: "blue",
};

const knownStoreMetadataKeys = [
  "banner",
  "picture",
  "logo",
  "net_worth",
  "staff_count",
  "floor_space",
  "capabilities",
];

const knownStoreMetadataKeySet = new Set(knownStoreMetadataKeys);

const storeMetadataLabels = {
  banner: "Banner",
  picture: "Picture",
  logo: "Logo",
  net_worth: "Net Worth",
  staff_count: "Staff Count",
  floor_space: "Floor Space",
  capabilities: "Capabilities",
};

const numberFormatter = new Intl.NumberFormat();

const renderEmptyValue = () => <span style={{ color: "#9ca3af" }}>N/A</span>;

const renderObjectValue = (value) => {
  if (value === null || value === undefined || value === "") {
    return renderEmptyValue();
  }

  if (Array.isArray(value)) {
    return value.length ? (
      <div className="admin-inline-stats">
        {value.map((entry, index) => (
          <Tag key={`${index}-${String(entry)}`} color="blue">
            {typeof entry === "object" ? JSON.stringify(entry) : String(entry)}
          </Tag>
        ))}
      </div>
    ) : (
      renderEmptyValue()
    );
  }

  if (typeof value === "object") {
    return (
      <pre className="admin-json-block">{JSON.stringify(value, null, 2)}</pre>
    );
  }

  return String(value);
};

const humanizeMetadataLabel = (key) =>
  storeMetadataLabels[key] ||
  String(key || "")
    .split(/[_-]+/)
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");

const isValidUrl = (value) => {
  if (typeof value !== "string" || !value.trim()) {
    return false;
  }

  try {
    const parsedUrl = new URL(value);
    return parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:";
  } catch {
    return false;
  }
};

const renderMetadataImage = (value, label, fit = "cover") => {
  if (!isValidUrl(value)) {
    return renderEmptyValue();
  }

  return (
    <div style={{ display: "grid", gap: 10 }}>
      <img
        src={value}
        alt={label}
        style={{
          width: "100%",
          maxWidth: 220,
          height: 124,
          objectFit: fit,
          borderRadius: 12,
          border: "1px solid #e5e7eb",
          background: "#f8fafc",
        }}
      />
      <a
        href={value}
        target="_blank"
        rel="noreferrer"
        style={{ wordBreak: "break-all", fontSize: 12 }}
      >
        {value}
      </a>
    </div>
  );
};

const renderMetadataNumber = (value) => {
  if (value === null || value === undefined || value === "") {
    return renderEmptyValue();
  }

  const numeric = Number(value);
  return Number.isFinite(numeric)
    ? numberFormatter.format(numeric)
    : renderEmptyValue();
};

const normalizeCapabilityIds = (value) => {
  if (Array.isArray(value)) {
    return Array.from(new Set(value.flatMap((entry) => normalizeCapabilityIds(entry))));
  }

  if (value && typeof value === "object") {
    return normalizeCapabilityIds(value.id ?? value.capability_id ?? value.value);
  }

  if (typeof value === "string") {
    const trimmed = value.trim();

    if (!trimmed) {
      return [];
    }

    if (
      (trimmed.startsWith("[") && trimmed.endsWith("]")) ||
      (trimmed.startsWith("{") && trimmed.endsWith("}"))
    ) {
      try {
        return normalizeCapabilityIds(JSON.parse(trimmed));
      } catch {
        return [];
      }
    }

    if (trimmed.includes(",")) {
      return Array.from(
        new Set(trimmed.split(",").flatMap((entry) => normalizeCapabilityIds(entry))),
      );
    }
  }

  const numeric = Number(value);
  return Number.isInteger(numeric) && numeric > 0 ? [numeric] : [];
};

const renderCapabilityMetadata = (metadataValue, resolvedCapabilities) => {
  const capabilityIds = normalizeCapabilityIds(metadataValue);
  const capabilityMap = new Map(
    (Array.isArray(resolvedCapabilities) ? resolvedCapabilities : [])
      .filter((capability) => Number(capability?.id) > 0)
      .map((capability) => [Number(capability.id), capability]),
  );

  const items = capabilityIds.length
    ? capabilityIds.map((capabilityId) => {
        const capability = capabilityMap.get(capabilityId);
        return {
          key: capabilityId,
          label: capability?.name || `Capability #${capabilityId}`,
          description: capability?.description || null,
        };
      })
    : (Array.isArray(resolvedCapabilities) ? resolvedCapabilities : [])
        .filter((capability) => capability?.name)
        .map((capability) => ({
          key: capability.id,
          label: capability.name,
          description: capability.description || null,
        }));

  return items.length ? (
    <div className="admin-inline-stats">
      {items.map((item) => (
        <Tag key={`${item.key}-${item.label}`} color="blue" title={item.description || ""}>
          {item.label}
        </Tag>
      ))}
    </div>
  ) : (
    renderEmptyValue()
  );
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

const resolveStoreProductImage = (record) =>
  record?.productMedia?.[0]?.url || record?.thumbnail || "";

const SummaryCard = ({ label, value, helper }) => (
  <div className="admin-kpi">
    <div className="admin-kpi__label">{label}</div>
    <div className="admin-kpi__value">{value}</div>
    <div className="admin-kpi__helper">{helper}</div>
  </div>
);

const getActionLabel = (action) => {
  if (action === "approve") return "Store approved successfully.";
  if (action === "reject") return "Store rejected successfully.";
  if (action === "suspend") return "Store suspended successfully.";
  if (action === "activate") return "Store activated successfully.";
  return "Store updated successfully.";
};

const AdminStoreDetailsWorkspace = () => {
  const { token } = useContext(MainContext);
  const { storeId } = useParams();
  const navigate = useNavigate();
  const [store, setStore] = useState(defaultAdminStoreDetails);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [storeProducts, setStoreProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [modModal, setModModal] = useState({
    open: false,
    action: "",
    reason: "",
  });
  const [actionBusy, setActionBusy] = useState("");
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [productModalBusy, setProductModalBusy] = useState(false);
  const [productLookupsLoading, setProductLookupsLoading] = useState(false);
  const [productLookups, setProductLookups] = useState({
    currencies: [],
    subcategories: [],
    collections: [],
  });

  const loadStore = async () => {
    try {
      setLoading(true);
      setError("");
      const nextStore = await fetchAdminStoreDetails(token, storeId);
      setStore(nextStore || defaultAdminStoreDetails);
    } catch (fetchError) {
      setError(
        fetchError?.response?.data?.message || "Failed to load store details.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && storeId) {
      loadStore();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, storeId]);

  const loadStoreProducts = async () => {
    try {
      setProductsLoading(true);
      const data = await fetchStoreProducts(token, storeId, {
        includeUnits: false,
        includeOptions: false,
        includeVariants: false,
        includeMedia: true,
        includeMetadata: true,
        includeSpecifications: true,
      });
      setStoreProducts(Array.isArray(data) ? data : []);
    } catch (fetchError) {
      message.error(
        fetchError?.response?.data?.message || "Failed to load store products.",
      );
    } finally {
      setProductsLoading(false);
    }
  };

  useEffect(() => {
    if (token && storeId) {
      loadStoreProducts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, storeId]);

  const metadata = useMemo(
    () => (store?.metadata && typeof store.metadata === "object" ? store.metadata : {}),
    [store],
  );

  const metadataRows = useMemo(
    () =>
      Object.entries(metadata).filter(
        ([key]) => key !== "admin_review" && !knownStoreMetadataKeySet.has(key),
      ),
    [metadata],
  );

  const knownMetadataRows = useMemo(
    () => [
      {
        key: "banner",
        label: humanizeMetadataLabel("banner"),
        content: renderMetadataImage(
          metadata.banner,
          `${store?.name || "Store"} banner`,
          "cover",
        ),
      },
      {
        key: "picture",
        label: humanizeMetadataLabel("picture"),
        content: renderMetadataImage(
          metadata.picture,
          `${store?.name || "Store"} picture`,
          "cover",
        ),
      },
      {
        key: "logo",
        label: humanizeMetadataLabel("logo"),
        content: renderMetadataImage(
          metadata.logo,
          `${store?.name || "Store"} logo`,
          "contain",
        ),
      },
      {
        key: "net_worth",
        label: humanizeMetadataLabel("net_worth"),
        content: renderMetadataNumber(metadata.net_worth),
      },
      {
        key: "staff_count",
        label: humanizeMetadataLabel("staff_count"),
        content: renderMetadataNumber(metadata.staff_count),
      },
      {
        key: "floor_space",
        label: humanizeMetadataLabel("floor_space"),
        content: renderMetadataNumber(metadata.floor_space),
      },
      {
        key: "capabilities",
        label: humanizeMetadataLabel("capabilities"),
        content: renderCapabilityMetadata(metadata.capabilities, store?.capabilities),
      },
    ],
    [metadata, store?.capabilities, store?.name],
  );

  const reviewHistoryColumns = useMemo(
    () => [
      {
        title: "Reviewed",
        key: "reviewedAt",
        render: (_, record) => formatDateTime(record.reviewedAt),
      },
      {
        title: "Action",
        key: "action",
        render: (_, record) => (
          <Tag color={reviewStatusColor[record.action] || "default"}>
            {String(record.action || "unknown").toUpperCase()}
          </Tag>
        ),
      },
      {
        title: "Reason",
        key: "reason",
        render: (_, record) => record.reason || "No reason recorded",
      },
      {
        title: "Actor",
        key: "actorUserId",
        render: (_, record) => record.actorUserId || "N/A",
      },
    ],
    [],
  );

  const storeProductColumns = useMemo(
    () => [
      {
        title: "Image",
        key: "thumbnail",
        width: 84,
        render: (_, record) => {
          const imageUrl = resolveStoreProductImage(record);

          return imageUrl ? (
            <img
              src={imageUrl}
              alt={record.name || "Product"}
              style={{
                width: 52,
                height: 52,
                objectFit: "cover",
                borderRadius: 8,
                border: "1px solid #e5e7eb",
              }}
            />
          ) : (
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 8,
                background: "#f3f4f6",
                border: "1px solid #e5e7eb",
              }}
            />
          );
        },
      },
      {
        title: "Product",
        key: "product",
        render: (_, record) => (
          <div>
            <div style={{ fontWeight: 600 }}>{record.name || "Untitled product"}</div>
            <div style={{ color: "#6b7280", fontSize: 12 }}>
              {record.product_code || `Product #${record.id}`}
            </div>
          </div>
        ),
      },
      {
        title: "Category",
        key: "subcategory",
        render: (_, record) =>
          record.subcategory?.name ||
          record.subcategory?.label ||
          `Subcategory #${record.subcategory_id || "N/A"}`,
      },
      {
        title: "Price",
        key: "price",
        render: (_, record) => {
          const amount = Number(record.base_price || 0).toLocaleString();
          const prefix = record.currency?.symbol || record.currency?.code || "$";
          return `${prefix}${amount}`;
        },
      },
      {
        title: "Status",
        key: "status",
        render: (_, record) => (
          <Tag color={Number(record.status ?? 0) === 1 ? "green" : "red"}>
            {Number(record.status ?? 0) === 1 ? "ACTIVE" : "INACTIVE"}
          </Tag>
        ),
      },
      {
        title: "Created",
        key: "created_at",
        render: (_, record) =>
          formatDateTime(record.created_at || record.createdAt),
      },
      {
        title: "Actions",
        key: "actions",
        render: (_, record) => (
          <Button type="link" onClick={() => navigate(`/dashboard/products/${record.id}`)}>
            View / Edit
          </Button>
        ),
      },
    ],
    [navigate],
  );

  const openProductCreateModal = async () => {
    try {
      setProductLookupsLoading(true);
      const [currencies, subcategories, collections] = await Promise.all([
        fetchAdminCurrencies(token),
        fetchAdminSubcategories(token),
        fetchStoreCollections(token, storeId),
      ]);

      setProductLookups({
        currencies: Array.isArray(currencies) ? currencies : [],
        subcategories: Array.isArray(subcategories) ? subcategories : [],
        collections: Array.isArray(collections) ? collections : [],
      });
      setProductModalOpen(true);
    } catch (lookupError) {
      message.error(
        lookupError?.response?.data?.message ||
          "Failed to load product creation lookups.",
      );
    } finally {
      setProductLookupsLoading(false);
    }
  };

  const handleCreateProduct = async (values) => {
    try {
      setProductModalBusy(true);
      const specifications = parseSpecificationsText(values.specifications_text);
      const metadata = {
        weight: Number(values.weight ?? 0),
        specifications,
      };

      await createRetailerProduct(token, {
        identifiers: {
          store_id: Number(values.store_id || storeId),
          subcategory_id: Number(values.subcategory_id),
          ...(values.collection_id ? { collection_id: Number(values.collection_id) } : {}),
          currency_id: Number(values.currency_id),
        },
        basic_info: {
          name: values.name.trim(),
          description: values.description.trim(),
          weight: Number(values.weight ?? 0),
        },
        pricing: {
          base_price: Number(values.base_price),
        },
        metadata,
        ...(Array.isArray(values.imageUrls) && values.imageUrls.length
          ? {
              medias: values.imageUrls.map((url) => ({
                url,
                type: "image",
              })),
            }
          : {}),
      });

      message.success("Product created successfully.");
      setProductModalOpen(false);
      await loadStoreProducts();
    } catch (createError) {
      message.error(
        createError?.response?.data?.message || "Failed to create product.",
      );
    } finally {
      setProductModalBusy(false);
    }
  };

  const handleReviewAction = async () => {
    const { action, reason } = modModal;
    if (!store?.id) {
      return;
    }

    try {
      setActionBusy(action);
      const nextStore = await reviewAdminStore(token, store.id, {
        action,
        reason: reason.trim(),
      });
      setStore(nextStore || store);
      setModModal({ open: false, action: "", reason: "" });
      message.success(getActionLabel(action));
    } catch (actionError) {
      message.error(
        actionError?.response?.data?.message || "Failed to update store.",
      );
    } finally {
      setActionBusy("");
    }
  };

  const handleDelete = async () => {
    if (!store?.id) {
      return;
    }

    try {
      setActionBusy("delete");
      await deleteAdminStore(token, store.id);
      message.success("Store deleted successfully.");
      navigate("/dashboard/sellers/stores");
    } catch (deleteError) {
      message.error(
        deleteError?.response?.data?.message || "Failed to delete store.",
      );
    } finally {
      setActionBusy("");
    }
  };

  return (
    <div className="admin-workspace">
      <div className="admin-workspace__header">
        <div className="admin-workspace__copy">
          <div className="admin-workspace__eyebrow">Store Review</div>
          <h1 className="admin-workspace__title">
            {store?.name || "Store details"}
          </h1>
          <div className="admin-workspace__subtitle">
            Review the full vendor store record, including seller context,
            service mapping, admin review history, and moderation actions.
          </div>
        </div>
        <div className="admin-workspace__actions">
          <Button onClick={() => navigate("/dashboard/sellers/stores")}>
            Back to stores
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            loading={productLookupsLoading}
            onClick={openProductCreateModal}
            style={{
              background: "var(--primary-color)",
              borderColor: "var(--primary-color)",
            }}
          >
            Add Product
          </Button>
          <Button icon={<ReloadOutlined />} onClick={loadStore}>
            Refresh
          </Button>
          {store?.reviewStatus === "pending" ? (
            <>
              <Button
                type="primary"
                loading={actionBusy === "approve"}
                onClick={() =>
                  setModModal({ open: true, action: "approve", reason: "" })
                }
                style={{
                  background: "var(--primary-color)",
                  borderColor: "var(--primary-color)",
                }}
              >
                Approve
              </Button>
              <Button
                danger
                loading={actionBusy === "reject"}
                onClick={() =>
                  setModModal({ open: true, action: "reject", reason: "" })
                }
              >
                Reject
              </Button>
            </>
          ) : null}
          {store?.reviewStatus === "approved" ? (
            <Button
              loading={actionBusy === "suspend"}
              onClick={() =>
                setModModal({ open: true, action: "suspend", reason: "" })
              }
            >
              Suspend
            </Button>
          ) : null}
          {store?.reviewStatus === "suspended" ? (
            <Button
              loading={actionBusy === "activate"}
              onClick={() =>
                setModModal({ open: true, action: "activate", reason: "" })
              }
            >
              Activate
            </Button>
          ) : null}
          {store?.id ? (
            <Popconfirm
              title="Delete store?"
              description="This permanently deletes the store record."
              okText="Delete"
              okButtonProps={{ danger: true, loading: actionBusy === "delete" }}
              onConfirm={handleDelete}
            >
              <Button danger>Delete</Button>
            </Popconfirm>
          ) : null}
        </div>
      </div>

      {error ? (
        <Alert
          style={{ marginBottom: 18 }}
          type="error"
          showIcon
          message="Store details could not be loaded"
          description={error}
        />
      ) : null}

      {loading ? (
        <div className="flex flex-center" style={{ minHeight: 320 }}>
          <Spin size="large" />
        </div>
      ) : store ? (
        <>
          <div className="admin-kpi-grid" style={{ marginBottom: 18 }}>
            <SummaryCard
              label="Review State"
              value={store.reviewStatus || "unknown"}
              helper="Current admin workflow state for this store."
            />
            <SummaryCard
              label="Seller"
              value={store.seller?.name || "Unknown seller"}
              helper={store.seller?.email || "No seller email"}
            />
            <SummaryCard
              label="Service"
              value={store.serviceLabel || "Unassigned"}
              helper={`Vendor #${store.vendor?.id || "N/A"}`}
            />
            <SummaryCard
              label="Last Reviewed"
              value={store.adminReview?.reviewedAt ? "Tracked" : "Pending"}
              helper={formatDateTime(store.adminReview?.reviewedAt)}
            />
          </div>

          <div className="admin-section-grid admin-section-grid--2">
            <Card title="Store Details" className="admin-panel admin-panel--soft">
              <Descriptions column={1} bordered size="small">
                <Descriptions.Item label="Store Name">
                  {store.name || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Code">
                  {store.code || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Address">
                  {store.address || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Slogan">
                  {store.slogan || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Review Status">
                  <Tag color={reviewStatusColor[store.reviewStatus] || "default"}>
                    {String(store.reviewStatus || "unknown").toUpperCase()}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Store State">
                  <div className="admin-inline-stats">
                    <Tag color={store.status === 1 ? "green" : "red"}>
                      {store.status === 1 ? "ACTIVE" : "INACTIVE"}
                    </Tag>
                    <Tag color={store.is_verified ? "blue" : "default"}>
                      {store.is_verified ? "VERIFIED" : "UNVERIFIED"}
                    </Tag>
                  </div>
                </Descriptions.Item>
                <Descriptions.Item label="Created">
                  {formatDateTime(store.createdAt)}
                </Descriptions.Item>
                <Descriptions.Item label="Updated">
                  {formatDateTime(store.updatedAt)}
                </Descriptions.Item>
              </Descriptions>
            </Card>

            <Card title="Seller and Service" className="admin-panel admin-panel--soft">
              <Descriptions column={1} bordered size="small">
                <Descriptions.Item label="Seller">
                  {store.seller?.name || "Unknown seller"}
                </Descriptions.Item>
                <Descriptions.Item label="Seller Email">
                  {store.seller?.email || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Seller Phone">
                  {store.seller?.phone || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Vendor ID">
                  {store.vendor?.id || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Vendor Status">
                  {Number(store.vendor?.status) === 1 ? "Active" : "Inactive"}
                </Descriptions.Item>
                <Descriptions.Item label="Service">
                  {store.serviceLabel || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Subdomain Code">
                  {store.subdomain?.code || "N/A"}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </div>

          <div className="admin-section-grid admin-section-grid--2" style={{ marginTop: 18 }}>
            <Card title="Admin Review" className="admin-panel admin-panel--soft">
              {store.adminReview ? (
                <Descriptions column={1} bordered size="small">
                  <Descriptions.Item label="Latest Action">
                    {store.adminReview.latestAction || "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Latest Reason">
                    {store.adminReview.latestReason || "No reason recorded"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Reviewer User ID">
                    {store.adminReview.actorUserId || "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Reviewed At">
                    {formatDateTime(store.adminReview.reviewedAt)}
                  </Descriptions.Item>
                </Descriptions>
              ) : (
                <Empty description="No admin review metadata recorded." />
              )}
            </Card>

            <Card title="Store Metadata" className="admin-panel admin-panel--soft">
              <Descriptions column={1} bordered size="small">
                {knownMetadataRows.map((row) => (
                  <Descriptions.Item key={row.key} label={row.label}>
                    {row.content}
                  </Descriptions.Item>
                ))}
                {metadataRows.map(([key, value]) => (
                  <Descriptions.Item key={key} label={humanizeMetadataLabel(key)}>
                    {renderObjectValue(value)}
                  </Descriptions.Item>
                ))}
              </Descriptions>
            </Card>
          </div>

          <Card
            title="Review History"
            className="admin-panel admin-panel--soft"
            style={{ marginTop: 18 }}
          >
            {store.adminReview?.history?.length ? (
              <Table
                className="admin-split-table"
                columns={reviewHistoryColumns}
                dataSource={store.adminReview.history}
                rowKey={(record, index) => `${record.reviewedAt}-${index}`}
                pagination={false}
              />
            ) : (
              <Empty description="No review history yet." />
            )}
          </Card>

          <Card
            title="Store Products"
            className="admin-panel admin-panel--soft"
            style={{ marginTop: 18 }}
            extra={
              <Button type="link" onClick={() => navigate("/dashboard/products")}>
                Open product directory
              </Button>
            }
          >
            <Alert
              type="info"
              showIcon
              style={{ marginBottom: 16 }}
              message="Admin upload workflow"
              description="Products created here are attached directly to this store. Editing media, variants, and option structures still routes through the broader product workflow because the current backend only supports core field updates."
            />
            {storeProducts.length ? (
              <Table
                className="admin-split-table"
                rowKey="id"
                loading={productsLoading}
                columns={storeProductColumns}
                dataSource={storeProducts}
                pagination={{ pageSize: 8 }}
              />
            ) : productsLoading ? (
              <div className="flex flex-center" style={{ minHeight: 180 }}>
                <Spin />
              </div>
            ) : (
              <Empty description="No products have been added to this store yet." />
            )}
          </Card>
        </>
      ) : (
        <Empty description="Store not found." />
      )}

      <Modal
        title={`${modModal.action.charAt(0).toUpperCase() + modModal.action.slice(1)} ${store?.name || "Store"}`}
        open={modModal.open}
        okText="Submit"
        okButtonProps={{
          danger: modModal.action === "reject" || modModal.action === "suspend",
          loading: actionBusy === modModal.action,
          disabled: !modModal.reason.trim(),
        }}
        onOk={handleReviewAction}
        onCancel={() => setModModal({ open: false, action: "", reason: "" })}
      >
        <div className="admin-modal-copy">
          Please provide a remark/reason for this action. This is mandatory for accountability.
        </div>
        <TextArea
          rows={5}
          value={modModal.reason}
          onChange={(event) =>
            setModModal((current) => ({
              ...current,
              reason: event.target.value,
            }))
          }
          placeholder={`Enter the reason for ${modModal.action}...`}
        />
      </Modal>

      <ProductEditorModal
        open={productModalOpen}
        mode="create"
        submitting={productModalBusy}
        currencies={productLookups.currencies}
        subcategories={productLookups.subcategories}
        collections={productLookups.collections}
        initialValues={{ store_id: Number(storeId) }}
        onCancel={() => setProductModalOpen(false)}
        onSubmit={handleCreateProduct}
        onUploadImage={(file) => uploadRetailerProductImage(token, file)}
      />
    </div>
  );
};

export default AdminStoreDetailsWorkspace;
