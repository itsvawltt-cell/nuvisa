import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "wouter";
import {
  CheckCircle2, ArrowLeft, Users, Calendar,
  Shield, Clock, ChevronRight, User, Mail, Home,
  CreditCard, Lock, AlertCircle, Phone, Check
} from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

/* ─────────────────────────────────────────────── types */
interface BookingData {
  country: string; slug: string; flag: string;
  travellers: number; startDate: string; endDate: string;
  nuvisFee: string; tradFee: string; savings: number;
  checkedDocs: string[];
}

const applicantSchema = z.object({
  name:           z.string().min(2,  "Full name is required"),
  email:          z.string().email(  "Valid email is required"),
  phone:          z.string().min(7,  "Phone number is required"),
  address:        z.string().min(5,  "UK address is required"),
  passportNumber: z.string().min(5,  "Passport number is required"),
  dateOfBirth:    z.string().min(1,  "Date of birth is required"),
});
type ApplicantForm = z.infer<typeof applicantSchema>;

/* ─────────────────────────────────────────────── helpers */
const NUVISA_FEE  = 200;
const EMBASSY_FEE = 78;

function fmt(d: string) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}
function nights(a: string, b: string) {
  if (!a || !b) return 0;
  return Math.max(0, Math.ceil((new Date(b).getTime() - new Date(a).getTime()) / 86400000));
}

/* ─────────────────────────────────────────────── SVG logos */
const VisaLogo = () => (
  <svg viewBox="0 0 50 16" className="h-4" fill="none" xmlns="http://www.w3.org/2000/svg">
    <text x="0" y="14" fontFamily="Arial,sans-serif" fontWeight="900" fontSize="14" fill="white" letterSpacing="-0.5">VISA</text>
  </svg>
);
const MastercardLogo = () => (
  <svg viewBox="0 0 50 16" className="h-4" fill="none" xmlns="http://www.w3.org/2000/svg">
    <text x="0" y="14" fontFamily="Arial,sans-serif" fontWeight="900" fontSize="14" fill="white">MC</text>
  </svg>
);
const AmexLogo = () => (
  <svg viewBox="0 0 55 16" className="h-4" fill="none" xmlns="http://www.w3.org/2000/svg">
    <text x="0" y="14" fontFamily="Arial,sans-serif" fontWeight="900" fontSize="11" fill="white">AMEX</text>
  </svg>
);

const KlarnaLogo = () => (
  <svg viewBox="0 0 80 28" className="h-5" fill="none" xmlns="http://www.w3.org/2000/svg">
    <text x="0" y="22" fontFamily="'Klarna Sans',Arial,sans-serif" fontWeight="700" fontSize="22" fill="#17120f" letterSpacing="-0.5">klarna</text>
  </svg>
);

