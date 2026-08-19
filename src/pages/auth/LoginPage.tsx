import { useState, type FormEvent } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { GraduationCap, KeyRound, Lock, Mail } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { Field, Input } from '../../components/ui/Field'
import { Button } from '../../components/ui/Button'
import { SCHOOL_NAME, SCHOOL_MOTTO } from '../../lib/constants'
import { DEMO_ACCOUNTS } from '../../data/mock/users'
import type { Role } from '../../types/user'

const HOME_BY_ROLE: Record<Role, string> = {
  ADMIN: '/admin',
  TEACHER: '/teacher',
  PARENT: '/parent',
}

export function LoginPage() {
  const { login, isAuthenticated, user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  if (isAuthenticated && user) {
    return <Navigate to={from ?? HOME_BY_ROLE[user.role]} replace />
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)
    if (!email.trim() || !password.trim()) {
      setError('Please enter your email and password.')
      return
    }
    setLoading(true)
    try {
      const authenticated = await login({ email, password })
      navigate(from ?? HOME_BY_ROLE[authenticated.role], { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-700 via-brand-800 to-slate-900 px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-white ring-1 ring-white/20 backdrop-blur">
            <GraduationCap className="h-7 w-7" aria-hidden="true" />
          </span>
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-white">{SCHOOL_NAME}</h1>
          <p className="mt-1 text-sm text-brand-200">{SCHOOL_MOTTO}</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white p-6 shadow-2xl sm:p-8">
          <h2 className="text-lg font-semibold text-slate-900">Sign in to your account</h2>
          <p className="mt-1 text-sm text-slate-500">
            Use your registered email and password.
          </p>

          <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
            <Field label="Email or Phone" required error={error ? '' : undefined}>
              <div className="relative">
                <Mail
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                  aria-hidden="true"
                />
                <Input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="username"
                  className="pl-9"
                />
              </div>
            </Field>
            <Field label="Password" required>
              <div className="relative">
                <Lock
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                  aria-hidden="true"
                />
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="pl-9"
                />
              </div>
            </Field>

            {error && (
              <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                {error}
              </p>
            )}

            <Button type="submit" loading={loading} className="w-full" size="lg">
              <KeyRound className="h-4 w-4" aria-hidden="true" />
              {loading ? 'Signing in…' : 'Login'}
            </Button>

            <div className="text-center">
              <button
                type="button"
                className="text-sm font-medium text-brand-600 hover:text-brand-700"
              >
                Forgot password?
              </button>
            </div>
          </form>
        </div>

        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
          <p className="text-center text-xs font-medium uppercase tracking-wide text-brand-200">
            Demo accounts
          </p>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {DEMO_ACCOUNTS.map((account) => (
              <button
                key={account.email}
                type="button"
                onClick={() => {
                  setEmail(account.email)
                  setPassword('demo')
                  setError(null)
                }}
                className="rounded-lg border border-white/10 bg-white/10 px-2 py-2 text-center text-xs text-white transition-colors hover:bg-white/20"
              >
                <span className="block font-semibold">{account.label}</span>
                <span className="mt-0.5 block truncate text-brand-100">{account.email}</span>
              </button>
            ))}
          </div>
          <p className="mt-3 text-center text-xs text-brand-200">
            Password: <span className="font-mono font-semibold text-white">demo</span>
          </p>
        </div>
      </div>
    </div>
  )
}