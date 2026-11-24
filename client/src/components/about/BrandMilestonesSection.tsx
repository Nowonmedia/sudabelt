import React, { useState } from 'react'
import { X } from 'lucide-react'
import { HeaderTextReveal, SectionReveal } from '../common/Reveal'

interface OemPartnerItem {
  name: string
  description: string
}

const OEM_PARTNERS: OemPartnerItem[] = [
  {
    name: 'GE HealthCare',
    description: 'Medical imaging and life care solutions',
  },
  {
    name: 'Baxter',
    description: 'Renal therapy',
  },
  {
    name: 'Abbott',
    description: 'Diagnostics, devices, pharmaceuticals',
  },
  {
    name: 'Terumo BCT',
    description: 'Blood management, apheresis, cell therapy',
  },
  {
    name: 'Fisher & Paykel',
    description: 'Respiratory care, surgery, sleep apnea',
  },
  {
    name: 'Maccura',
    description: 'Diagnostics, clinical chemistry, immunoassay',
  },
  {
    name: 'SWS Medical',
    description: 'Renal care, hemodialysis equipment',
  },
  {
    name: 'EziSurg Medical',
    description: 'Minimally invasive surgery, surgical stapling',
  },
]

const ISO_POLICY_POINTS = [
  'Implementing a Quality Management System that ensures compliance with ISO 9001:2015 requirements.',
  'Continually improving the Quality Management System as a framework for establishing and reviewing quality objectives to ensure process efficiency and effectiveness.',
  'Creating and ensuring quality awareness within the organisation on the importance of meeting customer, statutory, and regulatory requirements.',
  'Providing a conducive work environment that fosters innovative ideas.',
  'Ensuring quality delivery of services through modern technology.',
  'Developing a competent and dedicated workforce through regular OEM engineering certifications.',
  'Conducting all work to a high professional standard with technical and commercial integrity.',
]

