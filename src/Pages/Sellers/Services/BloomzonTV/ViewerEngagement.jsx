import React, { useState } from "react";
import { Table, Tabs, Tag, Card } from "antd";
import { motion } from "framer-motion";

const { TabPane } = Tabs;

const viewerStats = [
  {
    key: "1",
    show: "Beauty Friday Deals",
    impressions: 1320,
    clicks: 412,
    orders: 103,
    avgRating: 4.6,
  },
  {
    key: "2",
    show: "Gadget Bonanza",
    impressions: 980,
    clicks: 311,
    orders: 89,
    avgRating: 4.3,
  },
];

const mockChats = {
  "Beauty Friday Deals": [
    { user: "Ada", message: "Love this serum! Where can I buy?" },
    { user: "Lola", message: "Is this on sale?" },
  ],
  "Gadget Bonanza": [
    { user: "Tunde", message: "These earbuds are 🔥" },
    { user: "Chuks", message: "What’s the battery life?" },
  ],
};

const ViewerEngagement = () => {
  const columns = [
    {
      title: "Show",
      dataIndex: "show",
      key: "show",
    },
    {
      title: "Impressions",
      dataIndex: "impressions",
      key: "impressions",
    },
    {
      title: "Clicks",
      dataIndex: "clicks",
      key: "clicks",
    },
    {
      title: "Orders",
      dataIndex: "orders",
      key: "orders",
    },
    {
      title: "Avg Rating",
      dataIndex: "avgRating",
      key: "avgRating",
      render: (rating) => <Tag color="blue">⭐ {rating}</Tag>,
    },
  ];

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-semibold mb-4">Viewer Engagement Stats</h2>
      <Table columns={columns} dataSource={viewerStats} pagination={false} className="mb-6" />

      <h2 className="text-lg font-semibold mb-2">Live Chat Logs</h2>
      <Tabs defaultActiveKey="1">
        {Object.entries(mockChats).map(([show, chats], index) => (
          <TabPane tab={show} key={index + 1}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-2"
            >
              {chats.map((chat, i) => (
                <Card key={i} size="small" className="bg-gray-50">
                  <p className="text-sm">
                    <strong>{chat.user}</strong>: {chat.message}
                  </p>
                </Card>
              ))}
            </motion.div>
          </TabPane>
        ))}
      </Tabs>
    </div>
  );
};

export default ViewerEngagement;