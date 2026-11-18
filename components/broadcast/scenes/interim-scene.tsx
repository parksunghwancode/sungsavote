'use client'

import { Backdrop, CandidatePhoto, CountUp, LightStreaks } from '../primitives'
import { VideoSlot } from '../video-slot'
import type { SceneProps } from './types'

function InterimGraphic({ results }: SceneProps) {
  const { ranked, stats } = results
  const leader = stats.leader
  const maxVotes = Math.max(1, ...ranked.map((c) => c.votes))

  return (
    <div className="absolute inset-0 overflow-hidden">
      <Backdrop />
      <LightStreaks count={6} />
      <div className="relative z-10 flex h-full flex-col gap-8 px-16 pb-[120px] pt-[160px]">
        <div className="flex items-end justify-between">
          <div className="bc-slide-left flex flex-col gap-2">
            <span className="w-fit bg-live px-4 py-1 text-2xl font-black">중간 집계</span>
            <h2 className="text-7xl font-black">개표 중간 상황</h2>
          </div>
          <div className="bc-slide-right flex items-baseline gap-4 bg-navy/90 px-8 py-4">
            <span className="text-3xl font-bold text-muted-foreground">현재 개표율</span>
            <span className="font-mono text-8xl font-bold text-gold">
              {stats.countRate === null ? '—' : <CountUp value={stats.countRate} decimals={1} />}
              <span className="text-5xl">%</span>
            </span>
          </div>
        </div>

        <div className="flex flex-1 gap-8">
          {leader ? (
            <div className="bc-rise relative flex w-[760px] shrink-0 overflow-hidden bg-navy/90" style={{ boxShadow: 'inset 0 0 0 4px var(--gold)' }}>
              <CandidatePhoto candidate={leader} className="w-[380px] shrink-0 text-[160px]" />
              <div className="flex flex-1 flex-col justify-center gap-4 p-10">
                <span className="w-fit bg-gold px-4 py-1 text-3xl font-black text-accent-foreground">현재 1위</span>
                <span className="text-3xl font-bold text-muted-foreground">기호 {leader.number}번</span>
                <span className="text-8xl font-black leading-none">{leader.name}</span>
                <span className="font-mono text-[110px] font-bold leading-none" style={{ color: leader.color }}>
                  <CountUp value={leader.pct} decimals={1} />
                  <span className="text-6xl">%</span>
                </span>
                <span className="font-mono text-4xl font-semibold">
                  <CountUp value={leader.votes} />
                  <span className="ml-1 font-sans text-2xl text-muted-foreground">표</span>
                </span>
                {stats.runnerUp && (
                  <span className="text-2xl font-bold text-gold">2위와 {stats.margin.toLocaleString()}표 차</span>
                )}
              </div>
            </div>
          ) : (
            <div className="flex w-[760px] items-center justify-center bg-navy/90 text-4xl font-bold text-muted-foreground">
              개표 대기 중
            </div>
          )}

          <div className="flex flex-1 items-end justify-around gap-8 bg-navy/60 px-10 pb-8 pt-12">
            {ranked.map((c, i) => (
              <div key={c.number} className="flex h-full flex-1 flex-col items-center justify-end gap-3">
                <span className="font-mono text-4xl font-bold">
                  <CountUp value={c.votes} />
                </span>
                <div
                  className="w-full origin-bottom"
                  style={{
                    height: `${(c.votes / maxVotes) * 62}%`,
                    minHeight: 8,
                    background: `linear-gradient(to top, ${c.color}, color-mix(in srgb, ${c.color} 55%, var(--foreground)))`,
                    transition: 'height 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
                    animation: `bc-rise 0.9s cubic-bezier(0.16, 1, 0.3, 1) ${0.2 + i * 0.12}s both`,
                  }}
                />
                <CandidatePhoto candidate={c} className="size-24 rounded-full text-4xl" />
                <span className="text-3xl font-black">{c.name}</span>
                <span className="text-xl font-bold text-muted-foreground">
                  기호 {c.number} · {c.rank}위
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export function InterimScene(props: SceneProps) {
  return (
    <VideoSlot
      scene="interim"
      control={props.control}
      media={props.media}
      muted={props.muted}
      fallback={<InterimGraphic {...props} />}
    />
  )
}
