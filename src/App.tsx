import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ToastProvider } from './components/ui/Toast'
import { LoadingState } from './components/ui/States'
import { AuthProvider, useAuth } from './context/AuthContext'
import { NotificationsProvider } from './context/NotificationsContext'
import { StudentsProvider } from './context/StudentsContext'
import { TeachersProvider } from './context/TeachersContext'
import { ParentsProvider } from './context/ParentsContext'
import { ClassesProvider } from './context/ClassesContext'
import { SubjectsProvider } from './context/SubjectsContext'
import { ResultsProvider } from './context/ResultsContext'
import { AnnouncementsProvider } from './context/AnnouncementsContext'
import { ProtectedRoute } from './routes/ProtectedRoute'
import { RoleGuard } from './routes/RoleGuard'
import { AdminLayout } from './layouts/AdminLayout'
import { TeacherLayout } from './layouts/TeacherLayout'
import { ParentLayout } from './layouts/ParentLayout'
import type { Role } from './types/user'
import { LoginPage } from './pages/auth/LoginPage'
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage'
import { AdminStudentsPage } from './pages/admin/AdminStudentsPage'
import { AdminStudentCreatePage } from './pages/admin/AdminStudentCreatePage'
import { AdminStudentEditPage } from './pages/admin/AdminStudentEditPage'
import { AdminStudentDetailsPage } from './pages/admin/AdminStudentDetailsPage'
import { AdminTeachersPage } from './pages/admin/AdminTeachersPage'
import { AdminParentsPage } from './pages/admin/AdminParentsPage'
import { AdminClassesPage } from './pages/admin/AdminClassesPage'
import { AdminSubjectsPage } from './pages/admin/AdminSubjectsPage'
import { AdminResultsPage } from './pages/admin/AdminResultsPage'
import { AdminResultsAnalyticsPage } from './pages/admin/AdminResultsAnalyticsPage'
import { AdminAnnouncementsPage } from './pages/admin/AdminAnnouncementsPage'
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage'
import { TeacherDashboardPage } from './pages/teacher/TeacherDashboardPage'
import { TeacherStudentsPage } from './pages/teacher/TeacherStudentsPage'
import { TeacherClassesPage } from './pages/teacher/TeacherClassesPage'
import { TeacherSubjectsPage } from './pages/teacher/TeacherSubjectsPage'
import { TeacherResultsPage } from './pages/teacher/TeacherResultsPage'
import { EnterResultsPage } from './pages/teacher/EnterResultsPage'
import { TeacherAnnouncementsPage } from './pages/teacher/TeacherAnnouncementsPage'
import { TeacherProfilePage } from './pages/teacher/TeacherProfilePage'
import { ParentDashboardPage } from './pages/parent/ParentDashboardPage'
import { ParentChildrenPage } from './pages/parent/ParentChildrenPage'
import { ChildDetailsPage } from './pages/parent/ChildDetailsPage'
import { ParentResultsPage } from './pages/parent/ParentResultsPage'
import { ParentPerformancePage } from './pages/parent/ParentPerformancePage'
import { ParentAttendancePage } from './pages/parent/ParentAttendancePage'
import { ParentAnnouncementsPage } from './pages/parent/ParentAnnouncementsPage'
import { ParentProfilePage } from './pages/parent/ParentProfilePage'
import { NotificationsPage } from './pages/notifications/NotificationsPage'
import { NotFoundPage } from './pages/NotFoundPage'

const HOME_BY_ROLE: Record<Role, string> = {
  ADMIN: '/admin',
  TEACHER: '/teacher',
  PARENT: '/parent',
}

function HomeRedirect() {
  const { user, isAuthenticated, loading } = useAuth()

  if (loading) {
    return <LoadingState label="Redirecting…" />
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />
  }

  return <Navigate to={HOME_BY_ROLE[user.role]} replace />
}

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <NotificationsProvider>
          <StudentsProvider>
            <TeachersProvider>
              <ParentsProvider>
                <ClassesProvider>
                  <SubjectsProvider>
                    <ResultsProvider>
                      <AnnouncementsProvider>
                        <BrowserRouter>
                          <Routes>
                            <Route path="/login" element={<LoginPage />} />

                            <Route element={<ProtectedRoute />}>
                              <Route element={<RoleGuard roles={['ADMIN']} />}>
                                <Route path="/admin" element={<AdminLayout />}>
                                  <Route index element={<AdminDashboardPage />} />
                                  <Route path="students" element={<AdminStudentsPage />} />
                                  <Route path="students/new" element={<AdminStudentCreatePage />} />
                                  <Route path="students/:id" element={<AdminStudentDetailsPage />} />
                                  <Route path="students/:id/edit" element={<AdminStudentEditPage />} />
                                  <Route path="teachers" element={<AdminTeachersPage />} />
                                  <Route path="parents" element={<AdminParentsPage />} />
                                  <Route path="classes" element={<AdminClassesPage />} />
                                  <Route path="subjects" element={<AdminSubjectsPage />} />
                                  <Route path="results" element={<AdminResultsPage />} />
                                  <Route path="results/analytics" element={<AdminResultsAnalyticsPage />} />
                                  <Route path="announcements" element={<AdminAnnouncementsPage />} />
                                  <Route path="notifications" element={<NotificationsPage />} />
                                  <Route path="settings" element={<AdminSettingsPage />} />
                                </Route>
                              </Route>

                              <Route element={<RoleGuard roles={['TEACHER']} />}>
                                <Route path="/teacher" element={<TeacherLayout />}>
                                  <Route index element={<TeacherDashboardPage />} />
                                  <Route path="students" element={<TeacherStudentsPage />} />
                                  <Route path="classes" element={<TeacherClassesPage />} />
                                  <Route path="subjects" element={<TeacherSubjectsPage />} />
                                  <Route path="results" element={<TeacherResultsPage />} />
                                  <Route path="results/enter" element={<EnterResultsPage />} />
                                  <Route path="announcements" element={<TeacherAnnouncementsPage />} />
                                  <Route path="notifications" element={<NotificationsPage />} />
                                  <Route path="profile" element={<TeacherProfilePage />} />
                                </Route>
                              </Route>

                              <Route element={<RoleGuard roles={['PARENT']} />}>
                                <Route path="/parent" element={<ParentLayout />}>
                                  <Route index element={<ParentDashboardPage />} />
                                  <Route path="children" element={<ParentChildrenPage />} />
                                  <Route path="children/:id" element={<ChildDetailsPage />} />
                                  <Route path="results" element={<ParentResultsPage />} />
                                  <Route path="performance" element={<ParentPerformancePage />} />
                                  <Route path="attendance" element={<ParentAttendancePage />} />
                                  <Route path="announcements" element={<ParentAnnouncementsPage />} />
                                  <Route path="notifications" element={<NotificationsPage />} />
                                  <Route path="profile" element={<ParentProfilePage />} />
                                </Route>
                              </Route>
                            </Route>

                            <Route path="/" element={<HomeRedirect />} />
                            <Route path="*" element={<NotFoundPage />} />
                          </Routes>
                        </BrowserRouter>
                      </AnnouncementsProvider>
                    </ResultsProvider>
                  </SubjectsProvider>
                </ClassesProvider>
              </ParentsProvider>
            </TeachersProvider>
          </StudentsProvider>
        </NotificationsProvider>
      </AuthProvider>
    </ToastProvider>
  )
}

export default App