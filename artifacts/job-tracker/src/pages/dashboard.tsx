import { AppLayout } from "@/components/layout/app-layout";
import { useGetJobStats, JobStatus } from "@workspace/api-client-react";
import { Briefcase, Activity, Target } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

const PIE_COLORS: Record<string, string> = {
  [JobStatus.wishlist]: "hsl(215 16% 47%)",
  [JobStatus.applied]: "hsl(221 83% 53%)",
  [JobStatus.interviewing]: "hsl(38 92% 50%)",
  [JobStatus.offer]: "hsl(142 71% 45%)",
  [JobStatus.rejected]: "hsl(0 84% 60%)",
  [JobStatus.withdrawn]: "hsl(215 20% 65%)",
};

export default function Dashboard() {
  const { data: stats, isLoading, error } = useGetJobStats();

  if (isLoading) {
    return (
      <AppLayout>
        <div className="p-8 flex items-center justify-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AppLayout>
    );
  }

  if (error || !stats) {
    return (
      <AppLayout>
        <div className="p-8 text-center text-destructive">Failed to load statistics.</div>
      </AppLayout>
    );
  }

  const activeAppsCount = stats.byStatus
    .filter(s => s.status === JobStatus.interviewing || s.status === JobStatus.offer)
    .reduce((sum, s) => sum + s.count, 0);

  const chartData = stats.byStatus.map(s => ({
    name: s.status.charAt(0).toUpperCase() + s.status.slice(1),
    count: s.count,
    fill: PIE_COLORS[s.status] || "#8884d8"
  }));

  return (
    <AppLayout>
      <div className="p-6 md:p-8 max-w-7xl mx-auto w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Here's your application pipeline at a glance.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-card p-6 rounded-2xl border border-border shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
            <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Applications</p>
              <p className="text-3xl font-bold text-foreground">{stats.total}</p>
            </div>
          </div>
          
          <div className="bg-card p-6 rounded-2xl border border-border shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
            <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Pipeline</p>
              <p className="text-3xl font-bold text-foreground">{activeAppsCount}</p>
            </div>
          </div>

          <div className="bg-card p-6 rounded-2xl border border-border shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
            <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Last 30 Days</p>
              <p className="text-3xl font-bold text-foreground">{stats.recentActivity}</p>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card p-6 rounded-2xl border border-border shadow-sm flex flex-col">
            <h3 className="text-lg font-semibold mb-6">Pipeline by Status</h3>
            <div className="flex-1 min-h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} allowDecimals={false} />
                  <Tooltip 
                    cursor={{ fill: 'hsl(var(--secondary))' }}
                    contentStyle={{ borderRadius: '12px', border: '1px solid hsl(var(--border))', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-card p-6 rounded-2xl border border-border shadow-sm flex flex-col">
            <h3 className="text-lg font-semibold mb-2">Distribution</h3>
            <div className="flex-1 min-h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData.filter(d => d.count > 0)}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={110}
                    paddingAngle={3}
                    dataKey="count"
                    stroke="none"
                  >
                    {chartData.filter(d => d.count > 0).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: '1px solid hsl(var(--border))', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
