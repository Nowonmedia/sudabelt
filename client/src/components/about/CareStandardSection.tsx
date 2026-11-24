import React, { useState } from 'react'
import { HeaderTextReveal, SectionReveal } from '../common/Reveal'

type CareCard = 'C' | 'A' | 'R' | 'E' | null

const CareStandardSection: React.FC = () => {
  const [hoveredCard, setHoveredCard] = useState<CareCard>(null)

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
              The C.A.R.E. Standard.
            </h2>
          </HeaderTextReveal>
        </div>

        {/* Bento Grid with Ultra-Smooth Individual Card Hover Expansion */}
        <div className="flex flex-col gap-5 sm:gap-6">
          {/* Top Row: C & A */}
          <SectionReveal direction="up" delay={0.15}>
            <div className="flex flex-col sm:flex-row gap-5 sm:gap-6 items-stretch">
              {/* Card C: Dark Navy */}
              {/* Default: 38%. When hovered: 62%. When A hovered: 32%. */}
              <div
                onMouseEnter={() => setHoveredCard('C')}
                onMouseLeave={() => setHoveredCard(null)}
                className={`bg-sudabelt-navy text-white p-8 sm:p-10 lg:p-12 flex flex-col justify-between min-h-65 sm:min-h-72.5 shadow-sm relative overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] will-change-[width,flex] ${
                  hoveredCard === 'C'
                    ? 'sm:w-[62%] sm:flex-62'
                    : hoveredCard === 'A'
                    ? 'sm:w-[32%] sm:flex-32'
                    : 'sm:w-[38%] sm:flex-38'
                } rounded-card sm:rounded-r-none sm:rounded-l-card cursor-pointer`}
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

              {/* Card A: White */}
              {/* Default: 62%. When hovered: 68%. When C hovered: 38%. */}
              <div
                onMouseEnter={() => setHoveredCard('A')}
                onMouseLeave={() => setHoveredCard(null)}
                className={`bg-white border border-sudabelt-border text-sudabelt-navy p-8 sm:p-10 lg:p-12 flex flex-col justify-between min-h-65 sm:min-h-72.5 shadow-xs relative overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] will-change-[width,flex] ${
                  hoveredCard === 'A'
                    ? 'sm:w-[68%] sm:flex-68'
                    : hoveredCard === 'C'
                    ? 'sm:w-[38%] sm:flex-38'
                    : 'sm:w-[62%] sm:flex-62'
                } rounded-card sm:rounded-l-none sm:rounded-r-card cursor-pointer`}
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

          {/* Bottom Row: R & E */}
          <SectionReveal direction="up" delay={0.25}>
            <div className="flex flex-col sm:flex-row gap-5 sm:gap-6 items-stretch">
              {/* Card R: White */}
              {/* Default: 62%. When hovered: 68%. When E hovered: 38%. */}
              <div
                onMouseEnter={() => setHoveredCard('R')}
                onMouseLeave={() => setHoveredCard(null)}
                className={`bg-white border border-sudabelt-border text-sudabelt-navy p-8 sm:p-10 lg:p-12 flex flex-col justify-between min-h-65 sm:min-h-72.5 shadow-xs relative overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] will-change-[width,flex] ${
                  hoveredCard === 'R'
                    ? 'sm:w-[68%] sm:flex-68'
                    : hoveredCard === 'E'
                    ? 'sm:w-[38%] sm:flex-38'
                    : 'sm:w-[62%] sm:flex-62'
                } rounded-card sm:rounded-r-none sm:rounded-l-card cursor-pointer`}
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

              {/* Card E: Brand Green */}
              {/* Default: 38%. When hovered: 62%. When R hovered: 32%. */}
              <div
                onMouseEnter={() => setHoveredCard('E')}
                onMouseLeave={() => setHoveredCard(null)}
                className={`bg-sudabelt-green text-white p-8 sm:p-10 lg:p-12 flex flex-col justify-between min-h-65 sm:min-h-72.5 shadow-sm relative overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] will-change-[width,flex] ${
                  hoveredCard === 'E'
                    ? 'sm:w-[62%] sm:flex-62'
                    : hoveredCard === 'R'
                    ? 'sm:w-[32%] sm:flex-32'
                    : 'sm:w-[38%] sm:flex-38'
                } rounded-card sm:rounded-l-none sm:rounded-r-card cursor-pointer`}
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
