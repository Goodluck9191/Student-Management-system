import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, SlidersHorizontal, UserPlus, X } from 'lucide-react'
import { useStudents } from '../context/StudentsContext'
import { StudentTable } from '../components/students/StudentTable'
import { PageHeader } from '../components/ui/PageHeader'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { LoadingState, ErrorState } from '../components/ui/States'
import { EmptyState } from '../components/ui/EmptyState'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'
import { Pagination } from '../components/ui/Pagination'
import { useToast } from '../components/ui/Toast'
import type { Student } from '../types/student'
import { CLASSES, STATUS_OPTIONS, PAGE_SIZE } from '../lib/constants'
import { fullName } from '../lib/format'

export function StudentsPage() {
  const { students, loading, error, refresh, deleteStudent } = useStudents()
  const { showToast } = useToast()

  const [search, setSearch] = useState('')
  const [className, setClassName] = useState('')
  const [status, setStatus] = useState('')
  const [gender, setGender] = useState('')
  const [page, setPage] = useState(1)
  const [deleting, setDeleting] = useState<Student | null>(null)

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    return students.filter((student) => {
      const matchesSearch =
        term === '' ||
        fullName(student).toLowerCase().includes(term) ||
        student.admissionNumber.toLowerCase().includes(term)
      const matchesClass = className === '' || student.className === className
      const matchesStatus = status === '' || student.status === status
      const matchesGender = gender === '' || student.gender === gender
      return matchesSearch && matchesClass && matchesStatus && matchesGender
    })
  }, [students, search, className, status, gender])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, pageCount)
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const hasFilters = search !== '' || className !== '' || status !== '' || gender !== ''

  const clearFilters = () => {
    setSearch('')
    setClassName('')
    setStatus('')
    setGender('')
    setPage(1)
  }

  const handleDelete = async () => {
    if (!deleting) return
    try {
      await deleteStudent(deleting.id)
      showToast(`${fullName(deleting)} was deleted successfully.`)
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to delete student.', 'error')
    } finally {
      setDeleting(null)
    }
  }

  if (loading) {
    return <LoadingState label="Loading students…" />
  }

  if (error) {
    return <ErrorState message={error} onRetry={() => void refresh()} />
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Students"
        subtitle="Manage all registered students"
        action={
          <Link to="/students/new">
            <Button>
              <UserPlus className="h-4 w-4" aria-hidden="true" />
              Add Student
            </Button>
          </Link>
        }
      />

      <Card>
        <div className="border-b border-slate-100 p-4 sm:p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                aria-hidden="true"
              />
              <input
                type="search"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setPage(1)
                }}
                placeholder="Search by name or admission number…"
                aria-label="Search students"
                className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-8 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  aria-label="Clear search"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-0.5 text-slate-400 hover:text-slate-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <SlidersHorizontal className="hidden h-4 w-4 text-slate-400 lg:block" aria-hidden="true" />
              <select
                value={className}
                onChange={(e) => {
                  setClassName(e.target.value)
                  setPage(1)
                }}
                aria-label="Filter by class"
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
              >
                <option value="">All classes</option>
                {CLASSES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <select
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value)
                  setPage(1)
                }}
                aria-label="Filter by status"
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
              >
                <option value="">All statuses</option>
                {STATUS_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
              <select
                value={gender}
                onChange={(e) => {
                  setGender(e.target.value)
                  setPage(1)
                }}
                aria-label="Filter by gender"
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
              >
                <option value="">All genders</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            title={hasFilters ? 'No students match your search' : 'No students yet'}
            message={
              hasFilters
                ? 'Try adjusting your search or clearing the filters.'
                : 'Register your first student to get started.'
            }
            action={
              hasFilters ? (
                <Button variant="outline" onClick={clearFilters}>
                  Clear filters
                </Button>
              ) : (
                <Link to="/students/new">
                  <Button>
                    <UserPlus className="h-4 w-4" aria-hidden="true" />
                    Add Student
                  </Button>
                </Link>
              )
            }
          />
        ) : (
          <>
            <StudentTable students={pageItems} onDelete={setDeleting} />
            <div className="border-t border-slate-100">
              <Pagination
                page={currentPage}
                pageCount={pageCount}
                total={filtered.length}
                pageSize={PAGE_SIZE}
                onPageChange={setPage}
              />
            </div>
          </>
        )}
      </Card>

      <ConfirmDialog
        open={deleting !== null}
        title="Delete student"
        message={`Are you sure you want to delete ${deleting ? fullName(deleting) : ''}? This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  )
}