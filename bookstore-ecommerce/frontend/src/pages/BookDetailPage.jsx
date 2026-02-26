import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faCartShopping,
  faStar,
  faStarHalfAlt,
  faUser,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarEmpty } from "@fortawesome/free-regular-svg-icons";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Loader from "../components/Loader";
import BookCard from "../components/BookCard";
import { demoBooks } from "../data/demoData";
import { fetchBookById } from "../redux/slices/bookSlice";
import { addToCart } from "../redux/slices/cartSlice";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

// ---------------------------------------------------------------------------
// Demo thumbnails: slight crop variations of the same Unsplash image
// ---------------------------------------------------------------------------
const buildThumbs = (baseUrl) => {
  const crops = [
    "faces,top",
    "faces,center",
    "faces,bottom",
    "entropy",
  ];
  return crops.map((crop) =>
    baseUrl
      .replace("fit=crop", `fit=crop&crop=${crop}`)
      .replace("w=900", "w=300")
  );
};

// ---------------------------------------------------------------------------
// Demo reviews per book
// ---------------------------------------------------------------------------
const DEMO_REVIEWS = {
  "book-1": [
    { id: 1, name: "Sarah M.", rating: 5, date: "Jan 14 2026", comment: "Absolutely loved this one. The coastal setting feels so vivid you can almost smell the salt air." },
    { id: 2, name: "Jake P.", rating: 4, date: "Dec 30 2025", comment: "Great prose and a satisfying ending. A few mid-book lulls but well worth it." },
    { id: 3, name: "Diane K.", rating: 5, date: "Dec 10 2025", comment: "Clara Winslow at her best. I read this in a single sitting." },
  ],
  "book-2": [
    { id: 1, name: "Leo N.", rating: 4, date: "Feb 01 2026", comment: "Gorgeous design writing. Every essay is a short meditation on place." },
    { id: 2, name: "Priya S.", rating: 4, date: "Jan 20 2026", comment: "Informative and beautifully illustrated. A keeper for the coffee table." },
  ],
  "book-3": [
    { id: 1, name: "Tom W.", rating: 5, date: "Jan 08 2026", comment: "The folklore woven throughout kept me completely hooked. Rowan Vale is one to watch." },
    { id: 2, name: "Amy L.", rating: 4, date: "Dec 22 2025", comment: "Atmospheric and twisty. The ending caught me totally off-guard." },
  ],
  "book-4": [
    { id: 1, name: "Rachel B.", rating: 5, date: "Feb 10 2026", comment: "The best romance I've read in years. Lush, emotional, and completely unputdownable." },
    { id: 2, name: "Chris V.", rating: 5, date: "Jan 30 2026", comment: "I don't usually read romance, but a friend insisted. I devoured it in two days." },
    { id: 3, name: "Maya T.", rating: 4, date: "Jan 12 2026", comment: "Beautiful writing. The chemistry between the leads is incredible." },
  ],
  "book-5": [
    { id: 1, name: "Dan R.", rating: 5, date: "Jan 25 2026", comment: "A haunting vision of the near future. The memory subplot is genuinely moving." },
    { id: 2, name: "Elena F.", rating: 4, date: "Jan 03 2026", comment: "Compelling world-building and a thoughtful ending. More please!" },
  ],
  "book-6": [
    { id: 1, name: "Finn O.", rating: 5, date: "Feb 15 2026", comment: "The floating archipelagos feel like nothing I've read before. Pure imagination." },
    { id: 2, name: "Nora J.", rating: 5, date: "Jan 28 2026", comment: "Epic scope but never loses the intimate character work. Ari Lennox is a talent." },
    { id: 3, name: "Sam C.", rating: 4, date: "Jan 16 2026", comment: "A fantastic debut fantasy. Can't wait for the sequel." },
  ],
};

// ---------------------------------------------------------------------------
// Star display helper
// ---------------------------------------------------------------------------
const StarDisplay = ({ rating, size = "text-sm" }) => {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return (
    <span className={`inline-flex items-center gap-0.5 text-ember ${size}`}>
      {Array.from({ length: full }).map((_, i) => (
        <FontAwesomeIcon key={`f${i}`} icon={faStar} />
      ))}
      {half && <FontAwesomeIcon icon={faStarHalfAlt} />}
      {Array.from({ length: empty }).map((_, i) => (
        <FontAwesomeIcon key={`e${i}`} icon={faStarEmpty} />
      ))}
    </span>
  );
};

