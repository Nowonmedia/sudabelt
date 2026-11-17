import React from 'react'
import { HeaderTextReveal, SectionReveal } from '../common/Reveal'

const HUB_LOCATIONS = ['LAGOS', 'ABUJA', 'KANO', 'IBADAN', 'OKENE']

const STAGES = ['Planning.', 'Installation.', 'Handover.', 'Support.']

const ProjectsHeroSection: React.FC = () => {
  return (
    <section className="relative bg-sudabelt-navy text-white overflow-hidden py-16 sm:py-20 lg:py-24">
      {/* Background Clinical Imagery with Darkened Overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img
          src="/images/projects/projects-hero.webp"
          alt="Sudabelt Delivered Hospital Projects"
          className="w-full h-full object-cover object-center opacity-30 filter grayscale contrast-125"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-sudabelt-navy via-sudabelt-navy/90 to-sudabelt-navy/80" />
      </div>

      <div className="relative z-10 sudabelt-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Heading, Subtitle & Hubs */}
          <div className="lg:col-span-8">
            <SectionReveal direction="up" delay={0.1}>
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 sm:w-10 h-0.75 bg-sudabelt-red rounded-xs" />
                <span className="text-[12px] sm:text-[13px] font-bold uppercase tracking-[0.14em] text-sudabelt-blue">
                  Projects & Success Stories
                </span>
              </div>
            </SectionReveal>

            <HeaderTextReveal className="mb-5">
              <h1 className="text-3xl sm:text-4xl lg:text-[48px] font-extrabold text-white leading-[1.14] tracking-[-0.025em]">
                Hospitals we have helped build and equip.
              </h1>
            </HeaderTextReveal>

            <SectionReveal direction="up" delay={0.25}>
              <p className="text-base sm:text-lg lg:text-[18.5px] text-white/85 leading-[1.6] font-normal max-w-2xl mb-8">
                From oxygen plants and dialysis centres to imaging and laboratory suites, delivered across Nigeria.
              </p>

              {/* Hub Locations Tags */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-[13px] font-mono font-bold text-white/70">
                {HUB_LOCATIONS.map((loc, idx) => (
                  <React.Fragment key={loc}>
                    <span className="text-white hover:text-sudabelt-blue transition-colors">
                      {loc}
                    </span>
                    {idx < HUB_LOCATIONS.length - 1 && (
                      <span className="text-white/30">•</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </SectionReveal>
          </div>

          {/* Right Column: Turnkey Lifecycle Stages Banner */}
          <div className="lg:col-span-4 lg:pl-6">
            <SectionReveal direction="left" delay={0.3}>
              <div className="border-l-2 border-sudabelt-green/60 pl-6 sm:pl-8 space-y-2">
                {STAGES.map((stage) => (
                  <div
                    key={stage}
                    className="text-xl sm:text-2xl font-extrabold text-white/90 tracking-tight"
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
