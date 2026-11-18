'use client'

import { useEffect, useState } from 'react'
import { Backdrop, CandidatePhoto, LightStreaks } from '../primitives'
import type { SceneProps } from './types'

function CandidateIntro({ results }: SceneProps) {
  const list = results.candidates
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (list.length < 2) return
    const id = setInterval(() => setIndex((i) => (i + 1) % list.length), 7000)
    return () => clearInterval(id)
  }, [list.length])

  const current = list[index % Math.max(1, list.length)]
  if (!current) {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <Backdrop />
        <p className="relative text-5xl font-bold text-muted-foreground">후보자 정보를 불러오는 중입니다</p>
      </div>
    )
  }

  return (
    <div className="absolute inset-0 overflow-hidden">
      <Backdrop />
      <LightStreaks count={5} color={current.color} />
      <div key={current.number} className="absolute inset-0">
        <div
          className="bc-slide-left absolute inset-y-0 left-0 w-[980px]"
          style={{ background: current.color, clipPath: 'polygon(0 0, 100% 0, 78% 100%, 0 100%)', opacity: 0.9 }}
        />
        <div
          className="bc-slide-left absolute inset-y-0 left-0 w-[1000px] opacity-30"
          style={{
            background: 'repeating-linear-gradient(115deg, transparent 0 40px, rgb(0 0 0 / 0.25) 40px 42px)',
            clipPath: 'polygon(0 0, 100% 0, 78% 100%, 0 100%)',
            animationDelay: '0.1s',
          }}
        />
        <div className="bc-rise absolute bottom-[120px] left-[120px] h-[760px] w-[600px] shadow-2xl shadow-black/60" style={{ animationDelay: '0.25s' }}>
          <CandidatePhoto candidate={current} className="h-full w-full text-[220px]" />
          <div className="absolute inset-x-0 bottom-0 h-3" style={{ background: current.color }} />
        </div>

        <div className="absolute left-[900px] right-[100px] top-[200px] flex flex-col gap-6">
          <div className="bc-slide-right flex items-baseline gap-6" style={{ animationDelay: '0.35s' }}>
            <span className="text-5xl font-bold text-muted-foreground">기호</span>
            <span className="font-mono text-[260px] font-bold leading-[0.8]" style={{ color: current.color }}>
              {current.number}
            </span>
          </div>
          <h2 className="bc-slide-right text-[150px] font-black leading-none" style={{ animationDelay: '0.5s' }}>
            {current.name}
          </h2>
          <div className="bc-wipe h-1.5 w-48 bg-gold" style={{ animationDelay: '0.7s' }} />
          {current.slogan && (
            <p className="bc-rise text-pretty text-5xl font-bold leading-snug text-foreground/90" style={{ animationDelay: '0.8s' }}>
              {`"${current.slogan}"`}
            </p>
          )}
        </div>
      </div>

      <div className="absolute bottom-[120px] right-[100px] z-10 flex gap-4">
        {list.map((c, i) => (
          <div
            key={c.number}
            className="relative flex w-40 flex-col overflow-hidden border-2 bg-navy transition-all duration-500"
            style={{ borderColor: i === index ? c.color : 'transparent', opacity: i === index ? 1 : 0.5 }}
          >
            <CandidatePhoto candidate={c} className="h-28 w-full text-5xl" />
            <div className="flex items-center gap-2 px-3 py-2 text-lg font-bold">
              <span className="font-mono" style={{ color: c.color }}>
                {c.number}
              </span>
              {c.name}
            </div>
            {i === index && (
              <div
                key={`p-${index}`}
                className="absolute bottom-0 left-0 h-1 origin-left"
                style={{ background: c.color, width: '100%', animation: 'bc-wipe 7s linear both' }}
              />
            )}
          </div>
        ))}
      </div>

      <div className="absolute left-[120px] top-[170px] z-10 bg-navy-deep/90 px-5 py-2 text-2xl font-bold tracking-[0.3em] text-gold">
        CANDIDATE {String(index + 1).padStart(2, '0')} / {String(list.length).padStart(2, '0')}
      </div>
    </div>
  )
}

export function CandidatesScene(props: SceneProps) {
  return <CandidateIntro {...props} />
}
