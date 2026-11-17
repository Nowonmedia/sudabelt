import React from 'react'
import { Link } from 'react-router'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { SectionReveal } from '../common/Reveal'

interface ServiceItemData {
  number: string
  title: string
  image: string
  summary: string
  itemsHeading: string
  items: string[]
  actionLabel: string
  actionPath: string
}

const MILANOTE_SERVICES: ServiceItemData[] = [
  {
    number: '01',
    title: 'Healthcare Technology Solutions & Medical Consumables',
    image: '/images/services/service-1-tech.jpg',
    summary:
      'We provide specialized medical equipment and consumables sales, marketing, training, and support for hospitals, clinics, laboratories, and healthcare organizations. Our services include expert product training, practical workshops, and live equipment demonstrations to help healthcare professionals make informed decisions and use equipment effectively.',
    itemsHeading: 'Authorized Portfolios & Global OEM Partners:',
    items: [
      'Imaging & Life Care (GE HealthCare): Ultrasound, X-ray, CT, MRI, Patient Monitoring & Maternal-Infant Care.',
      'Renal & Critical Care (Baxter | SWS Medical): Hemodialysis, Peritoneal Dialysis, CRRT & Water Treatment.',
      'Blood Management & Cell Technologies (Terumo BCT): Apheresis, Pathogen Reduction & Transfusion Medicine.',
      'Laboratory & Diagnostics (Abbott Laboratories | Maccura): Clinical Chemistry, Immunoassays & Point of Care.',
      'Respiratory & Neonatal Care (Fisher & Paykel): High Flow Therapy, Humidification & Neonatal CPAP.',
      'Minimally Invasive Surgery (Ezisurg Medical): Laparoscopy, Surgical Stapling Systems & Energy Devices.',
    ],
    actionLabel: 'Browse Technology & Consumables',
    actionPath: '/products',
  },
  {
    number: '02',
    title: 'Healthcare Infrastructure & Turnkey Projects',
    image: '/images/services/service-2-infra.jpg',
    summary:
      'We deliver end-to-end healthcare infrastructure solutions, from hospital design and medical equipment procurement to ICU, dialysis and diagnostic centre development. Our services also cover facility upgrades, project management, consultancy, installation, integration, and commissioning, helping healthcare organizations build efficient facilities that support better patient care.',
    itemsHeading: 'Turnkey Infrastructure Delivery Scope:',
    items: [
      'Hospital Design & Architecture Planning',
      'Medical Equipment Planning & Procurement',
      'Intensive Care Unit (ICU) Development',
      'Dialysis Centre Development & Water Loops',
      'Diagnostic & Imaging Centre Development',
      'Healthcare Facility Upgrades & Modernization',
      'Turnkey Project Management & Consultancy',
      'Installation, System Integration & Clinical Commissioning',
    ],
    actionLabel: 'Explore Projects',
    actionPath: '/projects',
  },
  {
    number: '03',
    title: 'Biomedical Engineering Solutions',
    image: '/images/services/service-3-biomed.jpg',
    summary:
      'Our biomedical engineering team ensures the reliability, performance, and longevity of healthcare equipment through preventive and corrective maintenance, technical support, equipment lifecycle management, calibration, clinical applications support, user training, and system optimization.',
    itemsHeading: 'Biomedical Engineering & Support Scope:',
    items: [
      'Preventive & Corrective Biomedical Maintenance',
      'Service Level Agreements (SLAs) & 24/7 Technical Support',
      'Comprehensive Equipment Lifecycle Management',
      'Precision Calibration & Performance Optimization',
      'Clinical Applications Support & Operator Workflow',
      'Biomedical User Training & System Safety Audits',
    ],
    actionLabel: 'Get After-Sales Support',
    actionPath: '/support',
  },
  {
    number: '04',
    title: 'Healthcare Education & Capacity Building',
    image: '/images/services/service-4-training.jpg',
    summary:
      'We drive sustainable healthcare transformation through professional education, knowledge transfer, and community health initiatives. Our programmes include clinical training, CME programmes, biomedical engineering training, technical workshops, knowledge exchange, public health education, community outreach and screening, patient support, and strategic healthcare partnerships.',
    itemsHeading: 'Capacity Building & Education Initiatives:',
    items: [
      'Clinical Training Academies & Skill Simulation',
      'Continuous Medical Education (CME) Programmes',
      'Biomedical Engineering Technical Certifications',
      'Hands-on Masterclasses & Application Workshops',
      'Knowledge Exchange Platforms & Clinical Symposia',
      'Public Health Education & Community Health Outreach',
      'Healthcare Access, Advocacy & Patient Support Initiatives',
      'Strategic Collaborations with NGOs, Associations & Teaching Hospitals',
    ],
    actionLabel: 'Visit the Training Hub',
    actionPath: '/training-hub',
  },
]

