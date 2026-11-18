'use client'

import { useEffect, useRef, useState } from 'react'
import { Film } from 'lucide-react'
import type { CandidateView } from '@/lib/types'
import { CandidatePhoto, NumberChip, StudioBackdrop } from '../primitives'
import type { SceneProps } from './types'

function VideoPlaceholder({ candidate }: { candidate: CandidateView }) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <StudioBackdrop dim={0.35} tint={`color-mix(in srgb, ${candidate.color} 45%, transparent)`} />
      <div className="relative flex h-full items-center justify-center gap-20">
        <CandidatePhoto
          candidate={candidate}
          className="h-[520px] w-[400px] text-[220px] shadow-[0_40px_80px_-24px_rgb(0_0_0/0.8)]"
          style={{ animation: 'bc-kenburns 12s ease-in-out infinite alternate' }}
        />
        <div className="flex flex-col gap-6">
          <span className="flex items-center gap-3 text-3xl font-bold text-foreground/70">
            <Film className="size-8" aria-hidden="true" />
            AI 후보 소개 영상 자리
          </span>
          <span className="max-w-[560px] text-pretty text-2xl leading-relaxed text-foreground/60">
            {`public/videos/candidate-${candidate.number}.mp4 파일을 넣거나 시트 '영상' 열에 주소를 적으면 이 자리에서 재생됩니다.`}
          </span>
        </div>
      </div>
    </div>
  )
}

export function VideoScene({ results, candidateNumber }: SceneProps & { candidateNumber?: number }) {
  const candidate = results.candidates.find((c) => c.number === candidateNumber) ?? results.candidates[0]
  const videoRef = useRef<HTMLVideoElement>(null)
  const [failedSrc, setFailedSrc] = useState<string | null>(null)
  const src = candidate?.videoUrl
  const playable = !!src && failedSrc !== src

  useEffect(() => {
    const video = videoRef.current
    if (!video || !playable) return
    video.muted = false
    // Browsers can block sound until the page has had a click or key press; retry muted so the clip still plays.
    video.play().catch(() => {
      video.muted = true
      void video.play().catch(() => {})
    })
  }, [playable, src])

  if (!candidate) return null

  return (
    <div className="absolute inset-0 overflow-hidden bg-navy-deep">
      {playable ? (
        <video
          ref={videoRef}
          key={src}
          src={src}
          className="absolute inset-0 h-full w-full object-cover"
          playsInline
          preload="auto"
          onError={() => setFailedSrc(src)}
        />
      ) : (
        <VideoPlaceholder candidate={candidate} />
      )}

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-72 bg-gradient-to-t from-navy-deep/90 to-transparent" aria-hidden="true" />

      <div className="bc-wipe absolute bottom-16 left-12 z-20 flex items-stretch shadow-2xl shadow-black/60">
        <NumberChip number={candidate.number} color={candidate.color} className="w-28 text-7xl" />
        <div className="bc-panel flex flex-col justify-center gap-1 px-10 py-5">
          <span className="text-2xl font-bold" style={{ color: candidate.color }}>
            {`기호 ${candidate.number}번 후보`}
          </span>
          <span className="text-6xl font-black leading-tight">{candidate.name}</span>
        </div>
        <div className="bc-blue flex items-center px-8 text-2xl font-black">후보 소개 영상</div>
      </div>
    </div>
  )
}
