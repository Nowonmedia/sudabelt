import React, { useEffect } from 'react'
import { Link } from 'react-router'
import { Map, ArrowRight } from 'lucide-react'

const SITEMAP_GROUPS = [
  {
    title: 'Core Pages',
    links: [
      { label: 'Home', to: '/' },
      { label: 'About Us', to: '/about' },
      { label: 'Why Sudabelt (Comparison)', to: '/why-sudabelt/compare' },
      { label: 'Careers', to: '/careers' },
      { label: 'Contact Us', to: '/contact' },
    ],
  },
  {
    title: 'Product Portfolio',
    links: [
      { label: 'All Products & Consumables', to: '/products' },
      { label: 'Imaging & Life Care', to: '/products?category=imaging-and-life-care' },
      { label: 'Renal & Critical Care', to: '/products?category=renal-and-critical-care' },
      {
        label: 'Blood Management & Cell Technologies',
        to: '/products?category=blood-management-cell-technologies',
      },
      { label: 'Laboratory & Diagnostics', to: '/products?category=laboratory-and-diagnostics' },
      { label: 'Respiratory & Neonatal Care', to: '/products?category=respiratory-and-neonatal-care' },
      { label: 'Minimally Invasive Surgery (MIS)', to: '/products?category=minimally-invasive-surgery' },
    ],
  },
  {
    title: 'Services, Projects & Procurement',
    links: [
      { label: 'Turnkey Services', to: '/services/turnkey' },
      { label: 'Completed Projects & Case Studies', to: '/projects' },
      { label: 'Request a Quote (RFQ Tray)', to: '/rfq' },
    ],
  },
  {
    title: 'Support & Training',
    links: [
      { label: 'Support Hub', to: '/support' },
      { label: 'After-Sales & Breakdown Ticket', to: '/support/after-sales' },
      { label: 'Medical Training Request', to: '/support/medical-training' },
      { label: 'Clinical Training Hub', to: '/training-hub' },
    ],
  },
  {
    title: 'Insights & Publications',
    links: [
      { label: 'Clinical Blog', to: '/blog' },
      { label: 'Newsletters & Awards', to: '/resources/newsletters' },
    ],
  },
  {
    title: 'Legal & Policies',
    links: [
      { label: 'Privacy Policy', to: '/privacy-policy' },
      { label: 'Terms of Use', to: '/terms-of-use' },
      { label: 'Site Map', to: '/sitemap' },
    ],
  },
]

const SitemapPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    document.title = 'Site Map | Sudabelt Medical'
  }, [])

  return (
    <div className="bg-white min-h-screen">
      {/* Header Banner */}
      <section className="bg-sudabelt-navy text-white py-14 sm:py-16">
        <div className="sudabelt-container">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-control bg-sudabelt-blue/20 border border-sudabelt-blue/30 text-sudabelt-blue text-[11px] font-bold uppercase tracking-wider mb-4">
            <Map className="w-3.5 h-3.5" />
            <span>Navigation Directory</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold tracking-tight text-white">
            Site Map
          </h1>
          <p className="text-sm sm:text-base text-white/80 mt-3 max-w-2xl">
            Complete directory of Sudabelt Medical&apos;s clinical equipment portfolio, turnkey
            infrastructure services, training programs, insights, and support portals.
          </p>
        </div>
      </section>

      {/* Directory Grid */}
      <section className="py-14 sm:py-16">
        <div className="sudabelt-container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {SITEMAP_GROUPS.map((group) => (
              <div
                key={group.title}
                className="rounded-card border border-sudabelt-border bg-white p-6 shadow-xs hover:border-sudabelt-green transition-colors"
              >
                <h2 className="text-base font-extrabold text-sudabelt-navy pb-3 mb-4 border-b border-sudabelt-border">
                  {group.title}
                </h2>
                <ul className="space-y-2.5">
                  {group.links.map((item) => (
                    <li key={item.to}>
                      <Link
                        to={item.to}
                        className="group inline-flex items-center gap-2 text-sm text-sudabelt-body hover:text-sudabelt-green font-medium transition-colors"
                      >
                        <ArrowRight className="w-3.5 h-3.5 text-sudabelt-blue group-hover:text-sudabelt-green group-hover:translate-x-0.5 transition-all shrink-0" />
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default SitemapPage
