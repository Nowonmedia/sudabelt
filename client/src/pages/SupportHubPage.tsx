import React from 'react'
import { Link } from 'react-router'

const SupportHubPage: React.FC = () => {
  return (
    <section className="py-16">
      <div className="sudabelt-container">
        <span className="text-eyebrow text-[#006837]">BIOMEDICAL AFTER-SALES ENGINEERING</span>
        <h1 className="text-section-heading text-[#001142] mt-2">
          24/7 Biomedical Support & Preventive SLA Hub
        </h1>
        <p className="text-[#3B4468] mt-3 max-w-2xl">
          Direct dispatch for critical equipment breakdowns, scheduled OEM calibration, and genuine
          spare parts across Lagos, Abuja, Kano, and Port Harcourt.
        </p>

        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            to="/support/emergency-breakdown"
            className="h-[50px] px-[26px] rounded-[5.5px] bg-[#E30000] text-white font-bold text-[13px] tracking-[0.06em] uppercase inline-flex items-center"
          >
            Log Emergency Breakdown
          </Link>
          <Link
            to="/support/maintenance-calibration"
            className="h-[50px] px-[26px] rounded-[5.5px] bg-[#001142] text-white font-bold text-[13px] tracking-[0.06em] uppercase inline-flex items-center"
          >
            Schedule Preventive Calibration
          </Link>
        </div>
      </div>
    </section>
  )
}

export default SupportHubPage
