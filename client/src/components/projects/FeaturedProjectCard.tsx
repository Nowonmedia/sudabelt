import React, { useState } from 'react'
import { HeaderTextReveal, SectionReveal } from '../common/Reveal'
import { X, CheckCircle2 } from 'lucide-react'

const FeaturedProjectCard: React.FC = () => {
  const [showDetailModal, setShowDetailModal] = useState<boolean>(false)

  return (
    <>
      <section className="py-14 sm:py-18 bg-white border-b border-sudabelt-border">
        <div className="sudabelt-container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Visual Feature Card with Tiles */}
            <div className="lg:col-span-6">
              <SectionReveal direction="right" delay={0.1}>
                <div className="relative rounded-card overflow-hidden shadow-md aspect-16/11 flex flex-col justify-end p-6 sm:p-8 text-white">
                  {/* Photo */}
                  <img
                    src="/images/projects/featured-adeboye.webp"
                    alt="Enoch & Folu Adeboye Dialysis Centre"
                    className="absolute inset-0 w-full h-full object-cover object-center"
                  />
                  {/* Dark gradient wash */}
                  <div className="absolute inset-0 bg-linear-to-t from-sudabelt-navy/95 via-sudabelt-navy/60 to-transparent" />

                  {/* Overlay Content */}
                  <div className="relative z-10">
                    <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-sudabelt-blue mb-2">
                      Dialysis Centre - Abuja
                    </div>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-white leading-tight mb-5">
                      Clinical equipment. Water purification.
                    </h3>

                    {/* 2 Tiles */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-control bg-sudabelt-navy/80 backdrop-blur-xs border border-white/20">
                        <div className="text-xs font-mono font-bold text-sudabelt-blue">01</div>
                        <div className="text-xs sm:text-sm font-bold text-white mt-0.5">
                          Dialysis machines
                        </div>
                      </div>

                      <div className="p-3 rounded-control bg-sudabelt-navy/80 backdrop-blur-xs border border-white/20">
                        <div className="text-xs font-mono font-bold text-sudabelt-blue">02</div>
                        <div className="text-xs sm:text-sm font-bold text-white mt-0.5">
                          Reverse osmosis
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
                    Enoch & Folu Adeboye Dialysis Centre, Abuja
                  </h2>
                </HeaderTextReveal>

                <p className="text-sudabelt-body text-base sm:text-[17px] leading-relaxed mb-6">
                  Eight dialysis machines and a medical-grade reverse osmosis water purification system, supplied through Sudabelt Medical.
                </p>

                {/* Tags */}
                <div className="flex flex-wrap items-center gap-2 mb-8">
                  <span className="px-3 py-1 rounded-control bg-sudabelt-surface text-sudabelt-navy text-xs font-semibold border border-sudabelt-border">
                    Commissioned 2022
                  </span>
                  <span className="px-3 py-1 rounded-control bg-sudabelt-surface text-sudabelt-navy text-xs font-semibold border border-sudabelt-border">
                    Abuja
                  </span>
                  <span className="px-3 py-1 rounded-control bg-sudabelt-surface text-sudabelt-navy text-xs font-semibold border border-sudabelt-border">
                    Renal
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setShowDetailModal(true)}
                  className="h-12 px-7 rounded-control bg-sudabelt-blue hover:bg-sudabelt-blue-hover text-sudabelt-navy font-extrabold text-[13px] tracking-wider uppercase transition-colors shadow-xs cursor-pointer inline-flex items-center justify-center"
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
                  Enoch & Folu Adeboye Dialysis Centre
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
                  src="/images/projects/featured-adeboye.webp"
                  alt="Enoch & Folu Adeboye Dialysis Suite"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="grid grid-cols-3 gap-4 p-4 rounded-control bg-sudabelt-surface border border-sudabelt-border text-center">
                <div>
                  <div className="text-xs text-sudabelt-muted">Location</div>
                  <div className="text-sm font-bold text-sudabelt-navy mt-0.5">Abuja, FCT</div>
                </div>
                <div>
                  <div className="text-xs text-sudabelt-muted">Year</div>
                  <div className="text-sm font-bold text-sudabelt-navy mt-0.5">2022</div>
                </div>
                <div>
                  <div className="text-xs text-sudabelt-muted">Category</div>
                  <div className="text-sm font-bold text-sudabelt-navy mt-0.5">Renal Care</div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-sudabelt-navy uppercase tracking-wider mb-2">
                  Scope of Delivery
                </h4>
                <ul className="space-y-2 text-sm text-sudabelt-body">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-sudabelt-green shrink-0" />
                    <span>8 High-Efficiency Hemodialysis Machines with automated monitoring.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-sudabelt-green shrink-0" />
                    <span>Double-pass Reverse Osmosis (RO) medical water treatment plant.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-sudabelt-green shrink-0" />
                    <span>Complete plumbing, stainless steel distribution loop & clinical testing.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-sudabelt-green shrink-0" />
                    <span>Full on-site nephrology nursing & biomedical technician certification.</span>
                  </li>
                </ul>
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
