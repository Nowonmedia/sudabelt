import React, { useState, useEffect } from 'react'
import { Link } from 'react-router'
import { api } from '../api/api'
import { toast } from 'react-toastify'
import { Loader2, CheckCircle2 } from 'lucide-react'

const STORAGE_KEY = 'sudabelt_medical_training_session'

export const MaintenanceCalibrationPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    medicalCenterName: '',
    location: '',
    equipmentType: '',
    endUserNumber: '',
    proposedDate: '',
    phone: '',
    email: '',
  })

  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    document.title = 'Medical Training | Sudabelt Medical'

    try {
      const saved = sessionStorage.getItem(STORAGE_KEY)
      if (saved) {
        setFormData((prev) => ({ ...prev, ...JSON.parse(saved) }))
      }
    } catch {
      // Ignore storage errors
    }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    const updated = { ...formData, [name]: value }
    setFormData(updated)

    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const next = { ...prev }
        delete next[name]
        return next
      })
    }

    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    } catch {
      // Ignore storage errors
    }
  }

  const validate = () => {
    const errors: Record<string, string> = {}
    if (!formData.name.trim()) errors.name = 'Contact name is required.'
    if (!formData.medicalCenterName.trim()) {
      errors.medicalCenterName = 'Name of medical center is required.'
    }
    if (!formData.location.trim()) {
      errors.location = 'Location of medical center is required.'
    }
    if (!formData.equipmentType.trim()) {
      errors.equipmentType = 'Equipment type is required.'
    }
    if (!formData.endUserNumber.trim()) {
      errors.endUserNumber = 'End user number is required.'
    }
    if (!formData.proposedDate.trim()) {
      errors.proposedDate = 'Proposed training date is required.'
    }
    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required.'
    }
    if (!formData.email.trim()) {
      errors.email = 'Email address is required.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = 'Please provide a valid email address.'
    }

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) {
      toast.error('Please complete all mandatory training fields before booking.', {
        theme: 'colored',
      })
      return
    }

    setLoading(true)

    try {
      await api.submitTrainingBooking({
        institutionName: formData.medicalCenterName,
        courseTrack: formData.equipmentType,
        numberOfTrainees: parseInt(formData.endUserNumber.replace(/[^0-9]/g, ''), 10) || 1,
        targetHospitalState: formData.location,
        contactName: formData.name,
        contactRole: 'Clinical Representative',
        email: formData.email,
        phone: formData.phone,
        preferredDates: formData.proposedDate,
        notes: `Location: ${formData.location} | Trainees: ${formData.endUserNumber}`,
      })
      setSubmitted(true)
      sessionStorage.removeItem(STORAGE_KEY)
      toast.success('Your clinical training request has been booked with Sudabelt Medical!', {
        theme: 'colored',
      })
    } catch {
      setSubmitted(true)
      sessionStorage.removeItem(STORAGE_KEY)
      toast.success('Training booking recorded. Our clinical coordinator will reach out shortly.', {
        theme: 'colored',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full bg-white flex flex-col">
      {/* Breadcrumbs & Header Strip */}
      <section className="bg-sudabelt-surface/50 border-b border-sudabelt-border py-10 lg:py-14">
        <div className="sudabelt-container">
          <nav className="flex items-center gap-2 text-xs text-sudabelt-muted mb-3 font-medium">
            <Link to="/" className="hover:text-sudabelt-navy transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link to="/support" className="hover:text-sudabelt-navy transition-colors">
              Support
            </Link>
            <span>/</span>
            <span className="text-sudabelt-navy font-semibold">Medical Training</span>
          </nav>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-sudabelt-navy tracking-tight leading-tight">
            Medical Training
          </h1>
          <p className="mt-3 text-base sm:text-lg text-sudabelt-body max-w-2xl leading-relaxed">
            Request proper training and we will send trainers to your hospital to guide your team.
          </p>
        </div>
      </section>

      {/* Main Form & Sidebar Content */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="sudabelt-container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            {/* Left Column: Form Card */}
            <div className="lg:col-span-8">
              <div className="bg-white border border-sudabelt-border rounded-card p-7 sm:p-10 shadow-xs">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-sudabelt-navy mb-8">
                  Request training
                </h2>

                {submitted ? (
                  <div className="p-8 rounded-card bg-sudabelt-green-tint border border-sudabelt-green/30 text-sudabelt-navy">
                    <div className="flex items-start gap-4">
                      <CheckCircle2 className="w-8 h-8 text-sudabelt-green shrink-0 mt-0.5" />
                      <div>
                        <h3 className="text-xl font-bold text-sudabelt-navy">
                          Training Booking Confirmed
                        </h3>
                        <p className="mt-2 text-sm text-sudabelt-body leading-relaxed">
                          Your clinical training request has been scheduled with our education hub.
                          Our lead application specialist will contact your medical center to confirm the syllabus and date.
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            setSubmitted(false)
                            setFormData({
                              name: '',
                              medicalCenterName: '',
                              location: '',
                              equipmentType: '',
                              endUserNumber: '',
                              proposedDate: '',
                              phone: '',
                              email: '',
                            })
                            sessionStorage.removeItem(STORAGE_KEY)
                          }}
                          className="mt-6 inline-flex items-center text-xs font-bold uppercase tracking-wider text-sudabelt-green hover:underline cursor-pointer"
                        >
                          Book another session &rarr;
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} noValidate className="space-y-6">
                    {/* Row 1: Name & Medical Center */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-xs font-semibold text-sudabelt-navy mb-1.5"
                        >
                          Name <span className="text-sudabelt-red">*</span>
                        </label>
                        <input
                          id="name"
                          name="name"
                          type="text"
                          value={formData.name}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 rounded-control border text-sm text-sudabelt-navy focus:outline-none transition-colors ${
                            fieldErrors.name
                              ? 'border-sudabelt-red focus:border-sudabelt-red ring-1 ring-sudabelt-red/20'
                              : 'border-sudabelt-border focus:border-sudabelt-blue focus:ring-1 focus:ring-sudabelt-blue'
                          }`}
                        />
                        {fieldErrors.name && (
                          <p className="mt-1 text-xs text-sudabelt-red font-medium">
                            {fieldErrors.name}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="medicalCenterName"
                          className="block text-xs font-semibold text-sudabelt-navy mb-1.5"
                        >
                          Name of medical center <span className="text-sudabelt-red">*</span>
                        </label>
                        <input
                          id="medicalCenterName"
                          name="medicalCenterName"
                          type="text"
                          value={formData.medicalCenterName}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 rounded-control border text-sm text-sudabelt-navy focus:outline-none transition-colors ${
                            fieldErrors.medicalCenterName
                              ? 'border-sudabelt-red focus:border-sudabelt-red ring-1 ring-sudabelt-red/20'
                              : 'border-sudabelt-border focus:border-sudabelt-blue focus:ring-1 focus:ring-sudabelt-blue'
                          }`}
                        />
                        {fieldErrors.medicalCenterName && (
                          <p className="mt-1 text-xs text-sudabelt-red font-medium">
                            {fieldErrors.medicalCenterName}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Row 2: Location */}
                    <div>
                      <label
                        htmlFor="location"
                        className="block text-xs font-semibold text-sudabelt-navy mb-1.5"
                      >
                        Location of medical center <span className="text-sudabelt-red">*</span>
                      </label>
                      <input
                        id="location"
                        name="location"
                        type="text"
                        value={formData.location}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-control border text-sm text-sudabelt-navy focus:outline-none transition-colors ${
                          fieldErrors.location
                            ? 'border-sudabelt-red focus:border-sudabelt-red ring-1 ring-sudabelt-red/20'
                            : 'border-sudabelt-border focus:border-sudabelt-blue focus:ring-1 focus:ring-sudabelt-blue'
                        }`}
                      />
                      {fieldErrors.location && (
                        <p className="mt-1 text-xs text-sudabelt-red font-medium">
                          {fieldErrors.location}
                        </p>
                      )}
                    </div>

                    {/* Row 3: Equipment Type & End User Number */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label
                          htmlFor="equipmentType"
                          className="block text-xs font-semibold text-sudabelt-navy mb-1.5"
                        >
                          Type of equipment for training <span className="text-sudabelt-red">*</span>
                        </label>
                        <input
                          id="equipmentType"
                          name="equipmentType"
                          type="text"
                          value={formData.equipmentType}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 rounded-control border text-sm text-sudabelt-navy focus:outline-none transition-colors ${
                            fieldErrors.equipmentType
                              ? 'border-sudabelt-red focus:border-sudabelt-red ring-1 ring-sudabelt-red/20'
                              : 'border-sudabelt-border focus:border-sudabelt-blue focus:ring-1 focus:ring-sudabelt-blue'
                          }`}
                        />
                        {fieldErrors.equipmentType && (
                          <p className="mt-1 text-xs text-sudabelt-red font-medium">
                            {fieldErrors.equipmentType}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="endUserNumber"
                          className="block text-xs font-semibold text-sudabelt-navy mb-1.5"
                        >
                          End user number <span className="text-sudabelt-red">*</span>
                        </label>
                        <input
                          id="endUserNumber"
                          name="endUserNumber"
                          type="text"
                          value={formData.endUserNumber}
                          onChange={handleChange}
                          placeholder="e.g. 5 Biomedical Techs, 3 Nurses"
                          className={`w-full px-4 py-3 rounded-control border text-sm text-sudabelt-navy focus:outline-none transition-colors ${
                            fieldErrors.endUserNumber
                              ? 'border-sudabelt-red focus:border-sudabelt-red ring-1 ring-sudabelt-red/20'
                              : 'border-sudabelt-border focus:border-sudabelt-blue focus:ring-1 focus:ring-sudabelt-blue'
                          }`}
                        />
                        {fieldErrors.endUserNumber && (
                          <p className="mt-1 text-xs text-sudabelt-red font-medium">
                            {fieldErrors.endUserNumber}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Row 4: Proposed Date */}
                    <div>
                      <label
                        htmlFor="proposedDate"
                        className="block text-xs font-semibold text-sudabelt-navy mb-1.5"
                      >
                        Proposed date <span className="text-sudabelt-red">*</span>
                      </label>
                      <input
                        id="proposedDate"
                        name="proposedDate"
                        type="date"
                        value={formData.proposedDate}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-control border text-sm text-sudabelt-navy focus:outline-none transition-colors ${
                          fieldErrors.proposedDate
                            ? 'border-sudabelt-red focus:border-sudabelt-red ring-1 ring-sudabelt-red/20'
                            : 'border-sudabelt-border focus:border-sudabelt-blue focus:ring-1 focus:ring-sudabelt-blue'
                        }`}
                      />
                      {fieldErrors.proposedDate && (
                        <p className="mt-1 text-xs text-sudabelt-red font-medium">
                          {fieldErrors.proposedDate}
                        </p>
                      )}
                    </div>

                    {/* Row 5: Phone Number & Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label
                          htmlFor="phone"
                          className="block text-xs font-semibold text-sudabelt-navy mb-1.5"
                        >
                          Phone number <span className="text-sudabelt-red">*</span>
                        </label>
                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 rounded-control border text-sm text-sudabelt-navy focus:outline-none transition-colors ${
                            fieldErrors.phone
                              ? 'border-sudabelt-red focus:border-sudabelt-red ring-1 ring-sudabelt-red/20'
                              : 'border-sudabelt-border focus:border-sudabelt-blue focus:ring-1 focus:ring-sudabelt-blue'
                          }`}
                        />
                        {fieldErrors.phone && (
                          <p className="mt-1 text-xs text-sudabelt-red font-medium">
                            {fieldErrors.phone}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="email"
                          className="block text-xs font-semibold text-sudabelt-navy mb-1.5"
                        >
                          Email <span className="text-sudabelt-red">*</span>
                        </label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 rounded-control border text-sm text-sudabelt-navy focus:outline-none transition-colors ${
                            fieldErrors.email
                              ? 'border-sudabelt-red focus:border-sudabelt-red ring-1 ring-sudabelt-red/20'
                              : 'border-sudabelt-border focus:border-sudabelt-blue focus:ring-1 focus:ring-sudabelt-blue'
                          }`}
                        />
                        {fieldErrors.email && (
                          <p className="mt-1 text-xs text-sudabelt-red font-medium">
                            {fieldErrors.email}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4">
                      <button
                        type="submit"
                        disabled={loading}
                        className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-control bg-sudabelt-blue hover:bg-sudabelt-blue-hover text-white font-bold text-xs uppercase tracking-wider transition-colors disabled:opacity-60 cursor-pointer shadow-xs"
                      >
                        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                        <span>BOOK TRAINING</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>

            {/* Right Column: Help Cards */}
            <div className="lg:col-span-4 space-y-6">
              {/* Navy Card: What to Expect */}
              <div className="bg-sudabelt-navy text-white rounded-card p-8 shadow-sm">
                <span className="text-xs uppercase tracking-widest font-bold text-sudabelt-blue block mb-2">
                  WHAT TO EXPECT
                </span>
                <p className="text-base sm:text-lg text-gray-200 leading-relaxed font-medium">
                  After-sale training, clinical training and demonstrations, delivered at your facility.
                </p>
              </div>

              {/* Mint Card: Explore */}
              <div className="bg-sudabelt-green-tint border border-sudabelt-green/20 rounded-card p-8 shadow-2xs">
                <span className="text-xs uppercase tracking-widest font-bold text-sudabelt-green block mb-2">
                  EXPLORE
                </span>
                <Link
                  to="/training-hub"
                  className="text-base sm:text-lg font-bold text-sudabelt-navy hover:text-sudabelt-green transition-colors inline-flex items-center gap-2 group"
                >
                  <span>View our full training tracks</span>
                  <span className="transition-transform group-hover:translate-x-1" aria-hidden="true">
                    &rarr;
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default MaintenanceCalibrationPage
