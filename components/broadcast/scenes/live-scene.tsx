'use client'

import type { CandidateView } from '@/lib/types'
import { CountUp, RiseBadge, useRiseEvent } from '../primitives'
import { CandidateColumn, CandidateColumns, RaceTag } from './candidate-column'
import type { SceneProps } from './types'

function VoteBlock({ candidate: c }: { candidate: CandidateView }) {
  const rise = useRiseEvent(c.votes)
  const leading = c.rank === 1 && c.votes > 0
  return (
    <div className="flex items-end gap-6">
      <span
        key={rise ? `votes-${rise.id}` : 'votes'}
        className={`relative flex items-baseline gap-2 font-mono font-extrabold leading-none text-foreground ${rise ? 'bc-vote-pop' : ''}`}
      >
        <CountUp value={c.votes} className="text-[112px]" />
        <span className="font-sans text-4xl font-black">표</span>
        <RiseBadge event={rise} color={c.color} />
      </span>
      <span className="flex flex-col items-start gap-2 pb-2">
        <span
          className={`rounded-md bg-primary px-3 py-1 text-2xl font-black leading-none text-primary-foreground ${leading ? '' : 'invisible'}`}
        >
          현재 1위
        </span>
        <span className="font-mono text-5xl font-bold leading-none" style={{ color: c.color }}>
          <CountUp value={c.pct} decimals={1} />%
        </span>
      </span>
    </div>
  )
}

function ShareBar({ candidates, hasVotes }: { candidates: CandidateView[]; hasVotes: boolean }) {
  return (
    <div className="bc-wipe flex h-14 shrink-0 gap-1 overflow-hidden rounded-lg" style={{ animationDelay: '0.6s' }} aria-label="득표율 비교">
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
  )
}

export function LiveScene({ results }: SceneProps) {
  const { candidates, stats } = results
  const leader = stats.leader
  const updated = results.updatedAt
    ? new Date(results.updatedAt).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false })
    : null
  const headline = leader && stats.margin > 0 ? `기호 ${leader.number}번 ${leader.name} 후보 우세` : '실시간 개표 현황'
  const photo =
    candidates.length > 3 ? { width: 220, height: 264 } : candidates.length > 2 ? { width: 290, height: 348 } : { width: 320, height: 384 }

  return (
    <div className="absolute inset-0 flex flex-col gap-4 px-20 pb-[148px] pt-[172px]">
      <div className="bc-rise flex items-center justify-center gap-6">
        <RaceTag title={results.raceTitle} />
        <h2 className="text-6xl font-black leading-tight tracking-tight">{headline}</h2>
        {updated && <span className="text-2xl font-medium text-muted-foreground">{updated} 현재</span>}
      </div>
      <CandidateColumns>
        {candidates.map((c, i) => (
          <CandidateColumn key={c.number} candidate={c} index={i} photo={photo} nameSize="text-5xl">
            <VoteBlock candidate={c} />
          </CandidateColumn>
        ))}
      </CandidateColumns>
      <ShareBar candidates={candidates} hasVotes={stats.validVotes > 0} />
    </div>
  )
}
