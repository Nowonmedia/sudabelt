import React from 'react'

export const CareersHeroSection: React.FC = () => {
  const scrollToApply = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const target = document.getElementById('apply-section')
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section className="relative w-full bg-sudabelt-navy/80 overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-105 lg:min-h-120">
        {/* Left Text Column */}
        <div className="lg:col-span-6 z-10 px-6 sm:px-12 lg:px-16 py-14 lg:py-20 flex flex-col justify-center">
          <div className="max-w-xl">
            {/* Red Accent Bar + Eyebrow */}
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 sm:w-10 h-0.75 bg-sudabelt-red rounded-xs" />
              <span className="inline-block px-3.5 py-1 rounded-control bg-sudabelt-blue text-white text-[12px] sm:text-[13px] font-extrabold uppercase tracking-[0.14em] shadow-sm">
                CAREERS
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
              Join our community of experts.
            </h1>
            <p className="mt-4 text-base sm:text-lg text-gray-300 leading-relaxed max-w-lg">
              Would you like to join our team? Help us build a healthier future across Sub-Saharan Africa.
            </p>
            <div className="mt-8">
              <a
                href="#apply-section"
                onClick={scrollToApply}
                className="inline-flex items-center justify-center px-7 py-3.5 rounded-md bg-sudabelt-blue hover:bg-sudabelt-green text-white font-bold text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer"
              >
                SHARE YOUR CV
              </a>
            </div>
          </div>
        </div>

        {/* Right Photo Column with smooth blend */}
        <div className="lg:col-span-6 relative min-h-70 lg:min-h-full">
          <img
            src="/images/careers/careers-hero.webp"
            alt="Sudabelt medical engineer and clinical specialist"
            className="w-full h-full object-cover object-center"
          />
          {/* Subtle gradient vignette blending into navy on the left */}
          <div className="absolute inset-0 bg-linear-to-r from-sudabelt-navy via-sudabelt-navy/20 to-transparent hidden lg:block" />
          <div className="absolute inset-0 bg-linear-to-t from-sudabelt-navy/80 via-transparent to-transparent lg:hidden" />
        </div>
      </div>
    </section>
  )
}
