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
        <main className="container-page">
          <Message variant="error">{error}</Message>
        </main>
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <main className="container-page">
          <Message variant="warning">Product not found.</Message>
        </main>
      </>
    );
  }

  const maxQty = Math.min(10, Math.max(1, product.stock || 1));

  return (
    <>
      <Navbar />

      <main className="container-page space-y-8">
        <button onClick={() => navigate(-1)} className="btn-secondary">
          Back
        </button>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="card overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="h-full max-h-[500px] w-full object-cover"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/600x400?text=No+Image';
              }}
            />
          </div>

          <div className="card space-y-4 p-5">
            <h1>{product.name}</h1>
            <p className="text-sm text-slate-600">Type: {product.type}</p>
            <Rating value={product.rating} numReviews={product.numReviews} />

            <p>
              <span className="text-2xl font-bold text-brand-700">{product.price.toLocaleString()} VND</span>{' '}
              <span className="text-slate-500">/{product.unit}</span>
            </p>

            <p className="text-slate-700">{product.description}</p>

            <p className="text-sm">
              <span className="font-medium">Status: </span>
              <span className={product.stock > 0 ? 'text-emerald-700' : 'text-rose-700'}>
                {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
              </span>
            </p>

            {product.stock > 0 ? (
              <div className="flex items-center gap-3">
                <label htmlFor="qty" className="label mb-0">
                  Quantity
                </label>
                <select
                  id="qty"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="input max-w-24"
                >
                  {[...Array(maxQty).keys()].map((x) => (
                    <option key={x + 1} value={x + 1}>
                      {x + 1}
                    </option>
                  ))}
                </select>
                <button onClick={handleAddToCart} className="btn-primary">
                  Add to Cart
                </button>
              </div>
            ) : null}
          </div>
        </section>

        <section className="card p-5">
          <h2>Reviews</h2>

          <div className="mt-4 space-y-4">
            {reviews.length === 0 ? <Message variant="info">No reviews yet.</Message> : null}
            {reviews.map((review) => (
              <article key={review._id} className="rounded-lg border border-slate-200 p-3">
                <strong>{review.user?.name || 'User'}</strong>
                <p className="text-sm text-slate-500">{review.rating}/5</p>
                <p className="mt-1 text-sm">{review.comment}</p>
                <small className="text-xs text-slate-500">
                  {new Date(review.createdAt).toLocaleDateString()}
                </small>
              </article>
            ))}
          </div>

          <div className="mt-6">
            {user ? (
              <form onSubmit={handleSubmitReview} className="space-y-3">
                <h3>Write a Review</h3>
                <div>
                  <label htmlFor="rating" className="label">
                    Rating
                  </label>
                  <select
                    id="rating"
                    value={reviewRating}
                    onChange={(e) => setReviewRating(e.target.value)}
                    className="input max-w-28"
                  >
                    {[1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="comment" className="label">
                    Comment
                  </label>
                  <textarea
                    id="comment"
                    rows="4"
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    className="input"
                    required
                  />
                </div>
                <button type="submit" className="btn-primary">
                  Submit Review
                </button>
              </form>
            ) : (
              <Message variant="info">Please login to write a review.</Message>
            )}
          </div>

          {reviewMessage ? (
            <div className="mt-4">
              <Message variant="info">{reviewMessage}</Message>
            </div>
          ) : null}
        </section>
      </main>

      <Footer />
    </>
  );
}
