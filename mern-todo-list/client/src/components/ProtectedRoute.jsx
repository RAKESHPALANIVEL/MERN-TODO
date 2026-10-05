import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <p className="muted center">Checking your session…</p>;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}
