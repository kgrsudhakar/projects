import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api, useSession } from '../api.js';
import BookCard from '../components/BookCard.jsx';
import BookDialog from '../components/BookDialog.jsx';
import { useToast } from '../components/Toast.jsx';

const PAGE_SIZE = 8;

export default function BooksPage() {
  const session = useSession();
  const notify = useToast();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();

  // search, sort and page live in the URL, so they survive reloads and the Back button
  const q = params.get('q') ?? '';
  const sort = params.get('sort') ?? 'title';
  const dir = params.get('dir') ?? 'asc';
  const page = Number(params.get('page') ?? 0);

  const [search, setSearch] = useState(q);
  const [data, setData] = useState({ content: [], page: 0, totalPages: 0 });
  const [stats, setStats] = useState(null);
  const [adding, setAdding] = useState(false);

  const update = (changes) =>
    setParams((prev) => {
      const next = new URLSearchParams(prev);
      Object.entries(changes).forEach(([k, v]) => (v === '' || v == null ? next.delete(k) : next.set(k, v)));
      return next;
    }, { replace: true });

  useEffect(() => {
    if (search === q) return undefined;
    const t = setTimeout(() => update({ q: search, page: '' }), 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  useEffect(() => {
    const query = new URLSearchParams({ q, page, size: PAGE_SIZE, sort, dir });
    Promise.all([api(`/books?${query}`), api('/books/stats')])
      .then(([books, st]) => { setData(books); setStats(st); })
      .catch((e) => notify(e.message, true));
  }, [q, page, sort, dir, notify]);

  return (
    <main>
      {stats && (
        <p className="stats">
          <b>{stats.totalBooks}</b> books by <b>{stats.totalAuthors}</b> authors, average price{' '}
          <b>${(stats.averagePrice ?? 0).toFixed(2)}</b>
        </p>
      )}

      <div className="toolbar">
        <input type="search" placeholder="Search by title or author" aria-label="Search books" value={search} onChange={(e) => setSearch(e.target.value)} />
        <select aria-label="Sort by" value={sort} onChange={(e) => update({ sort: e.target.value === 'title' ? '' : e.target.value, page: '' })}>
          <option value="title">Title</option>
          <option value="price">Price</option>
          <option value="publishedYear">Year</option>
          <option value="createdAt">Recently added</option>
        </select>
        <button aria-label="Toggle sort direction" onClick={() => update({ dir: dir === 'asc' ? 'desc' : '', page: '' })}>
          {dir === 'asc' ? 'A–Z' : 'Z–A'}
        </button>
        {session && <button className="primary" onClick={() => setAdding(true)}>Add book</button>}
      </div>

      <div className="shelf">
        {data.content.length === 0 && <p className="empty">No books match your search. Try a different title or author.</p>}
        {data.content.map((b) => <BookCard key={b.id} book={b} />)}
      </div>

      <nav className="pager" aria-label="Pagination">
        <button disabled={data.page === 0} onClick={() => update({ page: data.page - 1 || '' })}>Previous</button>
        <span>Page {data.page + 1} of {Math.max(data.totalPages, 1)}</span>
        <button disabled={data.page + 1 >= data.totalPages} onClick={() => update({ page: data.page + 1 })}>Next</button>
      </nav>

      <BookDialog
        open={adding}
        book={null}
        onClose={() => setAdding(false)}
        onSaved={(saved) => { setAdding(false); notify('Book added'); navigate(`/books/${saved.id}`); }}
      />
    </main>
  );
}
