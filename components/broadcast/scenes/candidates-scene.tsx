'use client'

import { CandidateColumn, CandidateColumns } from './candidate-column'
import type { SceneProps } from './types'

export function CandidatesScene({ results }: SceneProps) {
  const list = results.candidates
  const photo = list.length > 3 ? { width: 280, height: 340 } : { width: 380, height: 460 }

  return (
    <div className="absolute inset-0 flex flex-col gap-10 px-20 pb-[124px] pt-[200px]">
      <div className="bc-rise flex flex-col items-center gap-3">
        <h2 className="text-[72px] font-black leading-tight tracking-tight">후보자 소개</h2>
        <p className="text-3xl font-medium text-muted-foreground">{list.length}명의 후보가 출마했습니다</p>
      </div>
      <CandidateColumns>
        {list.map((c, i) => (
          <CandidateColumn key={c.number} candidate={c} index={i} photo={photo} nameSize="text-7xl" />
        ))}
      </CandidateColumns>
    </div>
  )
}
