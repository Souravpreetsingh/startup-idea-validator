export function CardSkeleton() {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-[32px] p-6 animate-pulse">
      <div className="flex justify-between items-start mb-4">
        <div className="h-3 w-24 bg-surface-variant rounded" />
        <div className="h-5 w-5 bg-surface-variant rounded" />
      </div>
      <div className="h-8 w-16 bg-surface-variant rounded mt-4" />
    </div>
  )
}

export function TextSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="animate-pulse space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="h-4 bg-surface-variant rounded" style={{ width: `${80 - i * 15}%` }} />
      ))}
    </div>
  )
}

export function ListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center justify-between p-4 animate-pulse">
          <div className="flex-1 space-y-2">
            <div className="h-5 w-3/4 bg-surface-variant rounded" />
            <div className="h-3 w-1/2 bg-surface-variant rounded" />
          </div>
          <div className="h-6 w-12 bg-surface-variant rounded-full" />
        </div>
      ))}
    </div>
  )
}
