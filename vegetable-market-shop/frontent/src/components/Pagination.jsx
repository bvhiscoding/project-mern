import { Link } from 'react-router-dom';

export default function Pagination({ page, pages, keyword = '', type = '' }) {
  const buildUrl = (pageNum) => {
    const params = new URLSearchParams();
    if (keyword) params.append('keyword', keyword);
    if (type) params.append('type', type);
    params.append('page', pageNum);
    return `/products?${params.toString()}`;
  };

  if (pages <= 1) return null;

  return (
    <div className="pagination">
      {page > 1 && (
        <Link to={buildUrl(page - 1)} className="pagination-btn">
          ← Previous
        </Link>
      )}

      <div className="pagination-numbers">
        {[...Array(pages).keys()].map((x) => (
          <Link
            key={x + 1}
            to={buildUrl(x + 1)}
            className={`pagination-number ${x + 1 === page ? 'active' : ''}`}
          >
            {x + 1}
          </Link>
        ))}
      </div>

      {page < pages && (
        <Link to={buildUrl(page + 1)} className="pagination-btn">
          Next →
        </Link>
      )}
    </div>
  );
}
