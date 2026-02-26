import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Cart from "../components/Cart";
import { removeFromCart, updateCartQuantity } from "../redux/slices/cartSlice";

const CartPage = () => {
  const dispatch = useDispatch();
  const {
    cartItems = [],
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  } = useSelector((state) => state.cart || {});

  const summary = {
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  };

  const handleQuantityChange = (item, nextQuantity) => {
    dispatch(
      updateCartQuantity({
        id: item.book || item._id,
        quantity: nextQuantity,
      })
    );
  };

  const handleRemove = (item) => {
    dispatch(removeFromCart(item.book || item._id));
  };

  return (
    <div className="min-h-screen bg-sand text-ink">
      <Header />
      <main className="pb-16">
        <section className="mx-auto max-w-6xl px-4 py-12">
          <p className="text-xs uppercase tracking-[0.3em] text-ink/50">Cart</p>
          <h1 className="mt-3 text-3xl font-display text-ink">Your reading cart</h1>
          <p className="mt-2 text-sm text-ink/60">
            Review your selections before checkout.
          </p>
        </section>

        <Cart
          items={cartItems}
          summary={summary}
          onQuantityChange={handleQuantityChange}
          onRemove={handleRemove}
        />

        <div className="mx-auto mt-8 max-w-6xl px-4">
          <Link
            to="/books"
            className="inline-flex cursor-pointer items-center gap-2 text-sm font-semibold text-ink/70 transition hover:text-ink"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            Continue shopping
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CartPage;
