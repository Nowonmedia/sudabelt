import 'dotenv/config';
import { connectDB, disconnectDB } from '../config/db';
import { Product, Article, User } from '../models';
import { hashPassword } from '../utils/auth.utils';

const INITIAL_PRODUCTS = [
  {
    name: 'Baxter Artis Physio Hemodialysis System',
    slug: 'baxter-artis-physio-hemodialysis-system',
    modelNumber: 'ARTIS-PHYSIO-HD',
    sku: 'SB-HD-BAX-AP01',
    brand: 'Baxter International',
    category: 'renal-care',
    shortDescription:
      'Multi-therapy hemodialysis delivery system engineered for High-Flux HD, HDF, and HF therapies with Hemocontrol biofeedback.',
    fullOverview:
      'The Baxter Artis Physio is a multi-therapy hemodialysis delivery system engineered for High-Flux HD, HDF, and HF therapies, featuring Hemoscan and Hemocontrol biofeedback technology. Supplied, installed, and maintained across Nigeria by Sudabelt Medical with comprehensive renal nurse and biomedical engineer certification.',
    specifications: {
      electrical: {
        mainsVoltage: '220 – 240 V AC, 50 Hz',
        powerConsumption: 'Max 2,150 VA',
        batteryBackup: '30 Minutes (Extracorporeal circuit)',
      },
      fluidics: {
        inletWaterPressure: '1.2 – 6.0 Bar',
        inletWaterTemperature: '5 – 30 °C',
        dialysateFlowRate: '300 – 800 mL/min',
        ultrafiltrationRate: '0.00 – 4.00 L/h',
      },
      dimensions: {
        heightWidthDepth: '1450 x 510 x 620 mm',
        dryWeight: '95 kg',
      },
    },
    keyFeatures: [
      {
        title: 'Hemocontrol Biofeedback System',
        description:
          'Continuously adjusts dialysate conductivity and ultrafiltration rate in real time to prevent intradialytic hypotension.',
      },
      {
        title: 'Automated Setup & CleanCart Decalcification',
        description:
          'Streamlines nurse workflow with automated priming and integrated cartridge-based heat/chemical disinfection.',
      },
      {
        title: 'Diascan Clearance Monitoring',
        description:
          'Non-invasively measures ionic dialysance and delivered Kt/V dose during every treatment session.',
      },
    ],
    clinicalApplications: [
      'Chronic & Acute Hemodialysis (HD)',
      'Online Hemodiafiltration (HDF)',
      'Hemofiltration (HF)',
      'Isolated Ultrafiltration',
    ],
    complianceCertifications: ['CE Marked', 'ISO 13485', 'NAFDAC Registered'],
    images: {
      primaryCutout: '/images/products/baxter-artis-physio-cutout.webp',
      contextualGallery: [
        '/images/products/baxter-artis-physio-clinic.webp',
        '/images/products/baxter-artis-physio-ui-screen.webp',
      ],
      altText: 'Baxter Artis Physio Hemodialysis Machine supplied by Sudabelt Medical in Nigeria',
    },
    isConsumable: false,
    datasheetUrl: '/docs/datasheets/sudabelt-baxter-artis-physio-datasheet.pdf',
    compatibleProductSlugs: ['baxter-cleancart-c-disinfection-cartridge'],
    supportPackage: {
      installationIncluded: true,
      clinicalTrainingHours: 40,
      targetTrainees: ['Nephrologists', 'Renal Nurses', 'Biomedical Engineers'],
      preventiveMaintenanceSLA:
        'Quarterly Preventive Maintenance + <24hr Emergency Response in Lagos, Abuja & Kano',
      warrantyPeriod: '12 Months Comprehensive OEM & Biomedical Warranty',
      localSparePartsStocked: true,
    },
    faqs: [
      {
        question:
          'Does Sudabelt Medical provide water treatment (RO) integration for the Baxter Artis Physio?',
        answer:
          'Yes. Sudabelt conducts pre-installation water quality analysis, supplies medical-grade Reverse Osmosis (RO) systems, and configures inlet pressure regulators to meet ISO 23500 dialysis water standards.',
      },
    ],
    seoMeta: {
      metaTitle: 'Baxter Artis Physio Hemodialysis Machine Supplier in Nigeria | Sudabelt Medical',
      metaDescription:
        'Authorized supplier of the Baxter Artis Physio Hemodialysis System in Nigeria with turnkey RO installation, renal nurse training, and local CleanCart consumables.',
      keywords: [
        'Baxter Artis Physio Nigeria',
        'Hemodialysis machine supplier Lagos',
        'Dialysis equipment distributor Nigeria',
      ],
    },
    published: true,
  },
  {
    name: 'Baxter CleanCart C Citric Acid Decalcification Cartridge',
    slug: 'baxter-cleancart-c-disinfection-cartridge',
    modelNumber: 'CLEANCART-C',
    sku: 'SB-CON-BAX-CC01',
    brand: 'Baxter International',
    category: 'consumables-reagents',
    shortDescription:
      'Dry citric-acid based cartridge for automated thermo-chemical disinfection and decalcification of Baxter Artis and AK 98 systems.',
    fullOverview:
      'Dry citric-acid based cartridge designed for automated thermo-chemical disinfection and decalcification of Baxter Artis and AK 98 hemodialysis systems. Eliminates liquid chemical spills and ensures standardized machine hygiene.',
    specifications: {
      chemical: {
        activeIngredient: 'Anhydrous Citric Acid (100%)',
        compatibility: 'Baxter Artis Physio, AK 98, AK 96',
        shelfLife: '36 Months',
        unitsPerCarton: '12 Cartridges',
      },
    },
    keyFeatures: [
      {
        title: 'Spill-Free Dry Powder Cartridge',
        description:
          'Protects nursing staff from hazardous liquid acid contact and simplifies storage in tropical climates.',
      },
      {
        title: 'Automated Fluid Path Descaling',
        description:
          'Prevents calcium carbonate build-up in heating elements and flow sensors, extending machine lifespan.',
      },
    ],
    clinicalApplications: [
      'Post-Treatment Fluid Path Decalcification',
      'Heat Citric Disinfection between Dialysis Patients',
    ],
    complianceCertifications: ['CE Marked', 'ISO 13485', 'NAFDAC Registered'],
    images: {
      primaryCutout: '/images/products/baxter-cleancart-c-cutout.webp',
      contextualGallery: ['/images/products/baxter-cleancart-c-box.webp'],
      altText: 'Baxter CleanCart C Citric Acid Cartridge stocked in Nigeria by Sudabelt Medical',
    },
    isConsumable: true,
    datasheetUrl: '/docs/datasheets/sudabelt-baxter-cleancart-c-datasheet.pdf',
    compatibleProductSlugs: ['baxter-artis-physio-hemodialysis-system'],
    published: true,
  },
  {
    name: 'Terumo BCT Spectra Optia Apheresis System',
    slug: 'terumo-spectra-optia-apheresis-system',
    modelNumber: 'SPECTRA-OPTIA',
    sku: 'SB-BB-TER-SO01',
    brand: 'Terumo BCT',
    category: 'blood-banking-apheresis',
    shortDescription:
      'Therapeutic apheresis, cell collection, and Automated Red Blood Cell Exchange (ARCET) platform for Sickle Cell Disease management.',
    fullOverview:
      'Industry-leading therapeutic apheresis, cell collection, and Automated Red Blood Cell Exchange (ARCET) platform. Critical for Sickle Cell Disease management, plasma exchange, and oncology stem cell protocols across Nigerian teaching hospitals and specialist centers.',
    specifications: {
      centrifuge: {
        speed: 'Up to 3,000 RPM',
        inletFlowRate: '5 – 142 mL/min',
        extracorporealVolume: '141 – 191 mL',
      },
      electrical: {
        voltageRating: '100 – 240 V AC, 50/60 Hz',
        dimensions: '1055 x 527 x 813 mm',
        weight: '92 kg',
      },
    },
    keyFeatures: [
      {
        title: 'Automated Interface Management (AIM) System',
        description:
          'Optical sensor performs real-time interface monitoring and adjustment 25 times per second for high-purity cell separation.',
      },
      {
        title: 'Transformative Sickle Cell Crisis Management',
        description:
          'Rapidly replaces sickled red cells with healthy donor erythrocytes while maintaining patient isovolemia.',
      },
    ],
    clinicalApplications: [
      'Automated Red Blood Cell Exchange (RBCX / ARCET) for Sickle Cell Disease',
      'Therapeutic Plasma Exchange (TPE)',
      'Mononuclear Cell (MNC) & Stem Cell Collection',
    ],
    complianceCertifications: ['CE Marked', 'FDA 510(k)', 'ISO 13485', 'NAFDAC Registered'],
    images: {
      primaryCutout: '/images/products/terumo-spectra-optia-cutout.webp',
      contextualGallery: ['/images/products/terumo-spectra-optia-hospital.webp'],
      altText: 'Terumo Spectra Optia Apheresis Machine for Sickle Cell Exchange in Nigeria',
    },
    isConsumable: false,
    datasheetUrl: '/docs/datasheets/sudabelt-terumo-spectra-optia-datasheet.pdf',
    published: true,
  },
];

