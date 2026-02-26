import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
  faStar,
  faCartShopping,
  faMagnifyingGlass,
  faPenNib,
  faFlask,
  faHeart,
  faDragon,
  faSkull,
  faGlobe,
  faEnvelope,
  faTrophy,
} from "@fortawesome/free-solid-svg-icons";
import Header from "../components/Header";
import Footer from "../components/Footer";
import FilterBar from "../components/FilterBar";
import BookList from "../components/BookList";
import { demoBooks } from "../data/demoData";
import { fetchBooks } from "../redux/slices/bookSlice";
import { addToCart } from "../redux/slices/cartSlice";

// ─── helpers ────────────────────────────────────────────────────────────────

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

// ─── category config ─────────────────────────────────────────────────────────

const CATEGORIES = [
  { label: "Fiction", icon: faPenNib, bg: "bg-pine/10", color: "text-pine", border: "border-pine/20" },
  { label: "Non-fiction", icon: faMagnifyingGlass, bg: "bg-ember/10", color: "text-ember", border: "border-ember/20" },
  { label: "Mystery", icon: faSkull, bg: "bg-ink/8", color: "text-ink/70", border: "border-ink/15" },
  { label: "Romance", icon: faHeart, bg: "bg-rose-50", color: "text-rose-500", border: "border-rose-200" },
  { label: "Fantasy", icon: faDragon, bg: "bg-violet-50", color: "text-violet-500", border: "border-violet-200" },
  { label: "Dystopian", icon: faGlobe, bg: "bg-sky-50", color: "text-sky-600", border: "border-sky-200" },
];

// ─── FeaturedCarousel ────────────────────────────────────────────────────────

