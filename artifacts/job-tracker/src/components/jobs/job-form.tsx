import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { JobStatus, Job, useCreateJob, useUpdateJob, getListJobsQueryKey, getGetJobStatsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  company: z.string().min(1, "Company is required"),
  role: z.string().min(1, "Role is required"),
  status: z.nativeEnum(JobStatus),
  location: z.string().optional().nullable(),
  url: z.string().url("Must be a valid URL").optional().or(z.literal("")).nullable(),
  salary: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  appliedAt: z.string().optional().nullable(),
});

type FormValues = z.infer<typeof formSchema>;

interface JobFormProps {
  job?: Job;
  onSuccess: () => void;
}

export function JobForm({ job, onSuccess }: JobFormProps) {
  const queryClient = useQueryClient();
  const createMutation = useCreateJob();
  const updateMutation = useUpdateJob();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      company: job?.company || "",
      role: job?.role || "",
      status: job?.status || JobStatus.wishlist,
      location: job?.location || "",
      url: job?.url || "",
      salary: job?.salary || "",
      notes: job?.notes || "",
      appliedAt: job?.appliedAt ? format(new Date(job.appliedAt), 'yyyy-MM-dd') : "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      if (job) {
        await updateMutation.mutateAsync({ id: job.id, data });
      } else {
        await createMutation.mutateAsync({ data });
      }
      queryClient.invalidateQueries({ queryKey: getListJobsQueryKey() });
      queryClient.invalidateQueries({ queryKey: getGetJobStatsQueryKey() });
      onSuccess();
    } catch (error) {
      console.error("Failed to save job:", error);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground">Company <span className="text-destructive">*</span></label>
          <input 
            {...form.register("company")} 
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            placeholder="e.g. Acme Corp"
          />
          {form.formState.errors.company && <p className="text-sm text-destructive">{form.formState.errors.company.message}</p>}
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground">Role <span className="text-destructive">*</span></label>
          <input 
            {...form.register("role")} 
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            placeholder="e.g. Frontend Engineer"
          />
          {form.formState.errors.role && <p className="text-sm text-destructive">{form.formState.errors.role.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground">Status <span className="text-destructive">*</span></label>
          <select 
            {...form.register("status")}
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none"
          >
            {Object.entries(JobStatus).map(([key, value]) => (
              <option key={value} value={value}>{key.charAt(0).toUpperCase() + key.slice(1)}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground">Date Applied</label>
          <input 
            type="date"
            {...form.register("appliedAt")} 
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground">Location</label>
          <input 
            {...form.register("location")} 
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            placeholder="e.g. Remote, NY"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground">Salary Expectation</label>
          <input 
            {...form.register("salary")} 
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            placeholder="e.g. $120k - $140k"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-foreground">Job Posting URL</label>
        <input 
          {...form.register("url")} 
          className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          placeholder="https://..."
        />
        {form.formState.errors.url && <p className="text-sm text-destructive">{form.formState.errors.url.message}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-foreground">Notes</label>
        <textarea 
          {...form.register("notes")} 
          rows={3}
          className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
          placeholder="Interviewer names, thoughts, next steps..."
        />
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-border">
        <Button type="button" variant="outline" onClick={onSuccess}>Cancel</Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : job ? "Update Application" : "Add Application"}
        </Button>
      </div>
    </form>
  );
}
