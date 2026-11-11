# Bloomzon Admin Implementation Report (May 2026)

This document summarizes the new features, functional implementations, and API endpoints integrated into the Bloomzon Admin panel from May 8th, 2026, to May 25, 2026.

## 1. Authentication & Security
### Two-Factor Authentication (2FA)
- **Implementation:** `src/Pages/TwoFactor.jsx` and `src/api/authChallenge.js`.
- **Description:** A new mandatory/optional 2FA verification step during the login process. It handles 6-digit OTP verification via email.
- **Key Features:**
  - Session-based challenge persistence (`sessionStorage`).
  - Integration with `MainContext` for token management.
  - Automatic redirection to designated admin paths upon successful verification.
- **Consumed Endpoints:**
  - `POST /auth/login-2fa`: Verifies the OTP and returns an access token.

## 2. Finance & Profitability
### Vendor Settlements
- **Implementation:** `src/Pages/Admin/AdminVendorSettlementWorkspace.jsx`.
- **Description:** A dedicated workspace for managing and executing settlements for vendors based on eligible orders.
- **Key Features:**
  - Filtering by search query and balance range (min/max).
  - Bulk settlement execution for all filtered candidates.
  - Detailed summary of gross amounts, service charges, and settlement amounts.
- **Consumed Endpoints:**
  - `GET /admin/vendor-settlements`: Fetches settlement candidates.
  - `POST /admin/vendor-settlements/settle`: Executes the settlement process.

### Admin Profitability Workspace
- **Implementation:** `src/Pages/Admin/AdminProfitabilityWorkspace.jsx`.
- **Description:** Financial tracking dashboard showing retained value and platform health.
- **Key Features:**
  - KPI cards for Gross Sales, Posted/Pending Settlements, and Platform Spread.
  - Interactive trend charts (ComposedChart) comparing sales vs. settlements.
  - Service contribution breakdown (Service Mix).
- **Consumed Endpoints:**
  - `GET /admin/profitability`: Fetches profitability metrics and history.

### Commissions & Service Charges
- **Implementation:** `src/Pages/Admin/AdminActivitiesWorkspace.jsx` (Commissions/Service Charge tabs).
- **Description:** Management of platform service charges across Categories, Subcategories, and Tertiary categories.
- **Key Features:**
  - Percentage-based commission tracking.
  - Dynamic category management (Main, Secondary, Subcategories).
- **Consumed Endpoints:**
  - `GET /admin/sales-report`: Used as a data source for commission analysis.
  - `PATCH /admin/categories/...`: Updates service charge rates for various category levels.

## 3. Operational Control
### Operations Center
- **Implementation:** `src/Pages/Operations/OperationsCenter.jsx`.
- **Description:** A centralized hub for actionable system queues that demand admin attention.
- **Key Features:**
  - Unified view of Withdrawal requests, Support tickets, Review moderation, and Inactive listings.
  - Risk monitoring and Refund management queues.
  - Navigation shortcuts to specific ledger and settlement pages.
- **Consumed Endpoints:**
  - `GET /admin/operations/queues`: Summary of all active queues.
  - `GET /admin/withdrawals`: Payout requests.
  - `GET /admin/refunds`: Refund tracking.
  - `GET /admin/risk-monitoring`: Suspicious activity tracking.
  - `GET /admin/approval-requests`: Finance actions requiring approval.

### Enhanced Support Workflow
- **Implementation:** `src/Pages/Admin/AdminSupportWorkspace.jsx` and `src/api/admin.js`.
- **Description:** Refactored support conversation and ticket management system.
- **Key Features:**
  - Support for User, Vendor, Dispute, and Internal conversation types.
  - Real-time chat integration via `adminChatSocket`.
  - SLA tracking (On track, Warning, Breached).
- **Consumed Endpoints:**
  - `GET /admin/support/conversations`: Fetches active chat threads.
  - `GET /admin/support/conversations/:id/messages`: Thread message history.
  - `POST /admin/support/conversations/:id/messages`: Sends an admin response.
  - `PATCH /admin/support/conversations/:id/read`: Marks a thread as read.

## 4. Bulk Tools & Monitoring
### Bulk Operations Workspace
- **Implementation:** `src/Pages/BloomzonAdmin/BloomzonAdminWorkspaces.jsx`.
- **Description:** Management of high-volume data tasks (Products, Inventory, Pricing).
- **Key Features:**
  - CSV template downloads and uploads.
  - Preview and validation of bulk changes before application.
  - Monitoring of pending/completed bulk task status.
- **Consumed Endpoints:**
  - `GET /admin/bulk-tools/templates`: Fetch CSV headers and templates.
  - `GET /admin/bulk-operations`: History of bulk tasks.
  - `POST /admin/bulk-operations/preview`: Validates uploaded CSV data.

### Audit Logs & Privacy
- **Implementation:** `src/Pages/Admin/AuditLogs.jsx` (and integrated in BloomzonAdmin).
- **Description:** Tracking of administrative actions and compliance requests.
- **Key Features:**
  - Detailed audit trail of admin logins and data modifications.
  - Privacy Queue for GDPR/CCPA data export and deletion requests.
- **Consumed Endpoints:**
  - `GET /admin/audit-logs`: Fetches system-wide action history.
  - `GET /admin/privacy/requests`: Fetches compliance-related tasks.

## 5. API Configuration Updates
- **File:** `src/api/config.js`.
- **Changes:**
  - Standardized `API_BASE_URL` with improved trailing slash handling and suffix enforcement.
  - Support for `withCredentials: true` globally for session cookie support.
  - New base URL definitions for `TALENT_BASE_URL`, `REGISTRY_BASE_URL`, `BANNER_BASE_URL`, and `BLOOMZONLIVE_BASE_URL`.
