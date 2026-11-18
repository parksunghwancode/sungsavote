import type { ResultsData } from './types'

export interface DummyState {
  startedAt: number | null
  durationSec: number
  manual: number | null
}

const DUMMY = [
  { number: 1, name: '김서준', slogan: '듣는 학생회, 움직이는 학교', final: 412, curve: 1.4, color: '#2F6BFF', photo: '/candidates/1.png' },
  { number: 2, name: '이하은', slogan: '모두가 주인공인 우리 학교', final: 387, curve: 0.8, color: '#E5383B', photo: '/candidates/2.png' },
  { number: 3, name: '박지호', slogan: '약속은 데이터로 증명합니다', final: 245, curve: 0.95, color: '#12A37B', photo: '/candidates/3.png' },
  { number: 4, name: '최유나', slogan: '즐거운 등굣길을 만듭니다', final: 156, curve: 1.1, color: '#FF7A1A', photo: '/candidates/4.png' },
]

const TOTAL_BALLOTS = 1250
const ELIGIBLE = 1320
const FINAL_INVALID = 50

export function dummyProgress(state: DummyState, now = Date.now()): number {
  if (state.manual !== null) return Math.min(1, Math.max(0, state.manual))
  if (!state.startedAt) return 0
  return Math.min(1, Math.max(0, (now - state.startedAt) / (state.durationSec * 1000)))
}

export function buildDummyResults(progress: number): ResultsData {
  const p = Math.min(1, Math.max(0, progress))
  const candidates = DUMMY.map((c) => ({
    number: c.number,
    name: c.name,
    slogan: c.slogan,
    color: c.color,
    photo: c.photo,
    votes: Math.round(c.final * Math.pow(p, c.curve)),
  }))
  const invalidVotes = Math.round(FINAL_INVALID * p)
  const counted = candidates.reduce((sum, c) => sum + c.votes, 0) + invalidVotes
  return {
    candidates,
    totalBallots: TOTAL_BALLOTS,
    countedBallots: counted,
    invalidVotes,
    eligibleVoters: ELIGIBLE,
    source: 'dummy',
    updatedAt: new Date().toISOString(),
  }
}
