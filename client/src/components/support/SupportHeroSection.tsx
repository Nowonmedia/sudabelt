import React from 'react'

export const SupportHeroSection: React.FC = () => {
  return (
    <section className="relative w-full bg-sudabelt-navy overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[440px] lg:min-h-[480px]">
        {/* Left Side: Deep Navy Text */}
        <div className="lg:col-span-7 z-10 px-6 sm:px-12 lg:px-16 py-14 lg:py-20 flex flex-col justify-center">
          <div className="max-w-xl">
            {/* Red Accent Bar */}
            <div className="w-10 h-1 bg-sudabelt-red mb-4" />
            <span className="text-xs uppercase tracking-widest font-bold text-sudabelt-blue block mb-3">
              SUPPORT
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
              Our engineers are on standby.
            </h1>
            <p className="mt-4 text-base sm:text-lg text-gray-300 leading-relaxed max-w-lg">
              Repair, troubleshooting, servicing and training for the equipment you bought from us, with quick responses.
            </p>
            <div className="mt-8 pt-6 border-t border-white/10">
              <span className="text-xs font-mono font-semibold uppercase tracking-widest text-emerald-400">
                REPAIR · SERVICING · TRAINING
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Photo with Overlay Text */}
        <div className="lg:col-span-5 relative min-h-[300px] lg:min-h-full overflow-hidden">
          <img
            src="/images/services/service-3-biomed.jpg"
            alt="Biomedical Engineer Servicing Clinical Equipment"
            className="w-full h-full object-cover object-center"
          />
          {/* Subtle gradient vignette */}
          <div className="absolute inset-0 bg-gradient-to-r from-sudabelt-navy via-sudabelt-navy/40 to-transparent hidden lg:block" />
          <div className="absolute inset-0 bg-gradient-to-t from-sudabelt-navy/90 via-sudabelt-navy/40 to-transparent lg:hidden" />

          {/* Overlay Statement */}
          <div className="absolute bottom-8 left-8 right-8 z-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white drop-shadow-md leading-tight">
              Support that stays with you.
            </h2>
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-300 drop-shadow mt-1">
              AFTER INSTALLATION. THROUGHOUT YOUR EQUIPMENT LIFECYCLE.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SupportHeroSection
