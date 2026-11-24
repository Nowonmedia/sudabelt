import React from 'react'
import { HeaderTextReveal, SectionReveal } from '../common/Reveal'

export type DepartmentFilter = 'all' | 'renal' | 'apheresis' | 'icu'

interface CompareHeroSectionProps {
  activeFilter: DepartmentFilter
  onFilterChange: (filter: DepartmentFilter) => void
}

export const CompareHeroSection: React.FC<CompareHeroSectionProps> = ({
  activeFilter,
  onFilterChange,
}) => {
  return (
    <div className="w-full">
      {/* Hero Visual Section */}
      <section className="relative text-white overflow-hidden min-h-95 sm:min-h-110 flex items-center bg-sudabelt-navy">
        {/* Background photo with actual Sudabelt installation & transparent overlay for text contrast */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/2 - Renal Equipment from Baxter Installed by Sudabelt.webp"
            alt="Renal Equipment from Baxter Installed by Sudabelt"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-[#06183d]/60" />
        </div>

        <div className="relative z-10 sudabelt-container py-14 sm:py-18 lg:py-22">
          <div className="max-w-3xl">
            {/* Eyebrow */}
            <SectionReveal direction="up" delay={0.1}>
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 sm:w-10 h-0.75 bg-sudabelt-red rounded-xs" />
                <span className="inline-block px-3 py-1 rounded-control bg-sudabelt-blue text-white text-[11px] sm:text-[12px] font-extrabold uppercase tracking-[0.14em] shadow-sm">
                  WHY SUDABELT · LIVE COMPARISON
                </span>
              </div>
            </SectionReveal>

            {/* Headline */}
            <HeaderTextReveal className="mb-5">
              <h1 className="text-3xl sm:text-4xl lg:text-[46px] font-extrabold text-white leading-[1.15] tracking-tight">
                Not every supplier is built for uptime.
              </h1>
            </HeaderTextReveal>

            {/* Subtitle */}
            <SectionReveal direction="up" delay={0.25}>
              <p className="text-base sm:text-lg text-gray-200 leading-relaxed font-medium max-w-2xl">
                See how a turnkey infrastructure partner compares with standard importers and catalog retailers on the four factors that decide whether equipment actually works.
              </p>
            </SectionReveal>
          </div>
        </div>
      </section>

      {/* Filter Tabs & Industry Disclaimer Bar */}
      <section className="bg-white border-b border-sudabelt-border py-6">
        <div className="sudabelt-container">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-2.5">
              {[
                { id: 'all' as const, label: 'All departments' },
                { id: 'renal' as const, label: 'Renal / Dialysis setup' },
                { id: 'apheresis' as const, label: 'Apheresis & blood banking' },
                { id: 'icu' as const, label: 'ICU & oxygen infrastructure' },
              ].map((pill) => (
                <button
                  key={pill.id}
                  type="button"
                  onClick={() => onFilterChange(pill.id)}
                  className={`px-4 py-2 rounded-control text-xs sm:text-[13px] font-bold transition-all cursor-pointer ${
                    activeFilter === pill.id
                      ? 'bg-sudabelt-navy text-white shadow-xs'
                      : 'bg-sudabelt-surface text-sudabelt-navy hover:bg-sudabelt-border border border-sudabelt-border'
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>

            <p className="text-xs text-sudabelt-muted italic">
              Comparing against industry archetypes, not named companies.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default CompareHeroSection
