import Link from "next/link";
import Image from "next/image";
import { getTranslations } from "next-intl/server";

export default async function Footer() {
  const t = await getTranslations("Footer");

  return (
    <footer className="bg-gray-50 pt-20 pb-10 border-t border-gray-200">
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
                className="h-8 w-auto"
              />
            </Link>
            <p className="text-gray-500 mb-8 leading-relaxed">{t("brandDescription")}</p>
            <p className="text-xs text-gray-400">{t("registrationPending")}</p>
          </div>

          {/* Links Columns */}
          <div className="lg:col-span-2 lg:col-start-6">
            <h3 className="text-[#081F3D] font-semibold mb-6">{t("servicesHeading")}</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/quote?service=air-express" className="text-gray-500 hover:text-[#F28C18] transition-colors">
                  {t("airExpress")}
                </Link>
              </li>
              <li>
                <Link href="/quote?service=air-economy" className="text-gray-500 hover:text-[#F28C18] transition-colors">
                  {t("airEconomy")}
                </Link>
              </li>
              <li>
                <Link href="/quote?service=ocean-freight" className="text-gray-500 hover:text-[#F28C18] transition-colors">
                  {t("oceanFreight")}
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-gray-500 hover:text-[#F28C18] transition-colors">
                  {t("compareAllServices")}
                </Link>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-[#081F3D] font-semibold mb-6">{t("resourcesHeading")}</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/tracking" className="text-gray-500 hover:text-[#F28C18] transition-colors">
                  {t("trackShipment")}
                </Link>
              </li>
              <li>
                <Link href="/customs" className="text-gray-500 hover:text-[#F28C18] transition-colors">
                  {t("customsCompliance")}
                </Link>
              </li>
              <li>
                <Link href="/business" className="text-gray-500 hover:text-[#F28C18] transition-colors">
                  {t("businessSolutions")}
                </Link>
              </li>
              <li>
                <Link href="/portal" className="text-gray-500 hover:text-[#F28C18] transition-colors">
                  {t("customerPortal")}
                </Link>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-[#081F3D] font-semibold mb-6">{t("legalHeading")}</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/privacy" className="text-gray-500 hover:text-[#F28C18] transition-colors">
                  {t("privacyPolicy")}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-500 hover:text-[#F28C18] transition-colors">
                  {t("termsOfService")}
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-gray-500 hover:text-[#F28C18] transition-colors">
                  {t("cookiePolicy")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">{t("copyright", { year: new Date().getFullYear() })}</p>
          <p className="text-xs text-gray-400 text-center md:text-right max-w-md">{t("previewNotice")}</p>
        </div>
      </div>
    </footer>
  );
}
