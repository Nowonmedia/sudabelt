import React from 'react'
import { Link } from 'react-router'
import { HeaderTextReveal, SectionReveal } from '../common/Reveal'

interface NewsletterTeaserCard {
  slug: string
  bannerTitle: string
  badgeText: string
  badgeTone: 'navy' | 'green'
  meta: string
  title: string
  excerpt: string
  imageUrl: string
}

const NEWSLETTER_CARDS: NewsletterTeaserCard[] = [
  {
    slug: 'mirasol-prt-blood-safety-advances',
    bannerTitle: 'BLOOD SAFETY',
    badgeText: 'Blood Safety & Hematology',
    badgeTone: 'navy',
    meta: '2026 • Q1 • 6 MIN READ',
    title: 'Mirasol PRT and the next chapter of blood safety',
    excerpt:
      'How pathogen reduction technology protects transfusion recipients in Nigerian blood banks.',
    imageUrl:
      'https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&w=800&q=80',
  },
  {
    slug: 'standardizing-dialysis-hygiene-cleancart-c',
    bannerTitle: 'RENAL CARE',
    badgeText: 'Renal Care',
    badgeTone: 'green',
    meta: '2025 • Q4 • 5 MIN READ',
    title: 'Biofeedback dialysis in practice',
    excerpt:
      'What real-time conductivity and ultrafiltration control changes during chronic dialysis.',
    imageUrl:
      'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80',
  },
  {
    slug: 'oxygen-infrastructure-lessons-from-gbagada',
    bannerTitle: 'INFRASTRUCTURE',
    badgeText: 'Hospital Infrastructure',
    badgeTone: 'navy',
    meta: '2025 • Q3 • 7 MIN READ',
    title: 'Oxygen infrastructure: lessons from Gbagada',
    excerpt:
      'Planning, manifold engineering and maintenance behind hospital-grade oxygen generation.',
    imageUrl:
      'https://images.unsplash.com/photo-1584982751601-97dcc096659c?auto=format&fit=crop&w=800&q=80',
  },
]

const LatestNewslettersSection: React.FC = () => {
  return (
    <section className="bg-white py-20 lg:py-24">
      <SectionReveal className="sudabelt-container">
        {/* Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <HeaderTextReveal>
            <div className="w-5.5 h-0.75 bg-sudabelt-red rounded-mark mb-3" />
            <span className="text-eyebrow text-sudabelt-green">CLINICAL INSIGHTS</span>
            <h2 className="text-section-heading text-sudabelt-navy mt-2">
              Latest from the newsletter
            </h2>
          </HeaderTextReveal>

          <Link
            to="/resources/newsletters"
            className="h-11 px-5 rounded-control border border-sudabelt-border hover:border-sudabelt-navy text-sudabelt-navy font-bold text-[12px] tracking-[0.06em] uppercase inline-flex items-center justify-center self-start sm:self-auto transition-colors"
          >
            VIEW ALL ARCHIVE
          </Link>
        </div>

        {/* 3 Newsletter Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {NEWSLETTER_CARDS.map((card) => (
            <Link
              key={card.slug}
              to={`/resources/newsletters/${card.slug}`}
              className="group rounded-card border border-sudabelt-border hover:border-sudabelt-sage bg-white overflow-hidden flex flex-col transition-all"
            >
              {/* Top Image Banner */}
              <div className="relative h-49 bg-sudabelt-navy overflow-hidden p-5 flex flex-col justify-between">
                <img
                  src={card.imageUrl}
                  alt={card.title}
                  loading="lazy"
                  width={600}
                  height={360}
                  className="absolute inset-0 w-full h-full object-cover object-center opacity-55 group-hover:scale-105 transition-transform duration-500"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      'linear-gradient(180deg, rgba(0,17,66,0.65) 0%, rgba(0,17,66,0.35) 50%, rgba(0,17,66,0.82) 100%)',
                  }}
                />

                {/* Top-Left Red Highlight Bar + Uppercase Topic Label */}
                <div className="relative z-10">
                  <div className="w-4.5 h-0.5 bg-sudabelt-red rounded-mark mb-2" />
                  <span className="text-[15px] font-extrabold uppercase tracking-[0.04em] text-white">
                    {card.bannerTitle}
                  </span>
                </div>

                {/* Bottom-Left Category Badge */}
                <div className="relative z-10">
                  <span
                    className={`inline-block px-3 py-1 rounded-control text-[11px] font-bold text-white ${
                      card.badgeTone === 'green' ? 'bg-sudabelt-green' : 'bg-sudabelt-navy'
                    }`}
                  >
                    {card.badgeText}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col">
                <div className="font-mono text-[11px] text-sudabelt-muted uppercase tracking-[0.04em]">
                  {card.meta}
                </div>
                <h3 className="text-[18.5px] leading-[24.5px] font-bold text-sudabelt-navy group-hover:text-sudabelt-green transition-colors mt-2">
                  {card.title}
                </h3>
                <p className="text-[14px] leading-5.5 text-sudabelt-body mt-2.5">
                  {card.excerpt}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </SectionReveal>
    </section>
  )
}

export default LatestNewslettersSection
