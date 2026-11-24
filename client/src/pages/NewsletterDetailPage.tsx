import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router'
import { ArrowLeft, Calendar, Download, FileText, CheckCircle2, Share2 } from 'lucide-react'
import { toast } from 'react-toastify'
import { useArticleDetail, api } from '../api/api'
import PreFooterCTA from '../components/common/PreFooterCTA'

const NewsletterDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()
  const { data: apiData, isLoading, error } = useArticleDetail(slug || '')
  const newsletter = apiData?.data

  const [subscriberEmail, setSubscriberEmail] = useState<string>('')
  const [isSubscribing, setIsSubscribing] = useState<boolean>(false)
  const [subscribedSuccess, setSubscribedSuccess] = useState<boolean>(false)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    if (newsletter?.title) {
      document.title = `${newsletter.title} | Sudabelt Medical Newsletter`
    }
  }, [newsletter?.title])

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: newsletter?.title,
          url: window.location.href,
        })
        .catch(() => {})
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Newsletter link copied to clipboard!')
    }
  }

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!subscriberEmail.trim() || !subscriberEmail.includes('@')) {
      toast.error('Please enter a valid work email.')
      return
    }

    setIsSubscribing(true)
    try {
      const res = await api.subscribeNewsletter({ email: subscriberEmail.trim() })
      toast.success(res.message || 'Subscribed successfully!')
      setSubscribedSuccess(true)
      setSubscriberEmail('')
    } catch {
      toast.error('Failed to subscribe. Please try again.')
    } finally {
      setIsSubscribing(false)
    }
  }

  if (isLoading) {
    return (
      <div className="py-20 sudabelt-container max-w-4xl mx-auto">
        <div className="h-6 w-32 bg-slate-100 rounded animate-pulse mb-6" />
        <div className="h-12 w-3/4 bg-slate-100 rounded animate-pulse mb-6" />
        <div className="h-64 bg-slate-100 rounded-card animate-pulse mb-8" />
        <div className="space-y-4">
          <div className="h-4 bg-slate-100 rounded animate-pulse" />
          <div className="h-4 bg-slate-100 rounded animate-pulse" />
          <div className="h-4 bg-slate-100 rounded animate-pulse w-5/6" />
        </div>
      </div>
    )
  }

  if (error || !newsletter) {
    return (
      <div className="py-20 sudabelt-container max-w-xl mx-auto text-center">
        <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-sudabelt-navy">Newsletter Issue Not Found</h1>
        <p className="text-sm text-sudabelt-muted mt-2">
          The requested newsletter briefing does not exist or has not been published yet.
        </p>
        <div className="mt-6">
          <Link
            to="/resources/newsletters"
            className="h-11 px-6 rounded-control bg-sudabelt-navy text-white text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Newsletters</span>
          </Link>
        </div>
      </div>
    )
  }

  const isHtml = newsletter.content && /<[a-z][\s\S]*>/i.test(newsletter.content)
  const paragraphs = newsletter.content
    ? newsletter.content.split('\n\n').filter(Boolean)
    : [newsletter.summary]

  return (
    <div className="bg-white min-h-screen">
      {/* 1. Header */}
      <section className="bg-sudabelt-navy text-white py-12 sm:py-16">
        <div className="sudabelt-container max-w-4xl mx-auto">
          <Link
            to="/resources/newsletters"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Newsletters</span>
          </Link>

          <div className="flex flex-wrap items-center gap-3 mb-4 font-mono">
            <span className="px-3 py-1 rounded bg-sudabelt-blue/20 text-sudabelt-blue text-xs font-bold uppercase border border-sudabelt-blue/30">
              ISSUE #{newsletter.issueNumber || 1}
            </span>
            {newsletter.quarter && <span className="text-xs text-slate-300">{newsletter.quarter}</span>}
            {newsletter.year && <span className="text-xs text-slate-300">{newsletter.year}</span>}
            {newsletter.publishedDate && (
              <span className="flex items-center gap-1.5 text-xs text-slate-400">
                <Calendar className="w-3.5 h-3.5 text-sudabelt-green" />
                {new Date(newsletter.publishedDate).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight mb-6">
            {newsletter.title}
          </h1>

          <p className="text-base sm:text-lg text-slate-200 leading-relaxed border-l-4 border-sudabelt-blue pl-4 italic">
            {newsletter.summary}
          </p>

          {/* Header Action: Download Newsletter PDF */}
          {newsletter.pdfUrl && (
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href={newsletter.pdfUrl}
                download={`${newsletter.slug}.pdf`}
                target="_blank"
                rel="noopener noreferrer"
                className="h-12 px-6 rounded-control bg-sudabelt-blue hover:bg-white text-sudabelt-navy font-extrabold text-xs uppercase tracking-wider inline-flex items-center gap-2 transition-colors shadow-xs"
              >
                <Download className="w-4 h-4" />
                <span>Download Newsletter (PDF)</span>
              </a>

              <button
                type="button"
                onClick={handleShare}
                className="h-12 px-5 rounded-control bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider inline-flex items-center gap-2 transition-colors border border-white/20 cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                <span>Share Issue</span>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 2. Content & Document Section */}
      <section className="py-12 sm:py-16">
        <div className="sudabelt-container max-w-4xl mx-auto space-y-10">
          {/* Cover Preview Image */}
          {newsletter.coverImage && (
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-sudabelt-muted">
                Newsletter Cover Preview
              </span>
              <div className="rounded-card overflow-hidden shadow-sm aspect-16/9 bg-slate-100 border border-slate-200">
                <img
                  src={newsletter.coverImage}
                  alt={`${newsletter.title} Cover Preview`}
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </div>
          )}

          {/* Downloadable Newsletter Document Box */}
          {newsletter.pdfUrl && (
            <div className="p-6 sm:p-7 rounded-card bg-blue-50/60 border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-sudabelt-navy">
                    Official Newsletter Issue (PDF)
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-0.5 leading-relaxed">
                    Download the complete clinical edition for offline reading, hospital board presentation, or printing.
                  </p>
                </div>
              </div>

              <a
                href={newsletter.pdfUrl}
                download={`${newsletter.slug}.pdf`}
                target="_blank"
                rel="noopener noreferrer"
                className="h-11 px-6 rounded-control bg-sudabelt-blue hover:bg-sudabelt-navy text-white font-extrabold text-xs uppercase tracking-wider inline-flex items-center justify-center gap-2 transition-colors shadow-xs shrink-0 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download PDF</span>
              </a>
            </div>
          )}

          {/* Embedded Newsletter PDF Viewer if available */}
          {newsletter.pdfUrl && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-sudabelt-muted">
                  Interactive Newsletter Reader
                </span>
                <a
                  href={newsletter.pdfUrl}
                  download={`${newsletter.slug}.pdf`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download file directly</span>
                </a>
              </div>
              <div className="w-full h-[650px] rounded-card border border-slate-300 overflow-hidden shadow-sm bg-slate-100">
                <iframe
                  src={`${newsletter.pdfUrl}#toolbar=1`}
                  className="w-full h-full"
                  title={newsletter.title}
                />
              </div>
            </div>
          )}

          {/* Full Briefing Text Content (Formatted via React Quill or Plain Text) */}
          <div className="space-y-3 pt-6 border-t border-sudabelt-border">
            <h3 className="text-lg font-bold text-sudabelt-navy">
              Executive Briefing &amp; Article Digest
            </h3>

            {isHtml ? (
              <div
                className="rich-text-content text-sudabelt-body text-base sm:text-[17px] leading-relaxed"
                dangerouslySetInnerHTML={{ __html: newsletter.content }}
              />
            ) : (
              <div className="rich-text-content text-sudabelt-body text-base sm:text-[17px] leading-relaxed space-y-4">
                {paragraphs.map((p, idx) => (
                  <p key={idx} className="leading-relaxed">
                    {p}
                  </p>
                ))}
              </div>
            )}
          </div>

          {/* Subscription Box Inside Detail */}
          <div className="mt-14 p-8 rounded-card bg-sudabelt-surface border border-sudabelt-border">
            <h3 className="text-lg font-bold text-sudabelt-navy">
              Subscribe to future Sudabelt clinical briefings
            </h3>
            <p className="text-xs sm:text-sm text-sudabelt-body mt-1">
              Receive quarterly equipment maintenance monographs and hospital technology briefs directly in your inbox.
            </p>

            <form onSubmit={handleSubscribe} className="mt-4 flex flex-col sm:flex-row gap-2 max-w-md">
              <input
                type="email"
                value={subscriberEmail}
                onChange={(e) => setSubscriberEmail(e.target.value)}
                placeholder="Enter work email"
                className="flex-1 px-3.5 py-2 bg-white border border-slate-300 rounded-control text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-sudabelt-blue"
              />
              <button
                type="submit"
                disabled={isSubscribing}
                className="px-5 py-2 bg-sudabelt-navy hover:bg-sudabelt-green text-white text-xs font-bold uppercase rounded-control transition-colors cursor-pointer disabled:opacity-50"
              >
                {isSubscribing ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>
            {subscribedSuccess && (
              <p className="text-xs text-sudabelt-green font-semibold mt-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Thank you for subscribing!</span>
              </p>
            )}
          </div>
        </div>
      </section>

      {/* 3. Pre-Footer CTA */}
      <PreFooterCTA
        title="Ready to equip your facility?"
        subtitle="Sudabelt offers turnkey healthcare engineering, renal therapy systems, and clinical application training."
        primaryLabel="REQUEST A QUOTE"
        primaryTo="/rfq"
        secondaryLabel="OUR PORTFOLIO"
        secondaryTo="/products"
        secondaryType="link"
      />
    </div>
  )
}

export default NewsletterDetailPage
