import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSliders,
  faXmark,
  faStar,
  faChevronDown,
  faChevronUp,
  faArrowUpWideShort,
} from "@fortawesome/free-solid-svg-icons";
import Header from "../components/Header";
import Footer from "../components/Footer";
import BookList from "../components/BookList";
import { demoBooks } from "../data/demoData";
import { fetchBooks } from "../redux/slices/bookSlice";

const GENRES = ["Fiction", "Non-fiction", "Mystery", "Romance", "Dystopian", "Fantasy"];
const SORT_OPTIONS = [
  { value: "", label: "Relevance" },
  { value: "price", label: "Price: Low to high" },
  { value: "-price", label: "Price: High to low" },
  { value: "-rating", label: "Top rated" },
  { value: "-numReviews", label: "Most reviewed" },
];

const StarRow = ({ value, onChange }) => (
  <div className="flex items-center gap-2">
    {[1, 2, 3, 4, 5].map((n) => (
      <button
        key={n}
        type="button"
        onClick={() => onChange(value === n ? 0 : n)}
        aria-label={`${n} star${n !== 1 ? "s" : ""} and above`}
        className={`transition ${n <= value ? "text-ember" : "text-ink/20 hover:text-ember/60"} cursor-pointer`}
      >
        <FontAwesomeIcon icon={faStar} className="h-4 w-4" />
      </button>
    ))}
    {value > 0 && (
      <span className="text-xs text-ink/50">{value}+ stars</span>
    )}
  </div>
);

const SidebarSection = ({ title, children, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-ink/8 py-5">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between text-sm font-semibold text-ink cursor-pointer"
      >
        {title}
        <FontAwesomeIcon
          icon={open ? faChevronUp : faChevronDown}
          className="h-3 w-3 text-ink/40"
        />
      </button>
      {open && <div className="mt-4">{children}</div>}
    </div>
  );
};

