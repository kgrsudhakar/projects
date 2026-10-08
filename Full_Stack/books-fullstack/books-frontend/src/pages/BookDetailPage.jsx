import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api, useSession } from '../api.js';
import BookDialog from '../components/BookDialog.jsx';
import Cover from '../components/Cover.jsx';
import { useToast } from '../components/Toast.jsx';

export default function BookDetailPage() {
  const { id } = useParams();
  const session = useSession();
  const notify = useToast();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    setBook(null);
    setError(null);
    api(`/books/${id}`).then(setBook).catch(setError);
  }, [id]);

  if (error) {
    return (
      <main>
        <p className="empty">{error.status === 404 ? 'This book does not exist.' : error.message}</p>
        <Link className="crumb" to="/">Back to all books</Link>
      </main>
    );
  }
  if (!book) return <main><p className="empty">Loading…</p></main>;

  const remove = async () => {
    if (!window.confirm(`Delete "${book.title}"?`)) return;
    try {
      await api(`/books/${book.id}`, { method: 'DELETE' });
      notify('Book deleted');
      navigate('/');
    } catch (e) { notify(e.message, true); }
  };

  return (
    <main>
      <Link className="crumb" to="/">← All books</Link>
      <div className="detail">
        <Cover book={book} large />
        <div>
          <h2>{book.title}</h2>
          <p className="by">by {book.authorName}</p>
          <dl>
            <dt>Published</dt><dd>{book.publishedYear}</dd>
            <dt>ISBN</dt><dd>{book.isbn || 'Not set'}</dd>
            <dt>Price</dt><dd>${Number(book.price).toFixed(2)}</dd>
            <dt>Added</dt><dd>{book.createdAt ? new Date(book.createdAt).toLocaleDateString() : 'Unknown'}</dd>
          </dl>
          <p className="desc">{book.description || 'No description yet.'}</p>
          {session && (
            <div className="actions big">
              <button className="primary" onClick={() => setEditing(true)}>Edit</button>
              {session.role === 'ADMIN' && <button className="danger" onClick={remove}>Delete</button>}
            </div>
          )}
        </div>
      </div>
      <BookDialog
        open={editing}
        book={book}
        onClose={() => setEditing(false)}
        onSaved={(saved) => { setBook(saved); setEditing(false); notify('Book saved'); }}
      />
    </main>
  );
}
