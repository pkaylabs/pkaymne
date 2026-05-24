import { AlertCircle, Lock, Plus, RefreshCw } from "lucide-react";
import type React from "react";

export function LoadingState({ title = "Loading workspace", message = "Preparing the latest project data." }: { title?: string; message?: string }) {
  return (
    <div className="rounded-lg border border-gray-700 bg-gray-800 p-8 text-center">
      <RefreshCw className="mx-auto h-8 w-8 animate-spin text-blue-300" />
      <h3 className="mt-4 text-lg font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm text-gray-400">{message}</p>
    </div>
  );
}

export function EmptyState({
  title,
  message,
  actionLabel,
  onAction,
}: {
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="rounded-lg border border-dashed border-gray-600 bg-gray-800/60 p-8 text-center">
      <Plus className="mx-auto h-8 w-8 text-gray-500" />
      <h3 className="mt-4 text-lg font-semibold text-white">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-400">{message}</p>
      {actionLabel && onAction && (
        <button onClick={onAction} className="mt-5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700">
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export function ErrorState({ title = "Something went wrong", message, onRetry }: { title?: string; message: string; onRetry?: () => void }) {
  return (
    <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-6">
      <div className="flex gap-3">
        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-300" />
        <div>
          <h3 className="font-semibold text-red-100">{title}</h3>
          <p className="mt-1 text-sm leading-6 text-red-100/80">{message}</p>
          {onRetry && (
            <button onClick={onRetry} className="mt-4 rounded-lg border border-red-300/30 px-3 py-2 text-sm font-semibold text-red-100 transition hover:bg-red-500/10">
              Retry
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function PermissionState({
  title = "Permission required",
  message = "Your role can view this workspace, but you need elevated access to make changes.",
}: {
  title?: string;
  message?: string;
}) {
  return (
    <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-6">
      <div className="flex gap-3">
        <Lock className="mt-0.5 h-5 w-5 shrink-0 text-amber-200" />
        <div>
          <h3 className="font-semibold text-amber-100">{title}</h3>
          <p className="mt-1 text-sm leading-6 text-amber-100/80">{message}</p>
        </div>
      </div>
    </div>
  );
}

export function StateBand({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-4 lg:grid-cols-3">{children}</div>;
}
