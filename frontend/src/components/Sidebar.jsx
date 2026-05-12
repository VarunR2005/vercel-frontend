import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { path: '/dashboard', icon: '🏠', label: 'Dashboard' },
  { path: '/activities', icon: '📋', label: 'Activity Log' },
  { path: '/goals', icon: '🎯', label: 'Goals' },
  { path: '/reports', icon: '📊', label: 'Reports' },
  { path: '/profile', icon: '👤', label: 'Profile' },
];

const Sidebar = () => {
  const { pathname } = useLocation();
  const { user } = useAuth();
  const initials = user?.name?.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0,2) || 'U';

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-icon">❤️</div>
        <span>HealthTrack</span>
      </div>

      {/* Nav */}
      <nav className="sidebar-nav">
        <div className="nav-section-label">Main Menu</div>
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-item${pathname === item.path ? ' active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      {/* User Footer */}
      <div className="sidebar-footer">
        <div className="user-info">
          <div className="user-avatar">{initials}</div>
          <div>
            <div className="user-name">{user?.name || 'User'}</div>
            <div className="user-email">{user?.email || ''}</div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
