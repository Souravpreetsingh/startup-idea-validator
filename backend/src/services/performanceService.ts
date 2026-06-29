import { Request, Response } from 'express'

interface MetricEntry {
  method: string
  path: string
  statusCode: number
  durationMs: number
  timestamp: Date
}

interface SlowQueryEntry {
  operation: string
  durationMs: number
  collection: string
  timestamp: Date
}

const metrics: MetricEntry[] = []
const slowQueries: SlowQueryEntry[] = []
const MAX_ENTRIES = 1000

export function recordMetric(req: Request, res: Response, durationMs: number) {
  const entry: MetricEntry = {
    method: req.method,
    path: req.originalUrl,
    statusCode: res.statusCode,
    durationMs,
    timestamp: new Date(),
  }
  metrics.push(entry)
  if (metrics.length > MAX_ENTRIES) metrics.shift()
}

export function recordSlowQuery(operation: string, durationMs: number, collection: string) {
  if (durationMs < 100) return
  const entry: SlowQueryEntry = { operation, durationMs, collection, timestamp: new Date() }
  slowQueries.push(entry)
  if (slowQueries.length > MAX_ENTRIES) slowQueries.shift()
}

export function getPerformanceSnapshot() {
  const now = Date.now()
  const fiveMinAgo = now - 300000
  const oneHourAgo = now - 3600000

  const recentMetrics = metrics.filter((m) => m.timestamp.getTime() > fiveMinAgo)
  const hourMetrics = metrics.filter((m) => m.timestamp.getTime() > oneHourAgo)

  const avgDuration = hourMetrics.length > 0
    ? Math.round(hourMetrics.reduce((s, m) => s + m.durationMs, 0) / hourMetrics.length)
    : 0

  const statusCounts: Record<string, number> = {}
  hourMetrics.forEach((m) => {
    const key = String(m.statusCode).charAt(0) + 'xx'
    statusCounts[key] = (statusCounts[key] || 0) + 1
  })

  const endpoints: Record<string, { count: number; avgMs: number }> = {}
  hourMetrics.forEach((m) => {
    const key = `${m.method} ${m.path.split('?')[0]}`
    if (!endpoints[key]) endpoints[key] = { count: 0, avgMs: 0 }
    endpoints[key].count++
    endpoints[key].avgMs += m.durationMs
  })
  Object.keys(endpoints).forEach((key) => {
    endpoints[key].avgMs = Math.round(endpoints[key].avgMs / endpoints[key].count)
  })

  const slowRecent = slowQueries.filter((q) => q.timestamp.getTime() > oneHourAgo)

  return {
    summary: {
      totalRequests: metrics.length,
      requestsLast5Min: recentMetrics.length,
      requestsLastHour: hourMetrics.length,
      avgResponseTimeMs: avgDuration,
      p99ResponseTimeMs: calculatePercentile(hourMetrics, 0.99),
      p95ResponseTimeMs: calculatePercentile(hourMetrics, 0.95),
    },
    statusCodes: statusCounts,
    endpoints: Object.entries(endpoints)
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 20)
      .map(([path, data]) => ({ path, ...data })),
    slowQueries: slowRecent.slice(-20).map((q) => ({
      ...q,
      durationMs: `${q.durationMs}ms`,
      timestamp: q.timestamp.toISOString(),
    })),
    memoryUsage: process.memoryUsage(),
    uptime: process.uptime(),
  }
}

function calculatePercentile(entries: MetricEntry[], percentile: number): number {
  if (entries.length === 0) return 0
  const sorted = [...entries].sort((a, b) => a.durationMs - b.durationMs)
  const index = Math.ceil(percentile * sorted.length) - 1
  return sorted[Math.max(0, index)].durationMs
}
