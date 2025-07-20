import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Card, Tabs, Table, Avatar, Statistic, Row, Col, Modal, Button, Form, Input, Switch, message
} from 'antd';
import { motion } from 'framer-motion';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer
} from 'recharts';

const { TabPane } = Tabs;
const {TextArea} = Input

// Dummy API
const getUserById = async (id) => ({
  id,
  name: 'Jane Doe',
  email: 'jane@example.com',
  status: 'pending', 
  revenue: 5400,  
  followers: [
    { id: 'u1', name: 'John Smith', avatar: 'https://i.pravatar.cc/50?img=1' },
    { id: 'u2', name: 'Alice Ray', avatar: 'https://i.pravatar.cc/50?img=2' },
  ],
  engagement: [
    { day: 'Mon', clicks: 24, views: 80 },
    { day: 'Tue', clicks: 32, views: 90 },
    { day: 'Wed', clicks: 17, views: 70 },
    { day: 'Thu', clicks: 44, views: 120 },
    { day: 'Fri', clicks: 38, views: 110 },
  ],
  reels: [
    {
      id: 'r1',
      title: 'Skincare Tips',
      monetized: true,
      views: 1200,
      likes: 300,
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    },
    {
      id: 'r2',
      title: 'Behind the scenes',
      monetized: false,
      views: 400,
      likes: 50,
      videoUrl: 'https://www.w3schools.com/html/movie.mp4',
    },
  ],
});

