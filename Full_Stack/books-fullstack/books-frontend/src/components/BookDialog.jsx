import { useEffect, useState } from 'react';
import { api } from '../api.js';
import Dialog from './Dialog.jsx';
import { useToast } from './Toast.jsx';

const MAX_COVER_BYTES = 2 * 1024 * 1024;

function BookForm({ book, onClose, onSaved }) {
  const notify = useToast();
  const [authors, setAuthors] = useState([]);
  const [saving, setSaving] = useState(false);
  const [cover, setCover] = useState(null);
  const [removeCover, setRemoveCover] = useState(false);
  const [form, setForm] = useState({
    title: book?.title ?? '',
    isbn: book?.isbn ?? '',
    price: book?.price ?? '',
    publishedYear: book?.publishedYear ?? '',
    authorId: book?.authorId ?? '',
    description: book?.description ?? '',
  });
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  useEffect(() => {
    api('/authors').then(setAuthors).catch((e) => notify(e.message, true));
  }, [notify]);

  const authorId = form.authorId || authors[0]?.id || '';

  const addAuthor = async () => {
    const name = window.prompt('Author name');
    if (!name?.trim()) return;
    try {
      const a = await api('/authors', { method: 'POST', body: { name } });
      setAuthors(await api('/authors'));
      setForm((f) => ({ ...f, authorId: a.id }));
    } catch (e) { notify(e.message, true); }
  };

  const pickCover = (e) => {
    const file = e.target.files[0];
    if (file && file.size > MAX_COVER_BYTES) {
      notify('Image must be 2 MB or smaller', true);
      e.target.value = '';
      return;
    }
    setCover(file || null);
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const body = {
        title: form.title,
        isbn: form.isbn.trim() || null,
        price: Number(form.price),
        publishedYear: Number(form.publishedYear),
        authorId: Number(authorId),
        description: form.description.trim() || null,
      };
      let saved = await api(book ? `/books/${book.id}` : '/books', { method: book ? 'PUT' : 'POST', body });
      if (cover) {
        const fd = new FormData();
        fd.append('file', cover);
        saved = await api(`/books/${saved.id}/cover`, { method: 'POST', body: fd });
      } else if (removeCover && book?.coverUrl) {
        saved = await api(`/books/${saved.id}/cover`, { method: 'DELETE' });
      }
      onSaved(saved, !book);
    } catch (err) {
      notify(err.message, true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit}>
      <h2>{book ? 'Edit book' : 'Add book'}</h2>
      <label>
        Title
        <input value={form.title} onChange={set('title')} required maxLength={200} />
      </label>
      <label>
        Author
        <span className="row">
          <select value={authorId} onChange={set('authorId')} required>
            {authors.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
          <button type="button" onClick={addAuthor}>New author</button>
        </span>
      </label>
      <label>
        ISBN
        <input value={form.isbn} onChange={set('isbn')} placeholder="9780451524935" pattern="[0-9\-]{10,17}" />
      </label>
      <div className="two">
        <label>
          Price
          <input type="number" step="0.01" min="0" value={form.price} onChange={set('price')} required />
        </label>
        <label>
          Year
          <input type="number" min="1000" max="2100" value={form.publishedYear} onChange={set('publishedYear')} required />
        </label>
      </div>
      <label>
        Description
        <textarea rows="3" maxLength={2000} value={form.description} onChange={set('description')} />
      </label>
      <label>
        Cover image (JPEG, PNG or WebP, up to 2 MB)
        <input type="file" accept="image/jpeg,image/png,image/webp" onChange={pickCover} />
      </label>
      {book?.coverUrl && !cover && (
        <label className="check">
          <input type="checkbox" checked={removeCover} onChange={(e) => setRemoveCover(e.target.checked)} /> Remove current cover
        </label>
      )}
      <div className="row">
        <span className="spacer" />
        <button type="button" onClick={onClose}>Cancel</button>
        <button className="primary" disabled={saving}>{saving ? 'Saving…' : 'Save book'}</button>
      </div>
    </form>
  );
}

export default function BookDialog({ open, book, onClose, onSaved }) {
  return (
    <Dialog open={open} onClose={onClose}>
      <BookForm book={book} onClose={onClose} onSaved={onSaved} />
    </Dialog>
  );
}
