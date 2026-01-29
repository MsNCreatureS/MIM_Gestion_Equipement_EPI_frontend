import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import FormPage from './pages/FormPage';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminFeedbackDetails from './pages/AdminFeedbackDetails';
import AdminTypesPage from './pages/AdminTypesPage';
import PublicRequestsPage from './pages/PublicRequestsPage';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <Routes>
            <Route path="/" element={<FormPage />} />
            <Route path="/demandes" element={<PublicRequestsPage />} />
            <Route path="/login" element={<LoginPage />} />

            {/* Admin Routes wrapped in Layout */}
            <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/types" element={<AdminTypesPage />} />
              <Route path="/admin/feedback/:id" element={<AdminFeedbackDetails />} />
            </Route>
          </Routes>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;

