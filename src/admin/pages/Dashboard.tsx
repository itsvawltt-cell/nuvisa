import { useEffect, useState } from "react";
import { Globe, Users, CreditCard, TrendingUp, ArrowRight } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Link } from "wouter";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ countries: 0, users: 0, payments: 0, revenue: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [{ count: c }, { count: u }, { data: pays }] = await Promise.all([
        supabase.from("countries").select("*", { count: "exact", head: true }).eq("is_active", true),
        supabase.from("applications").select("*", { count: "exact", head: true }),
        supabase.from("payments").select("amount,status"),
      ]);
      const revenue = (pays ?? []).filter(p => p.status === "completed").reduce((s, p) => s + Number(p.amount), 0);
      setStats({ countries: c ?? 0, users: u ?? 0, payments: (pays ?? []).length, revenue });
      setLoading(false);
    }
    load();
  }, []);

  const cards = [
    { label: "Active Countries", value: stats.countries,              icon: Globe,       accent: "#7c5cfc", href: "/admin/countries" },
    { label: "Applications",     value: stats.users,                  icon: Users,       accent: "#2db87e", href: "/admin/users" },
    { label: "Payments",         value: stats.payments,               icon: CreditCard,  accent: "#f5c842", href: "/admin/payments" },
    { label: "Total Revenue",    value: `£${stats.revenue.toFixed(2)}`, icon: TrendingUp, accent: "#e95565", href: "/admin/balance" },
  ];

  return (
    <div className="flex flex-col gap-8">

      {/* Page heading */}
      <div>
        <p className="text-[#f5c842] text-xs font-black uppercase tracking-[0.18em] mb-1">Overview</p>
        <h1 className="font-heading font-black text-3xl text-white">Dashboard</h1>
      </div>

      {/* Stat cards */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {cards.map(({ label, value, icon: Icon, accent, href }) => (
          <Link key={label} href={href}>
            <div
              className="group relative bg-[#111118] border border-white/[0.07] rounded-2xl p-5
                hover:border-white/[0.15] transition-all duration-200 cursor-pointer overflow-hidden"
            >
              {/* Glow */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none"
                style={{ background: `radial-gradient(circle at top left, ${accent}12, transparent 60%)` }}
              />
              <div className="relative">
                <div className="flex items-center justify-between mb-5">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: accent + "18" }}
                  >
                    <Icon className="h-5 w-5" style={{ color: accent }} />
                  </div>
                  <ArrowRight
                    className="h-4 w-4 text-white/15 group-hover:text-white/40 group-hover:translate-x-0.5
                      transition-all duration-200"
                  />
                </div>
                <p className="font-black text-2xl text-white mb-0.5">
                  {loading
                    ? <span className="inline-block w-10 h-6 bg-white/8 rounded-lg animate-pulse" />
                    : value}
                </p>
                <p className="text-white/35 text-sm">{label}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div className="bg-[#111118] border border-white/[0.07] rounded-2xl p-6">
        <p className="text-white/40 text-xs font-black uppercase tracking-widest mb-4">Quick actions</p>
        <div className="grid sm:grid-cols-2 gap-3">
          <Link href="/admin/countries">
            <div
              className="flex items-center justify-between gap-3 rounded-xl px-4 py-3.5
                border border-[#7c5cfc]/20 bg-[#7c5cfc]/8 hover:bg-[#7c5cfc]/14
                transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <Globe className="h-4 w-4 text-[#7c5cfc]" />
                <span className="text-sm font-semibold text-white">Add a new country</span>
              </div>
              <ArrowRight className="h-3.5 w-3.5 text-[#7c5cfc]/40 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>
          <Link href="/admin/users">
            <div
              className="flex items-center justify-between gap-3 rounded-xl px-4 py-3.5
                border border-[#2db87e]/20 bg-[#2db87e]/8 hover:bg-[#2db87e]/14
                transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <Users className="h-4 w-4 text-[#2db87e]" />
                <span className="text-sm font-semibold text-white">View applications</span>
              </div>
              <ArrowRight className="h-3.5 w-3.5 text-[#2db87e]/40 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
