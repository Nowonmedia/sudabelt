import React from 'react'
import { Check, X, Minus, Info } from 'lucide-react'
import type { DepartmentFilter } from './CompareHeroSection'

interface ComparisonMatrixSectionProps {
  activeFilter: DepartmentFilter
}

interface MatrixRow {
  id: string
  tag: string
  title: string
  subtitle: string
  callout?: {
    label: string
    text: string
  }
  sudabelt: {
    status: 'optimal'
    title: string
    desc: string
  }
  importers: {
    status: 'cross' | 'minus'
    title: string
    desc: string
  }
  retailers: {
    status: 'cross' | 'minus'
    title: string
    desc: string
  }
}

const ROWS: MatrixRow[] = [
  {
    id: 'site-engineering',
    tag: 'INFRASTRUCTURE & SETUP',
    title: 'Pre-installation site engineering',
    subtitle: 'Power, RO water and medical gas assessed before dispatch.',
    callout: {
      label: 'WHY THIS MATTERS FOR YOUR HOSPITAL',
      text: 'Sensitive renal and ICU machines fail prematurely when voltage fluctuates or RO water falls outside ISO standards.',
    },
    sudabelt: {
      status: 'optimal',
      title: 'Full site audit & turnkey engineering',
      desc: 'Biomedical engineers audit water quality, electrical earth/neutral and manifold pressure first.',
    },
    importers: {
      status: 'cross',
      title: 'Warehouse-crate delivery only',
      desc: 'Hospital sources plumbers and electricians, risking voided OEM warranties.',
    },
    retailers: {
      status: 'cross',
      title: 'No engineering assessment',
      desc: 'Ships hardware without checking facility readiness.',
    },
  },
  {
    id: 'clinical-training',
    tag: 'CLINICAL TRAINING',
    title: 'Hands-on staff certification',
    subtitle: 'Operators trained on therapy, not just power-on.',
    sudabelt: {
      status: 'optimal',
      title: '40-60 hours on-site + recertification',
      desc: 'Certified specialists train nurses, doctors and lab scientists at your ward, with refresher/on-demand tracks.',
    },
    importers: {
      status: 'minus',
      title: 'Basic 1-hour « power-on » demo',
      desc: 'No therapy optimization or troubleshooting syllabus.',
    },
    retailers: {
      status: 'cross',
      title: 'User manual PDF only',
      desc: 'Zero on-site clinical application support.',
    },
  },
  {
    id: 'consumables-stock',
    tag: 'CONSUMABLES & SUPPLY CHAIN',
    title: 'Local consumable buffer stock',
    subtitle: 'Cartridges, bloodlines and kits on the shelf, not in customs.',
    sudabelt: {
      status: 'optimal',
      title: 'Multi-hub buffer warehouses',
      desc: 'Lagos, Abuja and Kano hold standing depot buffer stock with immediate city dispatch and monthly telemetry.',
    },
    importers: {
      status: 'cross',
      title: 'Import-on-demand: 8-14 week lead time',
      desc: 'Orders only after payment; machines sit idle for weeks on port delays.',
    },
    retailers: {
      status: 'minus',
      title: 'Inconsistent spot inventory',
      desc: 'Generic disposables, but no specialized OEM cartridges.',
    },
  },
  {
    id: 'maintenance-uptime',
    tag: 'MAINTENANCE & UPTIME',
    title: 'Preventive maintenance & spare parts',
    subtitle: 'Our own trained OEM-certified engineers close to you.',
    sudabelt: {
      status: 'optimal',
      title: '<24hr response + scheduled calibration',
      desc: 'OEM-trained biomedical engineers across Nigeria, with genuine spare parts.',
    },
    importers: {
      status: 'cross',
      title: 'No post-sales engineering team',
      desc: 'Hospital pays to fly in technicians or wait for boards abroad.',
    },
    retailers: {
      status: 'minus',
      title: 'Third-party generalist technicians',
      desc: 'No OEM diagnostic software or genuine calibration kits.',
    },
  },
]

