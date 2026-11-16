import React from 'react'

const EmergencyBreakdownPage: React.FC = () => {
  return (
    <section className="py-16">
      <div className="sudabelt-container">
        <span className="inline-block px-2.5 py-1 rounded-[5.5px] bg-[#E30000] text-white text-eyebrow">
          CRITICAL PATIENT IMPACT DISPATCH
        </span>
        <h1 className="text-section-heading text-[#001142] mt-3">
          Emergency Biomedical Breakdown Ticket
        </h1>
        <p className="text-[#3B4468] mt-3 max-w-2xl">
          Submit your machine serial number and fault code for immediate &lt;24hr biomedical
          engineering escalation and direct WhatsApp dispatch.
        </p>
      </div>
    </section>
  )
}

export default EmergencyBreakdownPage
