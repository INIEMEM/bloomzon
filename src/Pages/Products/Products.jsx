import React, { useContext, useEffect, useMemo, useState } from "react";
import Axios from "axios";
import {
  Button,
  Input,
  Popconfirm,
  Select,
  Space,
  Table,
  Tag,
  message,
} from "antd";
import { useNavigate, useSearchParams } from "react-router-dom";
import UserMatrxs from "../../Components/UserMatrixs/UserMatrxs";
import { MainContext } from "../../Context/Context";
import { ADMIN_BASE_URL, getAuthHeaders } from "../../api/config";

const { Search } = Input;

const ProductsPage = () => {
  const { token } = useContext(MainContext);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [summary, setSummary] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    filtered: 0,
  });
  const [subdomains, setSubdomains] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0,
  });
  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    status: searchParams.get("status") || "all",
    subdomainId: searchParams.get("subdomainId") || undefined,
  });

  const syncSearchParams = (nextFilters, nextPage = 1, nextPageSize = 20) => {
    const nextParams = new URLSearchParams();

    if (nextFilters.search) {
      nextParams.set("search", nextFilters.search);
    }

    if (nextFilters.status && nextFilters.status !== "all") {
      nextParams.set("status", nextFilters.status);
    }

    if (nextFilters.subdomainId) {
      nextParams.set("subdomainId", String(nextFilters.subdomainId));
    }

    if (nextPage > 1) {
      nextParams.set("page", String(nextPage));
    }

    if (nextPageSize !== 20) {
      nextParams.set("limit", String(nextPageSize));
    }

    setSearchParams(nextParams);
  };

  const fetchProducts = async ({
    page = pagination.current,
    pageSize = pagination.pageSize,
    nextFilters = filters,
  } = {}) => {
    try {
      setLoading(true);

      const response = await Axios.get(`${ADMIN_BASE_URL}/products`, {
        headers: getAuthHeaders(token),
        params: {
          page,
          limit: pageSize,
          search: nextFilters.search || undefined,
          status: nextFilters.status || "all",
          subdomainId: nextFilters.subdomainId || undefined,
        },
      });

      const data = response?.data?.data || {};
      setProducts(data.items || []);
      setSummary(data.summary || { total: 0, active: 0, inactive: 0, filtered: 0 });
      setSubdomains(data.filters?.subdomains || []);
      setPagination({
        current: data.pagination?.page || page,
        pageSize: data.pagination?.limit || pageSize,
        total: data.pagination?.total || 0,
      });
      syncSearchParams(nextFilters, data.pagination?.page || page, data.pagination?.limit || pageSize);
    } catch (error) {
      message.error(
        error?.response?.data?.message || "Failed to load admin products.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const page = Number(searchParams.get("page")) || 1;
    const pageSize = Number(searchParams.get("limit")) || 20;
    fetchProducts({ page, pageSize, nextFilters: filters });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleStatusChange = async (record, action) => {
    try {
      await Axios.patch(
        `${ADMIN_BASE_URL}/products/${record.id}/status`,
        { action },
        { headers: getAuthHeaders(token) },
      );

      message.success(
        action === "activate"
          ? "Product activated successfully."
          : "Product deactivated successfully.",
      );
      fetchProducts();
    } catch (error) {
      message.error(
        error?.response?.data?.message || "Failed to update product status.",
      );
    }
  };

  const handleDelete = async (record) => {
    try {
      await Axios.delete(`${ADMIN_BASE_URL}/products/${record.id}`, {
        headers: getAuthHeaders(token),
      });

      message.success("Product deleted successfully.");
      fetchProducts();
    } catch (error) {
      message.error(
        error?.response?.data?.message || "Failed to delete product.",
      );
    }
  };

  const columns = useMemo(
    () => [
      {
        title: "Image",
        key: "thumbnail",
        render: (_, record) =>
          record.thumbnail ? (
            <img
              src={record.thumbnail}
              alt={record.name}
              style={{
                width: 52,
                height: 52,
                objectFit: "cover",
                borderRadius: 8,
              }}
            />
          ) : (
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 8,
                background: "#f5f5f5",
              }}
            />
          ),
      },
      {
        title: "Product",
        key: "product",
        render: (_, record) => (
          <div>
            <div style={{ fontWeight: 600 }}>{record.name || "Untitled Product"}</div>
            <div style={{ fontSize: 12, color: "#666" }}>{record.productCode}</div>
          </div>
        ),
      },
      {
        title: "Service",
        key: "service",
        render: (_, record) => record.subdomain?.label || record.subdomain?.name || "N/A",
      },
      {
        title: "Store",
        key: "store",
        render: (_, record) => record.store?.name || "N/A",
      },
      {
        title: "Seller",
        key: "seller",
        render: (_, record) => record.seller?.name || record.seller?.email || "N/A",
      },
      {
        title: "Price",
        key: "price",
        render: (_, record) => `$${Number(record.basePrice || 0).toLocaleString()}`,
      },
      {
        title: "Status",
        key: "status",
        render: (_, record) =>
          record.isActive ? <Tag color="green">ACTIVE</Tag> : <Tag color="red">INACTIVE</Tag>,
      },
      {
        title: "Created",
        key: "createdAt",
        render: (_, record) =>
          record.createdAt ? new Date(record.createdAt).toLocaleDateString() : "N/A",
      },
      {
        title: "Actions",
        key: "actions",
        render: (_, record) => (
          <Space wrap>
            <Button
              type="link"
              onClick={() => navigate(`/dashboard/products/${record.id}`)}
            >
              View
            </Button>
            {record.isActive ? (
              <Button onClick={() => handleStatusChange(record, "deactivate")}>
                Deactivate
              </Button>
            ) : (
              <Button
                style={{ color: "#41CCC7", borderColor: "#41CCC7" }}
                onClick={() => handleStatusChange(record, "activate")}
              >
                Activate
              </Button>
            )}
            <Popconfirm
              title="Delete this product?"
              description="This removes the product and its related media/options."
              okButtonProps={{ danger: true }}
              onConfirm={() => handleDelete(record)}
            >
              <Button danger>Delete</Button>
            </Popconfirm>
          </Space>
        ),
      },
    ],
    [navigate, token],
  );

  return (
    <div style={{ padding: 20 }}>
      <div className="flex flex-justify-between flex-align" style={{ marginBottom: 20 }}>
        <h1>Products</h1>
        <Button onClick={() => navigate("/dashboard")}>Back to Dashboard</Button>
      </div>

      <div className="flex" style={{ gap: 20, marginBottom: 20, flexWrap: "wrap" }}>
        <UserMatrxs
          matrix={summary.total}
          title="All Products"
          border={true}
          onClick={() => {
            const nextFilters = { ...filters, status: "all" };
            setFilters(nextFilters);
            fetchProducts({ page: 1, nextFilters });
          }}
        />
        <UserMatrxs
          matrix={summary.active}
          title="Active Products"
          border={true}
          onClick={() => {
            const nextFilters = { ...filters, status: "active" };
            setFilters(nextFilters);
            fetchProducts({ page: 1, nextFilters });
          }}
        />
        <UserMatrxs
          matrix={summary.inactive}
          title="Inactive Products"
          border={true}
          onClick={() => {
            const nextFilters = { ...filters, status: "inactive" };
            setFilters(nextFilters);
            fetchProducts({ page: 1, nextFilters });
          }}
        />
      </div>

      <div className="flex flex-align" style={{ gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
        <Search
          allowClear
          placeholder="Search name, product code, or description"
          value={filters.search}
          onChange={(event) =>
            setFilters((currentFilters) => ({
              ...currentFilters,
              search: event.target.value,
            }))
          }
          onSearch={(value) => {
            const nextFilters = { ...filters, search: value.trim() };
            setFilters(nextFilters);
            fetchProducts({ page: 1, nextFilters });
          }}
          style={{ width: 320 }}
        />

        <Select
          value={filters.status}
          style={{ width: 180 }}
          onChange={(value) => {
            const nextFilters = { ...filters, status: value };
            setFilters(nextFilters);
            fetchProducts({ page: 1, nextFilters });
          }}
          options={[
            { value: "all", label: "All Statuses" },
            { value: "active", label: "Active" },
            { value: "inactive", label: "Inactive" },
          ]}
        />

        <Select
          allowClear
          placeholder="Filter by service"
          value={filters.subdomainId}
          style={{ width: 240 }}
          onChange={(value) => {
            const nextFilters = { ...filters, subdomainId: value || undefined };
            setFilters(nextFilters);
            fetchProducts({ page: 1, nextFilters });
          }}
          options={subdomains.map((subdomain) => ({
            value: String(subdomain.id),
            label: subdomain.label || subdomain.name,
          }))}
        />
      </div>

      <Table
        rowKey="id"
        loading={loading}
        dataSource={products}
        columns={columns}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          showSizeChanger: true,
        }}
        onChange={(nextPagination) => {
          fetchProducts({
            page: nextPagination.current,
            pageSize: nextPagination.pageSize,
          });
        }}
      />
    </div>
  );
};

export default ProductsPage;
