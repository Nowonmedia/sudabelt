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
  previewImages: { name: string; img: string }[]
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
    previewImages: [
      {
        name: 'Revolution Ascend CT Platform',
        img: 'https://res.cloudinary.com/ajgpbpap/image/upload/v1795005837/sudabelt/products/imaging-and-life-care/ge-revolution-ascend-ct_1.png',
      },
      {
        name: 'SIGNA Hero MRI',
        img: 'https://res.cloudinary.com/ajgpbpap/image/upload/v1795005835/sudabelt/products/imaging-and-life-care/ge-signa-hero-1-5t-mri_1.jpg',
      },
      {
        name: 'CARESCAPE B650 Patient Monitor',
        img: 'https://res.cloudinary.com/ajgpbpap/image/upload/v1795005842/sudabelt/products/imaging-and-life-care/ge-carescape-b650-patient-monitor_1.png',
      },
    ],
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
    previewImages: [
      {
        name: 'Spectra Optia Apheresis System',
        img: 'https://res.cloudinary.com/ajgpbpap/image/upload/v1795005882/sudabelt/products/blood-management-cell-technologies/terumo-bct-spectra-optia_1.png',
      },
      {
        name: 'Trima Accel Automated Blood Collection',
        img: 'https://res.cloudinary.com/ajgpbpap/image/upload/v1795005879/sudabelt/products/blood-management-cell-technologies/terumo-trima-accel-automated-blood-collection-system_1.jpg',
      },
      {
        name: 'Reveos Automated Blood Processing',
        img: 'https://res.cloudinary.com/ajgpbpap/image/upload/v1795005874/sudabelt/products/blood-management-cell-technologies/terumo-bct-reveos_1.png',
      },
    ],
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
    previewImages: [
      {
        name: 'Baxter AK 98 Hemodialysis System',
        img: 'https://res.cloudinary.com/ajgpbpap/image/upload/v1795005852/sudabelt/products/renal-and-critical-care/baxter-phoenix-ak-98_1.png',
      },
      {
        name: 'Artis Physio Hemodialysis System',
        img: 'https://res.cloudinary.com/ajgpbpap/image/upload/v1795005849/sudabelt/products/renal-and-critical-care/baxter-artis-physio-hemodialysis-system_1.jpg',
      },
      {
        name: 'PrisMax System',
        img: 'https://res.cloudinary.com/ajgpbpap/image/upload/v1795005854/sudabelt/products/renal-and-critical-care/baxter-prismax-2_1.png',
      },
    ],
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
    previewImages: [
      {
        name: 'Maccura F Series Hematology Analyzer',
        img: 'https://res.cloudinary.com/ajgpbpap/image/upload/v1795005895/sudabelt/products/laboratory-and-diagnostics/maccura-f580_1.png',
      },
      {
        name: 'Maccura Chemiluminescence Analyzer',
        img: 'https://res.cloudinary.com/ajgpbpap/image/upload/v1795005893/sudabelt/products/laboratory-and-diagnostics/maccura-is-1200_1.png',
      },
    ],
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
    previewImages: [
      {
        name: 'AIRVO 2 High Flow System',
        img: 'https://res.cloudinary.com/ajgpbpap/image/upload/v1795005905/sudabelt/products/respiratory-and-neonatal-care/fisher-paykel-airvo-2-high-flow_1.png',
      },
      {
        name: 'F&P 950 System',
        img: 'https://res.cloudinary.com/ajgpbpap/image/upload/v1795005903/sudabelt/products/respiratory-and-neonatal-care/fisher-paykel-optiflow-thrive_1.jpg',
      },
      {
        name: 'MR850 Heated Humidifier',
        img: 'https://res.cloudinary.com/ajgpbpap/image/upload/v1795005910/sudabelt/products/respiratory-and-neonatal-care/fisher-paykel-mr850-system_1.jpg',
      },
    ],
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
    previewImages: [
      {
        name: 'easyEndo Linear Cutting Stapler',
        img: 'https://res.cloudinary.com/ajgpbpap/image/upload/v1795005920/sudabelt/products/minimally-invasive-surgery/ezisurg-easyendo-linear-cutting-stapler_1.png',
      },
      {
        name: 'easyUS Ultrasonic Surgical System',
        img: 'https://res.cloudinary.com/ajgpbpap/image/upload/v1795005924/sudabelt/products/minimally-invasive-surgery/ezisurg-easyus-ultrasonic-surgical-system_1.png',
      },
      {
        name: 'Cam-Drive Laparoscopic System',
        img: 'https://res.cloudinary.com/ajgpbpap/image/upload/v1795005918/sudabelt/products/minimally-invasive-surgery/ezisurg-cam-drive-laparoscopic-system_1.png',
      },
    ],
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

                    {/* Category Product Preview Strip */}
                    <div
                      className={`grid gap-3 mt-6 ${
                        category.previewImages.length === 2 ? 'grid-cols-2' : 'grid-cols-3'
                      }`}
                    >
                      {category.previewImages.map((item) => (
                        <Link
                          key={item.name}
                          to={`/products?category=${category.slug}`}
                          title={item.name}
                          className="h-36 sm:h-40 rounded-xl bg-sudabelt-surface group-hover:bg-white/95 border border-sudabelt-border/70 group-hover:border-white/30 p-3 flex items-center justify-center overflow-hidden transition-all duration-300"
                        >
                          <img
                            src={item.img}
                            alt={item.name}
                            loading="lazy"
                            className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                          />
                        </Link>
                      ))}
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
