import React, { useState, useEffect, useContext } from "react";
import { Table, Button, Space, message, Input } from "antd";
import { MainContext } from "../../Context/Context";
import Axios from "axios";
import UserMatrxs from "../../Components/UserMatrixs/UserMatrxs";
import { useNavigate } from "react-router-dom";
const { Search } = Input;
const AllSellers = () => {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState(sellers); // For table data
  const [searchQuery, setSearchQuery] = useState(""); // For search input
  const {baseUrl, token} = useContext(MainContext);
  const navigate =  useNavigate();
  const url = window.location.href;

  console.log('the url', url)
  const fetchSellers = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        method: 'get',
        url: `${baseUrl}api/v1/admin/seller`,
        headers: {
          Authorization: 'Bearer ' + token,
        }
      });
      setSellers(response.data.user);
      setFilteredUsers(response.data.user);

      console.log('the sellers list', response.data.user)
    } catch (error) {
      message.error("Failed to fetch sellers. Please try again.");
      console.log(error)
      if(error?.response?.statusText == "Unauthorized"){
        navigate('../../')
      }
    } finally {
      setLoading(false);
    }
  };
  const fetchUsers = async() => {
    try {
      setLoading(true);
      const response = await Axios({
        method: 'get',
        url: `${baseUrl}api/v1/admin`,
        headers: {
          Authorization: 'Bearer ' + token,
        }
      });
      setSellers(response.data.user);
      setFilteredUsers(response.data.user);

      console.log('the sellers list', response.data.user)
    } catch (error) {
      message.error("Failed to fetch sellers. Please try again.");
      console.log(error)
      if(error?.response?.statusText == "Unauthorized"){
        navigate('../../')
      }
    } finally {
      setLoading(false);
    }
  }

  const handleAction = async (action, sellerId, name) => {

      try {
        const response = await Axios({
          method: 'put',
          url: `${baseUrl}api/v1/admin/${action}?userId=${sellerId}`,
          headers: {
            Authorization: 'Bearer ' + token,
          },
          data: {
            userId: sellerId
          }
        });
        message.success(`${name}'s account has been Updated`) 
        console.log(response.data);
        fetchSellers()
      } catch (error) {
        message.error('an error occoured');
        console.error('the ban error', error)
      }
    }
  
  
  const filterUsers = (type) => {
    switch (type) {
      case "all":
        setFilteredUsers(sellers);
        break;
      case "suspended":
        setFilteredUsers(sellers.filter((u) => u.adminLocked));
        break;
      case "active":
        setFilteredUsers(sellers.filter((u) => !u.adminLocked));
        break;
      case "banned":
        setFilteredUsers(sellers.filter((u) => u.adminBanned));
        break;
      default:
        setFilteredUsers(sellers);
    }
  };

  useEffect(() => {
    if(url.includes('dashboard/sellers/all'))
    {
      fetchSellers();
    }
    if (url.includes('dashboard/user/all')) 
    {
      fetchUsers();
    }
  }, [url]);

  const columns = [
    {
      title: "S/N",
      dataIndex: "sn",
      key: "sn",
      render: (_, __, index) => index + 1, // Generate serial numbers
    },
    {
      title: "Name",
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
      title: "Date Registered",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="default"
            danger
            onClick={() => handleAction("ban-account", record.id, record.firstname)}
          >
            Ban User
          </Button>
          <Button
            type="default"
            
            onClick={() => handleAction("unban-account", record.id, record.firstname)}
          >
            UnBan User
          </Button>
          <Button
            type="default"
            onClick={() => handleAction("suspend-account", record.id, record.firstname)}
          >
            Suspend User
          </Button>
          <Button
            type="default"
            onClick={() => handleAction("activate-account", record.id, record.firstname)}
            style={{ color: '#41CCC7', borderColor: '#41CCC7' }}
          >
            Activate User
          </Button>
          <Button
            type="link"
            onClick={() => navigate(`/dashboard/sellers/${record.id}`)}
            style={{ color: 'var(--primary-color)', borderColor: 'var(--primary-color)' }}
          >
            View Details
          </Button>
        </Space>
      ),
    },
  ];
  const handleSearch = (value) => {
    
    // console.log('value', value)
    setFilteredUsers(
      sellers.filter(
        (item) =>
          item.firstname.toLowerCase().includes(value.toLowerCase()) ||
          item.email.toLowerCase().includes(value.toLowerCase())
      )
    );
  };

  
 
  return (
    <div style={{padding: 20}}>
      <h1>All Sellers</h1>
      {/* User Matrixes  */}
      <div className="flex" style={{ gap: 20 }}>
        <UserMatrxs
          matrix={sellers.length}
          title="All users"
          border={true}
          icon={<i class="fa fa-user-circle" aria-hidden="true" style={{fontSize:'2rem', color: '#41CCC7 '}}></i>}
          onClick={() => filterUsers("all")}
        />
        <UserMatrxs
          matrix={sellers.filter((u) => u.adminLocked).length}
          title="Suspended users"
          border={true}
          onClick={() => filterUsers("suspended")}
          icon={<i class="fa fa-user-circle" aria-hidden="true" style={{fontSize:'2rem', color: '#F67F00 '}}></i>}
        />
        <UserMatrxs
          matrix={sellers.filter((u) => u.adminBanned).length}
          title="Banned user"
          border={true}
          onClick={() => filterUsers("banned")}
          icon={<i class="fa fa-user-times" aria-hidden="true" style={{fontSize:'2rem', color: '#F42121'}}></i>}
        />
         <UserMatrxs
          
          matrix={sellers.filter((u) => !u.adminLocked).length}
          title="Active users"
          border={true}
          onClick={() => filterUsers("active")}
          icon={<i class="fa fa-user-plus" aria-hidden="true" style={{fontSize:'2rem', color: '#41CCC7 '}}></i>}
        />
      </div>
      {/* Search Field */}
      <Search
        type="text"
        placeholder="Search by name or email"
        onSearch={handleSearch}
        allowClear
        style={{ margin: "1rem 0", padding: "0.5rem", width: "300px" }}
      />

      {/* User Table */}
      <Table
        columns={columns}
        dataSource={filteredUsers}
        rowKey={(record) => record.id}
        loading={loading}
        pagination={{ pageSize: 10 }}
        className="admin-table overflow-x-auto"
      />
    </div>
  );
};

export default AllSellers;
