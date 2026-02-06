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
    <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
      {page > 1 ? (
        <Link to={buildUrl(page - 1)} className="btn-secondary">
          Previous
        </Link>
      ) : null}

      {[...Array(pages).keys()].map((x) => {
        const current = x + 1 === page;
        return (
          <Link
            key={x + 1}
            to={buildUrl(x + 1)}
            className={
              current
                ? 'btn h-9 min-w-9 bg-brand-500 px-3 text-white hover:bg-brand-600'
                : 'btn-secondary h-9 min-w-9 px-3'
            }
          >
            {x + 1}
          </Link>
        );
      })}

      {page < pages ? (
        <Link to={buildUrl(page + 1)} className="btn-secondary">
          Next
        </Link>
      ) : null}
    </div>
  );
}
