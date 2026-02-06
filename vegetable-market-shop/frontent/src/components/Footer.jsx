import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-[#dce6d2] bg-gradient-to-b from-white/80 to-[#f2f5ea]">
      <div className="container-page grid gap-8 md:grid-cols-3">
        <section>
          <h3 className="text-base font-bold">Vegetable Market Shop</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Fresh fruits and vegetables delivered daily with quality you can trust.
          </p>
        </section>

        <section>
          <h3 className="text-base font-bold">Quick Links</h3>
          <ul className="mt-2 space-y-1.5 text-sm">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/products">Products</Link>
            </li>
            <li>
              <Link to="/cart">Cart</Link>
            </li>
          </ul>
        </section>

        <section>
          <h3 className="text-base font-bold">Support</h3>
          <div className="mt-2 space-y-1.5 text-sm text-slate-600">
            <p>Mon - Sat: 8:00 - 20:00</p>
            <p>Email: support@vegmarket.com</p>
            <p>Phone: 0900 000 001</p>
          </div>
        </section>
      </div>

      <div className="border-t border-[#dce6d2] py-4 text-center text-xs text-slate-500">
        <p>© 2026 Vegetable Market Shop. All rights reserved.</p>
      </div>
    </footer>
  );
}
