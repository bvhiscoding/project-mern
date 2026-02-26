import { useMemo, useState } from "react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import FilterBar from "./components/FilterBar";
import BookList from "./components/BookList";
import Cart from "./components/Cart";
import Loader from "./components/Loader";
import PrivateRoute from "./components/PrivateRoute";
import AdminRoute from "./components/AdminRoute";

const demoBooks = [
  {
    _id: "book-1",
    title: "Mornings at Ember Harbor",
    author: "Clara Winslow",
    genre: "Fiction",
    description: "A coastal drama with slow-burning secrets.",
    price: 18.0,
    image:
      "https://images.unsplash.com/photo-1455885666463-1a2f5e7f2f3a?auto=format&fit=crop&w=800&q=80",
    stock: 12,
    rating: 4.6,
    numReviews: 124,
  },
  {
    _id: "book-2",
    title: "Atlas of Quiet Cities",
    author: "Maya Holt",
    genre: "Non-fiction",
    description: "Design essays on small places with big stories.",
    price: 28.0,
    image:
      "https://images.unsplash.com/photo-1463320726281-696a485928c7?auto=format&fit=crop&w=800&q=80",
    stock: 8,
    rating: 4.2,
    numReviews: 78,
  },
  {
    _id: "book-3",
    title: "The Pine Needle Society",
    author: "Rowan Vale",
    genre: "Mystery",
    description: "A woodland mystery wrapped in folklore.",
    price: 22.0,
    image:
      "https://images.unsplash.com/photo-1455885666463-8a6d05c76c3c?auto=format&fit=crop&w=800&q=80",
    stock: 0,
    rating: 4.4,
    numReviews: 91,
  },
  {
    _id: "book-4",
    title: "Velvet and Ash",
    author: "June Castillo",
    genre: "Romance",
    description: "A romance that lingers long after the last page.",
    price: 16.0,
    image:
      "https://images.unsplash.com/photo-1455885666226-7f8a4aa5b8d9?auto=format&fit=crop&w=800&q=80",
    stock: 22,
    rating: 4.8,
    numReviews: 210,
  },
  {
    _id: "book-5",
    title: "Echoes of Tomorrow",
    author: "Theo Brenn",
    genre: "Dystopian",
    description: "A near-future saga about memory and belonging.",
    price: 19.5,
    image:
      "https://images.unsplash.com/photo-1449024540548-94f5d5a59230?auto=format&fit=crop&w=800&q=80",
    stock: 9,
    rating: 4.5,
    numReviews: 142,
  },
  {
    _id: "book-6",
    title: "Woven Skies",
    author: "Ari Lennox",
    genre: "Fantasy",
    description: "A sweeping fantasy across floating archipelagos.",
    price: 24.0,
    image:
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=800&q=80",
    stock: 14,
    rating: 4.7,
    numReviews: 156,
  },
];

const demoCartItems = [
  {
    _id: "book-1",
    book: "book-1",
    title: "Mornings at Ember Harbor",
    author: "Clara Winslow",
    price: 18.0,
    quantity: 1,
    image:
      "https://images.unsplash.com/photo-1455885666463-1a2f5e7f2f3a?auto=format&fit=crop&w=400&q=80",
  },
  {
    _id: "book-6",
    book: "book-6",
    title: "Woven Skies",
    author: "Ari Lennox",
    price: 24.0,
    quantity: 2,
    image:
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=400&q=80",
  },
];

const demoStore = configureStore({
  reducer: {
    auth: (state = { user: { name: "Avery Chen", email: "avery@inkandoak.com", isAdmin: true } }) => state,
    cart: (state = { cartItems: demoCartItems }) => state,
  },
});

const AccessPanel = ({ title, description }) => {
  return (
    <div className="mx-auto mt-10 flex max-w-3xl flex-col gap-3 rounded-3xl border border-ink/10 bg-white p-8 text-center shadow-card">
      <p className="text-xs uppercase tracking-[0.3em] text-ink/50">Access check</p>
      <h2 className="text-2xl font-display text-ink">{title}</h2>
      <p className="text-sm text-ink/60">{description}</p>
      <Link
        to="/"
        className="mx-auto mt-4 rounded-full border border-ink/15 px-5 py-2 text-sm font-semibold text-ink/70 transition hover:border-ink/40 hover:text-ink"
      >
        Back to demo
      </Link>
    </div>
  );
};

