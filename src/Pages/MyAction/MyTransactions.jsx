import React, { useState, useEffect, useContext } from "react";
import { Table, Input, notification, DatePicker, Select, Card, Row, Col } from "antd";
import Axios from "axios";
import { motion } from "framer-motion";
import { MainContext } from "../../Context/Context";
import { useNavigate } from "react-router-dom";
const { RangePicker } = DatePicker;
const { Option } = Select;

const MyTransactions = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { baseUrl, token } = useContext(MainContext);
  const navigate = useNavigate()
  const [totals, setTotals] = useState({
    totalAmount: 0,
    withdrawal: 0,
    deposit: 0,
    transfer: 0,
  });

  // Fetch all transactions
  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const response = await Axios({
          method: "get",
          url: `${baseUrl}api/v1/transaction`,
          headers: {
            Authorization: "Bearer " + token,
          },
        });

        if (response.data.success) {
          const transactions = response.data.data;

          // Calculate totals
          const totalAmount = transactions.reduce((acc, curr) => acc + curr.amount, 0);
          const withdrawal = transactions
            .filter((item) => item.category === "withdrawal")
            .reduce((acc, curr) => acc + curr.amount, 0);
          const deposit = transactions
            .filter((item) => item.category === "deposit")
            .reduce((acc, curr) => acc + curr.amount, 0);
          const transfer = transactions
            .filter((item) => item.category === "transfer")
            .reduce((acc, curr) => acc + curr.amount, 0);

          setTotals({ totalAmount, withdrawal, deposit, transfer });

          setData(transactions);
          setFilteredData(transactions);
        } else {
          notification.error({ message: "Failed to fetch transactions" });
        }
      } catch (error) {
        console.error(error);
        notification.error({ message: "Error fetching transactions" });
        if(error?.response?.statusText == "Unauthorized"){
          navigate('../../')
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [baseUrl, token]);

  // Filter by search term
  const handleSearch = (value) => {
    setSearchTerm(value);
    const filtered = data.filter((item) =>
      `${item.User.firstname} ${item.User.lastname}`
        .toLowerCase()
        .includes(value.toLowerCase())
    );
    setFilteredData(filtered);
  };

  // Table columns
  const columns = [
    {
      title: "S/N",
      dataIndex: "sn",
      key: "sn",
      render: (text, record, index) => index + 1,
    },
    {
      title: "First Name",
      dataIndex: ["User", "firstname"],
      key: "firstname",
    },
    {
      title: "Last Name",
      dataIndex: ["User", "lastname"],
      key: "lastname",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount) => `₦${amount.toLocaleString()}`,
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt) =>
        new Date(createdAt).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }),
    },
  ];

  // Framer Motion page transition
  const pageVariants = {
    initial: { opacity: 0, x: "5vw" },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: "5vw" },
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={{ duration: 0.5 }}
    >
      <div style={{ padding: "20px" }}>
        <h1>Transaction History</h1>

        {/* Transaction Cards */}
        <Row gutter={[16, 16]} style={{ marginBottom: "20px" }}>
          <Col xs={24} sm={12} md={6}>
            <Card title="Total Amount" bordered={false} style={{ textAlign: "center" }}>
              <h2>₦{totals.totalAmount.toLocaleString()}</h2>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card title="Withdrawals" bordered={false} style={{ textAlign: "center" }}>
              <h2>₦{totals.withdrawal.toLocaleString()}</h2>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card title="Deposits" bordered={false} style={{ textAlign: "center" }}>
              <h2>₦{totals.deposit.toLocaleString()}</h2>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card title="Transfers" bordered={false} style={{ textAlign: "center" }}>
              <h2>₦{totals.transfer.toLocaleString()}</h2>
            </Card>
          </Col>
        </Row>

        {/* Filters */}
        <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
          <Input
            placeholder="Search by first or last name"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            style={{ width: "300px" }}
          />
          <RangePicker />
          <Select
            placeholder="Select category"
            style={{ width: "200px" }}
          >
            <Option value="withdrawal">Withdrawal</Option>
            <Option value="deposit">Deposit</Option>
            <Option value="transfer">Transfer</Option>
          </Select>
        </div>

        {/* Transactions Table */}
        <Table
          columns={columns}
          dataSource={filteredData}
          loading={loading}
          rowKey="id"
          className="admin-table"
          bordered
        />
      </div>
    </motion.div>
  );
};

export default MyTransactions;
