'use client'

import { useEffect, useState } from 'react'
import type { BroadcastConfig } from "@/lib/config"
import type { ResultsState } from '@/hooks/use-results'
import { SCENES, type SceneKey } from '@/lib/types'

function useClock() {
  const [now, setNow] = useState<Date | null>(null)
  useEffect(() => {
    setNow(new Date())
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  return now
}

export function HeaderBug({ config, scene }: { config: BroadcastConfig; scene: SceneKey }) {
  const now = useClock()
  const label = SCENES.find((s) => s.key === scene)?.label
  return (
    <header className="absolute inset-x-12 top-10 z-30 flex items-stretch justify-between">
      <div className="bc-slide-left flex items-stretch shadow-2xl shadow-black/60">
        <div className="flex items-center gap-3 bg-primary px-6 text-primary-foreground">
          <span className="font-mono text-4xl font-bold leading-none">2026</span>
          <span className="flex flex-col text-sm font-bold leading-tight">
            <span>선택</span>
            <span>우리학교</span>
          </span>
        </div>
        <div className="flex flex-col justify-center bg-navy/95 px-6 py-3 backdrop-blur">
          <span className="text-sm font-medium tracking-widest text-muted-foreground">{config.schoolName}</span>
          <span className="text-2xl font-black leading-tight">{config.electionTitle}</span>
        </div>
        <div className="flex items-center border-l border-border bg-navy-deep/95 px-6 text-xl font-bold text-gold">
          {label}
        </div>
      </div>
      <div className="bc-slide-right flex items-stretch shadow-2xl shadow-black/60">
        <div className="flex items-center gap-3 bg-live px-5 text-foreground">
          <span className="bc-pulse size-3 rounded-full bg-foreground" />
          <span className="font-mono text-2xl font-bold tracking-wider">LIVE</span>
        </div>
        <div className="flex items-center bg-navy/95 px-6 font-mono text-4xl font-semibold tabular-nums">
          {now ? now.toLocaleTimeString('ko-KR', { hour12: false }) : '--:--:--'}
        </div>
      </div>
    </header>
  )
}

export function Ticker({ config, results }: { config: BroadcastConfig; results: ResultsState }) {
  const { stats, ranked } = results
  const summary =
    ranked.length
      ? [
          stats.countRate !== null ? `개표율 ${stats.countRate.toFixed(1)}%` : null,
          ...ranked.map((c) => `${c.rank}위 기호 ${c.number}번 ${c.name} ${c.votes.toLocaleString()}표 (${c.pct.toFixed(1)}%)`),
          stats.leader && stats.runnerUp ? `1·2위 격차 ${stats.margin.toLocaleString()}표` : null,
        ].filter(Boolean)
      : []
  const items = [config.ticker, ...summary].filter(Boolean) as string[]
  const line = items.join('     ◆     ')
  const duration = Math.max(30, line.length * 0.28)

  return (
    <div className="absolute inset-x-0 bottom-0 z-30 flex h-[72px] items-stretch border-t-2 border-primary bg-navy-deep/95 backdrop-blur">
      <div className="flex shrink-0 items-center gap-3 bg-live px-8 text-2xl font-black text-foreground">
        <span className="bc-pulse size-2.5 rounded-full bg-foreground" />
        개표 속보
      </div>
      <div className="relative flex-1 overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 flex items-center whitespace-nowrap text-[28px] font-bold"
          style={{ animation: `bc-marquee ${duration}s linear infinite` }}
        >
          <span className="pr-24 pl-12">{line}</span>
          <span className="pr-24 pl-12" aria-hidden="true">
            {line}
          </span>
        </div>
      </div>
      <div className="flex shrink-0 items-center bg-navy px-6 text-lg font-bold text-muted-foreground">
        실시간 집계
      </div>
    </div>
  )
}

export function SceneTransition({ triggerKey }: { triggerKey: number }) {
  if (triggerKey === 0) return null
  return (
    <div key={triggerKey} className="pointer-events-none absolute inset-0 z-50 overflow-hidden" aria-hidden="true">
      <div
        className="absolute inset-0 flex items-center justify-center bg-primary"
        style={{ animation: 'bc-transition 1.2s cubic-bezier(0.77, 0, 0.18, 1) both' }}
      />
      <div
        className="absolute inset-0 flex items-center justify-center bg-navy-deep"
        style={{ animation: 'bc-transition 1.2s cubic-bezier(0.77, 0, 0.18, 1) 0.08s both' }}
      >
        <div className="flex items-center gap-6">
          <span className="font-mono text-8xl font-bold text-primary">2026</span>
          <span className="h-20 w-1 bg-gold" />
          <span className="text-6xl font-black">선택 우리학교</span>
        </div>
      </div>
    </div>
  )
}
