import React, { useState } from 'react'
import { Link, NavLink } from 'react-router'
import {
  MapPin,
  PhoneCall,
  Menu,
  X,
  ChevronDown,
  ShieldAlert,
  ArrowUpRight,
} from 'lucide-react'
import SudabeltLogo from '../components/common/SudabeltLogo'
import { useQuote } from '../context/QuoteContext'

interface NavItem {
  label: string
  path: string
  children?: { label: string; path: string; description: string }[]
}

const PRIMARY_NAV_ITEMS: NavItem[] = [
  { label: 'About', path: '/about' },
  {
    label: 'Portfolio',
    path: '/products',
    children: [
      {
        label: 'All OEM Partners & Products',
        path: '/products',
        description: 'Equipment & consumables grouped by global OEM partners',
      },
      {
        label: 'Renal Care & Hemodialysis',
        path: '/products?category=renal-care',
        description: 'Baxter hemodialysis systems, RO water & CleanCart consumables',
      },
      {
        label: 'Blood Banking & Apheresis',
        path: '/products?category=blood-banking-apheresis',
        description: 'Terumo BCT Spectra Optia, Mirasol PRT & blood component processing',
      },
    ],
  },
  { label: 'Turnkey Solutions', path: '/services/turnkey' },
  {
    label: 'Training Hub',
    path: '/training-hub',
    children: [
      {
        label: 'Clinical & Biomedical Academy',
        path: '/training-hub',
        description: 'Hands-on nurse, physician, and biomedical engineer curricula',
      },
      {
        label: 'Register Institutional Cohort',
        path: '/training-hub/register',
        description: 'Book on-site hospital staff certification sessions',
      },
    ],
  },
  { label: 'Why Sudabelt', path: '/why-sudabelt/compare' },
  {
    label: 'Insights',
    path: '/resources/newsletters',
    children: [
      {
        label: 'Clinical Newsletter Archive',
        path: '/resources/newsletters',
        description: 'Unlimited archive of Sudabelt clinical & biomedical publications',
      },
      {
        label: 'Industry Articles & Blog',
        path: '/blog',
        description: 'Healthcare infrastructure engineering insights across Africa',
      },
    ],
  },
  {
    label: 'Support',
    path: '/support',
    children: [
      {
        label: 'Biomedical SLA & Support Hub',
        path: '/support',
        description: 'Overview of nationwide preventive maintenance & spare parts coverage',
      },
      {
        label: 'Emergency Breakdown Dispatch',
        path: '/support/emergency-breakdown',
        description: '<24hr critical patient impact biomedical intervention',
      },
      {
        label: 'Preventive Maintenance & Calibration',
        path: '/support/maintenance-calibration',
        description: 'Schedule routine OEM calibration and water quality audits',
      },
    ],
  },
  { label: 'Contact', path: '/contact' },
]