const FeaturedCarousel = ({ books }) => {
  const [active, setActive] = useState(0);
  const dispatch = useDispatch();

  const featured = books.slice(0, 4);
  if (featured.length === 0) return null;

  const prev = () => setActive((a) => (a === 0 ? featured.length - 1 : a - 1));
  const next = () => setActive((a) => (a === featured.length - 1 ? 0 : a + 1));

  const book = featured[active];
  const inStock = Number(book.stock ?? 0) > 0;
  const rating = Math.round(book.rating || 0);

  return (
    <section className="mx-auto max-w-6xl px-4 py-14">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-ink/50">
            Featured reads
          </p>
          <h2 className="mt-2 text-2xl font-display text-ink">
            Titles worth savoring
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={prev}
            aria-label="Previous book"
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-ink/15 text-ink/70 transition hover:border-ink/40 hover:text-ink"
          >
            <FontAwesomeIcon icon={faChevronLeft} className="text-xs" />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Next book"
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-ink/15 text-ink/70 transition hover:border-ink/40 hover:text-ink"
          >
            <FontAwesomeIcon icon={faChevronRight} className="text-xs" />
          </button>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* large hero image */}
        <Link
          to={`/books/${book._id}`}
          className="group relative aspect-[3/4] overflow-hidden rounded-3xl shadow-card"
        >
          <img
            src={book.image}
            alt={book.title}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6">
            <span className="inline-flex items-center rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-ink shadow-soft">
              {book.genre}
            </span>
            <h3 className="mt-3 text-2xl font-display text-white">{book.title}</h3>
            <p className="mt-1 text-sm text-white/70">{book.author}</p>
          </div>
        </Link>

        {/* book details panel */}
        <div className="flex flex-col justify-between py-2">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-ink/50">
              {book.author}
            </p>
            <h3 className="mt-3 text-3xl font-display text-ink">{book.title}</h3>
            <p className="mt-4 text-sm leading-relaxed text-ink/70">
              {book.description}
            </p>

            <div className="mt-5 flex items-center gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <FontAwesomeIcon
                  key={i}
                  icon={faStar}
                  className={i < rating ? "text-ember" : "text-ink/15"}
                />
              ))}
              <span className="text-xs text-ink/60">
                {book.numReviews ? `${book.numReviews} reviews` : "New release"}
              </span>
            </div>

            <p className="mt-6 text-3xl font-semibold text-ink">
              {currencyFormatter.format(book.price || 0)}
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              disabled={!inStock}
              onClick={() => dispatch(addToCart({ ...book, quantity: 1 }))}
              className={`cursor-pointer rounded-full px-6 py-2.5 text-sm font-semibold shadow-soft transition hover:shadow-card ${
                inStock
                  ? "bg-ink text-sand"
                  : "cursor-not-allowed bg-ink/10 text-ink/40"
              }`}
            >
              <FontAwesomeIcon icon={faCartShopping} className="mr-2" />
              {inStock ? "Add to cart" : "Out of stock"}
            </button>
            <Link
              to={`/books/${book._id}`}
              className="cursor-pointer rounded-full border border-ink/15 px-6 py-2.5 text-sm font-semibold text-ink/70 transition hover:border-ink/40 hover:text-ink"
            >
              Read more
            </Link>
          </div>

          {/* dot indicators */}
          <div className="mt-8 flex items-center gap-2">
            {featured.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`cursor-pointer rounded-full transition-all duration-300 ${
                  i === active
                    ? "h-2 w-8 bg-ink"
                    : "h-2 w-2 bg-ink/20 hover:bg-ink/40"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// ─── CategoryGrid ─────────────────────────────────────────────────────────────

const CategoryGrid = () => (
  <section className="bg-clay/40 py-14">
    <div className="mx-auto max-w-6xl px-4">
      <div className="mb-8 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-ink/50">
          Browse by genre
        </p>
        <h2 className="mt-2 text-2xl font-display text-ink">
          Find your next favourite shelf
        </h2>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {CATEGORIES.map(({ label, icon, bg, color, border }) => (
          <Link
            key={label}
            to={`/books?genre=${encodeURIComponent(label)}`}
            className={`group cursor-pointer flex flex-col items-center gap-3 rounded-2xl border ${border} ${bg} px-4 py-6 text-center transition hover:-translate-y-1 hover:shadow-soft`}
          >
            <span
              className={`flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-soft ${color}`}
            >
              <FontAwesomeIcon icon={icon} />
            </span>
            <span className={`text-sm font-semibold ${color}`}>{label}</span>
          </Link>
        ))}
      </div>
    </div>
  </section>
);

// ─── BestsellerSection ────────────────────────────────────────────────────────

const BestsellerSection = ({ books }) => {
  const dispatch = useDispatch();
  const top = [...books]
    .sort((a, b) => (b.numReviews || 0) - (a.numReviews || 0))
    .slice(0, 4);

  if (top.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 py-14">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-ink/50">
            Reader favourites
          </p>
          <h2 className="mt-2 text-2xl font-display text-ink">
            Bestsellers this season
          </h2>
        </div>
        <Link
          to="/books"
          className="cursor-pointer text-sm font-semibold text-pine underline-offset-4 hover:underline"
        >
          View all
        </Link>
      </div>

      <div className="space-y-4">
        {top.map((book, idx) => {
          const inStock = Number(book.stock ?? 0) > 0;
          const rating = Math.round(book.rating || 0);
          return (
            <div
              key={book._id}
              className="group flex items-center gap-5 rounded-2xl border border-ink/10 bg-white p-4 shadow-soft transition hover:-translate-y-0.5 hover:shadow-card"
            >
              {/* rank badge */}
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink/5 text-sm font-semibold text-ink/50">
                {idx === 0 ? (
                  <FontAwesomeIcon icon={faTrophy} className="text-ember" />
                ) : (
                  `#${idx + 1}`
                )}
              </span>

              {/* book cover thumbnail */}
              <Link to={`/books/${book._id}`} className="shrink-0">
                <img
                  src={book.image}
                  alt={book.title}
                  className="h-16 w-12 rounded-lg object-cover shadow-soft transition duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              </Link>

              {/* info */}
              <div className="min-w-0 flex-1">
                <p className="text-xs uppercase tracking-[0.2em] text-ink/50">
                  {book.author}
                </p>
                <Link
                  to={`/books/${book._id}`}
                  className="mt-0.5 block truncate font-display text-base text-ink hover:text-pine"
                >
                  {book.title}
                </Link>
                <div className="mt-1 flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <FontAwesomeIcon
                      key={i}
                      icon={faStar}
                      className={`text-xs ${i < rating ? "text-ember" : "text-ink/15"}`}
                    />
                  ))}
                  <span className="ml-1 text-xs text-ink/50">
                    {book.numReviews} reviews
                  </span>
                </div>
              </div>

              {/* price + action */}
              <div className="flex shrink-0 items-center gap-3">
                <span className="text-base font-semibold text-ink">
                  {currencyFormatter.format(book.price || 0)}
                </span>
                <button
                  type="button"
                  disabled={!inStock}
                  onClick={() => dispatch(addToCart({ ...book, quantity: 1 }))}
                  className={`cursor-pointer rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                    inStock
                      ? "bg-ink text-sand shadow-soft hover:shadow-card"
                      : "cursor-not-allowed bg-ink/10 text-ink/40"
                  }`}
                >
                  <FontAwesomeIcon icon={faCartShopping} className="mr-1.5" />
                  {inStock ? "Add" : "Sold out"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

// ─── NewsletterSection ────────────────────────────────────────────────────────

const NewsletterSection = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) setSubmitted(true);
  };

  return (
    <section className="bg-ink py-16">
      <div className="mx-auto max-w-2xl px-4 text-center">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-sand">
          <FontAwesomeIcon icon={faEnvelope} />
        </span>
        <h2 className="mt-5 text-3xl font-display text-sand">
          Join the reading circle
        </h2>
        <p className="mt-3 text-sm text-sand/60">
          Monthly curations, author spotlights, and first access to limited
          editions — delivered quietly to your inbox.
        </p>

        {submitted ? (
          <div className="mt-8 rounded-2xl border border-pine/30 bg-pine/10 px-6 py-4 text-sm font-semibold text-pine">
            You&apos;re on the list — welcome to the circle.
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-0"
          >
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="flex-1 rounded-full rounded-b-none border border-white/10 bg-white/10 px-5 py-3 text-sm text-sand placeholder:text-sand/40 focus:outline-none focus:ring-2 focus:ring-pine sm:rounded-full sm:rounded-r-none sm:border-r-0"
            />
            <button
              type="submit"
              className="cursor-pointer rounded-full rounded-t-none bg-pine px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-pine/90 hover:shadow-card sm:rounded-full sm:rounded-l-none"
            >
              Subscribe
            </button>
          </form>
        )}

        <p className="mt-4 text-xs text-sand/40">
          No spam, unsubscribe any time. We read every reply.
        </p>
      </div>
    </section>
  );
};

