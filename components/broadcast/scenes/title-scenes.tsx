'use client'

import { ChannelLogo } from '../overlays'
import { CandidatePhoto, NumberChip, StudioBackdrop } from '../primitives'
import type { SceneProps } from './types'

export function OpeningScene({ config, results }: SceneProps) {
  const title = results.title || config.electionTitle
  return (
    <div className="absolute inset-0 overflow-hidden">
      <StudioBackdrop dim={0.35} />
      <div className="relative z-10 flex h-full flex-col items-center justify-center">
        <ChannelLogo className="bc-rise h-24 shadow-2xl shadow-black/50" />

        <div className="mt-12 flex flex-col items-stretch shadow-[0_40px_80px_-20px_rgb(0_0_0/0.7)]">
          <div className="bc-wipe flex items-center justify-between" style={{ animationDelay: '0.35s' }}>
            <span className="bc-red flex items-center gap-3 px-6 py-2 text-2xl font-black">
              <span className="bc-pulse size-3 rounded-full bg-foreground" />
              LIVE 특집
            </span>
          </div>
          <div className="bc-panel bc-wipe flex flex-col items-center gap-3 px-24 py-12" style={{ animationDelay: '0.5s' }}>
            <span className="text-4xl font-bold tracking-[0.35em] text-ink-muted">{config.schoolName}</span>
            <h1 className="text-balance text-center text-[140px] font-black leading-none tracking-tight">{title}</h1>
          </div>
          <div className="bc-blue bc-wipe flex items-center justify-center py-5" style={{ animationDelay: '0.8s' }}>
            <span className="text-[72px] font-black leading-none tracking-[0.3em]">개표방송</span>
          </div>
        </div>

        <p className="bc-rise mt-16 text-4xl font-bold text-foreground/85" style={{ animationDelay: '1.4s' }}>
          잠시 후 개표 현황을 전해드립니다
        </p>
      </div>
    </div>
  )
}

export function EndingScene({ config, results }: SceneProps) {
  const winner = results.stats.leader
  return (
    <div className="absolute inset-0 overflow-hidden">
      <StudioBackdrop dim={0.5} />
      <div className="relative z-10 flex h-full items-center gap-20 px-32 pt-20">
        <div className="flex flex-1 flex-col gap-10">
          <p className="bc-rise text-3xl font-bold tracking-[0.3em] text-foreground/80">{config.schoolName}</p>
          <h1 className="bc-rise text-[124px] font-black leading-[1.05]" style={{ animationDelay: '0.15s' }}>
            시청해 주셔서
            <br />
            감사합니다
          </h1>
          {winner && (
            <div className="bc-panel bc-slide-left flex w-fit items-stretch" style={{ animationDelay: '0.45s' }}>
              <CandidatePhoto candidate={winner} className="size-36 shrink-0 text-6xl" />
              <div className="flex flex-col justify-center gap-2 px-8">
                <span className="text-2xl font-bold text-ink-muted">{config.electionTitle} 당선인</span>
                <span className="flex items-center gap-4 text-6xl font-black">
                  <NumberChip number={winner.number} color={winner.color} className="size-14 text-4xl" />
                  {winner.name}
                </span>
              </div>
            </div>
          )}
        </div>

        <div
          className="bc-fade relative h-[780px] w-[640px] shrink-0 overflow-hidden"
          style={{ maskImage: 'linear-gradient(transparent, black 18%, black 82%, transparent)', animationDelay: '0.3s' }}
        >
          <div
            className="flex flex-col items-center gap-12 pt-[780px] text-center"
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
            <span className="pt-10 font-mono text-3xl font-semibold tracking-[0.4em] text-gold">ELECTION NIGHT 2026</span>
          </div>
        </div>
      </div>
    </div>
  )
}
