export type SceneKey = 'opening' | 'candidates' | 'live' | 'winner' | 'ending'

export const SCENES: { key: SceneKey; label: string }[] = [
  { key: 'opening', label: '오프닝' },
  { key: 'candidates', label: '후보자 소개' },
  { key: 'live', label: '실시간 개표 현황' },
  { key: 'winner', label: '당선자 발표' },
  { key: 'ending', label: '방송 종료' },
]

export interface Slide {
  id: string
  key: SceneKey
  label: string
  race?: number
}

const PER_RACE: SceneKey[] = ['candidates', 'live', 'winner']

export function buildSlides(raceTitles: string[] = []): Slide[] {
  const races = raceTitles.length ? raceTitles : ['']
  return SCENES.flatMap<Slide>((scene) => {
    if (!PER_RACE.includes(scene.key)) return [{ id: scene.key, key: scene.key, label: scene.label }]
    return races.map((title, race) => ({
      id: `${scene.key}-${race}`,
      key: scene.key,
      label: races.length > 1 && title ? `${scene.label} · ${title}` : scene.label,
      race,
    }))
  })
}

export interface Race {
  title: string
  candidates: Candidate[]
  invalidVotes: number
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
  races?: Race[]
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
