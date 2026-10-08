import { NavLink, Route, Routes, useNavigate } from 'react-router-dom';
import { api, setSession, useSession } from './api.js';
import { useToast } from './components/Toast.jsx';
import RequireAuth from './components/RequireAuth.jsx';
import AccountPage from './pages/AccountPage.jsx';
import BookDetailPage from './pages/BookDetailPage.jsx';
import BooksPage from './pages/BooksPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import UsersPage from './pages/UsersPage.jsx';

export default function App() {
  const session = useSession();
  const notify = useToast();
  const navigate = useNavigate();

  const logout = () => {
    const refreshToken = session?.refreshToken;
    setSession(null);
    navigate('/');
    notify('Logged out');
    // revoke the refresh token on the server (fire and forget)
    if (refreshToken) api('/auth/logout', { method: 'POST', body: { refreshToken } }).catch(() => {});
  };

  return (
    <>
      <header className="top">
        <h1>Bookshelf</h1>
        <nav>
          <NavLink to="/" end>Books</NavLink>
          {session?.role === 'ADMIN' && <NavLink to="/admin/users">Users</NavLink>}
          {session && <NavLink to="/account">Account</NavLink>}
        </nav>
        <div id="auth">
          {session ? (
            <>
              <span>{session.username} ({session.role.toLowerCase()})</span>
              <button onClick={logout}>Log out</button>
            </>
          ) : (
            <NavLink to="/login" className="btn primary">Log in</NavLink>
          )}
        </div>
      </header>

      <Routes>
        <Route path="/" element={<BooksPage />} />
        <Route path="/books/:id" element={<BookDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/account" element={<RequireAuth><AccountPage /></RequireAuth>} />
        <Route path="/admin/users" element={<RequireAuth role="ADMIN"><UsersPage /></RequireAuth>} />
        <Route path="*" element={<main><p className="empty">Page not found.</p></main>} />
      </Routes>
    </>
  );
}
