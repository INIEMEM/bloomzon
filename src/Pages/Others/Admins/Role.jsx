import React, { useState, useEffect , useContext} from "react";
import { Table, Button, Modal, Input, Typography } from "antd";
import { motion } from "framer-motion";
import { MainContext } from "../../../Context/Context";
import axios from "axios";

const { Title } = Typography;

const RoleManagement = () => {
  const [admins, setAdmins] = useState([]);
  const {baseUrl, token} = useContext(MainContext)
  const [roles, setRoles] = useState(["super", "guest", "admin", "seller"]);
  const [roleCounts, setRoleCounts] = useState({});
  const [selectedRole, setSelectedRole] = useState(null);
  const [filteredAdmins, setFilteredAdmins] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newRole, setNewRole] = useState("");

  // Fetch admins from the API
  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = await axios.get(`${baseUrl}api/v1/admin`, {headers: {
          Authorization: `Bearer ${token}`
        }});
        setAdmins(response.data.user);
        console.log('this is the admin data', response.data.user)
      } catch (error) {
        console.error("Error fetching admins:", error);
      }
    };

    fetchAdmins();
  }, []);

  // Calculate role counts
  useEffect(() => {
    const counts = roles.reduce((acc, role) => {
    
      acc[role] = admins?.filter((admin) => admin.role.includes(role)).length;
      return acc;
    }, {});
    setRoleCounts(counts);
  }, [admins, roles]);

  // Handle role selection
  const handleRoleClick = (role) => {
    setSelectedRole(role);
    const filtered = admins?.filter((admin) => admin.role.includes(role));
    setFilteredAdmins(filtered);
  };

  // Handle modal visibility
  const showModal = () => setIsModalVisible(true);
  const handleCancel = () => setIsModalVisible(false);

  // Handle adding a new role
  const handleCreateRole = () => {
    if (newRole.trim() && !roles.includes(newRole)) {
      setRoles([...roles, newRole.trim()]);
    }
    setNewRole("");
    setIsModalVisible(false);
  };

  // Ant Design table columns for roles
  const roleColumns = [
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Total Admins",
      dataIndex: "count",
      key: "count",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button type="link" onClick={() => handleRoleClick(record.role)}>
          View Admins
        </Button>
      ),
    },
  ];

  // Role data for the table
  const roleData = roles.map((role) => ({
    key: role,
    role,
    count: roleCounts[role] || 0,
  }));

  // Ant Design table columns for admins
  const adminColumns = [
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
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{padding:20}}
    >
      <div className="flex flex-justify-between">
        <h1 level={3}>Role Management</h1>
        <Button  type="primary" onClick={showModal} style={{ marginBottom: 16, background: 'var(--primary-color)' }}>
          Create Role
        </Button>
      </div>

      {/* Role Table */}
      <Table
        columns={roleColumns}
        dataSource={roleData}
        pagination={false}
        bordered
        className="admin-table"
      />

      {/* Admin Table (Filtered by Role) */}
      {selectedRole && (
        <div style={{ marginTop: 32 }}>
          <Title level={4}>Admins with Role: {selectedRole}</Title>
          <Table
            columns={adminColumns}
            dataSource={filteredAdmins.map((admin) => ({
              key: admin.id,
              ...admin,
            }))}
            pagination={{ pageSize: 5 }}
            bordered
          />
        </div>
      )}

      {/* Modal for Creating Role */}
      <Modal
        title="Create New Role"
        visible={isModalVisible}
        onOk={handleCreateRole}
        onCancel={handleCancel}
      >
        <Input
          placeholder="Enter role name"
          value={newRole}
          onChange={(e) => setNewRole(e.target.value)}
        />
      </Modal>
    </motion.div>
  );
};

export default RoleManagement;
