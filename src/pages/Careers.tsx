import { Link } from "wouter";
import { useEffect } from "react";

export default function Careers() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="min-h-screen bg-black text-zinc-100">
      <div className="max-w-3xl mx-auto px-4 py-24">
        <h1 className="text-3xl font-semibold mb-4">Careers</h1>
        <p className="text-zinc-500 mb-12">Join us in building the future of frictionless travel.</p>

        <div className="border border-zinc-800 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-medium mb-2">Visa Processing Specialist</h2>
          <p className="text-zinc-500 text-sm mb-4">London, UK · Full-time</p>
          <p className="text-zinc-400 text-sm mb-4">Help our clients navigate the Schengen visa process with expert guidance and document review.</p>
          <span className="text-xs text-zinc-600 border border-zinc-800 rounded px-2 py-1">No open positions right now</span>
        </div>

        <div className="border border-zinc-800 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-medium mb-2">Full-Stack Engineer</h2>
          <p className="text-zinc-500 text-sm mb-4">London, UK · Full-time</p>
          <p className="text-zinc-400 text-sm mb-4">Build and improve the NuVisa platform — from our AI document checker to the customer portal.</p>
          <span className="text-xs text-zinc-600 border border-zinc-800 rounded px-2 py-1">No open positions right now</span>
        </div>

        <p className="text-zinc-600 text-sm mt-12">
          Don't see a role that fits?{" "}
          <a href="mailto:careers@nuvisa.co.uk" className="text-zinc-400 hover:text-zinc-200 transition-colors">Get in touch</a>
        </p>
      </div>
    </div>
  );
}
