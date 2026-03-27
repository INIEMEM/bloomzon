import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  Button,
  Card,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Select,
  Space,
  Table,
  Tag,
  Typography,
  message,
} from "antd";
import { motion } from "framer-motion";
import axios from "axios";
import { MainContext } from "../../Context/Context";
import { ADMIN_BASE_URL, getAuthHeaders } from "../../api/config";

const statusOptions = [
  { value: 1, label: "Active" },
  { value: 0, label: "Inactive" },
];

const BusinessTypeManagement = () => {
  const { token } = useContext(MainContext);
  const [domains, setDomains] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isDomainModalOpen, setIsDomainModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedDomainId, setSelectedDomainId] = useState(null);
  const [domainForm] = Form.useForm();
  const [categoryForm] = Form.useForm();

  const fetchDomains = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${ADMIN_BASE_URL}/domains`, {
        headers: getAuthHeaders(token),
      });
      setDomains(response.data?.data?.items || []);
    } catch (error) {
      message.error(
        error?.response?.data?.message || "Failed to fetch business domains.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      return;
    }

    fetchDomains();
  }, [token]);

  const filteredDomains = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return domains;
    }

    return domains.filter((domain) => {
      const domainText = [
        domain.name,
        domain.label,
        domain.description,
        String(domain.code || ""),
      ]
        .join(" ")
        .toLowerCase();

      const categoryText = (domain.subdomains || [])
        .map((subdomain) =>
          [
            subdomain.name,
            subdomain.label,
            subdomain.description,
            String(subdomain.code || ""),
          ]
            .join(" ")
            .toLowerCase(),
        )
        .join(" ");

      return `${domainText} ${categoryText}`.includes(query);
    });
  }, [domains, searchQuery]);

  const openCreateDomainModal = () => {
    setSelectedDomain(null);
    domainForm.resetFields();
    domainForm.setFieldsValue({
      intake: 1,
      status: 1,
    });
    setIsDomainModalOpen(true);
  };

  const openEditDomainModal = (domain) => {
    setSelectedDomain(domain);
    domainForm.setFieldsValue({
      name: domain.name,
      label: domain.label,
      description: domain.description,
      intake: Number(domain.intake ?? 1),
      status: Number(domain.status ?? 1),
    });
    setIsDomainModalOpen(true);
  };

  const openCreateCategoryModal = (domain) => {
    setSelectedCategory(null);
    setSelectedDomainId(domain?.id || null);
    categoryForm.resetFields();
    categoryForm.setFieldsValue({
      domain_id: domain?.id || undefined,
      status: 1,
    });
    setIsCategoryModalOpen(true);
  };

  const openEditCategoryModal = (domain, category) => {
    setSelectedDomainId(domain.id);
    setSelectedCategory(category);
    categoryForm.setFieldsValue({
      domain_id: domain.id,
      name: category.name,
      label: category.label,
      description: category.description,
      status: Number(category.status ?? 1),
    });
    setIsCategoryModalOpen(true);
  };

  const handleSaveDomain = async () => {
    try {
      const values = await domainForm.validateFields();
      setSaving(true);

      if (selectedDomain) {
        await axios.put(`${ADMIN_BASE_URL}/domains/${selectedDomain.id}`, values, {
          headers: getAuthHeaders(token),
        });
        message.success("Domain updated successfully.");
      } else {
        await axios.post(`${ADMIN_BASE_URL}/domains`, values, {
          headers: getAuthHeaders(token),
        });
        message.success("Domain created successfully.");
      }

      setIsDomainModalOpen(false);
      setSelectedDomain(null);
      domainForm.resetFields();
      fetchDomains();
    } catch (error) {
      if (error?.errorFields) {
        return;
      }

      message.error(error?.response?.data?.message || "Failed to save domain.");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveCategory = async () => {
    try {
      const values = await categoryForm.validateFields();
      const domainId = Number(values.domain_id || selectedDomainId);

      if (!domainId) {
        message.error("Please choose a domain first.");
        return;
      }

      setSaving(true);

      const payload = {
        name: values.name,
        label: values.label,
        description: values.description,
        status: values.status,
      };

      if (selectedCategory) {
        await axios.put(
          `${ADMIN_BASE_URL}/domains/categories/${selectedCategory.id}`,
          {
            ...payload,
            domain_id: domainId,
          },
          {
            headers: getAuthHeaders(token),
          },
        );
        message.success("Domain category updated successfully.");
      } else {
        await axios.post(`${ADMIN_BASE_URL}/domains/${domainId}/categories`, payload, {
          headers: getAuthHeaders(token),
        });
        message.success("Domain category created successfully.");
      }

      setIsCategoryModalOpen(false);
      setSelectedCategory(null);
      setSelectedDomainId(null);
      categoryForm.resetFields();
      fetchDomains();
    } catch (error) {
      if (error?.errorFields) {
        return;
      }

      message.error(
        error?.response?.data?.message || "Failed to save domain category.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteDomain = async (domainId) => {
    try {
      await axios.delete(`${ADMIN_BASE_URL}/domains/${domainId}`, {
        headers: getAuthHeaders(token),
      });
      message.success("Domain deleted successfully.");
      fetchDomains();
    } catch (error) {
      message.error(error?.response?.data?.message || "Failed to delete domain.");
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
      await axios.delete(`${ADMIN_BASE_URL}/domains/categories/${categoryId}`, {
        headers: getAuthHeaders(token),
      });
      message.success("Domain category deleted successfully.");
      fetchDomains();
    } catch (error) {
      message.error(
        error?.response?.data?.message || "Failed to delete domain category.",
      );
    }
  };

  const renderStatusTag = (value) =>
    Number(value) === 1 ? <Tag color="green">Active</Tag> : <Tag color="red">Inactive</Tag>;

  const categoryColumns = (domain) => [
    {
      title: "Category Label",
      dataIndex: "label",
      key: "label",
    },
    {
      title: "System Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (value) => value || "No description",
    },
    {
      title: "Stores",
      dataIndex: "storesCount",
      key: "storesCount",
    },
    {
      title: "Products",
      dataIndex: "productsCount",
      key: "productsCount",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: renderStatusTag,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="small">
          <Button type="link" onClick={() => openEditCategoryModal(domain, record)}>
            Edit
          </Button>
          <Popconfirm
            title="Delete this domain category?"
            description="This only works when the category is not attached to stores or products."
            okText="Delete"
            cancelText="Cancel"
            onConfirm={() => handleDeleteCategory(record.id)}
          >
            <Button type="link" danger>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const domainColumns = [
    {
      title: "Domain",
      key: "domain",
      render: (_, record) => (
        <div>
          <Typography.Text strong>{record.label}</Typography.Text>
          <div style={{ color: "#6b7280" }}>{record.name}</div>
        </div>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (value) => value || "No description",
    },
    {
      title: "Categories",
      dataIndex: "categoriesCount",
      key: "categoriesCount",
    },
    {
      title: "Intake",
      dataIndex: "intake",
      key: "intake",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: renderStatusTag,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="small">
          <Button type="link" onClick={() => openEditDomainModal(record)}>
            Edit
          </Button>
          <Button type="link" onClick={() => openCreateCategoryModal(record)}>
            Add Category
          </Button>
          <Popconfirm
            title="Delete this domain?"
            description="Domains can only be removed after their categories have been cleared."
            okText="Delete"
            cancelText="Cancel"
            onConfirm={() => handleDeleteDomain(record.id)}
          >
            <Button type="link" danger>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 24 }}
      transition={{ duration: 0.35 }}
      style={{ padding: 20 }}
    >
      <Card>
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 16,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <div>
              <Typography.Title level={3} style={{ marginBottom: 4 }}>
                Domain And Category Management
              </Typography.Title>
              <Typography.Text type="secondary">
                Create domains, display them, and add business categories inside each
                domain.
              </Typography.Text>
            </div>
            <Space wrap>
              <Button onClick={() => openCreateCategoryModal()} type="default">
                Add Category
              </Button>
              <Button
                type="primary"
                style={{ background: "var(--primary-color)" }}
                onClick={openCreateDomainModal}
              >
                Create Domain
              </Button>
            </Space>
          </div>

          <Input
            placeholder="Search domains or categories"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
          />

          <Table
            columns={domainColumns}
            dataSource={filteredDomains}
            rowKey="id"
            loading={loading}
            className="admin-table"
            expandable={{
              expandedRowRender: (domain) => (
                <Table
                  columns={categoryColumns(domain)}
                  dataSource={domain.subdomains || []}
                  rowKey="id"
                  pagination={false}
                  locale={{
                    emptyText: "No categories have been added to this domain yet.",
                  }}
                />
              ),
              rowExpandable: (record) => Boolean(record.subdomains?.length),
            }}
            pagination={{
              pageSize: 10,
              showSizeChanger: false,
            }}
            locale={{
              emptyText: "No domains available yet.",
            }}
          />
        </Space>
      </Card>

      <Modal
        title={selectedDomain ? "Edit Domain" : "Create Domain"}
        open={isDomainModalOpen}
        onCancel={() => {
          setIsDomainModalOpen(false);
          setSelectedDomain(null);
        }}
        onOk={handleSaveDomain}
        confirmLoading={saving}
        okText={selectedDomain ? "Update" : "Create"}
      >
        <Form form={domainForm} layout="vertical">
          <Form.Item
            name="name"
            label="System Name"
            rules={[{ required: true, message: "Please enter a system name." }]}
          >
            <Input placeholder="goods_services" />
          </Form.Item>
          <Form.Item
            name="label"
            label="Display Label"
            rules={[{ required: true, message: "Please enter a label." }]}
          >
            <Input placeholder="Goods & Services" />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: "Please enter a description." }]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="intake" label="Intake">
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="status" label="Status">
            <Select options={statusOptions} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={selectedCategory ? "Edit Domain Category" : "Add Category To Domain"}
        open={isCategoryModalOpen}
        onCancel={() => {
          setIsCategoryModalOpen(false);
          setSelectedCategory(null);
          setSelectedDomainId(null);
        }}
        onOk={handleSaveCategory}
        confirmLoading={saving}
        okText={selectedCategory ? "Update" : "Create"}
      >
        <Form form={categoryForm} layout="vertical">
          <Form.Item
            name="domain_id"
            label="Domain"
            rules={[{ required: true, message: "Please choose a domain." }]}
          >
            <Select
              options={domains.map((domain) => ({
                value: domain.id,
                label: domain.label,
              }))}
              onChange={(value) => setSelectedDomainId(value)}
              placeholder="Select a domain"
            />
          </Form.Item>
          <Form.Item
            name="name"
            label="System Name"
            rules={[{ required: true, message: "Please enter a system name." }]}
          >
            <Input placeholder="grocery" />
          </Form.Item>
          <Form.Item
            name="label"
            label="Display Label"
            rules={[{ required: true, message: "Please enter a label." }]}
          >
            <Input placeholder="Groceries & Beverages" />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="status" label="Status">
            <Select options={statusOptions} />
          </Form.Item>
        </Form>
      </Modal>
    </motion.div>
  );
};

export default BusinessTypeManagement;
