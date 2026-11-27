'use client'

import { LiveBadge, SchoolLogo } from '../overlays'
import { CandidatePhoto } from '../primitives'
import type { SceneProps } from './types'

export function OpeningScene({ config, results }: SceneProps) {
  const title = results.title || config.electionTitle
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-14 px-24 pt-6">
      <SchoolLogo className="bc-rise h-32" />
      <div className="flex flex-col items-center gap-8">
        <div className="bc-rise flex items-center gap-6" style={{ animationDelay: '0.2s' }}>
          <LiveBadge className="h-16 text-4xl" />
          <span className="text-5xl font-black tracking-[0.3em] text-primary">개표방송</span>
        </div>
        <h1
          className="bc-rise max-w-[1500px] text-balance break-keep text-center text-[120px] font-black leading-[1.08] tracking-tight"
          style={{ animationDelay: '0.35s' }}
        >
          {title}
        </h1>
      </div>
      <div className="bc-wipe h-1.5 w-40 rounded-full bg-primary" style={{ animationDelay: '0.7s' }} aria-hidden="true" />
      <p className="bc-rise text-4xl font-medium text-muted-foreground" style={{ animationDelay: '0.9s' }}>
        잠시 후 개표 현황을 전해드립니다
      </p>
    </div>
  )
}

export function EndingScene({ config, results }: SceneProps) {
  const winners = results.races.flatMap((race) =>
    race.stats.leader ? [{ title: race.raceTitle || config.electionTitle, winner: race.stats.leader }] : [],
  )
  return (
    <div className="absolute inset-0 flex items-center gap-24 px-32 pt-32">
      <div className="flex flex-1 flex-col gap-10">
        <h1 className="bc-rise text-[112px] font-black leading-[1.05] tracking-tight">
          시청해 주셔서
          <br />
          감사합니다
        </h1>
        {winners.map(({ title, winner }, i) => (
          <div
            key={title}
            className="bc-rise flex w-fit items-center gap-8 rounded-3xl border border-border bg-card p-5 pr-12"
            style={{ animationDelay: `${0.3 + i * 0.15}s` }}
          >
            <CandidatePhoto candidate={winner} className="rounded-2xl" style={{ width: 125, height: 150 }} />
            <div className="flex flex-col gap-3">
              <span className="text-2xl font-bold text-muted-foreground">{title} 당선인</span>
              <span className="flex items-baseline gap-4 font-black leading-none">
                <span className="text-4xl" style={{ color: winner.color }}>기호 {winner.number}번</span>
                <span className="text-6xl">{winner.name}</span>
              </span>
            </div>
          </div>
        ))}
      </div>

      <div
        className="bc-fade relative h-[760px] w-[600px] shrink-0 overflow-hidden"
        style={{ maskImage: 'linear-gradient(transparent, black 18%, black 82%, transparent)', animationDelay: '0.3s' }}
      >
        <div
          className="flex flex-col items-center gap-12 pt-[760px] text-center"
          style={{ animation: `bc-credits ${Math.max(16, config.credits.length * 4)}s linear infinite` }}
        >
          {config.credits.map((line, i) => {
            const [role, name] = line.split('|').map((s) => s.trim())
            return (
              <div key={i} className="flex flex-col gap-3">
                {name ? (
                  <>
                    <span className="text-2xl font-bold tracking-[0.3em] text-muted-foreground">{role}</span>
                    <span className="text-5xl font-black">{name}</span>
                  </>
                ) : (
                  <span className="text-balance text-4xl font-bold leading-snug">{role}</span>
                )}
              </div>
            )
          })}
          <span className="pt-10 font-mono text-3xl font-bold tracking-[0.4em] text-primary">ELECTION 2027</span>
        </div>
      </div>
    </div>
  )
}
