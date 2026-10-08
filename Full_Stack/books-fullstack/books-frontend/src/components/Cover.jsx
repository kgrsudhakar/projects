import { assetUrl } from '../api.js';
import { spine } from '../utils.js';

export default function Cover({ book, large = false }) {
  const cls = 'cover' + (large ? ' large' : '');
  if (book.coverUrl) {
    return <img className={cls} src={assetUrl(book.coverUrl)} alt={`Cover of ${book.title}`} loading="lazy" />;
  }
  return (
    <div className={cls + ' blank'} style={{ '--spine': spine(book.title) }} aria-hidden="true">
      <span>{book.title.slice(0, 2).toUpperCase()}</span>
    </div>
  );
}
