import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import { Layout } from "@/components/layout/Layout";
import Home from "@/pages/Home";
import HowItWorks from "@/pages/HowItWorks";
import Countries from "@/pages/Countries";
import CountryDetail from "@/pages/CountryDetail";
import Pricing from "@/pages/Pricing";
import About from "@/pages/About";
import FAQ from "@/pages/FAQ";
import Contact from "@/pages/Contact";
import Careers from "@/pages/Careers";
import Press from "@/pages/Press";
import Privacy from "@/pages/Privacy";
import Terms from "@/pages/Terms";
import Apply from "@/pages/Apply";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import NotFound from "@/pages/not-found";
import AdminApp from "@/admin/AdminApp";

const queryClient = new QueryClient();

function Router() {
  const [location] = useLocation();
  const isAdmin = location.startsWith("/admin");

  if (isAdmin) {
    return (
      <Switch>
        <Route path="/admin" component={AdminApp} />
        <Route path="/admin/:rest*" component={AdminApp} />
      </Switch>
    );
  }

  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/how-it-works" component={HowItWorks} />
        <Route path="/countries" component={Countries} />
        <Route path="/countries/:slug" component={CountryDetail} />
        <Route path="/pricing" component={Pricing} />
        <Route path="/about" component={About} />
        <Route path="/faq" component={FAQ} />
        <Route path="/contact" component={Contact} />
        <Route path="/careers" component={Careers} />
        <Route path="/press" component={Press} />
        <Route path="/privacy" component={Privacy} />
        <Route path="/terms" component={Terms} />
        <Route path="/apply" component={Apply} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
