import 'dotenv/config';
import { connectDB, disconnectDB } from '../config/db';
import {
  Product,
  Article,
  Project,
  NewsletterSubscriber,
  NewsletterCampaign,
  User,
  RFQ,
  AfterSalesTicket,
} from '../models';
import { hashPassword } from '../utils/auth.utils';
import { storage } from '../services/storageService';

const SEED_USERS = [
  {
    name: 'Sudabelt Executive Superadmin',
    email: 'admin@sudabelt.com',
    passwordHash: hashPassword('SudabeltAdmin2026!'),
    role: 'superadmin',
    isActive: true,
  },
  {
    name: 'Biomedical Operations Lead',
    email: 'biomed@sudabelt.com',
    passwordHash: hashPassword('SudabeltBiomed2026!'),
    role: 'admin',
    isActive: true,
  },
  {
    name: 'Clinical Content Editor',
    email: 'editor@sudabelt.com',
    passwordHash: hashPassword('SudabeltEditor2026!'),
    role: 'editor',
    isActive: true,
  },
];

const SEED_PROJECTS = [
  {
    title: 'Gbagada General Hospital oxygen plant',
    slug: 'gbagada-general-hospital-oxygen-plant',
    category: 'Oxygen & medical gas',
    facilityName: 'Gbagada General Hospital',
    locationState: 'Lagos',
    city: 'Gbagada, Lagos',
    completionYear: 2020,
    isFeatured: true,
    heroImage: '/images/projects/project-gbagada.webp',
    galleryImages: ['/images/projects/project-gbagada.webp', '/images/services/services-gbagada.webp'],
    shortDescription:
      'A major role in the COVID-19 pandemic response, commissioned by the Lagos State Government with an official letter of commendation.',
    fullDescription:
      'Turnkey delivery, mechanical installation, electrical integration, and commissioning of a high-capacity Medical Oxygen Pressure Swing Adsorption (PSA) Generating Plant at Gbagada General Hospital. The project provides dedicated pipeline oxygen supply to COVID-19 isolation wards, ICU, and surgical suites, backed by cylinder manifold backup and continuous 24/7 biomedical engineering SLA.',
    clientOrCommissionedBy: 'Lagos State Ministry of Health & Lagos State Government',
    scopeOfWork: [
      'Turnkey Medical Oxygen Pressure Swing Adsorption (PSA) Generating Plant.',
      'High-pressure cylinder manifold filling station and distribution piping.',
      'Emergency delivery and commissioning during peak pandemic demand.',
      'Certified Lagos State biomedical engineering training & ongoing SLA.',
    ],
    equipmentSupplied: [
      'PSA Medical Oxygen Generation System (60 m³/hr)',
      'High-Pressure Oxygen Booster Compressor (150 bar)',
      'Duplex Medical Air Compressor & Refrigerated Air Dryer',
      'Automatic Manifold Changeover System',
    ],
    impactMetrics: [
      { label: 'Plant Capacity', value: '60 m³/hr' },
      { label: 'Cylinder Filling', value: '180 Cylinders/Day' },
      { label: 'Continuous Uptime', value: '99.8%' },
    ],
    published: true,
    isDeleted: false,
  },
  {
    title: 'Enoch & Folu Adeboye Dialysis Centre',
    slug: 'enoch-and-folu-adeboye-dialysis-centre',
    category: 'Dialysis & renal',
    facilityName: 'Enoch & Folu Adeboye Dialysis Centre',
    locationState: 'Abuja',
    city: 'Abuja, FCT',
    completionYear: 2022,
    isFeatured: true,
    heroImage: '/images/projects/project-adeboye.webp',
    galleryImages: ['/images/projects/project-adeboye.webp'],
    shortDescription:
      'Eight advanced dialysis machines equipped with a medical-grade reverse osmosis water purification system.',
    fullDescription:
      'Turnkey clinical equipping of a premier renal care centre in Abuja, featuring 8 high-flux hemodialysis stations, dual-pass clinical Reverse Osmosis (RO) water purification plant, sanitary distribution loop, and comprehensive renal nursing certification.',
    clientOrCommissionedBy: 'His Love Foundation / RCCG National Healthcare Outreach',
    scopeOfWork: [
      '8 High-flux hemodialysis machines with automated ultrafiltration.',
      'Double-pass clinical reverse osmosis water treatment system.',
      'Pure water distribution loop and dialysis consumables pipeline.',
      'Clinical applications certification for nephrology staff.',
    ],
    equipmentSupplied: [
      'Baxter Artis Physio & SWS-6000 Hemodialysis Machines',
      'Clinical Double-Pass Reverse Osmosis (RO) Plant',
      'Electronic Dialysis Treatment Chairs',
      'Automated Decalcification & Disinfection Systems',
    ],
    impactMetrics: [
      { label: 'Hemodialysis Stations', value: '8 Stations' },
      { label: 'Water Purity', value: 'ISO 23500 Compliant' },
      { label: 'Patients Supported', value: '1,200+ Annually' },
    ],
    published: true,
    isDeleted: false,
  },
  {
    title: 'Reference Hospital, Okene',
    slug: 'reference-hospital-okene',
    category: 'Hospital equipping',
    facilityName: 'Reference Hospital Okene',
    locationState: 'Kogi',
    city: 'Okene, Kogi State',
    completionYear: 2022,
    isFeatured: false,
    heroImage: '/images/projects/project-okene.webp',
    galleryImages: ['/images/projects/project-okene.webp'],
    shortDescription:
      'A landmark multi-department hospital project delivered, installed, and commissioned by President Muhammadu Buhari.',
    fullDescription:
      'Comprehensive turnkey medical equipment delivery and installation across surgical theatre suites, intensive care units, central sterilization department (CSSD), and advanced diagnostic imaging at the ultra-modern Reference Hospital in Okene, Kogi State.',
    clientOrCommissionedBy: 'Federal Government of Nigeria & Kogi State Government',
    scopeOfWork: [
      'Multi-department clinical equipping across theatre suites, ICU, and radiology.',
      'Advanced patient monitoring networks and critical care ventilators.',
      'Biomedical installation, rigorous load testing, and commissioning ceremony.',
      'Local biomedical support team deployment for continuous uptime.',
    ],
    equipmentSupplied: [
      'GE Diagnostic Ultrasound Systems',
      'Surgical C-Arm & Operating Tables',
      'Critical Care ICU Ventilators & Defibrillators',
      'Hospital Sterilization & Autoclave Units',
    ],
    impactMetrics: [
      { label: 'Departments Equipped', value: '7 Core Specialties' },
      { label: 'Bed Capacity', value: '300+ Beds' },
    ],
    published: true,
    isDeleted: false,
  },
  {
    title: 'Ring Road Hospital, Ibadan',
    slug: 'ring-road-hospital-ibadan',
    category: 'Dialysis & renal',
    facilityName: 'Ring Road State Hospital',
    locationState: 'Oyo',
    city: 'Ibadan, Oyo State',
    completionYear: 2022,
    isFeatured: false,
    heroImage: '/images/projects/project-ibadan.webp',
    galleryImages: ['/images/projects/project-ibadan.webp'],
    shortDescription:
      'A specialized renal care centre equipped with hemodialysis machines, water treatment, and consumables pipeline.',
    fullDescription:
      'Establishment and clinical activation of the state dialysis centre at Ring Road Hospital Ibadan, establishing local capacity for affordable chronic kidney disease care in Oyo State.',
    clientOrCommissionedBy: 'Oyo State Hospitals Management Board',
    scopeOfWork: [
      'Turnkey renal unit planning, layout optimization, and installation.',
      'Hemodialysis stations, treatment chairs, and patient monitoring.',
      'Hospital biomedical staff hands-on operational training.',
      'Genuine spare parts supply agreement and preventive maintenance.',
    ],
    equipmentSupplied: [
      'Baxter Hemodialysis Systems',
      'Medical RO System with UV Sterilization',
      'Consumables: Bloodlines, Dialyzers, Acid Concentrates',
    ],
    impactMetrics: [
      { label: 'Renal Sessions', value: '250+ Monthly' },
      { label: 'Trained Nurses', value: '16 Certified' },
    ],
    published: true,
    isDeleted: false,
  },
  {
    title: 'Kano Medical Centre',
    slug: 'kano-medical-centre',
    category: 'Imaging & diagnostics',
    facilityName: 'Kano Medical Centre',
    locationState: 'Kano',
    city: 'Kano City',
    completionYear: 2020,
    isFeatured: false,
    heroImage: '/images/projects/project-kano.webp',
    galleryImages: ['/images/projects/project-kano.webp'],
    shortDescription:
      'A GE Revolution EVO CT machine and Abbott clinical chemistry equipment delivered and installed.',
    fullDescription:
      'Turnkey radiology and core laboratory equipping for Kano Medical Centre, featuring GE 128-slice computed tomography (CT) installation with radiation shielding audit, power conditioning, and Abbott automated clinical chemistry analyzers.',
    clientOrCommissionedBy: 'Kano State Ministry of Health',
    scopeOfWork: [
      'Radiation shielding lead-lining site preparation.',
      'GE Revolution EVO 128-Slice CT scanner installation and chiller setup.',
      'Abbott Architect & clinical chemistry analyzer integration.',
      'Radiographer and biomedical technician certification.',
    ],
    equipmentSupplied: [
      'GE Revolution EVO 128-Slice CT Scanner',
      'Abbott Automated Chemistry Analyzer',
      'Dedicated Medical UPS & Servo Voltage Stabilizer',
    ],
    impactMetrics: [
      { label: 'Diagnostic Scans', value: '45+ Daily' },
      { label: 'Dose Optimization', value: 'Up to 82% ASiR-V' },
    ],
    published: true,
    isDeleted: false,
  },
  {
    title: 'NNPC Multi-Specialist Hospital',
    slug: 'nnpc-multi-specialist-hospital',
    category: 'Imaging & diagnostics',
    facilityName: 'NNPC Multi-Specialist Hospital',
    locationState: 'Abuja',
    city: 'Abuja, FCT',
    completionYear: 2020,
    isFeatured: false,
    heroImage: '/images/projects/project-nnpc.webp',
    galleryImages: ['/images/projects/project-nnpc.webp'],
    shortDescription:
      'Abbott c4000 chemistry analyzer and Cell-Dyn Emerald hematology analyzer supplied, installed, and staff trained.',
    fullDescription:
      'High-throughput clinical pathology laboratory installation for NNPC Multi-Specialist Hospital Abuja, featuring Abbott Architect c4000 integrated clinical chemistry system and 5-part differential hematology platforms.',
    clientOrCommissionedBy: 'NNPC Medical Services Division',
    scopeOfWork: [
      'Core diagnostic laboratory automation design and installation.',
      'Cold-chain reagent storage and inventory buffer setup.',
      'Medical laboratory scientist hands-on method validation training.',
      'Annual maintenance contract with local Abbott certified engineers.',
    ],
    equipmentSupplied: [
      'Abbott Architect c4000 Clinical Chemistry Analyzer',
      'Abbott Cell-Dyn Emerald Hematology System',
      'Laboratory Water Purification Deionizer',
    ],
    impactMetrics: [
      { label: 'Tests / Hour', value: 'Up to 800 Photometric' },
      { label: 'Uptime SLA', value: '<24hr Local Response' },
    ],
    published: true,
    isDeleted: false,
  },
];

