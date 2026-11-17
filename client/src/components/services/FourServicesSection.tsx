import React from 'react'
import { Link } from 'react-router'
import { ArrowRight } from 'lucide-react'
import { SectionReveal } from '../common/Reveal'

interface ServiceCardData {
  number: string
  title: string
  summary: string
  subcategories: string
  actionLabel: string
  actionPath: string
}

const SERVICES_DATA: ServiceCardData[] = [
  {
    number: '01',
    title: 'Healthcare Technology Solutions & Medical Consumables',
    summary:
      'Advanced equipment supplied through turnkey partnerships at competitive prices, for clients and patients across Nigeria and Africa. Consumables of international quality for hospitals, clinics, and medical institutions nationwide.',
    subcategories:
      'Imaging · Respiratory & Anesthesia · Renal & Critical Care · Laboratory & Diagnostics · General Surgery · Infusion · Fisher & Paykel · FSN Displays & Surgiris',
    actionLabel: 'Browse Technology & Consumables',
    actionPath: '/products',
  },
  {
    number: '02',
    title: 'Healthcare Infrastructure & Turnkey Projects',
    summary:
      'Facility planning, professional installation and end-to-end project support for healthcare institutions across Sub-Saharan Africa.',
    subcategories:
      'Facility planning · Equipment Installation · Clinical workflow · Ongoing project support',
    actionLabel: 'Explore Projects',
    actionPath: '/projects',
  },
  {
    number: '03',
    title: 'Biomedical Engineering Solutions',
    summary:
      'After-sales support that extends equipment lifespan, delivered by a dedicated local engineering team for quick response times.',
    subcategories:
      'Prompt repairs & fault troubleshooting · Equipment management · Servicing',
    actionLabel: 'Get After-Sales Support',
    actionPath: '/support',
  },
  {
    number: '04',
    title: 'Healthcare Education & Capacity Building',
    summary:
      'Expert clinical training, regular CME programs, and technical workshops that help your teams excel in patient care.',
    subcategories:
      'Expert training · Conferences · Hands-on masterclasses',
    actionLabel: 'Visit the Training Hub',
    actionPath: '/training-hub',
  },
]

const FourServicesSection: React.FC = () => {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-sudabelt-surface">
      <div className="sudabelt-container space-y-6 sm:space-y-8">
        {SERVICES_DATA.map((service, idx) => {
          // Every other card has a slight green background (#EAF3EC)
          const isGreenBg = idx % 2 === 1
          const cardBgClass = isGreenBg
            ? 'bg-[#EAF3EC] border-sudabelt-sage/60 hover:bg-[#e4efe7]'
            : 'bg-white border-sudabelt-border hover:bg-white'

          return (
            <SectionReveal key={service.number} direction="up" delay={0.1 * (idx + 1)}>
              <div
                className={`rounded-card p-8 sm:p-10 lg:p-12 border shadow-xs hover:-translate-y-1.5 hover:shadow-card hover:border-sudabelt-green transition-all duration-300 group cursor-default ${cardBgClass}`}
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
                  {/* Left Column: Number, Title, Red Bar */}
                  <div className="lg:col-span-5">
                    <div className="w-9 h-9 rounded-control bg-sudabelt-green text-white font-mono font-bold text-sm flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                      {service.number}
                    </div>

                    <h2 className="text-2xl sm:text-[28px] font-extrabold text-sudabelt-navy leading-tight tracking-tight mt-5 group-hover:text-sudabelt-green transition-colors">
                      {service.title}
                    </h2>

                    <div className="w-8 h-0.75 bg-sudabelt-red rounded-xs mt-5 group-hover:w-12 transition-all duration-300" />
                  </div>

                  {/* Right Column: Description, Subcategories, Action Link */}
                  <div className="lg:col-span-7 flex flex-col justify-between h-full pt-1">
                    <div>
                      <p className="text-sudabelt-body text-base sm:text-[16.5px] leading-relaxed">
                        {service.summary}
                      </p>

                      <p className="text-xs sm:text-[13px] text-sudabelt-muted leading-relaxed mt-4 font-mono">
                        {service.subcategories}
                      </p>
                    </div>

                    <div className="mt-8 pt-4 border-t border-sudabelt-border/60">
                      <Link
                        to={service.actionPath}
                        className="inline-flex items-center gap-2 text-xs sm:text-[13px] font-extrabold uppercase tracking-wider text-sudabelt-green hover:text-sudabelt-navy transition-colors"
                      >
                        <span>{service.actionLabel}</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </SectionReveal>
          )
        })}
      </div>
    </section>
  )
}

export default FourServicesSection
