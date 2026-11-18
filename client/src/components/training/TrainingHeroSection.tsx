import React from 'react'
import { motion } from 'framer-motion'

interface TrainingHeroSectionProps {
  onBookClick: (track?: string) => void
  onExploreTracksClick: () => void
}

const TrainingHeroSection: React.FC<TrainingHeroSectionProps> = ({
  onBookClick,
  onExploreTracksClick,
}) => {
  return (
    <section className="relative min-h-[560px] lg:min-h-[640px] flex items-center bg-black overflow-hidden">
      {/* Background Image: Hospital clinical ward & medical equipment - NO blue background */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=2000&q=85"
          alt="Clinical and biomedical hands-on hospital training"
          className="w-full h-full object-cover object-center opacity-45"
        />
        {/* Dark radial and directional overlay for maximum contrast and zero blue tint */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/40" />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      <div className="sudabelt-container relative z-10 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Eyebrow, Main Headline, Subtitle, CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="lg:col-span-7 xl:col-span-8"
          >
            {/* Red brand accent line & Eyebrow */}
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-1 bg-sudabelt-red rounded-full" />
              <span className="text-[12px] font-bold tracking-[0.14em] uppercase text-emerald-400">
                CLINICAL &amp; BIOMEDICAL TRAINING HUB
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.12]">
              Equipment is only as good as the people running it.
            </h1>

            <p className="mt-5 text-base sm:text-lg text-white/80 max-w-2xl leading-relaxed font-normal">
              Structured, hands-on curricula delivered in your ward by OEM-certified clinical
              application specialists.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={() => onBookClick()}
                className="h-12 px-7 rounded-control bg-sudabelt-blue hover:bg-sudabelt-navy text-white text-[13px] font-bold tracking-[0.06em] uppercase shadow-lg shadow-sudabelt-blue/20 transition-all duration-300 hover:scale-[1.02] cursor-pointer inline-flex items-center justify-center"
              >
                BOOK INSTITUTIONAL TRAINING
              </button>

              <button
                type="button"
                onClick={onExploreTracksClick}
                className="h-12 px-7 rounded-control border border-white/40 hover:border-white hover:bg-white/10 text-white text-[13px] font-bold tracking-[0.06em] uppercase transition-all duration-300 cursor-pointer inline-flex items-center justify-center"
              >
                VIEW TRAINING TRACKS
              </button>
            </div>
          </motion.div>

          {/* Right Column: Floating KPI Metrics Box matching screenshot */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
            className="lg:col-span-5 xl:col-span-4 lg:flex lg:justify-end"
          >
            <div className="w-full max-w-sm bg-black/55 backdrop-blur-md rounded-2xl border border-white/18 p-7 shadow-2xl">
              {/* Metric 1 */}
              <div>
                <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  40–60h
                </div>
                <div className="text-xs sm:text-sm text-white/70 mt-1 font-medium">
                  On-site per installation
                </div>
              </div>

              {/* Divider */}
              <div className="my-5 border-t border-white/15" />

              {/* Metric 2 */}
              <div>
                <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  4
                </div>
                <div className="text-xs sm:text-sm text-white/70 mt-1 font-medium">
                  OEM-certified tracks
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default TrainingHeroSection