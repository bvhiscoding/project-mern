import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBoxOpen } from "@fortawesome/free-solid-svg-icons";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Loader from "../components/Loader";
import { getMyOrders } from "../redux/slices/orderSlice";
import { demoOrders } from "../data/demoData";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const OrdersPage = () => {
  const dispatch = useDispatch();
  const { orders: reduxOrders = [], loading = false, error = null } = useSelector(
    (state) => state.orders || {}
  );

  const orders = reduxOrders.length > 0 ? reduxOrders : demoOrders;

  useEffect(() => {
    dispatch(getMyOrders());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-sand text-ink">
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-12">
        <p className="text-xs uppercase tracking-[0.3em] text-ink/50">Orders</p>
        <h1 className="mt-3 text-3xl font-display text-ink">Your order history</h1>
        <p className="mt-2 text-sm text-ink/60">
          Review past purchases and track current deliveries.
        </p>

        {error ? (
          <div className="mt-6 rounded-2xl border border-ember/20 bg-ember/10 px-4 py-3 text-sm text-ink">
            {error}
          </div>
        ) : null}

        <div className="mt-8 overflow-hidden rounded-3xl border border-ink/10 bg-white shadow-soft">
          <div className="grid grid-cols-5 gap-4 border-b border-ink/10 px-6 py-4 text-xs uppercase tracking-[0.2em] text-ink/50">
            <span>Order</span>
            <span>Date</span>
            <span>Total</span>
            <span>Paid</span>
            <span>Delivered</span>
          </div>

          {loading ? (
            <div className="px-6 py-10 flex justify-center">
              <Loader label="Loading orders…" />
            </div>
          ) : orders.length === 0 ? (
            <div className="flex flex-col items-center gap-4 px-6 py-16 text-center">
              <FontAwesomeIcon
                icon={faBoxOpen}
                className="text-4xl text-ink/20"
              />
              <p className="text-base font-display text-ink/60">No orders yet</p>
              <p className="text-sm text-ink/40">
                When you place an order it will appear here.
              </p>
              <Link
                to="/books"
                className="mt-2 inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2 text-sm font-semibold text-sand cursor-pointer hover:bg-ink/90 transition"
              >
                Browse books
              </Link>
            </div>
          ) : (
            orders.map((order) => (
              <div
                key={order._id}
                className="grid grid-cols-5 items-center gap-4 border-b border-ink/5 px-6 py-4 text-sm hover:bg-clay/30 transition"
              >
                <Link
                  to={`/orders/${order._id}`}
                  className="font-semibold text-ink cursor-pointer hover:underline"
                >
                  #{order._id}
                </Link>
                <span className="text-ink/60">
                  {new Date(order.createdAt).toLocaleDateString()}
                </span>
                <span className="font-semibold text-ink">
                  {currencyFormatter.format(order.totalPrice)}
                </span>
                <span
                  className={`inline-flex w-fit rounded-full px-2 py-1 text-xs font-semibold ${
                    order.isPaid ? "bg-pine/10 text-pine" : "bg-ink/10 text-ink/60"
                  }`}
                >
                  {order.isPaid ? "Paid" : "Pending"}
                </span>
                <span
                  className={`inline-flex w-fit rounded-full px-2 py-1 text-xs font-semibold ${
                    order.isDelivered
                      ? "bg-pine/10 text-pine"
                      : "bg-ink/10 text-ink/60"
                  }`}
                >
                  {order.isDelivered ? "Delivered" : "Processing"}
                </span>
              </div>
            ))
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OrdersPage;
