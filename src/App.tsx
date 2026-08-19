import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppLayout } from './components/layout/AppLayout'
import { StudentsProvider } from './context/StudentsContext'
import { ToastProvider } from './components/ui/Toast'
import { DashboardPage } from './pages/DashboardPage'
import { StudentsPage } from './pages/StudentsPage'
import { AddStudentPage } from './pages/AddStudentPage'
import { StudentDetailsPage } from './pages/StudentDetailsPage'
import { EditStudentPage } from './pages/EditStudentPage'
import { SettingsPage } from './pages/SettingsPage'
import { NotFoundPage } from './pages/NotFoundPage'

function App() {
  return (
    <ToastProvider>
      <StudentsProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<AppLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="/students" element={<StudentsPage />} />
              <Route path="/students/new" element={<AddStudentPage />} />
              <Route path="/students/:id" element={<StudentDetailsPage />} />
              <Route path="/students/:id/edit" element={<EditStudentPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </StudentsProvider>
    </ToastProvider>
  )
}

export default App
