import React from 'react'
import { Link } from 'react-router'
import { HeaderTextReveal, SectionReveal } from '../common/Reveal'

const ServicesHeroSection: React.FC = () => {
  return (
    <section className="relative text-white overflow-hidden min-h-120 sm:min-h-135   flex items-center">
      {/* Full Background Clinical Image with subtle dark transparent overlay so text is clearly visible */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/services/services-hero.webp"
          alt="Biomedical Specialist Operating Diagnostic Technology"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-[#06183d]/55" />
      </div>

      <div className="relative z-10 sudabelt-container py-16 sm:py-20 lg:py-24">
        <div className="max-w-xl lg:max-w-2xl">
          {/* Eyebrow / Page Badge */}
          <SectionReveal direction="up" delay={0.1}>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 sm:w-10 h-0.75 bg-sudabelt-red rounded-xs" />
              <span className="inline-block px-3.5 py-1 rounded-control bg-sudabelt-blue text-white text-[12px] sm:text-[13px] font-extrabold uppercase tracking-[0.14em] shadow-md">
                Services
              </span>
            </div>
          </SectionReveal>

          {/* Headline */}
          <HeaderTextReveal className="mb-6">
            <h1 className="text-3xl sm:text-4xl lg:text-[50px] font-extrabold text-white leading-[1.14] tracking-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
              Personalized Healthcare Solutions
            </h1>
          </HeaderTextReveal>

          {/* Description */}
          <SectionReveal direction="up" delay={0.25}>
            <p className="text-base sm:text-lg lg:text-[18.5px] text-white leading-[1.6] font-medium max-w-xl mb-8 drop-shadow-[0_2px_6px_rgba(0,0,0,0.85)]">
              Experience healthcare solutions tailored to your unique needs. Our comprehensive range of medical services includes top-quality equipment, 
              effective management, and dedicated aftersales support ensuring that you're fully covered every step of the way!.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4">
              <Link
                to="/rfq"
                className="h-12 px-7 rounded-control bg-sudabelt-blue hover:bg-sudabelt-green text-sudabelt-navy hover:text-white font-extrabold text-[13px] tracking-wider uppercase transition-all duration-200 inline-flex items-center justify-center shadow-lg cursor-pointer"
              >
                Request a Quote
              </Link>

              <Link
                to="/contact"
                className="h-12 px-7 rounded-control bg-sudabelt-navy/80 hover:bg-sudabelt-navy border border-white/60 hover:border-white text-white font-extrabold text-[13px] tracking-wider uppercase transition-colors inline-flex items-center justify-center shadow-lg cursor-pointer backdrop-blur-xs"
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
