import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const titles = {
  '/dashboard': { title: 'Dashboard', sub: 'Your health at a glance' },
  '/activities': { title: 'Activity Log', sub: 'All your logged activities' },
  '/goals': { title: 'Goals', sub: 'Track your health targets' },
  '/reports': { title: 'Reports & Analytics', sub: 'Insights from your data' },
  '/profile': { title: 'Profile', sub: 'Manage your account' },
};

const Navbar = () => {
  const { pathname } = useLocation();
  const { user, logout } = useAuth();
  const { title, sub } = titles[pathname] || { title: 'HealthTrack', sub: '' };

  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  return (
    <header className="navbar">
      <div>
        <div className="navbar-title">{title}</div>
        {sub && <span style={{ fontSize: '0.82rem', color: '#9ca3af', fontWeight: 500 }}>{sub}</span>}
      </div>
      <div className="navbar-actions">
        <span className="navbar-date">📅 {today}</span>
        <button className="logout-btn" onClick={logout}>
          🚪 Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;
