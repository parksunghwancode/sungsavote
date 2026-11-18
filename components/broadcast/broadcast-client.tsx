'use client'

import { Maximize, Volume2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useControl } from '@/lib/control-store'
import { BroadcastView } from './broadcast-view'
import { Stage } from './primitives'

export function BroadcastClient() {
  const control = useControl()
  const [armed, setArmed] = useState(false)
  const [idle, setIdle] = useState(false)

  useEffect(() => {
    let t: ReturnType<typeof setTimeout>
    const wake = () => {
      setIdle(false)
      clearTimeout(t)
      t = setTimeout(() => setIdle(true), 2500)
    }
    wake()
    window.addEventListener('mousemove', wake)
    return () => {
      clearTimeout(t)
      window.removeEventListener('mousemove', wake)
    }
  }, [])

  const start = (fullscreen: boolean) => {
    setArmed(true)
    if (fullscreen) void document.documentElement.requestFullscreen?.().catch(() => {})
  }

  return (
    <main className={idle ? 'bc-hide-cursor' : undefined} onDoubleClick={() => start(true)}>
      <h1 className="sr-only">전교회장 선거 개표방송 송출 화면</h1>
      <Stage>
        <BroadcastView control={control} muted={!armed} />
      </Stage>
      {!armed && (
        <div className="fixed bottom-6 right-6 z-50 flex gap-2">
          <button
            type="button"
            onClick={() => start(false)}
            className="flex items-center gap-2 rounded-md border border-border bg-navy/90 px-4 py-2.5 text-sm font-bold backdrop-blur hover:bg-secondary"
          >
            <Volume2 className="size-4" aria-hidden="true" />
            소리 켜기
          </button>
          <button
            type="button"
            onClick={() => start(true)}
            className="flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground hover:bg-primary/85"
          >
            <Maximize className="size-4" aria-hidden="true" />
            전체화면 송출 시작
          </button>
        </div>
      )}
    </main>
  )
}
