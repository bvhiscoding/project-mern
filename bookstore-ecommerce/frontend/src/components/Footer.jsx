import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="mt-16 bg-ink text-sand bg-grain [background-size:14px_14px]">
      <div className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-sand/60">
              Ink & Oak
            </p>
            <h2 className="mt-3 text-2xl font-display text-sand">
              Stories curated for modern readers.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-sand/70">
              Discover handpicked titles, artisan editions, and thoughtful
              collections that turn everyday reading into a ritual.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold text-sand">Shop</p>
            <ul className="mt-4 space-y-2 text-sm text-sand/70">
              <li>
                <Link to="/books" className="transition hover:text-sand">
                  New arrivals
                </Link>
              </li>
              <li>
                <Link to="/books" className="transition hover:text-sand">
                  Bestsellers
                </Link>
              </li>
              <li>
                <Link to="/books" className="transition hover:text-sand">
                  Staff picks
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-sand">Company</p>
            <ul className="mt-4 space-y-2 text-sm text-sand/70">
              <li>
                <Link to="/" className="transition hover:text-sand">
                  About
                </Link>
              </li>
              <li>
                <Link to="/" className="transition hover:text-sand">
                  Journal
                </Link>
              </li>
              <li>
                <Link to="/" className="transition hover:text-sand">
                  Partnerships
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-sand">Help</p>
            <ul className="mt-4 space-y-2 text-sm text-sand/70">
              <li>
                <Link to="/" className="transition hover:text-sand">
                  Shipping & returns
                </Link>
              </li>
              <li>
                <Link to="/" className="transition hover:text-sand">
                  Contact us
                </Link>
              </li>
              <li>
                <Link to="/" className="transition hover:text-sand">
                  Order status
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-sand/10 pt-6 text-xs text-sand/60 md:flex-row md:items-center">
          <p>Copyright 2026 Ink & Oak. All rights reserved.</p>
          <p>Crafted for readers who linger.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
