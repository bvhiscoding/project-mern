import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';
import Rating from './Rating';

export default function ProductCard({ product }) {
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        product: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1,
      })
    );
  };

  return (
    <article className="card overflow-hidden transition hover:-translate-y-0.5">
      <Link to={`/product/${product._id}`} className="relative block">
        <img
          src={product.image}
          alt={product.name}
          className="h-48 w-full object-cover"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
          }}
        />
        {product.featured ? (
          <span className="absolute left-2 top-2 rounded bg-amber-500 px-2 py-1 text-xs font-semibold text-white">
            Featured
          </span>
        ) : null}
      </Link>

      <div className="space-y-2 p-4">
        <Link to={`/product/${product._id}`}>
          <h3 className="line-clamp-1 text-base font-semibold">{product.name}</h3>
        </Link>

        <Rating value={product.rating} numReviews={product.numReviews} />

        <p className="line-clamp-2 text-sm text-slate-600">{product.description}</p>

        <div className="flex items-end justify-between gap-2">
          <p>
            <span className="text-lg font-bold text-brand-700">{product.price.toLocaleString()} VND</span>{' '}
            <span className="text-sm text-slate-500">/{product.unit}</span>
          </p>
          <button onClick={handleAddToCart} disabled={product.stock === 0} className="btn-primary">
            {product.stock > 0 ? 'Add' : 'Sold out'}
          </button>
        </div>

        {product.stock > 0 && product.stock < 10 ? (
          <p className="text-xs font-medium text-rose-600">Only {product.stock} left</p>
        ) : null}
      </div>
    </article>
  );
}
