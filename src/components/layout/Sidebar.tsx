import { NavLink } from 'react-router-dom'
import type { LucideIcon } from 'lucide-react'
import { LogOut, X } from 'lucide-react'
import { SchoolLogo } from './SchoolLogo'
import { NameAvatar } from '../ui/NameAvatar'
import type { AuthUser } from '../../types/user'
import { capitalize } from '../../lib/format'

export interface NavItem {
  to: string
  label: string
  icon: LucideIcon
  end?: boolean
}

interface SidebarProps {
  navItems: NavItem[]
  footerItems?: NavItem[]
  open: boolean
  onClose: () => void
  user: AuthUser
  onLogout: () => void
}

function NavLinkItem({ item, onClose }: { item: NavItem; onClose: () => void }) {
  return (
    <NavLink
      to={item.to}
      end={item.end}
      onClick={onClose}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors
        ${
          isActive
            ? 'bg-brand-50 text-brand-700'
            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
        }`
      }
    >
      <item.icon className="h-5 w-5" aria-hidden="true" />
      {item.label}
    </NavLink>
  )
}

export function Sidebar({ navItems, footerItems, open, onClose, user, onLogout }: SidebarProps) {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-200 lg:static lg:translate-x-0
          ${open ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex h-16 items-center justify-between border-b border-slate-100 px-5">
          <SchoolLogo />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation"
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {navItems.map((item) => (
            <NavLinkItem key={item.to} item={item} onClose={onClose} />
          ))}
        </nav>

        {footerItems && footerItems.length > 0 && (
          <div className="border-t border-slate-100 px-3 py-3">
            {footerItems.map((item) => (
              <NavLinkItem key={item.to} item={item} onClose={onClose} />
            ))}
          </div>
        )}

        <div className="border-t border-slate-100 p-4">
          <div className="flex items-center gap-3">
            <NameAvatar name={user.name} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-900">{user.name}</p>
              <p className="text-xs text-slate-500">{capitalize(user.role.toLowerCase())}</p>
            </div>
            <button
              type="button"
              onClick={onLogout}
              aria-label="Log out"
              className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}