const Header: React.FC = () => {
  const { itemCount } = useQuote()
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

  const closeMobileMenu = () => setMobileMenuOpen(false)

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-[#E3E7EF]">
      {/* Top Institutional Utility Bar (#001142 Primary Navy) */}
      <div className="bg-[#001142] text-white border-b border-white/15">
        <div className="sudabelt-container py-2 flex flex-wrap items-center justify-between gap-3 text-[12px]">
          <div className="flex items-center gap-2 text-white/80">
            <MapPin className="w-3.5 h-3.5 text-[#3FA9F5] shrink-0" strokeWidth={1.75} />
            <span className="font-semibold text-white">Pan-African Regional Hubs:</span>
            <span className="hidden sm:inline font-mono text-[11.5px] text-white/80">
              Lagos (HQ) • Abuja • Kano • Port Harcourt
            </span>
          </div>

          <div className="flex items-center gap-4 ml-auto">
            <Link
              to="/support/emergency-breakdown"
              className="inline-flex items-center gap-1.5 text-white hover:text-[#3FA9F5] transition-colors font-semibold"
            >
              <span className="inline-block w-2 h-2 bg-[#E30000] rounded-[2px]" />
              <span>24/7 Biomedical SLA Desk</span>
            </Link>
            <span className="text-white/25 hidden md:inline">|</span>
            <a
              href="tel:+23480078322358"
              className="hidden md:inline-flex items-center gap-1.5 font-mono text-[12px] text-[#3FA9F5] hover:underline"
            >
              <PhoneCall className="w-3.5 h-3.5" strokeWidth={1.75} />
              <span>+234 (0) 800-SUDABELT</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="sudabelt-container h-[84px] lg:h-[92px] flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link to="/" className="shrink-0 focus:outline-none" onClick={closeMobileMenu}>
          <SudabeltLogo variant="primary" />
        </Link>

        {/* Desktop Navigation Links */}
        <nav
          aria-label="Primary Navigation"
          className="hidden xl:flex items-center gap-[24px] 2xl:gap-[32px] h-full"
        >
          {PRIMARY_NAV_ITEMS.map((item) => (
            <div
              key={item.path}
              className="relative h-full flex items-center"
              onMouseEnter={() => item.children && setActiveDropdown(item.label)}
              onMouseLeave={() => item.children && setActiveDropdown(null)}
            >
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `relative h-full inline-flex items-center gap-1 text-[15px] font-semibold transition-colors ${
                    isActive
                      ? 'text-[#001142] after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[3px] after:bg-[#006837]'
                      : 'text-[#3B4468] hover:text-[#001142]'
                  }`
                }
              >
                <span>{item.label}</span>
                {item.children && (
                  <ChevronDown className="w-3.5 h-3.5 text-[#5A6385]" strokeWidth={1.75} />
                )}
              </NavLink>

              {/* Dropdown Panel */}
              {item.children && activeDropdown === item.label && (
                <div className="absolute top-full left-0 w-[340px] bg-white border border-[#DCE1EB] rounded-tl-[22px] rounded-br-[22px] shadow-lg p-3 z-50">
                  <div className="flex flex-col gap-1">
                    {item.children.map((sub) => (
                      <Link
                        key={sub.path}
                        to={sub.path}
                        onClick={() => setActiveDropdown(null)}
                        className="group p-3 rounded-[5.5px] hover:bg-[#F4F6F9] transition-colors"
                      >
                        <div className="flex items-center justify-between text-[14px] font-bold text-[#001142] group-hover:text-[#006837]">
                          <span>{sub.label}</span>
                          <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <p className="text-[12.5px] text-[#3B4468] leading-snug mt-0.5">
                          {sub.description}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Action Controls: Measured RFQ Tray + Request Quote CTA */}
        <div className="flex items-center gap-3">
          {/* RFQ Tray Button (Measured from Figma 03: #3FA9F5 bg, 12px radius, #001142 badge) */}
          <Link
            to="/rfq"
            aria-label={`Open RFQ Quote Tray with ${itemCount} items`}
            className="h-[46px] lg:h-[52px] px-3.5 lg:px-4 rounded-[12px] bg-[#3FA9F5] hover:bg-[#2b99eb] text-[#001142] font-extrabold text-[13px] tracking-[0.04em] uppercase inline-flex items-center gap-2.5 transition-colors shrink-0"
          >
            <span>RFQ TRAY</span>
            <span className="w-[30px] h-[30px] lg:w-[34px] lg:h-[34px] rounded-[8px] bg-[#001142] text-white font-mono text-[13px] font-bold inline-flex items-center justify-center">
              {itemCount}
            </span>
          </Link>

          {/* Standard Dark CTA (Measured from Figma 03: 50px high, #001142 bg, 5.5px radius) */}
          <Link
            to="/rfq"
            className="hidden sm:inline-flex h-[46px] lg:h-[50px] px-[22px] rounded-[5.5px] bg-[#001142] hover:bg-[#006837] text-white font-bold text-[13px] tracking-[0.06em] uppercase items-center justify-center transition-colors shrink-0"
          >
            Request Quote
          </Link>

          {/* Mobile Drawer Trigger (Non-circular 5.5px radius) */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle Navigation Menu"
            className="xl:hidden w-[44px] h-[44px] rounded-[5.5px] border border-[#DCE1EB] bg-[#F4F6F9] text-[#001142] inline-flex items-center justify-center"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" strokeWidth={1.75} />
            ) : (
              <Menu className="w-5 h-5" strokeWidth={1.75} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-t border-[#E3E7EF] px-6 py-5 shadow-xl">
          <nav className="flex flex-col gap-2" aria-label="Mobile Navigation">
            {PRIMARY_NAV_ITEMS.map((item) => (
              <div key={item.path} className="border-b border-[#E3E7EF]/70 pb-2">
                <NavLink
                  to={item.path}
                  onClick={closeMobileMenu}
                  className={({ isActive }) =>
                    `block py-2 text-[15px] font-bold ${
                      isActive ? 'text-[#006837]' : 'text-[#001142]'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
                {item.children && (
                  <div className="pl-3 flex flex-col gap-1.5 mt-1">
                    {item.children.map((sub) => (
                      <Link
                        key={sub.path}
                        to={sub.path}
                        onClick={closeMobileMenu}
                        className="text-[13px] font-medium text-[#3B4468] hover:text-[#001142] py-1"
                      >
                        • {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <div className="pt-3 flex flex-col sm:flex-row gap-3">
              <Link
                to="/rfq"
                onClick={closeMobileMenu}
                className="h-[48px] px-5 rounded-[5.5px] bg-[#001142] text-white font-bold text-[13px] tracking-[0.06em] uppercase inline-flex items-center justify-center"
              >
                Request Institutional Quote
              </Link>
              <Link
                to="/support/emergency-breakdown"
                onClick={closeMobileMenu}
                className="h-[48px] px-5 rounded-[5.5px] border border-[#E30000] text-[#E30000] font-bold text-[13px] tracking-[0.05em] uppercase inline-flex items-center justify-center gap-2"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>Log Breakdown Ticket</span>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}

export default Header
