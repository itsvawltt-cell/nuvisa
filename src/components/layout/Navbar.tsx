import { Link } from "wouter";
import { Menu, X, MessageCircle, Mail, PalmtreeIcon } from "lucide-react";
import { useState } from "react";
import nuvisaLogo from "@/assets/images/nuvisa-logo.png";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full" data-testid="header-navbar">
      {/* Top announcement bar */}
      <div className="w-full bg-[#111118] border-b border-white/[0.06] py-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <p className="text-[11px] text-white/60 tracking-wide">
            Faster processing, Dedicated support, Honestly priced{" "}
            <Link
              href="/pricing"
              className="text-[#7c5cfc] hover:text-[#9d7fff] underline underline-offset-2 transition-colors font-medium"
              data-testid="link-get-now"
            >
              Get now
            </Link>
          </p>
          <div className="hidden sm:flex items-center gap-5 text-[11px] text-white/50">
            <a
              href="https://wa.me/447388120901"
              className="flex items-center gap-1.5 hover:text-white/80 transition-colors"
              data-testid="link-whatsapp"
            >
              <MessageCircle className="h-3.5 w-3.5 text-[#25d366]" />
              +44 7388120901
            </a>
            <div className="w-px h-3 bg-white/20" />
            <a
              href="mailto:support@nuvisa.co.uk"
              className="flex items-center gap-1.5 hover:text-white/80 transition-colors"
              data-testid="link-support-email"
            >
              <Mail className="h-3.5 w-3.5" />
              support@nuvisa.co.uk
            </a>
          </div>
        </div>
      </div>

      {/* Main navbar */}
      <div className="w-full bg-[#16161f] border-b border-white/[0.08] backdrop-blur-md rounded-b-[50px]">
        <div className="max-w-7xl mx-auto px-4 flex h-20 items-center justify-between gap-4">

          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center gap-3" data-testid="link-home-logo">
            <img src={nuvisaLogo} alt="NuVisa" className="h-10 w-auto" />
          </Link>

          {/* Center tagline — desktop only */}
          <p className="hidden md:block text-white/80 text-[13px] font-medium tracking-wide flex-1 text-center">
            Schengen visa service for Indian residents in the UK
          </p>

          {/* Right actions */}
          <div className="hidden md:flex items-center gap-2 flex-shrink-0">
            {/* Holiday Packages button with "Coming Soon" badge */}
            <div className="relative">
              <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-[#2db87e] text-white text-[9px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap tracking-wide z-10">
                Coming Soon
              </span>
              <button
                className="flex items-center gap-2 bg-white/[0.06] hover:bg-white/10 border border-white/10 text-white text-[12px] font-medium px-4 py-2 rounded-full transition-all mt-1"
                data-testid="button-holiday-packages"
                disabled
              >
                <PalmtreeIcon className="h-4 w-4 text-[#f5c842]" />
                Holiday Packages
              </button>
            </div>

            {/* GET THE VISA */}
            <Link href="/apply" data-testid="button-get-visa">
              <button className="bg-[#1a7a4a] hover:bg-[#1e8f57] text-white text-[12px] font-bold px-5 py-2.5 rounded-full transition-all tracking-wide uppercase">
                GET THE VISA
              </button>
            </Link>

            {/* Login */}
            <Link
              href="/login"
              className="text-white/70 hover:text-white text-[13px] font-medium px-3 py-2 transition-colors"
              data-testid="link-login"
            >
              Login
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 text-white"
            onClick={() => setIsOpen(!isOpen)}
            data-testid="button-mobile-menu"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-[#16161f] border-b border-white/10 px-4 pb-5 pt-3">
          <p className="text-white/60 text-sm mb-4 border-b border-white/10 pb-3">
            Schengen visa service for Indian residents in the UK
          </p>
          <nav className="flex flex-col gap-1">
            {[
              { href: "/countries", label: "Countries" },
              { href: "/how-it-works", label: "How It Works" },
              { href: "/pricing", label: "Pricing" },
              { href: "/about", label: "About" },
              { href: "/faq", label: "FAQ" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-white/80 block px-2 py-2.5 hover:bg-white/5 rounded-lg"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-white/10">
              <Link
                href="/login"
                className="text-sm font-medium text-white/70 px-2"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
              <Link href="/apply" onClick={() => setIsOpen(false)}>
                <button className="w-full bg-[#1a7a4a] hover:bg-[#1e8f57] text-white text-sm font-bold py-3 rounded-full uppercase tracking-wide">
                  GET THE VISA
                </button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
