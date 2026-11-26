import React, { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useInView, type PanInfo } from 'framer-motion'
import { SectionReveal } from '../common/Reveal'

interface AboutHeroSlide {
  id: string
  title: string
  paragraphs: string[]
}

const ABOUT_HERO_SLIDES: AboutHeroSlide[] = [
  {
    id: 'who-we-are',
    title: 'Who We Are',
    paragraphs: [
      'Sudabelt Medical is a leading integrated healthcare solutions company dedicated to transforming healthcare delivery across Africa through innovative technologies, strategic partnerships, and end-to-end healthcare support services.',
    ],
  },
  {
    id: 'what-we-do',
    title: 'What We Do',
    paragraphs: [
      'We provide comprehensive healthcare solutions spanning diagnostic imaging, renal and critical care, laboratory diagnostics, blood management technologies, minimally invasive surgery, respiratory care, healthcare infrastructure development, biomedical engineering services, and professional healthcare training.',
      'By combining world-class medical technologies with local expertise and technical excellence, we support healthcare institutions in delivering safer, more efficient, and patient-centered care.',
    ],
  },
  {
    id: 'where-we-are',
    title: 'Where We Are',
    paragraphs: [
      'Headquartered in Lagos, Nigeria, with regional offices in Abuja and Kano, Sudabelt serves healthcare institutions across all 36 states of Nigeria and the Federal Capital Territory, with a growing footprint across Sub-Saharan Africa.',
      'To enhance accessibility and continuity of care, we have strategically located medical supply outlets within selected teaching and specialist hospitals across Nigeria, providing healthcare institutions and patients with convenient access to essential medical consumables.',
      'Our extensive network, strategic partnerships, and highly skilled workforce enable us to provide timely support and sustainable healthcare solutions wherever they are needed.',
    ],
  },
]

interface AnimatedCounterProps {
  value: number
  duration?: number
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({ value, duration = 1.8 }) => {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: false, amount: 0.3 })

  useEffect(() => {
    if (!inView) {
      setCount(0)
      return
    }

    let startTime: number | null = null
    let frameId: number

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1)
      // Ease out expo
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
      setCount(Math.floor(easeProgress * value))

      if (progress < 1) {
        frameId = requestAnimationFrame(step)
      } else {
        setCount(value)
      }
    }

    frameId = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frameId)
  }, [inView, value, duration])

  return <span ref={ref}>{count}</span>
}

