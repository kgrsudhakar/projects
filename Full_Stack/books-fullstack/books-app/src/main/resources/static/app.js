const $ = (s) => document.querySelector(s);
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

let session = JSON.parse(localStorage.getItem('session') || 'null');
const state = { page: 0, q: '', sort: 'title', dir: 'asc' };
let authors = [];
let registerMode = false;
let editingId = null;

function toast(msg, isError) {
  const t = $('#toast');
  t.textContent = msg;
  t.className = 'show' + (isError ? ' err' : '');
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => (t.className = ''), 3200);
}

async function api(path, opts = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (session) headers.Authorization = 'Bearer ' + session.token;
  const res = await fetch('/api' + path, { ...opts, headers });
  if (res.status === 204) return null;
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    if (res.status === 401 && session && !path.startsWith('/auth')) {
      setSession(null);
      throw new Error('Your session expired. Log in again.');
    }
    const fields = data && data.errors ? Object.entries(data.errors).map(([k, v]) => k + ': ' + v).join(', ') : null;
    throw new Error(fields || (data && data.detail) || 'Request failed (' + res.status + ')');
  }
  return data;
}

function setSession(s) {
  session = s;
  if (s) localStorage.setItem('session', JSON.stringify(s)); else localStorage.removeItem('session');
  renderAuth();
  loadBooks();
}

function renderAuth() {
  $('#auth').innerHTML = session
    ? `<span>${esc(session.username)} (${esc(session.role.toLowerCase())})</span><button id="logoutBtn">Log out</button>`
    : '<button id="loginBtn" class="primary">Log in</button>';
  $('#addBtn').classList.toggle('hidden', !session);
}

const isAdmin = () => session && session.role === 'ADMIN';
const spine = (title) => { let h = 0; for (const c of title) h = (h * 31 + c.charCodeAt(0)) % 360; return `hsl(${h} 45% 42%)`; };

function card(b) {
  const actions = session
    ? `<div class="actions"><button data-act="edit" data-id="${b.id}">Edit</button>` +
      (isAdmin() ? `<button class="danger" data-act="del" data-id="${b.id}">Delete</button>` : '') + '</div>'
    : '';
  return `<article class="book" style="--spine:${spine(b.title)}">
    <h3>${esc(b.title)}</h3>
    <p class="by">${esc(b.authorName)}</p>
    <p class="meta">${esc(b.publishedYear)}${b.isbn ? ' · ISBN ' + esc(b.isbn) : ''}</p>
    <p class="price">$${Number(b.price).toFixed(2)}</p>${actions}</article>`;
}

async function loadBooks() {
  try {
    const p = new URLSearchParams({ q: state.q, page: state.page, size: 8, sort: state.sort, dir: state.dir });
    const [d, st] = await Promise.all([api('/books?' + p), api('/books/stats')]);
    $('#grid').innerHTML = d.content.length ? d.content.map(card).join('') : '<p class="empty">No books match your search. Try a different title or author.</p>';
    $('#pager').innerHTML = `<button data-p="${d.page - 1}" ${d.page === 0 ? 'disabled' : ''}>Previous</button>
      <span>Page ${d.page + 1} of ${Math.max(d.totalPages, 1)}</span>
      <button data-p="${d.page + 1}" ${d.page + 1 >= d.totalPages ? 'disabled' : ''}>Next</button>`;
    const avg = st.averagePrice == null ? '0.00' : st.averagePrice.toFixed(2);
    $('#stats').innerHTML = `<b>${st.totalBooks}</b> books by <b>${st.totalAuthors}</b> authors, average price <b>$${avg}</b>`;
  } catch (e) { toast(e.message, true); }
}

async function loadAuthors(selectId) {
  authors = await api('/authors');
  const sel = $('#bookForm [name=authorId]');
  sel.innerHTML = authors.map((a) => `<option value="${a.id}">${esc(a.name)}</option>`).join('');
  if (selectId) sel.value = selectId;
}

