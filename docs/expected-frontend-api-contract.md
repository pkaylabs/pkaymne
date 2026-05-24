# Expected Frontend API Contract

This document defines the API surface the current PKay M&E frontend expects from the FastAPI backend. It should drive backend development before replacing the frontend's local UI state with real data.

Target backend stack: FastAPI, SQLAlchemy 2.x async, Alembic, Postgres in production, SQLite in development, Celery for background jobs, Redis or equivalent broker/cache, JWT auth, tenant-aware permissions, and WebSockets for live updates.

## Contract Conventions

Base path: `/api/v1`

Authentication:
- Use JWT bearer tokens for API requests.
- Use refresh tokens for session renewal.
- Use secure HTTP-only cookies if the frontend moves auth storage away from local memory.
- Google auth should return the same session payload as email/password auth.

Tenant scoping:
- Most dashboard endpoints are scoped to the authenticated user's active company/tenant.
- Super User endpoints are explicitly under `/system/*` and require platform-level permissions.
- Backend must never trust `company_id` from normal tenant users unless the endpoint is Super User-only.

Common headers:

```http
Authorization: Bearer <access_token>
Content-Type: application/json
```

Common list query params:

```text
page=1
page_size=25
search=<string>
sort=<field>
direction=asc|desc
status=<status>
```

Common paginated response:

```json
{
  "items": [],
  "meta": {
    "page": 1,
    "page_size": 25,
    "total": 0,
    "pages": 0
  }
}
```

Common error response:

```json
{
  "error": {
    "code": "validation_error",
    "message": "One or more fields are invalid.",
    "details": {
      "field": ["Reason"]
    },
    "request_id": "req_01HX..."
  }
}
```

Required error status codes:
- `400` invalid request
- `401` unauthenticated
- `403` forbidden
- `404` missing resource
- `409` conflict, duplicate, stale version, invalid workflow transition
- `422` validation error
- `429` rate limited
- `500` server error

## Core Types

Use UUID strings for persistent IDs unless there is a strong reason not to.

```ts
type ID = string;
type ISODate = string; // "2026-05-24"
type ISODateTime = string; // ISO-8601 UTC
type Money = { amount: number; currency: "USD" | "GHS" | "NGN" | "KES" | string };
```

## Auth And Onboarding

The marketing auth modals expect email/password, Google auth affordance, signup plan selection, payment initiation, forgot password OTP, and password reset.

### POST `/auth/signup`

Request:

```json
{
  "company_name": "PKay Monitoring and Evaluation Agency",
  "full_name": "Kojo Otoo",
  "email": "admin@pkaymne.org",
  "password": "SecurePassword123!",
  "selected_package_id": "pkg_growth",
  "billing_cycle": "monthly"
}
```

Response:

```json
{
  "user": { "id": "usr_001", "name": "Kojo Otoo", "email": "admin@pkaymne.org", "role": "Owner" },
  "company": { "id": "cmp_001", "name": "PKay Monitoring and Evaluation Agency", "status": "Trial" },
  "subscription": { "id": "sub_001", "status": "Trial", "package_id": "pkg_growth" },
  "access_token": "<jwt>",
  "refresh_token": "<refresh>"
}
```

### POST `/auth/login`

Request:

```json
{ "email": "admin@pkaymne.org", "password": "SecurePassword123!" }
```

Response: same session shape as signup.

### GET `/auth/google/start`

Returns provider redirect URL.

### POST `/auth/google/callback`

Request:

```json
{ "code": "<oauth_code>", "selected_package_id": "pkg_growth" }
```

Response: same session shape as signup.

### POST `/auth/forgot-password`

Request:

```json
{ "email": "admin@pkaymne.org" }
```

Response:

```json
{ "message": "OTP sent if the email exists.", "otp_expires_in_seconds": 600 }
```

### POST `/auth/verify-otp`

Request:

```json
{ "email": "admin@pkaymne.org", "otp": "123456" }
```

Response:

```json
{ "reset_token": "rst_..." }
```

### POST `/auth/reset-password`

Request:

```json
{ "reset_token": "rst_...", "password": "NewSecurePassword123!" }
```

Response:

```json
{ "message": "Password reset successfully." }
```

### GET `/me`

Response:

```json
{
  "user": {
    "id": "usr_001",
    "name": "Mr. Otoo",
    "email": "admin@pkaymne.org",
    "avatar_url": "https://...",
    "role": "Admin",
    "permissions": ["projects:write", "reports:read", "billing:read"]
  },
  "company": {
    "id": "cmp_001",
    "name": "PKay Monitoring and Evaluation Agency",
    "plan": "Growth"
  },
  "is_superuser": false
}
```

## Dashboard

### GET `/dashboard/summary`

Powers the main dashboard metrics and charts.

Response:

```json
{
  "metrics": {
    "active_projects": 12,
    "outcomes": 38,
    "indicators": 184,
    "submissions": 18240,
    "pending_reviews": 23,
    "reports_ready": 8
  },
  "project_status": [
    { "label": "Active", "value": 8 },
    { "label": "Planning", "value": 3 },
    { "label": "Paused", "value": 1 }
  ],
  "indicator_performance": [
    { "label": "On Track", "value": 72 },
    { "label": "At Risk", "value": 31 },
    { "label": "Off Track", "value": 12 },
    { "label": "Achieved", "value": 69 }
  ],
  "recent_activity": []
}
```

## Projects

Frontend routes:
- `/dashboard/projects`
- `/dashboard/projects/:projectId`
- `/dashboard/projects/:projectId/outcomes`
- `/dashboard/projects/:projectId/indicators`
- `/dashboard/projects/:projectId/forms`
- `/dashboard/projects/:projectId/submissions`
- `/dashboard/projects/:projectId/reports`

Project status values: `Active`, `Planning`, `Paused`, `Completed`.

Project model:

```json
{
  "id": "prj_001",
  "name": "Industrial Transformation Programme",
  "owner": "Monitoring and Evaluation",
  "status": "Active",
  "outcomes_count": 4,
  "indicators_count": 18,
  "review_date": "2026-12-31",
  "completion": 68,
  "districts_count": 14,
  "submissions_count": 918,
  "created_at": "2026-01-12T10:00:00Z",
  "updated_at": "2026-05-24T10:00:00Z"
}
```

### GET `/projects`

Query:

```text
search=
status=Active|Planning|Paused|Completed
page=1
page_size=25
```

Response: paginated `Project[]`.

### POST `/projects`

Request:

```json
{
  "name": "Industrial Transformation Programme",
  "owner": "Monitoring and Evaluation",
  "status": "Planning",
  "review_date": "2026-12-31"
}
```

Response: `Project`.

Note: `outcomes_count` and `indicators_count` are computed read-only values.

### GET `/projects/{project_id}`

Response:

```json
{
  "project": {},
  "summary": {
    "completion": 68,
    "districts_count": 14,
    "submissions_count": 918,
    "pending_reviews": 12
  },
  "upcoming_work": [
    { "id": "tsk_001", "title": "Publish revised field form", "due_at": "2026-05-28T09:00:00Z" }
  ]
}
```

### PATCH `/projects/{project_id}`

Request:

```json
{
  "name": "Industrial Transformation Programme",
  "owner": "Monitoring and Evaluation",
  "status": "Active",
  "review_date": "2026-12-31"
}
```

Response: `Project`.

### DELETE `/projects/{project_id}`

Response:

```json
{ "deleted": true }
```

## Outcomes

Outcome status values: `Active`, `Completed`, `Pending`, `On Hold`.
Priority values: `High`, `Medium`, `Low`.

Outcome model:

```json
{
  "id": "out_001",
  "project_id": "prj_001",
  "name": "An industrialised and diversified economy",
  "description": "Increase industrial productivity, export competitiveness, and domestic value addition.",
  "indicators_count": 5,
  "status": "Active",
  "priority": "High",
  "owner": "Policy and Planning",
  "department": "Economic Transformation",
  "due_date": "2026-06-30",
  "progress": 75
}
```

