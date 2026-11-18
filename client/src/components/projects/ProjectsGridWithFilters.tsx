import React, { useState, useMemo } from 'react'
import { ArrowRight, X, CheckCircle2 } from 'lucide-react'
import { SectionReveal } from '../common/Reveal'
import { useProjects } from '../../api/api'

export interface ProjectItem {
  id: string
  title: string
  category: 'Dialysis & renal' | 'Oxygen & medical gas' | 'Imaging & diagnostics' | 'Hospital equipping'
  year: '2020' | '2021' | '2022'
  yearLabel: string
  location: string
  overlayBadge: string
  image: string
  description: string
  fullScope?: string[]
}

const ALL_PROJECTS: ProjectItem[] = [
  {
    id: 'gbagada-oxygen',
    title: 'Gbagada General Hospital oxygen plant',
    category: 'Oxygen & medical gas',
    year: '2020',
    yearLabel: '2020',
    location: 'LAGOS',
    overlayBadge: 'OXYGEN INFRASTRUCTURE',
    image: '/images/projects/project-gbagada.webp',
    description:
      'A major role in the COVID-19 response, recognized with a letter of commendation from the Lagos State Government.',
    fullScope: [
      'Turnkey Medical Oxygen Pressure Swing Adsorption (PSA) Generating Plant.',
      'High-pressure cylinder manifold filling station and distribution piping.',
      'Emergency delivery and commissioning during peak pandemic demand.',
      'Certified Lagos State biomedical engineering training & ongoing SLA.',
    ],
  },
  {
    id: 'adeboye-dialysis',
    title: 'Enoch & Folu Adeboye Dialysis Centre',
    category: 'Dialysis & renal',
    year: '2022',
    yearLabel: '2022',
    location: 'ABUJA',
    overlayBadge: 'DIALYSIS CARE',
    image: '/images/projects/project-adeboye.webp',
    description:
      'Eight dialysis machines with a medical-water reverse osmosis purification system.',
    fullScope: [
      '8 High-flux hemodialysis machines with automated ultrafiltration.',
      'Double-pass clinical reverse osmosis water treatment system.',
      'Pure water distribution loop and dialysis consumables pipeline.',
      'Clinical applications certification for nephrology staff.',
    ],
  },
  {
    id: 'reference-hospital-okene',
    title: 'Reference Hospital, Okene',
    category: 'Hospital equipping',
    year: '2022',
    yearLabel: '2021-2022',
    location: 'OKENE',
    overlayBadge: 'HOSPITAL TECHNOLOGY',
    image: '/images/projects/project-okene.webp',
    description:
      'A landmark project: medical equipment delivered and installed, commissioned by President Muhammadu Buhari.',
    fullScope: [
      'Multi-department clinical equipping across theatre suites, ICU, and radiology.',
      'Advanced patient monitoring networks and critical care ventilators.',
      'Biomedical installation, rigorous load testing, and commissioning ceremony.',
      'Local biomedical support team deployment for continuous uptime.',
    ],
  },
  {
    id: 'ring-road-hospital-ibadan',
    title: 'Ring Road Hospital, Ibadan',
    category: 'Dialysis & renal',
    year: '2022',
    yearLabel: '2022',
    location: 'IBADAN',
    overlayBadge: 'DIALYSIS CARE',
    image: '/images/projects/project-ibadan.webp',
    description:
      'A dialysis centre equipped with dialysis machines, facilitated by Sudabelt Medical.',
    fullScope: [
      'Turnkey renal unit planning, layout optimization, and installation.',
      'Hemodialysis stations, treatment chairs, and patient monitoring.',
      'Hospital biomedical staff hands-on operational training.',
      'Genuine spare parts supply agreement and preventive maintenance.',
    ],
  },
  {
    id: 'kano-medical-centre',
    title: 'Kano Medical Centre',
    category: 'Imaging & diagnostics',
    year: '2020',
    yearLabel: '2020',
    location: 'KANO',
    overlayBadge: 'IMAGING & DIAGNOSTICS',
    image: '/images/projects/project-kano.webp',
    description:
      'A GE Revolution EVO CT machine and Abbott clinical chemistry equipment, delivered and installed.',
    fullScope: [
      'GE Revolution EVO 128-slice computed tomography scanner installation.',
      'Radiation shielding verification and precision gantry calibration.',
      'Abbott automated clinical chemistry and immunoassay analyzers.',
      'Radiology technologist and laboratory scientist user certifications.',
    ],
  },
  {
    id: 'nnpc-multi-specialist-hospital',
    title: 'NNPC Multi-Specialist Hospital',
    category: 'Imaging & diagnostics',
    year: '2020',
    yearLabel: '2020',
    location: 'ABUJA',
    overlayBadge: 'HOSPITAL TECHNOLOGY',
    image: '/images/projects/project-nnpc.webp',
    description:
      'Abbott Ci4000 chemistry analyzer and Cell-Dyn Emerald hematology analyzer supplied, installed and staff trained.',
    fullScope: [
      'Abbott Architect Ci4000 integrated chemistry & immunoassay workstation.',
      'Cell-Dyn Emerald hematology analyzer with automated differential counters.',
      'Laboratory information system interfacing and reagent supply agreement.',
      'Comprehensive operator application training and ongoing QA support.',
    ],
  },
  {
    id: 'lasuth-renal-upgrade',
    title: 'Lagos State University Teaching Hospital (LASUTH)',
    category: 'Dialysis & renal',
    year: '2021',
    yearLabel: '2021',
    location: 'LAGOS',
    overlayBadge: 'DIALYSIS CARE',
    image: '/images/projects/project-adeboye.webp',
    description:
      'Comprehensive nephrology unit upgrade with high-flux hemodialysis systems and dedicated reverse osmosis water station.',
    fullScope: [
      'Nephrology ward capacity expansion with high-flux dialyzers.',
      'Medical water loop filtration system and quality verification.',
      'Biomedical engineering preventive maintenance SLA.',
    ],
  },
  {
    id: 'armed-forces-kano',
    title: 'Armed Forces Specialist Hospital, Kano',
    category: 'Hospital equipping',
    year: '2022',
    yearLabel: '2022',
    location: 'KANO',
    overlayBadge: 'HOSPITAL TECHNOLOGY',
    image: '/images/projects/project-okene.webp',
    description:
      'Critical care ICU patient monitoring networks and surgical suites equipped with OEM-certified engineering support.',
    fullScope: [
      'Central telemetry monitoring and multi-parameter vital signs monitors.',
      'Operating theatre LED lighting and electro-surgical units.',
      '24/7 biomedical response coverage and engineering maintenance.',
    ],
  },
  {
    id: 'fmc-ebute-metta',
    title: 'Federal Medical Centre (FMC), Ebute Metta',
    category: 'Oxygen & medical gas',
    year: '2021',
    yearLabel: '2021',
    location: 'LAGOS',
    overlayBadge: 'OXYGEN INFRASTRUCTURE',
    image: '/images/projects/project-gbagada.webp',
    description:
      'Central medical gas piping system and manifold distribution for emergency, pediatric, and intensive care wings.',
    fullScope: [
      'Medical oxygen, vacuum, and medical air manifold systems.',
      'Pipeline distribution to 40+ bedside terminal units across ICU and wards.',
      'Pressure regulation, alarm monitoring, and safety compliance audits.',
    ],
  },
]

