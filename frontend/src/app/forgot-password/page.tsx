'use client'

import { useState } from 'react'
import Link from 'next/link'
import { authService } from '@/services/authService'
import toast from 'react-hot-toast'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await authService.forgotPassword(email)
      setSent(true)
      toast.success('Check your email for a reset link')
    } catch {
      toast.error('Failed to send reset email. Try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (sent) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="w-full max-w-md text-center">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-[32px] p-8">
            <h1 className="font-display-lg text-display-lg text-on-surface mb-4">Check your email</h1>
            <p className="text-on-surface-variant mb-6">
              If an account exists for <strong>{email}</strong>, you will receive a password reset link shortly.
            </p>
            <Link href="/login" className="text-primary font-bold hover:underline">
              Back to sign in
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="font-display-lg text-display-lg text-on-surface">Forgot password?</h1>
          <p className="text-on-surface-variant mt-2">Enter your email and we will send you a reset link</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-surface-container-lowest border border-outline-variant rounded-[32px] p-8 space-y-6">
          <div>
            <label className="text-label-sm text-on-surface-variant uppercase tracking-widest block mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface text-on-surface focus:outline-none focus:border-on-surface transition-colors"
              placeholder="you@example.com"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-on-surface text-surface py-3 rounded-xl font-label-md hover:bg-on-surface-variant transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {submitting && <span className="w-4 h-4 border-2 border-surface border-t-transparent rounded-full animate-spin" />}
            {submitting ? 'Sending...' : 'Send reset link'}
          </button>

          <p className="text-center text-sm text-on-surface-variant">
            Remember your password?{' '}
            <Link href="/login" className="text-primary font-bold hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
