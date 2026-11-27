import type { Candidate } from './types'

export const BROADCAST_CONFIG = {
  schoolName: '성사중학교',
  electionTitle: '2027학년도 성사중학교 전교회장 선거',
  logo: '/images/school-logo.png',
  logoOnDark: '/images/school-logo-white.png',
  winnerLabel: '전교회장 당선',
  ticker: '',
  credits: ['주최|학생회 선거관리위원회', '진행|방송부', '함께해 주신 모든 학생 여러분 감사합니다'],
  sheetUrl: 'https://docs.google.com/spreadsheets/d/182bYfn4wg2QDdXQ5WU64LJXweCAfT-ZdDzbE58jIMlg/edit?usp=sharing',
  settingsSheet: '설정',
  pollSec: 5,
}

export type BroadcastConfig = typeof BROADCAST_CONFIG

export const CANDIDATE_PHOTOS: Record<string, string> = {
  윤민재: '/images/candidates/yoon-minjae.png',
  임소연: '/images/candidates/lim-soyeon.png',
  이도영: '/images/candidates/lee-doyoung.png',
  심민규: '/images/candidates/shim-mingyu.png',
}

export const DEFAULT_CANDIDATES: Candidate[] = [
  { number: 1, name: '윤민재', slogan: '', votes: 0 },
  { number: 2, name: '임소연', slogan: '', votes: 0 },
]
