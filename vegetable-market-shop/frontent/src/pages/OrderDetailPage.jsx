import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getOrderById } from '../store/slices/orderSlice';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Loader from '../components/Loader';
import Message from '../components/Message';

export default function OrderDetailPage() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { currentOrder, loading, error } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(getOrderById(id));
  }, [dispatch, id]);

  return (
    <>
      <Navbar />
      <main className="container-page space-y-4">
        <h1>Order Detail</h1>
        {loading ? <Loader /> : null}
        {error ? <Message variant="error">{error}</Message> : null}
        {!loading && !error && !currentOrder ? <Message variant="warning">Order not found.</Message> : null}

        {!loading && !error && currentOrder ? (
          <section className="grid gap-6 lg:grid-cols-[2fr,1fr]">
            <div className="space-y-4">
              <article className="card p-4">
                <h2>Order Info</h2>
                <p className="mt-2 text-sm">Order ID: {currentOrder._id}</p>
                <p className="text-sm">Status: {currentOrder.status}</p>
                <p className="text-sm">Paid: {currentOrder.isPaid ? 'Yes' : 'No'}</p>
                <p className="text-sm">Delivered: {currentOrder.isDelivered ? 'Yes' : 'No'}</p>
              </article>

              <article className="card p-4">
                <h2>Shipping</h2>
                <p className="mt-2 text-sm text-slate-700">
                  {currentOrder.shippingAddress?.address}, {currentOrder.shippingAddress?.city},{' '}
                  {currentOrder.shippingAddress?.postalCode}, {currentOrder.shippingAddress?.country}
                </p>
              </article>

              <article className="card p-4">
                <h2>Items</h2>
                <div className="mt-3 space-y-3">
                  {currentOrder.orderItems?.map((item) => (
                    <div key={item._id} className="grid gap-3 sm:grid-cols-[80px,1fr,auto]">
                      <img src={item.image} alt={item.name} className="h-20 w-20 rounded-md object-cover" />
                      <div>
                        <p className="font-medium text-slate-900">{item.name}</p>
                        <p className="text-sm text-slate-600">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-semibold">{Number(item.price * item.quantity).toLocaleString()} VND</p>
                    </div>
                  ))}
                </div>
              </article>
            </div>

            <aside className="card p-4 lg:sticky lg:top-24">
              <h2>Summary</h2>
              <div className="mt-3 space-y-2 text-sm text-slate-700">
                <p>Items: {Number(currentOrder.itemsPrice || 0).toLocaleString()} VND</p>
                <p>Shipping: {Number(currentOrder.shippingPrice || 0).toLocaleString()} VND</p>
                <p>Tax: {Number(currentOrder.taxPrice || 0).toLocaleString()} VND</p>
                <p className="pt-1 text-base font-semibold text-slate-900">
                  Total: {Number(currentOrder.totalPrice || 0).toLocaleString()} VND
                </p>
              </div>
            </aside>
          </section>
        ) : null}
      </main>
      <Footer />
    </>
  );
}
