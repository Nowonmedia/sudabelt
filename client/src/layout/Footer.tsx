import React from 'react'
import { Link } from 'react-router'
import { FaLinkedinIn, FaFacebookF, FaInstagram } from 'react-icons/fa6'
import SudabeltLogo from '../components/common/SudabeltLogo'

const Footer: React.FC = () => {
  return (
    <footer className="bg-sudabelt-navy text-white">
      <div className="sudabelt-container pt-16 pb-10">
        {/* Top 4-Column Grid matching Figma Screenshot */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/18">
          {/* Col 1: Larger Logo Aligned Flush to Left Edge, Tagline & Social Icons (5 cols) */}
          <div className="sm:col-span-2 lg:col-span-5">
            <Link to="/" className="inline-block focus:outline-none">
              <SudabeltLogo variant="white" size="footer" />
            </Link>

            <p className="text-[13.5px] leading-5.5 text-white/72 mt-5 max-w-80">
              Africa’s end-to-end healthcare infrastructure partner: equipment supply, clinical
              training, consumables and biomedical maintenance.
            </p>

            {/* Social Media Icons: Instagram, Facebook, LinkedIn */}
            <div className="flex items-center gap-2.5 mt-5">
              <a
                href="https://www.instagram.com/sudabeltmedical"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Sudabelt Instagram"
                className="w-8 h-8 rounded-control border border-white/22 text-white/82 hover:border-sudabelt-blue hover:text-sudabelt-blue inline-flex items-center justify-center transition-colors"
              >
                <FaInstagram className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://www.facebook.com/sudabeltmedical"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Sudabelt Facebook"
                className="w-8 h-8 rounded-control border border-white/22 text-white/82 hover:border-sudabelt-blue hover:text-sudabelt-blue inline-flex items-center justify-center transition-colors"
              >
                <FaFacebookF className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://www.linkedin.com/company/sudabelt-medical"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Sudabelt LinkedIn"
                className="w-8 h-8 rounded-control border border-white/22 text-white/82 hover:border-sudabelt-blue hover:text-sudabelt-blue inline-flex items-center justify-center transition-colors"
              >
                <FaLinkedinIn className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Col 2: PORTFOLIO (2 cols) */}
          <div className="lg:col-span-2">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.12em] text-sudabelt-blue mb-4">
              PORTFOLIO
            </h3>
            <ul className="space-y-2.5 text-[13.5px]">
              <li>
                <Link
                  to="/products?category=imaging-and-life-care"
                  className="text-white/82 hover:text-sudabelt-blue transition-colors"
                >
                  Imaging &amp; Life Care
                </Link>
              </li>
              <li>
                <Link
                  to="/products?category=renal-and-critical-care"
                  className="text-white/82 hover:text-sudabelt-blue transition-colors"
                >
                  Renal &amp; Critical Care
                </Link>
              </li>
              <li>
                <Link
                  to="/products?category=blood-management-cell-technologies"
                  className="text-white/82 hover:text-sudabelt-blue transition-colors"
                >
                  Blood Management
                </Link>
              </li>
              <li>
                <Link
                  to="/products?category=laboratory-and-diagnostics"
                  className="text-white/82 hover:text-sudabelt-blue transition-colors"
                >
                  Laboratory &amp; Diagnostics
                </Link>
              </li>
              <li>
                <Link
                  to="/products?category=respiratory-and-neonatal-care"
                  className="text-white/82 hover:text-sudabelt-blue transition-colors"
                >
                  Respiratory &amp; Neonatal
                </Link>
              </li>
              <li>
                <Link
                  to="/products?category=minimally-invasive-surgery"
                  className="text-white/82 hover:text-sudabelt-blue transition-colors"
                >
                  Minimally Invasive Surgery
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: COMPANY (2 cols) */}
          <div className="lg:col-span-2">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.12em] text-sudabelt-blue mb-4">
              COMPANY
            </h3>
            <ul className="space-y-2.5 text-[13.5px]">
              <li>
                <Link
                  to="/about"
                  className="text-white/82 hover:text-sudabelt-blue transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/why-sudabelt/compare"
                  className="text-white/82 hover:text-sudabelt-blue transition-colors"
                >
                  Why Sudabelt
                </Link>
              </li>
              <li>
                <Link
                  to="/training-hub"
                  className="text-white/82 hover:text-sudabelt-blue transition-colors"
                >
                  Training Hub
                </Link>
              </li>
              <li>
                <Link
                  to="/resources/newsletters"
                  className="text-white/82 hover:text-sudabelt-blue transition-colors"
                >
                  Newsletters
                </Link>
              </li>
              <li>
                <Link
                  to="/rfq"
                  className="text-white/82 hover:text-sudabelt-blue transition-colors"
                >
                  Request a Quote
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: REGIONAL HUBS (3 cols) */}
          <div className="lg:col-span-3">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.12em] text-sudabelt-blue mb-4">
              REGIONAL HUBS
            </h3>
            <ul className="space-y-2.5 text-[13.5px] text-white/82">
              <li>Lagos HQ: Victoria Island</li>
              <li>Abuja: Maitama</li>
              <li>Kano: Sharada</li>
              <li>Teaching Hospital Satellites</li>
              <li className="pt-1 font-mono text-[12.5px] text-sudabelt-blue">
                <a href="tel:+2349011235400" className="hover:underline">
                  +234 901 123 5400
                </a>
              </li>
              <li className="font-mono text-[12.5px] text-sudabelt-blue">
                <a href="mailto:info@sudabelt.com" className="hover:underline">
                  info@sudabelt.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright & C.A.R.E. Bar */}
        <div className="pt-7 flex flex-col sm:flex-row items-center justify-between gap-4 text-[12px] text-white/70">
          <p>Commitment • Accountability • Reliability • Efficiency</p>
          <p>© 2026 Sudabelt Medical Ltd. ISO 9001:2015 &amp; NAFDAC Certified.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
