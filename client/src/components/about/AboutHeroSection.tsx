import React, { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'
import { HeaderTextReveal, SectionReveal } from '../common/Reveal'

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
  return (
    <section className="relative bg-sudabelt-navy text-white overflow-hidden">
      {/* Background Clinical Photo with transparent blue overlay (no gradient) */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          src="/images/about/about-hero.webp"
          alt="Sudabelt Medical Clinical Operations"
          className="w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-[#06183d]/55" />
      </div>

      <div className="relative z-10 sudabelt-container pt-16 sm:pt-20 lg:pt-26 pb-16 lg:pb-22">
        <div className="max-w-xl lg:max-w-2xl">
          {/* Eyebrow with red highlight bar */}
          <SectionReveal direction="up" delay={0.1}>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 sm:w-10 h-0.75 bg-sudabelt-red rounded-xs" />
              <span className="inline-block px-3.5 py-1 rounded-control bg-sudabelt-blue text-white text-[12px] sm:text-[13px] font-extrabold uppercase tracking-[0.14em] shadow-sm">
                About Sudabelt
              </span>
            </div>
          </SectionReveal>

          {/* Headline */}
          <HeaderTextReveal className="mb-6">
            <h1 className="text-3xl sm:text-4xl lg:text-[48px] font-extrabold text-white leading-[1.14] tracking-tight">
              Building a healthier future across Sub-Saharan Africa.
            </h1>
          </HeaderTextReveal>

          {/* Subtitle verbatim from approved copy */}
          <SectionReveal direction="up" delay={0.25}>
            <p className="text-base sm:text-lg lg:text-[18.5px] text-white/90 leading-[1.6] font-normal max-w-xl">
              Sudabelt Medical is an integrated healthcare solutions provider committed to delivering world-class medical technologies, turnkey infrastructure, and dependable biomedical support across Nigeria.
            </p>
          </SectionReveal>
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
