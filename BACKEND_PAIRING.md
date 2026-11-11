# Backend Pairing

`davide-admin` is paired with `/home/elbontech/Bloomzon-Server-main`.

## Source of truth

Use the backend repo as the authoritative reference for API contracts, auth behavior, and realtime chat behavior. Do not change frontend request paths or payload expectations without checking the matching backend route, controller, and service first.

## Frontend files to inspect first

- `src/api/config.js`
- `src/api/admin.js`
- `src/api/getUser.js`
- `src/utils/adminChatSocket.js`

## Backend files to inspect first

- `src/modules/admin/routes/index.ts`
- `src/modules/admin/controllers/index.ts`
- `src/modules/admin/services/index.ts`
- `src/loaders/socket.ts` 

## Verified admin HTTP contracts

- `GET /api/admin/support/conversations`
- `GET /api/admin/support/conversations/:conversationId/messages`
- `POST /api/admin/support/conversations/:conversationId/messages`
- `PATCH /api/admin/support/conversations/:conversationId/read`
- `GET /api/admin/stores`
- `GET /api/admin/stores/:id`
- `PATCH /api/admin/stores/:id/review`
- `DELETE /api/admin/stores/:id`
- `GET /api/admin/dashboard/overview`
- `GET /api/admin/activities`
- `GET /api/admin/service-analytics`
- `GET /api/admin/profitability`
- `GET /api/admin/vendor-settlements`
- `POST /api/admin/vendor-settlements/settle`
- `GET /api/admin/operations/queues`
- `GET /api/admin/withdrawals`
- `PATCH /api/admin/withdrawals/:id/review`

## Verified realtime chat contract

- Frontend socket bootstrap removes the `/api` suffix from `API_BASE_URL` and connects to the backend origin root.
- Frontend authenticates the chat socket with `chat:authenticate`.
- Backend socket loader supports admin actors and emits `chat:new_message` and `chat:message_read`.

## Workflow for future changes

1. Check the frontend call site in `src/api/*` or the consuming page/component.
2. Check the matching backend route in `Bloomzon-Server-main`.
3. Confirm controller and service handler names before changing UI state assumptions.
4. For support chat work, verify both REST and Socket.IO behavior.
5. If repo code and deployed behavior disagree, treat it as an environment mismatch and resolve that before implementation.

## Verification command

Run:

```bash
npm run verify:backend
```

Optional override:

```bash
BLOOMZON_SERVER_PATH=/custom/backend/path npm run verify:backend
```
