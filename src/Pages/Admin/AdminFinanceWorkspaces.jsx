import React, { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Button, Empty, Space, Spin, Table, Tag, message, Tabs, Modal, Form, Input, InputNumber, Card, Tooltip } from "antd";
import { DownloadOutlined, ReloadOutlined, EditOutlined, PercentageOutlined, SettingOutlined, InfoCircleOutlined, PartitionOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";

import { MainContext } from "../../Context/MainContext";
import {
  defaultAdminApprovalRequests,
  defaultAdminRefunds,
  defaultAdminSalesReport,
  fetchAdminApprovalRequests,
  fetchAdminRefunds,
  fetchAdminSalesReport,
  fetchAdminMainCategories,
  updateAdminMainCategory,
  fetchAdminCategories,
  updateAdminCategory,
  fetchAdminSubcategoriesTertiary,
  updateAdminSubcategory,
} from "../../api/admin";
import { downloadCsv } from "../BloomzonAdmin/shared";
import "./adminWorkspace.css";

const formatNumber = (value) =>
  new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(
    Number(value || 0),
  );

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(Number(value || 0));

const formatDateTime = (value) => (value ? new Date(value).toLocaleString() : "N/A");

const SummaryCard = ({ label, value, helper }) => (
  <div className="admin-kpi">
    <div className="admin-kpi__label">{label}</div>
    <div className="admin-kpi__value">{value}</div>
    <div className="admin-kpi__helper">{helper}</div>
  </div>
);

const FinanceShell = ({ eyebrow, title, subtitle, actions, children }) => (
  <div className="admin-workspace">
    <div className="admin-workspace__header">
      <div className="admin-workspace__copy">
        <div className="admin-workspace__eyebrow">{eyebrow}</div>
        <h1 className="admin-workspace__title">{title}</h1>
        <p className="admin-workspace__subtitle">{subtitle}</p>
      </div>
      {actions ? <div className="admin-workspace__actions">{actions}</div> : null}
    </div>
    {children}
  </div>
);

export const AdminCommissionsWorkspace = () => {
  const { token } = useContext(MainContext);
  const [report, setReport] = useState(defaultAdminSalesReport);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadReport = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await fetchAdminSalesReport(token, { months: 6 });
      setReport(data || defaultAdminSalesReport);
    } catch (fetchError) {
      setError(
        fetchError?.response?.data?.message || "Failed to load commission source data.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadReport();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const rows = useMemo(
    () =>
      [...(report.productBreakdown || []), ...(report.serviceBreakdown || [])].map(
        (item) => ({
          ...item,
          commission: null,
        }),
      ),
    [report.productBreakdown, report.serviceBreakdown],
  );

  const exportCommissionSources = () => {
    const exportRows = rows.map((item) => ({
      source: item.label,
      sales_revenue: item.revenue,
      orders: item.orders,
      units: item.units,
      commission: item.commission ?? "",
    }));

    if (downloadCsv("bloomzon-commission-source-report.csv", exportRows)) {
      message.success("Commission source export ready.");
    }
  };

  return (
    <FinanceShell
      eyebrow="Finance"
      title="Commissions"
      subtitle="Commission revenue needs a dedicated ledger or rate table. This page shows backend sales sources without inventing commission values."
      actions={
        <>
          <Button
            icon={<DownloadOutlined />}
            onClick={exportCommissionSources}
            disabled={!rows.length}
          >
            Export source rows
          </Button>
          <Button icon={<ReloadOutlined />} onClick={loadReport}>Refresh</Button>
        </>
      }
    >
      {error ? (
        <Alert style={{ marginBottom: 18 }} type="warning" showIcon message={error} />
      ) : null}
      {loading ? (
        <div className="flex flex-center" style={{ minHeight: 320 }}>
          <Spin size="large" />
        </div>
      ) : (
        <>
          <section className="admin-panel admin-panel--soft" style={{ marginBottom: 18 }}>
            <div className="admin-panel__body">
              <div className="admin-kpi-grid">
                <SummaryCard
                  label="Commission ledger"
                  value="Not configured"
                  helper="No dedicated backend commission ledger is available yet."
                />
                <SummaryCard
                  label="Sales source"
                  value={formatCurrency(report.summary.totalRevenue)}
                  helper="Total backend sales available for future commission calculation."
                />
                <SummaryCard
                  label="Product sales"
                  value={formatCurrency(report.summary.productSales)}
                  helper="Product order-line revenue."
                />
                <SummaryCard
                  label="Service sales"
                  value={formatCurrency(report.summary.serviceSales)}
                  helper="Service order-line revenue."
                />
              </div>
            </div>
          </section>
          <section className="admin-panel">
            <div className="admin-panel__body">
              <Table
                rowKey="key"
                dataSource={rows}
                pagination={false}
                columns={[
                  { title: "Source", dataIndex: "label", key: "label" },
                  {
                    title: "Sales Revenue",
                    key: "revenue",
                    render: (_, record) => formatCurrency(record.revenue),
                  },
                  {
                    title: "Commission",
                    key: "commission",
                    render: () => "No ledger value",
                  },
                ]}
                locale={{ emptyText: <Empty description="No sales source rows" /> }}
              />
            </div>
          </section>
        </>
      )}
    </FinanceShell>
  );
};

export const AdminServiceChargeWorkspace = () => {
  const { token } = useContext(MainContext);
  const [activeTab, setActiveTab] = useState("1"); // "1" = Main, "2" = Secondary, "3" = Subcategory
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [mainCategories, setMainCategories] = useState([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();
  
  // KPI stats
  const [stats, setStats] = useState({
    totalMain: 0,
    totalSecondary: 0,
    totalSub: 0,
    configuredOverrides: 0,
  });

  const loadMainCategories = async () => {
    try {
      const res = await fetchAdminMainCategories(token, { limit: 200 });
      if (res?.success && res?.data?.items) {
        setMainCategories(res.data.items);
      }
    } catch (err) {
      console.error("Failed to load main categories for lookup", err);
    }
  };

  const loadOverviewStats = async () => {
    try {
      const resMain = await fetchAdminMainCategories(token, { limit: 1 });
      const resSec = await fetchAdminCategories(token, undefined, { limit: 1 });
      const resSub = await fetchAdminSubcategoriesTertiary(token, undefined, { limit: 1 });
      
      setStats((prev) => ({
        ...prev,
        totalMain: resMain?.data?.pagination?.total || 0,
        totalSecondary: resSec?.data?.pagination?.total || 0,
        totalSub: resSub?.data?.pagination?.total || 0,
      }));
    } catch (err) {
      console.error("Failed to fetch overview metrics", err);
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.current,
        limit: pagination.pageSize,
        search: searchQuery || undefined,
      };

      if (activeTab === "1") {
        const res = await fetchAdminMainCategories(token, params);
        if (res?.success && res?.data) {
          setItems(res.data.items || []);
          setPagination((prev) => ({
            ...prev,
            total: res.data.pagination?.total || res.data.items.length,
          }));
          const overrides = (res.data.items || []).filter((item) => Number(item.service_charge) > 0).length;
          setStats((prev) => ({ ...prev, configuredOverrides: overrides }));
        }
      } else if (activeTab === "2") {
        const res = await fetchAdminCategories(token, undefined, params);
        if (res?.success && res?.data) {
          setItems(res.data.items || []);
          setPagination((prev) => ({
            ...prev,
            total: res.data.pagination?.total || res.data.items.length,
          }));
          const overrides = (res.data.items || []).filter((item) => Number(item.service_charge) > 0).length;
          setStats((prev) => ({ ...prev, configuredOverrides: overrides }));
        }
      } else if (activeTab === "3") {
        const res = await fetchAdminSubcategoriesTertiary(token, undefined, params);
        if (res?.success && res?.data) {
          setItems(res.data.items || []);
          setPagination((prev) => ({
            ...prev,
            total: res.data.pagination?.total || res.data.items.length,
          }));
          const overrides = (res.data.items || []).filter((item) => Number(item.service_charge) > 0).length;
          setStats((prev) => ({ ...prev, configuredOverrides: overrides }));
        }
      }
    } catch (err) {
      message.error("Failed to load catalog data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMainCategories();
    loadOverviewStats();
  }, [token]);

  useEffect(() => {
    loadData();
  }, [token, activeTab, pagination.current, searchQuery]);

  const mainMap = useMemo(() => {
    const map = new Map();
    mainCategories.forEach((m) => {
      map.set(Number(m.id), m);
    });
    return map;
  }, [mainCategories]);

  const handleConfigure = (record, level) => {
    setSelectedItem({ ...record, level });
    form.setFieldsValue({
      service_charge: Number(record.service_charge || 0),
    });
    setIsModalOpen(true);
  };

  const handleSave = async (values) => {
    setSaving(true);
    try {
      const { id, level } = selectedItem;
      const rate = Number(values.service_charge || 0);

      let res;
      if (level === "1") {
        res = await updateAdminMainCategory(token, id, { service_charge: rate });
      } else if (level === "2") {
        res = await updateAdminCategory(token, id, { service_charge: rate });
      } else if (level === "3") {
        res = await updateAdminSubcategory(token, id, { service_charge: rate });
      }

      if (res?.success) {
        message.success("Service charge configured successfully!");
        setIsModalOpen(false);
        setSelectedItem(null);
        loadData();
        loadMainCategories(); // Refresh main lookup
        loadOverviewStats(); // Refresh stats totals
      } else {
        message.error(res?.message || "Failed to save configuration");
      }
    } catch (err) {
      message.error("An error occurred while saving configuration");
    } finally {
      setSaving(false);
    }
  };

  const columnsMain = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
    },
    {
      title: "Label / Name",
      key: "label",
      render: (_, record) => (
        <div>
          <span style={{ fontWeight: 600 }}>{record.label || record.name}</span>
          <div style={{ fontSize: "12px", color: "#8c8c8c" }}>{record.name}</div>
        </div>
      ),
    },
    {
      title: "Category Count",
      dataIndex: "categoryCount",
      key: "categoryCount",
      render: (val) => <Tag color="blue">{val || 0} Categories</Tag>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={Number(status) === 1 ? "success" : "default"}>
          {Number(status) === 1 ? "Active" : "Inactive"}
        </Tag>
      ),
    },
    {
      title: "Configured Charge (%)",
      dataIndex: "service_charge",
      key: "service_charge",
      render: (val) => {
        const rate = Number(val || 0);
        return (
          <span style={{ fontWeight: 600, color: rate > 0 ? "#10b981" : "inherit" }}>
            {rate.toFixed(2)}%
          </span>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      render: (_, record) => (
        <Button
          type="primary"
          ghost
          icon={<EditOutlined />}
          onClick={() => handleConfigure(record, "1")}
        >
          Configure
        </Button>
      ),
    },
  ];

  const columnsSecondary = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
    },
    {
      title: "Label / Name",
      key: "label",
      render: (_, record) => (
        <div>
          <span style={{ fontWeight: 600 }}>{record.label || record.name}</span>
          <div style={{ fontSize: "12px", color: "#8c8c8c" }}>{record.name}</div>
        </div>
      ),
    },
    {
      title: "Main Category Parent",
      key: "parent",
      render: (_, record) => {
        const parent = record.maincategory || mainMap.get(Number(record.maincategory_id));
        return (
          <span>
            {parent ? (
              <Tag color="cyan" icon={<PartitionOutlined />}>
                {parent.label || parent.name}
              </Tag>
            ) : (
              "-"
            )}
          </span>
        );
      },
    },
    {
      title: "Configured Charge (%)",
      dataIndex: "service_charge",
      key: "service_charge",
      render: (val) => {
        const rate = Number(val || 0);
        return (
          <span style={{ fontWeight: 600, color: rate > 0 ? "#10b981" : "inherit" }}>
            {rate > 0 ? `${rate.toFixed(2)}%` : "0.00% (Default)"}
          </span>
        );
      },
    },
    {
      title: "Effective Charge (%)",
      key: "effective",
      render: (_, record) => {
        const configured = Number(record.service_charge || 0);
        const parent = record.maincategory || mainMap.get(Number(record.maincategory_id));
        const parentRate = parent ? Number(parent.service_charge || 0) : 0;
        const effective = configured > 0 ? configured : parentRate;
        const isInherited = configured === 0;

        return (
          <Space direction="vertical" size={0}>
            <span style={{ fontWeight: 600, color: "#2563eb" }}>{effective.toFixed(2)}%</span>
            {isInherited ? (
              <Tooltip title={`Inherited from parent main category: ${parent?.label || parent?.name || "N/A"}`}>
                <Tag color="warning" size="small" style={{ fontSize: "10px" }}>
                  Inherited
                </Tag>
              </Tooltip>
            ) : (
              <Tag color="success" size="small" style={{ fontSize: "10px" }}>
                Custom Override
              </Tag>
            )}
          </Space>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      render: (_, record) => (
        <Button
          type="primary"
          ghost
          icon={<EditOutlined />}
          onClick={() => handleConfigure(record, "2")}
        >
          Configure
        </Button>
      ),
    },
  ];

  const columnsTertiary = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
    },
    {
      title: "Label / Name",
      key: "label",
      render: (_, record) => (
        <div>
          <span style={{ fontWeight: 600 }}>{record.label || record.name}</span>
          <div style={{ fontSize: "12px", color: "#8c8c8c" }}>{record.name}</div>
        </div>
      ),
    },
    {
      title: "Parent Path",
      key: "parent",
      render: (_, record) => {
        const sec = record.category;
        const main = sec ? mainMap.get(Number(sec.maincategory_id)) : null;
        return (
          <div style={{ fontSize: "12px" }}>
            {main && <span style={{ color: "#8c8c8c" }}>{main.label || main.name} &gt; </span>}
            {sec && <Tag color="geekblue">{sec.label || sec.name}</Tag>}
          </div>
        );
      },
    },
    {
      title: "Configured Charge (%)",
      dataIndex: "service_charge",
      key: "service_charge",
      render: (val) => {
        const rate = Number(val || 0);
        return (
          <span style={{ fontWeight: 600, color: rate > 0 ? "#10b981" : "inherit" }}>
            {rate > 0 ? `${rate.toFixed(2)}%` : "0.00% (Default)"}
          </span>
        );
      },
    },
    {
      title: "Effective Charge (%)",
      key: "effective",
      render: (_, record) => {
        const configured = Number(record.service_charge || 0);
        const sec = record.category;
        const secRate = sec ? Number(sec.service_charge || 0) : 0;
        const main = sec ? mainMap.get(Number(sec.maincategory_id)) : null;
        const mainRate = main ? Number(main.service_charge || 0) : 0;

        let effective = 0;
        let isInherited = false;
        let inheritedFrom = "";

        if (configured > 0) {
          effective = configured;
        } else if (secRate > 0) {
          effective = secRate;
          isInherited = true;
          inheritedFrom = `Category: ${sec.label || sec.name}`;
        } else {
          effective = mainRate;
          isInherited = true;
          inheritedFrom = main ? `Main Category: ${main.label || main.name}` : "System Default";
        }

        return (
          <Space direction="vertical" size={0}>
            <span style={{ fontWeight: 600, color: "#2563eb" }}>{effective.toFixed(2)}%</span>
            {isInherited ? (
              <Tooltip title={`Inherited from ${inheritedFrom}`}>
                <Tag color="warning" size="small" style={{ fontSize: "10px" }}>
                  Inherited
                </Tag>
              </Tooltip>
            ) : (
              <Tag color="success" size="small" style={{ fontSize: "10px" }}>
                Custom Override
              </Tag>
            )}
          </Space>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      render: (_, record) => (
        <Button
          type="primary"
          ghost
          icon={<EditOutlined />}
          onClick={() => handleConfigure(record, "3")}
        >
          Configure
        </Button>
      ),
    },
  ];

  return (
    <FinanceShell
      eyebrow="Finance"
      title="Service Charge Configuration"
      subtitle="Define custom fees at any level of the product catalog hierarchy. Custom rates override parent values; unconfigured levels inherit rates from above."
      actions={
        <Space>
          <Input.Search
            placeholder="Search by label or name..."
            allowClear
            onSearch={(val) => {
              setSearchQuery(val);
              setPagination((prev) => ({ ...prev, current: 1 }));
            }}
            style={{ width: 260 }}
          />
          <Button
            icon={<ReloadOutlined />}
            loading={loading}
            onClick={() => {
              loadData();
              loadOverviewStats();
            }}
          >
            Refresh
          </Button>
        </Space>
      }
    >
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <section className="admin-panel admin-panel--soft" style={{ marginBottom: "24px" }}>
          <div className="admin-panel__body">
            <div className="admin-kpi-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
              <SummaryCard
                label="Main Categories"
                value={stats.totalMain}
                helper="Level 1 Parent Categories"
              />
              <SummaryCard
                label="Secondary Categories"
                value={stats.totalSecondary}
                helper="Level 2 Catalog Nodes"
              />
              <SummaryCard
                label="Subcategories"
                value={stats.totalSub}
                helper="Level 3 Product Subcategories"
              />
              <SummaryCard
                label="Active Overrides"
                value={stats.configuredOverrides}
                helper="Custom rates set in this list view"
              />
            </div>
          </div>
        </section>

        <Card style={{ borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
          <Tabs
            activeKey={activeTab}
            onChange={(key) => {
              setActiveTab(key);
              setItems([]);
              setPagination((prev) => ({ ...prev, current: 1 }));
            }}
            type="card"
            items={[
              {
                key: "1",
                label: (
                  <span>
                    <PartitionOutlined /> Main Categories (Level 1)
                  </span>
                ),
              },
              {
                key: "2",
                label: (
                  <span>
                    <PartitionOutlined /> Secondary Categories (Level 2)
                  </span>
                ),
              },
              {
                key: "3",
                label: (
                  <span>
                    <PartitionOutlined /> Subcategories (Level 3)
                  </span>
                ),
              },
            ]}
          />

          <Table
            dataSource={items}
            columns={
              activeTab === "1"
                ? columnsMain
                : activeTab === "2"
                ? columnsSecondary
                : columnsTertiary
            }
            rowKey="id"
            loading={loading}
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: pagination.total,
              showSizeChanger: false,
              onChange: (page) => {
                setPagination((prev) => ({ ...prev, current: page }));
              },
            }}
          />
        </Card>
      </motion.div>

      {/* Configuration Modal */}
      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <SettingOutlined style={{ color: "#2563eb" }} />
            <span>Configure Service Charge</span>
          </div>
        }
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setSelectedItem(null);
        }}
        footer={null}
        destroyOnClose
      >
        {selectedItem && (
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSave}
            style={{ marginTop: "16px" }}
          >
            <div
              style={{
                background: "#f8fafc",
                padding: "16px",
                borderRadius: "8px",
                marginBottom: "20px",
                border: "1px solid #e2e8f0",
              }}
            >
              <div style={{ fontSize: "12px", textTransform: "uppercase", color: "#64748b", fontWeight: 600, marginBottom: "4px" }}>
                Category Context
              </div>
              <div style={{ fontSize: "16px", fontWeight: 700, color: "#1e293b", marginBottom: "8px" }}>
                {selectedItem.label || selectedItem.name}
              </div>
              
              {/* Parent breadcrumbs */}
              {selectedItem.level === "2" && (
                <div style={{ fontSize: "12px", color: "#64748b" }}>
                  <strong>Parent Main Category:</strong>{" "}
                  {selectedItem.maincategory?.label || selectedItem.maincategory?.name || mainMap.get(Number(selectedItem.maincategory_id))?.label || "N/A"}
                </div>
              )}
              {selectedItem.level === "3" && (
                <div style={{ fontSize: "12px", color: "#64748b" }}>
                  <strong>Path:</strong>{" "}
                  {mainMap.get(Number(selectedItem.category?.maincategory_id))?.label || "N/A"} &gt; {selectedItem.category?.label || selectedItem.category?.name || "N/A"}
                </div>
              )}
            </div>

            <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", padding: "12px 16px", borderRadius: "6px", marginBottom: "20px", fontSize: "13px" }}>
              <div style={{ display: "flex", gap: "8px", color: "#1e3a8a" }}>
                <InfoCircleOutlined style={{ marginTop: "2px" }} />
                <div>
                  <strong>Fee Resolution Logic:</strong>
                  <ul style={{ margin: "4px 0 0 0", paddingLeft: "16px" }}>
                    <li>Setting a percentage here overrides parent rates for all products in this category tier.</li>
                    <li>Setting this value to <strong>0.00%</strong> will automatically delegate fee calculations back to parent categories in the hierarchy.</li>
                  </ul>
                </div>
              </div>
            </div>

            <Form.Item
              name="service_charge"
              label={<strong>Service Charge Percentage (%)</strong>}
              rules={[
                { required: true, message: "Please input a service charge percentage" },
                {
                  type: "number",
                  min: 0,
                  max: 100,
                  message: "Percentage must be between 0% and 100%",
                },
              ]}
            >
              <InputNumber
                style={{ width: "100%" }}
                size="large"
                min={0}
                max={100}
                step={0.01}
                precision={2}
                formatter={(value) => `${value}%`}
                parser={(value) => value.replace("%", "")}
                addonAfter={<PercentageOutlined />}
              />
            </Form.Item>

            <Form.Item style={{ marginBottom: 0, textAlign: "right", marginTop: "24px" }}>
              <Space>
                <Button
                  onClick={() => {
                    setIsModalOpen(false);
                    setSelectedItem(null);
                  }}
                >
                  Cancel
                </Button>
                <Button type="primary" htmlType="submit" loading={saving}>
                  Save Configuration
                </Button>
              </Space>
            </Form.Item>
          </Form>
        )}
      </Modal>
    </FinanceShell>
  );
};

