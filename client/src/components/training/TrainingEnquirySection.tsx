import React, { useState, useEffect } from 'react'
import { Stethoscope, Wrench, CheckCircle2, Loader2, Building2 } from 'lucide-react'
import { toast } from 'react-toastify'
import { api } from '../../api/api'
import { HeaderTextReveal, SectionReveal } from '../common/Reveal'
import FormCaptcha from '../common/FormCaptcha'
import { getEmailValidationError } from '../../utils/validation'

const REPRESENTED_BRANDS = [
  'GE HealthCare',
  'Baxter',
  'Terumo BCT',
  'Abbott',
  'SWS Medical',
  'Maccura',
  'Fisher & Paykel Healthcare',
  'Ezisurg Medical',
]

const BRAND_OPTIONS = [...REPRESENTED_BRANDS, 'Other']

const TRAINING_TYPES = [
  'Clinical Applications Training (End-user operation)',
  'Biomedical Engineering Training (Technical repair, maintenance & installation)',
  'Both',
] as const

const TRAINING_DRAFT_KEY = 'sudabelt_training_enquiry_draft_v1'

const loadTrainingDraft = () => {
  try {
    const raw = localStorage.getItem(TRAINING_DRAFT_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

const TrainingEnquirySection: React.FC = () => {
  const draft = React.useMemo(loadTrainingDraft, [])
  const [fullName, setFullName] = useState<string>(draft.fullName ?? '')
  const [organization, setOrganization] = useState<string>(draft.organization ?? '')
  const [jobTitle, setJobTitle] = useState<string>(draft.jobTitle ?? '')
  const [email, setEmail] = useState<string>(draft.email ?? '')
  const [phone, setPhone] = useState<string>(draft.phone ?? '')
  const [trainingType, setTrainingType] = useState<string>(draft.trainingType ?? TRAINING_TYPES[0])
  const [selectedBrands, setSelectedBrands] = useState<string[]>(
    Array.isArray(draft.selectedBrands) ? draft.selectedBrands : []
  )
  const [participants, setParticipants] = useState<string>(draft.participants ?? '')
  const [location, setLocation] = useState<string>(draft.location ?? '')
  const [timeframe, setTimeframe] = useState<string>(draft.timeframe ?? '')
  const [notes, setNotes] = useState<string>(draft.notes ?? '')
  const [captchaVerified, setCaptchaVerified] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submittedRef, setSubmittedRef] = useState<string | null>(null)

  useEffect(() => {
    try {
      localStorage.setItem(
        TRAINING_DRAFT_KEY,
        JSON.stringify({
          fullName,
          organization,
          jobTitle,
          email,
          phone,
          trainingType,
          selectedBrands,
          participants,
          location,
          timeframe,
          notes,
        })
      )
    } catch {
      // Ignore storage errors
    }
  }, [
    fullName,
    organization,
    jobTitle,
    email,
    phone,
    trainingType,
    selectedBrands,
    participants,
    location,
    timeframe,
    notes,
  ])

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!fullName.trim() || !organization.trim() || !jobTitle.trim()) {
      toast.error('Please fill in your full name, organization, and job title.')
      return
    }

    const emailErr = getEmailValidationError(email)
    if (emailErr) {
      toast.error(emailErr)
      return
    }

    if (!phone.trim() || phone.replace(/[^0-9]/g, '').length < 7) {
      toast.error('Please enter a valid phone number.')
      return
    }

    if (selectedBrands.length === 0) {
      toast.error('Please select at least one brand or equipment of interest.')
      return
    }

    if (!participants.trim() || Number(participants) < 1) {
      toast.error('Please enter the number of participants.')
      return
    }

    if (!location.trim() || !timeframe.trim()) {
      toast.error('Please provide your location and expected timeframe.')
      return
    }

    if (!captchaVerified) {
      toast.error('Please complete the security check before submitting.')
      return
    }

    setIsSubmitting(true)
    try {
      const res = await api.submitTrainingBooking({
        institutionName: organization.trim(),
        courseTrack: `${trainingType} | Brands: ${selectedBrands.join(', ')}`,
        numberOfTrainees: Number(participants),
        targetHospitalState: location.trim(),
        contactName: fullName.trim(),
        contactRole: jobTitle.trim(),
        email: email.trim(),
        phone: phone.trim(),
        preferredDates: timeframe.trim(),
        notes: [
          `Training Type: ${trainingType}`,
          `Brands/Equipment: ${selectedBrands.join(', ')}`,
          notes.trim() ? `Additional Notes: ${notes.trim()}` : '',
        ]
          .filter(Boolean)
          .join('\n'),
      })

      const submittedContactName = fullName.trim()
      setSubmittedRef(res.registrationId || 'TRN-RECEIVED')
      setFullName('')
      setOrganization('')
      setJobTitle('')
      setEmail('')
      setPhone('')
      setTrainingType(TRAINING_TYPES[0])
      setSelectedBrands([])
      setParticipants('')
      setLocation('')
      setTimeframe('')
      setNotes('')
      try {
        localStorage.removeItem(TRAINING_DRAFT_KEY)
      } catch {
        // Ignore
      }
      toast.success(
        `Thank you, ${submittedContactName}! Training enquiry submitted successfully.`
      )
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unable to submit enquiry. Please try again.'
      toast.error(msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      {/* Two-Column Training Focus Highlight + Represented Brands */}
      <section id="training-pillars" className="py-16 sm:py-20 bg-sudabelt-surface border-b border-sudabelt-border">
        <div className="sudabelt-container">
          <HeaderTextReveal className="max-w-3xl mb-10">
            <div className="w-6 h-0.75 bg-sudabelt-red rounded-mark mb-3" />
            <span className="text-eyebrow text-sudabelt-green">DEDICATED TRAINING AREAS</span>
            <h2 className="text-section-heading text-sudabelt-navy mt-2">
              Two Pillars of Hands-On Capability Building
            </h2>
          </HeaderTextReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            <SectionReveal direction="up" delay={0.05}>
              <div className="h-full rounded-card bg-white border border-sudabelt-border p-7 sm:p-9 shadow-xs hover:border-sudabelt-green hover:shadow-card transition-all">
                <div className="w-12 h-12 rounded-xl bg-sudabelt-navy text-white flex items-center justify-center mb-5">
                  <Stethoscope className="w-6 h-6 text-sudabelt-blue" />
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-sudabelt-navy">
                  Clinical Applications Training
                </h3>
                <p className="text-sm sm:text-base text-sudabelt-body leading-relaxed mt-3">
                  Hands-on operational training for physicians, nurses, and lab specialists to
                  maximize clinical outcomes and safe device usage.
                </p>
              </div>
            </SectionReveal>

            <SectionReveal direction="up" delay={0.12}>
              <div className="h-full rounded-card bg-white border border-sudabelt-border p-7 sm:p-9 shadow-xs hover:border-sudabelt-green hover:shadow-card transition-all">
                <div className="w-12 h-12 rounded-xl bg-sudabelt-green text-white flex items-center justify-center mb-5">
                  <Wrench className="w-6 h-6" />
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-sudabelt-navy">
                  Biomedical Engineering Support &amp; Training
                </h3>
                <p className="text-sm sm:text-base text-sudabelt-body leading-relaxed mt-3">
                  Technical training for hospital biomedical engineers covering installation,
                  preventative maintenance, and troubleshooting/repair.
                </p>
              </div>
            </SectionReveal>
          </div>

          {/* Dedicated Training Across 8 Global Brands */}
          <SectionReveal direction="up" delay={0.18} className="mt-10">
            <div className="rounded-card bg-sudabelt-navy text-white p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                <div className="flex items-center gap-2.5">
                  <Building2 className="w-5 h-5 text-sudabelt-blue shrink-0" />
                  <h3 className="text-base sm:text-lg font-extrabold text-white">
                    Dedicated Training Across Our Global OEM Brands
                  </h3>
                </div>
                <span className="text-xs font-mono text-sudabelt-blue uppercase tracking-wider">
                  8 Authorized Brands
                </span>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {REPRESENTED_BRANDS.map((brand) => (
                  <span
                    key={brand}
                    className="px-3.5 py-2 rounded-control bg-white/10 border border-white/15 text-xs sm:text-sm font-bold text-white"
                  >
                    {brand}
                  </span>
                ))}
              </div>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* General Training Enquiry Form */}
      <section id="training-enquiry-form" className="py-16 sm:py-20 bg-white scroll-mt-20">
        <div className="sudabelt-container max-w-4xl">
          <HeaderTextReveal className="mb-8">
            <div className="w-6 h-0.75 bg-sudabelt-red rounded-mark mb-3" />
            <span className="text-eyebrow text-sudabelt-green">REQUEST A SESSION</span>
            <h2 className="text-section-heading text-sudabelt-navy mt-2">
              Training Enquiry Form
            </h2>
            <p className="text-sm sm:text-base text-sudabelt-body mt-2">
              Complete the form below and our Clinical Applications &amp; Biomedical Training desk
              will schedule a tailored programme for your facility.
            </p>
          </HeaderTextReveal>

          {submittedRef ? (
            <div className="rounded-card border border-sudabelt-green/30 bg-sudabelt-green-tint/40 p-8 sm:p-10 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-sudabelt-green text-white flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-extrabold text-sudabelt-navy">
                Training Enquiry Received
              </h3>
              <p className="text-sm text-sudabelt-body max-w-md mx-auto">
                Thank you, <strong>{fullName}</strong>. Reference ID:{' '}
                <span className="font-mono font-bold text-sudabelt-navy">{submittedRef}</span>. Our
                training coordinators at{' '}
                <span className="font-semibold">contact@sudabelt.com</span> will get back to you
                shortly.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSubmittedRef(null)
                  setFullName('')
                  setOrganization('')
                  setJobTitle('')
                  setEmail('')
                  setPhone('')
                  setSelectedBrands([])
                  setParticipants('')
                  setLocation('')
                  setTimeframe('')
                  setNotes('')
                }}
                className="px-6 py-2.5 rounded-control bg-sudabelt-navy hover:bg-sudabelt-green text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                Submit Another Enquiry
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              noValidate
              className="rounded-card border border-sudabelt-border bg-white p-6 sm:p-8 lg:p-10 shadow-xs space-y-6"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-sudabelt-navy mb-1.5">
                    Full Name <span className="text-sudabelt-red">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Dr. Amina Bello"
                    className="w-full px-3.5 py-2.5 rounded-control border border-sudabelt-border text-sm text-sudabelt-navy focus:outline-hidden focus:border-sudabelt-green"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-sudabelt-navy mb-1.5">
                    Organization / Hospital / Facility Name <span className="text-sudabelt-red">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    placeholder="e.g. Lagos University Teaching Hospital"
                    className="w-full px-3.5 py-2.5 rounded-control border border-sudabelt-border text-sm text-sudabelt-navy focus:outline-hidden focus:border-sudabelt-green"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-sudabelt-navy mb-1.5">
                    Job Title / Role <span className="text-sudabelt-red">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="e.g. Head of Biomedical Engineering"
                    className="w-full px-3.5 py-2.5 rounded-control border border-sudabelt-border text-sm text-sudabelt-navy focus:outline-hidden focus:border-sudabelt-green"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-sudabelt-navy mb-1.5">
                    Email Address <span className="text-sudabelt-red">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@hospital.org"
                    className="w-full px-3.5 py-2.5 rounded-control border border-sudabelt-border text-sm text-sudabelt-navy focus:outline-hidden focus:border-sudabelt-green"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-sudabelt-navy mb-1.5">
                    Phone Number <span className="text-sudabelt-red">*</span>
                  </label>
                  <input
                    type="tel"
                    inputMode="numeric"
                    required
                    value={phone}
                    onChange={(e) => {
                      const cleaned = e.target.value.replace(/[^0-9+]/g, '')
                      const normalized = cleaned.startsWith('+')
                        ? '+' + cleaned.slice(1).replace(/\+/g, '')
                        : cleaned.replace(/\+/g, '')
                      setPhone(normalized)
                    }}
                    placeholder="+234..."
                    className="w-full px-3.5 py-2.5 rounded-control border border-sudabelt-border text-sm text-sudabelt-navy focus:outline-hidden focus:border-sudabelt-green"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-sudabelt-navy mb-1.5">
                    Number of Participants <span className="text-sudabelt-red">*</span>
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={participants}
                    onChange={(e) => setParticipants(e.target.value)}
                    placeholder="e.g. 12"
                    className="w-full px-3.5 py-2.5 rounded-control border border-sudabelt-border text-sm text-sudabelt-navy focus:outline-hidden focus:border-sudabelt-green"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-sudabelt-navy mb-1.5">
                    Location <span className="text-sudabelt-red">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Victoria Island, Lagos"
                    className="w-full px-3.5 py-2.5 rounded-control border border-sudabelt-border text-sm text-sudabelt-navy focus:outline-hidden focus:border-sudabelt-green"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-sudabelt-navy mb-1.5">
                    Expected Timeframe <span className="text-sudabelt-red">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={timeframe}
                    onChange={(e) => setTimeframe(e.target.value)}
                    placeholder="Preferred month or target dates"
                    className="w-full px-3.5 py-2.5 rounded-control border border-sudabelt-border text-sm text-sudabelt-navy focus:outline-hidden focus:border-sudabelt-green"
                  />
                </div>
              </div>

              {/* Type of Training */}
              <div>
                <label className="block text-xs font-bold text-sudabelt-navy mb-2">
                  Type of Training <span className="text-sudabelt-red">*</span>
                </label>
                <div className="space-y-2">
                  {TRAINING_TYPES.map((typeOption) => (
                    <label
                      key={typeOption}
                      className={`flex items-center gap-3 p-3 rounded-control border cursor-pointer transition-colors ${
                        trainingType === typeOption
                          ? 'border-sudabelt-green bg-sudabelt-green-tint/40'
                          : 'border-sudabelt-border hover:border-sudabelt-navy/40'
                      }`}
                    >
                      <input
                        type="radio"
                        name="trainingType"
                        value={typeOption}
                        checked={trainingType === typeOption}
                        onChange={() => setTrainingType(typeOption)}
                        className="accent-sudabelt-green"
                      />
                      <span className="text-xs sm:text-sm font-semibold text-sudabelt-navy">
                        {typeOption}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Brand / Equipment of Interest (Multi-select) */}
              <div>
                <label className="block text-xs font-bold text-sudabelt-navy mb-2">
                  Brand / Equipment of Interest <span className="text-sudabelt-red">*</span>{' '}
                  <span className="font-normal text-sudabelt-muted">(Select all that apply)</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {BRAND_OPTIONS.map((brand) => {
                    const active = selectedBrands.includes(brand)
                    return (
                      <button
                        key={brand}
                        type="button"
                        onClick={() => toggleBrand(brand)}
                        className={`px-3.5 py-2 rounded-control text-xs font-bold border transition-colors cursor-pointer ${
                          active
                            ? 'bg-sudabelt-green border-sudabelt-green text-white'
                            : 'bg-white border-sudabelt-border text-sudabelt-navy hover:border-sudabelt-green'
                        }`}
                      >
                        {brand}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Additional Notes (Optional) */}
              <div>
                <label className="block text-xs font-bold text-sudabelt-navy mb-1.5">
                  Additional Notes <span className="text-sudabelt-muted font-normal">(Optional)</span>
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Specify equipment models, department focus, or special requirements..."
                  className="w-full px-3.5 py-2.5 rounded-control border border-sudabelt-border text-sm text-sudabelt-navy focus:outline-hidden focus:border-sudabelt-green"
                />
              </div>

              <FormCaptcha onVerifyChange={setCaptchaVerified} />

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center gap-2 h-12 px-8 rounded-control bg-sudabelt-blue hover:bg-sudabelt-green text-white text-xs font-extrabold uppercase tracking-wider transition-colors cursor-pointer disabled:opacity-60 shadow-xs"
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{isSubmitting ? 'Submitting Enquiry...' : 'Submit Training Enquiry'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </section>
    </>
  )
}

export default TrainingEnquirySection