const SEED_PRODUCTS = [
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
        dialysateFlowRate: '300 – 800 mL/min',
        ultrafiltrationRate: '0.00 – 4.00 L/h',
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
    ],
    clinicalApplications: [
      'Chronic & Acute Hemodialysis (HD)',
      'Online Hemodiafiltration (HDF)',
      'Isolated Ultrafiltration',
    ],
    complianceCertifications: ['CE Marked', 'ISO 13485', 'NAFDAC Registered'],
    images: {
      primaryCutout: '/images/products/baxter-artis-physio-cutout.webp',
      contextualGallery: ['/images/products/baxter-artis-physio-clinic.webp'],
      altText: 'Baxter Artis Physio Hemodialysis Machine supplied by Sudabelt Medical',
    },
    isConsumable: false,
    datasheetUrl: '/docs/datasheets/sudabelt-baxter-artis-physio-datasheet.pdf',
    supportPackage: {
      installationIncluded: true,
      clinicalTrainingHours: 40,
      targetTrainees: ['Nephrologists', 'Renal Nurses', 'Biomedical Engineers'],
      preventiveMaintenanceSLA: 'Quarterly PM + <24hr Emergency Response',
      warrantyPeriod: '12 Months Comprehensive OEM & Biomedical Warranty',
      localSparePartsStocked: true,
    },
    published: true,
  },
  {
    name: 'GE LOGIQ E10 Ultrasound Imaging System',
    slug: 'ge-logiq-e10-ultrasound-system',
    modelNumber: 'LOGIQ-E10',
    sku: 'SB-IMG-GE-E10',
    brand: 'GE HealthCare',
    category: 'diagnostic-imaging',
    shortDescription:
      'Next-generation ultrasound platform powered by cSound Architecture for unprecedented clarity across abdominal, OB/GYN, and vascular exams.',
    fullOverview:
      'The GE LOGIQ E10 delivers exceptional image quality across all patient habitus through GPU-accelerated beamforming and AI-assisted measurement tools. Backed by Sudabelt Medical applications specialists across Nigerian teaching and specialist hospitals.',
    specifications: {
      display: {
        monitorSize: '23.8-inch High-Definition OLED',
        touchscreen: '12.1-inch Multi-touch Command Panel',
      },
      imaging: {
        architecture: 'cSound Image Processing Architecture',
        frameRate: 'Up to 2,000 frames/second',
      },
    },
    keyFeatures: [
      {
        title: 'cSound Digital Beamformer',
        description: 'Acquires extraordinary clinical detail with pixel-level uniform resolution from near to far field.',
      },
      {
        title: 'Shear Wave Elastography',
        description: 'Provides non-invasive quantitative liver stiffness and tissue elasticity measurement.',
      },
    ],
    clinicalApplications: ['General Imaging', 'Abdominal & Liver Assessment', 'OB/GYN & Fetal Health', 'Cardiovascular Screening'],
    complianceCertifications: ['CE Marked', 'FDA Cleared', 'ISO 13485', 'NAFDAC Registered'],
    images: {
      primaryCutout: '/images/products/ge-logiq-e10-cutout.webp',
      altText: 'GE LOGIQ E10 Ultrasound Scanner supplied by Sudabelt Medical',
    },
    isConsumable: false,
    datasheetUrl: '/docs/datasheets/sudabelt-ge-logiq-e10-datasheet.pdf',
    supportPackage: {
      installationIncluded: true,
      clinicalTrainingHours: 32,
      preventiveMaintenanceSLA: 'Semi-annual probe calibration and preventive check',
      warrantyPeriod: '24 Months OEM Transducer & System Warranty',
      localSparePartsStocked: true,
    },
    published: true,
  },
  {
    name: 'Fisher & Paykel Airvo 2 High Flow System',
    slug: 'fisher-paykel-airvo-2-high-flow',
    modelNumber: 'AIRVO-2',
    sku: 'SB-RESP-FP-AV02',
    brand: 'Fisher & Paykel Healthcare',
    category: 'respiratory-critical-care',
    shortDescription:
      'Optiflow High Flow Nasal Cannula therapy delivering warm, humidified respiratory gases up to 60 L/min for ICU and emergency care.',
    fullOverview:
      'The Airvo 2 system features an integrated flow generator and humidification chamber designed to deliver comfortable, precise high-flow oxygen therapy to spontaneous breathing patients. Widely deployed across Nigerian critical care and pediatric wards.',
    specifications: {
      flowRange: '2 to 60 L/min (Pediatric to Adult modes)',
      oxygenFraction: '21% to 100% with integrated ultrasonic sensor',
      humidityOutput: '>33 mg/L at 37°C target',
    },
    keyFeatures: [
      {
        title: 'Integrated Flow Generator',
        description: 'Operates independently of wall air compressors for flexible point-of-care mobility.',
      },
      {
        title: 'Optiflow Nasal Cannula Interface',
        description: 'Soft, anatomical prongs maintain continuous mucociliary clearance and patient comfort.',
      },
    ],
    clinicalApplications: ['Acute Respiratory Distress Syndrome (ARDS)', 'Post-Extubation Support', 'Viral Pneumonia & Hypoxemia'],
    complianceCertifications: ['CE Marked', 'ISO 13485', 'NAFDAC Registered'],
    images: {
      primaryCutout: '/images/products/airvo-2-cutout.webp',
      altText: 'Fisher & Paykel Airvo 2 High Flow Nasal Oxygen System',
    },
    isConsumable: false,
    datasheetUrl: '/docs/datasheets/sudabelt-airvo-2-datasheet.pdf',
    supportPackage: {
      installationIncluded: true,
      clinicalTrainingHours: 16,
      warrantyPeriod: '12 Months Warranty',
      localSparePartsStocked: true,
    },
    published: true,
  },
  {
    name: 'Baxter CleanCart C Decalcification Cartridge',
    slug: 'baxter-cleancart-c-disinfection-cartridge',
    modelNumber: 'CLEANCART-C',
    sku: 'SB-CON-BAX-CC01',
    brand: 'Baxter International',
    category: 'consumables-reagents',
    shortDescription:
      'Dry citric-acid based cartridge for automated thermo-chemical disinfection and decalcification of Baxter dialysis systems.',
    fullOverview:
      'Dry citric-acid based cartridge designed for automated thermo-chemical disinfection and decalcification of Baxter Artis and AK 98 hemodialysis systems. Eliminates liquid chemical spills and ensures standardized machine hygiene.',
    specifications: {
      chemical: {
        activeIngredient: 'Anhydrous Citric Acid (100%)',
        unitsPerCarton: '12 Cartridges',
      },
    },
    keyFeatures: [
      {
        title: 'Spill-Free Dry Powder Cartridge',
        description: 'Protects nursing staff from hazardous liquid acid contact.',
      },
    ],
    clinicalApplications: ['Post-Treatment Fluid Path Decalcification'],
    complianceCertifications: ['CE Marked', 'ISO 13485', 'NAFDAC Registered'],
    images: {
      primaryCutout: '/images/products/baxter-cleancart-c-cutout.webp',
      altText: 'Baxter CleanCart C Citric Acid Cartridge',
    },
    isConsumable: true,
    datasheetUrl: '/docs/datasheets/sudabelt-cleancart-c-datasheet.pdf',
    published: true,
  },
];