export const ComparisonMatrixSection: React.FC<ComparisonMatrixSectionProps> = ({
  activeFilter: _activeFilter,
}) => {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white">
      <div className="sudabelt-container">
        {/* Table Container with responsive horizontal scroll */}
        <div className="overflow-x-auto border border-sudabelt-border rounded-card shadow-xs bg-white">
          <table className="w-full min-w-[900px] border-collapse text-left">
            {/* Table Header */}
            <thead>
              <tr className="border-b border-sudabelt-border">
                {/* Column 1: Criterion */}
                <th className="w-[28%] p-6 bg-sudabelt-surface/60 text-xs font-mono font-bold uppercase tracking-wider text-sudabelt-muted">
                  CRITERION
                </th>

                {/* Column 2: Sudabelt Medical */}
                <th className="w-[30%] p-6 bg-sudabelt-green text-white">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-emerald-200 block mb-1">
                    THE SUDABELT STANDARD
                  </span>
                  <div className="text-xl sm:text-2xl font-black text-white">
                    Sudabelt Medical
                  </div>
                  <p className="text-xs text-emerald-100 mt-0.5">
                    "Turnkey infrastructure partner"
                  </p>
                </th>

                {/* Column 3: Standard equipment importers */}
                <th className="w-[21%] p-6 bg-white text-sudabelt-navy border-l border-sudabelt-border">
                  <div className="text-base sm:text-lg font-bold text-sudabelt-navy leading-tight">
                    Standard equipment importers
                  </div>
                  <p className="text-xs text-sudabelt-muted mt-1">
                    "Box-movers"
                  </p>
                </th>

                {/* Column 4: General medical catalog retailers */}
                <th className="w-[21%] p-6 bg-white text-sudabelt-navy border-l border-sudabelt-border">
                  <div className="text-base sm:text-lg font-bold text-sudabelt-navy leading-tight">
                    General medical catalog retailers
                  </div>
                  <p className="text-xs text-sudabelt-muted mt-1">
                    "Off-the-shelf sellers"
                  </p>
                </th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-sudabelt-border">
              {ROWS.map((row) => (
                <React.Fragment key={row.id}>
                  <tr className="hover:bg-sudabelt-surface/30 transition-colors">
                    {/* Column 1: Criterion Description */}
                    <td className="p-6 bg-sudabelt-surface/30 align-top">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-sudabelt-green block mb-1">
                        {row.tag}
                      </span>
                      <h4 className="text-base font-bold text-sudabelt-navy mb-1 leading-snug">
                        {row.title}
                      </h4>
                      <p className="text-xs text-sudabelt-body leading-relaxed">
                        {row.subtitle}
                      </p>
                    </td>

                    {/* Column 2: Sudabelt (Highlighted Cell) */}
                    <td className="p-6 bg-sudabelt-green-tint/40 align-top">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-control bg-sudabelt-green text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-sudabelt-navy mb-1">
                            {row.sudabelt.title}
                          </div>
                          <p className="text-xs text-sudabelt-body leading-relaxed">
                            {row.sudabelt.desc}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Column 3: Importers */}
                    <td className="p-6 bg-white border-l border-sudabelt-border align-top">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-control bg-sudabelt-surface border border-sudabelt-border text-sudabelt-muted flex items-center justify-center shrink-0 mt-0.5">
                          {row.importers.status === 'cross' ? (
                            <X className="w-3.5 h-3.5 stroke-[2.5]" />
                          ) : (
                            <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-sudabelt-navy mb-1">
                            {row.importers.title}
                          </div>
                          <p className="text-xs text-sudabelt-muted leading-relaxed">
                            {row.importers.desc}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Column 4: Retailers */}
                    <td className="p-6 bg-white border-l border-sudabelt-border align-top">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-control bg-sudabelt-surface border border-sudabelt-border text-sudabelt-muted flex items-center justify-center shrink-0 mt-0.5">
                          {row.retailers.status === 'cross' ? (
                            <X className="w-3.5 h-3.5 stroke-[2.5]" />
                          ) : (
                            <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-sudabelt-navy mb-1">
                            {row.retailers.title}
                          </div>
                          <p className="text-xs text-sudabelt-muted leading-relaxed">
                            {row.retailers.desc}
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>

                  {/* Callout row if present */}
                  {row.callout && (
                    <tr>
                      <td colSpan={4} className="p-0">
                        <div className="bg-sudabelt-navy text-white px-6 py-3.5 flex items-center gap-3">
                          <div className="w-6 h-6 rounded-full bg-sudabelt-blue/20 text-sudabelt-blue flex items-center justify-center shrink-0">
                            <Info className="w-3.5 h-3.5" />
                          </div>
                          <div className="text-xs flex flex-wrap items-center gap-x-2 gap-y-1">
                            <span className="font-bold tracking-wider uppercase text-emerald-300">
                              {row.callout.label}:
                            </span>
                            <span className="text-gray-200">
                              {row.callout.text}
                            </span>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div className="mt-6 flex flex-wrap items-center gap-6 text-xs font-medium text-sudabelt-body">
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-control bg-sudabelt-green text-white flex items-center justify-center">
              <Check className="w-2.5 h-2.5 stroke-[3]" />
            </span>
            <span>Sudabelt standard</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-control bg-sudabelt-surface border border-sudabelt-border text-sudabelt-muted flex items-center justify-center">
              <Minus className="w-2.5 h-2.5" />
            </span>
            <span>Market deficiency in the industry</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ComparisonMatrixSection
