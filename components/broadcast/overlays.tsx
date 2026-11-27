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
    <header className="bc-fade absolute inset-x-0 top-0 z-30 flex h-[132px] items-center justify-between gap-10 bg-navy px-16">
      <div className="flex min-w-0 items-center gap-8">
        <SchoolLogo onDark className="h-14 shrink-0" />
        <div className="flex min-w-0 items-center gap-6">
          <span className="h-[62px] w-[5px] shrink-0 rounded-sm bg-header-accent" aria-hidden="true" />
          <div className="flex min-w-0 flex-col gap-1">
            <span className="whitespace-nowrap text-[21px] font-medium leading-tight text-ink-muted">{label}</span>
            <span className="whitespace-nowrap text-[38px] font-bold leading-tight tracking-tight text-primary-foreground">
              {config.electionTitle} 개표방송
            </span>
          </div>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-8">
        <span className="flex h-12 items-center gap-3 rounded-full bg-navy-deep px-6 text-xl font-bold tracking-wide text-primary-foreground">
          <span className="bc-pulse size-2.5 rounded-full bg-live" aria-hidden="true" />
          LIVE
        </span>
        <span className="font-mono text-[44px] font-semibold tabular-nums text-primary-foreground">
          {now ? `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}` : '--:--:--'}
        </span>
      </div>
    </header>
  )
}

function StatItem({ label, value, decimals = 0, unit = '표', accent = false }: { label: string; value: number | null; decimals?: number; unit?: string; accent?: boolean }) {
  return (
    <span className="flex shrink-0 items-baseline gap-5">
      <span className="text-[26px] font-medium text-muted-foreground">{label}</span>
      <span className={`flex items-baseline gap-2 font-mono text-[54px] font-bold leading-none tabular-nums ${accent ? 'text-primary' : 'text-foreground'}`}>
        {value === null ? '—' : <CountUp value={value} decimals={decimals} />}
        <span className="font-sans text-2xl font-bold">{unit}</span>
      </span>
    </span>
  )
}

export function CountFooter({ results, showRate = false }: { results: ResultsState; showRate?: boolean }) {
  const { stats, ranked } = results
  const pctGap = ranked[0] && ranked[1] ? ranked[0].pct - ranked[1].pct : 0
  return (
    <footer
      className="bc-fade absolute inset-x-0 bottom-0 z-30 flex h-[108px] items-center justify-between gap-10 border-t border-border bg-card px-16"
      style={{ animationDelay: '0.4s' }}
    >
      <div className="flex items-center gap-10">
        {showRate ? (
          <StatItem label="개표율" value={stats.countRate} decimals={1} unit="%" accent />
        ) : (
          <>
            <StatItem label="1·2위 격차" value={stats.margin} accent />
            <span className="h-12 w-px bg-border" aria-hidden="true" />
            <StatItem label="득표율 차이" value={pctGap} decimals={1} unit="%p" accent />
          </>
        )}
      </div>
      <div className="flex items-center gap-16">
        <StatItem label="유효표" value={stats.validVotes} />
        <StatItem label="무효표" value={stats.invalid} />
        <StatItem label="미개표" value={stats.remaining} />
      </div>
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
    <div className="absolute inset-x-0 bottom-0 z-30 flex h-[76px] items-stretch bg-navy">
      <div className="flex shrink-0 items-center gap-3 pl-16 pr-6 text-[26px] font-bold text-header-accent">
        <span className="bc-pulse size-2.5 rounded-full bg-live" aria-hidden="true" />
        개표 속보
      </div>
      <div className="relative flex-1 overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 flex items-center whitespace-nowrap text-[26px] font-medium text-primary-foreground"
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
        style={{ animation: 'bc-cover 1.3s cubic-bezier(0.83, 0, 0.17, 1) both' }}
      >
        <div
          className="flex flex-col items-center gap-6"
          style={{ animation: 'bc-cover-content 1.3s cubic-bezier(0.16, 1, 0.3, 1) both' }}
        >
          <span className="font-mono text-2xl font-semibold tracking-[0.5em] opacity-80">2027 ELECTION</span>
          <span className="text-7xl font-black leading-none tracking-tight text-balance">성사중학교 전교임원 선거</span>
          <span
            className="h-1 w-48 origin-left rounded-full bg-primary-foreground"
            style={{ animation: 'bc-cover-line 1.3s cubic-bezier(0.16, 1, 0.3, 1) both' }}
          />
        </div>
      </div>
    </div>
  )
}
