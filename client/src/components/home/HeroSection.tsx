import React, { useRef, useState } from 'react'
import { Link } from 'react-router'
import { Play, Pause, Volume2, VolumeX, Maximize2, X } from 'lucide-react'
import { HeaderTextReveal, SectionReveal } from '../common/Reveal'

const MILANOTE_HERO_VIDEO_URL =
  'https://media.milanote.com/p/files/1Wxi8l1yDc8cdZ/uUm/SUDABELT%20LANDMARK%20final%202.mp4'
const MILANOTE_HERO_POSTER_URL =
  'https://media.milanote.com/p/resized/1Wxi8l1yDc8cdZ/1Wxi8l1yDc8cdZ-IDXhW-regular.png?w=display'

interface HeroStatCard {
  metric: string
  label: string
}

const HERO_STATS: HeroStatCard[] = [
  {
    metric: '4',
    label: 'Regional hubs across Nigeria',
  },
  {
    metric: '24/7',
    label: 'Technical Biomedical Support',
  },
  {
    metric: 'ISO 9001:2015',
    label: 'Quality Management Certified',
  },
  {
    metric: '12mo',
    label: 'Comprehensive OEM & biomedical warranty',
  },
]

const HeroSection: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [isPlaying, setIsPlaying] = useState<boolean>(true)
  const [isMuted, setIsMuted] = useState<boolean>(true)
  const [showVideoModal, setShowVideoModal] = useState<boolean>(false)

  const togglePlay = () => {
    if (!videoRef.current) return
    if (videoRef.current.paused) {
      void videoRef.current.play()
      setIsPlaying(true)
    } else {
      videoRef.current.pause()
      setIsPlaying(false)
    }
  }

  const toggleMute = () => {
    if (!videoRef.current) return
    videoRef.current.muted = !videoRef.current.muted
    setIsMuted(videoRef.current.muted)
  }

  return (
    <section className="relative bg-sudabelt-navy text-white overflow-hidden">
      {/* Background Video on Loop with Light / Transparent Overlay */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          src={MILANOTE_HERO_VIDEO_URL}
          poster={MILANOTE_HERO_POSTER_URL}
          preload="metadata"
          autoPlay
          loop
          muted
          playsInline
          aria-hidden="true"
          className="w-full h-full object-cover object-center opacity-85"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(95deg, rgba(0, 17, 66, 0.56) 0%, rgba(0, 17, 66, 0.38) 55%, rgba(0, 17, 66, 0.48) 100%)',
          }}
        />
      </div>

      {/* Main Hero Content Container */}
      <SectionReveal className="sudabelt-container relative z-10 py-16 sm:py-20 lg:py-26">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Headline, Approved Milanote Copy & Dual CTAs (7 cols) */}
          <div className="lg:col-span-7">
            <HeaderTextReveal>
              {/* Brand Red Small Highlight Bar & Eyebrow */}
              <div className="flex items-center gap-3 mb-3.5">
                <span className="w-5.5 h-0.75 bg-sudabelt-red rounded-mark" />
                <p className="inline-block px-3.5 py-1 rounded-control bg-sudabelt-blue text-white text-[12px] sm:text-[13px] font-extrabold uppercase tracking-[1.82px] shadow-sm">
                  TURNKEY HEALTHCARE INFRASTRUCTURE
                </p>
              </div>

              <h1 className="text-[36px] sm:text-[44px] lg:text-[52px] leading-[1.16] lg:leading-15.5 font-extrabold tracking-[-0.03em] text-white mt-3.5 drop-shadow-xs">
                Advancing Healthcare
                <br className="hidden sm:inline" /> Excellence in Africa
              </h1>
            </HeaderTextReveal>

            <p className="text-[15.5px] sm:text-[16.5px] leading-[26.4px] text-white/95 max-w-140 mt-5 font-medium drop-shadow-xs">
              A leading integrated healthcare solutions company dedicated to transforming healthcare
              delivery across Africa. From genuine OEM equipment to clinical training, consumables
              and preventive maintenance, one accountable partner for every stage of your facility.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3.5">
              <Link
                to="/products"
                className="h-12.5 px-6.5 rounded-control bg-sudabelt-blue hover:bg-sudabelt-green text-sudabelt-navy hover:text-white font-extrabold text-[13px] tracking-[0.06em] uppercase inline-flex items-center justify-center transition-all duration-200"
              >
                EXPLORE PORTFOLIO
              </Link>

              <Link
                to="/rfq"
                className="h-12.5 px-6.5 rounded-control border border-white/75 bg-sudabelt-navy/35 hover:bg-sudabelt-navy/60 backdrop-blur-xs text-white font-bold text-[13px] tracking-[0.06em] uppercase inline-flex items-center justify-center transition-colors"
              >
                REQUEST TURNKEY CONSULTATION
              </Link>
            </div>

            {/* Interactive Hero Video Widget */}
            <div className="mt-8 inline-flex flex-wrap items-center gap-3 p-2.5 pr-4 rounded-tray bg-sudabelt-navy/65 backdrop-blur-md border border-white/25">
              <button
                type="button"
                onClick={() => setShowVideoModal(true)}
                className="relative w-16 h-11 rounded-md overflow-hidden border border-white/30 group shrink-0 cursor-pointer"
                aria-label="Open Sudabelt Landmark Video in Fullscreen Modal"
              >
                <img
                  src={MILANOTE_HERO_POSTER_URL}
                  alt="Sudabelt Landmark Video Preview"
                  fetchPriority="high"
                  decoding="async"
                  className="w-full h-full object-cover"
                />
                <span className="absolute inset-0 bg-sudabelt-navy/45 flex items-center justify-center">
                  <Play className="w-4 h-4 text-sudabelt-blue fill-sudabelt-blue" />
                </span>
              </button>

              <div className="mr-2">
                <div className="text-[12px] font-bold text-white leading-tight">
                  Sudabelt Landmark Film
                </div>
                <div className="font-mono text-[10.5px] text-sudabelt-blue">
                  Healthcare Infrastructure in Action
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={togglePlay}
                  aria-label={isPlaying ? 'Pause background video' : 'Play background video'}
                  className="w-8 h-8 rounded-control bg-white/12 hover:bg-white/25 text-white inline-flex items-center justify-center transition-colors cursor-pointer"
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                </button>
                <button
                  type="button"
                  onClick={toggleMute}
                  aria-label={isMuted ? 'Unmute background video' : 'Mute background video'}
                  className="w-8 h-8 rounded-control bg-white/12 hover:bg-white/25 text-white inline-flex items-center justify-center transition-colors cursor-pointer"
                >
                  {isMuted ? (
                    <VolumeX className="w-3.5 h-3.5" />
                  ) : (
                    <Volume2 className="w-3.5 h-3.5 text-sudabelt-blue" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowVideoModal(true)}
                  aria-label="Watch full video with sound"
                  className="w-8 h-8 rounded-control bg-sudabelt-blue text-sudabelt-navy inline-flex items-center justify-center transition-colors cursor-pointer"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: 2x2 Glassmorphic Stat Cards Grid (5 cols) */}
          <div className="lg:col-span-5">
            <div className="grid grid-cols-2 gap-3.5 sm:gap-4">
              {HERO_STATS.map((stat) => {
                const isLongMetric = stat.metric.length > 6
                return (
                  <div
                    key={stat.metric}
                    className="p-4 sm:p-6 rounded-2xl bg-sudabelt-navy/45 backdrop-blur-md border border-white/30 flex flex-col justify-between min-h-33 sm:min-h-37 overflow-hidden min-w-0"
                  >
                    <div
                      className={`font-extrabold tracking-[-0.02em] text-white wrap-break-words ${
                        isLongMetric
                          ? 'text-[17px] sm:text-[21px] lg:text-[22px] xl:text-[24px] leading-tight'
                          : 'text-[28px] sm:text-[34px] lg:text-[38px] leading-none'
                      }`}
                    >
                      {stat.metric}
                    </div>
                    <p className="text-[12.5px] sm:text-[13.5px] leading-[1.38] text-white/90 mt-4">
                      {stat.label}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </SectionReveal>

      {/* Fullscreen Video Modal Widget */}
      {showVideoModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Sudabelt Medical Landmark Video"
          className="fixed inset-0 z-50 bg-sudabelt-navy/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
        >
          <div className="relative w-full max-w-5xl rounded-card bg-sudabelt-navy border border-white/25 overflow-hidden shadow-2xl">
            <div className="px-6 py-4 bg-sudabelt-navy border-b border-white/15 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-[0.12em] text-sudabelt-blue">
                  SUDABELT MEDICAL CORPORATE FILM
                </span>
                <h3 className="text-[16px] font-bold text-white">
                  Advancing Healthcare Excellence in Africa
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowVideoModal(false)}
                aria-label="Close Video Player"
                className="w-9 h-9 rounded-control bg-white/10 hover:bg-sudabelt-red text-white inline-flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="aspect-video bg-black">
              <video
                src={MILANOTE_HERO_VIDEO_URL}
                poster={MILANOTE_HERO_POSTER_URL}
                controls
                autoPlay
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default HeroSection
