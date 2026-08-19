import type { Student, StudentInput } from '../types/student'
import { mockStudents } from '../data/students'

/**
 * Contract implemented by the data layer. The UI only depends on this
 * interface, so the mock repository below can be replaced with an HTTP
 * repository (calling `GET /api/students` etc.) without touching any
 * component or page code.
 */
export interface StudentRepository {
  list(): Promise<Student[]>
  getById(id: string): Promise<Student>
  create(data: StudentInput): Promise<Student>
  update(id: string, data: StudentInput): Promise<Student>
  remove(id: string): Promise<void>
  suggestNextAdmissionNumber(): Promise<string>
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

function normalizePhone(value: string): string {
  return value.trim().replace(/^\+/, '')
}

function nextAdmissionNumber(students: Student[]): string {
  const year = new Date().getFullYear()
  const maxSequence = students.reduce((max, student) => {
    const match = student.admissionNumber.match(/(\d{3})$/)
    const seq = match ? Number(match[1]) : 0
    return Math.max(max, seq)
  }, 0)
  return `IY/${year}/${String(maxSequence + 1).padStart(3, '0')}`
}

function generateId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `id-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

/**
 * In-memory repository backed by mock data. Simulates network latency so
 * loading states behave like they will against a real API.
 */
class MockStudentRepository implements StudentRepository {
  private students: Student[] = [...mockStudents]

  async list(): Promise<Student[]> {
    await delay(350)
    return this.students.map((s) => ({ ...s }))
  }

  async getById(id: string): Promise<Student> {
    await delay(250)
    const student = this.students.find((s) => s.id === id)
    if (!student) {
      throw new Error(`Student with id "${id}" was not found.`)
    }
    return { ...student }
  }

  async create(data: StudentInput): Promise<Student> {
    await delay(450)
    const student: Student = {
      ...data,
      id: generateId(),
      phoneNumber: normalizePhone(data.phoneNumber),
      parentPhone: normalizePhone(data.parentPhone),
    }
    this.students.unshift(student)
    return { ...student }
  }

  async update(id: string, data: StudentInput): Promise<Student> {
    await delay(450)
    const index = this.students.findIndex((s) => s.id === id)
    if (index === -1) {
      throw new Error(`Student with id "${id}" was not found.`)
    }
    const updated: Student = {
      ...data,
      id,
      phoneNumber: normalizePhone(data.phoneNumber),
      parentPhone: normalizePhone(data.parentPhone),
    }
    this.students[index] = updated
    return { ...updated }
  }

  async remove(id: string): Promise<void> {
    await delay(400)
    const index = this.students.findIndex((s) => s.id === id)
    if (index === -1) {
      throw new Error(`Student with id "${id}" was not found.`)
    }
    this.students.splice(index, 1)
  }

  /** Helper used by the Add Student form to auto-generate a number. */
  async suggestNextAdmissionNumber(): Promise<string> {
    return nextAdmissionNumber(this.students)
  }
}

/**
 * HTTP repository — ready for Week 3. Switch `studentService` below to this
 * implementation once the backend is deployed. The UI requires no changes.
 */
// class HttpStudentRepository implements StudentRepository {
//   async list(): Promise<Student[]> {
//     const { data } = await apiClient.get<Student[]>('/students')
//     return data
//   }
//
//   async getById(id: string): Promise<Student> {
//     const { data } = await apiClient.get<Student>(`/students/${id}`)
//     return data
//   }
//
//   async create(input: StudentInput): Promise<Student> {
//     const { data } = await apiClient.post<Student>('/students', input)
//     return data
//   }
//
//   async update(id: string, input: StudentInput): Promise<Student> {
//     const { data } = await apiClient.put<Student>(`/students/${id}`, input)
//     return data
//   }
//
//   async remove(id: string): Promise<void> {
//     await apiClient.delete(`/students/${id}`)
//   }
// }

export const studentService: StudentRepository = new MockStudentRepository()