const INITIAL_ARTICLES = [
  {
    title: 'Advancing Blood Safety in Nigeria with Mirasol Pathogen Reduction Technology',
    slug: 'mirasol-prt-blood-safety-advances',
    type: 'newsletter' as const,
    issueNumber: 12,
    quarter: 'Q1' as const,
    year: 2026,
    category: 'Blood Safety & Hematology',
    summary:
      'How riboflavin and UV light pathogen reduction protects transfusion recipients from emerging infectious threats in Nigerian tertiary hospitals.',
    content:
      '<article><h2>Elevating Transfusion Safety Across West Africa</h2><p>Sudabelt Medical continues to partner with tertiary blood banks and teaching hospitals across Nigeria to deploy Terumo BCT Mirasol Pathogen Reduction Technology (PRT) and Spectra Optia apheresis platforms.</p></article>',
    takeaways: [
      'Inactivates viruses, bacteria, and parasites including malaria in blood components',
      'Backed by Sudabelt on-site laboratory scientist certification and preventive biomedical maintenance',
    ],
    coverImage: '/images/newsletters/mirasol-blood-safety-cover.webp',
    pdfUrl: '/docs/newsletters/sudabelt-newsletter-issue-12.pdf',
    readTimeMinutes: 6,
    featuredProductSlugs: ['terumo-spectra-optia-apheresis-system'],
    publishedDate: new Date('2026-02-15'),
    published: true,
  },
  {
    title: 'Standardizing Dialysis Machine Hygiene: Why Dry Citric Cartridges Outperform Liquid Acid',
    slug: 'standardizing-dialysis-hygiene-cleancart-c',
    type: 'newsletter' as const,
    issueNumber: 11,
    quarter: 'Q4' as const,
    year: 2025,
    category: 'Renal Care',
    summary:
      'Preventing scale buildup and extending hemodialysis machine uptime across Nigerian renal centers using automated CleanCart C protocols.',
    content:
      '<article><h2>Eliminating Calcium Carbonate Downtime in Renal Units</h2><p>Hard water scaling and inconsistent liquid chemical dilution are leading causes of premature flow-sensor failures in dialysis centers. Here is how Baxter CleanCart C and ISO 23500 RO water integration protect your fleet.</p></article>',
    takeaways: [
      'Zero hazardous liquid acid handling for renal nursing staff',
      'Continuous buffer inventory stocked in Lagos, Abuja, and Kano warehouses',
    ],
    coverImage: '/images/newsletters/cleancart-renal-hygiene-cover.webp',
    pdfUrl: '/docs/newsletters/sudabelt-newsletter-issue-11.pdf',
    readTimeMinutes: 5,
    featuredProductSlugs: [
      'baxter-artis-physio-hemodialysis-system',
      'baxter-cleancart-c-disinfection-cartridge',
    ],
    publishedDate: new Date('2025-11-10'),
    published: true,
  },
];

