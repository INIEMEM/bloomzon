import React, { useEffect, useState, useContext } from "react";
import { Table, Card, Spin, Typography, Input, Button } from "antd";
import { MainContext } from "../../Context/Context";
import Axios from "axios";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;
const { Search } = Input;

const PaymentOptionsPage = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]); // For search filtering
  const [expandedRows, setExpandedRows] = useState([]); // To track expanded rows
  const { baseUrl, token } = useContext(MainContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPaymentOptions = async () => {
      try {
        const response = await Axios({
          method: "get",
          url: `${baseUrl}api/v1/paymentoption`,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(response.data.data);
        setFilteredUsers(response.data.data); // Initialize filtered users
        setLoading(false);
      } catch (error) {
        console.error("Error fetching payment options:", error);
        if(error?.response?.statusText == "Unauthorized"){
          navigate('../../')
        }
        setLoading(false);
      }
    };

    fetchPaymentOptions();
  }, [baseUrl, token]);

  const handleSearch = (value) => {
    const filteredData = users.filter((user) => {
      const fullName = `${user.firstname} ${user.lastname}`.toLowerCase();
      return (
        fullName.includes(value.toLowerCase()) ||
        user.email.toLowerCase().includes(value.toLowerCase())
      );
    });
    setFilteredUsers(filteredData);
  };

  const toggleExpandRow = (recordId) => {
    if (expandedRows.includes(recordId)) {
      setExpandedRows(expandedRows.filter((id) => id !== recordId));
    } else {
      setExpandedRows([...expandedRows, recordId]);
    }
  };

  const handleNavigate = (optionId) => {
    navigate(`/dashboard/sellers/paymentOptions/${optionId}`);
  };

  const columns = [
    {
      title: "S/N",
      key: "serialNumber",
      render: (_, __, index) => index + 1, // Add serial number based on the index
    },
    {
      title: "User Name",
      dataIndex: "name",
      key: "name",
      render: (_, record) => `${record.firstname} ${record.lastname}`,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Payment Options",
      key: "paymentOptions",
      render: (_, record) => {
        const isExpanded = expandedRows.includes(record.id);
        const visibleOptions = isExpanded
          ? record.PaymentOptions
          : record.PaymentOptions.slice(0, 1); // Show only one by default

        return (
          <>
            {visibleOptions.map((option) => (
              <Card
                key={option.id}
                style={{
                  marginBottom: "10px",
                  border: "1px solid #f0f0f0",
                  cursor: "pointer",
                }}
                onClick={() => handleNavigate(option.id)} // Navigate on click
              >
                <p>
                  <strong>Type:</strong> {option.type}
                </p>
                <p>
                  <strong>Name:</strong> {option.name}
                </p>
                <p>
                  <strong>Number:</strong> {option.number}
                </p>
                <p>
                  <strong>Expiration:</strong>{" "}
                  {new Date(option.expiration).toLocaleDateString()}
                </p>
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(option.createdAt).toLocaleString()}
                </p>
              </Card>
            ))}
            {record.PaymentOptions.length > 1 && (
              <Button
                type="link"
                onClick={() => toggleExpandRow(record.id)}
                style={{ marginTop: "5px" }}
              >
                {isExpanded ? "View Less" : "View More"}
              </Button>
            )}
          </>
        );
      },
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <Title level={3}>Payment Options</Title>
      <Search
        placeholder="Search by name or email"
        onSearch={handleSearch}
        enterButton
        style={{ marginBottom: "20px", maxWidth: "400px" }}
      />
      {loading ? (
        <Spin size="large" />
      ) : (
        <Table
          rowKey="id"
          dataSource={filteredUsers}
          columns={columns}
          pagination={{ pageSize: 5 }}
          bordered
          className="admin-table"
        />
      )}
    </div>
  );
};

export default PaymentOptionsPage;
