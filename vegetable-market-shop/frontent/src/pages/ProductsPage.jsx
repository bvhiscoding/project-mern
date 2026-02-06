import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { fetchProducts } from '../store/slices/productSlice';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SearchBox from '../components/SearchBox';
import ProductCard from '../components/ProductCard';
import Pagination from '../components/Pagination';
import Loader from '../components/Loader';
import Message from '../components/Message';

export default function ProductsPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const keyword = searchParams.get('keyword') || '';
  const type = searchParams.get('type') || '';
  const page = Number(searchParams.get('page')) || 1;

  const { products, loading, error, pages } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts({ keyword, type, page }));
  }, [dispatch, keyword, type, page]);

  const setTypeFilter = (nextType) => {
    const params = new URLSearchParams();
    if (keyword) params.set('keyword', keyword);
    if (nextType) params.set('type', nextType);
    params.set('page', '1');
    navigate(`/products?${params.toString()}`);
  };

  return (
    <>
      <Navbar />

      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 16px' }}>
        <h1>All Products</h1>
        <SearchBox />

        <section style={{ marginTop: 16, marginBottom: 16, display: 'flex', gap: 8 }}>
          <button onClick={() => setTypeFilter('')} disabled={!type}>
            All
          </button>
          <button onClick={() => setTypeFilter('fruit')} disabled={type === 'fruit'}>
            Fruits
          </button>
          <button onClick={() => setTypeFilter('vegetable')} disabled={type === 'vegetable'}>
            Vegetables
          </button>
        </section>

        {loading ? <Loader /> : null}
        {!loading && error ? <Message variant="error">{error}</Message> : null}
        {!loading && !error && products.length === 0 ? (
          <Message variant="info">No products found.</Message>
        ) : null}

        {!loading && !error && products.length > 0 ? (
          <>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                gap: 16,
                marginTop: 12,
              }}
            >
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
            <Pagination page={page} pages={pages} keyword={keyword} type={type} />
          </>
        ) : null}
      </main>

      <Footer />
    </>
  );
}
