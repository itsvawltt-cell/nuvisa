import { Link } from "wouter";

export default function About() {
  return (
    <div className="flex flex-col min-h-screen pt-16 bg-[#0d0d0d] text-white">
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=2070&auto=format&fit=crop" 
            alt="Travel background" 
            className="w-full h-full object-cover opacity-20 grayscale blur-sm scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-transparent to-[#0d0d0d]"></div>
        </div>
        <div className="container mx-auto px-4 md:px-6 text-center max-w-3xl relative z-10">
          <h1 className="font-heading text-5xl md:text-7xl font-black mb-6 uppercase tracking-tighter">About NuVisa</h1>
          <p className="text-xl text-white/60 font-medium uppercase tracking-widest">
            Building the future of frictionless travel.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl prose prose-slate dark:prose-invert lg:prose-lg">
          <h2 className="text-primary font-heading font-bold">Our Story</h2>
          <p>
            NuVisa was born out of pure frustration. As Indian citizens living in the UK, we found ourselves constantly blocked by the bureaucracy of Schengen visa applications. Every weekend trip to Paris or business meeting in Berlin meant weeks of anxiety, outdated travel agent websites, hidden fees, and confusing document checklists.
          </p>
          <p>
            The existing solutions were broken. Travel agents charged exorbitant fees for basic email forwarding. Doing it yourself meant risking rejection over a missing signature or an incorrectly sized photo.
          </p>
          <p>
            We realized that visa processing isn't magic—it's just highly specific rules that need to be followed perfectly. So we built a system that does exactly that.
          </p>

          <h2 className="text-primary font-heading font-bold">The NuVisa Difference</h2>
          <p>
            We combine cutting-edge AI document validation with expert human review. Our system instantly flags errors that would normally cause a rejection, allowing our team of visa experts to focus on the nuance of your application rather than basic data entry.
          </p>
          
          <h2 className="text-primary font-heading font-bold">Our Mission</h2>
          <p>
            Our mission is to make global mobility frictionless for Indian professionals. Your passport shouldn't dictate your ability to explore, connect, and grow. We're starting with Schengen visas in the UK, but our vision is a world where border bureaucracy is handled instantly and transparently.
          </p>
        </div>
      </section>
    </div>
  );
}
