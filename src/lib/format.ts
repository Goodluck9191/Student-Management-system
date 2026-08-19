import type { Student } from '../types/student'
import type { Teacher } from '../types/teacher'
import type { Parent } from '../types/parent'

export function formatDate(isoDate: string): string {
  const date = new Date(isoDate)
  if (Number.isNaN(date.getTime())) return isoDate
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

export function fullName(student: Pick<Student, 'firstName' | 'middleName' | 'lastName'>): string {
  return [student.firstName, student.middleName, student.lastName]
    .filter(Boolean)
    .join(' ')
    .trim()
}

export function teacherName(teacher: Pick<Teacher, 'firstName' | 'middleName' | 'lastName'>): string {
  return [teacher.firstName, teacher.middleName, teacher.lastName]
    .filter(Boolean)
    .join(' ')
    .trim()
}

export function parentName(parent: Pick<Parent, 'firstName' | 'lastName'>): string {
  return [parent.firstName, parent.lastName].filter(Boolean).join(' ').trim()
}

export function initials(value: { firstName: string; lastName: string }): string {
  return `${value.firstName.charAt(0)}${value.lastName.charAt(0)}`.toUpperCase()
}

export function capitalize(value: string): string {
  if (!value) return value
  return value.charAt(0).toUpperCase() + value.slice(1)
}

export function genderColor(gender: Student['gender']): string {
  return gender === 'male'
    ? 'bg-blue-50 text-blue-700 ring-blue-600/20'
    : 'bg-pink-50 text-pink-700 ring-pink-600/20'
}

export function formatPhone(value: string): string {
  return value.replace(/^\+/, '')
}

/** Grade band used by the school (Tanzanian scale). */
export function gradeForMarks(marks: number): string {
  if (marks >= 75) return 'A'
  if (marks >= 65) return 'B'
  if (marks >= 50) return 'C'
  if (marks >= 40) return 'D'
  return 'F'
}

export function round(value: number, digits = 1): number {
  const factor = 10 ** digits
  return Math.round(value * factor) / factor
}