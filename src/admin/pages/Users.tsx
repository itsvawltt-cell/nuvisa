import { useEffect, useState } from "react";
import { supabase, type Application } from "@/lib/supabase";
import { Loader2, Search, AlertCircle } from "lucide-react";

const STATUS: Record<string, { bg: string; text: string }> = {
  pending:   { bg: "bg-[#f5c842]/10",  text: "text-[#f5c842]" },
  approved:  { bg: "bg-[#2db87e]/10",  text: "text-[#2db87e]" },
  completed: { bg: "bg-[#7c5cfc]/10",  text: "text-[#7c5cfc]" },
  rejected:  { bg: "bg-red-500/10",    text: "text-red-400" },
};

export default function AdminUsers() {
  const [apps, setApps]       = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");
  const [search, setSearch]   = useState("");

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase.from("applications").select("*").order("created_at", { ascending: false });
      if (error) setError(error.message);
      else setApps(data ?? []);
      setLoading(false);
    }
    load();
  }, []);

  async function updateStatus(id: string, status: string) {
    await supabase.from("applications").update({ status }).eq("id", id);
    setApps(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  }

  const filtered = apps.filter(a =>
    (a.applicant_name ?? "").toLowerCase().includes(search.toLowerCase()) ||
    (a.applicant_email ?? "").toLowerCase().includes(search.toLowerCase()) ||
    (a.country_name ?? "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-[#f5c842] text-xs font-black uppercase tracking-[0.18em] mb-1">Manage</p>
        <h1 className="font-heading font-black text-3xl text-white">Users & Applications</h1>
        <p className="text-white/35 text-sm mt-0.5">{apps.length} total applications</p>
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-red-500/8 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm">
          <AlertCircle className="h-4 w-4" /> {error}
        </div>
      )}

      {/* Status summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {["pending","approved","completed","rejected"].map(s => {
          const st = STATUS[s];
          return (
            <div key={s} className="bg-[#111118] border border-white/[0.07] rounded-xl px-4 py-3.5">
              <p className="text-white/25 text-[10px] font-black uppercase tracking-widest mb-1.5 capitalize">{s}</p>
              <p className={`font-black text-2xl ${st.text}`}>{apps.filter(a => a.status === s).length}</p>
            </div>
          );
        })}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, email or country…"
          className="w-full bg-[#111118] border border-white/[0.08] rounded-xl pl-10 pr-4 py-2.5
            text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#7c5cfc]/50 transition-colors" />
      </div>

      <div className="bg-[#111118] border border-white/[0.07] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.06]">
                {["Applicant","Country","Travellers","Fee","Status","Date"].map(h => (
                  <th key={h} className="px-5 py-3.5 text-left text-[10px] font-black uppercase tracking-widest text-white/25">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 6 }).map((_, j) => (
                      <td key={j} className="px-5 py-4"><div className="h-3 bg-white/5 rounded-full animate-pulse w-3/4" /></td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} className="px-5 py-16 text-center text-white/25">
                  {apps.length === 0 ? "No applications yet." : "No results match your search."}
                </td></tr>
              ) : filtered.map(a => {
                const st = STATUS[a.status] ?? { bg: "bg-white/8", text: "text-white/40" };
                return (
                  <tr key={a.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="font-semibold text-white">{a.applicant_name ?? "—"}</p>
                      <p className="text-white/30 text-xs">{a.applicant_email ?? ""}</p>
                    </td>
                    <td className="px-5 py-3.5 text-white/60">{a.country_name ?? "—"}</td>
                    <td className="px-5 py-3.5 text-white/50 text-center">{a.travellers}</td>
                    <td className="px-5 py-3.5 font-bold text-white">
                      {a.total_fee ? `£${Number(a.total_fee).toFixed(2)}` : "—"}
                    </td>
                    <td className="px-5 py-3.5">
                      <select
                        value={a.status}
                        onChange={e => updateStatus(a.id, e.target.value)}
                        className={`text-[10px] font-black uppercase tracking-wide px-2.5 py-1.5 rounded-full
                          cursor-pointer outline-none border-0 ${st.bg} ${st.text}`}
                        style={{ background: "transparent" }}
                      >
                        {["pending","approved","completed","rejected"].map(s => (
                          <option key={s} value={s} className="bg-[#111118] text-white normal-case text-sm font-normal">{s}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-5 py-3.5 text-white/25 text-xs whitespace-nowrap">
                      {new Date(a.created_at).toLocaleDateString("en-GB", { day:"2-digit", month:"short", year:"numeric" })}
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
