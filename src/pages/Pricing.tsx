import { motion } from "framer-motion";
import { Link } from "wouter";
import { CheckCircle2, XCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Pricing() {
  return (
    <div className="flex flex-col min-h-screen pt-16 bg-[#0d0d0d] text-white">
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1554224155-1696413575b8?q=80&w=2070&auto=format&fit=crop" 
            alt="Pricing background" 
            className="w-full h-full object-cover opacity-20 grayscale blur-sm scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-transparent to-[#0d0d0d]"></div>
        </div>
        <div className="container mx-auto px-4 md:px-6 text-center max-w-3xl relative z-10">
          <h1 className="font-heading text-5xl md:text-7xl font-black mb-6 uppercase tracking-tighter">Transparent Pricing</h1>
          <p className="text-xl text-white/60 font-medium uppercase tracking-widest">
            One flat fee. Total peace of mind.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-card border-2 border-border p-8 rounded-3xl opacity-80"
            >
              <h3 className="text-2xl font-bold text-muted-foreground mb-2">Traditional Travel Agents</h3>
              <div className="text-4xl font-bold text-muted-foreground mb-6">£350+</div>
              <ul className="flex flex-col gap-4 mb-8">
                <li className="flex items-center gap-3 text-muted-foreground">
                  <XCircle className="h-5 w-5 text-destructive shrink-0" />
                  <span>Hidden translation fees</span>
                </li>
                <li className="flex items-center gap-3 text-muted-foreground">
                  <XCircle className="h-5 w-5 text-destructive shrink-0" />
                  <span>Extra charge for early appointments</span>
                </li>
                <li className="flex items-center gap-3 text-muted-foreground">
                  <XCircle className="h-5 w-5 text-destructive shrink-0" />
                  <span>Slow email-based document checking</span>
                </li>
                <li className="flex items-center gap-3 text-muted-foreground">
                  <XCircle className="h-5 w-5 text-destructive shrink-0" />
                  <span>No refund on rejection</span>
                </li>
              </ul>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-primary text-primary-foreground p-8 rounded-3xl shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 bg-accent text-accent-foreground px-4 py-1 text-sm font-bold rounded-bl-xl">MOST POPULAR</div>
              <h3 className="text-2xl font-bold mb-2">NuVisa</h3>
              <div className="text-5xl font-bold mb-2">£200 <span className="text-xl font-normal text-primary-foreground/70">flat fee</span></div>
              <p className="text-primary-foreground/80 mb-6">Everything you need to secure your Schengen visa.</p>
              
              <ul className="flex flex-col gap-4 mb-8">
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-accent shrink-0" />
                  <span>AI + Human document review</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-accent shrink-0" />
                  <span>Premium appointment booking (4-5 days)</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-accent shrink-0" />
                  <span>24/7 dedicated support team</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-accent shrink-0" />
                  <span>Free resubmission if rejected</span>
                </li>
              </ul>
              
              <Button asChild size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold h-14 text-base">
                <Link href="/apply" data-testid="btn-pricing-apply">Start Application <ArrowRight className="ml-2 h-5 w-5" /></Link>
              </Button>
            </motion.div>

          </div>
        </div>
      </section>
    </div>
  );
}
