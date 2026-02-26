import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookOpen } from "@fortawesome/free-solid-svg-icons";
import BookCard from "./BookCard";
import Loader from "./Loader";

const BookList = ({
  books = [],
  loading = false,
  title = "Curated shelf",
  description = "Stories chosen for their voice, depth, and staying power.",
  onAddToCart,
}) => {
  if (loading) {
    return <Loader label="Loading books" />;
  }

  return (
    <section className="mx-auto w-full max-w-6xl px-4">
      <div className="mb-8 flex flex-col gap-2">
        <p className="text-xs uppercase tracking-[0.3em] text-ink/50">Collection</p>
        <h2 className="text-2xl font-display text-ink md:text-3xl">{title}</h2>
        <p className="max-w-2xl text-sm text-ink/60">{description}</p>
      </div>

      {books.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-ink/20 bg-white/70 p-10 text-center text-ink/60">
          <FontAwesomeIcon icon={faBookOpen} className="text-3xl text-ink/40" />
          <p className="text-sm font-semibold text-ink">No books found</p>
          <p className="text-sm text-ink/60">
            Adjust your filters or check back for new arrivals.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {books.map((book) => (
            <BookCard
              key={book._id || `${book.title}-${book.author}`}
              book={book}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default BookList;
