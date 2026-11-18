export type SceneKey = 'opening' | 'candidates' | 'video' | 'live' | 'interim' | 'winner' | 'ending'

export const SCENES: { key: Exclude<SceneKey, 'video'>; label: string }[] = [
  { key: 'opening', label: '오프닝' },
  { key: 'candidates', label: '후보자 소개' },
  { key: 'live', label: '실시간 개표 현황' },
  { key: 'interim', label: '개표 중간 방송' },
  { key: 'winner', label: '당선자 발표' },
  { key: 'ending', label: '방송 종료' },
]

export interface Slide {
  id: string
  key: SceneKey
  label: string
  candidateNumber?: number
}

export function buildSlides(candidates: { number: number; name: string }[]): Slide[] {
  const slides: Slide[] = []
  for (const scene of SCENES) {
    slides.push({ id: scene.key, key: scene.key, label: scene.label })
    if (scene.key === 'candidates') {
      for (const c of candidates) {
        slides.push({
          id: `video-${c.number}`,
          key: 'video',
          label: `기호 ${c.number}번 ${c.name} 영상`,
          candidateNumber: c.number,
        })
      }
    }
  }
  return slides
}

export interface Candidate {
  number: number
  name: string
  slogan: string
  votes: number
  photo?: string
  video?: string
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
  videoUrl: string
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
