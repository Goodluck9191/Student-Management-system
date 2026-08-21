import type { Result, Term } from '../types/result'
import type { Student } from '../types/student'
import type { Subject } from '../types/subject'
import type { SchoolClass } from '../types/class'
import { round } from './format'

export interface PerformanceDatum {
  /** Category shown on the X axis (subject or class name). */
  subject: string
  marks: number
}

export interface SchoolSummary {
  count: number
  average: number
  passRate: number
}

export interface PublishedResultGroup {
  /** subjectId + classId + term + academicYear */
  key: string
  subjectId: string
  subjectName: string
  className: string
  term: Term
  academicYear: string
  studentCount: number
  averageMarks: number
  publishedAt: string | null
}

const PASS_MARK = 50

export function filterPublishedResults(results: Result[]): Result[] {
  return results.filter((result) => result.status === 'published')
}

export function computeSchoolSummary(publishedResults: Result[]): SchoolSummary {
  const count = publishedResults.length
  const average = count
    ? round(publishedResults.reduce((sum, result) => sum + result.marks, 0) / count)
    : 0
  const passRate = count
    ? round((publishedResults.filter((result) => result.marks >= PASS_MARK).length / count) * 100)
    : 0
  return { count, average, passRate }
}

function averageBy<T>(
  items: T[],
  getKey: (item: T) => string,
  getMarks: (item: T) => number,
): Map<string, { total: number; count: number }> {
  const totals = new Map<string, { total: number; count: number }>()
  for (const item of items) {
    const key = getKey(item)
    const entry = totals.get(key) ?? { total: 0, count: 0 }
    entry.total += getMarks(item)
    entry.count += 1
    totals.set(key, entry)
  }
  return totals
}

/** Average marks per subject across published results, highest first. */
export function computeSubjectPerformance(
  publishedResults: Result[],
  subjects: Subject[],
): PerformanceDatum[] {
  const subjectNames = new Map(subjects.map((subject) => [subject.id, subject.name]))
  return [...averageBy(publishedResults, (r) => r.subjectId, (r) => r.marks).entries()]
    .map(([subjectId, { total, count }]) => ({
      subject: subjectNames.get(subjectId) ?? subjectId,
      marks: round(total / count),
    }))
    .sort((a, b) => b.marks - a.marks)
}

/** Average marks per class across published results, highest first. */
export function computeClassPerformance(
  publishedResults: Result[],
  students: Student[],
  classes: SchoolClass[],
): PerformanceDatum[] {
  const studentClasses = new Map(students.map((student) => [student.id, student.classId]))
  const classNames = new Map(classes.map((schoolClass) => [schoolClass.id, schoolClass.name]))
  const withClass = publishedResults.filter((result) => studentClasses.has(result.studentId))
  return [...averageBy(withClass, (r) => studentClasses.get(r.studentId)!, (r) => r.marks).entries()]
    .map(([classId, { total, count }]) => ({
      subject: classNames.get(classId) ?? classId,
      marks: round(total / count),
    }))
    .sort((a, b) => b.marks - a.marks)
}

/**
 * Groups published results by Subject + Class + Term + Academic Year so the
 * dashboard can show which subjects recently had results released, instead of
 * listing individual students. Sorted by most recent publication first.
 */
export function groupPublishedResults(
  publishedResults: Result[],
  students: Student[],
  subjects: Subject[],
  classes: SchoolClass[],
): PublishedResultGroup[] {
  const studentById = new Map(students.map((student) => [student.id, student]))
  const subjectNames = new Map(subjects.map((subject) => [subject.id, subject.name]))
  const classNames = new Map(classes.map((schoolClass) => [schoolClass.id, schoolClass.name]))

  interface Accumulator {
    subjectId: string
    classId: string
    term: Term
    academicYear: string
    studentIds: Set<string>
    total: number
    count: number
    publishedAt: string | null
  }

  const groups = new Map<string, Accumulator>()

  for (const result of publishedResults) {
    const student = studentById.get(result.studentId)
    if (!student) continue
    const key = `${result.subjectId}|${student.classId}|${result.term}|${result.academicYear}`
    const group = groups.get(key) ?? {
      subjectId: result.subjectId,
      classId: student.classId,
      term: result.term,
      academicYear: result.academicYear,
      studentIds: new Set<string>(),
      total: 0,
      count: 0,
      publishedAt: null,
    }
    group.studentIds.add(result.studentId)
    group.total += result.marks
    group.count += 1
    if (result.publishedAt && (!group.publishedAt || result.publishedAt > group.publishedAt)) {
      group.publishedAt = result.publishedAt
    }
    groups.set(key, group)
  }

  return [...groups.values()]
    .map((group) => ({
      key: `${group.subjectId}|${group.classId}|${group.term}|${group.academicYear}`,
      subjectId: group.subjectId,
      subjectName: subjectNames.get(group.subjectId) ?? group.subjectId,
      className: classNames.get(group.classId) ?? group.classId,
      term: group.term,
      academicYear: group.academicYear,
      studentCount: group.studentIds.size,
      averageMarks: round(group.total / group.count),
      publishedAt: group.publishedAt,
    }))
    .sort((a, b) => (b.publishedAt ?? '').localeCompare(a.publishedAt ?? ''))
}
