import { useEffect, useState } from "react";
import { supabase, type Payment } from "@/lib/supabase";
import { Loader2, Search, AlertCircle } from "lucide-react";

const STATUS: Record<string, { bg: string; text: string }> = {
  completed: { bg: "bg-[#2db87e]/10", text: "text-[#2db87e]" },
  pending:   { bg: "bg-[#f5c842]/10", text: "text-[#f5c842]" },
  failed:    { bg: "bg-red-500/10",   text: "text-red-400" },
  refunded:  { bg: "bg-[#7c5cfc]/10", text: "text-[#7c5cfc]" },
};

const METHOD_BADGE: Record<string, string> = { gpay: "G", klarna: "K", stripe: "S", card: "💳" };

export default function AdminPayments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");
  const [search, setSearch]     = useState("");

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase.from("payments").select("*").order("created_at", { ascending: false });
      if (error) setError(error.message);
      else setPayments(data ?? []);
      setLoading(false);
    }
    load();
  }, []);

  const completed = payments.filter(p => p.status === "completed");
  const totalRev  = completed.reduce((s, p) => s + Number(p.amount), 0);
  const pendingAmt = payments.filter(p => p.status === "pending").reduce((s, p) => s + Number(p.amount), 0);

  const filtered = payments.filter(p =>
    p.method?.toLowerCase().includes(search.toLowerCase()) ||
    p.status.includes(search.toLowerCase()) ||
    (p.stripe_payment_id ?? "").includes(search)
  );

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-[#f5c842] text-xs font-black uppercase tracking-[0.18em] mb-1">Finance</p>
        <h1 className="font-heading font-black text-3xl text-white">Payments</h1>
        <p className="text-white/35 text-sm mt-0.5">{payments.length} payment records</p>
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-red-500/8 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm">
          <AlertCircle className="h-4 w-4" /> {error}
        </div>
      )}

      {/* KPI strip */}
      <div className="grid sm:grid-cols-3 gap-3">
        {[
          { label: "Completed revenue",  value: `£${totalRev.toFixed(2)}`,   color: "#2db87e" },
          { label: "Pending amount",     value: `£${pendingAmt.toFixed(2)}`,  color: "#f5c842" },
          { label: "Total transactions", value: payments.length,               color: "#7c5cfc" },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-[#111118] border border-white/[0.07] rounded-xl px-4 py-4">
            <p className="text-white/25 text-[10px] font-black uppercase tracking-widest mb-1.5">{label}</p>
            <p className="font-black text-2xl" style={{ color }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by method, status or payment ID…"
          className="w-full bg-[#111118] border border-white/[0.08] rounded-xl pl-10 pr-4 py-2.5
            text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#7c5cfc]/50 transition-colors" />
      </div>

      <div className="bg-[#111118] border border-white/[0.07] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.06]">
                {["ID","Method","Amount","Status","Date"].map(h => (
                  <th key={h} className="px-5 py-3.5 text-left text-[10px] font-black uppercase tracking-widest text-white/25">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 5 }).map((_, j) => (
                      <td key={j} className="px-5 py-4"><div className="h-3 bg-white/5 rounded-full animate-pulse w-3/4" /></td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr><td colSpan={5} className="px-5 py-16 text-center text-white/25">
                  {payments.length === 0 ? "No payments yet." : "No results."}
                </td></tr>
              ) : filtered.map(p => {
                const st = STATUS[p.status] ?? { bg: "bg-white/8", text: "text-white/40" };
                return (
                  <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="font-mono text-xs text-white/40">{p.id.split("-")[0]}…</p>
                      {p.stripe_payment_id && (
                        <p className="font-mono text-[10px] text-white/20 mt-0.5">{p.stripe_payment_id}</p>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-white/6 flex items-center justify-center
                          text-xs font-black text-white/70">
                          {METHOD_BADGE[p.method?.toLowerCase()] ?? "—"}
                        </div>
                        <span className="text-white/60 capitalize">{p.method}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 font-bold text-white">£{Number(p.amount).toFixed(2)}</td>
                    <td className="px-5 py-3.5">
                      <span className={`text-[10px] font-black uppercase tracking-wide px-2.5 py-1.5 rounded-full ${st.bg} ${st.text}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-white/25 text-xs whitespace-nowrap">
                      {new Date(p.created_at).toLocaleDateString("en-GB", { day:"2-digit", month:"short", year:"numeric" })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
