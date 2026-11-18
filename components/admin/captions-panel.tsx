'use client'

import { Button } from '@/components/ui/button'
import { resetControl, updateControl, type ControlState, type WinnerLabel } from '@/lib/control-store'
import { Field, Panel, Segmented, TextArea, TextInput, Toggle } from './fields'

const WINNER_LABELS: { value: WinnerLabel; label: string }[] = [
  { value: '당선 확정', label: '당선 확정' },
  { value: '당선 유력', label: '당선 유력' },
  { value: '당선 예상', label: '당선 예상' },
]

export function CaptionsPanel({ control }: { control: ControlState }) {
  return (
    <div className="flex flex-col gap-4">
      <Panel title="방송 정보">
        <div className="grid grid-cols-2 gap-3">
          <Field label="학교 이름" htmlFor="school">
            <TextInput id="school" value={control.schoolName} onCommit={(schoolName) => updateControl({ schoolName })} />
          </Field>
          <Field label="선거 이름" htmlFor="title" hint="시트 설정의 선거명이 우선">
            <TextInput id="title" value={control.electionTitle} onCommit={(electionTitle) => updateControl({ electionTitle })} />
          </Field>
        </div>
        <Field label="당선 표기" htmlFor="winner-label">
          <Segmented label="당선 표기" value={control.winnerLabel} options={WINNER_LABELS} onChange={(winnerLabel) => updateControl({ winnerLabel })} />
        </Field>
      </Panel>

      <Panel title="하단 자막 (티커)">
        <Toggle
          id="ticker-auto"
          checked={control.tickerAutoSummary}
          onChange={(tickerAutoSummary) => updateControl({ tickerAutoSummary })}
          label="실시간 득표 요약 자동 포함"
        />
        <Field label="티커 문구" htmlFor="ticker" hint="' · ' 로 문장을 구분하세요">
          <TextArea id="ticker" rows={3} value={control.ticker} onCommit={(ticker) => updateControl({ ticker })} />
        </Field>
      </Panel>

      <Panel
        title="속보 자막 (로어서드)"
        actions={
          <Toggle
            id="lt-visible"
            checked={control.lowerThird.visible}
            onChange={(visible) => updateControl((p) => ({ lowerThird: { ...p.lowerThird, visible } }))}
            label={control.lowerThird.visible ? '송출 중' : '꺼짐'}
          />
        }
      >
        <Field label="머리말" htmlFor="lt-title">
          <TextInput id="lt-title" value={control.lowerThird.title} onCommit={(title) => updateControl((p) => ({ lowerThird: { ...p.lowerThird, title } }))} />
        </Field>
        <Field label="내용" htmlFor="lt-text">
          <TextInput id="lt-text" value={control.lowerThird.text} onCommit={(text) => updateControl((p) => ({ lowerThird: { ...p.lowerThird, text } }))} />
        </Field>
      </Panel>

      <Panel title="엔딩 크레딧" description="한 줄에 하나씩, '역할 | 이름' 형식으로 입력합니다.">
        <TextArea id="credits" rows={6} value={control.credits} onCommit={(credits) => updateControl({ credits })} />
      </Panel>

      <Button
        variant="destructive"
        className="self-start"
        onClick={() => {
          if (window.confirm('모든 송출 설정을 초기값으로 되돌릴까요? 업로드한 사진과 영상은 유지됩니다.')) resetControl()
        }}
      >
        설정 전체 초기화
      </Button>
    </div>
  )
}
