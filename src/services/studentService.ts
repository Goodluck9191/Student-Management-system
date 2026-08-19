import type { Student, StudentInput } from '../types/student'
import { mockStudents } from '../data/mock/students'
import { delay, generateId } from '../lib/id'

export interface StudentRepository {
  list(): Promise<Student[]>
  getById(id: string): Promise<Student>
  create(data: StudentInput): Promise<Student>
  update(id: string, data: Partial<StudentInput>): Promise<Student>
  remove(id: string): Promise<void>
  suggestNextAdmissionNumber(): Promise<string>
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
    const student: Student = { ...data, id: generateId() }
    this.students.unshift(student)
    return { ...student }
  }

  async update(id: string, data: Partial<StudentInput>): Promise<Student> {
    await delay(450)
    const index = this.students.findIndex((s) => s.id === id)
    if (index === -1) {
      throw new Error(`Student with id "${id}" was not found.`)
    }
    const updated: Student = { ...this.students[index], ...data, id }
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

  async suggestNextAdmissionNumber(): Promise<string> {
    return nextAdmissionNumber(this.students)
  }
}

export const studentService: StudentRepository = new MockStudentRepository()