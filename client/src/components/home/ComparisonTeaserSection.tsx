import React from 'react'
import { Link } from 'react-router'
import { Check, X, Minus } from 'lucide-react'
import { HeaderTextReveal, SectionReveal } from '../common/Reveal'

interface ComparisonRow {
  criterion: string
  sudabelt: 'optimal'
  importers: 'deficient' | 'partial'
  retailers: 'deficient' | 'partial'
}

const COMPARISON_ROWS: ComparisonRow[] = [
  {
    criterion: 'Site engineering',
    sudabelt: 'optimal',
    importers: 'deficient',
    retailers: 'deficient',
  },
  {
    criterion: 'On-site clinical training',
    sudabelt: 'optimal',
    importers: 'partial',
    retailers: 'deficient',
  },
  {
    criterion: 'Local consumable stock',
    sudabelt: 'optimal',
    importers: 'deficient',
    retailers: 'partial',
  },
  {
    criterion: '<24hr biomedical SLA',
    sudabelt: 'optimal',
    importers: 'deficient',
    retailers: 'partial',
  },
]

const renderCompetitorCell = (status: 'deficient' | 'partial') => {
  return (
    <span
      className="w-6 h-6 rounded-control bg-sudabelt-surface border border-sudabelt-border text-sudabelt-muted inline-flex items-center justify-center"
      aria-label={status === 'partial' ? 'Partial support' : 'Not included'}
    >
      {status === 'partial' ? (
        <Minus className="w-3.5 h-3.5" strokeWidth={2.2} />
      ) : (
        <X className="w-3.5 h-3.5" strokeWidth={2.2} />
      )}
    </span>
  )
}

const ComparisonTeaserSection: React.FC = () => {
  return (
    <section className="bg-sudabelt-green-tint py-20 lg:py-24 border-y border-sudabelt-sage/40">
      <SectionReveal className="sudabelt-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column (5 cols) */}
          <div className="lg:col-span-5">
            <HeaderTextReveal>
              <span className="text-eyebrow text-sudabelt-green">WHY SUDABELT</span>
              <h2 className="text-section-heading text-sudabelt-navy mt-3">
                A machine is only as good as the partner behind it.
              </h2>
            </HeaderTextReveal>
            <p className="text-[15.5px] leading-[25.5px] text-sudabelt-body mt-4">
              Compare Sudabelt’s turnkey standard against standard importers and catalog retailers
              across setup, training and maintenance.
            </p>

            <div className="mt-7">
              <Link
                to="/why-sudabelt/compare"
                className="h-12.5 px-6.5 rounded-control bg-sudabelt-navy hover:bg-sudabelt-green text-white font-bold text-[13px] tracking-[0.06em] uppercase inline-flex items-center justify-center transition-colors"
              >
                OPEN LIVE COMPARISON
              </Link>
            </div>
          </div>

          {/* Right Column: Comparison Matrix Table Card (7 cols) */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-card border border-sudabelt-sage overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left min-w-120">
                  <thead>
                    <tr className="border-b border-sudabelt-header-border">
                      <th className="py-5 px-6 font-mono text-[11.5px] font-semibold uppercase tracking-[0.08em] text-sudabelt-label w-[36%]">
                        CRITERIA
                      </th>
                      <th className="py-5 px-4 bg-sudabelt-green text-white text-center text-[13.5px] font-bold w-[22%]">
                        Sudabelt
                      </th>
                      <th className="py-5 px-4 text-center text-[12.5px] font-semibold text-sudabelt-body leading-tight w-[21%]">
                        Standard
                        <br />
                        Importers
                      </th>
                      <th className="py-5 px-4 text-center text-[12.5px] font-semibold text-sudabelt-body leading-tight w-[21%]">
                        Catalog
                        <br />
                        Retailers
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sudabelt-header-border">
                    {COMPARISON_ROWS.map((row) => (
                      <tr key={row.criterion}>
                        <td className="py-4 px-6 text-[14px] font-bold text-sudabelt-navy">
                          {row.criterion}
                        </td>
                        <td className="py-4 px-4 bg-sudabelt-green-tint/75 text-center">
                          <span
                            className="w-6 h-6 rounded-control bg-sudabelt-green text-white inline-flex items-center justify-center"
                            aria-label="Included in Sudabelt Standard"
                          >
                            <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
                          </span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          {renderCompetitorCell(row.importers)}
                        </td>
                        <td className="py-4 px-4 text-center">
                          {renderCompetitorCell(row.retailers)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </SectionReveal>
    </section>
  )
}

export default ComparisonTeaserSection
