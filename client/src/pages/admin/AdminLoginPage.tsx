import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import { Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react'
import { toast } from 'react-toastify'
import { api } from '../../api/api'

const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      toast.error('Please enter both email and password.')
      return
    }

    setIsLoading(true)
    try {
      const res = await api.adminLogin({ email, password })
      if (res.token) {
        localStorage.setItem('sbm_admin_token', res.token)
        localStorage.setItem('sbm_admin_user', JSON.stringify(res.user))
        toast.success(`Welcome back, ${res.user.name}!`)
        navigate('/admin')
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Invalid credentials. Please verify your email and password.'
      toast.error(msg)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-sudabelt-navy flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-sudabelt-green blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-sudabelt-blue blur-3xl" />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 border border-white/20 mb-4 shadow-xl backdrop-blur-md">
            <ShieldCheck className="w-9 h-9 text-sudabelt-green" />
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Sudabelt Medical CRM
          </h2>
          <p className="mt-2 text-sm text-gray-300">
            Administrative Console & Content Management System
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-6 shadow-2xl rounded-3xl sm:px-10 border border-sudabelt-border">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-sudabelt-navy mb-2">
                  Admin Email Address
                </label>
                <div className="relative rounded-xl shadow-xs">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@sudabelt.com"
                    className="block w-full pl-11 pr-4 py-3 rounded-xl border border-sudabelt-border focus:ring-2 focus:ring-sudabelt-green focus:border-sudabelt-green text-sm text-sudabelt-navy transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-sudabelt-navy mb-2">
                  Password
                </label>
                <div className="relative rounded-xl shadow-xs">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="block w-full pl-11 pr-4 py-3 rounded-xl border border-sudabelt-border focus:ring-2 focus:ring-sudabelt-green focus:border-sudabelt-green text-sm text-sudabelt-navy transition-all"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end text-xs">
                <span className="text-sudabelt-green font-semibold">Authorized Personnel Only</span>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-sudabelt-green hover:bg-sudabelt-green-dark focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-sudabelt-green transition-all duration-200 disabled:opacity-50"
                >
                  {isLoading ? 'Verifying Credentials...' : 'Sign In to Console'}
                  {!isLoading && <ArrowRight className="w-4 h-4" />}
                </button>
              </div>
            </form>

            <div className="mt-6 pt-6 border-t border-sudabelt-border text-center">
              <a
                href="/"
                className="text-xs text-sudabelt-muted hover:text-sudabelt-navy font-medium transition-colors"
              >
                ← Return to Public Website
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminLoginPage
