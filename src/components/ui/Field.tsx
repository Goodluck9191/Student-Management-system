import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from 'react'

interface FieldProps {
  label: string
  required?: boolean
  error?: string
  hint?: string
  children: ReactNode
}

export function Field({ label, required, error, hint, children }: FieldProps) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
        {required && <span className="ml-0.5 text-red-500" aria-hidden="true">*</span>}
      </label>
      {children}
      {error ? (
        <p className="mt-1 text-xs text-red-600" role="alert">{error}</p>
      ) : hint ? (
        <p className="mt-1 text-xs text-slate-400">{hint}</p>
      ) : null}
    </div>
  )
}

const inputClasses = (hasError: boolean) =>
  `w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-900 shadow-sm
   placeholder:text-slate-400 transition-colors focus:outline-none focus:ring-2
   ${hasError
     ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
     : 'border-slate-300 focus:border-brand-500 focus:ring-brand-100'}`

export function Input({
  error,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { error?: boolean }) {
  return <input className={inputClasses(Boolean(error))} {...props} />
}

export function Select({
  error,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & { error?: boolean }) {
  return (
    <select className={inputClasses(Boolean(error))} {...props}>
      {children}
    </select>
  )
}

export function Textarea({
  error,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { error?: boolean }) {
  return <textarea className={inputClasses(Boolean(error))} rows={3} {...props} />
}
