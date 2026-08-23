import Link from "next/link";
import Image from "next/image";
import { getTranslations } from "next-intl/server";

export default async function Footer() {
  const t = await getTranslations("Footer");

  return (
    <footer className="border-t border-slate-200 bg-slate-950 pt-20 pb-10 text-white">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
          {/* Brand Column */}
          <div className="lg:col-span-4 pr-4">
            <Link href="/" className="flex items-center mb-6">
              <Image
                src="/nauterio-logo.png"
                alt="Nauterio Logistics"
                width={793}
                height={241}
                className="h-8 w-auto brightness-0 invert"
              />
            </Link>
            <p className="mb-8 max-w-md leading-relaxed text-slate-300">{t("brandDescription")}</p>
            <p className="max-w-sm text-xs leading-6 text-slate-400">{t("registrationPending")}</p>
          </div>

          {/* Only operational MVP destinations are linked at launch. */}
          <div className="lg:col-span-3 lg:col-start-7">
            <h3 className="mb-6 font-bold text-white">{t("resourcesHeading")}</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/tracking" className="text-slate-400 transition-colors hover:text-[#F28C18]">
                  {t("trackShipment")}
                </Link>
              </li>
              <li>
                <Link href="/portal" className="text-slate-400 transition-colors hover:text-[#F28C18]">
                  {t("customerPortal")}
                </Link>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h3 className="mb-6 font-bold text-white">{t("legalHeading")}</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/privacy" className="text-slate-400 transition-colors hover:text-[#F28C18]">
                  {t("privacyPolicy")}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-slate-400 transition-colors hover:text-[#F28C18]">
                  {t("termsOfService")}
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-slate-400 transition-colors hover:text-[#F28C18]">
                  {t("cookiePolicy")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 md:flex-row">
          <p className="text-sm text-slate-500">{t("copyright", { year: new Date().getFullYear() })}</p>
          <p className="max-w-md text-center text-xs leading-5 text-slate-500 md:text-right">{t("previewNotice")}</p>
        </div>
      </div>
    </footer>
  );
}
