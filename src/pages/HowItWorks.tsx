import { motion } from "framer-motion";
import { Link } from "wouter";
import { Upload, Cpu, UserCheck, CalendarDays, PlaneTakeoff, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HowItWorks() {
  const steps = [
    {
      icon: <Upload className="h-8 w-8 text-[#7c5cfc]" />,
      title: "1. Upload Documents",
      description: "Answer a few questions and securely upload your passport, BRP, bank statements, and travel plans to our portal.",
    },
    {
      icon: <Cpu className="h-8 w-8 text-[#7c5cfc]" />,
      title: "2. AI Validation",
      description: "Our system instantly checks your documents against specific embassy requirements, flagging any missing pages or issues immediately.",
    },
    {
      icon: <UserCheck className="h-8 w-8 text-[#7c5cfc]" />,
      title: "3. Human Review",
      description: "A dedicated visa expert reviews your file, translates any necessary documents, and ensures your application is bulletproof.",
    },
    {
      icon: <CalendarDays className="h-8 w-8 text-[#7c5cfc]" />,
      title: "4. Appointment Booking",
      description: "We monitor cancellation slots 24/7 to secure an early embassy appointment for your biometrics.",
    },
    {
      icon: <PlaneTakeoff className="h-8 w-8 text-[#7c5cfc]" />,
      title: "5. Visa Granted",
      description: "Attend your appointment with a perfectly organized file. Get your passport back with the visa, and start packing.",
    }
  ];

  return (
    <div className="flex flex-col min-h-screen pt-16 bg-[#0d0d0d] text-white">
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1530521954074-e64f6810b32d?q=80&w=2070&auto=format&fit=crop" 
            alt="Process background" 
            className="w-full h-full object-cover opacity-20 grayscale blur-sm scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-transparent to-[#0d0d0d]"></div>
        </div>
        <div className="container mx-auto px-4 md:px-6 text-center max-w-3xl relative z-10">
          <h1 className="font-heading text-5xl md:text-7xl font-black mb-6 uppercase tracking-tighter">How It Works</h1>
          <p className="text-xl text-white/60 font-medium uppercase tracking-widest">
            A streamlined, transparent process designed for speed.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <div className="flex flex-col gap-12 relative before:absolute before:inset-0 before:ml-[28px] md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:-translate-x-px md:before:-translate-x-0 before:bg-border">
            {steps.map((step, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                className={`relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active`}
              >
                <div className="flex items-center justify-center w-14 h-14 rounded-full border-4 border-background bg-accent text-accent-foreground shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow z-10">
                  {step.icon}
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] bg-card border border-border p-6 rounded-2xl shadow-sm">
                  <h3 className="font-bold text-xl text-foreground mb-3">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6 text-center max-w-2xl">
          <h2 className="font-heading text-3xl font-bold text-primary mb-6">Ready to stop worrying?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of successful applicants who got their Schengen visa through NuVisa.
          </p>
          <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold h-14 px-8 text-base">
            <Link href="/apply" data-testid="cta-howitworks">Start Application <ArrowRight className="ml-2 h-5 w-5" /></Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
