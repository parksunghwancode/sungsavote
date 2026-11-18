'use client'

import { useEffect, useRef, useState } from 'react'
import { BroadcastView } from '@/components/broadcast/broadcast-view'
import type { ControlState } from '@/lib/control-store'
import { SCENES } from '@/lib/types'

export function ProgramMonitor({ control }: { control: ControlState }) {
  const ref = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new ResizeObserver(([entry]) => setScale(entry.contentRect.width / 1920))
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between text-xs font-bold tracking-widest">
        <span className="flex items-center gap-2 text-live">
          <span className="bc-pulse size-2 rounded-full bg-live" />
          PROGRAM
        </span>
        <span className="text-muted-foreground">{SCENES.find((s) => s.key === control.scene)?.label}</span>
      </div>
      <div ref={ref} className="relative aspect-video w-full overflow-hidden rounded-md border-2 border-live bg-black">
        {scale > 0 && (
          <div className="absolute left-0 top-0 origin-top-left" style={{ width: 1920, height: 1080, transform: `scale(${scale})` }}>
            <div className="relative h-full w-full overflow-hidden bg-background">
              <BroadcastView control={control} muted />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
