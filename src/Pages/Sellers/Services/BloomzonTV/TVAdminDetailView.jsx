// TVAdminDetailView.jsx
import React from "react";
import { Card, Descriptions, Tag } from "antd";

const TVAdminDetailView = ({ data, type, onClose }) => {
  if (!data) return null;

  return (
    <div className="p-6 bg-white rounded shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">{type} Details</h2>
        <button onClick={onClose} className="text-blue-500 underline">Go Back</button>
      </div>

      <Card>
        <Descriptions bordered column={1}>
          {Object.entries(data).map(([key, value]) => (
            <Descriptions.Item key={key} label={key.toUpperCase()}>
              {typeof value === "string" || typeof value === "number" ? value : JSON.stringify(value)}
            </Descriptions.Item>
          ))}
        </Descriptions>
      </Card>
    </div>
  );
};

export default TVAdminDetailView;
