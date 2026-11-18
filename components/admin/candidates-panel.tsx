'use client'

import { ImageUp, Trash2 } from 'lucide-react'
import { CandidatePhoto } from '@/components/broadcast/primitives'
import { Button } from '@/components/ui/button'
import type { ResultsState } from '@/hooks/use-results'
import { updateControl, type CandidateOverride } from '@/lib/control-store'
import { deleteMedia, photoKey, putMedia, type MediaEntry } from '@/lib/media-store'
import { Panel, TextInput } from './fields'

function setOverride(number: number, patch: CandidateOverride) {
  updateControl((p) => ({
    candidateOverrides: {
      ...p.candidateOverrides,
      [number]: { ...p.candidateOverrides[String(number)], ...patch },
    },
  }))
}

export function CandidatesPanel({ results, media }: { results: ResultsState; media: Record<string, MediaEntry> }) {
  return (
    <Panel title="후보자 관리" description="시트 값을 방송용으로 덮어쓰고, 후보 사진을 업로드합니다. 사진은 이 컴퓨터 브라우저에 저장됩니다.">
      {results.candidates.length === 0 && <p className="text-sm text-muted-foreground">불러온 후보가 없습니다.</p>}
      <ul className="flex flex-col gap-3">
        {results.candidates.map((c) => {
          const hasUpload = !!media[photoKey(c.number)]
          return (
            <li key={c.number} className="flex gap-4 rounded-md border border-border bg-navy-deep p-3">
              <div className="flex flex-col items-center gap-2">
                <CandidatePhoto candidate={c} className="size-20 rounded-md text-3xl" />
                <div className="flex gap-1">
                  <label className="flex size-7 cursor-pointer items-center justify-center rounded-md border border-border hover:bg-secondary">
                    <ImageUp className="size-3.5" aria-hidden="true" />
                    <span className="sr-only">{c.name} 사진 업로드</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) void putMedia(photoKey(c.number), file)
                        e.target.value = ''
                      }}
                    />
                  </label>
                  {hasUpload && (
                    <Button variant="ghost" size="icon-sm" onClick={() => void deleteMedia(photoKey(c.number))}>
                      <Trash2 aria-hidden="true" />
                      <span className="sr-only">{c.name} 업로드 사진 삭제</span>
                    </Button>
                  )}
                </div>
              </div>
              <div className="flex flex-1 flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="rounded px-2 py-0.5 font-mono text-sm font-bold" style={{ background: c.color }}>
                    {c.number}
                  </span>
                  <TextInput id={`name-${c.number}`} value={c.name} onCommit={(name) => setOverride(c.number, { name })} className="h-8" />
                  <input
                    type="color"
                    aria-label={`${c.name} 상징색`}
                    value={c.color}
                    onChange={(e) => setOverride(c.number, { color: e.target.value })}
                    className="h-8 w-10 shrink-0 cursor-pointer rounded border border-border bg-transparent"
                  />
                </div>
                <TextInput id={`slogan-${c.number}`} value={c.slogan} placeholder="슬로건" onCommit={(slogan) => setOverride(c.number, { slogan })} className="h-8" />
                <p className="font-mono text-xs text-muted-foreground">
                  {c.votes.toLocaleString()}표 · {c.pct.toFixed(1)}% · {c.rank}위
                </p>
              </div>
            </li>
          )
        })}
      </ul>
      <Button variant="outline" size="sm" className="self-start" onClick={() => updateControl({ candidateOverrides: {} })}>
        시트 값으로 되돌리기
      </Button>
    </Panel>
  )
}
