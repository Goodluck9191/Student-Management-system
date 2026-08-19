import {
  Bell,
  BookOpen,
  Building2,
  ClipboardList,
  ClipboardPen,
  LayoutDashboard,
  Megaphone,
  UserRound,
  Users,
} from 'lucide-react'
import { RoleLayout } from './RoleLayout'

const navItems = [
  { to: '/teacher', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/teacher/students', label: 'Students', icon: Users },
  { to: '/teacher/classes', label: 'My Classes', icon: Building2 },
  { to: '/teacher/subjects', label: 'My Subjects', icon: BookOpen },
  { to: '/teacher/results', label: 'Results', icon: ClipboardList },
  { to: '/teacher/results/enter', label: 'Enter Results', icon: ClipboardPen },
  { to: '/teacher/announcements', label: 'Announcements', icon: Megaphone },
]

const footerItems = [
  { to: '/teacher/notifications', label: 'Notifications', icon: Bell },
  { to: '/teacher/profile', label: 'Profile', icon: UserRound },
]

export function TeacherLayout() {
  return (
    <RoleLayout
      navItems={navItems}
      footerItems={footerItems}
      notificationsTo="/teacher/notifications"
    />
  )
}