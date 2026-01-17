const express = require('express');
const router = express.Router();
const Watchlist = require('../models/watchList');
// GET /api/watchlist - Lấy tất cả items trong watchlist
router.get('/', async (req, res) => {
  try {
    const list = await Watchlist.find().populate('stockId');
    res.json(list);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// POST /api/watchlist - Thêm stock vào watchlist
router.post('/', async (req, res) => {
  try {
    const { stockId } = req.body;
    // Kiểm tra đã tồn tại chưa
    const exists = await Watchlist.findOne({ stockId });
    if (exists) {
      return res.status(400).json({ message: 'Already in watchlist' });
    }
    // Tạo mới
    const watchlistItem = new Watchlist({ stockId });
    await watchlistItem.save();
    // Populate và trả về
    const populatedItem = await Watchlist.findById(watchlistItem._id).populate('stockId');
    res.status(201).json({
      message: 'Added to watchlist',
      item: populatedItem
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// DELETE /api/watchlist/:id - Xóa stock khỏi watchlist
router.delete('/:id', async (req, res) => {
  try {
    const item = await Watchlist.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Watchlist item not found' });
    }
    res.json({ message: 'Removed from watchlist' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
module.exports = router;