import React, { useState } from 'react';
import { Table, Input, Select, Modal } from 'antd';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { Bar } from 'react-chartjs-2';
import BigGraphs from '../../../../Components/BigGraphs/BigGraphs';
import { Eliteoptions, Elitedata } from '../../../../Graphs/graphs';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend,
} from 'chart.js';
import UserMatrxs from '../../../../Components/UserMatrixs/UserMatrxs';
import { BloomzonHealthCare } from '../../../../Icons/icon';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const { Search } = Input;
const { Option } = Select;

const Elite = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const [searchText, setSearchText] = useState('');
  const [filteredServiceApproval, setFilteredServiceApproval] = useState(null);
  const [advancedFilters, setAdvancedFilters] = useState({
    hasVideos: false,
    hasBooks: false,
    hasPodcasts: false,
    hasMusic: false,
  });

  // Dummy user data (Replace with your actual data)
  const users = [
    {
      key: '1',
      sn: 1,
      username: 'John Doe',
      email: 'john.doe@example.com',
      phoneNumber: '123-456-7890',
      subscriptionEndDate: '2024-12-31',
      isServiceApproved: true,
      date: '2023-11-15',
      hasVideos: true,
      hasBooks: false,
      hasPodcasts: true,
      hasMusic: false,
    },
    {
      key: '2',
      sn: 2,
      username: 'Jane Smith',
      email: 'jane.smith@example.com',
      phoneNumber: '987-654-3210',
      subscriptionEndDate: '2024-06-30',
      isServiceApproved: false,
      date: '2023-11-16',
      hasVideos: false,
      hasBooks: true,
      hasPodcasts: false,
      hasMusic: true,
    },
    {
      key: '3',
      sn: 3,
      username: 'Alice Johnson',
      email: 'alice.j@example.com',
      phoneNumber: '555-123-4567',
      subscriptionEndDate: '2025-01-15',
      isServiceApproved: true,
      date: '2023-11-17',
      hasVideos: true,
      hasBooks: true,
      hasPodcasts: false,
      hasMusic: true,
    },
    {
      key: '4',
      sn: 4,
      username: 'Bob Williams',
      email: 'bob.w@example.com',
      phoneNumber: '111-222-3333',
      subscriptionEndDate: '2024-09-20',
      isServiceApproved: false,
      date: '2023-11-18',
      hasVideos: false,
      hasBooks: false,
      hasPodcasts: true,
      hasMusic: false,
    },
    {
      key: '5',
      sn: 5,
      username: 'Eva Brown',
      email: 'eva.b@example.com',
      phoneNumber: '444-555-6666',
      subscriptionEndDate: '2025-03-10',
      isServiceApproved: true,
      date: '2023-11-19',
      hasVideos: true,
      hasBooks: true,
      hasPodcasts: true,
      hasMusic: true,
    },
  ];

  const filteredUsers = users.filter((user) => {
    const searchMatch =
      user.username.toLowerCase().includes(searchText.toLowerCase()) ||
      user.email.toLowerCase().includes(searchText.toLowerCase()) ||
      user.phoneNumber.includes(searchText);

    const approvalMatch =
      filteredServiceApproval === null ||
      user.isServiceApproved === filteredServiceApproval;

    const advancedMatch =
      (!advancedFilters.hasVideos || user.hasVideos) &&
      (!advancedFilters.hasBooks || user.hasBooks) &&
      (!advancedFilters.hasPodcasts || user.hasPodcasts) &&
      (!advancedFilters.hasMusic || user.hasMusic);

    return searchMatch && approvalMatch && advancedMatch;
  });

  const columns = [
    { title: 'S/N', dataIndex: 'sn', key: 'sn' },
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
      render: (text, record) => (
        <div style={{ position: 'relative' }}>
          {text}
          {!record.isServiceApproved && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
              style={{
                position: 'absolute',
                top: '-5px',
                right: '-10px',
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: 'red',
              }}
            />
          )}
        </div>
      ),
      onCell: (record) => ({
        onClick: () => navigate(`/dashboard/sellers/services/elite/${record.key}`), // Navigate on click
        style: { cursor: 'pointer' },
      }),
    },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Phone Number', dataIndex: 'phoneNumber', key: 'phoneNumber' },
    { title: 'Subscription End Date', dataIndex: 'subscriptionEndDate', key: 'subscriptionEndDate' },
    {
      title: 'isServiceApproved',
      dataIndex: 'isServiceApproved',
      key: 'isServiceApproved',
      render: (approved) => (approved ? 'Yes' : 'No'),
    },
    { title: 'Date', dataIndex: 'date', key: 'date' },
  ];

  return (
    <div className="p-[20px] h-screen">
      <h1 className="font-bold text-[30px]">Elite Service</h1>
      <div className="grid grid-cols-2 gap-4  ">
        <BigGraphs title="" content={<Bar data={Elitedata} options={Eliteoptions} />} subTitle="" links={`../dashboard/sellers/business/seller`} />
        <div className="grid grid-cols-2 grid-rows-2 gap-4">
          <UserMatrxs matrix="5,600" title="Music (2)" icon={<BloomzonHealthCare />} />
          <UserMatrxs matrix="5,600" title="Podcast" icon={<BloomzonHealthCare />} />
          <UserMatrxs matrix="5,600" title="Videos" icon={<BloomzonHealthCare />} />
          <UserMatrxs matrix="5,600" title="Books (18)" icon={<BloomzonHealthCare />} />
        </div>
      </div>
      <section className='mt-[20px]'>
        <h1 className="font-semibold text-[20px]">Elite Sellers</h1>
        <div className="flex justify-between items-center mb-4 flex-wrap">
          <Search
            placeholder="Search users"
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 200, marginBottom: '8px' }}
          />
          <div className='flex items-center gap-4'>
              <Select
                placeholder="Filter by approval"
                onChange={(value) => setFilteredServiceApproval(value)}
                style={{ width: 150, marginBottom: '8px' }}
              >
                <Option value={null}>All</Option>
                <Option value={true}>Approved</Option>
                <Option value={false}>Not Approved</Option>
              </Select>
              <div className="flex flex-wrap gap-1" style={{marginBottom: "8px"}}>
                <label><input type="checkbox" checked={advancedFilters.hasVideos} onChange={(e) => setAdvancedFilters({ ...advancedFilters, hasBooks: e.target.checked })} />Books</label>
                <label><input type="checkbox" checked={advancedFilters.hasPodcasts} onChange={(e) => setAdvancedFilters({ ...advancedFilters, hasPodcasts: e.target.checked })} />Podcasts</label>
                <label><input type="checkbox" checked={advancedFilters.hasMusic} onChange={(e) => setAdvancedFilters({ ...advancedFilters, hasMusic: e.target.checked })} />Music</label>
              </div>
          </div>
        </div>
        <Table className='admin-table' dataSource={filteredUsers} columns={columns} />
      </section>
    </div>
  );
};

export default Elite;