import React from 'react'

export const SupportHeroSection: React.FC = () => {
  return (
    <section className="relative w-full bg-sudabelt-navy/80 overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-110 lg:min-h-120">
        {/* Left Side: Deep Navy Text */}
        <div className="lg:col-span-7 z-10 px-6 sm:px-12 lg:px-16 py-14 lg:py-20 flex flex-col justify-center">
          <div className="max-w-xl">
            {/* Red Accent Bar + Eyebrow */}
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 sm:w-10 h-0.75 bg-sudabelt-red rounded-xs" />
              <span className="inline-block px-3.5 py-1 rounded-control bg-sudabelt-blue text-white text-[12px] sm:text-[13px] font-extrabold uppercase tracking-[0.14em] shadow-sm">
                SUPPORT
              </span>
            </div>
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
        <div className="lg:col-span-5 relative min-h-75 lg:min-h-full overflow-hidden">
          <img
            src="/images/services/service-3-biomed.jpg"
            alt="Biomedical Engineer Servicing Clinical Equipment"
            className="w-full h-full object-cover object-center"
          />
          {/* Subtle gradient vignette */}
          <div className="absolute inset-0 bg-linear-to-r from-sudabelt-navy via-sudabelt-navy/40 to-transparent hidden lg:block" />
          <div className="absolute inset-0 bg-linear-to-t from-sudabelt-navy/90 via-sudabelt-navy/40 to-transparent lg:hidden" />

          {/* Overlay Statement */}
          <div className="absolute bottom-8 left-8 right-8 z-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white drop-shadow-md leading-tight">
              Support That Stays With You.
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