async function openBookDialog(id) {
  editingId = id || null;
  $('#bookTitle').textContent = id ? 'Edit book' : 'Add book';
  const f = $('#bookForm');
  f.reset();
  await loadAuthors();
  if (id) {
    const b = await api('/books/' + id);
    f.title.value = b.title; f.isbn.value = b.isbn || ''; f.price.value = b.price;
    f.publishedYear.value = b.publishedYear; f.authorId.value = b.authorId;
  }
  $('#bookDlg').showModal();
}

// ---- events ----
$('#q').addEventListener('input', (e) => {
  clearTimeout($('#q').t);
  $('#q').t = setTimeout(() => { state.q = e.target.value; state.page = 0; loadBooks(); }, 250);
});
$('#sort').addEventListener('change', (e) => { state.sort = e.target.value; state.page = 0; loadBooks(); });
$('#dirBtn').addEventListener('click', (e) => {
  state.dir = state.dir === 'asc' ? 'desc' : 'asc';
  e.target.textContent = state.dir === 'asc' ? 'A–Z' : 'Z–A';
  loadBooks();
});
$('#addBtn').addEventListener('click', () => openBookDialog().catch((e) => toast(e.message, true)));
$('#pager').addEventListener('click', (e) => {
  const p = e.target.dataset.p;
  if (p !== undefined) { state.page = Number(p); loadBooks(); }
});
$('#grid').addEventListener('click', async (e) => {
  const { act, id } = e.target.dataset;
  try {
    if (act === 'edit') await openBookDialog(id);
    if (act === 'del' && confirm('Delete this book?')) {
      await api('/books/' + id, { method: 'DELETE' });
      toast('Book deleted');
      loadBooks();
    }
  } catch (err) { toast(err.message, true); }
});
$('#auth').addEventListener('click', (e) => {
  if (e.target.id === 'loginBtn') $('#loginDlg').showModal();
  if (e.target.id === 'logoutBtn') { setSession(null); toast('Logged out'); }
});
document.querySelectorAll('[data-close]').forEach((b) => b.addEventListener('click', () => b.closest('dialog').close()));

$('#switchMode').addEventListener('click', () => {
  registerMode = !registerMode;
  $('#loginTitle').textContent = registerMode ? 'Create account' : 'Log in';
  $('#loginSubmit').textContent = registerMode ? 'Create account' : 'Log in';
  $('#switchMode').textContent = registerMode ? 'I already have an account' : 'Create an account';
  $('#loginHint').classList.toggle('hidden', registerMode);
});

$('#loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const f = e.target;
  try {
    const r = await api(registerMode ? '/auth/register' : '/auth/login', {
      method: 'POST', body: JSON.stringify({ username: f.username.value, password: f.password.value })
    });
    $('#loginDlg').close();
    f.reset();
    setSession(r);
    toast('Welcome, ' + r.username);
  } catch (err) { toast(err.message, true); }
});

$('#newAuthor').addEventListener('click', async () => {
  const name = prompt('Author name');
  if (!name || !name.trim()) return;
  try {
    const a = await api('/authors', { method: 'POST', body: JSON.stringify({ name }) });
    await loadAuthors(a.id);
    toast('Author added');
  } catch (err) { toast(err.message, true); }
});

$('#bookForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const f = e.target;
  const body = {
    title: f.title.value, isbn: f.isbn.value.trim() || null, price: Number(f.price.value),
    publishedYear: Number(f.publishedYear.value), authorId: Number(f.authorId.value)
  };
  try {
    await api(editingId ? '/books/' + editingId : '/books', { method: editingId ? 'PUT' : 'POST', body: JSON.stringify(body) });
    $('#bookDlg').close();
    toast(editingId ? 'Book saved' : 'Book added');
    loadBooks();
  } catch (err) { toast(err.message, true); }
});

renderAuth();
loadBooks();
