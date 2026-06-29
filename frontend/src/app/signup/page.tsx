'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'

export default function SignupPage() {
  const [form, setForm] = useState({ fullName: '', email: '', password: '', startupExperience: '', industryInterest: '' })
  const [submitting, setSubmitting] = useState(false)
  const { signup } = useAuth()
  const router = useRouter()

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await signup(form)
      router.push('/dashboard')
    } catch {
      // toast handled by interceptor
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="font-display-lg text-display-lg text-on-surface">Create Account</h1>
          <p className="text-on-surface-variant mt-2">Join Validator Pro</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-surface-container-lowest border border-outline-variant rounded-[32px] p-8 space-y-5">
          <div>
            <label className="text-label-sm text-on-surface-variant uppercase tracking-widest block mb-2">Full Name</label>
            <input type="text" value={form.fullName} onChange={update('fullName')} required minLength={2}
              className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface focus:outline-none focus:border-on-surface" placeholder="John Doe" />
          </div>

          <div>
            <label className="text-label-sm text-on-surface-variant uppercase tracking-widest block mb-2">Email</label>
            <input type="email" value={form.email} onChange={update('email')} required
              className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface focus:outline-none focus:border-on-surface" placeholder="you@example.com" />
          </div>

          <div>
            <label className="text-label-sm text-on-surface-variant uppercase tracking-widest block mb-2">Password</label>
            <input type="password" value={form.password} onChange={update('password')} required minLength={6}
              className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface focus:outline-none focus:border-on-surface" placeholder="Min. 6 characters" />
          </div>

          <div>
            <label className="text-label-sm text-on-surface-variant uppercase tracking-widest block mb-2">Startup Experience (optional)</label>
            <textarea value={form.startupExperience} onChange={update('startupExperience')} rows={2}
              className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface focus:outline-none focus:border-on-surface resize-none" placeholder="Tell us about your background..." />
          </div>

          <div>
            <label className="text-label-sm text-on-surface-variant uppercase tracking-widest block mb-2">Industry Interest (optional)</label>
            <input type="text" value={form.industryInterest} onChange={update('industryInterest')}
              className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface focus:outline-none focus:border-on-surface" placeholder="e.g. SaaS, Fintech, HealthTech" />
          </div>

          <button type="submit" disabled={submitting}
            className="w-full bg-on-surface text-surface py-3 rounded-xl font-label-md hover:bg-on-surface-variant transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
            {submitting && <span className="w-4 h-4 border-2 border-surface border-t-transparent rounded-full animate-spin" />}
            {submitting ? 'Creating account...' : 'Create Account'}
          </button>

          <p className="text-center text-sm text-on-surface-variant">
            Already have an account?{' '}
            <Link href="/login" className="text-primary font-bold hover:underline">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  )
}
