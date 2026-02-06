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

      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 16px' }}>
        <section style={{ marginBottom: 24 }}>
          <h1>Fresh Fruits and Vegetables Every Day</h1>
          <p>Healthy produce with reliable quality and fast delivery.</p>
          <div style={{ marginTop: 12, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link to="/products">View All Products</Link>
            <Link to="/products?type=fruit">Shop Fruits</Link>
            <Link to="/products?type=vegetable">Shop Vegetables</Link>
          </div>
        </section>

        <section>
          <h2>Featured Products</h2>
          {loading ? <Loader /> : null}
          {!loading && error ? <Message variant="error">{error}</Message> : null}
          {!loading && !error && featuredProducts.length === 0 ? (
            <Message variant="info">No featured products yet.</Message>
          ) : null}

          {!loading && !error && featuredProducts.length > 0 ? (
            <div
              style={{
                marginTop: 16,
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                gap: 16,
              }}
            >
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
