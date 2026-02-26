import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const CartItem = ({ item, onQuantityChange, onRemove }) => {
  if (!item) {
    return null;
  }

  const quantity = Number(item.quantity ?? item.qty ?? 1);
  const safeQuantity = Number.isNaN(quantity) || quantity <= 0 ? 1 : quantity;
  const lineTotal = (item.price || 0) * safeQuantity;
  const detailsLink = item.book || item._id ? `/books/${item.book || item._id}` : null;

  const handleChange = (nextValue) => {
    if (onQuantityChange) {
      onQuantityChange(item, nextValue);
    }
  };

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-ink/10 bg-white p-4 shadow-soft sm:flex-row sm:items-center">
      <div className="flex items-center gap-4">
        <div className="h-20 w-16 overflow-hidden rounded-xl bg-sand">
          {detailsLink ? (
            <Link to={detailsLink}>
              <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
            </Link>
          ) : (
            <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
          )}
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-ink/50">{item.author}</p>
          <p className="mt-1 text-sm font-semibold text-ink">{item.title}</p>
          <p className="text-sm text-ink/60">{currencyFormatter.format(item.price || 0)}</p>
        </div>
      </div>

      <div className="flex flex-1 flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 rounded-full border border-ink/10 bg-sand px-2 py-1">
          <button
            type="button"
            onClick={() => handleChange(Math.max(1, safeQuantity - 1))}
            disabled={safeQuantity === 1}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-ink/60 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FontAwesomeIcon icon={faMinus} />
          </button>
          <span className="w-10 text-center text-sm font-semibold text-ink">
            {safeQuantity}
          </span>
          <button
            type="button"
            onClick={() => handleChange(safeQuantity + 1)}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-ink/60 transition hover:bg-white"
          >
            <FontAwesomeIcon icon={faPlus} />
          </button>
        </div>

        <div className="text-right">
          <p className="text-xs uppercase tracking-[0.3em] text-ink/50">Subtotal</p>
          <p className="text-base font-semibold text-ink">
            {currencyFormatter.format(lineTotal)}
          </p>
        </div>

        <button
          type="button"
          onClick={() => onRemove && onRemove(item)}
          className="flex cursor-pointer items-center gap-2 rounded-full border border-ink/10 px-3 py-2 text-xs font-semibold text-ink/60 transition hover:border-ink/30 hover:text-ink"
        >
          <FontAwesomeIcon icon={faTrash} />
          Remove
        </button>
      </div>
    </div>
  );
};

export default CartItem;
