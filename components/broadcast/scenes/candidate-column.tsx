'use client'

import type { ReactNode } from 'react'
import type { CandidateView } from '@/lib/types'
import { CandidatePhoto } from '../primitives'

export function RaceTag({ title }: { title?: string }) {
  if (!title) return null
  return (
    <span className="flex shrink-0 items-center gap-6 text-5xl font-black text-primary">
      {title}
      <span className="h-12 w-1 bg-border" aria-hidden="true" />
    </span>
  )
}

export function CandidateColumns({ children }: { children: ReactNode }) {
  return <ul className="flex flex-1 items-stretch divide-x divide-border">{children}</ul>
}

export function CandidateColumn({
  candidate: c,
  index,
  photo,
  nameSize = 'text-6xl',
  dimmed = false,
  children,
}: {
  candidate: CandidateView
  index: number
  photo: { width: number; height: number }
  nameSize?: string
  dimmed?: boolean
  children?: ReactNode
}) {
  return (
    <li
      className="bc-rise flex flex-1 flex-col items-center justify-center gap-5 px-10"
      style={{ animationDelay: `${0.15 + index * 0.12}s`, opacity: dimmed ? 0.55 : undefined }}
    >
      <CandidatePhoto candidate={c} style={{ width: photo.width, height: photo.height }} />
      <div className="flex flex-col items-center gap-2">
        <span className={`flex items-baseline gap-5 font-black leading-none ${nameSize}`}>
          <span className="text-[0.62em]" style={{ color: c.color }}>
            기호 {c.number}번
          </span>
          <span className="text-foreground">{c.name}</span>
        </span>
        {c.slogan && <span className="text-balance text-center text-3xl font-medium text-muted-foreground">{c.slogan}</span>}
      </div>
      {children}
    </li>
  )
}
