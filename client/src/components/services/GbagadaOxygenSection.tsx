import React from 'react'
import { Link } from 'react-router'
import { HeaderTextReveal, SectionReveal } from '../common/Reveal'
import { useProjects } from '../../api/api'

const DEFAULT_SCOPE_TILES = [
  'Site Audit',
  'Installation',
  'Staff training',
  'Ongoing SLA',
]

const GbagadaOxygenSection: React.FC = () => {
  const { data: apiData } = useProjects()
  const latestProject =
    apiData?.data && apiData.data.length > 0 ? apiData.data[0] : null

  const projectTitle = latestProject
    ? `${latestProject.facilityName || latestProject.title}${
        latestProject.city || latestProject.locationState
          ? `, ${latestProject.city || latestProject.locationState}`
          : ''
      }`
    : 'World Bank / NCDC / Federal Ministry of Health Hemodialysis Project'

  const projectDescription = latestProject
    ? latestProject.shortDescription || latestProject.fullDescription
    : 'Procurement and installation of hemodialysis machines and supporting renal infrastructure across 10 locations in Nigeria. An example of the project scalability behind every Sudabelt engagement.'

  const cardHeadline = latestProject
    ? `${latestProject.category || 'Turnkey infrastructure'}. End-to-end delivery.`
    : 'Renal & critical care. End-to-end delivery.'

  const scopeTiles =
    latestProject?.scopeOfWork && latestProject.scopeOfWork.length >= 4
      ? latestProject.scopeOfWork.slice(0, 4)
      : DEFAULT_SCOPE_TILES

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-sudabelt-green-tint border-y border-sudabelt-sage/40">
      <div className="sudabelt-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Solid Green Delivery Scope Card */}
          <div className="lg:col-span-5">
            <SectionReveal direction="right" delay={0.1}>
              <div className="bg-sudabelt-green text-white rounded-card p-8 sm:p-10 shadow-sm hover:shadow-xl transition-shadow duration-300 relative overflow-hidden">
                {/* Pattern Watermark */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-10 bg-repeat bg-contain"
                  style={{ backgroundImage: `url('/images/brand/PATTERNS-WHITE SLIM 1.webp')` }}
                />

                <div className="relative z-10">
                  <div className="text-[12px] font-bold uppercase tracking-[0.14em] text-sudabelt-blue mb-2">
                    Latest Project in Focus
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight mb-8">
                    {cardHeadline}
                  </h3>

                  {/* 2x2 Scope Tiles */}
                  <div className="grid grid-cols-2 gap-3.5">
                    {scopeTiles.map((tile) => (
                      <div
                        key={tile}
                        className="p-3.5 sm:p-4 rounded-control bg-[#00542c] hover:bg-sudabelt-navy/70 border border-white/10 text-center text-xs sm:text-sm font-bold text-white flex items-center justify-center min-h-13.5 transition-colors duration-200 line-clamp-2"
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
                Most Recent Delivery {latestProject?.completionYear ? `• ${latestProject.completionYear}` : '• 2024'}
              </div>

              <HeaderTextReveal className="mb-4">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-sudabelt-navy tracking-tight leading-tight">
                  {projectTitle}
                </h2>
              </HeaderTextReveal>

              <p className="text-sudabelt-navy/80 text-base sm:text-lg leading-relaxed mb-8 max-w-xl">
                {projectDescription}
              </p>

              <div className="flex flex-wrap gap-3">
                <Link
                  to="/rfq"
                  className="inline-flex items-center justify-center h-12 px-7 rounded-control bg-sudabelt-navy hover:bg-sudabelt-green text-white font-extrabold text-xs uppercase tracking-wider transition-all duration-200 hover:-translate-y-0.5 shadow-xs"
                >
                  Discuss a Similar Project
                </Link>
                <Link
                  to="/projects"
                  className="inline-flex items-center justify-center h-12 px-7 rounded-control border border-sudabelt-navy/25 bg-white hover:bg-sudabelt-navy text-sudabelt-navy hover:text-white font-extrabold text-xs uppercase tracking-wider transition-all duration-200"
                >
                  View All Projects
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
