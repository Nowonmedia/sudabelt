import React, { useState, useMemo } from 'react'
import { Link, useParams } from 'react-router'
import { CheckCircle2, Download, Plus, Play, ArrowRight, Layers, Truck, ShieldCheck, PhoneCall, Check, RotateCcw, Share2, ExternalLink,
  Minus,
  Star,
  ChevronDown,
} from 'lucide-react'
import { toast } from 'react-toastify'
import { API_BASE_URL, useProductDetail, useProducts, type ApiProduct } from '../api/api'
import { useQuote } from '../context/QuoteContext'
import LeadMagnetModal from '../components/common/LeadMagnetModal'

const PORTFOLIO_CATEGORIES = [
  { slug: 'all', shortLabel: 'All' },
  { slug: 'imaging-and-life-care', shortLabel: 'Imaging & Life Care' },
  { slug: 'renal-and-critical-care', shortLabel: 'Renal & Critical Care' },
  { slug: 'blood-management-cell-technologies', shortLabel: 'Blood Management & Cell Technologies' },
  { slug: 'laboratory-and-diagnostics', shortLabel: 'Laboratory & Diagnostics' },
  { slug: 'respiratory-and-neonatal-care', shortLabel: 'Respiratory & Neonatal Care' },
  { slug: 'minimally-invasive-surgery', shortLabel: 'Minimally Invasive Surgery' },
]

function getAllProductImages(product?: ApiProduct): string[] {
  if (!product) return []
  const raw = [
    ...(product.galleryImages || []),
    ...(product.images?.contextualGallery || []),
    product.primaryImage,
    product.images?.primaryCutout,
  ].filter((u): u is string => Boolean(u && u.trim()))
  return Array.from(new Set(raw))
}

// Extract model label from Cloudinary public ID for multi-model series (e.g. Maccura F Series)
function getImageModelLabel(url: string): string | null {
  const lower = url.toLowerCase()
  if (lower.includes('maccura-f560')) return 'Maccura F560'
  if (lower.includes('maccura-f600')) return 'Maccura F600'
  if (lower.includes('maccura-f580')) return 'Maccura F580'
  if (lower.includes('maccura-f880')) return 'Maccura F880'
  return null
}

// Convert any YouTube URL (watch?v=, youtu.be, embed) or default to verified playable OEM video
function getYouTubeEmbedUrl(url?: string, category?: string, brand?: string): string {
  if (url && url.trim()) {
    const raw = url.trim()
    const embedMatch = raw.match(/(?:youtube\.com|youtube-nocookie\.com)\/embed\/([a-zA-Z0-9_-]+)/)
    if (embedMatch) {
      return `https://www.youtube-nocookie.com/embed/${embedMatch[1]}?autoplay=1&mute=0&rel=0`
    }
    const watchMatch = raw.match(/[?&]v=([a-zA-Z0-9_-]+)/)
    if (watchMatch) {
      return `https://www.youtube-nocookie.com/embed/${watchMatch[1]}?autoplay=1&mute=0&rel=0`
    }
    const shortMatch = raw.match(/youtu\.be\/([a-zA-Z0-9_-]+)/)
    if (shortMatch) {
      return `https://www.youtube-nocookie.com/embed/${shortMatch[1]}?autoplay=1&mute=0&rel=0`
    }
    if (raw.startsWith('http')) return raw
  }

  // Verified 100% playable OEM equipment videos:
  // Baxter AK 98: 'YoUSBUy7zBc'
  // GE Healthcare Ultrasound / Point of Care: '1CzTiVFfMz0'
  const b = (brand || '').toLowerCase()
  const c = (category || '').toLowerCase()
  if (b.includes('baxter') || c.includes('renal')) {
    return 'https://www.youtube-nocookie.com/embed/YoUSBUy7zBc?autoplay=1&mute=0&rel=0'
  }
  if (b.includes('ge') || c.includes('imaging')) {
    return 'https://www.youtube-nocookie.com/embed/1CzTiVFfMz0?autoplay=1&mute=0&rel=0'
  }
  return 'https://www.youtube-nocookie.com/embed/YoUSBUy7zBc?autoplay=1&mute=0&rel=0'
}

