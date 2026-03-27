import React, { useContext, useEffect, useMemo, useState } from "react";
import { Button, Input, Space, Table, message } from "antd";
import Axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import UserMatrxs from "../../Components/UserMatrixs/UserMatrxs";
import { MainContext } from "../../Context/Context";
import { ADMIN_BASE_URL, getAuthHeaders } from "../../api/config";

const { Search } = Input;

const AllSellers = () => {
  const { token } = useContext(MainContext);
  const navigate = useNavigate();
  const location = useLocation();
  const isUserScreen = location.pathname.includes("/dashboard/user/all");
  const role = isUserScreen ? "all" : "seller";

  const [users, setUsers] = useState([]);
  const [visibleUsers, setVisibleUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const title = isUserScreen ? "All Users" : "All Sellers";

  const applyLocalFilters = (items, query, type = "all") => {
    const normalizedQuery = query.trim().toLowerCase();

    let filtered = items.filter((item) => {
      if (!normalizedQuery) {
        return true;
      }

      return (
        `${item.firstname || ""} ${item.lastname || ""}`
          .toLowerCase()
          .includes(normalizedQuery) ||
        String(item.email || "").toLowerCase().includes(normalizedQuery) ||
        String(item.phone || "").toLowerCase().includes(normalizedQuery)
      );
    });

    if (type === "suspended") {
      filtered = filtered.filter((item) => item.adminLocked);
    }

    if (type === "active") {
      filtered = filtered.filter(
        (item) => !item.adminLocked && !item.adminBanned,
      );
    }

    if (type === "banned") {
      filtered = filtered.filter((item) => item.adminBanned);
    }

    return filtered;
  };

  const fetchUsers = async (query = "") => {
    try {
      setLoading(true);
      const response = await Axios.get(`${ADMIN_BASE_URL}/users`, {
        headers: getAuthHeaders(token),
        params: {
          role,
          page: 1,
          limit: 100,
          search: query || undefined,
        },
      });

      const items = response.data?.data?.items || [];
      setUsers(items);
      setVisibleUsers(applyLocalFilters(items, query));
    } catch (error) {
      message.error("Failed to fetch admin users.");
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        navigate("/");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [role]);

  const handleAction = async (action, userId, name) => {
    try {
      await Axios.patch(
        `${ADMIN_BASE_URL}/users/${userId}/access`,
        { action },
        { headers: getAuthHeaders(token) },
      );

      message.success(`${name}'s account was updated successfully.`);
      fetchUsers(searchQuery);
    } catch (error) {
      message.error(
        error?.response?.data?.message || "Failed to update account access.",
      );
    }
  };

  const filterUsers = (type) => {
    setVisibleUsers(applyLocalFilters(users, searchQuery, type));
  };

  const handleSearch = (value) => {
    setSearchQuery(value);
    setVisibleUsers(applyLocalFilters(users, value));
  };

  const totals = useMemo(
    () => ({
      total: users.length,
      suspended: users.filter((item) => item.adminLocked).length,
      banned: users.filter((item) => item.adminBanned).length,
      active: users.filter((item) => !item.adminLocked && !item.adminBanned)
        .length,
    }),
    [users],
  );

  const columns = [
    {
      title: "S/N",
      key: "sn",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Name",
      key: "name",
      render: (_, record) => record.name || `${record.firstname} ${record.lastname}`.trim(),
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
      render: (value) => String(value || "buyer").toUpperCase(),
    },
    {
      title: "Date Registered",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => (date ? new Date(date).toLocaleDateString() : "N/A"),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space wrap>
          <Button
            danger
            onClick={() =>
              handleAction("ban", record.id, record.firstname || record.name)
            }
          >
            Ban
          </Button>
          <Button
            onClick={() =>
              handleAction("unban", record.id, record.firstname || record.name)
            }
          >
            Unban
          </Button>
          <Button
            onClick={() =>
              handleAction(
                "suspend",
                record.id,
                record.firstname || record.name,
              )
            }
          >
            Suspend
          </Button>
          <Button
            style={{ color: "#41CCC7", borderColor: "#41CCC7" }}
            onClick={() =>
              handleAction(
                "activate",
                record.id,
                record.firstname || record.name,
              )
            }
          >
            Activate
          </Button>
          <Button
            type="link"
            onClick={() => navigate(`/dashboard/sellers/${record.id}`)}
          >
            View Details
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <h1>{title}</h1>

      <div className="flex" style={{ gap: 20 }}>
        <UserMatrxs
          matrix={totals.total}
          title={isUserScreen ? "All users" : "All sellers"}
          border={true}
          icon={
            <i
              className="fa fa-user-circle"
              aria-hidden="true"
              style={{ fontSize: "2rem", color: "#41CCC7" }}
            />
          }
          onClick={() => filterUsers("all")}
        />
        <UserMatrxs
          matrix={totals.suspended}
          title="Suspended users"
          border={true}
          onClick={() => filterUsers("suspended")}
          icon={
            <i
              className="fa fa-user-circle"
              aria-hidden="true"
              style={{ fontSize: "2rem", color: "#F67F00" }}
            />
          }
        />
        <UserMatrxs
          matrix={totals.banned}
          title="Banned users"
          border={true}
          onClick={() => filterUsers("banned")}
          icon={
            <i
              className="fa fa-user-times"
              aria-hidden="true"
              style={{ fontSize: "2rem", color: "#F42121" }}
            />
          }
        />
        <UserMatrxs
          matrix={totals.active}
          title="Active users"
          border={true}
          onClick={() => filterUsers("active")}
          icon={
            <i
              className="fa fa-user-plus"
              aria-hidden="true"
              style={{ fontSize: "2rem", color: "#41CCC7" }}
            />
          }
        />
      </div>

      <Search
        placeholder="Search by name, email, or phone"
        onSearch={handleSearch}
        onChange={(event) => handleSearch(event.target.value)}
        allowClear
        value={searchQuery}
        style={{ margin: "1rem 0", width: 320 }}
      />

      <Table
        columns={columns}
        dataSource={visibleUsers}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
        className="admin-table overflow-x-auto"
      />
    </div>
  );
};

export default AllSellers;
