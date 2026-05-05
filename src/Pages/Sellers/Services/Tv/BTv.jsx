import React, { useEffect, useMemo, useState, useContext } from "react";
import {
  Table,
  Tabs,
  Card,
  Statistic,
  Row,
  Col,
  Button,
  Modal,
  Tag,
  Space,
  message,
  Form,
  Input,
  InputNumber,
  DatePicker,
  Switch,
  Drawer,
  Popconfirm,
  Tooltip,
  Divider,
  Select,
  Empty,
} from "antd";
import { motion } from "framer-motion";
import axios from "axios";
import dayjs from "dayjs";
import { MainContext } from "../../../../Context/Context";
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

/**
 * Axios instance
 */
const api = axios.create({
  baseURL: "https://bloomzonserver.onrender.com/bloomzonlive",
});

/**
 * Helpers
 */
const fmt = (iso) => (iso ? dayjs(iso).format("YYYY-MM-DD HH:mm") : "—");
const asCurrency = (n) => {
  const num = Number(n || 0);
  return new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(num);
};
const parseProductIds = (str) => {
  try {
    if (!str) return [];
    return JSON.parse(str);
  } catch {
    return String(str)
      .replace(/\[|\]/g, "")
      .split(",")
      .map((s) => Number(s.trim()))
      .filter((x) => !Number.isNaN(x));
  }
};

/**
 * Reusable Status Tag
 */
const StatusTag = ({ status }) => {
  const color =
    status === "pending"
      ? "orange"
      : status === "approved"
      ? "green"
      : status === "declined"
      ? "red"
      : status === "live"
      ? "blue"
      : "default";
  return <Tag color={color}>{String(status || "—").toUpperCase()}</Tag>;
};

/**
 * Review / Update Modal for a Session
 */
const ReviewSessionModal = ({ open, onClose, record, onUpdated }) => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const { baseUrl23 } = useContext(MainContext);
  useEffect(() => {
    if (record) {
      form.setFieldsValue({
        airId: record.airId,
        title: record.title,
        price: Number(record.price || 0),
        status: record.status,
        type: record.type,
        paid: Boolean(record.paid),
        finished: Boolean(record.finished),
        canceled: Boolean(record.canceled),
        duration: Number(record.duration || 0),
        channelId: Number(record.channelId || 0),
        channelName: record.channelName,
        video: record.video,
        comments: record.comments,
        bookingId: record.bookingId,
        numOfsales: Number(record.numOfsales || 0),
        timeRange: [record.startTime ? dayjs(record.startTime) : null, record.finishedTime ? dayjs(record.finishedTime) : null].filter(Boolean),
      });
    } else {
      form.resetFields();
    }
  }, [record, form]);

  const submit = async (payload) => {
    if (!record) return;
    setSubmitting(true);
    try {
      const body = {
        message: "update",
        data: {
          airId: record.airId,
          productId: Array.isArray(record.productIds) ? record.productIds.join(",") : String(record.productIds || ""),
          startTime: payload.timeRange?.[0] ? payload.timeRange[0].toISOString() : record.startTime,
          finishedTime: payload.timeRange?.[1] ? payload.timeRange[1].toISOString() : record.finishedTime,
          finished: Boolean(payload.finished),
          bookingId: payload.bookingId,
          type: payload.type,
          status: payload.status,
          video: payload.video || null,
          price: Number(payload.price || 0),
          paid: Boolean(payload.paid),
          canceled: Boolean(payload.canceled),
          numOfsales: Number(payload.numOfsales || 0),
          channelId: Number(payload.channelId || 0),
          channelName: payload.channelName,
          comments: payload.comments || null,
          title: payload.title,
          duration: String(payload.duration || ""),
        },
      };
      await axios.put(`${baseUrl23}admin/airing-session/${record.airId}`, body);
      message.success("Session updated");
      onUpdated?.();
      onClose();
    } catch (e) {
      message.error(e?.response?.data?.message || "Failed to update session");
    } finally {
      setSubmitting(false);
    }
  };

  const approve = () => form.submit();
  const decline = async () => {
    // set status to declined and submit
    form.setFieldsValue({ status: "declined" });
    form.submit();
  };

  return (
    <Modal open={open} onCancel={onClose} footer={null} width={820} destroyOnClose>
      {record ? (
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-semibold">Review Booking</h3>
              <p className="text-sm text-gray-500">Booking ID: {record.bookingId}</p>
            </div>
            <StatusTag status={record.status} />
          </div>

          <Form layout="vertical" form={form} onFinish={submit}>
            <Row gutter={12}>
              <Col span={16}>
                <Form.Item label="Title" name="title" rules={[{ required: true }]}>
                  <Input placeholder="Show title" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Type" name="type" rules={[{ required: true }]}>
                  <Select options={[{ value: "online" }, { value: "offline" }]} />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={12}>
              <Col span={12}>
                <Form.Item label="Time Range" name="timeRange" rules={[{ required: true, message: "Select start & end" }]}>
                  <RangePicker showTime className="w-full" />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="Duration (mins)" name="duration" rules={[{ required: true }]}>
                  <InputNumber min={1} className="w-full" />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="Status" name="status" rules={[{ required: true }]}>
                  <Select options={[{ value: "pending" }, { value: "approved" }, { value: "declined" }, { value: "live" }]} />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={12}>
              <Col span={6}>
                <Form.Item label="Price" name="price">
                  <InputNumber min={0} className="w-full" />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="Sales" name="numOfsales">
                  <InputNumber min={0} className="w-full" />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="Paid" name="paid" valuePropName="checked">
                  <Switch />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="Finished" name="finished" valuePropName="checked">
                  <Switch />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={12}>
              <Col span={8}>
                <Form.Item label="Channel ID" name="channelId">
                  <InputNumber min={0} className="w-full" />
                </Form.Item>
              </Col>
              <Col span={16}>
                <Form.Item label="Channel Name" name="channelName">
                  <Input placeholder="channel-xxxxx" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={12}>
              <Col span={12}>
                <Form.Item label="Video URL" name="video">
                  <Input placeholder="https://..." />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Booking ID" name="bookingId" rules={[{ required: true }] }>
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item label="Internal Comments" name="comments">
              <Input.TextArea rows={3} />
            </Form.Item>

            <div className="flex justify-between items-center mt-2">
              <div className="text-sm text-gray-500">Air ID: {record.airId}</div>
              <Space>
                <Button onClick={onClose}>Cancel</Button>
                <Popconfirm title="Decline this booking?" onConfirm={decline} okButtonProps={{ danger: true }}>
                  <Button danger>Decline</Button>
                </Popconfirm>
                <Button type="primary" loading={submitting} onClick={approve}>
                  Save / Approve
                </Button>
              </Space>
            </div>
          </Form>
        </motion.div>
      ) : (
        <Empty />
      )}
    </Modal>
  );
};

