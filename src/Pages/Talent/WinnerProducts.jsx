import React, { useEffect, useMemo, useState } from "react";
import { Card, Col, Empty, Row, Statistic, Table, Tag } from "antd";
import { motion } from "framer-motion";
import axios from "axios";
import { REGISTRY_BASE_URL } from "../../api/config";

const ProductDisplay = () => {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await axios.get(`${REGISTRY_BASE_URL}/WinnersProduct/`);
      setProducts(response.data?.result || []);
    };

    fetchProducts();
  }, []);

  const categories = useMemo(() => {
    const counts = products.reduce((acc, product) => {
      const key = product.type || "uncategorized";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(counts);
  }, [products]);

  const filteredProducts = selectedCategory
    ? products.filter((product) => product.type === selectedCategory)
    : products;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: 20 }}>
      <h1>Winner Products</h1>

      <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
        {categories.map(([category, count]) => (
          <Col xs={24} sm={12} md={8} lg={6} key={category}>
            <Card onClick={() => setSelectedCategory(category)} style={{ cursor: "pointer" }}>
              <Statistic title={category} value={count} />
            </Card>
          </Col>
        ))}
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card onClick={() => setSelectedCategory(null)} style={{ cursor: "pointer" }}>
            <Statistic title="All" value={products.length} />
          </Card>
        </Col>
      </Row>

      {filteredProducts.length ? (
        <Table
          dataSource={filteredProducts}
          rowKey="id"
          className="admin-table"
          columns={[
            { title: "ID", dataIndex: "id", key: "id" },
            { title: "Title", dataIndex: "title", key: "title" },
            { title: "Type", dataIndex: "type", key: "type" },
            {
              title: "Price",
              dataIndex: "price",
              key: "price",
              render: (value) => value || "0",
            },
            {
              title: "Stock",
              dataIndex: "inStock",
              key: "inStock",
              render: (value) => (
                <Tag color={String(value).toUpperCase() === "YES" ? "green" : "orange"}>
                  {String(value || "unknown").toUpperCase()}
                </Tag>
              ),
            },
          ]}
        />
      ) : (
        <Empty description="No winner products found" />
      )}
    </motion.div>
  );
};

export default ProductDisplay;
