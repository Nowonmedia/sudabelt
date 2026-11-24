import React, { useState } from 'react'
import { Link } from 'react-router'
import {
  Check,
  Plus,
  GraduationCap,
  Wrench,
  Package,
  X,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react'
import { FaWhatsapp } from 'react-icons/fa'
import { toast } from 'react-toastify'
import { useQuote } from '../context/QuoteContext'
import FormCaptcha from '../components/common/FormCaptcha'
import { getEmailValidationError } from '../utils/validation'

const NIGERIAN_STATES = [
  'Lagos',
  'Abuja FCT',
  'Kano',
  'Rivers',
  'Oyo',
  'Kaduna',
  'Enugu',
  'Edo',
  'Delta',
  'Ogun',
  'Anambra',
  'Akwa Ibom',
  'Abia',
  'Adamawa',
  'Bauchi',
  'Bayelsa',
  'Benue',
  'Borno',
  'Cross River',
  'Ebonyi',
  'Ekiti',
  'Gombe',
  'Imo',
  'Jigawa',
  'Katsina',
  'Kebbi',
  'Kogi',
  'Kwara',
  'Nasarawa',
  'Niger',
  'Ondo',
  'Osun',
  'Plateau',
  'Sokoto',
  'Taraba',
  'Yobe',
  'Zamfara',
]

const FACILITY_OPTIONS = [
  'Teaching hospital',
  'Federal / state medical centre',
  'Private specialist hospital',
  'Diagnostic / dialysis centre',
  'NGO / donor agency',
  'Primary care / community clinic',
]

interface TimelineOption {
  id: string
  title: string
  subtitle: string
}

const TIMELINE_OPTIONS: TimelineOption[] = [
  {
    id: 'Immediate',
    title: 'Immediate',
    subtitle: 'Emergency need',
  },
  {
    id: '1-3 months',
    title: '1-3 months',
    subtitle: 'Planned procurement',
  },
  {
    id: 'Tender phase',
    title: 'Tender phase',
    subtitle: 'Budgeting / tender',
  },
]

// Catalog for quick-add modal
interface QuickCatalogItem {
  id: string
  name: string
  category: string
  type: 'EQUIPMENT' | 'CONSUMABLES' | 'TRAINING' | 'MAINTENANCE / SLA'
  brand?: string
  isConsumable?: boolean
  defaultQty?: number
  notes?: string
  imageUrl?: string
}

const QUICK_CATALOG: QuickCatalogItem[] = [
  // Equipment
  {
    id: 'quick-artis-physio',
    name: 'Baxter Artis Physio Hemodialysis System',
    category: 'EQUIPMENT · BAXTER',
    type: 'EQUIPMENT',
    brand: 'Baxter',
    defaultQty: 1,
    imageUrl: 'https://res.cloudinary.com/ajgpbpap/image/upload/v1747656683/sudabelt/artis-physio.png',
  },
  {
    id: 'quick-ak-98',
    name: 'Baxter AK 98 Hemodialysis Machine',
    category: 'EQUIPMENT · BAXTER',
    type: 'EQUIPMENT',
    brand: 'Baxter',
    defaultQty: 1,
    imageUrl: 'https://res.cloudinary.com/ajgpbpap/image/upload/v1747656683/sudabelt/ak98.png',
  },
  {
    id: 'quick-spectra-optia',
    name: 'Terumo BCT Spectra Optia Apheresis System',
    category: 'EQUIPMENT · TERUMO BCT',
    type: 'EQUIPMENT',
    brand: 'Terumo BCT',
    defaultQty: 1,
    imageUrl: 'https://res.cloudinary.com/ajgpbpap/image/upload/v1747656685/sudabelt/spectra-optia.png',
  },
  {
    id: 'quick-mirasol',
    name: 'Terumo BCT Mirasol Pathogen Reduction System',
    category: 'EQUIPMENT · TERUMO BCT',
    type: 'EQUIPMENT',
    brand: 'Terumo BCT',
    defaultQty: 1,
    imageUrl: 'https://res.cloudinary.com/ajgpbpap/image/upload/v1747656685/sudabelt/mirasol.png',
  },
  {
    id: 'quick-ge-venue-go',
    name: 'GE Venue Go Point-of-Care Ultrasound',
    category: 'EQUIPMENT · GE HEALTHCARE',
    type: 'EQUIPMENT',
    brand: 'GE HealthCare',
    defaultQty: 1,
    imageUrl: 'https://res.cloudinary.com/ajgpbpap/image/upload/v1747656686/sudabelt/ge-venue-go.png',
  },
  // Consumables
  {
    id: 'quick-cleancart-c',
    name: 'CleanCart C Decalcification Cartridge',
    category: 'CONSUMABLE · DISINFECTION / MONTHLY ORDER',
    type: 'CONSUMABLES',
    isConsumable: true,
    defaultQty: 12,
    imageUrl: 'https://res.cloudinary.com/ajgpbpap/image/upload/v1747656684/sudabelt/cleancart-c.png',
  },
  {
    id: 'quick-revaclear-400',
    name: 'Revaclear 400 High-Flux Dialyzer',
    category: 'CONSUMABLE · RENAL CARE',
    type: 'CONSUMABLES',
    isConsumable: true,
    defaultQty: 24,
    imageUrl: 'https://res.cloudinary.com/ajgpbpap/image/upload/v1747656684/sudabelt/revaclear.png',
  },
  {
    id: 'quick-bicart',
    name: 'BiCart Bicarbonate Cartridge (650g / 720g)',
    category: 'CONSUMABLE · DIALYSIS BUFFER',
    type: 'CONSUMABLES',
    isConsumable: true,
    defaultQty: 30,
    imageUrl: 'https://res.cloudinary.com/ajgpbpap/image/upload/v1747656684/sudabelt/bicart.png',
  },
  {
    id: 'quick-optia-exchange',
    name: 'Spectra Optia Exchange Set with ACD-A',
    category: 'CONSUMABLE · APHERESIS',
    type: 'CONSUMABLES',
    isConsumable: true,
    defaultQty: 10,
    imageUrl: 'https://res.cloudinary.com/ajgpbpap/image/upload/v1747656685/sudabelt/spectra-tubing.png',
  },
  // Training
  {
    id: 'quick-trn-renal',
    name: 'Renal Nurses training track',
    category: 'TRAINING · 40 HOURS ON-SITE',
    type: 'TRAINING',
    defaultQty: 1,
    notes: '1 cohort',
  },
  {
    id: 'quick-trn-apheresis',
    name: 'Hematology & Apheresis Scientists track',
    category: 'TRAINING · 40 HOURS ON-SITE',
    type: 'TRAINING',
    defaultQty: 1,
    notes: '1 cohort',
  },
  {
    id: 'quick-trn-icu',
    name: 'Critical Care Staff track',
    category: 'TRAINING · 24 HOURS ON-SITE',
    type: 'TRAINING',
    defaultQty: 1,
    notes: '1 cohort',
  },
  {
    id: 'quick-trn-biomed',
    name: 'In-House Biomedical Engineers track',
    category: 'TRAINING · 36 HOURS ON-SITE',
    type: 'TRAINING',
    defaultQty: 1,
    notes: '1 cohort',
  },
  // Maintenance / SLA
  {
    id: 'quick-sla-12m',
    name: 'Turnkey 12-Month Preventive SLA & Calibration',
    category: 'MAINTENANCE / SLA · COMPREHENSIVE',
    type: 'MAINTENANCE / SLA',
    defaultQty: 1,
    notes: '12-Month Contract',
  },
  {
    id: 'quick-sla-emergency',
    name: '24/7 Rapid Biomedical Response & Spare Dispatch',
    category: 'MAINTENANCE / SLA · RAPID SLA',
    type: 'MAINTENANCE / SLA',
    defaultQty: 1,
    notes: 'Annual Retainer',
  },
  {
    id: 'quick-sla-ro-water',
    name: 'RO Water Treatment Plant Maintenance & Disinfection',
    category: 'MAINTENANCE / SLA · FACILITY',
    type: 'MAINTENANCE / SLA',
    defaultQty: 1,
    notes: 'Quarterly Service',
  },
]

const RFQPage: React.FC = () => {
  const { selectedItems, addItem, removeItem, updateQuantity, clearTray } = useQuote()

  // Form State
  const [facilityType, setFacilityType] = useState<string>('Teaching hospital')
  const [stateLocation, setStateLocation] = useState<string>('Lagos')
  const [cityTown, setCityTown] = useState<string>('Victoria Island')
  const [timeline, setTimeline] = useState<string>('1-3 months')

  // Contact State
  const [fullName, setFullName] = useState<string>('')
  const [role, setRole] = useState<string>('')
  const [institution, setInstitution] = useState<string>('')
  const [workEmail, setWorkEmail] = useState<string>('')
  const [phone, setPhone] = useState<string>('+234')
  const [notes, setNotes] = useState<string>('')

  // UI state
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [captchaVerified, setCaptchaVerified] = useState<boolean>(false)
  const [activeModalTab, setActiveModalTab] = useState<'EQUIPMENT' | 'CONSUMABLES' | 'TRAINING' | 'MAINTENANCE / SLA' | null>(null)
  const [submittedRef, setSubmittedRef] = useState<string | null>(null)
  const [whatsappUrlFromApi, setWhatsappUrlFromApi] = useState<string | null>(null)

  // Count summary
  const summaryDisplayCount = selectedItems.length

  // Build WhatsApp text link
  const buildWhatsAppLink = (customRefId?: string): string => {
    const refText = customRefId ? ` (Ref: ${customRefId})` : ''
    const itemsList = selectedItems
      .map((item) => `- ${item.quantity}x ${item.name} (${item.category || 'General'})`)
      .join('\n')

    const message = `Hello Sudabelt Sales Desk,\n\nI would like to request an official quote${refText}.\n\n*Facility:* ${institution || facilityType} (${cityTown || 'City'}, ${stateLocation})\n*Institution Type:* ${facilityType}\n*Timeline:* ${timeline}\n\n*Requested Scope:*\n${itemsList || '- No items selected yet'}\n\n*Contact:* ${fullName || 'Procurement Team'} ${role ? `(${role})` : ''}\n*Email:* ${workEmail || 'Pending'}\n*Phone:* ${phone}\n${notes ? `*Notes:* ${notes}` : ''}`

    return `https://wa.me/2349135733876?text=${encodeURIComponent(message)}`
  }

  // Handle API Submission
  const handleSubmitRequest = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()

    if (selectedItems.length === 0) {
      toast.warning('Please add at least one equipment, consumable, or service item to your RFQ tray.')
      return
    }

    if (!fullName.trim()) {
      toast.error('Please enter your full name.')
      return
    }

    const emailError = getEmailValidationError(workEmail)
    if (emailError) {
      toast.error(emailError)
      return
    }

    if (!captchaVerified) {
      toast.error('Please complete the security check before submitting.')
      return
    }

    if (!phone.trim() || phone.trim() === '+234' || phone.length < 8) {
      toast.error('Please enter a valid contact phone or WhatsApp number.')
      return
    }

    setIsSubmitting(true)

    try {
      const payload = {
        facilityName: institution.trim() || facilityType,
        facilityType: facilityType,
        location: {
          city: cityTown.trim() || 'Victoria Island',
          state: stateLocation,
          country: 'Nigeria',
        },
        urgency: timeline,
        selectedItems: selectedItems.map((item) => ({
          name: item.name,
          category: item.category || (item.isConsumable ? 'Consumable' : 'Equipment'),
          quantity: item.quantity,
          notes: item.notes || undefined,
        })),
        slaTier: 'Standard Turnkey + 12-Month Preventive SLA',
        contact: {
          name: fullName.trim(),
          role: role.trim() || 'Procurement Officer',
          email: workEmail.trim(),
          phone: phone.trim(),
        },
        additionalNotes: notes.trim() || undefined,
      }

      const res = await fetch('/api/v1/forms/rfq', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || 'Failed to submit RFQ. Please try again or reach out on WhatsApp.')
      }

      const refId = data.referenceId || `SBM-RFQ-${Date.now().toString().slice(-6)}`
      setSubmittedRef(refId)
      setWhatsappUrlFromApi(data.whatsappUrl || buildWhatsAppLink(refId))

      toast.success(`Quote request ${refId} submitted successfully! Our biomedical desk is preparing your proposal.`)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error submitting quote request.'
      toast.error(msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle Direct WhatsApp Dispatch
  const handleSendViaWhatsApp = () => {
    const waUrl = buildWhatsAppLink(submittedRef || undefined)
    window.open(waUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-8 md:py-12 text-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-4">
          <Link to="/" className="hover:text-blue-600 transition">
            Home
          </Link>
          <span>/</span>
          <span className="text-slate-800 font-medium">Request for quote</span>
        </nav>

        {/* Page Title & Subtitle */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#07172B] tracking-tight">
            Request a quote
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed">
            Four short steps. Our sales and biomedical team respond with a scoped quote, and you can continue on WhatsApp at any point.
          </p>
        </div>

        {/* Step Progress Bar */}
        <div className="mb-10 bg-white border border-slate-200 rounded-lg p-4 sm:p-5 shadow-xs">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {/* Step 1 */}
            <div className="relative">
              <span className="block text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-blue-600">
                STEP 1
              </span>
              <span className="block text-xs sm:text-sm font-bold text-[#07172B] mt-0.5">
                Scope
              </span>
              <div className="h-1 bg-blue-600 rounded-full mt-2.5 w-full" />
            </div>

            {/* Step 2 */}
            <div className="relative">
              <span className="block text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-500">
                STEP 2
              </span>
              <span className="block text-xs sm:text-sm font-bold text-slate-700 mt-0.5">
                Facility Profile
              </span>
              <div className="h-1 bg-slate-200 rounded-full mt-2.5 w-full" />
            </div>

            {/* Step 3 */}
            <div className="relative">
              <span className="block text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-500">
                STEP 3
              </span>
              <span className="block text-xs sm:text-sm font-bold text-slate-700 mt-0.5">
                Location &amp; Timeline
              </span>
              <div className="h-1 bg-slate-200 rounded-full mt-2.5 w-full" />
            </div>

            {/* Step 4 */}
            <div className="relative">
              <span className="block text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-500">
                STEP 4
              </span>
              <span className="block text-xs sm:text-sm font-bold text-slate-700 mt-0.5">
                Contact &amp; dispatch
              </span>
              <div className="h-1 bg-slate-200 rounded-full mt-2.5 w-full" />
            </div>
          </div>
        </div>

        {/* Main Grid: Form Left (col-span-8), Summary Right (col-span-4) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: The 4 Steps */}
          <div className="lg:col-span-8 space-y-6">
            {/* CARD 1: Scope */}
            <div className="bg-white rounded-lg border border-slate-200 p-6 sm:p-7 shadow-xs">
              <div className="flex items-start justify-between gap-3.5 mb-5">
                <div className="flex items-start gap-3.5">
                  <div className="w-7 h-7 bg-[#07172B] text-white rounded flex items-center justify-center font-bold text-sm shrink-0">
                    1
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-[#07172B] leading-none">Scope</h2>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                      Review the items in your tray or add more.
                    </p>
                  </div>
                </div>

                {selectedItems.length > 0 && (
                  <button
                    type="button"
                    onClick={clearTray}
                    className="text-xs font-semibold text-slate-500 hover:text-red-600 transition cursor-pointer underline"
                  >
                    Clear Tray
                  </button>
                )}
              </div>

              {/* Items List */}
              {selectedItems.length === 0 ? (
                <div className="p-8 text-center border border-dashed border-slate-200 rounded-lg my-4 bg-slate-50">
                  <Package className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-slate-700">Your quote tray is currently empty</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Select from the quick-add buttons below or browse our portfolio to add medical equipment and consumables.
                  </p>
                  <Link
                    to="/products"
                    className="inline-block mt-3 px-3.5 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold rounded hover:bg-blue-100 transition cursor-pointer"
                  >
                    Browse Portfolio Catalog
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-slate-100 mb-6">
                  {selectedItems.map((item) => {
                    const isTraining = item.category?.toUpperCase().includes('TRAINING') || item.name.toLowerCase().includes('training')
                    const isMaintenance = item.category?.toUpperCase().includes('MAINTENANCE') || item.category?.toUpperCase().includes('SLA')

                    return (
                      <div
                        key={item.id}
                        className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        {/* Item Icon & Title */}
                        <div className="flex items-center gap-3.5 min-w-0">
                          <div className="w-12 h-12 rounded bg-slate-50 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0 p-1">
                            {item.imageUrl ? (
                              <img
                                src={item.imageUrl}
                                alt={item.name}
                                className="w-full h-full object-contain"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none'
                                }}
                              />
                            ) : isTraining ? (
                              <GraduationCap className="w-6 h-6 text-blue-600" />
                            ) : isMaintenance ? (
                              <Wrench className="w-6 h-6 text-emerald-600" />
                            ) : (
                              <Package className="w-6 h-6 text-slate-500" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <h3 className="text-sm sm:text-base font-bold text-[#07172B] truncate">
                              {item.name}
                            </h3>
                            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mt-0.5 truncate">
                              {item.category || (item.isConsumable ? 'CONSUMABLE' : 'EQUIPMENT')}
                            </p>
                          </div>
                        </div>

                        {/* Quantity & Remove */}
                        <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
                          {isTraining ? (
                            <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded">
                              {item.notes || '1 cohort'}
                            </span>
                          ) : (
                            <div className="flex items-center border border-slate-200 rounded bg-white">
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                className="px-2 py-0.5 text-slate-500 hover:text-slate-800 text-xs font-bold cursor-pointer"
                                aria-label="Decrease quantity"
                              >
                                -
                              </button>
                              <span className="px-2 text-xs font-bold text-[#07172B] min-w-[3rem] text-center">
                                Qty {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="px-2 py-0.5 text-slate-500 hover:text-slate-800 text-xs font-bold cursor-pointer"
                                aria-label="Increase quantity"
                              >
                                +
                              </button>
                            </div>
                          )}

                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-600 border border-slate-300 rounded hover:border-red-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                          >
                            REMOVE
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

              {/* 4 Quick Add Buttons */}
              <div className="flex flex-wrap items-center gap-2.5 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActiveModalTab('EQUIPMENT')}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded border border-slate-300 text-slate-700 hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50/50 text-xs font-bold uppercase tracking-wider transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>EQUIPMENT</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveModalTab('CONSUMABLES')}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded border border-slate-300 text-slate-700 hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50/50 text-xs font-bold uppercase tracking-wider transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>CONSUMABLES</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveModalTab('TRAINING')}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded border border-slate-300 text-slate-700 hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50/50 text-xs font-bold uppercase tracking-wider transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>TRAINING</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveModalTab('MAINTENANCE / SLA')}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded border border-slate-300 text-slate-700 hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50/50 text-xs font-bold uppercase tracking-wider transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>MAINTENANCE / SLA</span>
                </button>
              </div>
            </div>

            {/* CARD 2: Facility Profile */}
            <div className="bg-white rounded-lg border border-slate-200 p-6 sm:p-7 shadow-xs">
              <div className="flex items-start gap-3.5 mb-5">
                <div className="w-7 h-7 bg-[#07172B] text-white rounded flex items-center justify-center font-bold text-sm shrink-0">
                  2
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[#07172B] leading-none">Facility Profile</h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    What type of institution are you buying for?
                  </p>
                </div>
              </div>

              {/* Grid of Facility Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {FACILITY_OPTIONS.map((facility) => {
                  const isSelected = facilityType === facility
                  return (
                    <button
                      type="button"
                      key={facility}
                      onClick={() => setFacilityType(facility)}
                      className={`text-left p-4 rounded-lg border transition flex items-center gap-3 cursor-pointer ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50/40 text-[#07172B] font-bold shadow-xs'
                          : 'border-slate-200 bg-white text-slate-700 font-medium hover:border-slate-300'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded flex items-center justify-center shrink-0 transition ${
                          isSelected
                            ? 'bg-emerald-600 text-white'
                            : 'border border-slate-300 bg-white'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                      <span className="text-xs sm:text-sm">{facility}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* CARD 3: Location & Timeline */}
            <div className="bg-white rounded-lg border border-slate-200 p-6 sm:p-7 shadow-xs">
              <div className="flex items-start gap-3.5 mb-5">
                <div className="w-7 h-7 bg-[#07172B] text-white rounded flex items-center justify-center font-bold text-sm shrink-0">
                  3
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[#07172B] leading-none">Location &amp; Timeline</h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Where is the facility and how soon do you need it?
                  </p>
                </div>
              </div>

              {/* State & City/Town Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                <div>
                  <label htmlFor="facility-state-select" className="block text-xs font-semibold text-slate-700 mb-1.5">
                    State
                  </label>
                  <select
                    id="facility-state-select"
                    value={stateLocation}
                    onChange={(e) => setStateLocation(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 cursor-pointer"
                  >
                    {NIGERIAN_STATES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="facility-city-input" className="block text-xs font-semibold text-slate-700 mb-1.5">
                    City / town
                  </label>
                  <input
                    id="facility-city-input"
                    type="text"
                    value={cityTown}
                    onChange={(e) => setCityTown(e.target.value)}
                    placeholder="e.g. Victoria Island"
                    className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600"
                  />
                </div>
              </div>

              {/* Timeline Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {TIMELINE_OPTIONS.map((opt) => {
                  const isSelected = timeline === opt.id
                  return (
                    <button
                      type="button"
                      key={opt.id}
                      onClick={() => setTimeline(opt.id)}
                      className={`text-left p-3.5 rounded-lg border transition flex items-start gap-3 cursor-pointer ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50/40 text-[#07172B] shadow-xs'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full mt-0.5 flex items-center justify-center shrink-0 transition ${
                          isSelected
                            ? 'bg-emerald-600 text-white'
                            : 'border border-slate-300 bg-white'
                        }`}
                      >
                        {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </div>
                      <div>
                        <span className="block text-xs sm:text-sm font-bold text-[#07172B]">
                          {opt.title}
                        </span>
                        <span className="block text-[11px] text-slate-500 mt-0.5">
                          {opt.subtitle}
                        </span>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* CARD 4: Contact & Dispatch */}
            <div className="bg-white rounded-lg border border-slate-200 p-6 sm:p-7 shadow-xs">
              <div className="flex items-start gap-3.5 mb-5">
                <div className="w-7 h-7 bg-[#07172B] text-white rounded flex items-center justify-center font-bold text-sm shrink-0">
                  4
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[#07172B] leading-none">Contact</h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Who should we send the quote to?
                  </p>
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-4 mb-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contact-fullname" className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Full name
                    </label>
                    <input
                      id="contact-fullname"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Your name"
                      className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-role" className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Role
                    </label>
                    <input
                      id="contact-role"
                      type="text"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      placeholder="e.g. Procurement Officer"
                      className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contact-institution" className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Institution
                    </label>
                    <input
                      id="contact-institution"
                      type="text"
                      value={institution}
                      onChange={(e) => setInstitution(e.target.value)}
                      placeholder="Hospital or organisation"
                      className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-workemail" className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Work email
                    </label>
                    <input
                      id="contact-workemail"
                      type="email"
                      value={workEmail}
                      onChange={(e) => setWorkEmail(e.target.value)}
                      placeholder="name@hospital.org"
                      className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-phone" className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Phone / WhatsApp
                  </label>
                  <input
                    id="contact-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+234"
                    className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600"
                  />
                </div>

                <div>
                  <label htmlFor="contact-notes" className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Notes for our team
                  </label>
                  <textarea
                    id="contact-notes"
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Anything we should know about your facility"
                    className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600"
                  />
                </div>
              </div>

              <FormCaptcha onVerifyChange={setCaptchaVerified} />

              {/* Action Buttons: Submit & WhatsApp */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => handleSubmitRequest()}
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-8 py-3.5 bg-[#0072CE] hover:bg-[#0E8A44] disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider rounded transition-all duration-200 cursor-pointer shadow-xs text-center"
                >
                  {isSubmitting ? 'SUBMITTING REQUEST...' : 'SUBMIT REQUEST'}
                </button>

                <button
                  type="button"
                  onClick={handleSendViaWhatsApp}
                  className="w-full sm:w-auto px-8 py-3.5 bg-[#0E8A44] hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded transition cursor-pointer shadow-xs flex items-center justify-center gap-2 text-center"
                >
                  <FaWhatsapp className="w-4 h-4" />
                  <span>SEND VIA WHATSAPP</span>
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Sticky Summary Cards */}
          <div className="lg:col-span-4 space-y-5 sticky top-24">
            {/* Card 1: YOUR REQUEST (Dark Navy) */}
            <div className="bg-[#07172B] text-white rounded-lg p-6 shadow-md border border-slate-800">
              <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">
                YOUR REQUEST
              </span>

              <div className="space-y-3.5 divide-y divide-white/10 text-xs sm:text-sm">
                <div className="flex items-center justify-between pt-1">
                  <span className="text-slate-400">Items</span>
                  <span className="font-bold text-white font-mono">{summaryDisplayCount}</span>
                </div>

                <div className="flex items-center justify-between pt-3">
                  <span className="text-slate-400">Facility</span>
                  <span className="font-medium text-white text-right max-w-[11rem] truncate">
                    {institution || facilityType}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-3">
                  <span className="text-slate-400">Location</span>
                  <span className="font-medium text-white text-right max-w-[11rem] truncate">
                    {cityTown ? `${cityTown}, ${stateLocation}` : stateLocation}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-3">
                  <span className="text-slate-400">Timeline</span>
                  <span className="font-medium text-white">{timeline}</span>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-white/10">
                <p className="text-[11px] text-slate-300 leading-relaxed flex items-start gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Installation, training and maintenance are scoped into every quote.</span>
                </p>
              </div>
            </div>

            {/* Card 2: PREFER TO TALK? (White) */}
            <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs">
              <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                PREFER TO TALK?
              </span>

              <a
                href="tel:+2349135733876"
                className="block text-base sm:text-lg font-bold text-[#07172B] hover:text-blue-600 transition mt-2"
              >
                +234 (0) 913 573 3876
              </a>

              <a
                href="mailto:info@sudabelt.com"
                className="block text-xs sm:text-sm text-slate-600 hover:text-blue-600 transition mt-1"
              >
                info@sudabelt.com
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* QUICK ADD MODAL */}
      {activeModalTab && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full border border-slate-200 max-h-[85vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base sm:text-lg text-[#07172B]">
                  Quick Add to RFQ Tray
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Select equipment, consumables, or clinical services to add to your quote.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveModalTab(null)}
                className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Category Tabs */}
            <div className="flex border-b border-slate-200 px-4 bg-slate-50 overflow-x-auto [&::-webkit-scrollbar]:hidden">
              {(['EQUIPMENT', 'CONSUMABLES', 'TRAINING', 'MAINTENANCE / SLA'] as const).map((tab) => (
                <button
                  type="button"
                  key={tab}
                  onClick={() => setActiveModalTab(tab)}
                  className={`px-3 py-2.5 text-xs font-bold uppercase tracking-wider shrink-0 border-b-2 transition cursor-pointer ${
                    activeModalTab === tab
                      ? 'border-blue-600 text-blue-600 bg-white'
                      : 'border-transparent text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Modal Items List */}
            <div className="p-4 sm:p-5 overflow-y-auto space-y-3 flex-1">
              {QUICK_CATALOG.filter((item) => item.type === activeModalTab).map((item) => {
                const inTrayAlready = selectedItems.some((si) => si.id === item.id)

                return (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-lg border border-slate-200 flex items-center justify-between gap-3 hover:border-slate-300 transition"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0 p-1">
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none'
                            }}
                          />
                        ) : item.type === 'TRAINING' ? (
                          <GraduationCap className="w-5 h-5 text-blue-600" />
                        ) : item.type === 'MAINTENANCE / SLA' ? (
                          <Wrench className="w-5 h-5 text-emerald-600" />
                        ) : (
                          <Package className="w-5 h-5 text-slate-500" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs sm:text-sm font-bold text-[#07172B] truncate">
                          {item.name}
                        </h4>
                        <p className="text-[11px] text-slate-500 uppercase tracking-wider mt-0.5 truncate">
                          {item.category}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        addItem({
                          id: item.id,
                          name: item.name,
                          category: item.category,
                          brand: item.brand,
                          isConsumable: item.isConsumable,
                          quantity: item.defaultQty || 1,
                          imageUrl: item.imageUrl,
                          notes: item.notes,
                        })
                        toast.success(`Added "${item.name}" to your quote tray`)
                      }}
                      className={`px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider shrink-0 transition cursor-pointer ${
                        inTrayAlready
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                          : 'bg-blue-600 text-white hover:bg-[#0E8A44]'
                      }`}
                    >
                      {inTrayAlready ? '+ Add Another' : '+ Add to Tray'}
                    </button>
                  </div>
                )
              })}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">
                {selectedItems.length} items currently in quote tray
              </span>
              <button
                type="button"
                onClick={() => setActiveModalTab(null)}
                className="px-4 py-2 bg-[#07172B] text-white rounded text-xs font-bold uppercase tracking-wider hover:bg-slate-800 transition cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUBMISSION CONFIRMATION MODAL */}
      {submittedRef && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-lg shadow-2xl max-w-lg w-full border border-slate-200 p-6 sm:p-7 text-center">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-extrabold text-[#07172B]">
              Quote Request Submitted
            </h3>

            <div className="mt-2 text-xs font-mono bg-slate-100 py-1.5 px-3 rounded inline-block text-slate-800 font-bold">
              Reference: {submittedRef}
            </div>

            <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
              Thank you, <span className="font-semibold text-slate-800">{fullName}</span>. Our sales and biomedical engineering teams have received your institutional scope and will deliver an official formal quote to <span className="font-semibold text-slate-800">{workEmail}</span>.
            </p>

            <div className="mt-6 flex flex-col gap-2.5">
              <a
                href={whatsappUrlFromApi || buildWhatsAppLink(submittedRef)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-[#0E8A44] hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded transition flex items-center justify-center gap-2 shadow-xs"
              >
                <FaWhatsapp className="w-4 h-4" />
                <span>CONTINUE ON WHATSAPP</span>
              </a>

              <button
                type="button"
                onClick={() => setSubmittedRef(null)}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider rounded transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default RFQPage
