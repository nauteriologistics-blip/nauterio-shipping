import Link from "next/link";

const sections = [
  ["1. Scope", "This notice covers the Nauterio website, customer portal, quote, booking, document, tracking, support, and pilot-administration workflows. The final data-controller identity and registered contact details will be added before general commercial launch."],
  ["2. Data we process", "Depending on the workflow, Nauterio may process account identity and contact details; sender and recipient details; package descriptions, dimensions, values, and customs documents; quote, booking, invoice, and payment status; support messages; tracking events; consent records; security logs; and technical request metadata."],
  ["3. Why we process it", "Data is used to provide requested platform functions, review and coordinate shipments, calculate and issue quotes, process payments, communicate operational updates, prevent fraud and abuse, keep audit records, support customers, and meet legal or customs obligations. Marketing messages require a separate opt-in."],
  ["4. Service providers and transfers", "Nauterio uses contracted infrastructure, database, cache, email, payment, storage, security, and logistics providers. Some processing may occur outside the European Economic Area. Appropriate contractual and technical safeguards must be confirmed for each production provider before customer data is transferred."],
  ["5. Sharing", "Information may be shared only as needed with carriers, brokers, warehouses, delivery partners, technology providers, professional advisers, and competent authorities. Nauterio does not sell personal data."],
  ["6. Retention", "Account, shipment, financial, customs, support, audit, and security records are retained only for the period required for the relevant service, dispute, legal obligation, or security purpose. Exact production retention periods must be approved and documented before general launch; expired verification and session records are designed to be cleaned up automatically."],
  ["7. Security", "The platform uses access controls, server-side sessions, CSRF protection, permission checks, audit events, encrypted provider connections, and restricted document workflows. No service can guarantee absolute security; suspected incidents should be reported promptly through an official contact once published."],
  ["8. Your choices and rights", "Subject to applicable law, you may ask to access, correct, delete, restrict, or export your personal data; object to certain processing; withdraw consent; or complain to a competent supervisory authority. Withdrawing marketing consent does not affect operational shipment messages."],
  ["9. Contact and launch condition", "A verified privacy contact, controller identity, registered address, and escalation process will be published before the service accepts general commercial customers. Until then, pre-launch inquiries can be submitted through the business inquiry form."],
] as const;

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-16 lg:py-24">
      <div className="mx-auto max-w-4xl px-6">
        <nav className="mb-6 text-sm text-slate-500" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-[#081F3D]">Home</Link> / Privacy
        </nav>
        <header className="rounded-3xl bg-[#081F3D] p-8 text-white lg:p-12">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#F28C18]">Pre-launch draft</p>
          <h1 className="mt-3 text-4xl font-bold">Privacy Notice</h1>
          <p className="mt-4 max-w-2xl text-slate-200">A transparent summary of the data used by Nauterio’s shipping platform.</p>
          <p className="mt-4 text-sm text-slate-300">Last updated: August 18, 2026 · Controller details pending legal approval</p>
        </header>
        <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
          This draft does not claim an unverified company registration, DPO, office, warehouse, certification, hosting region, or cross-border transfer framework.
        </div>
        <div className="mt-8 space-y-5">
          {sections.map(([title, body]) => (
            <section key={title} className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
              <h2 className="text-xl font-bold text-[#081F3D]">{title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">{body}</p>
            </section>
          ))}
        </div>
        <p className="mt-8 text-sm text-slate-600">
          Submit a pre-launch privacy inquiry through the <Link href="/business" className="font-semibold text-[#081F3D] underline">business inquiry form</Link>.
        </p>
      </div>
    </main>
  );
}
