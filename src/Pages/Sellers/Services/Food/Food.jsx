import { Button, Card, Col, Row, Statistic, Table } from 'antd';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const mockUsers = [
  {
    id: '1',
    name: 'Iniemem David',
    email: 'iniemem@example.com',
    status: 'Active',
  },
  {
    id: '2',
    name: 'Sarah Doe',
    email: 'sarah@example.com',
    status: 'Pending',
  },
  {
    id: '3',
    name: 'Michael Green',
    email: 'michael@example.com',
    status: 'Active',
  },
];

const Food = () => {
  const [userList, setUserList] = useState(mockUsers);
  const navigate = useNavigate();

  const viewUser = (id) => {
    navigate(`/dashboard/sellers/services/food/${id}`);
  };

  return (
    <div className='p-4'>
      <Row gutter={16}>
        <Col span={8}>
          <Card>
            <Statistic title="Total Users" value={3200} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="Pending Users" value={128} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="Active Users" value={2987} />
          </Card>
        </Col>
      </Row>

      <Table
        className='admin-table mt-4'
        rowKey="id"
        columns={[
          { title: 'Name', dataIndex: 'name', key: 'name' },
          { title: 'Email', dataIndex: 'email', key: 'email' },
          { title: 'Status', dataIndex: 'status', key: 'status' },
          {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
              <Button type="link" onClick={() => viewUser(record.id)}>View</Button>
            ),
          },
        ]}
        dataSource={userList}
      />
    </div>
  );
};

export default Food;
