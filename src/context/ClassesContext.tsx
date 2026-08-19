import { createEntityContext } from './createEntityContext'
import type { SchoolClass, SchoolClassInput } from '../types/class'
import { classService } from '../services/classService'

const { Provider: ClassesProvider, useEntity: useClasses } = createEntityContext<
  SchoolClass,
  SchoolClassInput
>(classService, 'Classes')

export { ClassesProvider, useClasses }