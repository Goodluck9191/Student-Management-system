import { Link } from 'react-router-dom'
import { Eye, Pencil, Trash2 } from 'lucide-react'
import type { Student } from '../../types/student'
import { StatusBadge } from '../ui/StatusBadge'
import { StudentAvatar } from '../ui/StudentAvatar'
import { fullName } from '../../lib/format'
import { GENDER_LABELS } from '../../lib/constants'

interface StudentTableProps {
  students: Student[]
  onDelete: (student: Student) => void
}

export function StudentTable({ students, onDelete }: StudentTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <th scope="col" className="px-5 py-3 font-semibold">
              Student
            </th>
            <th scope="col" className="px-5 py-3 font-semibold">
              Admission No.
            </th>
            <th scope="col" className="px-5 py-3 font-semibold">
              Gender
            </th>
            <th scope="col" className="px-5 py-3 font-semibold">
              Class
            </th>
            <th scope="col" className="px-5 py-3 font-semibold">
              Status
            </th>
            <th scope="col" className="px-5 py-3 text-right font-semibold">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {students.map((student) => (
            <tr key={student.id} className="transition-colors hover:bg-slate-50">
              <td className="px-5 py-3">
                <Link
                  to={`/students/${student.id}`}
                  className="flex items-center gap-3"
                >
                  <StudentAvatar student={student} size="sm" />
                  <span className="font-medium text-slate-900">{fullName(student)}</span>
                </Link>
              </td>
              <td className="px-5 py-3 font-mono text-xs text-slate-500">
                {student.admissionNumber}
              </td>
              <td className="px-5 py-3 text-slate-600">{GENDER_LABELS[student.gender]}</td>
              <td className="px-5 py-3 text-slate-600">{student.className}</td>
              <td className="px-5 py-3">
                <StatusBadge status={student.status} />
              </td>
              <td className="px-5 py-3">
                <div className="flex items-center justify-end gap-1">
                  <Link
                    to={`/students/${student.id}`}
                    aria-label={`View ${fullName(student)}`}
                    className="rounded-lg p-2 text-slate-400 hover:bg-brand-50 hover:text-brand-600"
                  >
                    <Eye className="h-4 w-4" />
                  </Link>
                  <Link
                    to={`/students/${student.id}/edit`}
                    aria-label={`Edit ${fullName(student)}`}
                    className="rounded-lg p-2 text-slate-400 hover:bg-brand-50 hover:text-brand-600"
                  >
                    <Pencil className="h-4 w-4" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => onDelete(student)}
                    aria-label={`Delete ${fullName(student)}`}
                    className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}