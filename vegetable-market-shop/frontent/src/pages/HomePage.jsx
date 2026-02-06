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

      <main className="container-page">
        <section className="card bg-gradient-to-br from-brand-50 to-white p-6 md:p-10">
          <h1 className="max-w-2xl">Fresh Fruits and Vegetables Every Day</h1>
          <p className="mt-3 max-w-2xl text-slate-600">
            Healthy produce with reliable quality and fast delivery.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link to="/products" className="btn-primary">
              View All Products
            </Link>
            <Link to="/products?type=fruit" className="btn-secondary">
              Shop Fruits
            </Link>
            <Link to="/products?type=vegetable" className="btn-secondary">
              Shop Vegetables
            </Link>
          </div>
        </section>

        <section className="mt-8">
          <h2>Featured Products</h2>

          {loading ? <Loader /> : null}
          {!loading && error ? <Message variant="error">{error}</Message> : null}
          {!loading && !error && featuredProducts.length === 0 ? (
            <Message variant="info">No featured products yet.</Message>
          ) : null}

          {!loading && !error && featuredProducts.length > 0 ? (
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
