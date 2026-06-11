import { motion } from "framer-motion";
import { Link } from "wouter";
import { 
  Star, ArrowRight, ArrowUpRight, CheckCircle2, ShieldCheck, 
  Lock, Award, ShoppingCart, FileEdit, UploadCloud, Calendar,
  ChevronRight, Info, Check, Plus, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { useEffect, useState } from "react";
import { supabase, type Country } from "@/lib/supabase";

// Real high-res assets from Unsplash
const heroImg = "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?q=80&w=2070&auto=format&fit=crop";
const childImg = "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop";
const couchImg = "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?q=80&w=2070&auto=format&fit=crop";
const folderImg = "https://images.unsplash.com/photo-1586769852044-692d6e671c0e?q=80&w=2070&auto=format&fit=crop";
const offerBg = "https://images.unsplash.com/photo-1471115853179-bb1d604434df?q=80&w=2070&auto=format&fit=crop";

const testimonials = [
  { name: "Karan T.", loc: "Edinburgh", text: "Nuvisa has been a real game-changer for our travel plan. The visa application process was very seamless, and we got an appointment in just 2 days." },
  { name: "Amit D.", loc: "Leicester", text: "This literally feels like having an entire army of visa experts who manages application and get your visas on time." },
  { name: "Imran N.", loc: "Manchester", text: "Everything went smooth and was extremely straight forward, saved lot of money compared to other providers." },
  { name: "Ananya R.", loc: "London", text: "I love the folks at Nuvisa, effective. Very impressed. I hope to get more countries." },
  { name: "Priya S.", loc: "Birmingham", text: "Got my Schengen visa in 5 days. The document checklist was super helpful, didn't miss a thing." },
  { name: "Rohit M.", loc: "Glasgow", text: "The team handled everything from forms to appointment booking. I just showed up at the embassy." },
  { name: "Neha K.", loc: "Leeds", text: "Best decision to go with Nuvisa. Saved hours of research and the support was amazing throughout." },
  { name: "Vikram P.", loc: "Bristol", text: "Applied on Monday, got visa on Friday. Couldn't believe how fast and smooth the process was." },
  { name: "Sneha J.", loc: "Nottingham", text: "They guided me through the entire application. Even helped with my hotel booking and travel insurance." },
  { name: "Arjun S.", loc: "Liverpool", text: "Third time using Nuvisa. Never going back to traditional agents. The pricing is transparent and fair." },
];

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 }
};

const stealColors = ["bg-[#ffff00]", "bg-[#ffb3c7]", "bg-[#d0f368]", "bg-[#f9ff8d]", "bg-[#7aa2ff]", "bg-[#ff9c6a]"];

const marqueeKeyframes = `
@keyframes marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
`;

