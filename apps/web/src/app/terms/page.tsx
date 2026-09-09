import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Terms of Service | Nauterio Logistics", description: "Terms for using Nauterio's website, portal and international shipping services." };

const sections = [
  ["1. Using the service", "You must provide accurate contact, cargo and route information and use the website only for lawful purposes. Keep access links and account sessions secure and tell us promptly if you suspect unauthorised access."],
  ["2. Estimates and acceptance", "An online estimate or submitted request is not an accepted shipment. Nauterio accepts a shipment only after checking the details and issuing the final rate, available schedule and collection arrangement."],
  ["3. Changes to charges", "The final charge can change if the actual weight, dimensions, contents, classification or route differs from the information provided. Duties, taxes, storage, inspection and exceptional handling are separate where they apply."],
  ["4. Your responsibilities", "The sender is responsible for suitable packaging and accurate descriptions, values, addresses and documents. Prohibited goods must not be tendered. Restricted goods may need permits or carrier approval and can be refused."],
  ["5. Carriers, customs and delivery partners", "Nauterio may arrange services with independent carriers, brokers, warehouses and delivery partners. Authorities and third parties control their own decisions and processing times. Estimated dates are not guaranteed unless the accepted commercial terms say otherwise."],
  ["6. Payment, cancellation and refunds", "Payment timing, currency, cancellation rights and refund conditions are stated in the approved quote, invoice or customer agreement for the shipment. Use only payment instructions supplied through an authenticated or otherwise verified Nauterio channel."],
  ["7. Claims and protection", "Shipment protection is not automatic. Any cover, carrier liability limit, exclusions and claim deadline must appear in the accepted shipment documents. Do not assume that declared value is the amount payable after loss or damage."],
  ["8. Applicable terms", "Nauterio Logistics is based and registered in Italy. Shipment-specific conditions, governing law, jurisdiction and formal notice details are stated in the approved commercial documents or customer agreement that applies to the service."],
] as const;

export default function TermsPage() {
  return <main className="min-h-screen bg-[#f7f6f2] py-14 text-[#10233f] lg:py-20"><article className="mx-auto max-w-4xl px-6"><nav className="text-sm text-slate-500"><Link href="/" className="underline hover:text-[#10233f]">Home</Link> / Terms</nav><header className="mt-10 border-y border-[#10233f] py-10"><h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Terms of service</h1><p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">These terms cover the website, customer portal and shipment requests. The approved quote, invoice or customer agreement adds the commercial terms for each shipment.</p><p className="mt-5 text-sm text-slate-500">Last updated: 9 September 2026</p></header><div>{sections.map(([heading, body]) => <section key={heading} className="grid gap-3 border-b border-slate-300 py-8 md:grid-cols-[14rem_1fr]"><h2 className="text-lg font-semibold">{heading}</h2><p className="leading-7 text-slate-600">{body}</p></section>)}</div><p className="mt-8 text-slate-600">For a business or legal enquiry, use the <Link href="/business#contact" className="font-semibold text-[#10233f] underline">contact form</Link>.</p></article></main>;
}
