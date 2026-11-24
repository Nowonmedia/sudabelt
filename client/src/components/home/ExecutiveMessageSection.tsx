import React from 'react'
import { Link } from 'react-router'
import { HeaderTextReveal, SectionReveal } from '../common/Reveal'

const ExecutiveMessageSection: React.FC = () => {
  return (
    <section className="bg-sudabelt-surface py-20 lg:py-24 border-b border-sudabelt-border">
      <div className="sudabelt-container">
        <SectionReveal className="bg-white rounded-card border border-sudabelt-sage p-8 sm:p-11 lg:p-14">
          <HeaderTextReveal>
            <div className="w-5.5 h-0.75 bg-sudabelt-red rounded-mark mb-3" />
            <span className="text-eyebrow text-sudabelt-green">EXECUTIVE MESSAGE</span>
            <h2 className="text-section-heading text-sudabelt-navy mt-2.5 max-w-190">
              Transforming Healthcare Delivery Across Africa.
            </h2>
          </HeaderTextReveal>

          <div className="mt-7 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 text-[15.5px] sm:text-[16px] leading-[26.4px] text-sudabelt-body">
            <div className="space-y-4">
              <p>
                Africa’s healthcare landscape is rapidly evolving, presenting both significant
                challenges and opportunities for transformation. At Sudabelt Medical, we are
                committed to playing a leading role in this journey by delivering integrated
                solutions that strengthen healthcare systems and improve patient outcomes.
              </p>
              <p>
                Our strategic direction is centered on innovation, partnership, and sustainability.
                Beyond providing world-class technologies, we continue to expand our capabilities in
                healthcare infrastructure, biomedical services, professional education, and
                community impact initiatives.
              </p>
            </div>

            <div className="space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                <p>
                  As we look to the future, our focus remains clear: to build lasting partnerships,
                  empower healthcare providers, and contribute meaningfully to the advancement of
                  healthcare across Africa.
                </p>
                <p className="font-bold text-sudabelt-navy">
                  Together, we are shaping a healthier future and advancing healthcare excellence
                  across the continent.
                </p>
              </div>

              <div className="pt-4">
                <Link
                  to="/about"
                  className="h-12.5 px-6.5 rounded-control bg-sudabelt-navy hover:bg-sudabelt-green text-white font-bold text-[13px] tracking-[0.06em] uppercase inline-flex items-center justify-center transition-colors"
                >
                  LEARN MORE
                </Link>
              </div>
            </div>
          </div>
        </SectionReveal>
      </div>
    </section>
  )
}

export default ExecutiveMessageSection
