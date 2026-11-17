import React from 'react'
import { Link } from 'react-router'
import { HeaderTextReveal, SectionReveal } from '../common/Reveal'

const ServicesHeroSection: React.FC = () => {
  return (
    <section className="relative text-white overflow-hidden min-h-[480px] sm:min-h-[540px] flex items-center">
      {/* Full Background Clinical Image (No blue block; image spans entire background) */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/services/services-hero.webp"
          alt="Biomedical Specialist Operating Diagnostic Technology"
          className="w-full h-full object-cover object-center"
        />
        {/* Dark translucent wash so text is crisp and readable, without any blue block */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[0.5px]" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/30" />
      </div>

      <div className="relative z-10 sudabelt-container py-16 sm:py-20 lg:py-24">
        <div className="max-w-xl lg:max-w-2xl">
          {/* Eyebrow */}
          <SectionReveal direction="up" delay={0.1}>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 sm:w-10 h-0.75 bg-sudabelt-red rounded-xs" />
              <span className="text-[12px] sm:text-[13px] font-bold uppercase tracking-[0.14em] text-sudabelt-blue">
                Services
              </span>
            </div>
          </SectionReveal>

          {/* Headline */}
          <HeaderTextReveal className="mb-6">
            <h1 className="text-3xl sm:text-4xl lg:text-[50px] font-extrabold text-white leading-[1.14] tracking-[-0.025em] drop-shadow-sm">
              Four services. One accountable partner.
            </h1>
          </HeaderTextReveal>

          {/* Description */}
          <SectionReveal direction="up" delay={0.25}>
            <p className="text-base sm:text-lg lg:text-[18.5px] text-white/90 leading-[1.6] font-normal max-w-xl mb-8 drop-shadow-xs">
              From equipment and consumables to engineering support and full healthcare projects delivered by your own in-country team.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4">
              <Link
                to="/rfq"
                className="h-12 px-7 rounded-control bg-sudabelt-blue hover:bg-sudabelt-blue-hover text-sudabelt-navy font-extrabold text-[13px] tracking-wider uppercase transition-colors inline-flex items-center justify-center shadow-md cursor-pointer"
              >
                Request a Quote
              </Link>

              <Link
                to="/contact"
                className="h-12 px-7 rounded-control border border-white/50 hover:border-white hover:bg-white/10 text-white font-extrabold text-[13px] tracking-wider uppercase transition-colors inline-flex items-center justify-center cursor-pointer"
              >
                Send a Brief
              </Link>
            </div>
          </SectionReveal>
        </div>
      </div>
    </section>
  )
}

export default ServicesHeroSection
