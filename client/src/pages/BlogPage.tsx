import React, { useState, useMemo } from 'react'
import { Link } from 'react-router'
import { ArrowRight, Calendar, Clock, BookOpen, Search } from 'lucide-react'
import { HeaderTextReveal, SectionReveal } from '../components/common/Reveal'
import PreFooterCTA from '../components/common/PreFooterCTA'
import { useArticles, type ApiArticle } from '../api/api'

const BlogPage: React.FC = () => {
  const { data: apiData, isLoading } = useArticles({ type: 'blog' })
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [searchQuery, setSearchQuery] = useState<string>('')

  const allBlogs: ApiArticle[] = useMemo(() => {
    if (apiData && Array.isArray(apiData.data)) {
      return apiData.data
    }
    return []
  }, [apiData])

  // Extract unique categories from blogs
  const categories = useMemo(() => {
    const set = new Set<string>()
    allBlogs.forEach((b) => {
      if (b.category) set.add(b.category)
    })
    return ['All', ...Array.from(set)]
  }, [allBlogs])

  // Filtered blogs
  const filteredBlogs = useMemo(() => {
    return allBlogs.filter((b) => {
      const matchCat = selectedCategory === 'All' || b.category.toLowerCase() === selectedCategory.toLowerCase()
      const matchSearch =
        !searchQuery.trim() ||
        b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.category.toLowerCase().includes(searchQuery.toLowerCase())
      return matchCat && matchSearch
    })
  }, [allBlogs, selectedCategory, searchQuery])

  // Most recent blog is featured
  const featuredBlog = useMemo(() => {
    return allBlogs.length > 0 ? allBlogs[0] : null
  }, [allBlogs])

  // Remaining blogs (exclude the featured one if showing all or when no search is applied)
  const gridBlogs = useMemo(() => {
    if (searchQuery.trim() || selectedCategory !== 'All') {
      return filteredBlogs
    }
    return allBlogs.slice(1)
  }, [allBlogs, filteredBlogs, searchQuery, selectedCategory])

  return (
    <div className="w-full flex flex-col bg-white">
      {/* 1. Page Header */}
      <section className="bg-sudabelt-surface border-b border-sudabelt-border py-14 sm:py-20">
        <div className="sudabelt-container">
          <SectionReveal>
            <div className="flex items-center gap-3 mb-3">
              <span className="w-7 h-0.75 bg-sudabelt-red rounded-xs" />
              <span className="inline-block px-3.5 py-1 rounded-control bg-sudabelt-blue text-white text-[11px] sm:text-[12px] font-extrabold uppercase tracking-[0.14em] shadow-sm">
                CLINICAL &amp; BIOMEDICAL JOURNAL
              </span>
            </div>
            <HeaderTextReveal className="mt-2 mb-3">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-sudabelt-navy tracking-tight">
                Healthcare Infrastructure Articles &amp; Blogs
              </h1>
            </HeaderTextReveal>
            <p className="text-sudabelt-body text-base sm:text-lg max-w-2xl leading-relaxed">
              Technical monographs on hemodialysis water standards, therapeutic apheresis protocols, and hospital biomedical uptime across Nigeria and West Africa.
            </p>
          </SectionReveal>
        </div>
      </section>

      {/* 2. Loading State */}
      {isLoading && (
        <section className="py-16 sudabelt-container">
          <div className="h-96 rounded-card bg-slate-100 animate-pulse mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-64 rounded-card bg-slate-100 animate-pulse" />
            <div className="h-64 rounded-card bg-slate-100 animate-pulse" />
            <div className="h-64 rounded-card bg-slate-100 animate-pulse" />
          </div>
        </section>
      )}

      {!isLoading && (
        <>
          {/* 3. Empty State: No blogs in DB yet */}
          {allBlogs.length === 0 ? (
            <section className="py-20 sudabelt-container">
              <div className="max-w-xl mx-auto text-center p-10 border border-dashed border-sudabelt-border rounded-card bg-sudabelt-surface">
                <BookOpen className="w-12 h-12 text-sudabelt-muted mx-auto mb-4" />
                <h2 className="text-xl font-bold text-sudabelt-navy">No Blog Articles Published Yet</h2>
                <p className="text-sm text-sudabelt-body mt-2 leading-relaxed">
                  Published articles, clinical monographs, and engineering case studies from our medical team will appear here soon.
                </p>
                <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                  <Link
                    to="/products"
                    className="h-11 px-6 rounded-control bg-sudabelt-navy hover:bg-sudabelt-green text-white text-xs font-bold uppercase tracking-wider inline-flex items-center transition-colors"
                  >
                    Browse Equipment
                  </Link>
                  <Link
                    to="/resources/newsletters"
                    className="h-11 px-6 rounded-control border border-sudabelt-border text-sudabelt-navy text-xs font-bold uppercase tracking-wider inline-flex items-center hover:bg-white transition-colors"
                  >
                    Explore Newsletters
                  </Link>
                </div>
              </div>
            </section>
          ) : (
            <div className="sudabelt-container py-12 sm:py-16">
              {/* 4. Featured Blog Card (Most Recent in DB) */}
              {featuredBlog && !searchQuery.trim() && selectedCategory === 'All' && (
                <SectionReveal className="mb-14 sm:mb-20">
                  <div className="text-[12px] font-bold uppercase tracking-[0.14em] text-sudabelt-green mb-3">
                    Featured Article
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-sudabelt-surface rounded-card border border-sudabelt-border overflow-hidden hover:border-sudabelt-green hover:shadow-card transition-all duration-300">
                    {/* Featured Image */}
                    <Link
                      to={`/blog/${featuredBlog.slug}`}
                      className="lg:col-span-7 h-72 sm:h-96 relative overflow-hidden bg-sudabelt-navy block"
                    >
                      <img
                        src={featuredBlog.coverImage || '/images/DSC_4834.JPG.webp'}
                        alt={featuredBlog.title}
                        className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.currentTarget.src = '/images/DSC_4834.JPG.webp'
                        }}
                      />
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 rounded-control bg-sudabelt-navy/90 backdrop-blur-xs text-white text-xs font-bold uppercase tracking-wider border border-white/20">
                          {featuredBlog.category}
                        </span>
                      </div>
                    </Link>

                    {/* Featured Details */}
                    <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-center">
                      <div className="flex flex-wrap items-center gap-3 text-xs text-sudabelt-muted mb-3 font-medium">
                        {featuredBlog.publishedDate && (
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-sudabelt-green" />
                            {new Date(featuredBlog.publishedDate).toLocaleDateString('en-GB', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </span>
                        )}
                        <span>•</span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-sudabelt-blue" />
                          {featuredBlog.readTimeMinutes || 7} min read
                        </span>
                        {featuredBlog.author && (
                          <>
                            <span>•</span>
                            <span className="text-sudabelt-navy font-semibold">{featuredBlog.author}</span>
                          </>
                        )}
                      </div>

                      <h2 className="text-2xl sm:text-3xl font-extrabold text-sudabelt-navy leading-tight tracking-tight mb-4">
                        <Link to={`/blog/${featuredBlog.slug}`} className="hover:text-sudabelt-green transition-colors">
                          {featuredBlog.title}
                        </Link>
                      </h2>

                      <p className="text-sudabelt-body text-sm sm:text-base leading-relaxed line-clamp-3 mb-6">
                        {featuredBlog.summary}
                      </p>

                      <div>
                        <Link
                          to={`/blog/${featuredBlog.slug}`}
                          className="h-11 px-6 rounded-control bg-sudabelt-navy hover:bg-sudabelt-green text-white font-extrabold text-xs uppercase tracking-wider inline-flex items-center gap-2 transition-colors shadow-xs"
                        >
                          <span>Read Full Article</span>
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </SectionReveal>
              )}

              {/* 5. Filters & Search Bar */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pt-4 border-t border-sudabelt-border">
                {/* Categories */}
                <div className="flex flex-wrap items-center gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3.5 py-1.5 rounded-control text-xs font-bold transition-all cursor-pointer ${
                        selectedCategory === cat
                          ? 'bg-sudabelt-navy text-white shadow-xs'
                          : 'bg-sudabelt-surface text-sudabelt-navy border border-sudabelt-border hover:border-sudabelt-navy'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Search Input */}
                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search articles..."
                    className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-300 rounded-control text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-sudabelt-blue"
                  />
                </div>
              </div>

              {/* 6. Grid of Remaining / Filtered Blogs */}
              {gridBlogs.length === 0 ? (
                <div className="py-12 text-center border border-dashed border-sudabelt-border rounded-card bg-sudabelt-surface">
                  <p className="text-sm font-semibold text-sudabelt-navy">No articles match your search or filter.</p>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory('All')
                      setSearchQuery('')
                    }}
                    className="mt-3 px-4 py-1.5 bg-sudabelt-navy text-white text-xs font-bold uppercase rounded-control cursor-pointer"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                  {gridBlogs.map((blog, idx) => (
                    <SectionReveal key={blog._id || blog.slug} direction="up" delay={0.05 * (idx % 6 + 1)}>
                      <div className="h-full bg-white border border-sudabelt-border rounded-card overflow-hidden hover:border-sudabelt-green hover:shadow-card transition-all duration-300 flex flex-col justify-between group">
                        <div>
                          {/* Image */}
                          <Link
                            to={`/blog/${blog.slug}`}
                            className="relative aspect-16/10 overflow-hidden bg-sudabelt-navy block"
                          >
                            <img
                              src={blog.coverImage || '/images/DSC_4835.JPG.webp'}
                              alt={blog.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              onError={(e) => {
                                e.currentTarget.src = '/images/DSC_4835.JPG.webp'
                              }}
                            />
                            <div className="absolute top-3 left-3">
                              <span className="px-2.5 py-0.5 rounded-control bg-sudabelt-navy/90 text-white text-[11px] font-bold uppercase tracking-wider">
                                {blog.category}
                              </span>
                            </div>
                          </Link>

                          {/* Content */}
                          <div className="p-6">
                            <div className="flex flex-wrap items-center gap-2 text-[11px] text-sudabelt-muted mb-2 font-mono font-bold">
                              {blog.publishedDate && (
                                <span>
                                  {new Date(blog.publishedDate).toLocaleDateString('en-GB', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric',
                                  })}
                                </span>
                              )}
                              <span>•</span>
                              <span>{blog.readTimeMinutes || 7} MIN READ</span>
                              {blog.author && (
                                <>
                                  <span>•</span>
                                  <span className="font-sans text-sudabelt-navy">{blog.author}</span>
                                </>
                              )}
                            </div>

                            <h3 className="text-lg font-bold text-sudabelt-navy group-hover:text-sudabelt-green transition-colors leading-snug line-clamp-2">
                              <Link to={`/blog/${blog.slug}`}>
                                {blog.title}
                              </Link>
                            </h3>

                            <p className="text-xs sm:text-sm text-sudabelt-body mt-2.5 leading-relaxed line-clamp-3">
                              {blog.summary}
                            </p>
                          </div>
                        </div>

                        {/* Footer Link */}
                        <div className="px-6 pb-6 pt-2 border-t border-sudabelt-border/60">
                          <Link
                            to={`/blog/${blog.slug}`}
                            className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-sudabelt-green hover:text-sudabelt-navy transition-colors group-hover:translate-x-1 duration-200"
                          >
                            <span>Read Article</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    </SectionReveal>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* 7. Pre-Footer CTA */}
      <PreFooterCTA
        title="Need clinical guidance on hospital equipment?"
        subtitle="Our OEM-certified clinical application specialists and biomedical engineers are ready to support your facility."
        primaryLabel="REQUEST A QUOTE"
        primaryTo="/rfq"
        secondaryLabel="CONTACT SPECIALIST"
        secondaryTo="/contact"
        secondaryType="link"
      />
    </div>
  )
}

export default BlogPage
