import React from 'react'
import { Link } from 'react-router'
import { FaWhatsapp } from 'react-icons/fa6'
import WhiteSlimPattern from './WhiteSlimPattern'
import { HeaderTextReveal, SectionReveal } from './Reveal'

interface PreFooterCTAProps {
  eyebrow?: string
  title?: string
  subtitle?: string
  primaryLabel?: string
  primaryTo?: string
  secondaryLabel?: string
  secondaryTo?: string
  secondaryType?: 'whatsapp' | 'link'
  whatsappMessage?: string
}

const OFFICIAL_WHATSAPP_NUMBER = '2349011235400'

const PreFooterCTA: React.FC<PreFooterCTAProps> = ({
  eyebrow = 'JOIN US IN ADVANCING HEALTHCARE EXCELLENCE IN AFRICA',
  title = 'Planning a renal unit, blood bank or ICU?',
  subtitle = 'Have questions? We are here to help. Our team is available to provide the information and support you need about our products and services.',
  primaryLabel = 'REQUEST A QUOTE',
  primaryTo = '/rfq',
  secondaryLabel = 'CHAT ON WHATSAPP',
  secondaryTo,
  secondaryType = 'whatsapp',
  whatsappMessage = 'Hello Sudabelt Medical, I would like to inquire about your medical equipment and healthcare infrastructure solutions.',
}) => {
  const whatsappUrl = `https://wa.me/${OFFICIAL_WHATSAPP_NUMBER}?text=${encodeURIComponent(
    whatsappMessage
  )}`

  return (
    <section className="relative bg-sudabelt-green text-white py-14 lg:py-16 overflow-hidden">
      {/* Supplied White Slim Pattern from public/images/brand/PATTERNS-WHITE SLIM 1.webp */}
      <WhiteSlimPattern
        className="absolute inset-y-0 right-0 w-full lg:w-[65%]"
        opacity={0.2}
      />

      <SectionReveal className="sudabelt-container relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <HeaderTextReveal>
          {eyebrow && (
            <span className="text-[11.5px] font-bold uppercase tracking-[0.14em] text-sudabelt-blue">
              {eyebrow}
            </span>
          )}
          <h2 className="text-[28px] sm:text-[34px] lg:text-[38px] leading-[1.14] font-extrabold tracking-[-0.02em] text-white max-w-130 mt-2">
            {title}
          </h2>
          {subtitle && (
            <p className="text-[15px] leading-6 text-white/85 mt-3 max-w-135">
              {subtitle}
            </p>
          )}
        </HeaderTextReveal>

        <div className="flex flex-wrap items-center gap-3.5 shrink-0">
          {/* Button 1: Light Blue (bg-sudabelt-blue) Background and Dark (text-sudabelt-navy) Text */}
          <Link
            to={primaryTo}
            className="h-12 px-6 rounded-control bg-sudabelt-blue hover:bg-sudabelt-green text-sudabelt-navy hover:text-white font-extrabold text-[12.5px] tracking-[0.06em] uppercase inline-flex items-center justify-center transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 shadow-xs"
          >
            {primaryLabel}
          </Link>

          {/* Button 2: Secondary Link or WhatsApp */}
          {secondaryType === 'link' && secondaryTo ? (
            <Link
              to={secondaryTo}
              className="h-12 px-6 rounded-control bg-transparent border border-white hover:bg-white/15 text-white font-bold text-[12.5px] tracking-[0.06em] uppercase inline-flex items-center justify-center transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>{secondaryLabel}</span>
            </Link>
          ) : (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="h-12 px-6 rounded-control bg-transparent border border-white hover:bg-white/15 text-white font-bold text-[12.5px] tracking-[0.06em] uppercase inline-flex items-center justify-center gap-2 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
            >
              <FaWhatsapp className="w-4 h-4" />
              <span>{secondaryLabel}</span>
            </a>
          )}
        </div>
      </SectionReveal>
    </section>
  )
}

export default PreFooterCTA
