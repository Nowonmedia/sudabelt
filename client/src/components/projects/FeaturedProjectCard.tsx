import React, { useState } from 'react'
import { HeaderTextReveal, SectionReveal } from '../common/Reveal'
import { X, CheckCircle2 } from 'lucide-react'
import { useProjects, type ApiProject } from '../../api/api'

interface FeaturedProjectCardProps {
  project?: ApiProject
}

const FeaturedProjectCard: React.FC<FeaturedProjectCardProps> = ({ project: propProject }) => {
  const { data: apiData, isLoading } = useProjects()
  const [showDetailModal, setShowDetailModal] = useState<boolean>(false)

  // Get most recent project from DB:
  // If prop provided, use it; otherwise pick the first/most recent from API
  const project: ApiProject | null = React.useMemo(() => {
    if (propProject) return propProject
    if (apiData && Array.isArray(apiData.data) && apiData.data.length > 0) {
      // Return the most recent project (sorted by completionYear / createdAt)
      return apiData.data[0]
    }
    return null
  }, [propProject, apiData])

  if (isLoading) {
    return (
      <section className="py-12 bg-white border-b border-sudabelt-border">
        <div className="sudabelt-container">
          <div className="h-64 rounded-card bg-slate-100 animate-pulse" />
        </div>
      </section>
    )
  }

  // If there are no projects in the database, do not render a hardcoded placeholder
  if (!project) {
    return null
  }

  const locationLabel = [project.city, project.locationState].filter(Boolean).join(', ') || 'Nigeria'
  const scopeItems = Array.isArray(project.scopeOfWork) && project.scopeOfWork.length > 0
    ? project.scopeOfWork
    : [
        'Turnkey equipment delivery and biomedical installation.',
        'On-site clinical application specialist staff training.',
        'Continuous preventive maintenance and local SLA warranty.',
      ]

  const tileOne = scopeItems[0] || project.category
  const tileTwo = scopeItems[1] || 'Preventive Maintenance SLA'

  return (
    <>
      <section className="py-14 sm:py-18 bg-white border-b border-sudabelt-border">
        <div className="sudabelt-container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Visual Feature Card with Tiles */}
            <div className="lg:col-span-6">
              <SectionReveal direction="right" delay={0.1}>
                <div className="relative rounded-card overflow-hidden shadow-md aspect-16/11 flex flex-col justify-end p-6 sm:p-8 text-white">
                  {/* Photo from DB */}
                  <img
                    src={project.heroImage || '/images/projects/project-adeboye.webp'}
                    alt={project.title}
                    className="absolute inset-0 w-full h-full object-cover object-center"
                    onError={(e) => {
                      e.currentTarget.src = '/images/projects/project-adeboye.webp'
                    }}
                  />
                  {/* Dark gradient wash */}
                  <div className="absolute inset-0 bg-linear-to-t from-sudabelt-navy/95 via-sudabelt-navy/60 to-transparent" />

                  {/* Overlay Content */}
                  <div className="relative z-10">
                    <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-sudabelt-blue mb-2">
                      {project.category} {locationLabel ? `- ${locationLabel}` : ''}
                    </div>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-white leading-tight mb-5 line-clamp-2">
                      {project.title}
                    </h3>

                    {/* 2 Tiles */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-control bg-sudabelt-navy/80 backdrop-blur-xs border border-white/20">
                        <div className="text-xs font-mono font-bold text-sudabelt-blue">01</div>
                        <div className="text-xs sm:text-sm font-bold text-white mt-0.5 line-clamp-2">
                          {tileOne}
                        </div>
                      </div>

                      <div className="p-3 rounded-control bg-sudabelt-navy/80 backdrop-blur-xs border border-white/20">
                        <div className="text-xs font-mono font-bold text-sudabelt-blue">02</div>
                        <div className="text-xs sm:text-sm font-bold text-white mt-0.5 line-clamp-2">
                          {tileTwo}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </SectionReveal>
            </div>

            {/* Right Column: Project Metadata, Description & CTA */}
            <div className="lg:col-span-6 lg:pl-4">
              <SectionReveal direction="left" delay={0.2}>
                <div className="text-[12px] font-bold uppercase tracking-[0.14em] text-sudabelt-green mb-3">
                  Featured Project
                </div>

                <HeaderTextReveal className="mb-4">
                  <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-extrabold text-sudabelt-navy tracking-tight leading-tight">
                    {project.facilityName || project.title}
                  </h2>
                </HeaderTextReveal>

                <p className="text-sudabelt-body text-base sm:text-[17px] leading-relaxed mb-6">
                  {project.shortDescription || project.fullDescription}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap items-center gap-2 mb-8">
                  {project.completionYear && (
                    <span className="px-3 py-1 rounded-control bg-sudabelt-surface text-sudabelt-navy text-xs font-semibold border border-sudabelt-border">
                      Commissioned {project.completionYear}
                    </span>
                  )}
                  {locationLabel && (
                    <span className="px-3 py-1 rounded-control bg-sudabelt-surface text-sudabelt-navy text-xs font-semibold border border-sudabelt-border">
                      {locationLabel}
                    </span>
                  )}
                  {project.category && (
                    <span className="px-3 py-1 rounded-control bg-sudabelt-surface text-sudabelt-navy text-xs font-semibold border border-sudabelt-border">
                      {project.category}
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setShowDetailModal(true)}
                  className="h-12 px-7 rounded-control bg-sudabelt-blue hover:bg-sudabelt-green text-sudabelt-navy hover:text-white font-extrabold text-[13px] tracking-wider uppercase transition-all duration-200 shadow-xs cursor-pointer inline-flex items-center justify-center"
                >
                  View Project
                </button>
              </SectionReveal>
            </div>
          </div>
        </div>
      </section>

      {/* Project Detail Modal */}
      {showDetailModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-sudabelt-navy/80 backdrop-blur-sm animate-in fade-in duration-200"
        >
          <div className="relative w-full max-w-2xl bg-white rounded-card shadow-modal overflow-hidden border border-sudabelt-border max-h-[90vh] flex flex-col">
            <div className="bg-sudabelt-navy text-white px-6 sm:px-8 py-5 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-sudabelt-blue">
                  Project Case Study
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-white mt-0.5">
                  {project.facilityName || project.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowDetailModal(false)}
                className="w-8 h-8 rounded-control bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
              <div className="rounded-control overflow-hidden aspect-video shadow-sm">
                <img
                  src={project.heroImage || '/images/projects/project-adeboye.webp'}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="grid grid-cols-3 gap-4 p-4 rounded-control bg-sudabelt-surface border border-sudabelt-border text-center">
                <div>
                  <div className="text-xs text-sudabelt-muted">Location</div>
                  <div className="text-sm font-bold text-sudabelt-navy mt-0.5 truncate">{locationLabel}</div>
                </div>
                <div>
                  <div className="text-xs text-sudabelt-muted">Year</div>
                  <div className="text-sm font-bold text-sudabelt-navy mt-0.5">{project.completionYear || 'Recent'}</div>
                </div>
                <div>
                  <div className="text-xs text-sudabelt-muted">Category</div>
                  <div className="text-sm font-bold text-sudabelt-navy mt-0.5 truncate">{project.category}</div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-sudabelt-navy uppercase tracking-wider mb-2">
                  Project Overview
                </h4>
                <p className="text-sm text-sudabelt-body leading-relaxed mb-4">
                  {project.fullDescription || project.shortDescription}
                </p>

                {scopeItems.length > 0 && (
                  <>
                    <h4 className="text-sm font-bold text-sudabelt-navy uppercase tracking-wider mb-2">
                      Scope of Delivery
                    </h4>
                    <ul className="space-y-2 text-sm text-sudabelt-body">
                      {scopeItems.map((item, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-sudabelt-green shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </div>

            <div className="px-6 sm:px-8 py-4 bg-sudabelt-surface border-t border-sudabelt-border flex justify-end">
              <button
                type="button"
                onClick={() => setShowDetailModal(false)}
                className="px-6 py-2 rounded-control bg-sudabelt-navy text-white text-xs font-bold uppercase hover:bg-sudabelt-navy/90 transition-colors cursor-pointer"
              >
                Close Case Study
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default FeaturedProjectCard
