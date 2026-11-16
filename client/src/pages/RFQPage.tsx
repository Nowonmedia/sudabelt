import React from 'react'
import { useQuote } from '../context/QuoteContext'

const RFQPage: React.FC = () => {
  const { selectedItems, itemCount, removeItem, clearTray } = useQuote()

  return (
    <section className="py-16">
      <div className="sudabelt-container">
        <span className="text-eyebrow text-[#006837]">INSTITUTIONAL PROCUREMENT PORTAL</span>
        <h1 className="text-section-heading text-[#001142] mt-2">
          Multi-Step Request for Quote (RFQ) & Tender Builder
        </h1>
        <p className="text-[#3B4468] mt-3 max-w-2xl">
          Items in your RFQ Tray ({itemCount} total units across {selectedItems.length} SKUs) are
          automatically persisted as you browse the catalog.
        </p>

        {selectedItems.length > 0 && (
          <div className="mt-8 p-6 rounded-tl-[22px] rounded-br-[22px] border border-[#99C1A1] bg-[#F4F6F9]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[18px] font-bold text-[#001142]">Current Quote Tray Items</h2>
              <button
                type="button"
                onClick={clearTray}
                className="text-[13px] font-bold text-[#E30000] hover:underline cursor-pointer"
              >
                Clear Tray
              </button>
            </div>
            <ul className="space-y-2">
              {selectedItems.map((item) => (
                <li
                  key={item.id}
                  className="p-3 rounded-[5.5px] bg-white border border-[#DCE1EB] flex items-center justify-between gap-4"
                >
                  <div>
                    <span className="font-bold text-[#001142]">{item.name}</span>
                    {item.sku && (
                      <span className="ml-2 font-mono text-[12px] text-[#4A5478]">
                        ({item.sku})
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-mono font-bold text-[#006837]">Qty: {item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="text-[12px] font-semibold text-[#E30000] hover:underline cursor-pointer"
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
