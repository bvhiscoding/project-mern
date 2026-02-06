import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { removeFromCart, updateQuantity } from '../store/slices/cartSlice';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Message from '../components/Message';

export default function CartPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { items, totalPrice, itemsCount } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  const handleCheckout = () => {
    if (!user) {
      navigate('/login?redirect=/shipping');
      return;
    }
    navigate('/shipping');
  };

  return (
    <>
      <Navbar />

      <main className="container-page">
        <h1>Shopping Cart</h1>

        {items.length === 0 ? (
          <Message variant="info">
            Your cart is empty. <Link to="/products">Go to products</Link>
          </Message>
        ) : (
          <section className="mt-4 grid items-start gap-6 lg:grid-cols-[2fr,1fr]">
            <div className="space-y-3">
              {items.map((item) => (
                <article key={item.product} className="card grid gap-3 p-3 sm:grid-cols-[96px,1fr,auto]">
                  <img src={item.image} alt={item.name} className="h-24 w-24 rounded-md object-cover" />

                  <div>
                    <Link to={`/product/${item.product}`} className="font-medium text-slate-900">
                      {item.name}
                    </Link>
                    <p className="text-sm text-slate-600">{item.price.toLocaleString()} VND</p>
                    <label htmlFor={`qty-${item.product}`} className="label mt-2">
                      Qty
                    </label>
                    <select
                      id={`qty-${item.product}`}
                      value={item.quantity}
                      onChange={(e) =>
                        dispatch(
                          updateQuantity({
                            productId: item.product,
                            quantity: Number(e.target.value),
                          })
                        )
                      }
                      className="input max-w-24"
                    >
                      {[...Array(10).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <p className="font-semibold">{(item.price * item.quantity).toLocaleString()} VND</p>
                    <button className="btn-secondary" onClick={() => dispatch(removeFromCart(item.product))}>
                      Remove
                    </button>
                  </div>
                </article>
              ))}
            </div>

            <aside className="card p-4 lg:sticky lg:top-24">
              <h2>Summary</h2>
              <div className="mt-3 space-y-2 text-sm">
                <p>Total Items: {itemsCount}</p>
                <p>
                  Total Price: <span className="font-semibold">{totalPrice.toLocaleString()} VND</span>
                </p>
              </div>
              <button onClick={handleCheckout} disabled={items.length === 0} className="btn-primary mt-4 w-full">
                Proceed to Checkout
              </button>
            </aside>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}