/**
 * Comments Drawer
 */
const CommentsDrawer = ({ open, onClose, airId }) => {
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const { baseUrl23 } = useContext(MainContext);
  const load = async () => {
    if (!airId) return;
    setLoading(true);
    try {
      const { data } = await axios.get(`${baseUrl23}admin/airing-session/${airId}/comments`);
      setRows(Array.isArray(data) ? data : data?.data || []);
    } catch (e) {
      message.error("Failed to load comments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, airId]);

  const toggleVisibility = async (commentId, checked) => {
    try {
      await api.patch(`/admin/airing-session/${airId}/comments/${commentId}/visibility`, {
        visible: checked,
      });
      message.success("Visibility updated");
      load();
    } catch (e) {
      message.error("Failed to update visibility");
    }
  };

  const columns = [
    {
      title: "User",
      dataIndex: "profileName",
      key: "user",
      render: (text, rec) => (
        <Space>
          {rec.profilePic ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={rec.profilePic} alt="avatar" className="w-8 h-8 rounded-full object-cover" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gray-200" />
          )}
          <div>
            <div className="font-medium">{text || "Unknown"}</div>
            <div className="text-xs text-gray-500">{rec.userId}</div>
          </div>
        </Space>
      ),
    },
    {
      title: "Content",
      dataIndex: "content",
      key: "content",
      render: (t) => <div className="max-w-xl whitespace-pre-wrap">{t}</div>,
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (t) => fmt(t),
    },
    {
      title: "Edited",
      dataIndex: "edited",
      key: "edited",
      render: (v) => (v ? <Tag color="blue">Edited</Tag> : <Tag>—</Tag>),
    },
    {
      title: "Visible",
      key: "visible",
      render: (_, rec) => (
        <Switch defaultChecked onChange={(checked) => toggleVisibility(rec.commentId, checked)} />
      ),
    },
  ];

  return (
    <Drawer open={open} onClose={onClose} width={840} title={`Comments • ${airId || "—"}`}>
      <Table className="admin-table" rowKey={(r) => r.commentId} loading={loading} dataSource={rows} columns={columns} />
    </Drawer>
  );
};

/**
 * Bloomzon TV CRUD
 */
const BloomzonTVCrud = () => {
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/admin/bloomzon-airing-video`);
      setRows(data?.data || []);
    } catch (e) {
      message.error("Failed to fetch Bloomzon TV videos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const createVideo = async (values) => {
    try {
      const payload = {
        data: {
          createdAt: values.createdAt?.toISOString() || new Date().toISOString(),
          updatedAt: values.updatedAt?.toISOString() || new Date().toISOString(),
          videoUrl: values.videoUrl,
          views: Number(values.views || 0),
        },
      };
      await api.post(`/admin/bloomzon-airing-video`, payload);
      message.success("Video created");
      setOpen(false);
      form.resetFields();
      load();
    } catch (e) {
      message.error("Failed to create video");
    }
  };

  const updateVideo = async (id, values) => {
    try {
      const payload = {
        createdAt: values.createdAt?.toISOString() || new Date().toISOString(),
        updatedAt: values.updatedAt?.toISOString() || new Date().toISOString(),
        videoUrl: values.videoUrl,
        views: Number(values.views || 0),
      };
      await api.put(`/admin/bloomzon-airing-video/${id}`, payload);
      message.success("Video updated");
      load();
    } catch (e) {
      message.error("Failed to update video");
    }
  };

  const removeVideo = async (id) => {
    try {
      await api.delete(`/admin/bloomzon-airing-videos/${id}`);
      message.success("Video deleted");
      load();
    } catch (e) {
      message.error("Failed to delete video");
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 320,
      ellipsis: true,
    },
    {
      title: "Preview",
      dataIndex: "videoUrl",
      key: "videoUrl",
      render: (url) =>
        url ? (
          // eslint-disable-next-line jsx-a11y/media-has-caption
          <video src={url} className="w-48 rounded-lg" controls />
        ) : (
          <Tag>no-url</Tag>
        ),
    },
    {
      title: "Views",
      dataIndex: "views",
      key: "views",
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (t) => fmt(t),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, rec) => (
        <Space>
          <Tooltip title="Edit">
            <Button
              onClick={() => {
                Modal.confirm({
                  title: "Edit Video",
                  width: 620,
                  icon: null,
                  content: (
                    <Form layout="vertical" initialValues={{
                      videoUrl: rec.videoUrl,
                      views: rec.views,
                      createdAt: rec.createdAt ? dayjs(rec.createdAt) : null,
                      updatedAt: rec.updatedAt ? dayjs(rec.updatedAt) : null,
                    }}
                    onFinish={(vals) => updateVideo(rec.id, vals)}
                    id={`edit-form-${rec.id}`}
                    >
                      <Form.Item label="Video URL" name="videoUrl" rules={[{ required: true }]}>
                        <Input />
                      </Form.Item>
                      <Row gutter={12}>
                        <Col span={12}>
                          <Form.Item label="Views" name="views">
                            <InputNumber min={0} className="w-full" />
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item label="Created At" name="createdAt">
                            <DatePicker showTime className="w-full" />
                          </Form.Item>
                        </Col>
                      </Row>
                      <Form.Item label="Updated At" name="updatedAt">
                        <DatePicker showTime className="w-full" />
                      </Form.Item>
                    </Form>
                  ),
                  okText: "Save",
                  onOk: () => {
                    const f = document.getElementById(`edit-form-${rec.id}`);
                    if (f) f.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
                  },
                });
              }}
            >
              Edit
            </Button>
          </Tooltip>
          <Popconfirm title="Delete this video?" onConfirm={() => removeVideo(rec.id)}>
            <Button danger>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card className="rounded-2xl shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Bloomzon TV Library</h3>
        <Button type="primary" onClick={() => setOpen(true)}>Create Video</Button>
      </div>
      <Table className="admin-table" rowKey="id" loading={loading} dataSource={rows} columns={columns} />

      <Modal open={open} onCancel={() => setOpen(false)} footer={null} width={620} destroyOnClose>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h3 className="text-lg font-semibold mb-4">Create Bloomzon TV Video</h3>
          <Form layout="vertical" form={form} onFinish={createVideo}>
            <Form.Item label="Video URL" name="videoUrl" rules={[{ required: true }]}>
              <Input placeholder="https://..." />
            </Form.Item>
            <Row gutter={12}>
              <Col span={12}>
                <Form.Item label="Views" name="views">
                  <InputNumber min={0} className="w-full" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Created At" name="createdAt">
                  <DatePicker showTime className="w-full" />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item label="Updated At" name="updatedAt">
              <DatePicker showTime className="w-full" />
            </Form.Item>

            <div className="flex justify-end gap-2">
              <Button onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="primary" htmlType="submit">Create</Button>
            </div>
          </Form>
        </motion.div>
      </Modal>
    </Card>
  );
};

/**
 * MAIN DASHBOARD
 */
export default function BloomzonTVDashboard() {
  const [loading, setLoading] = useState(false);
  const [sessions, setSessions] = useState({ pending: [], current: [], future: [], past: [] });
  const [selected, setSelected] = useState(null);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);

  // A helper function to safely process the API response data.
  // It checks if the data is an array and returns it, otherwise, it returns an empty array.
  const processResponseData = (data) => {
    return Array.isArray(data) ? data : [];
  };
  const safeFetch = async (url) => {
    try {
      const res = await axios.get(url);
      return res.data.data || [];
    } catch (err) {
      if (err.response && err.response.status === 404) {
        return []; // fallback if backend wrongly returns 404
      }
      message.error(`Failed to load data from ${url}`);
      return [];
    }
  };

  const loadAll = async () => {
    setLoading(true);
    try {
      const [pending, current, future, past] = await Promise.all([
        safeFetch("https://bloomzonserver.onrender.com/bloomzonlive/admin/airing-session"),
        safeFetch("https://bloomzonserver.onrender.com/bloomzonlive/admin/current-airing-session"),
        safeFetch("https://bloomzonserver.onrender.com/bloomzonlive/admin/future-airing-session"),
        safeFetch("https://bloomzonserver.onrender.com/bloomzonlive/admin/passed-airing-session"),
      ]);
  

      

        setSessions({ pending, current, future, past });
    } catch (e) {
      message.error("Failed to load sessions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const kpis = useMemo(() => {
    const total = ["pending", "current", "future", "past"].reduce((acc, k) => acc + (sessions[k]?.length || 0), 0);
    const live = sessions.current?.length || 0;
    const past = sessions.past?.length || 0;
    const totalSales = (sessions.past || []).reduce((sum, s) => sum + Number(s.numOfsales || 0), 0);
    return { total, live, past, totalSales };
  }, [sessions]);

  const commonColumns = [
    { title: "Booking ID", dataIndex: "bookingId", key: "bookingId", width: 170 },
    { title: "Title", dataIndex: "title", key: "title", ellipsis: true },
    { title: "Channel", dataIndex: "channelName", key: "channelName" },
    { title: "Start", dataIndex: "startTime", key: "startTime", render: (t) => fmt(t) },
    { title: "End", dataIndex: "finishedTime", key: "finishedTime", render: (t) => fmt(t) },
    { title: "Duration", dataIndex: "duration", key: "duration", render: (d) => `${d}m` },
    { title: "Status", dataIndex: "status", key: "status", render: (s) => <StatusTag status={s} /> },
    { title: "Sales", dataIndex: "numOfsales", key: "numOfsales" },
    {
      title: "Actions",
      key: "actions",
      render: (_, rec) => (
        <Space>
          <Button onClick={() => { setSelected(rec); setReviewOpen(true); }}>Review</Button>
          <Button onClick={() => { setSelected(rec); setCommentsOpen(true); }}>Comments</Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* KPIs */}
      <Row gutter={16} className="mb-6">
        <Col xs={24} sm={12} md={6}>
          <Card className="rounded-2xl shadow-md">
            <Statistic title="Total Bookings" value={kpis.total} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="rounded-2xl shadow-md">
            <Statistic title="Live Streams" value={kpis.live} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="rounded-2xl shadow-md">
            <Statistic title="Past Airings" value={kpis.past} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="rounded-2xl shadow-md">
            <Statistic title="Total Sales (count)" value={kpis.totalSales} />
          </Card>
        </Col>
      </Row>

      {/* Sessions */}
      <Card className="rounded-2xl shadow-md mb-6">
        <Tabs defaultActiveKey="pending">
          <TabPane tab="Pending Sessions" key="pending">
            <Table className="admin-table overflow-x-auto" rowKey="airId" loading={loading} dataSource={sessions.pending} columns={commonColumns} />
          </TabPane>
          <TabPane tab="Current (Live)" key="current">
            <Table className="admin-table overflow-x-auto w-full" rowKey="airId" loading={loading} dataSource={sessions.current} columns={commonColumns} />
          </TabPane>
          <TabPane tab="Future Sessions" key="future">
            <Table className="admin-table overflow-x-auto" rowKey="airId" loading={loading} dataSource={sessions.future} columns={commonColumns} />
          </TabPane>
          <TabPane tab="Past Sessions" key="past">
            <Table className="admin-table overflow-x-auto" rowKey="airId" loading={loading} dataSource={sessions.past} columns={commonColumns} />
          </TabPane>
        </Tabs>
      </Card>

      {/* Bloomzon TV CRUD */}
      <BloomzonTVCrud />

      {/* Modals/Drawers */}
      <ReviewSessionModal
        open={reviewOpen}
        onClose={() => setReviewOpen(false)}
        record={selected}
        onUpdated={loadAll}
      />
      <CommentsDrawer open={commentsOpen} onClose={() => setCommentsOpen(false)} airId={selected?.airId} />

      <Divider />
      <div className="text-xs text-gray-400">
        Tips: Use the Review button to approve/decline or update details. Use Comments to toggle visibility of user messages.
      </div>
    </div>
  );
}