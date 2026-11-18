'use client'

import { ExternalLink, Radio } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useResults } from '@/hooks/use-results'
import { updateControl, useControl } from '@/lib/control-store'
import { useMedia } from '@/lib/media-store'
import { SCENES } from '@/lib/types'
import { cn } from '@/lib/utils'
import { CandidatesPanel } from './candidates-panel'
import { CaptionsPanel } from './captions-panel'
import { DataPanel } from './data-panel'
import { MediaPanel } from './media-panel'
import { ProgramMonitor } from './program-monitor'

const TABS = [
  { key: 'data', label: '데이터' },
  { key: 'candidates', label: '후보자' },
  { key: 'media', label: '영상' },
  { key: 'captions', label: '자막·정보' },
] as const
type TabKey = (typeof TABS)[number]['key']

export function AdminDashboard() {
  const control = useControl()
  const results = useResults(control)
  const media = useMedia()
  const [tab, setTab] = useState<TabKey>('data')

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      if (target.closest('input, textarea, [contenteditable]')) return
      const n = Number(e.key)
      if (n >= 1 && n <= SCENES.length) updateControl({ scene: SCENES[n - 1].key })
      if (e.key.toLowerCase() === 'l') updateControl((p) => ({ lowerThird: { ...p.lowerThird, visible: !p.lowerThird.visible } }))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="flex items-center justify-between gap-4 border-b border-border bg-navy-deep px-6 py-3">
        <div className="flex items-center gap-3">
          <Radio className="size-5 text-live" aria-hidden="true" />
          <div className="flex flex-col">
            <h1 className="text-base font-black leading-tight">개표방송 컨트롤룸</h1>
            <p className="text-xs text-muted-foreground">
              {control.schoolName} · {results.title || control.electionTitle}
            </p>
          </div>
        </div>
        <a
          href="/broadcast"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-bold text-primary-foreground hover:bg-primary/85"
        >
          송출 화면 열기
          <ExternalLink className="size-4" aria-hidden="true" />
        </a>
      </header>

      <main className="grid flex-1 gap-6 p-6 lg:grid-cols-[minmax(0,1fr)_440px]">
        <div className="flex flex-col gap-5">
          <ProgramMonitor control={control} />

          <section aria-labelledby="scene-heading" className="flex flex-col gap-3">
            <div className="flex items-baseline justify-between">
              <h2 id="scene-heading" className="text-sm font-bold tracking-widest text-muted-foreground">
                장면 전환
              </h2>
              <span className="text-xs text-muted-foreground">단축키 1–6 장면 · L 속보 자막</span>
            </div>
            <div className="grid grid-cols-3 gap-2 xl:grid-cols-6">
              {SCENES.map((s, i) => {
                const active = control.scene === s.key
                return (
                  <button
                    key={s.key}
                    type="button"
                    aria-pressed={active}
                    onClick={() => updateControl({ scene: s.key })}
                    className={cn(
                      'flex flex-col items-start gap-1 rounded-md border-2 px-3 py-3 text-left transition-colors',
                      active ? 'border-live bg-live/15' : 'border-border bg-card hover:border-primary',
                    )}
                  >
                    <span className="flex w-full items-center justify-between font-mono text-xs font-bold text-muted-foreground">
                      {i + 1}
                      {active && <span className="rounded-sm bg-live px-1.5 text-[10px] text-foreground">ON AIR</span>}
                    </span>
                    <span className="text-sm font-bold">{s.label}</span>
                    <span className="text-[11px] text-muted-foreground">
                      {s.hasVideo ? (media[`video-${s.key}`] || control.videoUrls[s.key as keyof typeof control.videoUrls] ? '영상' : '그래픽') : '실시간 데이터'}
                    </span>
                  </button>
                )
              })}
            </div>
          </section>

          <section aria-label="실시간 득표" className="grid grid-cols-2 gap-2 md:grid-cols-4">
            {results.ranked.map((c) => (
              <div key={c.number} className="flex flex-col gap-1 rounded-md border border-border bg-card p-3">
                <span className="flex items-center gap-2 text-sm font-bold">
                  <span className="size-2.5 rounded-full" style={{ background: c.color }} />
                  {c.rank}위 {c.name}
                </span>
                <span className="font-mono text-xl font-bold">{c.votes.toLocaleString()}표</span>
                <span className="font-mono text-xs text-muted-foreground">{c.pct.toFixed(1)}%</span>
              </div>
            ))}
          </section>
        </div>

        <aside className="flex flex-col gap-4">
          <div role="tablist" aria-label="설정" className="grid grid-cols-4 gap-1 rounded-lg border border-border bg-navy-deep p-1">
            {TABS.map((t) => (
              <button
                key={t.key}
                role="tab"
                type="button"
                aria-selected={tab === t.key}
                onClick={() => setTab(t.key)}
                className={cn(
                  'rounded-md py-2 text-sm font-medium transition-colors',
                  tab === t.key ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div role="tabpanel">
            {tab === 'data' && <DataPanel control={control} results={results} />}
            {tab === 'candidates' && <CandidatesPanel results={results} media={media} />}
            {tab === 'media' && <MediaPanel control={control} media={media} />}
            {tab === 'captions' && <CaptionsPanel control={control} />}
          </div>
        </aside>
      </main>
    </div>
  )
}
