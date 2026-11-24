import React from 'react'
import { motion } from 'framer-motion'

interface StepItem {
  step: string
  title: string
  description: string
}

const STEPS: StepItem[] = [
  {
    step: '01',
    title: 'Book a batch',
    description: 'Choose tracks and consolidate in the RFQ or book as a standalone hospital upgrade.',
  },
  {
    step: '02',
    title: 'On-site delivery',
    description: 'OEM-certified specialists train directly in your own ward, workflow, and patient environment.',
  },
  {
    step: '03',
    title: 'Certification',
    description: 'Staff evaluated and certified on the operational platform with hands-on clinical assessments.',
  },
  {
    step: '04',
    title: 'Refreshers',
    description: 'Annual recertification cycles and rapid onboarding tracks for incoming healthcare staff.',
  },
]

const HowTrainingRunsSection: React.FC = () => {
  return (
    <section className="py-20 lg:py-24 bg-sudabelt-surface/50 border-t border-sudabelt-border/50">
      <div className="sudabelt-container">
        {/* Section Header */}
        <div className="mb-14">
          <span className="text-[11px] font-bold tracking-[0.14em] uppercase text-sudabelt-green block mb-2">
            HOW TRAINING RUNS
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-sudabelt-navy tracking-tight">
            From Booking to Recertification.
          </h2>
        </div>

        {/* 4 Step Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {STEPS.map((step, idx) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, delay: idx * 0.1 }}
              className="flex flex-col"
            >
              {/* Top Accent Line */}
              <div className="w-full h-1 bg-sudabelt-navy/20 rounded-full mb-6 relative overflow-hidden group">
                <div className="w-1/3 h-full bg-sudabelt-navy rounded-full" />
              </div>

              {/* Step Number in Green */}
              <span className="text-sm font-extrabold font-mono text-sudabelt-green mb-2 block">
                {step.step}
              </span>

              {/* Step Title */}
              <h3 className="text-lg font-bold text-sudabelt-navy mb-2">
                {step.title}
              </h3>

              {/* Step Description */}
              <p className="text-xs sm:text-sm text-sudabelt-muted leading-relaxed font-normal">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HowTrainingRunsSection