'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import type { ControlState } from '@/lib/control-store'
import { videoKey, type MediaEntry } from '@/lib/media-store'
import type { VideoSceneKey } from '@/lib/types'

function Player({
  src,
  loop,
  muted,
  fallback,
}: {
  src: string
  loop: boolean
  muted: boolean
  fallback: ReactNode
}) {
  const ref = useRef<HTMLVideoElement>(null)
  const [ended, setEnded] = useState(false)

  useEffect(() => {
    const video = ref.current
    if (!video) return
    video.muted = muted
    video.play().catch(() => {
      video.muted = true
      void video.play().catch(() => setEnded(true))
    })
  }, [muted])

  if (ended) return <>{fallback}</>
  return (
    <video
      ref={ref}
      src={src}
      autoPlay
      playsInline
      loop={loop}
      className="absolute inset-0 h-full w-full bg-black object-cover"
      onEnded={() => setEnded(true)}
      onError={() => setEnded(true)}
    />
  )
}

export function useVideoSource(scene: VideoSceneKey, control: ControlState, media: Record<string, MediaEntry>) {
  return media[videoKey(scene)]?.url ?? (control.videoUrls[scene]?.trim() || null)
}

export function VideoSlot({
  scene,
  control,
  media,
  muted,
  fallback,
}: {
  scene: VideoSceneKey
  control: ControlState
  media: Record<string, MediaEntry>
  muted: boolean
  fallback: ReactNode
}) {
  const src = useVideoSource(scene, control, media)
  if (!src) return <>{fallback}</>
  return (
    <Player
      key={`${src}-${control.videoNonce}`}
      src={src}
      loop={!!control.videoLoop[scene]}
      muted={muted || control.videoMuted}
      fallback={fallback}
    />
  )
}
