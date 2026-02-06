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

      <main className="container-page">
        <h1>All Products</h1>
        <SearchBox />

        <section className="mt-5 flex flex-wrap gap-2 rounded-2xl border border-[#d4e0ca] bg-white p-2 shadow-soft">
          <button
            onClick={() => setTypeFilter('')}
            className={`btn ${!type ? 'bg-brand-600 text-white' : 'border border-[#cfdac5] bg-white text-slate-700 hover:bg-brand-50'}`}
          >
            All
          </button>
          <button
            onClick={() => setTypeFilter('fruit')}
            className={`btn ${type === 'fruit' ? 'bg-brand-600 text-white' : 'border border-[#cfdac5] bg-white text-slate-700 hover:bg-brand-50'}`}
          >
            Fruits
          </button>
          <button
            onClick={() => setTypeFilter('vegetable')}
            className={`btn ${type === 'vegetable' ? 'bg-brand-600 text-white' : 'border border-[#cfdac5] bg-white text-slate-700 hover:bg-brand-50'}`}
          >
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
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
