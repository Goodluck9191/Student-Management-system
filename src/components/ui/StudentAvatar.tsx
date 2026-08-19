import type { Student } from '../../types/student'
import { initials } from '../../lib/format'

export function StudentAvatar({
  student,
  size = 'md',
}: {
  student: Pick<Student, 'firstName' | 'lastName' | 'gender'>
  size?: 'sm' | 'md' | 'lg'
}) {
  const sizes = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-9 w-9 text-sm',
    lg: 'h-14 w-14 text-lg',
  }
  const colors =
    student.gender === 'male'
      ? 'bg-blue-100 text-blue-700'
      : 'bg-pink-100 text-pink-700'

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-semibold ${sizes[size]} ${colors}`}
      aria-hidden="true"
    >
      {initials(student)}
    </span>
  )
}
