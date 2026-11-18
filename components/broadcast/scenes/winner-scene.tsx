'use client'

import { Backdrop, CandidatePhoto, CountUp, LightStreaks } from '../primitives'
import { VideoSlot } from '../video-slot'
import type { SceneProps } from './types'

const CONFETTI_COLORS = ['var(--gold)', 'var(--primary)', 'var(--foreground)', 'var(--live)']

function Confetti() {
  return (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden" aria-hidden="true">
      {Array.from({ length: 70 }).map((_, i) => (
        <span
          key={i}
          className="absolute top-0 block"
          style={
            {
              left: `${(i * 137) % 100}%`,
              width: 10 + (i % 4) * 4,
              height: 18 + (i % 3) * 6,
              background: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
              '--drift': `${((i * 53) % 160) - 80}px`,
              animation: `bc-confetti ${4 + (i % 5) * 0.8}s linear ${(i % 12) * 0.35 + 1.2}s infinite`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  )
}

function WinnerGraphic({ control, results }: SceneProps) {
  const winner = results.stats.leader
  if (!winner) {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <Backdrop />
        <p className="relative text-5xl font-bold text-muted-foreground">개표 결과 집계 중입니다</p>
      </div>
    )
  }
  return (
    <div className="absolute inset-0 overflow-hidden">
      <Backdrop tone="gold" />
      <LightStreaks count={9} color="var(--gold)" />
      <div
        className="bc-fade absolute left-1/2 top-1/2 size-[1500px] -translate-x-1/2 -translate-y-1/2 opacity-40"
        style={{
          background: 'repeating-conic-gradient(from 0deg, rgb(245 196 81 / 0.18) 0deg 6deg, transparent 6deg 18deg)',
          animation: 'bc-spin 90s linear infinite',
          maskImage: 'radial-gradient(circle, black 15%, transparent 65%)',
        }}
        aria-hidden="true"
      />
      <Confetti />

      <div className="relative z-10 flex h-full items-center gap-20 px-32 pt-12">
        <div className="bc-rise relative h-[780px] w-[600px] shrink-0" style={{ animationDelay: '0.3s' }}>
          <div className="absolute -inset-4 border-4 border-gold" />
          <CandidatePhoto candidate={winner} className="h-full w-full text-[240px]" />
          <div
            className="bc-stamp absolute -right-20 -top-12 flex size-60 flex-col items-center justify-center rounded-full border-8 border-live bg-live/90 text-foreground shadow-2xl"
            style={{ animationDelay: '1.6s' }}
          >
            <span className="text-2xl font-black tracking-widest">축</span>
            <span className="text-6xl font-black leading-none">{control.winnerLabel.replace(' ', '')}</span>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-6">
          <p className="bc-slide-right text-4xl font-bold tracking-[0.2em] text-gold">
            {control.schoolName} {control.electionTitle}
          </p>
          <div className="bc-wipe flex w-fit items-center bg-live px-8 py-3 text-6xl font-black" style={{ animationDelay: '0.5s' }}>
            {control.winnerLabel}
          </div>
          <div className="bc-slide-right flex items-baseline gap-6" style={{ animationDelay: '0.8s' }}>
            <span className="font-mono text-7xl font-bold" style={{ color: winner.color }}>
              기호 {winner.number}
            </span>
          </div>
          <h1 className="bc-rise text-[220px] font-black leading-[0.95]" style={{ animationDelay: '1s' }}>
            {winner.name}
          </h1>
          {winner.slogan && (
            <p className="bc-rise text-4xl font-bold text-foreground/85" style={{ animationDelay: '1.2s' }}>
              {`"${winner.slogan}"`}
            </p>
          )}
          <div className="bc-rise mt-4 flex gap-6" style={{ animationDelay: '1.4s' }}>
            <div className="flex flex-col gap-1 bg-navy/90 px-8 py-5">
              <span className="text-2xl font-bold text-muted-foreground">득표수</span>
              <span className="font-mono text-6xl font-bold">
                <CountUp value={winner.votes} duration={2200} />
                <span className="ml-1 font-sans text-3xl">표</span>
              </span>
            </div>
            <div className="flex flex-col gap-1 bg-gold px-8 py-5 text-accent-foreground">
              <span className="text-2xl font-bold">득표율</span>
              <span className="font-mono text-6xl font-bold">
                <CountUp value={winner.pct} decimals={1} duration={2200} />%
              </span>
            </div>
            {results.stats.runnerUp && (
              <div className="flex flex-col gap-1 bg-navy/90 px-8 py-5">
                <span className="text-2xl font-bold text-muted-foreground">2위와 격차</span>
                <span className="font-mono text-6xl font-bold">
                  {results.stats.margin.toLocaleString()}
                  <span className="ml-1 font-sans text-3xl">표</span>
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export function WinnerScene(props: SceneProps) {
  return (
    <VideoSlot
      scene="winner"
      control={props.control}
      media={props.media}
      muted={props.muted}
      fallback={<WinnerGraphic {...props} />}
    />
  )
}
