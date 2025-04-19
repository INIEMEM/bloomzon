import React, { useState, useEffect, useContext } from "react";
import { Card, Table, Button, notification, Space, Input } from "antd";
import { motion } from "framer-motion";
import Axios from "axios";
import { MainContext } from "../../Context/Context";
import { useNavigate } from "react-router-dom";
const { Search } = Input;

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const { baseUrl, token } = useContext(MainContext);
  const navigate = useNavigate()
  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const response = await Axios({
          method: "get",
          url: `${baseUrl}api/v1/notification`,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.data.success) {
          setNotifications(response.data.data.notifications);
          setFilteredNotifications(response.data.data.notifications);
        } else {
          notification.error({ message: "Failed to fetch notifications" });
        }
      } catch (error) {
        console.error(error);
        notification.error({ message: "Error fetching notifications" });
        if(error?.response?.statusText == "Unauthorized"){
          console.log('just testing')
          navigate('../../')
        }
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [baseUrl, token]);

  // Mark notification as read
  const markAsRead = async (id) => {
    try {
      await Axios({
        method: "put",
        url: `${baseUrl}api/v1/notification/${id}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      notification.success({ message: "Notification marked as read" });
      // Update state after marking as read
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === id ? { ...notif, isRead: true } : notif
        )
      );
    } catch (error) {
      console.error(error);
      notification.error({ message: "Error marking notification as read" });
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      await Axios({
        method: "put",
        url: `${baseUrl}api/v1/notification`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      notification.success({ message: "All notifications marked as read" });
      // Update state after marking all as read
      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, isRead: true }))
      );
    } catch (error) {
      console.error(error);
      notification.error({ message: "Error marking all as read" });
    }
  };

  // Filter notifications
  const filterNotifications = (filter) => {
    if (filter === "all") {
      setFilteredNotifications(notifications);
    } else if (filter === "read") {
      setFilteredNotifications(notifications.filter((notif) => notif.isRead));
    } else if (filter === "unread") {
      setFilteredNotifications(notifications.filter((notif) => !notif.isRead));
    }
  };

  // Handle search functionality
  const handleSearch = (value) => {
    const searchValue = value.toLowerCase();
    const filteredData = notifications.filter(
      (notif) =>
        notif.message.toLowerCase().includes(searchValue) ||
        notif.category.toLowerCase().includes(searchValue)
    );
    setFilteredNotifications(filteredData);
  };

  // Notification statistics
  const totalNotifications = notifications.length;
  const unreadNotifications = notifications.filter((notif) => !notif.isRead)
    .length;
  const readNotifications = notifications.filter((notif) => notif.isRead).length;

  // Table columns
  const columns = [
    {
      title: "S/N",
      key: "serialNumber",
      render: (_, __, index) => index + 1, // Generate S/N dynamically
    },
    {
      title: "Message",
      dataIndex: "message",
      key: "message",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
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
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button
          type="link"
          disabled={record.isRead}
          onClick={() => markAsRead(record.id)}
        >
          Mark as Read
        </Button>
      ),
    },
  ];

  // Framer Motion page transition
  const pageVariants = {
    initial: { opacity: 0, x: "5vw" },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: "-5vw" },
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
        <h1>Notifications</h1>
        <Space style={{ marginBottom: "20px" }} className="flex">
          <Card
            title="Total Notifications"
            style={{ minWidth: 340 }}
            onClick={() => filterNotifications("all")}
          >
            {totalNotifications}
          </Card>
          <Card
            title="Unread Notifications"
            style={{ minWidth: 340 }}
            onClick={() => filterNotifications("unread")}
          >
            {unreadNotifications}
          </Card>
          <Card
            title="Read Notifications"
            style={{ minWidth: 340 }}
            onClick={() => filterNotifications("read")}
          >
            {readNotifications}
          </Card>
        </Space>
        <div style={{ marginBottom: "20px" }}>
          <Search
            placeholder="Search notifications..."
            enterButton
            allowClear
            onSearch={handleSearch}
            style={{ maxWidth: 400 }}
          />
        </div>
        <Button
          type="primary"
          onClick={markAllAsRead}
          style={{ marginBottom: "20px", background: "var(--primary-color)" }}
        >
          Mark All as Read
        </Button>
        <Table
          columns={columns}
          dataSource={filteredNotifications}
          loading={loading}
          rowKey="id"
          bordered
          className="admin-table"
        />
      </div>
    </motion.div>
  );
};

export default Notifications;
