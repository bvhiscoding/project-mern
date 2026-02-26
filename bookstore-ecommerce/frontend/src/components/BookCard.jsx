import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping, faStar } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/slices/cartSlice";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const BookCard = ({ book, onAddToCart }) => {
  const dispatch = useDispatch();
  if (!book) {
    return null;
  }

  const rating = Math.round(book.rating || 0);
  const inStock = Number(book.stock ?? 0) > 0;
  const detailsLink = book._id ? `/books/${book._id}` : null;

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(book);
      return;
    }
    dispatch(addToCart({ ...book, quantity: 1 }));
  };

  const imageContent = (
    <div className="relative aspect-[3/4] overflow-hidden bg-sand">
      <img
        src={book.image}
        alt={book.title}
        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        loading="lazy"
      />
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/70 via-ink/20 to-transparent p-4">
        <span className="inline-flex items-center rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-ink shadow-soft">
          {book.genre}
        </span>
      </div>
    </div>
  );

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-card">
      {detailsLink ? <Link to={detailsLink}>{imageContent}</Link> : imageContent}

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-ink/50">
            {book.author}
          </p>
          <h3 className="mt-2 text-lg font-display text-ink">{book.title}</h3>
        </div>

        <div className="flex items-center gap-2 text-sm text-ember">
          {Array.from({ length: 5 }).map((_, index) => (
            <FontAwesomeIcon
              key={`star-${book._id ?? "book"}-${index}`}
              icon={faStar}
              className={index < rating ? "text-ember" : "text-ink/15"}
            />
          ))}
          <span className="text-xs text-ink/60">
            {book.numReviews ? `${book.numReviews} reviews` : "New release"}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-ink/60">Price</p>
            <p className="text-xl font-semibold text-ink">
              {currencyFormatter.format(book.price || 0)}
            </p>
          </div>
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              inStock
                ? "bg-pine/10 text-pine"
                : "bg-ink/10 text-ink/50"
            }`}
          >
            {inStock ? "In stock" : "Out of stock"}
          </span>
        </div>

        <div className="mt-auto flex items-center gap-3">
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!inStock}
            className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition ${
              inStock
                ? "cursor-pointer bg-ink text-sand shadow-soft hover:shadow-card"
                : "cursor-not-allowed bg-ink/10 text-ink/40"
            }`}
          >
            <FontAwesomeIcon icon={faCartShopping} className="mr-2" />
            Add to Cart
          </button>
          {detailsLink ? (
              <Link
                to={detailsLink}
                className="cursor-pointer rounded-full border border-ink/15 px-4 py-2 text-sm font-semibold text-ink/70 transition hover:border-ink/40 hover:text-ink"
              >
                Details
              </Link>
          ) : null}
        </div>
      </div>
    </article>
  );
};

export default BookCard;
