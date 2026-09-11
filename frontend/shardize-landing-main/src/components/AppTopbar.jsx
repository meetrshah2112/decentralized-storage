import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AppTopbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const initial = user?.username ? user.username.charAt(0) : '?';

  return (
    <div className="app-topbar">
      <Link to="/" className="brand-logo" style={{ textDecoration: 'none' }}>
        <div className="brand-logo-mark">S</div>
        <span>Shardize</span>
      </Link>

      <div className="app-nav-links">
        <Link
          to="/dashboard"
          className={`app-nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
        >
          Files
        </Link>
        <Link
          to="/provider"
          className={`app-nav-link ${location.pathname === '/provider' ? 'active' : ''}`}
        >
          Provider
        </Link>
      </div>

      <div className="app-topbar-right">
        <div className="app-user-chip">
          <div className="app-user-avatar">{initial}</div>
          <span className="app-user-name">{user?.username}</span>
          {user?.role && <span className="role-badge">{user.role}</span>}
        </div>
        <button className="app-logout-btn" onClick={handleLogout}>
          Log out
        </button>
      </div>
    </div>
  );
}
