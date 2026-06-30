'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await login({ email, password })
      router.push('/dashboard')
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Invalid email or password'
      setError(msg)
      toast.error(msg)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="font-display-lg text-display-lg text-on-surface">Validator Pro</h1>
          <p className="text-on-surface-variant mt-2">Sign in to your account</p>
        </div>

        {error && (
          <div className="bg-error-container text-error px-4 py-3 rounded-xl mb-4 text-sm">
            {error}
          </div>
        )}

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

          <div>
            <label className="text-label-sm text-on-surface-variant uppercase tracking-widest block mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface text-on-surface focus:outline-none focus:border-on-surface transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-on-surface text-surface py-3 rounded-xl font-label-md hover:bg-on-surface-variant transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {submitting && <span className="w-4 h-4 border-2 border-surface border-t-transparent rounded-full animate-spin" />}
            {submitting ? 'Signing in...' : 'Sign In'}
          </button>

          <p className="text-center text-sm text-on-surface-variant">
            <Link href="/forgot-password" className="text-primary hover:underline">
              Forgot password?
            </Link>
          </p>

          <p className="text-center text-sm text-on-surface-variant">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-primary font-bold hover:underline">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
