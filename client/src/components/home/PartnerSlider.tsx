import React from 'react'
import { Link } from 'react-router'
import { motion } from 'framer-motion'
import { SectionReveal } from '../common/Reveal'

interface ChannelPartnerLogo {
  name: string
  logoUrl: string
  websiteUrl: string
}

const CHANNEL_PARTNER_LOGOS: ChannelPartnerLogo[] = [
  {
    name: 'Baxter International',
    logoUrl:
      'https://app.milanote.com/media/p/images/1WUc7I1wvLq65i/eBa/Baxter%20Logo.png?w=400',
    websiteUrl: 'https://www.baxter.com',
  },
  {
    name: 'Abbott Laboratories',
    logoUrl:
      'https://app.milanote.com/media/p/images/1WUc881wvLq65m/flB/Abbot%20Logo.png?w=400',
    websiteUrl: 'https://www.abbott.com',
  },
  {
    name: 'Fisher & Paykel Healthcare',
    logoUrl:
      'https://app.milanote.com/media/p/images/1WUc7M1wvLq65j/b6d/Fisher%20%26%20Paykel-logo.png?w=400',
    websiteUrl: 'https://www.fphcare.com',
  },
  {
    name: 'GE HealthCare',
    logoUrl:
      'https://app.milanote.com/media/p/images/1WUc7X1wvLq65k/9ZB/GEHC_DSTBTR_RGB-Gray.png?w=400',
    websiteUrl: 'https://www.gehealthcare.com',
  },
  {
    name: 'Ezisurg Medical',
    logoUrl:
      'https://app.milanote.com/media/p/images/1WUc811wvLq65l/cxf/Ezisurg%20logo.png?w=display',
    websiteUrl: 'https://www.ezisurg.com',
  },
  {
    name: 'Terumo BCT',
    logoUrl:
      'https://app.milanote.com/media/p/images/1WUc7m1wvLq65h/uil/KAYODE%20MICHAEL%20%2821%29.png?w=400',
    websiteUrl: 'https://www.terumobct.com',
  },
  {
    name: 'Global Medical Partner',
    logoUrl:
      'https://app.milanote.com/media/p/images/1X111Z1oXzD42r/xoX/image.png?w=400',
    websiteUrl: 'https://www.sudabelt.com/products',
  },
  {
    name: 'Clinical Technology Partner',
    logoUrl:
      'https://app.milanote.com/media/p/images/1X10Vd1oXzD42q/dOK/image.png?w=400',
    websiteUrl: 'https://www.sudabelt.com/products',
  },
]

const PartnerSlider: React.FC = () => {
  const marqueeList = [...CHANNEL_PARTNER_LOGOS, ...CHANNEL_PARTNER_LOGOS]

  return (
    <section
      aria-label="Partners"
      className="bg-white border-b border-sudabelt-header-border py-8 sm:py-10"
    >
      <SectionReveal className="sudabelt-container flex flex-col md:flex-row items-center justify-between gap-6 md:gap-10">
        {/* Left Label: PARTNERS */}
        <span className="font-mono text-[13px] font-bold uppercase tracking-[0.14em] text-sudabelt-navy shrink-0">
          PARTNERS
        </span>

        {/* Center Smooth Infinite Logo Slider with Large, Full-Color Partner Logos */}
        <div
          className="relative flex-1 w-full overflow-hidden py-2"
          style={{
            maskImage:
              'linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)',
            WebkitMaskImage:
              'linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)',
          }}
        >
          <motion.div
            className="flex items-center gap-14 sm:gap-20 w-max"
            animate={{ x: ['0%', '-50%'] }}
            transition={{
              duration: 28,
              ease: 'linear',
              repeat: Infinity,
            }}
          >
            {marqueeList.map((partner, index) => (
              <a
                key={`${partner.name}-${index}`}
                href={partner.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                title={`Visit ${partner.name}`}
                className="inline-flex items-center justify-center h-18.5 sm:h-22.5 px-4 rounded-tray bg-white hover:bg-sudabelt-surface transition-all duration-300 shrink-0"
              >
                <img
                  src={partner.logoUrl}
                  alt={partner.name}
                  loading="lazy"
                  className="h-15.5 sm:h-19.5 w-auto max-w-55 object-contain"
                />
              </a>
            ))}
          </motion.div>
        </div>

        {/* Right Link */}
        <Link
          to="/products"
          className="text-[13px] font-bold text-sudabelt-navy hover:text-sudabelt-green transition-colors shrink-0"
        >
          Explore OEM catalog →
        </Link>
      </SectionReveal>
    </section>
  )
}

export default PartnerSlider
