import { Link } from "wouter";
import { useEffect } from "react";

export default function Press() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="min-h-screen bg-black text-zinc-100">
      <div className="max-w-3xl mx-auto px-4 py-24">
        <h1 className="text-3xl font-semibold mb-4">Press</h1>
        <p className="text-zinc-500 mb-12">Latest news and updates from NuVisa.</p>

        <div className="border-b border-zinc-800 pb-6 mb-6">
          <p className="text-xs text-zinc-600 mb-2">March 2026</p>
          <h2 className="text-lg font-medium mb-2">NuVisa Launches AI-Powered Document Checker</h2>
          <p className="text-zinc-400 text-sm mb-3">New technology reduces visa application errors by 80%, making Schengen visa approval faster and more accessible for Indian residents in the UK.</p>
          <span className="text-xs text-zinc-600 border border-zinc-800 rounded px-2 py-1">Press release</span>
        </div>

        <div className="border-b border-zinc-800 pb-6 mb-6">
          <p className="text-xs text-zinc-600 mb-2">January 2026</p>
          <h2 className="text-lg font-medium mb-2">NuVisa Reaches 99.3% Approval Rate</h2>
          <p className="text-zinc-400 text-sm mb-3">After processing over 1,000 applications, NuVisa achieves industry-leading approval rate through its combination of AI review and human expertise.</p>
          <span className="text-xs text-zinc-600 border border-zinc-800 rounded px-2 py-1">Press release</span>
        </div>

        <p className="text-zinc-600 text-sm mt-12">
          For press inquiries:{" "}
          <a href="mailto:press@nuvisa.co.uk" className="text-zinc-400 hover:text-zinc-200 transition-colors">press@nuvisa.co.uk</a>
        </p>
      </div>
    </div>
  );
}
