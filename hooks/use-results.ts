'use client'

import useSWR from 'swr'
import type { ControlState } from '@/lib/control-store'
import { buildDummyResults, dummyProgress } from '@/lib/dummy'
import { photoKey, useMedia } from '@/lib/media-store'
import type { CandidateView, ResultStats, ResultsData } from '@/lib/types'

export const FALLBACK_COLORS = ['#2F6BFF', '#E5383B', '#12A37B', '#FF7A1A', '#9B6BFF', '#14B8C4', '#E8B10E', '#E85D9C']

async function fetchResults(url: string): Promise<ResultsData> {
  const res = await fetch(url, { cache: 'no-store' })
  const json = await res.json()
  if (!res.ok) throw new Error(json?.error ?? '데이터를 불러오지 못했습니다.')
  return json
}

function remoteKey(control: ControlState) {
  if (control.dataMode === 'dummy') return null
  const params = new URLSearchParams()
  if (control.dataMode === 'appsscript') {
    if (!control.scriptUrl.trim()) return null
    params.set('script', control.scriptUrl.trim())
  } else {
    params.set('sheet', control.sheetUrl)
    if (control.candidatesSheet) params.set('candidates', control.candidatesSheet)
    if (control.settingsSheet) params.set('settings', control.settingsSheet)
  }
  return `/api/results?${params.toString()}`
}

export function useResults(control: ControlState) {
  const media = useMedia()
  const key = remoteKey(control)
  const remote = useSWR(key, fetchResults, {
    refreshInterval: Math.max(2, control.pollSec) * 1000,
    keepPreviousData: true,
    revalidateOnFocus: false,
    shouldRetryOnError: true,
    errorRetryInterval: 5000,
  })

  const remoteUsable = !!key && !!remote.data && remote.data.candidates.length > 0
  const useDummy = control.dataMode === 'dummy' || (control.dataMode === 'auto' && !remoteUsable)

  const dummy = useSWR(
    useDummy ? ['dummy', control.dummy.startedAt, control.dummy.manual, control.dummy.durationSec] : null,
    () => buildDummyResults(dummyProgress(control.dummy)),
    { refreshInterval: 1500, revalidateOnFocus: false },
  )

  const data: ResultsData | undefined = useDummy ? dummy.data : remote.data

  const candidates: CandidateView[] = (() => {
    if (!data) return []
    const list = data.candidates.map((c, i) => {
      const o = control.candidateOverrides[String(c.number)] ?? {}
      return {
        ...c,
        name: o.name?.trim() || c.name,
        slogan: o.slogan?.trim() || c.slogan,
        color: o.color || c.color || FALLBACK_COLORS[i % FALLBACK_COLORS.length],
        photoUrl: media[photoKey(c.number)]?.url ?? c.photo ?? null,
        rank: 0,
        pct: 0,
      }
    })
    const valid = list.reduce((s, c) => s + c.votes, 0)
    const sorted = [...list].sort((a, b) => b.votes - a.votes || a.number - b.number)
    sorted.forEach((c, i) => {
      c.pct = valid > 0 ? (c.votes / valid) * 100 : 0
      c.rank = i > 0 && sorted[i - 1].votes === c.votes ? sorted[i - 1].rank : i + 1
    })
    return list.sort((a, b) => a.number - b.number)
  })()

  const ranked = [...candidates].sort((a, b) => a.rank - b.rank || a.number - b.number)
  const validVotes = candidates.reduce((s, c) => s + c.votes, 0)
  const invalid = data?.invalidVotes ?? 0
  const counted = data?.countedBallots ?? validVotes + invalid
  const totalBallots = control.totalBallotsOverride ?? data?.totalBallots ?? null
  const eligible = data?.eligibleVoters ?? null
  const leader = ranked[0] && ranked[0].votes > 0 ? ranked[0] : null

  const stats: ResultStats = {
    validVotes,
    counted,
    totalBallots,
    countRate: totalBallots ? Math.min(100, (counted / totalBallots) * 100) : null,
    invalid,
    eligible,
    turnout: eligible && totalBallots ? Math.min(100, (totalBallots / eligible) * 100) : null,
    remaining: totalBallots ? Math.max(0, totalBallots - counted) : null,
    margin: ranked[0] && ranked[1] ? ranked[0].votes - ranked[1].votes : 0,
    leader,
    runnerUp: ranked[1] ?? null,
  }

  return {
    data,
    candidates,
    ranked,
    stats,
    title: data?.title,
    isDummy: useDummy,
    isFallback: useDummy && control.dataMode === 'auto',
    error: remote.error as Error | undefined,
    isLoading: !data,
  }
}

export type ResultsState = ReturnType<typeof useResults>
