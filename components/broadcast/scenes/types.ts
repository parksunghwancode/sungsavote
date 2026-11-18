import type { ResultsState } from '@/hooks/use-results'
import type { BroadcastConfig } from '@/lib/config'

export interface SceneProps {
  config: BroadcastConfig
  results: ResultsState
}
