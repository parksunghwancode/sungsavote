'use client'

import { useEffect, useRef, useState } from 'react'
import { useResults } from '@/hooks/use-results'
import { BROADCAST_CONFIG } from '@/lib/config'
import type { SceneKey } from '@/lib/types'
import { HeaderBug, SceneTransition, Ticker } from './overlays'
import { CandidatesScene } from './scenes/candidates-scene'
import { InterimScene } from './scenes/interim-scene'
import { LiveScene } from './scenes/live-scene'
import { EndingScene, OpeningScene } from './scenes/title-scenes'
import type { SceneProps } from './scenes/types'
import { WinnerScene } from './scenes/winner-scene'

const SCENE_COMPONENTS: Record<SceneKey, (props: SceneProps) => React.ReactNode> = {
  opening: OpeningScene,
  candidates: CandidatesScene,
  live: LiveScene,
  interim: InterimScene,
  winner: WinnerScene,
  ending: EndingScene,
}

export function BroadcastView({ scene: targetScene }: { scene: SceneKey }) {
  const results = useResults()
  const [scene, setScene] = useState<SceneKey>(targetScene)
  const [transitionKey, setTransitionKey] = useState(0)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => {
    if (targetScene === scene) return
    setTransitionKey((k) => k + 1)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setScene(targetScene), 520)
    return () => clearTimeout(timer.current)
  }, [targetScene, scene])

  const Scene = SCENE_COMPONENTS[scene]
  const showChrome = scene !== 'opening'
  const showTicker = scene === 'live' || scene === 'interim' || scene === 'candidates'

  return (
    <div className="bc-respect-motion absolute inset-0">
      <div key={scene} className="absolute inset-0">
        <Scene config={BROADCAST_CONFIG} results={results} />
      </div>
      {showChrome && <HeaderBug config={BROADCAST_CONFIG} scene={scene} />}
      {showTicker && <Ticker config={BROADCAST_CONFIG} results={results} />}
      <SceneTransition triggerKey={transitionKey} />
    </div>
  )
}
