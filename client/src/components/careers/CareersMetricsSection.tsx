import React from 'react'

interface CareerMetric {
  value: string
  label: string
}

const METRICS: CareerMetric[] = [
  {
    value: '29',
    label: 'States with a Sudabelt presence',
  },
  {
    value: '8',
    label: 'Global OEM partners to learn from',
  },
  {
    value: '3',
    label: 'Offices in Lagos, Abuja and Kano',
  },
  {
    value: 'ISO',
    label: '9001:2015 quality-certified processes',
  },
]

export const CareersMetricsSection: React.FC = () => {
  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="sudabelt-container max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Eyebrow + Heading */}
          <div className="lg:col-span-5">
            <span className="text-xs uppercase tracking-widest font-bold text-sudabelt-green block mb-3">
              WHY SUDABELT
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-sudabelt-navy leading-tight">
              Work That Reaches Hospitals Across the Country.
            </h2>
          </div>

          {/* Right Column: 2x2 Bento Metric Cards */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {METRICS.map((metric, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-gray-200 rounded-[18px] p-7 sm:p-8 flex flex-col justify-center min-h-[140px] shadow-xs hover:border-sudabelt-green/40 hover:shadow-sm transition-all"
                >
                  <span className="text-3xl sm:text-4xl lg:text-[40px] font-black text-sudabelt-green leading-none">
                    {metric.value}
                  </span>
                  <p className="text-xs sm:text-sm text-gray-600 font-medium mt-3 leading-snug">
                    {metric.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
