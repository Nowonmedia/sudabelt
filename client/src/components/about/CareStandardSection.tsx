import React, { useState } from 'react'
import { HeaderTextReveal, SectionReveal } from '../common/Reveal'

const CareStandardSection: React.FC = () => {
  const [topRowHovered, setTopRowHovered] = useState<boolean>(false)
  const [bottomRowHovered, setBottomRowHovered] = useState<boolean>(false)

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-sudabelt-surface border-y border-sudabelt-border">
      <div className="sudabelt-container">
        {/* Section Header */}
        <div className="max-w-2xl mb-12 sm:mb-16">
          <SectionReveal direction="up" delay={0.1}>
            <div className="flex items-center gap-3 mb-3">
              <span className="w-8 h-0.75 bg-sudabelt-red rounded-xs" />
              <span className="text-[12px] font-bold uppercase tracking-[0.14em] text-sudabelt-green">
                Core Values
              </span>
            </div>
          </SectionReveal>

          <HeaderTextReveal>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-sudabelt-navy tracking-tight">
              The C.A.R.E. standard.
            </h2>
          </HeaderTextReveal>
        </div>

        {/* Bento Grid with Ultra-Smooth, Non-Janky Sizing Shift */}
        <div className="flex flex-col gap-5 sm:gap-6">
          {/* Top Row: C (Navy, smaller by default, expands on hover) & A (White, bigger by default, shrinks on hover) */}
          <SectionReveal direction="up" delay={0.15}>
            <div
              className="flex flex-col sm:flex-row gap-5 sm:gap-6 items-stretch"
              onMouseEnter={() => setTopRowHovered(true)}
              onMouseLeave={() => setTopRowHovered(false)}
            >
              {/* Card C: Dark Navy, Smaller by default (38%), Expands on hover (62%) */}
              <div
                className={`bg-sudabelt-navy text-white p-8 sm:p-10 lg:p-12 flex flex-col justify-between min-h-[260px] sm:min-h-[290px] shadow-sm relative overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] will-change-[width,flex] ${
                  topRowHovered
                    ? 'sm:w-[62%] sm:flex-[62]'
                    : 'sm:w-[38%] sm:flex-[38]'
                } rounded-card sm:rounded-r-none sm:rounded-l-card`}
              >
                <div>
                  <div className="text-5xl sm:text-6xl font-black font-mono leading-none text-white">
                    C
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold mt-5 tracking-tight text-white">
                    Commitment
                  </h3>
                </div>

                <p className="mt-4 text-base sm:text-[16.5px] leading-relaxed text-white/85">
                  We are dedicated to improving healthcare outcomes and delivering excellence in everything we do.
                </p>
              </div>

              {/* Card A: White / Light, Bigger by default (62%), Shrinks on hover (38%) */}
              <div
                className={`bg-white border border-sudabelt-border text-sudabelt-navy p-8 sm:p-10 lg:p-12 flex flex-col justify-between min-h-[260px] sm:min-h-[290px] shadow-xs relative overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] will-change-[width,flex] ${
                  topRowHovered
                    ? 'sm:w-[38%] sm:flex-[38]'
                    : 'sm:w-[62%] sm:flex-[62]'
                } rounded-card sm:rounded-l-none sm:rounded-r-card`}
              >
                <div>
                  <div className="text-5xl sm:text-6xl font-black font-mono leading-none text-sudabelt-navy">
                    A
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold mt-5 tracking-tight text-sudabelt-navy">
                    Accountability
                  </h3>
                </div>

                <p className="mt-4 text-base sm:text-[16.5px] leading-relaxed text-sudabelt-body">
                  We take ownership of our responsibilities and remain transparent in our actions.
                </p>
              </div>
            </div>
          </SectionReveal>

          {/* Bottom Row: R (Light White, bigger by default, shrinks on hover) & E (Brand Green, smaller by default, expands on hover) */}
          <SectionReveal direction="up" delay={0.25}>
            <div
              className="flex flex-col sm:flex-row gap-5 sm:gap-6 items-stretch"
              onMouseEnter={() => setBottomRowHovered(true)}
              onMouseLeave={() => setBottomRowHovered(false)}
            >
              {/* Card R: White / Light, Bigger by default (62%), Shrinks on hover (38%) */}
              <div
                className={`bg-white border border-sudabelt-border text-sudabelt-navy p-8 sm:p-10 lg:p-12 flex flex-col justify-between min-h-[260px] sm:min-h-[290px] shadow-xs relative overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] will-change-[width,flex] ${
                  bottomRowHovered
                    ? 'sm:w-[38%] sm:flex-[38]'
                    : 'sm:w-[62%] sm:flex-[62]'
                } rounded-card sm:rounded-r-none sm:rounded-l-card`}
              >
                <div>
                  <div className="text-5xl sm:text-6xl font-black font-mono leading-none text-sudabelt-navy">
                    R
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold mt-5 tracking-tight text-sudabelt-navy">
                    Reliability
                  </h3>
                </div>

                <p className="mt-4 text-base sm:text-[16.5px] leading-relaxed text-sudabelt-body">
                  We build trust through consistency, quality service, and dependable partnerships.
                </p>
              </div>

              {/* Card E: Brand Green (#006837), Smaller by default (38%), Expands on hover (62%) */}
              <div
                className={`bg-sudabelt-green text-white p-8 sm:p-10 lg:p-12 flex flex-col justify-between min-h-[260px] sm:min-h-[290px] shadow-sm relative overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] will-change-[width,flex] ${
                  bottomRowHovered
                    ? 'sm:w-[62%] sm:flex-[62]'
                    : 'sm:w-[38%] sm:flex-[38]'
                } rounded-card sm:rounded-l-none sm:rounded-r-card`}
              >
                <div>
                  <div className="text-5xl sm:text-6xl font-black font-mono leading-none text-white">
                    E
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold mt-5 tracking-tight text-white">
                    Efficiency
                  </h3>
                </div>

                <p className="mt-4 text-base sm:text-[16.5px] leading-relaxed text-white/90">
                  We continuously optimize processes to deliver timely, cost-effective, and sustainable solutions.
                </p>
              </div>
            </div>
          </SectionReveal>
        </div>
      </div>
    </section>
  )
}

export default CareStandardSection
