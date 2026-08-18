import Link from "next/link";

export default function CookiesPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-16 lg:py-24">
      <div className="mx-auto max-w-4xl px-6">
        <nav className="mb-6 text-sm text-slate-500" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-[#081F3D]">Home</Link> / Cookies
        </nav>
        <header className="rounded-3xl bg-[#081F3D] p-8 text-white lg:p-12">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#F28C18]">Current website behavior</p>
          <h1 className="mt-3 text-4xl font-bold">Cookie Notice</h1>
          <p className="mt-4 max-w-2xl text-slate-200">What Nauterio stores in your browser and why.</p>
          <p className="mt-4 text-sm text-slate-300">Last updated: August 18, 2026</p>
        </header>
        <div className="mt-8 space-y-5">
          <section className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
            <h2 className="text-xl font-bold text-[#081F3D]">Essential session storage</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">When you sign in, Nauterio stores a secure, httpOnly session cookie so the portal can recognize your authenticated session. A separate CSRF cookie helps protect account-changing requests. These are necessary for the requested service and are removed or expire when the session ends.</p>
          </section>
          <section className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
            <h2 className="text-xl font-bold text-[#081F3D]">Preferences</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">The site may remember a language or interface preference so pages can be presented consistently. Preference storage is not used to build an advertising profile.</p>
          </section>
          <section className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
            <h2 className="text-xl font-bold text-[#081F3D]">Analytics and advertising</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">The current application does not intentionally set advertising cookies or non-essential analytics cookies. If analytics, advertising, session replay, or similar technology is introduced, this notice and the consent interface must be updated before that technology is enabled for visitors who require consent.</p>
          </section>
          <section className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
            <h2 className="text-xl font-bold text-[#081F3D]">Managing storage</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">You can remove stored data through your browser settings. Blocking essential cookies will prevent sign-in and portal functions from working. See the <Link href="/privacy" className="font-semibold text-[#081F3D] underline">Privacy Notice</Link> for broader information about data processing.</p>
          </section>
        </div>
      </div>
    </main>
  );
}
