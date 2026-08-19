import {
  Bell,
  BookOpen,
  Building2,
  ClipboardList,
  HeartHandshake,
  LayoutDashboard,
  Megaphone,
  Settings,
  UserCog,
  Users,
} from 'lucide-react'
import { RoleLayout } from './RoleLayout'

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/students', label: 'Students', icon: Users },
  { to: '/admin/teachers', label: 'Teachers', icon: UserCog },
  { to: '/admin/parents', label: 'Parents', icon: HeartHandshake },
  { to: '/admin/classes', label: 'Classes', icon: Building2 },
  { to: '/admin/subjects', label: 'Subjects', icon: BookOpen },
  { to: '/admin/results', label: 'Results', icon: ClipboardList },
  { to: '/admin/announcements', label: 'Announcements', icon: Megaphone },
]

const footerItems = [
  { to: '/admin/notifications', label: 'Notifications', icon: Bell },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
]

export function AdminLayout() {
  return (
    <RoleLayout
      navItems={navItems}
      footerItems={footerItems}
      notificationsTo="/admin/notifications"
    />
  )
}