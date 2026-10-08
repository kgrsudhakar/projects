import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { api, setSession, useSession } from '../api.js';
import { useToast } from '../components/Toast.jsx';

export default function LoginPage() {
  const session = useSession();
  const notify = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/';
  const [register, setRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  if (session) return <Navigate to={from} replace />;

  const submit = async (e) => {
    e.preventDefault();
    try {
      const r = await api(`/auth/${register ? 'register' : 'login'}`, { method: 'POST', body: { username, password } });
      setSession(r);
      notify(`Welcome, ${r.username}`);
      navigate(from, { replace: true });
    } catch (err) { notify(err.message, true); }
  };

  return (
    <main className="narrow">
      <form className="form" onSubmit={submit}>
        <h2>{register ? 'Create account' : 'Log in'}</h2>
        <label>
          Username
          <input value={username} onChange={(e) => setUsername(e.target.value)} required minLength={3} autoComplete="username" />
        </label>
        <label>
          Password
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} autoComplete={register ? 'new-password' : 'current-password'} />
        </label>
        {!register && <p className="hint">Demo accounts: admin / admin123 (admin), user / user123</p>}
        <div className="row">
          <button type="button" className="link" onClick={() => setRegister(!register)}>
            {register ? 'I already have an account' : 'Create an account'}
          </button>
          <span className="spacer" />
          <button className="primary">{register ? 'Create account' : 'Log in'}</button>
        </div>
      </form>
    </main>
  );
}
