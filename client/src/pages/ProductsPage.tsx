import React from 'react'
import { Link } from 'react-router'
import { useQuote } from '../context/QuoteContext'

const ProductsPage: React.FC = () => {
  const { addItem } = useQuote()

  return (
    <section className="py-16">
      <div className="sudabelt-container">
        <span className="text-eyebrow text-sudabelt-green">OEM PARTNER PORTFOLIO & CATALOG</span>
        <h1 className="text-section-heading text-sudabelt-navy mt-2">
          Medical Equipment & Consumables by Partner
        </h1>
        <p className="text-sudabelt-body mt-3 max-w-2xl">
          Explore authorized OEM systems and guaranteed local buffer consumables across Renal Care,
          Blood Banking & Apheresis, and Critical Care.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/products/renal-care/baxter-artis-physio-hemodialysis-system"
            className="h-11.5 px-5 rounded-control bg-sudabelt-navy text-white font-bold text-[13px] tracking-[0.05em] uppercase inline-flex items-center"
          >
            View Sample Equipment PDP
          </Link>
          <button
            type="button"
            onClick={() =>
              addItem({
                id: 'prod-baxter-artis-physio',
                slug: 'baxter-artis-physio-hemodialysis-system',
                sku: 'SB-HD-BAX-AP01',
                name: 'Baxter Artis Physio Hemodialysis System',
                brand: 'Baxter International',
                category: 'renal-care',
              })
            }
            className="h-11.5 px-5 rounded-control bg-sudabelt-blue text-sudabelt-navy font-extrabold text-[13px] tracking-[0.05em] uppercase inline-flex items-center cursor-pointer"
          >
            + Quick Add Sample to RFQ Cart
          </button>
        </div>
      </div>
    </section>
  )
}

export default ProductsPage
