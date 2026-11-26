'use client'

import { UserRound } from 'lucide-react'
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
    <div className={cn('fixed inset-0 flex items-center justify-center overflow-hidden bg-muted', className)}>
      <div className="relative" style={{ width: 1920 * scale, height: 1080 * scale }}>
        <div
          className="absolute left-0 top-0 origin-top-left overflow-hidden bg-background text-foreground"
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
      className="bc-rise-badge pointer-events-none absolute -top-4 left-full ml-2 whitespace-nowrap rounded-full px-4 py-1 font-mono text-4xl font-bold text-primary-foreground"
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
  candidate: Pick<CandidateView, 'photoUrl' | 'name' | 'number'>
  className?: string
  style?: CSSProperties
}) {
  const [failed, setFailed] = useState<string | null>(null)
  const showImage = candidate.photoUrl && failed !== candidate.photoUrl
  return (
    <div className={cn('relative shrink-0 overflow-hidden rounded-xl bg-muted', className)} style={style}>
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
          className="flex h-full w-full items-end justify-center text-border"
          role="img"
          aria-label={`기호 ${candidate.number}번 ${candidate.name} 후보 사진 자리`}
        >
          <UserRound className="size-3/4 translate-y-[12%]" strokeWidth={1.25} aria-hidden="true" />
        </div>
      )}
    </div>
  )
}
