import React, { useEffect, useRef, useState } from 'react'
import { Link, NavLink } from 'react-router'
import { Menu, X, PhoneCall, Mail } from 'lucide-react'
import { FaLinkedinIn, FaFacebookF, FaInstagram } from 'react-icons/fa6'
import SudabeltLogo from '../components/common/SudabeltLogo'
import { useQuote } from '../context/QuoteContext'

const INSIGHTS_DROPDOWN_LINKS = [
  { label: 'Blogs', path: '/blog' },
  { label: 'Insights', path: '/resources/newsletters' },
]

const MORE_DROPDOWN_LINKS = [
  { label: 'Training', path: '/training-hub' },
  { label: 'Why Sudabelt', path: '/why-sudabelt/compare' },
  { label: 'Support', path: '/support' },
  { label: 'Careers', path: '/careers' },
  { label: 'Contact', path: '/contact' },
]

const SOCIAL_LINKS = [
  { label: 'Instagram', href: 'https://www.instagram.com/sudabeltmedical', icon: FaInstagram },
  { label: 'Facebook', href: 'https://www.facebook.com/sudabeltmedical', icon: FaFacebookF },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/sudabelt-medical', icon: FaLinkedinIn },
]

const navLinkClassName = ({ isActive }: { isActive: boolean }) =>
  `relative py-2 inline-flex items-center text-[15px] font-semibold text-sudabelt-navy after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.75 after:bg-sudabelt-green after:transition-transform after:duration-200 ${
    isActive ? 'after:scale-x-100' : 'after:scale-x-0 hover:after:scale-x-100'
  }`

