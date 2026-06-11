import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, Clock, Loader2 } from "lucide-react";
import { supabase, type Country } from "@/lib/supabase";

const cardColors = [
  "#2563EB","#1D1D1D","#DC2626","#D97706","#F97316","#16A34A",
  "#0EA5E9","#991B1B","#B45309","#0F766E","#1D4ED8","#BE123C",
  "#155E75","#7C3AED","#4338CA","#9F1239","#166534","#1E3A5F","#DC2626","#1D4ED8",
];

export default function Countries() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="flex flex-col min-h-screen bg-[#0d0d0d] text-white">
      <section className="py-20 px-4 md:px-6 text-center max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="font-heading font-black text-5xl md:text-6xl mb-4">
            {loading ? "..." : countries.length} Countries
          </h1>
          <p className="text-white/50 text-lg">
            We support Schengen visa applications for all major European destinations. Click any country to see full details, document requirements, and apply.
          </p>
        </motion.div>
      </section>

      <section className="pb-20 px-4 md:px-6 max-w-7xl mx-auto w-full">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-[#7c5cfc]" />
          </div>
        ) : countries.length === 0 ? (
          <div className="text-center py-20 text-white/30">
            <p>No countries available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {countries.map((country, index) => {
              const color = cardColors[index % cardColors.length];
              return (
                <motion.div
                  key={country.slug}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.04 }}
                >
                  <Link href={`/countries/${country.slug}`} data-testid={`card-country-${country.slug}`}>
                    <div
                      className="group relative bg-[#111118] border border-white/[0.07] rounded-2xl p-5 flex flex-col gap-4 cursor-pointer hover:border-white/20 hover:-translate-y-1 transition-all duration-200"
                    >
                      {/* Country Image */}
                      <div className="h-32 bg-gray-800 rounded-xl overflow-hidden shadow-inner">
                        <img 
                          src={country.image_url || "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?q=80&w=2070&auto=format&fit=crop"} 
                          alt={country.name} 
                          className="w-full h-full object-cover opacity-60 grayscale-[0.2] group-hover:scale-110 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" 
                        />
                      </div>

                      <div className="flex items-start justify-between mt-1">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl" role="img" aria-label={country.name}>{country.flag}</span>
                          <div>
                            <h3 className="font-bold text-lg text-white leading-tight">{country.name}</h3>
                            <p className="text-white/40 text-xs">{country.visa_types || "Schengen Visa"}</p>
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-white/20 group-hover:text-white/60 group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" />
                      </div>

                      <div className="flex items-center gap-2 text-white/40 text-xs">
                        <Clock className="h-3.5 w-3.5" />
                        10–15 working days
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-white/[0.05]">
                        <span className="text-white/50 text-xs">{country.stay_duration || "Upto 90 Days"}</span>
                        <span
                          className="text-xs font-bold px-2.5 py-1 rounded-full"
                          style={{ backgroundColor: `${color}22`, color: color === "#1D1D1D" ? "#f5c842" : color }}
                        >
                          £{country.price_nuvisa_fee}
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
