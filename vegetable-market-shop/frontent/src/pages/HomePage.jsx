import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchProducts } from '../store/slices/productSlice';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import Message from '../components/Message';

export default function HomePage() {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts({ page: 1 }));
  }, [dispatch]);

  const featuredProducts = products.filter((product) => product.featured);

  return (
    <>
      <Navbar />

      <main className="container-page space-y-16">
        {/* Hero Section */}
        <section className="relative overflow-hidden rounded-5xl bg-gradient-hero p-8 md:p-12 lg:p-16 shadow-soft-xl">
          {/* Decorative Elements */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-brand-400/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 left-10 h-60 w-60 rounded-full bg-accent-400/20 blur-3xl" />
          
          <div className="relative z-10 mx-auto max-w-4xl text-center">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border-2 border-brand-300 bg-white/90 px-4 py-2 shadow-soft backdrop-blur-sm">
              <svg className="h-4 w-4 text-brand-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-bold uppercase tracking-wider text-brand-700">
                100% Farm Fresh • Daily Delivery
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="mb-6 bg-gradient-to-r from-brand-600 via-brand-500 to-brand-600 bg-clip-text text-transparent animate-fade-in">
              Fresh Fruits & Vegetables
              <br />
              <span className="text-gradient-accent">Delivered Daily</span>
            </h1>

            {/* Description */}
            <p className="mb-8 text-lg leading-relaxed text-neutral-700 md:text-xl animate-slide-up">
              Premium quality produce sourced directly from local farms.
              <br className="hidden sm:block" />
              Experience the freshness delivered right to your doorstep.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4 animate-scale-in">
              <Link to="/products" className="btn-primary group">
                <svg className="h-5 w-5 transition-transform group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Shop Now
                <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              
              <Link to="/products?type=fruit" className="btn-accent group">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                </svg>
                Fresh Fruits
              </Link>

              <Link to="/products?type=vegetable" className="btn-secondary group">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
                Vegetables
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="mt-12 grid grid-cols-3 gap-6 border-t border-brand-200/50 pt-8">
              <div className="text-center">
                <div className="mb-2 text-3xl font-bold text-brand-600">500+</div>
                <div className="text-sm font-medium text-neutral-600">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="mb-2 text-3xl font-bold text-brand-600">100%</div>
                <div className="text-sm font-medium text-neutral-600">Organic Products</div>
              </div>
              <div className="text-center">
                <div className="mb-2 text-3xl font-bold text-brand-600">24/7</div>
                <div className="text-sm font-medium text-neutral-600">Fast Delivery</div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products Section */}
        <section>
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="mb-2">Featured Products</h2>
              <p className="text-neutral-600">
                Handpicked selection of the finest produce
              </p>
            </div>
            <Link
              to="/products"
              className="group flex items-center gap-2 font-semibold text-brand-600 transition-all hover:text-brand-700 hover:gap-3"
            >
              View All
              <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {loading ? <Loader /> : null}
          {!loading && error ? <Message variant="error">{error}</Message> : null}
          {!loading && !error && featuredProducts.length === 0 ? (
            <Message variant="info">No featured products yet.</Message>
          ) : null}

          {!loading && !error && featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : null}
        </section>
      </main>

      <Footer />
    </>
  );
}
