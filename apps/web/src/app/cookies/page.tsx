import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Cookie Notice | Nauterio Logistics", description: "The cookies and browser storage used by Nauterio Logistics." };

const sections = [
  ["Sign-in and security", "When you sign in, Nauterio stores cookies that recognise your session and help protect account changes. They are necessary for the customer portal and expire or are removed when the session ends."],
  ["Preferences", "The website can remember your language choice so that pages remain in English or Italian. This preference is not used to create an advertising profile."],
  ["Analytics and advertising", "The current website does not intentionally use advertising cookies or non-essential analytics cookies. If that changes, we will update this notice and request consent where the law requires it."],
  ["Your browser settings", "You can remove stored data in your browser settings. Blocking essential cookies will prevent sign-in and some portal features from working."],
] as const;

export default function CookiesPage() {
  return <main className="min-h-screen bg-[#f7f6f2] py-14 text-[#10233f] lg:py-20"><article className="mx-auto max-w-4xl px-6"><nav className="text-sm text-slate-500"><Link href="/" className="underline hover:text-[#10233f]">Home</Link> / Cookies</nav><header className="mt-10 border-y border-[#10233f] py-10"><h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Cookie notice</h1><p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">What this website stores in your browser and why.</p><p className="mt-5 text-sm text-slate-500">Last updated: 9 September 2026</p></header><div>{sections.map(([heading, body]) => <section key={heading} className="grid gap-3 border-b border-slate-300 py-8 md:grid-cols-[14rem_1fr]"><h2 className="text-lg font-semibold">{heading}</h2><p className="leading-7 text-slate-600">{body}</p></section>)}</div><p className="mt-8 text-slate-600">See the <Link href="/privacy" className="font-semibold text-[#10233f] underline">privacy notice</Link> for more information about personal data.</p></article></main>;
}
