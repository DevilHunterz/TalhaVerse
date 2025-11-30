import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';

import Layout from './components/Layout';
import Home from './pages/Home';
import CategoryPage from './pages/CategoryPage';
import ItemDetail from './pages/ItemDetail';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import AdminPanel from './pages/admin/AdminPanel';
import AdminUpload from './pages/admin/AdminUpload';
import AdminItems from './pages/admin/AdminItems';
import AdminUsers from './pages/admin/AdminUsers';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#1A1A1A',
                color: '#F5F5F5',
                border: '1px solid #374151',
              },
              success: {
                iconTheme: {
                  primary: '#DC2626',
                  secondary: '#F5F5F5',
                },
              },
            }}
          />
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="category/:type" element={<CategoryPage />} />
              <Route path="item/:slug" element={<ItemDetail />} />
              <Route path="login" element={<Login />} />
              <Route path="signup" element={<Signup />} />
              <Route 
                path="dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="admin" 
                element={
                  <ProtectedRoute adminOnly>
                    <AdminPanel />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="admin/upload" 
                element={
                  <ProtectedRoute adminOnly>
                    <AdminUpload />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="admin/items" 
                element={
                  <ProtectedRoute adminOnly>
                    <AdminItems />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="admin/users" 
                element={
                  <ProtectedRoute adminOnly>
                    <AdminUsers />
                  </ProtectedRoute>
                } 
              />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
