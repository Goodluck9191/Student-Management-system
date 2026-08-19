import { delay, generateId } from '../lib/id'

/**
 * Generic in-memory repository backed by mock data. Simulates network latency
 * so loading states behave like they will against a real REST API. The UI
 * depends only on the returned interface, so each service can be swapped for
 * an HTTP implementation without changing any component code.
 */
export interface Repository<T, I> {
  list(): Promise<T[]>
  getById(id: string): Promise<T>
  create(input: I): Promise<T>
  update(id: string, input: Partial<I>): Promise<T>
  remove(id: string): Promise<void>
}

export function createMockRepository<T extends { id: string }, I>(
  seed: T[],
  latencyMs = 250,
): Repository<T, I> {
  let items: T[] = [...seed]

  return {
    async list(): Promise<T[]> {
      await delay(latencyMs)
      return items.map((item) => ({ ...item }))
    },

    async getById(id: string): Promise<T> {
      await delay(latencyMs)
      const item = items.find((x) => x.id === id)
      if (!item) {
        throw new Error(`Record with id "${id}" was not found.`)
      }
      return { ...item }
    },

    async create(input: I): Promise<T> {
      await delay(latencyMs)
      const item = { ...(input as object), id: generateId() } as unknown as T
      items.unshift(item)
      return { ...item }
    },

    async update(id: string, input: Partial<I>): Promise<T> {
      await delay(latencyMs)
      const index = items.findIndex((x) => x.id === id)
      if (index === -1) {
        throw new Error(`Record with id "${id}" was not found.`)
      }
      const updated = { ...items[index], ...(input as object), id } as unknown as T
      items[index] = updated
      return { ...updated }
    },

    async remove(id: string): Promise<void> {
      await delay(latencyMs)
      const index = items.findIndex((x) => x.id === id)
      if (index === -1) {
        throw new Error(`Record with id "${id}" was not found.`)
      }
      items.splice(index, 1)
    },
  }
}