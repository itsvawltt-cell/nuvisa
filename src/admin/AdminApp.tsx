import { Route, Switch, Link, useLocation } from "wouter";
import { useState } from "react";
import {
  LayoutDashboard, Globe, Users, CreditCard,
  Wallet, Menu, X, ExternalLink, ChevronRight
} from "lucide-react";
import nuvisaLogo from "@/assets/images/nuvisa-logo.png";
import AdminDashboard from "./pages/Dashboard";
import AdminCountries from "./pages/Countries";
import AdminUsers from "./pages/Users";
import AdminPayments from "./pages/Payments";
import AdminBalance from "./pages/Balance";

const NAV = [
  { path: "/admin",           label: "Dashboard", icon: LayoutDashboard },
  { path: "/admin/countries", label: "Countries",  icon: Globe },
  { path: "/admin/users",     label: "Users",      icon: Users },
  { path: "/admin/payments",  label: "Payments",   icon: CreditCard },
  { path: "/admin/balance",   label: "Balance",    icon: Wallet },
];

export default function AdminApp() {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);

  const activeLabel = NAV.find(
    n => n.path === location || (n.path !== "/admin" && location.startsWith(n.path))
  )?.label ?? "Dashboard";

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white flex">

      {/* ── Sidebar ── */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex flex-col w-60
          bg-[#0d0d0d] border-r border-white/[0.06]
          transition-transform duration-200
          ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        {/* NuVisa logo header */}
        <div className="px-5 py-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <img src={nuvisaLogo} alt="NuVisa" className="h-7 w-auto" />
            <div className="h-4 w-px bg-white/10" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#7c5cfc]">Admin</span>
          </div>
        </div>

        {/* Yellow accent strip */}
        <div className="mx-3 mt-3 mb-1 h-0.5 rounded-full bg-gradient-to-r from-[#f5c842] via-[#f5c842]/40 to-transparent" />

        {/* Nav */}
        <nav className="flex-1 px-2.5 py-3 flex flex-col gap-0.5 overflow-y-auto">
          {NAV.map(({ path, label, icon: Icon }) => {
            const active = location === path || (path !== "/admin" && location.startsWith(path));
            return (
              <Link key={path} href={path} onClick={() => setOpen(false)}>
                <div
                  className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                    transition-all cursor-pointer select-none
                    ${active
                      ? "bg-[#7c5cfc]/12 text-white border border-[#7c5cfc]/25 shadow-sm shadow-[#7c5cfc]/10"
                      : "text-white/40 hover:text-white/80 hover:bg-white/[0.04] border border-transparent"}`}
                >
                  <Icon
                    className={`h-4 w-4 flex-shrink-0 transition-colors
                      ${active ? "text-[#7c5cfc]" : "text-white/30 group-hover:text-white/60"}`}
                  />
                  <span className="flex-1">{label}</span>
                  {active && <ChevronRight className="h-3 w-3 text-[#7c5cfc]/40" />}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Bottom: back to site */}
        <div className="px-2.5 py-3 border-t border-white/[0.06]">
          <Link href="/">
            <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-white/25
              hover:text-white/50 hover:bg-white/[0.03] transition-all cursor-pointer text-xs font-medium">
              <ExternalLink className="h-3.5 w-3.5" />
              Back to website
            </div>
          </Link>
        </div>
      </aside>

      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* ── Main content ── */}
      <div className="flex-1 md:ml-60 flex flex-col min-h-screen">

        {/* Top bar — mimics site's announcement bar + nav bar combo */}
        <header className="sticky top-0 z-20 border-b border-white/[0.06] bg-[#0d0d0d]/95 backdrop-blur-md">
          {/* Accent bar */}
          <div className="h-px bg-gradient-to-r from-[#7c5cfc]/60 via-[#f5c842]/40 to-[#7c5cfc]/10" />
          <div className="flex items-center gap-4 px-5 py-3.5">
            <button
              className="md:hidden text-white/40 hover:text-white transition-colors"
              onClick={() => setOpen(!open)}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 text-sm">
              <span className="text-white/25">NuVisa</span>
              <ChevronRight className="h-3.5 w-3.5 text-white/15" />
              <span className="font-semibold text-white/80">{activeLabel}</span>
            </div>

            <div className="flex-1" />

            {/* Live indicator */}
            <div className="flex items-center gap-2 bg-[#1a3d2b]/60 border border-[#2db87e]/20 rounded-full px-3 py-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-[#2db87e] animate-pulse" />
              <span className="text-[#2db87e] text-xs font-semibold">Live</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-5 md:p-8 max-w-7xl w-full mx-auto">
          <Switch>
            <Route path="/admin"           component={AdminDashboard} />
            <Route path="/admin/countries" component={AdminCountries} />
            <Route path="/admin/users"     component={AdminUsers} />
            <Route path="/admin/payments"  component={AdminPayments} />
            <Route path="/admin/balance"   component={AdminBalance} />
          </Switch>
        </main>
      </div>
    </div>
  );
}
