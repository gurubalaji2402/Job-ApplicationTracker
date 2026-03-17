import { Link, useLocation } from "wouter";
import { LayoutDashboard, Briefcase, Settings, Target } from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Applications", href: "/applications", icon: Briefcase },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const [location] = useLocation();

  return (
    <div className="flex flex-col w-64 bg-card border-r border-border min-h-screen sticky top-0 hidden md:flex">
      <div className="p-6 flex items-center gap-3 border-b border-border/50">
        <div className="bg-gradient-to-tr from-primary to-primary/80 text-white p-2 rounded-xl shadow-lg shadow-primary/20">
          <Target className="w-6 h-6" />
        </div>
        <span className="font-display font-bold text-xl tracking-tight text-foreground">
          Trackr
        </span>
      </div>
      
      <nav className="flex-1 p-4 space-y-1.5">
        {navigation.map((item) => {
          const isActive = location === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group font-medium",
                isActive 
                  ? "bg-primary/10 text-primary" 
                  : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
              )}
            >
              <item.icon className={cn(
                "w-5 h-5 transition-transform duration-200", 
                isActive ? "scale-110" : "group-hover:scale-110"
              )} />
              {item.name}
            </Link>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-border/50">
        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-4 border border-indigo-100/50">
          <p className="text-sm font-semibold text-indigo-900 mb-1">Pro Tip</p>
          <p className="text-xs text-indigo-700/80 leading-relaxed">
            Follow up on applications after 7 days to increase interview chances.
          </p>
        </div>
      </div>
    </div>
  );
}

export function MobileNav() {
  const [location] = useLocation();
  
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border flex justify-around p-2 pb-safe z-40">
      {navigation.slice(0, 2).map((item) => {
        const isActive = location === item.href;
        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex flex-col items-center p-2 rounded-lg transition-colors",
              isActive ? "text-primary" : "text-muted-foreground"
            )}
          >
            <item.icon className="w-6 h-6 mb-1" />
            <span className="text-[10px] font-medium">{item.name}</span>
          </Link>
        );
      })}
    </div>
  );
}
