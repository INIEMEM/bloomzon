/* eslint-disable react/prop-types */
import {
  useContext,
  useDeferredValue,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Alert,
  Button,
  Empty,
  Input,
  Modal,
  Popconfirm,
  Select,
  Spin,
  Table,
  Tag,
  message,
} from "antd";
import { PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

import { MainContext } from "../../Context/MainContext";
import {
  createAdminStore,
  defaultAdminStores,
  deleteAdminStore,
  fetchAdminCities,
  fetchAdminStores,
  fetchAdminSubdomains,
  fetchAdminUsers,
  reviewAdminStore,
  uploadStoreAsset,
} from "../../api/admin";
import { StoreCreateModal } from "./AdminCatalogModals";
import "./adminWorkspace.css";

const { TextArea, Search } = Input;

const formatDateTime = (value) =>
  value ? new Date(value).toLocaleString() : "N/A";

const reviewStatusColor = {
  pending: "gold",
  approved: "green",
  rejected: "red",
  suspended: "orange",
};

const activityStatusColor = {
  active: "green",
  inactive: "red",
};

const statusOptions = [
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
  { label: "Suspended", value: "suspended" },
  { label: "All", value: "all" },
];

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

const StoreActionButtons = ({
  record,
  busy,
  onView,
  onReview,
  onDelete,
}) => (
  <div className="admin-action-row">
    <Button size="small" onClick={() => onView(record.id)}>
      View
    </Button>
    {record.reviewStatus === "pending" ? (
      <>
        <Button
          size="small"
          type="primary"
          loading={busy === `approve-${record.id}`}
          onClick={() => onReview(record, "approve")}
          style={{
            background: "var(--primary-color)",
            borderColor: "var(--primary-color)",
          }}
        >
          Approve
        </Button>
        <Button
          size="small"
          danger
          loading={busy === `reject-${record.id}`}
          onClick={() => onReview(record, "reject")}
        >
          Reject
        </Button>
      </>
    ) : null}
    {record.reviewStatus === "approved" ? (
      <Button
        size="small"
        loading={busy === `suspend-${record.id}`}
        onClick={() => onReview(record, "suspend")}
      >
        Suspend
      </Button>
    ) : null}
    {record.reviewStatus === "suspended" ? (
      <Button
        size="small"
        loading={busy === `activate-${record.id}`}
        onClick={() => onReview(record, "activate")}
      >
        Activate
      </Button>
    ) : null}
    <Popconfirm
      title="Delete store?"
      description="This permanently deletes the store record."
      okText="Delete"
      okButtonProps={{ danger: true, loading: busy === `delete-${record.id}` }}
      onConfirm={() => onDelete(record)}
    >
      <Button size="small" danger>
        Delete
      </Button>
    </Popconfirm>
  </div>
);

const AdminStoreManagementWorkspace = () => {
  const { token } = useContext(MainContext);
  const navigate = useNavigate();
  const [dataset, setDataset] = useState(defaultAdminStores);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [actionBusy, setActionBusy] = useState("");
  const [modModal, setModModal] = useState({
    open: false,
    store: null,
    action: "",
    reason: "",
  });
  const [createOpen, setCreateOpen] = useState(false);
  const [createBusy, setCreateBusy] = useState(false);
  const [createLookups, setCreateLookups] = useState({
    sellers: [],
    cities: [],
    subdomains: [],
  });

  const deferredSearch = useDeferredValue(search);

  const loadStores = async (nextPage = page) => {
    try {
      setLoading(true);
      setError("");
      const data = await fetchAdminStores(token, {
        search: deferredSearch || undefined,
        status,
        page: nextPage,
        limit: 12,
      });
      setDataset(data || defaultAdminStores);
    } catch (fetchError) {
      setError(
        fetchError?.response?.data?.message || "Failed to load admin stores.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadStores(page);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, deferredSearch, status, page]);

  useEffect(() => {
    setPage(1);
  }, [deferredSearch, status]);

  const openModModal = (store, action) => {
    setModModal({
      open: true,
      store,
      action,
      reason: "",
    });
  };

  const closeModModal = () => {
    setModModal({
      open: false,
      store: null,
      action: "",
      reason: "",
    });
  };

  const openCreateModal = async () => {
    try {
      setCreateBusy(true);
      const [sellerData, cityData, subdomainData] = await Promise.all([
        fetchAdminUsers(token, { role: "seller", group: "all", page: 1, limit: 200 }),
        fetchAdminCities(token),
        fetchAdminSubdomains(token),
      ]);

      setCreateLookups({
        sellers: (sellerData.items || []).filter((item) => item.vendor?.id),
        cities: cityData || [],
        subdomains: subdomainData || [],
      });
      setCreateOpen(true);
    } catch (lookupError) {
      message.error(
        lookupError?.response?.data?.message ||
          "Failed to load store creation lookups.",
      );
    } finally {
      setCreateBusy(false);
    }
  };

  const handleCreateStore = async (payload) => {
    try {
      setCreateBusy(true);
      await createAdminStore(token, payload);
      message.success("Store created successfully.");
      setCreateOpen(false);
      setPage(1);
      await loadStores(1);
    } catch (createError) {
      message.error(
        createError?.response?.data?.message || "Failed to create store.",
      );
    } finally {
      setCreateBusy(false);
    }
  };

  const handleReviewAction = async () => {
    const { store, action, reason } = modModal;
    const busyKey = `${action}-${store.id}`;

    try {
      setActionBusy(busyKey);
      await reviewAdminStore(token, store.id, {
        action,
        reason: reason.trim(),
      });
      message.success(getActionLabel(action));
      closeModModal();
      await loadStores(page);
    } catch (actionError) {
      message.error(
        actionError?.response?.data?.message || "Failed to update store status.",
      );
    } finally {
      setActionBusy("");
    }
  };

  const handleDelete = async (store) => {
    try {
      setActionBusy(`delete-${store.id}`);
      await deleteAdminStore(token, store.id);
      message.success("Store deleted successfully.");

      const remainingItems = Math.max(
        0,
        Number(dataset.pagination.total || 0) - 1,
      );
      const nextTotalPages = Math.max(
        1,
        Math.ceil(remainingItems / Number(dataset.pagination.limit || 12)),
      );
      const nextPage = Math.min(page, nextTotalPages);
      setPage(nextPage);
      await loadStores(nextPage);
    } catch (deleteError) {
      message.error(
        deleteError?.response?.data?.message || "Failed to delete store.",
      );
    } finally {
      setActionBusy("");
    }
  };

  const columns = useMemo(
    () => [
      {
        title: "Store",
        key: "store",
        render: (_, record) => (
          <div>
            <div style={{ fontWeight: 600 }}>{record.name || "Unnamed store"}</div>
            <div style={{ color: "#6b7280", fontSize: 12 }}>
              Code: {record.code || "N/A"}
            </div>
          </div>
        ),
      },
      {
        title: "Seller",
        key: "seller",
        render: (_, record) => (
          <div>
            <div style={{ fontWeight: 600 }}>
              {record.seller?.name || "Unknown seller"}
            </div>
            <div style={{ color: "#6b7280", fontSize: 12 }}>
              {record.seller?.email || "No email"}
            </div>
          </div>
        ),
      },
      {
        title: "Service",
        key: "serviceLabel",
        render: (_, record) => record.serviceLabel || "Unassigned service",
      },
      {
        title: "Review State",
        key: "reviewStatus",
        render: (_, record) => (
          <Tag color={reviewStatusColor[record.reviewStatus] || "default"}>
            {String(record.reviewStatus || "unknown").toUpperCase()}
          </Tag>
        ),
      },
      {
        title: "Store State",
        key: "storeState",
        render: (_, record) => (
          <div className="admin-inline-stats">
            <Tag
              color={
                activityStatusColor[record.status === 1 ? "active" : "inactive"]
              }
            >
              {record.status === 1 ? "ACTIVE" : "INACTIVE"}
            </Tag>
            <Tag color={record.is_verified ? "blue" : "default"}>
              {record.is_verified ? "VERIFIED" : "UNVERIFIED"}
            </Tag>
          </div>
        ),
      },
      {
        title: "Created",
        key: "createdAt",
        render: (_, record) => formatDateTime(record.createdAt),
      },
      {
        title: "Actions",
        key: "actions",
        render: (_, record) => (
          <StoreActionButtons
            record={record}
            busy={actionBusy}
            onView={(storeId) => navigate(`/dashboard/sellers/stores/${storeId}`)}
            onReview={openModModal}
            onDelete={handleDelete}
          />
        ),
      },
    ],
    [actionBusy, navigate],
  );

  return (
    <div className="admin-workspace">
      <div className="admin-workspace__header">
        <div className="admin-workspace__copy">
          <div className="admin-workspace__eyebrow">Store Management</div>
          <h1 className="admin-workspace__title">Vendor Store Review Queue</h1>
          <div className="admin-workspace__subtitle">
            Review newly created vendor stores first, then manage approved,
            rejected, and suspended stores from the same admin workspace.
          </div>
        </div>
        <div className="admin-workspace__actions">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            style={{
              background: "var(--primary-color)",
              borderColor: "var(--primary-color)",
            }}
            loading={createBusy && !createOpen}
            onClick={openCreateModal}
          >
            Create Store
          </Button>
          <Search
            allowClear
            placeholder="Search by store, seller, email, or code"
            onSearch={setSearch}
            onChange={(event) => setSearch(event.target.value)}
            value={search}
            style={{ minWidth: 280 }}
          />
          <Select
            options={statusOptions}
            value={status}
            onChange={setStatus}
            style={{ minWidth: 160 }}
          />
          <Button icon={<ReloadOutlined />} onClick={() => loadStores(page)}>
            Refresh
          </Button>
        </div>
      </div>

      {error ? (
        <Alert
          style={{ marginBottom: 18 }}
          type="error"
          showIcon
          message="Stores could not be loaded"
          description={error}
        />
      ) : null}

      <div className="admin-kpi-grid" style={{ marginBottom: 18 }}>
        <SummaryCard
          label="Pending"
          value={dataset.summary.pending}
          helper="Stores waiting for approval review."
        />
        <SummaryCard
          label="Approved"
          value={dataset.summary.approved}
          helper="Stores currently verified and active."
        />
        <SummaryCard
          label="Rejected"
          value={dataset.summary.rejected}
          helper="Stores rejected with an admin review reason."
        />
        <SummaryCard
          label="Suspended"
          value={dataset.summary.suspended}
          helper="Stores moderated out of active service."
        />
        <SummaryCard
          label="Filtered"
          value={dataset.summary.filtered}
          helper="Rows matching the current search and status filter."
        />
      </div>

      <div className="admin-panel admin-panel--soft">
        <div className="admin-panel__body">
          <div className="admin-panel__header">
            <div>
              <h2 className="admin-panel__title">Store Queue</h2>
              <div className="admin-panel__subtitle">
                Review vendor stores by current workflow state and open a full
                detail screen before taking action.
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-center" style={{ minHeight: 280 }}>
              <Spin size="large" />
            </div>
          ) : dataset.items.length ? (
            <Table
              className="admin-split-table"
              columns={columns}
              dataSource={dataset.items}
              rowKey="id"
              pagination={{
                current: dataset.pagination.page,
                pageSize: dataset.pagination.limit,
                total: dataset.pagination.total,
                onChange: (nextPage) => setPage(nextPage),
              }}
            />
          ) : (
            <Empty description="No stores match the current filter." />
          )}
        </div>
      </div>

      <Modal
        title={
          modModal.store
            ? `${modModal.action.charAt(0).toUpperCase() + modModal.action.slice(1)} ${modModal.store.name || "Store"}`
            : "Store Moderation"
        }
        open={modModal.open}
        okText="Submit"
        okButtonProps={{
          danger: modModal.action === "reject" || modModal.action === "suspend",
          loading: modModal.store
            ? actionBusy === `${modModal.action}-${modModal.store.id}`
            : false,
          disabled: !modModal.reason.trim(),
        }}
        onOk={handleReviewAction}
        onCancel={closeModModal}
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

      <StoreCreateModal
        open={createOpen}
        submitting={createBusy && createOpen}
        cities={createLookups.cities}
        sellers={createLookups.sellers}
        subdomains={createLookups.subdomains}
        onCancel={() => setCreateOpen(false)}
        onSubmit={handleCreateStore}
        onUploadAsset={(file) => uploadStoreAsset(token, file)}
      />
    </div>
  );
};

export default AdminStoreManagementWorkspace;
