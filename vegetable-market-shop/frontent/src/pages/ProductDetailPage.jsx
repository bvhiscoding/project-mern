import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchProductById } from '../store/slices/productSlice';
import { addToCart } from '../store/slices/cartSlice';
import reviewService from '../services/reviewService';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Rating from '../components/Rating';
import Loader from '../components/Loader';
import Message from '../components/Message';

export default function ProductDetailPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const { product, loading, error } = useSelector((state) => state.products);
  const { user } = useSelector((state) => state.auth);

  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewMessage, setReviewMessage] = useState('');

  useEffect(() => {
    dispatch(fetchProductById(id));
  }, [dispatch, id]);

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const data = await reviewService.getProductReviews(id);
        setReviews(data);
      } catch (err) {
        setReviewMessage(err.response?.data?.message || err.message);
      }
    };

    loadReviews();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;

    dispatch(
      addToCart({
        product: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity,
      })
    );

    navigate('/cart');
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setReviewMessage('');

    try {
      await reviewService.createReview(id, {
        rating: Number(reviewRating),
        comment: reviewComment,
      });

      setReviewComment('');
      setReviewRating(5);
      setReviewMessage('Review submitted successfully.');

      const data = await reviewService.getProductReviews(id);
      setReviews(data);
      dispatch(fetchProductById(id));
    } catch (err) {
      setReviewMessage(err.response?.data?.message || err.message);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <Loader />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <Message variant="error">{error}</Message>
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <Message variant="warning">Product not found.</Message>
      </>
    );
  }

  const maxQty = Math.min(10, Math.max(1, product.stock || 1));

  return (
    <>
      <Navbar />

      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 16px' }}>
        <button onClick={() => navigate(-1)} style={{ marginBottom: 12 }}>
          Back
        </button>

        <section
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 24,
            marginBottom: 24,
          }}
        >
          <div>
            <img
              src={product.image}
              alt={product.name}
              style={{ width: '100%', maxHeight: 420, objectFit: 'cover' }}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/600x400?text=No+Image';
              }}
            />
          </div>

          <div>
            <h1>{product.name}</h1>
            <p>Type: {product.type}</p>
            <Rating value={product.rating} numReviews={product.numReviews} />
            <p>
              <strong>Price:</strong> {product.price.toLocaleString()} VND/{product.unit}
            </p>
            <p>{product.description}</p>
            <p>
              <strong>Status:</strong> {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
            </p>

            {product.stock > 0 ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12 }}>
                <label htmlFor="qty">Quantity</label>
                <select
                  id="qty"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                >
                  {[...Array(maxQty).keys()].map((x) => (
                    <option key={x + 1} value={x + 1}>
                      {x + 1}
                    </option>
                  ))}
                </select>
                <button onClick={handleAddToCart}>Add to Cart</button>
              </div>
            ) : null}
          </div>
        </section>

        <section>
          <h2>Reviews</h2>
          {reviews.length === 0 ? <Message variant="info">No reviews yet.</Message> : null}
          {reviews.map((review) => (
            <article key={review._id} style={{ marginBottom: 12 }}>
              <strong>{review.user?.name || 'User'}</strong>
              <p>{review.rating}/5</p>
              <p>{review.comment}</p>
              <small>{new Date(review.createdAt).toLocaleDateString()}</small>
            </article>
          ))}

          {user ? (
            <form onSubmit={handleSubmitReview} style={{ marginTop: 16 }}>
              <h3>Write a Review</h3>
              <div>
                <label htmlFor="rating">Rating</label>
                <select
                  id="rating"
                  value={reviewRating}
                  onChange={(e) => setReviewRating(e.target.value)}
                >
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>
              <div style={{ marginTop: 8 }}>
                <label htmlFor="comment">Comment</label>
                <textarea
                  id="comment"
                  rows="4"
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  required
                />
              </div>
              <button type="submit" style={{ marginTop: 8 }}>
                Submit Review
              </button>
            </form>
          ) : (
            <Message variant="info">Please login to write a review.</Message>
          )}

          {reviewMessage ? <Message variant="info">{reviewMessage}</Message> : null}
        </section>
      </main>

      <Footer />
    </>
  );
}
