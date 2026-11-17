import React from 'react'

const EmergencyBreakdownPage: React.FC = () => {
  return (
    <section className="py-16">
      <div className="sudabelt-container">
        <span className="inline-block px-2.5 py-1 rounded-control bg-sudabelt-red text-white text-eyebrow">
          CRITICAL PATIENT IMPACT DISPATCH
        </span>
        <h1 className="text-section-heading text-sudabelt-navy mt-3">
          Emergency Biomedical Breakdown Ticket
        </h1>
        <p className="text-sudabelt-body mt-3 max-w-2xl">
          Submit your machine serial number and fault code for immediate &lt;24hr biomedical
          engineering escalation and direct WhatsApp dispatch.
        </p>
      </div>
    </section>
  )
}

export default EmergencyBreakdownPage
