import React, { useState, useEffect } from 'react'
import { X, CheckCircle2, MessageCircle } from 'lucide-react'
import { toast } from 'react-toastify'
import { api } from '../../api/api'

interface TrainingBookingModalProps {
  isOpen: boolean
  onClose: () => void
  selectedTrack?: string
}

interface FormState {
  institutionName: string
  courseTrack: string
  numberOfTrainees: string
  targetHospitalState: string
  contactName: string
  contactRole: string
  email: string
  phone: string
  preferredDates: string
  notes: string
}

const STORAGE_KEY = 'sudabelt_training_booking_draft'

const TRACK_OPTIONS = [
  'Renal Nurses',
  'Hematology & Apheresis Scientists',
  'Critical Care Staff',
  'In-House Biomedical Engineers',
  'Comprehensive Multi-Disciplinary Batch',
]

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
  'Other State',
]

const TrainingBookingModal: React.FC<TrainingBookingModalProps> = ({
  isOpen,
  onClose,
  selectedTrack,
}) => {
  const [formData, setFormData] = useState<FormState>(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY)
      if (saved) return JSON.parse(saved)
    } catch {
      // Ignore
    }
    return {
      institutionName: '',
      courseTrack: selectedTrack || 'Renal Nurses',
      numberOfTrainees: '5',
      targetHospitalState: 'Lagos',
      contactName: '',
      contactRole: '',
      email: '',
      phone: '',
      preferredDates: '',
      notes: '',
    }
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submissionResult, setSubmissionResult] = useState<{
    referenceId: string
    whatsappUrl?: string
  } | null>(null)

  useEffect(() => {
    if (selectedTrack) {
      setFormData((prev) => ({ ...prev, courseTrack: selectedTrack }))
    }
  }, [selectedTrack])

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(formData))
    } catch {
      // Ignore
    }
  }, [formData])

  if (!isOpen) return null

  const validate = (): boolean => {
    const errs: Record<string, string> = {}
    if (!formData.institutionName.trim()) errs.institutionName = 'Hospital / Institution name is required'
    if (!formData.contactName.trim()) errs.contactName = 'Contact name is required'
    if (!formData.contactRole.trim()) errs.contactRole = 'Role / Designation is required'
    if (!formData.email.trim() || !formData.email.includes('@')) errs.email = 'Valid work email is required'
    if (!formData.phone.trim() || formData.phone.length < 7) errs.phone = 'Valid phone number is required'
    if (!formData.numberOfTrainees || Number(formData.numberOfTrainees) < 1) {
      errs.numberOfTrainees = 'At least 1 trainee required'
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) {
      toast.error('Please correct the highlighted fields in red.')
      return
    }

    setIsSubmitting(true)
    try {
      const res = await api.submitTrainingBooking({
        institutionName: formData.institutionName.trim(),
        courseTrack: formData.courseTrack,
        numberOfTrainees: Number(formData.numberOfTrainees),
        targetHospitalState: formData.targetHospitalState,
        contactName: formData.contactName.trim(),
        contactRole: formData.contactRole.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        preferredDates: formData.preferredDates.trim() || undefined,
        notes: formData.notes.trim() || undefined,
      })

      setSubmissionResult({
        referenceId: res.registrationId,
        whatsappUrl: res.whatsappUrl,
      })
      sessionStorage.removeItem(STORAGE_KEY)
      toast.success('Training booking request submitted successfully!')
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to submit training booking.'
      toast.error(msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full max-h-[92vh] overflow-y-auto shadow-2xl p-6 sm:p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-sudabelt-muted hover:text-sudabelt-navy hover:bg-slate-100 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {submissionResult ? (
          <div className="text-center py-8">
            <CheckCircle2 className="w-16 h-16 text-sudabelt-green mx-auto mb-4" />
            <span className="text-[11px] font-bold tracking-widest text-sudabelt-green uppercase">
              CONFIRMATION RECEIVED
            </span>
            <h3 className="text-2xl font-extrabold text-sudabelt-navy mt-1 mb-3">
              Institutional Training Reserved
            </h3>
            <p className="text-sm text-sudabelt-muted max-w-md mx-auto mb-6">
              Thank you. Our Clinical Training Coordinator has received your booking for{' '}
              <strong>{formData.institutionName}</strong> under Reference ID:{' '}
              <span className="font-mono font-bold text-sudabelt-navy">{submissionResult.referenceId}</span>.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {submissionResult.whatsappUrl && (
                <a
                  href={submissionResult.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-11 px-6 rounded-control bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold uppercase tracking-wider inline-flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  Chat with Training Desk
                </a>
              )}
              <button
                type="button"
                onClick={onClose}
                className="h-11 px-6 rounded-control bg-sudabelt-navy text-white text-xs font-bold uppercase tracking-wider"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <span className="text-[11px] font-bold tracking-[0.14em] uppercase text-sudabelt-green block mb-1">
                INSTITUTIONAL ENROLLMENT
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-sudabelt-navy tracking-tight">
                Book Clinical / Biomedical Training
              </h3>
              <p className="text-xs text-sudabelt-muted mt-1">
                On-site hospital ward delivery by OEM-certified application specialists.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-sudabelt-navy mb-1">
                  Hospital or Health Institution Name *
                </label>
                <input
                  type="text"
                  value={formData.institutionName}
                  onChange={(e) => setFormData({ ...formData, institutionName: e.target.value })}
                  placeholder="e.g. Asokoro District Hospital"
                  className={`w-full p-2.5 rounded-xl border ${
                    errors.institutionName ? 'border-sudabelt-red bg-red-50/30' : 'border-sudabelt-border'
                  }`}
                />
                {errors.institutionName && (
                  <p className="text-sudabelt-red text-[11px] font-semibold mt-1">{errors.institutionName}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-sudabelt-navy mb-1">Course Track *</label>
                  <select
                    value={formData.courseTrack}
                    onChange={(e) => setFormData({ ...formData, courseTrack: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-sudabelt-border bg-white"
                  >
                    {TRACK_OPTIONS.map((track) => (
                      <option key={track} value={track}>
                        {track}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-sudabelt-navy mb-1">Number of Trainees *</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={formData.numberOfTrainees}
                    onChange={(e) => setFormData({ ...formData, numberOfTrainees: e.target.value })}
                    className={`w-full p-2.5 rounded-xl border ${
                      errors.numberOfTrainees ? 'border-sudabelt-red bg-red-50/30' : 'border-sudabelt-border'
                    }`}
                  />
                  {errors.numberOfTrainees && (
                    <p className="text-sudabelt-red text-[11px] font-semibold mt-1">{errors.numberOfTrainees}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-sudabelt-navy mb-1">Target Hospital State *</label>
                  <select
                    value={formData.targetHospitalState}
                    onChange={(e) => setFormData({ ...formData, targetHospitalState: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-sudabelt-border bg-white"
                  >
                    {NIGERIAN_STATES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-sudabelt-navy mb-1">Preferred Timeline</label>
                  <input
                    type="text"
                    value={formData.preferredDates}
                    onChange={(e) => setFormData({ ...formData, preferredDates: e.target.value })}
                    placeholder="e.g. Next month / Upon machine arrival"
                    className="w-full p-2.5 rounded-xl border border-sudabelt-border"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-sudabelt-navy mb-1">Coordinator / Contact Name *</label>
                  <input
                    type="text"
                    value={formData.contactName}
                    onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                    placeholder="e.g. Dr. Emeka Okafor"
                    className={`w-full p-2.5 rounded-xl border ${
                      errors.contactName ? 'border-sudabelt-red bg-red-50/30' : 'border-sudabelt-border'
                    }`}
                  />
                  {errors.contactName && (
                    <p className="text-sudabelt-red text-[11px] font-semibold mt-1">{errors.contactName}</p>
                  )}
                </div>

                <div>
                  <label className="block font-bold text-sudabelt-navy mb-1">Role / Designation *</label>
                  <input
                    type="text"
                    value={formData.contactRole}
                    onChange={(e) => setFormData({ ...formData, contactRole: e.target.value })}
                    placeholder="e.g. Chief Medical Director / Matron"
                    className={`w-full p-2.5 rounded-xl border ${
                      errors.contactRole ? 'border-sudabelt-red bg-red-50/30' : 'border-sudabelt-border'
                    }`}
                  />
                  {errors.contactRole && (
                    <p className="text-sudabelt-red text-[11px] font-semibold mt-1">{errors.contactRole}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-sudabelt-navy mb-1">Work Email Address *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. e.okafor@hospital.gov.ng"
                    className={`w-full p-2.5 rounded-xl border ${
                      errors.email ? 'border-sudabelt-red bg-red-50/30' : 'border-sudabelt-border'
                    }`}
                  />
                  {errors.email && (
                    <p className="text-sudabelt-red text-[11px] font-semibold mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block font-bold text-sudabelt-navy mb-1">Telephone / WhatsApp *</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. +234 803 123 4567"
                    className={`w-full p-2.5 rounded-xl border ${
                      errors.phone ? 'border-sudabelt-red bg-red-50/30' : 'border-sudabelt-border'
                    }`}
                  />
                  {errors.phone && (
                    <p className="text-sudabelt-red text-[11px] font-semibold mt-1">{errors.phone}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block font-bold text-sudabelt-navy mb-1">Additional Notes</label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Specific equipment model installed or clinical focus areas..."
                  className="w-full p-2.5 rounded-xl border border-sudabelt-border"
                />
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-sudabelt-border">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-control border border-sudabelt-border text-sudabelt-navy font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-control bg-sudabelt-blue hover:bg-sudabelt-navy text-white font-bold uppercase tracking-wider transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Booking Request'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}

export default TrainingBookingModal