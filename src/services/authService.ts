import type { AuthUser, LoginCredentials } from '../types/user'
import { mockUsers } from '../data/mock/users'
import { delay, generateId } from '../lib/id'

/**
 * Simulated authentication for the frontend phase. The real backend will
 * implement `POST /api/auth/login` and issue a JWT. This service accepts any
 * non-empty password for the demo accounts.
 */
export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthUser> {
    await delay(600)
    const user = mockUsers.find(
      (u) => u.email.toLowerCase() === credentials.email.trim().toLowerCase(),
    )
    if (!user || !credentials.password.trim()) {
      throw new Error('Invalid email or password.')
    }
    const token = `mock-jwt.${generateId()}.${user.id}`
    return { ...user, token }
  },

  async validateToken(token: string | null): Promise<AuthUser | null> {
    await delay(200)
    if (!token) return null
    const userId = token.split('.').pop()
    const user = mockUsers.find((u) => u.id === userId)
    return user ? { ...user, token } : null
  },
}

export interface AuthRepository {
  login(credentials: LoginCredentials): Promise<AuthUser>
  validateToken(token: string | null): Promise<AuthUser | null>
}

export const authRepository: AuthRepository = authService