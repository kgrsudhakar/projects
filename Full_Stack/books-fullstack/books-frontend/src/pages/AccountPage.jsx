import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, setSession, useSession } from '../api.js';
import { useToast } from '../components/Toast.jsx';

export default function AccountPage() {
  const session = useSession();
  const notify = useToast();
  const navigate = useNavigate();
  const [currentPassword, setCurrent] = useState('');
  const [newPassword, setNew] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api('/users/me/password', { method: 'POST', body: { currentPassword, newPassword } });
      // the server signs the user out everywhere after a password change
      setSession(null);
      notify('Password changed. Please log in again.');
      navigate('/login');
    } catch (err) { notify(err.message, true); }
  };

  return (
    <main className="narrow">
      <h2 className="page-title">Account</h2>
      <p className="stats">Signed in as <b>{session.username}</b> ({session.role.toLowerCase()})</p>
      <form className="form" onSubmit={submit}>
        <h3>Change password</h3>
        <label>
          Current password
          <input type="password" value={currentPassword} onChange={(e) => setCurrent(e.target.value)} required autoComplete="current-password" />
        </label>
        <label>
          New password (6+ characters)
          <input type="password" value={newPassword} onChange={(e) => setNew(e.target.value)} required minLength={6} autoComplete="new-password" />
        </label>
        <div className="row"><span className="spacer" /><button className="primary">Change password</button></div>
      </form>
    </main>
  );
}
