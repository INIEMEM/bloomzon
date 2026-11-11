/* eslint-disable react/prop-types */
import { useContext, useEffect, useMemo, useRef, useState } from "react";
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
import { MainContext } from "../../Context/MainContext";
import * as AdminAPI from "../../api/admin";
import { PlusOutlined, EditOutlined, DeleteOutlined, PartitionOutlined } from "@ant-design/icons";

const statusOptions = [
  { value: 1, label: "Active" },
  { value: 0, label: "Inactive" },
];

const CatalogHierarchyManager = ({ subdomain }) => {
  const { token } = useContext(MainContext);
  const [loading, setLoading] = useState(false);
  const [hierarchy, setHierarchy] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // create, edit
  const [modalLevel, setModalLevel] = useState(1); // 1, 2, 3
  const [selectedItem, setSelectedItem] = useState(null);
  const [parentId, setParentId] = useState(null);
  const [form] = Form.useForm();

  const fetchHierarchy = async () => {
    try {
      setLoading(true);
      const res = await AdminAPI.fetchSubdomainCategoryHierarchy(
        token,
        subdomain.id,
      );
      if (res.success) {
        setHierarchy(res.data);
      }
    } catch (error) {
      console.error("Failed to fetch hierarchy:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHierarchy();
  }, [subdomain.id]);

  const openModal = (level, mode, item = null, pid = null) => {
    setModalLevel(level);
    setModalMode(mode);
    setSelectedItem(item);
    setParentId(pid);
    form.resetFields();

    if (mode === "edit" && item) {
      form.setFieldsValue({
        name: item.name,
        label: item.label,
        description: item.description,
        status: item.status,
      });
    } else {
      form.setFieldsValue({
        status: 1,
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      let res;

      if (modalLevel === 1) {
        if (modalMode === "edit") {
          res = await AdminAPI.updateAdminMainCategory(
            token,
            selectedItem.id,
            values,
          );
        } else {
          // If no hierarchy exists, we might need to create the MainCategory with the expected name
          const payload = {
            ...values,
            name: values.name || `_${subdomain.name}`,
          };
          res = await AdminAPI.createAdminMainCategory(token, payload);
        }
      } else if (modalLevel === 2) {
        if (modalMode === "edit") {
          res = await AdminAPI.updateAdminCategory(
            token,
            selectedItem.id,
            values,
          );
        } else {
          res = await AdminAPI.createAdminCategory(token, {
            ...values,
            maincategory_id: parentId,
          });
        }
      } else if (modalLevel === 3) {
        if (modalMode === "edit") {
          res = await AdminAPI.updateAdminSubcategory(
            token,
            selectedItem.id,
            values,
          );
        } else {
          res = await AdminAPI.createAdminSubcategory(token, {
            ...values,
            category_id: parentId,
          });
        }
      }

      if (res?.success) {
        message.success("Operation successful");
        setIsModalOpen(false);
        fetchHierarchy();
      } else {
        message.error(res?.message || "Operation failed");
      }
    } catch (error) {
      console.error("Save error:", error);
    }
  };

  const handleDelete = async (level, id) => {
    let res;
    if (level === 1) res = await AdminAPI.deleteAdminMainCategory(token, id);
    else if (level === 2) res = await AdminAPI.deleteAdminCategory(token, id);
    else if (level === 3) res = await AdminAPI.deleteAdminSubcategory(token, id);

    if (res?.success) {
      message.success("Deleted successfully");
      fetchHierarchy();
    } else {
      message.error(res?.message || "Delete failed");
    }
  };

  const columns = [
    { title: "Label", dataIndex: "label", key: "label" },
    { title: "System Name", dataIndex: "name", key: "name" },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => openModal(record._level, "edit", record)}
          />
          {record._level < 3 && (
            <Button
              size="small"
              icon={<PlusOutlined />}
              onClick={() => openModal(record._level + 1, "create", null, record.id)}
            >
              Add {record._level === 1 ? "Secondary" : "Tertiary"}
            </Button>
          )}
          <Popconfirm
            title="Are you sure?"
            onConfirm={() => handleDelete(record._level, record.id)}
          >
            <Button size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Transform hierarchy into a tree structure for Ant Table
  const dataSource = hierarchy
    ? [
        {
          ...hierarchy,
          key: `m${hierarchy.id}`,
          _level: 1,
          children: hierarchy.mainCategories?.map((cat) => ({
            ...cat,
            key: `c${cat.id}`,
            _level: 2,
            children: cat.categorySubcategories?.map((sub) => ({
              ...sub,
              key: `s${sub.id}`,
              _level: 3,
            })),
          })),
        },
      ]
    : [];

  return (
    <div
      style={{
        padding: "16px",
        background: "#f9fafb",
        borderRadius: "8px",
        border: "1px solid #e5e7eb",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        <Typography.Title level={5}>Catalog Hierarchy</Typography.Title>
        {!hierarchy && (
          <Button
            type="primary"
            size="small"
            icon={<PlusOutlined />}
            onClick={() => openModal(1, "create")}
          >
            Initialize Hierarchy
          </Button>
        )}
      </div>

      <Table
        loading={loading}
        columns={columns}
        dataSource={dataSource}
        pagination={false}
        size="small"
        locale={{ emptyText: "No hierarchy defined for this category yet." }}
      />

      <Modal
        title={`${modalMode === "create" ? "Add" : "Edit"} ${modalLevel === 1 ? "Main" : modalLevel === 2 ? "Secondary" : "Tertiary"} Category`}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleSave}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="label"
            label="Display Label"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="name"
            label="System Name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea />
          </Form.Item>
          <Form.Item name="status" label="Status">
            <Select options={statusOptions} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

const BusinessTypeManagement = ({ initialIntent = "" }) => {
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
  const hasAppliedInitialIntent = useRef(false);

  const fetchDomains = async () => {
    try {
      setLoading(true);
      const data = await AdminAPI.fetchAdminDomains(token);
      setDomains(data?.items || []);
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

  useEffect(() => {
    if (!initialIntent || loading || hasAppliedInitialIntent.current) {
      return;
    }

    if (initialIntent === "create-category") {
      if (domains.length) {
        openCreateCategoryModal(domains[0]);
      } else {
        openCreateDomainModal();
      }
    }

    hasAppliedInitialIntent.current = true;
  }, [domains, initialIntent, loading]);

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
        await AdminAPI.updateAdminDomain(token, selectedDomain.id, values);
        message.success("Domain updated successfully.");
      } else {
        await AdminAPI.createAdminDomain(token, values);
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
        await AdminAPI.updateAdminDomainCategory(token, selectedCategory.id, {
          ...payload,
          domain_id: domainId,
        });
        message.success("Domain category updated successfully.");
      } else {
        await AdminAPI.createAdminDomainCategory(token, domainId, payload);
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
      await AdminAPI.deleteAdminDomain(token, domainId);
      message.success("Domain deleted successfully.");
      fetchDomains();
    } catch (error) {
      message.error(error?.response?.data?.message || "Failed to delete domain.");
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
      await AdminAPI.deleteAdminDomainCategory(token, categoryId);
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
                  expandable={{
                    expandedRowRender: (subdomain) => (
                      <CatalogHierarchyManager subdomain={subdomain} />
                    ),
                  }}
                  locale={{
                    emptyText:
                      "No categories have been added to this domain yet.",
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