export const AdminRefundsWorkspace = () => {
  const navigate = useNavigate();
  const { token } = useContext(MainContext);
  const [refunds, setRefunds] = useState(defaultAdminRefunds);
  const [approvals, setApprovals] = useState(defaultAdminApprovalRequests);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadRefunds = async () => {
    try {
      setLoading(true);
      setError("");
      const [refundData, approvalData] = await Promise.all([
        fetchAdminRefunds(token, { page: 1, limit: 50 }),
        fetchAdminApprovalRequests(token, {
          page: 1,
          limit: 20,
          resource_type: "refund",
        }),
      ]);
      setRefunds(refundData || defaultAdminRefunds);
      setApprovals(approvalData || defaultAdminApprovalRequests);
    } catch (fetchError) {
      setError(fetchError?.response?.data?.message || "Failed to load refunds.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadRefunds();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const exportRefunds = (mode) => {
    const rows =
      mode === "approvals"
        ? (approvals.items || []).map((record) => ({
            request_id: record.id,
            resource_type: record.resourceType,
            action: record.action,
            status: record.status,
            reason: record.reason,
            initiator: record.initiator?.name || "",
            created_at: formatDateTime(record.createdAt),
          }))
        : (refunds.items || []).map((record) => ({
            refund_id: record.id,
            order_number: record.order?.orderNumber || record.orderId || "",
            buyer: record.user?.name || record.user?.email || "",
            amount: record.amount,
            method: record.method,
            status: record.status,
            requested_at: formatDateTime(record.createdAt),
          }));

    if (
      downloadCsv(
        mode === "approvals"
          ? "bloomzon-refund-approval-queue.csv"
          : "bloomzon-refund-ledger.csv",
        rows,
      )
    ) {
      message.success("Refund export ready.");
    }
  };

  return (
    <FinanceShell
      eyebrow="Finance"
      title="Refunds"
      subtitle="Refund records, pending authorizations, and finance-visible history from the current admin workflow."
      actions={
        <>
          <Button onClick={() => navigate("/dashboard/admin-system/orders")}>
            Open admin workflow
          </Button>
          <Button
            icon={<DownloadOutlined />}
            onClick={() => exportRefunds("ledger")}
            disabled={!refunds.items?.length}
          >
            Export ledger
          </Button>
          <Button
            icon={<DownloadOutlined />}
            onClick={() => exportRefunds("approvals")}
            disabled={!approvals.items?.length}
          >
            Export approvals
          </Button>
          <Button icon={<ReloadOutlined />} onClick={loadRefunds}>
            Refresh
          </Button>
        </>
      }
    >
      {error ? (
        <Alert style={{ marginBottom: 18 }} type="warning" showIcon message={error} />
      ) : null}
      {loading ? (
        <div className="flex flex-center" style={{ minHeight: 320 }}>
          <Spin size="large" />
        </div>
      ) : (
        <>
          <section className="admin-panel admin-panel--soft" style={{ marginBottom: 18 }}>
            <div className="admin-panel__body">
              <div className="admin-kpi-grid">
                <SummaryCard
                  label="Refund records"
                  value={formatNumber(refunds.summary.total)}
                  helper="Refund rows visible in the current backend ledger."
                />
                <SummaryCard
                  label="Pending"
                  value={formatNumber(refunds.summary.pending)}
                  helper="Refunds waiting for further action."
                />
                <SummaryCard
                  label="Processing"
                  value={formatNumber(refunds.summary.processing)}
                  helper="Refunds in motion across finance operations."
                />
                <SummaryCard
                  label="Authorizations"
                  value={formatNumber(approvals.summary.pending)}
                  helper="Refund approvals waiting for an authorizer."
                />
              </div>
            </div>
          </section>

          <div className="admin-section-grid admin-section-grid--2">
            <section className="admin-panel">
              <div className="admin-panel__body">
                <div className="admin-panel__header">
                  <div>
                    <h2 className="admin-panel__title">Refund Ledger</h2>
                    <div className="admin-panel__subtitle">
                      Backend refund records with buyer, order, amount, and status context.
                    </div>
                  </div>
                </div>
                <Table
                  rowKey="id"
                  dataSource={refunds.items || []}
                  pagination={false}
                  columns={[
                    {
                      title: "Refund",
                      key: "refund",
                      render: (_, record) => (
                        <div>
                          <div style={{ fontWeight: 600 }}>Refund #{record.id}</div>
                          <div style={{ fontSize: 12, color: "#6b7280" }}>
                            Order {record.order?.orderNumber || record.orderId || "N/A"}
                          </div>
                        </div>
                      ),
                    },
                    {
                      title: "Buyer",
                      key: "buyer",
                      render: (_, record) =>
                        record.user?.name || record.user?.email || "Unknown buyer",
                    },
                    {
                      title: "Amount",
                      key: "amount",
                      render: (_, record) =>
                        formatCurrency(record.amount, record.order?.currencyCode || "USD"),
                    },
                    {
                      title: "Method",
                      key: "method",
                      render: (_, record) => record.method || "N/A",
                    },
                    {
                      title: "Status",
                      key: "status",
                      render: (_, record) => (
                        <Tag
                          color={
                            record.status === "completed"
                              ? "green"
                              : record.status === "failed"
                                ? "red"
                                : record.status === "processing"
                                  ? "blue"
                                  : "gold"
                          }
                        >
                          {String(record.status || "unknown").toUpperCase()}
                        </Tag>
                      ),
                    },
                    {
                      title: "Requested",
                      key: "createdAt",
                      render: (_, record) => formatDateTime(record.createdAt),
                    },
                  ]}
                  locale={{ emptyText: <Empty description="No refund records found" /> }}
                />
              </div>
            </section>

            <section className="admin-panel admin-panel--soft">
              <div className="admin-panel__body">
                <div className="admin-panel__header">
                  <div>
                    <h2 className="admin-panel__title">Refund Approval Queue</h2>
                    <div className="admin-panel__subtitle">
                      Refund requests requiring initiator/authorizer separation.
                    </div>
                  </div>
                </div>
                <Table
                  rowKey="id"
                  dataSource={(approvals.items || []).filter(
                    (item) => item.resourceType === "refund",
                  )}
                  pagination={false}
                  columns={[
                    {
                      title: "Request",
                      key: "request",
                      render: (_, record) => (
                        <div>
                          <div style={{ fontWeight: 600 }}>
                            {String(record.action || "request").toUpperCase()}
                          </div>
                          <div style={{ fontSize: 12, color: "#6b7280" }}>
                            {record.initiator?.name || "Unknown admin"}
                          </div>
                        </div>
                      ),
                    },
                    {
                      title: "Reason",
                      dataIndex: "reason",
                      key: "reason",
                      render: (value) => value || "No reason supplied",
                    },
                    {
                      title: "Status",
                      key: "status",
                      render: (_, record) => (
                        <Tag color={record.status === "approved" ? "green" : "gold"}>
                          {String(record.status || "unknown").replaceAll("_", " ").toUpperCase()}
                        </Tag>
                      ),
                    },
                    {
                      title: "Created",
                      key: "createdAt",
                      render: (_, record) => formatDateTime(record.createdAt),
                    },
                  ]}
                  locale={{ emptyText: <Empty description="No refund approval requests" /> }}
                />
                <Alert
                  style={{ marginTop: 16 }}
                  type="info"
                  showIcon
                  message="Actioning refunds"
                  description={
                    <Space direction="vertical" size={4}>
                      <span>
                        New refund creation and approval actions now live in the Admin System
                        Orders workspace.
                      </span>
                      <Button size="small" onClick={() => navigate("/dashboard/admin-system/orders")}>
                        Go to orders workflow
                      </Button>
                    </Space>
                  }
                />
              </div>
            </section>
          </div>
        </>
      )}
    </FinanceShell>
  );
};
