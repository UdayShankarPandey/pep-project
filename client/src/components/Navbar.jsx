import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home, PlusSquare, User, LogOut, LogIn, UserPlus, Compass } from 'lucide-react';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-slate-900/80 border-b border-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-2 rounded-xl text-white shadow-md shadow-indigo-500/20">
              <Compass className="h-6 w-6" />
            </div>
            <span className="text-xl font-extrabold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent tracking-tight">
              PEP Space
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Link
              to="/"
              className="text-slate-300 hover:text-white flex items-center space-x-1.5 px-3 py-2 rounded-lg hover:bg-slate-800/50 transition duration-200"
            >
              <Home className="h-5 w-5" />
              <span className="hidden md:inline text-sm font-medium">Home</span>
            </Link>

            {user ? (
              <>
                <Link
                  to="/create-post"
                  className="text-slate-300 hover:text-white flex items-center space-x-1.5 px-3 py-2 rounded-lg hover:bg-slate-800/50 transition duration-200"
                >
                  <PlusSquare className="h-5 w-5" />
                  <span className="hidden md:inline text-sm font-medium">Create</span>
                </Link>

                <Link
                  to="/profile"
                  className="text-slate-300 hover:text-white flex items-center space-x-1.5 px-3 py-2 rounded-lg hover:bg-slate-800/50 transition duration-200"
                >
                  <User className="h-5 w-5" />
                  <span className="hidden md:inline text-sm font-medium">Profile</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="text-red-400 hover:text-red-300 flex items-center space-x-1.5 px-3 py-2 rounded-lg hover:bg-red-500/10 transition duration-200 cursor-pointer"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="hidden md:inline text-sm font-medium">Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-slate-300 hover:text-white flex items-center space-x-1.5 px-3 py-2 rounded-lg hover:bg-slate-800/50 transition duration-200"
                >
                  <LogIn className="h-5 w-5" />
                  <span className="text-sm font-medium">Login</span>
                </Link>

                <Link
                  to="/register"
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white flex items-center space-x-1.5 px-4 py-2 rounded-xl transition duration-200 shadow-md shadow-indigo-500/20"
                >
                  <UserPlus className="h-5 w-5" />
                  <span className="text-sm font-medium">Register</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
