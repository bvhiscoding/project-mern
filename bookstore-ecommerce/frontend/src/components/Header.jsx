import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRightFromBracket,
  faBars,
  faBookOpen,
  faCartShopping,
  faChevronDown,
  faCrown,
  faUserCircle,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { logout } from "../redux/slices/authSlice";

const Header = ({ onLogout }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth?.user);
  const cartItems = useSelector((state) => state.cart?.cartItems);
  const navigate = useNavigate();
  const userMenuRef = useRef(null);
  const adminMenuRef = useRef(null);

  const cartCount = useMemo(() => {
    const items = cartItems || [];
    return items.reduce((sum, item) => {
      const quantity = Number(item.quantity ?? item.qty ?? 1);
      return sum + (Number.isNaN(quantity) ? 1 : quantity);
    }, 0);
  }, [cartItems]);

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      dispatch(logout());
    }
    setMenuOpen(false);
    setActiveMenu(null);
    navigate("/login");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current?.contains(event.target)) {
        return;
      }
      if (adminMenuRef.current?.contains(event.target)) {
        return;
      }
      setActiveMenu(null);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMenu = (menuKey) => {
    setActiveMenu((current) => (current === menuKey ? null : menuKey));
  };

  const navLinkClass = ({ isActive }) =>
    `rounded-full px-4 py-2 text-sm font-semibold transition ${
      isActive
        ? "bg-ink text-sand shadow-soft"
        : "text-ink/70 hover:text-ink hover:bg-ink/10"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-ink/10 bg-sand/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link to="/" className="group flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-ink text-sand shadow-soft transition group-hover:-translate-y-0.5 group-hover:shadow-card">
            <FontAwesomeIcon icon={faBookOpen} />
          </span>
          <span className="leading-tight">
            <span className="block text-lg font-display">Ink & Oak</span>
            <span className="block text-[11px] uppercase tracking-[0.35em] text-ink/60">
              Bookstore
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-2 lg:flex">
          <NavLink to="/" className={navLinkClass}>
            Home
          </NavLink>
          <NavLink to="/books" className={navLinkClass}>
            Books
          </NavLink>
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            to="/cart"
            className="relative flex items-center gap-2 rounded-full border border-ink/10 bg-white/70 px-4 py-2 text-sm font-semibold text-ink shadow-soft transition hover:border-ink/30"
          >
            <FontAwesomeIcon icon={faCartShopping} />
            <span>Cart</span>
            {cartCount > 0 ? (
              <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-ember text-xs font-bold text-white shadow-soft">
                {cartCount}
              </span>
            ) : null}
          </Link>

          {user ? (
            <div className="flex items-center gap-3">
              <div className="relative" ref={userMenuRef}>
                <button
                  type="button"
                  onClick={() => toggleMenu("user")}
                  className="flex items-center gap-2 rounded-full border border-ink/10 bg-white/70 px-4 py-2 text-sm font-semibold text-ink shadow-soft transition hover:border-ink/30"
                  aria-expanded={activeMenu === "user"}
                >
                  <FontAwesomeIcon icon={faUserCircle} />
                  <span>{user.name}</span>
                  <FontAwesomeIcon icon={faChevronDown} className="text-xs text-ink/60" />
                </button>
                {activeMenu === "user" ? (
                  <div className="absolute right-0 mt-3 w-48 rounded-2xl border border-ink/10 bg-white p-2 shadow-card">
                    <Link
                      to="/profile"
                      onClick={() => setActiveMenu(null)}
                      className="block rounded-xl px-3 py-2 text-sm font-medium text-ink/80 transition hover:bg-ink/5"
                    >
                      Profile
                    </Link>
                    <Link
                      to="/orders"
                      onClick={() => setActiveMenu(null)}
                      className="block rounded-xl px-3 py-2 text-sm font-medium text-ink/80 transition hover:bg-ink/5"
                    >
                      My Orders
                    </Link>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-ink/80 transition hover:bg-ink/5"
                    >
                      <FontAwesomeIcon icon={faArrowRightFromBracket} />
                      Logout
                    </button>
                  </div>
                ) : null}
              </div>

              {user.isAdmin ? (
                <div className="relative" ref={adminMenuRef}>
                  <button
                    type="button"
                    onClick={() => toggleMenu("admin")}
                    className="flex items-center gap-2 rounded-full border border-ink/10 bg-ink px-4 py-2 text-sm font-semibold text-sand shadow-soft transition hover:shadow-card"
                    aria-expanded={activeMenu === "admin"}
                  >
                    <FontAwesomeIcon icon={faCrown} />
                    <span>Admin</span>
                    <FontAwesomeIcon icon={faChevronDown} className="text-xs text-sand/70" />
                  </button>
                  {activeMenu === "admin" ? (
                    <div className="absolute right-0 mt-3 w-52 rounded-2xl border border-ink/10 bg-white p-2 shadow-card">
                      <Link
                        to="/admin/books"
                        onClick={() => setActiveMenu(null)}
                        className="block rounded-xl px-3 py-2 text-sm font-medium text-ink/80 transition hover:bg-ink/5"
                      >
                        Manage Books
                      </Link>
                      <Link
                        to="/admin/orders"
                        onClick={() => setActiveMenu(null)}
                        className="block rounded-xl px-3 py-2 text-sm font-medium text-ink/80 transition hover:bg-ink/5"
                      >
                        Manage Orders
                      </Link>
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="rounded-full border border-ink/10 px-4 py-2 text-sm font-semibold text-ink/70 transition hover:border-ink/30 hover:text-ink"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="rounded-full bg-ink px-5 py-2 text-sm font-semibold text-sand shadow-soft transition hover:shadow-card"
              >
                Create Account
              </Link>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 lg:hidden">
          <Link
            to="/cart"
            className="relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-ink/10 bg-white/80 text-ink transition hover:border-ink/30"
          >
            <FontAwesomeIcon icon={faCartShopping} />
            {cartCount > 0 ? (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-ember text-[10px] font-bold text-white">
                {cartCount}
              </span>
            ) : null}
          </Link>
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-ink/10 bg-white/80 text-ink"
            aria-label="Toggle menu"
          >
            <FontAwesomeIcon icon={menuOpen ? faXmark : faBars} />
          </button>
        </div>
      </div>

      {menuOpen ? (
        <div className="border-t border-ink/10 bg-sand/95 backdrop-blur lg:hidden">
          <div className="mx-auto grid max-w-6xl gap-4 px-4 py-4">
            <NavLink to="/" className={navLinkClass} onClick={() => setMenuOpen(false)}>
              Home
            </NavLink>
            <NavLink to="/books" className={navLinkClass} onClick={() => setMenuOpen(false)}>
              Books
            </NavLink>

            {user ? (
              <div className="rounded-2xl border border-ink/10 bg-white p-3 shadow-soft">
                <p className="text-sm font-semibold text-ink">{user.name}</p>
                <div className="mt-3 grid gap-2">
                  <Link
                    to="/profile"
                    className="rounded-xl px-3 py-2 text-sm font-medium text-ink/70 transition hover:bg-ink/5"
                    onClick={() => setMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    to="/orders"
                    className="rounded-xl px-3 py-2 text-sm font-medium text-ink/70 transition hover:bg-ink/5"
                    onClick={() => setMenuOpen(false)}
                  >
                    My Orders
                  </Link>
                  {user.isAdmin ? (
                    <div className="rounded-xl border border-ink/10 bg-sand px-3 py-2">
                      <p className="text-xs uppercase tracking-[0.2em] text-ink/50">Admin</p>
                      <div className="mt-2 grid gap-2">
                        <Link
                          to="/admin/books"
                          className="rounded-lg px-2 py-1 text-sm font-medium text-ink/70 transition hover:bg-ink/5"
                          onClick={() => setMenuOpen(false)}
                        >
                          Manage Books
                        </Link>
                        <Link
                          to="/admin/orders"
                          className="rounded-lg px-2 py-1 text-sm font-medium text-ink/70 transition hover:bg-ink/5"
                          onClick={() => setMenuOpen(false)}
                        >
                          Manage Orders
                        </Link>
                      </div>
                    </div>
                  ) : null}
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex cursor-pointer items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-ink/70 transition hover:bg-ink/5"
                  >
                    <FontAwesomeIcon icon={faArrowRightFromBracket} />
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid gap-2">
                <Link
                  to="/login"
                  className="rounded-full border border-ink/10 px-4 py-2 text-sm font-semibold text-ink/70 transition hover:border-ink/30 hover:text-ink"
                  onClick={() => setMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-sand shadow-soft transition hover:shadow-card"
                  onClick={() => setMenuOpen(false)}
                >
                  Create Account
                </Link>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </header>
  );
};

export default Header;
