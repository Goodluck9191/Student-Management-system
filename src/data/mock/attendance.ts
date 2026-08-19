export interface TermAttendance {
  term: 1 | 2 | 3
  academicYear: string
  present: number
  absent: number
  late: number
  total: number
}

const DEFAULT_TERMS = [1, 2, 3] as const
const YEARS = ['2025', '2026'] as const

function seededNumber(seed: string): number {
  let hash = 0
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) % 997
  }
  return hash
}

function rangeFor(seed: string, min: number, max: number): number {
  return min + (seededNumber(seed) % (max - min + 1))
}

export function getAttendanceForStudent(studentId: string): TermAttendance[] {
  return YEARS.flatMap((academicYear) =>
    DEFAULT_TERMS.map((term) => {
      const seed = `${studentId}-${academicYear}-${term}`
      const total = rangeFor(`${seed}-total`, 45, 52)
      const present = rangeFor(`${seed}-present`, 36, total - 3)
      const absent = rangeFor(`${seed}-absent`, 0, 4)
      const late = rangeFor(`${seed}-late`, 1, 6)
      return {
        term,
        academicYear,
        present,
        absent,
        late,
        total: present + absent + late,
      }
    }),
  )
}

export function getAttendanceSummary(studentId: string): {
  present: number
  absent: number
  late: number
  total: number
  attendanceRate: number
} {
  const records = getAttendanceForStudent(studentId)
  const present = records.reduce((sum, r) => sum + r.present, 0)
  const absent = records.reduce((sum, r) => sum + r.absent, 0)
  const late = records.reduce((sum, r) => sum + r.late, 0)
  const total = present + absent + late
  const attendanceRate = total === 0 ? 0 : Math.round((present / total) * 100)
  return { present, absent, late, total, attendanceRate }
}