### GET `/outcomes`

Query:

```text
project_id=
search=
status=
priority=
page=
page_size=
```

Response: paginated `Outcome[]`.

### POST `/outcomes`

Request:

```json
{
  "project_id": "prj_001",
  "name": "Competitive private sector",
  "description": "Strengthen market access and productivity.",
  "status": "Pending",
  "priority": "Medium",
  "owner": "Monitoring and Evaluation",
  "department": "Economic Transformation",
  "due_date": "2026-11-20"
}
```

Response: `Outcome`.

### GET `/projects/{project_id}/outcomes`

Response: paginated `Outcome[]`.

### PATCH `/outcomes/{outcome_id}`

Response: `Outcome`.

### DELETE `/outcomes/{outcome_id}`

Response:

```json
{ "deleted": true }
```

## Indicators

Indicator status values: `On Track`, `At Risk`, `Off Track`, `Achieved`.

Indicator model:

```json
{
  "id": "ind_001",
  "project_id": "prj_001",
  "outcome_id": "out_001",
  "name": "Share of manufacturing value-added in GDP",
  "description": "Percentage of GDP contributed by manufacturing activities.",
  "baseline": 3.2,
  "target": 4.5,
  "current": 4.1,
  "unit": "%",
  "owner": "Policy and Planning",
  "department": "Economic Transformation",
  "status": "On Track",
  "updated_at": "2026-03-10T00:00:00Z"
}
```

### GET `/indicators`

Query:

```text
project_id=
outcome_id=
search=
status=
department=
page=
page_size=
```

Response: paginated `Indicator[]`.

### POST `/indicators`

Request:

```json
{
  "project_id": "prj_001",
  "outcome_id": "out_001",
  "name": "Youth employment rate",
  "description": "Percentage of youth employed in formal or supported work.",
  "baseline": 40,
  "target": 50,
  "unit": "%",
  "owner": "Labour Statistics",
  "department": "Inclusive Growth"
}
```

Response: `Indicator`.

### PATCH `/indicators/{indicator_id}`

Request may update metadata and targets. `current` should normally be computed by the computation engine, but Super Users/Admins may need an override endpoint later.

Response: `Indicator`.

### DELETE `/indicators/{indicator_id}`

Response:

```json
{ "deleted": true }
```

## Form Builder

Forms are attached to projects. Each form has versions. Field agents eventually receive published versions only.

Field type values: `Text`, `Long Text`, `Number`, `Date`, `Select`, `Radio`, `Checkbox`, `Photo`, `GPS`.

Form model:

```json
{
  "id": "frm_001",
  "project_id": "prj_001",
  "title": "Industrial transformation field visit",
  "instructions": "Collect verified site-level evidence.",
  "current_version_id": "fv_003",
  "status": "Draft",
  "created_at": "2026-05-24T10:00:00Z",
  "updated_at": "2026-05-24T10:00:00Z"
}
```

Form version model:

```json
{
  "id": "fv_003",
  "form_id": "frm_001",
  "version": "v1.3 draft",
  "status": "Draft",
  "created_by": "usr_001",
  "created_at": "2026-05-24T10:00:00Z",
  "published_at": null,
  "fields": []
}
```

Field model:

```json
{
  "id": "fld_001",
  "form_version_id": "fv_003",
  "label": "District",
  "type": "Select",
  "required": true,
  "helper_text": "Choose the district where data was collected.",
  "indicator_id": "ind_001",
  "options": ["Tamale", "Kumasi", "Tema", "Sunyani"],
  "order": 1,
  "validation": {
    "min": null,
    "max": null,
    "regex": null
  }
}
```

### GET `/projects/{project_id}/forms`

Response: paginated `Form[]`.

### POST `/projects/{project_id}/forms`

Request:

```json
{
  "title": "Industrial transformation field visit",
  "instructions": "Collect verified site-level evidence."
}
```

Response: `Form`.

### GET `/forms/{form_id}`

Response:

```json
{
  "form": {},
  "current_version": {},
  "versions": []
}
```

### PATCH `/forms/{form_id}`

Updates form metadata.

### POST `/forms/{form_id}/versions`

Creates a new draft version from the latest version.

Response: `FormVersion`.

### PATCH `/form-versions/{version_id}`

Request:

```json
{
  "version": "v1.3 draft",
  "fields": [
    {
      "id": "fld_001",
      "label": "District",
      "type": "Select",
      "required": true,
      "helper_text": "Choose the district.",
      "indicator_id": "ind_001",
      "options": ["Tamale", "Kumasi"],
      "order": 1,
      "validation": {}
    }
  ]
}
```

Response: `FormVersion`.

### POST `/form-versions/{version_id}/publish`

Response:

```json
{
  "version": {},
  "message": "Form version published."
}
```

## Submissions

Submission status values: `Approved`, `Needs Review`, `Rejected`.

Submission model:

```json
{
  "id": "subm_001",
  "project_id": "prj_001",
  "form_id": "frm_001",
  "form_version_id": "fv_003",
  "site": "Tamale Industrial Cluster",
  "submitted_by": {
    "id": "usr_023",
    "name": "Ama Boateng"
  },
  "submitted_at": "2026-05-22T14:32:00Z",
  "status": "Needs Review",
  "values": {
    "fld_001": "Tamale",
    "fld_002": "Tamale Industrial Cluster",
    "fld_003": 42
  },
  "attachments": [
    {
      "id": "att_001",
      "field_id": "fld_004",
      "type": "photo",
      "url": "https://..."
    }
  ],
  "quality_checks": [
    { "label": "Required fields complete", "passed": true }
  ]
}
```

### GET `/projects/{project_id}/submissions`

Query:

```text
form_id=
status=Approved|Needs Review|Rejected
field_agent_id=
from=
to=
page=
page_size=
```

Response: paginated `Submission[]`.

### GET `/submissions/{submission_id}`

Response: `Submission`.

### POST `/forms/{form_id}/submissions`

Used later by mobile/tablet clients and possibly web preview.

Request:

```json
{
  "form_version_id": "fv_003",
  "values": {
    "fld_001": "Tamale",
    "fld_003": 42
  },
  "client_generated_id": "offline_uuid",
  "submitted_at": "2026-05-24T09:00:00Z"
}
```

Response: `Submission`.

### PATCH `/submissions/{submission_id}/review`

Request:

```json
{
  "status": "Approved",
  "review_note": "Evidence checked.",
  "flagged_fields": []
}
```

Response: `Submission`.

### POST `/submissions/bulk-review`

Request:

```json
{
  "submission_ids": ["subm_001", "subm_002"],
  "status": "Approved",
  "review_note": "Batch approved."
}
```

Response:

```json
{ "updated": 2, "failed": [] }
```

## Computation Rules

Aggregation methods: `Sum`, `Average`, `Count`, `Min`, `Max`, `Percentage`, `Ratio`, `Custom formula`.

Computation rule model:

```json
{
  "id": "rule_001",
  "project_id": "prj_001",
  "indicator_id": "ind_001",
  "method": "Average",
  "source_form_id": "frm_001",
  "source_field_id": "fld_003",
  "numerator_field_id": "fld_003",
  "denominator_field_id": null,
  "filters": {
    "review_status": "Approved",
    "reporting_period": "current"
  },
  "group_by": ["District"],
  "formula": "avg(manufacturing_jobs_created)",
  "preview_value": "4.1%",
  "submissions_used": 428,
  "last_computed_at": "2026-05-24T09:30:00Z"
}
```

### GET `/projects/{project_id}/computation-rules`

Response: paginated `ComputationRule[]`.

### POST `/projects/{project_id}/computation-rules`

Request:

