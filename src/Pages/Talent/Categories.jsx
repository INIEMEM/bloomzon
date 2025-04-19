import React, { useEffect, useState } from "react";
import { Table, Card, Spin } from "antd";
import axios from "axios";
import { motion } from "framer-motion";

import { Button } from "antd";
import CategoryTable from "./CategoryTable";
import CategoryCardGrid from "./CategoryGrid";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("table"); // 'table' or 'card'

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.post(
          "https://api-bloomzon-com.onrender.com/getAllCategory/"
        );
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "20%" }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{padding:20}}
    >
      <div style={{ marginBottom: "20px", textAlign: "right" }}>
        <Button onClick={() => setView("table")} style={{ marginRight: "10px" }}>
          Table View
        </Button>
        <Button onClick={() => setView("card")}>Card View</Button>
      </div>
      {view === "table" ? (
        <CategoryTable categories={categories} />
      ) : (
        <CategoryCardGrid categories={categories} />
      )}
    </motion.div>
  );
};

export default Categories