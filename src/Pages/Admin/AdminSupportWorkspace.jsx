import React, {
  useCallback,
  useContext,
  useDeferredValue,
  useEffect,
  useMemo,
  useState,
  useRef,
} from "react";
import {
  Alert,
  Avatar,
  Button,
  Empty,
  Form,
  Input,
  Modal,
  Segmented,
  Select,
  Space,
  Spin,
  Table,
  Tag,
  message,
} from "antd";
import { DownloadOutlined, ReloadOutlined, SendOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";

import { MainContext } from "../../Context/MainContext";
import {
  defaultAdminAdmins,
  defaultAdminSupportConversations,
  defaultAdminSupportMessages,
  fetchAdminAdmins,
  fetchAdminSupportConversations,
  fetchAdminSupportMessages,
  markAdminSupportConversationRead,
  sendAdminSupportMessage,
  updateAdminSupportTicket,
} from "../../api/admin";
import { downloadCsv, formatNumber, prettifyKey } from "../BloomzonAdmin/shared";
import {
  buildSupportTicketRows,
  readSupportWorkflowState,
  upsertSupportWorkflowEntry,
  writeSupportWorkflowState,
} from "./supportWorkflow";
import { getAdminChatSocket } from "../../utils/adminChatSocket";
import "./adminWorkspace.css";

const formatDateTime = (value) =>
  value ? new Date(value).toLocaleString() : "N/A";

const conversationTypeOptions = [
  { label: "Users", value: "user" },
  { label: "Support", value: "support" },
  { label: "Disputes", value: "dispute" },
  { label: "Internal", value: "internal" },
];

const statusOptions = [
  { label: "All", value: "all" },
  { label: "Unread", value: "unread" },
  { label: "Open", value: "open" },
  { label: "In progress", value: "in_progress" },
  { label: "Resolved", value: "resolved" },
  { label: "Closed", value: "closed" },
];

const statusColor = {
  unread: "gold",
  open: "gold",
  in_progress: "blue",
  resolved: "green",
  closed: "default",
  sent: "default",
  read: "green",
};

const slaColor = {
  breached: "red",
  warning: "orange",
  on_track: "green",
  resolved: "blue",
  untracked: "default",
};

const toDateTimeLocalInput = (value) => {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const normalizeParticipantType = (value) => {
  const normalized = String(value || "")
    .trim()
    .toLowerCase();

  if (!normalized) {
    return "";
  }

  if (normalized === "customer" || normalized === "buyer") {
    return "user";
  }

  if (normalized === "seller") {
    return "vendor";
  }

  return normalized;
};

const sortMessagesByCreatedAt = (items) =>
  [...items].sort(
    (left, right) =>
      new Date(left?.created_at || 0).getTime() -
      new Date(right?.created_at || 0).getTime(),
  );

const mergeThreadMessage = (items, incomingMessage) => {
  const normalizedIncomingId = String(incomingMessage?.id || "");
  const nextItems = [...(items || [])];
  const existingIndex = nextItems.findIndex(
    (item) => String(item?.id || "") === normalizedIncomingId,
  );

  if (existingIndex >= 0) {
    nextItems[existingIndex] = {
      ...nextItems[existingIndex],
      ...incomingMessage,
    };
    return sortMessagesByCreatedAt(nextItems);
  }

  nextItems.push(incomingMessage);
  return sortMessagesByCreatedAt(nextItems);
};

const matchesConversationMessage = (
  message,
  activeConversationId,
  activeConversation,
) => {
  if (!activeConversationId || !message) {
    return false;
  }

  const metadataConversationId =
    message?.metadata?.admin_support?.conversation_id || null;
  if (
    metadataConversationId &&
    String(metadataConversationId) === String(activeConversationId)
  ) {
    return true;
  }

  const senderType = normalizeParticipantType(message?.sender_type);
  const receiverType = normalizeParticipantType(message?.receiver_type);
  const senderId = Number(message?.sender_id || 0);
  const receiverId = Number(message?.receiver_id || 0);

  if (String(activeConversationId).startsWith("user-")) {
    const partnerId = Number(String(activeConversationId).slice(5));
    return (
      (senderType === "user" &&
        senderId === partnerId &&
        receiverType === "admin") ||
      (receiverType === "user" &&
        receiverId === partnerId &&
        senderType === "admin")
    );
  }

  if (String(activeConversationId).startsWith("internal-")) {
    const partnerId = Number(String(activeConversationId).slice(9));
    return senderType === "admin" && receiverType === "admin"
      ? senderId === partnerId || receiverId === partnerId
      : false;
  }

  if (
    activeConversation?.channelType === "support" ||
    activeConversation?.channelType === "dispute"
  ) {
    const participantId = Number(activeConversation?.participant?.id || 0);
    return participantId > 0
      ? (senderType === "vendor" &&
          senderId === participantId &&
          receiverType === "admin") ||
          (receiverType === "vendor" &&
            receiverId === participantId &&
            senderType === "admin")
      : false;
  }

  return false;
};

const AdminSupportWorkspace = () => {
  const { token } = useContext(MainContext);
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const [type, setType] = useState("support");
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [conversationList, setConversationList] = useState(
    defaultAdminSupportConversations,
  );
  const [admins, setAdmins] = useState(defaultAdminAdmins.items || []);
  const [thread, setThread] = useState(defaultAdminSupportMessages);
  const [loadingList, setLoadingList] = useState(false);
  const [loadingThread, setLoadingThread] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [threadError, setThreadError] = useState("");
  const [draft, setDraft] = useState("");
  const [workflowState, setWorkflowState] = useState(() =>
    readSupportWorkflowState(),
  );
  const [workflowModal, setWorkflowModal] = useState({
    open: false,
    record: null,
  });
  const [workflowForm] = Form.useForm();
  const scrollRef = useRef(null);

  const deferredSearch = useDeferredValue(search);
  const isDirectUserConversation = String(conversationId || "").startsWith("user-");

  const loadConversations = useCallback(async () => {
    try {
      setLoadingList(true);
      setError("");
      const [nextData, adminData] = await Promise.all([
        fetchAdminSupportConversations(token, {
          type,
          status,
          search: deferredSearch || undefined,
          page,
          limit: 20,
        }),
        fetchAdminAdmins(token),
      ]);
      setConversationList(nextData || defaultAdminSupportConversations);
      setAdmins(adminData?.items || defaultAdminAdmins.items || []);
    } catch (fetchError) {
      setError(
        fetchError?.response?.data?.message ||
          "Failed to load admin support conversations.",
      );
    } finally {
      setLoadingList(false);
    }
  }, [deferredSearch, page, status, token, type]);

  const selectedConversation = useMemo(() => {
    const listConversation =
      (conversationList.items || []).find(
        (conversation) => conversation.id === conversationId,
      ) || null;

    if (listConversation) {
      return listConversation;
    }

    const fallbackConversation = thread?.conversation || null;
    const fallbackParticipant = fallbackConversation?.participant || null;
    const fallbackCase = fallbackConversation?.case || null;

    if (fallbackConversation && fallbackConversation.id === conversationId) {
      return {
        id: fallbackConversation.id,
        channelType: fallbackConversation.channelType || "user",
        title: fallbackParticipant?.name || "Direct chat",
        subtitle: fallbackParticipant?.email || fallbackCase?.description || "Direct conversation",
        status: "active",
        unreadCount: 0,
        participant: fallbackParticipant,
        case: fallbackCase,
        updatedAt:
          thread.items?.[thread.items.length - 1]?.created_at ||
          fallbackCase?.updatedAt ||
          null,
        lastMessageDate:
          thread.items?.[thread.items.length - 1]?.created_at || null,
        lastMessagePreview:
          thread.items?.[thread.items.length - 1]?.message || "No messages yet",
      };
    }

    return null;
  }, [conversationId, conversationList.items, thread.conversation, thread.items]);

  const ticketWorkflowRows = useMemo(
    () => buildSupportTicketRows(conversationList.items, workflowState, admins),
    [admins, conversationList.items, workflowState],
  );

  const selectedTicketWorkflow = useMemo(
    () =>
      ticketWorkflowRows.find(
        (row) =>
          row.conversationId === conversationId ||
          row.caseId === thread.conversation?.case?.caseId,
      ) || null,
    [conversationId, thread.conversation?.case?.caseId, ticketWorkflowRows],
  );

  const supportSummary = useMemo(
    () => ({
      total: ticketWorkflowRows.length,
      unassigned: ticketWorkflowRows.filter((row) => !row.assigneeId).length,
      breached: ticketWorkflowRows.filter((row) => row.slaStatus === "breached")
        .length,
      warning: ticketWorkflowRows.filter((row) => row.slaStatus === "warning").length,
    }),
    [ticketWorkflowRows],
  );

  const loadMessages = useCallback(async (nextConversationId) => {
    if (!nextConversationId) {
      setThread(defaultAdminSupportMessages);
      return;
    }

    try {
      setLoadingThread(true);
      setThreadError("");
      const nextThread = await fetchAdminSupportMessages(token, nextConversationId);
      setThread(nextThread || defaultAdminSupportMessages);
    } catch (fetchError) {
      setThreadError(
        fetchError?.response?.data?.message ||
          "Failed to load support conversation messages.",
      );
    } finally {
      setLoadingThread(false);
    }
  }, [token]);

  useEffect(() => {
    if (isDirectUserConversation && type !== "user") {
      setType("user");
    }
  }, [isDirectUserConversation, type]);

  useEffect(() => {
    if (token) {
      loadConversations();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, type, status, deferredSearch, page]);

  useEffect(() => {
    if (!conversationList.items?.length) {
      if (conversationId && !isDirectUserConversation) {
        navigate("/dashboard/others/admins/messages", { replace: true });
      }
      return;
    }

    if (!conversationId) {
      navigate(
        `/dashboard/others/admins/messages/${conversationList.items[0].id}`,
        { replace: true },
      );
    }
  }, [conversationId, conversationList.items, isDirectUserConversation, navigate]);

  useEffect(() => {
    if (token && conversationId) {
      loadMessages(conversationId);
    }
  }, [conversationId, loadMessages, token]);

  useEffect(() => {
    if (!token) {
      return undefined;
    }

    let active = true;
    let socketRef = null;

    const handleIncomingMessage = (incomingMessage) => {
      loadConversations();

      if (
        !matchesConversationMessage(
          incomingMessage,
          conversationId,
          selectedConversation,
        )
      ) {
        return;
      }

      setThread((current) => ({
        ...current,
        items: mergeThreadMessage(current.items, incomingMessage),
      }));
    };

    const handleReadReceipt = (payload) => {
      loadConversations();

      if (
        !matchesConversationMessage(payload, conversationId, selectedConversation)
      ) {
        return;
      }

      setThread((current) => ({
        ...current,
        items: (current.items || []).map((item) =>
          item.is_from_actor
            ? { ...item, status: payload?.status || "read" }
            : item,
        ),
      }));
    };

    const initSocket = async () => {
      try {
        socketRef = await getAdminChatSocket(token);
        if (!active || !socketRef) {
          return;
        }

        socketRef.on("chat:new_message", handleIncomingMessage);
        socketRef.on("chat:message_read", handleReadReceipt);
      } catch (socketError) {
        console.warn("Admin chat socket unavailable:", socketError);
      }
    };

    initSocket();

    return () => {
      active = false;
      if (socketRef) {
        socketRef.off("chat:new_message", handleIncomingMessage);
        socketRef.off("chat:message_read", handleReadReceipt);
      }
    };
  }, [conversationId, loadConversations, selectedConversation, token]);

  useEffect(() => {
    if (!selectedConversation?.unreadCount || !conversationId || !token) {
      return;
    }

    markAdminSupportConversationRead(token, conversationId)
      .then(() => {
        setConversationList((current) => ({
          ...current,
          items: (current.items || []).map((conversation) =>
            conversation.id === conversationId
              ? { ...conversation, unreadCount: 0, status: conversation.status === "unread" ? "read" : conversation.status }
              : conversation,
          ),
          summary: {
            ...(current.summary || {}),
            unread: Math.max(
              0,
              Number(current.summary?.unread || 0) - Number(selectedConversation.unreadCount || 0),
            ),
          },
        }));
      })
      .catch(() => {});
  }, [conversationId, selectedConversation?.unreadCount, token]);

  const handleSelectConversation = (item) => {
    navigate(`/dashboard/others/admins/messages/${item.id}`);
  };

  const handleSend = async () => {
    const content = draft.trim();
    if (!content || !conversationId) {
      return;
    }

    try {
      setSending(true);
      const newMessage = await sendAdminSupportMessage(token, conversationId, {
        message: content,
      });
      setThread((current) => ({
        ...current,
        items: mergeThreadMessage(current.items, newMessage),
      }));
      setConversationList((current) => ({
        ...current,
        items: (current.items || []).map((conversation) =>
          conversation.id === conversationId
            ? {
                ...conversation,
                lastMessagePreview: newMessage?.message || content,
                lastMessageDate: newMessage?.created_at || new Date().toISOString(),
                updatedAt: newMessage?.created_at || new Date().toISOString(),
              }
            : conversation,
        ),
      }));
      setDraft("");
    } catch (sendError) {
      setThreadError(
        sendError?.response?.data?.message || "Failed to send support message.",
      );
    } finally {
      setSending(false);
    }
  };

  const saveWorkflowPatch = useCallback((ticketId, patch) => {
    setWorkflowState((current) => {
      const nextState = upsertSupportWorkflowEntry(current, ticketId, patch);
      writeSupportWorkflowState(nextState);
      return nextState;
    });
  }, []);

  const openWorkflowModal = useCallback((record) => {
    setWorkflowModal({ open: true, record });
    workflowForm.setFieldsValue({
      priority: record.priority,
      status: record.status,
      assigneeId: record.assigneeId || undefined,
      dueAt: toDateTimeLocalInput(record.dueAt),
      notes: record.notes || "",
    });
  }, [workflowForm]);

  const handleSaveWorkflow = useCallback(async () => {
    try {
      const values = await workflowForm.validateFields();
      const record = workflowModal.record;

      if (!record) {
        return;
      }

      const assignee = admins.find(
        (admin) => String(admin?.id || "") === String(values.assigneeId || ""),
      );

      const backendPayload = {
        priority: values.priority === "critical" ? "urgent" : values.priority,
        status: values.status,
        assigned_admin_id: values.assigneeId ? Number(values.assigneeId) : null,
        resolution_due_at: values.dueAt
          ? new Date(values.dueAt).toISOString()
          : null,
        notes: values.notes || "",
      };

      if (record.ticketId) {
        await updateAdminSupportTicket(token, record.ticketId, backendPayload);
      }

      saveWorkflowPatch(record.id, {
        priority: values.priority,
        status: values.status,
        assigneeId: values.assigneeId || "",
        assigneeLabel:
          assignee?.user?.name ||
          assignee?.email ||
          assignee?.admin_code ||
          "Unassigned",
        dueAt: values.dueAt ? new Date(values.dueAt).toISOString() : null,
        notes: values.notes || "",
      });

      setWorkflowModal({ open: false, record: null });
      workflowForm.resetFields();
      await loadConversations();
      message.success("Support workflow updated.");
    } catch (workflowError) {
      if (workflowError?.errorFields) {
        return;
      }

      message.error(
        workflowError?.response?.data?.message || "Unable to save support workflow.",
      );
    }
  }, [admins, loadConversations, saveWorkflowPatch, token, workflowForm, workflowModal.record]);

  const exportTicketWorkflow = useCallback(() => {
    const rows = ticketWorkflowRows.map((row) => ({
      case_id: row.caseId,
      type: row.channelType,
      subject: row.title,
      seller: row.participant?.name || row.subtitle || "",
      backend_status: row.originalStatus,
      workflow_status: row.status,
      priority: row.priority,
      assignee: row.assigneeLabel,
      unread: row.unreadCount,
      sla_status: row.slaStatus,
      due_at: formatDateTime(row.dueAt),
      updated_at: formatDateTime(row.updatedAt),
      notes: row.notes,
    }));

    if (downloadCsv("bloomzon-support-ticket-workflow.csv", rows)) {
      message.success("Support ticket workflow exported.");
    }
  }, [ticketWorkflowRows]);

  useEffect(() => {
    setPage(1);
  }, [type, status]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [thread.items]);

  return (
    <div className="admin-workspace">
      <div className="admin-workspace__header">
        <div className="admin-workspace__copy">
          <div className="admin-workspace__eyebrow">Support Chat</div>
          <h1 className="admin-workspace__title">Admin Support Inbox</h1>
          <div className="admin-workspace__subtitle">
            Handle direct user chats, seller support, disputes, and internal admin chats from one
            data-driven workspace.
          </div>
        </div>
        <div className="admin-workspace__actions">
          <Button onClick={() => navigate("/dashboard/actions/notifications")}>
            Notifications
          </Button>
          <Button
            icon={<DownloadOutlined />}
            onClick={exportTicketWorkflow}
            disabled={!ticketWorkflowRows.length}
          >
            Export workflow
          </Button>
          <Button icon={<ReloadOutlined />} onClick={loadConversations}>
            Refresh
          </Button>
        </div>
      </div>

      {error ? (
        <Alert
          style={{ marginBottom: 18 }}
          type="error"
          message={error}
          showIcon
        />
      ) : null}

        <Alert
          style={{ marginBottom: 18 }}
          type="info"
          showIcon
          message="Support workflow coverage"
          description="Ticket assignment, priority, SLA due dates, and notes are persisted through the admin support-ticket API. Local workflow state is retained only as a lightweight UI cache."
        />

      <div className="admin-kpi-grid" style={{ marginBottom: 18 }}>
        <div className="admin-kpi">
          <div className="admin-kpi__label">Ticket workflow</div>
          <div className="admin-kpi__value">{formatNumber(supportSummary.total)}</div>
          <div className="admin-kpi__helper">Support and dispute cases in the active queue.</div>
        </div>
        <div className="admin-kpi">
          <div className="admin-kpi__label">Unassigned</div>
          <div className="admin-kpi__value">{formatNumber(supportSummary.unassigned)}</div>
          <div className="admin-kpi__helper">Tickets without an admin owner.</div>
        </div>
        <div className="admin-kpi">
          <div className="admin-kpi__label">SLA at risk</div>
          <div className="admin-kpi__value">{formatNumber(supportSummary.warning)}</div>
          <div className="admin-kpi__helper">Tickets due within the next four hours.</div>
        </div>
        <div className="admin-kpi">
          <div className="admin-kpi__label">SLA breached</div>
          <div className="admin-kpi__value">{formatNumber(supportSummary.breached)}</div>
          <div className="admin-kpi__helper">Tickets past their local SLA target.</div>
        </div>
      </div>

      <div className="admin-panel admin-panel--soft" style={{ marginBottom: 18 }}>
        <div className="admin-panel__body">
          <div className="admin-toolbar">
            <Segmented
              options={conversationTypeOptions}
              value={type}
              onChange={setType}
            />
            <Select
              options={statusOptions}
              value={status}
              onChange={setStatus}
              style={{ minWidth: 180 }}
            />
            <Input.Search
              allowClear
              className="admin-toolbar__grow"
              placeholder="Search cases, participants, or last messages"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <div className="admin-inline-stats">
            <span className="admin-stat-pill">
              Users: <strong>{conversationList.summary.user || 0}</strong>
            </span>
            <span className="admin-stat-pill">
              Support: <strong>{conversationList.summary.support}</strong>
            </span>
            <span className="admin-stat-pill">
              Disputes: <strong>{conversationList.summary.dispute}</strong>
            </span>
            <span className="admin-stat-pill">
              Internal: <strong>{conversationList.summary.internal}</strong>
            </span>
            <span className="admin-stat-pill">
              Unread: <strong>{conversationList.summary.unread}</strong>
            </span>
          </div>
        </div>
      </div>

      <div className="admin-panel admin-panel--soft" style={{ marginBottom: 18 }}>
        <div className="admin-panel__body">
          <div className="admin-panel__header">
            <div>
              <h2 className="admin-panel__title">Ticket Workflow</h2>
              <div className="admin-panel__subtitle">
                Assignment, priority, SLA targets, and response posture for support and dispute cases.
              </div>
            </div>
          </div>
          <Table
            rowKey="id"
            dataSource={ticketWorkflowRows}
            pagination={false}
            locale={{ emptyText: <Empty description="No support or dispute tickets" /> }}
            columns={[
              {
                title: "Case",
                key: "case",
                render: (_, record) => (
                  <div>
                    <div style={{ fontWeight: 600 }}>{record.caseId}</div>
                    <div style={{ color: "#6b7280", fontSize: 12 }}>{record.title}</div>
                  </div>
                ),
              },
              {
                title: "Seller",
                key: "seller",
                render: (_, record) => (
                  <div>
                    <div>{record.participant?.name || record.subtitle || "Unknown seller"}</div>
                    <div style={{ color: "#6b7280", fontSize: 12 }}>
                      {record.participant?.email || "No email"}
                    </div>
                  </div>
                ),
              },
              {
                title: "Priority",
                key: "priority",
                render: (_, record) => (
                  <Tag color={record.priority === "critical" ? "red" : record.priority === "high" ? "orange" : record.priority === "normal" ? "blue" : "default"}>
                    {prettifyKey(record.priority)}
                  </Tag>
                ),
              },
              {
                title: "Owner",
                key: "assignee",
                render: (_, record) => record.assigneeLabel,
              },
              {
                title: "SLA",
                key: "sla",
                render: (_, record) => (
                  <Space direction="vertical" size={2}>
                    <Tag color={slaColor[record.slaStatus] || "default"}>
                      {prettifyKey(record.slaStatus)}
                    </Tag>
                    <span style={{ fontSize: 12, color: "#6b7280" }}>
                      Due {formatDateTime(record.dueAt)}
                    </span>
                  </Space>
                ),
              },
              {
                title: "Status",
                key: "status",
                render: (_, record) => (
                  <Space wrap>
                    <Tag color={statusColor[record.status] || "default"}>
                      {prettifyKey(record.status)}
                    </Tag>
                    {record.unreadCount ? (
                      <Tag color="gold">{formatNumber(record.unreadCount)} unread</Tag>
                    ) : null}
                  </Space>
                ),
              },
              {
                title: "Actions",
                key: "actions",
                render: (_, record) => (
                  <Space wrap>
                    <Button size="small" onClick={() => openWorkflowModal(record)}>
                      Manage
                    </Button>
                    <Button
                      size="small"
                      type="link"
                      onClick={() =>
                        navigate(`/dashboard/others/admins/messages/${record.conversationId}`)
                      }
                    >
                      Open thread
                    </Button>
                  </Space>
                ),
              },
            ]}
          />
        </div>
      </div>

      <div className="admin-chat-layout">
        <div className="admin-panel admin-panel--soft">
          <div className="admin-panel__body">
            <div className="admin-panel__header">
              <div>
                <h2 className="admin-panel__title">Conversations</h2>
                <div className="admin-panel__subtitle">
                  Real support and admin threads, not placeholder rows.
                </div>
              </div>
            </div>

            {loadingList ? (
              <div className="admin-chat-sidebar__empty">
                <Spin />
              </div>
            ) : conversationList.items?.length ? (
              <div className="admin-chat-sidebar">
                {conversationList.items.map((item) => (
                  <button
                    className={`admin-chat-item ${
                      item.id === conversationId ? "admin-chat-item--active" : ""
                    }`}
                    key={item.id}
                    onClick={() => handleSelectConversation(item)}
                    type="button"
                  >
                    <div className="admin-chat-item__top">
                      <div className="admin-chat-item__participant">
                        <Avatar size={40}>
                          {String(item.participant?.name || item.title || "?")
                            .charAt(0)
                            .toUpperCase()}
                        </Avatar>
                        <div>
                          <div className="admin-chat-item__title">{item.title}</div>
                          <div className="admin-chat-item__subtitle">
                            {item.subtitle}
                          </div>
                        </div>
                      </div>
                      <Tag color={statusColor[item.status] || "default"}>
                        {String(item.status || "active").replace("_", " ").toUpperCase()}
                      </Tag>
                    </div>
                    <div className="admin-chat-item__preview">
                      {item.lastMessagePreview || "No messages yet"}
                    </div>
                    <div className="admin-chat-item__meta">
                      <span>{formatDateTime(item.lastMessageDate || item.updatedAt)}</span>
                      {item.unreadCount ? (
                        <span className="admin-chat-unread">{item.unreadCount} unread</span>
                      ) : null}
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <Empty
                className="admin-chat-sidebar__empty"
                description="No conversations found."
              />
            )}
          </div>
        </div>

        <div className="admin-panel admin-panel--soft">
          <div className="admin-panel__body">
            {threadError ? (
              <Alert
                style={{ marginBottom: 18 }}
                type="error"
                message={threadError}
                showIcon
              />
            ) : null}

            {loadingThread ? (
              <div className="admin-chat-thread__empty">
                <Spin />
              </div>
            ) : selectedConversation ? (
              <>
                <div className="admin-panel__header">
                  <div>
                    <h2 className="admin-panel__title">{selectedConversation.title}</h2>
                    <div className="admin-panel__subtitle">
                      {selectedConversation.subtitle}
                    </div>
                  </div>
                  <div className="admin-inline-stats">
                    <span className="admin-stat-pill">
                      Type: <strong>{selectedConversation.channelType}</strong>
                    </span>
                    {thread.conversation?.case?.caseId ? (
                      <span className="admin-stat-pill">
                        Case: <strong>{thread.conversation.case.caseId}</strong>
                      </span>
                    ) : null}
                    {selectedTicketWorkflow ? (
                      <>
                        <span className="admin-stat-pill">
                          Owner: <strong>{selectedTicketWorkflow.assigneeLabel}</strong>
                        </span>
                        <span className="admin-stat-pill">
                          SLA: <strong>{prettifyKey(selectedTicketWorkflow.slaStatus)}</strong>
                        </span>
                      </>
                    ) : null}
                  </div>
                </div>

                {thread.conversation?.case ? (
                  <div className="admin-chat-case">
                    <div className="admin-chat-case__title">Case Metadata</div>
                    <div className="admin-inline-stats">
                      <span className="admin-stat-pill">
                        Status: <strong>{thread.conversation.case.status}</strong>
                      </span>
                      {selectedTicketWorkflow ? (
                        <>
                          <span className="admin-stat-pill">
                            Priority: <strong>{prettifyKey(selectedTicketWorkflow.priority)}</strong>
                          </span>
                          <span className="admin-stat-pill">
                            Due: <strong>{formatDateTime(selectedTicketWorkflow.dueAt)}</strong>
                          </span>
                        </>
                      ) : null}
                      <span className="admin-stat-pill">
                        Vendor:{" "}
                        <strong>
                          {thread.conversation.participant?.name || "Unknown vendor"}
                        </strong>
                      </span>
                      <span className="admin-stat-pill">
                        Updated:{" "}
                        <strong>
                          {formatDateTime(thread.conversation.case.updatedAt)}
                        </strong>
                      </span>
                    </div>
                    {thread.conversation.case.description ? (
                      <div className="admin-chat-case__description">
                        {thread.conversation.case.description}
                      </div>
                    ) : null}
                  </div>
                ) : null}

                <div className="admin-chat-thread" ref={scrollRef}>
                  {thread.items?.length ? (
                    thread.items.map((item) => (
                      <div
                        className={`admin-chat-bubble ${
                          item.is_from_actor
                            ? "admin-chat-bubble--self"
                            : "admin-chat-bubble--peer"
                        }`}
                        key={item.id}
                      >
                        <div className="admin-chat-bubble__meta">
                          <strong>{item.sender_name || "Unknown sender"}</strong>
                          <span>{formatDateTime(item.created_at)}</span>
                        </div>
                        <div className="admin-chat-bubble__body">{item.message}</div>
                      </div>
                    ))
                  ) : (
                    <Empty description="No messages yet." />
                  )}
                </div>

                <div className="admin-chat-composer">
                  <Input.TextArea
                    autoSize={{ minRows: 2, maxRows: 5 }}
                    placeholder="Reply to this conversation"
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    onPressEnter={(event) => {
                      if (!event.shiftKey) {
                        event.preventDefault();
                        handleSend();
                      }
                    }}
                  />
                  <Button
                    icon={<SendOutlined />}
                    loading={sending}
                    onClick={handleSend}
                    type="primary"
                  >
                    Send
                  </Button>
                </div>
              </>
            ) : (
              <Empty
                className="admin-chat-thread__empty"
                description="Select a conversation to view the thread."
              />
            )}
          </div>
        </div>
      </div>
      <Modal
        title={
          workflowModal.record
            ? `Manage ${workflowModal.record.caseId}`
            : "Manage support workflow"
        }
        open={workflowModal.open}
        onCancel={() => {
          setWorkflowModal({ open: false, record: null });
          workflowForm.resetFields();
        }}
        onOk={handleSaveWorkflow}
        okText="Save workflow"
      >
        <Form form={workflowForm} layout="vertical">
          <Form.Item
            name="priority"
            label="Priority"
            rules={[{ required: true, message: "Select a priority" }]}
          >
            <Select
              options={[
                { value: "critical", label: "Critical" },
                { value: "high", label: "High" },
                { value: "normal", label: "Normal" },
                { value: "low", label: "Low" },
              ]}
            />
          </Form.Item>
          <Form.Item
            name="status"
            label="Workflow status"
            rules={[{ required: true, message: "Select a status" }]}
          >
            <Select options={statusOptions.filter((item) => item.value !== "all" && item.value !== "unread")} />
          </Form.Item>
          <Form.Item name="assigneeId" label="Assigned admin">
            <Select
              allowClear
              placeholder="Select an admin owner"
              options={(admins || []).map((admin) => ({
                value: String(admin?.id || ""),
                label:
                  admin?.user?.name ||
                  admin?.email ||
                  admin?.admin_code ||
                  `Admin #${admin?.id || ""}`,
              }))}
            />
          </Form.Item>
          <Form.Item name="dueAt" label="SLA due date">
            <Input type="datetime-local" />
          </Form.Item>
          <Form.Item name="notes" label="Notes">
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminSupportWorkspace;
