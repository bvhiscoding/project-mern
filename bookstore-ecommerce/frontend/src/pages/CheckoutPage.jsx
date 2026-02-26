import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { clearCart } from "../redux/slices/cartSlice";
import { createOrder } from "../redux/slices/orderSlice";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const STEPS = ["Cart", "Shipping", "Payment", "Confirm"];
const CURRENT_STEP = 2; // 0-indexed: Shipping = step index 1, but display step 2

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart?.cartItems);
  const cartTotals = useSelector((state) => state.cart || {});
  const safeCartItems = useMemo(() => cartItems || [], [cartItems]);
  const [formData, setFormData] = useState({
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [error, setError] = useState("");

  const summary = useMemo(() => {
    if (cartTotals?.totalPrice != null) {
      return {
        itemsPrice: cartTotals.itemsPrice,
        shippingPrice: cartTotals.shippingPrice,
        taxPrice: cartTotals.taxPrice,
        totalPrice: cartTotals.totalPrice,
      };
    }

    const itemsPrice = safeCartItems.reduce((sum, item) => {
      const quantity = Number(item.quantity ?? item.qty ?? 1);
      return sum + (item.price || 0) * (Number.isNaN(quantity) ? 1 : quantity);
    }, 0);
    const shippingPrice = itemsPrice > 50 ? 0 : 6.95;
    const taxPrice = itemsPrice * 0.08;
    const totalPrice = itemsPrice + shippingPrice + taxPrice;
    return { itemsPrice, shippingPrice, taxPrice, totalPrice };
  }, [safeCartItems, cartTotals]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!formData.address || !formData.city || !formData.postalCode || !formData.country) {
      setError("Please complete the shipping address.");
      return;
    }

    const orderData = {
      orderItems: cartItems,
      shippingAddress: formData,
      paymentMethod,
      ...summary,
    };

    try {
      const createdOrder = await dispatch(createOrder(orderData)).unwrap();
      dispatch(clearCart());
      navigate(`/orders/${createdOrder._id}`);
    } catch (err) {
      setError(err || "Order creation failed");
    }
  };

  useEffect(() => {
    if (safeCartItems.length === 0) {
      navigate("/cart");
    }
  }, [safeCartItems, navigate]);

  if (safeCartItems.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-sand text-ink">
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-12">
        <p className="text-xs uppercase tracking-[0.3em] text-ink/50">Checkout</p>
        <h1 className="mt-3 text-3xl font-display text-ink">Finalize your order</h1>

        {/* Step indicator */}
        <nav aria-label="Checkout progress" className="mt-8 mb-10">
          <ol className="flex items-center gap-0">
            {STEPS.map((step, idx) => {
              const isCompleted = idx < CURRENT_STEP - 1;
              const isActive = idx === CURRENT_STEP - 1;
              const isLast = idx === STEPS.length - 1;
              return (
                <li key={step} className="flex flex-1 items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={[
                        "flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition",
                        isCompleted
                          ? "bg-pine text-white"
                          : isActive
                          ? "bg-ink text-sand"
                          : "bg-clay text-ink/40",
                      ].join(" ")}
                    >
                      {isCompleted ? (
                        <FontAwesomeIcon icon={faCheck} className="h-3 w-3" />
                      ) : (
                        idx + 1
                      )}
                    </div>
                    <span
                      className={[
                        "mt-1.5 hidden text-[11px] font-medium sm:block",
                        isActive ? "text-ink" : "text-ink/40",
                      ].join(" ")}
                    >
                      {step}
                    </span>
                  </div>
                  {!isLast && (
                    <div
                      className={[
                        "mx-1 mb-5 h-px flex-1 transition sm:mx-2",
                        isCompleted ? "bg-pine" : "bg-ink/10",
                      ].join(" ")}
                    />
                  )}
                </li>
              );
            })}
          </ol>
        </nav>

        <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Shipping address */}
            <div className="rounded-3xl border border-ink/10 bg-white p-6 shadow-soft">
              <h2 className="text-lg font-display text-ink">Shipping address</h2>
              <div className="mt-4 grid gap-4">
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Street address"
                  className="rounded-2xl border border-ink/10 bg-sand px-4 py-3 text-sm text-ink shadow-sm transition focus:border-pine focus:outline-none focus:ring-2 focus:ring-pine/20"
                />
                <div className="grid gap-4 md:grid-cols-2">
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="City"
                    className="rounded-2xl border border-ink/10 bg-sand px-4 py-3 text-sm text-ink shadow-sm transition focus:border-pine focus:outline-none focus:ring-2 focus:ring-pine/20"
                  />
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    placeholder="Postal code"
                    className="rounded-2xl border border-ink/10 bg-sand px-4 py-3 text-sm text-ink shadow-sm transition focus:border-pine focus:outline-none focus:ring-2 focus:ring-pine/20"
                  />
                </div>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  placeholder="Country"
                  className="rounded-2xl border border-ink/10 bg-sand px-4 py-3 text-sm text-ink shadow-sm transition focus:border-pine focus:outline-none focus:ring-2 focus:ring-pine/20"
                />
              </div>
            </div>

            {/* Payment method */}
            <div className="rounded-3xl border border-ink/10 bg-white p-6 shadow-soft">
              <h2 className="text-lg font-display text-ink">Payment method</h2>
              <div className="mt-4 grid gap-3 text-sm text-ink/70">
                <label
                  className={[
                    "flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 transition",
                    paymentMethod === "cod"
                      ? "border-pine bg-pine/5 ring-2 ring-pine/20 text-ink"
                      : "border-ink/10 bg-sand hover:border-ink/20",
                  ].join(" ")}
                >
                  <input
                    type="radio"
                    name="payment"
                    className="accent-pine"
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")}
                  />
                  Cash on delivery
                </label>
                <label
                  className={[
                    "flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 transition",
                    paymentMethod === "card"
                      ? "border-pine bg-pine/5 ring-2 ring-pine/20 text-ink"
                      : "border-ink/10 bg-sand hover:border-ink/20",
                  ].join(" ")}
                >
                  <input
                    type="radio"
                    name="payment"
                    className="accent-pine"
                    checked={paymentMethod === "card"}
                    onChange={() => setPaymentMethod("card")}
                  />
                  Credit card
                </label>
              </div>
            </div>

            {error ? (
              <div className="rounded-2xl border border-ember/20 bg-ember/10 px-4 py-3 text-sm text-ink">
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              className="w-full cursor-pointer rounded-full bg-ink px-5 py-3 text-sm font-semibold text-sand shadow-soft transition hover:bg-ink/90 hover:shadow-card"
            >
              Place order
            </button>
          </form>

          {/* Order summary */}
          <aside className="h-fit rounded-3xl border border-ink/10 bg-white p-6 shadow-card">
            <h2 className="text-lg font-display text-ink">Order summary</h2>
            <div className="mt-4 space-y-3 text-sm text-ink/70">
              {safeCartItems.map((item) => (
                <div key={item._id} className="flex items-center gap-3">
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-10 w-8 shrink-0 rounded-lg object-cover"
                    />
                  )}
                  <span className="min-w-0 flex-1 truncate">{item.title}</span>
                  <span className="shrink-0 font-semibold text-ink">
                    {currencyFormatter.format((item.price || 0) * (item.quantity || 1))}
                  </span>
                </div>
              ))}
              <div className="h-px bg-ink/10" />
              <div className="flex items-center justify-between">
                <span>Items</span>
                <span className="font-semibold text-ink">
                  {currencyFormatter.format(summary.itemsPrice)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Shipping</span>
                <span className="font-semibold text-ink">
                  {summary.shippingPrice === 0
                    ? "Free"
                    : currencyFormatter.format(summary.shippingPrice)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Tax</span>
                <span className="font-semibold text-ink">
                  {currencyFormatter.format(summary.taxPrice)}
                </span>
              </div>
              <div className="h-px bg-ink/10" />
              <div className="flex items-center justify-between text-base font-semibold text-ink">
                <span>Total</span>
                <span>{currencyFormatter.format(summary.totalPrice)}</span>
              </div>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CheckoutPage;
