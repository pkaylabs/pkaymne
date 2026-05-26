export function projectStatusFromApi(status: string) {
  const map: Record<string, "Active" | "Planning" | "Paused" | "Completed"> = {
    active: "Active",
    draft: "Planning",
    paused: "Paused",
    completed: "Completed",
  };
  return map[status] ?? "Planning";
}

export function projectStatusToApi(status: string) {
  const map: Record<string, string> = {
    Active: "active",
    Planning: "draft",
    Paused: "paused",
    Completed: "completed",
  };
  return map[status] ?? "draft";
}

export function moneyLabel(value: { amount: number; currency: string } | string | null | undefined) {
  if (!value) return "Custom";
  if (typeof value === "string") return value;
  if (!value.amount) return "Custom";
  return `${value.currency === "USD" ? "$" : value.currency + " "}${Number(value.amount).toLocaleString()}`;
}
