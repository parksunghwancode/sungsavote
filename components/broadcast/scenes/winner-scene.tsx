'use client'

import { CandidatePhoto, CountUp } from '../primitives'
import { RaceTag } from './candidate-column'
import type { SceneProps } from './types'

export function WinnerScene({ results }: SceneProps) {
  const winner = results.stats.leader

  if (!winner) {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <p className="text-6xl font-black text-muted-foreground">개표 결과를 집계하고 있습니다</p>
      </div>
    )
  }

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-14 px-20 pb-[150px] pt-[170px]">
      <div className="bc-rise flex items-center gap-6">
        <RaceTag title={results.raceTitle} />
        <h2 className="text-[64px] font-black leading-tight tracking-tight">당선자 발표</h2>
      </div>

      <div className="flex items-center gap-20">
        <CandidatePhoto
          candidate={winner}
          className="bc-rise"
          style={{ width: 340, height: 408, animationDelay: '0.15s' }}
        />

        <div className="bc-rise flex flex-col items-start gap-6" style={{ animationDelay: '0.3s' }}>
          <span className="text-5xl font-black leading-none" style={{ color: winner.color }}>
            기호 {winner.number}번
          </span>
          <span className="text-[120px] font-black leading-none tracking-tight text-foreground">{winner.name}</span>
          <div className="flex items-baseline gap-8">
            <span className="flex items-baseline gap-3 font-mono font-extrabold leading-none text-foreground">
              <CountUp value={winner.votes} duration={2000} className="text-[96px]" />
              <span className="font-sans text-4xl font-black">표</span>
            </span>
            <span className="font-mono text-5xl font-bold leading-none text-muted-foreground">
              <CountUp value={winner.pct} decimals={1} duration={2000} />%
            </span>
          </div>
          <span
            className="bc-wipe rounded-lg bg-primary px-10 py-3 text-5xl font-black text-primary-foreground"
            style={{ animationDelay: '1.2s' }}
          >
            당선 확정
          </span>
        </div>
      </div>
    </div>
  )
}
