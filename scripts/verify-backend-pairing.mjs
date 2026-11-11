import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const frontendRoot = process.cwd();
const backendRoot =
  process.env.BLOOMZON_SERVER_PATH || "/home/elbontech/Bloomzon-Server-main";

const results = [];

const readTextFile = (root, relativePath) => {
  const absolutePath = path.resolve(root, relativePath);

  if (!existsSync(absolutePath)) {
    results.push({
      ok: false,
      label: `Missing file: ${relativePath}`,
      detail: absolutePath,
    });
    return "";
  }

  results.push({
    ok: true,
    label: `Found file: ${relativePath}`,
    detail: absolutePath,
  });

  return readFileSync(absolutePath, "utf8");
};

const assertIncludes = (content, pattern, label, detail) => {
  const ok = content.includes(pattern);
  results.push({ ok, label, detail });
};

const frontendConfig = readTextFile(frontendRoot, "src/api/config.js");
const frontendAdminApi = readTextFile(frontendRoot, "src/api/admin.js");
const frontendSocket = readTextFile(frontendRoot, "src/utils/adminChatSocket.js");
const frontendEnv = readTextFile(frontendRoot, ".env.production");

const backendRoutes = readTextFile(
  backendRoot,
  "src/modules/admin/routes/index.ts",
);
const backendControllers = readTextFile(
  backendRoot,
  "src/modules/admin/controllers/index.ts",
);
const backendServices = readTextFile(
  backendRoot,
  "src/modules/admin/services/index.ts",
);
const backendSocket = readTextFile(backendRoot, "src/loaders/socket.ts");

assertIncludes(
  frontendConfig,
  "axios.defaults.withCredentials = true;",
  "Frontend config enables credentialed requests",
  "src/api/config.js",
);
assertIncludes(
  frontendConfig,
  "export const ADMIN_BASE_URL = `${API_BASE_URL}/admin`;",
  "Frontend config exports ADMIN_BASE_URL",
  "src/api/config.js",
);
assertIncludes(
  frontendConfig,
  'return trimmed.endsWith("/api") ? trimmed : `${trimmed}/api`;',
  "Frontend config normalizes the /api suffix",
  "src/api/config.js",
);
assertIncludes(
  frontendEnv,
  "VITE_API_BASE_URL=",
  "Production environment defines VITE_API_BASE_URL",
  ".env.production",
);

