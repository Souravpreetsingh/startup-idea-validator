'use client'

import type { ReactNode } from 'react'

interface Props {
  loading: boolean
  error: boolean
  onRetry: () => void
  children: ReactNode
  empty?: boolean
  emptyMessage?: string
  emptyAction?: ReactNode
}

export default function RetryWrapper({
  loading,
  error,
  onRetry,
  children,
  empty,
  emptyMessage,
  emptyAction,
}: Props) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-8 h-8 border-2 border-tertiary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4">
        <span className="material-symbols-outlined text-4xl text-error">cloud_off</span>
        <p className="text-on-surface-variant">Failed to load data</p>
        <button
          onClick={onRetry}
          className="bg-on-surface text-surface px-5 py-2 rounded-full font-label-md hover:bg-on-surface-variant transition-colors text-sm"
        >
          Retry
        </button>
      </div>
    )
  }

  if (empty) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <span className="material-symbols-outlined text-4xl text-outline">inbox</span>
        <p className="text-on-surface-variant">{emptyMessage || 'Nothing here yet'}</p>
        {emptyAction}
      </div>
    )
  }

  return <>{children}</>
}
