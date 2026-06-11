import { useEffect } from "react";

export default function Privacy() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="min-h-screen bg-black text-zinc-100">
      <div className="max-w-3xl mx-auto px-4 py-24">
        <h1 className="text-3xl font-semibold mb-8">Privacy Policy</h1>

        <div className="prose prose-sm prose-invert max-w-none text-zinc-400 space-y-6">
          <p>Last updated: June 2026</p>

          <h2 className="text-zinc-200 text-lg font-medium">Information We Collect</h2>
          <p>We collect information you provide directly to us, including your name, email address, phone number, passport details, and travel information when you use our visa application service.</p>

          <h2 className="text-zinc-200 text-lg font-medium">How We Use Your Data</h2>
          <p>Your data is used solely to process your visa application, communicate with you about your application status, and improve our service. We never sell your personal information to third parties.</p>

          <h2 className="text-zinc-200 text-lg font-medium">Data Security</h2>
          <p>All data is encrypted in transit using TLS 1.3 and at rest using AES-256 encryption. We follow industry best practices for data protection and regularly audit our security measures.</p>

          <h2 className="text-zinc-200 text-lg font-medium">Data Retention</h2>
          <p>We retain your application data for as long as necessary to process your visa and comply with legal obligations. You may request deletion of your data at any time.</p>

          <h2 className="text-zinc-200 text-lg font-medium">Third Parties</h2>
          <p>We share necessary information with embassies and consulates solely for the purpose of your visa application. We use Stripe for payment processing and Supabase for data storage.</p>

          <h2 className="text-zinc-200 text-lg font-medium">Contact</h2>
          <p>For privacy-related inquiries, contact us at <a href="mailto:privacy@nuvisa.co.uk" className="text-zinc-400 hover:text-zinc-200">privacy@nuvisa.co.uk</a>.</p>
        </div>
      </div>
    </div>
  );
}
