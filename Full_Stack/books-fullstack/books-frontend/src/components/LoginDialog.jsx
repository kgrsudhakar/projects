import { useState } from 'react';
import Dialog from './Dialog.jsx';

function LoginForm({ onSubmit, onClose }) {
  const [register, setRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(register ? 'register' : 'login', { username, password });
      }}
    >
      <h2>{register ? 'Create account' : 'Log in'}</h2>
      <label>
        Username
        <input value={username} onChange={(e) => setUsername(e.target.value)} required minLength={3} autoComplete="username" />
      </label>
      <label>
        Password
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} autoComplete="current-password" />
      </label>
      {!register && <p className="hint">Demo accounts: admin / admin123 (can delete), user / user123</p>}
      <div className="row">
        <button type="button" className="link" onClick={() => setRegister(!register)}>
          {register ? 'I already have an account' : 'Create an account'}
        </button>
        <span className="spacer" />
        <button type="button" onClick={onClose}>Cancel</button>
        <button className="primary">{register ? 'Create account' : 'Log in'}</button>
      </div>
    </form>
  );
}

export default function LoginDialog({ open, onClose, onSubmit }) {
  return (
    <Dialog open={open} onClose={onClose}>
      <LoginForm onSubmit={onSubmit} onClose={onClose} />
    </Dialog>
  );
}
