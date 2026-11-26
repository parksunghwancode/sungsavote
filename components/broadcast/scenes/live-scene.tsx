'use client'

import type { CandidateView } from '@/lib/types'
import { CountUp, RiseBadge, useRiseEvent } from '../primitives'
import { CandidateColumn, CandidateColumns, RaceTag } from './candidate-column'
import type { SceneProps } from './types'

function VoteBlock({ candidate: c }: { candidate: CandidateView }) {
  const rise = useRiseEvent(c.votes)
  const leading = c.rank === 1 && c.votes > 0
  return (
    <div className="flex flex-col items-center gap-3">
      <span
        key={rise ? `votes-${rise.id}` : 'votes'}
        className={`relative flex items-baseline gap-3 font-mono font-extrabold leading-none text-foreground ${rise ? 'bc-vote-pop' : ''}`}
      >
        <CountUp value={c.votes} className="text-[136px]" />
        <span className="font-sans text-5xl font-black">표</span>
        <RiseBadge event={rise} color={c.color} />
      </span>
      <span className="font-mono text-6xl font-bold leading-none text-muted-foreground">
        <CountUp value={c.pct} decimals={1} />%
      </span>
      <span
        className={`rounded-full px-8 py-2 text-3xl font-black ${leading ? 'bg-primary text-primary-foreground' : 'invisible'}`}
      >
        현재 1위
      </span>
    </div>
  )
}

export function LiveScene({ results }: SceneProps) {
  const { candidates, stats } = results
  const leader = stats.leader
  const updated = results.updatedAt
    ? new Date(results.updatedAt).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false })
    : null
  const headline = leader && stats.margin > 0 ? `기호 ${leader.number}번 ${leader.name} 후보 우세` : '실시간 개표 현황'
  const many = candidates.length > 3

  return (
    <div className="absolute inset-0 flex flex-col gap-4 px-20 pb-[160px] pt-[180px]">
      <div className="bc-rise flex flex-col items-center gap-2">
        <div className="flex items-center gap-6">
          <RaceTag title={results.raceTitle} />
          <h2 className="text-[68px] font-black leading-tight tracking-tight">{headline}</h2>
        </div>
        {updated && <p className="text-2xl font-medium text-muted-foreground">{updated} 현재 집계</p>}
      </div>
      <CandidateColumns>
        {candidates.map((c, i) => (
          <CandidateColumn
            key={c.number}
            candidate={c}
            index={i}
            photo={many ? { width: 150, height: 180 } : { width: 180, height: 216 }}
            nameSize="text-5xl"
          >
            <VoteBlock candidate={c} />
          </CandidateColumn>
        ))}
      </CandidateColumns>
    </div>
  )
}
