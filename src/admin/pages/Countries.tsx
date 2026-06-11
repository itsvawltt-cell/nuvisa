import { useEffect, useState } from "react";
import { supabase, type Country } from "@/lib/supabase";
import {
  Plus, X, Edit2, Trash2, Check, Loader2,
  Search, AlertCircle, ToggleLeft, ToggleRight
} from "lucide-react";

const EMPTY: Omit<Country, "id" | "created_at"> = {
  name: "", slug: "", flag: "🌍", description: "",
  price_nuvisa_fee: 200, price_embassy_fee: 78,
  max_travellers: 9, visa_types: "Sticker",
  stay_duration: "Upto 90 Days", term_type: "Short Term",
  entry_type: "Multiple or Single", is_active: true,
  popular: false, image_url: "",
};

function slugify(s: string) {
  return s.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

export default function AdminCountries() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState("");
  const [search, setSearch]       = useState("");
  const [showForm, setShowForm]   = useState(false);
  const [editId, setEditId]       = useState<string | null>(null);
  const [form, setForm]           = useState({ ...EMPTY });
  const [saving, setSaving]       = useState(false);
  const [toast, setToast]         = useState("");

  async function load() {
    setLoading(true);
    const { data, error } = await supabase.from("countries").select("*").order("name");
    if (error) setError(error.message);
    else setCountries(data ?? []);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  }

  function openNew() { setForm({ ...EMPTY }); setEditId(null); setShowForm(true); }
  function openEdit(c: Country) { setForm({ ...c }); setEditId(c.id); setShowForm(true); }

  function handleChange(key: keyof typeof EMPTY, val: string | number | boolean) {
    setForm(f => {
      const next = { ...f, [key]: val };
      if (key === "name" && !editId) next.slug = slugify(String(val));
      return next;
    });
  }

  async function save() {
    if (!form.name || !form.slug) return;
    setSaving(true); setError("");
    const payload = {
      ...form,
      price_nuvisa_fee: Number(form.price_nuvisa_fee),
      price_embassy_fee: Number(form.price_embassy_fee),
      max_travellers: Number(form.max_travellers),
    };
    const { error } = editId
      ? await supabase.from("countries").update(payload).eq("id", editId)
      : await supabase.from("countries").insert(payload);
    setSaving(false);
    if (error) { setError(error.message); return; }
    showToast(editId ? "Country updated!" : "Country added!");
    setShowForm(false); setEditId(null);
    load();
  }

  async function del(id: string) {
    if (!confirm("Delete this country? This cannot be undone.")) return;
    await supabase.from("countries").delete().eq("id", id);
    showToast("Country deleted.");
    load();
  }

  async function toggleActive(c: Country) {
    await supabase.from("countries").update({ is_active: !c.is_active }).eq("id", c.id);
    load();
  }

  const filtered = countries.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.slug.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="text-[#f5c842] text-xs font-black uppercase tracking-[0.18em] mb-1">Manage</p>
          <h1 className="font-heading font-black text-3xl text-white">Countries</h1>
          <p className="text-white/35 text-sm mt-0.5">{countries.length} total · {countries.filter(c => c.is_active).length} active</p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 bg-[#7c5cfc] hover:bg-[#6b4de8] text-white
            font-bold px-4 py-2.5 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]
            shadow-lg shadow-[#7c5cfc]/20 text-sm"
          data-testid="btn-add-country"
        >
          <Plus className="h-4 w-4" /> Add Country
        </button>
      </div>

      {/* Toast */}
      {toast && (
        <div className="flex items-center gap-2 bg-[#1a3d2b] border border-[#2db87e]/25 rounded-xl px-4 py-3 text-[#2db87e] text-sm font-medium">
          <Check className="h-4 w-4" /> {toast}
        </div>
      )}
      {error && (
        <div className="flex items-center gap-2 bg-red-500/8 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm">
          <AlertCircle className="h-4 w-4 flex-shrink-0" /> {error}
        </div>
      )}

      {/* Add / Edit form */}
      {showForm && (
        <div className="bg-[#111118] border border-[#7c5cfc]/25 rounded-2xl overflow-hidden shadow-xl shadow-[#7c5cfc]/5">
          {/* Form header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06] bg-[#7c5cfc]/6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#7c5cfc]/20 flex items-center justify-center">
                <Plus className="h-4 w-4 text-[#7c5cfc]" />
              </div>
              <h2 className="font-bold text-base text-white">{editId ? "Edit Country" : "Add New Country"}</h2>
            </div>
            <button onClick={() => { setShowForm(false); setEditId(null); }} className="text-white/25 hover:text-white transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Fields grid */}
          <div className="p-5 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <F label="Country Name *">
              <input value={form.name} onChange={e => handleChange("name", e.target.value)}
                placeholder="e.g. Belgium" className="admin-input" data-testid="input-country-name" />
            </F>
            <F label="URL Slug *">
              <input value={form.slug} onChange={e => handleChange("slug", e.target.value)}
                placeholder="e.g. belgium" className="admin-input" data-testid="input-country-slug" />
            </F>
            <F label="Flag Emoji">
              <input value={form.flag} onChange={e => handleChange("flag", e.target.value)}
                placeholder="🌍" maxLength={4} className="admin-input" />
            </F>
            <F label="NuVisa Fee (£)">
              <input type="number" value={form.price_nuvisa_fee}
                onChange={e => handleChange("price_nuvisa_fee", e.target.value)} className="admin-input" data-testid="input-nuvisa-fee" />
            </F>
            <F label="Embassy Fee (£)">
              <input type="number" value={form.price_embassy_fee}
                onChange={e => handleChange("price_embassy_fee", e.target.value)} className="admin-input" data-testid="input-embassy-fee" />
            </F>
            <F label="Max Travellers">
              <input type="number" min={1} max={50} value={form.max_travellers}
                onChange={e => handleChange("max_travellers", e.target.value)} className="admin-input" data-testid="input-max-travellers" />
            </F>
            <F label="Visa Types">
              <input value={form.visa_types} onChange={e => handleChange("visa_types", e.target.value)}
                placeholder="Sticker" className="admin-input" />
            </F>
            <F label="Stay Duration">
              <input value={form.stay_duration} onChange={e => handleChange("stay_duration", e.target.value)}
                placeholder="Upto 90 Days" className="admin-input" />
            </F>
            <F label="Term Type">
              <input value={form.term_type} onChange={e => handleChange("term_type", e.target.value)}
                placeholder="Short Term" className="admin-input" />
            </F>
            <F label="Entry Type">
              <input value={form.entry_type} onChange={e => handleChange("entry_type", e.target.value)}
                placeholder="Multiple or Single" className="admin-input" />
            </F>
            <F label="Image URL">
              <input value={form.image_url ?? ""} onChange={e => handleChange("image_url", e.target.value)}
                placeholder="https://…" className="admin-input" />
            </F>
            <F label="Description" className="sm:col-span-2 lg:col-span-3">
              <textarea value={form.description ?? ""} onChange={e => handleChange("description", e.target.value)}
                rows={2} placeholder="Short description of the destination…" className="admin-input resize-none" />
            </F>
            <div className="flex gap-6 sm:col-span-2 lg:col-span-3 pt-1">
              <Tog label="Active" value={form.is_active} onChange={v => handleChange("is_active", v)} />
              <Tog label="Popular" value={form.popular} onChange={v => handleChange("popular", v)} />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-white/[0.06]">
            <button onClick={() => { setShowForm(false); setEditId(null); }}
              className="px-4 py-2 text-sm text-white/35 hover:text-white transition-colors">Cancel</button>
            <button onClick={save} disabled={saving || !form.name}
              className="flex items-center gap-2 bg-[#7c5cfc] hover:bg-[#6b4de8] disabled:opacity-50
                text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all
                hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-[#7c5cfc]/20"
              data-testid="btn-save-country">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
              {editId ? "Update Country" : "Save Country"}
            </button>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search countries…"
          className="w-full bg-[#111118] border border-white/[0.08] rounded-xl pl-10 pr-4 py-2.5
            text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#7c5cfc]/50 transition-colors" />
      </div>

      {/* Table */}
      <div className="bg-[#111118] border border-white/[0.07] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.06]">
                {["Country", "Slug", "NuVisa Fee", "Embassy Fee", "Max", "Status", ""].map(h => (
                  <th key={h} className="px-5 py-3.5 text-left text-[10px] font-black uppercase tracking-widest text-white/25 last:text-center">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 7 }).map((_, j) => (
                      <td key={j} className="px-5 py-4">
                        <div className="h-3 bg-white/5 rounded-full animate-pulse" style={{ width: `${60 + Math.random() * 30}%` }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-16 text-center text-white/30">
                    {countries.length === 0
                      ? <>No countries yet.<br /><span className="text-white/20 text-xs">Click "Add Country" to get started.</span></>
                      : "No results match your search."}
                  </td>
                </tr>
              ) : filtered.map(c => (
                <tr key={c.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">{c.flag}</span>
                      <div>
                        <p className="font-semibold text-white leading-tight">{c.name}</p>
                        {c.popular && (
                          <span className="text-[9px] font-black uppercase tracking-widest text-[#f5c842]">★ Popular</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 font-mono text-xs text-white/30">{c.slug}</td>
                  <td className="px-5 py-3.5 font-bold text-white">£{Number(c.price_nuvisa_fee).toFixed(2)}</td>
                  <td className="px-5 py-3.5 text-white/40">£{Number(c.price_embassy_fee).toFixed(2)}</td>
                  <td className="px-5 py-3.5 text-white/40 text-center">{c.max_travellers}</td>
                  <td className="px-5 py-3.5">
                    <button onClick={() => toggleActive(c)} className="transition-opacity hover:opacity-80">
                      {c.is_active
                        ? <span className="bg-[#1a3d2b] text-[#2db87e] text-[10px] font-black uppercase tracking-wide px-2.5 py-1 rounded-full">Active</span>
                        : <span className="bg-white/5 text-white/25 text-[10px] font-black uppercase tracking-wide px-2.5 py-1 rounded-full">Inactive</span>}
                    </button>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openEdit(c)}
                        className="p-1.5 rounded-lg text-white/30 hover:text-[#7c5cfc] hover:bg-[#7c5cfc]/10 transition-all" title="Edit">
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button onClick={() => del(c.id)}
                        className="p-1.5 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-400/10 transition-all" title="Delete">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function F({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label className="text-white/35 text-[10px] font-black uppercase tracking-widest">{label}</label>
      {children}
    </div>
  );
}

function Tog({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!value)} type="button" className="flex items-center gap-2 text-sm group">
      {value
        ? <ToggleRight className="h-5 w-5 text-[#7c5cfc]" />
        : <ToggleLeft className="h-5 w-5 text-white/20 group-hover:text-white/40 transition-colors" />}
      <span className={value ? "text-white font-medium" : "text-white/30"}>{label}</span>
    </button>
  );
}