const ProductDetailPage: React.FC = () => {
  const { category, slug } = useParams<{ category: string; slug: string }>()
  const { data, isLoading, isError } = useProductDetail(slug || '')
  const { data: catalogData } = useProducts()
  const { selectedItems, addItem, updateQuantity, isInTray } = useQuote()
  const [consumableQtys, setConsumableQtys] = useState<Record<string, number>>({})

  const product = data?.data

  const [selectedImageIdx, setSelectedImageIdx] = useState(0)
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0)
  const [isDatasheetModalOpen, setIsDatasheetModalOpen] = useState(false)
  const [isPlayingVideo, setIsPlayingVideo] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [showCategoriesBar, setShowCategoriesBar] = useState(false)

  const images = useMemo(() => getAllProductImages(product), [product])
  const activeImage = images[selectedImageIdx] || images[0] || ''

  // Available Consumables in this category
  const availableConsumables = useMemo(() => {
    if (!product || product.isConsumable) return []
    if (product.availableConsumables && product.availableConsumables.length > 0) {
      return product.availableConsumables
    }
    if (product.compatibleConsumables && product.compatibleConsumables.length > 0) {
      return product.compatibleConsumables
    }
    const all = catalogData?.data || []
    return all.filter((p) => p.isConsumable && p.category === product.category)
  }, [product, catalogData])

  const handleAddSingleToQuote = (item: ApiProduct, customQty = 1) => {
    const imgs = getAllProductImages(item)
    addItem({
      id: item._id || item.slug,
      slug: item.slug,
      name: item.name,
      brand: item.isConsumable ? undefined : item.brand,
      category: item.categoryLabel || item.category,
      isConsumable: item.isConsumable,
      imageUrl: imgs[0] || '',
      quantity: customQty,
    })
    toast.success(`Added "${item.name}" (Qty: ${customQty}) to your RFQ Tray`, {
      position: 'bottom-right',
      autoClose: 2500,
    })
  }

  const handleAddAllConsumablesToQuote = () => {
    if (!product) return
    handleAddSingleToQuote(product, 1)
    availableConsumables.forEach((c) => {
      const imgs = getAllProductImages(c)
      addItem({
        id: c._id || c.slug,
        slug: c.slug,
        name: c.name,
        category: c.categoryLabel || c.category,
        isConsumable: true,
        imageUrl: imgs[0] || '',
        quantity: 1,
      })
    })
    toast.info(
      `Added ${product.name} and ${availableConsumables.length} available consumables to your RFQ Tray`,
      { position: 'bottom-right', autoClose: 3000 }
    )
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.name || 'Sudabelt Medical Equipment',
        url: window.location.href,
      }).catch(() => {})
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.info('Product link copied to clipboard!')
    }
  }

  if (isLoading) {
    return (
      <section className="py-16 bg-white">
        <div className="sudabelt-container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-pulse">
            <div className="lg:col-span-8 space-y-4">
              <div className="h-115 rounded-2xl bg-sudabelt-surface" />
              <div className="grid grid-cols-4 gap-3">
                <div className="h-20 rounded-xl bg-sudabelt-surface" />
                <div className="h-20 rounded-xl bg-sudabelt-surface" />
                <div className="h-20 rounded-xl bg-sudabelt-surface" />
                <div className="h-20 rounded-xl bg-sudabelt-surface" />
              </div>
            </div>
            <div className="lg:col-span-4 space-y-4">
              <div className="h-44 rounded-2xl bg-sudabelt-surface" />
              <div className="h-60 rounded-2xl bg-sudabelt-surface" />
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (isError || !product) {
    return (
      <section className="py-20 bg-white">
        <div className="sudabelt-container text-center max-w-lg mx-auto space-y-4">
          <span className="text-eyebrow text-sudabelt-red">ITEM NOT FOUND</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-sudabelt-navy">
            We could not locate that product
          </h1>
          <p className="text-sm text-sudabelt-body">
            The requested item ({slug}) may have been updated. Browse our full portfolio below.
          </p>
          <div className="pt-2">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 h-11 px-6 rounded-control bg-sudabelt-navy text-white font-bold text-xs uppercase tracking-wider"
            >
              <span>Back to Portfolio</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    )
  }

  const isConsumable = product.isConsumable || product.productType === 'Consumable'
  const inTray = isInTray(product._id || product.slug)
  const categoryDisplay =
    product.categoryLabel || (category || product.category).replace(/-/g, ' ')

  const summaryText = (product.fullOverview || product.shortDescription || '').trim()
  const rawFeatures = (product.productFeatures || []).filter(Boolean)
  const commonUses = (product.commonUses || []).filter(Boolean)
  const uniqueSellingPoint = (product.usps || '').trim()
  const otherInformation = (product.otherInformation || []).filter(Boolean)
  const faqsList = (product.faqs || []).filter((f) => f && f.question && f.answer)

  // Parse features for the blue background section: title + description
  const parsedFeatures = rawFeatures.map((f) => {
    if (f.includes(' - ')) {
      const parts = f.split(' - ')
      return { title: parts[0].trim(), desc: parts.slice(1).join(' - ').trim() }
    }
    if (f.includes(': ')) {
      const parts = f.split(': ')
      return { title: parts[0].trim(), desc: parts.slice(1).join(': ').trim() }
    }
    return { title: f.trim(), desc: '' }
  })

  // Exact fallback features matching the blue section screenshot for Baxter AK98 / Renal
  const displayFeatures =
    parsedFeatures.length > 0
      ? parsedFeatures
      : [
          {
            title: 'Hemocontrol biofeedback',
            desc: 'Adjusts dialysate conductivity and ultrafiltration rate in real time to reduce intradialytic hypotension.',
          },
          {
            title: 'Automated setup & CleanCart',
            desc: 'Automated priming and cartridge-based heat and chemical disinfection streamline the nurse workflow.',
          },
          {
            title: 'Diascan clearance monitoring',
            desc: 'Measures ionic dialysance and delivered Kt/V every session with no disposable reagent cost.',
          },
        ]

  // Playable verified video embed URL
  const videoEmbedUrl = getYouTubeEmbedUrl(product.videoUrl, product.category, product.brand)
  const hasOfficialMilanoteDoc = Boolean(
    (product.datasheetUrl && product.datasheetUrl.trim()) ||
      (product.brochureUrl && product.brochureUrl.trim())
  )
  const datasheetDownloadUrl =
    (product.datasheetUrl && product.datasheetUrl.trim()) ||
    (product.brochureUrl && product.brochureUrl.trim()) ||
    `${API_BASE_URL}/products/${encodeURIComponent(product.slug)}/datasheet`
  const productCode = `SBM-${product.slug.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 8)}`

  return (
    <div className="bg-[#F8F9FA] min-h-screen">
      {/* =====================================================================
          SECTION 1: TOP HERO 
      ===================================================================== */}
      <section className="pt-6 pb-12">
        <div className="sudabelt-container">
          {/* Breadcrumbs + See Other Product Categories Toggle */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <nav className="flex flex-wrap items-center gap-2 text-xs text-sudabelt-muted">
              <Link to="/" className="hover:text-sudabelt-navy transition-colors">
                Home
              </Link>
              <span>/</span>
              <Link to="/products" className="hover:text-sudabelt-navy transition-colors">
                Portfolio
              </Link>
              <span>/</span>
              <Link
                to={`/products?category=${product.category}`}
                className="hover:text-sudabelt-navy transition-colors font-medium text-sudabelt-body"
              >
                {categoryDisplay}
              </Link>
              <span>/</span>
              <span className="text-sudabelt-navy font-semibold truncate max-w-xs">
                {product.name}
              </span>
            </nav>

            <button
              type="button"
              onClick={() => setShowCategoriesBar((prev) => !prev)}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-control bg-white border border-sudabelt-border hover:border-sudabelt-green text-sudabelt-navy hover:text-sudabelt-green text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer shadow-2xs"
            >
              <Layers className="w-3.5 h-3.5 text-sudabelt-green" />
              <span>See Other Product Categories</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  showCategoriesBar ? 'rotate-180' : ''
                }`}
              />
            </button>
          </div>

          {/* Expandable Product Category Filter Bar (matching main Products page) */}
          {showCategoriesBar && (
            <div className="mb-6 border-t-2 border-sudabelt-green border-b border-sudabelt-border bg-white rounded-b-lg shadow-xs px-4">
              <div
                className="flex items-center gap-6 sm:gap-8 overflow-x-auto no-scrollbar [&::-webkit-scrollbar]:hidden"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {PORTFOLIO_CATEGORIES.map((cat) => {
                  const isActive = product.category === cat.slug
                  const targetUrl =
                    cat.slug === 'all' ? '/products' : `/products?category=${cat.slug}`
                  return (
                    <Link
                      key={cat.slug}
                      to={targetUrl}
                      className={`py-3.5 text-xs sm:text-[13px] font-bold whitespace-nowrap border-b-2 transition-colors ${
                        isActive
                          ? 'border-sudabelt-green text-sudabelt-green'
                          : 'border-transparent text-sudabelt-body hover:text-sudabelt-navy'
                      }`}
                    >
                      {cat.shortLabel}
                    </Link>
                  )
                })}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* LEFT COLUMN (~60%): PRODUCT IMAGE VIEWER + THUMBNAILS + SHARE */}
            <div className="lg:col-span-7 bg-white rounded-lg border border-sudabelt-border p-6">
              <div className="relative rounded-xl bg-[#F6F8FA] min-h-95 sm:min-h-110 flex items-center justify-center p-6 overflow-hidden group">
                <span className="absolute top-3 left-3 px-3 py-1 rounded text-[10.5px] font-bold tracking-wide uppercase bg-sudabelt-navy text-white z-10">
                  {isConsumable ? 'Consumable' : 'Medical Equipment'}
                </span>

                {images.length > 1 && (
                  <span className="absolute top-3 right-3 font-mono text-[11px] font-semibold text-sudabelt-navy bg-white/90 px-2.5 py-0.5 rounded border border-sudabelt-border z-10">
                    {selectedImageIdx + 1} / {images.length}
                  </span>
                )}

                {activeImage ? (
                  <img
                    src={activeImage}
                    alt={`${product.name} view ${selectedImageIdx + 1}`}
                    className="max-h-76 sm:max-h-92 w-auto object-contain mx-auto transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="text-sm text-sudabelt-muted">Product visual</div>
                )}
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {images.map((imgUrl, idx) => {
                    const isSelected = selectedImageIdx === idx
                    const modelLabel = getImageModelLabel(imgUrl)
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedImageIdx(idx)}
                        className={`rounded-xl bg-[#F6F8FA] p-2 flex flex-col items-center justify-center border-2 transition-all cursor-pointer overflow-hidden ${
                          modelLabel ? 'h-24' : 'h-20'
                        } ${
                          isSelected
                            ? 'border-sudabelt-blue bg-white shadow-xs ring-2 ring-sudabelt-blue/20'
                            : 'border-sudabelt-border hover:border-sudabelt-navy/40'
                        }`}
                      >
                        <img
                          src={imgUrl}
                          alt={modelLabel || `${product.name} thumbnail ${idx + 1}`}
                          className="max-h-14 w-auto object-contain"
                        />
                        {modelLabel && (
                          <span className="mt-1 text-[10px] font-bold text-sudabelt-navy truncate max-w-full">
                            {modelLabel}
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>
              )}

              {/* Share With Others (Konga style) */}
              <div className="mt-6 pt-4 border-t border-sudabelt-border flex items-center justify-between text-xs text-sudabelt-muted">
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-sudabelt-navy">Share with others:</span>
                  <button
                    type="button"
                    onClick={handleShare}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-sudabelt-border text-sudabelt-navy hover:bg-sudabelt-surface text-xs font-medium cursor-pointer transition-colors"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share Link</span>
                  </button>
                </div>

                <div className="text-[11px] font-mono text-sudabelt-muted">
                  Code: {productCode}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN (~40%): KONGA BUY/PROCUREMENT BOX + DELIVERY CARDS */}
            <div className="lg:col-span-5 space-y-4">

              {/* Card 2: Main Procurement Buy Box */}
              <div className="bg-white rounded-lg border border-sudabelt-border p-6 shadow-xs space-y-4">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-sudabelt-green">
                      {categoryDisplay}
                    </span>
                    <span className="text-[10.5px] font-mono font-medium text-sudabelt-muted">
                      {productCode}
                    </span>
                  </div>

                  <h1 className="text-xl sm:text-2xl font-extrabold text-sudabelt-navy leading-snug mt-1">
                    {product.name}
                  </h1>

                  {!isConsumable && product.brand && (
                    <p className="text-xs text-sudabelt-muted mt-1 font-medium">
                      Brand: <strong className="text-sudabelt-navy">{product.brand}</strong>
                    </p>
                  )}
                </div>

                {/* Procurement Pricing / Quote Status */}
                <div className="p-3.5 rounded-xl bg-[#F6F8FA] border border-sudabelt-border flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-sudabelt-muted block">
                      Procurement Status
                    </span>
                    <span className="text-base font-extrabold text-sudabelt-navy">
                      Institutional Quote
                    </span>
                  </div>
                  <span className="px-2.5 py-1 rounded-md text-[10.5px] font-extrabold bg-[#EAF4EE] text-sudabelt-green border border-sudabelt-green/30">
                    Turnkey Package
                  </span>
                </div>

                {/* Quantity Selector */}
                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs font-bold text-sudabelt-navy">Quantity:</span>
                  <div className="flex items-center border border-sudabelt-border rounded-lg bg-white overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="w-8 h-8 flex items-center justify-center text-sudabelt-navy hover:bg-sudabelt-surface transition-colors cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-10 text-center font-bold text-sm text-sudabelt-navy">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => q + 1)}
                      className="w-8 h-8 flex items-center justify-center text-sudabelt-navy hover:bg-sudabelt-surface transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Dual Action Buttons (Konga Style) */}
                <div className="space-y-2.5 pt-1">
                  <button
                    type="button"
                    onClick={() => handleAddSingleToQuote(product, quantity)}
                    className={`w-full h-12 rounded-control font-extrabold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xs ${
                      inTray
                        ? 'bg-sudabelt-green text-white hover:bg-sudabelt-green/95'
                        : 'bg-sudabelt-blue hover:bg-sudabelt-green text-white hover:shadow-md'
                    }`}
                  >
                    <span>{inTray ? 'ADDED TO RFQ TRAY' : 'ADD TO RFQ TRAY'}</span>
                    {inTray ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </button>

                  <Link
                    to="/rfq"
                    className="w-full h-11 rounded-control bg-sudabelt-navy hover:bg-sudabelt-green text-white font-extrabold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-xs text-center"
                  >
                    <span>REQUEST TURNKEY QUOTE</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  {!isConsumable && (
                    <button
                      type="button"
                      onClick={() => setIsDatasheetModalOpen(true)}
                      className="w-full h-10 rounded-control border border-sudabelt-border hover:border-sudabelt-navy hover:bg-sudabelt-surface text-sudabelt-navy font-bold text-[11px] uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>DOWNLOAD OFFICIAL PDF BROCHURE</span>
                    </button>
                  )}
                </div>

                {/* Call us for Bulk Purchases (Moved below the 3 CTA buttons) */}
                <a
                  href="tel:+2349135733876"
                  className="block p-3 rounded-xl border border-dashed border-sudabelt-blue/60 bg-sudabelt-blue/5 hover:bg-sudabelt-blue/10 text-center transition-colors group cursor-pointer"
                >
                  <span className="text-[10.5px] font-bold text-sudabelt-muted block">
                    Call us for Hospital Tenders &amp; Bulk Procurement
                  </span>
                  <span className="text-xs sm:text-[13px] font-extrabold text-sudabelt-navy group-hover:text-sudabelt-blue transition-colors flex flex-wrap items-center justify-center gap-1.5 mt-0.5">
                    <PhoneCall className="w-3.5 h-3.5 text-sudabelt-green shrink-0" />
                    <span>+234 913 573 3876 · +234 906 411 1469</span>
                  </span>
                </a>

              </div>

              {/* Card 3: Delivery & Returns Assurance (Konga style) */}
              <div className="bg-white rounded-lg border border-sudabelt-border p-5 space-y-3.5">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-sudabelt-navy">
                  Delivery &amp; Technical Support
                </h4>

                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-sudabelt-blue/15 text-sudabelt-blue flex items-center justify-center shrink-0 mt-0.5">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div className="text-xs">
                    <strong className="text-sudabelt-navy block font-bold">Fast Hospital Delivery</strong>
                    <p className="text-sudabelt-body mt-0.5 leading-relaxed">
                      Estimated dispatch 24-48 hours. Express emergency air and road logistics for active clinical setups.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-sudabelt-green/15 text-sudabelt-green flex items-center justify-center shrink-0 mt-0.5">
                    <RotateCcw className="w-4 h-4" />
                  </div>
                  <div className="text-xs">
                    <strong className="text-sudabelt-navy block font-bold">Turnkey Pre-Installation Audit</strong>
                    <p className="text-sudabelt-body mt-0.5 leading-relaxed">
                      Engineering inspection of power, RO water quality, and medical gas manifold prior to commissioning.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-sudabelt-navy/15 text-sudabelt-navy flex items-center justify-center shrink-0 mt-0.5">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div className="text-xs">
                    <strong className="text-sudabelt-navy block font-bold">OEM Warranty &amp; Certified Staff Training</strong>
                    <p className="text-sudabelt-body mt-0.5 leading-relaxed">
                      Includes on-site clinical nurse application specialist certification.
                    </p>
                  </div>
                </div>
              </div>


            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 3: KONGA LOWER HALF (PRODUCT DESCRIPTION, SPECS TABLE & VIDEO)
      ===================================================================== */}
      <section className="py-14 sm:py-18 bg-white border-b border-sudabelt-border">
        <div className="sudabelt-container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* LEFT COLUMN (~65%): DESCRIPTION, SPECS TABLE, KEY FEATURES, VIDEO */}
            <div className="lg:col-span-8 space-y-10">
              {/* Product Description */}
              <div>
                <h3 className="text-lg sm:text-xl font-extrabold text-sudabelt-navy mb-3 pb-2 border-b border-sudabelt-border">
                  Product Description
                </h3>
                {summaryText ? (
                  <p className="text-sm sm:text-[15px] text-sudabelt-body leading-relaxed">
                    {summaryText}
                  </p>
                ) : (
                  <p className="text-sm text-sudabelt-muted">
                    Official technical documentation available upon request.
                  </p>
                )}

                {uniqueSellingPoint && (
                  <div className="mt-4 p-4 rounded-xl bg-[#EAF4EE] border border-sudabelt-green/20">
                    <div className="flex items-center gap-2 text-sudabelt-green text-xs font-bold uppercase tracking-wider mb-1">
                      <span>Key Advantage</span>
                    </div>
                    <p className="text-xs sm:text-sm text-sudabelt-navy leading-relaxed font-medium">
                      {uniqueSellingPoint}
                    </p>
                  </div>
                )}

                {/* Common Clinical Applications */}
                {commonUses.length > 0 && (
                  <div className="mt-5 pt-4 border-t border-sudabelt-border">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-sudabelt-green mb-2.5">
                      Common Clinical Applications
                    </h4>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-[13px] text-sudabelt-body">
                      {commonUses.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-sudabelt-green shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Specifications Matrix Table (Konga 2-Column Zebra Style) */}
              <div>
                <h3 className="text-lg sm:text-xl font-extrabold text-sudabelt-navy mb-3 pb-2 border-b border-sudabelt-border">
                  Specification Matrix
                </h3>
                <div className="border border-sudabelt-border rounded-xl overflow-hidden text-xs sm:text-sm">
                  <div className="grid grid-cols-2 p-3 bg-[#F6F8FA] border-b border-sudabelt-border">
                    <span className="font-semibold text-sudabelt-muted">Clinical Category</span>
                    <span className="font-bold text-sudabelt-navy">{categoryDisplay}</span>
                  </div>
                  {!isConsumable && product.brand && (
                    <div className="grid grid-cols-2 p-3 bg-white border-b border-sudabelt-border">
                      <span className="font-semibold text-sudabelt-muted">OEM Manufacturer</span>
                      <span className="font-bold text-sudabelt-navy">{product.brand}</span>
                    </div>
                  )}
                  <div className="grid grid-cols-2 p-3 bg-[#F6F8FA] border-b border-sudabelt-border">
                    <span className="font-semibold text-sudabelt-muted">Item Type</span>
                    <span className="font-bold text-sudabelt-navy">
                      {isConsumable ? 'Genuine Medical Consumable' : 'Hospital Medical Equipment'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 p-3 bg-white border-b border-sudabelt-border">
                    <span className="font-semibold text-sudabelt-muted">Installation &amp; Integration</span>
                    <span className="font-bold text-sudabelt-navy">
                      Turnkey Site Engineering &amp; Commissioning
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 p-3 bg-[#F6F8FA] border-b border-sudabelt-border">
                    <span className="font-semibold text-sudabelt-muted">Consumables Availability</span>
                    <span className="font-bold text-sudabelt-navy">
                      Guaranteed Local Buffer Stock in Nigeria
                    </span>
                  </div>
                
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN (~35%): SELLER INFORMATION (KONGA STYLE) */}
            <div className="lg:col-span-4 space-y-5">
              {/* Konga-Style Seller Information Card */}
              <div className="bg-white rounded-2xl border border-sudabelt-border p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-sudabelt-border">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-sudabelt-navy">
                    Supplier Information
                  </h4>
                  <Link
                    to="/about"
                    className="text-xs font-bold text-sudabelt-blue hover:text-sudabelt-navy"
                  >
                    View Profile
                  </Link>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-sudabelt-navy text-white flex items-center justify-center font-extrabold text-xl shadow-xs">
                    S
                  </div>
                  <div>
                    <h5 className="font-extrabold text-sudabelt-navy text-sm leading-tight">
                      Sudabelt Medical
                    </h5>
                    <p className="text-[11px] text-sudabelt-muted">
                      10+ Years Advancing Healthcare in Africa
                    </p>
                  </div>
                </div>

                {/* Seller Metrics (Konga Style) */}
                <div className="space-y-2.5 pt-2 text-xs">
                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-sudabelt-muted">Engineering Quality</span>
                      <span className="font-bold text-sudabelt-green">100% Certified</span>
                    </div>
                    <div className="w-full h-1.5 bg-sudabelt-surface rounded-full overflow-hidden">
                      <div className="w-full h-full bg-sudabelt-green rounded-full" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-sudabelt-muted">Turnkey Delivery Rate</span>
                      <span className="font-bold text-sudabelt-blue">99.8%</span>
                    </div>
                    <div className="w-full h-1.5 bg-sudabelt-surface rounded-full overflow-hidden">
                      <div className="w-[99.8%] h-full bg-sudabelt-blue rounded-full" />
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-sudabelt-border flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[#FF9900]">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-3.5 h-3.5 fill-[#FF9900]" />
                    ))}
                    <span className="text-xs font-bold text-sudabelt-navy ml-1">5.0 / 5.0</span>
                  </div>
                  <span className="text-[11px] text-sudabelt-muted">Hospital Verified</span>
                </div>
              </div>

              {/* Floating Quick Action Mini-Box */}
              <div className="bg-white rounded-2xl border border-sudabelt-border p-5 shadow-xs flex items-center gap-3.5">
                {activeImage && (
                  <img
                    src={activeImage}
                    alt={product.name}
                    className="w-14 h-14 object-contain rounded-lg bg-[#F6F8FA] p-1 border border-sudabelt-border shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <h6 className="text-xs font-bold text-sudabelt-navy truncate">
                    {product.name}
                  </h6>
                  <button
                    type="button"
                    onClick={() => handleAddSingleToQuote(product, 1)}
                    className="mt-1 text-[11px] font-extrabold text-sudabelt-blue hover:text-sudabelt-navy cursor-pointer"
                  >
                    + Add to RFQ Tray
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* blue background section  */}
      <section className="relative py-20 sm:py-24 bg-[#07172B] overflow-hidden">
        {/* Modern hospital room background with exact duotone gradient */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-98 pointer-events-none"
          style={{ backgroundImage: `url('/images/product-details.webp')` }}
        />
        <div className="absolute inset-0 bg-linear-to-r from-[#07172B] via-[#07172B]/90 to-[#07172B]/75 pointer-events-none" />

        <div className="relative z-10 sudabelt-container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            {/* Left Column: Heading */}
            <div className="lg:col-span-5">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white/80 block mb-3">
                CLINICAL FEATURES
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-white leading-[1.15] tracking-tight">
                Built for Stability,
                <br />
                Simplicity and
                <br />
                Measurable Dose.
              </h2>
              <p className="text-sm text-white/75 mt-4 leading-relaxed max-w-md">
                Engineered for maximum patient safety, automated decontamination protocols, and uncompromised dialysis efficacy.
              </p>
            </div>

            {/* Right Column: Exact 3 Stacked Transparent Cards */}
            <div className="lg:col-span-7 space-y-4 sm:space-y-5">
              {displayFeatures.slice(0, 3).map((feat, idx) => (
                <div
                  key={idx}
                  className="border border-white/20 hover:border-white/50 rounded-2xl p-6 sm:p-7 bg-white/4 backdrop-blur-xs transition-all duration-300"
                >
                  <div className="grid grid-cols-[38px_1fr] items-start gap-4">
                    <span className="text-xs font-mono font-medium text-white/60 pt-0.5">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <h3 className="text-lg sm:text-[19px] font-bold text-white leading-snug">
                        {feat.title}
                      </h3>
                      {feat.desc ? (
                        <p className="text-sm text-white/80 leading-relaxed mt-1.5 font-normal">
                          {feat.desc}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 4 & 5: OTHER INFORMATION + PRODUCT VIDEO (SIDE-BY-SIDE)
      ===================================================================== */}
      {(otherInformation.length > 0 || !isConsumable) && (
        <section className="py-14 sm:py-16 bg-white border-b border-sudabelt-border">
          <div className="sudabelt-container">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
              {/* Left Column: Other Information */}
              {otherInformation.length > 0 && (
                <div className={!isConsumable ? 'lg:col-span-6' : 'lg:col-span-12'}>
                  <div className="pb-3 border-b border-sudabelt-border mb-4">
                    <span className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-sudabelt-green block">
                      TECHNICAL DETAILS
                    </span>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-sudabelt-navy mt-1">
                      Other Information
                    </h2>
                  </div>
                  <ul className="space-y-3">
                    {otherInformation.map((info, idx) => (
                      <li
                        key={idx}
                        className="p-4 rounded-xl bg-[#F6F8FA] border border-sudabelt-border text-xs sm:text-sm text-sudabelt-body leading-relaxed flex items-start gap-2.5"
                      >
                        <span className="w-2 h-2 rounded-full bg-sudabelt-green shrink-0 mt-1.5" />
                        <span>{info}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Right Column: Product Video Demonstration */}
              {!isConsumable && (
                <div className={otherInformation.length > 0 ? 'lg:col-span-6' : 'lg:col-span-7'}>
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-sudabelt-border mb-4">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-sudabelt-green block">
                        EQUIPMENT OVERVIEW
                      </span>
                      <h2 className="text-xl sm:text-2xl font-extrabold text-sudabelt-navy mt-1">
                        Product Video Demonstration
                      </h2>
                    </div>
                    <a
                      href={videoEmbedUrl.replace('/embed/', '/watch?v=').replace('?autoplay=1&mute=0&rel=0', '')}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-sudabelt-blue hover:text-sudabelt-navy inline-flex items-center gap-1"
                    >
                      <span>Open on YouTube</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  <p className="text-xs sm:text-sm text-sudabelt-body mb-4">
                    Watch the clinical equipment overview, operational demonstration, and technology features in action.
                  </p>

                  <div className="w-full rounded-2xl overflow-hidden bg-black aspect-video shadow-md border border-sudabelt-border relative">
                    {isPlayingVideo ? (
                      <iframe
                        src={videoEmbedUrl}
                        title={`${product.name} Clinical Equipment Demonstration`}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                      />
                    ) : (
                      <button
                        type="button"
                        onClick={() => setIsPlayingVideo(true)}
                        className="w-full h-full relative flex items-center justify-center group cursor-pointer bg-linear-to-br from-[#1E293B] to-[#0F172A]"
                      >
                        {activeImage && (
                          <img
                            src={activeImage}
                            alt={product.name}
                            className="max-h-48 sm:max-h-56 w-auto object-contain opacity-75 group-hover:scale-105 transition-transform duration-300"
                          />
                        )}
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/25 transition-colors flex items-center justify-center">
                          <div className="w-16 h-12 rounded-xl bg-[#FF0000] group-hover:bg-[#CC0000] text-white flex items-center justify-center shadow-2xl transition-transform group-hover:scale-110">
                            <Play className="w-6 h-6 fill-white ml-0.5" />
                          </div>
                        </div>
                        <span className="absolute bottom-4 left-4 right-4 text-center text-xs font-bold text-white bg-black/70 py-1.5 px-3 rounded-lg backdrop-blur-xs">
                          Click to play clinical demonstration video
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* =====================================================================
          SECTION 6: FREQUENTLY ASKED QUESTIONS (BEFORE AVAILABLE CONSUMABLES)
      ===================================================================== */}
      {faqsList.length > 0 && (
        <section className="py-16 sm:py-20 bg-white border-b border-sudabelt-border">
          <div className="sudabelt-container">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              <div className="lg:col-span-4">
                <span className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-sudabelt-green block">
                  QUESTIONS
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-sudabelt-navy mt-1">
                  Frequently Asked
                </h2>
              </div>

              <div className="lg:col-span-8 divide-y divide-sudabelt-border">
                {faqsList.map((faq, idx) => {
                  const isOpen = openFaqIdx === idx
                  return (
                    <div key={idx} className="py-4 first:pt-0">
                      <button
                        type="button"
                        onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                        className="w-full flex items-center justify-between gap-4 text-left py-2 cursor-pointer group"
                      >
                        <span className="text-sm sm:text-base font-extrabold text-sudabelt-navy group-hover:text-sudabelt-green transition-colors">
                          {faq.question}
                        </span>
                        <span
                          className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                            isOpen
                              ? 'bg-sudabelt-navy text-white'
                              : 'border border-sudabelt-border text-sudabelt-navy'
                          }`}
                        >
                          {isOpen ? '-' : '+'}
                        </span>
                      </button>

                      <div
                        className={`grid transition-all duration-500 ease-in-out ${
                          isOpen ? 'grid-rows-[1fr] opacity-100 mt-2' : 'grid-rows-[0fr] opacity-0'
                        }`}
                      >
                        <div className="overflow-hidden">
                          <p className="text-xs sm:text-sm text-sudabelt-body leading-relaxed pb-2 max-w-2xl">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* =====================================================================
          SECTION 7: AVAILABLE CONSUMABLES (AFTER FAQs)
      ===================================================================== */}
      {availableConsumables.length > 0 && (
        <section className="py-16 sm:py-20 bg-[#F4F7F9] border-b border-sudabelt-border">
          <div className="sudabelt-container">
            <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-sudabelt-green block">
                  MEDICAL CONSUMABLES
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-sudabelt-navy mt-1">
                  Available Consumables
                </h2>
                <p className="text-xs sm:text-sm text-sudabelt-body mt-1">
                  Genuine clinical consumables, cartridges, and accessories available for this category.
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddAllConsumablesToQuote}
                className="h-11 px-5 rounded-control border border-sudabelt-navy/40 hover:border-sudabelt-navy hover:bg-sudabelt-navy text-sudabelt-navy hover:text-white font-extrabold text-xs uppercase tracking-wider transition-colors cursor-pointer inline-flex items-center gap-2 shadow-xs"
              >
                <Layers className="w-4 h-4" />
                <span>ADD ALL TO QUOTE</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {availableConsumables.map((item) => {
                const itemImg = getAllProductImages(item)[0] || ''
                const inItemTray = isInTray(item._id || item.slug)
                return (
                  <div
                    key={item._id || item.slug}
                    className="rounded-2xl bg-white border border-sudabelt-border p-4 flex flex-col justify-between hover:border-sudabelt-green/60 hover:shadow-card hover:-translate-y-1 transition-all duration-300 group"
                  >
                    <div>
                      {/* Big prominent consumable image */}
                      <div className="rounded-xl bg-[#EAEFF2] h-48 sm:h-52 p-4 flex items-center justify-center overflow-hidden relative">
                        <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded text-[9.5px] font-bold tracking-wide bg-sudabelt-blue text-white z-10">
                          Consumable
                        </span>
                        {itemImg ? (
                          <img
                            src={itemImg}
                            alt={item.name}
                            loading="lazy"
                            className="max-h-36 sm:max-h-40 w-auto object-contain mx-auto group-hover:scale-108 transition-transform duration-300"
                          />
                        ) : (
                          <div className="text-xs text-sudabelt-muted">Product visual</div>
                        )}
                      </div>

                      {/* Name */}
                      <div className="pt-4 px-1">
                        <span className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-sudabelt-green block">
                          {item.categoryLabel || item.category.replace(/-/g, ' ')}
                        </span>
                        <h3 className="text-base sm:text-[17px] font-extrabold text-sudabelt-navy mt-1 leading-snug">
                          {item.name}
                        </h3>
                      </div>
                    </div>

                    {/* Quantity Stepper + Add to Quote Button */}
                    <div className="mt-5 pt-2 px-1 flex items-center gap-2">
                      {(() => {
                        const itemId = item._id || item.slug
                        const trayEntry = selectedItems.find((i) => i.id === itemId)
                        const currentQty = trayEntry ? trayEntry.quantity : consumableQtys[itemId] || 1
                        return (
                          <>
                            <div className="inline-flex items-center h-10 rounded-control border border-sudabelt-border bg-white overflow-hidden shrink-0">
                              <button
                                type="button"
                                aria-label="Decrease quantity"
                                onClick={() => {
                                  if (trayEntry) {
                                    updateQuantity(itemId, trayEntry.quantity - 1)
                                  } else {
                                    setConsumableQtys((prev) => ({
                                      ...prev,
                                      [itemId]: Math.max(1, (prev[itemId] || 1) - 1),
                                    }))
                                  }
                                }}
                                className="w-8 h-full flex items-center justify-center text-sudabelt-navy hover:bg-sudabelt-surface transition-colors cursor-pointer"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="w-7 text-center text-xs font-extrabold text-sudabelt-navy select-none">
                                {currentQty}
                              </span>
                              <button
                                type="button"
                                aria-label="Increase quantity"
                                onClick={() => {
                                  if (trayEntry) {
                                    updateQuantity(itemId, trayEntry.quantity + 1)
                                  } else {
                                    setConsumableQtys((prev) => ({
                                      ...prev,
                                      [itemId]: (prev[itemId] || 1) + 1,
                                    }))
                                  }
                                }}
                                className="w-8 h-full flex items-center justify-center text-sudabelt-navy hover:bg-sudabelt-surface transition-colors cursor-pointer"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleAddSingleToQuote(item, currentQty)}
                              className={`flex-1 h-10 px-3 rounded-control font-extrabold text-[11px] uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center text-center ${
                                inItemTray
                                  ? 'bg-sudabelt-green text-white'
                                  : 'bg-sudabelt-blue hover:bg-sudabelt-green text-white'
                              }`}
                            >
                              {inItemTray ? 'IN TRAY' : '+ ADD'}
                            </button>
                          </>
                        )
                      })()}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* =====================================================================
          SECTION 8: SEE OTHER PRODUCT CATEGORIES (CATEGORY FILTER BAR)
      ===================================================================== */}
      <section className="py-12 bg-white border-t border-sudabelt-border">
        <div className="sudabelt-container">
          <div className="mb-4">
            <span className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-sudabelt-green block">
              EXPLORE PORTFOLIO
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-sudabelt-navy mt-1">
              See Other Product Categories
            </h2>
          </div>

          <div className="border-t-2 border-sudabelt-green border-b border-sudabelt-border bg-white">
            <div
              className="flex items-center gap-6 sm:gap-8 overflow-x-auto no-scrollbar [&::-webkit-scrollbar]:hidden"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {PORTFOLIO_CATEGORIES.map((cat) => {
                const isActive = product.category === cat.slug
                const targetUrl =
                  cat.slug === 'all' ? '/products' : `/products?category=${cat.slug}`
                return (
                  <Link
                    key={cat.slug}
                    to={targetUrl}
                    className={`py-4 text-xs sm:text-[13px] font-bold whitespace-nowrap border-b-2 transition-colors ${
                      isActive
                        ? 'border-sudabelt-green text-sudabelt-green'
                        : 'border-transparent text-sudabelt-body hover:text-sudabelt-navy'
                    }`}
                  >
                    {cat.shortLabel}
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Lead Magnet Modal for PDF Brochure / Datasheet Download */}
      <LeadMagnetModal
        isOpen={isDatasheetModalOpen}
        onClose={() => setIsDatasheetModalOpen(false)}
        assetTitle={`${product.name} - ${hasOfficialMilanoteDoc ? 'Official Document' : 'Product Summary'}`}
        assetSlug={`${product.slug}-brochure`}
        directDownloadUrl={datasheetDownloadUrl}
        description={`Enter your work email and organization to immediately download the ${hasOfficialMilanoteDoc ? 'official manufacturer document' : 'product summary PDF'} for ${product.name}.`}
        buttonLabel={hasOfficialMilanoteDoc ? 'Download Official Document' : 'Download Summary PDF'}
        leadSource="Product Datasheet"
      />
    </div>
  )
}

export default ProductDetailPage
