'use client'

import useSWR from 'swr'
import { BROADCAST_CONFIG, DEFAULT_CANDIDATES } from '@/lib/config'
import type { CandidateView, ResultStats, ResultsData } from '@/lib/types'

export const FALLBACK_COLORS = ['#1530D0', '#E0233A', '#12A37B', '#FF7A1A', '#9B6BFF', '#14B8C4']

async function fetchResults(url: string): Promise<ResultsData> {
  const res = await fetch(url, { cache: 'no-store' })
  const json = await res.json()
  if (!res.ok) throw new Error(json?.error ?? '데이터를 불러오지 못했습니다.')
  return json
}

const RESULTS_URL = `/api/results?${new URLSearchParams({
  sheet: BROADCAST_CONFIG.sheetUrl,
  settings: BROADCAST_CONFIG.settingsSheet,
})}`

export function useResults() {
  const { data } = useSWR(RESULTS_URL, fetchResults, {
    refreshInterval: BROADCAST_CONFIG.pollSec * 1000,
    keepPreviousData: true,
    revalidateOnFocus: false,
    errorRetryInterval: 5000,
  })

  const source = data?.candidates.length ? data.candidates : DEFAULT_CANDIDATES

  const list: CandidateView[] = source.map((c, i) => ({
    ...c,
    color: c.color || FALLBACK_COLORS[i % FALLBACK_COLORS.length],
    photoUrl: c.photo ?? null,
    rank: 0,
    pct: 0,
  }))
  const validVotes = list.reduce((s, c) => s + c.votes, 0)
  const sorted = [...list].sort((a, b) => b.votes - a.votes || a.number - b.number)
  sorted.forEach((c, i) => {
    c.pct = validVotes > 0 ? (c.votes / validVotes) * 100 : 0
    c.rank = i > 0 && sorted[i - 1].votes === c.votes ? sorted[i - 1].rank : i + 1
  })

  const candidates = [...list].sort((a, b) => a.number - b.number)
  const ranked = sorted
  const invalid = data?.invalidVotes ?? 0
  const counted = validVotes + invalid
  const eligible = data?.eligibleVoters ?? null

  const stats: ResultStats = {
    validVotes,
    counted,
    totalBallots: eligible,
    countRate: eligible ? Math.min(100, (counted / eligible) * 100) : null,
    invalid,
    eligible,
    turnout: null,
    remaining: eligible ? Math.max(0, eligible - counted) : null,
    margin: ranked[0] && ranked[1] ? ranked[0].votes - ranked[1].votes : 0,
    leader: ranked[0] && ranked[0].votes > 0 ? ranked[0] : null,
    runnerUp: ranked[1] ?? null,
  }

  return { candidates, ranked, stats, title: data?.title, updatedAt: data?.updatedAt }
}

export type ResultsState = ReturnType<typeof useResults>
