import Link from "next/link";
import Image from "next/image";

export default function Footer() {
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
            <p className="text-gray-500 mb-8 leading-relaxed">
              A dedicated shipping platform for the Italy&ndash;United States corridor: air, ocean,
              and parcel freight with customs guidance and tracking in one place.
            </p>
            <p className="text-xs text-gray-400">
              Company registration and contact details will be published here once legal
              registration is finalised.
            </p>
          </div>

          {/* Links Columns */}
          <div className="lg:col-span-2 lg:col-start-6">
            <h3 className="text-[#081F3D] font-semibold mb-6">Services</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/quote?service=air-express" className="text-gray-500 hover:text-[#F28C18] transition-colors">
                  Air Express
                </Link>
              </li>
              <li>
                <Link href="/quote?service=air-economy" className="text-gray-500 hover:text-[#F28C18] transition-colors">
                  Air Economy
                </Link>
              </li>
              <li>
                <Link href="/quote?service=ocean-freight" className="text-gray-500 hover:text-[#F28C18] transition-colors">
                  Ocean Freight
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-gray-500 hover:text-[#F28C18] transition-colors">
                  Compare all services
                </Link>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-[#081F3D] font-semibold mb-6">Resources</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/tracking" className="text-gray-500 hover:text-[#F28C18] transition-colors">
                  Track Shipment
                </Link>
              </li>
              <li>
                <Link href="/customs" className="text-gray-500 hover:text-[#F28C18] transition-colors">
                  Customs & Compliance
                </Link>
              </li>
              <li>
                <Link href="/business" className="text-gray-500 hover:text-[#F28C18] transition-colors">
                  Business Solutions
                </Link>
              </li>
              <li>
                <Link href="/portal" className="text-gray-500 hover:text-[#F28C18] transition-colors">
                  Customer Portal
                </Link>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-[#081F3D] font-semibold mb-6">Legal</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/privacy" className="text-gray-500 hover:text-[#F28C18] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-500 hover:text-[#F28C18] transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-gray-500 hover:text-[#F28C18] transition-colors">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} Nauterio Logistics. All rights reserved.
          </p>
          <p className="text-xs text-gray-400 text-center md:text-right max-w-md">
            This site is a pre-launch preview. Service dates, coverage, and pricing shown are
            indicative and not yet confirmed.
          </p>
        </div>
      </div>
    </footer>
  );
}
