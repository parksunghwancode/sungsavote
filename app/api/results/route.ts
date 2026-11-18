import { NextResponse, type NextRequest } from 'next/server'
import { extractSheetId, parseCsv, rowsToCandidates, rowsToSettings } from '@/lib/sheet-parser'
import type { ResultsData } from '@/lib/types'

export const dynamic = 'force-dynamic'

const ALLOWED_SCRIPT_HOSTS = new Set(['script.google.com', 'script.googleusercontent.com'])

function fail(message: string, status = 502) {
  return NextResponse.json({ error: message }, { status, headers: { 'Cache-Control': 'no-store' } })
}

async function fetchSheetCsv(sheetId: string, sheetName: string) {
  const url = new URL(`https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq`)
  url.searchParams.set('tqx', 'out:csv')
  if (sheetName) url.searchParams.set('sheet', sheetName)
  const res = await fetch(url, { cache: 'no-store', signal: AbortSignal.timeout(8000) })
  const type = res.headers.get('content-type') ?? ''
  if (!res.ok || !type.includes('text/csv')) {
    throw new Error('시트를 불러올 수 없습니다. 공유 설정이 "링크가 있는 모든 사용자(뷰어)"인지 확인하세요.')
  }
  return parseCsv(await res.text())
}

function toStringRows(value: unknown): string[][] {
  if (!Array.isArray(value)) return []
  return value.map((row) => (Array.isArray(row) ? row.map((c) => (c === null || c === undefined ? '' : String(c))) : []))
}

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams
  const script = params.get('script')

  try {
    if (script) {
      let scriptUrl: URL
      try {
        scriptUrl = new URL(script)
      } catch {
        return fail('Apps Script URL 형식이 올바르지 않습니다.', 400)
      }
      if (scriptUrl.protocol !== 'https:' || !ALLOWED_SCRIPT_HOSTS.has(scriptUrl.hostname)) {
        return fail('script.google.com 의 웹 앱 URL만 사용할 수 있습니다.', 400)
      }
      const res = await fetch(scriptUrl, { cache: 'no-store', redirect: 'follow', signal: AbortSignal.timeout(10000) })
      if (!res.ok) return fail(`Apps Script 응답 오류 (${res.status})`)
      const json = (await res.json().catch(() => null)) as { candidates?: unknown; settings?: unknown } | null
      if (!json) return fail('Apps Script가 JSON을 반환하지 않았습니다. 배포 액세스 권한을 "모든 사용자"로 설정하세요.')
      const payload: ResultsData = {
        candidates: rowsToCandidates(toStringRows(json.candidates)),
        ...rowsToSettings(toStringRows(json.settings)),
        source: 'appsscript',
        updatedAt: new Date().toISOString(),
      }
      return NextResponse.json(payload, { headers: { 'Cache-Control': 'no-store' } })
    }

    const sheetId = extractSheetId(params.get('sheet') ?? '')
    if (!sheetId) return fail('스프레드시트 링크 또는 ID가 올바르지 않습니다.', 400)
    const candidatesSheet = (params.get('candidates') ?? '').slice(0, 100)
    const settingsSheet = (params.get('settings') ?? '').slice(0, 100)

    const [candidateRows, fetchedSettingRows] = await Promise.all([
      fetchSheetCsv(sheetId, candidatesSheet),
      settingsSheet ? fetchSheetCsv(sheetId, settingsSheet).catch(() => []) : Promise.resolve([]),
    ])
    // Google returns the first tab when the named tab does not exist; ignore that copy.
    const sameAsCandidates = fetchedSettingRows[0]?.join('\u0000') === candidateRows[0]?.join('\u0000')
    const settingRows = sameAsCandidates ? [] : fetchedSettingRows

    const payload: ResultsData = {
      candidates: rowsToCandidates(candidateRows),
      ...rowsToSettings(settingRows),
      source: 'sheet',
      updatedAt: new Date().toISOString(),
    }
    return NextResponse.json(payload, { headers: { 'Cache-Control': 'no-store' } })
  } catch (error) {
    return fail(error instanceof Error ? error.message : '데이터를 불러오지 못했습니다.')
  }
}
