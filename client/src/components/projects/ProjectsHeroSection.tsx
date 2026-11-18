import React from 'react'
import { HeaderTextReveal, SectionReveal } from '../common/Reveal'

const HUB_LOCATIONS = ['LAGOS', 'ABUJA', 'KANO', 'IBADAN', 'OKENE']

const STAGES = ['Planning.', 'Installation.', 'Handover.', 'Support.']

const ProjectsHeroSection: React.FC = () => {
  return (
    <section className="relative text-white overflow-hidden py-16 sm:py-20 lg:py-24 min-h-120 sm:min-h-130 flex items-center">
      {/* Full Background Clinical Photo (100% visible, NO blue background; just image and text on top) */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/projects/projects-hero.webp"
          alt="Hospitals Built and Equipped by Sudabelt"
          className="w-full h-full object-cover object-center"
        />
      </div>

      <div className="relative z-10 sudabelt-container w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Heading, Subtitle & Hubs with text drop shadow for direct overlay on image */}
          <div className="lg:col-span-8">
            <SectionReveal direction="up" delay={0.1}>
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 sm:w-10 h-0.75 bg-sudabelt-red rounded-xs" />
                <span className="inline-block px-3.5 py-1 rounded-control bg-sudabelt-blue text-white text-[12px] sm:text-[13px] font-extrabold uppercase tracking-[0.14em] shadow-md">
                  Projects & Success Stories
                </span>
              </div>
            </SectionReveal>

            <HeaderTextReveal className="mb-5">
              <h1 className="text-3xl sm:text-4xl lg:text-[48px] font-extrabold text-white leading-[1.14] tracking-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">
                Hospitals we have helped build and equip.
              </h1>
            </HeaderTextReveal>

            <SectionReveal direction="up" delay={0.25}>
              <p className="text-base sm:text-lg lg:text-[18.5px] text-white leading-[1.6] font-medium max-w-2xl mb-8 drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
                From oxygen plants and dialysis centres to imaging and laboratory suites, delivered across Nigeria.
              </p>

              {/* Hub Locations Tags */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-[13px] font-mono font-bold text-white drop-shadow-md">
                {HUB_LOCATIONS.map((loc, idx) => (
                  <React.Fragment key={loc}>
                    <span className="hover:text-sudabelt-blue transition-colors">
                      {loc}
                    </span>
                    {idx < HUB_LOCATIONS.length - 1 && (
                      <span className="text-white/60">•</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </SectionReveal>
          </div>

          {/* Right Column: Turnkey Lifecycle Stages Banner */}
          <div className="lg:col-span-4 lg:pl-6">
            <SectionReveal direction="left" delay={0.3}>
              <div className="border-l-2 border-sudabelt-green pl-6 sm:pl-8 space-y-2">
                {STAGES.map((stage) => (
                  <div
                    key={stage}
                    className="text-xl sm:text-2xl font-extrabold text-white tracking-tight drop-shadow-[0_2px_6px_rgba(0,0,0,0.85)]"
                  >
                    {stage}
                  </div>
                ))}
              </div>
            </SectionReveal>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProjectsHeroSection
