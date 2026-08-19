import { useAuth } from '../context/AuthContext'
import { useParents } from '../context/ParentsContext'

export function useParentIdentity() {
  const { user } = useAuth()
  const { items: parents } = useParents()
  const parent = parents.find((p) => p.userId === user?.id) ?? null
  return { parent, user }
}