import React, { useState, useMemo, useRef, useEffect } from 'react'
import { Link, useLocation } from 'react-router'
import { motion, useScroll, useSpring, useTransform } from 'framer-motion'
import { Mail, Calendar, Download, CheckCircle2, Award } from 'lucide-react'
import { toast } from 'react-toastify'
import { HeaderTextReveal, SectionReveal } from '../components/common/Reveal'
import PreFooterCTA from '../components/common/PreFooterCTA'
import LeadMagnetModal from '../components/common/LeadMagnetModal'
import { API_BASE_URL, useArticles, api, type ApiArticle } from '../api/api'
import { getEmailValidationError } from '../utils/validation'

const SUDABELT_AWARDS = [
  {
    organization: 'Nigerian Healthcare Excellence Award',
    title: 'Healthcare Equipment Marketing Company of the Year (2019 Nominee)',
    image: 'https://app.milanote.com/media/p/images/1X1qvB1Atzd936/rND/image.png?w=display',
  },
  {
    organization: 'Terumo BCT',
    title: 'Best Partner in Africa Award 2020',
    image: 'https://app.milanote.com/media/p/images/1X1qAc1Atzd939/Tso/image.png?w=display',
  },
  {
    organization: 'The African Brands',
    title: "Africa's Best Medical Equipment Company Award 2023",
    description:
      'Received from the African Brands Congress, for our exemplary work as an outstanding African medical equipment marketing brand.',
    image: 'https://app.milanote.com/media/p/images/1X1qKY1Atzd93c/Pny/image.png?w=400',
  },
  {
    organization: 'Nigerian Healthcare Excellence Award',
    title: 'Formal Recognition from Gov. Babajide Sanwo-Olu of Lagos State',
    image: 'https://app.milanote.com/media/p/images/1X1re41Atzd93f/j2q/image.png?w=display',
  },
  {
    organization: 'African Brand Leadership Merit Awards',
    title: "Africa's Best World Class Medical Equipment Company of the Year 2023",
    image: 'https://app.milanote.com/media/p/images/1X1rgU1Atzd93h/1VX/image.png?w=400',
  },
  {
    organization: 'Global Quality Excellence',
    title: 'Global Most Outstanding Medical Equipment Company of the Year 2023',
    image: 'https://app.milanote.com/media/p/images/1X1rlP1Atzd93j/Rli/image.png?w=400',
  },
]

