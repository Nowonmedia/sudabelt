import React, { useState } from 'react'
import { FileCheck, ShieldCheck, X, CheckCircle } from 'lucide-react'
import { HeaderTextReveal, SectionReveal } from '../common/Reveal'
import LeadMagnetModal from '../common/LeadMagnetModal'

interface OemPartnerItem {
  name: string
  domain: string
  flagship: string
}

const OEM_PARTNERS: OemPartnerItem[] = [
  {
    name: 'GE HealthCare',
    domain: 'Diagnostic Imaging, Maternal Health & Monitoring',
    flagship: 'LOGIQ Ultrasound, Definium XR, C-Arms',
  },
  {
    name: 'Baxter',
    domain: 'Renal Care, Medication Delivery & Critical Care',
    flagship: 'AK 98 Dialysis System, PrisMax CRRT',
  },
  {
    name: 'Abbott',
    domain: 'Point of Care, Core Diagnostics & Blood Screening',
    flagship: 'i-STAT 1 Blood Analyzer, Architect Testing',
  },
  {
    name: 'Terumo BCT',
    domain: 'Blood Transfusion, Apheresis & Cell Therapy',
    flagship: 'Mirasol PRT System, Trima Accel Apheresis',
  },
  {
    name: 'Fisher & Paykel',
    domain: 'Respiratory Care & Neonatal Humidification',
    flagship: 'Airvo 2 High Flow, myAirvo 2, Neonatal CPAP',
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

const ISO_CERTIFICATE_URL =
  'https://media.milanote.com/p/files/1WYxA01oRhl26L/ud6/updated_Company%20profile%20Copy.docx.pdf'

const BrandMilestonesSection: React.FC = () => {
  const [showLeadModal, setShowLeadModal] = useState<boolean>(false)
  const [showIsoPolicyModal, setShowIsoPolicyModal] = useState<boolean>(false)

  return (
    <>
      <section className="py-16 sm:py-20 lg:py-24 bg-white">
        <div className="sudabelt-container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            {/* Left Column: Story, Official ISO Badge of Professionality & ISO Action */}
            <div className="lg:col-span-5">
              <SectionReveal direction="up" delay={0.1}>
                <div className="flex items-center gap-3 mb-3">
                  <span className="w-8 h-0.75 bg-sudabelt-red rounded-xs" />
                  <span className="text-[12px] font-bold uppercase tracking-[0.14em] text-sudabelt-green">
                    OEM Partners
                  </span>
                </div>
              </SectionReveal>

              <HeaderTextReveal className="mb-5">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-sudabelt-navy tracking-tight leading-tight">
                  From one global brand to five.
                </h2>
              </HeaderTextReveal>

              <SectionReveal direction="up" delay={0.25}>
                <p className="text-sudabelt-body text-base sm:text-[17px] leading-relaxed mb-6">
                  From our founding partnership to representing five of the world's most trusted medical technology OEMs, our growth reflects an uncompromising standard of clinical excellence and commercial integrity.
                </p>

                {/* Prominent ISO 9001:2015 Badge of Professionality per Milanote & Client Requirement */}
                <div className="mb-8 p-4 rounded-card bg-sudabelt-surface border border-sudabelt-border flex items-center gap-4 shadow-2xs">
                  <div className="w-14 h-14 rounded-full bg-sudabelt-green/10 border-2 border-sudabelt-green/30 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-7 h-7 text-sudabelt-green" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10.5px] font-extrabold uppercase tracking-widest text-sudabelt-green bg-sudabelt-green/10 px-2 py-0.5 rounded-control">
                        Certified Standard
                      </span>
                      <CheckCircle className="w-3.5 h-3.5 text-sudabelt-green" />
                    </div>
                    <h4 className="text-sm font-extrabold text-sudabelt-navy mt-1 tracking-tight">
                      ISO 9001:2015 Quality Management
                    </h4>
                    <p className="text-xs text-sudabelt-muted mt-0.5">
                      Scope: Medical Equipment Supply, Turnkey Projects, Clinical Engineering & Support.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 items-start">
                  <button
                    type="button"
                    onClick={() => setShowLeadModal(true)}
                    className="inline-flex items-center gap-2.5 h-12 px-6 rounded-control border border-sudabelt-navy hover:bg-sudabelt-navy hover:text-white text-sudabelt-navy font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer shadow-xs"
                  >
                    <FileCheck className="w-4 h-4 text-sudabelt-green" />
                    <span>Download ISO 9001:2015 Certificate</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowIsoPolicyModal(true)}
                    className="inline-flex items-center gap-1.5 h-12 px-4 rounded-control text-xs font-bold uppercase tracking-wider text-sudabelt-muted hover:text-sudabelt-navy transition-colors cursor-pointer"
                  >
                    <span>View Quality Policy</span>
                  </button>
                </div>
              </SectionReveal>
            </div>

            {/* Right Column: Clean List with NO border around the card, only border-bottom after each item */}
            <div className="lg:col-span-7">
              <SectionReveal direction="up" delay={0.2}>
                <div className="w-full">
                  {OEM_PARTNERS.map((partner) => (
                    <div
                      key={partner.name}
                      className="py-5 sm:py-6 border-b border-sudabelt-border hover:bg-sudabelt-surface/40 transition-colors flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-6"
                    >
                      <div>
                        <h3 className="text-lg sm:text-[19px] font-bold text-sudabelt-navy">
                          {partner.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-sudabelt-muted mt-0.5">
                          {partner.flagship}
                        </p>
                      </div>

                      <div className="sm:text-right shrink-0">
                        <span className="inline-block px-3 py-1 rounded-control bg-sudabelt-surface text-sudabelt-navy text-xs font-semibold border border-sudabelt-border">
                          {partner.domain}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Supporting Partners note */}
                <div className="mt-5 text-xs text-sudabelt-muted flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span className="font-semibold text-sudabelt-navy">Additional Authorised Portfolios:</span>
                  <span>Maccura Biotechnology</span>
                  <span>•</span>
                  <span>SWS Medical</span>
                  <span>•</span>
                  <span>EziSurg Medical</span>
                </div>
              </SectionReveal>
            </div>
          </div>
        </div>
      </section>

      {/* Lead Capture Modal for ISO 9001:2015 Certificate */}
      <LeadMagnetModal
        isOpen={showLeadModal}
        onClose={() => setShowLeadModal(false)}
        assetTitle="ISO 9001:2015 Quality Management Certificate"
        assetSlug="iso-9001-2015-certificate"
        directDownloadUrl={ISO_CERTIFICATE_URL}
        description="Please provide your professional work email to download the certified Sudabelt Medical ISO 9001:2015 Quality Management System Certificate and technical compliance audit dossier."
        buttonLabel="Download ISO Certificate"
      />

      {/* ISO Quality Policy Modal */}
      {showIsoPolicyModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-sudabelt-navy/80 backdrop-blur-sm"
        >
          <div className="relative w-full max-w-2xl bg-white rounded-card shadow-modal overflow-hidden border border-sudabelt-border max-h-[90vh] flex flex-col">
            <div className="bg-sudabelt-navy text-white px-6 sm:px-8 py-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-sudabelt-blue" />
                <div>
                  <h3 className="text-lg font-bold">ISO 9001:2015 Quality Policy</h3>
                  <p className="text-xs text-white/75">Certificate Ref: QMS-NG-SBM-2020</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowIsoPolicyModal(false)}
                className="w-8 h-8 rounded-control bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 sm:p-8 overflow-y-auto space-y-4 text-sm text-sudabelt-body">
              <p className="font-medium text-sudabelt-navy leading-relaxed">
                Quality is at the core of Sudabelt Medical's operations. From inception, the company has built its processes on the foundation of excellence, achieving and maintaining the ISO 9001:2015 Quality Management System (QMS) certification.
              </p>

              <h4 className="text-xs font-bold uppercase tracking-wider text-sudabelt-green pt-2">
                Seven Pillars of Sudabelt Quality Assurance:
              </h4>

              <ol className="list-decimal pl-5 space-y-2 text-xs sm:text-sm text-sudabelt-navy/85">
                {ISO_POLICY_POINTS.map((point) => (
                  <li key={point} className="leading-relaxed">
                    {point}
                  </li>
                ))}
              </ol>

              <div className="p-4 rounded-control bg-sudabelt-surface border border-sudabelt-border mt-4">
                <div className="text-xs font-bold text-sudabelt-navy uppercase tracking-wider mb-1">
                  Accreditation Status
                </div>
                <div className="text-xs text-sudabelt-muted">
                  Fully certified for medical equipment supply, clinical installation, preventive biomedical maintenance, and specialized hospital logistics across Nigeria.
                </div>
              </div>
            </div>

            <div className="px-6 sm:px-8 py-4 bg-sudabelt-surface border-t border-sudabelt-border flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setShowIsoPolicyModal(false)
                  setShowLeadModal(true)
                }}
                className="text-xs font-bold uppercase text-sudabelt-green hover:underline cursor-pointer"
              >
                Request Downloadable Certificate PDF →
              </button>
              <button
                type="button"
                onClick={() => setShowIsoPolicyModal(false)}
                className="px-5 py-2 rounded-control bg-sudabelt-navy text-white text-xs font-bold uppercase hover:bg-sudabelt-navy/90 transition-colors cursor-pointer"
              >
                Close Statement
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default BrandMilestonesSection
