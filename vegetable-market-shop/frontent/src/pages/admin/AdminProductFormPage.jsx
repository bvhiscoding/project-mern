import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import productService from '../../services/productService';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Loader from '../../components/Loader';
import Message from '../../components/Message';

export default function AdminProductFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = useMemo(() => Boolean(id), [id]);

  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    name: '',
    type: 'fruit',
    description: '',
    price: 0,
    image: '',
    stock: 0,
    category: 'General',
    unit: 'kg',
    featured: false,
  });

  useEffect(() => {
    const loadProduct = async () => {
      if (!isEditMode) return;
      try {
        setLoading(true);
        const product = await productService.getProductById(id);
        setForm({
          name: product.name || '',
          type: product.type || 'fruit',
          description: product.description || '',
          price: product.price || 0,
          image: product.image || '',
          stock: product.stock || 0,
          category: product.category || 'General',
          unit: product.unit || 'kg',
          featured: Boolean(product.featured),
        });
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id, isEditMode]);

  const onChange = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const submitHandler = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.description || !form.image) {
      setError('Please fill all required fields.');
      return;
    }

    try {
      setSubmitting(true);
      const payload = { ...form, price: Number(form.price), stock: Number(form.stock) };
      if (isEditMode) {
        await productService.updateProduct(id, payload);
      } else {
        await productService.createProduct(payload);
      }
      navigate('/admin/products');
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="container-page max-w-3xl">
        <div className="card p-6">
          <h1>{isEditMode ? 'Edit Product' : 'Add Product'}</h1>
          {loading ? <Loader /> : null}
          {error ? <Message variant="error">{error}</Message> : null}

          {!loading ? (
            <form onSubmit={submitHandler} className="mt-4 space-y-4">
              <input className="input" value={form.name} onChange={(e) => onChange('name', e.target.value)} placeholder="Name" required />

              <select className="input" value={form.type} onChange={(e) => onChange('type', e.target.value)}>
                <option value="fruit">Fruit</option>
                <option value="vegetable">Vegetable</option>
              </select>

              <textarea className="input" rows="4" value={form.description} onChange={(e) => onChange('description', e.target.value)} placeholder="Description" required />

              <input className="input" type="number" min="0" step="0.01" value={form.price} onChange={(e) => onChange('price', e.target.value)} placeholder="Price" required />
              <input className="input" value={form.image} onChange={(e) => onChange('image', e.target.value)} placeholder="Image URL" required />
              <input className="input" type="number" min="0" value={form.stock} onChange={(e) => onChange('stock', e.target.value)} placeholder="Stock" required />
              <input className="input" value={form.category} onChange={(e) => onChange('category', e.target.value)} placeholder="Category" required />
              <input className="input" value={form.unit} onChange={(e) => onChange('unit', e.target.value)} placeholder="Unit" required />

              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input type="checkbox" checked={form.featured} onChange={(e) => onChange('featured', e.target.checked)} />
                Featured product
              </label>

              <button type="submit" disabled={submitting} className="btn-primary w-full sm:w-auto">
                {submitting ? 'Saving...' : isEditMode ? 'Update Product' : 'Create Product'}
              </button>
            </form>
          ) : null}
        </div>
      </main>
      <Footer />
    </>
  );
}
