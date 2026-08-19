import {
  BarChart3,
  Bell,
  CalendarCheck,
  ClipboardList,
  LayoutDashboard,
  Megaphone,
  UserRound,
  Users,
} from 'lucide-react'
import { RoleLayout } from './RoleLayout'

const navItems = [
  { to: '/parent', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/parent/children', label: 'My Children', icon: Users },
  { to: '/parent/results', label: 'Results', icon: ClipboardList },
  { to: '/parent/performance', label: 'Performance', icon: BarChart3 },
  { to: '/parent/attendance', label: 'Attendance', icon: CalendarCheck },
  { to: '/parent/announcements', label: 'Announcements', icon: Megaphone },
]

const footerItems = [
  { to: '/parent/notifications', label: 'Notifications', icon: Bell },
  { to: '/parent/profile', label: 'Profile', icon: UserRound },
]

export function ParentLayout() {
  return (
    <RoleLayout
      navItems={navItems}
      footerItems={footerItems}
      notificationsTo="/parent/notifications"
    />
  )
}