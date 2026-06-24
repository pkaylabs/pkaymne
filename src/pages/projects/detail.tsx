import { EmptyState, ErrorState, LoadingState, PermissionState, StateBand } from "@/components/core/state-views";
import { ActionMenu } from "@/components/core/action-menu";
import { INDICATORS, OBJECTIVES, PROJECTS, REPORTS } from "@/constants/page-path";
import {
  BarChart3,
  CalendarDays,
  Calculator,
  CheckSquare,
  CheckCircle2,
  ClipboardCheck,
  ClipboardList,
  Copy,
  Download,
  Eye,
  FileText,
  FormInput,
  Gauge,
  FunctionSquare,
  GripVertical,
  Hash,
  History,
  Image,
  LayoutList,
  Link as LinkIcon,
  ListChecks,
  MapPinned,
  Pencil,
  Plus,
  PlayCircle,
  Save,
  Send,
  ShieldCheck,
  Smartphone,
  Trash2,
  Type,
  UploadCloud,
  Users,
  X,
} from "lucide-react";
import type React from "react";
import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-location";
import { apiRequest } from "@/lib/api/client";

type Section = "overview" | "outcomes" | "indicators" | "forms" | "submissions" | "reports";
type FieldType = "Text" | "Long Text" | "Number" | "Date" | "Select" | "Radio" | "Checkbox" | "Photo" | "GPS";
type SubmissionStatus = "Approved" | "Needs Review" | "Rejected";
type AggregationMethod = "Sum" | "Average" | "Count" | "Min" | "Max" | "Percentage" | "Ratio" | "Custom formula";

type ComputationRule = {
  id: number;
  indicator: string;
  method: AggregationMethod;
  sourceForm: string;
  sourceField: string;
  numeratorField: string;
  denominatorField: string;
  filters: string;
  groupBy: string;
  formula: string;
  previewValue: string;
  submissionsUsed: number;
  lastComputed: string;
};

type FormField = {
  id: number;
  label: string;
  type: FieldType;
  required: boolean;
  helperText: string;
  indicator: string;
  options: string[];
};

const defaultProject = {
  id: "1",
  name: "Industrial Transformation Programme",
  owner: "Monitoring and Evaluation",
  status: "Active",
  reviewDate: "2026-12-31",
  completion: 68,
  districts: 14,
  submissions: 918,
  budget: 1250000,
};

const defaultProjectOutcomes: Array<[string, string, number, number]> = [
  ["Industrial productivity improved", "Active", 5, 74],
  ["Export competitiveness strengthened", "Active", 7, 62],
  ["Private sector capacity expanded", "Planning", 4, 35],
];

const defaultProjectIndicators: Array<[string, string, string, string]> = [
  ["Manufacturing value-added share of GDP", "4.1%", "4.5%", "On Track"],
  ["Non-extractive export earnings", "11.8 USD m", "18 USD m", "Off Track"],
  ["Manufacturing productivity growth rate", "3.2%", "4.5%", "At Risk"],
];

const initialFields: FormField[] = [
  { id: 1, label: "District", type: "Select", required: true, helperText: "Choose the district where data was collected.", indicator: "District coverage", options: ["Tamale", "Kumasi", "Tema", "Sunyani"] },
  { id: 2, label: "Facility name", type: "Text", required: true, helperText: "Use the official facility or site name.", indicator: "Collection site registry", options: [] },
  { id: 3, label: "Manufacturing jobs created", type: "Number", required: true, helperText: "Enter the verified number of new jobs.", indicator: "Youth employment rate", options: [] },
  { id: 4, label: "Evidence photo", type: "Photo", required: false, helperText: "Capture a clear image of supporting evidence.", indicator: "Submission evidence quality", options: [] },
];

const fieldPalette: Array<{ type: FieldType; label: string; description: string; icon: React.ElementType }> = [
  { type: "Text", label: "Short text", description: "Names, codes, and brief answers", icon: Type },
  { type: "Long Text", label: "Long text", description: "Narratives and observations", icon: ClipboardList },
  { type: "Number", label: "Number", description: "Counts, totals, and scores", icon: Hash },
  { type: "Date", label: "Date", description: "Visit and verification dates", icon: CalendarDays },
  { type: "Select", label: "Dropdown", description: "One answer from a list", icon: ListChecks },
  { type: "Radio", label: "Single choice", description: "Visible one-answer choice", icon: CheckSquare },
  { type: "Checkbox", label: "Checkbox", description: "Yes/no confirmations", icon: CheckCircle2 },
  { type: "Photo", label: "Photo", description: "Field evidence capture", icon: Image },
  { type: "GPS", label: "GPS location", description: "Capture coordinates", icon: MapPinned },
];

const sourceForms = ["Industrial transformation field visit", "District service validation", "Enterprise support follow-up"];
const sourceFields = ["District", "Facility name", "Manufacturing jobs created", "Verified export earnings", "Target export earnings", "Evidence photo"];
const groupingOptions = ["None", "District", "Month", "Quarter", "Project site", "Field agent"];
const filterOptions = ["Approved submissions only", "All submissions", "Current reporting period", "Exclude flagged records"];

const defaultSubmissions = [
  ["SUB-1048", "Tamale Industrial Cluster", "Ama Boateng", "May 22, 2026", "Approved"],
  ["SUB-1047", "Kumasi Production Hub", "Daniel Mensah", "May 21, 2026", "Needs Review"],
  ["SUB-1046", "Tema Export Site", "Kojo Asare", "May 20, 2026", "Approved"],
  ["SUB-1045", "Sunyani Skills Center", "Efua Grant", "May 19, 2026", "Rejected"],
] as Array<[string, string, string, string, SubmissionStatus]>;

const defaultReports: Array<[string, string, string]> = [
  ["Monthly Programme Brief", "Executive Summary", "Ready"],
  ["Indicator Variance Review", "Indicator Performance", "Draft"],
  ["Field Submission Quality Audit", "Field Collection", "Ready"],
];

const formVersions = [
  ["v1.3 draft", "Current draft", "Kojo Otoo", "May 24, 2026"],
  ["v1.2", "Published", "Ama Boateng", "May 18, 2026"],
  ["v1.1", "Archived", "Daniel Mensah", "Apr 30, 2026"],
];

const computationRuns = [
  ["May 24, 2026 09:30", "428 submissions", "Success"],
  ["May 23, 2026 16:45", "421 submissions", "Success"],
  ["May 22, 2026 10:15", "398 submissions", "Warning"],
];

const sectionMeta: Record<Section, { label: string; icon: React.ElementType }> = {
  overview: { label: "Overview", icon: LayoutList },
  outcomes: { label: "Outcomes", icon: ClipboardList },
  indicators: { label: "Indicators", icon: BarChart3 },
  forms: { label: "Forms", icon: FormInput },
  submissions: { label: "Submissions", icon: ClipboardCheck },
  reports: { label: "Reports", icon: FileText },
};

