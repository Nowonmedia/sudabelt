import React from 'react'
import { motion } from 'framer-motion'
import { Droplets, FlaskConical, Activity, Wrench } from 'lucide-react'

export interface TrainingTrack {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  modules: string[]
  duration: string
}

interface TrainingTracksSectionProps {
  onSelectTrack: (trackTitle: string) => void
}

const TRACKS_DATA: TrainingTrack[] = [
  {
    id: 'renal-nurses',
    title: 'Renal Nurses',
    description: 'Safe, confident delivery of HD and HDF therapies on biofeedback systems.',
    icon: <Droplets className="w-5 h-5 text-white" />,
    modules: [
      'Therapy fundamentals & patient setup',
      'Biofeedback and clearance monitoring',
      'Disinfection, alarms & troubleshooting',
    ],
    duration: '40–60 hours',
  },
  {
    id: 'hematology-apheresis',
    title: 'Hematology & Apheresis Scientists',
    description: 'Red cell exchange, plasma exchange and cell collection protocols in practice.',
    icon: <FlaskConical className="w-5 h-5 text-white" />,
    modules: [
      'Apheresis principles & interface management',
      'Red cell exchange for sickle cell disease',
      'Pathogen reduction workflow',
    ],
    duration: '40–60 hours',
  },
  {
    id: 'critical-care',
    title: 'Critical Care Staff',
    description: 'ICU nurses and physicians operating life-support and oxygen-dependent systems.',
    icon: <Activity className="w-5 h-5 text-white" />,
    modules: [
      'Respiratory support fundamentals',
      'Oxygen supply & manifold awareness',
      'Alarm management & escalation',
    ],
    duration: 'Modular: 2 weeks',
  },
  {
    id: 'biomedical-engineers',
    title: 'In-House Biomedical Engineers',
    description: 'Preventive maintenance, calibration and first-line repair on supplied platforms.',
    icon: <Wrench className="w-5 h-5 text-white" />,
    modules: [
      'Preventive maintenance routines',
      'Calibration & diagnostics',
      'Spare parts & escalation to OEM',
    ],
    duration: 'Modular: 3 weeks',
  },
]

const TrainingTracksSection: React.FC<TrainingTracksSectionProps> = ({ onSelectTrack }) => {
  return (
    <section id="training-tracks" className="py-20 lg:py-24 bg-white">
      <div className="sudabelt-container">
        {/* Section Header */}
        <div className="mb-12">
          <span className="text-[11px] font-bold tracking-[0.14em] uppercase text-sudabelt-green block mb-2">
            TRAINING TRACKS
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-sudabelt-navy tracking-tight">
            Choose the track for your team.
          </h2>
        </div>

        {/* 2x2 Tracks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {TRACKS_DATA.map((track, idx) => (
            <motion.div
              key={track.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ y: -4 }}
              className="bg-white rounded-2xl border border-sudabelt-border p-7 sm:p-8 flex flex-col justify-between shadow-xs hover:shadow-xl hover:border-sudabelt-green/30 transition-all duration-300 group"
            >
              <div>
                {/* Header Row: Icon + Certification Badge */}
                <div className="flex items-center justify-between gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-sudabelt-navy flex items-center justify-center shadow-sm group-hover:bg-sudabelt-green transition-colors duration-300">
                    {track.icon}
                  </div>

                  <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-bold tracking-wide border border-emerald-100">
                    Certification
                  </span>
                </div>

                {/* Track Title & Description */}
                <h3 className="text-xl font-bold text-sudabelt-navy group-hover:text-sudabelt-green transition-colors duration-200">
                  {track.title}
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-sudabelt-muted leading-relaxed font-normal">
                  {track.description}
                </p>

                {/* Modules List with Green Step Numbers */}
                <div className="mt-6 pt-6 border-t border-sudabelt-border/70 space-y-3">
                  {track.modules.map((moduleName, mIdx) => (
                    <div key={mIdx} className="flex items-start gap-3">
                      <span className="text-[12px] font-bold text-sudabelt-green tracking-tight font-mono mt-0.5">
                        0{mIdx + 1}
                      </span>
                      <span className="text-xs sm:text-sm text-sudabelt-navy/85 font-medium leading-snug">
                        {moduleName}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Row: Duration & Action Button */}
              <div className="mt-8 pt-5 border-t border-sudabelt-border/60 flex items-center justify-between gap-4">
                <span className="text-xs font-semibold text-sudabelt-muted">
                  {track.duration}
                </span>

                <button
                  type="button"
                  onClick={() => onSelectTrack(track.title)}
                  className="px-5 py-2.5 rounded-control bg-sudabelt-blue hover:bg-sudabelt-navy text-white text-[11px] font-bold tracking-[0.06em] uppercase shadow-sm transition-all duration-200 hover:scale-[1.03] cursor-pointer"
                >
                  SELECT THIS TRACK
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TrainingTracksSection