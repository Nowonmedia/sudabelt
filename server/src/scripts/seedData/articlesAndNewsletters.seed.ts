export interface SeedArticleInput {
  title: string;
  slug: string;
  type: 'blog' | 'newsletter';
  issueNumber?: number;
  quarter?: 'Q1' | 'Q2' | 'Q3' | 'Q4';
  year: number;
  category: string;
  summary: string;
  content: string;
  takeaways: string[];
  coverImage: string;
  pdfUrl?: string;
  readTimeMinutes: number;
  featuredProductSlugs: string[];
  publishedDate: Date;
  published: boolean;
}

export interface SeedNewsletterCampaignInput {
  title: string;
  slug: string;
  subject: string;
  issueNumber: number;
  quarter: 'Q1' | 'Q2' | 'Q3' | 'Q4';
  year: number;
  summary: string;
  content: string;
  coverImage: string;
  pdfUrl: string;
  status: 'sent' | 'draft';
  sentAt?: Date;
  recipientCount: number;
  published: boolean;
}

// ============================================================================
// 4 APPROVED MILANOTE NEWSLETTERS: "THE INNER CIRCLE" (EDITIONS 10, 11, 12, 13)
// ============================================================================
export const SEED_NEWSLETTER_CAMPAIGNS: SeedNewsletterCampaignInput[] = [
  {
    title: 'The Inner Circle - 10th Edition (Mar/Apr 2026)',
    slug: 'the-inner-circle-10th-edition-mar-apr-2026',
    subject: 'The Inner Circle (10th Edition): Advancing Healthcare Excellence Across Nigeria',
    issueNumber: 10,
    quarter: 'Q1',
    year: 2026,
    summary:
      'Official March/April 2026 edition of Sudabelt Medical "The Inner Circle" newsletter covering landmark hospital installations, clinical training milestones, and OEM partnership updates.',
    content: `## The Inner Circle - 10th Edition (March / April 2026)

Welcome to the 10th Edition of **The Inner Circle**, Sudabelt Medical's official publication dedicated to healthcare leaders, hospital administrators, clinicians, and biomedical engineers across Africa.

### Highlights in This Issue
1. **Expanding Renal & Critical Care Access**: How turnkey dialysis center engineering, ISO 23500 reverse osmosis water purification, and Baxter AK 98 / Artis Physio deployments are improving patient survival across Nigerian tertiary hospitals.
2. **Clinical Capacity Building**: Field reports from our OEM-certified application specialists conducting hands-on ward training for renal nurses and biomedical engineers.
3. **Diagnostic Imaging & Life Care**: Spotlight on GE Healthcare ultrasound and multi-parameter monitoring deployments supporting maternal-fetal and intensive care units.

Download the complete 10th Edition PDF below to read the full feature stories and institutional spotlights.`,
    coverImage: 'https://res.cloudinary.com/ajgpbpap/image/upload/f_auto,q_auto/v1795005956/sudabelt/newsletters/covers/the-inner-circle-10th-edition-mar-apr-2026_cover.png',
    pdfUrl:
      'https://media.milanote.com/p/files/1X4EGb1I7HkT9G/lNa/Inner%20Circle%20Newsletter%20-%20Mar_Apr%202026%20%2810th%20Edition%29_compressed.pdf',
    status: 'sent',
    sentAt: new Date('2026-04-15T09:00:00Z'),
    recipientCount: 420,
    published: true,
  },
  {
    title: 'The Inner Circle - 11th Edition (May/June 2026)',
    slug: 'the-inner-circle-11th-edition-may-june-2026',
    subject: 'The Inner Circle (11th Edition): Blood Safety, Apheresis & Turnkey Infrastructure',
    issueNumber: 11,
    quarter: 'Q2',
    year: 2026,
    summary:
      'May/June 2026 (11th Edition) of "The Inner Circle" featuring breakthroughs in automated blood component processing, sickle cell red cell exchange, and biomedical engineering SLAs.',
    content: `## The Inner Circle - 11th Edition (May / June 2026)

In the 11th Edition of **The Inner Circle**, we examine the intersection of blood transfusion safety, therapeutic apheresis, and preventive biomedical maintenance across West Africa.

### Highlights in This Issue
1. **Transforming Blood Banking with Terumo BCT**: Implementing automated whole blood processing (Reveos), apheresis platelet collection (Trima Accel), and Mirasol Pathogen Reduction Technology.
2. **Sickle Cell Disease Management**: Clinical adoption of automated Red Blood Cell Exchange (RBCX) on the Spectra Optia platform to prevent stroke and acute chest syndrome.
3. **Preventive Maintenance & Uptime**: Why scheduled calibration and local spare parts warehousing in Lagos, Abuja, and Kano are essential to protecting hospital capital investments.

Download the full 11th Edition PDF below.`,
    coverImage: 'https://res.cloudinary.com/ajgpbpap/image/upload/f_auto,q_auto/v1795005957/sudabelt/newsletters/covers/the-inner-circle-11th-edition-may-june-2026_cover.png',
    pdfUrl:
      'https://media.milanote.com/p/files/1X1NaO1YN2ak7d/5h6/THE%20INNER%20CIRCLE%20-%20MAY_JUNE%20%2811th%20Edition%29_compressed.pdf',
    status: 'sent',
    sentAt: new Date('2026-06-20T09:00:00Z'),
    recipientCount: 485,
    published: true,
  },
  {
    title: 'The Inner Circle - 12th Edition (Q3 2026)',
    slug: 'the-inner-circle-12th-edition-q3-2026',
    subject: 'The Inner Circle (12th Edition): Radiology Turnkey Projects & Respiratory Care',
    issueNumber: 12,
    quarter: 'Q3',
    year: 2026,
    summary:
      '12th Edition of Sudabelt Medical "The Inner Circle" spotlighting 128-slice CT and 1.5T MRI radiology installations, neonatal respiratory care, and minimally invasive surgical innovations.',
    content: `## The Inner Circle - 12th Edition (Q3 2026)

The 12th Edition of **The Inner Circle** showcases Sudabelt Medical's growing footprint in high-end diagnostic imaging infrastructure, neonatal respiratory care, and minimally invasive surgery.

### Highlights in This Issue
1. **High-End Radiology Infrastructure**: Engineering insights from 64/128-slice Computed Tomography and 1.5T MRI turnkey suites across federal teaching hospitals.
2. **Respiratory & Neonatal Care**: Protecting preterm infants and ICU patients with Fisher & Paykel Neopuff T-piece resuscitation, Airvo 2 nasal high-flow therapy, and Optiflow THRIVE.
3. **Minimally Invasive Surgery (MIS)**: Advancing laparoscopic precision with Ezisurg Cam Drive 4K visualization, easyEndo staplers, and easyUS ultrasonic dissection.

Download the full 12th Edition PDF below.`,
    coverImage: 'https://res.cloudinary.com/ajgpbpap/image/upload/f_auto,q_auto/v1795005958/sudabelt/newsletters/covers/the-inner-circle-12th-edition-q3-2026_cover.png',
    pdfUrl:
      'https://media.milanote.com/p/files/1XewFg1AdgBp6k/Bro/THE%20INNER%20CIRCLE%20%2812th%20Ed.%29_compressed.pdf',
    status: 'sent',
    sentAt: new Date('2026-09-15T09:00:00Z'),
    recipientCount: 530,
    published: true,
  },
  {
    title: 'The Inner Circle - 13th Edition (Q4 2026)',
    slug: 'the-inner-circle-13th-edition-q4-2026',
    subject: 'The Inner Circle (13th Edition): Annual Review, ISO 9001:2015 Excellence & 2027 Outlook',
    issueNumber: 13,
    quarter: 'Q4',
    year: 2026,
    summary:
      '13th Edition of "The Inner Circle" celebrating Sudabelt Medical nationwide healthcare impact, ISO 9001:2015 Quality Management milestones, and point-of-care diagnostic expansion.',
    content: `## The Inner Circle - 13th Edition (Q4 2026)

In our landmark 13th Edition of **The Inner Circle**, we reflect on a year of nationwide healthcare infrastructure delivery across all 36 states and the FCT Abuja.

### Highlights in This Issue
1. **Nationwide Hemodialysis & ICU Impact**: Reviewing our 10-state World Bank / NCDC / FMOH hemodialysis deployment and ongoing teaching hospital partnerships.
2. **Point-of-Care & Core Lab Diagnostics**: Accelerating clinical turnaround times with Abbott i-STAT 1, Afinion 2, and Maccura automated CLIA and hematology platforms.
3. **Quality Without Compromise (C.A.R.E.)**: Maintaining ISO 9001:2015 Quality Management System standards across equipment supply, turnkey projects, and biomedical engineering.

Download the complete 13th Edition PDF (A4) below.`,
    coverImage: 'https://res.cloudinary.com/ajgpbpap/image/upload/f_auto,q_auto/v1795005959/sudabelt/newsletters/covers/the-inner-circle-13th-edition-q4-2026_cover.png',
    pdfUrl:
      'https://media.milanote.com/p/files/1XmKO01get6Z8c/zZO/IC_13th%20ed%20%28A4%29_compressed.pdf',
    status: 'sent',
    sentAt: new Date('2026-11-01T09:00:00Z'),
    recipientCount: 610,
    published: true,
  },
];

