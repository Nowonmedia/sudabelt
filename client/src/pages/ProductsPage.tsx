import React, { useMemo, useState, useEffect, useRef } from 'react'
import { Link, useSearchParams } from 'react-router'
import { Search, Check, SlidersHorizontal, X, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'
import { toast } from 'react-toastify'
import { useProducts, type ApiProduct } from '../api/api'
import { useQuote } from '../context/QuoteContext'

interface CategoryOption {
  slug: string
  label: string
  shortLabel: string
  oems: string[]
}

const PORTFOLIO_CATEGORIES: CategoryOption[] = [
  {
    slug: 'all',
    label: 'All',
    shortLabel: 'All',
    oems: [
      'GE Healthcare',
      'Baxter',
      'SWS Medical',
      'Terumo BCT',
      'Abbott',
      'Maccura',
      'Fisher & Paykel Healthcare',
      'Ezisurg Medical',
    ],
  },
  {
    slug: 'imaging-and-life-care',
    label: 'Imaging & Life Care',
    shortLabel: 'Imaging & Life Care',
    oems: ['GE Healthcare'],
  },
  {
    slug: 'renal-and-critical-care',
    label: 'Renal & Critical Care',
    shortLabel: 'Renal & Critical Care',
    oems: ['Baxter', 'SWS Medical'],
  },
  {
    slug: 'blood-management-cell-technologies',
    label: 'Blood Management & Cell Technologies',
    shortLabel: 'Blood Management & Cell Technologies',
    oems: ['Terumo BCT'],
  },
  {
    slug: 'laboratory-and-diagnostics',
    label: 'Laboratory & Diagnostics',
    shortLabel: 'Laboratory & Diagnostics',
    oems: ['Abbott', 'Maccura'],
  },
  {
    slug: 'respiratory-and-neonatal-care',
    label: 'Respiratory & Neonatal Care',
    shortLabel: 'Respiratory & Neonatal Care',
    oems: ['Fisher & Paykel Healthcare'],
  },
  {
    slug: 'minimally-invasive-surgery',
    label: 'Minimally Invasive Surgery',
    shortLabel: 'Minimally Invasive Surgery',
    oems: ['Ezisurg Medical'],
  },
]

const ALL_OEM_BRANDS = [
  'Baxter',
  'Terumo BCT',
  'Abbott',
  'GE Healthcare',
  'SWS Medical',
  'Maccura',
  'Fisher & Paykel Healthcare',
  'Ezisurg Medical',
]

const LEGACY_CATEGORY_MAP: Record<string, string> = {
  'renal-care': 'renal-and-critical-care',
  'blood-banking-apheresis': 'blood-management-cell-technologies',
  'critical-care': 'imaging-and-life-care',
}

function getProductImage(product: ApiProduct, width = 480): string {
  const raw =
    product.primaryImage ||
    product.images?.primaryCutout ||
    product.galleryImages?.[0] ||
    product.images?.contextualGallery?.[0] ||
    ''
  if (!raw) return ''
  if (raw.includes('res.cloudinary.com') && raw.includes('/image/upload/') && !raw.includes('/w_')) {
    return raw.replace('/image/upload/', `/image/upload/w_${width},f_auto,q_auto/`)
  }
  return raw
}

const ProductsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const { addItem, isInTray } = useQuote()

  const initialCatParam = searchParams.get('category') || 'all'
  const mappedInitialCat =
    initialCatParam === 'consumables'
      ? 'all'
      : LEGACY_CATEGORY_MAP[initialCatParam] || initialCatParam

  const [selectedCategory, setSelectedCategory] = useState<string>(mappedInitialCat)
  const [selectedType, setSelectedType] = useState<'All' | 'Technology' | 'Consumable'>(
    initialCatParam === 'consumables' || searchParams.get('type') === 'Consumable'
      ? 'Consumable'
      : searchParams.get('type') === 'Technology'
        ? 'Technology'
        : 'All'
  )
  const [selectedBrands, setSelectedBrands] = useState<string[]>(() => {
    const b = searchParams.get('brand')
    return b ? [b] : []
  })
  const [searchQuery, setSearchQuery] = useState<string>(searchParams.get('search') || '')
  const [sortBy, setSortBy] = useState<'featured' | 'name' | 'technology' | 'consumable'>('featured')
  const [visibleCount, setVisibleCount] = useState<number>(12)
  const loadMoreRef = useRef<HTMLDivElement | null>(null)

  // Reset pagination whenever filters or sort change
  useEffect(() => {
    setVisibleCount(12)
  }, [selectedCategory, selectedType, selectedBrands, searchQuery, sortBy])

  // Lazy-load next batch automatically when user scrolls near the bottom sentinel
  useEffect(() => {
    const el = loadMoreRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisibleCount((prev) => prev + 12)
        }
      },
      { rootMargin: '250px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [selectedCategory, selectedType, selectedBrands, searchQuery, sortBy])

  useEffect(() => {
    const catParam = searchParams.get('category')
    if (catParam === 'consumables') {
      setSelectedCategory('all')
      setSelectedType('Consumable')
    } else if (catParam) {
      setSelectedCategory(LEGACY_CATEGORY_MAP[catParam] || catParam)
    }
  }, [searchParams])

  const { data, isLoading } = useProducts()
  const allProducts = data?.data || []

  // Continuous slider through all available technologies with images
  const heroTechProducts = useMemo(
    () => allProducts.filter((p) => !p.isConsumable && Boolean(getProductImage(p))),
    [allProducts]
  )
  const [heroSlideIdx, setHeroSlideIdx] = useState(0)
  const [isSliderPaused, setIsSliderPaused] = useState(false)

  useEffect(() => {
    if (heroTechProducts.length <= 1 || isSliderPaused) return
    const timer = window.setInterval(() => {
      setHeroSlideIdx((prev) => (prev + 1) % heroTechProducts.length)
    }, 3500)
    return () => window.clearInterval(timer)
  }, [heroTechProducts.length, isSliderPaused])

  // Clear OEM brand filters automatically when switching to Consumable type
  useEffect(() => {
    if (selectedType === 'Consumable' && selectedBrands.length > 0) {
      setSelectedBrands([])
    }
  }, [selectedType, selectedBrands.length])

  const activeHeroTech = heroTechProducts[heroSlideIdx % Math.max(1, heroTechProducts.length)]

  const handleCategoryChange = (catSlug: string) => {
    setSelectedCategory(catSlug)
    const nextParams = new URLSearchParams(searchParams)
    if (catSlug === 'all') {
      nextParams.delete('category')
    } else {
      nextParams.set('category', catSlug)
    }
    setSearchParams(nextParams, { replace: true })
  }

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    )
  }

  const clearFilters = () => {
    setSelectedCategory('all')
    setSelectedType('All')
    setSelectedBrands([])
    setSearchQuery('')
    setSearchParams({}, { replace: true })
  }

  const filteredProducts = useMemo(() => {
    let list = [...allProducts]

    // Filter by category
    if (selectedCategory && selectedCategory !== 'all') {
      list = list.filter((p) => p.category === selectedCategory)
    }

    // Filter by type (Technology vs Consumable)
    if (selectedType === 'Technology') {
      list = list.filter((p) => !p.isConsumable && p.productType !== 'Consumable')
    } else if (selectedType === 'Consumable') {
      list = list.filter((p) => p.isConsumable || p.productType === 'Consumable')
    }

    // Filter by OEM brand checkboxes (Technologies belong to OEM partners)
    if (selectedBrands.length > 0) {
      list = list.filter(
        (p) =>
          p.brand &&
          selectedBrands.some((b) => p.brand.toLowerCase() === b.toLowerCase())
      )
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase()
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.brand && p.brand.toLowerCase().includes(q)) ||
          (p.categoryLabel && p.categoryLabel.toLowerCase().includes(q)) ||
          (p.shortDescription && p.shortDescription.toLowerCase().includes(q))
      )
    }

    // Sort
    if (sortBy === 'name') {
      list.sort((a, b) => a.name.localeCompare(b.name))
    } else if (sortBy === 'technology') {
      list.sort((a, b) => Number(a.isConsumable) - Number(b.isConsumable))
    } else if (sortBy === 'consumable') {
      list.sort((a, b) => Number(b.isConsumable) - Number(a.isConsumable))
    }

    return list
  }, [allProducts, selectedCategory, selectedType, selectedBrands, searchQuery, sortBy])

  const paginatedProducts = useMemo(
    () => filteredProducts.slice(0, visibleCount),
    [filteredProducts, visibleCount]
  )

  const handleAddToQuote = (product: ApiProduct) => {
    addItem({
      id: product._id || product.slug,
      slug: product.slug,
      name: product.name,
      brand: product.isConsumable ? undefined : product.brand,
      category: product.categoryLabel || product.category,
      isConsumable: product.isConsumable,
      imageUrl: getProductImage(product),
    })
    toast.success(`Added "${product.name}" to your RFQ Tray`, {
      position: 'bottom-right',
      autoClose: 2500,
    })
  }

  return (
    <div className="bg-white min-h-screen">
      {/* =====================================================================
          HERO SECTION
      ===================================================================== */}
      <section className="pt-10 pb-12 bg-white">
        <div className="sudabelt-container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            {/* Left Column: Breadcrumb, Heading, Overview, Search */}
            <div className="lg:col-span-6">
              <nav className="flex items-center gap-2 text-xs text-sudabelt-muted mb-6">
                <Link to="/" className="hover:text-sudabelt-navy transition-colors">
                  Home
                </Link>
                <span>/</span>
                <span className="text-sudabelt-navy font-semibold">Portfolio</span>
              </nav>

              <div className="flex items-center gap-3 mb-3">
                <span className="w-7 h-0.75 bg-sudabelt-red rounded-xs" />
                <span className="inline-block px-3.5 py-1 rounded-control bg-sudabelt-blue text-white text-[11px] sm:text-[12px] font-extrabold uppercase tracking-[0.14em] shadow-sm">
                  OUR PORTFOLIO
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[52px] font-extrabold text-sudabelt-navy leading-[1.06] tracking-tight mt-2">
                Technology &amp;
                <br />
                consumables
              </h1>

              <p className="text-sm sm:text-base text-sudabelt-body mt-4 max-w-lg leading-relaxed">
                Sudabelt Medical delivers integrated healthcare solutions that strengthen healthcare
                systems across Africa. Explore our portfolio of advanced medical technologies and
                medical consumables.
              </p>

              {/* Search Input */}
              <div className="mt-7 relative max-w-md">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search technologies, consumables, OEM partners..."
                  className="w-full h-12 pl-4 pr-10 rounded-control border border-sudabelt-border text-sm text-sudabelt-navy placeholder:text-sudabelt-muted focus:border-sudabelt-green focus:outline-none transition-colors bg-white"
                />
                {searchQuery ? (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    aria-label="Clear search"
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-sudabelt-muted hover:text-sudabelt-navy cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                ) : (
                  <Search className="w-4 h-4 text-sudabelt-muted absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                )}
              </div>
            </div>

            {/* Right Column: Single Continuous Technology Showcase Slider */}
            <div className="lg:col-span-6">
              <div
                onMouseEnter={() => setIsSliderPaused(true)}
                onMouseLeave={() => setIsSliderPaused(false)}
                className="relative max-w-lg lg:ml-auto rounded-2xl bg-sudabelt-green p-6 sm:p-8 h-90 sm:h-100 flex flex-col justify-between text-white shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden"
              >
                {/* Top Meta + Prev/Next Controls */}
                <div className="flex items-center justify-between gap-3 z-10">
                  <span className="px-2.5 py-1 rounded-control bg-white/15 border border-white/20 text-[10px] font-bold uppercase tracking-[0.14em] text-white">
                    {activeHeroTech?.brand || 'TECHNOLOGY'} • PORTFOLIO HIGHLIGHT
                  </span>

                  {heroTechProducts.length > 1 && (
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() =>
                          setHeroSlideIdx(
                            (prev) => (prev - 1 + heroTechProducts.length) % heroTechProducts.length
                          )
                        }
                        aria-label="Previous technology"
                        className="w-7 h-7 rounded-full bg-white/15 hover:bg-white hover:text-sudabelt-green flex items-center justify-center transition-colors cursor-pointer"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setHeroSlideIdx((prev) => (prev + 1) % heroTechProducts.length)
                        }
                        aria-label="Next technology"
                        className="w-7 h-7 rounded-full bg-white/15 hover:bg-white hover:text-sudabelt-green flex items-center justify-center transition-colors cursor-pointer"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Image Area */}
                <Link
                  to={
                    activeHeroTech
                      ? `/products/${activeHeroTech.category}/${activeHeroTech.slug}`
                      : '/products'
                  }
                  className="group flex-1 flex items-center justify-center p-3 overflow-hidden"
                >
                  {activeHeroTech && getProductImage(activeHeroTech) ? (
                    <img
                      key={activeHeroTech.slug}
                      src={getProductImage(activeHeroTech)}
                      alt={activeHeroTech.name}
                      className="max-h-52 sm:max-h-60 w-auto object-contain drop-shadow-xl group-hover:scale-105 transition-all duration-500 animate-in fade-in"
                    />
                  ) : (
                    <div className="w-40 h-44 rounded-lg bg-white/10 animate-pulse" />
                  )}
                </Link>

                {/* Bottom Title & Slide Indicator */}
                <div className="flex items-end justify-between gap-4 pt-2 z-10">
                  <Link
                    to={
                      activeHeroTech
                        ? `/products/${activeHeroTech.category}/${activeHeroTech.slug}`
                        : '/products'
                    }
                    className="min-w-0 group"
                  >
                    <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/80 block">
                      {activeHeroTech?.categoryLabel || 'TECHNOLOGY'}
                    </span>
                    <span className="text-lg sm:text-xl font-extrabold text-white group-hover:underline block mt-0.5 leading-tight line-clamp-1">
                      {activeHeroTech?.name || 'Medical Technology'}
                    </span>
                  </Link>

                  {heroTechProducts.length > 1 && (
                    <span className="font-mono text-[11px] font-bold text-white/80 shrink-0">
                      {heroSlideIdx + 1} / {heroTechProducts.length}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          CATEGORY TABS BAR
      ===================================================================== */}
      <div className="border-t-2 border-sudabelt-green border-b  bg-white sticky top-0 z-20">
        <div className="sudabelt-container">
          <div
            className="flex items-center gap-6 sm:gap-8 overflow-x-auto no-scrollbar [&::-webkit-scrollbar]:hidden"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {PORTFOLIO_CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.slug
              return (
                <button
                  key={cat.slug}
                  type="button"
                  onClick={() => handleCategoryChange(cat.slug)}
                  className={`px-3.5 py-2 my-2.5 rounded-control text-xs sm:text-[13px] font-bold whitespace-nowrap transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-sudabelt-green text-white shadow-xs'
                      : 'text-sudabelt-body hover:text-sudabelt-navy hover:bg-slate-100'
                  }`}
                >
                  {cat.shortLabel}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* =====================================================================
          MAIN CATALOG BODY: LEFT SIDEBAR FILTERS + RIGHT PRODUCT GRID
      ===================================================================== */}
      <section className="py-10 sm:py-12">
        <div className="sudabelt-container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            {/* LEFT SIDEBAR */}
            <aside className="lg:col-span-3 space-y-7">
              {/* TYPE FILTER (All | Technology | Consumable) */}
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-sudabelt-muted block mb-2.5">
                  TYPE
                </span>
                <div className="inline-flex w-full rounded-control border border-sudabelt-border bg-white overflow-hidden">
                  {(['All', 'Technology', 'Consumable'] as const).map((typeOpt) => {
                    const active = selectedType === typeOpt
                    return (
                      <button
                        key={typeOpt}
                        type="button"
                        onClick={() => setSelectedType(typeOpt)}
                        className={`flex-1 py-2 px-2.5 text-xs font-bold transition-colors cursor-pointer border-r last:border-r-0 border-sudabelt-border ${
                          active
                            ? 'bg-sudabelt-green text-white'
                            : 'bg-white text-sudabelt-navy hover:bg-sudabelt-surface'
                        }`}
                      >
                        {typeOpt}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* OEM BRAND CHECKBOXES (Hidden completely when Consumable type is active) */}
              {selectedType !== 'Consumable' && (
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-sudabelt-muted">
                      OEM PARTNER
                    </span>
                    {selectedBrands.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setSelectedBrands([])}
                        className="text-[11px] font-bold text-sudabelt-green hover:underline cursor-pointer"
                      >
                        Reset
                      </button>
                    )}
                  </div>

                  <div className="space-y-2">
                    {ALL_OEM_BRANDS.map((brand) => {
                      const checked = selectedBrands.includes(brand)
                      const countInCategory = allProducts.filter(
                        (p) =>
                          !p.isConsumable &&
                          p.brand &&
                          p.brand.toLowerCase() === brand.toLowerCase() &&
                          (selectedCategory === 'all' || p.category === selectedCategory)
                      ).length

                      return (
                        <label
                          key={brand}
                          className={`flex items-center justify-between gap-2.5 py-1 text-xs select-none transition-opacity cursor-pointer ${
                            countInCategory === 0 && selectedCategory !== 'all'
                              ? 'opacity-45'
                              : 'opacity-100'
                          }`}
                        >
                          <span className="flex items-center gap-2.5">
                            <button
                              type="button"
                              role="checkbox"
                              aria-checked={checked}
                              onClick={() => toggleBrand(brand)}
                              className={`w-4 h-4 rounded border flex items-center justify-center transition-colors cursor-pointer ${
                                checked
                                  ? 'bg-sudabelt-green border-sudabelt-green text-white'
                                  : 'bg-white border-sudabelt-border hover:border-sudabelt-green'
                              }`}
                            >
                              {checked && <Check className="w-3 h-3 stroke-3" />}
                            </button>
                            <span className="text-sudabelt-navy font-medium">{brand}</span>
                          </span>
                          <span className="text-[11px] text-sudabelt-muted font-mono">
                            {countInCategory}
                          </span>
                        </label>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* CLEAR FILTERS BUTTON BELOW OEM PARTNER FILTERS */}
              {(selectedCategory !== 'all' ||
                selectedType !== 'All' ||
                selectedBrands.length > 0 ||
                searchQuery) && (
                <div className="pb-3">
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="w-full h-9 px-3 rounded-control border border-sudabelt-red/30 bg-sudabelt-red/5 hover:bg-sudabelt-red text-sudabelt-red hover:text-white text-xs font-bold inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                    Clear filters
                  </button>
                </div>
              )}

              {/* GREEN RFQ CTA CARD */}
              <div className="rounded-xl bg-sudabelt-green p-5 text-white shadow-card">
                <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/80 block">
                  BUYING SEVERAL ITEMS?
                </span>
                <p className="text-sm sm:text-[15px] font-extrabold text-white leading-snug mt-1.5">
                  Build one quote across equipment, consumables and training.
                </p>
                <Link
                  to="/request-quote"
                  className="mt-4 w-full h-10 rounded-control bg-sudabelt-blue hover:bg-white text-white hover:text-sudabelt-green font-extrabold text-[11px] uppercase tracking-wider flex items-center justify-center transition-all hover:shadow-md"
                >
                  OPEN RFQ TRAY
                </Link>
              </div>
            </aside>

            {/* RIGHT PRODUCT GRID */}
            <div className="lg:col-span-9">
              {/* Count & Sort Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <span className="text-xs sm:text-sm font-extrabold text-sudabelt-navy">
                    Showing {paginatedProducts.length} of {filteredProducts.length}{' '}
                    {filteredProducts.length === 1 ? 'item' : 'items'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-sudabelt-navy">Sort</span>
                  <select
                    value={sortBy}
                    onChange={(e) =>
                      setSortBy(
                        e.target.value as 'featured' | 'name' | 'technology' | 'consumable'
                      )
                    }
                    className="h-9 px-3 rounded-control border border-sudabelt-border text-xs font-semibold text-sudabelt-navy bg-white focus:border-sudabelt-green focus:outline-none cursor-pointer"
                  >
                    <option value="featured">Featured</option>
                    <option value="name">Name (A-Z)</option>
                    <option value="technology">Technology First</option>
                    <option value="consumable">Consumables First</option>
                  </select>
                </div>
              </div>

              {/* Loading Skeleton */}
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-sudabelt-border p-4 space-y-4 animate-pulse"
                    >
                      <div className="h-52 rounded-lg bg-sudabelt-surface" />
                      <div className="h-3 w-1/2 bg-sudabelt-surface rounded" />
                      <div className="h-5 w-3/4 bg-sudabelt-surface rounded" />
                      <div className="h-12 bg-sudabelt-surface rounded" />
                      <div className="grid grid-cols-2 gap-2">
                        <div className="h-10 bg-sudabelt-surface rounded" />
                        <div className="h-10 bg-sudabelt-surface rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="rounded-xl border border-sudabelt-border bg-sudabelt-surface/50 p-12 text-center space-y-4">
                  <SlidersHorizontal className="w-10 h-10 text-sudabelt-muted mx-auto stroke-[1.5]" />
                  <div>
                    <h3 className="text-lg font-extrabold text-sudabelt-navy">
                      No matching items found
                    </h3>
                    <p className="text-xs sm:text-sm text-sudabelt-body mt-1 max-w-md mx-auto">
                      Try clearing one of your active OEM partner or category filters, or search by
                      a broader term.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="h-10 px-5 rounded-control bg-sudabelt-green text-white font-bold text-xs uppercase tracking-wider cursor-pointer"
                  >
                    Show All Items
                  </button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {paginatedProducts.map((product) => {
                    const isConsumable =
                      product.isConsumable || product.productType === 'Consumable'
                    const imgUrl = getProductImage(product)
                    const galleryCount =
                      product.galleryImages?.length ||
                      product.images?.contextualGallery?.length ||
                      1
                    const inTray = isInTray(product._id || product.slug)

                    // CONSUMABLE CARD: Only image and name (not attached to any OEM partner, no summary/description)
                    if (isConsumable) {
                      return (
                        <article
                          key={product._id || product.slug}
                          className="rounded-xl border border-sudabelt-green/25 bg-white p-3.5 flex flex-col justify-between hover:border-sudabelt-green/60 hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-300"
                        >
                          <div>
                            <div className="relative rounded-lg bg-[#EAEFF2] h-56 p-3.5 flex flex-col justify-between overflow-hidden group">
                              <div className="flex items-center justify-between gap-2 z-10">
                                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold tracking-wide bg-sudabelt-blue text-white">
                                  Consumable
                                </span>
                                {galleryCount > 1 && (
                                  <span className="text-[10px] font-semibold text-sudabelt-navy/75">
                                    {galleryCount} images
                                  </span>
                                )}
                              </div>

                              <div className="flex-1 flex items-center justify-center my-2 overflow-hidden">
                                {imgUrl && (
                                  <img
                                    src={imgUrl}
                                    alt={product.name}
                                    loading="lazy"
                                    decoding="async"
                                    className="max-h-36 w-auto object-contain mx-auto group-hover:scale-105 transition-transform duration-300"
                                  />
                                )}
                              </div>

                              <div className="text-[10px] text-sudabelt-muted z-10">
                                <span>{product.categoryLabel || product.category.replace(/-/g, ' ')}</span>
                              </div>
                            </div>

                            <div className="pt-3.5 px-1">
                              <h2 className="text-base sm:text-[17px] font-extrabold text-sudabelt-navy leading-snug">
                                {product.name}
                              </h2>
                            </div>
                          </div>

                          <div className="mt-4 pt-2 px-1">
                            <button
                              type="button"
                              onClick={() => handleAddToQuote(product)}
                              className={`w-full h-10 px-3 rounded-control font-extrabold text-[11px] uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center text-center ${
                                inTray
                                  ? 'bg-sudabelt-green text-white'
                                  : 'bg-sudabelt-blue hover:bg-sudabelt-green text-white'
                              }`}
                            >
                              {inTray ? 'IN QUOTE TRAY' : 'ADD TO QUOTE'}
                            </button>
                          </div>
                        </article>
                      )
                    }

                    // TECHNOLOGY CARD: Image, OEM Partner + Category, Name, Exact Milanote Summary underneath
                    return (
                      <article
                        key={product._id || product.slug}
                        className="rounded-xl border border-sudabelt-green/25 bg-white p-3.5 flex flex-col justify-between hover:border-sudabelt-green/60 hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-300"
                      >
                        <div>
                          {/* Top Gray Image Box */}
                          <Link
                            to={`/products/${product.category}/${product.slug}`}
                            className="relative rounded-lg bg-[#EAEFF2] h-56 p-3.5 flex flex-col justify-between overflow-hidden group"
                          >
                            {/* Top Tag */}
                            <div className="flex items-center justify-between gap-2 z-10">
                              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold tracking-wide bg-sudabelt-navy text-white">
                                Technology
                              </span>
                              {galleryCount > 1 && (
                                <span className="text-[10px] font-semibold text-sudabelt-navy/75">
                                  {galleryCount} images
                                </span>
                              )}
                            </div>

                            {/* Center Product Image */}
                            <div className="flex-1 flex items-center justify-center my-2 overflow-hidden">
                              {imgUrl && (
                                <img
                                  src={imgUrl}
                                  alt={product.name}
                                  loading="lazy"
                                  decoding="async"
                                  className="max-h-36 w-auto object-contain mx-auto group-hover:scale-105 transition-transform duration-300"
                                />
                              )}
                            </div>

                            <div className="text-[11px] text-sudabelt-red z-10">
                              <span>Click to view full details</span>
                            </div>
                          </Link>

                          {/* Eyebrow, Product Title & Exact Milanote Summary */}
                          <div className="pt-3.5 px-1">
                            <span className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-sudabelt-green block truncate">
                              {product.brand ? `${product.brand} · ` : ''}
                              {product.categoryLabel || product.category.replace(/-/g, ' ')}
                            </span>

                            <Link
                              to={`/products/${product.category}/${product.slug}`}
                              className="block mt-1 group"
                            >
                              <h2 className="text-base sm:text-[17px] font-extrabold text-sudabelt-navy group-hover:text-sudabelt-green transition-colors leading-snug">
                                {product.name}
                              </h2>
                            </Link>

                            {/* Exact Milanote Summary Under the Image/Title */}
                            {product.shortDescription && (
                              <p className="mt-2 text-xs text-sudabelt-body leading-relaxed">
                                {product.shortDescription}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-4 pt-2 px-1 grid grid-cols-2 gap-2.5">
                          <button
                            type="button"
                            onClick={() => handleAddToQuote(product)}
                            className={`h-10 px-2 rounded-control font-extrabold text-[10.5px] uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center text-center leading-tight ${
                              inTray
                                ? 'bg-sudabelt-green text-white'
                                : 'bg-sudabelt-blue hover:bg-sudabelt-green text-white'
                            }`}
                          >
                            {inTray ? 'IN QUOTE TRAY' : 'ADD TO QUOTE'}
                          </button>

                          <Link
                            to={`/products/${product.category}/${product.slug}`}
                            className="h-10 px-2 rounded-control border border-sudabelt-navy/35 hover:border-sudabelt-navy hover:bg-sudabelt-navy text-sudabelt-navy hover:text-white font-extrabold text-[10.5px] uppercase tracking-wider transition-all flex items-center justify-center text-center leading-tight"
                          >
                            VIEW DETAILS
                          </Link>
                        </div>
                      </article>
                    )
                  })}
                </div>

                {/* Load More / Lazy-Load Sentinel */}
                {visibleCount < filteredProducts.length && (
                  <div ref={loadMoreRef} className="mt-10 pt-2 flex flex-col items-center justify-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => setVisibleCount((prev) => prev + 12)}
                      className="h-12 px-8 rounded-control bg-sudabelt-navy hover:bg-sudabelt-green text-white font-extrabold text-xs uppercase tracking-wider transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer flex items-center gap-2 group"
                    >
                      <span>LOAD MORE PRODUCTS</span>
                      <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
                    </button>
                    <p className="text-[11.5px] text-sudabelt-muted">
                      Showing {paginatedProducts.length} of {filteredProducts.length} items ({filteredProducts.length - paginatedProducts.length} remaining)
                    </p>
                  </div>
                )}
              </>
            )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ProductsPage