const SEED_ARTICLES = [
  {
    title: 'Mitigating Unplanned Downtime in Nigerian Renal Units: A Water Quality & SLA Guide',
    slug: 'mitigating-unplanned-downtime-nigerian-renal-units',
    type: 'blog',
    category: 'Renal Care Engineering',
    summary:
      'How pre-installation chemical water audits and local buffer spare parts reduce hemodialysis machine failures by over 80%.',
    content: `## The Reality of Renal Uptime in Sub-Saharan Africa\n\nChronic Kidney Disease (CKD) incidence across West Africa demands renal facilities that operate without interruption. However, municipal power fluctuations and varying feed-water mineral hardness frequently cause premature fouling of reverse osmosis membranes and heater scale in dialysis machines.\n\n### Core Engineering Interventions\n\n1. **Pre-Installation Feed-Water Chemistry**: Testing for chlorine, chloramines, calcium carbonate, and microbiological endotoxins before machine delivery.\n2. **Double-Pass Reverse Osmosis**: Ensuring total dissolved solids (TDS) remain below ISO 23500 limits.\n3. **Local Consumable Buffer Stock**: Warehousing genuine bloodlines, dialyzers, and CleanCart disinfection media in Lagos, Abuja, and Kano.\n\nSudabelt Medical guarantees turnkey uptime through certified resident biomedical engineers and 24-hour response SLAs.`,
    coverImage: '/images/projects/project-adeboye.webp',
    readTimeMinutes: 6,
    publishedDate: new Date('2026-02-15'),
    published: true,
  },
  {
    title: 'Medical Oxygen Infrastructure: Lessons from Turnkey PSA Plant Deliveries Across Nigeria',
    slug: 'medical-oxygen-infrastructure-lessons-turnkey-psa-plants',
    type: 'blog',
    category: 'Hospital Infrastructure',
    summary:
      'Why on-site Pressure Swing Adsorption (PSA) oxygen generation delivers superior clinical safety and long-term operating cost reduction compared to cylinder logistics.',
    content: `## Transforming Hospital Oxygen Self-Sufficiency\n\nDuring clinical surges, relying solely on commercial liquid oxygen delivery over long highway distances creates catastrophic supply bottlenecks. On-site PSA plants, such as the landmark installation at Gbagada General Hospital in Lagos, provide guaranteed 93% ± 3% purity oxygen on demand.\n\n### Key Considerations for Hospital Planners\n\n- **Site Structural Audit**: Ensuring adequate ventilation, stable foundation loading, and isolated power backup.\n- **Duplex Compression**: Automatic failover air compressors to prevent single points of failure.\n- **Continuous Purity Monitoring**: Medical paramagnetic oxygen sensors with automatic venting if purity dips below statutory specifications.\n\nSudabelt Medical provides complete turnkey site engineering, installation, staff certification, and lifecycle maintenance.`,
    coverImage: '/images/projects/project-gbagada.webp',
    readTimeMinutes: 8,
    publishedDate: new Date('2026-03-01'),
    published: true,
  },
  {
    title: 'Sudabelt Healthcare Quarterly: Advances in African Hospital Technology',
    slug: 'sudabelt-healthcare-quarterly-q1-2026',
    type: 'newsletter',
    issueNumber: 1,
    quarter: 'Q1',
    year: 2026,
    category: 'Industry Newsletter',
    summary:
      'Q1 2026 Edition: Strategic OEM partnerships, national renal expansion, and updates from the Sudabelt Biomedical Training Hub.',
    content: `Welcome to the inaugural 2026 edition of the Sudabelt Healthcare Quarterly.\n\nIn this issue, we highlight the commissioning of new dialysis centres across northern Nigeria, introduce our newest diagnostic imaging modalities from GE HealthCare, and showcase our biomedical engineering capacity-building milestones.\n\nSubscribe to receive clinical whitepapers, technology updates, and healthcare infrastructure reports directly in your inbox.`,
    coverImage: '/images/services/service-1-tech.jpg',
    readTimeMinutes: 5,
    publishedDate: new Date('2026-01-10'),
    published: true,
  },
];

