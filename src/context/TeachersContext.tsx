import { createEntityContext } from './createEntityContext'
import type { Teacher, TeacherInput } from '../types/teacher'
import { teacherService } from '../services/teacherService'

const { Provider: TeachersProvider, useEntity: useTeachers } = createEntityContext<
  Teacher,
  TeacherInput
>(teacherService, 'Teachers')

export { TeachersProvider, useTeachers }