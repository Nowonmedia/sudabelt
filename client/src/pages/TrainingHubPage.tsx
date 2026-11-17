import React from 'react'
import { Link } from 'react-router'

const TrainingHubPage: React.FC = () => {
  return (
    <section className="py-16">
      <div className="sudabelt-container">
        <span className="text-eyebrow text-sudabelt-green">CLINICAL & BIOMEDICAL ACADEMY</span>
        <h1 className="text-section-heading text-sudabelt-navy mt-2">
          Clinical Staff & Biomedical Engineer Training Hub
        </h1>
        <p className="text-sudabelt-body mt-3 max-w-2xl">
          Structured certification programs for Renal Nurses, Hematology/Apheresis Scientists, and
          In-House Biomedical Engineers.
        </p>
        <div className="mt-6">
          <Link
            to="/training-hub/register"
            className="h-12.5 px-6.5 rounded-control bg-sudabelt-navy text-white font-bold text-[13px] tracking-[0.06em] uppercase inline-flex items-center"
          >
            Register Institutional Cohort
          </Link>
        </div>
      </div>
    </section>
  )
}

export default TrainingHubPage
