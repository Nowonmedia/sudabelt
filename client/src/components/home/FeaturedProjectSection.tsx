import React from 'react'
import { Link } from 'react-router'
import WhiteSlimPattern from '../common/WhiteSlimPattern'
import { HeaderTextReveal, SectionReveal } from '../common/Reveal'

const DELIVERY_STEPS = [
  { number: '01', label: 'Site audit' },
  { number: '02', label: 'Installation' },
  { number: '03', label: 'Staff training' },
  { number: '04', label: 'Ongoing SLA' },
]

interface LandmarkProjectItem {
  title: string
  date: string
  description: string
  imageUrl: string
}

const LANDMARK_PROJECTS: LandmarkProjectItem[] = [
  {
    title: 'World Bank / NCDC / Federal Ministry of Health Nigeria',
    date: 'June 2024',
    description:
      'Procurement of HD Dialysis Machines and Supporting Equipment for Hemodialysis across 10 locations in Nigeria.',
    imageUrl:
      'https://app.milanote.com/media/p/images/1X3Uw610xMt0cQ/FbQ/image.png?w=400',
  },
  {
    title: 'Edo State Government: Stella Obasanjo Hospital',
    date: 'May 2023',
    description:
      'Purchase, Supply, Installation, Testing and Commissioning of Medical Equipment (MultiModality Equipment and Furniture) for Stella Obasanjo Hospital, Edo State.',
    imageUrl:
      'https://app.milanote.com/media/p/images/1X3UIH10xMt0cU/a1w/image.png?w=400',
  },
  {
    title: 'Federal Teaching Hospital, Gombe',
    date: 'January 2024',
    description:
      'Procurement, Installation, Training and After Sales Service of Complete Computed Tomography (CT) 128 Slice (GE HealthCare).',
    imageUrl:
      'https://app.milanote.com/media/p/images/1X3UTN10xMt0cX/Vc4/image.png?w=400',
  },
]

const GBAGADA_COMMISSIONING_PHOTO =
  'https://app.milanote.com/media/p/images/1X1pbq1Atzd92P/gcD/Photo%20Journalism%202-Governor%20Jide%20Sanwolu%20commissions%20an%20Oxygen%20Plant%20at%20the%20Gbagada%20General%20Hospital%2C%20Lagos%20Nigeria.jpg?w=400'

