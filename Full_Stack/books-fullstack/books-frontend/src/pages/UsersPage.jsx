import { useEffect, useState } from 'react';
import { api, useSession } from '../api.js';
import { useToast } from '../components/Toast.jsx';

export default function UsersPage() {
  const session = useSession();
  const notify = useToast();
  const [users, setUsers] = useState([]);

  const load = () => api('/admin/users').then(setUsers).catch((e) => notify(e.message, true));
  useEffect(() => { load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, []);

  const run = async (action, message) => {
    try {
      await action();
      notify(message);
      load();
    } catch (e) { notify(e.message, true); }
  };

  return (
    <main>
      <h2 className="page-title">Users</h2>
      <div className="table-wrap">
        <table className="users">
          <thead>
            <tr><th>Username</th><th>Role</th><th>Status</th><th>Joined</th><th></th></tr>
          </thead>
          <tbody>
            {users.map((u) => {
              const self = u.username === session.username;
              return (
                <tr key={u.id}>
                  <td>{u.username}{self && <span className="tag">you</span>}</td>
                  <td>
                    <select value={u.role} disabled={self} aria-label={`Role for ${u.username}`}
                      onChange={(e) => run(() => api(`/admin/users/${u.id}/role`, { method: 'PUT', body: { role: e.target.value } }), 'Role updated')}>
                      <option>USER</option>
                      <option>ADMIN</option>
                    </select>
                  </td>
                  <td>
                    <button disabled={self}
                      onClick={() => run(() => api(`/admin/users/${u.id}/enabled`, { method: 'PUT', body: { enabled: !u.enabled } }), u.enabled ? 'User disabled' : 'User enabled')}>
                      {u.enabled ? 'Active' : 'Disabled'}
                    </button>
                  </td>
                  <td>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : ''}</td>
                  <td>
                    <button className="danger" disabled={self}
                      onClick={() => window.confirm(`Delete user "${u.username}"?`) && run(() => api(`/admin/users/${u.id}`, { method: 'DELETE' }), 'User deleted')}>
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </main>
  );
}
