import React from 'react'
import { Link } from 'react-router'
import {
  ScanLine,
  Droplets,
  HeartPulse,
  Microscope,
  Wind,
  Scissors,
  ArrowUpRight,
} from 'lucide-react'
import { HeaderTextReveal, SectionReveal } from '../common/Reveal'

interface PortfolioCategoryCard {
  id: string
  slug: string
  number: string
  title: string
  description: string
  sampleProducts: string[]
  icon: React.ElementType
  bentoSpan: string
}

const PORTFOLIO_CATEGORIES: PortfolioCategoryCard[] = [
  {
    id: 'cat-imaging',
    slug: 'imaging-and-life-care',
    number: '01',
    title: 'Imaging and Life Care',
    description:
      "Advanced diagnostic imaging and patient care solutions designed to support disease detection, clinical decision-making, perioperative care, and improved patient outcomes across radiology, cardiology, women's health, intensive care, and primary healthcare settings.",
    sampleProducts: ['GE HealthCare CT & Ultrasound', 'Patient Monitors', 'Anesthesia Workstations'],
    icon: ScanLine,
    bentoSpan: 'lg:col-span-7',
  },
  {
    id: 'cat-blood',
    slug: 'blood-management-cell-technologies',
    number: '02',
    title: 'Blood Management & Cell Technologies',
    description:
      'Innovative blood management and cell technology solutions supporting therapeutic apheresis, blood collection, transfusion medicine, and advanced cellular therapies.',
    sampleProducts: ['Terumo Spectra Optia', 'Mirasol PRT System', 'Automated Blood Processing'],
    icon: Droplets,
    bentoSpan: 'lg:col-span-5',
  },
  {
    id: 'cat-renal',
    slug: 'renal-and-critical-care',
    number: '03',
    title: 'Renal & Critical Care',
    description:
      'Integrated technologies supporting chronic kidney disease, acute kidney injury, and critical care through advanced renal replacement systems, dialysis infrastructure, and supporting consumables.',
    sampleProducts: ['Baxter Artis Physio HD', 'AK 98 Hemodialysis', 'CleanCart & Revaclear'],
    icon: HeartPulse,
    bentoSpan: 'lg:col-span-5',
  },
  {
    id: 'cat-lab',
    slug: 'laboratory-and-diagnostics',
    number: '04',
    title: 'Laboratory & Diagnostics',
    description:
      'Comprehensive laboratory and diagnostic solutions supporting clinical chemistry, hematology, immunoassay, coagulation, infectious disease testing, point-of-care diagnostics, and laboratory automation.',
    sampleProducts: ['Abbott Clinical Chemistry', 'Hematology Analyzers', 'Point-of-Care Diagnostics'],
    icon: Microscope,
    bentoSpan: 'lg:col-span-7',
  },
  {
    id: 'cat-respiratory',
    slug: 'respiratory-and-neonatal-care',
    number: '05',
    title: 'Respiratory & Neonatal Care',
    description:
      'Innovative respiratory care technologies designed to support oxygen therapy, humidification, non-invasive ventilation, and invasive ventilation across intensive care, emergency, and neonatal units.',
    sampleProducts: ['Fisher & Paykel Humidification', 'Optiflow High Flow', 'Neonatal Bubble CPAP'],
    icon: Wind,
    bentoSpan: 'lg:col-span-6',
  },
  {
    id: 'cat-mis',
    slug: 'minimally-invasive-surgery',
    number: '06',
    title: 'Minimally Invasive Surgery (MIS)',
    description:
      'Minimally invasive surgical solutions supporting laparoscopic, bariatric, thoracic, colorectal, gynecological, and urological procedures through advanced surgical stapling, endoscopic imaging, and energy devices.',
    sampleProducts: ['Ezisurg Endo-Staplers', 'Ultrasonic Surgical Shears', 'Laparoscopic Trocars'],
    icon: Scissors,
    bentoSpan: 'lg:col-span-6',
  },
]

