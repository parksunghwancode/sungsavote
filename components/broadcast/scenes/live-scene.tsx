'use client'

import type { ResultsState } from '@/hooks/use-results'
import type { CandidateView } from '@/lib/types'
import { CountUp, RiseBadge, useRiseEvent } from '../primitives'
import { CandidateColumns, CandidateIdentity } from './candidate-column'
import type { SceneProps } from './types'

const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)'

function CountProgress({ results }: { results: ResultsState }) {
  const { stats } = results
  const rate = stats.countRate ?? 0
  return (
    <div className="flex w-[820px] shrink-0 flex-col gap-3">
      <div className="flex items-end justify-between gap-6">
        <span className="pb-2 text-[26px] font-medium text-muted-foreground">개표 진행 중</span>
        <span className="flex items-baseline gap-6">
          <span className="flex items-baseline gap-2 font-mono font-bold leading-none tabular-nums text-primary">
            <span className="text-[68px]">{stats.countRate === null ? '—' : <CountUp value={stats.countRate} decimals={1} />}</span>
            <span className="text-4xl">%</span>
          </span>
          <span className="text-[28px] font-medium tabular-nums text-muted-foreground">
            {stats.counted.toLocaleString()}
            {stats.totalBallots !== null && ` / ${stats.totalBallots.toLocaleString()}`}표
          </span>
        </span>
      </div>
      <div
        className="h-3.5 overflow-hidden rounded-full bg-muted"
        role="progressbar"
        aria-valuenow={rate}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="개표율"
      >
        <div className="h-full rounded-full bg-primary" style={{ width: `${rate}%`, transition: `width 1.2s ${EASE}` }} />
      </div>
      <div className="flex justify-between text-xl font-medium text-muted-foreground">
        <span>전체 투표함 기준</span>
        {stats.remaining !== null && <span>남은 표 {stats.remaining.toLocaleString()}표</span>}
      </div>
    </div>
  )
}

function VoteStats({ candidate: c, compact }: { candidate: CandidateView; compact: boolean }) {
  const rise = useRiseEvent(c.votes)
  return (
    <div className={`flex w-full flex-col ${compact ? 'gap-3' : 'gap-5'}`}>
      <span className="flex items-baseline gap-3 font-mono font-bold leading-none tabular-nums text-foreground">
        <CountUp value={c.pct} decimals={1} className={compact ? 'text-[64px]' : 'text-[136px]'} />
        <span className={compact ? 'text-4xl' : 'text-5xl'} style={{ color: c.color }}>
          %
        </span>
      </span>
      <div className={`${compact ? 'h-3' : 'h-4'} overflow-hidden rounded-full bg-muted`} aria-hidden="true">
        <div
          className="h-full rounded-full"
          style={{ width: `${c.pct}%`, background: c.color, transition: `width 1.2s ${EASE}` }}
        />
      </div>
      <div className={`flex items-center justify-between border-t border-border ${compact ? 'pt-3' : 'pt-5'}`}>
        <span className={`${compact ? 'text-[22px]' : 'text-[26px]'} font-medium text-muted-foreground`}>득표수</span>
        <span
          key={rise ? `votes-${rise.id}` : 'votes'}
          className={`relative flex items-baseline gap-2 font-mono font-bold leading-none tabular-nums text-foreground ${rise ? 'bc-vote-pop' : ''}`}
        >
          <CountUp value={c.votes} className={compact ? 'text-[44px]' : 'text-6xl'} />
          <span className={`font-sans ${compact ? 'text-xl' : 'text-2xl'} font-bold`}>표</span>
          <RiseBadge event={rise} color={c.color} />
        </span>
      </div>
    </div>
  )
}

function ResultCard({ candidate: c, index, total }: { candidate: CandidateView; index: number; total: number }) {
  const leading = c.rank === 1 && c.votes > 0
  const wide = total <= 2
  const photo = wide ? { width: 300, height: 360 } : total > 3 ? { width: 190, height: 228 } : { width: 240, height: 288 }
  return (
    <li
      className={`bc-rise relative flex flex-1 items-center gap-12 rounded-3xl border bg-card ${
        wide ? 'flex-row p-10' : 'flex-col justify-center gap-4 px-8 py-7'
      } ${leading ? 'border-primary shadow-[0_0_0_2px_var(--primary)]' : 'border-border'}`}
      style={{ animationDelay: `${0.15 + index * 0.12}s` }}
    >
      <span
        className={`absolute right-8 top-8 rounded-full px-5 py-2 text-2xl font-bold leading-none ${
          leading ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'
        } ${c.votes > 0 ? '' : 'invisible'}`}
      >
        {leading ? '현재 1위' : `${c.rank}위`}
      </span>
      <CandidateIdentity candidate={c} photo={photo} nameSize={wide ? 'text-6xl' : 'text-4xl'} />
      <VoteStats candidate={c} compact={!wide} />
    </li>
  )
}

export function LiveScene({ results }: SceneProps) {
  const { candidates, stats } = results
  const leader = stats.leader
  const updated = results.updatedAt
    ? new Date(results.updatedAt).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false })
    : null
  const headline = leader && stats.margin > 0 ? `기호 ${leader.number}번 ${leader.name} 후보 우세` : '실시간 개표 현황'
  const eyebrow = [results.raceTitle, updated && `${updated} 현재`].filter(Boolean).join(' · ')

  return (
    <div className="absolute inset-0 flex flex-col gap-8 px-16 pb-[148px] pt-[172px]">
      <div className="bc-rise flex items-end justify-between gap-12">
        <div className="flex min-w-0 flex-col gap-2">
          {eyebrow && <span className="text-[26px] font-medium text-muted-foreground">{eyebrow}</span>}
          <h2 className="text-balance text-[58px] font-bold leading-tight tracking-tight text-foreground">{headline}</h2>
        </div>
        <CountProgress results={results} />
      </div>
      <CandidateColumns className="gap-8">
        {candidates.map((c, i) => (
          <ResultCard key={c.number} candidate={c} index={i} total={candidates.length} />
        ))}
      </CandidateColumns>
    </div>
  )
}
