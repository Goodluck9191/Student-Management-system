import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { AuthUser, LoginCredentials, Role } from '../types/user'
import { authService } from '../services/authService'

const TOKEN_KEY = 'iyunga.auth.token'

interface AuthContextValue {
  user: AuthUser | null
  isAuthenticated: boolean
  isAdmin: boolean
  isTeacher: boolean
  isParent: boolean
  loading: boolean
  login: (credentials: LoginCredentials) => Promise<AuthUser>
  logout: () => void
  hasRole: (roles: Role[]) => boolean
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY)
    authService
      .validateToken(token)
      .then((validated) => {
        if (validated) {
          setUser(validated)
          localStorage.setItem(TOKEN_KEY, validated.token)
        }
      })
      .finally(() => setLoading(false))
  }, [])

  const login = useCallback(async (credentials: LoginCredentials) => {
    const authenticated = await authService.login(credentials)
    localStorage.setItem(TOKEN_KEY, authenticated.token)
    setUser(authenticated)
    return authenticated
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    setUser(null)
  }, [])

  const hasRole = useCallback(
    (roles: Role[]) => (user ? roles.includes(user.role) : false),
    [user],
  )

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isAdmin: user?.role === 'ADMIN',
      isTeacher: user?.role === 'TEACHER',
      isParent: user?.role === 'PARENT',
      loading,
      login,
      logout,
      hasRole,
    }),
    [user, loading, login, logout, hasRole],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}