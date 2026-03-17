import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Dashboard from "./pages/dashboard";
import Applications from "./pages/applications";
import Settings from "./pages/settings";
import NotFound from "@/pages/not-found";

// Single Query Client instance for the app
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 mins
    },
  },
});

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/applications" component={Applications} />
      <Route path="/settings" component={Settings} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  // Replace trailing slash safely for base path
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  
  return (
    <QueryClientProvider client={queryClient}>
      <WouterRouter base={base}>
        <Router />
      </WouterRouter>
    </QueryClientProvider>
  );
}

export default App;
