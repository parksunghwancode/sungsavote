'use client'

import { CandidatePhoto, CountUp, NumberChip, StudioBackdrop } from '../primitives'
import type { SceneProps } from './types'

export function InterimScene({ results }: SceneProps) {
  const { candidates, stats } = results
  const hasVotes = stats.validVotes > 0

  return (
    <div className="absolute inset-0 overflow-hidden">
      <StudioBackdrop dim={0.55} />
      <div className="relative z-10 flex h-full flex-col gap-10 px-16 pb-[124px] pt-[164px]">
        <div className="flex items-end justify-between">
          <div className="bc-slide-left flex flex-col gap-3">
            <span className="bc-red w-fit px-5 py-1.5 text-2xl font-black">중간 집계</span>
            <h2 className="text-[80px] font-black leading-none">개표 중간 상황</h2>
          </div>
          <div className="bc-panel bc-slide-right flex items-stretch">
            <span className="bc-blue flex items-center px-7 text-3xl font-black">현재 개표율</span>
            <span className="flex items-baseline px-8 py-3 font-mono text-[96px] font-bold leading-none">
              {stats.countRate === null ? '—' : <CountUp value={stats.countRate} decimals={1} />}
              {stats.countRate !== null && <span className="text-5xl">%</span>}
            </span>
          </div>
        </div>

        <ul className="flex flex-1 gap-8">
          {candidates.map((c, i) => {
            const leading = c.rank === 1 && c.votes > 0
            return (
              <li
                key={c.number}
                className="bc-panel bc-rise relative flex flex-1 overflow-hidden"
                style={{ animationDelay: `${0.2 + i * 0.12}s`, boxShadow: leading ? 'inset 0 0 0 6px var(--gold)' : undefined }}
              >
                <CandidatePhoto candidate={c} className="w-[42%] shrink-0 text-[160px]" />
                <div className="flex flex-1 flex-col justify-center gap-4 px-10">
                  {leading && <span className="w-fit bg-gold px-4 py-1 text-2xl font-black text-accent-foreground">현재 1위</span>}
                  <span className="flex items-center gap-4">
                    <NumberChip number={c.number} color={c.color} className="size-14 text-4xl" />
                    <span className="text-6xl font-black">{c.name}</span>
                  </span>
                  <span className="font-mono text-[120px] font-bold leading-none" style={{ color: c.color }}>
                    <CountUp value={c.pct} decimals={1} />
                    <span className="text-6xl">%</span>
                  </span>
                  <span className="font-mono text-5xl font-semibold text-ink-muted">
                    <CountUp value={c.votes} />
                    <span className="ml-1 font-sans text-2xl">표</span>
                  </span>
                </div>
              </li>
            )
          })}
        </ul>

        <div className="bc-wipe flex h-16 overflow-hidden shadow-2xl shadow-black/50" style={{ animationDelay: '0.6s' }} aria-label="득표율 비교">
          {candidates.map((c) => (
            <div
              key={c.number}
              className="flex items-center justify-center overflow-hidden whitespace-nowrap text-3xl font-black text-foreground"
              style={{
                flexGrow: hasVotes ? c.pct : 1,
                flexBasis: 0,
                background: `linear-gradient(180deg, color-mix(in srgb, ${c.color} 75%, white), ${c.color} 50%, color-mix(in srgb, ${c.color} 80%, black))`,
                transition: 'flex-grow 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              {c.name} {c.pct.toFixed(1)}%
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
