import React from 'react'
import { HeaderTextReveal, SectionReveal } from '../common/Reveal'

const VisionMissionSection: React.FC = () => {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-white">
      <div className="sudabelt-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
          {/* Vision Card - Zero Border Radius + Interactive Hover Background Change */}
          <SectionReveal direction="up" delay={0.1}>
            <div className="group h-full rounded-none bg-sudabelt-surface border border-sudabelt-border hover:border-sudabelt-navy hover:bg-sudabelt-navy p-8 sm:p-10 lg:p-12 flex flex-col justify-between shadow-xs transition-all duration-300 cursor-default">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="w-8 h-0.75 bg-sudabelt-red rounded-xs" />
                  <span className="text-[12px] font-bold uppercase tracking-[0.12em] text-sudabelt-green group-hover:text-sudabelt-blue transition-colors">
                    Our Vision
                  </span>
                </div>

                <HeaderTextReveal className="mb-4">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-sudabelt-navy group-hover:text-white leading-tight tracking-tight transition-colors">
                    Quality Care, Within Reach.
                  </h2>
                </HeaderTextReveal>

                <p className="text-sudabelt-body group-hover:text-white/90 text-base sm:text-[17px] leading-relaxed transition-colors">
                  To lead the transformation of healthcare delivery in Africa through integrated, end-to-end solutions that set new standards in quality, access, and outcomes.
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-sudabelt-border/60 group-hover:border-white/20 flex items-center justify-between text-xs text-sudabelt-muted group-hover:text-white/70 font-medium transition-colors">
                <span>Core Pillar: Clinical Equity</span>
                <span className="font-mono text-sudabelt-green group-hover:text-sudabelt-blue font-bold transition-colors">
                  01 / VISION
                </span>
              </div>
            </div>
          </SectionReveal>

          {/* Mission Card - Zero Border Radius + Interactive Hover Background Change */}
          <SectionReveal direction="up" delay={0.2}>
            <div className="group h-full rounded-none bg-sudabelt-green-tint border border-sudabelt-sage hover:border-sudabelt-green hover:bg-sudabelt-green p-8 sm:p-10 lg:p-12 flex flex-col justify-between shadow-xs transition-all duration-300 cursor-default">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="w-8 h-0.75 bg-sudabelt-red rounded-xs" />
                  <span className="text-[12px] font-bold uppercase tracking-[0.12em] text-sudabelt-green group-hover:text-white/90 transition-colors">
                    Our Mission
                  </span>
                </div>

                <HeaderTextReveal className="mb-4">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-sudabelt-navy group-hover:text-white leading-tight tracking-tight transition-colors">
                    The Region's Integrated Leader.
                  </h2>
                </HeaderTextReveal>

                <p className="text-sudabelt-navy/85 group-hover:text-white/95 text-base sm:text-[17px] leading-relaxed transition-colors">
                  To advance healthcare in Africa through innovative medical solutions, exceptional service, and end-to-end project support, building on a sustainable future and enabling dignified, high-quality patient care.
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-sudabelt-sage/60 group-hover:border-white/20 flex items-center justify-between text-xs text-sudabelt-green group-hover:text-white/80 font-medium transition-colors">
                <span>Core Pillar: Sustainable Delivery</span>
                <span className="font-mono text-sudabelt-green group-hover:text-white font-bold transition-colors">
                  02 / MISSION
                </span>
              </div>
            </div>
          </SectionReveal>
        </div>
      </div>
    </section>
  )
}

export default VisionMissionSection