const BrandMilestonesSection: React.FC = () => {
  const [activeCertModal, setActiveCertModal] = useState<string | null>(null)

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-white">
      <div className="sudabelt-container">
        {/* ======================================================== */}
        {/* TOP ROW: PARTNERSHIPS SECTION (EXACT FIGMA 2-COLUMN LAYOUT) */}
        {/* ======================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start pb-16 lg:pb-24 border-b border-sudabelt-border">
          {/* Left Column: Eyebrow, Title, Description, Certification Card */}
          <div className="lg:col-span-5">
            <SectionReveal direction="up" delay={0.1}>
              <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-sudabelt-green mb-3">
                PARTNERSHIPS
              </p>
            </SectionReveal>

            <HeaderTextReveal className="mb-4">
              <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-extrabold text-sudabelt-navy tracking-tight leading-[1.15]">
                From One Global Brand to Eight.
              </h2>
            </HeaderTextReveal>

            <SectionReveal direction="up" delay={0.25}>
              <p className="text-sudabelt-body text-base leading-relaxed mb-8">
                Partnerships have grown under the co-founder's leadership, each built on the same quality standards the company has held since inception.
              </p>
            </SectionReveal>

            {/* Figma Certification Callout Card */}
            <SectionReveal direction="up" delay={0.35}>
              <div className="p-6 rounded-2xl bg-sudabelt-green-tint border border-sudabelt-green/20">
                <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-sudabelt-green">
                  CERTIFICATION
                </span>
                <h3 className="text-base sm:text-lg font-extrabold text-sudabelt-navy mt-1">
                  ISO 9001:2015 Quality Management System
                </h3>
              </div>
            </SectionReveal>
          </div>

          {/* Right Column: Clean list with border-bottom after each item (no border around card) */}
          <div className="lg:col-span-7">
            <SectionReveal direction="up" delay={0.2}>
              <div className="divide-y divide-sudabelt-border border-t border-sudabelt-border">
                {OEM_PARTNERS.map((partner) => (
                  <div
                    key={partner.name}
                    className="py-4 sm:py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4 hover:bg-sudabelt-surface/40 px-2 sm:px-3 rounded-lg transition-colors"
                  >
                    <span className="text-base sm:text-lg font-bold text-sudabelt-navy shrink-0">
                      {partner.name}
                    </span>
                    <span className="text-xs sm:text-sm text-sudabelt-muted sm:text-right font-normal">
                      {partner.description}
                    </span>
                  </div>
                ))}
              </div>
            </SectionReveal>
          </div>
        </div>

        {/* ======================================================== */}
        {/* BOTTOM ROW: ACTUAL CERTIFICATES (NO TEXT MOCKUPS) & 7 ITEMS */}
        {/* ======================================================== */}
        <div className="pt-16 sm:pt-20">
          <div className="max-w-3xl mb-12">
            <SectionReveal direction="up" delay={0.1}>
              <div className="flex items-center gap-3 mb-3">
                <span className="w-8 h-0.75 bg-sudabelt-green rounded-xs" />
                <span className="text-[12px] font-bold uppercase tracking-[0.16em] text-sudabelt-green">
                  OFFICIAL ACCREDITATION
                </span>
              </div>
            </SectionReveal>

            <HeaderTextReveal className="mb-4">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-sudabelt-navy tracking-tight leading-tight">
                Our ISO 9001:2015 Certifications
              </h2>
            </HeaderTextReveal>

            <SectionReveal direction="up" delay={0.2}>
              <p className="text-sudabelt-body text-base sm:text-lg leading-relaxed">
                Sudabelt Medical operates under full ISO 9001:2015 Quality Management System accreditation, verified and audited by Cognicert for medical equipment procurement, turnkey delivery, and biomedical lifecycle engineering.
              </p>
            </SectionReveal>
          </div>

          {/* Actual Certificate Images (Displayed Prominently) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 mb-16">
            {/* Certificate 1: ISO 9001:2015 Certificate of Registration */}
            <SectionReveal direction="up" delay={0.25}>
              <div className="group bg-white rounded-2xl border border-sudabelt-border p-4 sm:p-6 shadow-sm hover:shadow-xl transition-all duration-300">
                <div
                  className="relative cursor-pointer overflow-hidden rounded-xl bg-sudabelt-surface border border-sudabelt-border aspect-3/4 flex items-center justify-center"
                  onClick={() => setActiveCertModal('/images/about/iso-9001-certificate.png')}
                >
                  <img
                    src="/images/about/iso-9001-certificate.png"
                    alt="ISO 9001:2015 Certificate of Registration - Sudabelt Medical Company Limited"
                    className="w-full h-full object-contain group-hover:scale-[1.02] transition-transform duration-300"
                  />
                </div>
                <div className="mt-4 pt-3 border-t border-sudabelt-border text-center">
                  <h4 className="text-sm sm:text-base font-bold text-sudabelt-navy">
                    ISO 9001:2015 Certificate of Registration
                  </h4>
                  <p className="text-xs text-sudabelt-muted mt-1">
                    Cognicert Accreditation · Quality Management System
                  </p>
                </div>
              </div>
            </SectionReveal>

            {/* Certificate 2: Surveillance Audit & Continual Improvement Letter */}
            <SectionReveal direction="up" delay={0.35}>
              <div className="group bg-white rounded-2xl border border-sudabelt-border p-4 sm:p-6 shadow-sm hover:shadow-xl transition-all duration-300">
                <div
                  className="relative cursor-pointer overflow-hidden rounded-xl bg-sudabelt-surface border border-sudabelt-border aspect-3/4  flex items-center justify-center"
                  onClick={() => setActiveCertModal('/images/about/iso-audit-confirmation.png')}
                >
                  <img
                    src="/images/about/iso-audit-confirmation.png"
                    alt="ISO Continual Improvement & Surveillance Confirmation Letter - Sudabelt Medical"
                    className="w-full h-full object-contain group-hover:scale-[1.02] transition-transform duration-300"
                  />
                </div>
                <div className="mt-4 pt-3 border-t border-sudabelt-border text-center">
                  <h4 className="text-sm sm:text-base font-bold text-sudabelt-navy">
                    Surveillance Audit & Continual Improvement Confirmation
                  </h4>
                  <p className="text-xs text-sudabelt-muted mt-1">
                    Cognicert Certification Board · Compliance Endorsement
                  </p>
                </div>
              </div>
            </SectionReveal>
          </div>

          {/* Quality Policy & The 7 Items Numbered 1 to 7 */}
          <SectionReveal direction="up" delay={0.3}>
            <div className="p-8 sm:p-10 lg:p-12 rounded-3xl bg-sudabelt-green-tint border border-sudabelt-green/20">
              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-sudabelt-green block mb-2">
                ISO 9001:2015 QUALITY POLICY
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-sudabelt-navy mb-4">
                Our Seven Pillars of Quality Assurance
              </h3>
              <p className="text-sudabelt-body text-base sm:text-lg leading-relaxed mb-8">
                Quality is at the core of Sudabelt Medical's operations. From inception, the company has built its processes on the foundation of excellence, achieving and maintaining the ISO 9001:2015 Quality Management System (QMS) certification. This is a clear endorsement of Sudabelt's continuous commitment to delivering high-quality healthcare products and services while embracing global best practices. As outlined in the ISO 9001:2015 quality policy, Sudabelt is dedicated to:
              </p>

              {/* Items Numbered 1 to 7 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5 mb-8">
                {ISO_POLICY_POINTS.map((point, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3.5 p-4 sm:p-5 rounded-2xl bg-white border border-sudabelt-border shadow-xs hover:border-sudabelt-green/40 transition-colors"
                  >
                    <span className="w-8 h-8 rounded-full bg-sudabelt-green text-white text-xs font-extrabold flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                      {idx + 1}
                    </span>
                    <p className="text-sm text-sudabelt-navy font-semibold leading-relaxed">
                      {point}
                    </p>
                  </div>
                ))}
              </div>

              {/* Content Underneath from Milanote */}
              <div className="p-6 sm:p-8 rounded-2xl bg-white border border-sudabelt-border text-sm sm:text-base text-sudabelt-body leading-relaxed space-y-4">
                <p>
                  These priorities are backed by substantial investment in staff training and development. Our employees are encouraged to take ownership of quality in every task, ensuring that both service delivery and internal processes meet the highest standards.
                </p>
                <p>
                  In an industry that evolves with technological advancements, our team remains ahead through regular training, exposure to the latest tools, and strict adherence to standard operating procedures for consistency. At Sudabelt Medical, we believe quality healthcare starts with quality solutions. By upholding these principles, we continue to play our part in building healthier communities and consistently meeting and often surpassing international expectations.
                </p>
              </div>
            </div>
          </SectionReveal>
        </div>
      </div>

      {/* Lightbox Modal for Certificate Full View */}
      {activeCertModal && (
        <div
          className="fixed inset-0 z-50 bg-sudabelt-navy/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
          onClick={() => setActiveCertModal(null)}
        >
          <div
            className="relative bg-white rounded-2xl max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-sudabelt-border bg-sudabelt-surface">
              <span className="text-xs font-bold uppercase tracking-wider text-sudabelt-navy">
                Official ISO 9001:2015 Accreditation Document
              </span>
              <button
                type="button"
                onClick={() => setActiveCertModal(null)}
                className="w-8 h-8 rounded-full bg-white border border-sudabelt-border flex items-center justify-center text-sudabelt-navy hover:bg-sudabelt-surface transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="overflow-auto p-4 flex items-center justify-center">
              <img
                src={activeCertModal}
                alt="Accreditation Certificate Full"
                className="max-h-[75vh] w-auto object-contain rounded-lg shadow-sm"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default BrandMilestonesSection
