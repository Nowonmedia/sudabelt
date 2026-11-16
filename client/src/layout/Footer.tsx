import React, { useState } from 'react'
import { Link } from 'react-router'
import { MapPin, Phone, Mail, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react'
import SudabeltLogo from '../components/common/SudabeltLogo'

const CARE_VALUES = [
  {
    letter: 'C',
    title: 'Commitment',
    detail: 'Dedicated to elevating clinical outcomes across Sub-Saharan Africa.',
  },
  {
    letter: 'A',
    title: 'Accountability',
    detail: 'Single-partner ownership from site engineering to staff certification.',
  },
  {
    letter: 'R',
    title: 'Reliability',
    detail: 'Genuine OEM hardware backed by local buffer consumables & spare parts.',
  },
  {
    letter: 'E',
    title: 'Efficiency',
    detail: '<24hr biomedical engineering dispatch SLAs that protect hospital uptime.',
  },
]

const REGIONAL_HUBS = [
  {
    city: 'Lagos (Corporate HQ)',
    address: 'Victoria Island, Lagos State, Nigeria',
    coverage: 'South-West & Coastal Teaching Hospital Corridor',
  },
  {
    city: 'Abuja (Federal Capital Hub)',
    address: 'Maitama District, FCT Abuja, Nigeria',
    coverage: 'North-Central, Federal Ministry & Specialist Centers',
  },
  {
    city: 'Kano (Northern Operations Hub)',
    address: 'Sharada Industrial & Clinical Corridor, Kano State',
    coverage: 'North-West & North-East Tertiary Referral Network',
  },
  {
    city: 'Port Harcourt (South-South Hub)',
    address: 'GRA Phase II, Port Harcourt, Rivers State',
    coverage: 'South-South & South-East Clinical Engineering Desk',
  },
]

const Footer: React.FC = () => {
  const [newsletterEmail, setNewsletterEmail] = useState<string>('')
  const [subscribed, setSubscribed] = useState<boolean>(false)

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newsletterEmail.trim()) return
    setSubscribed(true)
    setNewsletterEmail('')
  }

  return (
    <footer className="bg-[#001142] text-white border-t border-white/18">
      {/* Top C.A.R.E. Governance Strip */}
      <div className="border-b border-white/18">
        <div className="sudabelt-container py-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
            <div>
              <span className="text-eyebrow text-[#3FA9F5]">THE SUDABELT OPERATING STANDARD</span>
              <h2 className="text-[24px] lg:text-[28px] font-extrabold tracking-[-0.02em] text-white mt-2">
                Built on C.A.R.E. Clinical Governance
              </h2>
            </div>
            <Link
              to="/why-sudabelt/compare"
              className="h-[50px] px-[26px] rounded-[5.5px] bg-[#006837] hover:bg-[#00552d] text-white font-bold text-[13px] tracking-[0.06em] uppercase inline-flex items-center gap-2.5 self-start transition-colors"
            >
              <span>Open Live Comparison</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {CARE_VALUES.map((item) => (
              <div
                key={item.letter}
                className="p-5 rounded-tl-[22px] rounded-br-[22px] border border-white/18 bg-white/[0.03]"
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="w-8 h-8 rounded-[5.5px] bg-[#3FA9F5] text-[#001142] font-mono font-extrabold text-[15px] inline-flex items-center justify-center">
                    {item.letter}
                  </span>
                  <h3 className="text-[17px] font-bold text-white">{item.title}</h3>
                </div>
                <p className="text-[13.5px] text-white/72 leading-relaxed">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Regional Hubs Bar */}
      <div className="border-b border-white/18 bg-white/[0.02]">
        <div className="sudabelt-container py-8">
          <div className="text-eyebrow text-[#3FA9F5] mb-4">
            NATIONWIDE WAREHOUSE, COLD-CHAIN & BIOMEDICAL DISPATCH HUBS
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {REGIONAL_HUBS.map((hub) => (
              <div
                key={hub.city}
                className="p-4 rounded-[5.5px] border border-white/18 bg-[#001142]"
              >
                <div className="flex items-center gap-2 text-[14px] font-bold text-white">
                  <MapPin className="w-4 h-4 text-[#3FA9F5] shrink-0" />
                  <span>{hub.city}</span>
                </div>
                <p className="text-[13px] text-white/72 mt-1.5">{hub.address}</p>
                <p className="font-mono text-[11.5px] text-[#3FA9F5] mt-2">{hub.coverage}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer Columns & Newsletter Subscription */}
      <div className="sudabelt-container py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          {/* Col 1: Brand & Mission (4 cols) */}
          <div className="lg:col-span-4">
            <SudabeltLogo variant="white" />
            <p className="text-[14.5px] text-white/72 leading-relaxed mt-4">
              Africa’s End-to-End Healthcare Infrastructure Partner. Authorized OEM equipment
              supply, turnkey facility planning, on-site clinical staff certification, local buffer
              consumables, and preventive biomedical engineering.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {['ISO 13485 Aligned', 'NAFDAC Registered', 'CE / FDA OEM Partners'].map((badge) => (
                <span
                  key={badge}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[5.5px] border border-white/22 text-[11.5px] font-mono text-white/82"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-[#3FA9F5]" />
                  <span>{badge}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Col 2: Portfolio & Solutions (2 cols) */}
          <div className="lg:col-span-2">
            <h3 className="text-eyebrow text-[#3FA9F5] mb-4">PORTFOLIO</h3>
            <ul className="space-y-2.5 text-[14px]">
              <li>
                <Link to="/products" className="text-white/82 hover:text-[#3FA9F5] transition-colors">
                  All OEM Partners
                </Link>
              </li>
              <li>
                <Link
                  to="/products?category=renal-care"
                  className="text-white/82 hover:text-[#3FA9F5] transition-colors"
                >
                  Renal Care & HD
                </Link>
              </li>
              <li>
                <Link
                  to="/products?category=blood-banking-apheresis"
                  className="text-white/82 hover:text-[#3FA9F5] transition-colors"
                >
                  Blood Banking & Apheresis
                </Link>
              </li>
              <li>
                <Link
                  to="/products?category=consumables-reagents"
                  className="text-white/82 hover:text-[#3FA9F5] transition-colors"
                >
                  Consumables & Cartridges
                </Link>
              </li>
              <li>
                <Link
                  to="/services/turnkey"
                  className="text-white/82 hover:text-[#3FA9F5] transition-colors"
                >
                  Turnkey Oxygen & RO Plants
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Institutional Links (2 cols) */}
          <div className="lg:col-span-2">
            <h3 className="text-eyebrow text-[#3FA9F5] mb-4">INSTITUTIONAL</h3>
            <ul className="space-y-2.5 text-[14px]">
              <li>
                <Link to="/about" className="text-white/82 hover:text-[#3FA9F5] transition-colors">
                  About & C.A.R.E.
                </Link>
              </li>
              <li>
                <Link
                  to="/why-sudabelt/compare"
                  className="text-white/82 hover:text-[#3FA9F5] transition-colors"
                >
                  Why Sudabelt (Compare)
                </Link>
              </li>
              <li>
                <Link
                  to="/training-hub"
                  className="text-white/82 hover:text-[#3FA9F5] transition-colors"
                >
                  Clinical Training Hub
                </Link>
              </li>
              <li>
                <Link
                  to="/resources/newsletters"
                  className="text-white/82 hover:text-[#3FA9F5] transition-colors"
                >
                  Newsletter Archive
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-white/82 hover:text-[#3FA9F5] transition-colors">
                  Clinical Blog
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-white/82 hover:text-[#3FA9F5] transition-colors">
                  Biomedical Careers
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Clinical Newsletter Subscription & Direct Desk (4 cols) */}
          <div className="lg:col-span-4">
            <h3 className="text-eyebrow text-[#3FA9F5] mb-3">
              SUBSCRIBE TO CLINICAL & BIOMEDICAL BULLETINS
            </h3>
            <p className="text-[13.5px] text-white/72 mb-4">
              Receive quarterly clinical monographs, NAFDAC/ISO regulatory updates, and preventive
              maintenance advisories for hospital leaders.
            </p>

            {subscribed ? (
              <div className="p-3.5 rounded-[5.5px] bg-[#006837]/30 border border-[#006837] flex items-center gap-2.5 text-[13.5px] text-white">
                <CheckCircle2 className="w-4 h-4 text-[#3FA9F5] shrink-0" />
                <span>Thank you! You are subscribed to Sudabelt Clinical Bulletins.</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-2">
                <label htmlFor="footer-newsletter-email" className="sr-only">
                  Hospital or Work Email
                </label>
                <input
                  id="footer-newsletter-email"
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter hospital / work email..."
                  className="flex-1 h-[46px] px-3.5 rounded-[5.5px] bg-white/10 border border-white/22 text-white placeholder:text-white/50 text-[14px] focus:outline-none focus:border-[#3FA9F5]"
                />
                <button
                  type="submit"
                  className="h-[46px] px-5 rounded-[5.5px] bg-[#3FA9F5] hover:bg-[#2b99eb] text-[#001142] font-extrabold text-[13px] tracking-[0.06em] uppercase transition-colors shrink-0 cursor-pointer"
                >
                  Subscribe
                </button>
              </form>
            )}

            <div className="mt-6 pt-5 border-t border-white/18 space-y-2 text-[13px] text-white/82">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#3FA9F5]" />
                <span className="font-mono">+234 (0) 800-SUDABELT</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#3FA9F5]" />
                <a href="mailto:sales@sudabelt.com" className="hover:text-[#3FA9F5]">
                  sales@sudabelt.com
                </a>
                <span className="text-white/30">•</span>
                <a href="mailto:support@sudabelt.com" className="hover:text-[#3FA9F5]">
                  support@sudabelt.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Legal & Copyright Bar */}
      <div className="border-t border-white/18 bg-[#000c30]">
        <div className="sudabelt-container py-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[12.5px] text-white/70">
          <p>© {new Date().getFullYear()} Sudabelt Medical Ltd. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-5">
            <Link to="/support/emergency-breakdown" className="hover:text-[#3FA9F5]">
              Emergency SLA Dispatch
            </Link>
            <Link to="/rfq" className="hover:text-[#3FA9F5]">
              Institutional RFQ Portal
            </Link>
            <Link to="/admin" className="hover:text-[#3FA9F5]">
              Staff CRM
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