const CATEGORY_FILTERS = [
  'All projects',
  'Dialysis & renal',
  'Oxygen & medical gas',
  'Imaging & diagnostics',
  'Hospital equipping',
] as const

const YEAR_FILTERS = ['All', '2022', '2020'] as const

const ITEMS_PER_PAGE = 6

const ProjectsGridWithFilters: React.FC = () => {
  const { data: apiData } = useProjects()

  const [selectedCategory, setSelectedCategory] = useState<string>('All projects')
  const [selectedYear, setSelectedYear] = useState<string>('All')
  const [displayCount, setDisplayCount] = useState<number>(ITEMS_PER_PAGE)
  const [activeModalProject, setActiveModalProject] = useState<ProjectItem | null>(null)

  const allProjectsList: ProjectItem[] = useMemo(() => {
    if (apiData?.data && apiData.data.length > 0) {
      return apiData.data.map((p) => ({
        id: p.slug || p._id,
        title: p.title,
        category: p.category as ProjectItem['category'],
        year: String(p.completionYear) as ProjectItem['year'],
        yearLabel: String(p.completionYear),
        location: (p.city || p.locationState || 'NIGERIA').toUpperCase(),
        overlayBadge: p.category.toUpperCase(),
        image: p.heroImage,
        description: p.shortDescription,
        fullScope: p.scopeOfWork || [],
      }))
    }
    return ALL_PROJECTS
  }, [apiData])

  // Filter logic
  const filteredProjects = useMemo(() => {
    return allProjectsList.filter((project) => {
      const matchCategory =
        selectedCategory === 'All projects' ||
        project.category.toLowerCase() === selectedCategory.toLowerCase()
      const matchYear =
        selectedYear === 'All' || String(project.year) === selectedYear
      return matchCategory && matchYear
    })
  }, [allProjectsList, selectedCategory, selectedYear])

  // Pagination slice
  const visibleProjects = useMemo(() => {
    return filteredProjects.slice(0, displayCount)
  }, [filteredProjects, displayCount])

  const hasMore = displayCount < filteredProjects.length

  const handleLoadMore = () => {
    setDisplayCount((prev) => prev + ITEMS_PER_PAGE)
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    setDisplayCount(ITEMS_PER_PAGE)
  }

  const handleYearChange = (year: string) => {
    setSelectedYear(year)
    setDisplayCount(ITEMS_PER_PAGE)
  }

  return (
    <section className="py-14 sm:py-20 bg-white">
      <div className="sudabelt-container">
        {/* Filters Bar: TYPE & YEAR */}
        <div className="space-y-4 mb-10 sm:mb-14">
          {/* Category / Type Filter */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-sudabelt-label mr-1">
              Type:
            </span>
            {CATEGORY_FILTERS.map((cat) => {
              const isActive = selectedCategory === cat
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => handleCategoryChange(cat)}
                  className={`px-4 py-2 rounded-control text-xs sm:text-[13px] font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-sudabelt-navy text-white shadow-xs'
                      : 'bg-white border border-sudabelt-border text-sudabelt-navy hover:bg-sudabelt-surface'
                  }`}
                >
                  {cat}
                </button>
              )
            })}
          </div>

          {/* Year Filter */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-sudabelt-label mr-2">
              Year:
            </span>
            {YEAR_FILTERS.map((yr) => {
              const isActive = selectedYear === yr
              return (
                <button
                  key={yr}
                  type="button"
                  onClick={() => handleYearChange(yr)}
                  className={`px-4 py-1.5 rounded-control text-xs sm:text-[13px] font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-sudabelt-navy text-white shadow-xs'
                      : 'bg-white border border-sudabelt-border text-sudabelt-navy hover:bg-sudabelt-surface'
                  }`}
                >
                  {yr}
                </button>
              )
            })}
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between text-xs text-sudabelt-muted mb-6">
          <span>
            Showing <strong>{visibleProjects.length}</strong> of{' '}
            <strong>{filteredProjects.length}</strong> landmark projects
          </span>

          {(selectedCategory !== 'All projects' || selectedYear !== 'All') && (
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('All projects')
                setSelectedYear('All')
                setDisplayCount(ITEMS_PER_PAGE)
              }}
              className="text-xs font-bold text-sudabelt-green hover:underline cursor-pointer"
            >
              Reset filters
            </button>
          )}
        </div>

        {/* 3-Column Grid */}
        {filteredProjects.length === 0 ? (
          <div className="py-16 text-center border border-dashed border-sudabelt-border rounded-card bg-sudabelt-surface">
            <h3 className="text-lg font-bold text-sudabelt-navy">No projects found</h3>
            <p className="text-xs sm:text-sm text-sudabelt-muted mt-1">
              Try adjusting your category or year filters.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('All projects')
                setSelectedYear('All')
              }}
              className="mt-4 px-5 py-2 rounded-control bg-sudabelt-navy text-white text-xs font-bold uppercase cursor-pointer"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {visibleProjects.map((project, idx) => (
              <SectionReveal key={project.id} direction="up" delay={0.06 * (idx % 6 + 1)}>
                <div className="h-full bg-white border border-sudabelt-border rounded-card overflow-hidden hover:border-sudabelt-green hover:shadow-card transition-all duration-300 flex flex-col justify-between group">
                  <div>
                    {/* Top Photo with Overlay Badge */}
                    <div className="relative aspect-16/10 overflow-hidden bg-sudabelt-navy">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-sudabelt-navy/90 via-sudabelt-navy/40 to-transparent" />

                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="w-6 h-0.75 bg-sudabelt-red rounded-xs mb-1.5" />
                        <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-white drop-shadow-sm">
                          {project.overlayBadge}
                        </span>
                      </div>
                    </div>

                    {/* Metadata Pill & Location */}
                    <div className="p-6">
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="px-2.5 py-0.5 rounded-control bg-sudabelt-navy text-white text-[11px] font-semibold">
                          {project.category}
                        </span>

                        <div className="flex items-center gap-1.5 text-[11px] font-mono text-sudabelt-muted font-bold">
                          <span>{project.yearLabel}</span>
                          <span>•</span>
                          <span>{project.location}</span>
                        </div>
                      </div>

                      <h3 className="text-lg font-bold text-sudabelt-navy group-hover:text-sudabelt-green transition-colors leading-snug">
                        {project.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-sudabelt-body mt-2.5 leading-relaxed line-clamp-3">
                        {project.description}
                      </p>
                    </div>
                  </div>

                  {/* Card Action Link */}
                  <div className="px-6 pb-6 pt-2 border-t border-sudabelt-border/60">
                    <button
                      type="button"
                      onClick={() => setActiveModalProject(project)}
                      className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-sudabelt-green hover:text-sudabelt-navy transition-colors cursor-pointer group-hover:translate-x-1 duration-200"
                    >
                      <span>View Project</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </SectionReveal>
            ))}
          </div>
        )}

        {/* Load More Button & Pagination Indicator */}
        {hasMore && (
          <div className="mt-12 text-center">
            <button
              type="button"
              onClick={handleLoadMore}
              className="inline-flex items-center justify-center h-12 px-8 rounded-control border border-sudabelt-navy hover:bg-sudabelt-navy hover:text-white text-sudabelt-navy font-extrabold text-xs uppercase tracking-wider transition-colors cursor-pointer shadow-xs"
            >
              Load More Projects
            </button>
          </div>
        )}
      </div>

      {/* Project Case Study Modal */}
      {activeModalProject && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-sudabelt-navy/80 backdrop-blur-sm animate-in fade-in duration-200"
        >
          <div className="relative w-full max-w-2xl bg-white rounded-card shadow-modal overflow-hidden border border-sudabelt-border max-h-[90vh] flex flex-col">
            <div className="bg-sudabelt-navy text-white px-6 sm:px-8 py-5 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-sudabelt-blue">
                  {activeModalProject.overlayBadge}
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-white mt-0.5">
                  {activeModalProject.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveModalProject(null)}
                className="w-8 h-8 rounded-control bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
              <div className="rounded-control overflow-hidden aspect-video shadow-sm">
                <img
                  src={activeModalProject.image}
                  alt={activeModalProject.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="grid grid-cols-3 gap-4 p-4 rounded-control bg-sudabelt-surface border border-sudabelt-border text-center">
                <div>
                  <div className="text-xs text-sudabelt-muted">Location</div>
                  <div className="text-sm font-bold text-sudabelt-navy mt-0.5">
                    {activeModalProject.location}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-sudabelt-muted">Year</div>
                  <div className="text-sm font-bold text-sudabelt-navy mt-0.5">
                    {activeModalProject.yearLabel}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-sudabelt-muted">Category</div>
                  <div className="text-sm font-bold text-sudabelt-navy mt-0.5">
                    {activeModalProject.category}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-sudabelt-navy uppercase tracking-wider mb-2">
                  Project Description & Clinical Impact
                </h4>
                <p className="text-sm text-sudabelt-body leading-relaxed mb-4">
                  {activeModalProject.description}
                </p>

                {activeModalProject.fullScope && (
                  <>
                    <h5 className="text-xs font-bold text-sudabelt-green uppercase tracking-wider mb-2">
                      Engineering Scope Checklist:
                    </h5>
                    <ul className="space-y-2 text-xs sm:text-sm text-sudabelt-body">
                      {activeModalProject.fullScope.map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-sudabelt-green shrink-0 mt-0.5" />
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
                onClick={() => setActiveModalProject(null)}
                className="px-6 py-2 rounded-control bg-sudabelt-navy text-white text-xs font-bold uppercase hover:bg-sudabelt-navy/90 transition-colors cursor-pointer"
              >
                Close Project Details
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default ProjectsGridWithFilters
