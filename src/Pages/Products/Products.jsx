import { useContext, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Select,
  Space,
  Table,
  Tag,
  Upload,
  message,
} from "antd";
import {
  ArrowLeftOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { useNavigate, useSearchParams } from "react-router-dom";

import UserMatrxs from "../../Components/UserMatrixs/UserMatrxs";
import { MainContext } from "../../Context/MainContext";
import * as AdminAPI from "../../api/admin";

const { Search, TextArea } = Input;

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

const flattenSubdomainCategories = (hierarchy) => {
  const categories = Array.isArray(hierarchy?.mainCategories)
    ? hierarchy.mainCategories
    : [];

  return categories.map((category) => ({
    id: Number(category.id),
    name: category.name || "",
    label: category.label || category.name || "",
    subcategories: Array.isArray(category.categorySubcategories)
      ? category.categorySubcategories.map((subcategory) => ({
          id: Number(subcategory.id),
          name: subcategory.name || "",
          label: subcategory.label || subcategory.name || "",
          category_id: Number(subcategory.category_id || category.id),
        }))
      : [],
  }));
};

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
  const [filterSubdomains, setFilterSubdomains] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [stores, setStores] = useState([]);
  const [serviceOptions, setServiceOptions] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [collections, setCollections] = useState([]);
  const [catalogHierarchy, setCatalogHierarchy] = useState(null);
  const [fetchingStores, setFetchingStores] = useState(false);
  const [loadingLookups, setLoadingLookups] = useState(false);
  const [loadingCollections, setLoadingCollections] = useState(false);
  const [loadingHierarchy, setLoadingHierarchy] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageUrls, setImageUrls] = useState([]);
  const [form] = Form.useForm();
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

  const selectedSubdomainId = Form.useWatch("subdomain_id", form);
  const selectedCategoryId = Form.useWatch("category_id", form);

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

      const data = await AdminAPI.fetchAdminProducts(token, {
        page,
        limit: pageSize,
        search: nextFilters.search || undefined,
        status: nextFilters.status || "all",
        subdomainId: nextFilters.subdomainId || undefined,
      });

      setProducts(data.items || []);
      setSummary(
        data.summary || { total: 0, active: 0, inactive: 0, filtered: 0 },
      );
      setFilterSubdomains(data.filters?.subdomains || []);
      setPagination({
        current: data.pagination?.page || page,
        pageSize: data.pagination?.limit || pageSize,
        total: data.pagination?.total || 0,
      });
      syncSearchParams(
        nextFilters,
        data.pagination?.page || page,
        data.pagination?.limit || pageSize,
      );
    } catch (error) {
      message.error(
        error?.response?.data?.message || "Failed to load admin products.",
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchStores = async (search = "") => {
    try {
      setFetchingStores(true);
      const data = await AdminAPI.fetchAdminStores(token, {
        search: search.trim() || undefined,
        limit: 100,
      });
      setStores(data?.items || []);
    } catch (error) {
      console.error("Failed to fetch stores:", error);
    } finally {
      setFetchingStores(false);
    }
  };

  const loadCatalogHierarchy = async (subdomainId) => {
    if (!subdomainId) {
      setCatalogHierarchy(null);
      return;
    }

    try {
      setLoadingHierarchy(true);
      const response = await AdminAPI.fetchSubdomainCategoryHierarchy(
        token,
        Number(subdomainId),
      );

      if (response?.success) {
        setCatalogHierarchy(response.data || null);
      } else {
        setCatalogHierarchy(null);
      }
    } catch (error) {
      console.error("Failed to load catalog hierarchy:", error);
      setCatalogHierarchy(null);
    } finally {
      setLoadingHierarchy(false);
    }
  };

  const loadCollections = async (storeId) => {
    if (!storeId) {
      setCollections([]);
      return;
    }

    try {
      setLoadingCollections(true);
      const data = await AdminAPI.fetchStoreCollections(token, Number(storeId));
      setCollections(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load store collections:", error);
      setCollections([]);
    } finally {
      setLoadingCollections(false);
    }
  };

  const resetAddProductModal = () => {
    form.resetFields();
    form.setFieldsValue({
      currency_id: 238,
      weight: 0.1,
    });
    setCollections([]);
    setCatalogHierarchy(null);
    setImageUrls([]);
  };

  const openAddModal = async () => {
    try {
      setLoadingLookups(true);
      setIsAddModalOpen(true);
      resetAddProductModal();

      const [currenciesData, subdomainsData] = await Promise.all([
        AdminAPI.fetchAdminCurrencies(token),
        AdminAPI.fetchAdminSubdomains(token),
      ]);

      setCurrencies(Array.isArray(currenciesData) ? currenciesData : []);
      setServiceOptions(Array.isArray(subdomainsData) ? subdomainsData : []);
      await fetchStores();
    } catch (error) {
      message.error(
        error?.response?.data?.message ||
          "Failed to load product creation lookups.",
      );
    } finally {
      setLoadingLookups(false);
    }
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
    resetAddProductModal();
  };

  const handleSubdomainChange = async (value) => {
    form.setFieldsValue({
      store_id: undefined,
      category_id: undefined,
      subcategory_id: undefined,
      collection_id: undefined,
    });
    setCollections([]);
    await loadCatalogHierarchy(value);
  };

  const handleStoreChange = async (storeId) => {
    const nextStore = stores.find((store) => Number(store.id) === Number(storeId));
    const storeSubdomainId = Number(
      nextStore?.subdomain?.id || nextStore?.subdomain_id || 0,
    );

    form.setFieldValue("collection_id", undefined);

    if (storeSubdomainId) {
      const currentSubdomainId = Number(form.getFieldValue("subdomain_id") || 0);
      if (storeSubdomainId !== currentSubdomainId) {
        form.setFieldsValue({
          subdomain_id: storeSubdomainId,
          category_id: undefined,
          subcategory_id: undefined,
        });
        await loadCatalogHierarchy(storeSubdomainId);
      }
    }

    await loadCollections(storeId);
  };

  const handleImageUpload = async (file) => {
    try {
      setUploadingImage(true);
      const url = await AdminAPI.uploadRetailerProductImage(token, file);
      if (!url) {
        throw new Error("Upload did not return a URL.");
      }

      setImageUrls((current) =>
        current.includes(url) ? current : [...current, url],
      );
      message.success("Product image uploaded.");
    } catch (error) {
      message.error(error?.message || "Failed to upload product image.");
    } finally {
      setUploadingImage(false);
    }

    return false;
  };

  const handleCreateProduct = async () => {
    try {
      const values = await form.validateFields();
      setSaving(true);

      const specifications = parseSpecificationsText(values.specifications_text);
      const payload = {
        identifiers: {
          store_id: Number(values.store_id),
          subcategory_id: Number(values.subcategory_id),
          currency_id: Number(values.currency_id || 238),
          ...(values.collection_id
            ? { collection_id: Number(values.collection_id) }
            : {}),
        },
        basic_info: {
          name: values.name.trim(),
          description: values.description.trim(),
          weight: Number(values.weight ?? 0.1),
        },
        pricing: {
          base_price: Number(values.base_price),
        },
        ...(specifications.length
          ? {
              metadata: {
                specifications,
              },
            }
          : {}),
        ...(imageUrls.length
          ? {
              medias: imageUrls.map((url) => ({
                url,
                type: "image",
              })),
            }
          : {}),
      };

      const response = await AdminAPI.createAdminProduct(token, payload);

      if (response?.success) {
        message.success("Product created successfully.");
        closeAddModal();
        fetchProducts();
        return;
      }

      message.error(response?.message || "Failed to create product.");
    } catch (error) {
      message.error(
        error?.response?.data?.message || "Failed to create product.",
      );
    } finally {
      setSaving(false);
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
      await AdminAPI.updateAdminProductStatus(token, record.id, action);

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
      await AdminAPI.deleteAdminProduct(token, record.id);
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
            <div style={{ fontWeight: 600 }}>
              {record.name || "Untitled Product"}
            </div>
            <div style={{ fontSize: 12, color: "#666" }}>
              {record.productCode}
            </div>
          </div>
        ),
      },
      {
        title: "Service",
        key: "service",
        render: (_, record) =>
          record.subdomain?.label || record.subdomain?.name || "N/A",
      },
      {
        title: "Store",
        key: "store",
        render: (_, record) => record.store?.name || "N/A",
      },
      {
        title: "Seller",
        key: "seller",
        render: (_, record) =>
          record.seller?.name || record.seller?.email || "N/A",
      },
      {
        title: "Price",
        key: "price",
        render: (_, record) =>
          `$${Number(record.basePrice || 0).toLocaleString()}`,
      },
      {
        title: "Status",
        key: "status",
        render: (_, record) =>
          record.isActive ? (
            <Tag color="green">ACTIVE</Tag>
          ) : (
            <Tag color="red">INACTIVE</Tag>
          ),
      },
      {
        title: "Created",
        key: "createdAt",
        render: (_, record) =>
          record.createdAt
            ? new Date(record.createdAt).toLocaleDateString()
            : "N/A",
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
              View / Edit
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

  const availableStores = useMemo(() => {
    if (!selectedSubdomainId) {
      return stores;
    }

    return stores.filter(
      (store) =>
        Number(store.subdomain?.id || store.subdomain_id || 0) ===
        Number(selectedSubdomainId),
    );
  }, [selectedSubdomainId, stores]);

  const catalogCategories = useMemo(
    () => flattenSubdomainCategories(catalogHierarchy),
    [catalogHierarchy],
  );

  const availableSubcategories = useMemo(() => {
    if (!selectedCategoryId) {
      return [];
    }

    const category = catalogCategories.find(
      (item) => Number(item.id) === Number(selectedCategoryId),
    );

    return category?.subcategories || [];
  }, [catalogCategories, selectedCategoryId]);

  return (
    <div style={{ padding: 20 }}>
      <div
        className="flex flex-justify-between flex-align"
        style={{ marginBottom: 20 }}
      >
        <h1>Products</h1>
        <Space>
          <Button type="primary" icon={<PlusOutlined />} onClick={openAddModal}>
            Add Product
          </Button>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate("/dashboard")}
          >
            Back to Dashboard
          </Button>
        </Space>
      </div>

      <div
        className="flex"
        style={{ gap: 20, marginBottom: 20, flexWrap: "wrap" }}
      >
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

      <div
        className="flex flex-align"
        style={{ gap: 12, marginBottom: 16, flexWrap: "wrap" }}
      >
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
            const nextFilters = {
              ...filters,
              subdomainId: value || undefined,
            };
            setFilters(nextFilters);
            fetchProducts({ page: 1, nextFilters });
          }}
          options={filterSubdomains.map((subdomain) => ({
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

      <Modal
        title="Create New Product"
        open={isAddModalOpen}
        onCancel={closeAddModal}
        onOk={handleCreateProduct}
        confirmLoading={saving}
        width={920}
        destroyOnHidden
      >
        <Alert
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
          message="Server-backed product creation"
          description="This form now uses the existing admin product endpoint. Service, store, category, subcategory, collection, currency, and images are pulled from live backend data."
        />

        <Form form={form} layout="vertical">
          <div
            style={{
              display: "grid",
              gap: 16,
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            }}
          >
            <Form.Item
              name="subdomain_id"
              label="Service"
              rules={[{ required: true, message: "Select a service." }]}
            >
              <Select
                showSearch
                optionFilterProp="label"
                placeholder="Select product service"
                loading={loadingLookups}
                onChange={handleSubdomainChange}
                options={serviceOptions.map((item) => ({
                  label: item.label || item.name,
                  value: Number(item.id),
                }))}
              />
            </Form.Item>

            <Form.Item
              name="store_id"
              label="Store"
              rules={[{ required: true, message: "Select a store." }]}
            >
              <Select
                showSearch
                optionFilterProp="label"
                placeholder="Select store"
                loading={fetchingStores}
                filterOption={false}
                onSearch={fetchStores}
                onChange={handleStoreChange}
                options={availableStores.map((store) => ({
                  value: Number(store.id),
                  label: `${store.name} · ${store.subdomain?.label || store.subdomain?.name || "Unknown service"} · ${store.seller?.name || store.seller?.email || "Unknown seller"}`,
                }))}
                notFoundContent={
                  selectedSubdomainId
                    ? "No stores found for the selected service."
                    : "Search or choose a service first."
                }
              />
            </Form.Item>

            <Form.Item
              name="category_id"
              label="Category"
              rules={[{ required: true, message: "Select a category." }]}
            >
              <Select
                showSearch
                optionFilterProp="label"
                placeholder="Select category"
                loading={loadingHierarchy}
                disabled={!selectedSubdomainId}
                onChange={() => form.setFieldValue("subcategory_id", undefined)}
                options={catalogCategories.map((category) => ({
                  label: category.label,
                  value: Number(category.id),
                }))}
                notFoundContent={
                  selectedSubdomainId
                    ? "No categories configured for this service."
                    : "Select a service first."
                }
              />
            </Form.Item>

            <Form.Item
              name="subcategory_id"
              label="Subcategory"
              rules={[{ required: true, message: "Select a subcategory." }]}
            >
              <Select
                showSearch
                optionFilterProp="label"
                placeholder="Select subcategory"
                loading={loadingHierarchy}
                disabled={!selectedCategoryId}
                options={availableSubcategories.map((subcategory) => ({
                  label: subcategory.label,
                  value: Number(subcategory.id),
                }))}
                notFoundContent={
                  selectedCategoryId
                    ? "No subcategories configured for this category."
                    : "Select a category first."
                }
              />
            </Form.Item>

            <Form.Item
              name="name"
              label="Product Name"
              rules={[{ required: true, message: "Enter a product name." }]}
            >
              <Input placeholder="e.g. iPhone 15 Pro" />
            </Form.Item>

            <Form.Item
              name="collection_id"
              label="Collection"
              extra="Optional store-level grouping."
            >
              <Select
                allowClear
                showSearch
                optionFilterProp="label"
                placeholder="Select collection"
                loading={loadingCollections}
                disabled={!form.getFieldValue("store_id")}
                options={collections.map((collection) => ({
                  label: collection.label || collection.name,
                  value: Number(collection.id),
                }))}
              />
            </Form.Item>

            <Form.Item
              name="base_price"
              label="Base Price"
              rules={[{ required: true, message: "Enter base price." }]}
            >
              <InputNumber
                min={0.01}
                step={0.01}
                style={{ width: "100%" }}
                placeholder="0.00"
              />
            </Form.Item>

            <Form.Item
              name="currency_id"
              label="Currency"
              rules={[{ required: true, message: "Select a currency." }]}
            >
              <Select
                showSearch
                optionFilterProp="label"
                placeholder="Select currency"
                loading={loadingLookups}
                options={currencies.map((currency) => ({
                  label: `${currency.code || currency.name}${currency.symbol ? ` (${currency.symbol})` : ""}`,
                  value: Number(currency.id),
                }))}
              />
            </Form.Item>

            <Form.Item
              name="weight"
              label="Weight"
              rules={[{ required: true, message: "Enter product weight." }]}
            >
              <InputNumber min={0} step={0.1} style={{ width: "100%" }} />
            </Form.Item>
          </div>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: "Enter a description." }]}
          >
            <TextArea rows={4} placeholder="Product description" />
          </Form.Item>

          <Form.Item
            name="specifications_text"
            label="Specifications"
            extra="Optional. One per line using Name:Value format."
          >
            <TextArea rows={4} placeholder={"Color:Black\nMaterial:Cotton"} />
          </Form.Item>

          <div style={{ marginBottom: 12 }}>
            <Space wrap>
              {imageUrls.map((url) => (
                <Tag
                  key={url}
                  closable
                  onClose={() =>
                    setImageUrls((current) =>
                      current.filter((item) => item !== url),
                    )
                  }
                >
                  {url.length > 48 ? `${url.slice(0, 45)}...` : url}
                </Tag>
              ))}
            </Space>
          </div>

          <Upload
            multiple
            showUploadList={false}
            beforeUpload={handleImageUpload}
          >
            <Button icon={<UploadOutlined />} loading={uploadingImage}>
              Upload product images
            </Button>
          </Upload>
        </Form>
      </Modal>
    </div>
  );
};

export default ProductsPage;
