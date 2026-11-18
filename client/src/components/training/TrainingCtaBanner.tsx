import React from 'react'
import { motion } from 'framer-motion'

interface TrainingCtaBannerProps {
  onBookClick: () => void
}

const TrainingCtaBanner: React.FC<TrainingCtaBannerProps> = ({ onBookClick }) => {
  return (
    <section className="relative bg-sudabelt-green py-16 lg:py-20 overflow-hidden">
      {/* Background Graphic Pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-10 bg-repeat"
        style={{
          backgroundImage: "url('/images/brand/PATTERNS-WHITE SLIM 1.webp')",
          backgroundSize: '240px auto',
        }}
      />

      <div className="sudabelt-container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left"
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight max-w-xl">
            Certify your team before the machine arrives.
          </h2>

          <button
            type="button"
            onClick={onBookClick}
            className="h-12 px-8 rounded-control bg-sudabelt-blue hover:bg-sudabelt-navy text-white text-[13px] font-bold tracking-[0.06em] uppercase shadow-lg shadow-black/10 transition-all duration-300 hover:scale-[1.03] cursor-pointer inline-flex items-center justify-center shrink-0"
          >
            BOOK INSTITUTIONAL TRAINING
          </button>
        </motion.div>
      </div>
    </section>
  )
}

export default TrainingCtaBanner