const runSeed = async (): Promise<void> => {
  await connectDB();

  try {
    // 1. Upsert Default Admin User
    const adminEmail = (process.env.ADMIN_EMAIL || 'admin@sudabelt.com').toLowerCase().trim();
    const adminPlainPassword = process.env.ADMIN_PASSWORD || 'SudabeltAdmin2026!';
    await User.findOneAndUpdate(
      { email: adminEmail },
      {
        $setOnInsert: {
          name: process.env.ADMIN_NAME || 'Sudabelt Administrator',
          email: adminEmail,
          passwordHash: hashPassword(adminPlainPassword),
          role: 'admin',
          isActive: true,
        },
      },
      { upsert: true, new: true }
    );
    console.log(`[Seed] Verified admin user: ${adminEmail}`);

    // 2. Upsert Baseline Products (Ready to be expanded with full Milanote catalog)
    for (const product of INITIAL_PRODUCTS) {
      await Product.findOneAndUpdate(
        { slug: product.slug },
        { $set: product },
        { upsert: true, new: true }
      );
    }
    console.log(`[Seed] Upserted ${INITIAL_PRODUCTS.length} baseline equipment & consumable items.`);

    // 3. Upsert Baseline Newsletters
    for (const article of INITIAL_ARTICLES) {
      await Article.findOneAndUpdate(
        { slug: article.slug },
        { $set: article },
        { upsert: true, new: true }
      );
    }
    console.log(`[Seed] Upserted ${INITIAL_ARTICLES.length} baseline newsletter editions.`);

    console.log('[Seed] Database seeding completed successfully.');
  } finally {
    await disconnectDB();
  }
};

void runSeed();
