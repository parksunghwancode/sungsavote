'use client'

import { CandidatePhoto, CountUp, NumberChip, ShareBar, StudioBackdrop } from '../primitives'
import type { SceneProps } from './types'

function Stat({ label, value, suffix = '표' }: { label: string; value: number | null; suffix?: string }) {
  return (
    <div className="flex items-center justify-between border-b border-border py-5 last:border-0">
      <span className="text-2xl font-bold text-muted-foreground">{label}</span>
      <span className="font-mono text-[44px] font-semibold leading-none">
        {value === null ? '—' : <CountUp value={value} decimals={suffix === '%' ? 1 : 0} />}
        <span className="ml-1 font-sans text-xl text-muted-foreground">{value === null ? '' : suffix}</span>
      </span>
    </div>
  )
}

export function LiveScene({ results }: SceneProps) {
  const { ranked, stats } = results
  const updated = results.updatedAt
    ? new Date(results.updatedAt).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false })
    : null

  return (
    <div className="absolute inset-0 overflow-hidden">
      <StudioBackdrop dim={0.62} />
      <div className="relative z-10 flex h-full gap-8 px-12 pb-[112px] pt-[160px]">
        <section className="flex flex-1 flex-col gap-5" aria-label="후보별 득표 현황">
          <div className="bc-rise flex items-end justify-between">
            <h2 className="flex items-center gap-5 text-5xl font-black">
              <span className="h-12 w-2 bg-live" aria-hidden="true" />
              후보별 득표 현황
            </h2>
            {updated && <span className="text-2xl font-bold text-foreground/70">{updated} 현재</span>}
          </div>
          <ol className="flex flex-1 flex-col gap-4">
            {ranked.map((c, i) => {
              const leading = c.rank === 1 && c.votes > 0
              return (
                <li
                  key={c.number}
                  className="bc-panel bc-slide-left relative flex flex-1 items-stretch overflow-hidden"
                  style={{ animationDelay: `${0.1 + i * 0.12}s` }}
                >
                  <NumberChip number={c.number} color={c.color} className="w-28 text-7xl" />
                  <CandidatePhoto candidate={c} className="w-48 shrink-0 text-7xl" />
                  <div className="flex flex-1 flex-col justify-center gap-5 px-10">
                    <div className="flex items-end justify-between gap-6">
                      <div className="flex items-center gap-5">
                        <span className="text-[68px] font-black leading-none">{c.name}</span>
                        {leading && <span className="bc-red px-4 py-1.5 text-2xl font-black">1위</span>}
                      </div>
                      <div className="flex items-baseline gap-6">
                        <span className="whitespace-nowrap font-mono text-[44px] font-semibold text-ink-muted">
                          <CountUp value={c.votes} />
                          <span className="ml-1 font-sans text-2xl">표</span>
                        </span>
                        <span className="min-w-56 whitespace-nowrap text-right font-mono text-[92px] font-bold leading-none" style={{ color: c.color }}>
                          <CountUp value={c.pct} decimals={1} />
                          <span className="text-5xl">%</span>
                        </span>
                      </div>
                    </div>
                    <ShareBar pct={c.pct} color={c.color} className="h-7" />
                  </div>
                </li>
              )
            })}
          </ol>
        </section>

        <aside className="bc-glass bc-slide-right flex w-[500px] shrink-0 flex-col" aria-label="개표 진행 현황">
          <div className="bc-blue px-9 py-5 text-3xl font-black">개표 진행 상황</div>
          <div className="flex flex-col gap-5 px-9 pt-8">
            <span className="text-2xl font-bold text-muted-foreground">개표율</span>
            <span className="font-mono text-[132px] font-bold leading-none text-gold">
              {stats.countRate === null ? '—' : <CountUp value={stats.countRate} decimals={1} />}
              {stats.countRate !== null && <span className="text-6xl">%</span>}
            </span>
            <div className="h-4 overflow-hidden bg-navy-deep">
              <div
                className="h-full bg-gold"
                style={{ width: `${stats.countRate ?? 0}%`, transition: 'width 1.2s cubic-bezier(0.16, 1, 0.3, 1)' }}
              />
            </div>
          </div>
          <div className="mt-4 flex flex-col px-9">
            <Stat label="총 투표수" value={stats.totalBallots} />
            <Stat label="개표 완료" value={stats.counted} />
            <Stat label="남은 투표지" value={stats.remaining} />
            <Stat label="무효표" value={stats.invalid} />
            <Stat label="투표율" value={stats.turnout} suffix="%" />
          </div>
        </aside>
      </div>
    </div>
  )
}
