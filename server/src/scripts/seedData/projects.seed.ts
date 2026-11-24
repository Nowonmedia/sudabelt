export interface SeedProjectInput {
  title: string;
  slug: string;
  category: string;
  facilityName: string;
  locationState: string;
  city: string;
  completionYear: number;
  isFeatured: boolean;
  heroImage: string;
  galleryImages: string[];
  shortDescription: string;
  fullDescription: string;
  clientOrCommissionedBy: string;
  scopeOfWork: string[];
  equipmentSupplied: string[];
  impactMetrics: { label: string; value: string }[];
  published: boolean;
  isDeleted: boolean;
}

export const SEED_PROJECTS: SeedProjectInput[] = [
  {
    title: 'Gbagada General Hospital Oxygen Plant',
    slug: 'gbagada-general-hospital-oxygen-plant',
    category: 'Oxygen & medical gas',
    facilityName: 'Gbagada General Hospital',
    locationState: 'Lagos',
    city: 'Gbagada, Lagos',
    completionYear: 2020,
    isFeatured: true,
    heroImage: '/images/projects/project-gbagada.webp',
    galleryImages: [
      '/images/projects/project-gbagada.webp',
      '/images/services/services-gbagada.webp',
      'https://app.milanote.com/media/p/images/1X1pbq1Atzd92P/gcD/Photo%20Journalism%202-Governor%20Jide%20Sanwolu%20commissions%20an%20Oxygen%20Plant%20at%20the%20Gbagada%20General%20Hospital%2C%20Lagos%20Nigeria.jpg?w=800',
    ],
    shortDescription:
      'A major role in the COVID-19 pandemic response, commissioned by Lagos State Governor Babajide Sanwo-Olu with an official letter of commendation.',
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
    galleryImages: [
      '/images/projects/project-adeboye.webp',
      'https://app.milanote.com/media/p/images/1X1pcg1Atzd92R/4FZ/image.png?w=800',
    ],
    shortDescription:
      'Supply and installation of 8 dialysis machines and a medical water reverse osmosis purification system.',
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
      'Baxter Artis Physio & AK 98 Hemodialysis Machines (8 Units)',
      'Clinical Double-Pass Reverse Osmosis (RO) Water Purification System',
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
    isFeatured: true,
    heroImage: '/images/projects/project-okene.webp',
    galleryImages: [
      '/images/projects/project-okene.webp',
      'https://app.milanote.com/media/p/images/1X1pDB1Atzd92T/gVz/image.png?w=800',
      'https://res.cloudinary.com/ajgpbpap/image/upload/f_auto,q_auto/v1795005942/sudabelt/projects/reference-hospital-okene_2.png',
    ],
    shortDescription:
      'Procurement and installation of multi-modality medical equipment and hospital furniture for the landmark tertiary hospital commissioned by President Muhammadu Buhari.',
    fullDescription:
      'End-to-end multi-modality medical equipment supply, installation, and clinical commissioning across Radiology, Intensive Care, Operating Theatres, Renal Unit, and Maternal/Neonatal wards at Reference Hospital Okene, Kogi State.',
    clientOrCommissionedBy: 'Kogi State Government',
    scopeOfWork: [
      'Multi-departmental turnkey medical equipment procurement and installation.',
      'Radiology, ICU, Theatre, and Renal Unit commissioning.',
      'Hospital furniture and specialized clinical fittings.',
      'On-site clinical and biomedical engineering staff certification.',
    ],
    equipmentSupplied: [
      'GE Healthcare Diagnostic Ultrasound & Radiology Systems',
      'ICU Patient Monitors, Ventilators & Anesthesia Carestations',
      'Hemodialysis Stations & RO Water Treatment Plant',
      'Modular Theatre Tables, Surgical Lights & Hospital Beds',
    ],
    impactMetrics: [
      { label: 'Hospital Capacity', value: '250+ Beds' },
      { label: 'Departments Equipped', value: '12 Clinical Units' },
      { label: 'Commissioned', value: 'December 2022' },
    ],
    published: true,
    isDeleted: false,
  },
  {
    title: 'Ring Road State Hospital, Ibadan',
    slug: 'ring-road-state-hospital-ibadan',
    category: 'Dialysis & renal',
    facilityName: 'Ring Road State Hospital',
    locationState: 'Oyo',
    city: 'Ibadan, Oyo State',
    completionYear: 2022,
    isFeatured: false,
    heroImage: '/images/projects/project-ibadan.webp',
    galleryImages: ['/images/projects/project-ibadan.webp'],
    shortDescription:
      'Supply and installation of hemodialysis machines and supporting renal unit infrastructure for Oyo State Government.',
    fullDescription:
      'Comprehensive upgrade and equipping of the renal dialysis unit at Ring Road State Hospital, Ibadan, delivering advanced hemodialysis machines, RO water pre-treatment, and hands-on renal nurse certification.',
    clientOrCommissionedBy: 'Oyo State Government',
    scopeOfWork: [
      'Supply and installation of hemodialysis machines for the renal unit.',
      'Renal water purification and drainage plumbing integration.',
      '40-hour on-site renal nurse and biomedical technician training.',
      'Preventive maintenance and local consumable supply coverage.',
    ],
    equipmentSupplied: [
      'Baxter AK 98 Hemodialysis Machines',
      'Medical Water Reverse Osmosis (RO) Filtration Unit',
      'High-Flux Dialyzers, Bloodlines & BiCart Cartridges',
    ],
    impactMetrics: [
      { label: 'State Coverage', value: 'Oyo State Referral Hub' },
      { label: 'Completion', value: '2022' },
      { label: 'SLA Response', value: '<24 Hours' },
    ],
    published: true,
    isDeleted: false,
  },
  {
    title: 'Kano Medical Centre Turnkey Equipping',
    slug: 'kano-medical-centre',
    category: 'Hospital equipping',
    facilityName: 'Kano Medical Centre',
    locationState: 'Kano',
    city: 'Kano',
    completionYear: 2021,
    isFeatured: false,
    heroImage: '/images/projects/project-kano.webp',
    galleryImages: ['/images/projects/project-kano.webp'],
    shortDescription:
      'Equipping intensive care units, diagnostic laboratories, and emergency response infrastructure in Northern Nigeria.',
    fullDescription:
      'Turnkey supply and installation of critical care, diagnostic imaging, and laboratory equipment for Kano Medical Centre, supported directly by Sudabelt Northern Regional Engineering Hub in Sharada, Kano.',
    clientOrCommissionedBy: 'Kano Healthcare Authorities',
    scopeOfWork: [
      'ICU patient monitoring, high-flow respiratory support, and resuscitation units.',
      'Diagnostic laboratory hematology and immunoassay analyzers.',
      'Local biomedical maintenance from Kano Sharada regional office.',
    ],
    equipmentSupplied: [
      'GE CARESCAPE Patient Monitors & Ultrasound Systems',
      'Fisher & Paykel Airvo 2 High-Flow & MR850 Humidifiers',
      'Maccura Hematology & Immunoassay Analyzers',
    ],
    impactMetrics: [
      { label: 'Regional Hub', value: 'Kano Sharada' },
      { label: 'Completion', value: '2021' },
      { label: 'Uptime SLA', value: '99.4%' },
    ],
    published: true,
    isDeleted: false,
  },
  {
    title: 'NNPC Multi-Specialist Hospital, Abuja',
    slug: 'nnpc-multi-specialist-hospital-abuja',
    category: 'Hospital equipping',
    facilityName: 'NNPC Medical Services Ltd',
    locationState: 'Abuja',
    city: 'Abuja, FCT',
    completionYear: 2020,
    isFeatured: false,
    heroImage: '/images/projects/project-nnpc.webp',
    galleryImages: ['/images/projects/project-nnpc.webp'],
    shortDescription:
      'Supply and installation of multi-modality medical equipment inclusive of specialized hospital furniture and fittings.',
    fullDescription:
      'Turnkey procurement, delivery, installation, and commissioning of multi-modality diagnostic, surgical, critical care, and specialized hospital furniture for NNPC Medical Services Ltd in Abuja, FCT.',
    clientOrCommissionedBy: 'NNPC Medical Services Ltd, Abuja',
    scopeOfWork: [
      'Multi-modality medical equipment supply and integration.',
      'Specialized clinical furniture, ICU beds, and examination fittings.',
      'User training and preventive maintenance SLA.',
    ],
    equipmentSupplied: [
      'Diagnostic Ultrasound & Patient Monitoring Systems',
      'ICU & Ward Motorized Hospital Beds & Theatre Fittings',
      'Point-of-Care Abbott i-STAT & Afinion Analyzers',
    ],
    impactMetrics: [
      { label: 'Location', value: 'Abuja, FCT' },
      { label: 'Completion', value: 'April 2020' },
      { label: 'Scope', value: 'Multi-Modality + Furniture' },
    ],
    published: true,
    isDeleted: false,
  },
  {
    title: 'World Bank / NCDC Nationwide Hemodialysis Rollout (10 Locations)',
    slug: 'world-bank-ncdc-hemodialysis-10-locations',
    category: 'Dialysis & renal',
    facilityName: '10 Federal & State Tertiary Hospitals Nationwide',
    locationState: 'Abuja',
    city: 'Makurdi, Kaduna, Gombe, Nasarawa, Ondo, Ebonyi, Lagos, Kebbi, Edo & Plateau',
    completionYear: 2024,
    isFeatured: true,
    heroImage:
      'https://res.cloudinary.com/ajgpbpap/image/upload/f_auto,q_auto/v1795005944/sudabelt/projects/world-bank-ncdc-hemodialysis-10-locations_1.jpg',
    galleryImages: [
      'https://res.cloudinary.com/ajgpbpap/image/upload/f_auto,q_auto/v1795005944/sudabelt/projects/world-bank-ncdc-hemodialysis-10-locations_1.jpg',
      'https://res.cloudinary.com/ajgpbpap/image/upload/f_auto,q_auto/v1795005945/sudabelt/projects/world-bank-ncdc-hemodialysis-10-locations_2.jpg',
      'https://res.cloudinary.com/ajgpbpap/image/upload/f_auto,q_auto/v1795005946/sudabelt/projects/world-bank-ncdc-hemodialysis-10-locations_3.jpg',
      'https://res.cloudinary.com/ajgpbpap/image/upload/f_auto,q_auto/v1795005947/sudabelt/projects/world-bank-ncdc-hemodialysis-10-locations_4.jpg',
      'https://res.cloudinary.com/ajgpbpap/image/upload/f_auto,q_auto/v1795005949/sudabelt/projects/world-bank-ncdc-hemodialysis-10-locations_5.jpg',
    ],
    shortDescription:
      'Procurement, installation, and clinical training for HD Dialysis and CRRT machines across 10 tertiary hospitals in Nigeria under World Bank / NCDC / FMOH (COPREP-GDS-RFB-02-2024).',
    fullDescription:
      'Executed under Contract COPREP-GDS-RFB-02-2024 for the World Bank, Nigeria Centre for Disease Control (NCDC), and Federal Ministry of Health (June 2024). Sudabelt Medical delivered, installed, and commissioned Baxter AK 98 Hemodialysis and Prismaflex CRRT systems alongside RO water systems and on-site clinical nurse/engineer certification across 10 geopolitical centers: Makurdi (Benue), Kaduna, Gombe, Nasarawa, Ondo, Abakaliki (Ebonyi), Lagos, Birnin Kebbi, Irrua (Edo), and Jos (Plateau).',
    clientOrCommissionedBy: 'World Bank / NCDC / Federal Ministry of Health Nigeria',
    scopeOfWork: [
      'Nationwide delivery and site readiness across 10 tertiary teaching hospitals.',
      'Installation and commissioning of Baxter AK 98 HD & Prismaflex CRRT systems.',
      'On-site hands-on clinical certification for renal nurses and biomedical engineers at all 10 sites.',
      'Multi-year warranty and regional spare parts buffer stocking.',
    ],
    equipmentSupplied: [
      'Baxter AK 98 Hemodialysis Systems',
      'Baxter Prismaflex / PrisMax ICU CRRT Systems',
      'Medical Water Reverse Osmosis (RO) Purification Units',
      'Dialyzers, Bloodlines, BiCart & CleanCart Consumable Starter Packs',
    ],
    impactMetrics: [
      { label: 'Tertiary Centers', value: '10 States' },
      { label: 'Contract Ref', value: 'COPREP-GDS-RFB-02-2024' },
      { label: 'Commissioned', value: 'June 2024' },
    ],
    published: true,
    isDeleted: false,
  },
  {
    title: 'Stella Obasanjo Hospital Multi-Modality Equipping, Edo State',
    slug: 'stella-obasanjo-hospital-edo-state',
    category: 'Hospital equipping',
    facilityName: 'Stella Obasanjo Hospital',
    locationState: 'Edo',
    city: 'Benin City, Edo State',
    completionYear: 2023,
    isFeatured: true,
    heroImage:
      'https://res.cloudinary.com/ajgpbpap/image/upload/f_auto,q_auto/v1795005950/sudabelt/projects/stella-obasanjo-hospital-edo-state_1.jpg',
    galleryImages: [
      'https://res.cloudinary.com/ajgpbpap/image/upload/f_auto,q_auto/v1795005950/sudabelt/projects/stella-obasanjo-hospital-edo-state_1.jpg',
      'https://res.cloudinary.com/ajgpbpap/image/upload/f_auto,q_auto/v1795005950/sudabelt/projects/stella-obasanjo-hospital-edo-state_2.jpg',
      'https://res.cloudinary.com/ajgpbpap/image/upload/f_auto,q_auto/v1795005951/sudabelt/projects/stella-obasanjo-hospital-edo-state_3.jpg',
    ],
    shortDescription:
      'Purchase, supply, installation, testing, and commissioning of multi-modality medical equipment and hospital furniture for Stella Obasanjo Hospital, Benin City.',
    fullDescription:
      'Commissioned by the Edo State Government in May 2023, Sudabelt Medical executed the complete multi-modality equipping of Stella Obasanjo Hospital in Benin City, covering the Renal Dialysis Suite, Modern Dental Clinic, Emergency & Trauma Resuscitation Unit, Intensive Care Unit, and specialized hospital furniture.',
    clientOrCommissionedBy: 'Edo State Government',
    scopeOfWork: [
      'Turnkey equipping of the Renal Dialysis Unit and RO water plant.',
      'Complete Dental Surgery Suite installation and commissioning.',
      'Emergency & Trauma Unit patient monitors, defibrillators, and crash carts.',
      'Multi-modality hospital furniture, motorized ICU beds, and staff training.',
    ],
    equipmentSupplied: [
      'Hemodialysis Machines & Dialysis Treatment Chairs',
      'Integrated Dental Delivery Units & Autoclaves',
      'Multi-Parameter Emergency Monitors & Resuscitation Systems',
      'Specialized Hospital Beds, Stretchers & Ward Furniture',
    ],
    impactMetrics: [
      { label: 'State', value: 'Edo State' },
      { label: 'Completion', value: 'May 2023' },
      { label: 'Units Equipped', value: 'Dialysis, Dental & ER' },
    ],
    published: true,
    isDeleted: false,
  },
  {
    title: 'Federal Teaching Hospital Gombe 128-Slice CT Installation',
    slug: 'fth-gombe-128-slice-ct-installation',
    category: 'Imaging & diagnostics',
    facilityName: 'Federal Teaching Hospital Gombe',
    locationState: 'Gombe',
    city: 'Gombe, Gombe State',
    completionYear: 2024,
    isFeatured: true,
    heroImage:
      'https://res.cloudinary.com/ajgpbpap/image/upload/f_auto,q_auto/v1795005953/sudabelt/projects/fth-gombe-128-slice-ct-installation_1.jpg',
    galleryImages: [
      'https://res.cloudinary.com/ajgpbpap/image/upload/f_auto,q_auto/v1795005953/sudabelt/projects/fth-gombe-128-slice-ct-installation_1.jpg',
      'https://res.cloudinary.com/ajgpbpap/image/upload/f_auto,q_auto/v1795005954/sudabelt/projects/fth-gombe-128-slice-ct-installation_2.jpg',
      'https://res.cloudinary.com/ajgpbpap/image/upload/f_auto,q_auto/v1795005954/sudabelt/projects/fth-gombe-128-slice-ct-installation_3.jpg',
      'https://res.cloudinary.com/ajgpbpap/image/upload/f_auto,q_auto/v1795005955/sudabelt/projects/fth-gombe-128-slice-ct-installation_4.jpg',
    ],
    shortDescription:
      'Procurement, installation, clinical radiographer training, and after-sales service of a complete GE Healthcare 128-Slice Computed Tomography (CT) scanner.',
    fullDescription:
      'Delivered in January 2024 at Federal Teaching Hospital (FTH) Gombe, this turnkey radiology project encompassed radiation-shielded suite preparation, power conditioning UPS integration, installation of a GE Healthcare 128-Slice Computed Tomography system, dual-head contrast power injector setup, and comprehensive clinical applications training for radiologists and CT radiographers.',
    clientOrCommissionedBy: 'Federal Teaching Hospital, Gombe',
    scopeOfWork: [
      'Lead-lined radiology room preparation and 3-phase industrial UPS integration.',
      'Mechanical and optical installation of GE 128-Slice CT gantry and table.',
      'PACS workstation integration and clinical applications specialist training.',
      'Multi-year preventive maintenance and tube/detector warranty support.',
    ],
    equipmentSupplied: [
      'GE Healthcare 128-Slice Computed Tomography (CT) System',
      'AW Advanced Diagnostic Workstation',
      'Dual-Head CT Contrast Media Power Injector',
      '100 kVA Online Double-Conversion Medical UPS',
    ],
    impactMetrics: [
      { label: 'CT Resolution', value: '128-Slice GE CT' },
      { label: 'Commissioned', value: 'January 2024' },
      { label: 'Dose Reduction', value: 'Up to 82% ASiR-V' },
    ],
    published: true,
    isDeleted: false,
  },
  {
    title: 'Jos University Teaching Hospital 10-Bed ICU Equipping',
    slug: 'jos-university-teaching-hospital-icu',
    category: 'Hospital equipping',
    facilityName: 'Jos University Teaching Hospital (JUTH)',
    locationState: 'Plateau',
    city: 'Jos, Plateau State',
    completionYear: 2021,
    isFeatured: false,
    heroImage: '/images/projects/projects-hero.webp',
    galleryImages: ['/images/projects/projects-hero.webp'],
    shortDescription:
      'Turnkey equipping of a 10-bedded Intensive Care Unit under the Federal COVID-19 Intervention Project.',
    fullDescription:
      'Complete critical care equipping of a 10-bed Intensive Care Unit at Jos University Teaching Hospital (JUTH) in March 2021, providing invasive and non-invasive respiratory support, multi-parameter central monitoring, motorized ICU beds, and infusion workstations.',
    clientOrCommissionedBy: 'Jos University Teaching Hospital / Federal Ministry of Health',
    scopeOfWork: [
      '10-bed ICU life-support and hemodynamic monitoring setup.',
      'High-flow oxygen and heated humidification integration.',
      'Critical care nursing and biomedical engineering certification.',
    ],
    equipmentSupplied: [
      '10x ICU Ventilators & Fisher & Paykel MR850 / Airvo 2 Systems',
      '10x Multi-Parameter Bedside Monitors + Central Station',
      '10x 5-Function Electric ICU Beds & Syringe/Infusion Pumps',
    ],
    impactMetrics: [
      { label: 'ICU Capacity', value: '10 High-Acuity Beds' },
      { label: 'Completion', value: 'March 2021' },
      { label: 'State', value: 'Plateau State' },
    ],
    published: true,
    isDeleted: false,
  },
];
