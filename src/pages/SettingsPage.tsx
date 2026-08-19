import { Building2, Info } from 'lucide-react'
import { PageHeader } from '../components/ui/PageHeader'
import { Card } from '../components/ui/Card'
import { SCHOOL_NAME, SCHOOL_MOTTO } from '../lib/constants'

export function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Settings" subtitle="School and system settings" />
      <Card>
        <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
            <Building2 className="h-5 w-5" aria-hidden="true" />
          </span>
          <h2 className="text-base font-semibold text-slate-900">School Profile</h2>
        </div>
        <dl className="grid grid-cols-1 gap-x-6 px-5 py-2 sm:grid-cols-2">
          <div className="border-b border-slate-50 py-3">
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">
              School Name
            </dt>
            <dd className="text-sm text-slate-800">{SCHOOL_NAME}</dd>
          </div>
          <div className="border-b border-slate-50 py-3">
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Motto
            </dt>
            <dd className="text-sm text-slate-800">{SCHOOL_MOTTO}</dd>
          </div>
        </dl>
      </Card>
      <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-5">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
          <Info className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <h3 className="text-sm font-semibold text-slate-900">About this system</h3>
          <p className="mt-1 max-w-xl text-sm leading-relaxed text-slate-500">
            Iyunga Secondary Student Management System — frontend phase. Data is currently stored
            locally in the browser to simulate the REST API that will power the system in the
            next phase.
          </p>
        </div>
      </div>
    </div>
  )
}