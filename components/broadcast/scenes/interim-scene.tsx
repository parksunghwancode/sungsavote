'use client'

import { CountUp } from '../primitives'
import { CandidateColumn, CandidateColumns, RaceTag } from './candidate-column'
import type { SceneProps } from './types'

export function InterimScene({ results }: SceneProps) {
  const { candidates, stats } = results
  const hasVotes = stats.validVotes > 0

  return (
    <div className="absolute inset-0 flex flex-col gap-8 px-20 pb-[120px] pt-[188px]">
      <div className="bc-rise flex items-center justify-center gap-6">
        {results.raceTitle ? (
          <RaceTag title={results.raceTitle} />
        ) : (
          <RaceTag title="중간 집계" />
        )}
        <h2 className="text-[68px] font-black leading-tight tracking-tight">개표 중간 상황</h2>
        <span className="text-[68px] font-black leading-tight text-muted-foreground">
          개표율{' '}
          <span className="font-mono text-primary">
            {stats.countRate === null ? '—' : <CountUp value={stats.countRate} decimals={1} />}
            {stats.countRate !== null && '%'}
          </span>
        </span>
      </div>

      <CandidateColumns>
        {candidates.map((c, i) => (
          <CandidateColumn key={c.number} candidate={c} index={i} photo={{ width: 210, height: 256 }} nameSize="text-5xl">
            <div className="flex items-baseline gap-6">
              <span className="font-mono text-[150px] font-extrabold leading-none" style={{ color: c.color }}>
                <CountUp value={c.pct} decimals={1} />
                <span className="text-7xl">%</span>
              </span>
              <span className="font-mono text-5xl font-bold text-muted-foreground">
                <CountUp value={c.votes} />
                <span className="ml-1 font-sans text-3xl">표</span>
              </span>
            </div>
          </CandidateColumn>
        ))}
      </CandidateColumns>

      <div className="bc-wipe flex h-14 gap-1 overflow-hidden rounded-lg" style={{ animationDelay: '0.6s' }} aria-label="득표율 비교">
        {candidates.map((c) => (
          <div
            key={c.number}
            className="flex items-center justify-center overflow-hidden whitespace-nowrap text-2xl font-black text-primary-foreground"
            style={{
              flexGrow: hasVotes ? c.pct : 1,
              flexBasis: 0,
              background: c.color,
              transition: 'flex-grow 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            {c.name} {c.pct.toFixed(1)}%
          </div>
        ))}
      </div>
    </div>
  )
}
