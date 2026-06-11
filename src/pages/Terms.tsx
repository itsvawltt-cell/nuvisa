import { useEffect } from "react";

export default function Terms() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="min-h-screen bg-black text-zinc-100">
      <div className="max-w-3xl mx-auto px-4 py-24">
        <h1 className="text-3xl font-semibold mb-8">Terms of Service</h1>

        <div className="prose prose-sm prose-invert max-w-none text-zinc-400 space-y-6">
          <p>Last updated: June 2026</p>

          <h2 className="text-zinc-200 text-lg font-medium">Service Description</h2>
          <p>NuVisa provides visa application assistance services for Indian citizens resident in the UK applying for Schengen visas. Our service includes document review, application form assistance, appointment booking support, and ongoing guidance throughout the application process.</p>

          <h2 className="text-zinc-200 text-lg font-medium">Fees and Payment</h2>
          <p>Our service fee is clearly stated before you begin your application. Payments are processed securely through Stripe. Embassy fees are paid separately at the time of your appointment and are not included in our service fee.</p>

          <h2 className="text-zinc-200 text-lg font-medium">Application Accuracy</h2>
          <p>While we take every precaution to ensure your application is complete and accurate, final visa approval is at the sole discretion of the embassy or consulate. We cannot guarantee visa approval.</p>

          <h2 className="text-zinc-200 text-lg font-medium">Refund Policy</h2>
          <p>If your visa is rejected due to a documentation error on our part, we will process a resubmission free of charge. Refunds are provided on a case-by-case basis.</p>

          <h2 className="text-zinc-200 text-lg font-medium">Limitation of Liability</h2>
          <p>NuVisa's liability is limited to the amount paid for our service. We are not responsible for delays caused by embassies, postal services, or other third parties.</p>

          <h2 className="text-zinc-200 text-lg font-medium">Changes to Terms</h2>
          <p>We reserve the right to update these terms at any time. Users will be notified of material changes via email.</p>
        </div>
      </div>
    </div>
  );
}
