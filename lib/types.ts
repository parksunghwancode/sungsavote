export type SceneKey = 'opening' | 'candidates' | 'live' | 'interim' | 'winner' | 'ending'
export type VideoSceneKey = Exclude<SceneKey, 'live'>

export const SCENES: { key: SceneKey; label: string; short: string; hasVideo: boolean }[] = [
  { key: 'opening', label: '오프닝', short: 'OPENING', hasVideo: true },
  { key: 'candidates', label: '후보자 소개', short: 'CANDIDATES', hasVideo: true },
  { key: 'live', label: '실시간 개표 현황', short: 'LIVE COUNT', hasVideo: false },
  { key: 'interim', label: '개표 중간 방송', short: 'INTERIM', hasVideo: true },
  { key: 'winner', label: '당선자 발표', short: 'WINNER', hasVideo: true },
  { key: 'ending', label: '방송 종료', short: 'ENDING', hasVideo: true },
]

export const VIDEO_SCENES = SCENES.filter((s) => s.hasVideo) as {
  key: VideoSceneKey
  label: string
  short: string
  hasVideo: true
}[]

export interface Candidate {
  number: number
  name: string
  slogan: string
  votes: number
  photo?: string
  color?: string
}

export type DataSource = 'sheet' | 'appsscript' | 'dummy'

export interface ResultsData {
  candidates: Candidate[]
  totalBallots: number | null
  countedBallots: number | null
  invalidVotes: number
  eligibleVoters: number | null
  title?: string
  source: DataSource
  updatedAt: string
}

export interface CandidateView extends Candidate {
  rank: number
  pct: number
  color: string
  photoUrl: string | null
}

export interface ResultStats {
  validVotes: number
  counted: number
  totalBallots: number | null
  countRate: number | null
  invalid: number
  eligible: number | null
  turnout: number | null
  remaining: number | null
  margin: number
  leader: CandidateView | null
  runnerUp: CandidateView | null
}