```json
{
  "indicator_id": "ind_001",
  "method": "Sum",
  "source_form_id": "frm_001",
  "source_field_id": "fld_003",
  "filters": { "review_status": "Approved" },
  "group_by": ["District"],
  "formula": "sum(manufacturing_jobs_created)"
}
```

Response: `ComputationRule`.

### PATCH `/computation-rules/{rule_id}`

Response: `ComputationRule`.

### DELETE `/computation-rules/{rule_id}`

Response:

```json
{ "deleted": true }
```

### POST `/computation-rules/{rule_id}/preview`

Returns a computed preview without saving `indicator.current`.

Response:

```json
{
  "preview_value": "11.8 USD m",
  "submissions_used": 176,
  "warnings": []
}
```

### POST `/projects/{project_id}/computations/run`

Starts an async Celery computation job.

Request:

```json
{
  "indicator_ids": ["ind_001"],
  "reason": "manual_recompute"
}
```

Response:

```json
{
  "job_id": "job_001",
  "status": "Queued"
}
```

### GET `/computations/jobs/{job_id}`

Response:

```json
{
  "id": "job_001",
  "status": "Success",
  "started_at": "2026-05-24T09:30:00Z",
  "finished_at": "2026-05-24T09:31:00Z",
  "results": [
    {
      "indicator_id": "ind_001",
      "value": 4.1,
      "unit": "%",
      "submissions_used": 428
    }
  ],
  "warnings": []
}
```

## Reports

Report template examples: `Executive Summary`, `Indicator Performance`, `Field Collection`, `Donor Brief`, `Quality Audit`.

Report model:

```json
{
  "id": "rep_001",
  "project_id": "prj_001",
  "title": "Monthly Programme Brief",
  "template": "Executive Summary",
  "status": "Ready",
  "department": "Monitoring and Evaluation",
  "date_range": {
    "start": "2026-01-01",
    "end": "2026-05-24"
  },
  "created_at": "2026-05-24T10:00:00Z",
  "download_url": "https://..."
}
```

### GET `/reports`

Query:

```text
project_id=
template=
status=
department=
start_date=
end_date=
page=
page_size=
```

Response:

```json
{
  "items": [],
  "summary": {
    "reports_ready": 8,
    "drafts": 3,
    "scheduled": 2
  },
  "meta": {}
}
```

### POST `/reports`

Starts report generation.

Request:

```json
{
  "project_id": "prj_001",
  "template": "Executive Summary",
  "title": "Monthly Programme Brief",
  "status": "Draft",
  "department": "Monitoring and Evaluation",
  "date_range": {
    "start": "2026-01-01",
    "end": "2026-05-24"
  }
}
```

Response:

```json
{
  "report": {},
  "job_id": "job_report_001"
}
```

### GET `/reports/{report_id}`

Response: `Report`.

### GET `/reports/{report_id}/download`

Returns a signed URL or file response.

### POST `/reports/{report_id}/export`

Request:

```json
{ "format": "pdf" }
```

Response:

```json
{ "job_id": "job_export_001", "status": "Queued" }
```

## Users And Roles

User status values: `Active`, `Invited`, `Suspended`.
Current UI role values: `Owner`, `Admin`, `M&E Manager`, `Project Manager`, `Field Supervisor`, `Field Agent`, `Viewer`.

Workspace user model:

```json
{
  "id": "usr_001",
  "name": "Ama Mensah",
  "email": "ama@pkaymne.org",
  "role": "Project Manager",
  "status": "Active",
  "team": "Monitoring and Evaluation",
  "last_active_at": "2026-05-24T08:00:00Z",
  "avatar_url": null,
  "permissions": ["projects:read", "submissions:review"]
}
```

### GET `/users`

Query:

```text
search=
role=
status=
page=
page_size=
```

Response: paginated `WorkspaceUser[]`.

### POST `/users/invite`

Request:

```json
{
  "name": "Ama Mensah",
  "email": "ama@pkaymne.org",
  "role": "Project Manager",
  "team": "Monitoring and Evaluation"
}
```

