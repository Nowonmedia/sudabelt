import React, { useEffect, useMemo, useState } from 'react'
import { useParams, Link } from 'react-router'
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Clock,
  Share2,
  Tag,
  BookOpen,
  User,
  Images,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { toast } from 'react-toastify'
import { useArticleDetail, useArticles } from '../api/api'
import PreFooterCTA from '../components/common/PreFooterCTA'

const BlogDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()
  const { data: apiData, isLoading, error } = useArticleDetail(slug || '')
  const { data: allBlogsData } = useArticles({ type: 'blog' })
  const article = apiData?.data

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setLightboxIndex(null)
    if (article?.title) {
      document.title = `${article.title} | Sudabelt Medical Blog`
    }
  }, [slug, article?.title])

  // Gallery images below the article
  const galleryImages = useMemo(() => {
    if (!article?.galleryImages || !Array.isArray(article.galleryImages)) return []
    return article.galleryImages.filter(
      (img) => Boolean(img) && !img.includes('lh5.googleusercontent.com')
    )
  }, [article?.galleryImages])

  // All viewable images in lightbox (cover + gallery)
  const allLightboxImages = useMemo(() => {
    const list: string[] = []
    if (article?.coverImage) list.push(article.coverImage)
    galleryImages.forEach((img) => {
      if (!list.includes(img)) list.push(img)
    })
    return list
  }, [article?.coverImage, galleryImages])

  // Related articles
  const relatedBlogs = useMemo(() => {
    if (!allBlogsData?.data || !article) return []
    return allBlogsData.data
      .filter((b) => b.slug !== article.slug)
      .slice(0, 3)
  }, [allBlogsData?.data, article])

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: article?.title,
          url: window.location.href,
        })
        .catch(() => {})
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Article link copied to clipboard!')
    }
  }

  if (isLoading) {
    return (
      <div className="py-20 sudabelt-container max-w-4xl mx-auto">
        <div className="h-6 w-32 bg-slate-100 rounded animate-pulse mb-6" />
        <div className="h-12 w-3/4 bg-slate-100 rounded animate-pulse mb-6" />
        <div className="h-80 bg-slate-100 rounded-card animate-pulse mb-8" />
        <div className="space-y-4">
          <div className="h-4 bg-slate-100 rounded animate-pulse" />
          <div className="h-4 bg-slate-100 rounded animate-pulse" />
          <div className="h-4 bg-slate-100 rounded animate-pulse w-5/6" />
        </div>
      </div>
    )
  }

  if (error || !article) {
    return (
      <div className="py-20 sudabelt-container max-w-xl mx-auto text-center">
        <BookOpen className="w-12 h-12 text-slate-400 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-sudabelt-navy">Article Not Found</h1>
        <p className="text-sm text-sudabelt-muted mt-2">
          The requested clinical monograph or article is either unpublished or does not exist.
        </p>
        <div className="mt-6">
          <Link
            to="/blog"
            className="h-11 px-6 rounded-control bg-sudabelt-navy hover:bg-sudabelt-green text-white text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Articles</span>
          </Link>
        </div>
      </div>
    )
  }

  const paragraphs = article.content
    ? article.content.split('\n\n').filter(Boolean)
    : [article.summary]

  return (
    <div className="bg-white min-h-screen">
      {/* 1. Header & Navigation */}
      <section className="bg-sudabelt-surface border-b border-sudabelt-border py-10 sm:py-14">
        <div className="sudabelt-container max-w-4xl mx-auto">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sudabelt-navy hover:text-sudabelt-green transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to posts</span>
          </Link>

          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="px-3 py-1 rounded-control bg-sudabelt-navy text-white text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5">
              <Tag className="w-3 h-3" />
              {article.category}
            </span>

            <span className="flex items-center gap-1.5 text-xs text-sudabelt-muted font-medium">
              <Clock className="w-3.5 h-3.5 text-sudabelt-blue" />
              {article.readTimeMinutes || 7} Minute Read
            </span>

            {article.publishedDate && (
              <>
                <span className="text-xs text-sudabelt-muted">•</span>
                <span className="flex items-center gap-1.5 text-xs text-sudabelt-muted font-medium">
                  <Calendar className="w-3.5 h-3.5 text-sudabelt-green" />
                  {new Date(article.publishedDate).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </>
            )}

            {article.author && (
              <>
                <span className="text-xs text-sudabelt-muted">•</span>
                <span className="flex items-center gap-1.5 text-xs text-sudabelt-navy font-semibold">
                  <User className="w-3.5 h-3.5 text-sudabelt-green" />
                  Published by {article.author}
                </span>
              </>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-extrabold text-sudabelt-navy tracking-tight leading-[1.18]">
            {article.title}
          </h1>
        </div>
      </section>

      {/* 2. Cover Photo, Rich Body Content & Photo Gallery */}
      <section className="py-10 sm:py-14">
        <div className="sudabelt-container max-w-4xl mx-auto">
          {article.coverImage && (
            <div
              onClick={() => setLightboxIndex(0)}
              className="rounded-card overflow-hidden shadow-sm mb-10 bg-slate-100 border border-sudabelt-border cursor-pointer group relative"
            >
              <img
                src={article.coverImage}
                alt={article.title}
                className="w-full max-h-[540px] object-cover object-center group-hover:scale-[1.01] transition-transform duration-300"
              />
            </div>
          )}

          {/* Article Body Content */}
          {article.content && /<[a-z][\s\S]*>/i.test(article.content) ? (
            <div
              className="rich-text-content text-sudabelt-body text-base sm:text-[17px] leading-[1.75] space-y-4 [&_p]:mb-4 [&_h2]:text-xl [&_h2]:sm:text-2xl [&_h2]:font-extrabold [&_h2]:text-sudabelt-navy [&_h2]:mt-8 [&_h2]:mb-3 [&_h3]:text-lg [&_h3]:sm:text-xl [&_h3]:font-bold [&_h3]:text-sudabelt-navy [&_h3]:mt-6 [&_h3]:mb-2 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-2 [&_strong]:text-sudabelt-navy [&_strong]:font-bold [&_iframe]:w-full [&_iframe]:rounded-xl [&_iframe]:border [&_iframe]:border-sudabelt-border"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          ) : (
            <div className="rich-text-content text-sudabelt-body text-base sm:text-[17px] leading-[1.75] space-y-4">
              {paragraphs.map((p, idx) => (
                <p key={idx} className="leading-relaxed">
                  {p}
                </p>
              ))}
            </div>
          )}

          {/* 3. Gallery Below Blog Details */}
          {galleryImages.length > 0 && (
            <div className="mt-12 pt-10 border-t border-sudabelt-border">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-sudabelt-green-tint border border-sudabelt-green/20 flex items-center justify-center text-sudabelt-green">
                    <Images className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-extrabold text-sudabelt-navy">
                      Article Gallery
                    </h2>
                    <p className="text-xs text-sudabelt-muted">
                      Click any image to view full size ({galleryImages.length}{' '}
                      {galleryImages.length === 1 ? 'photo' : 'photos'})
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {galleryImages.map((imgUrl, idx) => {
                  const lbIdx = allLightboxImages.indexOf(imgUrl)
                  return (
                    <button
                      key={`${imgUrl}-${idx}`}
                      type="button"
                      onClick={() => setLightboxIndex(lbIdx >= 0 ? lbIdx : idx)}
                      className="group relative aspect-16/10 rounded-xl overflow-hidden border border-sudabelt-border bg-sudabelt-surface shadow-2xs hover:border-sudabelt-green hover:shadow-md transition-all cursor-pointer text-left"
                    >
                      <img
                        src={imgUrl}
                        alt={`${article.title} - Gallery ${idx + 1}`}
                        loading="lazy"
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-sudabelt-navy/0 group-hover:bg-sudabelt-navy/20 transition-colors" />
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Share & Actions */}
          <div className="mt-12 pt-6 border-t border-sudabelt-border flex items-center justify-between">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sudabelt-navy hover:text-sudabelt-green transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Articles</span>
            </Link>

            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-control bg-sudabelt-surface hover:bg-sudabelt-green hover:text-white text-sudabelt-navy text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer border border-sudabelt-border"
            >
              <Share2 className="w-4 h-4" />
              <span>Share Article</span>
            </button>
          </div>
        </div>
      </section>

      {/* 4. Related Blog Posts */}
      {relatedBlogs.length > 0 && (
        <section className="py-12 sm:py-16 bg-sudabelt-surface border-t border-sudabelt-border">
          <div className="sudabelt-container">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-sudabelt-green">
                  CONTINUE READING
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-sudabelt-navy mt-1">
                  More Articles &amp; Insights
                </h2>
              </div>
              <Link
                to="/blog"
                className="text-xs font-extrabold uppercase tracking-wider text-sudabelt-navy hover:text-sudabelt-green inline-flex items-center gap-1.5 transition-colors"
              >
                <span>View All Posts</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedBlogs.map((rel) => (
                <Link
                  key={rel._id || rel.slug}
                  to={`/blog/${rel.slug}`}
                  className="bg-white border border-sudabelt-border rounded-card overflow-hidden hover:border-sudabelt-green hover:shadow-card transition-all group flex flex-col justify-between"
                >
                  <div>
                    <div className="aspect-16/10 bg-sudabelt-navy overflow-hidden relative">
                      <img
                        src={
                          rel.coverImage ||
                          '/images/DSC_4835.JPG.webp'
                        }
                        alt={rel.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-control bg-sudabelt-navy/90 text-white text-[10px] font-bold uppercase tracking-wider">
                        {rel.category}
                      </span>
                    </div>
                    <div className="p-5">
                      <h3 className="text-base font-bold text-sudabelt-navy group-hover:text-sudabelt-green transition-colors line-clamp-2 leading-snug">
                        {rel.title}
                      </h3>
                      <p className="text-xs text-sudabelt-body mt-2 line-clamp-2 leading-relaxed">
                        {rel.summary}
                      </p>
                    </div>
                  </div>
                  <div className="px-5 pb-5 pt-2 border-t border-sudabelt-border/60 flex items-center justify-between text-xs font-extrabold uppercase tracking-wider text-sudabelt-green">
                    <span>Read Article</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. Lightbox Modal for Gallery & Cover Images */}
      {lightboxIndex !== null && allLightboxImages[lightboxIndex] && (
        <div
          onClick={() => setLightboxIndex(null)}
          className="fixed inset-0 z-50 bg-sudabelt-navy/90 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <button
            type="button"
            onClick={() => setLightboxIndex(null)}
            aria-label="Close image viewer"
            className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {allLightboxImages.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  setLightboxIndex(
                    (lightboxIndex - 1 + allLightboxImages.length) % allLightboxImages.length
                  )
                }}
                aria-label="Previous image"
                className="absolute left-4 sm:left-6 w-11 h-11 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center cursor-pointer transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  setLightboxIndex((lightboxIndex + 1) % allLightboxImages.length)
                }}
                aria-label="Next image"
                className="absolute right-4 sm:right-6 w-11 h-11 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center cursor-pointer transition-colors"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-5xl max-h-[85vh] flex flex-col items-center"
          >
            <img
              src={allLightboxImages[lightboxIndex]}
              alt={`${article.title} (${lightboxIndex + 1} of ${allLightboxImages.length})`}
              className="max-w-full max-h-[78vh] object-contain rounded-xl shadow-2xl border border-white/15"
            />
            <div className="mt-3 text-xs font-mono text-white/80">
              Image {lightboxIndex + 1} of {allLightboxImages.length}
            </div>
          </div>
        </div>
      )}

      {/* 6. Pre-Footer CTA */}
      <PreFooterCTA
        title="Consult with our clinical biomedical team"
        subtitle="Sudabelt delivers full clinical application support, operator training, and equipment supply across Nigeria."
        primaryLabel="REQUEST A QUOTE"
        primaryTo="/rfq"
        secondaryLabel="SPEAK TO AN ENGINEER"
        secondaryTo="/contact"
        secondaryType="link"
      />
    </div>
  )
}

export default BlogDetailPage
