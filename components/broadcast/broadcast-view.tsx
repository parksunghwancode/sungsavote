'use client'

import { useEffect, useRef, useState } from 'react'
import { useResults } from '@/hooks/use-results'
import type { ControlState } from '@/lib/control-store'
import { useMedia } from '@/lib/media-store'
import type { SceneKey } from '@/lib/types'
import { HeaderBug, LowerThird, SceneTransition, Ticker } from './overlays'
import { CandidatesScene } from './scenes/candidates-scene'
import { InterimScene } from './scenes/interim-scene'
import { LiveScene } from './scenes/live-scene'
import { EndingScene, OpeningScene } from './scenes/title-scenes'
import type { SceneProps } from './scenes/types'
import { WinnerScene } from './scenes/winner-scene'
import { useVideoSource } from './video-slot'

const SCENE_COMPONENTS: Record<SceneKey, (props: SceneProps) => React.ReactNode> = {
  opening: OpeningScene,
  candidates: CandidatesScene,
  live: LiveScene,
  interim: InterimScene,
  winner: WinnerScene,
  ending: EndingScene,
}

export function BroadcastView({ control, muted = false }: { control: ControlState; muted?: boolean }) {
  const results = useResults(control)
  const media = useMedia()
  const [scene, setScene] = useState<SceneKey>(control.scene)
  const [transitionKey, setTransitionKey] = useState(0)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => {
    if (control.scene === scene) return
    setTransitionKey((k) => k + 1)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setScene(control.scene), 520)
    return () => clearTimeout(timer.current)
  }, [control.scene, scene])

  const videoSrc = useVideoSource(scene === 'live' ? 'opening' : scene, control, media)
  const playingVideo = scene !== 'live' && !!videoSrc
  const showChrome = !playingVideo && scene !== 'opening'
  const showTicker = !playingVideo && (scene === 'live' || scene === 'interim' || scene === 'candidates')
  const Scene = SCENE_COMPONENTS[scene]

  return (
    <div className="bc-respect-motion absolute inset-0">
      <div key={scene} className="absolute inset-0">
        <Scene control={control} results={results} media={media} muted={muted} />
      </div>
      {showChrome && <HeaderBug control={control} scene={scene} />}
      {showTicker && <Ticker control={control} results={results} />}
      <LowerThird control={control} withTicker={showTicker} />
      <SceneTransition triggerKey={transitionKey} />
    </div>
  )
}
