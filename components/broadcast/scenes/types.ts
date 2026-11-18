import type { ResultsState } from '@/hooks/use-results'
import type { ControlState } from '@/lib/control-store'
import type { MediaEntry } from '@/lib/media-store'

export interface SceneProps {
  control: ControlState
  results: ResultsState
  media: Record<string, MediaEntry>
  muted: boolean
}
