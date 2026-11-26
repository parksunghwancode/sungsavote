'use client'

import { ChevronLeft, ChevronRight, Maximize } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useResults } from '@/hooks/use-results'
import { buildSlides } from '@/lib/types'
import { BroadcastView } from './broadcast-view'
import { Stage } from './primitives'

const NEXT_KEYS = new Set(['ArrowRight', 'ArrowDown', 'PageDown', ' ', 'Enter'])
const PREV_KEYS = new Set(['ArrowLeft', 'ArrowUp', 'PageUp', 'Backspace'])

export function BroadcastClient() {
  const results = useResults()
  const raceKey = results.races.map((r) => r.raceTitle).join('\u0000')
  const SCENES = useMemo(() => buildSlides(raceKey.split('\u0000')), [raceKey])
  const countRef = useRef(SCENES.length)
  countRef.current = SCENES.length

  const [rawIndex, setIndex] = useState(0)
  const index = Math.min(rawIndex, SCENES.length - 1)
  const [fullscreen, setFullscreen] = useState(false)

  const go = useCallback((delta: number) => {
    setIndex((i) => Math.min(countRef.current - 1, Math.max(0, i + delta)))
  }, [])

  const enterFullscreen = () => {
    void document.documentElement.requestFullscreen?.().catch(() => {})
  }

  useEffect(() => {
    const onChange = () => setFullscreen(!!document.fullscreenElement)
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLElement && e.target.closest('button') && (e.key === ' ' || e.key === 'Enter')) return
      if (NEXT_KEYS.has(e.key)) {
        e.preventDefault()
        go(1)
      } else if (PREV_KEYS.has(e.key)) {
        e.preventDefault()
        go(-1)
      } else if (e.key === 'Home') setIndex(0)
      else if (e.key === 'End') setIndex(countRef.current - 1)
      else if (e.key === 'f' || e.key === 'F') {
        if (document.fullscreenElement) void document.exitFullscreen()
        else enterFullscreen()
      }
    }
    document.addEventListener('fullscreenchange', onChange)
    window.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('fullscreenchange', onChange)
      window.removeEventListener('keydown', onKey)
    }
  }, [go])

  const current = SCENES[index]

  return (
    <main className={fullscreen ? 'bc-hide-cursor' : undefined}>
      <h1 className="sr-only">전교회장 선거 개표방송</h1>
      <p className="sr-only" aria-live="polite">
        {`${index + 1}번째 화면: ${current.label}`}
      </p>
      <Stage>
        <BroadcastView slide={current} results={results} />
      </Stage>

      {!fullscreen && (
        <div className="fixed inset-x-0 bottom-6 z-50 flex justify-center px-6">
          <div className="flex items-center gap-2 rounded-xl border border-border bg-background/95 p-2 text-foreground shadow-lg backdrop-blur">
            <button
              type="button"
              onClick={() => go(-1)}
              disabled={index === 0}
              className="flex size-10 items-center justify-center rounded-md hover:bg-muted disabled:opacity-30"
              aria-label="이전 화면"
            >
              <ChevronLeft className="size-5" aria-hidden="true" />
            </button>
            <span className="min-w-36 text-center text-sm font-bold tabular-nums">
              {index + 1} / {SCENES.length} · {current.label}
            </span>
            <button
              type="button"
              onClick={() => go(1)}
              disabled={index === SCENES.length - 1}
              className="flex size-10 items-center justify-center rounded-md hover:bg-muted disabled:opacity-30"
              aria-label="다음 화면"
            >
              <ChevronRight className="size-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={enterFullscreen}
              className="ml-2 flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground hover:bg-primary/85"
            >
              <Maximize className="size-4" aria-hidden="true" />
              전체화면 실행
            </button>
          </div>
        </div>
      )}
    </main>
  )
}
