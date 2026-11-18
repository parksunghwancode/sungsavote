import type { Metadata } from 'next'
import { BroadcastClient } from '@/components/broadcast/broadcast-client'

export const metadata: Metadata = {
  title: '송출 화면 · 전교회장 선거 개표방송',
}

export default function BroadcastPage() {
  return <BroadcastClient />
}
