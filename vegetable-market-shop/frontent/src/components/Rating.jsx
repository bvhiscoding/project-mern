export default function Rating({ value = 0, numReviews = 0 }) {
  return (
    <div className="rating">
      <div className="stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className="star">
            {value >= star 
              ? '★' 
              : value >= star - 0.5 
              ? '⯨' 
              : '☆'}
          </span>
        ))}
      </div>
      {numReviews > 0 && (
        <span className="review-count">({numReviews} reviews)</span>
      )}
    </div>
  );
}
