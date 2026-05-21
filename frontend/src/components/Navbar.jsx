import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  // Helper to highlight active link
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/dashboard" className="text-xl font-bold text-indigo-600">
          🎓 StudentMS
        </Link>

        {/* Nav Links */}
        <div className="flex items-center gap-6">
          <Link
            to="/dashboard"
            className={`text-sm font-medium transition ${
              isActive('/dashboard')
                ? 'text-indigo-600 border-b-2 border-indigo-600 pb-0.5'
                : 'text-gray-600 hover:text-indigo-600'
            }`}
          >
            Dashboard
          </Link>
          <Link
            to="/students"
            className={`text-sm font-medium transition ${
              isActive('/students')
                ? 'text-indigo-600 border-b-2 border-indigo-600 pb-0.5'
                : 'text-gray-600 hover:text-indigo-600'
            }`}
          >
            Students
          </Link>
        </div>

        {/* User + Logout */}
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            👋 <span className="font-medium">{user?.name}</span>
          </span>
          <button
            onClick={handleLogout}
            className="bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-lg text-sm font-medium transition"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;