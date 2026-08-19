import type { Gender, Student } from '../types/student'

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

export function initials(student: Pick<Student, 'firstName' | 'lastName'>): string {
  return `${student.firstName.charAt(0)}${student.lastName.charAt(0)}`
    .toUpperCase()
}

export function capitalize(value: string): string {
  if (!value) return value
  return value.charAt(0).toUpperCase() + value.slice(1)
}

export function genderColor(gender: Gender): string {
  return gender === 'male'
    ? 'bg-blue-50 text-blue-700 ring-blue-600/20'
    : 'bg-pink-50 text-pink-700 ring-pink-600/20'
}
