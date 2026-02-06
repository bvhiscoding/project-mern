import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/authSlice';

export default function Navbar() {
  const { user } = useSelector((state) => state.auth);
  const { itemsCount } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    setMobileOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="text-lg font-bold text-slate-900">
          Veg Market
        </Link>

        <button
          className="btn-secondary md:hidden"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          Menu
        </button>

        <div className="hidden items-center gap-4 md:flex">
          <Link to="/" className="text-sm font-medium">
            Home
          </Link>
          <Link to="/products" className="text-sm font-medium">
            Products
          </Link>
          <Link to="/cart" className="relative text-sm font-medium">
            Cart
            {itemsCount > 0 ? (
              <span className="ml-2 rounded-full bg-rose-500 px-2 py-0.5 text-xs text-white">{itemsCount}</span>
            ) : null}
          </Link>

          {user ? (
            <div className="group relative">
              <button className="btn-secondary">{user.name}</button>
              <div className="invisible absolute right-0 mt-2 w-48 rounded-lg border border-slate-200 bg-white p-2 opacity-0 shadow-lg transition group-hover:visible group-hover:opacity-100">
                <Link className="block rounded px-2 py-1 text-sm hover:bg-slate-100" to="/profile">
                  Profile
                </Link>
                <Link className="block rounded px-2 py-1 text-sm hover:bg-slate-100" to="/orders">
                  My Orders
                </Link>
                {user.role === 'admin' ? (
                  <>
                    <Link className="block rounded px-2 py-1 text-sm hover:bg-slate-100" to="/admin/dashboard">
                      Dashboard
                    </Link>
                    <Link className="block rounded px-2 py-1 text-sm hover:bg-slate-100" to="/admin/products">
                      Manage Products
                    </Link>
                    <Link className="block rounded px-2 py-1 text-sm hover:bg-slate-100" to="/admin/orders">
                      Manage Orders
                    </Link>
                  </>
                ) : null}
                <button
                  onClick={handleLogout}
                  className="mt-1 block w-full rounded px-2 py-1 text-left text-sm text-rose-600 hover:bg-rose-50"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="btn-primary">
              Login
            </Link>
          )}
        </div>
      </div>

      {mobileOpen ? (
        <div className="border-t border-slate-200 px-4 py-3 md:hidden">
          <div className="flex flex-col gap-2">
            <Link to="/" onClick={() => setMobileOpen(false)}>
              Home
            </Link>
            <Link to="/products" onClick={() => setMobileOpen(false)}>
              Products
            </Link>
            <Link to="/cart" onClick={() => setMobileOpen(false)}>
              Cart {itemsCount > 0 ? `(${itemsCount})` : ''}
            </Link>
            {user ? (
              <>
                <Link to="/profile" onClick={() => setMobileOpen(false)}>
                  Profile
                </Link>
                <Link to="/orders" onClick={() => setMobileOpen(false)}>
                  My Orders
                </Link>
                {user.role === 'admin' ? (
                  <>
                    <Link to="/admin/dashboard" onClick={() => setMobileOpen(false)}>
                      Dashboard
                    </Link>
                    <Link to="/admin/products" onClick={() => setMobileOpen(false)}>
                      Manage Products
                    </Link>
                    <Link to="/admin/orders" onClick={() => setMobileOpen(false)}>
                      Manage Orders
                    </Link>
                  </>
                ) : null}
                <button onClick={handleLogout} className="text-left text-rose-600">
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" onClick={() => setMobileOpen(false)}>
                Login
              </Link>
            )}
          </div>
        </div>
      ) : null}
    </nav>
  );
}
