'use client'

import { useSyncExternalStore } from 'react'
import type { DummyState } from './dummy'
import type { SceneKey, VideoSceneKey } from './types'

export type DataMode = 'auto' | 'sheet' | 'appsscript' | 'dummy'
export type WinnerLabel = '당선 확정' | '당선 유력' | '당선 예상'

export interface CandidateOverride {
  name?: string
  slogan?: string
  color?: string
}

export interface ControlState {
  scene: SceneKey
  electionTitle: string
  schoolName: string
  ticker: string
  tickerAutoSummary: boolean
  lowerThird: { visible: boolean; title: string; text: string }
  winnerLabel: WinnerLabel
  credits: string
  dataMode: DataMode
  sheetUrl: string
  candidatesSheet: string
  settingsSheet: string
  scriptUrl: string
  pollSec: number
  totalBallotsOverride: number | null
  dummy: DummyState
  candidateOverrides: Record<string, CandidateOverride>
  videoUrls: Partial<Record<VideoSceneKey, string>>
  videoLoop: Partial<Record<VideoSceneKey, boolean>>
  videoMuted: boolean
  videoNonce: number
}

export const DEFAULT_SHEET_URL =
  'https://docs.google.com/spreadsheets/d/1QKftNPZx2IRmyawVlnc3eT7YkCDDoVnUdY8gCzj5ikI/edit?usp=sharing'

export const DEFAULT_CONTROL: ControlState = {
  scene: 'opening',
  electionTitle: '제27대 전교회장 선거',
  schoolName: '한빛고등학교',
  ticker: '투표에 참여해 주신 모든 학생 여러분께 감사드립니다 · 개표 결과는 선거관리위원회의 최종 확인 후 확정됩니다',
  tickerAutoSummary: true,
  lowerThird: { visible: false, title: '선거관리위원회', text: '현재 개표가 순조롭게 진행되고 있습니다' },
  winnerLabel: '당선 확정',
  credits: '주최 | 학생회 선거관리위원회\n제작 | 방송부\n진행 | 방송부 아나운서팀\n그래픽 | 방송부 영상팀\n협조 | 학생회 · 각 학급 선거위원',
  dataMode: 'auto',
  sheetUrl: DEFAULT_SHEET_URL,
  candidatesSheet: '',
  settingsSheet: '설정',
  scriptUrl: '',
  pollSec: 5,
  totalBallotsOverride: null,
  dummy: { startedAt: null, durationSec: 180, manual: 0.45 },
  candidateOverrides: {},
  videoUrls: {},
  videoLoop: {},
  videoMuted: false,
  videoNonce: 0,
}

const STORAGE_KEY = 'election-broadcast-control-v1'
const listeners = new Set<() => void>()
let cachedRaw: string | null | undefined
let cachedState: ControlState = DEFAULT_CONTROL

function readState(): ControlState {
  if (typeof window === 'undefined') return DEFAULT_CONTROL
  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (raw === cachedRaw) return cachedState
  cachedRaw = raw
  try {
    const parsed = raw ? (JSON.parse(raw) as Partial<ControlState>) : {}
    cachedState = {
      ...DEFAULT_CONTROL,
      ...parsed,
      lowerThird: { ...DEFAULT_CONTROL.lowerThird, ...parsed.lowerThird },
      dummy: { ...DEFAULT_CONTROL.dummy, ...parsed.dummy },
    }
  } catch {
    cachedState = DEFAULT_CONTROL
  }
  return cachedState
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) listener()
  }
  window.addEventListener('storage', onStorage)
  return () => {
    listeners.delete(listener)
    window.removeEventListener('storage', onStorage)
  }
}

export function getControl() {
  return readState()
}

export function updateControl(patch: Partial<ControlState> | ((prev: ControlState) => Partial<ControlState>)) {
  const prev = readState()
  const next = { ...prev, ...(typeof patch === 'function' ? patch(prev) : patch) }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  listeners.forEach((l) => l())
}

export function resetControl() {
  window.localStorage.removeItem(STORAGE_KEY)
  listeners.forEach((l) => l())
}

export function useControl() {
  return useSyncExternalStore(subscribe, readState, () => DEFAULT_CONTROL)
}
