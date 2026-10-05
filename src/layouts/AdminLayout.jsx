import { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  MdDashboard, 
  MdDesignServices, 
  MdCategory, 
  MdCollections, 
  MdEmail, 
  MdSettings,
  MdLogout,
  MdMenu
} from 'react-icons/md';

const adminLinks = [
  { name: 'Dashboard', path: '/admin', icon: <MdDashboard /> },
  { name: 'Services', path: '/admin/services', icon: <MdDesignServices /> },
  { name: 'Products', path: '/admin/products', icon: <MdCategory /> },
  { name: 'Projects', path: '/admin/projects', icon: <MdDesignServices /> },
  { name: 'Gallery', path: '/admin/gallery', icon: <MdCollections /> },
  { name: 'Enquiries', path: '/admin/enquiries', icon: <MdEmail /> },
  { name: 'Settings', path: '/admin/settings', icon: <MdSettings /> },
  { name: 'Migration', path: '/admin/migration', icon: <MdSettings /> },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { currentUser, logout, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  // Protect Admin Routes
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-100">
        <div className="w-12 h-12 border-4 border-sky border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <div className="flex h-screen bg-slate-100 text-slate-900 font-sans">
      {/* Sidebar */}
      <div className={`bg-navy text-white transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'} flex flex-col`}>
        <div className="h-16 flex items-center justify-center border-b border-white/10">
          <Link to="/" className="text-xl font-bold text-sky overflow-hidden whitespace-nowrap">
            {sidebarOpen ? 'GLAZONE ADMIN' : 'G'}
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1">
            {adminLinks.map((link) => (
              <li key={link.name}>
                <Link
                  to={link.path}
                  className={`flex items-center px-6 py-3 transition-colors ${
                    location.pathname === link.path 
                      ? 'bg-sky/10 text-sky border-r-4 border-sky' 
                      : 'hover:bg-white/5 text-slate-300 hover:text-white'
                  }`}
                  title={!sidebarOpen ? link.name : ''}
                >
                  <span className="text-xl">{link.icon}</span>
                  {sidebarOpen && <span className="ml-4">{link.name}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-2 py-2 text-slate-300 hover:text-white hover:bg-white/5 rounded transition-colors"
          >
            <span className="text-xl"><MdLogout /></span>
            {sidebarOpen && <span className="ml-4">Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-6 z-10">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-slate-500 hover:text-slate-700 text-2xl"
          >
            <MdMenu />
          </button>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-600 font-medium">
              Admin User
            </span>
            <div className="w-8 h-8 rounded-full bg-sky text-white flex items-center justify-center font-bold">
              A
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-100 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