// ============================================================================
// ARTICLES COLLECTION (BOTH NEWSLETTERS & CLINICAL BLOG POSTS)
// ============================================================================
export const SEED_ARTICLES: SeedArticleInput[] = [
  // Mirror the 4 official Inner Circle editions as 'newsletter' articles
  {
    title: 'The Inner Circle - 13th Edition (Q4 2026)',
    slug: 'the-inner-circle-13th-edition-q4-2026',
    type: 'newsletter',
    issueNumber: 13,
    quarter: 'Q4',
    year: 2026,
    category: 'Corporate & Clinical Dispatch',
    summary:
      '13th Edition of "The Inner Circle" celebrating Sudabelt Medical nationwide healthcare impact, ISO 9001:2015 Quality Management milestones, and point-of-care diagnostic expansion.',
    content: SEED_NEWSLETTER_CAMPAIGNS[3].content,
    takeaways: [
      '10-State World Bank / NCDC Hemodialysis rollout review',
      'Abbott i-STAT 1 & Maccura automated laboratory expansion',
      'ISO 9001:2015 Quality Management System attestation',
    ],
    coverImage: 'https://res.cloudinary.com/ajgpbpap/image/upload/f_auto,q_auto/v1795005959/sudabelt/newsletters/covers/the-inner-circle-13th-edition-q4-2026_cover.png',
    pdfUrl:
      'https://media.milanote.com/p/files/1XmKO01get6Z8c/zZO/IC_13th%20ed%20%28A4%29_compressed.pdf',
    readTimeMinutes: 8,
    featuredProductSlugs: ['abbott-i-stat-1', 'maccura-is-1200', 'baxter-phoenix-ak-98'],
    publishedDate: new Date('2026-11-01T09:00:00Z'),
    published: true,
  },
  {
    title: 'The Inner Circle - 12th Edition (Q3 2026)',
    slug: 'the-inner-circle-12th-edition-q3-2026',
    type: 'newsletter',
    issueNumber: 12,
    quarter: 'Q3',
    year: 2026,
    category: 'Radiology & Respiratory Care',
    summary:
      '12th Edition of Sudabelt Medical "The Inner Circle" spotlighting 128-slice CT and 1.5T MRI radiology installations, neonatal respiratory care, and minimally invasive surgical innovations.',
    content: SEED_NEWSLETTER_CAMPAIGNS[2].content,
    takeaways: [
      'Turnkey 128-Slice CT & 1.5T MRI site engineering',
      'Fisher & Paykel Neopuff & Airvo 2 respiratory protocols',
      'Ezisurg 4K laparoscopy and ultrasonic energy surgery',
    ],
    coverImage: 'https://res.cloudinary.com/ajgpbpap/image/upload/f_auto,q_auto/v1795005958/sudabelt/newsletters/covers/the-inner-circle-12th-edition-q3-2026_cover.png',
    pdfUrl:
      'https://media.milanote.com/p/files/1XewFg1AdgBp6k/Bro/THE%20INNER%20CIRCLE%20%2812th%20Ed.%29_compressed.pdf',
    readTimeMinutes: 7,
    featuredProductSlugs: [
      'ge-revolution-ascend-ct',
      'fisher-paykel-airvo-2-high-flow',
      'ezisurg-cam-drive-laparoscopic-system',
    ],
    publishedDate: new Date('2026-09-15T09:00:00Z'),
    published: true,
  },
  {
    title: 'The Inner Circle - 11th Edition (May/June 2026)',
    slug: 'the-inner-circle-11th-edition-may-june-2026',
    type: 'newsletter',
    issueNumber: 11,
    quarter: 'Q2',
    year: 2026,
    category: 'Blood Safety & Hematology',
    summary:
      'May/June 2026 (11th Edition) of "The Inner Circle" featuring breakthroughs in automated blood component processing, sickle cell red cell exchange, and biomedical engineering SLAs.',
    content: SEED_NEWSLETTER_CAMPAIGNS[1].content,
    takeaways: [
      'Terumo BCT Reveos & Mirasol pathogen reduction workflows',
      'Automated Sickle Cell Red Blood Cell Exchange on Spectra Optia',
      'Preventive maintenance SLAs across Lagos, Abuja & Kano hubs',
    ],
    coverImage: 'https://res.cloudinary.com/ajgpbpap/image/upload/f_auto,q_auto/v1795005957/sudabelt/newsletters/covers/the-inner-circle-11th-edition-may-june-2026_cover.png',
    pdfUrl:
      'https://media.milanote.com/p/files/1X1NaO1YN2ak7d/5h6/THE%20INNER%20CIRCLE%20-%20MAY_JUNE%20%2811th%20Edition%29_compressed.pdf',
    readTimeMinutes: 7,
    featuredProductSlugs: [
      'terumo-bct-spectra-optia',
      'terumo-bct-mirasol-prt',
      'terumo-bct-reveos',
    ],
    publishedDate: new Date('2026-06-20T09:00:00Z'),
    published: true,
  },
  {
    title: 'The Inner Circle - 10th Edition (Mar/Apr 2026)',
    slug: 'the-inner-circle-10th-edition-mar-apr-2026',
    type: 'newsletter',
    issueNumber: 10,
    quarter: 'Q1',
    year: 2026,
    category: 'Renal Care & Clinical Training',
    summary:
      'Official March/April 2026 edition of Sudabelt Medical "The Inner Circle" newsletter covering landmark hospital installations, clinical training milestones, and OEM partnership updates.',
    content: SEED_NEWSLETTER_CAMPAIGNS[0].content,
    takeaways: [
      'Turnkey hemodialysis & ISO 23500 RO water purification',
      '40-60 hours on-site clinical nurse and biomedical training',
      'GE Healthcare women health and diagnostic ultrasound advances',
    ],
    coverImage: 'https://res.cloudinary.com/ajgpbpap/image/upload/f_auto,q_auto/v1795005956/sudabelt/newsletters/covers/the-inner-circle-10th-edition-mar-apr-2026_cover.png',
    pdfUrl:
      'https://media.milanote.com/p/files/1X4EGb1I7HkT9G/lNa/Inner%20Circle%20Newsletter%20-%20Mar_Apr%202026%20%2810th%20Edition%29_compressed.pdf',
    readTimeMinutes: 6,
    featuredProductSlugs: [
      'baxter-artis-physio-hemodialysis-system',
      'ge-voluson-expert-22',
    ],
    publishedDate: new Date('2026-04-15T09:00:00Z'),
    published: true,
  },

  // Clinical & Biomedical Blog Articles (type: 'blog')
  {
    title: 'Mirasol PRT and the Next Chapter of Blood Transfusion Safety in Nigeria',
    slug: 'mirasol-prt-blood-safety-advances',
    type: 'blog',
    quarter: 'Q1',
    year: 2026,
    category: 'Blood Safety & Hematology',
    summary:
      'How Riboflavin and UV pathogen reduction technology protects transfusion recipients against window-period viruses, bacterial contamination, and malaria in Nigerian blood banks.',
    content: `## Addressing Residual Transfusion Risk in Sub-Saharan Africa

Even with rigorous serological and nucleic acid screening, blood banks face residual risks from window-period viral infections, bacterial proliferation in room-temperature platelets, malaria parasites (*Plasmodium falciparum*), and emerging pathogens.

### How Terumo BCT Mirasol PRT Works
The **Mirasol Pathogen Reduction Technology (PRT)** system uses a non-toxic, naturally occurring photosensitizer, **Riboflavin (Vitamin B2)**, combined with broad-spectrum ultraviolet (UV) light:
1. Riboflavin associates with the nucleic acids (DNA and RNA) of viruses, bacteria, parasites, and residual donor white blood cells.
2. Upon UV illumination (4 to 10 minutes), irreversible electron-transfer cleavage prevents pathogen replication.
3. Because red blood cells, platelets, and plasma proteins lack nuclei, their clinical function is preserved, while donor T-cells are inactivated, eliminating the need for gamma irradiation to prevent Transfusion-Associated Graft-versus-Host Disease (TA-GvHD).

### Turnkey Blood Bank Integration by Sudabelt Medical
Sudabelt Medical supplies, installs, and validates the complete Terumo BCT blood component ecosystem, pairing **Reveos** automated 4-unit whole blood processing and **Trima Accel** apheresis collection with **Mirasol PRT** and cold-chain consumable buffer stock across Lagos, Abuja, and Kano.`,
    takeaways: [
      'Inactivates malaria parasites, bacteria, and window-period viruses using Vitamin B2 + UV light',
      'Replaces gamma irradiation for TA-GvHD prevention in immunocompromised and neonatal patients',
      'Zero toxic chemical removal step required post-illumination',
    ],
    coverImage: 'https://app.milanote.com/media/p/images/1WOHiJ1OpcQW2P/BbN/Mirasol_1st%20pic.jpg?w=800',
    readTimeMinutes: 6,
    featuredProductSlugs: [
      'terumo-bct-mirasol-prt',
      'mirasol-illumination-kits',
      'terumo-bct-reveos',
    ],
    publishedDate: new Date('2026-03-10T10:00:00Z'),
    published: true,
  },
  {
    title: 'Biofeedback Hemodialysis and Ultrapure Water Standards in Modern Renal Units',
    slug: 'standardizing-dialysis-hygiene-cleancart-c',
    type: 'blog',
    quarter: 'Q1',
    year: 2026,
    category: 'Renal Care',
    summary:
      'How real-time ionic clearance monitoring (Diascan), dry bicarbonate/citric cartridges, and double-pass Reverse Osmosis water treatment prevent intradialytic complications.',
    content: `## Engineering Dialysis Centers for Clinical Outcomes and 99%+ Machine Uptime

Running a high-volume hospital renal unit requires more than placing hemodialysis machines at the bedside. Over 60% of premature machine breakdowns and patient pyrogenic reactions stem from two preventable factors: **sub-standard feed water quality** and **inconsistent hydraulic decalcification**.

### 1. Double-Pass Reverse Osmosis (ISO 23500 Compliance)
During a standard 4-hour hemodialysis session, a patient's blood is exposed to over 120 liters of dialysate across a semi-permeable membrane. Sudabelt Medical engineers pre-installation dual-pass Reverse Osmosis (RO) water plants with sediment depth filtration, carbon chloramine adsorption, water softeners, and sanitary loop circulation before commissioning any renal station.

### 2. Real-Time Clearance & Biofeedback on Baxter Artis Physio and AK 98
With **Diascan** conductivity sensors, renal nurses verify delivered dialysis dose ($Kt/V$) automatically every 15 minutes without drawing blood samples. Paired with **BiCart** dry sodium bicarbonate cartridges and **CleanCart C** anhydrous citric acid heat-disinfection cartridges, hydraulic scaling and biofilm growth are eliminated.

### 3. Standing Consumable Buffer Stock
Through regional hubs in Victoria Island (Lagos), Maitama (Abuja), and Sharada (Kano), plus satellite outlets inside partner teaching hospitals, Sudabelt ensures uninterrupted supply of high-flux dialyzers, AV fistula needles, bloodlines, and concentrates.`,
    takeaways: [
      'Pre-installation ISO 23500 RO water auditing prevents solenoid valve scaling and endotoxin reactions',
      'Diascan real-time Kt/V monitoring verifies dialysis adequacy during every session',
      'Dry BiCart and CleanCart cartridges eliminate liquid bacterial contamination hazards',
    ],
    coverImage: 'https://app.milanote.com/media/p/images/1WOGMq1OpcQW2r/YJm/AK%2098_1st%20pic.png?w=800',
    readTimeMinutes: 5,
    featuredProductSlugs: [
      'baxter-artis-physio-hemodialysis-system',
      'baxter-phoenix-ak-98',
      'dialysis-disinfectants',
      'high-flux-dialyzers',
    ],
    publishedDate: new Date('2026-02-18T10:00:00Z'),
    published: true,
  },
  {
    title: 'Hospital Medical Oxygen Infrastructure: Lessons from the Gbagada PSA Plant',
    slug: 'oxygen-infrastructure-lessons-from-gbagada',
    type: 'blog',
    quarter: 'Q4',
    year: 2025,
    category: 'Hospital Infrastructure',
    summary:
      'Site planning, Pressure Swing Adsorption (PSA) generation, manifold engineering, and bedside humidification behind uninterruptible hospital-grade oxygen delivery.',
    content: `## Building Resilient Medical Gas Ecosystems in Tertiary Hospitals

During the peak of the COVID-19 emergency response, Sudabelt Medical partnered with the Lagos State Government to deliver and commission the turnkey **Medical Oxygen Pressure Swing Adsorption (PSA) Generation Plant** at Gbagada General Hospital, earning a formal commendation from Governor Babajide Sanwo-Olu.

### Key Pillars of Turnkey Medical Oxygen Engineering
1. **On-Site PSA Generation & Booster Filling**: Producing 93% ± 3% medical-grade oxygen directly from ambient compressed air via zeolite molecular sieves, paired with a 150-bar oil-free booster compressor capable of filling 180 backup cylinders per day.
2. **Duplex Automatic Manifold & Copper Pipeline Network**: Ensuring seamless changeover between primary plant output and reserve cylinder banks without pressure drops in the ICU or operating theatres.
3. **Bedside High-Flow & Heated Humidification**: Protecting patient airways at the point of delivery using **Fisher & Paykel Airvo 2**, **Optiflow THRIVE**, and **MR850** heated humidification systems, which prevent mucosal desiccation and reduce intubation rates in hypoxemic respiratory failure.`,
    takeaways: [
      'On-site PSA oxygen generation eliminates reliance on erratic third-party cylinder logistics',
      'Duplex manifold changeover guarantees continuous pipeline pressure to ICUs and theatres',
      'Fisher & Paykel Airvo 2 and Optiflow THRIVE optimize bedside oxygen delivery without wall air',
    ],
    coverImage: '/images/projects/project-gbagada.webp',
    readTimeMinutes: 7,
    featuredProductSlugs: [
      'fisher-paykel-airvo-2-high-flow',
      'fisher-paykel-optiflow-thrive',
      'fisher-paykel-mr850-system',
    ],
    publishedDate: new Date('2025-11-25T10:00:00Z'),
    published: true,
  },
  {
    title: 'Automated Red Blood Cell Exchange (RBCX) in Sickle Cell Disease Management',
    slug: 'automated-rbcx-sickle-cell-spectra-optia',
    type: 'blog',
    quarter: 'Q1',
    year: 2026,
    category: 'Blood Safety & Hematology',
    summary:
      'Why Nigerian tertiary hematology centers are transitioning from manual top-up transfusions to automated erythrocytapheresis on the Terumo BCT Spectra Optia.',
    content: `## Elevating Sickle Cell Crisis Prevention and Stroke Prophylaxis

Nigeria bears the highest burden of Sickle Cell Disease (SCD) globally. While simple top-up blood transfusions temporarily improve oxygen-carrying capacity, repeated simple transfusions inevitably lead to **hyperviscosity** and **transfusional iron overload (hemosiderosis)**, requiring costly chelation therapy.

### The Clinical Advantage of Automated Erythrocytapheresis (RBCX)
Using the **Terumo BCT Spectra Optia Apheresis System**, clinicians perform Automated Red Blood Cell Exchange (RBCX) or Depletion/Exchange:
* **Rapid HbS Reduction**: Replaces sickled erythrocytes (HbS) with healthy donor HbA red cells in a single 90-to-120-minute procedure, rapidly dropping HbS below 30% during acute stroke, acute chest syndrome, or priapism.
* **Iron Neutrality**: Because diseased red cells are removed simultaneously as donor units are infused, patients maintain neutral or negative net iron balance.
* **Isovolemic Hemodynamic Stability**: The Automated Interface Management (AIM) optical sensor maintains precise fluid balance, making it safe for pediatric and adult sickle cell warriors.`,
    takeaways: [
      'Lowers HbS <30% in a single automated session for acute stroke and chest syndrome',
      'Prevents transfusional iron overload and hyperviscosity compared to simple top-up transfusion',
      'Supported by Sudabelt on-site apheresis nurse and hematology scientist certification',
    ],
    coverImage: 'https://app.milanote.com/media/p/images/1WOHiI1OpcQW2K/Dux/Spectra%20Optia_1st%20pic.png?w=800',
    readTimeMinutes: 6,
    featuredProductSlugs: ['terumo-bct-spectra-optia', 'spectra-optia-exchange-sets'],
    publishedDate: new Date('2026-01-20T10:00:00Z'),
    published: true,
  },
];
