'use client'

import { Backdrop, CandidatePhoto, LightStreaks } from '../primitives'
import { VideoSlot } from '../video-slot'
import type { SceneProps } from './types'

function Rings() {
  return (
    <svg
      viewBox="0 0 1000 1000"
      className="pointer-events-none absolute left-1/2 top-1/2 size-[1100px] -translate-x-1/2 -translate-y-1/2"
      aria-hidden="true"
    >
      <g style={{ transformOrigin: '500px 500px', animation: 'bc-spin 60s linear infinite' }}>
        <circle cx="500" cy="500" r="470" fill="none" stroke="var(--primary)" strokeOpacity="0.35" strokeWidth="2" strokeDasharray="2 14" />
        <circle cx="500" cy="500" r="430" fill="none" stroke="var(--primary)" strokeOpacity="0.18" strokeWidth="1" />
      </g>
      <g style={{ transformOrigin: '500px 500px', animation: 'bc-spin-rev 40s linear infinite' }}>
        <circle cx="500" cy="500" r="390" fill="none" stroke="var(--gold)" strokeOpacity="0.45" strokeWidth="3" strokeDasharray="120 60 8 60" />
      </g>
      <g style={{ transformOrigin: '500px 500px', animation: 'bc-spin 24s linear infinite' }}>
        <circle cx="500" cy="500" r="340" fill="none" stroke="var(--foreground)" strokeOpacity="0.12" strokeWidth="1" strokeDasharray="1 6" />
      </g>
    </svg>
  )
}

function OpeningGraphic({ control, results }: SceneProps) {
  const title = results.title || control.electionTitle
  const chars = Array.from(title)
  return (
    <div className="absolute inset-0 overflow-hidden">
      <Backdrop />
      <LightStreaks count={8} />
      <Rings />
      <div className="relative z-10 flex h-full flex-col items-center justify-center gap-8 text-center">
        <div className="bc-rise flex items-center gap-4 border border-live/60 bg-live/15 px-6 py-2 text-2xl font-bold tracking-[0.3em] text-foreground">
          <span className="bc-pulse size-3 rounded-full bg-live" />
          LIVE · 특집 개표방송
        </div>
        <p className="bc-rise text-4xl font-bold tracking-[0.4em] text-muted-foreground" style={{ animationDelay: '0.2s' }}>
          {control.schoolName}
        </p>
        <h1 className="flex flex-wrap justify-center text-[150px] font-black leading-none tracking-tight">
          {chars.map((ch, i) => (
            <span key={i} className="bc-rise inline-block whitespace-pre" style={{ animationDelay: `${0.4 + i * 0.05}s` }}>
              {ch}
            </span>
          ))}
        </h1>
        <div className="bc-wipe flex items-center gap-8" style={{ animationDelay: '1.3s' }}>
          <span className="h-1 w-40 bg-gold" />
          <span className="text-[96px] font-black leading-none text-gold">개표방송</span>
          <span className="h-1 w-40 bg-gold" />
        </div>
        <p className="bc-rise mt-6 text-3xl font-medium text-muted-foreground" style={{ animationDelay: '1.8s' }}>
          <span className="bc-pulse">잠시 후 개표가 시작됩니다</span>
        </p>
      </div>
    </div>
  )
}

export function OpeningScene(props: SceneProps) {
  return (
    <VideoSlot
      scene="opening"
      control={props.control}
      media={props.media}
      muted={props.muted}
      fallback={<OpeningGraphic {...props} />}
    />
  )
}

function EndingGraphic({ control, results }: SceneProps) {
  const credits = control.credits.split('\n').filter(Boolean)
  const winner = results.stats.leader
  return (
    <div className="absolute inset-0 overflow-hidden">
      <Backdrop />
      <LightStreaks count={5} color="var(--gold)" />
      <div className="relative z-10 grid h-full grid-cols-2 items-center gap-16 px-32">
        <div className="flex flex-col gap-8">
          <p className="bc-rise text-3xl font-bold tracking-[0.3em] text-primary">{control.schoolName}</p>
          <h1 className="bc-rise text-[120px] font-black leading-[1.05]" style={{ animationDelay: '0.15s' }}>
            시청해 주셔서
            <br />
            <span className="text-gold">감사합니다</span>
          </h1>
          {winner && (
            <div className="bc-rise flex items-center gap-6 border-l-4 border-gold bg-navy/80 p-6" style={{ animationDelay: '0.5s' }}>
              <CandidatePhoto candidate={winner} className="size-28 shrink-0 text-5xl" />
              <div className="flex flex-col gap-1">
                <span className="text-2xl font-bold text-muted-foreground">{control.electionTitle} 당선인</span>
                <span className="text-5xl font-black">
                  기호 {winner.number}번 {winner.name}
                </span>
              </div>
            </div>
          )}
        </div>
        <div className="relative h-[760px] overflow-hidden" style={{ maskImage: 'linear-gradient(transparent, black 18%, black 82%, transparent)' }}>
          <div
            className="flex flex-col items-center gap-10 pt-[760px] text-center"
            style={{ animation: `bc-credits ${Math.max(16, credits.length * 4)}s linear infinite` }}
          >
            {credits.map((line, i) => {
              const [role, name] = line.split('|').map((s) => s.trim())
              return (
                <div key={i} className="flex flex-col gap-2">
                  {name ? (
                    <>
                      <span className="text-2xl font-medium tracking-[0.3em] text-muted-foreground">{role}</span>
                      <span className="text-5xl font-black">{name}</span>
                    </>
                  ) : (
                    <span className="text-4xl font-bold">{role}</span>
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

export function EndingScene(props: SceneProps) {
  return (
    <VideoSlot
      scene="ending"
      control={props.control}
      media={props.media}
      muted={props.muted}
      fallback={<EndingGraphic {...props} />}
    />
  )
}
