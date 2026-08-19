import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Result, ResultInput } from '../types/result'
import { resultService } from '../services/resultService'

interface ResultsContextValue {
  results: Result[]
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
  create: (input: ResultInput) => Promise<Result>
  update: (id: string, input: Partial<ResultInput>) => Promise<Result>
  remove: (id: string) => Promise<void>
  submit: (id: string) => Promise<Result>
  approve: (id: string) => Promise<Result>
  publish: (id: string) => Promise<Result>
  getResultsForStudent: (studentId: string) => Promise<Result[]>
}

const ResultsContext = createContext<ResultsContextValue | undefined>(undefined)

export function ResultsProvider({ children }: { children: ReactNode }) {
  const [results, setResults] = useState<Result[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setResults(await resultService.list())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load results.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const upsert = useCallback((next: Result) => {
    setResults((prev) => {
      const exists = prev.some((r) => r.id === next.id)
      return exists ? prev.map((r) => (r.id === next.id ? next : r)) : [next, ...prev]
    })
  }, [])

  const create = useCallback(
    async (input: ResultInput) => {
      const created = await resultService.create(input)
      upsert(created)
      return created
    },
    [upsert],
  )

  const update = useCallback(
    async (id: string, input: Partial<ResultInput>) => {
      const updated = await resultService.update(id, input)
      upsert(updated)
      return updated
    },
    [upsert],
  )

  const remove = useCallback(async (id: string) => {
    await resultService.remove(id)
    setResults((prev) => prev.filter((r) => r.id !== id))
  }, [])

  const submit = useCallback(
    async (id: string) => {
      const updated = await resultService.submit(id)
      upsert(updated)
      return updated
    },
    [upsert],
  )

  const approve = useCallback(
    async (id: string) => {
      const updated = await resultService.approve(id)
      upsert(updated)
      return updated
    },
    [upsert],
  )

  const publish = useCallback(
    async (id: string) => {
      const updated = await resultService.publish(id)
      upsert(updated)
      return updated
    },
    [upsert],
  )

  const getResultsForStudent = useCallback((studentId: string) => {
    return resultService.listByStudent(studentId)
  }, [])

  const value = useMemo(
    () => ({
      results,
      loading,
      error,
      refresh,
      create,
      update,
      remove,
      submit,
      approve,
      publish,
      getResultsForStudent,
    }),
    [results, loading, error, refresh, create, update, remove, submit, approve, publish, getResultsForStudent],
  )

  return <ResultsContext.Provider value={value}>{children}</ResultsContext.Provider>
}

export function useResults(): ResultsContextValue {
  const context = useContext(ResultsContext)
  if (!context) {
    throw new Error('useResults must be used within a ResultsProvider')
  }
  return context
}