'use client'

import { useEffect, useState } from 'react'
import { BROADCAST_CONFIG, type BroadcastConfig } from '@/lib/config'
import type { ResultsState } from '@/hooks/use-results'

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

export function SchoolEmblem({ className = '' }: { className?: string }) {
  return (
    <span className={`flex shrink-0 items-center justify-center bg-foreground ${className}`}>
      <img src={BROADCAST_CONFIG.logo || '/placeholder.svg'} alt="성사중학교 교표" className="h-[86%] w-auto object-contain" />
    </span>
  )
}

export function ChannelLogo({ className = '' }: { className?: string }) {
  return (
    <div className={`bc-blue flex items-center gap-4 pl-3 pr-6 ${className}`}>
      <SchoolEmblem className="size-16 rounded-sm" />
      <span className="flex flex-col text-base font-black leading-tight">
        <span className="text-lg">성사중학교</span>
        <span className="font-mono text-3xl font-bold leading-none tracking-tight">2026</span>
      </span>
    </div>
  )
}

export function HeaderBug({ config, label }: { config: BroadcastConfig; label: string }) {
  const now = useClock()
  return (
    <header className="absolute inset-x-12 top-10 z-30 flex h-[84px] items-stretch justify-between">
      <div className="bc-slide-left flex items-stretch shadow-2xl shadow-black/50">
        <ChannelLogo />
        <div className="bc-panel flex flex-col justify-center px-7">
          <span className="text-base font-bold tracking-[0.2em] text-ink-muted">개표방송</span>
          <span className="text-[30px] font-black leading-tight">{config.electionTitle}</span>
        </div>
        <div className="flex items-center bg-navy-deep px-7 text-2xl font-black text-foreground">{label}</div>
      </div>
      <div className="bc-slide-right flex items-stretch shadow-2xl shadow-black/50">
        <div className="bc-red flex items-center gap-3 px-6">
          <span className="bc-pulse size-3.5 rounded-full bg-foreground" />
          <span className="font-mono text-3xl font-bold tracking-wider">LIVE</span>
        </div>
        <div className="bc-panel flex items-center px-7 font-mono text-5xl font-semibold tabular-nums">
          {now ? `${pad(now.getHours())}:${pad(now.getMinutes())}` : '--:--'}
          <span className="ml-1 text-3xl text-ink-muted">{now ? `:${pad(now.getSeconds())}` : ''}</span>
        </div>
      </div>
    </header>
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
  const line = items.join('   ▪   ')
  const duration = Math.max(30, line.length * 0.3)

  return (
    <div className="absolute inset-x-0 bottom-0 z-30 flex h-[76px] items-stretch shadow-[0_-12px_32px_rgb(0_0_0/0.45)]">
      <div className="bc-red flex shrink-0 items-center gap-3 px-9 text-[28px] font-black">
        <span className="bc-pulse size-3 rounded-full bg-foreground" />
        개표 속보
      </div>
      <div className="bc-panel relative flex-1 overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 flex items-center whitespace-nowrap text-[30px] font-bold"
          style={{ animation: `bc-marquee ${duration}s linear infinite` }}
        >
          <span className="pl-12 pr-24">{line}</span>
          <span className="pl-12 pr-24" aria-hidden="true">
            {line}
          </span>
        </div>
      </div>
      <div className="bc-blue flex shrink-0 items-center px-8 text-xl font-bold">선거관리위원회 집계</div>
    </div>
  )
}

export function SceneTransition({ triggerKey }: { triggerKey: number }) {
  if (triggerKey === 0) return null
  return (
    <div key={triggerKey} className="pointer-events-none absolute inset-0 z-50 overflow-hidden" aria-hidden="true">
      <div
        className="bc-red absolute inset-0"
        style={{ animation: 'bc-transition 1.1s cubic-bezier(0.77, 0, 0.18, 1) both' }}
      />
      <div
        className="bc-blue absolute inset-0 flex items-center justify-center"
        style={{ animation: 'bc-transition 1.1s cubic-bezier(0.77, 0, 0.18, 1) 0.07s both' }}
      >
        <div className="flex items-center gap-10">
          <SchoolEmblem className="size-44 rounded-md" />
          <span className="flex flex-col text-6xl font-black leading-tight">
            <span>성사중학교</span>
            <span className="font-mono text-[120px] font-bold leading-none">2026</span>
          </span>
        </div>
      </div>
    </div>
  )
}
