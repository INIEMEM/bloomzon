import { API_BASE_URL, cookieSessionToken } from "../api/config";

const SOCKET_URL = API_BASE_URL.replace(/\/api\/?$/, "");
const CHAT_ACK_TIMEOUT_MS = 8000;

let adminChatSocket = null;
let adminChatReadyPromise = null;
let socketScriptPromise = null;

const loadSocketClient = () => {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Chat sockets are only available in the browser."));
  }

  if (window.io) {
    return Promise.resolve(window.io);
  }

  if (!socketScriptPromise) {
    socketScriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = `${SOCKET_URL}/socket.io/socket.io.js`;
      script.async = true;
      script.onload = () => {
        if (window.io) {
          resolve(window.io);
          return;
        }

        reject(new Error("Socket.IO client script loaded without exposing window.io."));
      };
      script.onerror = () => {
        reject(new Error("Unable to load the chat socket client."));
      };
      document.head.appendChild(script);
    });
  }

  return socketScriptPromise;
};

const buildSocketAuth = (token) => ({
  actor_type: "admin",
  ...(token && token !== cookieSessionToken ? { token } : {}),
});

const waitForSocketConnection = (socket) =>
  new Promise((resolve, reject) => {
    if (socket.connected) {
      resolve();
      return;
    }

    const cleanup = () => {
      socket.off("connect", handleConnect);
      socket.off("connect_error", handleError);
    };

    const handleConnect = () => {
      cleanup();
      resolve();
    };

    const handleError = (error) => {
      cleanup();
      reject(error);
    };

    socket.on("connect", handleConnect);
    socket.on("connect_error", handleError);
    socket.connect();
  });

const authenticateAdminSocket = (socket, auth) =>
  new Promise((resolve, reject) => {
    const hasBearerToken = Boolean(auth?.token);
    const timeout = window.setTimeout(() => {
      reject(new Error("Admin chat socket authentication timed out."));
    }, CHAT_ACK_TIMEOUT_MS);

    socket.emit("chat:authenticate", auth, (ack) => {
      window.clearTimeout(timeout);

      if (ack?.success === false) {
        if (!hasBearerToken) {
          resolve();
          return;
        }

        reject(
          new Error(ack?.message || "Admin chat socket authentication failed."),
        );
        return;
      }

      resolve();
    });
  });

const ensureAdminChatSocket = async (token) => {
  const io = await loadSocketClient();

  if (!adminChatSocket) {
    adminChatSocket = io(SOCKET_URL, {
      autoConnect: false,
      transports: ["polling", "websocket"],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1500,
      timeout: 20000,
      withCredentials: true,
    });
  }

  const auth = buildSocketAuth(token);
  adminChatSocket.auth = auth;
  await waitForSocketConnection(adminChatSocket);
  await authenticateAdminSocket(adminChatSocket, auth);

  return adminChatSocket;
};

export const getAdminChatSocket = async (token) => {
  if (!adminChatReadyPromise) {
    adminChatReadyPromise = ensureAdminChatSocket(token).finally(() => {
      adminChatReadyPromise = null;
    });
  }

  return adminChatReadyPromise;
};
