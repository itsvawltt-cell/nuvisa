import { useParams, Link } from "wouter";
import { useState, useEffect } from "react";
import {
  ArrowLeft, ArrowRight, ChevronLeft, ChevronRight,
  ChevronDown, ChevronUp, Minus, Plus, Calendar,
  Users, FileText, Clock, RefreshCw, ShieldCheck,
  Camera, Briefcase, CreditCard, AlertTriangle, Loader2
} from "lucide-react";
import { supabase, type Country } from "@/lib/supabase";

const galleryImages = [
  "https://images.unsplash.com/photo-1493306454986-c8877a09cbeb?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1471623322310-68985994b7c1?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2070&auto=format&fit=crop"
];

const requiredDocuments = [
  { id: "passport", icon: <FileText className="h-4 w-4" />, title: "Passport", desc: "Valid 3+ months after Schengen trip, 2 blank pages" },
  { id: "brp", icon: <ShieldCheck className="h-4 w-4" />, title: "UK eVisa / BRP", desc: "Valid 3+ months after Schengen trip" },
  { id: "photos", icon: <Camera className="h-4 w-4" />, title: "Passport-Sized Photographs", desc: "Two 35mm x 40mm photos required" },
  { id: "bank", icon: <CreditCard className="h-4 w-4" />, title: "Bank Statements", desc: "Last 3 months showing sufficient funds £60–£100/day per person" },
  { id: "employment", icon: <Briefcase className="h-4 w-4" />, title: "Employment Proof", desc: "Last 3 months payslips, or uni-enrollment letter if student" },
  { id: "insurance", icon: <ShieldCheck className="h-4 w-4" />, title: "Insurance Certificate", desc: "Must be valid for the entire duration of stay" },
];

