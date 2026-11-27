'use client'

import { useEffect, useRef, useState } from 'react'
import type { ResultsState } from '@/hooks/use-results'
import { BROADCAST_CONFIG } from '@/lib/config'
import type { SceneKey, Slide } from '@/lib/types'
import { CountFooter, HeaderBug, SceneTransition, Ticker, TopRule } from './overlays'
import { CandidatesScene } from './scenes/candidates-scene'
import { LiveScene } from './scenes/live-scene'
import { EndingScene, OpeningScene } from './scenes/title-scenes'
import type { SceneProps } from './scenes/types'
import { WinnerScene } from './scenes/winner-scene'

const SCENE_COMPONENTS: Record<SceneKey, (props: SceneProps) => React.ReactNode> = {
  opening: OpeningScene,
  candidates: CandidatesScene,
  live: LiveScene,
  winner: WinnerScene,
  ending: EndingScene,
}

export function BroadcastView({ slide: target, results }: { slide: Slide; results: ResultsState }) {
  const [slide, setSlide] = useState<Slide>(target)
  const [transitionKey, setTransitionKey] = useState(0)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => {
    if (target.id === slide.id) return
    setTransitionKey((k) => k + 1)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setSlide(target), 520)
    return () => clearTimeout(timer.current)
  }, [target, slide.id])

  const race = slide.race !== undefined ? results.races[slide.race] : undefined
  const scoped: ResultsState = race ? { ...results, ...race } : results
  const Scene = SCENE_COMPONENTS[slide.key]
  const showChrome = slide.key !== 'opening'
  const showTicker = slide.key === 'candidates'
  const showCount = slide.key === 'live' || slide.key === 'winner'

  return (
    <div className="bc-respect-motion absolute inset-0">
      {!showChrome && <TopRule />}
      <div key={slide.id} className="absolute inset-0">
        <Scene config={BROADCAST_CONFIG} results={scoped} />
      </div>
      {showChrome && <HeaderBug config={BROADCAST_CONFIG} label={slide.label} />}
      {showTicker && <Ticker config={BROADCAST_CONFIG} results={scoped} />}
      {showCount && <CountFooter results={scoped} showRate={slide.key === 'winner'} />}
      <SceneTransition triggerKey={transitionKey} />
    </div>
  )
}
