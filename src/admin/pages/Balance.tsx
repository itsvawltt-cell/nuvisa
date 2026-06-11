import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { TrendingUp, Wallet, ArrowUpRight } from "lucide-react";

interface MonthData { label: string; revenue: number; count: number; }

export default function AdminBalance() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from("payments").select("amount,status,method,created_at");
      setPayments(data ?? []);
      setLoading(false);
    }
    load();
  }, []);

  const completed   = payments.filter(p => p.status === "completed");
  const totalRevenue = completed.reduce((s, p) => s + Number(p.amount), 0);
  const avgValue     = completed.length ? totalRevenue / completed.length : 0;

  /* monthly */
  const byMonth: Record<string, MonthData> = {};
  completed.forEach(p => {
    const d   = new Date(p.created_at);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const lbl = d.toLocaleDateString("en-GB", { month: "short", year: "2-digit" });
    if (!byMonth[key]) byMonth[key] = { label: lbl, revenue: 0, count: 0 };
    byMonth[key].revenue += Number(p.amount);
    byMonth[key].count   += 1;
  });
  const months  = Object.entries(byMonth).sort(([a], [b]) => a.localeCompare(b)).slice(-6).map(([, v]) => v);
  const maxRev  = Math.max(...months.map(m => m.revenue), 1);

  /* method */
  const methodMap: Record<string, number> = {};
  completed.forEach(p => {
    const k = p.method ?? "other";
    methodMap[k] = (methodMap[k] ?? 0) + Number(p.amount);
  });

  const kpis = [
    { label: "Total Revenue",     value: `£${totalRevenue.toFixed(2)}`, icon: Wallet,       color: "#2db87e" },
    { label: "Avg. Order Value",  value: `£${avgValue.toFixed(2)}`,     icon: TrendingUp,   color: "#7c5cfc" },
    { label: "Completed Txns",    value: completed.length,               icon: ArrowUpRight, color: "#f5c842" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-[#f5c842] text-xs font-black uppercase tracking-[0.18em] mb-1">Finance</p>
        <h1 className="font-heading font-black text-3xl text-white">Balance & Revenue</h1>
      </div>

      {/* KPIs */}
      <div className="grid sm:grid-cols-3 gap-4">
        {kpis.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-[#111118] border border-white/[0.07] rounded-2xl p-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl opacity-10 pointer-events-none"
              style={{ background: color, transform: "translate(30%, -30%)" }} />
            <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-4" style={{ background: color + "18" }}>
              <Icon className="h-4 w-4" style={{ color }} />
            </div>
            <p className="font-black text-2xl text-white mb-0.5">
              {loading ? <span className="inline-block w-20 h-6 bg-white/6 rounded-lg animate-pulse" /> : value}
            </p>
            <p className="text-white/30 text-xs">{label}</p>
          </div>
        ))}
      </div>

      {/* Monthly bar chart */}
      <div className="bg-[#111118] border border-white/[0.07] rounded-2xl p-5">
        <p className="text-white/25 text-[10px] font-black uppercase tracking-widest mb-5">Monthly Revenue</p>
        {loading ? (
          <div className="flex items-end gap-2 h-32">
            {[50,70,45,80,65,90].map((h, i) => (
              <div key={i} className="flex-1 bg-white/5 rounded-t-lg animate-pulse" style={{ height: `${h}%` }} />
            ))}
          </div>
        ) : months.length === 0 ? (
          <p className="text-white/25 text-sm text-center py-10">No revenue data yet.</p>
        ) : (
          <div className="flex items-end gap-2" style={{ height: 120 }}>
            {months.map(m => {
              const pct = (m.revenue / maxRev) * 100;
              return (
                <div key={m.label} className="flex-1 flex flex-col items-center gap-1.5 group">
                  <div className="relative w-full" style={{ height: 96 }}>
                    <div
                      className="absolute bottom-0 left-0 right-0 rounded-t-lg transition-all
                        bg-[#7c5cfc]/40 group-hover:bg-[#7c5cfc]"
                      style={{ height: `${pct}%` }}
                      title={`£${m.revenue.toFixed(2)}`}
                    />
                  </div>
                  <p className="text-white/25 text-[10px] whitespace-nowrap">{m.label}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Method breakdown */}
      <div className="bg-[#111118] border border-white/[0.07] rounded-2xl p-5">
        <p className="text-white/25 text-[10px] font-black uppercase tracking-widest mb-4">Revenue by Payment Method</p>
        {loading ? (
          <div className="space-y-3">{[1,2].map(i => <div key={i} className="h-8 bg-white/5 rounded-xl animate-pulse" />)}</div>
        ) : Object.keys(methodMap).length === 0 ? (
          <p className="text-white/25 text-sm">No data yet.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {Object.entries(methodMap).sort(([,a],[,b]) => b - a).map(([method, amount]) => {
              const pct = (amount / totalRevenue) * 100;
              return (
                <div key={method}>
                  <div className="flex items-center justify-between mb-1.5 text-sm">
                    <span className="text-white/50 capitalize">{method}</span>
                    <span className="font-bold text-white">
                      £{amount.toFixed(2)}
                      <span className="text-white/25 font-normal ml-1.5">({pct.toFixed(0)}%)</span>
                    </span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-[#7c5cfc] to-[#7c5cfc]/60"
                      style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