const FourServicesSection: React.FC = () => {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-sudabelt-surface">
      <div className="sudabelt-container space-y-8 sm:space-y-10">
        {MILANOTE_SERVICES.map((service, idx) => {
          // Alternating subtle green background (#EAF3EC)
          const isGreenBg = idx % 2 === 1
          const cardBgClass = isGreenBg
            ? 'bg-[#EAF3EC] border-sudabelt-sage/60 hover:bg-[#e4efe7]'
            : 'bg-white border-sudabelt-border hover:bg-white'

          return (
            <SectionReveal key={service.number} direction="up" delay={0.08 * (idx + 1)}>
              <div
                className={`rounded-card p-6 sm:p-8 lg:p-10 border shadow-xs hover:-translate-y-1.5 hover:shadow-card hover:border-sudabelt-green transition-all duration-300 group ${cardBgClass}`}
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
                  {/* Left Column: Picture from Milanote + Badge & Title */}
                  <div className="lg:col-span-5 flex flex-col justify-between">
                    <div>
                      {/* Image from Milanote with Badge */}
                      <div className="relative aspect-[16/10] rounded-card overflow-hidden shadow-xs bg-sudabelt-surface mb-5">
                        <img
                          src={service.image}
                          alt={service.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 left-3 w-9 h-9 rounded-control bg-sudabelt-green text-white font-mono font-bold text-sm flex items-center justify-center shadow-md">
                          {service.number}
                        </div>
                      </div>

                      <h2 className="text-xl sm:text-2xl font-extrabold text-sudabelt-navy leading-tight tracking-tight group-hover:text-sudabelt-green transition-colors">
                        {service.title}
                      </h2>

                      <div className="w-8 h-0.75 bg-sudabelt-red rounded-xs mt-3 group-hover:w-12 transition-all duration-300" />
                    </div>
                  </div>

                  {/* Right Column: Verbatim Milanote Summary + Checklist & CTA */}
                  <div className="lg:col-span-7 flex flex-col justify-between h-full">
                    <div>
                      {/* Verbatim Milanote Summary */}
                      <p className="text-sudabelt-body text-sm sm:text-[15.5px] leading-relaxed">
                        {service.summary}
                      </p>

                      {/* Scope / Portfolios Checklist */}
                      <div className="mt-5 pt-4 border-t border-sudabelt-border/60">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-sudabelt-green mb-3">
                          {service.itemsHeading}
                        </h3>
                        <ul className="grid grid-cols-1 gap-2 text-xs sm:text-[13px] text-sudabelt-navy/85">
                          {service.items.map((item, itemIdx) => (
                            <li key={itemIdx} className="flex items-start gap-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-sudabelt-green shrink-0 mt-0.5" />
                              <span className="leading-snug">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Action Link */}
                    <div className="mt-6 pt-4 border-t border-sudabelt-border/60">
                      <Link
                        to={service.actionPath}
                        className="inline-flex items-center gap-2 text-xs sm:text-[13px] font-extrabold uppercase tracking-wider text-sudabelt-green hover:text-sudabelt-navy transition-colors"
                      >
                        <span>{service.actionLabel}</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </SectionReveal>
          )
        })}
      </div>
    </section>
  )
}

export default FourServicesSection
