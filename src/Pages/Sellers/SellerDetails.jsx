import React, { useState, useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Axios from 'axios';
import { Card, Form, Spin, Alert, Input,  Table, Collapse, Descriptions, Divider, Empty, Modal  } from 'antd';
import { motion } from 'framer-motion';
import { MainContext } from '../../Context/Context';
import UserMatrxs from '../../Components/UserMatrixs/UserMatrxs';
import RevenueDisplay from '../../Components/RevenueDisplay/RevenueDisplay';
import { DollarCircleOutlined } from '@ant-design/icons';
import { div } from 'framer-motion/client';

const { Panel } = Collapse;
const SellerDetails = () => {
  const { seller } = useParams();
  const { baseUrl, token } = useContext(MainContext);
  const [shopdetails, setShopDetails] = useState([])
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const fetchUserDetails = async () => {
    try {
      console.log('Fetching details for:', seller);
      const response = await Axios({
        method: 'get',
        url: `${baseUrl}api/v1/admin/user?userId=${seller}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUserData(response.data.user);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch user details. Please try again.');
      if(err?.response?.statusText == "Unauthorized"){
        navigate('../../')
      }
      setLoading(false);
    }
  };

  const fetchSellerShop = async ()=>
    {
      try {
        const response = await Axios({
          url: `${baseUrl}api/v1/sellerbusiness`,
          method: `get`,
          headers: {
            Authorization: `Bearer ${token}`,
          }
        })
        // console.log(response.data)
        const {data} = response.data
        console.log('filtered data >>>', data.filter(sellers => sellers.id == seller ))
        setShopDetails(data.filter(sellers => sellers.id == seller )  )
      } catch (error) {
        console.error('the shop error', error)
      }
    }

  useEffect(() => {
    fetchUserDetails();
    fetchSellerShop()
  }, []);
// useEffect(()=>)
  // SellerBusinesses

  const renderTable = (columns, dataSource) => (
    <Table
      columns={columns}
      dataSource={dataSource}
      rowKey={(record) => record.id || record.name || Math.random()}
      pagination={false}
      size="small"
      onRow={(record) => ({
        onClick: () => {
          setSelectedRowData(record);
          setModalVisible(true);
        },
      })}
    />
  );

  // Define columns for nested arrays
  const sellerBusinessesColumns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Country", dataIndex: "CountryOfBirth.name", key: "CountryOfBirth" },
    { title: "Created At", dataIndex: "createdAt", key: "createdAt" },
    { title: "Updated At", dataIndex: "updatedAt", key: "updatedAt" },
  ];

  const paymentOptionsColumns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Type", dataIndex: "type", key: "type" },
    { title: "Number", dataIndex: "number", key: "number" },
    { title: "Exp", dataIndex: "expiration", key: "expiration" },
    { title: "Cvv", dataIndex: "cvv", key: "cvv" },
    { title: "Status", dataIndex: "status", key: "status" },
    { title: "Created At", dataIndex: "createdAt", key: "createdAt" },
  ];

  const sellerBStoresColumns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Status", dataIndex: "status", key: "status" },
    { title: "Sell To Business", dataIndex: "sellToBusiness", key: "sellToBusiness" },
    { title: "Created At", dataIndex: "createdAt", key: "createdAt" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
      style={{ padding: 20 }}
    >
      <h1>{userData?.firstname}'s Details</h1>
      <div className="flex" style={{ gap: 20 }}>
        <UserMatrxs
          matrix={userData?.wallet ? new Intl.NumberFormat().format(userData.wallet) : "0"}
          title="Wallet Balance"
          icon={<DollarCircleOutlined style={{ fontSize: 40, color: '#41CCC7' }} />}
          border={true}
        />
        <RevenueDisplay revenue={346800} profit={130000} loss={4030.9} />
      </div>

      <h3 style={{ marginTop: 10 }}>User Information</h3>
      <div style={{ marginTop: 20 }}>
        {loading ? (
          <Spin tip="Loading user details..." />
        ) : error ? (
          <Alert message={error} type="error" showIcon />
        ) : (
          <Card
            title="User Details"
            bordered={false}
            style={{
              margin: '0 auto',
              padding: 30,
              borderRadius: 10,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            }}
          >
            <Form layout="vertical">
              <Form.Item label="Full Name">
                <Input value={`${userData.firstname || ''} ${userData.lastname || ''}`} disabled />
              </Form.Item>
              <Form.Item label="Email">
                <Input value={userData.email || ''} disabled />
              </Form.Item>
              <Form.Item label="Phone">
                <Input value={userData.phone || ''} disabled />
              </Form.Item>
              <Form.Item label="Role">
                <Input value={userData.role || ''} disabled />
              </Form.Item>
              <Form.Item label="Wallet Balance">
                <Input value={`$${userData.wallet || 0}`} disabled />
              </Form.Item>
              <Form.Item label="Verified">
                <Input value={userData.isVerified ? 'Yes' : 'No'} disabled />
              </Form.Item>
              <Form.Item label="Referred By">
                <Input value={userData.referredBy || 'N/A'} disabled />
              </Form.Item>
              <Form.Item label="Last Active">
                <Input
                  value={userData.lastActive ? new Date(userData.lastActive).toLocaleString() : ''}
                  disabled
                />
              </Form.Item>
              <Form.Item label="Created At">
                <Input
                  value={userData.createdAt ? new Date(userData.createdAt).toLocaleString() : ''}
                  disabled
                />
              </Form.Item>
            </Form>
          </Card>
        )}
        {/* <h3>Business Information</h3> */}
       {
        shopdetails[0]?.SellerBusinesses.length > 0 ?
        shopdetails[0]?.SellerBusinesses.map(data => (
        <div style={{marginTop:25}}>
          <Card title="Business Data" style={{ marginBottom: "20px" }}>
            <Form layout="vertical">
              {Object.entries(data).map(([key, value]) => (
                <Form.Item key={key} label={key}>
                  {typeof value === 'string' && value.startsWith('http') ? (
                    // If value is a URL, render as an image or a link
                    <a href={value} target="_blank" rel="noopener noreferrer">
                      {value.includes('.png') || value.includes('.jpg') || value.includes('.jpeg') ? (
                        <img src={value} alt={key} style={{ maxWidth: '100%', maxHeight: '150px' }} />
                      ) : (
                        value
                      )}
                    </a>
                  ) : (
                    <Input value={value !== null && value !== undefined ? value.toString() : 'N/A'} disabled />
                  )}
                </Form.Item>
              ))}
            </Form>
          </Card>
          <Card title="Payment Options" style={{ marginBottom: "20px" }}>
            {data.PaymentOptions && renderTable(paymentOptionsColumns, data.PaymentOptions)}
          </Card>

      <Card title="Seller BStores" style={{ marginBottom: "20px" }}>
        {data.SellerBStores && renderTable(sellerBStoresColumns, data.SellerBStores)}
      </Card>
      

      <Card title="Additional Information">
        <Collapse>
          <Panel header="Residential" key="1">
            <Descriptions column={2} bordered>
              <Descriptions.Item label="Region Name">{data.Residential?.Region?.name}</Descriptions.Item>
              <Descriptions.Item label="Capital">{data.Residential?.capital}</Descriptions.Item>
              <Descriptions.Item label="Currency">{data.Residential?.currency}</Descriptions.Item>
              <Descriptions.Item label="Population">{data.Residential?.population}</Descriptions.Item>
              <Descriptions.Item label="Name">{data.Residential?.name}</Descriptions.Item>
            </Descriptions>
          </Panel>
          <Panel header="Country Of Issue" key="3">
            <Descriptions column={2} bordered>
              <Descriptions.Item label="Region Name">{data.CountryOfIssue?.Region?.name}</Descriptions.Item>
              <Descriptions.Item label="Capital">{data.CountryOfIssue?.capital}</Descriptions.Item>
              <Descriptions.Item label="Currency">{data.CountryOfIssue?.currency}</Descriptions.Item>
              <Descriptions.Item label="Population">{data.CountryOfIssue?.population}</Descriptions.Item>
              <Descriptions.Item label="Name">{data.CountryOfIssue?.name}</Descriptions.Item>
            </Descriptions>
          </Panel>
          <Panel header="Country of Citizenship" key="2">
            <Descriptions column={2} bordered>
              <Descriptions.Item label="Region Name">{data.CountryOfCitizenship?.Region?.name}</Descriptions.Item>
              <Descriptions.Item label="Capital">{data.CountryOfCitizenship?.capital}</Descriptions.Item>
              <Descriptions.Item label="Currency">{data.CountryOfCitizenship?.currency}</Descriptions.Item>
              <Descriptions.Item label="Population">{data.CountryOfCitizenship?.population}</Descriptions.Item>
              <Descriptions.Item label="Name">{data.CountryOfCitizenship?.name}</Descriptions.Item>
              <Descriptions.Item label="Phone">{data.CountryOfCitizenship?.phone}</Descriptions.Item>
            </Descriptions>
          </Panel>
        </Collapse>
      </Card>

      <Divider>End of Data</Divider>
        </div>)): (<Empty />)
       }
      </div>

      <Modal
  visible={modalVisible}
  title="Row Details"
  onCancel={() => setModalVisible(false)}
  footer={null}
>
  {selectedRowData ? (
    <Form layout="vertical">
      {Object.entries(selectedRowData).map(([key, value]) => {
        if (Array.isArray(value)) {
          // If the value is an array, display it in a table
          return (
            <Form.Item key={key} label={key}>
              <Table
                dataSource={value.map((day, index) => ({ key: index, day }))}
                columns={[
                  {
                    title: "Day",
                    dataIndex: "day",
                    key: "day",
                  },
                ]}
                rowKey={(record) => record.id || record.name || Math.random()}
                pagination={false}
                size="small"
              />
            </Form.Item>
          );
        } else if (typeof value === 'object' && value !== null) {
          // If the value is an object, display it in Descriptions
          return (
            <Form.Item key={key} label={key}>
              <Descriptions bordered column={1}>
                {Object.entries(value).map(([descKey, descValue]) => (
                  <Descriptions.Item key={descKey} label={descKey}>
                    {descValue !== null && descValue !== undefined ? descValue.toString() : 'N/A'}
                  </Descriptions.Item>
                ))}
              </Descriptions>
            </Form.Item>
          );
        } else {
          // For all other values, display them in Input fields
          return (
            <Form.Item key={key} label={key}>
              <Input value={value !== null && value !== undefined ? value.toString() : 'N/A'} disabled />
            </Form.Item>
          );
        }
      })}
    </Form>
  ) : (
    <Empty description="No Data" />
  )}
</Modal>

    </motion.div>
  );
};

export default SellerDetails;
