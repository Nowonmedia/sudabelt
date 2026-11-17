import React from 'react'
import { Link } from 'react-router'
import { MapPin, Mail, Phone, Building2, CheckCircle2 } from 'lucide-react'
import { HeaderTextReveal, SectionReveal } from '../common/Reveal'

const NationwidePresenceSection: React.FC = () => {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-white border-t border-sudabelt-border">
      <div className="sudabelt-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Engineers On Call */}
          <div className="lg:col-span-6">
            <SectionReveal direction="up" delay={0.1}>
              <div className="flex items-center gap-3 mb-3">
                <span className="w-8 h-0.75 bg-sudabelt-red rounded-xs" />
                <span className="text-[12px] font-bold uppercase tracking-[0.14em] text-sudabelt-green">
                  Offices
                </span>
              </div>
            </SectionReveal>

            <HeaderTextReveal className="mb-4">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-sudabelt-navy tracking-tight leading-tight">
                Engineers on call anywhere in Nigeria.
              </h2>
            </HeaderTextReveal>

            <SectionReveal direction="up" delay={0.25}>
              <p className="text-sudabelt-body text-base sm:text-[17px] leading-relaxed mb-6">
                A nationwide network of certified biomedical service engineers and customer support centers across 36 states and the Federal Capital Territory.
              </p>

              {/* Direct Contacts */}
              <div className="space-y-3 mb-8">
                <div className="flex items-start gap-3 text-sm text-sudabelt-navy">
                  <MapPin className="w-4 h-4 text-sudabelt-green shrink-0 mt-1" />
                  <span>
                    <strong>Headquarters:</strong> 16B Chris Maduike Drive, Lekki Phase 1 / Victoria Island, Lagos
                  </span>
                </div>

                <div className="flex items-center gap-3 text-sm text-sudabelt-navy">
                  <Mail className="w-4 h-4 text-sudabelt-green shrink-0" />
                  <a
                    href="mailto:info@sudabelt.com"
                    className="hover:text-sudabelt-blue transition-colors font-mono"
                  >
                    info@sudabelt.com
                  </a>
                </div>

                <div className="flex items-center gap-3 text-sm text-sudabelt-navy">
                  <Phone className="w-4 h-4 text-sudabelt-green shrink-0" />
                  <a
                    href="tel:+2349011235400"
                    className="hover:text-sudabelt-blue transition-colors font-mono font-medium"
                  >
                    +234 901 123 5400
                  </a>
                </div>
              </div>

              <Link
                to="/contact"
                className="inline-flex items-center justify-center h-12 px-8 rounded-control bg-sudabelt-navy hover:bg-sudabelt-navy/90 text-white font-extrabold text-xs uppercase tracking-wider transition-colors"
              >
                Contact Us
              </Link>
            </SectionReveal>
          </div>

          {/* Right Column: Solid Green Regional Card (#006837) */}
          <div className="lg:col-span-6">
            <SectionReveal direction="left" delay={0.2}>
              <div className="bg-sudabelt-green text-white rounded-card p-8 sm:p-10 lg:p-12 shadow-md relative overflow-hidden">
                {/* Pattern Watermark */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-10 bg-repeat bg-contain"
                  style={{ backgroundImage: `url('/images/brand/PATTERNS-WHITE SLIM 1.webp')` }}
                />

                <div className="relative z-10">
                  <div className="text-xs font-bold uppercase tracking-[0.14em] text-sudabelt-blue mb-2">
                    Service Hubs
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-6">
                    Local presence. Ongoing support.
                  </h3>

                  <div className="space-y-4 mb-8 divide-y divide-white/15">
                    <div className="pt-2 first:pt-0">
                      <div className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-sudabelt-blue shrink-0" />
                        <span>Lagos: Victoria Island</span>
                      </div>
                      <p className="text-xs sm:text-sm text-white/80 mt-1 pl-6">
                        Headquarters, primary biomedical workshop, spare parts reserve & customer training facility.
                      </p>
                    </div>

                    <div className="pt-4">
                      <div className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-sudabelt-blue shrink-0" />
                        <span>Abuja: Maitama</span>
                      </div>
                      <p className="text-xs sm:text-sm text-white/80 mt-1 pl-6">
                        Federal Capital Territory regional operations & Northern government institution liaison.
                      </p>
                    </div>

                    <div className="pt-4">
                      <div className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-sudabelt-blue shrink-0" />
                        <span>Kano: Sharada</span>
                      </div>
                      <p className="text-xs sm:text-sm text-white/80 mt-1 pl-6">
                        North-West operations, engineering field hub, and rapid biomedical response base.
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/20 flex items-center gap-3 text-xs text-white/85">
                    <Building2 className="w-4 h-4 text-sudabelt-blue shrink-0" />
                    <span>
                      29 specialized medical supply outlets located within selected teaching & specialist hospitals nationwide.
                    </span>
                  </div>
                </div>
              </div>
            </SectionReveal>
          </div>
        </div>
      </div>
    </section>
  )
}

export default NationwidePresenceSection
