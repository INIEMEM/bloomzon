# API Integration Report: Frontend to Backend Migration
**Target:** Bloomzon Admin Dashboard
**Focus:** Comprehensive API audit and Cookie-based Auth Migration

---

### SECTION A: EXISTING ENDPOINTS (CONNECTED)

#### Authentication (`/auth`)
- **Endpoint:** `/auth/login` (POST)
  - **Purpose:** User authentication
  - **Issues:** Currently returns `accessToken` which frontend puts in `sessionStorage`.
  - **Needs Cookie Update?** Yes
- **Endpoint:** `/auth/forgot-password` (POST)
- **Endpoint:** `/auth/password-reset` (POST)

#### User Management (`/user`)
- **Endpoint:** `/user/profile` (GET)
  - **Purpose:** Fetch logged-in user profile details
  - **Needs Cookie Update?** Yes

#### Admin Data Management (`/admin`)
- **Endpoint:** `/admin/users` (GET)
  - **Purpose:** Retrieve all sellers/users
  - **Needs Cookie Update?** Yes
- **Endpoint:** `/admin/users/{sellerId}` (GET, PATCH)
- **Endpoint:** `/admin/domains` (GET, POST)
- **Endpoint:** `/admin/domains/{id}` (PUT, DELETE)
- **Endpoint:** `/admin/domains/{domainId}/categories` (POST)
- **Endpoint:** `/admin/domains/categories/{categoryId}` (DELETE)
- **Endpoint:** `/admin/products` (GET)
- **Endpoint:** `/admin/products/{productId}` (GET, PATCH, DELETE)
- **Endpoint:** `/admin/orders` (GET)

#### Lookups: Region, Country, Currency
- **Endpoint:** `/country` (GET, POST)
- **Endpoint:** `/country/{id}` (GET, PUT, DELETE)
- **Endpoint:** `/country/region/{regionId}` (GET)
- **Endpoint:** `/region` (GET, POST)
- **Endpoint:** `/region/{id}` (GET, PUT, DELETE)
- **Endpoint:** `/currency` (GET)

#### Shipping (`/shipping`)
- **Endpoint:** `/shipping/categories` (GET, POST)
- **Endpoint:** `/shipping/categories/{id}` (PUT, DELETE)

#### Bloomzon Talent (`/bloomzon-talent`)
- **Endpoint:** `/bloomzon-talent/StoreCategories` (GET, DELETE)
- **Endpoint:** `/bloomzon-talent/StoreSubCategories` (GET)
- **Endpoint:** `/bloomzon-talent/StoreCategory` (PUT)
- **Endpoint:** `/bloomzon-talent/CreateStoreCategoryName` (POST)

#### Bloomzon Live / TV (`/bloomzonlive`)
- **Endpoint:** `/bloomzonlive/admin/airing-session` (GET)
- **Endpoint:** `/bloomzonlive/admin/current-airing-session` (GET)
- **Endpoint:** `/bloomzonlive/admin/future-airing-session` (GET)
- **Endpoint:** `/bloomzonlive/admin/passed-airing-session` (GET)
- **Endpoint:** `/bloomzonlive/admin/update-airing-session/{id}` (PUT)
- **Endpoint:** `/bloomzonlive/admin/airing-session/{id}/comments` (GET)

#### Registry (`/registry-app`)
- **Endpoint:** `/registry-app/LatestStyle` (GET, POST)
- **Endpoint:** `/registry-app/LatestStyle/{id}` (PUT, DELETE)

---

### SECTION B: EXISTING BUT BROKEN / OUTDATED

- **Endpoint:** `/auth/2fa/verify` (Implied)
  - **Problem:** Two-Factor Authentication is completely disconnected. Hardcoded warning states `"Two-factor verification is not available on the current backend."`
  - **Suggested Fix:** Implement a proper `/auth/2fa/verify` step that checks the OTP immediately after login before issuing the final session cookie.

- **Endpoint:** JWT Injection via `getAuthHeaders()`
  - **Problem:** Every single authenticated endpoint calls `getAuthHeaders(token)` which attaches `{ Authorization: Bearer <token> }`.
  - **Suggested Fix:** Utilize an Axios instance with `withCredentials: true`.

