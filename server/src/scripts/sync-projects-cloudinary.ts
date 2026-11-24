import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { Project } from '../models/Project';
import { uploadToCloudinary } from '../services/cloudinaryService';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

async function uploadImage(url: string, publicId: string): Promise<string> {
  if (!url) return '';
  if (url.includes('res.cloudinary.com')) return url;
  try {
    const res = await uploadToCloudinary({
      fileSource: url,
      folder: 'sudabelt/projects',
      publicId,
      resourceType: 'image',
    });
    return res.optimizedUrl || res.secureUrl;
  } catch {
    const resp = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
      },
    });
    if (!resp.ok) throw new Error(`HTTP ${resp.status} for ${url}`);
    const contentType = resp.headers.get('content-type') || 'image/png';
    const base64 = Buffer.from(await resp.arrayBuffer()).toString('base64');
    const res = await uploadToCloudinary({
      fileSource: `data:${contentType};base64,${base64}`,
      folder: 'sudabelt/projects',
      publicId,
      resourceType: 'image',
    });
    return res.optimizedUrl || res.secureUrl;
  }
}

async function run() {
  const caseStudyImages = {
    gbagada:
      'https://cdn.prod.website-files.com/6210e301dcfe490b664a5d85/626552de52d56e9362c22239_3-%20Gbagada%20Oxygen%20Plant%201.png',
    adeboye:
      'https://cdn.prod.website-files.com/6210e301dcfe490b664a5d85/66f3e22c956d51ab2651cc62_Screen%20Shot%202024-09-25%20at%2011.12.37%20AM.png',
    okene:
      'https://cdn.prod.website-files.com/6210e301dcfe490b664a5d85/66f3e492eba111eb3e910d61_PHOTO-2023-01-17-21-47-35.jpg',
    ibadan:
      'https://cdn.prod.website-files.com/6210e301dcfe490b664a5d85/66f3e719f5f61de5125b3c13_WhatsApp%20Image%202022-06-10%20at%202.15.28%20PM%20(1).jpeg',
    kano:
      'https://cdn.prod.website-files.com/6210e301dcfe490b664a5d85/66f3e492eba111eb3e910d61_PHOTO-2023-01-17-21-47-35.jpg',
    nnpc:
      'https://cdn.prod.website-files.com/6210e301dcfe490b664a5d85/66f3ed0031ad585626c8ebbf_DAV_0471.jpg',
  };

  console.log('Uploading sudabelt.com/media#casestudy project images to Cloudinary...');
  const cloudUrls: Record<string, string> = {};
  for (const [key, url] of Object.entries(caseStudyImages)) {
    cloudUrls[key] = await uploadImage(url, `casestudy_${key}`);
    console.log(`  Uploaded ${key} -> ${cloudUrls[key]}`);
  }

  const projects = [
    // 1. NCDC / World Bank (Milanote Folder 1 - Multi-Location)
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
        'Executed across 10 locations nationwide (Makurdi, Kaduna, Gombe, Nasarawa, Ondo, Abakaliki/Ebonyi, Lagos, Birnin Kebbi, Irrua/Edo, and Jos/Plateau): Procurement, installation, and clinical training for HD Dialysis and CRRT machines under World Bank / NCDC / FMOH.',
      fullDescription:
        'Executed across multiple locations nationwide under Contract COPREP-GDS-RFB-02-2024 for the World Bank, Nigeria Centre for Disease Control (NCDC), and Federal Ministry of Health (June 2024). Sudabelt Medical delivered, installed, and commissioned Baxter AK 98 Hemodialysis and Prismaflex CRRT systems alongside Reverse Osmosis (RO) water systems and on-site clinical nurse/engineer certification across all 10 locations:\n\n1. Makurdi, Benue State\n2. Kaduna, Kaduna State\n3. Gombe, Gombe State\n4. Lafia / Keffi, Nasarawa State\n5. Owo / Akure, Ondo State\n6. Abakaliki, Ebonyi State\n7. Lagos, Lagos State\n8. Birnin Kebbi, Kebbi State\n9. Irrua, Edo State\n10. Jos, Plateau State',
      clientOrCommissionedBy: 'World Bank / NCDC / Federal Ministry of Health Nigeria',
      scopeOfWork: [
        'Multi-location delivery across 10 states: Makurdi, Kaduna, Gombe, Nasarawa, Ondo, Ebonyi, Lagos, Kebbi, Edo, and Plateau.',
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
        { label: 'Locations Covered', value: '10 States Nationwide' },
        { label: 'Contract Ref', value: 'COPREP-GDS-RFB-02-2024' },
        { label: 'Commissioned', value: 'June 2024' },
      ],
      published: true,
      isDeleted: false,
    },
    // 2. FTH Gombe (Milanote Folder 2)
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
    // 3. Edo State / Stella Obasanjo Hospital (Milanote Folder 3)
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
    // 4. Case Study 1 from sudabelt.com/media#casestudy: Gbagada
    {
      title: 'Gbagada General Hospital, Lagos oxygen plant',
      slug: 'gbagada-general-hospital-oxygen-plant',
      category: 'Oxygen & medical gas',
      facilityName: 'Gbagada General Hospital',
      locationState: 'Lagos',
      city: 'Gbagada, Lagos',
      completionYear: 2020,
      isFeatured: true,
      heroImage: cloudUrls.gbagada,
      galleryImages: [cloudUrls.gbagada],
      shortDescription:
        'Commissioned in 2020, Sudabelt played a major role in the fight against COVID-19, receiving a letter of commendation from the Lagos State Government.',
      fullDescription:
        'Commissioned in 2020, Sudabelt played a major role in the fight against COVID-19, receiving a letter of commendation from the Lagos State Government. Turnkey delivery, mechanical installation, electrical integration, and commissioning of a high-capacity Medical Oxygen Pressure Swing Adsorption (PSA) Generating Plant at Gbagada General Hospital.',
      clientOrCommissionedBy: 'Lagos State Ministry of Health & Lagos State Government',
      scopeOfWork: [
        'Turnkey Medical Oxygen Pressure Swing Adsorption (PSA) Generating Plant.',
        'High-pressure cylinder manifold filling station and distribution piping.',
        'Emergency delivery and commissioning during peak pandemic demand.',
        'Certified Lagos State biomedical engineering training & ongoing SLA.',
      ],
      equipmentSupplied: [
        'PSA Medical Oxygen Generation System',
        'High-Pressure Oxygen Booster Compressor',
        'Automatic Manifold Changeover System',
      ],
      impactMetrics: [
        { label: 'Commissioned', value: '2020' },
        { label: 'Location', value: 'Lagos State' },
        { label: 'Recognition', value: 'Lagos State Commendation' },
      ],
      published: true,
      isDeleted: false,
    },
    // 5. Case Study 2 from sudabelt.com/media#casestudy: Adeboye Dialysis Centre
    {
      title: 'Enoch & Folu Adeboye Dialysis Centre, Abuja',
      slug: 'enoch-and-folu-adeboye-dialysis-centre',
      category: 'Dialysis & renal',
      facilityName: 'Enoch & Folu Adeboye Dialysis Centre',
      locationState: 'Abuja',
      city: 'Abuja, FCT',
      completionYear: 2022,
      isFeatured: true,
      heroImage: cloudUrls.adeboye,
      galleryImages: [cloudUrls.adeboye],
      shortDescription:
        'Commissioned in 2022, the centre is equipped with 8 dialysis machines and medical water reverse osmosis purification system, all facilitated by Sudabelt Medical.',
      fullDescription:
        'Commissioned in 2022, the centre is equipped with 8 dialysis machines and medical water reverse osmosis purification system, all facilitated by Sudabelt Medical.',
      clientOrCommissionedBy: 'His Love Foundation / RCCG National Healthcare Outreach',
      scopeOfWork: [
        '8 High-flux hemodialysis machines with automated ultrafiltration.',
        'Double-pass clinical reverse osmosis water treatment system.',
        'Pure water distribution loop and dialysis consumables pipeline.',
        'Clinical applications certification for nephrology staff.',
      ],
      equipmentSupplied: [
        'Hemodialysis Machines (8 Units)',
        'Medical Water Reverse Osmosis (RO) Purification System',
        'Dialysis Treatment Chairs & Disinfection Systems',
      ],
      impactMetrics: [
        { label: 'Hemodialysis Stations', value: '8 Machines' },
        { label: 'Water System', value: 'Reverse Osmosis' },
        { label: 'Commissioned', value: '2022' },
      ],
      published: true,
      isDeleted: false,
    },
    // 6. Case Study 3 from sudabelt.com/media#casestudy: Reference Hospital Okene
    {
      title: 'Reference Hospital, Okene',
      slug: 'reference-hospital-okene',
      category: 'Hospital equipping',
      facilityName: 'Reference Hospital Okene',
      locationState: 'Kogi',
      city: 'Okene, Kogi State',
      completionYear: 2022,
      isFeatured: true,
      heroImage: cloudUrls.okene,
      galleryImages: [
        cloudUrls.okene,
        'https://res.cloudinary.com/ajgpbpap/image/upload/f_auto,q_auto/v1795005942/sudabelt/projects/reference-hospital-okene_2.png',
      ],
      shortDescription:
        'Commissioned by the President Muhammed Buhari in December 2022, the reference hospital is a landmark project of which Sudabelt Medical handled medical equipment delivery and installations.',
      fullDescription:
        'Commissioned by the President Muhammed Buhari in December 2022, the reference hospital is a landmark project of which Sudabelt Medical handled medical equipment delivery and installations.',
      clientOrCommissionedBy: 'Kogi State Government',
      scopeOfWork: [
        'Multi-departmental turnkey medical equipment procurement and installation.',
        'Radiology, ICU, Theatre, and Renal Unit commissioning.',
        'On-site clinical and biomedical engineering staff certification.',
      ],
      equipmentSupplied: [
        'GE Healthcare Diagnostic Ultrasound & Radiology Systems',
        'ICU Patient Monitors, Ventilators & Anesthesia Carestations',
        'Hemodialysis Stations & RO Water Treatment Plant',
      ],
      impactMetrics: [
        { label: 'Commissioned', value: 'December 2022' },
        { label: 'Location', value: 'Okene, Kogi State' },
        { label: 'Scope', value: 'Landmark Turnkey Equipping' },
      ],
      published: true,
      isDeleted: false,
    },
    // 7. Case Study 4 from sudabelt.com/media#casestudy: Ring Road Hospital Ibadan
    {
      title: 'Ring Road Hospital, Ibadan',
      slug: 'ring-road-state-hospital-ibadan',
      category: 'Dialysis & renal',
      facilityName: 'Ring Road State Hospital',
      locationState: 'Oyo',
      city: 'Ibadan, Oyo State',
      completionYear: 2022,
      isFeatured: false,
      heroImage: cloudUrls.ibadan,
      galleryImages: [cloudUrls.ibadan],
      shortDescription:
        'Commissioned in 2022, the centre is equipped with dialysis machines all facilitated by Sudabelt Medical.',
      fullDescription:
        'Commissioned in 2022, the centre is equipped with dialysis machines all facilitated by Sudabelt Medical.',
      clientOrCommissionedBy: 'Oyo State Government',
      scopeOfWork: [
        'Supply and installation of hemodialysis machines for the renal unit.',
        'Renal water purification and drainage plumbing integration.',
        'Clinical training and preventive maintenance support.',
      ],
      equipmentSupplied: [
        'Hemodialysis Machines',
        'Medical Water Reverse Osmosis (RO) Filtration Unit',
      ],
      impactMetrics: [
        { label: 'Commissioned', value: '2022' },
        { label: 'Location', value: 'Ibadan, Oyo State' },
      ],
      published: true,
      isDeleted: false,
    },
    // 8. Case Study 5 from sudabelt.com/media#casestudy: Kano Medical Centre
    {
      title: 'Kano Medical Centre',
      slug: 'kano-medical-centre',
      category: 'Imaging & diagnostics',
      facilityName: 'Kano Medical Centre',
      locationState: 'Kano',
      city: 'Kano',
      completionYear: 2022,
      isFeatured: false,
      heroImage: cloudUrls.kano,
      galleryImages: [cloudUrls.kano],
      shortDescription:
        'Sudabelt Medical successfully delivered and installed a GE revolution EVO CT machine as well as the Abbot clinical chemistry equipment.',
      fullDescription:
        'Sudabelt Medical successfully delivered and installed a GE revolution EVO CT machine as well as the Abbot clinical chemistry equipment.',
      clientOrCommissionedBy: 'Kano Healthcare Authorities',
      scopeOfWork: [
        'Delivery and installation of GE Revolution EVO CT scanner.',
        'Installation and calibration of Abbott clinical chemistry equipment.',
        'Local biomedical support from Kano regional hub.',
      ],
      equipmentSupplied: [
        'GE Revolution EVO CT Machine',
        'Abbott Clinical Chemistry Equipment',
      ],
      impactMetrics: [
        { label: 'Location', value: 'Kano State' },
        { label: 'Modalities', value: 'CT & Clinical Chemistry' },
      ],
      published: true,
      isDeleted: false,
    },
    // 9. Case Study 6 from sudabelt.com/media#casestudy: NNPC Multi-Specialist Hospital, Abuja
    {
      title: 'NNPC Multi-Specialist Hospital, Abuja',
      slug: 'nnpc-multi-specialist-hospital-abuja',
      category: 'Hospital equipping',
      facilityName: 'NNPC Multi-Specialist Hospital',
      locationState: 'Abuja',
      city: 'Abuja, FCT',
      completionYear: 2022,
      isFeatured: false,
      heroImage: cloudUrls.nnpc,
      galleryImages: [cloudUrls.nnpc],
      shortDescription:
        'Sudabelt Medical supplied, installed and trained staff on the Abbott chemical analyzer C4000 and the Abbott Cell-Dyn Emerald 22Al analyzer.',
      fullDescription:
        'Sudabelt Medical supplied, installed and trained staff on the Abbott chemical analyzer C4000 and the Abbott Cell-Dyn Emerald 22Al analyzer.',
      clientOrCommissionedBy: 'NNPC Medical Services Ltd, Abuja',
      scopeOfWork: [
        'Supply and installation of Abbott chemical analyzer C4000.',
        'Supply and installation of Abbott Cell-Dyn Emerald 22Al analyzer.',
        'Comprehensive clinical laboratory staff training.',
      ],
      equipmentSupplied: [
        'Abbott Chemical Analyzer C4000',
        'Abbott Cell-Dyn Emerald 22Al Analyzer',
      ],
      impactMetrics: [
        { label: 'Location', value: 'Abuja, FCT' },
        { label: 'Analyzers', value: 'Abbott C4000 & Cell-Dyn' },
      ],
      published: true,
      isDeleted: false,
    },
  ];

  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) throw new Error('MONGODB_URI missing');
  await mongoose.connect(mongoUri);
  console.log('Connected to MongoDB Atlas. Syncing projects...');

  const officialSlugs = projects.map((p) => p.slug);
  await Project.deleteMany({ slug: { $nin: officialSlugs } });

  for (const proj of projects) {
    await Project.findOneAndUpdate(
      { slug: proj.slug },
      { $set: proj },
      { upsert: true, new: true }
    );
    console.log(`  Upserted project: ${proj.title}`);
  }

  const total = await Project.countDocuments({});
  console.log(`Total projects in MongoDB Atlas: ${total}`);

  const dbJsonPath = path.resolve(__dirname, '../../data/db.json');
  if (fs.existsSync(dbJsonPath)) {
    const dbData = JSON.parse(fs.readFileSync(dbJsonPath, 'utf-8'));
    dbData.projects = await Project.find({}).sort({ completionYear: -1 }).lean().exec();
    fs.writeFileSync(dbJsonPath, JSON.stringify(dbData, null, 2), 'utf-8');
    console.log(`Synced ${dbData.projects.length} projects to server/data/db.json`);
  }

  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
