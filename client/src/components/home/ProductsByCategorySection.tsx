import React from 'react'
import { Link } from 'react-router'
import {
  ScanLine,
  Droplets,
  HeartPulse,
  Microscope,
  Wind,
  Scissors,
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
  highlighted?: boolean
}

const PORTFOLIO_CATEGORIES: PortfolioCategoryCard[] = [
  {
    id: 'cat-imaging',
    slug: 'imaging-and-life-care',
    number: '01',
    title: 'Imaging and Life Care',
    description:
      "Advanced diagnostic imaging and patient care solutions designed to support disease detection, clinical decision-making, perioperative care, and improved patient outcomes across radiology, cardiology, women's health, intensive care, and primary healthcare settings. Solutions include imaging systems, ultrasound, patient monitoring, anesthesia, maternal and infant care, and associated accessories and consumables.",
    sampleProducts: ['GE HealthCare CT & Ultrasound', 'Patient Monitors', 'Anesthesia Workstations'],
    icon: ScanLine,
    highlighted: true,
  },
  {
    id: 'cat-blood',
    slug: 'blood-management-cell-technologies',
    number: '02',
    title: 'Blood Management & Cell Technologies',
    description:
      'Innovative blood management and cell technology solutions supporting therapeutic apheresis, blood collection, transfusion medicine, and advanced cellular therapies through automated technologies and specialized consumables.',
    sampleProducts: ['Terumo Spectra Optia', 'Mirasol PRT System', 'Automated Blood Component Processing'],
    icon: Droplets,
  },
  {
    id: 'cat-renal',
    slug: 'renal-and-critical-care',
    number: '03',
    title: 'Renal & Critical Care',
    description:
      'Integrated technologies supporting the prevention, treatment, and management of chronic kidney disease, acute kidney injury, and critical care through advanced renal replacement systems, dialysis infrastructure, and supporting consumables.',
    sampleProducts: ['Baxter Artis Physio HD', 'AK 98 Hemodialysis', 'CleanCart & Revaclear Consumables'],
    icon: HeartPulse,
  },
  {
    id: 'cat-lab',
    slug: 'laboratory-and-diagnostics',
    number: '04',
    title: 'Laboratory & Diagnostics',
    description:
      'Comprehensive laboratory and diagnostic solutions supporting clinical chemistry, hematology, immunoassay, coagulation, infectious disease testing, point-of-care diagnostics, and laboratory automation, complemented by high-quality reagents, consumables, and workflow optimization solutions.',
    sampleProducts: ['Abbott Clinical Chemistry', 'Hematology Analyzers', 'Point-of-Care Rapid Diagnostics'],
    icon: Microscope,
  },
  {
    id: 'cat-respiratory',
    slug: 'respiratory-and-neonatal-care',
    number: '05',
    title: 'Respiratory & Neonatal Care',
    description:
      'Innovative respiratory care technologies designed to support oxygen therapy, humidification, non-invasive ventilation, and invasive ventilation across intensive care, emergency, neonatal, and home care environments.',
    sampleProducts: ['Fisher & Paykel Humidification', 'Optiflow Nasal High Flow', 'Neonatal CPAP & Bubble CPAP'],
    icon: Wind,
  },
  {
    id: 'cat-mis',
    slug: 'minimally-invasive-surgery',
    number: '06',
    title: 'Minimally Invasive Surgery (MIS)',
    description:
      'Innovative minimally invasive surgical solutions supporting laparoscopic, bariatric, thoracic, colorectal, gynecological, and urological procedures through advanced surgical stapling, endoscopic imaging, energy devices, access technologies, and specialized consumables that enhance surgical precision, efficiency, and patient outcomes.',
    sampleProducts: ['Ezisurg Endo-Staplers', 'Ultrasonic Surgical Shears', 'Laparoscopic Access Trocars'],
    icon: Scissors,
  },
]

const ProductsByCategorySection: React.FC = () => {
  return (
    <section className="bg-white py-20 lg:py-24 border-t border-sudabelt-header-border">
      <SectionReveal className="sudabelt-container">
        {/* Header Row */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <HeaderTextReveal>
            <div className="w-5.5 h-0.75 bg-sudabelt-red rounded-mark mb-3" />
            <span className="text-eyebrow text-sudabelt-green">PRODUCTS BY CATEGORY</span>
            <h2 className="text-section-heading text-sudabelt-navy mt-2.5 max-w-155">
              Comprehensive clinical &amp; diagnostic portfolio.
            </h2>
          </HeaderTextReveal>

          <Link
            to="/products"
            className="h-12.5 px-6.5 rounded-control bg-sudabelt-navy hover:bg-sudabelt-green text-white font-bold text-[13px] tracking-[0.06em] uppercase inline-flex items-center justify-center self-start lg:self-auto transition-colors shrink-0"
          >
            SEE MORE IN FULL PORTFOLIO
          </Link>
        </div>

        {/* 6 Verbatim Milanote Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PORTFOLIO_CATEGORIES.map((category) => {
            const IconComp = category.icon
            return (
              <div
                key={category.id}
                className={`p-7 rounded-card border border-sudabelt-sage flex flex-col justify-between transition-colors ${
                  category.highlighted ? 'bg-sudabelt-green-tint' : 'bg-white hover:bg-sudabelt-surface/70'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="w-10.5 h-10.5 rounded-badge bg-sudabelt-green text-white inline-flex items-center justify-center">
                      <IconComp className="w-5 h-5" strokeWidth={1.75} />
                    </div>
                    <span className="font-mono text-[12.5px] font-semibold text-sudabelt-muted">
                      {category.number}
                    </span>
                  </div>

                  <h3 className="text-[21px] leading-6.75 font-bold text-sudabelt-navy mt-5">
                    {category.title}
                  </h3>

                  <p className="text-[14px] leading-[22.5px] text-sudabelt-body mt-3">
                    {category.description}
                  </p>

                  {/* Selection of Products Linked to Portfolio */}
                  <div className="mt-5 pt-4 border-t border-sudabelt-sage/40">
                    <div className="font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-sudabelt-label mb-2">
                      Featured Solutions:
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {category.sampleProducts.map((prod) => (
                        <Link
                          key={prod}
                          to={`/products?category=${category.slug}`}
                          className="px-2.5 py-1 rounded-control bg-sudabelt-surface hover:bg-sudabelt-navy text-sudabelt-navy hover:text-white border border-sudabelt-border font-mono text-[11px] transition-colors"
                        >
                          {prod}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-2">
                  <Link
                    to={`/products?category=${category.slug}`}
                    className="text-[12px] font-extrabold uppercase tracking-[0.06em] text-sudabelt-green hover:text-sudabelt-navy transition-colors inline-flex items-center"
                  >
                    SEE MORE →
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </SectionReveal>
    </section>
  )
}

export default ProductsByCategorySection
