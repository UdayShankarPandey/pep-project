import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';

// Components
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import CreatePost from './pages/CreatePost';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased selection:bg-indigo-500 selection:text-white">
          <Navbar />
          
          <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected Routes */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/create-post"
                element={
                  <ProtectedRoute>
                    <CreatePost />
                  </ProtectedRoute>
                }
              />
              
              {/* 404 Route */}
              <Route
                path="*"
                element={
                  <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
                    <h2 className="text-4xl font-extrabold text-white">404 - Page Not Found</h2>
                    <p className="text-slate-400">The page you are looking for does not exist.</p>
                  </div>
                }
              />
            </Routes>
          </main>
        </div>
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#0f172a',
              color: '#f8fafc',
              border: '1px solid #1e293b',
              borderRadius: '1rem',
            },
            success: {
              iconTheme: {
                primary: '#6366f1',
                secondary: '#f8fafc',
              },
            },
          }}
        />
      </AuthProvider>
    </Router>
  );
};

export default App;
