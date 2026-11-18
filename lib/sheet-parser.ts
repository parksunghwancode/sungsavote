import type { Candidate } from './types'

export function parseCsv(text: string): string[][] {
  const rows: string[][] = []
  let row: string[] = []
  let cell = ''
  let quoted = false
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (quoted) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          cell += '"'
          i++
        } else quoted = false
      } else cell += c
    } else if (c === '"') quoted = true
    else if (c === ',') {
      row.push(cell)
      cell = ''
    } else if (c === '\n') {
      row.push(cell)
      rows.push(row)
      row = []
      cell = ''
    } else if (c !== '\r') cell += c
  }
  if (cell || row.length) {
    row.push(cell)
    rows.push(row)
  }
  return rows.filter((r) => r.some((c) => c.trim() !== ''))
}

export function toNumber(value: unknown): number | null {
  if (value === null || value === undefined) return null
  const cleaned = String(value).replace(/[,\s표명%]/g, '')
  if (cleaned === '') return null
  const n = Number(cleaned)
  return Number.isFinite(n) ? n : null
}

export function normalizePhotoUrl(url: string | undefined): string | undefined {
  const value = url?.trim()
  if (!value) return undefined
  const driveFile = value.match(/drive\.google\.com\/file\/d\/([\w-]+)/)
  if (driveFile) return `https://lh3.googleusercontent.com/d/${driveFile[1]}`
  const driveOpen = value.match(/drive\.google\.com\/(?:open|uc)\?(?:.*&)?id=([\w-]+)/)
  if (driveOpen) return `https://lh3.googleusercontent.com/d/${driveOpen[1]}`
  if (/^https?:\/\//.test(value) || value.startsWith('/')) return value
  return undefined
}

export function normalizeVideoUrl(url: string | undefined): string | undefined {
  const value = url?.trim()
  if (!value) return undefined
  if (/^https?:\/\//.test(value) || value.startsWith('/')) return value
  if (/^[\w.-]+\.(mp4|webm|mov)$/i.test(value)) return `/videos/${value}`
  return undefined
}

const COLUMN_MATCHERS: Record<keyof Omit<Candidate, 'votes'> | 'votes', RegExp> = {
  number: /기호|번호|no/i,
  name: /이름|성명|후보|name/i,
  slogan: /소개|슬로건|공약|구호|slogan/i,
  votes: /득표|표수|votes?/i,
  photo: /사진|이미지|photo|image/i,
  video: /영상|동영상|video/i,
  color: /색|color/i,
}

export function rowsToCandidates(rows: string[][]): Candidate[] {
  if (rows.length === 0) return []
  const header = rows[0].map((h) => h.trim())
  const hasHeader = header.some((h) => COLUMN_MATCHERS.name.test(h) || COLUMN_MATCHERS.votes.test(h))

  const fallbackOrder = ['number', 'name', 'slogan', 'votes', 'photo', 'color'] as const
  const index: Record<string, number> = {}
  if (hasHeader) {
    for (const key of ['votes', 'number', 'video', 'photo', 'color', 'slogan', 'name'] as const) {
      const found = header.findIndex(
        (h, i) => COLUMN_MATCHERS[key].test(h) && !Object.values(index).includes(i),
      )
      if (found >= 0) index[key] = found
    }
  } else {
    fallbackOrder.forEach((key, i) => (index[key] = i))
  }

  const body = hasHeader ? rows.slice(1) : rows
  const candidates: Candidate[] = []
  body.forEach((row, i) => {
    const name = index.name !== undefined ? row[index.name]?.trim() : ''
    if (!name) return
    const number = (index.number !== undefined ? toNumber(row[index.number]) : null) ?? i + 1
    const color = index.color !== undefined ? row[index.color]?.trim() : ''
    candidates.push({
      number,
      name,
      slogan: index.slogan !== undefined ? (row[index.slogan] ?? '').trim() : '',
      votes: Math.max(0, (index.votes !== undefined ? toNumber(row[index.votes]) : 0) ?? 0),
      photo: index.photo !== undefined ? normalizePhotoUrl(row[index.photo]) : undefined,
      video: index.video !== undefined ? normalizeVideoUrl(row[index.video]) : undefined,
      color: /^#?[0-9a-f]{3,8}$/i.test(color ?? '') ? (color!.startsWith('#') ? color : `#${color}`) : undefined,
    })
  })
  return candidates
}

export interface SheetSettings {
  totalBallots: number | null
  countedBallots: number | null
  invalidVotes: number
  eligibleVoters: number | null
  title?: string
}

export function rowsToSettings(rows: string[][]): SheetSettings {
  const settings: SheetSettings = {
    totalBallots: null,
    countedBallots: null,
    invalidVotes: 0,
    eligibleVoters: null,
  }
  for (const row of rows) {
    const key = (row[0] ?? '').replace(/\s/g, '')
    const raw = (row[1] ?? '').trim()
    if (!key) continue
    if (/선거명|제목|title/i.test(key)) {
      if (raw) settings.title = raw
      continue
    }
    const value = toNumber(raw)
    if (value === null) continue
    if (/무효/.test(key)) settings.invalidVotes = value
    else if (/개표/.test(key)) settings.countedBallots = value
    else if (/선거인|유권자|재학생/.test(key)) settings.eligibleVoters = value
    else if (/투표/.test(key)) settings.totalBallots = value
  }
  return settings
}

export function extractSheetId(input: string): string | null {
  const value = input.trim()
  const match = value.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/)
  if (match) return match[1]
  if (/^[a-zA-Z0-9-_]{20,}$/.test(value)) return value
  return null
}
