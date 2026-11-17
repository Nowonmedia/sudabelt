import React, { useState } from 'react'
import { Download } from 'lucide-react'
import { SectionReveal } from '../common/Reveal'
import LeadMagnetModal from '../common/LeadMagnetModal'

const COMPANY_PROFILE_PDF_URL =
  'https://media.milanote.com/p/files/1WYxA01oRhl26L/ud6/updated_Company%20profile%20Copy.docx.pdf'

const CompanyProfileCtaBar: React.FC = () => {
  const [showModal, setShowModal] = useState<boolean>(false)

  return (
    <>
      <section className="bg-sudabelt-green text-white relative overflow-hidden">
        {/* Pattern Overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-10 bg-repeat bg-contain"
          style={{ backgroundImage: `url('/images/brand/PATTERNS-WHITE SLIM 1.webp')` }}
        />

        <div className="relative z-10 sudabelt-container py-8 sm:py-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <SectionReveal direction="right" delay={0.1}>
              <div>
                <div className="text-[12px] font-bold uppercase tracking-[0.14em] text-sudabelt-blue mb-1">
                  Company Overview
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                  Our business, capabilities and portfolio.
                </h2>
              </div>
            </SectionReveal>

            <SectionReveal direction="left" delay={0.2} className="shrink-0">
              <button
                type="button"
                onClick={() => setShowModal(true)}
                className="inline-flex items-center justify-center gap-2.5 h-12.5 px-7 rounded-control bg-sudabelt-blue hover:bg-sudabelt-blue-hover text-sudabelt-navy font-extrabold text-[13px] tracking-wider uppercase transition-colors shadow-xs cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download Company Profile</span>
              </button>
            </SectionReveal>
          </div>
        </div>
      </section>

      {/* Gated Lead Capture Modal before download */}
      <LeadMagnetModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        assetTitle="Sudabelt Medical Company Profile"
        assetSlug="company-profile"
        directDownloadUrl={COMPANY_PROFILE_PDF_URL}
        description="Please provide your professional email to download the official Sudabelt Medical company profile, turnkey engineering portfolio, and clinical capabilities overview."
        buttonLabel="Download Company Profile"
      />
    </>
  )
}

export default CompanyProfileCtaBar
