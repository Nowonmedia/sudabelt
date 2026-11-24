import React, { useMemo } from 'react'
import { Link } from 'react-router'
import { ArrowRight, Download } from 'lucide-react'
import { HeaderTextReveal, SectionReveal } from '../common/Reveal'
import { API_BASE_URL, useArticles } from '../../api/api'

interface InsightTeaserCard {
  slug: string
  type: 'blog' | 'newsletter'
  bannerTitle: string
  badgeText: string
  badgeTone: 'navy' | 'green'
  meta: string
  title: string
  excerpt: string
  imageUrl: string
  linkTo: string
}

const LatestNewslettersSection: React.FC = () => {
  const { data: blogData } = useArticles({ type: 'blog' })
  const { data: newsletterData } = useArticles({ type: 'newsletter' })

  const cards: InsightTeaserCard[] = useMemo(() => {
    const blogs = Array.isArray(blogData?.data) ? blogData.data.slice(0, 2) : []
    const newsletters = Array.isArray(newsletterData?.data) ? newsletterData.data.slice(0, 1) : []

    const blogCards: InsightTeaserCard[] = blogs.map((item, idx) => ({
      slug: item.slug,
      type: 'blog',
      bannerTitle: (item.category || 'CLINICAL BLOG').toUpperCase(),
      badgeText: 'Clinical Blog',
      badgeTone: idx % 2 === 0 ? 'navy' : 'green',
      meta: item.publishedDate
        ? new Date(item.publishedDate).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })
        : 'Clinical Article',
      title: item.title,
      excerpt: item.summary,
      imageUrl: item.coverImage || '/images/DSC_4834.JPG.webp',
      linkTo: `/blog/${item.slug}`,
    }))

    const newsletterCards: InsightTeaserCard[] = newsletters.map((item) => ({
      slug: item.slug,
      type: 'newsletter',
      bannerTitle: (item.category || 'NEWSLETTER').toUpperCase(),
      badgeText: 'Newsletter',
      badgeTone: 'green',
      meta: `${item.year || '2026'} • ${item.quarter || 'Latest Issue'}`,
      title: item.title,
      excerpt: item.summary,
      imageUrl: item.coverImage || '/images/IMG_6057.webp',
      linkTo: item.pdfUrl || `${API_BASE_URL}/articles/${encodeURIComponent(item.slug)}/pdf`,
    }))

    return [...blogCards, ...newsletterCards]
  }, [blogData, newsletterData])

  // If neither blogs nor newsletters are published in DB, hide the section
  if (cards.length === 0) {
    return null
  }

  return (
    <section className="bg-white py-20 lg:py-24">
      <SectionReveal className="sudabelt-container">
        {/* Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <HeaderTextReveal>
            <div className="w-5.5 h-0.75 bg-sudabelt-red rounded-mark mb-3" />
            <span className="text-eyebrow text-sudabelt-green">CLINICAL INSIGHTS</span>
            <h2 className="text-section-heading text-sudabelt-navy mt-2">
              Latest From Our Insights
            </h2>
          </HeaderTextReveal>

          <Link
            to="/blog"
            className="h-11 px-5 rounded-control border border-sudabelt-border hover:border-sudabelt-navy text-sudabelt-navy font-bold text-[12px] tracking-[0.06em] uppercase inline-flex items-center justify-center self-start sm:self-auto transition-colors"
          >
            EXPLORE ALL INSIGHTS
          </Link>
        </div>

        {/* 3 Insight Cards Grid (2 Latest Blogs + 1 Latest Newsletter) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card) => {
            const innerContent = (
              <>
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
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="font-mono text-[11px] text-sudabelt-muted uppercase tracking-[0.04em]">
                      {card.meta}
                    </div>
                    <h3 className="text-[18.5px] leading-[24.5px] font-bold text-sudabelt-navy group-hover:text-sudabelt-green transition-colors mt-2">
                      {card.title}
                    </h3>
                    <p className="text-[14px] leading-5.5 text-sudabelt-body mt-2.5 line-clamp-3">
                      {card.excerpt}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-sudabelt-border/60 inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-sudabelt-green">
                    {card.type === 'newsletter' ? (
                      <>
                        <Download className="w-3.5 h-3.5" />
                        <span>Download Newsletter PDF</span>
                      </>
                    ) : (
                      <>
                        <span>Read Article</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </div>
                </div>
              </>
            )

            return card.type === 'newsletter' ? (
              <a
                key={card.slug}
                href={card.linkTo}
                download={`${card.slug}.pdf`}
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-card border border-sudabelt-border hover:border-sudabelt-sage bg-white overflow-hidden flex flex-col transition-all"
              >
                {innerContent}
              </a>
            ) : (
              <Link
                key={card.slug}
                to={card.linkTo}
                className="group rounded-card border border-sudabelt-border hover:border-sudabelt-sage bg-white overflow-hidden flex flex-col transition-all"
              >
                {innerContent}
              </Link>
            )
          })}
        </div>
      </SectionReveal>
    </section>
  )
}

export default LatestNewslettersSection