const ReelUserDetailsPage = () => {
  const { reels } = useParams();
  const [user, setUser] = useState(null);
  const [editingReel, setEditingReel] = useState(null);
  const [selectedReel, setSelectedReel] = useState('');
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [isTakedownModalOpen, setIsTakedownModalOpen] = useState(false);
  const [takedownReason, setTakedownReason] = useState('')
  const [form] = Form.useForm();
  const [auditLogs, setAuditLogs] = useState([
    {
      id: '1',
      action: 'Edited Reel Title',
      adminName: 'Admin John',
      timestamp: '2025-07-17 10:45 AM',
      reason: 'Fixed typo in the title',
    },
    {
      id: '2',
      action: 'Took Down Reel',
      adminName: 'Admin Jane',
      timestamp: '2025-07-16 08:20 PM',
      reason: 'Inappropriate content',
    },
  ]); 
  useEffect(() => {
    if (reels) {
      getUserById(reels).then(setUser);
    }
  }, [reels]);
  const columns = [
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
    },
    {
      title: 'Admin',
      dataIndex: 'adminName',
      key: 'adminName',
    },
    {
      title: 'Timestamp',
      dataIndex: 'timestamp',
      key: 'timestamp',
    },
    {
      title: 'Reason',
      dataIndex: 'reason',
      key: 'reason',
    },
  ];
  const handleEditReel = (reel) => {
    setEditingReel(reel);
    form.setFieldsValue(reel);
    setEditModalVisible(true);
  };

  const handleSaveEdit = () => {
    form.validateFields().then((values) => {
      const updated = {
        ...editingReel,
        ...values,
      };
      const updatedReels = user.reels.map((r) =>
        r.id === updated.id ? updated : r
      );
      setUser({ ...user, reels: updatedReels });
      setEditModalVisible(false);
      message.success('Reel updated');
    });
  };

  const handleTakeDownReel = () => {
    // Modal.confirm({
    //   title: 'Confirm Take Down',
    //   content: 'Are you sure you want to take down this reel?',
    //   okText: 'Yes, Take Down',
    //   okType: 'danger',
    //   onOk() {
        
    //   },
    // });

    const updated = user.reels.filter((r) => r.id !== selectedReel);
        setUser({ ...user, reels: updated });
        message.success('Reel taken down');
  };

  const handleApprove = () => {
    setUser({ ...user, status: 'active' });
    message.success('User approved');
  };

  const handleSuspend = () => {
    setUser({ ...user, status: 'suspended' });
    message.warning('User suspended');
  };

  if (!user) return <div className="p-6">Loading...</div>;

  const monetizedReels = user.reels?.filter((r) => r.monetized);

  return (
    <motion.div
      className="p-6 space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">User: {user.name}</h2>
        <div className="flex gap-3">
          {user.status === 'pending' && (
            <Button type="primary" onClick={handleApprove}>
              Approve User
            </Button>
          )}
          {user.status === 'active' && (
            <Button danger onClick={handleSuspend}>
              Suspend User
            </Button>
          )}
        </div>
      </div>

      {/* Engagement Metrics Graph */}
      <Card title="Engagement: Clicks vs Views">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={user.engagement}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="views" stroke="#8884d8" name="Views" />
            <Line type="monotone" dataKey="clicks" stroke="#82ca9d" name="Clicks" />
          </LineChart>
        </ResponsiveContainer>
      </Card>
      <Card className="w-full md:w-1/3" bordered>
        <Statistic
          title="Total Revenue Generated"
          value={user.revenue}
          prefix="₦"
          valueStyle={{ color: '#3f8600' }}
        />
      </Card>
      <Tabs defaultActiveKey="1">
        <TabPane tab="All Reels" key="1">
          <Table
            dataSource={user.reels}
            rowKey="id"
            expandable={{
              expandedRowRender: (record) => (
                <video controls width="100%" src={record.videoUrl} />
              ),
            }}
            className='admin-table'
            columns={[
              { title: 'Title', dataIndex: 'title' },
              { title: 'Views', dataIndex: 'views' },
              { title: 'Likes', dataIndex: 'likes' },
              {
                title: 'Monetized',
                dataIndex: 'monetized',
                render: (val) => (val ? 'Yes' : 'No'),
              },
              {
                title: 'Actions',
                render: (_, reel) => (
                  <div className="flex gap-2">
                    <Button onClick={() => handleEditReel(reel)}>Edit</Button>
                    <Button danger onClick={() => {setSelectedReel(reel.id); setIsTakedownModalOpen(true)} }>
                      Take Down
                    </Button>
                  </div>
                ),
              },
            ]}
          />
        </TabPane>

        <TabPane tab="Monetized Reels" key="2">
          <Table
            dataSource={monetizedReels}
            className='admin-table'
            rowKey="id"
            columns={[
              { title: 'Title', dataIndex: 'title' },
              { title: 'Views', dataIndex: 'views' },
              { title: 'Likes', dataIndex: 'likes' },
            ]}
          />
        </TabPane>

        <TabPane tab={`Followers (${user.followers.length})`} key="3">
          <Row gutter={[16, 16]}>
            {user.followers.map((follower) => (
              <Col key={follower.id} span={12} md={6}>
                <Card className="flex items-center gap-3">
                  <Avatar src={follower.avatar} />
                  <div>
                    <p className="font-medium">{follower.name}</p>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </TabPane>
        <TabPane tab="Audit Logs" key="logs">
          <Table
            dataSource={auditLogs}
            columns={columns}
            rowKey="id"
            className=" admin-table"
            pagination={{ pageSize: 5 }}
          />
        </TabPane>
      </Tabs>

      {/* Edit Modal */}
      <Modal
        title="Edit Reel"
        open={isEditModalVisible}
        onCancel={() => setEditModalVisible(false)}
        onOk={handleSaveEdit}
        okText="Save Changes"
      >
        <Form layout="vertical" form={form}>
          <Form.Item label="Title" name="title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Views" name="views" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item label="Likes" name="likes" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item label="Monetized" name="monetized" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        visible={isTakedownModalOpen}
        title="Take Down Reel"
        onOk={handleTakeDownReel}
        onCancel={() => setIsTakedownModalOpen(false)}
      >
        <TextArea
          rows={4}
          placeholder="Enter reason for takedown..."
          value={takedownReason}
          onChange={(e) => setTakedownReason(e.target.value)}
        />
      </Modal>
    </motion.div>
  );
};

export default ReelUserDetailsPage;
