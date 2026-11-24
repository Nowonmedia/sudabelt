import React from 'react'
import { HeaderTextReveal, SectionReveal } from '../common/Reveal'

interface RecognitionCardData {
  badge: string
  title: string
  description: string
}

const RECOGNITIONS: RecognitionCardData[] = [
  {
    badge: '2019',
    title: 'Healthcare Equipment Marketing Company of the Year',
    description:
      'Adjusts dialysate conductivity and ultrafiltration rate in real time to reduce intradialytic hypotension.',
  },
  {
    badge: '2020',
    title: 'Best Partner in Africa',
    description: 'Awarded by Terumo BCT.',
  },
  {
    badge: 'COVID-19',
    title: 'Lagos State Government recognition',
    description: 'For corporate social responsibility work during the pandemic.',
  },
]

const AboutRecognitionSection: React.FC = () => {
  return (
    <section className="relative text-white py-20 lg:py-28 overflow-hidden">
      {/* Background Clinical Ward Photo with Light Transparent Blue Overlay (No Gradient) */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/about/recognition.webp"
          alt="Clinical ward backdrop"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-[#06183d]/55" />
      </div>

      <div className="relative z-10 sudabelt-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Left Column: Headline */}
          <div className="lg:col-span-5">
            <SectionReveal direction="up" delay={0.1}>
              <div className="text-[12px] font-bold uppercase tracking-[0.14em] text-white/80 mb-4">
                Recognition
              </div>
            </SectionReveal>

            <HeaderTextReveal>
              <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-white tracking-tight leading-[1.15]">
                Recognized by Partners and Government.
              </h2>
            </HeaderTextReveal>
          </div>

          {/* Right Column: 3 Ultra-Transparent Glass Cards matching exact screenshot */}
          <div className="lg:col-span-7 space-y-4">
            {RECOGNITIONS.map((rec, idx) => (
              <SectionReveal key={rec.badge} direction="left" delay={0.12 * (idx + 1)}>
                <div className="rounded-[14px] p-5 sm:p-6 bg-white/4 backdrop-blur-[2px] border border-white/20 hover:border-white/35 hover:bg-white/[0.07] transition-all flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6">
                  {/* Year / Event Pill */}
                  <div className="shrink-0">
                    <span className="inline-block px-3 py-1 rounded-control border border-white/25 text-xs font-mono font-bold text-white/90 bg-white/5">
                      {rec.badge}
                    </span>
                  </div>

                  {/* Recognition Title and Description */}
                  <div className="flex-1">
                    <h3 className="text-base sm:text-[17px] font-bold text-white leading-snug">
                      {rec.title}
                    </h3>
                    <p className="text-xs sm:text-[13px] text-white/70 leading-relaxed mt-1">
                      {rec.description}
                    </p>
                  </div>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutRecognitionSection
