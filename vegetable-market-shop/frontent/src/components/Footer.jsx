export default function Footer() {
  return (
    <footer className="mt-12 border-t border-slate-200 bg-white">
      <div className="container-page grid gap-6 md:grid-cols-3">
        <section>
          <h3 className="text-base">Vegetable Market Shop</h3>
          <p className="mt-2 text-sm text-slate-600">
            Fresh fruits and vegetables delivered to your door.
          </p>
        </section>

        <section>
          <h3 className="text-base">Quick Links</h3>
          <ul className="mt-2 space-y-1 text-sm">
            <li>
              <a href="/about">About Us</a>
            </li>
            <li>
              <a href="/contact">Contact</a>
            </li>
            <li>
              <a href="/privacy">Privacy Policy</a>
            </li>
          </ul>
        </section>

        <section>
          <h3 className="text-base">Follow Us</h3>
          <div className="mt-2 space-y-1 text-sm text-slate-600">
            <p>Facebook</p>
            <p>Instagram</p>
            <p>Twitter</p>
          </div>
        </section>
      </div>

      <div className="border-t border-slate-200 py-4 text-center text-xs text-slate-500">
        <p>© 2026 Vegetable Market Shop. All rights reserved.</p>
      </div>
    </footer>
  );
}
