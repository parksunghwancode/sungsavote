'use client'

import { CandidatePhoto, NumberChip, StudioBackdrop } from '../primitives'
import type { SceneProps } from './types'

export function CandidatesScene({ results }: SceneProps) {
  const list = results.candidates
  const cardWidth = Math.min(640, Math.floor((1680 - (list.length - 1) * 48) / Math.max(1, list.length)))
  const photoHeight = list.length > 3 ? 420 : 560

  return (
    <div className="absolute inset-0 overflow-hidden">
      <StudioBackdrop dim={0.5} />
      <div className="relative z-10 flex h-full flex-col items-center justify-center gap-10 pb-[96px] pt-[150px]">
        <h2 className="bc-rise flex items-center gap-5 text-5xl font-black">
          <span className="h-12 w-2 bg-live" aria-hidden="true" />
          {list.length}명의 후보가 출마했습니다
        </h2>
        <ul className="flex items-stretch justify-center gap-12">
          {list.map((c, i) => (
            <li
              key={c.number}
              className="bc-rise flex flex-col shadow-[0_40px_80px_-24px_rgb(0_0_0/0.75)]"
              style={{ width: cardWidth, animationDelay: `${0.2 + i * 0.15}s` }}
            >
              <div className="h-3" style={{ background: c.color }} />
              <div className="relative" style={{ height: photoHeight }}>
                <CandidatePhoto candidate={c} className="h-full w-full text-[200px]" />
                <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-navy-deep/80 to-transparent" />
                <NumberChip number={c.number} color={c.color} className="absolute bottom-0 left-0 size-28 text-7xl" />
              </div>
              <div className="bc-panel flex flex-1 flex-col gap-3 px-10 py-8">
                <span className="text-3xl font-black" style={{ color: c.color }}>
                  기호 {c.number}번
                </span>
                <span className="text-[88px] font-black leading-none">{c.name}</span>
                {c.slogan && (
                  <p className="mt-2 text-pretty border-t border-ink/10 pt-4 text-3xl font-bold leading-snug text-ink-muted">
                    {c.slogan}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
