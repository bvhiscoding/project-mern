import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookOpen } from "@fortawesome/free-solid-svg-icons";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Loader from "../../components/Loader";
import { demoBooks } from "../../data/demoData";
import { deleteBook, fetchBooks } from "../../redux/slices/bookSlice";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const AdminBooksPage = () => {
  const dispatch = useDispatch();
  const { books: storeBooks = [], loading } = useSelector(
    (state) => state.books || {}
  );
  const [books, setBooks] = useState(demoBooks);
  const hasStoreBooks = storeBooks.length > 0;
  const displayedBooks = hasStoreBooks ? storeBooks : books;

  const handleDelete = (bookId) => {
    if (!hasStoreBooks) {
      setBooks((prev) => prev.filter((book) => book._id !== bookId));
    }
    dispatch(deleteBook(bookId));
  };

  useEffect(() => {
    dispatch(fetchBooks());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-sand text-ink">
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-12">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-ink/50">Admin</p>
            <h1 className="mt-3 text-3xl font-display text-ink">Manage books</h1>
          </div>
          <button
            type="button"
            className="cursor-pointer rounded-full bg-ink px-5 py-2 text-sm font-semibold text-sand shadow-soft transition hover:bg-ink/90 hover:shadow-card"
          >
            Create new book
          </button>
        </div>

        <div className="mt-8 overflow-hidden rounded-3xl border border-ink/10 bg-white shadow-soft">
          <div className="grid grid-cols-[2fr_1fr_1fr_1fr_120px] gap-4 border-b border-ink/10 px-6 py-4 text-xs uppercase tracking-[0.2em] text-ink/50">
            <span>Title</span>
            <span>Genre</span>
            <span>Price</span>
            <span>Stock</span>
            <span>Actions</span>
          </div>

          {loading && displayedBooks.length === 0 ? (
            <div className="flex justify-center py-12">
              <Loader label="Loading books…" />
            </div>
          ) : displayedBooks.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-16 text-ink/40">
              <FontAwesomeIcon icon={faBookOpen} className="text-4xl" />
              <p className="text-sm">No books found.</p>
            </div>
          ) : (
            displayedBooks.map((book) => (
              <div
                key={book._id}
                className="grid grid-cols-[2fr_1fr_1fr_1fr_120px] items-center gap-4 border-b border-ink/5 px-6 py-4 text-sm transition hover:bg-clay/10"
              >
                <div>
                  <p className="font-semibold text-ink">{book.title}</p>
                  <p className="text-xs text-ink/60">{book.author}</p>
                </div>
                <span className="text-ink/60">{book.genre}</span>
                <span className="font-semibold text-ink">
                  {currencyFormatter.format(book.price)}
                </span>
                <span className="text-ink/60">{book.stock}</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="cursor-pointer rounded-full border border-ink/15 px-3 py-1 text-xs font-semibold text-ink/70 transition hover:bg-clay/30 hover:border-ink/40"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(book._id)}
                    className="cursor-pointer rounded-full border border-ember/30 px-3 py-1 text-xs font-semibold text-ember transition hover:border-ember/60 hover:bg-ember/5"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminBooksPage;
