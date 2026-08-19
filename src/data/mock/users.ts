import type { User } from '../../types/user'

/**
 * Simulated users for the frontend phase. The real backend will issue JWT
 * tokens via `POST /api/auth/login`. Passwords are not stored here — the
 * mock auth service accepts any non-empty password for these demo accounts.
 */
export const mockUsers: User[] = [
  {
    id: 'u-admin',
    email: 'admin@iyunga.ac.tz',
    name: 'Administrator',
    role: 'ADMIN',
  },
  {
    id: 'u-teacher',
    email: 'teacher@iyunga.ac.tz',
    name: 'James Mwakapamba',
    role: 'TEACHER',
    phone: '+255 754 100 001',
  },
  {
    id: 'u-parent',
    email: 'parent@example.com',
    name: 'Peter Mwanga',
    role: 'PARENT',
    phone: '+255 754 555 001',
  },
]

export const DEMO_ACCOUNTS = [
  { email: 'admin@iyunga.ac.tz', role: 'ADMIN', label: 'Admin' },
  { email: 'teacher@iyunga.ac.tz', role: 'TEACHER', label: 'Teacher' },
  { email: 'parent@example.com', role: 'PARENT', label: 'Parent' },
] as const