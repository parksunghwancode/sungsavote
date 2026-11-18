'use client'

import { Check, Copy, Pause, Play, RotateCcw } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import type { ResultsState } from '@/hooks/use-results'
import { APPS_SCRIPT_CODE } from '@/lib/apps-script'
import { updateControl, type ControlState, type DataMode } from '@/lib/control-store'
import { dummyProgress } from '@/lib/dummy'
import { Field, Panel, Segmented, TextInput } from './fields'

const MODES: { value: DataMode; label: string }[] = [
  { value: 'auto', label: '자동' },
  { value: 'sheet', label: '구글 시트' },
  { value: 'appsscript', label: 'Apps Script' },
  { value: 'dummy', label: '더미' },
]

export function DataPanel({ control, results }: { control: ControlState; results: ResultsState }) {
  const [copied, setCopied] = useState(false)
  const progress = dummyProgress(control.dummy)
  const running = control.dummy.manual === null && control.dummy.startedAt !== null && progress < 1

  const status = results.error
    ? { tone: 'text-live', text: `연결 오류: ${results.error.message}` }
    : results.isFallback
      ? { tone: 'text-gold', text: '시트에 후보 데이터가 없어 더미 데이터로 송출 중입니다' }
      : results.isDummy
        ? { tone: 'text-gold', text: '더미 데이터로 송출 중입니다' }
        : { tone: 'text-success', text: `실데이터 연결됨 · 후보 ${results.candidates.length}명` }

  return (
    <div className="flex flex-col gap-4">
      <Panel title="데이터 소스" description="자동 모드는 시트에 데이터가 있으면 실데이터, 없으면 더미 데이터로 전환합니다.">
        <Segmented label="데이터 모드" value={control.dataMode} options={MODES} onChange={(dataMode) => updateControl({ dataMode })} />
        <p className={`text-sm font-medium ${status.tone}`} role="status">
          {status.text}
        </p>
        <Field label="구글 시트 링크" htmlFor="sheet-url" hint="시트를 '링크가 있는 모든 사용자 - 뷰어'로 공유해 주세요.">
          <TextInput id="sheet-url" value={control.sheetUrl} onCommit={(sheetUrl) => updateControl({ sheetUrl })} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="후보 시트 이름" htmlFor="cand-sheet" hint="비우면 첫 번째 시트">
            <TextInput id="cand-sheet" value={control.candidatesSheet} placeholder="예: 후보" onCommit={(candidatesSheet) => updateControl({ candidatesSheet })} />
          </Field>
          <Field label="설정 시트 이름" htmlFor="set-sheet" hint="총 투표수·무효표 등">
            <TextInput id="set-sheet" value={control.settingsSheet} onCommit={(settingsSheet) => updateControl({ settingsSheet })} />
          </Field>
          <Field label="갱신 주기 (초)" htmlFor="poll">
            <TextInput id="poll" type="number" value={String(control.pollSec)} onCommit={(v) => updateControl({ pollSec: Math.max(2, Number(v) || 5) })} />
          </Field>
          <Field label="총 투표수 수동 입력" htmlFor="total" hint="비우면 시트 값 사용">
            <TextInput
              id="total"
              type="number"
              value={control.totalBallotsOverride === null ? '' : String(control.totalBallotsOverride)}
              onCommit={(v) => updateControl({ totalBallotsOverride: v.trim() === '' ? null : Number(v) })}
            />
          </Field>
        </div>
        <div className="rounded-md border border-border bg-navy-deep p-3 text-xs leading-relaxed text-muted-foreground">
          <p className="mb-1 font-bold text-foreground">시트 작성 형식</p>
          <p>후보 시트 1행: 기호 | 이름 | 슬로건 | 득표수 | 사진URL | 색상</p>
          <p>설정 시트: A열 항목명, B열 값 → 총투표수 · 개표수 · 무효표 · 선거인수 · 선거명</p>
        </div>
      </Panel>

      <Panel title="더미 개표 시뮬레이션" description="시트 없이 리허설할 때 사용합니다. 진행률을 직접 조절하거나 자동 재생할 수 있습니다.">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-sm">
            <label htmlFor="dummy-progress" className="font-medium">
              개표 진행률
            </label>
            <span className="font-mono font-bold text-gold">{(progress * 100).toFixed(0)}%</span>
          </div>
          <input
            id="dummy-progress"
            type="range"
            min={0}
            max={100}
            value={Math.round(progress * 100)}
            onChange={(e) => updateControl((p) => ({ dummy: { ...p.dummy, manual: Number(e.target.value) / 100 } }))}
            className="w-full accent-[var(--primary)]"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() =>
              updateControl((p) => ({
                dummy: running
                  ? { ...p.dummy, manual: progress }
                  : { ...p.dummy, manual: null, startedAt: Date.now() - progress * p.dummy.durationSec * 1000 },
              }))
            }
          >
            {running ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}
            {running ? '일시정지' : '자동 진행'}
          </Button>
          <Button variant="outline" onClick={() => updateControl((p) => ({ dummy: { ...p.dummy, manual: 0, startedAt: null } }))}>
            <RotateCcw aria-hidden="true" />
            처음부터
          </Button>
          <Button variant="outline" onClick={() => updateControl((p) => ({ dummy: { ...p.dummy, manual: 1 } }))}>
            개표 완료
          </Button>
        </div>
        <Field label="자동 진행 시간 (초)" htmlFor="dummy-duration">
          <TextInput
            id="dummy-duration"
            type="number"
            value={String(control.dummy.durationSec)}
            onCommit={(v) => updateControl((p) => ({ dummy: { ...p.dummy, durationSec: Math.max(10, Number(v) || 180) } }))}
          />
        </Field>
      </Panel>

      <Panel
        title="Apps Script 연동 (선택)"
        description="시트를 비공개로 유지하려면 확장 프로그램 > Apps Script에 아래 코드를 붙여넣고 웹 앱으로 배포한 뒤 URL을 입력하세요."
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              void navigator.clipboard.writeText(APPS_SCRIPT_CODE)
              setCopied(true)
              setTimeout(() => setCopied(false), 1500)
            }}
          >
            {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
            {copied ? '복사됨' : '코드 복사'}
          </Button>
        }
      >
        <Field label="웹 앱 URL" htmlFor="script-url">
          <TextInput id="script-url" value={control.scriptUrl} placeholder="https://script.google.com/macros/s/.../exec" onCommit={(scriptUrl) => updateControl({ scriptUrl })} />
        </Field>
      </Panel>
    </div>
  )
}
