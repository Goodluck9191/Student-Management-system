import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Student, StudentInput } from '../types/student'
import { studentService } from '../services/studentService'

interface StudentsContextValue {
  students: Student[]
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
  getStudent: (id: string) => Promise<Student>
  addStudent: (input: StudentInput) => Promise<Student>
  updateStudent: (id: string, input: StudentInput) => Promise<Student>
  deleteStudent: (id: string) => Promise<void>
  getNextAdmissionNumber: () => Promise<string>
}

const StudentsContext = createContext<StudentsContextValue | undefined>(undefined)

export function StudentsProvider({ children }: { children: ReactNode }) {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await studentService.list()
      setStudents(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load students.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const getStudent = useCallback(async (id: string) => {
    return studentService.getById(id)
  }, [])

  const addStudent = useCallback(async (input: StudentInput) => {
    const created = await studentService.create(input)
    setStudents((prev) => [created, ...prev])
    return created
  }, [])

  const updateStudent = useCallback(async (id: string, input: StudentInput) => {
    const updated = await studentService.update(id, input)
    setStudents((prev) => prev.map((s) => (s.id === id ? updated : s)))
    return updated
  }, [])

  const deleteStudent = useCallback(async (id: string) => {
    await studentService.remove(id)
    setStudents((prev) => prev.filter((s) => s.id !== id))
  }, [])

  const getNextAdmissionNumber = useCallback(() => {
    return studentService.suggestNextAdmissionNumber()
  }, [])

  const value = useMemo(
    () => ({
      students,
      loading,
      error,
      refresh,
      getStudent,
      addStudent,
      updateStudent,
      deleteStudent,
      getNextAdmissionNumber,
    }),
    [
      students,
      loading,
      error,
      refresh,
      getStudent,
      addStudent,
      updateStudent,
      deleteStudent,
      getNextAdmissionNumber,
    ],
  )

  return <StudentsContext.Provider value={value}>{children}</StudentsContext.Provider>
}

export function useStudents(): StudentsContextValue {
  const context = useContext(StudentsContext)
  if (!context) {
    throw new Error('useStudents must be used within a StudentsProvider')
  }
  return context
}
