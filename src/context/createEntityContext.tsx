import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Repository } from '../services/mockRepository'

export interface EntityContextValue<T, I> {
  items: T[]
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
  getById: (id: string) => Promise<T>
  create: (input: I) => Promise<T>
  update: (id: string, input: Partial<I>) => Promise<T>
  remove: (id: string) => Promise<void>
}

/**
 * Factory that produces a standard { Provider, useEntity } pair for any
 * entity backed by a Repository. Keeps context boilerplate to a minimum.
 */
export function createEntityContext<T extends { id: string }, I>(
  repository: Repository<T, I>,
  entityName: string,
) {
  const Context = createContext<EntityContextValue<T, I> | undefined>(undefined)
  const hookName = `use${entityName}`

  function Provider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<T[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const refresh = useCallback(async () => {
      setLoading(true)
      setError(null)
      try {
        setItems(await repository.list())
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data.')
      } finally {
        setLoading(false)
      }
    }, [])

    useEffect(() => {
      void refresh()
    }, [refresh])

    const getById = useCallback((id: string) => repository.getById(id), [])

    const create = useCallback(async (input: I) => {
      const created = await repository.create(input)
      setItems((prev) => [created, ...prev])
      return created
    }, [])

    const update = useCallback(async (id: string, input: Partial<I>) => {
      const updated = await repository.update(id, input)
      setItems((prev) => prev.map((item) => (item.id === id ? updated : item)))
      return updated
    }, [])

    const remove = useCallback(async (id: string) => {
      await repository.remove(id)
      setItems((prev) => prev.filter((item) => item.id !== id))
    }, [])

    const value = useMemo<EntityContextValue<T, I>>(
      () => ({ items, loading, error, refresh, getById, create, update, remove }),
      [items, loading, error, refresh, getById, create, update, remove],
    )

    return <Context.Provider value={value}>{children}</Context.Provider>
  }

  function useEntity(): EntityContextValue<T, I> {
    const context = useContext(Context)
    if (!context) {
      throw new Error(`${hookName} must be used within a ${entityName}Provider`)
    }
    return context
  }

  return { Provider, useEntity }
}