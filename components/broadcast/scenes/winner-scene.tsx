'use client'

import { CandidatePhoto, CountUp, NumberChip, StudioBackdrop } from '../primitives'
import type { SceneProps } from './types'

function ElectedStamp() {
  return (
    <div
      className="bc-stamp bc-red absolute -right-20 -top-16 z-20 flex size-60 items-center justify-center rounded-full shadow-[0_24px_48px_rgb(0_0_0/0.55)]"
      style={{ animationDelay: '1.3s' }}
    >
      <span className="absolute inset-3 rounded-full border-4 border-foreground/85" aria-hidden="true" />
      <span className="relative text-center text-[88px] font-black leading-none tracking-tight">당선</span>
    </div>
  )
}

export function WinnerScene({ config, results }: SceneProps) {
  const winner = results.stats.leader
  if (!winner) {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <StudioBackdrop dim={0.6} />
        <div className="bc-panel relative px-16 py-10 text-5xl font-black">개표 결과를 집계하고 있습니다</div>
      </div>
    )
  }

  return (
    <div className="absolute inset-0 overflow-hidden">
      <StudioBackdrop dim={0.5} tint="rgb(242 182 48 / 0.16)" />
      <div className="relative z-10 flex h-full items-center gap-24 px-36 pt-24">
        <div className="bc-rise relative shrink-0" style={{ animationDelay: '0.2s' }}>
          <div className="bc-panel p-3">
            <CandidatePhoto candidate={winner} className="h-[700px] w-[540px] text-[220px]" />
          </div>
          <div className="h-3" style={{ background: winner.color }} />
          <ElectedStamp />
        </div>

        <div className="flex flex-1 flex-col gap-8">
          <p className="bc-slide-right text-4xl font-bold tracking-[0.15em] text-foreground/85">
            {config.electionTitle}
          </p>
          <div className="bc-red bc-wipe w-fit px-10 py-4 text-[64px] font-black leading-none shadow-2xl shadow-black/50" style={{ animationDelay: '0.45s' }}>
            {config.winnerLabel}
          </div>
          <div className="bc-slide-right flex items-center gap-6" style={{ animationDelay: '0.7s' }}>
            <NumberChip number={winner.number} color={winner.color} className="size-24 text-6xl" />
            <span className="text-4xl font-black text-foreground/85">기호 {winner.number}번</span>
          </div>
          <h2 className="bc-slide-right text-[190px] font-black leading-[0.95] tracking-tight" style={{ animationDelay: '0.85s' }}>
            {winner.name}
          </h2>
          <div className="bc-rise mt-2 flex w-fit items-stretch shadow-2xl shadow-black/50" style={{ animationDelay: '1.05s' }}>
            <div className="bc-panel flex flex-col gap-2 px-10 py-6">
              <span className="text-2xl font-bold text-ink-muted">득표수</span>
              <span className="font-mono text-7xl font-bold leading-none">
                <CountUp value={winner.votes} duration={2000} />
                <span className="ml-1 font-sans text-3xl">표</span>
              </span>
            </div>
            <div className="bc-blue flex flex-col gap-2 px-10 py-6">
              <span className="text-2xl font-bold opacity-85">득표율</span>
              <span className="font-mono text-7xl font-bold leading-none">
                <CountUp value={winner.pct} decimals={1} duration={2000} />
                <span className="text-4xl">%</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
