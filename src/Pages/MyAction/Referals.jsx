import React, { useState, useEffect, useContext } from "react";
import { Table, Button, Modal, Input, notification } from "antd";
import Axios from "axios";
import { motion } from "framer-motion";
import { MainContext } from "../../Context/Context";
import { useNavigate } from "react-router-dom";
const Referals = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [referralCode, setReferralCode] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const { baseUrl, token } = useContext(MainContext);
  const navigate = useNavigate()
  // Fetch referral history
  useEffect(() => {
    const fetchReferralHistory = async () => {
      setLoading(true);
      try {
        const response = await Axios({
          method: "get",
          url: `${baseUrl}api/v1/auth/referal/history`,
          headers: {
            Authorization: "Bearer " + token,
          },
        });
        if (response.data.success) {
          // Add a timestamp for each record
          const enrichedData = response.data.data.map((item, index) => ({
            ...item,
            date: new Date().toLocaleDateString(), // Mock date for now
            key: index, // Assign key for Ant Design
          }));
          setData(enrichedData);
          setFilteredData(enrichedData);
        } else {
          notification.error({ message: "Failed to fetch referral history" });
        }
      } catch (error) {
        console.error(error);
        notification.error({ message: "Error fetching referral history" });
        if(error?.response?.statusText == "Unauthorized"){
          console.log('just testing')
          navigate('../../')
        }
      } finally {
        setLoading(false);
      }
    };

    fetchReferralHistory();
  }, [baseUrl, token]);

  // Handle modal open/close
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setReferralCode("");
  };

  // Handle referral code submission
  const handleAddReferral = async () => {
    if (!referralCode) {
      notification.error({ message: "Please enter a referral code" });
      return;
    }

    try {
      const response = await Axios({
        method: "post",
        url: `${baseUrl}api/v1/auth/referal`,
        headers: {
          Authorization: "Bearer " + token,
        },
        data: {
          referralCode,
        },
      });
      if (response.data.success) {
        notification.success({ message: "Referral code added successfully" });
        handleCloseModal();
      } else {
        notification.error({ message: "Failed to add referral code" });
      }
    } catch (error) {
      console.error(error);
      notification.error({ message: "Error adding referral code" });
    }
  };

  // Handle search functionality
  const handleSearch = (value) => {
    setSearchTerm(value);
    const filtered = data.filter(
      (item) =>
        item.firstname.toLowerCase().includes(value.toLowerCase()) ||
        item.lastname.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(filtered);
  };

  // Table columns
  const columns = [
    {
      title: "S/N",
      dataIndex: "sn",
      key: "sn",
      render: (text, record, index) => index + 1, // Serial number
    },
    {
      title: "First Name",
      dataIndex: "firstname",
      key: "firstname",
    },
    {
      title: "Last Name",
      dataIndex: "lastname",
      key: "lastname",
    },
    {
      title: "Paid Bonus",
      dataIndex: "isPaidBonus",
      key: "isPaidBonus",
      render: (isPaidBonus) => (isPaidBonus ? "Yes" : "No"),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
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
        <div className="flex flex-justify-between">
          <h1>Referral History</h1>
          <Button
            type="primary"
            onClick={handleOpenModal}
            style={{ marginBottom: "20px", background: "var(--primary-color)" }}
          >
            Add Referral
          </Button>
        </div>
        <Input
          placeholder="Search by first or last name"
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          style={{ marginBottom: "20px" }}
        />
        <Table
          columns={columns}
          dataSource={filteredData}
          loading={loading}
          rowKey={(record) => record.key}
          className="admin-table"
          bordered
        />
      </div>

      {/* Modal for adding referral */}
      <Modal
        title="Add Referral Code"
        visible={isModalOpen}
        onOk={handleAddReferral}
        onCancel={handleCloseModal}
        okText="Submit"
      >
        <Input
          placeholder="Enter referral code"
          value={referralCode}
          onChange={(e) => setReferralCode(e.target.value)}
        />
      </Modal>
    </motion.div>
  );
};

export default Referals;
