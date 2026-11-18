'use client'

import { Film, RotateCw, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { updateControl, type ControlState } from '@/lib/control-store'
import { deleteMedia, putMedia, videoKey, type MediaEntry } from '@/lib/media-store'
import { VIDEO_SCENES } from '@/lib/types'
import { Panel, TextInput, Toggle } from './fields'

export function MediaPanel({ control, media }: { control: ControlState; media: Record<string, MediaEntry> }) {
  return (
    <Panel
      title="장면별 영상"
      description="영상을 업로드하거나 URL을 입력하면 해당 장면에서 그래픽 대신 재생됩니다. 영상이 없으면 기본 그래픽이 송출됩니다."
      actions={
        <Button variant="outline" size="sm" onClick={() => updateControl((p) => ({ videoNonce: p.videoNonce + 1 }))}>
          <RotateCw aria-hidden="true" />
          처음부터 재생
        </Button>
      }
    >
      <Toggle id="video-muted" checked={!control.videoMuted} onChange={(on) => updateControl({ videoMuted: !on })} label="영상 소리 송출" />
      <ul className="flex flex-col gap-3">
        {VIDEO_SCENES.map((s) => {
          const file = media[videoKey(s.key)]
          return (
            <li key={s.key} className="flex flex-col gap-2 rounded-md border border-border bg-navy-deep p-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-bold">{s.label}</span>
                <Toggle
                  id={`loop-${s.key}`}
                  checked={!!control.videoLoop[s.key]}
                  onChange={(v) => updateControl((p) => ({ videoLoop: { ...p.videoLoop, [s.key]: v } }))}
                  label="반복"
                />
              </div>
              {file ? (
                <div className="flex items-center justify-between gap-2 rounded bg-secondary px-3 py-2 text-xs">
                  <span className="flex min-w-0 items-center gap-2">
                    <Film className="size-4 shrink-0 text-gold" aria-hidden="true" />
                    <span className="truncate">{file.name}</span>
                    <span className="shrink-0 text-muted-foreground">{(file.size / 1024 / 1024).toFixed(1)}MB</span>
                  </span>
                  <Button variant="ghost" size="icon-xs" onClick={() => void deleteMedia(videoKey(s.key))}>
                    <Trash2 aria-hidden="true" />
                    <span className="sr-only">{s.label} 영상 삭제</span>
                  </Button>
                </div>
              ) : (
                <label className="flex cursor-pointer items-center justify-center gap-2 rounded border border-dashed border-border px-3 py-2.5 text-xs font-medium text-muted-foreground hover:border-primary hover:text-foreground">
                  <Film className="size-4" aria-hidden="true" />
                  영상 파일 업로드
                  <input
                    type="file"
                    accept="video/*"
                    className="sr-only"
                    onChange={(e) => {
                      const f = e.target.files?.[0]
                      if (f) void putMedia(videoKey(s.key), f)
                      e.target.value = ''
                    }}
                  />
                </label>
              )}
              <TextInput
                id={`video-url-${s.key}`}
                value={control.videoUrls[s.key] ?? ''}
                placeholder="또는 영상 URL (mp4)"
                className="h-8 text-xs"
                onCommit={(v) => updateControl((p) => ({ videoUrls: { ...p.videoUrls, [s.key]: v.trim() } }))}
              />
            </li>
          )
        })}
      </ul>
    </Panel>
  )
}
