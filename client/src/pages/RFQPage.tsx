import React from 'react'
import { useQuote } from '../context/QuoteContext'

const RFQPage: React.FC = () => {
  const { selectedItems, itemCount, removeItem, clearTray } = useQuote()

  return (
    <section className="py-16">
      <div className="sudabelt-container">
        <span className="text-eyebrow text-sudabelt-green">INSTITUTIONAL PROCUREMENT PORTAL</span>
        <h1 className="text-section-heading text-sudabelt-navy mt-2">
          Multi-Step Request for Quote (RFQ) & Tender Builder
        </h1>
        <p className="text-sudabelt-body mt-3 max-w-2xl">
          Items in your RFQ Cart ({itemCount} total units across {selectedItems.length} SKUs) are
          automatically persisted as you browse the catalog.
        </p>

        {selectedItems.length > 0 && (
          <div className="mt-8 p-6 rounded-tl-card rounded-br-card border border-sudabelt-sage bg-sudabelt-surface">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[18px] font-bold text-sudabelt-navy">Current Quote Tray Items</h2>
              <button
                type="button"
                onClick={clearTray}
                className="text-[13px] font-bold text-sudabelt-red hover:underline cursor-pointer"
              >
                Clear Tray
              </button>
            </div>
            <ul className="space-y-2">
              {selectedItems.map((item) => (
                <li
                  key={item.id}
                  className="p-3 rounded-control bg-white border border-sudabelt-border flex items-center justify-between gap-4"
                >
                  <div>
                    <span className="font-bold text-sudabelt-navy">{item.name}</span>
                    {item.sku && (
                      <span className="ml-2 font-mono text-[12px] text-sudabelt-label">
                        ({item.sku})
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-mono font-bold text-sudabelt-green">Qty: {item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="text-[12px] font-semibold text-sudabelt-red hover:underline cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  )
}

export default RFQPage