const SEED_SUBSCRIBERS = [
  {
    email: 'clinical-director@uch-ibadan.org.ng',
    name: 'Prof. Olufemi Adebayo',
    institution: 'University College Hospital (UCH) Ibadan',
    source: 'website_footer',
    isActive: true,
    subscribedAt: new Date('2026-01-15'),
    tags: ['renal_care', 'procurement'],
  },
  {
    email: 'procurement@nationalhospital.gov.ng',
    name: 'Dr. Fatima Bello',
    institution: 'National Hospital Abuja',
    source: 'rfq_tray',
    isActive: true,
    subscribedAt: new Date('2026-02-02'),
    tags: ['icu_equipment', 'hospital_leadership'],
  },
  {
    email: 'biomedical.head@akth.edu.ng',
    name: 'Engr. Haruna Mohammed',
    institution: 'Aminu Kano Teaching Hospital',
    source: 'training_hub',
    isActive: true,
    subscribedAt: new Date('2026-02-20'),
    tags: ['biomedical_training', 'imaging'],
  },
];

const SEED_CAMPAIGNS = [
  {
    title: 'Sudabelt Clinical Dispatch: Q1 2026 Renal & ICU Infrastructure',
    slug: 'sudabelt-clinical-dispatch-q1-2026',
    subject: 'Sustaining 99.5% Clinical Uptime: New Guidelines for Nigerian Renal Units',
    issueNumber: 1,
    quarter: 'Q1',
    year: 2026,
    summary: 'Executive briefing on pre-installation water treatment, buffer stock warehouses, and biomedical certification.',
    content: 'Full quarterly report and clinical engineering updates from Sudabelt Medical.',
    coverImage: '/images/projects/project-adeboye.webp',
    status: 'sent',
    sentAt: new Date('2026-01-25'),
    recipientCount: 3,
    published: true,
  },
  {
    title: 'Sudabelt Technology Review: Q2 2026 Diagnostic Imaging Modernization',
    slug: 'sudabelt-technology-review-q2-2026',
    subject: 'Next-Gen Ultrasound & Computed Tomography in Sub-Saharan Africa',
    issueNumber: 2,
    quarter: 'Q2',
    year: 2026,
    summary: 'Preview of AI-assisted ultrasound beamforming, radiation dose reduction, and local service warranties.',
    content: 'Draft content for Q2 edition.',
    coverImage: '/images/services/service-1-tech.jpg',
    status: 'draft',
    published: false,
  },
];

