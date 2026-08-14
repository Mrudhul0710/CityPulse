import { Routes, Route, Navigate } from "react-router-dom";
import { Navbar } from "./components/layout/Navbar.jsx";
import { ProtectedRoute } from "./components/layout/ProtectedRoute.jsx";
import { LoginPage } from "./pages/LoginPage.jsx";
import { RegisterPage } from "./pages/RegisterPage.jsx";
import { IssuesListPage } from "./pages/IssuesListPage.jsx";
import { ReportIssuePage } from "./pages/ReportIssuePage.jsx";
import { IssueDetailPage } from "./pages/IssueDetailPage.jsx";
import { DepartmentsPage } from "./pages/DepartmentsPage.jsx";
import { NotFoundPage } from "./pages/NotFoundPage.jsx";
import { ROLES } from "./constants.js";

export default function App() {
  return (
    <div className="min-h-screen bg-paper">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Navigate to="/issues" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route
            path="/issues"
            element={
              <ProtectedRoute>
                <IssuesListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/issues/:id"
            element={
              <ProtectedRoute>
                <IssueDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/report"
            element={
              <ProtectedRoute roles={[ROLES.CITIZEN]}>
                <ReportIssuePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/departments"
            element={
              <ProtectedRoute roles={[ROLES.ADMIN]}>
                <DepartmentsPage />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </div>
  );
}
