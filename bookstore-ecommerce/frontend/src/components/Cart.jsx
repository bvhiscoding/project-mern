import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faCartShopping } from "@fortawesome/free-solid-svg-icons";
import CartItem from "./CartItem";
import { removeFromCart, updateCartQuantity } from "../redux/slices/cartSlice";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const Cart = ({
  items,
  summary,
  onRemove,
  onQuantityChange,
  onCheckout,
}) => {
  const dispatch = useDispatch();
  const cartState = useSelector((state) => state.cart);
  const cartItems = cartState?.cartItems || [];
  const resolvedItems = items || cartItems;
  const navigate = useNavigate();

  const { itemsPrice, shippingPrice, taxPrice, totalPrice } = useMemo(() => {
    if (summary) {
      return summary;
    }

    if (cartState) {
      return {
        itemsPrice: cartState.itemsPrice,
        shippingPrice: cartState.shippingPrice,
        taxPrice: cartState.taxPrice,
        totalPrice: cartState.totalPrice,
      };
    }

    const computedItemsPrice = resolvedItems.reduce((sum, item) => {
      const quantity = Number(item.quantity ?? item.qty ?? 1);
      const safeQuantity = Number.isNaN(quantity) ? 1 : quantity;
      return sum + (item.price || 0) * safeQuantity;
    }, 0);

    const computedShipping = computedItemsPrice > 50 ? 0 : 6.95;
    const computedTax = computedItemsPrice * 0.08;
    const computedTotal = computedItemsPrice + computedShipping + computedTax;

    return {
      itemsPrice: computedItemsPrice,
      shippingPrice: computedShipping,
      taxPrice: computedTax,
      totalPrice: computedTotal,
    };
  }, [resolvedItems, summary, cartState]);

  const handleCheckout = () => {
    if (onCheckout) {
      onCheckout();
    } else {
      navigate("/checkout");
    }
  };

  const handleRemove = (item) => {
    if (onRemove) {
      onRemove(item);
      return;
    }
    dispatch(removeFromCart(item.book || item._id));
  };

  const handleQuantityChange = (item, quantity) => {
    if (onQuantityChange) {
      onQuantityChange(item, quantity);
      return;
    }
    dispatch(updateCartQuantity({ id: item.book || item._id, quantity }));
  };

  if (resolvedItems.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-3xl border border-dashed border-ink/20 bg-white/80 p-10 text-center text-ink/60">
        <FontAwesomeIcon icon={faCartShopping} className="text-3xl text-ink/40" />
        <p className="text-sm font-semibold text-ink">Your cart is empty</p>
        <p className="text-sm text-ink/60">Explore the catalog to add books.</p>
        <Link
          to="/books"
          className="cursor-pointer rounded-full bg-ink px-5 py-2 text-sm font-semibold text-sand shadow-soft transition hover:bg-ink/80"
        >
          Browse books
        </Link>
      </div>
    );
  }

  return (
    <section className="mx-auto grid w-full max-w-6xl gap-6 px-4 lg:grid-cols-[2fr_1fr]">
      <div className="flex flex-col gap-4">
        {resolvedItems.map((item) => (
          <CartItem
            key={item.book || item._id || item.title}
            item={item}
            onRemove={handleRemove}
            onQuantityChange={handleQuantityChange}
          />
        ))}
      </div>

      <aside className="h-fit rounded-3xl border border-ink/10 bg-white p-6 shadow-card">
        <h3 className="text-lg font-display text-ink">Order Summary</h3>
        <div className="mt-4 space-y-3 text-sm text-ink/70">
          <div className="flex items-center justify-between">
            <span>Items</span>
            <span className="font-semibold text-ink">
              {currencyFormatter.format(itemsPrice || 0)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span>Shipping</span>
            <span className="font-semibold text-ink">
              {currencyFormatter.format(shippingPrice || 0)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span>Tax</span>
            <span className="font-semibold text-ink">
              {currencyFormatter.format(taxPrice || 0)}
            </span>
          </div>
          <div className="h-px bg-ink/10" />
          <div className="flex items-center justify-between text-base font-semibold text-ink">
            <span>Total</span>
            <span>{currencyFormatter.format(totalPrice || 0)}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleCheckout}
          className="mt-6 flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-sand shadow-soft transition hover:bg-ink/90 hover:shadow-card"
        >
          Proceed to checkout
          <FontAwesomeIcon icon={faArrowRight} />
        </button>
        <p className="mt-3 text-xs text-ink/50">
          Free shipping on orders over $50.
        </p>
      </aside>
    </section>
  );
};

export default Cart;