const SEED_RFQS = [
  {
    referenceId: 'SBM-RFQ-2026-001',
    facilityName: 'University College Hospital (UCH) Ibadan',
    facilityType: 'Teaching Hospital',
    location: {
      city: 'Ibadan',
      state: 'Oyo',
      country: 'Nigeria',
    },
    urgency: 'Medium (1 - 3 months)',
    selectedItems: [
      {
        name: 'Baxter Artis Physio Hemodialysis System',
        category: 'renal-care',
        quantity: 4,
        notes: 'Includes double-pass RO plant and 1-year CleanCart supply.',
      },
    ],
    slaTier: 'Comprehensive 24/7 Biomedical SLA',
    contact: {
      name: 'Dr. Kehinde Adeleke',
      role: 'Chief Nephrologist & Head of Renal Services',
      email: 'k.adeleke@uch-ibadan.org.ng',
      phone: '+234 803 123 4567',
    },
    status: 'pending',
  },
  {
    referenceId: 'SBM-RFQ-2026-002',
    facilityName: 'Asokoro District Hospital',
    facilityType: 'District Specialist Hospital',
    location: {
      city: 'Abuja',
      state: 'FCT',
      country: 'Nigeria',
    },
    urgency: 'Immediate (Urgent procurement)',
    selectedItems: [
      {
        name: 'Fisher & Paykel Airvo 2 High Flow System',
        category: 'respiratory-critical-care',
        quantity: 6,
        notes: 'Required for ICU pediatric & adult high flow oxygen therapy.',
      },
    ],
    contact: {
      name: 'Matron Aisha Danladi',
      role: 'ICU Nursing Coordinator',
      email: 'a.danladi@asokorohospital.gov.ng',
      phone: '+234 802 987 6543',
    },
    status: 'quoted',
  },
];

