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

      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 16px' }}>
        <h1>Shopping Cart</h1>

        {items.length === 0 ? (
          <Message variant="info">
            Your cart is empty. <Link to="/products">Go to products</Link>
          </Message>
        ) : (
          <section
            style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr',
              gap: 24,
              alignItems: 'start',
            }}
          >
            <div>
              {items.map((item) => (
                <article
                  key={item.product}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '96px 1fr auto',
                    gap: 12,
                    marginBottom: 12,
                    paddingBottom: 12,
                    borderBottom: '1px solid #ddd',
                  }}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{ width: 96, height: 96, objectFit: 'cover' }}
                  />

                  <div>
                    <Link to={`/product/${item.product}`}>{item.name}</Link>
                    <p>{item.price.toLocaleString()} VND</p>
                    <label htmlFor={`qty-${item.product}`}>Qty</label>
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
                    >
                      {[...Array(10).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <p>{(item.price * item.quantity).toLocaleString()} VND</p>
                    <button onClick={() => dispatch(removeFromCart(item.product))}>Remove</button>
                  </div>
                </article>
              ))}
            </div>

            <aside style={{ border: '1px solid #ddd', padding: 16 }}>
              <h2>Summary</h2>
              <p>Total Items: {itemsCount}</p>
              <p>Total Price: {totalPrice.toLocaleString()} VND</p>
              <button onClick={handleCheckout} disabled={items.length === 0}>
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
