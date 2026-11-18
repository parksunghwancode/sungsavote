'use client'

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import type { CandidateView } from '@/lib/types'

export function Stage({ children, className }: { children: ReactNode; className?: string }) {
  const [scale, setScale] = useState(1)
  useEffect(() => {
    const fit = () => setScale(Math.min(window.innerWidth / 1920, window.innerHeight / 1080))
    fit()
    window.addEventListener('resize', fit)
    return () => window.removeEventListener('resize', fit)
  }, [])
  return (
    <div className={cn('fixed inset-0 flex items-center justify-center overflow-hidden bg-black', className)}>
      <div className="relative" style={{ width: 1920 * scale, height: 1080 * scale }}>
        <div
          className="absolute left-0 top-0 origin-top-left overflow-hidden bg-background"
          style={{ width: 1920, height: 1080, transform: `scale(${scale})` }}
        >
          {children}
        </div>
      </div>
    </div>
  )
}

export function CountUp({
  value,
  decimals = 0,
  duration = 1200,
  className,
}: {
  value: number
  decimals?: number
  duration?: number
  className?: string
}) {
  const [display, setDisplay] = useState(value)
  const fromRef = useRef(value)
  const displayRef = useRef(value)

  useEffect(() => {
    fromRef.current = displayRef.current
    const start = performance.now()
    let frame = 0
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      const next = fromRef.current + (value - fromRef.current) * eased
      displayRef.current = next
      setDisplay(next)
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [value, duration])

  return (
    <span className={cn('tabular-nums', className)}>
      {display.toLocaleString('ko-KR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
    </span>
  )
}

export function useRiseEvent(value: number) {
  const prev = useRef(value)
  const [event, setEvent] = useState<{ id: number; delta: number } | null>(null)
  useEffect(() => {
    const delta = value - prev.current
    prev.current = value
    if (delta > 0) setEvent((e) => ({ id: (e?.id ?? 0) + 1, delta }))
  }, [value])
  return event
}

export function RiseBadge({ event, color }: { event: { id: number; delta: number } | null; color: string }) {
  if (!event) return null
  return (
    <span
      key={event.id}
      className="bc-rise-badge pointer-events-none absolute -top-2 right-0 whitespace-nowrap px-3 py-1 font-mono text-3xl font-bold text-foreground"
      style={{ background: color }}
      aria-hidden="true"
    >
      {`+${event.delta.toLocaleString('ko-KR')}`}
    </span>
  )
}

export function CandidatePhoto({
  candidate,
  className,
  style,
}: {
  candidate: Pick<CandidateView, 'photoUrl' | 'name' | 'color'>
  className?: string
  style?: CSSProperties
}) {
  const [failed, setFailed] = useState<string | null>(null)
  const showImage = candidate.photoUrl && failed !== candidate.photoUrl
  return (
    <div className={cn('relative overflow-hidden bg-navy', className)} style={style}>
      {showImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={candidate.photoUrl!}
          alt={`${candidate.name} 후보 사진`}
          className="h-full w-full object-cover object-top"
          onError={() => setFailed(candidate.photoUrl)}
        />
      ) : (
        <div
          className="flex h-full w-full items-center justify-center font-black text-foreground"
          style={{ background: `linear-gradient(160deg, ${candidate.color}, var(--navy-deep))` }}
          role="img"
          aria-label={`${candidate.name} 후보`}
        >
          {candidate.name.slice(0, 1)}
        </div>
      )}
    </div>
  )
}

export function StudioBackdrop({ dim = 0.55, tint }: { dim?: number; tint?: string }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url(/images/studio-bg.png)',
          animation: 'bc-drift 40s ease-in-out infinite alternate',
        }}
      />
      <div className="absolute inset-0" style={{ background: `rgb(5 11 28 / ${dim})` }} />
      {tint && (
        <div
          className="absolute inset-0"
          style={{ background: `radial-gradient(ellipse at 30% 40%, ${tint} 0%, transparent 60%)` }}
        />
      )}
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at center, transparent 45%, rgb(5 11 28 / 0.75) 100%)' }}
      />
    </div>
  )
}

export function NumberChip({ number, color, className }: { number: number; color: string; className?: string }) {
  return (
    <span
      className={cn('inline-flex shrink-0 items-center justify-center font-mono font-bold leading-none text-foreground', className)}
      style={{ background: `linear-gradient(180deg, color-mix(in srgb, ${color} 80%, white), ${color} 55%, color-mix(in srgb, ${color} 75%, black))` }}
    >
      {number}
    </span>
  )
}

export function ShareBar({ pct, color, className }: { pct: number; color: string; className?: string }) {
  return (
    <div className={cn('relative overflow-hidden bg-ink/10', className)}>
      <div
        className="relative h-full overflow-hidden"
        style={{
          width: `${Math.max(0, Math.min(100, pct))}%`,
          background: `linear-gradient(180deg, color-mix(in srgb, ${color} 75%, white), ${color} 50%, color-mix(in srgb, ${color} 80%, black))`,
          transition: 'width 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <div
          className="absolute inset-y-0 w-1/5 bg-gradient-to-r from-transparent via-foreground/45 to-transparent"
          style={{ animation: 'bc-shine 3s ease-in-out infinite' }}
        />
      </div>
    </div>
  )
}
