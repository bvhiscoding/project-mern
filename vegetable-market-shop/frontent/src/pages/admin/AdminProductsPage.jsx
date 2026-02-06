import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import productService from '../../services/productService';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Loader from '../../components/Loader';
import Message from '../../components/Message';

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadProducts = async (nextPage = page) => {
    try {
      setLoading(true);
      setError('');
      const data = await productService.getProducts({ page: nextPage });
      setProducts(data.products || []);
      setPage(data.page || nextPage);
      setPages(data.pages || 1);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts(1);
  }, []);

  const deleteHandler = async (id) => {
    const ok = window.confirm('Delete this product?');
    if (!ok) return;

    try {
      await productService.deleteProduct(id);
      await loadProducts(page);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  return (
    <>
      <Navbar />
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1>Manage Products</h1>
          <Link to="/admin/products/create">Add New Product</Link>
        </div>

        {loading ? <Loader /> : null}
        {error ? <Message variant="error">{error}</Message> : null}

        {!loading && !error ? (
          <>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th align="left">Image</th>
                  <th align="left">Name</th>
                  <th align="left">Type</th>
                  <th align="left">Price</th>
                  <th align="left">Stock</th>
                  <th align="left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id} style={{ borderTop: '1px solid #ddd' }}>
                    <td>
                      <img src={product.image} alt={product.name} style={{ width: 64, height: 64, objectFit: 'cover' }} />
                    </td>
                    <td>{product.name}</td>
                    <td>{product.type}</td>
                    <td>{Number(product.price || 0).toLocaleString()} VND</td>
                    <td>{product.stock}</td>
                    <td style={{ display: 'flex', gap: 8 }}>
                      <Link to={`/admin/products/edit/${product._id}`}>Edit</Link>
                      <button onClick={() => deleteHandler(product._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
              <button onClick={() => loadProducts(page - 1)} disabled={page <= 1}>
                Previous
              </button>
              <span>
                Page {page} / {pages}
              </span>
              <button onClick={() => loadProducts(page + 1)} disabled={page >= pages}>
                Next
              </button>
            </div>
          </>
        ) : null}
      </main>
      <Footer />
    </>
  );
}