const SEED_TICKETS = [
  {
    ticketId: 'SBM-SRV-2026-001',
    hospitalName: 'National Hospital Abuja',
    equipmentModel: 'Baxter Artis Physio HD (Station 3)',
    serialNumber: 'BAX-AP-2022-8841',
    issueType: 'breakdown',
    urgencyLevel: 'critical_patient_impact',
    description:
      'Ultrafiltration sensor error code UF-402 during patient treatment cycle. System safely in bypass. Resident engineer requested on site.',
    contactName: 'Engr. Chukwudi Okafor',
    email: 'c.okafor@nationalhospital.gov.ng',
    phone: '+234 803 555 1212',
    locationState: 'Abuja',
    status: 'in_progress',
  },
  {
    ticketId: 'SBM-SRV-2026-002',
    hospitalName: 'Lagos Island Maternity Hospital',
    equipmentModel: 'GE LOGIQ Healthcare Ultrasound',
    serialNumber: 'GE-LQ-2021-3329',
    issueType: 'preventive_maintenance',
    urgencyLevel: 'routine',
    description:
      'Scheduled Q1 quarterly preventive maintenance, transducer array acoustic test, and trackball servicing.',
    contactName: 'Mrs. Folashade Adele',
    email: 'f.adele@lagosstate.gov.ng',
    phone: '+234 802 333 4444',
    locationState: 'Lagos',
    status: 'resolved',
  },
];

