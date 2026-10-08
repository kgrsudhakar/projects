import { Link } from 'react-router-dom';
import { spine } from '../utils.js';
import Cover from './Cover.jsx';

export default function BookCard({ book }) {
  return (
    <Link to={`/books/${book.id}`} className="book-link">
      <article className="book" style={{ '--spine': spine(book.title) }}>
        <Cover book={book} />
        <div className="body">
          <h3>{book.title}</h3>
          <p className="by">{book.authorName}</p>
          <p className="meta">{book.publishedYear}</p>
          <p className="price">${Number(book.price).toFixed(2)}</p>
        </div>
      </article>
    </Link>
  );
}
