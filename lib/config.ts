import type { Candidate } from './types'

export const BROADCAST_CONFIG = {
  schoolName: '성사중학교',
  electionTitle: '2026년도 성사중학교 전교회장 선거',
  logo: '/images/school-logo.png',
  logoOnDark: '/images/school-logo-white.png',
  winnerLabel: '전교회장 당선',
  ticker: '개표 결과는 선거관리위원회의 최종 확인 후 확정됩니다',
  credits: ['주최|학생회 선거관리위원회', '진행|방송부', '함께해 주신 모든 학생 여러분 감사합니다'],
  sheetUrl: 'https://docs.google.com/spreadsheets/d/182bYfn4wg2QDdXQ5WU64LJXweCAfT-ZdDzbE58jIMlg/edit?usp=sharing',
  settingsSheet: '설정',
  pollSec: 5,
}

export type BroadcastConfig = typeof BROADCAST_CONFIG

export const DEFAULT_CANDIDATES: Candidate[] = [
  { number: 1, name: '윤민재', slogan: '', votes: 0 },
  { number: 2, name: '임소연', slogan: '', votes: 0 },
]
