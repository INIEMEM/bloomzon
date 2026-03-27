import React, { useContext, useEffect, useMemo, useState } from "react";
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
import { MainContext } from "../../Context/Context";
import { ADMIN_BASE_URL, getAuthHeaders } from "../../api/config";

const ProductDetailsPage = () => {
  const { token } = useContext(MainContext);
  const { productId } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);

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
              {product.createdAt
                ? new Date(product.createdAt).toLocaleString()
                : "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Updated">
              {product.updatedAt
                ? new Date(product.updatedAt).toLocaleString()
                : "N/A"}
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

      <Card title="Metadata" style={{ marginTop: 20 }}>
        <pre
          style={{
            margin: 0,
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            background: "#fafafa",
            padding: 16,
            borderRadius: 8,
          }}
        >
          {JSON.stringify(product.metadata || product.raw?.metadata || {}, null, 2)}
        </pre>
      </Card>
    </div>
  );
};

export default ProductDetailsPage;