Response:

```json
{
  "user": {},
  "invite": {
    "id": "inv_001",
    "status": "Sent",
    "expires_at": "2026-05-31T10:00:00Z"
  }
}
```

### PATCH `/users/{user_id}`

Updates role, team, status, profile metadata.

### DELETE `/users/{user_id}`

Soft-delete or deactivate depending on backend policy.

### GET `/roles`

Response:

```json
{
  "items": [
    {
      "id": "role_admin",
      "name": "Agency Admin",
      "scope": "Workspace-wide",
      "users_count": 4,
      "permissions": ["projects:write", "users:invite"]
    }
  ]
}
```

## Operations Center

Frontend routes:
- `/dashboard/operations/billing`
- `/dashboard/operations/notifications`
- `/dashboard/operations/audit`
- `/dashboard/operations/imports`
- `/dashboard/operations/permissions`
- `/dashboard/operations/workspace`

### GET `/operations/summary`

Response:

```json
{
  "current_plan": "Growth",
  "unread_alerts": 2,
  "audit_events_count": 2400,
  "storage_used_percent": 68
}
```

### GET `/billing/subscription`

Response:

```json
{
  "id": "sub_001",
  "package": {
    "id": "pkg_growth",
    "name": "Growth",
    "price": { "amount": 299, "currency": "USD" },
    "billing_cycle": "monthly"
  },
  "status": "Active",
  "renews_at": "2026-12-31T00:00:00Z",
  "usage": [
    { "label": "Projects", "value": 12, "max": 15 },
    { "label": "Indicators", "value": 184, "max": 250 },
    { "label": "Users", "value": 37, "max": 50 },
    { "label": "Submissions", "value": 18240, "max": 25000 }
  ],
  "payment_method": {
    "brand": "Visa",
    "last4": "4242",
    "expires": "08/28"
  },
  "billing_contacts": ["finance@pkaymne.org", "admin@pkaymne.org"]
}
```

### PATCH `/billing/subscription`

Request:

```json
{
  "package_id": "pkg_enterprise",
  "billing_cycle": "annual"
}
```

Response: updated subscription or checkout/payment intent.

### GET `/billing/invoices`

Response: paginated invoice list.

### GET `/billing/invoices/{invoice_id}/download`

Returns signed URL or file response.

### PATCH `/billing/payment-method`

Request:

```json
{ "payment_method_token": "pm_..." }
```

Response: updated payment method summary.

### GET `/notifications`

Query:

```text
tone=info|warning|success|danger
unread=true|false
page=
page_size=
```

Response:

```json
{
  "items": [
    {
      "id": "ntf_001",
      "title": "Submission sync delayed",
      "body": "23 tablet submissions are waiting for connectivity.",
      "project_id": "prj_001",
      "project_name": "Education Access",
      "tone": "warning",
      "unread": true,
      "created_at": "2026-05-24T09:00:00Z",
      "action_url": "/dashboard/projects/prj_001/submissions"
    }
  ],
  "meta": {}
}
```

### PATCH `/notifications/{notification_id}/read`

Response:

```json
{ "read": true }
```

### POST `/notifications/mark-all-read`

Response:

```json
{ "updated": 12 }
```

### GET `/audit-events`

Query:

```text
search=
actor_id=
area=
risk=Low|Medium|High
from=
to=
page=
page_size=
```

Response: paginated audit event list.

Audit event model:

```json
{
  "id": "aud_001",
  "actor": { "id": "usr_001", "name": "Mr. Otoo" },
  "action": "Updated indicator formula",
  "target": "Completion Rate",
  "target_type": "Indicator",
  "area": "Indicators",
  "risk": "Medium",
  "created_at": "2026-05-24T14:35:00Z",
  "diff": {}
}
```

### GET `/audit-events/export`

Returns CSV/Excel export job or file URL.

### GET `/imports`

Response: paginated import job list.

