import React, { useEffect, useState } from 'react'
import { RefreshCw, ShieldCheck } from 'lucide-react'

interface FormCaptchaProps {
  onVerifyChange: (verified: boolean) => void
  className?: string
}

const generateChallenge = () => {
  const a = Math.floor(Math.random() * 8) + 2
  const b = Math.floor(Math.random() * 7) + 1
  return { a, b, answer: a + b }
}

const FormCaptcha: React.FC<FormCaptchaProps> = ({ onVerifyChange, className = '' }) => {
  const [challenge, setChallenge] = useState(generateChallenge)
  const [inputValue, setInputValue] = useState('')
  const [honeypot, setHoneypot] = useState('')

  const isSolved = honeypot === '' && inputValue.trim() === String(challenge.answer)

  useEffect(() => {
    onVerifyChange(isSolved)
  }, [isSolved, onVerifyChange])

  const handleRefresh = () => {
    setChallenge(generateChallenge())
    setInputValue('')
    onVerifyChange(false)
  }

  return (
    <div
      className={`rounded-xl border border-sudabelt-border bg-sudabelt-surface/60 p-3.5 sm:p-4 ${className}`}
    >
      {/* Hidden honeypot input to trap automated bots */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="sbm-company-website">Leave this field blank</label>
        <input
          id="sbm-company-website"
          name="companyWebsite"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ShieldCheck
            className={`w-4 h-4 shrink-0 ${
              isSolved ? 'text-sudabelt-green' : 'text-sudabelt-navy'
            }`}
          />
          <span className="text-xs font-bold text-sudabelt-navy">
            Security Check: What is{' '}
            <span className="font-mono text-sudabelt-green">
              {challenge.a} + {challenge.b}
            </span>
            ?
          </span>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            inputMode="numeric"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Answer"
            aria-label="Security verification answer"
            className={`w-24 h-9 px-3 rounded-control border text-xs font-mono font-bold text-sudabelt-navy bg-white focus:outline-hidden transition-colors ${
              isSolved
                ? 'border-sudabelt-green ring-1 ring-sudabelt-green'
                : 'border-sudabelt-border focus:border-sudabelt-navy'
            }`}
          />
          <button
            type="button"
            onClick={handleRefresh}
            title="New security question"
            aria-label="New security question"
            className="h-9 w-9 rounded-control border border-sudabelt-border bg-white hover:bg-sudabelt-surface text-sudabelt-navy inline-flex items-center justify-center transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          {isSolved && (
            <span className="text-[11px] font-bold text-sudabelt-green whitespace-nowrap">
              Verified
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export default FormCaptcha
