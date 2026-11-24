import React, { useEffect } from 'react'
import { FileText } from 'lucide-react'
import { Link } from 'react-router'

const TermsOfUsePage: React.FC = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    document.title = 'Terms of Use | Sudabelt Medical'
  }, [])

  return (
    <div className="bg-white min-h-screen">
      {/* Header Banner */}
      <section className="bg-sudabelt-navy text-white py-14 sm:py-16">
        <div className="sudabelt-container max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-control bg-sudabelt-blue/20 border border-sudabelt-blue/30 text-sudabelt-blue text-[11px] font-bold uppercase tracking-wider mb-4">
            <FileText className="w-3.5 h-3.5" />
            <span>Legal &amp; Compliance</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold tracking-tight text-white">
            Terms of Use
          </h1>
          <p className="text-sm text-white/75 mt-3 font-mono">
            Effective Date: November 2026 • Sudabelt Medical Ltd.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 sm:py-16">
        <div className="sudabelt-container max-w-4xl space-y-8 text-sudabelt-body text-[15px] leading-relaxed">
          <p>
            Welcome to the website of Sudabelt Medical Ltd. (&quot;Sudabelt&quot;, &quot;we&quot;,
            &quot;our&quot;, or &quot;us&quot;). By accessing or using this website, you agree to be
            bound by these Terms of Use and our{' '}
            <Link to="/privacy-policy" className="text-sudabelt-blue hover:underline font-medium">
              Privacy Policy
            </Link>
            . If you do not agree with any part of these terms, please discontinue use of the site.
          </p>

          <section className="space-y-3">
            <h2 className="text-xl font-extrabold text-sudabelt-navy">
              1. Authorized Use &amp; Professional Audience
            </h2>
            <p>
              This platform provides product specifications, clinical resources, turnkey
              infrastructure capabilities, training programs, and after-sales support portals for
              healthcare institutions, biomedical engineers, procurement teams, and clinicians. You
              agree to use this site only for lawful business and informational purposes.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-extrabold text-sudabelt-navy">
              2. Medical &amp; Technical Information Disclaimer
            </h2>
            <p>
              Product descriptions, datasheets, clinical summaries, and brochures made available on
              this site are provided for informational purposes only and do not constitute medical
              advice, clinical diagnosis, or an offer to sell regulated medical devices outside
              applicable regulatory approvals. Final technical specifications, installation
              prerequisites, and regulatory clearances are governed by formal commercial quotations
              and OEM documentation.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-extrabold text-sudabelt-navy">
              3. Quotations, Orders &amp; Service Level Agreements
            </h2>
            <p>
              Submitting a Request for Quotation (RFQ), training booking, or support ticket through
              this site initiates a commercial or technical review and does not create a binding
              contract until a formal written agreement, purchase order, or Service Level Agreement
              (SLA) is executed by Sudabelt Medical Ltd.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-extrabold text-sudabelt-navy">
              4. Intellectual Property Rights
            </h2>
            <p>
              All trademarks, brand assets, text, graphics, photography, technical documents, and
              software components on this site are the property of Sudabelt Medical Ltd. or its
              respective OEM partners (including GE HealthCare, Baxter, Terumo BCT, Abbott, SWS
              Medical, Maccura, Fisher &amp; Paykel Healthcare, and Ezisurg Medical) and may not be
              reproduced or redistributed without prior written permission.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-extrabold text-sudabelt-navy">
              5. Limitation of Liability
            </h2>
            <p>
              To the fullest extent permitted by law, Sudabelt Medical Ltd. shall not be liable for
              any indirect, incidental, consequential, or special damages arising from your access
              to or inability to use this website, or reliance on general informational content
              published here.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-extrabold text-sudabelt-navy">
              6. Governing Law &amp; Jurisdiction
            </h2>
            <p>
              These Terms of Use are governed by and construed in accordance with the laws of the
              Federal Republic of Nigeria, without regard to conflict-of-law principles.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-extrabold text-sudabelt-navy">7. Contact Information</h2>
            <p>
              For questions regarding these Terms of Use, please contact{' '}
              <a
                href="mailto:info@sudabelt.com"
                className="text-sudabelt-blue hover:underline font-medium"
              >
                info@sudabelt.com
              </a>{' '}
              or write to Sudabelt Medical Ltd., 11A Oba Idowu Abiodun Oniru Street, Victoria
              Island, Lagos, Nigeria.
            </p>
          </section>
        </div>
      </section>
    </div>
  )
}

export default TermsOfUsePage
