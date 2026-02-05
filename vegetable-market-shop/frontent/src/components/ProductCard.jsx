import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';
import Rating from './Rating';

export default function ProductCard({ product }) {
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch(addToCart({
      product: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    }));
  };

  return (
    <div className="product-card">
      <Link to={`/product/${product._id}`} className="product-image-link">
        <img 
          src={product.image} 
          alt={product.name} 
          className="product-image"
          onError={(e) => e.target.src = 'https://via.placeholder.com/300x200?text=No+Image'}
        />
      </Link>
      
      {product.featured && <span className="featured-badge">Featured</span>}
      
      <div className="product-info">
        <Link to={`/product/${product._id}`} className="product-title">
          <h3>{product.name}</h3>
        </Link>
        
        <Rating value={product.rating} numReviews={product.numReviews} />
        
        <p className="product-description">{product.description}</p>
        
        <div className="product-footer">
          <div className="price-info">
            <span className="price">{product.price.toLocaleString()} VND</span>
            <span className="unit">/{product.unit}</span>
          </div>
          
          <button 
            onClick={handleAddToCart} 
            disabled={product.stock === 0}
            className={`add-to-cart-btn ${product.stock === 0 ? 'disabled' : ''}`}
          >
            {product.stock > 0 ? '🛒 Add to Cart' : 'Out of Stock'}
          </button>
        </div>
        
        <div className="stock-info">
          {product.stock > 0 && product.stock < 10 && (
            <span className="low-stock">Only {product.stock} left!</span>
          )}
        </div>
      </div>
    </div>
  );
}