export default function CountryDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [country, setCountry] = useState<Country | null>(null);
  const [loading, setLoading] = useState(true);

  const [carouselIdx, setCarouselIdx] = useState(0);
  const [travellers, setTravellers] = useState(1);
  const [startDate, setStartDate] = useState("2026-07-08");
  const [endDate, setEndDate] = useState("2026-07-22");
  const [docsOpen, setDocsOpen] = useState(true);
  const [checkedDocs, setCheckedDocs] = useState<Set<string>>(new Set());

  useEffect(() => {
    async function load() {
      if (!slug) return;
      const { data, error } = await supabase
        .from("countries")
        .select("*")
        .eq("slug", slug)
        .single();
      
      if (!error && data) {
        setCountry(data);
      }
      setLoading(false);
    }
    load();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex flex-col items-center justify-center text-white gap-6">
        <Loader2 className="h-10 w-10 animate-spin text-[#7c5cfc]" />
        <p className="text-white/50 animate-pulse">Loading destination details...</p>
      </div>
    );
  }

  if (!country) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex flex-col items-center justify-center text-white gap-6">
        <p className="text-2xl font-bold">Country not found</p>
        <Link href="/countries" className="text-[#7c5cfc] hover:underline flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to Countries
        </Link>
      </div>
    );
  }

  const mainImg = country.image_url || galleryImages[0];
  const carouselImages = [mainImg, ...galleryImages].slice(0, 8);

  const toggleDoc = (id: string) => {
    setCheckedDocs((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const nuvisFee = (country.price_nuvisa_fee + travellers * country.price_embassy_fee).toFixed(2);
  const tradFee = (travellers * 400 + 92).toFixed(2);
  const savings = Math.round(((Number(tradFee) - Number(nuvisFee)) / Number(tradFee)) * 100);

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white">

      {/* Back link */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 pt-6 pb-2">
        <Link
          href="/countries"
          className="inline-flex items-center gap-1.5 text-white/40 hover:text-white/80 text-sm transition-colors"
          data-testid="link-back-countries"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> All Countries
        </Link>
      </div>

      {/* Main two-column layout */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 pb-16">
        <div className="grid lg:grid-cols-[1fr_1.2fr] gap-6 lg:gap-10 items-start">

          {/* ── LEFT PANEL ── */}
          <div className="flex flex-col gap-5">

            {/* Top badges */}
            <div className="flex items-center gap-3 flex-wrap">
              <span className="flex items-center gap-2 border border-white/20 text-white text-sm font-semibold px-4 py-2 rounded-full bg-white/5">
                <span className="w-2 h-2 rounded-full bg-[#2db87e]" />
                99.3% approval
              </span>
              <span className="flex items-center gap-2 border border-white/20 text-white text-sm font-medium px-4 py-2 rounded-full bg-white/5">
                Get your visa with ease
              </span>
            </div>

            {/* Visa Details card */}
            <div className="bg-[#111118] border border-white/[0.08] rounded-2xl p-5 flex gap-5">
              {/* Left: heading + flag */}
              <div className="flex-shrink-0">
                <p className="text-white/40 text-xs font-semibold uppercase tracking-widest mb-1">Visa</p>
                <h2 className="font-heading font-black text-3xl leading-tight">Details</h2>
                <div className="text-4xl mt-3">{country.flag}</div>
              </div>

              {/* Right: table */}
              <div className="flex-1 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                {[
                  { icon: <FileText className="h-3.5 w-3.5" />, label: "Visa Types", value: country.visa_types || "Sticker" },
                  { icon: <Clock className="h-3.5 w-3.5" />, label: "Stay Duration", value: country.stay_duration || "Upto 90 Days" },
                  { icon: <RefreshCw className="h-3.5 w-3.5" />, label: "Term Type", value: country.term_type || "Short Term" },
                  { icon: <ArrowRight className="h-3.5 w-3.5" />, label: "Entry", value: country.entry_type || "Multiple or Single" },
                ].map((row) => (
                  <div key={row.label} className="col-span-2 flex items-start justify-between border-b border-white/[0.05] pb-2 last:border-0 last:pb-0">
                    <div className="flex items-center gap-1.5 text-white/40">
                      {row.icon}
                      <span>{row.label}</span>
                    </div>
                    <span className="font-semibold text-white text-right">{row.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Embassy fee note */}
            <div className="flex items-start gap-3 bg-[#2a2200] border border-[#f5c842]/20 rounded-xl px-4 py-3">
              <AlertTriangle className="h-4 w-4 text-[#f5c842] flex-shrink-0 mt-0.5" />
              <p className="text-[#f5c842]/80 text-xs leading-relaxed">
                Please note that embassy require you to pay £{country.price_embassy_fee} in person to a government official, either by cash or card.
              </p>
            </div>

            {/* Image carousel */}
            <div className="relative rounded-2xl overflow-hidden bg-[#111118]">
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={carouselImages[carouselIdx]}
                  alt={country.name}
                  className="w-full h-full object-cover transition-all duration-500"
                />
                {/* Country name overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-5 py-4">
                  <p className="font-heading font-black text-2xl">{country.name}</p>
                </div>
                {/* Arrows */}
                <button
                  onClick={() => setCarouselIdx((i) => (i - 1 + carouselImages.length) % carouselImages.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all"
                  data-testid="btn-carousel-prev"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setCarouselIdx((i) => (i + 1) % carouselImages.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all"
                  data-testid="btn-carousel-next"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>

              {/* Dot indicators */}
              <div className="flex justify-center gap-1.5 py-3">
                {carouselImages.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCarouselIdx(i)}
                    className={`h-1.5 rounded-full transition-all ${i === carouselIdx ? "w-5 bg-white" : "w-1.5 bg-white/30"}`}
                    data-testid={`btn-dot-${i}`}
                  />
                ))}
              </div>

              {/* Thumbnails */}
              <div className="flex gap-2 px-3 pb-3 overflow-x-auto">
                {carouselImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setCarouselIdx(i)}
                    className={`flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${i === carouselIdx ? "border-white" : "border-transparent opacity-60 hover:opacity-80"}`}
                    data-testid={`btn-thumb-${i}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── RIGHT PANEL ── */}
          <div className="flex flex-col gap-5 lg:sticky lg:top-28">

            {/* Heading */}
            <div>
              <h1 className="font-heading font-black text-2xl md:text-3xl">Schengen visa from the UK</h1>
              <p className="text-white/40 text-sm mt-1">Complete visa service end-to-end with all necessary documents</p>
            </div>

            {/* Pricing */}
            <div className="flex items-end gap-4">
              <div>
                <span className="font-black text-4xl text-white">£{nuvisFee}</span>
                <p className="text-[#2db87e] text-xs font-bold mt-0.5">You save {savings}%</p>
              </div>
              <div className="mb-1">
                <span className="text-white/30 line-through text-lg">£{tradFee}</span>
                <p className="text-white/30 text-xs">Traditional fee</p>
              </div>
            </div>

            {/* Travellers + country selector */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-0 bg-[#111118] border border-white/10 rounded-xl overflow-hidden">
                <button
                  onClick={() => setTravellers(Math.max(1, travellers - 1))}
                  className="px-3 py-2.5 text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                  data-testid="btn-travellers-minus"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <div className="flex items-center gap-2 px-3 py-2.5 border-x border-white/10">
                  <Users className="h-4 w-4 text-white/40" />
                  <span className="font-bold text-sm w-3 text-center">{travellers}</span>
                </div>
                <button
                  onClick={() => setTravellers(Math.min(9, travellers + 1))}
                  className="px-3 py-2.5 text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                  data-testid="btn-travellers-plus"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <div className="flex items-center gap-2 bg-[#111118] border border-white/10 rounded-xl px-3 py-2.5">
                <Calendar className="h-4 w-4 text-white/40" />
                <span className="text-sm font-semibold">
                  {startDate && endDate
                    ? Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / 86400000)
                    : "—"}
                </span>
                <span className="text-white/30 text-xs">days</span>
              </div>

              <div className="flex items-center gap-2 bg-[#111118] border border-white/10 rounded-xl px-3 py-2.5">
                <span className="text-lg">{country.flag}</span>
                <span className="text-sm font-medium">{country.name}</span>
              </div>
            </div>

            {/* Included services */}
            <div className="bg-[#111118] border border-white/[0.08] rounded-2xl overflow-hidden divide-y divide-white/[0.05]">
              {[
                { icon: <Calendar className="h-4 w-4 text-[#7c5cfc]" />, title: "Auto-booking appointment", sub: "Appointment in 10 days or less", price: "£100" },
                { icon: <Users className="h-4 w-4 text-[#2db87e]" />, title: "Concierge assistance", sub: "Dedicated expert for your application", price: "£25" },
              ].map((s) => (
                <div key={s.title} className="flex items-center gap-3 px-4 py-3.5">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                    {s.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm">{s.title}</p>
                    <p className="text-white/40 text-xs mt-0.5">{s.sub}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-white/30 line-through text-sm">{s.price}</span>
                    <span className="bg-[#1a3d2b] text-[#2db87e] text-xs font-bold px-2.5 py-1 rounded-full">Free</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Date note */}
            <p className="text-white/30 text-xs leading-relaxed">
              Dates are required for visa processing only and can be changed within the visa validity period.
            </p>

            {/* Date pickers */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-white/40 text-xs font-semibold uppercase tracking-wider">Start date</label>
                <div className="relative">
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-[#111118] border border-white/10 rounded-xl px-3 py-3 text-sm text-white focus:outline-none focus:border-[#7c5cfc] appearance-none [color-scheme:dark]"
                    data-testid="input-start-date"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-white/40 text-xs font-semibold uppercase tracking-wider">End date</label>
                <div className="relative">
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-[#111118] border border-white/10 rounded-xl px-3 py-3 text-sm text-white focus:outline-none focus:border-[#7c5cfc] appearance-none [color-scheme:dark]"
                    data-testid="input-end-date"
                  />
                </div>
              </div>
            </div>

            {/* Required Documents */}
            <div className="bg-[#111118] border border-white/[0.08] rounded-2xl overflow-hidden">
              {/* Header */}
              <button
                onClick={() => setDocsOpen(!docsOpen)}
                className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/[0.02] transition-colors"
                data-testid="btn-toggle-documents"
              >
                <div className="flex items-center gap-3">
                  <span className="font-bold text-base">Required Documents</span>
                  <span className="bg-white/10 text-white/60 text-xs font-bold px-2.5 py-1 rounded-full">
                    {checkedDocs.size}/{requiredDocuments.length} selected
                  </span>
                </div>
                {docsOpen
                  ? <ChevronUp className="h-4 w-4 text-white/40" />
                  : <ChevronDown className="h-4 w-4 text-white/40" />
                }
              </button>

              {/* Document list */}
              {docsOpen && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-white/[0.04] border-t border-white/[0.06]">
                  {requiredDocuments.map((doc) => {
                    const checked = checkedDocs.has(doc.id);
                    return (
                      <button
                        key={doc.id}
                        onClick={() => toggleDoc(doc.id)}
                        className={`flex items-start gap-3 p-4 text-left transition-colors bg-[#111118] hover:bg-[#16161f] ${checked ? "bg-[#0f1f18]" : ""}`}
                        data-testid={`doc-checkbox-${doc.id}`}
                      >
                        {/* Checkbox */}
                        <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 mt-0.5 transition-all flex items-center justify-center ${checked ? "border-[#2db87e] bg-[#2db87e]" : "border-white/20"}`}>
                          {checked && (
                            <svg className="h-2.5 w-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <div>
                          <p className={`font-semibold text-sm ${checked ? "text-[#2db87e]" : "text-white/90"}`}>{doc.title}</p>
                          <p className="text-white/35 text-xs leading-relaxed mt-0.5">{doc.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Apply CTA */}
            <Link
              href={`/apply`}
              data-testid={`btn-apply-${country.slug}`}
              onClick={() => {
                sessionStorage.setItem("nuvisa_booking", JSON.stringify({
                  country: country.name,
                  slug: country.slug,
                  flag: country.flag,
                  travellers,
                  startDate,
                  endDate,
                  nuvisFee,
                  tradFee,
                  savings,
                  checkedDocs: Array.from(checkedDocs),
                }));
              }}
            >
              <button className="w-full bg-[#7c5cfc] hover:bg-[#6b4de8] text-white font-black text-base py-4 rounded-2xl transition-all hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-[#7c5cfc]/20">
                Apply Now — £{nuvisFee}
              </button>
            </Link>
            <p className="text-white/20 text-xs text-center">Flat fee · No hidden charges · 99.3% approval rate</p>
          </div>
        </div>
      </div>
    </div>
  );
}
