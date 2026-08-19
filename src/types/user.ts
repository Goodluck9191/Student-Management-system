export type Role = 'ADMIN' | 'TEACHER' | 'PARENT'

export const ROLES: Role[] = ['ADMIN', 'TEACHER', 'PARENT']

export interface User {
  id: string
  email: string
  name: string
  role: Role
  phone?: string
}

export interface AuthUser extends User {
  token: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthSession {
  user: AuthUser | null
  isAuthenticated: boolean
}