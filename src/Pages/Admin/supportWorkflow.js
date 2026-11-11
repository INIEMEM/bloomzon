const SUPPORT_WORKFLOW_STORAGE_KEY = "bloomzon-admin:support-workflow:v1";

const priorityRank = {
  critical: 4,
  high: 3,
  normal: 2,
  low: 1,
};

const slaHoursByPriority = {
  critical: 4,
  high: 12,
  normal: 24,
  low: 48,
};

const normalizePriority = (value) => {
  const normalized = String(value || "")
    .trim()
    .toLowerCase();

  if (normalized === "urgent") {
    return "critical";
  }

  return ["critical", "high", "normal", "low"].includes(normalized)
    ? normalized
    : "normal";
};

const normalizeWorkflowStatus = (value, fallback = "open") => {
  const normalized = String(value || fallback)
    .trim()
    .toLowerCase();

  return ["open", "in_progress", "resolved", "closed"].includes(normalized)
    ? normalized
    : fallback;
};

const parseStoredWorkflowState = () => {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const raw = window.localStorage.getItem(SUPPORT_WORKFLOW_STORAGE_KEY);
    if (!raw) {
      return {};
    }

    const parsed = JSON.parse(raw);
    return parsed?.value && typeof parsed.value === "object" ? parsed.value : {};
  } catch {
    return {};
  }
};

export const readSupportWorkflowState = () => parseStoredWorkflowState();

export const writeSupportWorkflowState = (value) => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    SUPPORT_WORKFLOW_STORAGE_KEY,
    JSON.stringify({
      version: 1,
      value,
    }),
  );
};

const inferPriorityFromConversation = (conversation) => {
  const haystack = [
    conversation?.channelType,
    conversation?.title,
    conversation?.subtitle,
    conversation?.lastMessagePreview,
    conversation?.case?.issueType,
    conversation?.case?.description,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  if (
    conversation?.channelType === "dispute" ||
    haystack.includes("chargeback") ||
    haystack.includes("fraud")
  ) {
    return "critical";
  }

  if (
    haystack.includes("refund") ||
    haystack.includes("payment") ||
    haystack.includes("escalat") ||
    Number(conversation?.unreadCount || 0) >= 3
  ) {
    return "high";
  }

  if (Number(conversation?.unreadCount || 0) > 0) {
    return "normal";
  }

  return "low";
};

const toIsoDateTime = (value) => {
  if (!value) {
    return null;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toISOString();
};

const addHours = (value, hours) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  date.setHours(date.getHours() + Number(hours || 0));
  return date.toISOString();
};

export const getSupportSlaStatus = ({ dueAt, status }) => {
  const normalizedStatus = normalizeWorkflowStatus(status);

  if (normalizedStatus === "resolved" || normalizedStatus === "closed") {
    return "resolved";
  }

  const dueDate = dueAt ? new Date(dueAt) : null;
  if (!dueDate || Number.isNaN(dueDate.getTime())) {
    return "untracked";
  }

  const now = Date.now();
  const dueTime = dueDate.getTime();
  if (now > dueTime) {
    return "breached";
  }

  const msRemaining = dueTime - now;
  if (msRemaining <= 4 * 60 * 60 * 1000) {
    return "warning";
  }

  return "on_track";
};

export const buildSupportTicketRows = (
  conversations = [],
  workflowState = {},
  admins = [],
) => {
  const adminMap = new Map(
    (admins || []).map((admin) => [
      String(admin?.id || ""),
      {
        id: admin?.id,
        label:
          admin?.user?.name ||
          admin?.email ||
          admin?.admin_code ||
          `Admin #${admin?.id || ""}`,
      },
    ]),
  );

  return (conversations || [])
    .filter((conversation) =>
      ["support", "dispute"].includes(String(conversation?.channelType || "").toLowerCase()),
    )
    .map((conversation) => {
      const workflowKey = String(
        conversation?.case?.caseId ||
          conversation?.case?.case_id ||
          conversation?.id ||
          "",
      );
      const persisted = workflowState?.[workflowKey] || {};
      const caseData = conversation?.case || {};
      const priority = normalizePriority(
        caseData.priority || persisted.priority || inferPriorityFromConversation(conversation),
      );
      const status = normalizeWorkflowStatus(
        caseData.status || persisted.status || conversation?.status || "open",
      );
      const dueAt =
        toIsoDateTime(caseData?.resolutionDueAt || caseData?.resolution_due_at) ||
        toIsoDateTime(caseData?.firstResponseDueAt || caseData?.first_response_due_at) ||
        toIsoDateTime(persisted.dueAt) ||
        addHours(
          conversation?.updatedAt ||
            conversation?.lastMessageDate ||
            conversation?.createdAt ||
            new Date().toISOString(),
          slaHoursByPriority[priority],
        );
      const assigneeId =
        caseData?.assignedAdminId ||
        caseData?.assigned_admin_id ||
        caseData?.assignedTo?.adminId ||
        persisted.assigneeId
          ? String(
              caseData?.assignedAdminId ||
                caseData?.assigned_admin_id ||
                caseData?.assignedTo?.adminId ||
                persisted.assigneeId ||
                "",
            )
          : "";
      const assignee = adminMap.get(assigneeId) || null;
      const createdAt =
        conversation?.createdAt || conversation?.case?.createdAt || null;
      const updatedAt =
        conversation?.updatedAt ||
        conversation?.lastMessageDate ||
        conversation?.case?.updatedAt ||
        null;

      return {
        id: workflowKey,
        ticketId:
          caseData?.id ||
          Number(
            String(workflowKey || "")
              .replace(/[^\d]/g, ""),
          ) ||
          null,
        conversationId: conversation?.id,
        caseId:
          conversation?.case?.caseId ||
          conversation?.case?.case_id ||
          workflowKey,
        channelType: conversation?.channelType || "support",
        title: conversation?.title || conversation?.case?.issueType || "Support ticket",
        subtitle: conversation?.subtitle || "",
        description:
          conversation?.case?.description ||
          conversation?.lastMessagePreview ||
          "",
        participant: conversation?.participant || null,
        status,
        originalStatus:
          conversation?.status || conversation?.case?.status || "open",
        priority,
        priorityWeight: priorityRank[priority] || 0,
        dueAt,
        slaStatus: getSupportSlaStatus({ dueAt, status }),
        assigneeId,
        assigneeLabel:
          assignee?.label ||
          caseData?.assignedTo?.name ||
          caseData?.assignedTo?.email ||
          persisted.assigneeLabel ||
          "Unassigned",
        unreadCount: Number(conversation?.unreadCount || 0),
        createdAt,
        updatedAt,
        notes:
          caseData?.metadata?.admin_support?.latestNote ||
          caseData?.metadata?.admin_support?.latest_note ||
          persisted.notes ||
          "",
        lastMessagePreview: conversation?.lastMessagePreview || "",
      };
    })
    .sort((left, right) => {
      const priorityDelta = (right.priorityWeight || 0) - (left.priorityWeight || 0);
      if (priorityDelta !== 0) {
        return priorityDelta;
      }

      return (
        new Date(right.updatedAt || right.createdAt || 0).getTime() -
        new Date(left.updatedAt || left.createdAt || 0).getTime()
      );
    });
};

export const upsertSupportWorkflowEntry = (workflowState, ticketId, patch) => ({
  ...(workflowState || {}),
  [ticketId]: {
    ...(workflowState?.[ticketId] || {}),
    ...patch,
    updatedAt: new Date().toISOString(),
  },
});