Import status values: `Validated`, `Needs Review`, `Queued`, `Imported`, `Failed`.

### POST `/imports`

Creates an import job. For actual file uploads, prefer a presigned upload flow.

Request:

```json
{
  "type": "Indicators",
  "project_id": "prj_001",
  "file_name": "district_indicators_may.xlsx",
  "validation_profile": "Strict headers"
}
```

Response:

```json
{
  "import_job": {
    "id": "imp_001",
    "status": "Queued"
  },
  "upload_url": "https://..."
}
```

### GET `/imports/{import_id}`

Response includes validation errors, inferred mappings, preview rows, and import summary.

### PATCH `/imports/{import_id}/mapping`

Saves column-to-field mapping.

### POST `/imports/{import_id}/validate`

Starts validation job.

### POST `/imports/{import_id}/commit`

Commits validated rows into real project data.

### GET `/exports/templates`

Response: export templates list.

### POST `/exports`

Request:

```json
{
  "template_id": "exp_project_portfolio",
  "format": "xlsx",
  "filters": {}
}
```

Response:

```json
{ "job_id": "job_export_001", "status": "Queued" }
```

## Settings And Workspace Preferences

### GET `/settings/workspace`

Response:

```json
{
  "workspace": {
    "name": "PKay Monitoring and Evaluation Agency",
    "country": "Ghana",
    "timezone": "Africa/Accra",
    "date_format": "dd/MM/yyyy",
    "logo_url": "https://..."
  },
  "preferences": {
    "saved_filters": [],
    "favorite_project_ids": [],
    "report_branding": {},
    "data_retention_years": 7,
    "security": {
      "mfa_required": false,
      "session_duration_minutes": 480
    }
  }
}
```

### PATCH `/settings/workspace`

Updates workspace metadata and preferences.

### GET `/command-search`

Powers the global command palette.

Query:

```text
q=
types=projects,users,reports,companies,audit,settings
limit=10
```

Response:

```json
{
  "items": [
    {
      "id": "prj_001",
      "type": "project",
      "label": "Industrial Transformation Programme",
      "meta": "Projects",
      "href": "/dashboard/projects/prj_001"
    }
  ]
}
```

## Super User System Management

Frontend routes:
- `/dashboard/system`
- `/dashboard/system/packages`
- `/dashboard/system/subscriptions`
- `/dashboard/system/transactions`
- `/dashboard/system/companies`

All endpoints in this section require `is_superuser = true`.

### GET `/system/summary`

Response:

```json
{
  "companies_count": 4,
  "mrr": { "amount": 21400, "currency": "USD" },
  "active_subscriptions_count": 2,
  "failed_payments_count": 1,
  "tenant_growth_percent": 18,
  "payment_success_percent": 96.4,
  "trial_conversion_percent": 42,
  "revenue_trend": [
    { "period": "M1", "amount": 12000 },
    { "period": "M2", "amount": 14800 }
  ],
  "operational_alerts": []
}
```

### GET `/system/packages`

Response: paginated subscription package list.

Package model:

```json
{
  "id": "pkg_growth",
  "name": "Growth",
  "price": { "amount": 299, "currency": "USD" },
  "billing_cycle": "monthly",
  "limits": {
    "projects": 15,
    "indicators": 250,
    "users": 50,
    "submissions_per_month": 25000
  },
  "status": "Active"
}
```

### POST `/system/packages`

Request:

```json
{
  "name": "Professional",
  "price": { "amount": 499, "currency": "USD" },
  "billing_cycle": "monthly",
  "limits": {
    "projects": 25,
    "indicators": 500,
    "users": 100,
    "submissions_per_month": 50000
  },
  "status": "Draft"
}
```

Response: package.

### PATCH `/system/packages/{package_id}`

Response: package.

### GET `/system/companies`

Query:

```text
search=
plan=
status=Active|Trial|Suspended
country=
page=
page_size=
```

Response: paginated company list.

Company model:

