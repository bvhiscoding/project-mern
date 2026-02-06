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
    <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border-2 border-neutral-200/60 bg-gradient-card shadow-soft transition-all duration-300 hover:shadow-soft-xl hover:-translate-y-2 hover:border-brand-300">
      <Link to={`/product/${product._id}`} className="relative block overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 z-10" />
        <img
          src={product.image}
          alt={product.name}
          className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
          }}
        />
        {product.featured ? (
          <span className="absolute left-4 top-4 z-20 flex items-center gap-1.5 rounded-full bg-gradient-accent px-3 py-1.5 text-xs font-bold text-white shadow-glow-accent">
            <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            Featured
          </span>
        ) : null}
        {product.stock > 0 && product.stock < 10 ? (
          <span className="absolute right-4 top-4 z-20 rounded-full bg-tomato-500 px-3 py-1.5 text-xs font-bold text-white shadow-lg">
            Only {product.stock} left!
          </span>
        ) : null}
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <Link to={`/product/${product._id}`} className="group/title">
          <h3 className="line-clamp-2 text-lg font-bold text-neutral-900 transition-colors group-hover/title:text-brand-600">
            {product.name}
          </h3>
        </Link>

        <Rating value={product.rating} numReviews={product.numReviews} />

        <p className="line-clamp-2 min-h-10 text-sm leading-relaxed text-neutral-600">
          {product.description}
        </p>

        <div className="mt-auto space-y-3 pt-2">
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold text-gradient">
              {product.price.toLocaleString()} VND
            </p>
            <span className="text-sm font-medium text-neutral-500">/{product.unit}</span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={`group/btn relative w-full overflow-hidden ${
              product.stock > 0 ? 'btn-primary' : 'btn bg-neutral-300 text-neutral-600'
            }`}
          >
            {product.stock > 0 && (
              <div className="absolute inset-0 bg-shimmer opacity-0 group-hover/btn:opacity-100" />
            )}
            <svg className="h-5 w-5 transition-transform group-hover/btn:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="relative">{product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}</span>
          </button>
        </div>
      </div>
    </article>
  );
}