export default function ProjectDetailPage() {
  const pathname = useLocation().current.pathname;
  const section = getSection(pathname);
  const projectId = Number(pathname.match(/\/projects\/(\d+)/)?.[1] ?? 0);
  const [project, setProject] = useState(defaultProject);
  const [projectOutcomes, setProjectOutcomes] = useState(defaultProjectOutcomes);
  const [projectIndicators, setProjectIndicators] = useState(defaultProjectIndicators);
  const [submissions, setSubmissions] = useState(defaultSubmissions);
  const [reports, setReports] = useState(defaultReports);
  const [pageLoading, setPageLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  const [formId, setFormId] = useState<number | null>(null);
  const [indicatorIds, setIndicatorIds] = useState<Record<string, number>>({});
  const [formSaving, setFormSaving] = useState(false);
  const [formNotice, setFormNotice] = useState("");
  const [fields, setFields] = useState(initialFields);
  const [computationRules, setComputationRules] = useState<ComputationRule[]>([]);
  const [selectedRuleId, setSelectedRuleId] = useState(0);
  const [selectedFieldId, setSelectedFieldId] = useState(initialFields[0]?.id ?? 0);
  const [formMeta, setFormMeta] = useState({
    title: "Industrial transformation field visit",
    version: "v1.3 draft",
    instructions: "Collect verified site-level evidence for project indicator computation.",
  });
  const [reviewStatus, setReviewStatus] = useState<SubmissionStatus | "All">("All");

  useEffect(() => {
    if (!projectId) {
      setPageError("Invalid project address.");
      setPageLoading(false);
      return;
    }
    let active = true;
    Promise.all([
      apiRequest<{
        project: { id: number; name: string; status: string; end_date: string | null; budget: number | null; department_id: number | null };
        summary: { completion: number; districts_count: number; submissions_count: number };
      }>(`/projects/${projectId}/summary`),
      apiRequest<Array<{ id: number; name: string }>>(`/projects/${projectId}/outcomes`),
      apiRequest<Array<{ id: number; outcome_id: number; name: string; baseline: number; target: number; actual: number; unit: string | null }>>(`/projects/${projectId}/indicators`),
      apiRequest<Array<{ id: number; device_id: string | null; status: string; created_at: string }>>(`/submissions?project_id=${projectId}`),
      apiRequest<{ items: Array<{ title: string; template: string; status: string }> }>(`/reports?project_id=${projectId}`),
      apiRequest<Array<{ id: number; name: string; description: string | null }>>(`/projects/${projectId}/forms`),
      apiRequest<Array<{
        id: number;
        indicator_id: number;
        source_form_id: number | null;
        method: AggregationMethod;
        source_field_key: string | null;
        numerator_field_key: string | null;
        denominator_field_key: string | null;
        formula: string | null;
        filters: Record<string, unknown>;
        group_by: string[];
        preview_value: number | null;
        submissions_used: number;
        last_computed_at: string | null;
      }>>(`/projects/${projectId}/computation-rules`),
    ])
      .then(async ([summary, outcomeRows, indicatorRows, submissionRows, reportRows, formRows, ruleRows]) => {
        if (!active) return;
        setProject({
          id: String(summary.project.id),
          name: summary.project.name,
          owner: summary.project.department_id ? `Department ${summary.project.department_id}` : "Monitoring and Evaluation",
          status: titleCase(summary.project.status),
          reviewDate: summary.project.end_date ?? "",
          completion: summary.summary.completion,
          districts: summary.summary.districts_count,
          submissions: summary.summary.submissions_count || submissionRows.length,
          budget: Number(summary.project.budget ?? 0),
        });
        setProjectOutcomes(outcomeRows.map((outcome) => {
          const linked = indicatorRows.filter((indicator) => indicator.outcome_id === outcome.id);
          const progress = linked.length
            ? Math.round(linked.reduce((sum, indicator) => sum + metricProgress(indicator.baseline, indicator.target, indicator.actual), 0) / linked.length)
            : 0;
          return [outcome.name, progress >= 100 ? "Completed" : progress > 0 ? "Active" : "Planning", linked.length, progress] as [string, string, number, number];
        }));
        setProjectIndicators(indicatorRows.map((indicator) => {
          const progress = metricProgress(indicator.baseline, indicator.target, indicator.actual);
          return [
            indicator.name,
            `${indicator.actual} ${indicator.unit ?? ""}`.trim(),
            `${indicator.target} ${indicator.unit ?? ""}`.trim(),
            progress >= 100 ? "Achieved" : progress >= 75 ? "On Track" : progress >= 50 ? "At Risk" : "Off Track",
          ] as [string, string, string, string];
        }));
        const idMap = Object.fromEntries(indicatorRows.map((indicator) => [indicator.name, indicator.id]));
        setIndicatorIds(idMap);
        const mappedRules = ruleRows.map((rule) => {
          const indicator = indicatorRows.find((item) => item.id === rule.indicator_id);
          const sourceForm = formRows.find((item) => item.id === rule.source_form_id);
          return {
            id: rule.id,
            indicator: indicator?.name ?? "Unassigned indicator",
            method: titleCase(rule.method) as AggregationMethod,
            sourceForm: sourceForm?.name ?? "",
            sourceField: fieldLabel(rule.source_field_key),
            numeratorField: fieldLabel(rule.numerator_field_key),
            denominatorField: fieldLabel(rule.denominator_field_key),
            filters: Object.keys(rule.filters).length ? JSON.stringify(rule.filters) : filterOptions[0],
            groupBy: rule.group_by[0] ?? "None",
            formula: rule.formula ?? "",
            previewValue: rule.preview_value == null ? "Pending" : String(rule.preview_value),
            submissionsUsed: rule.submissions_used,
            lastComputed: rule.last_computed_at ? new Date(rule.last_computed_at).toLocaleString() : "Not computed yet",
          };
        });
        setComputationRules(mappedRules);
        setSelectedRuleId(mappedRules[0]?.id ?? 0);
        setSubmissions(submissionRows.map((submission) => [
          `SUB-${submission.id}`,
          submission.device_id || "Field submission",
          "Field agent",
          new Date(submission.created_at).toLocaleDateString(),
          submission.status === "accepted" ? "Approved" : submission.status === "rejected" ? "Rejected" : "Needs Review",
        ] as [string, string, string, string, SubmissionStatus]));
        setReports(reportRows.items.map((report) => [report.title, report.template, report.status] as [string, string, string]));
        if (formRows[0]) {
          const detail = await apiRequest<{
            id: number;
            name: string;
            description: string | null;
            current_version: {
              version: number;
              is_published: boolean;
              definition?: { instructions?: string };
              schema?: { instructions?: string };
              fields: Array<{
                id: number;
                label: string;
                field_type: FieldType;
                required: boolean;
                config: { helper_text?: string; options?: string[]; indicator?: string };
              }>;
            } | null;
          }>(`/forms/${formRows[0].id}`);
          if (!active) return;
          setFormId(detail.id);
          setFormMeta({
            title: detail.name,
            version: detail.current_version ? `v${detail.current_version.version}${detail.current_version.is_published ? "" : " draft"}` : "New draft",
            instructions: detail.current_version?.definition?.instructions ?? detail.current_version?.schema?.instructions ?? detail.description ?? "",
          });
          setFields((detail.current_version?.fields ?? []).map((field) => ({
            id: field.id,
            label: field.label,
            type: field.field_type,
            required: field.required,
            helperText: field.config.helper_text ?? "",
            indicator: field.config.indicator ?? "",
            options: field.config.options ?? [],
          })));
        } else {
          setFields([]);
          setFormMeta({
            title: `${summary.project.name} field form`,
            version: "New draft",
            instructions: "Collect verified field evidence for project indicator computation.",
          });
        }
      })
      .catch((caught) => {
        if (active) setPageError(caught instanceof Error ? caught.message : "Could not load this project.");
      })
      .finally(() => {
        if (active) setPageLoading(false);
      });
    return () => { active = false; };
  }, [projectId]);

  const filteredSubmissions = useMemo(
    () => submissions.filter((submission) => reviewStatus === "All" || submission[4] === reviewStatus),
    [reviewStatus, submissions]
  );

  const selectedField = fields.find((field) => field.id === selectedFieldId) ?? fields[0];
  const selectedRule = computationRules.find((rule) => rule.id === selectedRuleId) ?? computationRules[0];

  if (pageLoading) {
    return <div className="grid min-h-full place-items-center bg-gray-900 text-sm text-gray-400">Loading project workspace...</div>;
  }

  const addField = (type: FieldType) => {
    const paletteItem = fieldPalette.find((item) => item.type === type);
    const nextField: FormField = {
      id: Math.max(0, ...fields.map((field) => field.id)) + 1,
      label: paletteItem?.label ?? "New field",
      type,
      required: type !== "Photo",
      helperText: paletteItem?.description ?? "",
      indicator: "",
      options: type === "Select" || type === "Radio" ? ["Option one", "Option two"] : [],
    };
    setFields((items) => [...items, nextField]);
    setSelectedFieldId(nextField.id);
  };

  const updateField = (id: number, patch: Partial<FormField>) => {
    setFields((items) => items.map((field) => (field.id === id ? { ...field, ...patch } : field)));
  };

  const duplicateField = (field: FormField) => {
    const copy = { ...field, id: Math.max(0, ...fields.map((item) => item.id)) + 1, label: `${field.label} copy` };
    setFields((items) => [...items, copy]);
    setSelectedFieldId(copy.id);
  };

  const moveField = (id: number, direction: -1 | 1) => {
    setFields((items) => {
      const index = items.findIndex((field) => field.id === id);
      const target = index + direction;
      if (index < 0 || target < 0 || target >= items.length) return items;
      const copy = [...items];
      [copy[index], copy[target]] = [copy[target], copy[index]];
      return copy;
    });
  };

  const updateRule = (id: number, patch: Partial<ComputationRule>) => {
    setComputationRules((items) => items.map((rule) => (rule.id === id ? { ...rule, ...patch } : rule)));
  };

  const saveForm = async (publish: boolean) => {
    try {
      setFormSaving(true);
      setFormNotice("");
      let activeFormId = formId;
      if (activeFormId) {
        await apiRequest(`/forms/${activeFormId}`, {
          method: "PATCH",
          body: JSON.stringify({ name: formMeta.title, description: formMeta.instructions }),
        });
      } else {
        const created = await apiRequest<{ id: number }>(`/projects/${projectId}/forms`, {
          method: "POST",
          body: JSON.stringify({ name: formMeta.title, description: formMeta.instructions }),
        });
        activeFormId = created.id;
        setFormId(created.id);
      }
      const version = await apiRequest<{ version: number; is_published: boolean }>(`/forms/${activeFormId}/versions`, {
        method: "POST",
        body: JSON.stringify({
          publish,
          schema: { instructions: formMeta.instructions },
          fields: fields.map((field, order) => ({
            key: tokenize(field.label) || `field_${order + 1}`,
            label: field.label,
            type: field.type,
            required: field.required,
            order,
            config: {
              helper_text: field.helperText,
              options: field.options,
              indicator: field.indicator,
            },
          })),
        }),
      });
      setFormMeta((current) => ({
        ...current,
        version: `v${version.version}${version.is_published ? "" : " draft"}`,
      }));
      setFormNotice(publish ? "Form version published." : "Draft saved.");
    } catch (caught) {
      setFormNotice(caught instanceof Error ? caught.message : "Unable to save this form.");
    } finally {
      setFormSaving(false);
    }
  };

  const createRule = () => {
    if (!projectIndicators.length) return;
    const existingIndicators = new Set(computationRules.map((rule) => rule.indicator));
    const nextIndicator = projectIndicators.find(([name]) => !existingIndicators.has(name))?.[0] ?? projectIndicators[0][0];
    const nextRule: ComputationRule = {
      id: -Date.now(),
      indicator: nextIndicator,
      method: "Sum",
      sourceForm: sourceForms[0],
      sourceField: sourceFields[2],
      numeratorField: sourceFields[2],
      denominatorField: sourceFields[4],
      filters: filterOptions[0],
      groupBy: "District",
      formula: "sum(manufacturing_jobs_created)",
      previewValue: "Pending",
      submissionsUsed: 0,
      lastComputed: "Not computed yet",
    };
    setComputationRules((items) => [...items, nextRule]);
    setSelectedRuleId(nextRule.id);
  };

  const persistRule = async (rule: ComputationRule) => {
    const payload = {
      indicator_id: indicatorIds[rule.indicator],
      source_form_id: formId,
      name: `${rule.indicator} computation`,
      method: rule.method,
      source_field_key: tokenize(rule.sourceField) || null,
      numerator_field_key: tokenize(rule.numeratorField) || null,
      denominator_field_key: tokenize(rule.denominatorField) || null,
      formula: rule.formula || null,
      filters: rule.filters === filterOptions[0] ? { submission_status: "accepted" } : {},
      group_by: rule.groupBy === "None" ? [] : [rule.groupBy],
    };
    if (!payload.indicator_id) throw new Error("Select a valid indicator before saving the rule.");
    const saved = await apiRequest<{ id: number }>(
      rule.id > 0 ? `/computation-rules/${rule.id}` : `/projects/${projectId}/computation-rules`,
      { method: rule.id > 0 ? "PATCH" : "POST", body: JSON.stringify(payload) },
    );
    const persisted = { ...rule, id: saved.id };
    setComputationRules((items) => items.map((item) => item.id === rule.id ? persisted : item));
    setSelectedRuleId(saved.id);
    return persisted;
  };

  const testRule = async (rule: ComputationRule) => {
    const persisted = await persistRule(rule);
    const preview = await apiRequest<{ preview_value: number; submissions_used: number }>(`/computation-rules/${persisted.id}/preview`, { method: "POST" });
    setComputationRules((items) => items.map((item) => item.id === persisted.id ? {
      ...item,
      previewValue: String(preview.preview_value),
      submissionsUsed: preview.submissions_used,
      lastComputed: new Date().toLocaleString(),
    } : item));
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6 pb-24">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Link to={PROJECTS} className="text-sm font-semibold text-blue-300 transition hover:text-blue-200">Projects</Link>
            <h1 className="mt-2 text-3xl font-bold text-white">{project.name}</h1>
            <p className="mt-2 text-gray-400">A full project workspace for framework design, field collection, review, and reporting.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button className="inline-flex items-center gap-2 rounded-lg border border-gray-600 px-4 py-2 text-sm font-semibold text-gray-200 transition hover:bg-gray-800">
              <ShieldCheck className="h-4 w-4" />
              Permissions
            </button>
            <button className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700">
              <Save className="h-4 w-4" />
              Save snapshot
            </button>
          </div>
        </div>

        <StateBand>
          <LoadingState title="Live sync ready" message="This page is prepared for API-backed loading states." />
          <ErrorState title={pageError ? "Could not refresh project" : "Recoverable errors"} message={pageError || "Failed requests will render here with a retry action."} />
          <PermissionState message="Restricted actions such as publishing forms and approving submissions can be gated by role." />
        </StateBand>

        <div className="flex flex-wrap gap-2 rounded-lg border border-gray-700 bg-gray-800 p-2">
          {(Object.keys(sectionMeta) as Section[]).map((key) => {
            const Icon = sectionMeta[key].icon;
            return (
              <Link
                key={key}
                to={`${PROJECTS}/${project.id}${key === "overview" ? "" : `/${key}`}`}
                className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold transition ${
                  section === key ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-gray-700"
                }`}
              >
                <Icon className="h-4 w-4" />
                {sectionMeta[key].label}
              </Link>
            );
          })}
        </div>

        {section === "overview" && <OverviewSection project={project} />}
        {section === "outcomes" && <OutcomesSection outcomes={projectOutcomes} />}
        {section === "indicators" && (
          <IndicatorsSection
            indicators={projectIndicators}
            rules={computationRules}
            selectedRule={selectedRule}
            selectedRuleId={selectedRuleId}
            onCreateRule={createRule}
            onRuleSelect={setSelectedRuleId}
            onSaveRule={(rule) => void persistRule(rule)}
            onTestRule={(rule) => void testRule(rule)}
            onUpdateRule={updateRule}
          />
        )}
        {section === "forms" && (
          <FormsSection
            indicators={projectIndicators}
            fields={fields}
            formMeta={formMeta}
            notice={formNotice}
            saving={formSaving}
            selectedField={selectedField}
            selectedFieldId={selectedFieldId}
            onAdd={addField}
            onDuplicate={duplicateField}
            onFieldSelect={setSelectedFieldId}
            onMetaChange={setFormMeta}
            onMove={moveField}
            onRemove={(id) => {
              setFields((items) => items.filter((field) => field.id !== id));
              if (selectedFieldId === id) setSelectedFieldId(fields.find((field) => field.id !== id)?.id ?? 0);
            }}
            onSave={() => void saveForm(false)}
            onPublish={() => void saveForm(true)}
            onUpdateField={updateField}
          />
        )}
        {section === "submissions" && <SubmissionsSection status={reviewStatus} onStatusChange={setReviewStatus} submissions={filteredSubmissions} />}
        {section === "reports" && <ReportsSection reports={reports} />}
      </div>
    </div>
  );
}

function OverviewSection({ project }: { project: typeof defaultProject }) {
  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px] 2xl:grid-cols-[minmax(0,1fr)_380px]">
      <section className="rounded-lg border border-gray-700 bg-gray-800 p-6">
        <h2 className="text-lg font-semibold text-white">Project overview</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5">
          <Metric label="Status" value={project.status} icon={<CheckCircle2 />} />
          <Metric label="Completion" value={`${project.completion}%`} icon={<Gauge />} />
          <Metric label="Districts" value={project.districts} icon={<Users />} />
          <Metric label="Submissions" value={project.submissions} icon={<ClipboardCheck />} />
          <Metric label="Budget" value={formatCurrency(project.budget)} icon={<Calculator />} />
        </div>
        <div className="mt-6 rounded-lg border border-gray-700 bg-gray-900/45 p-5">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Implementation progress</span>
            <span className="font-semibold text-white">{project.completion}%</span>
          </div>
          <div className="mt-3 h-3 rounded-full bg-gray-700">
            <div className="h-3 rounded-full bg-blue-500" style={{ width: `${project.completion}%` }} />
          </div>
        </div>
      </section>
      <section className="rounded-lg border border-gray-700 bg-gray-800 p-5">
        <h2 className="text-base font-semibold text-white">Upcoming work</h2>
        <div className="mt-4 space-y-3">
          {["Publish revised field form", "Review 12 pending submissions", "Generate donor brief", "Recompute indicator summary"].map((item) => (
            <div key={item} className="flex items-center gap-2 rounded-lg border border-gray-700 bg-gray-900/45 px-3 py-2.5 text-xs font-medium leading-5 text-gray-300">
              <CalendarDays className="h-3.5 w-3.5 shrink-0 text-blue-300" />
              {item}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function OutcomesSection({ outcomes }: { outcomes: Array<[string, string, number, number]> }) {
  return (
    <SectionCard title="Project outcomes" actionHref={OBJECTIVES} actionLabel="Open outcomes">
      <table className="w-full table-fixed text-sm">
        <thead className="text-left text-xs uppercase tracking-wide text-gray-500">
          <tr><th className="w-[42%] p-3">Outcome</th><th className="p-3">Status</th><th className="p-3">Indicators</th><th className="p-3">Progress</th></tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {outcomes.map(([name, status, count, progress]) => (
            <tr key={name} className="text-gray-300"><td className="p-3 font-semibold text-white">{name}</td><td className="p-3">{status}</td><td className="p-3">{count}</td><td className="p-3">{progress}%</td></tr>
          ))}
        </tbody>
      </table>
    </SectionCard>
  );
}

function IndicatorsSection({
  indicators,
  rules,
  selectedRule,
  selectedRuleId,
  onCreateRule,
  onRuleSelect,
  onSaveRule,
  onTestRule,
  onUpdateRule,
}: {
  indicators: Array<[string, string, string, string]>;
  rules: ComputationRule[];
  selectedRule?: ComputationRule;
  selectedRuleId: number;
  onCreateRule: () => void;
  onRuleSelect: (id: number) => void;
  onSaveRule: (rule: ComputationRule) => void;
  onTestRule: (rule: ComputationRule) => void;
  onUpdateRule: (id: number, patch: Partial<ComputationRule>) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Metric label="Indicators" value={indicators.length} icon={<BarChart3 />} />
        <Metric label="Rules" value={rules.length} icon={<Calculator />} />
        <Metric label="Mapped" value={rules.filter((rule) => rule.sourceField).length} icon={<LinkIcon />} />
        <Metric label="Last run" value="Today" icon={<PlayCircle />} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
        <section className="rounded-lg border border-gray-700 bg-gray-800 p-5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-white">
              <BarChart3 className="h-5 w-5 text-blue-300" />
              <h2 className="text-lg font-semibold">Indicator rules</h2>
            </div>
            <button onClick={onCreateRule} className="rounded-lg bg-blue-600 p-2 text-white transition hover:bg-blue-700" aria-label="Create computation rule">
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-4 space-y-3">
            {indicators.map(([name, current, target, status]) => {
              const rule = rules.find((item) => item.indicator === name);
              const active = rule?.id === selectedRuleId;
              return (
                <button
                  key={name}
                  onClick={() => rule && onRuleSelect(rule.id)}
                  className={`w-full rounded-xl border p-4 text-left transition ${
                    active ? "border-blue-500 bg-blue-500/10" : "border-gray-700 bg-gray-900/45 hover:border-gray-600"
                  } ${!rule ? "opacity-70" : ""}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold leading-5 text-white">{name}</p>
                      <p className="mt-2 text-xs text-gray-400">Current {current} / Target {target}</p>
                    </div>
                    <span className="rounded-full bg-gray-700 px-2 py-1 text-xs font-semibold text-gray-300">{status}</span>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs">
                    <span className={rule ? "text-blue-300" : "text-amber-300"}>{rule ? rule.method : "No rule configured"}</span>
                    <span className="text-gray-500">{rule ? `${rule.submissionsUsed} submissions` : "Needs setup"}</span>
                  </div>
                </button>
              );
            })}
          </div>
          <Link to={INDICATORS} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-blue-300 transition hover:text-blue-200">
            <LinkIcon className="h-4 w-4" />
            Open indicator register
          </Link>
        </section>

        {selectedRule ? (
          <ComputationBuilder
            indicators={indicators}
            rule={selectedRule}
            onSave={() => onSaveRule(selectedRule)}
            onTest={() => onTestRule(selectedRule)}
            onUpdate={(patch) => onUpdateRule(selectedRule.id, patch)}
          />
        ) : (
          <EmptyState title="No computation rule selected" message="Create or select a rule to define how an indicator should be calculated from submitted form data." actionLabel="Create rule" onAction={onCreateRule} />
        )}
      </div>
    </div>
  );
}

function ComputationBuilder({
  indicators,
  rule,
  onSave,
  onTest,
  onUpdate,
}: {
  indicators: Array<[string, string, string, string]>;
  rule: ComputationRule;
  onSave: () => void;
  onTest: () => void;
  onUpdate: (patch: Partial<ComputationRule>) => void;
}) {
  const formulaSummary = buildFormulaSummary(rule);
  const usesFormula = rule.method === "Custom formula";
  const usesRatio = rule.method === "Ratio" || rule.method === "Percentage";

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
      <section className="rounded-lg border border-gray-700 bg-gray-800">
        <div className="border-b border-gray-700 p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-white">
                <Calculator className="h-5 w-5 text-blue-300" />
                <h2 className="text-lg font-semibold">Computation builder</h2>
              </div>
              <p className="mt-1 text-sm text-gray-400">Define how approved submissions become the indicator value.</p>
            </div>
            <div className="flex gap-2">
              <button onClick={onSave} className="inline-flex items-center gap-2 rounded-lg border border-gray-600 px-3 py-2 text-sm font-semibold text-gray-200 transition hover:bg-gray-700">
                <Save className="h-4 w-4" />
                Save rule
              </button>
              <button onClick={onTest} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-700">
                <PlayCircle className="h-4 w-4" />
                Test rule
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6 p-5">
          <div className="grid gap-4 lg:grid-cols-2">
            <label className="block lg:col-span-2">
              <span className="mb-2 block text-sm font-semibold text-gray-300">Indicator</span>
              <select value={rule.indicator} onChange={(event) => onUpdate({ indicator: event.target.value })} className="input-dark h-11">
                {indicators.map(([name]) => <option key={name}>{name}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-gray-300">Compute using</span>
              <select value={rule.method} onChange={(event) => onUpdate({ method: event.target.value as AggregationMethod })} className="input-dark h-11">
                {["Sum", "Average", "Count", "Min", "Max", "Percentage", "Ratio", "Custom formula"].map((method) => <option key={method}>{method}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-gray-300">Source form</span>
              <select value={rule.sourceForm} onChange={(event) => onUpdate({ sourceForm: event.target.value })} className="input-dark h-11">
                {sourceForms.map((form) => <option key={form}>{form}</option>)}
              </select>
            </label>
          </div>

          {!usesFormula && (
            <div className="grid gap-4 lg:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-gray-300">{usesRatio ? "Numerator field" : "Source field"}</span>
                <select value={usesRatio ? rule.numeratorField : rule.sourceField} onChange={(event) => onUpdate(usesRatio ? { numeratorField: event.target.value } : { sourceField: event.target.value })} className="input-dark h-11">
                  {sourceFields.map((field) => <option key={field}>{field}</option>)}
                </select>
              </label>
              {usesRatio ? (
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-gray-300">Denominator field</span>
                  <select value={rule.denominatorField} onChange={(event) => onUpdate({ denominatorField: event.target.value })} className="input-dark h-11">
                    {sourceFields.map((field) => <option key={field}>{field}</option>)}
                  </select>
                </label>
              ) : (
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-gray-300">Group result by</span>
                  <select value={rule.groupBy} onChange={(event) => onUpdate({ groupBy: event.target.value })} className="input-dark h-11">
                    {groupingOptions.map((group) => <option key={group}>{group}</option>)}
                  </select>
                </label>
              )}
            </div>
          )}

          {usesRatio && (
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-gray-300">Group result by</span>
              <select value={rule.groupBy} onChange={(event) => onUpdate({ groupBy: event.target.value })} className="input-dark h-11">
                {groupingOptions.map((group) => <option key={group}>{group}</option>)}
              </select>
            </label>
          )}

          <div className="grid gap-4 lg:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-gray-300">Include records</span>
              <select value={rule.filters} onChange={(event) => onUpdate({ filters: event.target.value })} className="input-dark h-11">
                {filterOptions.map((filter) => <option key={filter}>{filter}</option>)}
              </select>
            </label>
            <div className="rounded-lg border border-gray-700 bg-gray-900/45 p-4">
              <p className="text-sm font-semibold text-gray-300">Validation</p>
              <p className="mt-2 text-xs leading-5 text-gray-400">{validationMessage(rule)}</p>
            </div>
          </div>

          <label className="block">
            <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-300">
              <FunctionSquare className="h-4 w-4 text-blue-300" />
              Custom formula
            </span>
            <textarea
              value={rule.formula}
              onChange={(event) => onUpdate({ formula: event.target.value })}
              className="input-dark min-h-28 resize-none font-mono text-sm"
              placeholder="Example: (sum(female_beneficiaries) / sum(total_beneficiaries)) * 100"
            />
            <span className="mt-2 block text-xs leading-5 text-gray-500">Use field tokens such as sum(jobs_created), avg(productivity_score), count(submissions), or ratios.</span>
          </label>
        </div>
      </section>

      <aside className="space-y-6">
        <section className="rounded-lg border border-gray-700 bg-gray-800 p-5">
          <div className="flex items-center gap-2 text-white">
            <Eye className="h-5 w-5 text-blue-300" />
            <h2 className="text-lg font-semibold">Rule preview</h2>
          </div>
          <div className="mt-5 rounded-xl border border-blue-500/30 bg-blue-500/10 p-4">
            <p className="text-sm text-blue-100">Computed value</p>
            <p className="mt-2 text-3xl font-bold text-white">{rule.previewValue}</p>
            <p className="mt-2 text-xs text-blue-100/80">Based on {rule.submissionsUsed.toLocaleString()} submissions</p>
          </div>
          <div className="mt-4 space-y-3 text-sm">
            <PreviewLine label="Formula" value={formulaSummary} />
            <PreviewLine label="Source" value={rule.sourceForm} />
            <PreviewLine label="Filter" value={rule.filters} />
            <PreviewLine label="Group by" value={rule.groupBy} />
            <PreviewLine label="Last computed" value={rule.lastComputed} />
          </div>
        </section>

        <section className="rounded-lg border border-gray-700 bg-gray-800 p-5">
          <h2 className="text-lg font-semibold text-white">Formula tokens</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {["sum()", "avg()", "count()", "min()", "max()", "if()", "approved_only"].map((token) => (
              <button key={token} className="rounded-lg border border-gray-700 bg-gray-900/45 px-3 py-2 font-mono text-xs text-gray-300 transition hover:border-blue-500 hover:text-blue-200">
                {token}
              </button>
            ))}
          </div>
          <p className="mt-4 text-xs leading-5 text-gray-500">Tokens are visual affordances for now; backend validation will parse and execute formulas safely.</p>
        </section>

        <section className="rounded-lg border border-gray-700 bg-gray-800 p-5">
          <div className="flex items-center gap-2 text-white">
            <History className="h-5 w-5 text-emerald-300" />
            <h2 className="text-lg font-semibold">Recompute history</h2>
          </div>
          <div className="mt-4 space-y-3">
            {computationRuns.map(([time, submissions, status]) => (
              <div key={time} className="rounded-lg border border-gray-700 bg-gray-900/45 p-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-white">{status}</p>
                  <span className={`rounded-full px-2 py-1 text-xs font-semibold ${status === "Success" ? "bg-emerald-500/10 text-emerald-200" : "bg-amber-500/10 text-amber-200"}`}>{submissions}</span>
                </div>
                <p className="mt-1 text-xs text-gray-500">{time}</p>
              </div>
            ))}
          </div>
        </section>
      </aside>
    </div>
  );
}

function PreviewLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-gray-700 bg-gray-900/45 p-3">
      <p className="text-xs uppercase tracking-wide text-gray-500">{label}</p>
      <p className="mt-1 break-words text-gray-200">{value}</p>
    </div>
  );
}

function buildFormulaSummary(rule: ComputationRule) {
  if (rule.method === "Custom formula") return rule.formula || "No custom formula yet";
  if (rule.method === "Percentage") return `(sum(${tokenize(rule.numeratorField)}) / sum(${tokenize(rule.denominatorField)})) * 100`;
  if (rule.method === "Ratio") return `sum(${tokenize(rule.numeratorField)}) / sum(${tokenize(rule.denominatorField)})`;
  return `${rule.method.toLowerCase()}(${tokenize(rule.sourceField)})`;
}

function validationMessage(rule: ComputationRule) {
  const textLikeFields = ["District", "Facility name", "Evidence photo"];
  const field = rule.method === "Ratio" || rule.method === "Percentage" ? rule.numeratorField : rule.sourceField;
  if (rule.method !== "Count" && textLikeFields.includes(field)) {
    return "This field may not be numeric. Choose a numeric field or use Count for non-numeric submissions.";
  }
  if (rule.method === "Custom formula" && !rule.formula.trim()) {
    return "Enter a formula before publishing this computation rule.";
  }
  return "Rule looks valid for approved submission data.";
}

function tokenize(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
}

function FormsSection({
  indicators,
  fields,
  formMeta,
  notice,
  saving,
  selectedField,
  selectedFieldId,
  onAdd,
  onDuplicate,
  onFieldSelect,
  onMetaChange,
  onMove,
  onRemove,
  onSave,
  onPublish,
  onUpdateField,
}: {
  indicators: Array<[string, string, string, string]>;
  fields: FormField[];
  formMeta: { title: string; version: string; instructions: string };
  notice: string;
  saving: boolean;
  selectedField?: FormField;
  selectedFieldId: number;
  onAdd: (type: FieldType) => void;
  onDuplicate: (field: FormField) => void;
  onFieldSelect: (id: number) => void;
  onMetaChange: (meta: { title: string; version: string; instructions: string }) => void;
  onMove: (id: number, direction: -1 | 1) => void;
  onRemove: (id: number) => void;
  onSave: () => void;
  onPublish: () => void;
  onUpdateField: (id: number, patch: Partial<FormField>) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Metric label="Fields" value={fields.length} icon={<FormInput />} />
        <Metric label="Required" value={fields.filter((field) => field.required).length} icon={<CheckCircle2 />} />
        <Metric label="Mapped" value={fields.filter((field) => field.indicator).length} icon={<LinkIcon />} />
        <Metric label="Status" value="Draft" icon={<Pencil />} />
      </div>

      <section className="rounded-lg border border-gray-700 bg-gray-800 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-white">
            <History className="h-5 w-5 text-blue-300" />
            <h2 className="text-lg font-semibold">Form versions</h2>
          </div>
          <button onClick={onPublish} disabled={saving} className="inline-flex items-center gap-2 rounded-lg border border-gray-600 px-3 py-2 text-sm font-semibold text-gray-200 transition hover:bg-gray-700 disabled:opacity-50">
            <UploadCloud className="h-4 w-4" />
            {saving ? "Saving..." : "Publish draft"}
          </button>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {formVersions.map(([version, status, author, date]) => (
            <div key={version} className="rounded-lg border border-gray-700 bg-gray-900/45 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="font-semibold text-white">{version}</p>
                <span className={`rounded-full px-2 py-1 text-xs font-semibold ${status === "Published" ? "bg-emerald-500/10 text-emerald-200" : status === "Current draft" ? "bg-blue-500/10 text-blue-200" : "bg-gray-700 text-gray-300"}`}>{status}</span>
              </div>
              <p className="mt-2 text-sm text-gray-400">{author}</p>
              <p className="mt-1 text-xs text-gray-500">{date}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[220px_minmax(0,1fr)_300px] 2xl:grid-cols-[260px_minmax(0,1fr)_340px]">
        <section className="rounded-lg border border-gray-700 bg-gray-800 p-5">
          <div className="flex items-center gap-2 text-white">
            <Plus className="h-5 w-5 text-blue-300" />
            <h2 className="text-lg font-semibold">Field palette</h2>
          </div>
          <div className="mt-4 space-y-2">
            {fieldPalette.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.type}
                  onClick={() => onAdd(item.type)}
                  className="flex w-full items-start gap-3 rounded-lg border border-gray-700 bg-gray-900/45 p-3 text-left transition hover:border-blue-500/50 hover:bg-blue-500/10"
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-blue-500/10 text-blue-300">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-white">{item.label}</span>
                    <span className="mt-1 block text-xs leading-5 text-gray-400">{item.description}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="rounded-lg border border-gray-700 bg-gray-800">
          <div className="border-b border-gray-700 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-white">Form canvas</h2>
                <p className="mt-1 text-sm text-gray-400">Arrange the questions field agents will complete on tablets.</p>
              </div>
              <div className="flex gap-2">
                <button className="inline-flex items-center gap-2 rounded-lg border border-gray-600 px-3 py-2 text-sm font-semibold text-gray-200 transition hover:bg-gray-700">
                  <Eye className="h-4 w-4" />
                  Preview
                </button>
                <button onClick={onSave} disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50">
                  <Save className="h-4 w-4" />
                  {saving ? "Saving..." : "Save draft"}
                </button>
              </div>
            </div>
            {notice && <p className="mt-3 text-sm text-blue-200">{notice}</p>}
            <div className="mt-5 grid gap-4 md:grid-cols-[1fr_160px]">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-gray-300">Form title</span>
                <input value={formMeta.title} onChange={(event) => onMetaChange({ ...formMeta, title: event.target.value })} className="input-dark h-11" />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-gray-300">Version</span>
                <input value={formMeta.version} onChange={(event) => onMetaChange({ ...formMeta, version: event.target.value })} className="input-dark h-11" />
              </label>
            </div>
            <label className="mt-4 block">
              <span className="mb-2 block text-sm font-semibold text-gray-300">Instructions</span>
              <textarea value={formMeta.instructions} onChange={(event) => onMetaChange({ ...formMeta, instructions: event.target.value })} className="input-dark min-h-20 resize-none" />
            </label>
          </div>

          <div className="p-5">
            <div className="space-y-3">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  onClick={() => onFieldSelect(field.id)}
                  className={`rounded-xl border p-4 transition ${
                    selectedFieldId === field.id ? "border-blue-500 bg-blue-500/10" : "border-gray-700 bg-gray-900/45 hover:border-gray-600"
                  }`}
                >
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex min-w-0 gap-3">
                      <button className="mt-1 cursor-grab text-gray-500" aria-label={`Reorder ${field.label}`}>
                        <GripVertical className="h-4 w-4" />
                      </button>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="break-words font-semibold text-white">{index + 1}. {field.label}</p>
                          {field.required && <span className="rounded-full bg-red-500/10 px-2 py-0.5 text-xs font-semibold text-red-200">Required</span>}
                          <span className="rounded-full bg-gray-700 px-2 py-0.5 text-xs font-semibold text-gray-300">{field.type}</span>
                        </div>
                        <p className="mt-1 text-sm text-gray-400">{field.helperText || "No helper text yet."}</p>
                        {field.indicator && <p className="mt-2 text-xs text-blue-300">Mapped to {field.indicator}</p>}
                      </div>
                    </div>
                    <div onClick={(event) => event.stopPropagation()} className="flex shrink-0 justify-end">
                      <ActionMenu
                        label={`Actions for ${field.label}`}
                        items={[
                          { label: "Move up", icon: <GripVertical />, onClick: () => onMove(field.id, -1) },
                          { label: "Move down", icon: <GripVertical />, onClick: () => onMove(field.id, 1) },
                          { label: "Duplicate field", icon: <Copy />, onClick: () => onDuplicate(field) },
                          { label: "Remove field", icon: <Trash2 />, tone: "danger", onClick: () => onRemove(field.id) },
                        ]}
                      />
                    </div>
                  </div>
                </div>
              ))}
              {fields.length === 0 && <EmptyState title="No fields yet" message="Choose a field type from the palette to build this collection form." />}
            </div>
          </div>
        </section>

        <div className="space-y-6">
          <FieldSettings indicators={indicators} field={selectedField} onUpdate={(patch) => selectedField && onUpdateField(selectedField.id, patch)} />
          <TabletPreview fields={fields} formMeta={formMeta} />
        </div>
      </div>
    </div>
  );
}

function FieldSettings({ indicators, field, onUpdate }: { indicators: Array<[string, string, string, string]>; field?: FormField; onUpdate: (patch: Partial<FormField>) => void }) {
  if (!field) {
    return (
      <section className="rounded-lg border border-gray-700 bg-gray-800 p-5">
        <EmptyState title="No field selected" message="Select a field on the canvas to edit its settings." />
      </section>
    );
  }

  const supportsOptions = field.type === "Select" || field.type === "Radio";
  return (
    <section className="rounded-lg border border-gray-700 bg-gray-800 p-5">
      <div className="flex items-center gap-2 text-white">
        <Pencil className="h-5 w-5 text-blue-300" />
        <h2 className="text-lg font-semibold">Field settings</h2>
      </div>
      <div className="mt-5 space-y-4">
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-gray-300">Label</span>
          <input value={field.label} onChange={(event) => onUpdate({ label: event.target.value })} className="input-dark h-11" />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-gray-300">Type</span>
          <select value={field.type} onChange={(event) => onUpdate({ type: event.target.value as FieldType })} className="input-dark h-11">
            {fieldPalette.map((item) => <option key={item.type}>{item.type}</option>)}
          </select>
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-gray-300">Indicator mapping</span>
          <select value={field.indicator} onChange={(event) => onUpdate({ indicator: event.target.value })} className="input-dark h-11">
            <option value="">No indicator mapping</option>
            {indicators.map(([name]) => <option key={name} value={name}>{name}</option>)}
          </select>
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-gray-300">Helper text</span>
          <textarea value={field.helperText} onChange={(event) => onUpdate({ helperText: event.target.value })} className="input-dark min-h-20 resize-none" />
        </label>
        {supportsOptions && (
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-gray-300">Options</span>
            <textarea
              value={field.options.join("\n")}
              onChange={(event) => onUpdate({ options: event.target.value.split("\n").filter(Boolean) })}
              className="input-dark min-h-24 resize-none"
              placeholder="One option per line"
            />
          </label>
        )}
        <label className="flex items-center justify-between gap-3 rounded-lg border border-gray-700 bg-gray-900/45 p-4">
          <span>
            <span className="block text-sm font-semibold text-white">Required field</span>
            <span className="mt-1 block text-xs text-gray-400">Agents cannot submit without this value.</span>
          </span>
          <input type="checkbox" checked={field.required} onChange={(event) => onUpdate({ required: event.target.checked })} className="h-4 w-4" />
        </label>
      </div>
    </section>
  );
}

function TabletPreview({ fields, formMeta }: { fields: FormField[]; formMeta: { title: string; version: string; instructions: string } }) {
  return (
    <section className="rounded-lg border border-gray-700 bg-gray-800 p-5">
      <div className="flex items-center gap-2 text-white">
        <Smartphone className="h-5 w-5 text-blue-300" />
        <h2 className="text-lg font-semibold">Tablet preview</h2>
      </div>
      <div className="mt-5 rounded-[1.75rem] border border-gray-700 bg-gray-950 p-3">
        <div className="rounded-[1.25rem] border border-gray-800 bg-gray-900 p-4">
          <div className="border-b border-gray-800 pb-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-300">{formMeta.version}</p>
            <h3 className="mt-1 text-lg font-semibold text-white">{formMeta.title}</h3>
            <p className="mt-2 text-xs leading-5 text-gray-400">{formMeta.instructions}</p>
          </div>
          <div className="mt-4 space-y-4">
            {fields.map((field) => (
              <label key={field.id} className="block">
                <span className="mb-2 block text-sm font-semibold text-gray-200">{field.label}{field.required && " *"}</span>
                {renderPreviewControl(field)}
                {field.helperText && <span className="mt-1 block text-xs leading-5 text-gray-500">{field.helperText}</span>}
              </label>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function renderPreviewControl(field: FormField) {
  const common = "rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-sm text-gray-500";
  if (field.type === "Photo") return <div className={`${common} flex items-center gap-2`}><Image className="h-4 w-4" />Tap to capture photo</div>;
  if (field.type === "GPS") return <div className={`${common} flex items-center gap-2`}><MapPinned className="h-4 w-4" />Capture GPS location</div>;
  if (field.type === "Select") return <div className={common}>{field.options[0] ?? "Select an option"}</div>;
  if (field.type === "Radio") {
    return (
      <div className="space-y-2">
        {(field.options.length ? field.options : ["Option one", "Option two"]).map((option) => (
          <div key={option} className="flex items-center gap-2 rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-sm text-gray-400">
            <span className="h-3 w-3 rounded-full border border-gray-500" />
            {option}
          </div>
        ))}
      </div>
    );
  }
  if (field.type === "Checkbox") return <div className={`${common} flex items-center gap-2`}><span className="h-4 w-4 rounded border border-gray-500" />Confirm value</div>;
  return <div className={common}>{field.type === "Date" ? "dd/mm/yyyy" : `Enter ${field.label.toLowerCase()}`}</div>;
}

function SubmissionsSection({ status, onStatusChange, submissions }: { status: SubmissionStatus | "All"; onStatusChange: (value: SubmissionStatus | "All") => void; submissions: Array<[string, string, string, string, SubmissionStatus]> }) {
  const [selectedSubmission, setSelectedSubmission] = useState<Array<[string, string, string, string, SubmissionStatus]>[number] | null>(null);

  return (
    <>
      <SectionCard title="Submission review queue">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <select value={status} onChange={(event) => onStatusChange(event.target.value as SubmissionStatus | "All")} className="input-dark h-11 max-w-xs">
            {["All", "Approved", "Needs Review", "Rejected"].map((item) => <option key={item}>{item}</option>)}
          </select>
          <button className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700">
            <Send className="h-4 w-4" />
            Approve selected
          </button>
        </div>
        <table className="w-full table-fixed text-sm">
          <thead className="text-left text-xs uppercase tracking-wide text-gray-500">
            <tr><th className="p-3">Submission</th><th className="p-3">Site</th><th className="p-3">Agent</th><th className="p-3">Date</th><th className="p-3">Status</th><th className="w-[72px] p-3">View</th></tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {submissions.map((submission) => {
              const [id, site, agent, date, currentStatus] = submission;
              return (
                <tr key={id} className="text-gray-300">
                  <td className="p-3 font-semibold text-white">{id}</td>
                  <td className="p-3">{site}</td>
                  <td className="p-3">{agent}</td>
                  <td className="p-3">{date}</td>
                  <td className="p-3">{currentStatus}</td>
                  <td className="p-3">
                    <ActionMenu
                      label={`Actions for ${id}`}
                      items={[
                        { label: "Review submission", icon: <Eye />, onClick: () => setSelectedSubmission(submission) },
                      ]}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {submissions.length === 0 && <EmptyState title="No submissions found" message="Try another review status or wait for field agents to submit assigned forms." />}
      </SectionCard>

      {selectedSubmission && (
        <div onClick={() => setSelectedSubmission(null)} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div onClick={(event) => event.stopPropagation()} className="w-full max-w-3xl overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 text-white shadow-2xl shadow-black/40">
            <div className="flex items-start justify-between border-b border-slate-700 px-6 py-5">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight">{selectedSubmission[0]}</h2>
                <p className="mt-1 text-sm text-slate-400">{selectedSubmission[1]} submitted by {selectedSubmission[2]} on {selectedSubmission[3]}.</p>
              </div>
              <button onClick={() => setSelectedSubmission(null)} className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white" aria-label="Close submission review">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="grid gap-5 px-6 py-6 lg:grid-cols-[1fr_260px]">
              <div className="space-y-3">
                {[
                  ["District", "Tamale"],
                  ["Facility name", selectedSubmission[1]],
                  ["Manufacturing jobs created", "42"],
                  ["GPS coordinates", "9.4075, -0.8533"],
                  ["Enumerator note", "Evidence checked with site supervisor before submission."],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-lg border border-slate-700 bg-slate-800/60 p-4">
                    <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
                    <p className="mt-1 text-sm font-semibold text-white">{value}</p>
                  </div>
                ))}
              </div>
              <aside className="space-y-3">
                <div className="rounded-lg border border-slate-700 bg-slate-800/60 p-4">
                  <p className="text-sm font-semibold text-white">Review status</p>
                  <span className="mt-3 inline-flex rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-200">{selectedSubmission[4]}</span>
                </div>
                <div className="rounded-lg border border-slate-700 bg-slate-800/60 p-4">
                  <p className="text-sm font-semibold text-white">Quality checks</p>
                  <ul className="mt-3 space-y-2 text-sm text-slate-300">
                    <li>Required fields complete</li>
                    <li>GPS captured</li>
                    <li>Photo evidence attached</li>
                    <li>Value within expected range</li>
                  </ul>
                </div>
              </aside>
            </div>
            <div className="flex justify-end gap-3 border-t border-slate-700 bg-slate-950/45 px-6 py-5">
              <button className="rounded-xl border border-red-500/40 px-5 py-2.5 text-sm font-semibold text-red-200 transition hover:bg-red-500/10">Reject</button>
              <button className="rounded-xl border border-slate-600 px-5 py-2.5 text-sm font-semibold text-slate-200 transition hover:bg-slate-800">Flag for Review</button>
              <button className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500">Approve</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function ReportsSection({ reports }: { reports: Array<[string, string, string]> }) {
  return (
    <SectionCard title="Project reports" actionHref={REPORTS} actionLabel="Reporting center">
      <div className="grid gap-4 md:grid-cols-3">
        {reports.map(([name, type, status]) => (
          <div key={name} className="rounded-lg border border-gray-700 bg-gray-900/45 p-4">
            <FileText className="h-5 w-5 text-blue-300" />
            <h3 className="mt-3 font-semibold text-white">{name}</h3>
            <p className="mt-1 text-sm text-gray-400">{type}</p>
            <div className="mt-4 flex items-center justify-between">
              <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-200">{status}</span>
              <Download className="h-4 w-4 text-gray-400" />
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

function SectionCard({ title, children, actionHref, actionLabel, onAction }: { title: string; children: React.ReactNode; actionHref?: string; actionLabel?: string; onAction?: () => void }) {
  return (
    <section className="rounded-lg border border-gray-700 bg-gray-800 p-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        {actionHref && actionLabel && (
          <Link to={actionHref} className="inline-flex items-center gap-2 rounded-lg border border-gray-600 px-3 py-2 text-sm font-semibold text-gray-200 transition hover:bg-gray-700">
            <LinkIcon className="h-4 w-4" />
            {actionLabel}
          </Link>
        )}
        {onAction && actionLabel && (
          <button onClick={onAction} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-700">
            <Plus className="h-4 w-4" />
            {actionLabel}
          </button>
        )}
      </div>
      {children}
    </section>
  );
}

function Metric({ label, value, icon }: { label: string; value: string | number; icon: React.ReactNode }) {
  return (
    <div className="min-w-0 rounded-lg border border-gray-700 bg-gray-900/45 p-4">
      <div className="flex items-center justify-between text-gray-400">
        <span className="text-sm">{label}</span>
        <span className="text-blue-300 [&_svg]:h-5 [&_svg]:w-5">{icon}</span>
      </div>
      <p className="mt-3 break-words text-xl font-semibold text-white 2xl:text-2xl">{value}</p>
    </div>
  );
}

function getSection(pathname: string): Section {
  const last = pathname.split("/").filter(Boolean).at(-1);
  return last && ["outcomes", "indicators", "forms", "submissions", "reports"].includes(last) ? (last as Section) : "overview";
}

function metricProgress(baseline: number, target: number, actual: number) {
  const range = Number(target) - Number(baseline);
  if (range === 0) return Number(actual) >= Number(target) ? 100 : 0;
  return Math.max(0, Math.min(100, ((Number(actual) - Number(baseline)) / range) * 100));
}

function titleCase(value: string) {
  return value.replaceAll("_", " ").replace(/\b\w/g, (character) => character.toUpperCase());
}

function fieldLabel(key: string | null) {
  if (!key) return "";
  return sourceFields.find((field) => tokenize(field) === key) ?? titleCase(key);
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en", { notation: "compact", style: "currency", currency: "GHS", maximumFractionDigits: 2 }).format(value);
}
