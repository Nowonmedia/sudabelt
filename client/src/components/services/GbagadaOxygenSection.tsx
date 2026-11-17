import React from 'react'
import { Link } from 'react-router'
import { HeaderTextReveal, SectionReveal } from '../common/Reveal'

const SCOPE_TILES = [
  'Site Audit',
  'Installation',
  'Staff training',
  'Ongoing SLA',
]

const GbagadaOxygenSection: React.FC = () => {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-[#EAF3EC] border-y border-sudabelt-sage/40">
      <div className="sudabelt-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Solid Green Delivery Scope Card */}
          <div className="lg:col-span-5">
            <SectionReveal direction="right" delay={0.1}>
              <div className="bg-sudabelt-green text-white rounded-card p-8 sm:p-10 shadow-sm relative overflow-hidden">
                {/* Pattern Watermark */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-10 bg-repeat bg-contain"
                  style={{ backgroundImage: `url('/images/brand/PATTERNS-WHITE SLIM 1.webp')` }}
                />

                <div className="relative z-10">
                  <div className="text-[12px] font-bold uppercase tracking-[0.14em] text-sudabelt-blue mb-2">
                    Project in Focus
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight mb-8">
                    Oxygen infrastructure. End-to-end delivery.
                  </h3>

                  {/* 2x2 Scope Tiles */}
                  <div className="grid grid-cols-2 gap-3.5">
                    {SCOPE_TILES.map((tile) => (
                      <div
                        key={tile}
                        className="p-3.5 sm:p-4 rounded-control bg-[#00542c] border border-white/10 text-center text-xs sm:text-sm font-bold text-white flex items-center justify-center min-h-[54px]"
                      >
                        {tile}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </SectionReveal>
          </div>

          {/* Right Column: Project Spotlight & Action */}
          <div className="lg:col-span-7 lg:pl-4">
            <SectionReveal direction="left" delay={0.2}>
              <div className="text-[12px] font-bold uppercase tracking-[0.14em] text-sudabelt-green mb-3">
                Project in Focus
              </div>

              <HeaderTextReveal className="mb-4">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-sudabelt-navy tracking-tight leading-tight">
                  Gbagada General Hospital oxygen plant, Lagos
                </h2>
              </HeaderTextReveal>

              <p className="text-sudabelt-navy/80 text-base sm:text-lg leading-relaxed mb-8 max-w-xl">
                Commissioned in Lagos and opened by the Lagos State Governor. An example of the project scalability behind every Sudabelt engagement.
              </p>

              <div>
                <Link
                  to="/rfq"
                  className="inline-flex items-center justify-center h-12 px-7 rounded-control bg-sudabelt-navy hover:bg-sudabelt-navy/90 text-white font-extrabold text-xs uppercase tracking-wider transition-colors shadow-xs"
                >
                  Discuss a Similar Project
                </Link>
              </div>
            </SectionReveal>
          </div>
        </div>
      </div>
    </section>
  )
}

export default GbagadaOxygenSection
