const asyncHandler = require('express-async-handler');
const Review = require('../models/Review');
const Product = require('../models/Product');

const createReview = asyncHandler(async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const productId = req.params.productId;

    const product = await Product.findById(productId);
    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    const alreadyReviewed = await Review.findOne({
      product: productId,
      user: req.user._id,
    });

    if (alreadyReviewed) {
      res.status(400);
      throw new Error('Product already reviewed');
    }

    const review = await Review.create({
      user: req.user._id,
      product: productId,
      rating,
      comment,
    });

    const reviews = await Review.find({ product: productId });
    const numReviews = reviews.length;
    const avgRating =
      numReviews === 0
        ? 0
        : reviews.reduce((sum, item) => sum + item.rating, 0) / numReviews;

    product.numReviews = numReviews;
    product.rating = Number(avgRating.toFixed(1));
    await product.save();

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const getProductReviews = asyncHandler(async (req, res) => {
  try {
    const productId = req.params.productId;
    const reviews = await Review.find({ product: productId }).populate(
      'user',
      'name avatar'
    );
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = {
  createReview,
  getProductReviews,
};
