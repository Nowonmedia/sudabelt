import React from 'react'
import { Link } from 'react-router'
import { Package, Building2, GraduationCap, Wrench } from 'lucide-react'
import { HeaderTextReveal, SectionReveal } from '../common/Reveal'

interface TurnkeyPillar {
  number: string
  icon: React.ElementType
  title: string
  description: string
  ctaLabel: string
  ctaPath: string
}

const TURNKEY_PILLARS: TurnkeyPillar[] = [
  {
    number: '01',
    icon: Package,
    title: 'Healthcare Technology Solutions & Medical Consumables',
    description:
      'Specialized medical equipment and consumables sales, marketing, workshops, and live clinical demonstrations for hospitals, clinics, and laboratories.',
    ctaLabel: 'BROWSE PORTFOLIO →',
    ctaPath: '/products',
  },
  {
    number: '02',
    icon: Building2,
    title: 'Healthcare Infrastructure & Turnkey Projects',
    description:
      'End-to-end hospital design, equipment procurement, ICU, dialysis and diagnostic centre development, installation, integration, and commissioning.',
    ctaLabel: 'EXPLORE PROJECTS →',
    ctaPath: '/projects',
  },
  {
    number: '03',
    icon: Wrench,
    title: 'Biomedical Engineering Solutions',
    description:
      'Preventive and corrective maintenance, calibration, lifecycle management, clinical applications support, and system optimization.',
    ctaLabel: 'AFTER-SALES SUPPORT →',
    ctaPath: '/support',
  },
  {
    number: '04',
    icon: GraduationCap,
    title: 'Healthcare Education & Capacity Building',
    description:
      'Clinical training, CME programmes, biomedical engineering certifications, technical workshops, and community health outreach.',
    ctaLabel: 'TRAINING HUB →',
    ctaPath: '/training-hub',
  },
]

const TurnkeyPillarsSection: React.FC = () => {
  return (
    <section className="bg-white py-20 lg:py-24">
      <div className="sudabelt-container">
        {/* Section Header Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-end">
          <HeaderTextReveal className="lg:col-span-7">
            <div className="w-5.5 h-0.75 bg-sudabelt-red rounded-mark mb-3" />
            <span className="text-eyebrow text-sudabelt-green">THE TURNKEY MODEL</span>
            <h2 className="text-section-heading text-sudabelt-navy mt-2.5 max-w-135">
              One Partner Across the Entire Equipment Lifecycle.
            </h2>
          </HeaderTextReveal>

          <SectionReveal direction="left" delay={0.1} className="lg:col-span-5 lg:pb-1">
            <p className="text-[15.5px] leading-[25.5px] text-sudabelt-body max-w-110">
              Why hospitals choose a full-scope infrastructure partner over standalone importers and
              catalog retailers.
            </p>
          </SectionReveal>
        </div>

        {/* 4 Pillar Cards Grid - Sudabelt Blue by default, Transparent on Hover */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-12">
          {TURNKEY_PILLARS.map((pillar, idx) => {
            const IconComponent = pillar.icon
            return (
              <SectionReveal key={pillar.number} direction="up" delay={0.08 * (idx + 1)}>
                <div className="group h-full p-7 rounded-card border border-sudabelt-navy bg-sudabelt-navy text-white hover:bg-transparent hover:border-sudabelt-navy/25 hover:-translate-y-1.5 hover:shadow-xl flex flex-col justify-between min-h-85 transition-all duration-300">
                  <div>
                    {/* Top Row: Icon + Monospace Number */}
                    <div className="flex items-center justify-between">
                      <div className="w-10.5 h-10.5 rounded-badge bg-white/10 text-sudabelt-blue group-hover:bg-sudabelt-navy group-hover:text-white inline-flex items-center justify-center transition-colors duration-300">
                        <IconComponent className="w-5 h-5" strokeWidth={1.75} />
                      </div>
                      <span className="font-mono text-[12.5px] font-semibold text-sudabelt-blue group-hover:text-sudabelt-navy transition-colors duration-300">
                        {pillar.number}
                      </span>
                    </div>

                    {/* Title & Description */}
                    <h3 className="text-[21px] leading-6.75 font-bold text-white group-hover:text-sudabelt-navy mt-6 transition-colors duration-300">
                      {pillar.title}
                    </h3>
                    <p className="text-[14.5px] leading-5.75 text-white/80 group-hover:text-sudabelt-body mt-3 transition-colors duration-300">
                      {pillar.description}
                    </p>
                  </div>

                  {/* Bottom Action Link */}
                  <div className="mt-8 pt-4 border-t border-white/15 group-hover:border-sudabelt-border transition-colors duration-300">
                    <Link
                      to={pillar.ctaPath}
                      className="text-[12px] font-extrabold uppercase tracking-[0.06em] text-sudabelt-blue group-hover:text-sudabelt-navy transition-colors duration-300 inline-flex items-center group-hover:translate-x-1"
                    >
                      {pillar.ctaLabel}
                    </Link>
                  </div>
                </div>
              </SectionReveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default TurnkeyPillarsSection
