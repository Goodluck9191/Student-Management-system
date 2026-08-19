import { useAuth } from '../context/AuthContext'
import { useTeachers } from '../context/TeachersContext'

export function useTeacherIdentity() {
  const { user } = useAuth()
  const { items: teachers } = useTeachers()
  const teacher = teachers.find((t) => t.userId === user?.id) ?? null
  return { teacher, user }
}