---

### SECTION C: MISSING ENDPOINTS (TO BE BUILT)

Based on the routing and UI flows in `App.jsx`, the following backend integrations are completely missing and must be developed:

#### 1. Core Platform Missing API
- **POST `/auth/logout`**: Actively terminate server-side session and invalidate HTTP-Only Cookie.
- **GET `/auth/me`**: Verify if the cookie is valid upon app load to restore the logged-in state.
- **GET, PATCH `/admin/withdrawals`**: View and approve/reject user withdrawal requests.
- **GET, POST `/admin/notifications`**: Global system push notifications to admins.
- **GET `/admin/transactions`**: List of all platform monetary transactions.
- **GET, POST, PUT, DELETE `/admin/giftcards`**: Missing CRUD mapping for the Gift Card creation and management screens (`/Pages/GiftCard/*`).
- **GET, PUT, DELETE `/banner`**: Application banners and marketing popups management (`AppBannerManagement` UI exists, but endpoints don't seem connected natively).

#### 2. Services Management Endpoints
*These endpoints form the backbone of the multiple sub-services supported on the platform. None of these have concrete, verifiable backend connections.*

**Bloomzon Elite (`/services/elite`)**
- **GET `/admin/services/elite/users`**: List all Elite tier users.
- **GET, PUT `/admin/services/elite/users/{id}`**: Elite account details and updates.
- **GET, DELETE `/admin/services/elite/videos`**: Moderation endpoint for Elite premium videos.

**Bloomzon Reels (`/services/reels`)**
- **GET `/admin/services/reels/users`**: List Reels creators.
- **GET, PUT `/admin/services/reels/users/{id}`**: Creator details and profile moderation.
- **GET `/admin/services/reels/analytics`**: Revenue/Views analytics dashboard for Reels.
- **GET `/admin/services/reels/orders`**: Product orders placed through Reel links.

**Groceries & Beverages (`/services/groceries-beverages`)**
- **GET `/admin/services/groceries/analytics`**: Analytics and revenue views for groceries.
- **GET `/admin/services/groceries/stores`**: List of all registered grocery stores.
- **GET `/admin/services/groceries/stores/{id}`**: Details for a specific grocery store.
- **POST `/admin/services/groceries/stores/{id}/products`**: Admin interface to force-add a product to a store.
- **GET, PATCH `/admin/services/groceries/stores/{id}/orders`**: Manage specific orders.
- **GET, PATCH `/admin/services/groceries/stores/{id}/returns`**: Handle return requests.
- **GET, PUT `/admin/services/groceries/stores/{id}/inventory`**: Manage inventory updates.
- **GET `/admin/services/groceries/stores/{id}/payments`**: View payment schedules/payouts for the store.

**Healthcare (`/services/health-care`)**
- **GET `/admin/services/healthcare/providers`**: List registered Healthcare vendors (pharmacies, practitioners).
- **GET `/admin/services/healthcare/analytics`**: Sub-domain specific revenue mapping.

**Restaurants & Food (`/services/food`)**
- **GET `/admin/services/food/vendors`**: List all restaurant/food vendors.
- **GET, PUT `/admin/services/food/vendors/{id}`**: Vendor account management.
- **GET `/admin/services/food/analytics`**: Food delivery revenue mapping.

**Used Items (`/services/used-items`)**
- **GET `/admin/services/used-items`**: List all user-listed second-hand items.
- **GET, DELETE `/admin/services/used-items/{id}`**: View details and moderate/reject items.
- **GET `/admin/services/used-items/analytics`**: Marketplace statistics.

**Automobiles (`/services/automobile`)**
- **GET `/admin/services/automobiles`**: List auto dealers and listed vehicles.
- **GET, DELETE `/admin/services/automobiles/{id}`**: Vehicle moderation and details.
- **GET `/admin/services/automobiles/analytics`**: Auto marketplace transaction data.

**Real Estate (`/services/real-estate`)**
- **GET `/admin/services/real-estate`**: List realtors and listed properties.
- **GET, DELETE `/admin/services/real-estate/{type}/{id}`**: Property moderation.
- **GET `/admin/services/real-estate/analytics`**: Property listing tracking.

**Logistics Services (`/others/admins/logistics`)**
- **GET `/admin/logistics/providers`**: List logistics and delivery companies registered.
- **POST `/admin/logistics/providers`**: Register new official logistics tier.
- **PUT, DELETE `/admin/logistics/providers/{id}`**: Update or block a delivery provider.

#### 3. Administrative Controls & Settings (`/others/admins/*`)
*These control access, roles, and the hierarchy of the dashboard itself.*

**Admin User Management**
- **GET `/admin/staff`**: List all internal platform administrators (separate from sellers).
- **POST `/admin/staff`**: Create new platform admin.
- **GET, PUT, DELETE `/admin/staff/{id}`**: Edit details or revoke admin account.
- **GET `/admin/staff/{id}/activity`**: View logs of what the admin altered.

**Roles & Permissions (`/others/admins/roles`)**
- **GET `/admin/roles`**: List available Role-Based Access Control (RBAC) tiers (Super Admin, Moderator, Regional Manager).
- **POST `/admin/roles`**: Define a new permission tier.
- **PUT, DELETE `/admin/roles/{id}`**: Modify permission flags or delete role.

**Admin Chats / Messages (`/others/admins/messages`)**
- **GET `/admin/chat/conversations`**: Inbox for tickets/direct messages to admins.
- **GET `/admin/chat/conversations/{id}`**: Full message trail.
- **POST `/admin/chat/conversations/{id}/reply`**: Send a message back to the user/seller.

**Business Type Management (`/others/admins/bussiness`)**
- **GET `/admin/business-features`**: Toggles to globally enable/disable features on the platform.

---

### SECTION D: AUTH MIGRATION REQUIREMENTS

To properly migrate from JWT to Cookie-Based execution, the backend and frontend MUST sync on using cross-origin cookies.

**Where JWT is currently used:**
- `src/api/config.js`: `getAuthHeaders` function appends it.
- `src/Context/Context.jsx`: Explicitly manages `sessionStorage.getItem('token')` state.
- `src/Pages/Login/Login.jsx`: Manual extraction of token via `const accessToken = data?.token || data?.data?.accessToken;`
- Nearly 100+ files calling `useContext(MainContext)` and passing the token to headers.

**Recommended Changes (Backend & Frontend):**
1. **Frontend Axio Injection**: `axios.defaults.withCredentials = true` must be applied globally so cookies (session info) are packaged automatically on every request.
2. **Remove Authorization Headers**: Purge `const headers = useMemo(() => getAuthHeaders(token), [token]);` entirely.
3. **Backend Cookie Handling**: Ensure the `.env` includes accurate `CORS` properties so that `Cookie` origins are respected. `Access-Control-Allow-Credentials: true` is strictly required.

---

### SECTION E: FRONTEND FIXES REQUIRED

**1. `src/api/config.js`**
- Delete the `getAuthHeaders`, `sessionTokenKey`, and `readStoredToken` functions.
- Add an interceptor or default global rule: 
  ```javascript
  import axios from 'axios';
  axios.defaults.withCredentials = true;
  ```

**2. `src/Context/Context.jsx`**
- Remove `<MainContext.Provider value={{... token, setToken}}>`. The app should be driven by checking whether `user` data is successfully fetched on load.
- Expose a `logout` function globally that triggers `.post('/auth/logout')` and clears the `user` state context.

**3. `src/Pages/Login/Login.jsx`**
- Remove the manual `localStorage/sessionStorage` caching mechanism.
- Upon successful authentication (`200 OK`), immediately call the user profile endpoint (e.g. `getUser()`) and store the resulting data in Context before calling `navigate('/dashboard')`.

**4. `src/App.jsx` & layout guards**
- The `<ProtectedRoute />` wrap currently checks for local token existence. This must be refactored to check whether the API `user/profile` returned a successful response instead. Use an Axios interceptor to catch `401 Unauthorized` globally and redirect automatically to `/`.

**5. Clean up Component Level API Calls**
- Replace calls like: `axios.get(URL, { headers })`
- With: `axios.get(URL) // Relies on withCredentials naturally`