export default function Home() {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [typingText, setTypingText] = useState("");
  const COUNTRY_NAMES = ["SPAIN", "BELGIUM", "FRANCE", "ITALY", "GERMANY", "NETHERLANDS", "SWITZERLAND", "PORTUGAL", "AUSTRIA", "GREECE", "SWEDEN", "DENMARK", "NORWAY", "POLAND", "HUNGARY"];

  useEffect(() => {
    let idx = 0;
    let charIdx = 0;
    let dir: 1 | -1 = 1;
    let timer: ReturnType<typeof setTimeout>;

    function tick() {
      const word = COUNTRY_NAMES[idx];
      if (dir === 1) {
        if (charIdx < word.length) {
          charIdx++;
          setTypingText(word.slice(0, charIdx));
          timer = setTimeout(tick, 80);
        } else {
          dir = -1;
          timer = setTimeout(tick, 2000);
        }
      } else {
        if (charIdx > 0) {
          charIdx--;
          setTypingText(word.slice(0, charIdx));
          timer = setTimeout(tick, 40);
        } else {
          dir = 1;
          idx = (idx + 1) % COUNTRY_NAMES.length;
          timer = setTimeout(tick, 300);
        }
      }
    }

    tick();
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from("countries")
        .select("*")
        .eq("is_active", true)
        .order("name");
      
      if (!error && data) {
        setCountries(data);
      }
      setLoading(false);
    }
    load();
  }, []);

  // Compute sections dynamically
  const featuredCountries = countries.slice(0, 9);
  
  const everydaySteals = [...countries]
    .sort((a, b) => a.price_nuvisa_fee - b.price_nuvisa_fee)
    .slice(0, 4)
    .map((c, i) => ({
      ...c,
      color: stealColors[i % stealColors.length]
    }));

  const topDestinations = countries
    .filter(c => c.popular)
    .slice(0, 4)
    .map((c, i) => ({
      ...c,
      color: stealColors[(i + 4) % stealColors.length]
    }));

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-[#7c5cfc]" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen w-full bg-[#0d0d0d] text-white selection:bg-[#7c5cfc] selection:text-white overflow-x-hidden font-sans">
      <style>{marqueeKeyframes}</style>
      
      {/* 1. Hero Section */}
      <section className="relative pt-16 pb-48 flex flex-col items-center">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="container mx-auto px-4 text-center z-10"
        >
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight mb-6 uppercase leading-tight">
            Don't Postpone<br />Your Happiness!
          </h1>
          


          <div className="relative max-w-6xl mx-auto">
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-20 text-center translate-y-1/2">
              <h2 className="text-4xl md:text-6xl lg:text-8xl font-black tracking-tighter opacity-90 uppercase min-h-[1.2em] drop-shadow-2xl">
                {typingText}<span className="animate-pulse ml-0.5 opacity-70">|</span>
              </h2>
            </div>
            <div className="rounded-[3rem] overflow-hidden aspect-[21/9] relative group shadow-2xl">
              <img src={heroImg} alt="Spain" className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80"></div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 2. Testimonials */}
      <section className="py-20 overflow-hidden">
        <div className="relative">
          <div className="flex gap-6" style={{ width: "max-content", animation: "marquee 40s linear infinite" }}
            onMouseEnter={e => (e.currentTarget.style.animationPlayState = "paused")}
            onMouseLeave={e => (e.currentTarget.style.animationPlayState = "running")}
          >
            {[...testimonials, ...testimonials].map((t, i) => (
              <div
                key={i}
                className="flex flex-col gap-3 w-[300px] h-[180px] shrink-0 border border-zinc-800 rounded-xl p-5 bg-black/60 backdrop-blur-sm whitespace-normal"
              >
                <div className="flex items-center gap-3 shrink-0">
                  <div className="w-9 h-9 rounded-full bg-zinc-700 flex items-center justify-center text-xs font-bold uppercase text-zinc-300 shrink-0">
                    {t.name[0]}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-medium text-zinc-200 truncate">{t.name}</h4>
                    <p className="text-xs text-zinc-500 truncate">{t.loc}</p>
                  </div>
                  <div className="ml-auto flex gap-0.5 shrink-0">
                    {[...Array(5)].map((_, j) => <Star key={j} className="h-3 w-3 fill-yellow-500 text-yellow-500" />)}
                  </div>
                </div>
                <p className="text-sm text-zinc-400 leading-relaxed line-clamp-4 whitespace-normal">"{t.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Klarna Banner */}
      <section className="container mx-auto px-4 mb-24">
        <motion.div 
          {...fadeInUp}
          className="bg-[#ffb3c7] rounded-[2.5rem] p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 text-[#0d0d0d] shadow-xl"
        >
          <div className="flex items-center gap-6">
            <div className="bg-black text-white px-5 py-2 rounded-lg font-black text-2xl tracking-tighter shadow-lg">Klarna.</div>
            <div>
              <h3 className="text-lg md:text-xl font-black leading-none uppercase tracking-tighter mb-2">Pay in small instalments with interest free financing!</h3>
              <p className="text-sm font-bold opacity-70 uppercase tracking-wide">Pay in 3 payments at 0% interest | No fees</p>
            </div>
          </div>
          <Button className="bg-[#0d0d0d] text-white hover:bg-black rounded-full px-6 h-10 font-black uppercase text-xs shadow-xl transition-transform hover:scale-105 active:scale-95">
            Learn More
          </Button>
        </motion.div>
      </section>

      {/* 4. Choose Your Country */}
      <section className="py-24 bg-[#0d0d0d]">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-16 items-start">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:w-1/3 lg:sticky lg:top-32"
            >
              <div className="rounded-[3.5rem] overflow-hidden aspect-[4/5] mb-10 shadow-2xl border-4 border-white/5">
                <img src={childImg} alt="Choose your country" className="w-full h-full object-cover shadow-inner" />
              </div>
              <h2 className="text-3xl md:text-4xl font-black mb-4 tracking-tighter uppercase leading-none">Choose Your Country</h2>
              <p className="text-white/40 font-bold uppercase tracking-widest text-[10px]">We support 20 countries over all the visa centres in the UK</p>
            </motion.div>

            <div className="lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {featuredCountries.map((c, i) => (
                <Link key={i} href={`/countries/${c.slug}`}>
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-white/5 border border-white/10 rounded-[2rem] p-5 flex flex-col gap-5 group hover:bg-white/10 transition-all cursor-pointer shadow-lg h-full"
                  >
                    <div className="h-32 bg-gray-800 rounded-2xl overflow-hidden shadow-inner">
                      <img src={c.image_url || "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?q=80&w=2070&auto=format&fit=crop"} alt={c.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-60 grayscale-[0.2]" />
                    </div>
                    <div>
                      <h4 className="text-[12px] font-black tracking-widest text-white/40 mb-1 uppercase">{c.name}</h4>
                      <p className="text-[10px] font-black text-white uppercase mb-1">Appointment in 10 days or less</p>
                      <p className="text-[10px] font-black text-white/40 uppercase tracking-wider">From £{c.price_nuvisa_fee}</p>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
          
          <div className="mt-20 flex flex-col items-center gap-10">
            <Link href="/countries">
              <Button variant="outline" className="rounded-full border-white/20 px-6 h-10 font-black uppercase text-[10px] tracking-widest hover:bg-white hover:text-black transition-all">
                See More <ChevronRight className="ml-1.5 h-3 w-3" />
              </Button>
            </Link>
            
            <Link href="/countries">
              <Button className="bg-[#7c5cfc] hover:bg-[#6b4ae0] text-white rounded-full px-10 h-12 text-sm font-black uppercase tracking-wider flex items-center gap-3 shadow-[0_0_40px_rgba(124,92,252,0.4)] transition-transform hover:scale-105 active:scale-95">
                Check Required Documents
                <div className="bg-white/20 rounded-full p-1.5">
                  <ArrowUpRight className="h-4 w-4" />
                </div>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Top Destinations */}
      <section className="overflow-hidden bg-[#0d0d0d] py-24">
        <div className="relative">
          <div className="max-w-7xl mx-auto px-4 mb-16">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-sm font-black text-white/50 uppercase tracking-[0.3em] mb-4">Top Picks</p>
                <h2 className="text-3xl md:text-5xl font-black tracking-tighter leading-none text-white">Top Destinations</h2>
              </div>
              <p className="hidden md:block text-xs font-black text-white/30 max-w-xs text-right uppercase tracking-[0.2em] leading-relaxed">Most-loved Schengen destinations travellers keep returning to.</p>
            </div>
          </div>

          <div className="flex gap-6 px-4 max-w-7xl mx-auto pb-8 overflow-x-auto snap-x snap-mandatory scrollbar-none">
            {topDestinations.map((d, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="snap-start shrink-0"
              >
                <Link href={`/countries/${d.slug}`}>
                  <div className="group relative w-[85vw] md:w-[320px] h-[420px] rounded-3xl overflow-hidden">
                    <img
                      src={d.image_url || "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?q=80&w=2070&auto=format&fit=crop"}
                      alt={d.name}
                      className="absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-2xl font-black text-white mb-1">{d.name}</h3>
                      <p className="text-sm text-white/70 font-semibold">From £{d.price_nuvisa_fee}</p>
                    </div>
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-black px-4 py-2 rounded-full uppercase tracking-wider">Explore</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Schengen Visa Offer */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={offerBg} alt="Background" className="w-full h-full object-cover opacity-30 grayscale blur-sm scale-110" />
          <div className="absolute inset-0 bg-gradient-to-br from-[#0a1128] via-[#111e47] to-[#1a2e72] opacity-95"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            {...fadeInUp}
            className="flex flex-col items-center text-center max-w-5xl mx-auto"
          >
            <div className="bg-white/10 backdrop-blur-md rounded-full px-6 py-2 text-[10px] font-black mb-10 tracking-[0.3em] uppercase border border-white/10">Norway</div>
            <h2 className="text-4xl md:text-5xl font-black mb-8 leading-[0.9] tracking-tighter uppercase">
              Get the Schengen visa<br />from just £30/month
            </h2>
            <p className="text-sm font-medium opacity-70 mb-10 max-w-2xl leading-relaxed uppercase tracking-wide">
              With 0% interest and no fees, split your payment in 3 and get access to 29 European countries costs less than a weekend eat-out.
            </p>
            
            <div className="bg-[#ffb3c7] text-[#0d0d0d] px-8 py-4 rounded-[1.5rem] font-black mb-20 flex items-center gap-4 cursor-pointer hover:scale-105 transition-all shadow-2xl">
              <span className="text-xl tracking-tighter">Klarna.</span>
              <span className="uppercase text-[11px] tracking-[0.1em]">Enjoy now. Pay later</span>
              <div className="bg-black/10 rounded-full p-1.5"><ChevronRight className="h-4 w-4" /></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 w-full border-t border-white/10 pt-20">
              <div className="flex flex-col items-center">
                <h3 className="text-4xl font-black mb-2 tracking-tighter">£30</h3>
                <p className="text-[10px] font-black opacity-40 uppercase tracking-[0.2em] leading-tight">Monthly cost you pay<br />for the Schengen visa</p>
              </div>
              <div className="flex flex-col items-center">
                <h3 className="text-4xl font-black mb-2 tracking-tighter leading-none">No fees</h3>
                <p className="text-[10px] font-black opacity-40 uppercase tracking-[0.2em] leading-tight">Pay absolutely no fees<br />& 0% interest</p>
              </div>
              <div className="flex flex-col items-center">
                <h3 className="text-4xl font-black mb-2 tracking-tighter leading-none">Flexible</h3>
                <p className="text-[10px] font-black opacity-40 uppercase tracking-[0.2em] leading-tight">Spread the cost over<br />3 small payments</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 7. FAQ Section */}
      <section className="py-24 bg-[#f5f0ff] text-[#0d0d0d] shadow-inner">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex flex-col md:flex-row justify-between items-start mb-20 gap-8">
            <div>
              <p className="text-[11px] font-black tracking-[0.3em] uppercase mb-6 opacity-30 text-[#7c5cfc]">FAQ</p>
              <h2 className="text-4xl font-black tracking-tighter uppercase leading-[0.9]">Empowering you with knowledge</h2>
            </div>
            <div className="bg-[#7c5cfc] rounded-full p-4 text-white cursor-pointer hover:rotate-45 transition-all shadow-xl">
              <ArrowUpRight className="h-8 w-8" />
            </div>
          </div>

          <div className="flex gap-8 mb-16 border-b border-black/5 pb-4">
            <span className="text-[11px] font-black text-[#7c5cfc] border-b-4 border-[#7c5cfc] pb-4 cursor-pointer uppercase tracking-[0.2em]">Eligibility & requirements</span>
            <span className="text-[11px] font-black opacity-30 hover:opacity-100 transition-opacity cursor-pointer uppercase tracking-[0.2em] pb-4">General Information</span>
          </div>

          <Accordion type="single" collapsible className="space-y-5">
            {[
              "What are the general documents required for a Schengen visa from the UK?",
              "What's the minimum bank balance required?",
              "Can I apply for Schengen visa if I am on visitor visa in the UK?"
            ].map((q, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border-none bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <AccordionTrigger className="px-10 py-8 hover:no-underline font-black text-left uppercase text-sm tracking-tight group">
                  <span className="group-hover:translate-x-2 transition-transform">{q}</span>
                </AccordionTrigger>
                <AccordionContent className="px-10 pb-8 opacity-50 font-bold uppercase text-[10px] leading-relaxed tracking-wider">
                  Detailed information about {q.toLowerCase()} will be provided here to ensure you have the best chance of approval. Our experts verify every detail.
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          
          <div className="mt-16 text-center">
            <Button variant="outline" className="rounded-full border-black/10 px-8 h-10 font-black hover:bg-[#0d0d0d] hover:text-white transition-all uppercase text-[10px] tracking-[0.2em]">
              See more
            </Button>
          </div>
        </div>
      </section>

      {/* 8. Process Driven */}
      <section className="py-32 bg-[#0d0d0d] text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start mb-28 gap-12">
            <div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-6 leading-[0.85] uppercase">We're process driven<br />Buckle up</h2>
            </div>
            <p className="text-[13px] font-bold opacity-40 max-w-lg leading-relaxed uppercase tracking-wider">Benefit from document pre-checks, error-proof form filling, and personalized visa guidance, powered by AI with human oversight at critical checkpoints - all designed to prevent delays, mistakes, and rejections.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
            {[
              { icon: ShoppingCart, title: "Checkout", desc: "Confirm the required documents and checkout to lay the foundation. Upload documents securely and complete your details as per your travel history, financial status & occupation." },
              { icon: FileEdit, title: "Build", desc: "Experienced professionals who know exactly what is needed and how to get it done right - review and create a complete application, allowing our customers to benefit from 99.3% approval rate." },
              { icon: UploadCloud, title: "Submit", desc: "Nuvisa books your appointment. Submit all gathered documents & provide biometrics details at your appointment. We will be with you every step of the way, providing ongoing support to maximise your success." },
              { icon: Calendar, title: "Approved", desc: "Your Schengen visa will be processed within 5-15 working days, and your passport complete with the Schengen tourist visa stamp will be delivered directly to your doorstep." }
            ].map((s, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-start gap-8 group"
              >
                <div className="bg-white/5 rounded-full p-4 border border-white/10 group-hover:bg-[#7c5cfc]/20 group-hover:border-[#7c5cfc]/40 transition-all shadow-lg">
                  <s.icon className="h-6 w-6 text-white group-hover:text-[#7c5cfc] transition-colors" />
                </div>
                <div>
                  <h3 className="text-2xl font-black mb-5 uppercase tracking-tighter leading-none">{s.title}</h3>
                  <p className="text-[12px] leading-relaxed opacity-40 font-bold uppercase tracking-wide">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. Everyday Steals */}
      <section className="overflow-hidden bg-[#0d0d0d] py-24">
        <div className="relative">
          <div className="max-w-7xl mx-auto px-4 mb-16">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-sm font-black text-white/50 uppercase tracking-[0.3em] mb-4">Best Value</p>
                <h2 className="text-3xl md:text-5xl font-black tracking-tighter leading-none text-white">Everyday Steals</h2>
              </div>
              <p className="hidden md:block text-xs font-black text-white/30 max-w-xs text-right uppercase tracking-[0.2em] leading-relaxed">A curated edit of handpicked countries for travellers who want to access Europe for less.</p>
            </div>
          </div>

          <div className="flex gap-6 px-4 max-w-7xl mx-auto pb-8 overflow-x-auto snap-x snap-mandatory scrollbar-none">
            {everydaySteals.map((d, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="snap-start shrink-0"
              >
                <Link href={`/countries/${d.slug}`}>
                  <div className="group relative w-[85vw] md:w-[320px] h-[420px] rounded-3xl overflow-hidden">
                    <img
                      src={d.image_url || "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?q=80&w=2070&auto=format&fit=crop"}
                      alt={d.name}
                      className="absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-2xl font-black text-white mb-1">{d.name}</h3>
                      <p className="text-sm text-white/70 font-semibold">From £{d.price_nuvisa_fee}</p>
                    </div>
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-black px-4 py-2 rounded-full uppercase tracking-wider">Explore</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. Extra Value Bar */}
      <section className="container mx-auto px-4 mb-20">
        <div className="bg-[#ffff00] rounded-[2.5rem] p-10 flex flex-col md:flex-row items-center justify-center gap-8 text-[#0d0d0d] shadow-2xl border-4 border-black/5">
          <div className="bg-[#0d0d0d] text-white p-3 rounded-2xl shadow-xl">
            <span className="font-black text-3xl tracking-tighter">nu</span>
          </div>
          <div className="text-center md:text-left">
            <h3 className="text-3xl font-black uppercase tracking-tighter leading-none mb-2">EXTRA VALUE: £50 off your plan ahead</h3>
            <p className="text-[11px] font-black opacity-50 uppercase tracking-[0.2em]">Lock in today to maximise savings on top destinations</p>
          </div>
        </div>
      </section>

      {/* 11. Season Grid */}
      <section className="py-24 bg-white text-[#0d0d0d]">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-16 items-stretch">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:w-1/3 rounded-[4rem] overflow-hidden relative group shadow-2xl border-8 border-black/5"
            >
              <img src={couchImg} alt="Travel seasons" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 shadow-inner" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-70"></div>
              <div className="absolute bottom-12 left-12 text-white max-w-[240px]">
                <p className="font-black text-3xl uppercase tracking-tighter leading-[0.9] mb-4">Save and bring your plans to life</p>
              </div>
            </motion.div>

            <div className="lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { name: "SUMMER '25", color: "bg-[#7aa2ff]", date: "15 JULY '25 - 15 SEPT '25" },
                { name: "AUTUMN HALF-TERM", color: "bg-[#ff9c6a]", date: "18 OCT '26 - 26 OCT '26" },
                { name: "HALLOWEEN BREAK", color: "bg-[#d0f368]", date: "18 OCT '26 - 26 OCT '26" },
                { name: "XMAS", color: "bg-[#ffb3c7]", date: "19 DEC '26 - 31 DEC '26" },
                { name: "NEW YEAR'S EVE", color: "bg-[#2e1d6e] text-white", date: "1 JAN '27 - 15 JAN '27" },
                { name: "EASTER '27", color: "bg-[#f9ff8d]", date: "15 MARCH - 12 APRIL" }
              ].map((s, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className={`${s.color} rounded-[2.5rem] p-10 flex flex-col justify-between h-56 cursor-pointer hover:scale-[1.03] transition-all shadow-xl hover:shadow-2xl group border border-black/5`}
                >
                  <h4 className="font-black text-3xl uppercase tracking-tighter leading-[0.85]">{s.name}</h4>
                  <p className="text-[11px] font-black opacity-40 tracking-[0.2em] uppercase leading-none">{s.date}</p>
                </motion.div>
              ))}
            </div>
          </div>
          
          <div className="mt-20 flex flex-col items-center">
            <Button className="bg-[#7c5cfc] hover:bg-[#6b4ae0] text-white rounded-full px-16 h-20 text-xl font-black uppercase tracking-wider flex items-center gap-4 shadow-[0_0_50px_rgba(124,92,252,0.4)] transition-transform hover:scale-105 active:scale-95">
              Check Required Documents
              <div className="bg-white/20 rounded-full p-2">
                <ArrowUpRight className="h-6 w-6" />
              </div>
            </Button>
          </div>
        </div>
      </section>

      {/* 12. Premium Service & Badges */}
      <section className="py-24 bg-white text-[#0d0d0d] border-t border-black/5">
        <div className="container mx-auto px-4 flex flex-col items-center">
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-20 text-center max-w-3xl uppercase leading-[0.85]">
            Premium service,<br />End-to-end encrypted
          </h2>
          
          <div className="flex flex-wrap justify-center gap-12 mb-32 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
            <div className="w-28 h-28 rounded-full border-4 border-[#0d0d0d]/10 flex flex-col items-center justify-center p-3 text-center leading-none hover:border-[#0d0d0d] transition-colors cursor-pointer shadow-sm">
              <span className="text-[11px] font-black uppercase mb-1">GDPR</span>
              <span className="text-[8px] font-black opacity-40 tracking-widest">COMPLIANT</span>
              <Star className="h-2.5 w-2.5 fill-[#0d0d0d] mt-3" />
            </div>
            <div className="w-28 h-28 rounded-full border-4 border-[#0d0d0d]/10 flex flex-col items-center justify-center p-3 text-center leading-none hover:border-[#0d0d0d] transition-colors cursor-pointer shadow-sm">
              <span className="text-3xl font-black mb-1">ico.</span>
              <Star className="h-2.5 w-2.5 fill-[#0d0d0d]" />
            </div>
            <div className="w-28 h-28 rounded-full border-4 border-[#0d0d0d]/10 flex flex-col items-center justify-center p-3 text-center leading-none hover:border-[#0d0d0d] transition-colors cursor-pointer shadow-sm">
              <span className="text-[11px] font-black uppercase mb-1">PCI-DSS</span>
              <span className="text-[8px] font-black opacity-40 tracking-widest">COMPLIANCE</span>
              <Check className="h-3 w-3 mt-3 stroke-[4]" />
            </div>
          </div>

          <motion.div 
            {...fadeInUp}
            className="w-full bg-[#d0f368] rounded-[5rem] p-16 md:p-24 relative overflow-hidden shadow-2xl border-8 border-black/5"
          >
            <div className="grid md:grid-cols-2 gap-20 items-center relative z-10">
              <div>
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-6 leading-[0.85] uppercase">
                  Reduce your odds of <span className="text-[#0d0d0d]/30 italic lowercase">rejection</span>
                </h2>
                <p className="text-sm font-bold opacity-60 mb-16 max-w-md uppercase tracking-wider leading-relaxed">
                  Benefit from document pre-checks, error-proof form filling, and personalised visa guidance, powered by AI with human oversight at critical checkpoints - all designed to prevent delays, mistakes, and rejections, all from a 99.3% approval rate.
                </p>
                <div className="flex gap-4 mb-12">
                  {[1, 2, 3].map((_, i) => (
                    <div key={i} className={`w-3 h-3 rounded-full ${i === 0 ? 'bg-black' : 'bg-black/10'}`} />
                  ))}
                </div>
                <Button className="bg-[#7c5cfc] hover:bg-[#6b4ae0] text-white rounded-full px-10 h-12 text-sm font-black uppercase tracking-wider flex items-center gap-3 shadow-xl transition-transform hover:scale-105 active:scale-95">
                  Start Application
                  <div className="bg-white/20 rounded-full p-1.5">
                    <ArrowUpRight className="h-4 w-4" />
                  </div>
                </Button>
              </div>
              <div className="relative aspect-square scale-110 md:scale-150 translate-x-12 translate-y-12 select-none pointer-events-none">
                <img src={folderImg} alt="Documents" className="w-full h-full object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.3)]" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 13. Price Match & Philosophy */}
      <section className="py-24 bg-white text-[#0d0d0d]">
        <div className="container mx-auto px-4 flex flex-col items-center">
          <div className="w-full max-w-5xl bg-[#16161f] text-white rounded-[4rem] p-16 md:p-20 mb-32 relative overflow-hidden group shadow-2xl border-4 border-white/5">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[#7c5cfc]/10 opacity-0 group-hover:opacity-100 transition-all duration-1000 blur-3xl pointer-events-none"></div>
            <div className="flex flex-col items-center text-center relative z-10">
              <div className="bg-white/5 rounded-full p-8 mb-10 border border-white/10 shadow-inner group-hover:bg-[#7c5cfc]/10 transition-colors">
                <Award className="h-14 w-14 text-[#7c5cfc]" />
              </div>
              <h3 className="text-2xl md:text-3xl font-black tracking-tighter mb-6 flex items-center gap-3 uppercase leading-none">
                The NuVisa Price Match Promise <Info className="h-5 w-5 opacity-30 cursor-help hover:opacity-100 transition-opacity" />
              </h3>
              <p className="text-sm md:text-xl opacity-40 max-w-3xl leading-relaxed font-bold uppercase tracking-wider">
                At Nuvisa, we promise to match any like-for-like Schengen visa price, so you can apply with peace of mind. In fact, we promise to match any like-for-like Schengen visa price, so you can apply with peace of mind.
              </p>
            </div>
          </div>

          <div className="text-center max-w-5xl mb-40">
            <h2 className="text-2xl md:text-4xl font-black tracking-tighter mb-6 uppercase leading-[0.9]">We believe quality travel can elevate your life.</h2>
            <p className="text-[11px] font-black opacity-30 italic uppercase tracking-[0.4em] leading-none">- Especially when they're transparent & affordably priced.</p>
          </div>

          <div className="flex flex-col items-center text-center mb-24">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-10 uppercase leading-[0.9]">
              Built for <span className="border-2 border-[#7c5cfc] rounded-full px-6 italic lowercase font-serif inline-block">approval</span>,<br />
              embassy-grade precision
            </h2>
            
            <Button className="bg-[#7c5cfc] hover:bg-[#6b4ae0] text-white rounded-full px-10 h-12 text-sm font-black uppercase tracking-[0.1em] flex items-center gap-3 shadow-[0_0_60px_rgba(124,92,252,0.5)] transition-all hover:scale-105 active:scale-95">
              Check Required Documents
              <div className="bg-white/20 rounded-full p-1.5 shadow-inner">
                <ArrowUpRight className="h-4 w-4" />
              </div>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
