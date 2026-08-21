import type { Result, ResultInput, ResultStatus } from '../types/result'
import type { Repository } from './mockRepository'
import { createMockRepository } from './mockRepository'
import { mockResults } from '../data/mock/results'

export interface ResultRepository extends Repository<Result, ResultInput> {
  submit(id: string): Promise<Result>
  approve(id: string): Promise<Result>
  publish(id: string): Promise<Result>
  listByStudent(studentId: string): Promise<Result[]>
}

const WORKFLOW: Record<ResultStatus, ResultStatus | null> = {
  draft: 'submitted',
  submitted: 'approved',
  approved: 'published',
  published: null,
}

class MockResultRepository implements ResultRepository {
  private repository = createMockRepository<Result, ResultInput>(mockResults)

  list(): Promise<Result[]> {
    return this.repository.list()
  }

  getById(id: string): Promise<Result> {
    return this.repository.getById(id)
  }

  create(input: ResultInput): Promise<Result> {
    return this.repository.create(input)
  }

  update(id: string, input: Partial<ResultInput>): Promise<Result> {
    return this.repository.update(id, input)
  }

  remove(id: string): Promise<void> {
    return this.repository.remove(id)
  }

  async listByStudent(studentId: string): Promise<Result[]> {
    const results = await this.repository.list()
    return results
      .filter((r) => r.studentId === studentId)
      .sort((a, b) => b.academicYear.localeCompare(a.academicYear) || b.term - a.term)
  }

  private async transition(id: string): Promise<Result> {
    const result = await this.repository.getById(id)
    const nextStatus = WORKFLOW[result.status]
    if (!nextStatus) {
      throw new Error(`Results in status "${result.status}" cannot be moved forward.`)
    }
    return this.repository.update(id, { status: nextStatus })
  }

  submit(id: string): Promise<Result> {
    return this.transition(id)
  }

  approve(id: string): Promise<Result> {
    return this.transition(id)
  }

  publish(id: string): Promise<Result> {
    return this.repository
      .getById(id)
      .then((result) => {
        if (WORKFLOW[result.status] !== 'published') {
          throw new Error(`Results in status "${result.status}" cannot be moved forward.`)
        }
        return this.repository.update(id, { status: 'published', publishedAt: new Date().toISOString() })
      })
  }
}

export const resultService: ResultRepository = new MockResultRepository()