const ProductsByCategorySection: React.FC = () => {
  return (
    <section className="bg-white py-20 lg:py-24 border-t border-sudabelt-header-border">
      <div className="sudabelt-container">
        {/* Header Row */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <HeaderTextReveal>
            <div className="w-5.5 h-0.75 bg-sudabelt-red rounded-mark mb-3" />
            <span className="text-eyebrow text-sudabelt-green">PRODUCTS BY CATEGORY</span>
            <h2 className="text-section-heading text-sudabelt-navy mt-2.5 max-w-155">
              Comprehensive Clinical &amp; Diagnostic Portfolio.
            </h2>
          </HeaderTextReveal>

          <Link
            to="/products"
            className="h-12.5 px-6.5 rounded-control bg-sudabelt-navy hover:bg-sudabelt-green text-white font-bold text-[13px] tracking-[0.06em] uppercase inline-flex items-center justify-center self-start lg:self-auto transition-all duration-200 hover:-translate-y-0.5 shrink-0 shadow-xs"
          >
            SEE MORE IN FULL PORTFOLIO
          </Link>
        </div>

        {/* 6 Verbatim Milanote Categories - Sophisticated Bento Grid (Plain by default, Green on Hover) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5 lg:gap-6">
          {PORTFOLIO_CATEGORIES.map((category, idx) => {
            const IconComp = category.icon
            return (
              <SectionReveal
                key={category.id}
                direction="up"
                delay={0.07 * (idx + 1)}
                className={`col-span-1 ${category.bentoSpan}`}
              >
                <div className="group relative h-full p-7 sm:p-8 rounded-card border border-sudabelt-sage bg-white hover:bg-sudabelt-green hover:border-sudabelt-green hover:-translate-y-1.5 hover:shadow-xl flex flex-col justify-between transition-all duration-300 overflow-hidden">
                  {/* Subtle Decorative Watermark Number */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none select-none absolute -bottom-4 -right-2 font-mono text-[88px] font-extrabold leading-none text-sudabelt-surface group-hover:text-white/10 transition-colors duration-300"
                  >
                    {category.number}
                  </span>

                  <div className="relative z-10">
                    <div className="flex items-center justify-between">
                      <div className="w-11 h-11 rounded-badge bg-sudabelt-green text-white group-hover:bg-white group-hover:text-sudabelt-green inline-flex items-center justify-center transition-colors duration-300 shadow-xs">
                        <IconComp className="w-5 h-5" strokeWidth={1.75} />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[12.5px] font-semibold text-sudabelt-muted group-hover:text-white/80 transition-colors duration-300">
                          {category.number}
                        </span>
                        <ArrowUpRight className="w-4 h-4 text-sudabelt-muted opacity-0 group-hover:opacity-100 group-hover:text-white transition-all duration-300 -translate-x-1 group-hover:translate-x-0" />
                      </div>
                    </div>

                    <h3 className="text-[21px] sm:text-[22px] leading-7 font-bold text-sudabelt-navy group-hover:text-white mt-5 transition-colors duration-300">
                      {category.title}
                    </h3>

                    <p className="text-[14px] leading-[22.5px] text-sudabelt-body group-hover:text-white/90 mt-3 transition-colors duration-300">
                      {category.description}
                    </p>

                    {/* Selection of Products Linked to Portfolio */}
                    <div className="mt-5 pt-4 border-t border-sudabelt-sage/40 group-hover:border-white/20 transition-colors duration-300">
                      <div className="font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-sudabelt-label group-hover:text-white/80 mb-2 transition-colors duration-300">
                        Featured Solutions:
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {category.sampleProducts.map((prod) => (
                          <Link
                            key={prod}
                            to={`/products?category=${category.slug}`}
                            className="px-2.5 py-1 rounded-control bg-sudabelt-surface group-hover:bg-white/15 hover:bg-white! text-sudabelt-navy group-hover:text-white hover:text-sudabelt-navy! border border-sudabelt-border group-hover:border-white/25 font-mono text-[11px] transition-colors duration-200"
                          >
                            {prod}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="relative z-10 mt-6 pt-2">
                    <Link
                      to={`/products?category=${category.slug}`}
                      className="text-[12px] font-extrabold uppercase tracking-[0.06em] text-sudabelt-green group-hover:text-white transition-all duration-300 inline-flex items-center group-hover:translate-x-1"
                    >
                      SEE MORE →
                    </Link>
                  </div>
                </div>
              </SectionReveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default ProductsByCategorySection
