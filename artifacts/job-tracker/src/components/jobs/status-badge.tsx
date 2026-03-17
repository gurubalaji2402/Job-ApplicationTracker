import { cn } from "@/lib/utils";
import { JobStatus } from "@workspace/api-client-react";

const statusConfig: Record<string, { label: string, classes: string }> = {
  [JobStatus.wishlist]: { label: "Wishlist", classes: "bg-slate-100 text-slate-700 border-slate-200" },
  [JobStatus.applied]: { label: "Applied", classes: "bg-blue-100 text-blue-700 border-blue-200" },
  [JobStatus.interviewing]: { label: "Interviewing", classes: "bg-amber-100 text-amber-700 border-amber-200" },
  [JobStatus.offer]: { label: "Offer", classes: "bg-green-100 text-green-700 border-green-200" },
  [JobStatus.rejected]: { label: "Rejected", classes: "bg-red-100 text-red-700 border-red-200" },
  [JobStatus.withdrawn]: { label: "Withdrawn", classes: "bg-gray-100 text-gray-600 border-gray-200" },
};

export function StatusBadge({ status, className }: { status: string, className?: string }) {
  const config = statusConfig[status] || { label: status, classes: "bg-slate-100 text-slate-700" };
  
  return (
    <span className={cn(
      "px-2.5 py-1 rounded-full text-xs font-semibold border shadow-sm",
      config.classes,
      className
    )}>
      {config.label}
    </span>
  );
}
