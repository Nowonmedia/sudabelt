import React, { useState } from 'react'
import { Link } from 'react-router'
import { Bot, X, ArrowUpRight, Wrench, FileSpreadsheet, Scale, MessageSquare } from 'lucide-react'

const SudaBotWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Expandable Assistant Panel */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="Suda Bot Assistant"
          className="mb-3 w-77.5 sm:w-85 rounded-card bg-white border border-sudabelt-sage shadow-sudabot overflow-hidden"
        >
          <div className="bg-sudabelt-navy text-white px-5 py-4 flex items-center justify-between border-b border-white/15">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-control bg-sudabelt-green text-white inline-flex items-center justify-center">
                <Bot className="w-4 h-4" strokeWidth={1.75} />
              </div>
              <div>
                <div className="text-[14px] font-extrabold leading-tight">Suda Bot</div>
                <div className="text-[11px] font-mono text-sudabelt-blue">
                  Clinical &amp; Biomedical Concierge
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close Suda Bot"
              className="w-7 h-7 rounded-control bg-white/10 hover:bg-white/20 text-white inline-flex items-center justify-center cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4 bg-sudabelt-surface space-y-2">
            <p className="text-[12.5px] text-sudabelt-body px-1 mb-2">
              How can Sudabelt Medical assist your hospital or clinical unit today?
            </p>

            <Link
              to="/rfq"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between p-3 rounded-badge bg-white border border-sudabelt-border hover:border-sudabelt-green transition-colors group"
            >
              <div className="flex items-center gap-2.5">
                <FileSpreadsheet className="w-4 h-4 text-sudabelt-green" strokeWidth={1.75} />
                <span className="text-[13.5px] font-bold text-sudabelt-navy">
                  Build Institutional RFQ Quote
                </span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-sudabelt-muted group-hover:text-sudabelt-green" />
            </Link>

            <Link
              to="/support/emergency-breakdown"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between p-3 rounded-badge bg-white border border-sudabelt-border hover:border-sudabelt-red transition-colors group"
            >
              <div className="flex items-center gap-2.5">
                <Wrench className="w-4 h-4 text-sudabelt-red" strokeWidth={1.75} />
                <span className="text-[13.5px] font-bold text-sudabelt-navy">
                  Log &lt;24hr Breakdown Ticket
                </span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-sudabelt-muted group-hover:text-sudabelt-red" />
            </Link>

            <Link
              to="/why-sudabelt/compare"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between p-3 rounded-badge bg-white border border-sudabelt-border hover:border-sudabelt-green transition-colors group"
            >
              <div className="flex items-center gap-2.5">
                <Scale className="w-4 h-4 text-sudabelt-navy" strokeWidth={1.75} />
                <span className="text-[13.5px] font-bold text-sudabelt-navy">
                  Compare Turnkey TCO &amp; SLAs
                </span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-sudabelt-muted group-hover:text-sudabelt-green" />
            </Link>

            <a
              href="https://wa.me/2349011235400?text=Hello%20Sudabelt%20Medical%2C%20I%20would%20like%20to%20speak%20with%20a%20regional%20biomedical%20or%20sales%20engineer."
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between p-3 rounded-badge bg-white border border-sudabelt-border hover:border-sudabelt-green transition-colors group"
            >
              <div className="flex items-center gap-2.5">
                <MessageSquare className="w-4 h-4 text-sudabelt-blue-accessible" strokeWidth={1.75} />
                <span className="text-[13.5px] font-bold text-sudabelt-navy">
                  Chat on WhatsApp (+234 901 123 5400)
                </span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-sudabelt-muted group-hover:text-sudabelt-green" />
            </a>
          </div>
        </div>
      )}

      {/* Permanently Suspended Bottom-Right Suda Bot Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        className="h-11 px-4 rounded-badge bg-sudabelt-navy hover:bg-sudabelt-navy-hover text-white border border-white/22 shadow-sudabot inline-flex items-center gap-2.5 text-[13px] font-bold tracking-[0.01em] transition-transform active:scale-95 cursor-pointer"
      >
        <Bot className="w-4 h-4 text-sudabelt-blue" strokeWidth={1.75} />
        <span>Suda Bot</span>
      </button>
    </div>
  )
}

export default SudaBotWidget
