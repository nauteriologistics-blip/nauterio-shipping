import Link from "next/link";

const sections = [
  ["1. Shipment acceptance", "Registration, estimates, and service requests do not by themselves create a contract of carriage. A shipment becomes accepted only after Nauterio has reviewed it, issued final commercial terms, and expressly confirmed acceptance."],
  ["2. Accounts", "You must provide accurate account and shipment information, keep access links and sessions secure, and notify Nauterio if you believe your account has been compromised. Access may be suspended to protect customers, comply with law, or investigate misuse."],
  ["3. Quotes and bookings", "Online prices are indicative until a quote or invoice is expressly approved. Final charges may change after weighing, measuring, customs classification, inspection, route availability, carrier acceptance, or a customer-requested change. Taxes, duties, storage, inspection, and exceptional handling may be charged separately when applicable."],
  ["4. Shipping responsibilities", "The sender is responsible for accurate descriptions, values, addresses, contact details, packaging, and required documents. Prohibited goods must not be submitted. Restricted goods may require permits or may be refused. Estimated transit dates are not guaranteed unless a signed service agreement expressly says otherwise."],
  ["5. Customs and third parties", "Nauterio may coordinate with carriers, customs brokers, warehouses, and delivery partners. Government authorities and third parties remain responsible for their own decisions and processing times. The customer remains responsible for information supplied for customs declarations."],
  ["6. Payments, cancellations, and refunds", "Payment terms, cancellation rights, refund eligibility, currency, and any credit terms are shown in the applicable final quote, invoice, or signed customer agreement. The platform must not display invented fees or credit terms in place of approved commercial terms."],
  ["7. Liability and shipment protection", "Any carrier liability limit, claim deadline, insurance, or optional shipment-protection term must be stated in the final contract or applicable carrier convention. This website does not promise full-value compensation. Customers should not rely on a liability figure that has not been included in their accepted shipment documents."],
  ["8. Acceptable use and intellectual property", "You may use the platform only for lawful shipping and account-management purposes. You may not interfere with the service, access another customer’s data, automate abusive traffic, or misuse Nauterio branding or software."],
  ["9. Final legal details", "The operating legal entity, registered address, governing law, formal-notice address, and versioned commercial terms must be confirmed in the applicable final quote, invoice, or signed customer agreement. No draft company number, tax number, warehouse address, or legal mailbox should be treated as official."],
] as const;

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-16 lg:py-24">
      <div className="mx-auto max-w-4xl px-6">
        <nav className="mb-6 text-sm text-slate-500" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-[#081F3D]">Home</Link> / Terms
        </nav>
        <header className="rounded-3xl bg-[#081F3D] p-8 text-white lg:p-12">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#F28C18]">Platform terms</p>
          <h1 className="mt-3 text-4xl font-bold">Terms of Service</h1>
          <p className="mt-4 max-w-2xl text-slate-200">Plain-language platform terms for Nauterio’s Italy–United States shipping workflow.</p>
          <p className="mt-4 text-sm text-slate-300">Last updated: August 18, 2026 · Not final commercial terms</p>
        </header>
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 text-sm leading-7 text-slate-600 shadow-sm">
          Final rates, liability terms, formal notices, and shipment-specific conditions are issued through the applicable quote, invoice, or signed customer agreement.
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
          For a business or legal inquiry, use the <Link href="/business" className="font-semibold text-[#081F3D] underline">business inquiry form</Link>.
        </p>
      </div>
    </main>
  );
}
