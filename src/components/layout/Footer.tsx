import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-[#050505] text-white py-16 md:py-24 border-t border-white/10">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-16">
          <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold max-w-3xl leading-tight">
            We believe quality travel can change your life.
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          <div className="flex flex-col gap-4">
            <h4 className="font-bold text-lg text-white">Company</h4>
            <Link href="/about" className="text-sm text-white/60 hover:text-white transition-colors">About Us</Link>
            <Link href="/careers" className="text-sm text-white/60 hover:text-white transition-colors">Careers</Link>
            <Link href="/press" className="text-sm text-white/60 hover:text-white transition-colors">Press</Link>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="font-bold text-lg text-white">Services</h4>
            <Link href="/how-it-works" className="text-sm text-white/60 hover:text-white transition-colors">How It Works</Link>
            <Link href="/countries" className="text-sm text-white/60 hover:text-white transition-colors">Destinations</Link>
            <Link href="/pricing" className="text-sm text-white/60 hover:text-white transition-colors">Pricing</Link>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="font-bold text-lg text-white">Support</h4>
            <Link href="/faq" className="text-sm text-white/60 hover:text-white transition-colors">FAQ</Link>
            <Link href="/contact" className="text-sm text-white/60 hover:text-white transition-colors">Contact Us</Link>
            <a href="mailto:support@nuvisa.co.uk" className="text-sm text-white/60 hover:text-white transition-colors">
              support@nuvisa.co.uk
            </a>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="font-bold text-lg text-white">Legal</h4>
            <Link href="/privacy" className="text-sm text-white/60 hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-sm text-white/60 hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <Link href="/" className="font-heading font-bold text-2xl tracking-tight">NuVisa</Link>
          <p className="text-sm text-white/40">
            © {new Date().getFullYear()} NuVisa. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
