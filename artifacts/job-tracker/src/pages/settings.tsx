import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";

export default function Settings() {
  return (
    <AppLayout>
      <div className="p-6 md:p-8 max-w-3xl space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your application preferences.</p>
        </div>

        <div className="bg-card rounded-2xl border border-border p-6 shadow-sm space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Appearance</h3>
            <p className="text-sm text-muted-foreground mb-4">Customize how Trackr looks on your device.</p>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="border-primary text-primary bg-primary/5">System</Button>
              <Button variant="outline" className="opacity-50 cursor-not-allowed">Light</Button>
              <Button variant="outline" className="opacity-50 cursor-not-allowed">Dark</Button>
            </div>
            <p className="text-xs text-muted-foreground mt-3">Theme selection is coming soon.</p>
          </div>
          
          <div className="pt-6 border-t border-border/50">
            <h3 className="text-lg font-semibold text-foreground">Data Export</h3>
            <p className="text-sm text-muted-foreground mb-4">Download all your data as a CSV file.</p>
            <Button variant="secondary">Go to Applications to Export</Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
