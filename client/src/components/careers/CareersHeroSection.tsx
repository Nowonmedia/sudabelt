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
    <section className="relative w-full bg-sudabelt-navy overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[420px] lg:min-h-[480px]">
        {/* Left Text Column */}
        <div className="lg:col-span-6 z-10 px-6 sm:px-12 lg:px-16 py-14 lg:py-20 flex flex-col justify-center">
          <div className="max-w-xl">
            {/* Red Accent Bar */}
            <div className="w-10 h-1 bg-sudabelt-red mb-4" />
            <span className="text-xs uppercase tracking-widest font-bold text-sudabelt-blue block mb-3">
              CAREERS
            </span>
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
                className="inline-flex items-center justify-center px-7 py-3.5 rounded-[6px] bg-sudabelt-blue hover:bg-blue-400 text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                SHARE YOUR CV
              </a>
            </div>
          </div>
        </div>

        {/* Right Photo Column with smooth blend */}
        <div className="lg:col-span-6 relative min-h-[280px] lg:min-h-full">
          <img
            src="/images/careers/careers-hero.webp"
            alt="Sudabelt medical engineer and clinical specialist"
            className="w-full h-full object-cover object-center"
          />
          {/* Subtle gradient vignette blending into navy on the left */}
          <div className="absolute inset-0 bg-gradient-to-r from-sudabelt-navy via-sudabelt-navy/20 to-transparent hidden lg:block" />
          <div className="absolute inset-0 bg-gradient-to-t from-sudabelt-navy/80 via-transparent to-transparent lg:hidden" />
        </div>
      </div>
    </section>
  )
}