const FeaturedProjectSection: React.FC = () => {
  return (
    <section className="relative bg-sudabelt-navy text-white py-20 lg:py-24 overflow-hidden">
      {/* Transparent / Light Background Treatment so the Hospital Photo is Clearly Visible */}
      <div className="absolute inset-0 z-0">
        <img
          src={GBAGADA_COMMISSIONING_PHOTO}
          alt="Governor Babajide Sanwo-Olu commissions the Oxygen Plant at Gbagada General Hospital Lagos"
          loading="lazy"
          width={1920}
          height={900}
          className="w-full h-full object-cover object-center opacity-70"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(90deg, rgba(0, 17, 66, 0.58) 0%, rgba(0, 17, 66, 0.42) 55%, rgba(0, 17, 66, 0.54) 100%)',
          }}
        />
      </div>

      <div className="sudabelt-container relative z-10">
        {/* Top Row: Turnkey Delivery Scope Green Panel + Gbagada General Hospital Spotlight */}
        <SectionReveal className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Green Brand Panel with Supplied White Slim Pattern (6 cols) */}
          <div className="lg:col-span-6">
            <div className="relative rounded-card bg-sudabelt-green p-8 sm:p-10 overflow-hidden border border-white/25 shadow-lg">
              <WhiteSlimPattern className="absolute inset-0" opacity={0.18} />

              <div className="relative z-10">
                <HeaderTextReveal>
                  <div className="w-5.5 h-0.75 bg-sudabelt-red rounded-mark mb-3.5" />
                  <span className="text-[11.5px] font-bold uppercase tracking-[1.6px] text-white/95">
                    TURNKEY DELIVERY PIPELINE
                  </span>

                  <h3 className="text-[28px] sm:text-[34px] leading-[1.15] font-extrabold tracking-[-0.02em] text-white mt-2.5">
                    One accountable
                    <br />
                    delivery scope.
                  </h3>
                </HeaderTextReveal>

                {/* 2x2 Step Boxes */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-7">
                  {DELIVERY_STEPS.map((step) => (
                    <div
                      key={step.number}
                      className="p-4 rounded-badge bg-sudabelt-green-dark/90 border border-white/20"
                    >
                      <div className="font-mono text-[11.5px] text-white/80">{step.number}</div>
                      <div className="text-[15.5px] font-bold text-white mt-1">{step.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Featured Project Spotlight (6 cols) */}
          <div className="lg:col-span-6 bg-sudabelt-navy/45 backdrop-blur-md p-7 sm:p-9 rounded-card border border-white/25">
            <HeaderTextReveal>
              <span className="text-eyebrow text-sudabelt-blue">FEATURED LANDMARK PROJECT</span>

              <h2 className="text-[30px] sm:text-[36px] lg:text-[40px] leading-[1.14] font-extrabold tracking-[-0.02em] text-white mt-3">
                Gbagada General
                <br />
                Hospital Oxygen Plant
              </h2>
            </HeaderTextReveal>

            <p className="text-[15px] sm:text-[15.5px] leading-[25.5px] text-white/92 mt-4">
              Commissioned in 2020, Sudabelt played a major role in the fight against COVID-19,
              receiving a letter of commendation from the Lagos State Government. Also partnered on
              the Enoch &amp; Folu Adeboye Dialysis Centre (8 dialysis machines and medical RO water
              purification system) and Reference Hospital, Okene.
            </p>

            {/* Scope Micro-Tags (rounded-control) */}
            <div className="flex flex-wrap gap-2 mt-6">
              {DELIVERY_STEPS.map((tag) => (
                <span
                  key={tag.label}
                  className="px-3 py-1.5 rounded-control bg-white/15 border border-white/25 font-mono text-[12px] text-white"
                >
                  {tag.label}
                </span>
              ))}
            </div>

            {/* Dual CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 mt-8">
              <Link
                to="/projects"
                className="h-12 px-6 rounded-control bg-sudabelt-blue hover:bg-sudabelt-blue-hover text-sudabelt-navy font-extrabold text-[12.5px] tracking-[0.06em] uppercase inline-flex items-center justify-center transition-colors"
              >
                VIEW CASE STUDIES
              </Link>
              <Link
                to="/rfq"
                className="h-12 px-6 rounded-control border border-white hover:bg-white/15 bg-transparent text-white font-bold text-[12.5px] tracking-[0.06em] uppercase inline-flex items-center justify-center transition-colors"
              >
                INQUIRE ON SIMILAR PROJECT
              </Link>
            </div>
          </div>
        </SectionReveal>

        {/* Bottom Row: 3 Verbatim Landmark Projects Glance from Milanote Home Board */}
        <SectionReveal className="mt-14 pt-12 border-t border-white/22">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <HeaderTextReveal>
              <span className="font-mono text-[11.5px] font-bold uppercase tracking-[0.12em] text-sudabelt-blue">
                NATIONWIDE EXECUTION TRACK RECORD
              </span>
              <h3 className="text-[24px] sm:text-[28px] font-extrabold text-white mt-1">
                Recent Landmark Projects Across Nigeria
              </h3>
            </HeaderTextReveal>
            <Link
              to="/projects"
              className="h-11 px-5 rounded-control bg-white/15 hover:bg-sudabelt-blue text-white hover:text-sudabelt-navy border border-white/30 font-bold text-[12px] tracking-[0.06em] uppercase inline-flex items-center justify-center self-start sm:self-auto transition-colors"
            >
              SEE MORE PROJECTS →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {LANDMARK_PROJECTS.map((project) => (
              <Link
                key={project.title}
                to="/projects"
                className="group rounded-card bg-sudabelt-navy/65 backdrop-blur-md border border-white/25 hover:border-sudabelt-blue overflow-hidden flex flex-col transition-all"
              >
                <div className="h-45 overflow-hidden bg-sudabelt-navy relative">
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    loading="lazy"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-control bg-sudabelt-green text-white font-mono text-[11px] font-bold">
                    {project.date}
                  </span>
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-[17px] leading-5.75 font-bold text-white group-hover:text-sudabelt-blue transition-colors">
                      {project.title}
                    </h4>
                    <p className="text-[13.5px] leading-5.25 text-white/82 mt-2.5">
                      {project.description}
                    </p>
                  </div>
                  <span className="mt-4 inline-block text-[11.5px] font-extrabold uppercase tracking-[0.06em] text-sudabelt-blue">
                    SEE MORE →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </SectionReveal>
      </div>
    </section>
  )
}

export default FeaturedProjectSection
