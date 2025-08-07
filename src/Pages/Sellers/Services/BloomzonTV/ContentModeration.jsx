import React from "react";
import { Table, Button, Tag, Modal } from "antd";
import { useState } from "react";

const flaggedContent = [
  {
    key: "1",
    type: "Comment",
    content: "This product is fake!",
    user: "Tola O.",
    show: "Gadget Bonanza",
    status: "Flagged",
  },
  {
    key: "2",
    type: "Live Chat",
    content: "Scam alert 🚨",
    user: "James K.",
    show: "Beauty Friday Deals",
    status: "Under Review",
  },
];

const ContentModeration = () => {
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState(null);

  const handleReview = (record) => {
    setSelected(record);
    setVisible(true);
  };

  const columns = [
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Content",
      dataIndex: "content",
      key: "content",
    },
    {
      title: "User",
      dataIndex: "user",
      key: "user",
    },
    {
      title: "Show",
      dataIndex: "show",
      key: "show",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => <Tag color={status === "Flagged" ? "red" : "orange"}>{status}</Tag>,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button onClick={() => handleReview(record)}>Review</Button>
      ),
    },
  ];

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-semibold mb-4">Content Moderation</h2>
      <Table columns={columns} dataSource={flaggedContent} />

      <Modal
        title="Review Content"
        open={visible}
        onCancel={() => setVisible(false)}
        onOk={() => setVisible(false)}
      >
        {selected && (
          <div className="space-y-2">
            <p><strong>User:</strong> {selected.user}</p>
            <p><strong>Show:</strong> {selected.show}</p>
            <p><strong>Content:</strong> {selected.content}</p>
            <p className="text-sm text-gray-500">Action: Approve / Remove / Warn</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ContentModeration;
