import React from 'react'
import { SectionReveal } from '../common/Reveal'

const PARTNERS = [
  { name: 'GE HealthCare', href: 'https://www.gehealthcare.com' },
  { name: 'Baxter', href: 'https://www.baxter.com' },
  { name: 'Abbott', href: 'https://www.abbott.com' },
  { name: 'Terumo BCT', href: 'https://www.terumobct.com' },
  { name: 'Fisher & Paykel', href: 'https://www.fphcare.com' },
]

const ServicesPartnersRow: React.FC = () => {
  return (
    <section className="py-12 sm:py-14 bg-white border-b border-sudabelt-border">
      <div className="sudabelt-container">
        <SectionReveal direction="up" delay={0.1}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-8">
            <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-sudabelt-muted shrink-0">
              Partner Brands
            </span>

            <div className="flex flex-wrap items-center justify-between gap-6 sm:gap-10 flex-1 md:pl-8">
              {PARTNERS.map((partner) => (
                <a
                  key={partner.name}
                  href={partner.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base sm:text-lg font-bold text-sudabelt-navy hover:text-sudabelt-green transition-colors"
                >
                  {partner.name}
                </a>
              ))}
            </div>
          </div>
        </SectionReveal>
      </div>
    </section>
  )
}

export default ServicesPartnersRow