const contractChecks = [
  {
    label: "Frontend support conversations endpoint",
    detail: "src/api/admin.js",
    content: frontendAdminApi,
    pattern: "/support/conversations",
  },
  {
    label: "Frontend support messages endpoint",
    detail: "src/api/admin.js",
    content: frontendAdminApi,
    pattern: "/support/conversations/${conversationId}/messages",
  },
  {
    label: "Frontend support read endpoint",
    detail: "src/api/admin.js",
    content: frontendAdminApi,
    pattern: "/support/conversations/${conversationId}/read",
  },
  {
    label: "Frontend dashboard overview endpoint",
    detail: "src/api/admin.js",
    content: frontendAdminApi,
    pattern: "/dashboard/overview",
  },
  {
    label: "Frontend activities endpoint",
    detail: "src/api/admin.js",
    content: frontendAdminApi,
    pattern: "/activities",
  },
  {
    label: "Frontend service analytics endpoint",
    detail: "src/api/admin.js",
    content: frontendAdminApi,
    pattern: "/service-analytics",
  },
  {
    label: "Frontend profitability endpoint",
    detail: "src/api/admin.js",
    content: frontendAdminApi,
    pattern: "/profitability",
  },
  {
    label: "Frontend vendor settlements endpoint",
    detail: "src/api/admin.js",
    content: frontendAdminApi,
    pattern: "/vendor-settlements",
  },
  {
    label: "Frontend vendor settlements settle endpoint",
    detail: "src/api/admin.js",
    content: frontendAdminApi,
    pattern: "/vendor-settlements/settle",
  },
  {
    label: "Frontend operations queues endpoint",
    detail: "src/api/admin.js",
    content: frontendAdminApi,
    pattern: "/operations/queues",
  },
  {
    label: "Frontend withdrawals endpoint",
    detail: "src/api/admin.js",
    content: frontendAdminApi,
    pattern: "/withdrawals",
  },
  {
    label: "Frontend withdrawal review endpoint",
    detail: "src/api/admin.js",
    content: frontendAdminApi,
    pattern: "/withdrawals/${withdrawalId}/review",
  },
  {
    label: "Frontend stores endpoint",
    detail: "src/api/admin.js",
    content: frontendAdminApi,
    pattern: "/stores",
  },
  {
    label: "Frontend store detail endpoint",
    detail: "src/api/admin.js",
    content: frontendAdminApi,
    pattern: "/stores/${storeId}",
  },
  {
    label: "Frontend store review endpoint",
    detail: "src/api/admin.js",
    content: frontendAdminApi,
    pattern: "/stores/${storeId}/review",
  },
  {
    label: "Backend support conversations route",
    detail: "Bloomzon-Server-main/src/modules/admin/routes/index.ts",
    content: backendRoutes,
    pattern: 'router.get(\n  "/support/conversations"',
  },
  {
    label: "Backend support messages route",
    detail: "Bloomzon-Server-main/src/modules/admin/routes/index.ts",
    content: backendRoutes,
    pattern: 'router.get(\n  "/support/conversations/:conversationId/messages"',
  },
  {
    label: "Backend support send route",
    detail: "Bloomzon-Server-main/src/modules/admin/routes/index.ts",
    content: backendRoutes,
    pattern: 'router.post(\n  "/support/conversations/:conversationId/messages"',
  },
  {
    label: "Backend support read route",
    detail: "Bloomzon-Server-main/src/modules/admin/routes/index.ts",
    content: backendRoutes,
    pattern: 'router.patch(\n  "/support/conversations/:conversationId/read"',
  },
  {
    label: "Backend dashboard overview route",
    detail: "Bloomzon-Server-main/src/modules/admin/routes/index.ts",
    content: backendRoutes,
    pattern: 'router.get("/dashboard/overview"',
  },
  {
    label: "Backend activities route",
    detail: "Bloomzon-Server-main/src/modules/admin/routes/index.ts",
    content: backendRoutes,
    pattern: 'router.get("/activities"',
  },
  {
    label: "Backend service analytics route",
    detail: "Bloomzon-Server-main/src/modules/admin/routes/index.ts",
    content: backendRoutes,
    pattern: 'router.get("/service-analytics"',
  },
  {
    label: "Backend profitability route",
    detail: "Bloomzon-Server-main/src/modules/admin/routes/index.ts",
    content: backendRoutes,
    pattern: 'router.get("/profitability"',
  },
  {
    label: "Backend vendor settlements route",
    detail: "Bloomzon-Server-main/src/modules/admin/routes/index.ts",
    content: backendRoutes,
    pattern: 'router.get("/vendor-settlements"',
  },
  {
    label: "Backend vendor settlements settle route",
    detail: "Bloomzon-Server-main/src/modules/admin/routes/index.ts",
    content: backendRoutes,
    pattern: 'router.post(\n  "/vendor-settlements/settle"',
  },
  {
    label: "Backend operations queues route",
    detail: "Bloomzon-Server-main/src/modules/admin/routes/index.ts",
    content: backendRoutes,
    pattern: 'router.get("/operations/queues"',
  },
  {
    label: "Backend withdrawals route",
    detail: "Bloomzon-Server-main/src/modules/admin/routes/index.ts",
    content: backendRoutes,
    pattern: 'router.get("/withdrawals"',
  },
  {
    label: "Backend withdrawal review route",
    detail: "Bloomzon-Server-main/src/modules/admin/routes/index.ts",
    content: backendRoutes,
    pattern: 'router.patch("/withdrawals/:id/review"',
  },
  {
    label: "Backend stores route",
    detail: "Bloomzon-Server-main/src/modules/admin/routes/index.ts",
    content: backendRoutes,
    pattern: 'router.get("/stores"',
  },
  {
    label: "Backend store detail route",
    detail: "Bloomzon-Server-main/src/modules/admin/routes/index.ts",
    content: backendRoutes,
    pattern: 'router.get("/stores/:id"',
  },
  {
    label: "Backend store review route",
    detail: "Bloomzon-Server-main/src/modules/admin/routes/index.ts",
    content: backendRoutes,
    pattern: 'router.patch("/stores/:id/review"',
  },
  {
    label: "Backend store delete route",
    detail: "Bloomzon-Server-main/src/modules/admin/routes/index.ts",
    content: backendRoutes,
    pattern: 'router.delete("/stores/:id"',
  },
  {
    label: "Backend controller exposes support conversation list handler",
    detail: "Bloomzon-Server-main/src/modules/admin/controllers/index.ts",
    content: backendControllers,
    pattern: "static async listSupportConversations",
  },
  {
    label: "Backend controller exposes support message list handler",
    detail: "Bloomzon-Server-main/src/modules/admin/controllers/index.ts",
    content: backendControllers,
    pattern: "static async getSupportConversationMessages",
  },
  {
    label: "Backend controller exposes support send handler",
    detail: "Bloomzon-Server-main/src/modules/admin/controllers/index.ts",
    content: backendControllers,
    pattern: "static async sendSupportConversationMessage",
  },
  {
    label: "Backend controller exposes support read handler",
    detail: "Bloomzon-Server-main/src/modules/admin/controllers/index.ts",
    content: backendControllers,
    pattern: "static async markSupportConversationRead",
  },
  {
    label: "Backend controller exposes dashboard overview handler",
    detail: "Bloomzon-Server-main/src/modules/admin/controllers/index.ts",
    content: backendControllers,
    pattern: "static async getDashboardOverview",
  },
  {
    label: "Backend controller exposes activities handler",
    detail: "Bloomzon-Server-main/src/modules/admin/controllers/index.ts",
    content: backendControllers,
    pattern: "static async listAdminActivities",
  },
  {
    label: "Backend controller exposes service analytics handler",
    detail: "Bloomzon-Server-main/src/modules/admin/controllers/index.ts",
    content: backendControllers,
    pattern: "static async getServiceAnalytics",
  },
  {
    label: "Backend controller exposes profitability handler",
    detail: "Bloomzon-Server-main/src/modules/admin/controllers/index.ts",
    content: backendControllers,
    pattern: "static async getProfitabilityOverview",
  },
  {
    label: "Backend controller exposes vendor settlements handler",
    detail: "Bloomzon-Server-main/src/modules/admin/controllers/index.ts",
    content: backendControllers,
    pattern: "static async listVendorSettlements",
  },
  {
    label: "Backend controller exposes vendor settlements settle handler",
    detail: "Bloomzon-Server-main/src/modules/admin/controllers/index.ts",
    content: backendControllers,
    pattern: "static async settleVendorSettlements",
  },
  {
    label: "Backend controller exposes withdrawals handler",
    detail: "Bloomzon-Server-main/src/modules/admin/controllers/index.ts",
    content: backendControllers,
    pattern: "static async listWithdrawals",
  },
  {
    label: "Backend controller exposes withdrawal review handler",
    detail: "Bloomzon-Server-main/src/modules/admin/controllers/index.ts",
    content: backendControllers,
    pattern: "static async reviewWithdrawal",
  },
  {
    label: "Backend controller exposes operations queues handler",
    detail: "Bloomzon-Server-main/src/modules/admin/controllers/index.ts",
    content: backendControllers,
    pattern: "static async getOperationsQueues",
  },
  {
    label: "Backend controller exposes store list handler",
    detail: "Bloomzon-Server-main/src/modules/admin/controllers/index.ts",
    content: backendControllers,
    pattern: "static async listStores",
  },
  {
    label: "Backend controller exposes store detail handler",
    detail: "Bloomzon-Server-main/src/modules/admin/controllers/index.ts",
    content: backendControllers,
    pattern: "static async getStoreDetails",
  },
  {
    label: "Backend controller exposes store review handler",
    detail: "Bloomzon-Server-main/src/modules/admin/controllers/index.ts",
    content: backendControllers,
    pattern: "static async reviewStore",
  },
  {
    label: "Backend controller exposes store delete handler",
    detail: "Bloomzon-Server-main/src/modules/admin/controllers/index.ts",
    content: backendControllers,
    pattern: "static async deleteStore",
  },
  {
    label: "Backend service exposes support conversation list logic",
    detail: "Bloomzon-Server-main/src/modules/admin/services/index.ts",
    content: backendServices,
    pattern: "static async listSupportConversations",
  },
  {
    label: "Backend service exposes support message list logic",
    detail: "Bloomzon-Server-main/src/modules/admin/services/index.ts",
    content: backendServices,
    pattern: "static async getSupportConversationMessages",
  },
  {
    label: "Backend service exposes support send logic",
    detail: "Bloomzon-Server-main/src/modules/admin/services/index.ts",
    content: backendServices,
    pattern: "static async sendSupportConversationMessage",
  },
  {
    label: "Backend service exposes support read logic",
    detail: "Bloomzon-Server-main/src/modules/admin/services/index.ts",
    content: backendServices,
    pattern: "static async markSupportConversationRead",
  },
  {
    label: "Backend service exposes dashboard overview logic",
    detail: "Bloomzon-Server-main/src/modules/admin/services/index.ts",
    content: backendServices,
    pattern: "static async getDashboardOverview",
  },
  {
    label: "Backend service exposes activities logic",
    detail: "Bloomzon-Server-main/src/modules/admin/services/index.ts",
    content: backendServices,
    pattern: "static async listAdminActivities",
  },
  {
    label: "Backend service exposes service analytics logic",
    detail: "Bloomzon-Server-main/src/modules/admin/services/index.ts",
    content: backendServices,
    pattern: "static async getServiceAnalytics",
  },
  {
    label: "Backend service exposes profitability logic",
    detail: "Bloomzon-Server-main/src/modules/admin/services/index.ts",
    content: backendServices,
    pattern: "static async getProfitabilityOverview",
  },
  {
    label: "Backend service exposes vendor settlements logic",
    detail: "Bloomzon-Server-main/src/modules/admin/services/index.ts",
    content: backendServices,
    pattern: "static async listVendorSettlements",
  },
  {
    label: "Backend service exposes vendor settlements settle logic",
    detail: "Bloomzon-Server-main/src/modules/admin/services/index.ts",
    content: backendServices,
    pattern: "static async settleVendorSettlements",
  },
  {
    label: "Backend service exposes withdrawals logic",
    detail: "Bloomzon-Server-main/src/modules/admin/services/index.ts",
    content: backendServices,
    pattern: "static async listWithdrawals",
  },
  {
    label: "Backend service exposes withdrawal review logic",
    detail: "Bloomzon-Server-main/src/modules/admin/services/index.ts",
    content: backendServices,
    pattern: "static async reviewWithdrawal",
  },
  {
    label: "Backend service exposes operations queues logic",
    detail: "Bloomzon-Server-main/src/modules/admin/services/index.ts",
    content: backendServices,
    pattern: "static async getOperationsQueues",
  },
  {
    label: "Backend service exposes store list logic",
    detail: "Bloomzon-Server-main/src/modules/admin/services/index.ts",
    content: backendServices,
    pattern: "static async listStores",
  },
  {
    label: "Backend service exposes store detail logic",
    detail: "Bloomzon-Server-main/src/modules/admin/services/index.ts",
    content: backendServices,
    pattern: "static async getStoreDetails",
  },
  {
    label: "Backend service exposes store review logic",
    detail: "Bloomzon-Server-main/src/modules/admin/services/index.ts",
    content: backendServices,
    pattern: "static async reviewStore",
  },
  {
    label: "Backend service exposes store delete logic",
    detail: "Bloomzon-Server-main/src/modules/admin/services/index.ts",
    content: backendServices,
    pattern: "static async deleteStore",
  },
  {
    label: "Frontend socket authenticates with chat:authenticate",
    detail: "src/utils/adminChatSocket.js",
    content: frontendSocket,
    pattern: 'socket.emit("chat:authenticate"',
  },
  {
    label: "Backend socket listens for chat:authenticate",
    detail: "Bloomzon-Server-main/src/loaders/socket.ts",
    content: backendSocket,
    pattern: 'socket.on("chat:authenticate"',
  },
  {
    label: "Backend socket emits chat:new_message",
    detail: "Bloomzon-Server-main/src/loaders/socket.ts",
    content: backendSocket,
    pattern: 'emit("chat:new_message"',
  },
  {
    label: "Backend socket emits chat:message_read",
    detail: "Bloomzon-Server-main/src/loaders/socket.ts",
    content: backendSocket,
    pattern: 'emit("chat:message_read"',
  },
];

for (const check of contractChecks) {
  assertIncludes(check.content, check.pattern, check.label, check.detail);
}

const failures = results.filter((result) => !result.ok);
const passes = results.filter((result) => result.ok);

console.log("Backend pairing verification");
console.log(`Frontend root: ${frontendRoot}`);
console.log(`Backend root:  ${backendRoot}`);
console.log("");

for (const result of results) {
  const marker = result.ok ? "[PASS]" : "[FAIL]";
  console.log(`${marker} ${result.label}`);
  if (result.detail) {
    console.log(`       ${result.detail}`);
  }
}

console.log("");
console.log(`Passed: ${passes.length}`);
console.log(`Failed: ${failures.length}`);

if (failures.length > 0) {
  process.exitCode = 1;
}
