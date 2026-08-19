import { createEntityContext } from './createEntityContext'
import type { Subject, SubjectInput } from '../types/subject'
import { subjectService } from '../services/subjectService'

const { Provider: SubjectsProvider, useEntity: useSubjects } = createEntityContext<
  Subject,
  SubjectInput
>(subjectService, 'Subjects')

export { SubjectsProvider, useSubjects }