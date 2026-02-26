import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClipboardList } from "@fortawesome/free-solid-svg-icons";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Loader from "../../components/Loader";
import { demoOrders, demoUser } from "../../data/demoData";
import { deliverOrder, getAllOrders } from "../../redux/slices/orderSlice";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const AdminOrdersPage = () => {
  const dispatch = useDispatch();
  const { orders: storeOrders = [], loading } = useSelector(
    (state) => state.orders || {}
  );
  const [orders, setOrders] = useState(demoOrders);
  const hasStoreOrders = storeOrders.length > 0;
  const displayedOrders = hasStoreOrders ? storeOrders : orders;

  const handleDeliver = (orderId) => {
    if (!hasStoreOrders) {
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, isDelivered: true } : order
        )
      );
    }
    dispatch(deliverOrder(orderId));
  };

  useEffect(() => {
    dispatch(getAllOrders());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-sand text-ink">
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-12">
        <p className="text-xs uppercase tracking-[0.3em] text-ink/50">Admin</p>
        <h1 className="mt-3 text-3xl font-display text-ink">Manage orders</h1>

        <div className="mt-8 overflow-hidden rounded-3xl border border-ink/10 bg-white shadow-soft">
          <div className="grid grid-cols-[1.4fr_1fr_1fr_1fr_120px] gap-4 border-b border-ink/10 px-6 py-4 text-xs uppercase tracking-[0.2em] text-ink/50">
            <span>Order</span>
            <span>Customer</span>
            <span>Total</span>
            <span>Status</span>
            <span>Action</span>
          </div>

          {loading && displayedOrders.length === 0 ? (
            <div className="flex items-center justify-center py-16">
              <Loader label="Loading orders…" />
            </div>
          ) : displayedOrders.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-16 text-ink/40">
              <FontAwesomeIcon icon={faClipboardList} className="text-4xl" />
              <p className="text-sm">No orders found.</p>
            </div>
          ) : (
            displayedOrders.map((order) => (
              <div
                key={order._id}
                className="grid grid-cols-[1.4fr_1fr_1fr_1fr_120px] items-center gap-4 border-b border-ink/5 px-6 py-4 text-sm hover:bg-clay/10 transition"
              >
                <div>
                  <p className="font-semibold text-ink">#{order._id}</p>
                  <p className="text-xs text-ink/60">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span className="text-ink/60">
                  {order.user?.name || demoUser.name}
                </span>
                <span className="font-semibold text-ink">
                  {currencyFormatter.format(order.totalPrice)}
                </span>
                <div className="flex flex-col gap-2">
                  <span
                    className={`inline-flex w-fit rounded-full px-2 py-1 text-xs font-semibold ${
                      order.isPaid
                        ? "bg-pine/10 text-pine"
                        : "bg-ink/10 text-ink/60"
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
                <button
                  type="button"
                  onClick={() => handleDeliver(order._id)}
                  disabled={order.isDelivered}
                  className="cursor-pointer rounded-full border border-ink/15 px-3 py-2 text-xs font-semibold text-ink/70 hover:border-ink/40 hover:bg-clay/20 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {order.isDelivered ? "Delivered" : "Mark delivered"}
                </button>
              </div>
            ))
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminOrdersPage;
