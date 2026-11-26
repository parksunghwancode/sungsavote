'use client'

import { CountUp } from '../primitives'
import { CandidateColumn, CandidateColumns, RaceTag } from './candidate-column'
import type { SceneProps } from './types'

export function WinnerScene({ results }: SceneProps) {
  const { candidates, stats } = results
  const winner = stats.leader

  if (!winner) {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <p className="text-6xl font-black text-muted-foreground">개표 결과를 집계하고 있습니다</p>
      </div>
    )
  }

  const many = candidates.length > 3

  return (
    <div className="absolute inset-0 flex flex-col gap-4 px-20 pb-[160px] pt-[180px]">
      <div className="bc-rise flex items-center justify-center gap-6">
        <RaceTag title={results.raceTitle} />
        <h2 className="text-[72px] font-black leading-tight tracking-tight">
          기호 {winner.number}번 {winner.name} 후보 당선 확정
        </h2>
      </div>
      <CandidateColumns>
        {candidates.map((c, i) => {
          const isWinner = c.number === winner.number
          return (
            <CandidateColumn
              key={c.number}
              candidate={c}
              index={i}
              photo={many ? { width: 150, height: 180 } : { width: 180, height: 216 }}
              nameSize="text-5xl"
              dimmed={!isWinner}
            >
              <div className="flex flex-col items-center gap-3">
                <span className="flex items-baseline gap-3 font-mono font-extrabold leading-none text-foreground">
                  <CountUp value={c.votes} duration={2000} className="text-[136px]" />
                  <span className="font-sans text-5xl font-black">표</span>
                </span>
                <span className="font-mono text-6xl font-bold leading-none text-muted-foreground">
                  <CountUp value={c.pct} decimals={1} duration={2000} />%
                </span>
                <span
                  className={`bc-stamp rounded-full px-10 py-2 text-4xl font-black ${isWinner ? 'bg-primary text-primary-foreground' : 'invisible'}`}
                  style={{ animationDelay: '1.2s' }}
                >
                  당선 확정
                </span>
              </div>
            </CandidateColumn>
          )
        })}
      </CandidateColumns>
    </div>
  )
}
