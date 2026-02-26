import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Loader from "../components/Loader";
import { demoCartItems, demoOrders, demoUser } from "../data/demoData";
import { getOrderById, payOrder } from "../redux/slices/orderSlice";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const OrderDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentOrder, loading, error } = useSelector(
    (state) => state.orders || {}
  );
  const [isPaying, setIsPaying] = useState(false);

  const order =
    currentOrder ||
    demoOrders.find((item) => item._id === id) ||
    demoOrders[0];
  const orderItems = currentOrder?.orderItems || demoCartItems;

  const shippingAddress = order.shippingAddress || {
    address: "145 Ember Street",
    city: "Portland",
    postalCode: "OR 97205",
    country: "US",
  };
  const customerName = order.user?.name || demoUser.name;
  const customerEmail = order.user?.email || demoUser.email;

  const handlePay = async () => {
    setIsPaying(true);
    await dispatch(
      payOrder({
        orderId: order._id,
        paymentResult: { status: "paid", update_time: new Date().toISOString() },
      })
    );
    setTimeout(() => setIsPaying(false), 800);
  };

  useEffect(() => {
    if (id) {
      dispatch(getOrderById(id));
    }
  }, [dispatch, id]);

  return (
    <div className="min-h-screen bg-sand text-ink">
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-12">
        <Link
          to="/orders"
          className="inline-flex items-center gap-2 text-sm font-semibold text-ink/70 hover:text-ink cursor-pointer transition"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="text-xs" />
          Back to orders
        </Link>

        {loading ? (
          <div className="mt-16 flex justify-center">
            <Loader label="Loading order…" />
          </div>
        ) : (
          <div className="mt-6 grid gap-8 lg:grid-cols-[1.3fr_1fr]">
            <section className="space-y-6">
              <div className="rounded-3xl border border-ink/10 bg-white p-6 shadow-soft">
                <h1 className="text-2xl font-display text-ink">Order #{order._id}</h1>
                <p className="mt-2 text-sm text-ink/60">
                  Placed on {new Date(order.createdAt).toLocaleDateString()}
                </p>
                <div className="mt-4 flex flex-wrap gap-3 text-xs">
                  <span
                    className={`rounded-full px-3 py-1 font-semibold ${
                      order.isPaid ? "bg-pine/10 text-pine" : "bg-ink/10 text-ink/60"
                    }`}
                  >
                    {order.isPaid ? "Paid" : "Awaiting payment"}
                  </span>
                  <span
                    className={`rounded-full px-3 py-1 font-semibold ${
                      order.isDelivered
                        ? "bg-pine/10 text-pine"
                        : "bg-ink/10 text-ink/60"
                    }`}
                  >
                    {order.isDelivered ? "Delivered" : "Processing"}
                  </span>
                </div>
              </div>

              <div className="rounded-3xl border border-ink/10 bg-white p-6 shadow-soft">
                <h2 className="text-lg font-display text-ink">Shipping</h2>
                <p className="mt-3 text-sm text-ink/60">{customerName}</p>
                <p className="text-sm text-ink/60">{customerEmail}</p>
                <p className="mt-3 text-sm text-ink/60">
                  {shippingAddress.address}, {shippingAddress.city},{" "}
                  {shippingAddress.postalCode}
                  {shippingAddress.country ? `, ${shippingAddress.country}` : ""}
                </p>
              </div>

              <div className="rounded-3xl border border-ink/10 bg-white p-6 shadow-soft">
                <h2 className="text-lg font-display text-ink">Order items</h2>
                <div className="mt-4 space-y-4">
                  {orderItems.map((item) => (
                    <div
                      key={item._id}
                      className="flex items-center gap-4"
                    >
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.title}
                          className="h-10 w-8 flex-shrink-0 rounded-lg object-cover"
                        />
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-ink">
                          {item.title}
                        </p>
                        <p className="text-xs text-ink/60">Qty {item.quantity}</p>
                      </div>
                      <p className="text-sm font-semibold text-ink">
                        {currencyFormatter.format((item.price || 0) * (item.quantity || 1))}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <aside className="h-fit rounded-3xl border border-ink/10 bg-white p-6 shadow-card">
              <h2 className="text-lg font-display text-ink">Summary</h2>
              <div className="mt-4 space-y-3 text-sm text-ink/70">
                <div className="flex items-center justify-between">
                  <span>Total</span>
                  <span className="font-semibold text-ink">
                    {currencyFormatter.format(order.totalPrice)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Payment</span>
                  <span className="text-ink/60">Card ending 4028</span>
                </div>
              </div>

              {!order.isPaid ? (
                <button
                  type="button"
                  onClick={handlePay}
                  disabled={isPaying}
                  className="mt-6 w-full rounded-full bg-ink px-5 py-3 text-sm font-semibold text-sand shadow-soft transition hover:bg-ink/90 hover:shadow-card cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isPaying ? "Processing…" : "Pay now"}
                </button>
              ) : null}

              {error ? (
                <div className="mt-4 rounded-2xl border border-ember/20 bg-ember/10 px-4 py-3 text-sm text-ink">
                  {error}
                </div>
              ) : null}
            </aside>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default OrderDetailPage;
