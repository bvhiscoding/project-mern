export default function Rating({ value = 0, numReviews = 0 }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5 text-amber-400">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className="text-base leading-none">
            {value >= star ? '★' : value >= star - 0.5 ? '⯨' : '☆'}
          </span>
        ))}
      </div>
      {numReviews > 0 ? <span className="text-xs text-slate-500">({numReviews} reviews)</span> : null}
    </div>
  );
}