const DemoContent = () => {
  const [filters, setFilters] = useState({
    genre: "",
    minPrice: "",
    maxPrice: "",
    sort: "",
  });
  const [cartItems, setCartItems] = useState(demoCartItems);

  const filteredBooks = useMemo(() => {
    const minPrice = Number(filters.minPrice || 0);
    const maxPrice = Number(filters.maxPrice || 0);

    const result = demoBooks.filter((book) => {
      const matchesGenre = filters.genre ? book.genre === filters.genre : true;
      const matchesMin = minPrice ? book.price >= minPrice : true;
      const matchesMax = maxPrice ? book.price <= maxPrice : true;
      return matchesGenre && matchesMin && matchesMax;
    });

    if (filters.sort === "price") {
      return [...result].sort((a, b) => a.price - b.price);
    }
    if (filters.sort === "-price") {
      return [...result].sort((a, b) => b.price - a.price);
    }

    return result;
  }, [filters]);

  const activeFilters = useMemo(() => {
    const items = [];
    if (filters.genre) items.push(`Genre: ${filters.genre}`);
    if (filters.minPrice) items.push(`Min $${filters.minPrice}`);
    if (filters.maxPrice) items.push(`Max $${filters.maxPrice}`);
    if (filters.sort === "price") items.push("Sort: Low to high");
    if (filters.sort === "-price") items.push("Sort: High to low");
    return items;
  }, [filters]);

  const handleQuantityChange = (item, nextQuantity) => {
    const safeQuantity = Math.max(1, Number(nextQuantity) || 1);
    setCartItems((prev) =>
      prev.map((entry) =>
        entry._id === item._id ? { ...entry, quantity: safeQuantity } : entry
      )
    );
  };

  const handleRemove = (item) => {
    setCartItems((prev) => prev.filter((entry) => entry._id !== item._id));
  };

  return (
    <div className="min-h-screen bg-sand text-ink">
      <Header onLogout={() => {}} />

      <main className="pb-16">
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute -right-16 top-10 h-56 w-56 animate-float rounded-full bg-pine/15 blur-3xl" />
          <div className="pointer-events-none absolute -left-20 top-40 h-72 w-72 rounded-full bg-ember/15 blur-3xl" />
          <div className="mx-auto max-w-6xl px-4 py-16">
            <div className="max-w-2xl animate-fade-up">
              <p className="text-xs uppercase tracking-[0.3em] text-ink/50">
                Component showcase
              </p>
              <h1 className="mt-4 text-4xl font-display text-ink md:text-5xl">
                Build a bookstore that feels curated, calm, and confident.
              </h1>
              <p className="mt-4 text-sm text-ink/60">
                This demo page brings every Phase 9 component together with
                sample data so you can refine the UI before wiring real APIs.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  to="/private"
                  className="rounded-full bg-ink px-5 py-2 text-sm font-semibold text-sand shadow-soft transition hover:shadow-card"
                >
                  Private preview
                </Link>
                <Link
                  to="/admin-demo"
                  className="rounded-full border border-ink/15 px-5 py-2 text-sm font-semibold text-ink/70 transition hover:border-ink/40 hover:text-ink"
                >
                  Admin preview
                </Link>
              </div>
            </div>

            <div className="mt-12 grid gap-4 md:grid-cols-3">
              {[
                {
                  label: "Curated titles",
                  value: "120+",
                  detail: "Handpicked across genres",
                },
                {
                  label: "Weekly drops",
                  value: "14",
                  detail: "Fresh editions every Friday",
                },
                {
                  label: "Reader rating",
                  value: "4.8",
                  detail: "Average across reviews",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-ink/10 bg-white/80 p-5 shadow-soft"
                >
                  <p className="text-xs uppercase tracking-[0.3em] text-ink/50">
                    {item.label}
                  </p>
                  <p className="mt-2 text-2xl font-display text-ink">{item.value}</p>
                  <p className="mt-2 text-sm text-ink/60">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4">
          <FilterBar onFilter={setFilters} initialFilters={filters} />
          {activeFilters.length > 0 ? (
            <div className="mt-4 flex flex-wrap gap-2 text-xs text-ink/70">
              {activeFilters.map((filter) => (
                <span
                  key={filter}
                  className="rounded-full border border-ink/10 bg-white px-3 py-1"
                >
                  {filter}
                </span>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-xs text-ink/50">
              Apply filters to refine the list.
            </p>
          )}
        </section>

        <div className="mt-12">
          <BookList
            books={filteredBooks}
            title="Editor selection"
            description="A rotating shelf of titles with distinct voices and visual charm."
          />
        </div>

        <section className="mt-14">
          <div className="mx-auto max-w-6xl px-4">
            <div className="mb-6">
              <p className="text-xs uppercase tracking-[0.3em] text-ink/50">Cart</p>
              <h2 className="text-2xl font-display text-ink">Cart component</h2>
              <p className="mt-2 text-sm text-ink/60">
                Quantity updates and removals are wired to local demo state.
              </p>
            </div>
          </div>
          <Cart
            items={cartItems}
            onQuantityChange={handleQuantityChange}
            onRemove={handleRemove}
            onCheckout={() => {}}
          />
        </section>

        <section className="mx-auto mt-14 max-w-6xl px-4">
          <div className="rounded-3xl border border-ink/10 bg-white/80 p-6 shadow-soft">
            <p className="text-xs uppercase tracking-[0.3em] text-ink/50">Loader</p>
            <Loader label="Syncing shelves" />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

const Demo = () => {
  return (
    <Provider store={demoStore}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<DemoContent />} />
          <Route element={<PrivateRoute />}>
            <Route
              path="/private"
              element={
                <AccessPanel
                  title="Private preview"
                  description="This area is protected by the PrivateRoute component."
                />
              }
            />
          </Route>
          <Route element={<AdminRoute />}>
            <Route
              path="/admin-demo"
              element={
                <AccessPanel
                  title="Admin preview"
                  description="AdminRoute verifies admin access before rendering content."
                />
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
};

export default Demo;