const Header: React.FC = () => {
  const { itemCount } = useQuote()
  const [openDropdown, setOpenDropdown] = useState<'insights' | 'more' | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false)
  const navRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenDropdown(null)
      }
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpenDropdown(null)
        setMobileMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const closeAllMenus = () => {
    setOpenDropdown(null)
    setMobileMenuOpen(false)
  }

  return (
    <header ref={navRef} className="sticky top-0 z-50 w-full bg-white border-b border-sudabelt-header-border">
      {/* Pre-Navbar: Tagline + Official Contacts (tel:+2349011235400 & info@sudabelt.com) + Instagram, Facebook, LinkedIn */}
      <div className="bg-sudabelt-navy text-white">
        <div className="sudabelt-container h-9.5 flex items-center justify-between gap-3 text-[11.5px] font-medium">
          <span className="text-white/85 truncate">
            Advancing Healthcare Excellence in Africa
          </span>

          <div className="flex items-center gap-3.5 shrink-0">
            <a
              href="mailto:info@sudabelt.com"
              className="hidden sm:inline-flex items-center gap-1.5 font-mono text-[11.5px] text-white/90 hover:text-sudabelt-blue transition-colors"
            >
              <Mail className="w-3 h-3 text-sudabelt-blue" strokeWidth={1.75} />
              <span>info@sudabelt.com</span>
            </a>

            <span className="hidden sm:inline text-white/25">|</span>

            <a
              href="tel:+2349011235400"
              className="inline-flex items-center gap-1.5 font-mono text-[11.5px] text-white/90 hover:text-sudabelt-blue transition-colors"
            >
              <PhoneCall className="w-3 h-3 text-sudabelt-blue" strokeWidth={1.75} />
              <span>+234 901 123 5400</span>
            </a>

            <span className="text-white/25">|</span>

            {/* Pre-Navbar Social Icons: Instagram, Facebook, LinkedIn */}
            <div className="flex items-center gap-2" aria-label="Sudabelt Social Media">
              {SOCIAL_LINKS.map((social) => {
                const IconComp = social.icon
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="w-6 h-6 rounded-sm bg-white/10 hover:bg-sudabelt-blue text-white hover:text-sudabelt-navy inline-flex items-center justify-center transition-colors"
                  >
                    <IconComp className="w-3 h-3" />
                  </a>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="sudabelt-container h-21.5 lg:h-24 flex items-center justify-between gap-4">
        {/* Left: Larger Brand Logo Aligned Flush to Beginning of Container Padding */}
        <Link to="/" onClick={closeAllMenus} className="shrink-0 focus:outline-none">
          <SudabeltLogo variant="primary" size="header" />
        </Link>

        {/* Right/Center Desktop Navigation + RFQ Tray */}
        <div className="flex items-center gap-4 lg:gap-9 h-full">
          <nav
            aria-label="Primary Navigation"
            className="hidden lg:flex items-center gap-7 xl:gap-9 h-full"
          >
            <NavLink to="/about" onClick={closeAllMenus} className={navLinkClassName}>
              About
            </NavLink>

            <NavLink to="/products" onClick={closeAllMenus} className={navLinkClassName}>
              Portfolio
            </NavLink>

            <NavLink to="/services/turnkey" onClick={closeAllMenus} className={navLinkClassName}>
              Services
            </NavLink>

            <NavLink to="/projects" onClick={closeAllMenus} className={navLinkClassName}>
              Projects
            </NavLink>

            {/* Insights Dropdown (Blogs & Insights) with Small Triangle on the RIGHT and Hover Support */}
            <div
              className="relative flex items-center h-full"
              onMouseEnter={() => setOpenDropdown('insights')}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <button
                type="button"
                onClick={() =>
                  setOpenDropdown((prev) => (prev === 'insights' ? null : 'insights'))
                }
                aria-expanded={openDropdown === 'insights'}
                className={`relative py-2 inline-flex items-center gap-1.5 text-[15px] font-semibold text-sudabelt-navy cursor-pointer after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.75 after:bg-sudabelt-green after:transition-transform after:duration-200 ${
                  openDropdown === 'insights'
                    ? 'after:scale-x-100'
                    : 'after:scale-x-0 hover:after:scale-x-100'
                }`}
              >
                <span>Insights</span>
                {/* Small Triangle Indicator on the Right Side */}
                <svg
                  className={`w-2 h-2 text-sudabelt-navy transition-transform duration-200 ${
                    openDropdown === 'insights' ? 'rotate-180 text-sudabelt-green' : ''
                  }`}
                  viewBox="0 0 10 6"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M0 0l5 6 5-6z" />
                </svg>
              </button>

              {openDropdown === 'insights' && (
                <div
                  className="absolute top-full left-0 w-44 rounded-tray bg-white border border-sudabelt-border shadow-dropdown overflow-hidden z-50 animate-in fade-in duration-100"
                  onMouseEnter={() => setOpenDropdown('insights')}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <div className="py-1.5">
                    {INSIGHTS_DROPDOWN_LINKS.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={closeAllMenus}
                        className="block px-4 py-2 text-[13px] font-semibold text-sudabelt-navy hover:bg-sudabelt-surface hover:text-sudabelt-green border-l-2 border-transparent hover:border-sudabelt-green transition-all"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* More Dropdown with Small Triangle on the RIGHT and Hover Support */}
            <div
              className="relative flex items-center h-full"
              onMouseEnter={() => setOpenDropdown('more')}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <button
                type="button"
                onClick={() => setOpenDropdown((prev) => (prev === 'more' ? null : 'more'))}
                aria-expanded={openDropdown === 'more'}
                className={`relative py-2 inline-flex items-center gap-1.5 text-[15px] font-semibold text-sudabelt-navy cursor-pointer after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.75 after:bg-sudabelt-green after:transition-transform after:duration-200 ${
                  openDropdown === 'more'
                    ? 'after:scale-x-100'
                    : 'after:scale-x-0 hover:after:scale-x-100'
                }`}
              >
                <span>More</span>
                {/* Small Triangle Indicator on the Right Side */}
                <svg
                  className={`w-2 h-2 text-sudabelt-navy transition-transform duration-200 ${
                    openDropdown === 'more' ? 'rotate-180 text-sudabelt-green' : ''
                  }`}
                  viewBox="0 0 10 6"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M0 0l5 6 5-6z" />
                </svg>
              </button>

              {openDropdown === 'more' && (
                <div
                  className="absolute top-full right-0 w-44 rounded-tray bg-white border border-sudabelt-border shadow-dropdown overflow-hidden z-50 animate-in fade-in duration-100"
                  onMouseEnter={() => setOpenDropdown('more')}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <div className="py-1.5">
                    {MORE_DROPDOWN_LINKS.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={closeAllMenus}
                        className="block px-4 py-2 text-[13px] font-semibold text-sudabelt-navy hover:bg-sudabelt-surface hover:text-sudabelt-green border-l-2 border-transparent hover:border-sudabelt-green transition-all"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Measured RFQ Cart Button with Solid Blue (bg-sudabelt-blue) Background and Dark Navy Badge */}
          <Link
            to="/rfq"
            onClick={closeAllMenus}
            aria-label={`RFQ Cart with ${itemCount} items`}
            className="h-11.5 lg:h-13.5 px-4 rounded-tray bg-sudabelt-blue hover:bg-sudabelt-blue-hover text-sudabelt-navy font-extrabold text-[13px] tracking-[0.04em] uppercase inline-flex items-center gap-2.5 transition-colors shrink-0 shadow-xs"
          >
            <span>RFQ CART</span>
            <span className="w-7.5 h-7.5 lg:w-8.5 lg:h-8.5 rounded-badge bg-sudabelt-navy text-white font-mono text-[13px] font-bold inline-flex items-center justify-center">
              {itemCount}
            </span>
          </Link>

          {/* Responsive Tablet & Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle Navigation Menu"
            className="lg:hidden w-11 h-11 rounded-control border border-sudabelt-border bg-sudabelt-surface text-sudabelt-navy inline-flex items-center justify-center cursor-pointer"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" strokeWidth={1.75} />
            ) : (
              <Menu className="w-5 h-5" strokeWidth={1.75} />
            )}
          </button>
        </div>
      </div>

      {/* Tablet & Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-sudabelt-header-border shadow-xl">
          <nav
            aria-label="Mobile Navigation"
            className="sudabelt-container py-5 flex flex-col divide-y divide-sudabelt-header-border"
          >
            <div className="py-2 flex flex-col gap-1">
              {[
                { label: 'About', path: '/about' },
                { label: 'Portfolio', path: '/products' },
                { label: 'Services', path: '/services/turnkey' },
                { label: 'Projects', path: '/projects' },
              ].map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={closeAllMenus}
                  className={({ isActive }) =>
                    `px-3 py-2.5 rounded-control text-[15px] font-semibold ${
                      isActive
                        ? 'bg-sudabelt-surface text-sudabelt-navy border-b-2 border-sudabelt-green'
                        : 'text-sudabelt-navy'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </div>

            {/* Insights Mobile Section */}
            <div className="py-3">
              <div className="px-3 text-[11.5px] font-bold uppercase tracking-[0.12em] text-sudabelt-label mb-1.5">
                Insights
              </div>
              <div className="flex flex-col gap-1">
                {INSIGHTS_DROPDOWN_LINKS.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={closeAllMenus}
                    className="px-3 py-2 rounded-control text-[15px] font-semibold text-sudabelt-navy hover:bg-sudabelt-surface"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* More Mobile Section */}
            <div className="py-3">
              <div className="px-3 text-[11.5px] font-bold uppercase tracking-[0.12em] text-sudabelt-label mb-1.5">
                More
              </div>
              <div className="flex flex-col gap-1">
                {MORE_DROPDOWN_LINKS.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={closeAllMenus}
                    className="px-3 py-2 rounded-control text-[15px] font-semibold text-sudabelt-navy hover:bg-sudabelt-surface"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="pt-3">
              <button
                type="button"
                onClick={closeAllMenus}
                className="w-full px-4 py-3 rounded-control bg-sudabelt-surface text-sudabelt-navy text-[14px] font-semibold text-left cursor-pointer"
              >
                Close menu
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}

export default Header
