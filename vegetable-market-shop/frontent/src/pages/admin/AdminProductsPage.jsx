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
    if (!window.confirm('Delete this product?')) return;
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
      <main className="container-page space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h1>Manage Products</h1>
          <Link to="/admin/products/create" className="btn-primary">
            Add New Product
          </Link>
        </div>

        {loading ? <Loader /> : null}
        {error ? <Message variant="error">{error}</Message> : null}

        {!loading && !error ? (
          <>
            <div className="card overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-100 text-slate-700">
                  <tr>
                    <th className="px-3 py-2 text-left">Image</th>
                    <th className="px-3 py-2 text-left">Name</th>
                    <th className="px-3 py-2 text-left">Type</th>
                    <th className="px-3 py-2 text-left">Price</th>
                    <th className="px-3 py-2 text-left">Stock</th>
                    <th className="px-3 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product._id} className="border-t border-slate-200">
                      <td className="px-3 py-2">
                        <img src={product.image} alt={product.name} className="h-14 w-14 rounded object-cover" />
                      </td>
                      <td className="px-3 py-2">{product.name}</td>
                      <td className="px-3 py-2 capitalize">{product.type}</td>
                      <td className="px-3 py-2">{Number(product.price || 0).toLocaleString()} VND</td>
                      <td className="px-3 py-2">{product.stock}</td>
                      <td className="px-3 py-2">
                        <div className="flex gap-2">
                          <Link to={`/admin/products/edit/${product._id}`} className="btn-secondary">
                            Edit
                          </Link>
                          <button onClick={() => deleteHandler(product._id)} className="btn-secondary text-rose-600">
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center gap-2">
              <button onClick={() => loadProducts(page - 1)} disabled={page <= 1} className="btn-secondary">
                Previous
              </button>
              <span className="text-sm text-slate-600">
                Page {page} / {pages}
              </span>
              <button onClick={() => loadProducts(page + 1)} disabled={page >= pages} className="btn-secondary">
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
