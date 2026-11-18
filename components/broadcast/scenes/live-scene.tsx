'use client'

import { Backdrop, CandidatePhoto, CountUp } from '../primitives'
import type { SceneProps } from './types'

function ProgressRing({ value, label }: { value: number | null; label: string }) {
  const r = 120
  const len = 2 * Math.PI * r
  const pct = value ?? 0
  return (
    <div className="relative flex size-[300px] items-center justify-center">
      <svg viewBox="0 0 300 300" className="absolute inset-0 -rotate-90" aria-hidden="true">
        <circle cx="150" cy="150" r={r} fill="none" stroke="var(--border)" strokeWidth="18" />
        <circle
          cx="150"
          cy="150"
          r={r}
          fill="none"
          stroke="var(--gold)"
          strokeWidth="18"
          strokeDasharray={len}
          strokeDashoffset={len * (1 - pct / 100)}
          style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.16, 1, 0.3, 1)' }}
        />
      </svg>
      <div className="flex flex-col items-center">
        <span className="text-2xl font-bold text-muted-foreground">{label}</span>
        <span className="font-mono text-8xl font-bold leading-none">
          {value === null ? '—' : <CountUp value={value} decimals={1} />}
          {value !== null && <span className="text-5xl">%</span>}
        </span>
      </div>
    </div>
  )
}

function Stat({ label, value, suffix = '표' }: { label: string; value: number | null; suffix?: string }) {
  return (
    <div className="flex items-center justify-between border-b border-border py-4">
      <span className="text-2xl font-medium text-muted-foreground">{label}</span>
      <span className="font-mono text-4xl font-semibold">
        {value === null ? '—' : <CountUp value={value} />}
        <span className="ml-1 font-sans text-xl text-muted-foreground">{value === null ? '' : suffix}</span>
      </span>
    </div>
  )
}

export function LiveScene({ results }: SceneProps) {
  const { candidates, stats } = results
  const ranked = results.ranked
  const maxPct = Math.max(1, ...candidates.map((c) => c.pct))

  return (
    <div className="absolute inset-0 overflow-hidden">
      <Backdrop />
      <div className="relative z-10 flex h-full gap-10 px-12 pb-[110px] pt-[150px]">
        <section className="flex flex-1 flex-col gap-5" aria-label="후보별 득표 현황">
          <div className="bc-rise flex items-end justify-between">
            <h2 className="text-5xl font-black">
              후보별 득표 현황
              <span className="ml-4 text-2xl font-bold text-muted-foreground">유효표 기준 득표율</span>
            </h2>
            <span className="text-2xl font-bold text-muted-foreground">
              {results.updatedAt ? `${new Date(results.updatedAt).toLocaleTimeString('ko-KR', { hour12: false })} 기준` : ''}
            </span>
          </div>
          <ol className="flex flex-1 flex-col gap-4">
            {ranked.map((c, i) => {
              const leading = c.rank === 1 && c.votes > 0
              return (
                <li
                  key={c.number}
                  className="bc-slide-left relative flex flex-1 items-stretch overflow-hidden bg-navy/90"
                  style={{ animationDelay: `${0.1 + i * 0.12}s`, order: i, boxShadow: leading ? `inset 0 0 0 3px var(--gold)` : undefined }}
                >
                  <div className="flex w-24 shrink-0 flex-col items-center justify-center bg-navy-deep">
                    <span className="font-mono text-6xl font-bold leading-none" style={{ color: leading ? 'var(--gold)' : 'var(--foreground)' }}>
                      {c.rank}
                    </span>
                    <span className="text-lg font-bold text-muted-foreground">위</span>
                  </div>
                  <CandidatePhoto candidate={c} className="w-40 shrink-0 text-6xl" />
                  <div className="relative flex flex-1 flex-col justify-center gap-3 px-8">
                    <div className="flex items-baseline justify-between gap-6">
                      <div className="flex items-baseline gap-4">
                        <span className="px-3 py-0.5 font-mono text-3xl font-bold" style={{ background: c.color }}>
                          {c.number}
                        </span>
                        <span className="text-5xl font-black">{c.name}</span>
                        {leading && <span className="bg-gold px-3 py-1 text-xl font-black text-accent-foreground">선두</span>}
                      </div>
                      <div className="flex items-baseline gap-6">
                        <span className="font-mono text-5xl font-semibold">
                          <CountUp value={c.votes} />
                          <span className="ml-1 font-sans text-2xl text-muted-foreground">표</span>
                        </span>
                        <span className="w-48 text-right font-mono text-7xl font-bold" style={{ color: leading ? 'var(--gold)' : 'var(--foreground)' }}>
                          <CountUp value={c.pct} decimals={1} />
                          <span className="text-4xl">%</span>
                        </span>
                      </div>
                    </div>
                    <div className="relative h-6 overflow-hidden bg-navy-deep">
                      <div
                        className="relative h-full overflow-hidden"
                        style={{
                          width: `${(c.pct / maxPct) * 100}%`,
                          background: c.color,
                          transition: 'width 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
                        }}
                      >
                        <div className="absolute inset-y-0 w-1/4 bg-gradient-to-r from-transparent via-foreground/40 to-transparent" style={{ animation: 'bc-shine 2.4s ease-in-out infinite' }} />
                      </div>
                    </div>
                  </div>
                </li>
              )
            })}
          </ol>
        </section>

        <aside className="bc-slide-right flex w-[520px] shrink-0 flex-col gap-6 bg-navy/90 p-8" aria-label="개표 진행 현황">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-black">개표 진행</h2>
          </div>
          <div className="flex justify-center">
            <ProgressRing value={stats.countRate} label="개표율" />
          </div>
          <div className="flex flex-col">
            <Stat label="총 투표수" value={stats.totalBallots} />
            <Stat label="개표 완료" value={stats.counted} />
            <Stat label="남은 투표지" value={stats.remaining} />
            <Stat label="무효표" value={stats.invalid} />
            <Stat label="투표율" value={stats.turnout} suffix="%" />
          </div>
          {stats.leader && stats.runnerUp && (
            <div className="mt-auto flex flex-col gap-2 bg-navy-deep p-5">
              <span className="text-xl font-bold text-muted-foreground">1·2위 격차</span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-bold">
                  {stats.leader.name} - {stats.runnerUp.name}
                </span>
                <span className="font-mono text-5xl font-bold text-gold">
                  <CountUp value={stats.margin} />
                  <span className="ml-1 font-sans text-2xl">표</span>
                </span>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}