// ---------------------------------------------------------------------------
// Interactive star picker
// ---------------------------------------------------------------------------
const StarPicker = ({ value, onChange }) => {
  const [hovered, setHovered] = useState(0);
  return (
    <span className="inline-flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className="cursor-pointer text-xl text-ink/20 transition-colors hover:text-ember focus:outline-none"
          style={{ color: (hovered || value) >= star ? "var(--color-ember, #d97706)" : undefined }}
        >
          <FontAwesomeIcon icon={(hovered || value) >= star ? faStar : faStarEmpty} />
        </button>
      ))}
    </span>
  );
};

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
const BookDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentBook, loading, error } = useSelector((state) => state.books || {});

  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");

  // Image gallery state
  const [activeThumb, setActiveThumb] = useState(0);

  // Review form state
  const [reviewName, setReviewName] = useState("");
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [reviewError, setReviewError] = useState("");

  // Local reviews (starts with demo data, can append)
  const [reviews, setReviews] = useState([]);

  const book = useMemo(() => {
    if (currentBook && (!id || currentBook._id === id)) return currentBook;
    if (id) return demoBooks.find((item) => item._id === id) || demoBooks[0];
    return demoBooks[0];
  }, [currentBook, id]);

  const thumbnails = useMemo(() => (book ? buildThumbs(book.image) : []), [book]);

  const relatedBooks = useMemo(
    () => (book ? demoBooks.filter((b) => b.genre === book.genre && b._id !== book._id) : []),
    [book]
  );

  useEffect(() => {
    if (id) dispatch(fetchBookById(id));
  }, [dispatch, id]);

  // Load demo reviews when book changes
  useEffect(() => {
    if (book) {
      setReviews(DEMO_REVIEWS[book._id] || []);
      setReviewSubmitted(false);
      setReviewError("");
      setReviewName("");
      setReviewRating(0);
      setReviewComment("");
      setActiveThumb(0);
    }
  }, [book?._id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-sand">
        <Header />
        <Loader label="Loading book" />
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-sand text-ink">
        <Header />
        <div className="mx-auto max-w-4xl px-4 py-16 text-center">
          <p className="text-sm text-ink/60">Book not found.</p>
          <Link
            to="/books"
            className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-full bg-ink px-5 py-2 text-sm font-semibold text-sand transition hover:bg-ink/80"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            Back to books
          </Link>
        </div>
      </div>
    );
  }

  const inStock = book.stock > 0;
  const displayRating = book.rating || 0;

  const handleQuantityChange = (nextValue) => {
    setQuantity(Math.max(1, Math.min(nextValue, book.stock || 1)));
  };

  const handleAddToCart = () => {
    setMessage("");
    dispatch(addToCart({ ...book, quantity }));
    setMessage("Added to cart. Continue browsing or proceed to checkout.");
    navigate("/cart");
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    setReviewError("");
    if (!reviewName.trim()) return setReviewError("Please enter your name.");
    if (!reviewRating) return setReviewError("Please select a star rating.");
    if (!reviewComment.trim()) return setReviewError("Please write a comment.");

    const newReview = {
      id: Date.now(),
      name: reviewName.trim(),
      rating: reviewRating,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      comment: reviewComment.trim(),
    };
    setReviews((prev) => [newReview, ...prev]);
    setReviewSubmitted(true);
    setReviewName("");
    setReviewRating(0);
    setReviewComment("");
  };

  return (
    <div className="min-h-screen bg-sand text-ink">
      <Header />

      <main className="mx-auto max-w-6xl px-4 py-10">
        {/* ── Breadcrumb ── */}
        <Link
          to="/books"
          className="inline-flex cursor-pointer items-center gap-2 text-sm font-semibold text-ink/60 transition hover:text-ink"
        >
          <FontAwesomeIcon icon={faArrowLeft} />
          Back to books
        </Link>

        {/* ── Product Section ── */}
        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_1fr] xl:grid-cols-[1.1fr_1fr]">

          {/* ── Image Gallery ── */}
          <div className="flex flex-col gap-4">
            {/* Main image */}
            <div className="group relative overflow-hidden rounded-3xl bg-white shadow-card">
              <img
                src={thumbnails[activeThumb] || book.image}
                alt={`${book.title} — view ${activeThumb + 1}`}
                className="h-[420px] w-full object-cover transition-transform duration-500 group-hover:scale-[1.02] md:h-[520px]"
              />
              {/* Prev / Next arrows */}
              {thumbnails.length > 1 && (
                <>
                  <button
                    type="button"
                    aria-label="Previous image"
                    onClick={() => setActiveThumb((p) => (p - 1 + thumbnails.length) % thumbnails.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 cursor-pointer rounded-full bg-white/80 p-2 text-ink shadow-soft transition hover:bg-white hover:shadow-card"
                  >
                    <FontAwesomeIcon icon={faChevronLeft} className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    aria-label="Next image"
                    onClick={() => setActiveThumb((p) => (p + 1) % thumbnails.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer rounded-full bg-white/80 p-2 text-ink shadow-soft transition hover:bg-white hover:shadow-card"
                  >
                    <FontAwesomeIcon icon={faChevronRight} className="h-4 w-4" />
                  </button>
                </>
              )}
              {/* Stock badge overlay */}
              {!inStock && (
                <div className="absolute inset-0 flex items-center justify-center rounded-3xl bg-ink/40 backdrop-blur-[2px]">
                  <span className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-ink">
                    Out of stock
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnails */}
            <div className="flex gap-3">
              {thumbnails.map((thumb, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`View image ${i + 1}`}
                  onClick={() => setActiveThumb(i)}
                  className={`cursor-pointer overflow-hidden rounded-xl transition-all duration-200 ${
                    activeThumb === i
                      ? "ring-2 ring-ink ring-offset-2 ring-offset-sand"
                      : "opacity-60 hover:opacity-100"
                  }`}
                >
                  <img
                    src={thumb}
                    alt={`${book.title} thumbnail ${i + 1}`}
                    className="h-16 w-16 object-cover md:h-20 md:w-20"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* ── Product Details ── */}
          <div className="space-y-6">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-ink/50">{book.genre}</p>
              <h1 className="mt-2 font-display text-3xl leading-snug text-ink md:text-4xl">
                {book.title}
              </h1>
              <p className="mt-2 text-sm text-ink/60">by {book.author}</p>
            </div>

            {/* Rating summary */}
            <div className="flex flex-wrap items-center gap-3">
              <StarDisplay rating={displayRating} size="text-base" />
              <span className="text-sm font-semibold text-ink">{displayRating.toFixed(1)}</span>
              <span className="text-sm text-ink/50">
                {book.numReviews ? `${book.numReviews} reviews` : "New release"}
              </span>
            </div>

            <p className="text-sm leading-relaxed text-ink/70">{book.description}</p>

            {/* Price + Stock */}
            <div className="flex items-center justify-between rounded-2xl border border-clay bg-white px-5 py-4">
              <div>
                <p className="text-xs text-ink/50">Price</p>
                <p className="mt-0.5 text-2xl font-semibold text-ink">
                  {currencyFormatter.format(book.price || 0)}
                </p>
              </div>
              <span
                className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                  inStock ? "bg-pine/10 text-pine" : "bg-ink/10 text-ink/40"
                }`}
              >
                {inStock ? `In stock · ${book.stock} left` : "Out of stock"}
              </span>
            </div>

            {/* Quantity + Add to cart */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-1 rounded-full border border-ink/10 bg-white px-2 py-1.5">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-ink/60 transition hover:bg-sand disabled:cursor-not-allowed disabled:opacity-30"
                >
                  −
                </button>
                <input
                  type="number"
                  min="1"
                  max={book.stock || 1}
                  value={quantity}
                  onChange={(e) => handleQuantityChange(Number(e.target.value) || 1)}
                  className="w-12 bg-transparent text-center text-sm font-semibold text-ink focus:outline-none"
                />
                <button
                  type="button"
                  aria-label="Increase quantity"
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= (book.stock || 1)}
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-ink/60 transition hover:bg-sand disabled:cursor-not-allowed disabled:opacity-30"
                >
                  +
                </button>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!inStock}
                className={`flex cursor-pointer items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition ${
                  inStock
                    ? "bg-ink text-sand shadow-soft hover:shadow-card hover:bg-ink/85"
                    : "cursor-not-allowed bg-ink/10 text-ink/40"
                }`}
              >
                <FontAwesomeIcon icon={faCartShopping} />
                Add to cart
              </button>
            </div>

            {message && (
              <div className="rounded-2xl border border-pine/20 bg-pine/10 px-4 py-3 text-sm text-ink">
                {message}
              </div>
            )}
            {error && (
              <div className="rounded-2xl border border-ember/20 bg-ember/10 px-4 py-3 text-sm text-ink">
                {error}
              </div>
            )}

            {/* Book meta strip */}
            <div className="grid grid-cols-3 gap-3 border-t border-clay pt-5">
              {[
                { label: "Genre", value: book.genre },
                { label: "Author", value: book.author },
                { label: "Format", value: "Hardcover" },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-[10px] uppercase tracking-widest text-ink/40">{label}</p>
                  <p className="mt-0.5 text-xs font-semibold text-ink">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Reviews ── */}
        <section className="mt-16" aria-labelledby="reviews-heading">
          <h2 id="reviews-heading" className="font-display text-2xl text-ink">
            Reader Reviews
            {reviews.length > 0 && (
              <span className="ml-3 text-base font-sans font-normal text-ink/40">
                ({reviews.length})
              </span>
            )}
          </h2>

          <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_380px]">
            {/* Review list */}
            <div className="space-y-5">
              {reviews.length === 0 && (
                <p className="text-sm text-ink/50">No reviews yet — be the first!</p>
              )}
              {reviews.map((rev) => (
                <article
                  key={rev.id}
                  className="rounded-2xl border border-clay bg-white px-6 py-5 shadow-soft transition hover:shadow-card"
                >
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-clay text-sm font-bold text-ink/60">
                      {rev.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="text-sm font-semibold text-ink">{rev.name}</p>
                        <time className="text-xs text-ink/40">{rev.date}</time>
                      </div>
                      <StarDisplay rating={rev.rating} size="text-xs" />
                      <p className="mt-2 text-sm leading-relaxed text-ink/70">{rev.comment}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Write a review */}
            <aside className="rounded-3xl border border-clay bg-white p-6 shadow-soft self-start">
              <h3 className="font-display text-lg text-ink">Write a Review</h3>
              {reviewSubmitted ? (
                <div className="mt-4 rounded-2xl border border-pine/20 bg-pine/10 px-4 py-3 text-sm text-ink">
                  Thanks for your review! It has been posted.{" "}
                  <button
                    type="button"
                    onClick={() => setReviewSubmitted(false)}
                    className="cursor-pointer font-semibold underline"
                  >
                    Write another
                  </button>
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit} className="mt-4 space-y-4" noValidate>
                  <div>
                    <label htmlFor="review-name" className="block text-xs font-semibold text-ink/60 mb-1.5">
                      Your name
                    </label>
                    <input
                      id="review-name"
                      type="text"
                      value={reviewName}
                      onChange={(e) => setReviewName(e.target.value)}
                      placeholder="e.g. Sarah M."
                      className="w-full rounded-xl border border-clay bg-sand px-4 py-2.5 text-sm text-ink placeholder:text-ink/30 focus:border-ink/30 focus:outline-none focus:ring-2 focus:ring-ink/10"
                    />
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-ink/60 mb-1.5">Your rating</p>
                    <StarPicker value={reviewRating} onChange={setReviewRating} />
                  </div>

                  <div>
                    <label htmlFor="review-comment" className="block text-xs font-semibold text-ink/60 mb-1.5">
                      Comment
                    </label>
                    <textarea
                      id="review-comment"
                      rows={4}
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="What did you think of this book?"
                      className="w-full resize-none rounded-xl border border-clay bg-sand px-4 py-2.5 text-sm text-ink placeholder:text-ink/30 focus:border-ink/30 focus:outline-none focus:ring-2 focus:ring-ink/10"
                    />
                  </div>

                  {reviewError && (
                    <p className="text-xs font-semibold text-red-600">{reviewError}</p>
                  )}

                  <button
                    type="submit"
                    className="w-full cursor-pointer rounded-full bg-ink px-5 py-3 text-sm font-semibold text-sand shadow-soft transition hover:bg-ink/85 hover:shadow-card"
                  >
                    Submit Review
                  </button>
                </form>
              )}
            </aside>
          </div>
        </section>

        {/* ── Related Books ── */}
        {relatedBooks.length > 0 && (
          <section className="mt-16" aria-labelledby="related-heading">
            <h2 id="related-heading" className="font-display text-2xl text-ink">
              More {book.genre}
            </h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedBooks.slice(0, 3).map((rel) => (
                <BookCard key={rel._id} book={rel} />
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default BookDetailPage;
