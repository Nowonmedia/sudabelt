import React, { useState } from 'react'
import { Link } from 'react-router'
import { FaLinkedinIn, FaFacebookF, FaInstagram } from 'react-icons/fa6'
import { toast } from 'react-toastify'
import SudabeltLogo from '../components/common/SudabeltLogo'
import { api } from '../api/api'

const Footer: React.FC = () => {
  const [subscriberEmail, setSubscriberEmail] = useState('')
  const [isSubscribing, setIsSubscribing] = useState(false)
  const [subscribedSuccess, setSubscribedSuccess] = useState(false)

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!subscriberEmail || !subscriberEmail.includes('@')) {
      toast.error('Please enter a valid email address.')
      return
    }
    setIsSubscribing(true)
    try {
      const res = await api.subscribeNewsletter({ email: subscriberEmail })
      setSubscribedSuccess(true)
      toast.success(res.message || 'Subscribed successfully!')
      setSubscriberEmail('')
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Subscription failed.'
      toast.error(msg)
    } finally {
      setIsSubscribing(false)
    }
  }

  return (
    <footer className="bg-sudabelt-navy text-white">
      <div className="sudabelt-container pt-16 pb-10">
        {/* Newsletter Subscription Row */}
        <div className="pb-12 mb-12 border-b border-white/18 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="text-[11px] font-bold tracking-[0.14em] uppercase text-emerald-400 block mb-1">
              CLINICAL DISPATCH &amp; INDUSTRY INSIGHTS
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Subscribe to Sudabelt Medical Insights.
            </h3>
            <p className="text-xs sm:text-sm text-white/70 mt-1 max-w-lg">
              Quarterly updates on hospital engineering standards, dialysis protocols, and biomedical maintenance across Nigeria.
            </p>
          </div>

          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <input
              type="email"
              value={subscriberEmail}
              onChange={(e) => setSubscriberEmail(e.target.value)}
              placeholder="Enter your work email"
              required
              className="h-11 px-4 rounded-control bg-white/10 border border-white/20 text-white placeholder-white/50 text-xs focus:outline-none focus:border-sudabelt-blue w-full sm:w-72"
            />
            <button
              type="submit"
              disabled={isSubscribing}
              className="h-11 px-6 rounded-control bg-sudabelt-blue hover:bg-sudabelt-green text-white text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50 shrink-0 cursor-pointer"
            >
              {isSubscribing ? 'Subscribing...' : subscribedSuccess ? 'Subscribed!' : 'Subscribe'}
            </button>
          </form>
        </div>

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
                href="https://www.instagram.com/sudabeltmedical.ng/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Sudabelt Instagram"
                className="w-8 h-8 rounded-control border border-white/22 text-white/82 hover:border-sudabelt-blue hover:text-sudabelt-blue inline-flex items-center justify-center transition-colors"
              >
                <FaInstagram className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://www.facebook.com/sudabelt/"
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
          <p>© 2026 Sudabelt Medical Ltd. <a href='https://nowon.media' target='_blank'>Powered by Now On Media</a> </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
