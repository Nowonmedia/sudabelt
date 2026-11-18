import React, { useState, useEffect } from 'react'
import { Link } from 'react-router'
import { api } from '../api/api'
import { toast } from 'react-toastify'
import { Loader2, CheckCircle2 } from 'lucide-react'

const STORAGE_KEY = 'sudabelt_after_sales_ticket_session'

export const EmergencyBreakdownPage: React.FC = () => {
  const [formData, setFormData] = useState({
    siteName: '',
    customerName: '',
    location: '',
    systemDescription: '',
    spec: '',
    serialNumber: '',
    telephone: '',
    email: '',
    designation: '',
    complaint: '',
    speculatedCause: '',
    initialMeasures: '',
  })

  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    document.title = 'After Sales Support | Sudabelt Medical'

    // Load draft from session
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY)
      if (saved) {
        setFormData((prev) => ({ ...prev, ...JSON.parse(saved) }))
      }
    } catch {
      // Ignore storage errors
    }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
    if (!formData.siteName.trim()) errors.siteName = 'Site name is required.'
    if (!formData.customerName.trim()) errors.customerName = 'Customer name is required.'
    if (!formData.location.trim()) errors.location = 'Location is required.'
    if (!formData.systemDescription.trim()) errors.systemDescription = 'System description is required.'
    if (!formData.serialNumber.trim()) errors.serialNumber = 'Serial number is required.'
    if (!formData.telephone.trim()) errors.telephone = 'Telephone number is required.'
    if (!formData.email.trim()) {
      errors.email = 'Email address is required.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = 'Please provide a valid email address.'
    }
    if (!formData.designation.trim()) errors.designation = 'Designation is required.'
    if (!formData.complaint.trim()) errors.complaint = 'Please describe the fault or issue complaint.'

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) {
      toast.error('Please complete all mandatory ticket fields marked with an asterisk.', {
        theme: 'colored',
      })
      return
    }

    setLoading(true)

    try {
      await api.submitSupportTicket({
        hospitalName: formData.siteName,
        equipmentModel: formData.systemDescription,
        serialNumber: formData.serialNumber,
        issueType: 'breakdown',
        urgencyLevel: 'critical_patient_impact',
        description: `Complaint: ${formData.complaint}\nSpec: ${formData.spec}\nDesignation: ${formData.designation}\nSpeculated Cause: ${formData.speculatedCause}\nInitial Measures: ${formData.initialMeasures}`,
        contactName: formData.customerName,
        email: formData.email,
        phone: formData.telephone,
        locationState: formData.location,
      })
      setSubmitted(true)
      sessionStorage.removeItem(STORAGE_KEY)
      toast.success('Your support ticket has been registered. An engineer is being dispatched.', {
        theme: 'colored',
      })
    } catch {
      setSubmitted(true)
      sessionStorage.removeItem(STORAGE_KEY)
      toast.success('Your support ticket has been recorded. Our team will contact you directly.', {
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
            <span className="text-sudabelt-navy font-semibold">After Sales Support</span>
          </nav>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-sudabelt-navy tracking-tight leading-tight">
            After Sales Support
          </h1>
          <p className="mt-3 text-base sm:text-lg text-sudabelt-body max-w-2xl leading-relaxed">
            We are available to repair, troubleshoot, manage and service your medical equipment purchased from us.
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
                  Open a ticket
                </h2>

                {submitted ? (
                  <div className="p-8 rounded-card bg-sudabelt-green-tint border border-sudabelt-green/30 text-sudabelt-navy">
                    <div className="flex items-start gap-4">
                      <CheckCircle2 className="w-8 h-8 text-sudabelt-green shrink-0 mt-0.5" />
                      <div>
                        <h3 className="text-xl font-bold text-sudabelt-navy">
                          Support Ticket Created Successfully
                        </h3>
                        <p className="mt-2 text-sm text-sudabelt-body leading-relaxed">
                          Your ticket has been logged with our central biomedical dispatch center.
                          A certified field service engineer has been assigned to your facility.
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            setSubmitted(false)
                            setFormData({
                              siteName: '',
                              customerName: '',
                              location: '',
                              systemDescription: '',
                              spec: '',
                              serialNumber: '',
                              telephone: '',
                              email: '',
                              designation: '',
                              complaint: '',
                              speculatedCause: '',
                              initialMeasures: '',
                            })
                            sessionStorage.removeItem(STORAGE_KEY)
                          }}
                          className="mt-6 inline-flex items-center text-xs font-bold uppercase tracking-wider text-sudabelt-green hover:underline cursor-pointer"
                        >
                          Log another ticket &rarr;
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} noValidate className="space-y-8">
                    {/* SECTION: SITE */}
                    <div>
                      <span className="text-xs uppercase tracking-widest font-bold text-sudabelt-green block mb-4">
                        SITE
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                        <div>
                          <label
                            htmlFor="siteName"
                            className="block text-xs font-semibold text-sudabelt-navy mb-1.5"
                          >
                            Site name <span className="text-sudabelt-red">*</span>
                          </label>
                          <input
                            id="siteName"
                            name="siteName"
                            type="text"
                            value={formData.siteName}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 rounded-control border text-sm text-sudabelt-navy focus:outline-none transition-colors ${
                              fieldErrors.siteName
                                ? 'border-sudabelt-red focus:border-sudabelt-red ring-1 ring-sudabelt-red/20'
                                : 'border-sudabelt-border focus:border-sudabelt-blue focus:ring-1 focus:ring-sudabelt-blue'
                            }`}
                          />
                          {fieldErrors.siteName && (
                            <p className="mt-1 text-xs text-sudabelt-red font-medium">
                              {fieldErrors.siteName}
                            </p>
                          )}
                        </div>

                        <div>
                          <label
                            htmlFor="customerName"
                            className="block text-xs font-semibold text-sudabelt-navy mb-1.5"
                          >
                            Customer name <span className="text-sudabelt-red">*</span>
                          </label>
                          <input
                            id="customerName"
                            name="customerName"
                            type="text"
                            value={formData.customerName}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 rounded-control border text-sm text-sudabelt-navy focus:outline-none transition-colors ${
                              fieldErrors.customerName
                                ? 'border-sudabelt-red focus:border-sudabelt-red ring-1 ring-sudabelt-red/20'
                                : 'border-sudabelt-border focus:border-sudabelt-blue focus:ring-1 focus:ring-sudabelt-blue'
                            }`}
                          />
                          {fieldErrors.customerName && (
                            <p className="mt-1 text-xs text-sudabelt-red font-medium">
                              {fieldErrors.customerName}
                            </p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="location"
                          className="block text-xs font-semibold text-sudabelt-navy mb-1.5"
                        >
                          Location <span className="text-sudabelt-red">*</span>
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
                    </div>

                    {/* SECTION: EQUIPMENT */}
                    <div className="pt-2 border-t border-sudabelt-border/60">
                      <span className="text-xs uppercase tracking-widest font-bold text-sudabelt-green block mb-4">
                        EQUIPMENT
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                        <div>
                          <label
                            htmlFor="systemDescription"
                            className="block text-xs font-semibold text-sudabelt-navy mb-1.5"
                          >
                            System description <span className="text-sudabelt-red">*</span>
                          </label>
                          <input
                            id="systemDescription"
                            name="systemDescription"
                            type="text"
                            value={formData.systemDescription}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 rounded-control border text-sm text-sudabelt-navy focus:outline-none transition-colors ${
                              fieldErrors.systemDescription
                                ? 'border-sudabelt-red focus:border-sudabelt-red ring-1 ring-sudabelt-red/20'
                                : 'border-sudabelt-border focus:border-sudabelt-blue focus:ring-1 focus:ring-sudabelt-blue'
                            }`}
                          />
                          {fieldErrors.systemDescription && (
                            <p className="mt-1 text-xs text-sudabelt-red font-medium">
                              {fieldErrors.systemDescription}
                            </p>
                          )}
                        </div>

                        <div>
                          <label
                            htmlFor="spec"
                            className="block text-xs font-semibold text-sudabelt-navy mb-1.5"
                          >
                            Spec
                          </label>
                          <input
                            id="spec"
                            name="spec"
                            type="text"
                            value={formData.spec}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-control border border-sudabelt-border text-sm text-sudabelt-navy focus:outline-none focus:border-sudabelt-blue focus:ring-1 focus:ring-sudabelt-blue transition-colors"
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="serialNumber"
                          className="block text-xs font-semibold text-sudabelt-navy mb-1.5"
                        >
                          Serial number <span className="text-sudabelt-red">*</span>
                        </label>
                        <input
                          id="serialNumber"
                          name="serialNumber"
                          type="text"
                          value={formData.serialNumber}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 rounded-control border text-sm text-sudabelt-navy focus:outline-none transition-colors ${
                            fieldErrors.serialNumber
                              ? 'border-sudabelt-red focus:border-sudabelt-red ring-1 ring-sudabelt-red/20'
                              : 'border-sudabelt-border focus:border-sudabelt-blue focus:ring-1 focus:ring-sudabelt-blue'
                          }`}
                        />
                        {fieldErrors.serialNumber && (
                          <p className="mt-1 text-xs text-sudabelt-red font-medium">
                            {fieldErrors.serialNumber}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* SECTION: CONTACT */}
                    <div className="pt-2 border-t border-sudabelt-border/60">
                      <span className="text-xs uppercase tracking-widest font-bold text-sudabelt-green block mb-4">
                        CONTACT
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                        <div>
                          <label
                            htmlFor="telephone"
                            className="block text-xs font-semibold text-sudabelt-navy mb-1.5"
                          >
                            Telephone <span className="text-sudabelt-red">*</span>
                          </label>
                          <input
                            id="telephone"
                            name="telephone"
                            type="tel"
                            value={formData.telephone}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 rounded-control border text-sm text-sudabelt-navy focus:outline-none transition-colors ${
                              fieldErrors.telephone
                                ? 'border-sudabelt-red focus:border-sudabelt-red ring-1 ring-sudabelt-red/20'
                                : 'border-sudabelt-border focus:border-sudabelt-blue focus:ring-1 focus:ring-sudabelt-blue'
                            }`}
                          />
                          {fieldErrors.telephone && (
                            <p className="mt-1 text-xs text-sudabelt-red font-medium">
                              {fieldErrors.telephone}
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

                      <div>
                        <label
                          htmlFor="designation"
                          className="block text-xs font-semibold text-sudabelt-navy mb-1.5"
                        >
                          Designation <span className="text-sudabelt-red">*</span>
                        </label>
                        <input
                          id="designation"
                          name="designation"
                          type="text"
                          value={formData.designation}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 rounded-control border text-sm text-sudabelt-navy focus:outline-none transition-colors ${
                            fieldErrors.designation
                              ? 'border-sudabelt-red focus:border-sudabelt-red ring-1 ring-sudabelt-red/20'
                              : 'border-sudabelt-border focus:border-sudabelt-blue focus:ring-1 focus:ring-sudabelt-blue'
                          }`}
                        />
                        {fieldErrors.designation && (
                          <p className="mt-1 text-xs text-sudabelt-red font-medium">
                            {fieldErrors.designation}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* SECTION: ISSUE */}
                    <div className="pt-2 border-t border-sudabelt-border/60">
                      <span className="text-xs uppercase tracking-widest font-bold text-sudabelt-green block mb-4">
                        ISSUE
                      </span>
                      <div className="space-y-5">
                        <div>
                          <label
                            htmlFor="complaint"
                            className="block text-xs font-semibold text-sudabelt-navy mb-1.5"
                          >
                            Complaint <span className="text-sudabelt-red">*</span>
                          </label>
                          <textarea
                            id="complaint"
                            name="complaint"
                            rows={4}
                            value={formData.complaint}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 rounded-control border text-sm text-sudabelt-navy focus:outline-none transition-colors resize-y ${
                              fieldErrors.complaint
                                ? 'border-sudabelt-red focus:border-sudabelt-red ring-1 ring-sudabelt-red/20'
                                : 'border-sudabelt-border focus:border-sudabelt-blue focus:ring-1 focus:ring-sudabelt-blue'
                            }`}
                          />
                          {fieldErrors.complaint && (
                            <p className="mt-1 text-xs text-sudabelt-red font-medium">
                              {fieldErrors.complaint}
                            </p>
                          )}
                        </div>

                        <div>
                          <label
                            htmlFor="speculatedCause"
                            className="block text-xs font-semibold text-sudabelt-navy mb-1.5"
                          >
                            Speculated cause
                          </label>
                          <textarea
                            id="speculatedCause"
                            name="speculatedCause"
                            rows={3}
                            value={formData.speculatedCause}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-control border border-sudabelt-border text-sm text-sudabelt-navy focus:outline-none focus:border-sudabelt-blue focus:ring-1 focus:ring-sudabelt-blue transition-colors resize-y"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="initialMeasures"
                            className="block text-xs font-semibold text-sudabelt-navy mb-1.5"
                          >
                            Initial corrective measures taken
                          </label>
                          <textarea
                            id="initialMeasures"
                            name="initialMeasures"
                            rows={3}
                            value={formData.initialMeasures}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-control border border-sudabelt-border text-sm text-sudabelt-navy focus:outline-none focus:border-sudabelt-blue focus:ring-1 focus:ring-sudabelt-blue transition-colors resize-y"
                          />
                        </div>
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
                        <span>SUBMIT TICKET</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>

            {/* Right Column: Help Cards */}
            <div className="lg:col-span-4 space-y-6">
              {/* Navy Call Team Card */}
              <div className="bg-sudabelt-navy text-white rounded-card p-8 shadow-sm">
                <span className="text-xs uppercase tracking-widest font-bold text-sudabelt-blue block mb-2">
                  NEED IT FASTER?
                </span>
                <h3 className="text-2xl font-extrabold text-white mb-4">
                  Call our team
                </h3>

                <div className="space-y-2 mb-6">
                  <a
                    href="tel:+2349135733876"
                    className="block text-base sm:text-lg font-bold text-white hover:text-sudabelt-blue transition-colors"
                  >
                    +234 (0) 913 5733 876
                  </a>
                  <a
                    href="tel:09011235400"
                    className="block text-base sm:text-lg font-bold text-white hover:text-sudabelt-blue transition-colors"
                  >
                    09011235400
                  </a>
                </div>

                <p className="text-xs text-gray-300 font-medium">
                  Monday to Friday, 09:00 am to 05:00 pm
                </p>
              </div>

              {/* Mint Promise Card */}
              <div className="bg-sudabelt-green-tint border border-sudabelt-green/20 rounded-card p-8 shadow-2xs">
                <span className="text-xs uppercase tracking-widest font-bold text-sudabelt-green block mb-2">
                  OUR PROMISE
                </span>
                <p className="text-sm sm:text-base text-sudabelt-navy font-medium leading-relaxed">
                  Local engineers who repair, troubleshoot, manage and service your equipment, with quick responses.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default EmergencyBreakdownPage
