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

export function Backdrop({ tone = 'navy' }: { tone?: 'navy' | 'gold' }) {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      <div
        className="absolute inset-0"
        style={{
          background:
            tone === 'gold'
              ? 'radial-gradient(ellipse at 50% 35%, #2a2210 0%, #0a1020 50%, #03060e 100%)'
              : 'radial-gradient(ellipse at 50% 30%, #0f2350 0%, #060d1f 55%, #03060e 100%)',
        }}
      />
      <div className="bc-grid absolute inset-0 opacity-70" />
      <div
        className="absolute left-0 h-48 w-full opacity-40"
        style={{
          background: 'linear-gradient(to bottom, transparent, rgb(58 141 255 / 0.12), transparent)',
          animation: 'bc-scan 7s linear infinite',
        }}
      />
      <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-background to-transparent" />
    </div>
  )
}

export function LightStreaks({ count = 6, color = 'var(--primary)' }: { count?: number; color?: string }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="absolute h-0.5"
          style={{
            top: `${12 + ((i * 37) % 76)}%`,
            width: 420 + ((i * 113) % 380),
            background: `linear-gradient(to right, transparent, ${color}, transparent)`,
            animation: `bc-streak ${4 + (i % 3) * 1.3}s linear ${i * 0.7}s infinite`,
          }}
        />
      ))}
    </div>
  )
}

export function NumberBadge({ number, color, className }: { number: number; color: string; className?: string }) {
  return (
    <span
      className={cn('inline-flex items-center gap-2 px-3 py-1 font-bold text-foreground', className)}
      style={{ backgroundColor: color }}
    >
      <span className="text-[0.7em] font-medium opacity-90">기호</span>
      <span className="font-mono">{number}</span>
    </span>
  )
}
