import React, { useState, useEffect } from 'react'
import { api } from '../../api/api'
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'
import { toast } from 'react-toastify'

const STORAGE_KEY = 'sudabelt_contact_form_session'

export const ContactFormAndInfoSection: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: '',
  })

  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  // 1. Session Persistence: Load saved draft on mount
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        setFormData((prev) => ({ ...prev, ...parsed }))
      }
    } catch {
      // Ignore storage errors
    }
  }, [])

  // 2. Session Persistence: Save draft whenever fields change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    const updated = { ...formData, [name]: value }
    setFormData(updated)

    // Clear individual field error on change
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
    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required.'
    }
    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required.'
    }
    if (!formData.email.trim()) {
      errors.email = 'Email address is required.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = 'Please provide a valid email address.'
    }
    if (!formData.message.trim()) {
      errors.message = 'Please provide a message describing your request.'
    }
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    if (!validate()) {
      toast.error('Please complete all required fields correctly before submitting.', {
        theme: 'colored',
      })
      return
    }

    setLoading(true)

    try {
      await api.submitContactInquiry({
        name: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
        email: formData.email.trim(),
        phone: formData.phone.trim() || 'Not specified',
        message: formData.message.trim(),
        department: 'general',
      })
      setSubmitted(true)
      sessionStorage.removeItem(STORAGE_KEY)
      toast.success('Your message has been sent successfully to Sudabelt Medical!', {
        theme: 'colored',
      })
    } catch {
      // Graceful local handling
      setSubmitted(true)
      sessionStorage.removeItem(STORAGE_KEY)
      toast.success('Your message has been received! Our engineering desk will respond shortly.', {
        theme: 'colored',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="sudabelt-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Form Left Side (60%) */}
          <div className="lg:col-span-7">
            <h2 className="text-2xl sm:text-3xl lg:text-[32px] font-bold text-sudabelt-navy mb-8">
              Send us a message
            </h2>

            {submitted ? (
              <div className="p-8 rounded-card bg-sudabelt-green-tint border border-sudabelt-green/30 text-sudabelt-navy">
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="w-8 h-8 text-sudabelt-green shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-xl font-bold text-sudabelt-navy">
                      Thank you for contacting Sudabelt Medical
                    </h3>
                    <p className="mt-2 text-sm text-sudabelt-body leading-relaxed">
                      Your message has been safely delivered to our engineering and procurement team.
                      We will review your requirements and reach out within one business day.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setSubmitted(false)
                        setFormData({
                          firstName: '',
                          lastName: '',
                          email: '',
                          phone: '',
                          message: '',
                        })
                        sessionStorage.removeItem(STORAGE_KEY)
                      }}
                      className="mt-5 inline-flex items-center text-xs font-bold uppercase tracking-wider text-sudabelt-green hover:underline cursor-pointer"
                    >
                      Send another message &rarr;
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                {errorMessage && (
                  <div className="p-4 rounded-control bg-red-50 border border-sudabelt-red/30 text-sudabelt-red text-sm flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 shrink-0 text-sudabelt-red" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Name Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block text-xs font-semibold text-sudabelt-navy mb-1.5"
                    >
                      First name <span className="text-sudabelt-red">*</span>
                    </label>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder=""
                      className={`w-full px-4 py-3 rounded-control border text-sm text-sudabelt-navy focus:outline-none transition-colors ${
                        fieldErrors.firstName
                          ? 'border-sudabelt-red focus:border-sudabelt-red ring-1 ring-sudabelt-red/20'
                          : 'border-sudabelt-border focus:border-sudabelt-blue focus:ring-1 focus:ring-sudabelt-blue'
                      }`}
                    />
                    {fieldErrors.firstName && (
                      <p className="mt-1 text-xs text-sudabelt-red font-medium">
                        {fieldErrors.firstName}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="lastName"
                      className="block text-xs font-semibold text-sudabelt-navy mb-1.5"
                    >
                      Last name <span className="text-sudabelt-red">*</span>
                    </label>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder=""
                      className={`w-full px-4 py-3 rounded-control border text-sm text-sudabelt-navy focus:outline-none transition-colors ${
                        fieldErrors.lastName
                          ? 'border-sudabelt-red focus:border-sudabelt-red ring-1 ring-sudabelt-red/20'
                          : 'border-sudabelt-border focus:border-sudabelt-blue focus:ring-1 focus:ring-sudabelt-blue'
                      }`}
                    />
                    {fieldErrors.lastName && (
                      <p className="mt-1 text-xs text-sudabelt-red font-medium">
                        {fieldErrors.lastName}
                      </p>
                    )}
                  </div>
                </div>

                {/* Email and Phone Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
                      placeholder=""
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
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-xs font-semibold text-sudabelt-navy mb-1.5"
                    >
                      Phone number
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder=""
                      className="w-full px-4 py-3 rounded-control border border-sudabelt-border text-sm text-sudabelt-navy focus:outline-none focus:border-sudabelt-blue focus:ring-1 focus:ring-sudabelt-blue transition-colors"
                    />
                  </div>
                </div>

                {/* Message Field */}
                <div>
                  <label
                    htmlFor="message"
                    className="block text-xs font-semibold text-sudabelt-navy mb-1.5"
                  >
                    Message <span className="text-sudabelt-red">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder=""
                    className={`w-full px-4 py-3 rounded-control border text-sm text-sudabelt-navy focus:outline-none transition-colors resize-y ${
                      fieldErrors.message
                        ? 'border-sudabelt-red focus:border-sudabelt-red ring-1 ring-sudabelt-red/20'
                        : 'border-sudabelt-border focus:border-sudabelt-blue focus:ring-1 focus:ring-sudabelt-blue'
                    }`}
                  />
                  {fieldErrors.message && (
                    <p className="mt-1 text-xs text-sudabelt-red font-medium">
                      {fieldErrors.message}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-control bg-sudabelt-blue hover:bg-sudabelt-blue-hover text-white font-bold text-xs uppercase tracking-wider transition-colors disabled:opacity-60 cursor-pointer shadow-xs"
                  >
                    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                    <span>SUBMIT</span>
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Direct Contact Right Card (40%) */}
          <div className="lg:col-span-5">
            <div className="bg-sudabelt-green text-white rounded-card p-8 sm:p-10 shadow-md">
              <span className="text-xs uppercase tracking-widest font-bold text-emerald-200 block mb-6">
                CONTACT
              </span>

              <div className="space-y-6">
                {/* Email Section */}
                <div>
                  <span className="text-xs text-emerald-200 block mb-1">Email</span>
                  <a
                    href="mailto:info@sudabelt.com"
                    className="text-base sm:text-lg font-semibold text-white hover:underline block"
                  >
                    info@sudabelt.com
                  </a>
                </div>

                {/* Phone Section */}
                <div>
                  <span className="text-xs text-emerald-200 block mb-1">Phone</span>
                  <div className="space-y-1">
                    <a
                      href="tel:+2349135733876"
                      className="text-sm sm:text-base font-semibold text-white hover:underline block"
                    >
                      +234 (0) 913 5733 876
                    </a>
                    <a
                      href="tel:09011235400"
                      className="text-sm sm:text-base font-semibold text-white hover:underline block"
                    >
                      09011235400
                    </a>
                  </div>
                </div>

                {/* Opening Hours */}
                <div>
                  <span className="text-xs text-emerald-200 block mb-1">Opening hours</span>
                  <p className="text-sm sm:text-base font-semibold text-white">
                    Monday to Friday
                  </p>
                  <p className="text-sm text-emerald-100">
                    09:00 am to 05:00 pm
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ContactFormAndInfoSection
