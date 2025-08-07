import React, { useState } from "react";
import { Table, Button, Tag, Modal, Select, Input, Checkbox } from "antd";
import { motion } from "framer-motion";

const { Option } = Select;

const mockProducts = [
  {
    key: "1",
    name: "Hydrating Facial Serum",
    vendor: "Glow Beauty",
    approved: false,
    show: "Beauty Friday Deals",
  },
  {
    key: "2",
    name: "Wireless Earbuds",
    vendor: "Tech Essentials",
    approved: true,
    show: "Gadget Bonanza",
  },
];

const ProductsOnTV = () => {
  const [products, setProducts] = useState(mockProducts);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const showModal = (record) => {
    setSelectedProduct(record);
    setIsModalVisible(true);
  };

  const handleClose = () => {
    setIsModalVisible(false);
    setSelectedProduct(null);
  };

  const toggleApproval = (key) => {
    setProducts((prev) =>
      prev.map((p) => (p.key === key ? { ...p, approved: !p.approved } : p))
    );
  };

  const columns = [
    {
      title: "Product",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Vendor",
      dataIndex: "vendor",
      key: "vendor",
    },
    {
      title: "Linked Show",
      dataIndex: "show",
      key: "show",
    },
    {
      title: "Status",
      dataIndex: "approved",
      key: "approved",
      render: (approved) => (
        <Tag color={approved ? "green" : "red"}>{approved ? "Approved" : "Pending"}</Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button onClick={() => showModal(record)}>Edit</Button>
      ),
    },
  ];

  return (
    <div className="bg-white p-4 rounded shadow">
      <Table columns={columns} dataSource={products} />

      <Modal
        title="Edit Product on TV"
        open={isModalVisible}
        onCancel={handleClose}
        onOk={handleClose}
        footer={null}
      >
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <p><strong>Product:</strong> {selectedProduct.name}</p>
            <p><strong>Vendor:</strong> {selectedProduct.vendor}</p>
            <Select
              className="w-full"
              defaultValue={selectedProduct.show}
              onChange={(val) => setSelectedProduct({ ...selectedProduct, show: val })}
            >
              <Option value="Beauty Friday Deals">Beauty Friday Deals</Option>
              <Option value="Gadget Bonanza">Gadget Bonanza</Option>
            </Select>
            <Checkbox
              checked={selectedProduct.approved}
              onChange={() => toggleApproval(selectedProduct.key)}
            >
              Approved for TV
            </Checkbox>
            <div className="flex justify-end gap-2">
              <Button onClick={handleClose}>Cancel</Button>
              <Button type="primary" onClick={handleClose}>
                Save Changes
              </Button>
            </div>
          </motion.div>
        )}
      </Modal>
    </div>
  );
};

export default ProductsOnTV;
