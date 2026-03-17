import { useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { useListJobs, useDeleteJob, JobStatus, Job, getListJobsQueryKey, getGetJobStatsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, Search, Filter, Download, MoreHorizontal, Pencil, Trash2, MapPin, Building2, Calendar } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { StatusBadge } from "@/components/jobs/status-badge";
import { JobForm } from "@/components/jobs/job-form";
import { cn, formatCurrency } from "@/lib/utils";

export default function Applications() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<JobStatus | "">("");
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | undefined>();
  
  const [jobToDelete, setJobToDelete] = useState<Job | null>(null);
  const deleteMutation = useDeleteJob();

  // Use debounce in real world, but simple state is okay for direct inputs here if queries are fast
  const { data: jobs, isLoading } = useListJobs({ 
    search: search || undefined, 
    status: (statusFilter as JobStatus) || undefined 
  });

  const handleExport = async () => {
    try {
      const res = await fetch(`${import.meta.env.BASE_URL}api/jobs/export`.replace('//', '/'));
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `applications-${format(new Date(), 'yyyy-MM-dd')}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (e) {
      console.error("Export failed", e);
    }
  };

  const confirmDelete = async () => {
    if (!jobToDelete) return;
    try {
      await deleteMutation.mutateAsync({ id: jobToDelete.id });
      queryClient.invalidateQueries({ queryKey: getListJobsQueryKey() });
      queryClient.invalidateQueries({ queryKey: getGetJobStatsQueryKey() });
      setJobToDelete(null);
    } catch (e) {
      console.error("Delete failed", e);
    }
  };

  const openEdit = (job: Job) => {
    setEditingJob(job);
    setIsFormOpen(true);
  };

  const openCreate = () => {
    setEditingJob(undefined);
    setIsFormOpen(true);
  };

  return (
    <AppLayout>
      <div className="p-6 md:p-8 max-w-7xl mx-auto w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Header Area */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">Applications</h1>
            <p className="text-muted-foreground mt-1">Manage and track your job search progress.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={handleExport} className="gap-2">
              <Download className="w-4 h-4" />
              Export CSV
            </Button>
            <Button onClick={openCreate} className="gap-2">
              <Plus className="w-4 h-4" />
              Add Application
            </Button>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="bg-card p-4 rounded-2xl border border-border shadow-sm flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search company or role..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
            />
          </div>
          <div className="relative min-w-[200px]">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm appearance-none cursor-pointer"
            >
              <option value="">All Statuses</option>
              {Object.entries(JobStatus).map(([k, v]) => (
                <option key={v} value={v}>{k.charAt(0).toUpperCase() + k.slice(1)}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Table Area */}
        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-secondary/50 text-muted-foreground font-medium border-b border-border">
                <tr>
                  <th className="px-6 py-4">Company & Role</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Date Applied</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                      <div className="flex justify-center"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div></div>
                    </td>
                  </tr>
                ) : jobs?.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center">
                          <Search className="w-6 h-6 text-muted-foreground/60" />
                        </div>
                        <p>No applications found.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  jobs?.map((job) => (
                    <tr key={job.id} className="hover:bg-secondary/20 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-foreground flex items-center gap-2">
                            <Building2 className="w-3.5 h-3.5 text-muted-foreground" />
                            {job.company}
                          </span>
                          <span className="text-muted-foreground mt-0.5">{job.role}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={job.status} />
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {job.location ? (
                          <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />{job.location}</span>
                        ) : "—"}
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {job.appliedAt ? (
                          <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{format(new Date(job.appliedAt), "MMM d, yyyy")}</span>
                        ) : "—"}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => openEdit(job)}
                            className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => setJobToDelete(job)}
                            className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Forms & Dialogs */}
      <Modal 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)}
        title={editingJob ? "Edit Application" : "New Application"}
        description={editingJob ? "Update details for this role." : "Track a new job opportunity."}
      >
        <JobForm job={editingJob} onSuccess={() => setIsFormOpen(false)} />
      </Modal>

      <Modal
        isOpen={!!jobToDelete}
        onClose={() => setJobToDelete(null)}
        title="Delete Application"
        description="Are you sure? This action cannot be undone."
        className="max-w-md"
      >
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" onClick={() => setJobToDelete(null)}>Cancel</Button>
          <Button variant="destructive" onClick={confirmDelete} disabled={deleteMutation.isPending}>
            {deleteMutation.isPending ? "Deleting..." : "Yes, Delete"}
          </Button>
        </div>
      </Modal>

    </AppLayout>
  );
}