/* ─────────────────────────────────────────────── progress steps */
const STEPS = ["Details", "Review", "Payment"];
function ProgressBar({ active }: { active: number }) {
  return (
    <div className="flex items-center gap-0 mb-10 border-b border-zinc-800">
      {STEPS.map((s, i) => (
        <div key={s} className={`flex items-center gap-2 pb-3 pr-8 border-b-2 transition-colors ${i <= active ? "border-zinc-100" : "border-transparent"}`}>
          <span className={`text-sm font-medium ${i <= active ? "text-zinc-100" : "text-zinc-600"}`}>{s}</span>
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────── main */
export default function Apply() {
  const [booking,          setBooking]          = useState<BookingData | null>(null);
  const [step,             setStep]             = useState<"details"|"review"|"payment"|"done">("details");
  const [currentApplicant, setCurrentApplicant] = useState(0);
  const [applicants,       setApplicants]       = useState<ApplicantForm[]>([]);
  const [country,          setCountry]          = useState("");
  const [travellers,       setTravellers]       = useState(1);

  /* payment state */
  const [payEmail, setPayEmail] = useState("");
  const [payPhone, setPayPhone] = useState("");
  const [payMethod, setPayMethod] = useState<"card"|"klarna"|null>(null);
  const [paying,    setPaying]   = useState(false);
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");

  useEffect(() => {
    const raw = sessionStorage.getItem("nuvisa_booking");
    if (raw) {
      try {
        const d: BookingData = JSON.parse(raw);
        setBooking(d); setCountry(d.country); setTravellers(d.travellers ?? 1);
      } catch {}
    } else {
      const p = new URLSearchParams(window.location.search);
      setCountry(p.get("country") || "");
    }
  }, []);

  /* pre-fill payment contact from applicant 1 */
  useEffect(() => {
    if (applicants[0]) {
      setPayEmail(applicants[0].email);
      setPayPhone(applicants[0].phone);
    }
  }, [applicants]);

  const form = useForm<ApplicantForm>({
    resolver: zodResolver(applicantSchema),
    defaultValues: { name:"", email:"", phone:"", address:"", passportNumber:"", dateOfBirth:"" },
  });

  function onSubmitApplicant(values: ApplicantForm) {
    const next = [...applicants]; next[currentApplicant] = values; setApplicants(next);
    if (currentApplicant < travellers - 1) { setCurrentApplicant(currentApplicant + 1); form.reset(); }
    else setStep("review");
  }

  function handlePay() {
    if (!payMethod) return;
    setPaying(true);
    setTimeout(() => { setPaying(false); setStep("done"); }, 1800);
  }

  const totalFee = booking ? Number(booking.nuvisFee) : (NUVISA_FEE + EMBASSY_FEE) * travellers;
  const tripNights = booking ? nights(booking.startDate, booking.endDate) : 0;

  const stepIdx = { details: 0, review: 1, payment: 2, done: 3 }[step];

  /* ── DONE ─────────────────────────────── */
  if (step === "done") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="border border-zinc-800 rounded-lg p-10 max-w-md w-full">
          <div className="flex flex-col items-center text-center gap-6">
            <div className="w-12 h-12 rounded-full border border-zinc-700 flex items-center justify-center">
              <Check className="h-5 w-5 text-zinc-300" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-zinc-100 mb-1">Payment confirmed</h2>
              <p className="text-zinc-500 text-sm leading-relaxed">
                Your visa application is being processed. Check your email for portal access to upload documents.
              </p>
            </div>
            {booking && (
              <div className="w-full border border-zinc-800 rounded-md p-3 flex items-center gap-3">
                <span className="text-xl">{booking.flag}</span>
                <div className="text-left">
                  <p className="text-sm font-medium text-zinc-200">{booking.country} — Schengen Visa</p>
                  <p className="text-xs text-zinc-500">{booking.travellers} traveller{booking.travellers > 1 ? "s" : ""} · {fmt(booking.startDate)} – {fmt(booking.endDate)}</p>
                </div>
              </div>
            )}
            <a href="https://nuvisa.stampmyvisa.com" target="_blank" rel="noreferrer"
              className="w-full bg-zinc-100 hover:bg-zinc-200 text-zinc-900 font-medium py-2.5 rounded-md text-sm transition-colors text-center"
              data-testid="btn-portal-link">
              Go to portal →
            </a>
            <Link href="/" className="text-zinc-600 hover:text-zinc-400 text-xs transition-colors">Back home</Link>
          </div>
        </div>
      </div>
    );
  }

  /* ── PAYMENT ──────────────────────────── */
  if (step === "payment") {
    return (
      <div className="min-h-screen bg-black text-zinc-100">
        <div className="max-w-3xl mx-auto px-4 py-12">
          <button onClick={() => setStep("review")} className="text-zinc-500 hover:text-zinc-300 text-sm mb-8 transition-colors" data-testid="btn-back-review">
            ← Back
          </button>
          <ProgressBar active={2} />

          <div className="grid md:grid-cols-[1fr_280px] gap-10 items-start">

            <div className="flex flex-col gap-6">

              <div className="border border-zinc-800 rounded-lg p-5">
                <p className="text-xs text-zinc-500 font-medium mb-4 uppercase tracking-wider">Contact</p>
                <div className="flex flex-col gap-3">
                  <input
                    type="email"
                    value={payEmail}
                    onChange={e => setPayEmail(e.target.value)}
                    placeholder="Email address"
                    className="w-full bg-transparent border border-zinc-800 rounded-md px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors"
                    data-testid="input-pay-email"
                  />
                  <input
                    type="tel"
                    value={payPhone}
                    onChange={e => setPayPhone(e.target.value)}
                    placeholder="Phone number"
                    className="w-full bg-transparent border border-zinc-800 rounded-md px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors"
                    data-testid="input-pay-phone"
                  />
                </div>
              </div>

              <div className="border border-zinc-800 rounded-lg p-5">
                <p className="text-xs text-zinc-500 font-medium mb-4 uppercase tracking-wider">Payment method</p>
                <div className="flex flex-col gap-2">

                  <div
                    className={`border rounded-md transition-all overflow-hidden ${payMethod === "card" ? "border-zinc-500" : "border-zinc-800 hover:border-zinc-700"}`}
                  >
                    <button onClick={() => setPayMethod("card")} className="w-full">
                      <div className="flex items-center justify-between px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-all ${payMethod === "card" ? "border-zinc-300" : "border-zinc-700"}`}>
                            {payMethod === "card" && <div className="w-2 h-2 rounded-full bg-zinc-300" />}
                          </div>
                          <CreditCard className="h-4 w-4 text-zinc-400" />
                          <span className="text-sm font-medium text-zinc-200">Card</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <VisaLogo />
                          <MastercardLogo />
                          <AmexLogo />
                        </div>
                      </div>
                    </button>
                    {payMethod === "card" && (
                      <div className="border-t border-zinc-800 px-4 py-3 flex flex-col gap-3">
                        <input
                          value={cardName}
                          onChange={e => setCardName(e.target.value)}
                          placeholder="Cardholder name"
                          className="w-full bg-transparent border border-zinc-800 rounded-md px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors"
                        />
                        <div className="relative">
                          <input
                            value={cardNumber}
                            onChange={e => setCardNumber(e.target.value.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim().slice(0, 19))}
                            placeholder="Card number"
                            className="w-full bg-transparent border border-zinc-800 rounded-md px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors font-mono"
                          />
                          <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <VisaLogo />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <input
                            value={cardExpiry}
                            onChange={e => {
                              const v = e.target.value.replace(/\D/g, "").slice(0, 4);
                              setCardExpiry(v.length > 2 ? `${v.slice(0, 2)}/${v.slice(2)}` : v);
                            }}
                            placeholder="MM/YY"
                            className="w-full bg-transparent border border-zinc-800 rounded-md px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors font-mono"
                          />
                          <input
                            value={cardCvc}
                            onChange={e => setCardCvc(e.target.value.replace(/\D/g, "").slice(0, 4))}
                            placeholder="CVC"
                            className="w-full bg-transparent border border-zinc-800 rounded-md px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors font-mono"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div
                    className={`border rounded-md transition-all overflow-hidden ${payMethod === "klarna" ? "border-zinc-500" : "border-zinc-800 hover:border-zinc-700"}`}
                  >
                    <button onClick={() => setPayMethod("klarna")} className="w-full">
                      <div className="flex items-center justify-between px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-all ${payMethod === "klarna" ? "border-zinc-300" : "border-zinc-700"}`}>
                            {payMethod === "klarna" && <div className="w-2 h-2 rounded-full bg-zinc-300" />}
                          </div>
                          <span className="text-sm font-medium text-zinc-200">Klarna</span>
                        </div>
                        <span className="text-xs text-zinc-500">Pay later</span>
                      </div>
                    </button>
                    {payMethod === "klarna" && (
                      <div className="border-t border-zinc-800 px-4 py-3">
                        <p className="text-sm text-zinc-300 mb-2">3 interest-free payments</p>
                        <div className="grid grid-cols-3 gap-2">
                          {[1, 2, 3].map(n => (
                            <div key={n} className="border border-zinc-800 rounded-md p-2.5 text-center">
                              <p className="text-zinc-500 text-xs mb-0.5">Payment {n}</p>
                              <p className="font-medium text-zinc-200 text-sm">£{(totalFee / 3).toFixed(2)}</p>
                              <p className="text-zinc-600 text-xs">{n === 1 ? "Now" : `+${(n-1)*30}d`}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                </div>
              </div>

              <button
                onClick={handlePay}
                disabled={!payMethod || !payEmail || !payPhone || (payMethod === "card" && (!cardName || !cardNumber || !cardExpiry || !cardCvc)) || paying}
                className="w-full bg-zinc-100 hover:bg-zinc-200 text-zinc-900 font-medium py-2.5 rounded-md text-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                data-testid="btn-pay-now"
              >
                {paying ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                    </svg>
                    Processing…
                  </span>
                ) : (
                  `Pay £${totalFee.toFixed(2)}`
                )}
              </button>

              <p className="text-zinc-600 text-xs text-center">Secured by Stripe · 256-bit SSL</p>
            </div>

            <div>
              <OrderSummary booking={booking} country={country} travellers={travellers} totalFee={totalFee} tripNights={tripNights} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── REVIEW ───────────────────────────── */
  if (step === "review") {
    return (
      <div className="min-h-screen bg-black text-zinc-100">
        <div className="max-w-3xl mx-auto px-4 py-12">
          <button onClick={() => setStep("details")} className="text-zinc-500 hover:text-zinc-300 text-sm mb-8 transition-colors" data-testid="btn-back-details">
            ← Back
          </button>
          <ProgressBar active={1} />
          <h1 className="text-lg font-semibold mb-8">Review your application</h1>

          <div className="grid md:grid-cols-[1fr_280px] gap-10 items-start">
            <div className="flex flex-col gap-3">
              {applicants.map((a, i) => (
                <div key={i} className="border border-zinc-800 rounded-lg p-4">
                  <p className="text-xs text-zinc-500 font-medium mb-4 uppercase tracking-wider">
                    Applicant {i + 1}{travellers > 1 ? ` of ${travellers}` : ""}
                  </p>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                    {[
                      { label: "Full name",     value: a.name },
                      { label: "Email",         value: a.email },
                      { label: "Phone",         value: a.phone },
                      { label: "Date of birth", value: a.dateOfBirth },
                      { label: "Address",       value: a.address },
                      { label: "Passport no.",  value: a.passportNumber },
                    ].map(f => (
                      <div key={f.label}>
                        <p className="text-zinc-500 text-xs">{f.label}</p>
                        <p className="text-zinc-200 break-all">{f.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <p className="text-zinc-600 text-xs leading-relaxed px-1">
                By continuing, you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <OrderSummary booking={booking} country={country} travellers={travellers} totalFee={totalFee} tripNights={tripNights} />
              <button
                onClick={() => setStep("payment")}
                className="w-full bg-zinc-100 hover:bg-zinc-200 text-zinc-900 font-medium py-2.5 rounded-md text-sm transition-colors"
                data-testid="btn-go-payment"
              >
                Continue →
              </button>
              <p className="text-zinc-600 text-xs text-center">256-bit SSL encrypted</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── DETAILS FORM ─────────────────────── */
  return (
    <div className="min-h-screen bg-black text-zinc-100">
      <div className="max-w-3xl mx-auto px-4 py-12">
        {booking && (
          <Link href={`/countries/${booking.slug}`} className="text-zinc-500 hover:text-zinc-300 text-sm mb-8 inline-block transition-colors" data-testid="link-back-country">
            ← Back to {booking.country}
          </Link>
        )}
        <ProgressBar active={0} />

        <div className="grid md:grid-cols-[1fr_280px] gap-10 items-start">
          <div className="flex flex-col gap-5">
            {travellers > 1 && (
              <div className="border border-zinc-800 rounded-lg px-4 py-3">
                <p className="text-sm text-zinc-400">Applicant <span className="font-medium text-zinc-200">{currentApplicant + 1}</span><span className="text-zinc-600"> of {travellers}</span></p>
              </div>
            )}

            <div className="border border-zinc-800 rounded-lg p-5">
              <h2 className="text-sm font-medium mb-5 text-zinc-300">
                {travellers > 1 ? `Applicant ${currentApplicant + 1} Details` : "Your Details"}
              </h2>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmitApplicant)} className="flex flex-col gap-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <FormField control={form.control} name="name" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-zinc-500 text-xs">Full Name (as on passport)</FormLabel>
                        <FormControl>
                          <input {...field} placeholder="Rahul Sharma" data-testid="input-name"
                            className="w-full bg-transparent border border-zinc-800 rounded-md px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors" />
                        </FormControl>
                        <FormMessage className="text-red-400 text-xs" />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="email" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-zinc-500 text-xs">Email Address</FormLabel>
                        <FormControl>
                          <input {...field} type="email" placeholder="rahul@example.com" data-testid="input-email"
                            className="w-full bg-transparent border border-zinc-800 rounded-md px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors" />
                        </FormControl>
                        <FormMessage className="text-red-400 text-xs" />
                      </FormItem>
                    )} />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <FormField control={form.control} name="phone" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-zinc-500 text-xs">UK Phone Number</FormLabel>
                        <FormControl>
                          <input {...field} type="tel" placeholder="+44 7700 900000" data-testid="input-phone"
                            className="w-full bg-transparent border border-zinc-800 rounded-md px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors" />
                        </FormControl>
                        <FormMessage className="text-red-400 text-xs" />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="dateOfBirth" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-zinc-500 text-xs">Date of Birth</FormLabel>
                        <FormControl>
                          <input {...field} type="date" data-testid="input-dob"
                            className="w-full bg-transparent border border-zinc-800 rounded-md px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-zinc-500 transition-colors [color-scheme:dark]" />
                        </FormControl>
                        <FormMessage className="text-red-400 text-xs" />
                      </FormItem>
                    )} />
                  </div>

                  <FormField control={form.control} name="address" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-zinc-500 text-xs">UK Address</FormLabel>
                      <FormControl>
                        <input {...field} placeholder="123 London Road, London, SW1A 1AA" data-testid="input-address"
                          className="w-full bg-transparent border border-zinc-800 rounded-md px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors" />
                      </FormControl>
                      <FormMessage className="text-red-400 text-xs" />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="passportNumber" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-zinc-500 text-xs">Indian Passport Number</FormLabel>
                      <FormControl>
                        <input {...field} placeholder="Z1234567" data-testid="input-passport"
                          className="w-full bg-transparent border border-zinc-800 rounded-md px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors uppercase" />
                      </FormControl>
                      <FormMessage className="text-red-400 text-xs" />
                    </FormItem>
                  )} />

                  <button type="submit" data-testid="btn-next-applicant"
                    className="w-full bg-zinc-100 hover:bg-zinc-200 text-zinc-900 font-medium py-2.5 rounded-md text-sm transition-colors mt-2">
                    {currentApplicant < travellers - 1
                      ? `Save & Continue (${currentApplicant + 2}/${travellers})`
                      : "Review →"}
                  </button>
                </form>
              </Form>
            </div>
          </div>

          <div>
            <OrderSummary booking={booking} country={country} travellers={travellers} totalFee={totalFee} tripNights={tripNights} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────── order summary */
function OrderSummary({ booking, country, travellers, totalFee, tripNights }: {
  booking: BookingData | null; country: string;
  travellers: number; totalFee: number; tripNights: number;
}) {
  const flag = booking?.flag ?? "🌍";
  const dest = booking?.country ?? country ?? "Schengen";

  return (
    <div className="border border-zinc-800 rounded-lg overflow-hidden">
      <div className="border-b border-zinc-800 px-4 py-3 flex items-center gap-3">
        <span className="text-xl">{flag}</span>
        <div>
          <p className="text-sm font-medium text-zinc-200">{dest}</p>
          <p className="text-zinc-500 text-xs">Schengen Visa · NuVisa</p>
        </div>
      </div>

      <div className="px-4 py-3 flex flex-col gap-2.5 border-b border-zinc-800">
        <RowSmall icon={<Users className="h-3 w-3" />} label="Travellers" value={`${travellers} person${travellers > 1 ? "s" : ""}`} />
        {booking?.startDate && (
          <RowSmall icon={<Calendar className="h-3 w-3" />} label="Dates"
            value={`${fmt(booking.startDate)} – ${fmt(booking.endDate)}`} />
        )}
        {tripNights > 0 && (
          <RowSmall icon={<Clock className="h-3 w-3" />} label="Duration" value={`${tripNights} nights`} />
        )}
      </div>

      <div className="px-4 py-3 flex flex-col gap-2 border-b border-zinc-800">
        {[
          { label: "NuVisa service fee",          amount: NUVISA_FEE * travellers,  free: false },
          { label: "Embassy fee (paid in person)", amount: EMBASSY_FEE * travellers, free: false },
          { label: "Travel insurance guidance",    amount: 0,  free: true },
          { label: "Auto-booking appointment",     amount: 0,  free: true },
          { label: "Concierge assistance",         amount: 0,  free: true },
        ].map(item => (
          <div key={item.label} className="flex items-center justify-between text-xs">
            <span className="text-zinc-500">{item.label}</span>
            {item.free
              ? <span className="text-zinc-400 text-xs">Free</span>
              : <span className="font-medium text-zinc-200">£{item.amount.toFixed(2)}</span>}
          </div>
        ))}
      </div>

      <div className="px-4 py-3 flex items-center justify-between border-b border-zinc-800">
        <div>
          <p className="text-zinc-500 text-xs">Total due today</p>
          <p className="text-lg font-semibold text-zinc-100">£{totalFee.toFixed(2)}</p>
        </div>
        {booking?.savings ? (
          <span className="text-zinc-400 text-xs border border-zinc-700 rounded px-2 py-1">Save {booking.savings}%</span>
        ) : null}
      </div>

      <div className="px-4 py-3">
        <div className="flex items-start gap-2">
          <AlertCircle className="h-3 w-3 text-zinc-600 flex-shrink-0 mt-0.5" />
          <p className="text-zinc-600 text-xs leading-relaxed">
            Embassy fee of £{EMBASSY_FEE * travellers} is paid in person on the appointment day.
          </p>
        </div>
      </div>
    </div>
  );
}

function RowSmall({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-xs">
      <div className="flex items-center gap-1.5 text-zinc-500">{icon}{label}</div>
      <span className="text-zinc-300">{value}</span>
    </div>
  );
}
