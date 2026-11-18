'use client'

import { useEffect } from 'react'
import useSWR from 'swr'

const DB_NAME = 'election-broadcast-media'
const STORE = 'files'
const CHANNEL = 'election-broadcast-media'

export interface MediaEntry {
  url: string
  name: string
  type: string
  size: number
}

interface StoredMedia {
  key: string
  blob: Blob
  name: string
  type: string
  updatedAt: number
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1)
    req.onupgradeneeded = () => req.result.createObjectStore(STORE, { keyPath: 'key' })
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

async function tx<T>(mode: IDBTransactionMode, run: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const req = run(db.transaction(STORE, mode).objectStore(STORE))
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

function notify() {
  const channel = new BroadcastChannel(CHANNEL)
  channel.postMessage('changed')
  channel.close()
  void globalMutate?.()
}

let globalMutate: (() => Promise<unknown>) | null = null
const urlCache = new Map<string, { stamp: number; url: string }>()

export async function putMedia(key: string, file: File) {
  await tx('readwrite', (s) =>
    s.put({ key, blob: file, name: file.name, type: file.type, updatedAt: Date.now() } satisfies StoredMedia),
  )
  notify()
}

export async function deleteMedia(key: string) {
  await tx('readwrite', (s) => s.delete(key))
  notify()
}

async function loadAll(): Promise<Record<string, MediaEntry>> {
  const items = (await tx('readonly', (s) => s.getAll())) as StoredMedia[]
  const result: Record<string, MediaEntry> = {}
  const live = new Set<string>()
  for (const item of items) {
    live.add(item.key)
    let cached = urlCache.get(item.key)
    if (!cached || cached.stamp !== item.updatedAt) {
      if (cached) URL.revokeObjectURL(cached.url)
      cached = { stamp: item.updatedAt, url: URL.createObjectURL(item.blob) }
      urlCache.set(item.key, cached)
    }
    result[item.key] = { url: cached.url, name: item.name, type: item.type, size: item.blob.size }
  }
  for (const [key, cached] of urlCache) {
    if (!live.has(key)) {
      URL.revokeObjectURL(cached.url)
      urlCache.delete(key)
    }
  }
  return result
}

export function useMedia() {
  const { data, mutate } = useSWR('indexeddb-media', loadAll, {
    revalidateOnFocus: false,
    fallbackData: {},
  })
  useEffect(() => {
    globalMutate = () => mutate()
    const channel = new BroadcastChannel(CHANNEL)
    channel.onmessage = () => void mutate()
    return () => channel.close()
  }, [mutate])
  return data ?? {}
}

export const photoKey = (number: number) => `photo-${number}`
export const videoKey = (scene: string) => `video-${scene}`
