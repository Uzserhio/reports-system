import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import AdminLayout from './components/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import Companies from './pages/admin/Companies';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Admin Routes */}
        <Route element={<PrivateRoute adminOnly={true} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="companies" element={<Companies />} />
          </Route>
        </Route>

        {/* Placeholder User Dashboard */}
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={
            <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
              <h1 className="text-3xl font-bold mb-4">User Dashboard</h1>
              <p>Welcome to SROY Platform. User-specific modules are coming soon.</p>
              <button 
                onClick={() => {
                  localStorage.removeItem('token');
                  window.location.href = '/login';
                }}
                className="mt-6 px-4 py-2 bg-blue-600 text-white rounded"
              >
                Logout
              </button>
            </div>
          } />
        </Route>

        {/* Redirects */}
        <Route path="/" element={<Navigate to="/admin" replace />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
