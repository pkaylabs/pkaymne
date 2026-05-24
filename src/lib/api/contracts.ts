export type ID = string;
export type ISODate = string;
export type ISODateTime = string;

export type Money = {
  amount: number;
  currency: string;
};

export type PaginatedResponse<T> = {
  items: T[];
  meta: {
    page: number;
    page_size: number;
    total: number;
    pages: number;
  };
};

export type ApiErrorResponse = {
  error: {
    code: string;
    message: string;
    details?: Record<string, string[]>;
    request_id: string;
  };
};

export type ProjectStatus = "Active" | "Planning" | "Paused" | "Completed";
export type OutcomeStatus = "Active" | "Completed" | "Pending" | "On Hold";
export type OutcomePriority = "High" | "Medium" | "Low";
export type IndicatorStatus = "On Track" | "At Risk" | "Off Track" | "Achieved";
export type FieldType = "Text" | "Long Text" | "Number" | "Date" | "Select" | "Radio" | "Checkbox" | "Photo" | "GPS";
export type SubmissionStatus = "Approved" | "Needs Review" | "Rejected";
export type AggregationMethod = "Sum" | "Average" | "Count" | "Min" | "Max" | "Percentage" | "Ratio" | "Custom formula";
export type UserStatus = "Active" | "Invited" | "Suspended";
export type UserRole = "Owner" | "Admin" | "M&E Manager" | "Project Manager" | "Field Supervisor" | "Field Agent" | "Viewer";
export type JobStatus = "Queued" | "Running" | "Success" | "Failed" | "Warning";

export type Project = {
  id: ID;
  name: string;
  owner: string;
  status: ProjectStatus;
  outcomes_count: number;
  indicators_count: number;
  review_date: ISODate | null;
  completion: number;
  districts_count: number;
  submissions_count: number;
  created_at: ISODateTime;
  updated_at: ISODateTime;
};

export type Outcome = {
  id: ID;
  project_id: ID;
  name: string;
  description: string;
  indicators_count: number;
  status: OutcomeStatus;
  priority: OutcomePriority;
  owner: string;
  department: string;
  due_date: ISODate | null;
  progress: number;
};

export type Indicator = {
  id: ID;
  project_id: ID;
  outcome_id: ID;
  name: string;
  description: string;
  baseline: number;
  target: number;
  current: number;
  unit: string;
  owner: string;
  department: string;
  status: IndicatorStatus;
  updated_at: ISODateTime;
};

export type FormField = {
  id: ID;
  form_version_id: ID;
  label: string;
  type: FieldType;
  required: boolean;
  helper_text: string;
  indicator_id: ID | null;
  options: string[];
  order: number;
  validation: {
    min?: number | null;
    max?: number | null;
    regex?: string | null;
  };
};

export type FormVersion = {
  id: ID;
  form_id: ID;
  version: string;
  status: "Draft" | "Published" | "Archived";
  created_by: ID;
  created_at: ISODateTime;
  published_at: ISODateTime | null;
  fields: FormField[];
};

export type ProjectForm = {
  id: ID;
  project_id: ID;
  title: string;
  instructions: string;
  current_version_id: ID | null;
  status: "Draft" | "Published" | "Archived";
  created_at: ISODateTime;
  updated_at: ISODateTime;
};

export type Submission = {
  id: ID;
  project_id: ID;
  form_id: ID;
  form_version_id: ID;
  site: string;
  submitted_by: {
    id: ID;
    name: string;
  };
  submitted_at: ISODateTime;
  status: SubmissionStatus;
  values: Record<ID, unknown>;
  attachments: Array<{
    id: ID;
    field_id: ID;
    type: "photo" | "file";
    url: string;
  }>;
  quality_checks: Array<{
    label: string;
    passed: boolean;
  }>;
};

export type ComputationRule = {
  id: ID;
  project_id: ID;
  indicator_id: ID;
  method: AggregationMethod;
  source_form_id: ID;
  source_field_id: ID;
  numerator_field_id: ID | null;
  denominator_field_id: ID | null;
  filters: Record<string, unknown>;
  group_by: string[];
  formula: string;
  preview_value: string;
  submissions_used: number;
  last_computed_at: ISODateTime | null;
};

export type Report = {
  id: ID;
  project_id: ID;
  title: string;
  template: string;
  status: "Draft" | "Ready" | "Scheduled" | "Generating" | "Failed";
  department: string;
  date_range: {
    start: ISODate;
    end: ISODate;
  };
  created_at: ISODateTime;
  download_url: string | null;
};

export type WorkspaceUser = {
  id: ID;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  team: string;
  last_active_at: ISODateTime | null;
  avatar_url: string | null;
  permissions: string[];
};

export type NotificationItem = {
  id: ID;
  title: string;
  body: string;
  project_id: ID | null;
  project_name: string | null;
  tone: "info" | "warning" | "success" | "danger";
  unread: boolean;
  created_at: ISODateTime;
  action_url: string | null;
};

export type AuditEvent = {
  id: ID;
  actor: {
    id: ID | null;
    name: string;
  };
  action: string;
  target: string;
  target_type: string;
  area: string;
  risk: "Low" | "Medium" | "High";
  created_at: ISODateTime;
  diff: Record<string, unknown>;
};

export type BackgroundJob<T = unknown> = {
  id: ID;
  type: "computation" | "report_export" | "import_validation" | "import_commit" | "file_export";
  status: JobStatus;
  progress: number;
  message: string;
  result: T | null;
  error: ApiErrorResponse["error"] | null;
  created_at: ISODateTime;
  updated_at: ISODateTime;
};

export type SubscriptionPackage = {
  id: ID;
  name: string;
  price: Money;
  billing_cycle: "monthly" | "annual" | "custom";
  limits: {
    projects: number;
    indicators: number;
    users: number;
    submissions_per_month: number;
  };
  status: "Active" | "Draft" | "Retired";
};

export type Company = {
  id: ID;
  name: string;
  plan: string;
  status: "Active" | "Trial" | "Suspended";
  users_count: number;
  projects_count: number;
  country: string;
  joined_at: ISODateTime;
};
