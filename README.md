# Bloomzon Admin

Admin dashboard frontend for Bloomzon services, operations, support, and analytics.

## Backend pairing

This app is paired with the backend repository at `/home/elbontech/Bloomzon-Server-main`.

Use the backend repo as the source of truth for:

- admin support conversations and chat message flows
- admin activities and audit data
- service analytics, profitability, withdrawals, and operations queues
- Socket.IO chat authentication and realtime events

Run the contract check before or during backend-related work:

```bash
npm run verify:backend
```

The verifier confirms that the frontend API modules and socket helper still match the expected backend routes, controller/service handlers, and realtime event names.

## Key frontend entrypoints

- `src/api/config.js`
- `src/api/admin.js`
- `src/utils/adminChatSocket.js`

## Paired backend entrypoints

- `src/modules/admin/routes/index.ts`
- `src/modules/admin/controllers/index.ts`
- `src/modules/admin/services/index.ts`
- `src/loaders/socket.ts`

## Notes

- Production API origin is configured through `VITE_API_BASE_URL` in `.env.production`.
- If deployed behavior differs from the local backend repo, treat that as an environment or version mismatch and verify before changing UI behavior.
- The detailed pairing workflow and verified route list live in `BACKEND_PAIRING.md`.