```json
{
  "id": "cmp_001",
  "name": "PKay Monitoring and Evaluation Agency",
  "plan": "Growth",
  "status": "Active",
  "users_count": 37,
  "projects_count": 12,
  "country": "Ghana",
  "joined_at": "2026-01-12T00:00:00Z"
}
```

### GET `/system/companies/{company_id}`

Response:

```json
{
  "company": {},
  "health": "Healthy",
  "subscription": {},
  "usage": [],
  "recent_activity": []
}
```

### PATCH `/system/companies/{company_id}`

Updates company status, plan assignment, support metadata.

### POST `/system/companies/{company_id}/impersonation-preview`

Creates a Super User preview session. Backend should audit this action.

Response:

```json
{
  "preview_token": "preview_...",
  "expires_at": "2026-05-24T15:00:00Z"
}
```

### GET `/system/subscriptions`

Response: paginated platform subscription list.

### PATCH `/system/subscriptions/{subscription_id}`

Updates subscription status/package/renewal metadata.

### GET `/system/transactions`

Query:

```text
status=Paid|Pending|Failed|Refunded
company_id=
from=
to=
page=
page_size=
```

Response: paginated transaction list.

### POST `/system/transactions/{transaction_id}/refund`

Response: transaction.

## Files And Attachments

### POST `/files/presign-upload`

Request:

```json
{
  "filename": "evidence.jpg",
  "content_type": "image/jpeg",
  "purpose": "submission_attachment"
}
```

Response:

```json
{
  "file_id": "file_001",
  "upload_url": "https://...",
  "headers": {},
  "expires_at": "2026-05-24T10:15:00Z"
}
```

### GET `/files/{file_id}/download`

Returns signed URL.

## WebSockets

Connect:

```text
ws://<host>/api/v1/ws?token=<access_token>
```

Server events:

```json
{
  "type": "notification.created",
  "payload": {}
}
```

Required event types:
- `notification.created`
- `submission.created`
- `submission.reviewed`
- `computation.job.updated`
- `report.job.updated`
- `import.job.updated`
- `export.job.updated`
- `billing.payment.updated`
- `system.tenant.updated`

Client events:

```json
{
  "type": "subscribe",
  "channels": ["company:cmp_001", "project:prj_001"]
}
```

Backend must enforce channel authorization.

## Background Jobs

Celery-backed async jobs should use this common shape:

```json
{
  "id": "job_001",
  "type": "computation|report_export|import_validation|import_commit|file_export",
  "status": "Queued|Running|Success|Failed|Warning",
  "progress": 0,
  "message": "Queued",
  "result": {},
  "error": null,
  "created_at": "2026-05-24T10:00:00Z",
  "updated_at": "2026-05-24T10:00:00Z"
}
```

### GET `/jobs/{job_id}`

Response: job.

## Backend Development Priority

Implement in this order so the frontend can be wired incrementally:

1. Auth/session, company tenancy, roles, and `/me`.
2. Projects, outcomes, indicators, and dashboard summary.
3. Forms, form versions, fields, submissions, and submission review.
4. Computation rules and Celery computation jobs.
5. Reports and export jobs.
6. Users, invites, roles, and permission metadata.
7. Operations center: billing, notifications, audit, imports, exports, workspace preferences.
8. Super User system endpoints: packages, companies, subscriptions, transactions.
9. WebSocket events for notifications, jobs, submissions, and billing updates.

## Frontend Integration Notes

The frontend should move toward a typed API layer:

```text
src/lib/api/client.ts
src/lib/api/contracts.ts
src/lib/api/projects.ts
src/lib/api/forms.ts
src/lib/api/reports.ts
src/lib/api/system.ts
```

Recommended frontend data library: TanStack Query, already present in dependencies.

For each list screen, backend should support:
- server-side search
- filters matching UI controls
- pagination
- stable sorting
- empty-state friendly responses

For each modal form, backend should return field-level validation errors using the common error shape.

For every mutation that affects computed counts or dashboards, backend should emit audit events and relevant websocket notifications.
