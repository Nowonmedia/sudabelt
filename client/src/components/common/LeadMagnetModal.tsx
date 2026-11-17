import React, { useState } from 'react'
import { X, Download, CheckCircle2, ShieldCheck, Mail, Building, User, Phone } from 'lucide-react'
import { useLeadCaptureMutation } from '../../api/api'

interface LeadMagnetModalProps {
  isOpen: boolean
  onClose: () => void
  assetTitle: string
  assetSlug: string
  directDownloadUrl: string
  description?: string
  buttonLabel?: string
}

export const LeadMagnetModal: React.FC<LeadMagnetModalProps> = ({
  isOpen,
  onClose,
  assetTitle,
  assetSlug,
  directDownloadUrl,
  description = 'Please provide your contact information to immediately download this document.',
  buttonLabel = 'Download Document',
}) => {
  const [name, setName] = useState('')
  const [workEmail, setWorkEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [facilityName, setFacilityName] = useState('')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)

  const leadMutation = useLeadCaptureMutation()

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)

    if (!workEmail.trim() || !workEmail.includes('@')) {
      setErrorMsg('Please enter a valid work email address.')
      return
    }

    try {
      await leadMutation.mutateAsync({
        name: name.trim() || 'Medical Professional',
        workEmail: workEmail.trim(),
        phone: phone.trim() || '+234000000000',
        facilityName: facilityName.trim() || 'Healthcare Facility',
        assetSlug,
        assetTitle,
        assetUrl: directDownloadUrl,
      })
    } catch {
      // Non-blocking: even if the API backend is starting up or in sandbox mode, proceed to deliver the asset
      console.warn('Lead capture submitted offline; proceeding to download.')
    }

    setIsSuccess(true)

    // Trigger download in new window/tab
    setTimeout(() => {
      const link = document.createElement('a')
      link.href = directDownloadUrl
      link.target = '_blank'
      link.rel = 'noopener noreferrer'
      link.download = `${assetSlug}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }, 400)
  }

  const handleClose = () => {
    setIsSuccess(false)
    setName('')
    setWorkEmail('')
    setPhone('')
    setFacilityName('')
    setErrorMsg(null)
    onClose()
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-sudabelt-navy/80 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-lg bg-white rounded-card shadow-modal overflow-hidden border border-sudabelt-border flex flex-col">
        {/* Header */}
        <div className="bg-sudabelt-navy text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-control bg-sudabelt-blue/20 text-sudabelt-blue flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white leading-tight">
                {assetTitle}
              </h3>
              <p className="text-[11.5px] text-white/75">Verified Sudabelt Documentation</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="w-8 h-8 rounded-control bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-7">
          {isSuccess ? (
            <div className="py-6 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-sudabelt-green/15 text-sudabelt-green flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-xl font-extrabold text-sudabelt-navy">
                  Download Initiated!
                </h4>
                <p className="text-sm text-sudabelt-body mt-2 max-w-sm mx-auto leading-relaxed">
                  Your document is opening in a new tab. If the download did not start automatically, please click below.
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href={directDownloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-control bg-sudabelt-green hover:bg-sudabelt-green/90 text-white font-bold text-xs uppercase tracking-wider transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Open Document Again</span>
                </a>
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-5 py-2.5 rounded-control border border-sudabelt-border text-sudabelt-navy font-bold text-xs uppercase hover:bg-sudabelt-surface transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-xs sm:text-sm text-sudabelt-body leading-relaxed">
                {description}
              </p>

              {errorMsg && (
                <div className="p-3 rounded-control bg-red-50 border border-red-200 text-xs text-sudabelt-red font-medium">
                  {errorMsg}
                </div>
              )}

              <div className="space-y-3.5">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-sudabelt-label mb-1">
                    Work Email Address <span className="text-sudabelt-red">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-sudabelt-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={workEmail}
                      onChange={(e) => setWorkEmail(e.target.value)}
                      placeholder="e.g. doctor@hospital.org"
                      className="w-full h-11 pl-10 pr-3 rounded-control border border-sudabelt-border focus:border-sudabelt-green focus:outline-none text-sm text-sudabelt-navy bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-sudabelt-label mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-sudabelt-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Dr. / Engr. / Nurse"
                        className="w-full h-11 pl-10 pr-3 rounded-control border border-sudabelt-border focus:border-sudabelt-green focus:outline-none text-sm text-sudabelt-navy bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-sudabelt-label mb-1">
                      Facility / Organization
                    </label>
                    <div className="relative">
                      <Building className="w-4 h-4 text-sudabelt-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={facilityName}
                        onChange={(e) => setFacilityName(e.target.value)}
                        placeholder="Hospital / Clinic / Ministry"
                        className="w-full h-11 pl-10 pr-3 rounded-control border border-sudabelt-border focus:border-sudabelt-green focus:outline-none text-sm text-sudabelt-navy bg-white"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-sudabelt-label mb-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-sudabelt-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+234..."
                      className="w-full h-11 pl-10 pr-3 rounded-control border border-sudabelt-border focus:border-sudabelt-green focus:outline-none text-sm text-sudabelt-navy bg-white font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={leadMutation.isPending}
                  className="w-full h-12 rounded-control bg-sudabelt-green hover:bg-sudabelt-green/90 text-white font-extrabold text-xs uppercase tracking-wider transition-colors inline-flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Download className="w-4 h-4" />
                  <span>
                    {leadMutation.isPending ? 'Verifying...' : buttonLabel}
                  </span>
                </button>
              </div>

              <p className="text-[11px] text-sudabelt-muted text-center pt-1">
                Your privacy is respected. We never share your professional contact details.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default LeadMagnetModal