const AboutHeroSection: React.FC = () => {
  const [activeSlide, setActiveSlide] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    if (isPaused) return
    const timer = window.setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % ABOUT_HERO_SLIDES.length)
    }, 5000)
    return () => window.clearInterval(timer)
  }, [isPaused, activeSlide])

  const currentSlide = ABOUT_HERO_SLIDES[activeSlide]

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x < -45) {
      setActiveSlide((prev) => (prev + 1) % ABOUT_HERO_SLIDES.length)
    } else if (info.offset.x > 45) {
      setActiveSlide((prev) => (prev - 1 + ABOUT_HERO_SLIDES.length) % ABOUT_HERO_SLIDES.length)
    }
  }

  return (
    <section className="relative bg-sudabelt-navy text-white overflow-hidden">
      {/* Desktop (lg+): Full-bleed background team photo with navy overlay */}
      <div className="hidden lg:block absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          src="/images/about/about-hero.webp"
          alt="Sudabelt Medical Team"
          fetchPriority="high"
          decoding="async"
          className="w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-[#06183d]/62" />
      </div>

      {/* Mobile & Tablet (< lg): Full uncropped landscape team photo stacked above content */}
      <div className="lg:hidden relative w-full bg-sudabelt-navy overflow-hidden">
        <img
          src="/images/about/about-hero.webp"
          alt="Sudabelt Medical Team"
          fetchPriority="high"
          decoding="async"
          className="w-full h-auto block"
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-14"
          style={{
            background: 'linear-gradient(to bottom, rgba(0, 17, 66, 0) 0%, #001142 100%)',
          }}
        />
      </div>

      <div className="relative z-10 sudabelt-container pt-6 sm:pt-8 lg:pt-18 pb-12 lg:pb-16">
        <div
          className="max-w-2xl lg:max-w-3xl"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onFocus={() => setIsPaused(true)}
          onBlur={() => setIsPaused(false)}
        >
          {/* Static Eyebrow with red highlight bar */}
          <SectionReveal direction="up" delay={0.1}>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 sm:w-10 h-0.75 bg-sudabelt-red rounded-xs" />
              <span className="inline-block px-3.5 py-1 rounded-control bg-sudabelt-blue text-white text-[12px] sm:text-[13px] font-extrabold uppercase tracking-[0.14em] shadow-sm">
                About Sudabelt
              </span>
            </div>
          </SectionReveal>

          {/* Sliding Content Area Only (Who We Are -> What We Do -> Where We Are) */}
          <div className="min-h-[205px] sm:min-h-[190px] flex flex-col justify-start overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide.id}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.18}
                onDragEnd={handleDragEnd}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="cursor-grab active:cursor-grabbing select-none"
              >
                <h1 className="text-2xl sm:text-3xl lg:text-[42px] font-extrabold text-white leading-[1.12] tracking-tight mb-2.5">
                  {currentSlide.title}
                </h1>
                <div className="space-y-2 text-[14.5px] sm:text-[15.5px] lg:text-[16px] text-white/92 leading-[1.48] font-normal">
                  {currentSlide.paragraphs.map((paragraph, pIdx) => (
                    <p key={pIdx}>{paragraph}</p>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Progress Dots */}
          <div className="mt-4 flex items-center gap-2">
            {ABOUT_HERO_SLIDES.map((slide, idx) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => setActiveSlide(idx)}
                aria-label={`Go to ${slide.title}`}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === activeSlide ? 'w-8 bg-sudabelt-blue' : 'w-2 bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Measured Green Stat Strip (#006837) with Animated KPIs */}
      <div className="relative z-10 bg-sudabelt-green text-white border-t border-white/10">
        <div className="sudabelt-container py-8 sm:py-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 divide-y lg:divide-y-0 lg:divide-x divide-white/15">
            {/* KPI 1: 29 */}
            <SectionReveal direction="up" delay={0.1} className="flex flex-col justify-center">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight font-mono">
                <AnimatedCounter value={29} duration={1.6} />
              </div>
              <div className="text-xs sm:text-sm text-white/85 font-medium mt-1.5 leading-snug max-w-xs">
                Specialized outlets across Nigeria
              </div>
            </SectionReveal>

            {/* KPI 2: 8 Global OEM Partners */}
            <SectionReveal direction="up" delay={0.2} className="flex flex-col justify-center pt-6 sm:pt-0 lg:pl-8">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight font-mono">
                <AnimatedCounter value={8} duration={1.4} />
              </div>
              <div className="text-xs sm:text-sm text-white/85 font-medium mt-1.5 leading-snug max-w-xs">
                Global OEM manufacturer partnerships
              </div>
            </SectionReveal>

            {/* KPI 3: ISO 9001:2015 */}
            <SectionReveal direction="up" delay={0.3} className="flex flex-col justify-center pt-6 lg:pt-0 lg:pl-8">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight font-mono">
                ISO
              </div>
              <div className="text-xs sm:text-sm text-white/85 font-medium mt-1.5 leading-snug max-w-xs">
                9001:2015 Quality management certified
              </div>
            </SectionReveal>

            {/* KPI 4: 2020 */}
            <SectionReveal direction="up" delay={0.4} className="flex flex-col justify-center pt-6 sm:pt-0 lg:pl-8">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight font-mono">
                <AnimatedCounter value={2020} duration={2.0} />
              </div>
              <div className="text-xs sm:text-sm text-white/85 font-medium mt-1.5 leading-snug max-w-xs">
                Year of COVID-19 oxygen response
              </div>
            </SectionReveal>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutHeroSection
