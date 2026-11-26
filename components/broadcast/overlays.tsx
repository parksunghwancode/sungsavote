'use client'

import { useEffect, useState } from 'react'
import { BROADCAST_CONFIG, type BroadcastConfig } from '@/lib/config'
import type { ResultsState } from '@/hooks/use-results'
import { CountUp } from './primitives'

function useClock() {
  const [now, setNow] = useState<Date | null>(null)
  useEffect(() => {
    setNow(new Date())
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  return now
}

const pad = (n: number) => String(n).padStart(2, '0')

export function SchoolLogo({ onDark = false, className = '' }: { onDark?: boolean; className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={(onDark ? BROADCAST_CONFIG.logoOnDark : BROADCAST_CONFIG.logo) || '/placeholder.svg'}
      alt={`${BROADCAST_CONFIG.schoolName} SUNGSA MIDDLE SCHOOL`}
      className={`w-auto shrink-0 object-contain ${className}`}
    />
  )
}

export function LiveBadge({ className = '' }: { className?: string }) {
  return (
    <span className={`flex items-center gap-3 bg-primary px-5 font-mono font-bold leading-none tracking-wide text-primary-foreground ${className}`}>
      <span className="bc-pulse size-3 rounded-full bg-primary-foreground" aria-hidden="true" />
      LIVE
    </span>
  )
}

export function TopRule() {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-40 h-3 bg-primary" aria-hidden="true" />
  )
}

export function HeaderBug({ config, label }: { config: BroadcastConfig; label: string }) {
  const now = useClock()
  return (
    <header className="bc-fade absolute inset-x-20 top-16 z-30 flex h-24 items-center justify-between">
      <div className="flex min-w-0 items-center gap-8">
        <SchoolLogo className="h-16 shrink-0" />
        <span className="h-12 w-px shrink-0 bg-border" aria-hidden="true" />
        <LiveBadge className="h-14 shrink-0 text-3xl" />
        <span className="truncate whitespace-nowrap text-[40px] font-black tracking-tight text-foreground">
          {config.electionTitle} 개표방송
        </span>
        <span className="h-10 w-px shrink-0 bg-border" aria-hidden="true" />
        <span className="shrink-0 whitespace-nowrap text-3xl font-bold text-muted-foreground">{label}</span>
      </div>
      <span className="ml-8 shrink-0 font-mono text-6xl font-bold tabular-nums text-muted-foreground">
        {now ? `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}` : '--:--:--'}
      </span>
    </header>
  )
}

export function CountFooter({ results }: { results: ResultsState }) {
  const { stats } = results
  const rate = stats.countRate ?? 0
  return (
    <footer className="bc-fade absolute inset-x-20 bottom-14 z-30 flex items-center gap-10" style={{ animationDelay: '0.5s' }}>
      <span className="flex shrink-0 items-baseline gap-4">
        <span className="text-3xl font-bold text-foreground">개표율</span>
        <span className="font-mono text-7xl font-extrabold leading-none tabular-nums text-foreground">
          {stats.countRate === null ? '—' : <CountUp value={stats.countRate} decimals={1} />}
          {stats.countRate !== null && '%'}
        </span>
      </span>
      <div className="h-4 flex-1 overflow-hidden rounded-full bg-muted" role="progressbar" aria-valuenow={rate} aria-valuemin={0} aria-valuemax={100} aria-label="개표율">
        <div
          className="h-full rounded-full bg-primary"
          style={{ width: `${rate}%`, transition: 'width 1.2s cubic-bezier(0.16, 1, 0.3, 1)' }}
        />
      </div>
      <span className="shrink-0 text-3xl font-medium tabular-nums text-foreground">
        {stats.counted.toLocaleString()}
        {stats.totalBallots !== null && ` / ${stats.totalBallots.toLocaleString()}`}표 개표 · 무효 {stats.invalid.toLocaleString()}표
      </span>
    </footer>
  )
}

export function Ticker({ config, results }: { config: BroadcastConfig; results: ResultsState }) {
  const { stats, ranked } = results
  const summary = ranked.length
    ? [
        stats.countRate !== null ? `개표율 ${stats.countRate.toFixed(1)}%` : null,
        ...ranked.map((c) => `기호 ${c.number}번 ${c.name} ${c.votes.toLocaleString()}표 (${c.pct.toFixed(1)}%)`),
      ].filter(Boolean)
    : []
  const items = [config.ticker, ...summary].filter(Boolean) as string[]
  const line = items.join('   ·   ')
  const duration = Math.max(30, line.length * 0.3)

  return (
    <div className="absolute inset-x-0 bottom-0 z-30 flex h-[72px] items-stretch border-t border-border bg-muted">
      <div className="flex shrink-0 items-center gap-3 bg-primary px-9 text-[26px] font-black text-primary-foreground">
        <span className="bc-pulse size-3 rounded-full bg-primary-foreground" aria-hidden="true" />
        개표 속보
      </div>
      <div className="relative flex-1 overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 flex items-center whitespace-nowrap text-[28px] font-bold text-foreground"
          style={{ animation: `bc-marquee ${duration}s linear infinite` }}
        >
          <span className="pl-12 pr-24">{line}</span>
          <span className="pl-12 pr-24" aria-hidden="true">
            {line}
          </span>
        </div>
      </div>
    </div>
  )
}

export function SceneTransition({ triggerKey }: { triggerKey: number }) {
  if (triggerKey === 0) return null
  return (
    <div key={triggerKey} className="pointer-events-none absolute inset-0 z-50 overflow-hidden" aria-hidden="true">
      <div
        className="absolute inset-0 flex items-center justify-center bg-primary text-primary-foreground"
        style={{ animation: 'bc-wipe 1.3s cubic-bezier(0.83, 0, 0.17, 1) both' }}
      >
        <div
          className="flex flex-col items-center gap-6"
          style={{ animation: 'bc-wipe-content 1.3s cubic-bezier(0.16, 1, 0.3, 1) both' }}
        >
          <span className="font-mono text-2xl font-semibold tracking-[0.5em] opacity-80">2026 ELECTION</span>
          <span className="text-8xl font-black leading-none tracking-tight text-balance">선택 우리학교</span>
          <span
            className="h-1 w-48 origin-left rounded-full bg-primary-foreground"
            style={{ animation: 'bc-wipe-line 1.3s cubic-bezier(0.16, 1, 0.3, 1) both' }}
          />
        </div>
      </div>
    </div>
  )
}
