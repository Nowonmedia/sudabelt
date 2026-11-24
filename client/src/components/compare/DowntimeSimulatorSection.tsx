import React, { useState } from 'react'
import { Link } from 'react-router'
import { HeaderTextReveal, SectionReveal } from '../common/Reveal'

type FacilitySize = 'clinic' | 'mid-size' | 'teaching'
type EquipmentFocus = 'renal' | 'apheresis' | 'icu'

export const DowntimeSimulatorSection: React.FC = () => {
  const [facilitySize, setFacilitySize] = useState<FacilitySize>('mid-size')
  const [equipmentFocus, setEquipmentFocus] = useState<EquipmentFocus>('renal')

  // Dynamic values based on selections
  const getExposureValues = () => {
    switch (facilitySize) {
      case 'clinic':
        return {
          sudabelt: { pct: '12%', label: 'Low', color: 'bg-sudabelt-green' },
          catalog: { pct: '52%', label: 'Medium', color: 'bg-gray-400' },
          importer: { pct: '82%', label: 'High', color: 'bg-gray-600' },
        }
      case 'teaching':
        return {
          sudabelt: { pct: '8%', label: 'Ultra Low', color: 'bg-sudabelt-green' },
          catalog: { pct: '68%', label: 'High', color: 'bg-gray-400' },
          importer: { pct: '94%', label: 'Critical', color: 'bg-gray-600' },
        }
      case 'mid-size':
      default:
        return {
          sudabelt: { pct: '10%', label: 'Low', color: 'bg-sudabelt-green' },
          catalog: { pct: '58%', label: 'Medium', color: 'bg-gray-400' },
          importer: { pct: '88%', label: 'High', color: 'bg-gray-600' },
        }
    }
  }

  const getRecommendedPlan = () => {
    const sizeName =
      facilitySize === 'clinic'
        ? 'CLINICAL'
        : facilitySize === 'teaching'
        ? 'TEACHING HOSPITAL'
        : 'MID-SIZE'

    const focusName =
      equipmentFocus === 'renal'
        ? 'RENAL'
        : equipmentFocus === 'apheresis'
        ? 'APHERESIS'
        : 'ICU & GAS'

    return {
      eyebrow: `RECOMMENDED PLAN · ${sizeName} ${focusName} UNIT`,
      title: 'Turnkey Install with a standing consumable and SLA schedule.',
      consumableSupply: 'Monthly standing order from local hubs',
      staffTraining: '40 hours on-site + new-hire refreshers',
      maintenanceSla: 'Quarterly PM + <24 hr emergency response',
    }
  }

  const exposure = getExposureValues()
  const plan = getRecommendedPlan()

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-sudabelt-surface/70 border-t border-sudabelt-border">
      <div className="sudabelt-container">
        {/* Section Header */}
        <div className="max-w-3xl mb-12 lg:mb-16">
          <SectionReveal direction="up" delay={0.1}>
            <div className="flex items-center gap-3 mb-3">
              <span className="w-8 h-0.75 bg-sudabelt-red rounded-xs" />
              <span className="text-[12px] font-bold uppercase tracking-[0.14em] text-sudabelt-green">
                DOWNTIME & TCO EVALUATOR
              </span>
            </div>
          </SectionReveal>

          <HeaderTextReveal>
            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-sudabelt-navy tracking-tight leading-tight">
              What Does Unplanned Downtime Look Like for Your Facility?
            </h2>
          </HeaderTextReveal>
        </div>

        {/* 2 Interactive Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          {/* Left Card: Interactive Configurator */}
          <div className="lg:col-span-6 bg-white border border-sudabelt-border rounded-card p-5 sm:p-9 shadow-xs flex flex-col justify-between">
            <div>
              {/* Selector 1: Facility Size */}
              <div className="mb-7">
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-sudabelt-muted mb-2.5">
                  FACILITY SIZE
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'clinic' as const, label: 'Clinic' },
                    { id: 'mid-size' as const, label: 'Mid-size' },
                    { id: 'teaching' as const, label: 'Teaching' },
                  ].map((size) => (
                    <button
                      key={size.id}
                      type="button"
                      onClick={() => setFacilitySize(size.id)}
                      className={`py-2.5 px-3 rounded-control text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                        facilitySize === size.id
                          ? 'bg-sudabelt-navy text-white shadow-xs'
                          : 'bg-sudabelt-surface text-sudabelt-navy hover:bg-sudabelt-border/60 border border-sudabelt-border'
                      }`}
                    >
                      {size.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Selector 2: Equipment Focus */}
              <div className="mb-8">
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-sudabelt-muted mb-2.5">
                  EQUIPMENT FOCUS
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'renal' as const, label: 'Renal' },
                    { id: 'apheresis' as const, label: 'Apheresis' },
                    { id: 'icu' as const, label: 'ICU & Gas' },
                  ].map((focus) => (
                    <button
                      key={focus.id}
                      type="button"
                      onClick={() => setEquipmentFocus(focus.id)}
                      className={`py-2.5 px-3 rounded-control text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                        equipmentFocus === focus.id
                          ? 'bg-sudabelt-navy text-white shadow-xs'
                          : 'bg-sudabelt-surface text-sudabelt-navy hover:bg-sudabelt-border/60 border border-sudabelt-border'
                      }`}
                    >
                      {focus.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Dynamic Output Bars */}
            <div className="pt-6 border-t border-sudabelt-border">
              <span className="block text-[11px] font-mono font-bold uppercase tracking-wider text-sudabelt-muted mb-4">
                RELATIVE DOWNTIME EXPOSURE (ALL 4 FACTORS)
              </span>

              <div className="space-y-4">
                {/* Bar 1: Sudabelt */}
                <div>
                  <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                    <span className="text-sudabelt-navy">Sudabelt turnkey</span>
                    <span className="text-sudabelt-green">{exposure.sudabelt.label}</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-sudabelt-surface overflow-hidden">
                    <div
                      className="h-full rounded-full bg-sudabelt-green transition-all duration-500 ease-out"
                      style={{ width: exposure.sudabelt.pct }}
                    />
                  </div>
                </div>

                {/* Bar 2: Catalog Retailer */}
                <div>
                  <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                    <span className="text-sudabelt-muted">Catalog retailer</span>
                    <span className="text-sudabelt-muted">{exposure.catalog.label}</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-sudabelt-surface overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gray-400 transition-all duration-500 ease-out"
                      style={{ width: exposure.catalog.pct }}
                    />
                  </div>
                </div>

                {/* Bar 3: Standard Importer */}
                <div>
                  <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                    <span className="text-sudabelt-muted">Standard importer</span>
                    <span className="text-gray-700">{exposure.importer.label}</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-sudabelt-surface overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gray-600 transition-all duration-500 ease-out"
                      style={{ width: exposure.importer.pct }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Card: Recommended Plan (Dark Navy) */}
          <div className="lg:col-span-6 bg-sudabelt-navy text-white rounded-card p-8 sm:p-10 flex flex-col justify-between shadow-md">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-widest font-bold text-sudabelt-blue block mb-3">
                {plan.eyebrow}
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight mb-8">
                {plan.title}
              </h3>

              <div className="space-y-5 border-t border-white/15 pt-6 text-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-4 border-b border-white/10">
                  <span className="text-gray-400 font-medium">Consumable supply</span>
                  <span className="text-white font-bold">{plan.consumableSupply}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-4 border-b border-white/10">
                  <span className="text-gray-400 font-medium">Staff training</span>
                  <span className="text-white font-bold">{plan.staffTraining}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <span className="text-gray-400 font-medium">Maintenance SLA</span>
                  <span className="text-white font-bold">{plan.maintenanceSla}</span>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <Link
                to="/rfq"
                className="inline-flex items-center justify-center px-7 py-3.5 rounded-control bg-sudabelt-blue hover:bg-sudabelt-green text-sudabelt-navy hover:text-white font-extrabold text-xs uppercase tracking-wider transition-all duration-200 hover:-translate-y-0.5 cursor-pointer shadow-md"
              >
                REQUEST THIS PLAN
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default DowntimeSimulatorSection
