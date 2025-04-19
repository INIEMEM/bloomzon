import { Table } from "antd";

const CategoryTable = ({ categories }) => {
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Slug",
      dataIndex: "slug",
      key: "slug",
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (image) => (
        <img src={image} alt="Category" style={{ width: "50px" }} />
      ),
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
    },
    {
      title: "Updated At",
      dataIndex: "updated_at",
      key: "updated_at",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <a href={`/categories/${record.id}`} target="_blank" rel="noreferrer">
          View
        </a>
      ),
    },
  ];

  return <Table className="admin-table" dataSource={categories} columns={columns} rowKey="id" />;
};
export default CategoryTable