const BooksPage = () => {
  const dispatch = useDispatch();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    genre: "",
    minPrice: "",
    maxPrice: "",
    sort: "",
    minRating: 0,
    author: "",
  });

  const { books = [], loading = false, error = null } = useSelector(
    (state) => state.books || {}
  );

  const catalog = books.length > 0 ? books : demoBooks;

  const allAuthors = useMemo(
    () => [...new Set(catalog.map((b) => b.author))].sort(),
    [catalog]
  );

  const filteredBooks = useMemo(() => {
    const minPrice = Number(filters.minPrice || 0);
    const maxPrice = Number(filters.maxPrice || 0);
    const searchValue = filters.search?.trim().toLowerCase();
    const authorValue = filters.author?.trim().toLowerCase();

    const result = catalog.filter((book) => {
      const matchesSearch = searchValue
        ? `${book.title} ${book.author}`.toLowerCase().includes(searchValue)
        : true;
      const matchesGenre = filters.genre ? book.genre === filters.genre : true;
      const matchesMin = minPrice ? book.price >= minPrice : true;
      const matchesMax = maxPrice ? book.price <= maxPrice : true;
      const matchesRating = filters.minRating ? (book.rating || 0) >= filters.minRating : true;
      const matchesAuthor = authorValue
        ? book.author.toLowerCase().includes(authorValue)
        : true;
      return matchesSearch && matchesGenre && matchesMin && matchesMax && matchesRating && matchesAuthor;
    });

    if (filters.sort === "price") return [...result].sort((a, b) => a.price - b.price);
    if (filters.sort === "-price") return [...result].sort((a, b) => b.price - a.price);
    if (filters.sort === "-rating") return [...result].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    if (filters.sort === "-numReviews") return [...result].sort((a, b) => (b.numReviews || 0) - (a.numReviews || 0));
    return result;
  }, [filters, catalog]);

  useEffect(() => {
    dispatch(fetchBooks(filters));
  }, [dispatch, filters]);

  const setFilter = (key, value) => setFilters((prev) => ({ ...prev, [key]: value }));
  const resetFilters = () =>
    setFilters({ search: "", genre: "", minPrice: "", maxPrice: "", sort: "", minRating: 0, author: "" });

  const activeFilterChips = useMemo(() => {
    const chips = [];
    if (filters.search) chips.push({ label: `"${filters.search}"`, key: "search", reset: "" });
    if (filters.genre) chips.push({ label: filters.genre, key: "genre", reset: "" });
    if (filters.author) chips.push({ label: `by ${filters.author}`, key: "author", reset: "" });
    if (filters.minPrice) chips.push({ label: `From $${filters.minPrice}`, key: "minPrice", reset: "" });
    if (filters.maxPrice) chips.push({ label: `Up to $${filters.maxPrice}`, key: "maxPrice", reset: "" });
    if (filters.minRating) chips.push({ label: `${filters.minRating}+ stars`, key: "minRating", reset: 0 });
    return chips;
  }, [filters]);

  const Sidebar = () => (
    <aside className="w-full space-y-0 rounded-2xl border border-ink/8 bg-white p-6 shadow-soft">
      <div className="flex items-center justify-between pb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-ink/50">Filters</p>
        {activeFilterChips.length > 0 && (
          <button
            type="button"
            onClick={resetFilters}
            className="text-xs text-ink/40 underline hover:text-ink cursor-pointer transition"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Search */}
      <SidebarSection title="Search" defaultOpen>
        <input
          type="text"
          placeholder="Title or author…"
          value={filters.search}
          onChange={(e) => setFilter("search", e.target.value)}
          className="w-full rounded-xl border border-ink/10 bg-sand px-3 py-2 text-sm text-ink placeholder-ink/40 focus:outline-none focus:ring-2 focus:ring-ink/20"
        />
      </SidebarSection>

      {/* Genre */}
      <SidebarSection title="Genre" defaultOpen>
        <div className="space-y-2">
          {GENRES.map((g) => (
            <label key={g} className="flex cursor-pointer items-center gap-3 text-sm text-ink/70 hover:text-ink">
              <input
                type="radio"
                name="genre"
                checked={filters.genre === g}
                onChange={() => setFilter("genre", filters.genre === g ? "" : g)}
                className="accent-ink"
              />
              {g}
            </label>
          ))}
        </div>
      </SidebarSection>

      {/* Price */}
      <SidebarSection title="Price range">
        <div className="flex items-center gap-2">
          <input
            type="number"
            min="0"
            placeholder="Min"
            value={filters.minPrice}
            onChange={(e) => setFilter("minPrice", e.target.value)}
            className="w-full rounded-xl border border-ink/10 bg-sand px-3 py-2 text-sm text-ink placeholder-ink/40 focus:outline-none focus:ring-2 focus:ring-ink/20"
          />
          <span className="text-ink/30">–</span>
          <input
            type="number"
            min="0"
            placeholder="Max"
            value={filters.maxPrice}
            onChange={(e) => setFilter("maxPrice", e.target.value)}
            className="w-full rounded-xl border border-ink/10 bg-sand px-3 py-2 text-sm text-ink placeholder-ink/40 focus:outline-none focus:ring-2 focus:ring-ink/20"
          />
        </div>
      </SidebarSection>

      {/* Rating */}
      <SidebarSection title="Minimum rating">
        <StarRow value={filters.minRating} onChange={(v) => setFilter("minRating", v)} />
      </SidebarSection>

      {/* Author */}
      <SidebarSection title="Author">
        <input
          type="text"
          placeholder="Search author…"
          value={filters.author}
          onChange={(e) => setFilter("author", e.target.value)}
          className="w-full rounded-xl border border-ink/10 bg-sand px-3 py-2 text-sm text-ink placeholder-ink/40 focus:outline-none focus:ring-2 focus:ring-ink/20"
        />
        {filters.author.length === 0 && (
          <div className="mt-3 space-y-1 max-h-40 overflow-y-auto pr-1">
            {allAuthors.map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => setFilter("author", a)}
                className="block w-full rounded-lg px-2 py-1.5 text-left text-xs text-ink/60 hover:bg-sand hover:text-ink cursor-pointer transition"
              >
                {a}
              </button>
            ))}
          </div>
        )}
      </SidebarSection>
    </aside>
  );

  return (
    <div className="min-h-screen bg-sand text-ink">
      <Header />
      <main className="pb-20">
        {/* Page header */}
        <section className="mx-auto max-w-7xl px-4 pt-12">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-ink/50">Catalog</p>
              <h1 className="mt-3 font-display text-3xl text-ink md:text-4xl">
                All books, curated and ready.
              </h1>
              <p className="mt-2 text-sm text-ink/60">
                Browse the full collection, filter by mood, and find your next read.
              </p>
            </div>
            <div className="rounded-2xl border border-ink/10 bg-white/80 px-5 py-4 shadow-soft">
              <p className="text-xs uppercase tracking-[0.3em] text-ink/50">Results</p>
              <p className="mt-1 font-display text-2xl text-ink">{filteredBooks.length}</p>
              <p className="mt-0.5 text-xs text-ink/50">Books found</p>
            </div>
          </div>

          {/* Sort + mobile filter toggle */}
          <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
            {/* Active filter chips */}
            <div className="flex flex-wrap items-center gap-2">
              {activeFilterChips.length > 0 ? (
                activeFilterChips.map((chip) => (
                  <button
                    key={chip.key}
                    type="button"
                    onClick={() => setFilter(chip.key, chip.reset)}
                    className="flex items-center gap-1.5 rounded-full border border-ink/10 bg-white px-3 py-1 text-xs text-ink/70 hover:bg-ink hover:text-sand transition cursor-pointer"
                  >
                    {chip.label}
                    <FontAwesomeIcon icon={faXmark} className="h-2.5 w-2.5" />
                  </button>
                ))
              ) : (
                <span className="text-xs text-ink/40">Use filters to narrow results</span>
              )}
            </div>

            <div className="flex items-center gap-3">
              {/* Sort dropdown */}
              <div className="relative">
                <FontAwesomeIcon
                  icon={faArrowUpWideShort}
                  className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink/40"
                />
                <select
                  value={filters.sort}
                  onChange={(e) => setFilter("sort", e.target.value)}
                  className="appearance-none rounded-xl border border-ink/10 bg-white pl-8 pr-4 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-ink/20 cursor-pointer"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {/* Mobile: toggle sidebar */}
              <button
                type="button"
                onClick={() => setSidebarOpen((v) => !v)}
                className="flex items-center gap-2 rounded-xl border border-ink/10 bg-white px-4 py-2 text-sm font-semibold text-ink shadow-soft hover:shadow-card transition cursor-pointer lg:hidden"
              >
                <FontAwesomeIcon icon={faSliders} className="h-3.5 w-3.5" />
                Filters
                {activeFilterChips.length > 0 && (
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-ink text-[10px] text-sand">
                    {activeFilterChips.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </section>

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 flex lg:hidden">
            <div
              className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
              onClick={() => setSidebarOpen(false)}
            />
            <div className="relative z-50 ml-auto h-full w-80 overflow-y-auto bg-sand p-4 shadow-card">
              <div className="flex items-center justify-between pb-2">
                <p className="font-semibold text-ink">Filters</p>
                <button
                  type="button"
                  onClick={() => setSidebarOpen(false)}
                  className="h-8 w-8 rounded-full text-ink/50 hover:bg-ink/10 cursor-pointer transition"
                >
                  <FontAwesomeIcon icon={faXmark} />
                </button>
              </div>
              <Sidebar />
            </div>
          </div>
        )}

        {error && (
          <div className="mx-auto mt-6 max-w-7xl px-4">
            <div className="rounded-2xl border border-ember/20 bg-ember/10 p-4 text-sm text-ink">
              {error}
            </div>
          </div>
        )}

        {/* Content: sidebar + grid */}
        <div className="mx-auto mt-10 max-w-7xl px-4">
          <div className="flex gap-8">
            {/* Desktop sidebar */}
            <div className="hidden w-64 shrink-0 lg:block">
              <div className="sticky top-6">
                <Sidebar />
              </div>
            </div>

            {/* Book grid */}
            <div className="min-w-0 flex-1">
              <BookList
                books={filteredBooks}
                loading={loading}
                title="Full catalog"
                description="Every title in the Ink & Oak library, from cozy fiction to thoughtful non-fiction."
              />
            </div>
          </div>
        </div>

        {/* Editor bundle CTA */}
        <section className="mx-auto mt-20 max-w-7xl px-4">
          <div className="rounded-3xl border border-ink/10 bg-white p-8 shadow-soft">
            <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-ink/50">Need help choosing?</p>
                <h2 className="mt-2 font-display text-2xl text-ink">
                  Let our editors build a bundle for you.
                </h2>
                <p className="mt-2 text-sm text-ink/60">
                  Tell us your mood and we'll curate three books to match.
                </p>
              </div>
              <Link
                to="/profile"
                className="rounded-full bg-ink px-5 py-2 text-sm font-semibold text-sand shadow-soft transition hover:shadow-card cursor-pointer"
              >
                Request a bundle
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default BooksPage;
