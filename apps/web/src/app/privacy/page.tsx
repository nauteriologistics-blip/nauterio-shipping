import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Privacy Notice | Nauterio Logistics", description: "How Nauterio Logistics uses and protects personal data." };

const sections = [
  ["Who is responsible", "Nauterio Logistics, based and registered in Italy, is responsible for personal data processed through this website and customer portal. Privacy requests can be sent through our business contact form."],
  ["What we collect", "We collect the information needed to run an account or shipment: customer contact details, sender and recipient details, cargo descriptions, dimensions and values, customs documents, quotes, invoices, support messages and tracking events. We also retain basic security records needed to protect the service."],
  ["How we use it", "We use this information to answer enquiries, prepare and manage shipments, issue commercial documents, provide tracking and support, prevent misuse and meet legal or customs obligations. Marketing email is sent only where a person has separately agreed to receive it."],
  ["Who receives it", "We share only the information needed by the organisations involved in the work, such as carriers, customs brokers, warehouses, delivery partners, technology providers, professional advisers and public authorities. Nauterio does not sell personal data."],
  ["International processing", "An international shipment may require information to be processed outside the European Economic Area. We assess the recipient and use appropriate contractual or legal safeguards where the law requires them."],
  ["How long we keep it", "Records are kept for as long as they are needed for the shipment, customer account, payment, claim, security purpose or legal obligation. Different records have different retention periods."],
  ["Your rights", "Depending on the law that applies, you may ask to access, correct, delete, restrict or export your personal data, object to certain uses, or withdraw consent. You may also complain to the relevant data-protection authority."],
] as const;

export default function PrivacyPage() {
  return <LegalPage title="Privacy notice" intro="This notice explains what personal information Nauterio uses, why it is needed and who may receive it." sections={sections} />;
}

function LegalPage({ title, intro, sections }: { title: string; intro: string; sections: ReadonlyArray<readonly [string, string]> }) {
  return <main className="min-h-screen bg-[#f7f6f2] py-14 text-[#10233f] lg:py-20"><article className="mx-auto max-w-4xl px-6"><nav className="text-sm text-slate-500"><Link href="/" className="underline hover:text-[#10233f]">Home</Link> / {title}</nav><header className="mt-10 border-y border-[#10233f] py-10"><h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">{title}</h1><p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">{intro}</p><p className="mt-5 text-sm text-slate-500">Last updated: 9 September 2026</p></header><div>{sections.map(([heading, body]) => <section key={heading} className="grid gap-3 border-b border-slate-300 py-8 md:grid-cols-[14rem_1fr]"><h2 className="text-lg font-semibold">{heading}</h2><p className="leading-7 text-slate-600">{body}</p></section>)}</div><p className="mt-8 leading-7 text-slate-600">For a privacy request, use the <Link href="/business#contact" className="font-semibold text-[#10233f] underline">business contact form</Link> and write “Privacy request” in the message.</p></article></main>;
}
