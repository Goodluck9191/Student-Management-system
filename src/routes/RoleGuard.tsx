import { Navigate, Outlet } from 'react-router-dom'
import type { Role } from '../types/user'
import { useAuth } from '../context/AuthContext'

const HOME_BY_ROLE: Record<Role, string> = {
  ADMIN: '/admin',
  TEACHER: '/teacher',
  PARENT: '/parent',
}

/**
 * Frontend role protection is a user-experience guard only. Real security
 * (authentication, authorization, RBAC, ownership checks) is enforced by the
 * backend.
 */
export function RoleGuard({ roles }: { roles: Role[] }) {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (!roles.includes(user.role)) {
    return <Navigate to={HOME_BY_ROLE[user.role]} replace />
  }

  return <Outlet />
}