export const runSeed = async () => {
  console.log('[Seed] Initializing database seeding...');
  await connectDB();

  // Populate persistent file store or MongoDB collections
  const data = storage;

  console.log('[Seed] Seeding Users / Administrators...');
  for (const u of SEED_USERS) {
    const existing = await User.findOne({ email: u.email }).exec().catch(() => null);
    if (!existing) {
      await User.create(u);
      console.log(`  + Created user: ${u.email} (${u.role})`);
    }
  }

  console.log('[Seed] Seeding Projects...');
  for (const p of SEED_PROJECTS) {
    const existing = await Project.findOne({ slug: p.slug }).exec().catch(() => null);
    if (!existing) {
      await Project.create(p);
      console.log(`  + Created project: ${p.title}`);
    }
  }

  console.log('[Seed] Seeding Products...');
  for (const pr of SEED_PRODUCTS) {
    const existing = await Product.findOne({ slug: pr.slug }).exec().catch(() => null);
    if (!existing) {
      await Product.create(pr);
      console.log(`  + Created product: ${pr.name}`);
    }
  }

  console.log('[Seed] Seeding Articles & Newsletters...');
  for (const a of SEED_ARTICLES) {
    const existing = await Article.findOne({ slug: a.slug }).exec().catch(() => null);
    if (!existing) {
      await Article.create(a);
      console.log(`  + Created article: ${a.title}`);
    }
  }

  console.log('[Seed] Seeding Newsletter Subscribers...');
  for (const s of SEED_SUBSCRIBERS) {
    const existing = await NewsletterSubscriber.findOne({ email: s.email }).exec().catch(() => null);
    if (!existing) {
      await NewsletterSubscriber.create(s);
      console.log(`  + Created subscriber: ${s.email}`);
    }
  }

  console.log('[Seed] Seeding Newsletter Campaigns...');
  for (const c of SEED_CAMPAIGNS) {
    const existing = await NewsletterCampaign.findOne({ slug: c.slug }).exec().catch(() => null);
    if (!existing) {
      await NewsletterCampaign.create(c);
      console.log(`  + Created campaign: ${c.title}`);
    }
  }

  console.log('[Seed] Seeding RFQs...');
  for (const r of SEED_RFQS) {
    const existing = await RFQ.findOne({ referenceId: r.referenceId }).exec().catch(() => null);
    if (!existing) {
      await RFQ.create(r);
      console.log(`  + Created RFQ: ${r.referenceId}`);
    }
  }

  console.log('[Seed] Seeding Support Tickets...');
  for (const t of SEED_TICKETS) {
    const existing = await AfterSalesTicket.findOne({ ticketId: t.ticketId }).exec().catch(() => null);
    if (!existing) {
      await AfterSalesTicket.create(t);
      console.log(`  + Created Ticket: ${t.ticketId}`);
    }
  }

  storage.save();
  console.log('[Seed] Database seeding completed successfully.');
  await disconnectDB();
};

if (process.argv[1]?.includes('seed')) {
  runSeed()
    .then(() => {
      console.log('[Seed] Process finished.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('[Seed] Failed:', err);
      process.exit(1);
    });
}