// ─── HomePage ────────────────────────────────────────────────────────────────

const HomePage = () => {
  const dispatch = useDispatch();
  const [filters, setFilters] = useState({
    search: "",
    genre: "",
    minPrice: "",
    maxPrice: "",
    sort: "",
  });

  const { books = [], loading = false, error = null } = useSelector(
    (state) => state.books || {}
  );

  const shelf = books.length > 0 ? books : demoBooks;

  const filteredBooks = useMemo(() => {
    const minPrice = Number(filters.minPrice || 0);
    const maxPrice = Number(filters.maxPrice || 0);

    const result = shelf.filter((book) => {
      const searchValue = filters.search?.trim().toLowerCase();
      const matchesSearch = searchValue
        ? `${book.title} ${book.author}`.toLowerCase().includes(searchValue)
        : true;
      const matchesGenre = filters.genre ? book.genre === filters.genre : true;
      const matchesMin = minPrice ? book.price >= minPrice : true;
      const matchesMax = maxPrice ? book.price <= maxPrice : true;
      return matchesSearch && matchesGenre && matchesMin && matchesMax;
    });

    if (filters.sort === "price") {
      return [...result].sort((a, b) => a.price - b.price);
    }
    if (filters.sort === "-price") {
      return [...result].sort((a, b) => b.price - a.price);
    }

    return result;
  }, [filters, shelf]);

  const activeFilters = useMemo(() => {
    const items = [];
    if (filters.search) items.push(`Search: ${filters.search}`);
    if (filters.genre) items.push(`Genre: ${filters.genre}`);
    if (filters.minPrice) items.push(`Min $${filters.minPrice}`);
    if (filters.maxPrice) items.push(`Max $${filters.maxPrice}`);
    if (filters.sort === "price") items.push("Sort: Low to high");
    if (filters.sort === "-price") items.push("Sort: High to low");
    return items;
  }, [filters]);

  useEffect(() => {
    dispatch(fetchBooks(filters));
  }, [dispatch, filters]);

  return (
    <div className="min-h-screen bg-sand text-ink">
      <Header />

      <main>
        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden pb-8">
          <div className="pointer-events-none absolute -right-20 top-10 h-64 w-64 rounded-full bg-pine/15 blur-3xl" />
          <div className="pointer-events-none absolute -left-20 top-32 h-72 w-72 rounded-full bg-ember/10 blur-3xl" />
          <div className="mx-auto max-w-6xl px-4 py-16">
            <div className="max-w-2xl">
              <p className="text-xs uppercase tracking-[0.3em] text-ink/50">
                Curated bookstore
              </p>
              <h1 className="mt-4 font-display text-4xl text-ink md:text-5xl">
                Books that feel like a quiet ritual.
              </h1>
              <p className="mt-4 text-sm text-ink/60">
                Explore thoughtfully chosen titles, seasonal bundles, and
                artisan editions for readers who savor every page.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  to="/books"
                  className="cursor-pointer rounded-full bg-ink px-5 py-2 text-sm font-semibold text-sand shadow-soft transition hover:shadow-card"
                >
                  Shop the catalog
                </Link>
                <Link
                  to="/register"
                  className="cursor-pointer rounded-full border border-ink/15 px-5 py-2 text-sm font-semibold text-ink/70 transition hover:border-ink/40 hover:text-ink"
                >
                  Join the reading club
                </Link>
              </div>
            </div>

            <div className="mt-12 grid gap-4 md:grid-cols-3">
              {[
                { label: "Fresh arrivals", value: "32", detail: "New titles every week" },
                { label: "Member perks", value: "15%", detail: "Discount on curated sets" },
                { label: "Reader rating", value: "4.8", detail: "Across all collections" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-ink/10 bg-white/80 p-5 shadow-soft"
                >
                  <p className="text-xs uppercase tracking-[0.3em] text-ink/50">
                    {item.label}
                  </p>
                  <p className="mt-2 font-display text-2xl text-ink">{item.value}</p>
                  <p className="mt-2 text-sm text-ink/60">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Featured Carousel ─────────────────────────────────────────── */}
        <FeaturedCarousel books={shelf} />

        {/* ── Category Grid ─────────────────────────────────────────────── */}
        <CategoryGrid />

        {/* ── Bestsellers ───────────────────────────────────────────────── */}
        <BestsellerSection books={shelf} />

        {/* ── Newsletter ────────────────────────────────────────────────── */}
        <NewsletterSection />

        {/* ── Browse / Filter ───────────────────────────────────────────── */}
        <section className="mx-auto max-w-6xl px-4 pt-14">
          <div className="mb-6">
            <p className="text-xs uppercase tracking-[0.3em] text-ink/50">
              The full shelf
            </p>
            <h2 className="mt-2 text-2xl font-display text-ink">
              Editor selection
            </h2>
            <p className="mt-1 text-sm text-ink/60">
              A rotating shelf of titles with distinct voices and visual charm.
            </p>
          </div>
          <FilterBar onFilter={setFilters} initialFilters={filters} />
          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-ink/60">
            {activeFilters.length > 0 ? (
              activeFilters.map((filter) => (
                <span
                  key={filter}
                  className="rounded-full border border-ink/10 bg-white px-3 py-1"
                >
                  {filter}
                </span>
              ))
            ) : (
              <span>Use the filters to refine your shelf.</span>
            )}
          </div>
        </section>

        {error ? (
          <div className="mx-auto mt-4 max-w-6xl px-4">
            <div className="rounded-2xl border border-ember/20 bg-ember/10 p-4 text-sm text-ink">
              {error}
            </div>
          </div>
        ) : null}

        <div className="mt-8 pb-16">
          <BookList books={filteredBooks} loading={loading} />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
