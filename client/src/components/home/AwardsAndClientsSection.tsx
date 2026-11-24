import React from 'react'
import { Link } from 'react-router'
import { motion } from 'framer-motion'
import { HeaderTextReveal, SectionReveal } from '../common/Reveal'

interface AwardItem {
  organization: string
  title: string
  imageUrl: string
}

const AWARDS_LIST: AwardItem[] = [
  {
    organization: 'Nigerian Healthcare Excellence Award',
    title: 'Healthcare Equipment Marketing Company of the Year (2019 Nominee).',
    imageUrl:
      'https://app.milanote.com/media/p/images/1X1qvB1Atzd936/rND/image.png?w=display',
  },
  {
    organization: 'The African Brands',
    title: "Africa's Best Medical Equipment Company Award 2023.",
    imageUrl:
      'https://app.milanote.com/media/p/images/1X1qKY1Atzd93c/Pny/image.png?w=400',
  },
  {
    organization: 'Nigerian Healthcare Excellence Award',
    title: 'Formal recognition from Gov. Babajide Sanwo-Olu of Lagos State.',
    imageUrl:
      'https://app.milanote.com/media/p/images/1X1re41Atzd93f/j2q/image.png?w=display',
  },
]

interface ClientLogoItem {
  name: string
  logoUrl: string
}

const CLIENT_LOGOS: ClientLogoItem[] = [
  {
    name: 'Iwosan Lagoon Hospitals',
    logoUrl: 'https://app.milanote.com/media/p/images/1WPtD31curgbbB/YKr/image.png?w=400',
  },
  {
    name: 'Lagoon Hospitals Hygeia',
    logoUrl: 'https://app.milanote.com/media/p/images/1WPtEH1curgbbC/o3n/image.png?w=400',
  },
  {
    name: 'St. Charles Borromeo Hospital Onitsha',
    logoUrl: 'https://app.milanote.com/media/p/images/1WPtGW1curgbbD/oy8/image.png?w=400',
  },
  {
    name: 'St. Nicholas Hospital',
    logoUrl: 'https://app.milanote.com/media/p/images/1WPtI41curgbbE/sRF/image.png?w=400',
  },
  {
    name: 'Alliance Hospital Abuja',
    logoUrl: 'https://app.milanote.com/media/p/images/1WPtKW1curgbbF/JWD/image.png?w=display',
  },
  {
    name: 'Synlab Nigeria',
    logoUrl: 'https://app.milanote.com/media/p/images/1WPu5X1curgbbR/lmN/image.png?w=400',
  },
  {
    name: 'Clina-Lancet Laboratories',
    logoUrl: 'https://app.milanote.com/media/p/images/1WPu4Y1curgbbQ/C7e/image.png?w=400',
  },
  {
    name: 'Vcare Imaging & Diagnostics Centre',
    logoUrl: 'https://app.milanote.com/media/p/images/1WPtXA1curgbbK/VIi/image.png?w=display',
  },
  {
    name: 'Body Affairs Diagnostics',
    logoUrl: 'https://app.milanote.com/media/p/images/1WPu3T1curgbbP/TTp/image.png?w=display',
  },
  {
    name: 'Celltek Healthcare Medical Centre',
    logoUrl: 'https://app.milanote.com/media/p/images/1WPu761curgbbS/pqM/image.png?w=400',
  },
  {
    name: 'Surjen Healthcare',
    logoUrl: 'https://app.milanote.com/media/p/images/1WPu8c1curgbbT/skd/image.png?w=display',
  },
]

const AwardsAndClientsSection: React.FC = () => {
  const clientMarquee = [...CLIENT_LOGOS, ...CLIENT_LOGOS]

  return (
    <section className="bg-sudabelt-surface py-20 lg:py-24 border-b border-sudabelt-border">
      <div className="sudabelt-container">
        {/* Part 1: 3 Verbatim Milanote Awards */}
        <SectionReveal>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <HeaderTextReveal>
              <div className="w-5.5 h-0.75 bg-sudabelt-red rounded-mark mb-3" />
              <span className="text-eyebrow text-sudabelt-green">AWARDS &amp; RECOGNITIONS</span>
              <h2 className="text-section-heading text-sudabelt-navy mt-2">
                Recognized Excellence in Healthcare Delivery
              </h2>
            </HeaderTextReveal>

            <Link
              to="/resources/newsletters#awards"
              className="h-11 px-5 rounded-control border border-sudabelt-border bg-white hover:border-sudabelt-navy text-sudabelt-navy font-bold text-[12px] tracking-[0.06em] uppercase inline-flex items-center justify-center self-start sm:self-auto transition-colors"
            >
              SEE ALL AWARDS
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {AWARDS_LIST.map((award) => (
              <div
                key={award.title}
                className="group rounded-card bg-white border border-sudabelt-sage hover:border-sudabelt-green hover:-translate-y-1.5 hover:shadow-xl overflow-hidden flex flex-col transition-all duration-300"
              >
                <div className="h-57.5 bg-sudabelt-navy/3 p-5 flex items-center justify-center border-b border-sudabelt-header-border overflow-hidden">
                  <img
                    src={award.imageUrl}
                    alt={award.title}
                    loading="lazy"
                    className="max-h-49 w-auto object-contain rounded-badge group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="font-mono text-[11px] font-bold uppercase tracking-[0.08em] text-sudabelt-green">
                      {award.organization}
                    </span>
                    <h3 className="text-[17px] leading-6 font-bold text-sudabelt-navy group-hover:text-sudabelt-green transition-colors mt-2">
                      {award.title}
                    </h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SectionReveal>

        {/* Part 2: Pronounced Client Logos Slide-Through Carousel */}
        <SectionReveal className="mt-16 pt-12 border-t border-sudabelt-border">
          <HeaderTextReveal className="text-center mb-8">
            <span className="text-eyebrow text-sudabelt-green">OUR CLIENTS</span>
            <h3 className="text-[24px] sm:text-[30px] font-extrabold text-sudabelt-navy mt-2">
              Trusted by leading healthcare institutions
            </h3>
          </HeaderTextReveal>

          <div
            className="relative w-full overflow-hidden py-5"
            style={{
              maskImage:
                'linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)',
              WebkitMaskImage:
                'linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)',
            }}
          >
            <motion.div
              className="flex items-center gap-6 sm:gap-8 w-max px-4"
              animate={{ x: ['0%', '-50%'] }}
              transition={{
                duration: 32,
                ease: 'linear',
                repeat: Infinity,
              }}
            >
              {clientMarquee.map((client, idx) => (
                <div
                  key={`${client.name}-${idx}`}
                  className="h-24 sm:h-28 min-w-47.5 sm:min-w-57.5 px-6 py-3 rounded-2xl bg-white border border-sudabelt-sage shadow-xs inline-flex items-center justify-center shrink-0 hover:border-sudabelt-green transition-colors"
                  title={client.name}
                >
                  <img
                    src={client.logoUrl}
                    alt={client.name}
                    loading="lazy"
                    className="h-18 sm:h-21.5 w-auto max-w-52.5 object-contain"
                  />
                </div>
              ))}
            </motion.div>
          </div>
        </SectionReveal>
      </div>
    </section>
  )
}

export default AwardsAndClientsSection