const ScrollClosingBookMockup: React.FC<{ newsletter: ApiArticle }> = ({ newsletter }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    // Start opening slightly before the book enters the viewport completely,
    // and finish opening while the book is still centered in view.
    offset: ['start 110%', 'center 55%'],
  })

  // Spring smoothing removes mouse-wheel step jitter for a fluid physical book turn
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 70,
    damping: 22,
    mass: 0.45,
  })

  // Book starts closed (0deg) and smoothly opens (-162deg) to reveal the Table of Contents page
  const coverRotateY = useTransform(smoothProgress, [0.05, 0.92], [0, -162])
  const spreadShiftX = useTransform(smoothProgress, [0.05, 0.92], [0, 34])
  const coverImageOpacity = useTransform(smoothProgress, [0, 0.5], [1, 1])

  return (
    <div ref={containerRef} className="lg:col-span-5 flex items-center justify-center py-4">
      <div
        className="relative w-full max-w-[260px] sm:max-w-[285px] aspect-3/4"
        style={{ perspective: '1400px' }}
      >
        <motion.div
          style={{ x: spreadShiftX, transformStyle: 'preserve-3d' }}
          className="relative w-full h-full"
        >
          {/* Right Inner Page (Table of Contents Page visible while book is open) */}
          <div className="absolute inset-0 rounded-r-md rounded-l-xs bg-[#fdfcf8] text-sudabelt-navy shadow-2xl overflow-hidden flex flex-col justify-between">
            {/* Subtle page-edge stack */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-4 bg-linear-to-r from-slate-300/60 to-transparent z-10" />
            {newsletter.galleryImages && newsletter.galleryImages[0] ? (
              <img
                src={newsletter.galleryImages[0]}
                alt={`${newsletter.title} Table of Contents`}
                className="w-full h-full object-contain bg-white"
              />
            ) : (
              <div className="p-4 sm:p-5 pl-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-sudabelt-navy/15 pb-2 mb-3">
                    <div>
                      <div className="text-[9px] font-mono font-bold uppercase tracking-[0.16em] text-sudabelt-green">
                        Table of Contents
                      </div>
                      <h4 className="text-xs font-extrabold text-sudabelt-navy leading-tight line-clamp-1 mt-0.5">
                        {newsletter.title}
                      </h4>
                    </div>
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-sudabelt-navy text-white shrink-0">
                      #{newsletter.issueNumber || 13}
                    </span>
                  </div>

                  <ol className="space-y-2 text-[10.5px]">
                    {[
                      { num: '01', label: 'Editorial & Leadership Note', page: '02' },
                      { num: '02', label: 'Clinical Feature & Spotlight', page: '04' },
                      { num: '03', label: 'OEM Technology & Diagnostics', page: '07' },
                      { num: '04', label: 'Turnkey Installations Update', page: '10' },
                      { num: '05', label: 'Biomedical & Training Hub', page: '13' },
                    ].map((row) => (
                      <li
                        key={row.num}
                        className="flex items-baseline justify-between gap-1.5 border-b border-dotted border-slate-300 pb-1"
                      >
                        <div className="flex items-baseline gap-1.5 min-w-0">
                          <span className="font-mono font-bold text-sudabelt-green text-[9.5px]">
                            {row.num}
                          </span>
                          <span className="font-semibold text-sudabelt-navy truncate">
                            {row.label}
                          </span>
                        </div>
                        <span className="font-mono text-[9.5px] text-sudabelt-muted shrink-0">
                          {row.page}
                        </span>
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[9.5px] font-mono text-sudabelt-muted">
                  <span>{newsletter.summary || 'The Inner Circle'}</span>
                  <span>{newsletter.year || new Date().getFullYear()}</span>
                </div>
              </div>
            )}
          </div>

          {/* Hinged Front Cover (Rotates from open -160deg to closed 0deg on scroll) */}
          <motion.div
            style={{
              rotateY: coverRotateY,
              transformOrigin: 'left center',
              transformStyle: 'preserve-3d',
            }}
            className="absolute inset-0 rounded-r-md rounded-l-xs shadow-2xl"
          >
            {/* Front Face: Full Newsletter Cover Image */}
            <div
              className="absolute inset-0 rounded-r-md rounded-l-xs bg-white overflow-hidden"
              style={{ backfaceVisibility: 'hidden' }}
            >
              <motion.img
                style={{ opacity: coverImageOpacity }}
                src={newsletter.coverImage || '/images/IMG_6057.webp'}
                alt={newsletter.title}
                className="w-full h-full object-contain object-center bg-white"
                onError={(e) => {
                  e.currentTarget.src = '/images/IMG_6057.webp'
                }}
              />
              {/* Book Spine Shading */}
              <div className="pointer-events-none absolute inset-y-0 left-0 w-4 bg-linear-to-r from-black/25 via-black/10 to-transparent" />
              <div className="pointer-events-none absolute inset-y-0 left-3.5 w-px bg-white/30" />
            </div>

            {/* Inner Left Face (Inside Front Cover visible when book is open) */}
            <div
              className="absolute inset-0 rounded-l-md rounded-r-xs bg-[#f4f1ea] p-5 flex flex-col justify-between shadow-inner"
              style={{
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
              }}
            >
              <div className="pointer-events-none absolute inset-y-0 right-0 w-5 bg-linear-to-l from-black/15 to-transparent" />
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-sudabelt-blue">
                  The Inner Circle
                </span>
                <p className="text-[11px] text-sudabelt-navy/80 font-medium mt-2 leading-relaxed">
                  Quarterly clinical insights, biomedical engineering briefs, and hospital infrastructure updates.
                </p>
              </div>
              <div className="text-[10px] font-mono text-sudabelt-muted">
                Scroll to close cover
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

const NewslettersPage: React.FC = () => {
  const location = useLocation()
  const { data: apiData, isLoading } = useArticles({ type: 'newsletter' })

  useEffect(() => {
    if (location.hash === '#awards') {
      const el = document.getElementById('awards')
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 150)
      }
    }
  }, [location.hash])
  const [subscriberEmail, setSubscriberEmail] = useState<string>('')
  const [isSubscribing, setIsSubscribing] = useState<boolean>(false)
  const [subscribedSuccess, setSubscribedSuccess] = useState<boolean>(false)
  const [visibleArchiveCount, setVisibleArchiveCount] = useState<number>(2)
  const [activeLeadNewsletter, setActiveLeadNewsletter] = useState<ApiArticle | null>(null)

  const allNewsletters: ApiArticle[] = useMemo(() => {
    if (apiData && Array.isArray(apiData.data)) {
      return apiData.data
    }
    return []
  }, [apiData])

  // Most recent newsletter is featured
  const featuredNewsletter = useMemo(() => {
    return allNewsletters.length > 0 ? allNewsletters[0] : null
  }, [allNewsletters])

  // Remaining newsletters in archive
  const archiveNewsletters = useMemo(() => {
    return allNewsletters.slice(1)
  }, [allNewsletters])

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    const emailError = getEmailValidationError(subscriberEmail)
    if (emailError) {
      toast.error(emailError)
      return
    }

    setIsSubscribing(true)
    try {
      const res = await api.subscribeNewsletter({ email: subscriberEmail.trim() })
      toast.success(res.message || 'Subscribed successfully to Sudabelt newsletter!')
      setSubscribedSuccess(true)
      setSubscriberEmail('')
    } catch {
      toast.error('Unable to complete subscription. Please try again.')
    } finally {
      setIsSubscribing(false)
    }
  }

  return (
    <div className="w-full flex flex-col bg-white">
      {/* 1. Page Header */}
      <section className="bg-sudabelt-surface border-b border-sudabelt-border py-14 sm:py-20">
        <div className="sudabelt-container">
          <SectionReveal>
            <div className="flex items-center gap-3 mb-3">
              <span className="w-7 h-0.75 bg-sudabelt-red rounded-xs" />
              <span className="inline-block px-3.5 py-1 rounded-control bg-sudabelt-blue text-white text-[11px] sm:text-[12px] font-extrabold uppercase tracking-[0.14em] shadow-sm">
                CLINICAL BRIEFINGS &amp; MONOGRAPHS
              </span>
            </div>
            <HeaderTextReveal className="mt-2 mb-3">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-sudabelt-navy tracking-tight">
                Sudabelt Medical Newsletter Archive
              </h1>
            </HeaderTextReveal>
            <p className="text-sudabelt-body text-base sm:text-lg max-w-2xl leading-relaxed">
              Quarterly clinical briefings, equipment maintenance reports, and biomedical technology monographs delivered directly to hospital executives and medical directors. Available for client-side reading and direct PDF download.
            </p>

            {/* Newsletter Subscription Bar */}
            <form onSubmit={handleSubscribe} className="mt-8 max-w-md flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                value={subscriberEmail}
                onChange={(e) => setSubscriberEmail(e.target.value)}
                placeholder="Enter your hospital work email"
                className="flex-1 px-4 py-3 bg-white border border-slate-300 rounded-control text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-sudabelt-blue"
              />
              <button
                type="submit"
                disabled={isSubscribing}
                className="px-6 py-3 bg-sudabelt-navy hover:bg-sudabelt-green text-white font-extrabold text-xs uppercase tracking-wider rounded-control transition-colors shadow-xs shrink-0 cursor-pointer disabled:opacity-50"
              >
                {isSubscribing ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>
            {subscribedSuccess && (
              <p className="text-xs text-sudabelt-green font-semibold mt-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>You are subscribed to future Sudabelt clinical briefings.</span>
              </p>
            )}
          </SectionReveal>
        </div>
      </section>

      {/* 2. Loading State */}
      {isLoading && (
        <section className="py-16 sudabelt-container">
          <div className="h-80 rounded-card bg-slate-100 animate-pulse mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-48 rounded-card bg-slate-100 animate-pulse" />
            <div className="h-48 rounded-card bg-slate-100 animate-pulse" />
            <div className="h-48 rounded-card bg-slate-100 animate-pulse" />
          </div>
        </section>
      )}

      {!isLoading && (
        <>
          {/* 3. Empty State: No newsletters in DB yet */}
          {allNewsletters.length === 0 ? (
            <section className="py-20 sudabelt-container">
              <div className="max-w-xl mx-auto text-center p-10 border border-dashed border-sudabelt-border rounded-card bg-sudabelt-surface">
                <Mail className="w-12 h-12 text-sudabelt-muted mx-auto mb-4" />
                <h2 className="text-xl font-bold text-sudabelt-navy">No Newsletter Issues Published Yet</h2>
                <p className="text-sm text-sudabelt-body mt-2 leading-relaxed">
                  Clinical briefings, quarterly newsletters, and downloadable PDF editions from our medical team will appear here soon.
                </p>
                <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                  <Link
                    to="/blog"
                    className="h-11 px-6 rounded-control bg-sudabelt-navy hover:bg-sudabelt-green text-white text-xs font-bold uppercase tracking-wider inline-flex items-center transition-colors"
                  >
                    Browse Clinical Blog
                  </Link>
                  <Link
                    to="/products"
                    className="h-11 px-6 rounded-control border border-sudabelt-border text-sudabelt-navy text-xs font-bold uppercase tracking-wider inline-flex items-center hover:bg-white transition-colors"
                  >
                    Browse Equipment
                  </Link>
                </div>
              </div>
            </section>
          ) : (
            <div className="sudabelt-container py-12 sm:py-16">
              {/* 4. Featured Newsletter (Most Recent in DB) */}
              {featuredNewsletter && (
                <SectionReveal className="mb-14 sm:mb-20">
                  <div className="text-[12px] font-bold uppercase tracking-[0.14em] text-sudabelt-green mb-3">
                    Latest Issue
                  </div>
                  <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center bg-sudabelt-navy text-white rounded-card p-6 sm:p-8 lg:p-10 shadow-card">
                    {/* 3D Scroll-Closing Book Mockup */}
                    <ScrollClosingBookMockup newsletter={featuredNewsletter} />

                    {/* Content & Direct Download */}
                    <div className="lg:col-span-7 flex flex-col justify-center">
                      <div className="flex flex-wrap items-center gap-3 text-xs text-sudabelt-blue mb-3 font-mono font-bold">
                        <span className="px-2.5 py-0.5 rounded bg-sudabelt-blue/20 border border-sudabelt-blue/30 text-white">
                          ISSUE #{featuredNewsletter.issueNumber || 1}
                        </span>
                        {featuredNewsletter.quarter && <span>{featuredNewsletter.quarter}</span>}
                        {featuredNewsletter.year && <span>{featuredNewsletter.year}</span>}
                        {featuredNewsletter.publishedDate && (
                          <span className="text-slate-400">
                            • {new Date(featuredNewsletter.publishedDate).toLocaleDateString('en-GB', {
                              month: 'short',
                              year: 'numeric',
                            })}
                          </span>
                        )}
                      </div>

                      <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight tracking-tight mb-4">
                        {featuredNewsletter.title}
                      </h2>

                      <p className="text-slate-300 text-sm sm:text-base leading-relaxed line-clamp-3 mb-6">
                        {featuredNewsletter.summary}
                      </p>

                      <div className="flex flex-wrap items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setActiveLeadNewsletter(featuredNewsletter)}
                          className="h-11 px-6 rounded-control bg-sudabelt-blue hover:bg-sudabelt-green text-sudabelt-navy hover:text-white font-extrabold text-xs uppercase tracking-wider inline-flex items-center gap-2 transition-colors shadow-xs cursor-pointer"
                        >
                          <Download className="w-4 h-4" />
                          <span>Download Newsletter PDF</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </SectionReveal>
              )}

              {/* 5. Archive Section (Remaining Issues) */}
              {archiveNewsletters.length > 0 && (
                <div>
                  <div className="flex items-center justify-between pb-4 mb-6 border-b border-sudabelt-border">
                    <h2 className="text-xl sm:text-2xl font-extrabold text-sudabelt-navy">
                      Past Briefings &amp; Issues
                    </h2>
                    <span className="text-xs text-sudabelt-muted font-bold font-mono">
                      {archiveNewsletters.length} ARCHIVED
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto">
                    {archiveNewsletters.slice(0, visibleArchiveCount).map((newsletter, idx) => (
                      <SectionReveal key={newsletter._id || newsletter.slug} direction="up" delay={0.05 * (idx % 6 + 1)}>
                        <div className="h-full bg-white rounded-card overflow-hidden flex flex-col justify-between shadow-card hover:shadow-xl transition-all duration-300 group">
                          <div>
                            {/* Book Mockup Preview on Archive Card */}
                            <div className="relative bg-slate-50 py-6 px-6 flex items-center justify-center">
                              <div className="relative w-44 aspect-3/4">
                                <div className="absolute top-1.5 -right-2 bottom-1.5 left-2 rounded-r-md bg-slate-300/80 shadow-sm" />
                                <div className="relative w-full h-full rounded-r-md rounded-l-xs bg-white overflow-hidden shadow-lg group-hover:-translate-y-1 transition-transform duration-500">
                                  <img
                                    src={newsletter.coverImage || '/images/IMG_6057.webp'}
                                    alt={newsletter.title}
                                    className="w-full h-full object-contain bg-white"
                                    onError={(e) => {
                                      e.currentTarget.src = '/images/IMG_6057.webp'
                                    }}
                                  />
                                  <div className="pointer-events-none absolute inset-y-0 left-0 w-3 bg-linear-to-r from-black/20 via-black/5 to-transparent" />
                                </div>
                              </div>
                              <div className="absolute top-3 left-3">
                                <span className="px-2.5 py-0.5 rounded-control bg-sudabelt-navy/90 text-white text-[11px] font-mono font-bold">
                                  ISSUE #{newsletter.issueNumber || idx + 1}
                                </span>
                              </div>
                            </div>

                            <div className="p-6">
                              <div className="flex items-center gap-1.5 text-xs text-sudabelt-muted mb-2">
                                <Calendar className="w-3.5 h-3.5 text-sudabelt-green" />
                                <span>
                                  {newsletter.publishedDate
                                    ? new Date(newsletter.publishedDate).toLocaleDateString('en-GB', {
                                        month: 'short',
                                        year: 'numeric',
                                      })
                                    : `${newsletter.quarter || ''} ${newsletter.year || ''}`}
                                </span>
                              </div>

                              <h3 className="text-base sm:text-lg font-bold text-sudabelt-navy group-hover:text-sudabelt-green transition-colors leading-snug line-clamp-2">
                                {newsletter.title}
                              </h3>

                              <p className="text-xs sm:text-sm text-sudabelt-body mt-2.5 leading-relaxed line-clamp-3">
                                {newsletter.summary}
                              </p>
                            </div>
                          </div>

                          {/* Card Footer: Gated Lead Magnet Download */}
                          <div className="px-6 pb-6 pt-2 border-t border-sudabelt-border/60 flex items-center justify-between">
                            <button
                              type="button"
                              onClick={() => setActiveLeadNewsletter(newsletter)}
                              className="w-full h-10 px-4 rounded-control bg-sudabelt-navy hover:bg-sudabelt-green text-white text-xs font-extrabold uppercase tracking-wider inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>Download Newsletter PDF</span>
                            </button>
                          </div>
                        </div>
                      </SectionReveal>
                    ))}
                  </div>

                  {visibleArchiveCount < archiveNewsletters.length && (
                    <div className="mt-10 text-center">
                      <button
                        type="button"
                        onClick={() => setVisibleArchiveCount((prev) => prev + 2)}
                        className="h-11 px-8 rounded-control bg-sudabelt-navy hover:bg-sudabelt-green text-white text-xs font-extrabold uppercase tracking-wider transition-colors cursor-pointer shadow-xs"
                      >
                        Load More Newsletters
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* 6. Awards & Recognition Section */}
      <section id="awards" className="py-16 sm:py-20 bg-slate-50 border-t border-sudabelt-border scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionReveal direction="up">
            <div className="max-w-2xl mb-10 sm:mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sudabelt-blue/10 text-sudabelt-navy text-xs font-bold uppercase tracking-wider mb-3">
                <Award className="w-3.5 h-3.5 text-sudabelt-blue" />
                <span>Industry Recognition</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-sudabelt-navy tracking-tight">
                Awards &amp; Recognition
              </h2>
              <p className="text-sm sm:text-base text-sudabelt-body mt-2">
                Honors and distinctions recognizing Sudabelt Medical&apos;s commitment to clinical excellence across Africa.
              </p>
            </div>
          </SectionReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {SUDABELT_AWARDS.map((award, idx) => (
              <SectionReveal key={award.title} direction="up" delay={0.05 * (idx + 1)}>
                <div className="h-full bg-white rounded-card p-6 border border-sudabelt-border shadow-xs hover:border-sudabelt-green hover:shadow-card transition-all duration-300 flex flex-col">
                  <div className="h-44 w-full rounded-xl bg-slate-50 flex items-center justify-center p-4 mb-5 overflow-hidden">
                    <img
                      src={award.image}
                      alt={award.title}
                      className="max-h-full max-w-full object-contain"
                      loading="lazy"
                    />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-sudabelt-blue mb-1.5">
                    {award.organization}
                  </span>
                  <h3 className="text-base font-bold text-sudabelt-navy leading-snug">
                    {award.title}
                  </h3>
                  {award.description && (
                    <p className="text-xs sm:text-sm text-sudabelt-body mt-2 leading-relaxed">
                      {award.description}
                    </p>
                  )}
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Pre-Footer CTA */}
      <PreFooterCTA
        title="Equipping and modernizing healthcare institutions"
        subtitle="Sudabelt delivers full turnkey equipment, clinical application specialists, and genuine consumables across West Africa."
        primaryLabel="REQUEST A QUOTE"
        primaryTo="/rfq"
        secondaryLabel="OUR SERVICES"
        secondaryTo="/services/turnkey"
        secondaryType="link"
      />

      {/* Lead Magnet Modal for Newsletter Downloads */}
      {activeLeadNewsletter && (
        <LeadMagnetModal
          isOpen={Boolean(activeLeadNewsletter)}
          onClose={() => setActiveLeadNewsletter(null)}
          assetTitle={activeLeadNewsletter.title}
          assetSlug={activeLeadNewsletter.slug}
          directDownloadUrl={
            activeLeadNewsletter.pdfUrl ||
            `${API_BASE_URL}/articles/${encodeURIComponent(activeLeadNewsletter.slug)}/pdf`
          }
          description="Please provide your contact information to immediately download this Sudabelt Medical newsletter edition."
          buttonLabel="Download Newsletter PDF"
          leadSource={`Newsletter: ${activeLeadNewsletter.title}`}
        />
      )}
    </div>
  )
}

export default NewslettersPage
