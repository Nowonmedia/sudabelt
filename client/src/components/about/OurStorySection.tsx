import React from 'react'
import { HeaderTextReveal, SectionReveal } from '../common/Reveal'
import { CheckCircle, Award } from 'lucide-react'

export const OurStorySection: React.FC = () => {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-sudabelt-surface border-y border-sudabelt-border">
      <div className="sudabelt-container">
        {/* Section Eyebrow & Title */}
        <div className="max-w-3xl mb-12 lg:mb-16">
          <SectionReveal direction="up" delay={0.1}>
            <div className="flex items-center gap-3 mb-3">
              <span className="w-8 h-0.75 bg-sudabelt-red rounded-xs" />
              <span className="text-[12px] font-bold uppercase tracking-[0.14em] text-sudabelt-green">
                OUR STORY
              </span>
            </div>
          </SectionReveal>

          <HeaderTextReveal>
            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-sudabelt-navy tracking-tight leading-tight">
              A Legacy of Healthcare Transformation.
            </h2>
          </HeaderTextReveal>
          <p className="mt-3 text-base sm:text-lg text-sudabelt-body leading-relaxed">
            From our founding by the late Chairman Mohammed Usman Eltayeb to becoming a nationwide turnkey leader, our mission has remained constant: bridge critical technology gaps with lasting clinical reliability.
          </p>
        </div>

        {/* 3 Visual Milestone Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-12">
          {/* Milestone 1: 2016 */}
          <div className="p-7 rounded-card bg-white border border-sudabelt-border shadow-xs hover:border-sudabelt-green/50 transition-colors">
            <span className="text-3xl font-black font-mono text-sudabelt-green block mb-2">
              2016
            </span>
            <h3 className="text-lg font-bold text-sudabelt-navy mb-2">
              The Inception
            </h3>
            <p className="text-sm text-sudabelt-body leading-relaxed">
              Founded by late Chairman Mohammed Usman Eltayeb to provide Sub-Saharan Africa with direct access to world-class medical equipment manufacturers.
            </p>
          </div>

          {/* Milestone 2: 2020 */}
          <div className="p-7 rounded-card bg-white border border-sudabelt-border shadow-xs hover:border-sudabelt-green/50 transition-colors">
            <span className="text-3xl font-black font-mono text-sudabelt-blue block mb-2">
              2020
            </span>
            <h3 className="text-lg font-bold text-sudabelt-navy mb-2">
              COVID-19 Response
            </h3>
            <p className="text-sm text-sudabelt-body leading-relaxed">
              Executed landmark turnkey infrastructure including the Gbagada General Hospital Oxygen Plant, commissioned by the Lagos State Governor.
            </p>
          </div>

          {/* Milestone 3: Today */}
          <div className="p-7 rounded-card bg-white border border-sudabelt-border shadow-xs hover:border-sudabelt-green/50 transition-colors">
            <span className="text-3xl font-black font-mono text-sudabelt-navy block mb-2">
              Today
            </span>
            <h3 className="text-lg font-bold text-sudabelt-navy mb-2">
              Integrated National Leader
            </h3>
            <p className="text-sm text-sudabelt-body leading-relaxed">
              Representing 8 tier-1 global OEM partners, with physical offices in Lagos, Abuja, and Kano, serving healthcare institutions across all 36 states.
            </p>
          </div>
        </div>

        {/* Concise Landmark Execution Banner */}
        <div className="p-6 sm:p-8 rounded-card bg-white border border-sudabelt-border flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-sudabelt-green-tint border border-sudabelt-green/30 flex items-center justify-center shrink-0">
              <Award className="w-6 h-6 text-sudabelt-green" />
            </div>
            <div>
              <h4 className="text-base font-bold text-sudabelt-navy">
                Proven Hospital Track Record
              </h4>
              <p className="text-xs sm:text-sm text-sudabelt-muted mt-0.5">
                Dialysis centres, oxygen plants, imaging suites, and intensive care installations delivered across Nigeria.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {['Enoch & Folu Adeboye Dialysis', 'Reference Hospital Okene', 'NNPC Multi-Specialist Abuja'].map((proj) => (
              <span
                key={proj}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-control bg-sudabelt-surface text-xs font-semibold text-sudabelt-navy border border-sudabelt-border font-mono"
              >
                <CheckCircle className="w-3.5 h-3.5 text-sudabelt-green" />
                {proj}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default OurStorySection
